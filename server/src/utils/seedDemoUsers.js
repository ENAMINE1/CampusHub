// DEVELOPMENT ONLY. Users live in memory until MongoDB arrives, so every restart starts empty.
// This creates one admin and two club admins so you can try the protected routes right away.
import { createUser } from '../services/user.service.js';

export const DEMO_PASSWORD = 'campushub-demo';

const demoUsers = [
  { name: 'Ada Admin', email: 'admin@campushub.dev', role: 'admin' },
  { name: 'Kiran (Code Club)', email: 'code.lead@campushub.dev', role: 'clubAdmin' },
  {
    name: 'Meera (Cultural Society)',
    email: 'culture.lead@campushub.dev',
    role: 'clubAdmin',
  },
];

export default async function seedDemoUsers() {
  for (const user of demoUsers) {
    await createUser({ ...user, password: DEMO_PASSWORD });
  }
  return demoUsers.map((u) => u.email);
}
