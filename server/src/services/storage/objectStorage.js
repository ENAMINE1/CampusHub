// Storage adapter for object storage (Amazon S3, Cloudflare R2, Backblaze B2...): the production
// choice, because files survive redeploys and are served from a CDN.
//
// Not wired to a provider yet. To use one:
//   1. npm install the provider's SDK (for S3-compatible services, @aws-sdk/client-s3).
//   2. Add its bucket name and keys to config/index.js and server/.env (never commit keys).
//   3. In save(): upload `buffer` as `fileName` with a public-read policy and return its URL.
//   4. In remove(): delete the object the URL points to.
//   5. Set STORAGE_DRIVER=object.
// The rest of the app only calls save() and remove(), so nothing else has to change.

export async function save() {
  throw new Error(
    'Object storage is not configured. Set STORAGE_DRIVER=local or implement save().',
  );
}

export async function remove() {
  throw new Error(
    'Object storage is not configured. Set STORAGE_DRIVER=local or implement remove().',
  );
}
