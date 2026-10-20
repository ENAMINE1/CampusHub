// Loads server/.env and checks every setting once, at startup. If something is missing or wrong,
// the server refuses to start with a clear message, instead of failing later in a confusing way.
// Everything else imports settings from here instead of reading process.env directly.
import path from 'node:path';
import dotenv from 'dotenv';
import * as z from 'zod';

const serverDir = path.join(import.meta.dirname, '..', '..');

// Real environment variables (set by the host in production) win over the .env file.
dotenv.config({ path: path.join(serverDir, '.env'), quiet: true });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CLIENT_URL: z.url().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1, 'is required (see docs/mongosh-cheatsheet.md)'),
  // Where uploaded posters go: 'local' disk (development) or 'object' storage (see storage/objectStorage.js).
  STORAGE_DRIVER: z.enum(['local', 'object']).default('local'),
  UPLOAD_DIR: z.string().default('uploads'),
  // Long random strings. Anyone who knows a secret can forge login tokens, so keep them out of git.
  JWT_ACCESS_SECRET: z.string().min(32, 'must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'must be at least 32 characters'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    'Invalid environment variables. Check server/.env against server/.env.example:',
  );
  for (const issue of result.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

const config = {
  env: result.data.NODE_ENV,
  isProduction: result.data.NODE_ENV === 'production',
  isTest: result.data.NODE_ENV === 'test',
  port: result.data.PORT,
  clientUrl: result.data.CLIENT_URL,
  mongoUri: result.data.MONGODB_URI,
  storageDriver: result.data.STORAGE_DRIVER,
  // A relative UPLOAD_DIR is resolved from the server folder, wherever you start the app from.
  uploadDir: path.resolve(serverDir, result.data.UPLOAD_DIR),
  jwt: {
    accessSecret: result.data.JWT_ACCESS_SECRET,
    refreshSecret: result.data.JWT_REFRESH_SECRET,
    accessTtl: result.data.ACCESS_TOKEN_TTL,
    refreshTtl: result.data.REFRESH_TOKEN_TTL,
  },
};

export default config;
