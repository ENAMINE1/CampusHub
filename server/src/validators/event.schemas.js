// Zod schemas for event requests (SPEC.md FR-2.3). Strict objects reject unknown keys.
import * as z from 'zod';

export const CATEGORIES = [
  'tech',
  'cultural',
  'sports',
  'workshop',
  'career',
  'social',
  'other',
];

const isoDate = z.iso.datetime({ offset: true });

// MongoDB ids are 24 hexadecimal characters.
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Not a valid id.');

const eventFields = z.strictObject({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(5000).default(''),
  category: z.enum(CATEGORIES),
  club: objectId, // the organising club's id
  venue: z.string().trim().min(1).max(200),
  startsAt: isoDate,
  endsAt: isoDate,
  registrationDeadline: isoDate,
  capacity: z.int().min(1).max(5000),
});

// Rules that compare fields with each other. A plain function, so the service can re-check them
// after a partial update merges new values into an existing event.
export function findDateProblems(event) {
  const problems = [];
  const starts = new Date(event.startsAt);
  if (starts <= new Date()) {
    problems.push({ path: 'startsAt', message: 'Must be in the future.' });
  }
  if (new Date(event.endsAt) <= starts) {
    problems.push({ path: 'endsAt', message: 'Must be after startsAt.' });
  }
  if (new Date(event.registrationDeadline) > starts) {
    problems.push({
      path: 'registrationDeadline',
      message: 'Must be on or before startsAt.',
    });
  }
  return problems;
}

export const createEventSchema = eventFields.superRefine((event, ctx) => {
  for (const problem of findDateProblems(event)) {
    ctx.addIssue({ code: 'custom', path: [problem.path], message: problem.message });
  }
});
export const updateEventSchema = eventFields.partial();

export const eventIdParams = z.strictObject({ id: objectId });

// Query strings are always text, so z.coerce turns "2" into the number 2.
export const listEventsQuery = z.strictObject({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12), // capped so nobody can ask for everything
  sort: z.enum(['date', 'title']).default('date'),
  category: z.enum(CATEGORIES).optional(),
  club: objectId.optional(),
  q: z.string().trim().max(100).optional(),
  when: z.enum(['upcoming', 'past']).optional(),
});
