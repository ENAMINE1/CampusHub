// Small Zod schemas shared by several routes.
import * as z from 'zod';

export const clubSlugParams = z.strictObject({
  slug: z.string().regex(/^[a-z0-9-]{1,80}$/, 'Not a valid club slug.'),
});

export const whenQuery = z.strictObject({
  when: z.enum(['upcoming', 'past']).optional(),
});
