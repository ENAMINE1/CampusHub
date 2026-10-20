// Storage adapter for local disk: saves files into UPLOAD_DIR, served by Express at /uploads.
// Fine for development. On hosts like Render the disk is wiped on every deploy, so production
// uses object storage instead (objectStorage.js).
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import config from '../../config/index.js';

export async function save(fileName, buffer) {
  await mkdir(config.uploadDir, { recursive: true });
  await writeFile(path.join(config.uploadDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

export async function remove(url) {
  if (!url?.startsWith('/uploads/')) return;
  // basename() keeps only the file name, so a crafted url cannot reach outside UPLOAD_DIR.
  await unlink(path.join(config.uploadDir, path.basename(url))).catch(() => {});
}
