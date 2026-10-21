# End-to-end checklist (manual)

Run this by hand before every checkpoint, with `npm run seed` then `npm run dev`. It walks the
whole app the way real users do. Video 68 automates the student path with Playwright.

Demo password for every account: `campushub-demo` (development only).

## Guest

- [ ] `/events` lists events; search, category, sort and pagination change the URL and the list.
- [ ] A full event shows "Full"; a past event cannot be registered for.
- [ ] Opening `/me/registrations`, `/dashboard` or `/admin` redirects to `/login`.

## Student (`aarav@campushub.dev`)

- [ ] Log in; the header greets you and shows "My registrations".
- [ ] Register for an upcoming event with free seats; the seats badge drops by one.
- [ ] In a second window, the same event's seats badge updates live.
- [ ] Registering twice is refused; a full event is refused.
- [ ] The event appears in My registrations; cancel it and the seat comes back.
- [ ] Favorite an event, reload: it is still a favorite.
- [ ] Reload any page: you stay logged in (silent refresh). Log out: protected pages redirect.

## Club admin (`code.lead@campushub.dev`)

- [ ] `/dashboard` shows only Code Club events.
- [ ] Create an event with a poster; it appears on `/events`.
- [ ] Edit and delete it; the registrant list shows names and emails.
- [ ] Editing another club's event through the API returns 403.

## Admin (`admin@campushub.dev`)

- [ ] `/admin` lists the three clubs with their admin emails.
- [ ] Create a club and assign a student by email; that student now sees the dashboard.
- [ ] A typo in an admin email shows "Some admin emails have no account."
- [ ] Stats show registrations per category and the top events.

## Every page

- [ ] No console errors. Works at 360, 768 and 1280 px, in light and dark mode.
- [ ] Everything is reachable with the keyboard alone, with a visible focus ring.
