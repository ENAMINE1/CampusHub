// Zod schema for registering for an event. Until accounts exist (Video 56), the student
// identifies themselves with a name and email in the body.
import * as z from 'zod';

export const registrationBody = z.strictObject({
  name: z.string().trim().min(2).max(60),
  // Normalise first, then check the format, so " Asha@Campus.EDU " is accepted and stored lower-case.
  email: z.string().trim().toLowerCase().pipe(z.email()),
});
