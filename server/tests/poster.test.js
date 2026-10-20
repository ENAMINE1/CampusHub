// Poster upload (FR-2.5): owners only, JPEG/PNG/WebP only (MIME and extension), 2 MB max.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import {
  authHeaderFor,
  createClub,
  createUserWithAuth,
  validEventBody,
} from './helpers.js';

const api = request(app);
// The 8 bytes every PNG file starts with, plus a little padding: enough for an upload test.
const fakePng = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  Buffer.alloc(64),
]);
let lead;
let eventUrl;

beforeAll(async () => {
  lead = await createUserWithAuth('clubAdmin');
  const clubId = await createClub([lead.user]);
  const res = await api
    .post('/api/v1/events')
    .set('Authorization', lead.auth)
    .send(validEventBody({ club: clubId }));
  eventUrl = `/api/v1/events/${res.body.id}`;
});

const upload = (auth, buffer, filename, contentType) =>
  api
    .post(`${eventUrl}/poster`)
    .set('Authorization', auth)
    .attach('poster', buffer, { filename, contentType });

describe('POST /api/v1/events/:id/poster', () => {
  it('saves a PNG under a random name and the image is served', async () => {
    const res = await upload(lead.auth, fakePng, 'my poster.png', 'image/png');
    expect(res.status).toBe(200);
    expect(res.body.posterUrl).toMatch(/^\/uploads\/[0-9a-f-]{36}\.png$/);

    const image = await api.get(res.body.posterUrl);
    expect(image.status).toBe(200);
    expect(image.headers['cross-origin-resource-policy']).toBe('cross-origin');
  });

  it('rejects a file whose MIME type and extension do not match an image', async () => {
    const res = await upload(lead.auth, Buffer.from('hello'), 'notes.txt', 'text/plain');
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVALID_FILE');

    const renamed = await upload(
      lead.auth,
      Buffer.from('hello'),
      'notes.png',
      'text/plain',
    );
    expect(renamed.status).toBe(422);
  });

  it('rejects files over 2 MB', async () => {
    const big = Buffer.alloc(2 * 1024 * 1024 + 1);
    const res = await upload(lead.auth, big, 'big.png', 'image/png');
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('FILE_TOO_LARGE');
  });

  it('needs the poster field', async () => {
    const res = await api.post(`${eventUrl}/poster`).set('Authorization', lead.auth);
    expect(res.status).toBe(422);
  });

  it('403 for a club admin of another club', async () => {
    const other = await authHeaderFor('clubAdmin');
    expect((await upload(other, fakePng, 'p.png', 'image/png')).status).toBe(403);
  });
});
