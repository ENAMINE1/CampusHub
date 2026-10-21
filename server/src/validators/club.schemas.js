// Zod schemas for club requests (SPEC.md FR-4.2): admins create clubs and assign admins by email.
import * as z from 'zod';
import { objectId } from './event.schemas.js';

const clubFields = z.strictObject({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{2,80}$/, 'Use 2-80 characters: a-z, 0-9 and dashes.'),
  description: z.string().trim().max(2000).default(''),
  logoUrl: z.string().trim().max(500).default(''),
  adminEmails: z.array(z.email().trim().toLowerCase()).max(20).default([]),
});

export const createClubSchema = clubFields;

// PATCH sends only what changes, so no defaults: a missing field must stay as it is.
export const updateClubSchema = z.strictObject({
  name: clubFields.shape.name.optional(),
  slug: clubFields.shape.slug.optional(),
  description: z.string().trim().max(2000).optional(),
  logoUrl: z.string().trim().max(500).optional(),
  adminEmails: z.array(z.email().trim().toLowerCase()).max(20).optional(),
});

export const clubIdParams = z.strictObject({ id: objectId });
