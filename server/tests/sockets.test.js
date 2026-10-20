// Live seats: a browser in an event's room hears event:seats after a registration and a cancel.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import http from 'node:http';
import request from 'supertest';
import { io as connect } from 'socket.io-client';
import app from '../src/app.js';
import { attachSockets } from '../src/sockets/seats.js';
import { authHeaderFor, createClub, validEventBody } from './helpers.js';

let httpServer;
let socket;
let eventId;
const api = request(app);

beforeAll(async () => {
  httpServer = http.createServer(app);
  attachSockets(httpServer, 'http://localhost:5173');
  await new Promise((resolve) => httpServer.listen(0, resolve)); // 0 = any free port
  socket = connect(`http://localhost:${httpServer.address().port}`);
  await new Promise((resolve) => socket.on('connect', resolve));

  const admin = await authHeaderFor('admin');
  const res = await api
    .post('/api/v1/events')
    .set('Authorization', admin)
    .send(validEventBody({ club: await createClub(), capacity: 5 }));
  eventId = res.body.id;
  await socket.emitWithAck('event:join', eventId); // wait until the server put us in the room
});

afterAll(async () => {
  socket.disconnect();
  await new Promise((resolve) => httpServer.close(resolve));
});

const nextSeatsMessage = () =>
  new Promise((resolve) => socket.once('event:seats', resolve));

describe('event:seats', () => {
  it('is sent to the room after registering and after cancelling', async () => {
    const student = await authHeaderFor('student');
    const url = `/api/v1/events/${eventId}/registrations`;

    let message = nextSeatsMessage();
    await api.post(url).set('Authorization', student);
    expect(await message).toEqual({ eventId, seatsLeft: 4 });

    message = nextSeatsMessage();
    await api.delete(`${url}/me`).set('Authorization', student);
    expect(await message).toEqual({ eventId, seatsLeft: 5 });
  });
});
