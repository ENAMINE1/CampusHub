// The one E2E journey from SPEC.md: a student logs in, registers for an event and sees it in
// My registrations. It cancels at the end, so the demo data is unchanged and the test can rerun.
import { expect, test } from '@playwright/test';

// A seeded upcoming event with free seats that this student is not registered for.
const STUDENT = { email: 'aarav@campushub.dev', password: 'campushub-demo' };
const EVENT = 'Open Source Sprint';

test('student registers for an event and sees it in My registrations', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(STUDENT.email);
  await page.getByLabel('Password').fill(STUDENT.password);
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page.getByRole('button', { name: /log out/i })).toBeVisible();

  await page.goto('/events');
  await page.getByRole('searchbox').fill(EVENT);
  await page.getByRole('link', { name: EVENT }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: EVENT })).toBeVisible();

  await page.getByRole('button', { name: /register for this event/i }).click();
  await page.getByRole('button', { name: /yes, register me/i }).click();
  await expect(page.getByRole('status')).toContainText(`You are registered for ${EVENT}`);

  await page.getByRole('link', { name: /my registrations/i }).click();
  await expect(page.getByRole('link', { name: EVENT })).toBeVisible();

  // Clean up through the UI as well: back to the event and cancel.
  await page.getByRole('link', { name: EVENT }).click();
  await page.getByRole('button', { name: /cancel registration/i }).click();
  await expect(
    page.getByRole('button', { name: /register for this event/i }),
  ).toBeVisible();
});
