# CampusHub Spec Sheet

Oct 20, 2026 · @Rahul

## Purpose and scope

This spec defines the finished CampusHub v3 reference app: the MERN app students reach by Video 73, before their capstone extension. It is the target you demo in Video 1 and the answer key you build backwards from when scripting each module.

Source tags follow the course rules: **\[syllabus\]** = Semester 1 Video Syllabus, **\[general knowledge\]** = my engineering defaults, **\[state\]** / **\[log\]** = CampusHub state file and video log. The state file and log are still empty templates (Video 0), so nothing here is tagged \[state\] or \[log\].

**In scope** \[syllabus\]: event and club discovery, registration with capacity, favorites, reminders, club admin publishing, roles, uploads, a live seats badge, tests, security hardening, CI/CD, and deployment.

**Assumptions to confirm or correct**

1. The generated repo is your instructor reference, not what students clone on Day 1. Students rebuild it incrementally, module by module.
2. Modules 2 and 3 (static HTML/CSS and vanilla JS versions) are not regenerated here; this spec covers the React + Express + MongoDB app from Module 4 onward. The static and vanilla versions can be a separate prompt later.
3. JavaScript, not TypeScript, because the audience is beginners and the syllabus never introduces TypeScript.
4. Auth uses JWT access tokens plus a refresh token in an httpOnly cookie (Video 56 teaches both; this is the richer option).
5. useReducer manages registrations in the app; Redux Toolkit lives only in a side-by-side comparison file (Video 42).
6. Reminder emails go to a console or Ethereal test transport in development; no real email provider is required.
7. Uploaded posters go to local disk in development and to an object-storage adapter in production (Video 65).

## Product overview

CampusHub is a campus hub where students discover events and clubs, register, and get reminders, while club admins publish and manage them \[syllabus\]. Three roles exist: student, club admin, admin \[syllabus, Video 57\].

| Persona | Goal | Key permissions |
| --- | --- | --- |
| Guest (not logged in) | Browse what is happening on campus | View events, event details, clubs |
| Student | Find events, register, never miss one | Register and cancel, favorites, My Registrations, reminders |
| Club admin | Fill their club's events with the right people | Create, edit, delete own club's events; upload posters; see registrant lists |
| Admin | Keep the platform healthy | Everything; manage clubs and roles; platform stats |

**User stories** (acceptance criteria in section 4)

- As a guest, I can search events by title and filter by category and date so I find relevant ones fast.
- As a guest, I can open an event and see its organizer club, venue, time, poster, and seats left.
- As a student, I can register and log in, and stay logged in across refreshes.
- As a student, I can register for an event, and I am blocked if it is full, past its deadline, or I already registered.
- As a student, I can cancel a registration and the seat frees up.
- As a student, I can favorite events and see them on a Favorites page.
- As a student, I receive a reminder before an event I registered for.
- As a student, I see the seats-left badge update live when others register.
- As a club admin, I can create, edit, and delete events for clubs I manage, with a poster image.
- As a club admin, I can view who registered for my events.
- As an admin, I can create clubs, assign club admins, and view registrations-per-event stats.

## Tech stack and versions

Pin to these major lines; Claude Code confirms exact patch versions with `npm view <pkg> version` at install time. Versions checked on 20 Oct 2026.

| Layer | Choice | Version line | Why / note |
| --- | --- | --- | --- |
| Runtime | Node.js | 24 LTS | [Node 24 is Active LTS; Node 26 is due to enter LTS in October 2026](https://dev.to/mr_manushukla/one-nodejs-release-a-year-from-2027-what-the-node-27-lts-change-means-for-your-upgrade-cadence-2fo3). Switch to 26 once promoted. |
| UI library | React | 19.2.x | [19.2.7 is the latest 19.2 patch](https://github.com/react-component/mentions/pull/321) |
| Build tool | Vite | 8.x | [Vite 8.0 shipped March 2026, 8.1 in June](https://dev.to/aloisseckar/new-in-vue-june-2026-28p) |
| Styling | Tailwind CSS + @tailwindcss/vite | 4.x | [v4 uses CSS-first config and a dedicated Vite plugin](https://laravelnews.substack.com/p/tailwind-css-v4-is-here); no tailwind.config.js |
| Routing | React Router (declarative mode) | 7.18.x | [v7.18.3 released Aug 2026](https://reactrouter.com/7.18.3/changelog.md); import from `react-router` |
| API | Express | 5.x | [5.x is the npm default; 5.2.1 published July 2026](https://apify.com/arman-bd/npm-package-scraper) |
| ODM | Mongoose | 9.x | [Mongoose 9 is the current major](https://mongoosejs.com/docs/version-support.html) |
| Database | MongoDB Atlas (free tier) + Compass + mongosh | Atlas default | \[syllabus, Video 58\] |
| Validation | Zod | 4.x | [Zod 4.5 and 4.6 released Sep 2026](https://sourceforge.net/projects/zod.mirror/files/v4.6.0/) |
| Auth | bcrypt, jsonwebtoken, cookie-parser | latest stable | \[syllabus, Video 56\] |
| Hardening | helmet, cors, express-rate-limit, morgan | latest stable | \[syllabus, Videos 51, 57\] |
| Uploads / real time | multer, Socket.IO | latest stable | \[syllabus, Video 65\] |
| Jobs / email | node-cron, nodemailer | latest stable | \[general knowledge\] for Video 66's scheduled reminder |
| Tests | Vitest, React Testing Library, Supertest, mongodb-memory-server, Playwright | latest stable | \[syllabus, Videos 44, 55, 68\]; versions not checked |
| CI/CD and hosting | GitHub Actions, Vercel (client), Render (API), Atlas (DB) | n/a | \[syllabus, Video 72\] |

**Not verified:** exact versions for Vitest, Playwright, Supertest, mongodb-memory-server, Socket.IO, multer, and the Mongoose 9 migration specifics. The prompt tells Claude Code to check each package's docs before use.

## Functional requirements

Each requirement has an ID, the video that introduces it \[syllabus\], and testable acceptance criteria. MoSCoW: everything below is Must unless marked (Should).

### FR-1 Accounts and auth (Videos 56, 57, 63)

- **FR-1.1 Register:** name, email, password (min 8 chars). Email is unique (409 on duplicate). Password stored only as a bcrypt hash. New users get role `student`.
- **FR-1.2 Login:** returns a short-lived access token (15 min) in the JSON body and sets a refresh token (7 days) as an httpOnly, SameSite cookie. Wrong credentials return 401 with a generic message.
- **FR-1.3 Refresh and logout:** `POST /auth/refresh` issues a new access token from the cookie; logout clears the cookie and invalidates the stored refresh token.
- **FR-1.4 Session persistence:** reloading the browser keeps the user logged in via a silent refresh on app start.
- **FR-1.5 Roles:** `student`, `clubAdmin`, `admin`. Missing or invalid token returns 401; valid token without permission returns 403.
- **FR-1.6 Ownership:** a club admin can modify only events belonging to clubs where they are listed as an admin.

### FR-2 Events (Videos 48-50, 59, 62, 64)

- **FR-2.1 List:** paginated (default 12 per page), sortable by date or title, filterable by category, club, and upcoming/past, with text search on title and description. Response includes `page`, `totalPages`, `total`.
- **FR-2.2 Details:** event with organizer club populated (name, slug, logo) and `seatsLeft` computed.
- **FR-2.3 Create / edit / delete:** club admin of the organizing club, or admin. Validation: title 3-120 chars, description up to 5,000, category from a fixed enum, `startsAt` in the future, `endsAt` after `startsAt`, `registrationDeadline` before or equal to `startsAt`, capacity integer 1-5,000.
- **FR-2.4 Delete safety:** deleting an event removes its registrations; the UI asks for confirmation.
- **FR-2.5 Poster upload (Video 65):** JPEG, PNG, or WebP up to 2 MB, checked by MIME type and extension; stored outside the database, URL saved on the event.

### FR-3 Registrations (Videos 21, 42, 60, 61)

- **FR-3.1 Register:** student registers for an event. Rejected with 409 if already registered, 422 if full or past deadline, 404 if the event does not exist.
- **FR-3.2 No overbooking:** two concurrent requests for the last seat result in exactly one success, enforced on the server with an atomic update, not by a client check.
- **FR-3.3 Cancel:** frees a seat; allowed until the event starts.
- **FR-3.4 My Registrations:** student sees upcoming and past registrations with event details.
- **FR-3.5 Registrant list:** club admin or admin sees name and email of registrants for an event they manage.

### FR-4 Clubs (Videos 39, 60)

- **FR-4.1** Anyone can list clubs and view a club page with its upcoming events.
- **FR-4.2** Admin creates and edits clubs and assigns club admins by email.

### FR-5 Discovery UX (Videos 22, 35, 37, 38)

- **FR-5.1** Search input is debounced (300 ms) and filters are reflected in the URL query string so a filtered view can be shared.
- **FR-5.2** Every data view shows loading, empty, error, and success states.
- **FR-5.3 Favorites:** a logged-in student's favorites persist on the server; a guest's favorites persist in localStorage and merge on login (Should).

### FR-6 Reminders (Video 66)

- **FR-6.1** A scheduled job runs every 15 minutes and emails each registrant once, 24 hours before the event starts. Sent reminders are recorded so none are duplicated.

### FR-7 Real-time seats (Video 65)

- **FR-7.1** The event details page shows a seats-left badge that updates within 2 seconds of any registration or cancellation, via Socket.IO rooms per event. If the socket fails, the page still works with the last fetched value.

### FR-8 Admin dashboard (Videos 61, 64)

- **FR-8.1** Club admin dashboard: their events, create/edit forms, registrant counts.
- **FR-8.2** Admin stats: registrations per event and per category via an aggregation pipeline.

### FR-9 Theme and accessibility (Videos 10, 16, 41)

- **FR-9.1** Light and dark theme toggle, remembered per browser, respecting `prefers-color-scheme` by default.
- **FR-9.2** All interactive elements reachable by keyboard; modals trap focus and close on Esc.

## Data model

Four collections. Registrations are their own collection (many-to-many) with a unique compound index, and events reference their club \[syllabus, Video 60\]. All schemas use `timestamps: true`.

| Collection | Fields (type, rules) | Indexes |
| --- | --- | --- |
| **users** | name (String, 2-60, required); email (String, lowercase, trimmed, required); passwordHash (String, `select: false`); role (enum student / clubAdmin / admin, default student); favorites (\[ObjectId ref Event\]); refreshTokenHash (String, `select: false`) | email unique |
| **clubs** | name (String, unique, 2-80); slug (String, unique); description (String, max 2,000); logoUrl (String); admins (\[ObjectId ref User\]) | slug unique |
| **events** | title; description; category (enum: tech, cultural, sports, workshop, career, social, other); club (ObjectId ref Club, required); venue (String); startsAt, endsAt, registrationDeadline (Date); capacity (Number, 1-5,000); seatsTaken (Number, default 0, min 0); posterUrl (String); createdBy (ObjectId ref User) | { startsAt: 1 }; { category: 1, startsAt: 1 }; { club: 1, startsAt: 1 }; text on title + description |
| **registrations** | event (ObjectId ref Event); user (ObjectId ref User); status (enum registered / cancelled); reminderSentAt (Date, optional) | { event: 1, user: 1 } unique; { user: 1, createdAt: -1 } |

**Rules**

- `seatsLeft` = capacity minus seatsTaken, computed, never stored.
- Registering uses one atomic `findOneAndUpdate` on the event with the filter `seatsTaken < capacity` and `$inc: { seatsTaken: 1 }`; if no document matches, the event is full (FR-3.2). On duplicate-key error from the registration insert, roll the counter back.
- Re-registering after cancelling flips status back to `registered` on the existing document instead of inserting a new one.
- `toJSON` transforms strip passwordHash, refreshTokenHash, and `__v`, and expose `id` instead of `_id` \[syllabus, Video 66: never return password hashes\].

## API contract

Base path `/api/v1`, JSON only, noun-based resources \[syllabus, Video 49\]. Auth column: Public, Auth (any logged-in user), Owner (club admin of the event's club, or admin), Admin.

| Method | Path | Auth | Success | Notes |
| --- | --- | --- | --- | --- |
| GET | /health | Public | 200 | `{ status, uptime, db }` |
| POST | /auth/register | Public | 201 | 409 duplicate email, 422 invalid body |
| POST | /auth/login | Public | 200 | Sets refresh cookie; rate-limited to 5 per 15 min per IP |
| POST | /auth/refresh | Cookie | 200 | New access token |
| POST | /auth/logout | Auth | 204 | Clears cookie |
| GET | /auth/me | Auth | 200 | Current user |
| GET | /events | Public | 200 | Query: `page, limit, sort, category, club, q, when=upcoming or past` |
| GET | /events/:id | Public | 200 | Club populated, `seatsLeft` |
| POST | /events | Owner | 201 | Body validated with Zod |
| PATCH | /events/:id | Owner | 200 | Partial update |
| DELETE | /events/:id | Owner | 204 | Cascades registrations |
| POST | /events/:id/poster | Owner | 200 | multipart field `poster` |
| POST | /events/:id/registrations | Auth (student) | 201 | 409 duplicate, 422 full or past deadline |
| DELETE | /events/:id/registrations/me | Auth | 204 | Cancel own registration |
| GET | /events/:id/registrations | Owner | 200 | Registrant list |
| GET | /me/registrations | Auth | 200 | Query `when=upcoming or past` |
| GET | /me/favorites | Auth | 200 | Populated events |
| PUT | /me/favorites/:eventId | Auth | 204 | Idempotent add |
| DELETE | /me/favorites/:eventId | Auth | 204 | Idempotent remove |
| GET | /clubs | Public | 200 |  |
| GET | /clubs/:slug | Public | 200 | With upcoming events |
| POST | /clubs | Admin | 201 |  |
| PATCH | /clubs/:id | Admin | 200 | Includes `adminEmails` |
| GET | /admin/stats | Admin | 200 | Registrations per event and per category |

**One error shape everywhere** \[syllabus, Video 52\]:

```json
{ "error": { "code": "EVENT_FULL", "message": "This event is full.", "details": [] } }
```

`details` holds Zod field errors for 422. Stack traces are logged on the server, never sent to clients. Unknown routes return 404 with code `NOT_FOUND`.

**Socket.IO:** client emits `event:join` with an event id; server emits `event:seats` `{ eventId, seatsLeft }` to that room after every registration change.

## Front end

One shared layout (header, nav, footer, `<Outlet/>`) wraps every page \[syllabus, Video 39\]. Admin routes are lazy-loaded with Suspense \[syllabus, Video 43\].

| Route | Page | Access |
| --- | --- | --- |
| / | Home: hero, upcoming highlights, featured clubs | Public |
| /events | Events: search, filters, sort, pagination | Public |
| /events/:id | Event details: poster, live seats badge, register / cancel, favorite | Public (actions need login) |
| /clubs | Clubs list | Public |
| /clubs/:slug | Club page with upcoming events | Public |
| /login, /register | Auth forms with validation | Guest only |
| /me/registrations | My Registrations (upcoming, past) | Student |
| /me/favorites | Favorites | Student |
| /dashboard | Club admin: my events, registrant counts | Club admin, admin |
| /dashboard/events/new, /dashboard/events/:id/edit | Event form with poster upload | Owner |
| /dashboard/events/:id/registrations | Registrant list | Owner |
| /admin | Clubs management and stats | Admin |
| \* | NotFound | Public |

**Components** \[syllabus, Videos 33, 34, 40\]

- `ui/`: Button, Input, Select, Textarea, Card, Modal (focus trap, Esc), Badge, Spinner, EmptyState, ErrorState, Pagination.
- Feature components: EventCard, EventList, EventFilters, SeatsBadge, RegistrationButton, FavoriteButton, EventForm, ClubCard.
- `ProtectedRoute` that takes allowed roles and redirects to /login with a return path. It only hides UI; the server enforces access \[syllabus, Video 63\].
- An `ErrorBoundary` around the routes.

**State and data** \[syllabus, Videos 35, 38, 41, 42\]

- Contexts: `AuthContext` (user, accessToken in memory only, login, logout, refresh), `ThemeContext`, `FavoritesContext`.
- `useReducer` for the registrations list; `redux-comparison/` holds the same logic as a Redux Toolkit slice for teaching only, not wired into the app.
- Custom hooks: `useFetch`, `useDebounce`, `useLocalStorage`, `useSocketSeats`.
- `api/client.js`: one fetch wrapper that adds the access token, sends credentials, retries once after a 401 via refresh, and turns error responses into thrown `ApiError` objects.
- Derived values (filtered lists, seatsLeft display) are computed, never stored in state.

## Non-functional requirements

| Area | Requirement | Video |
| --- | --- | --- |
| Security | Zod validation on every body, query, and param; reject unknown keys | 52, 69 |
| Security | Block NoSQL operator injection: strip keys starting with `$` or containing `.` from input | 69 |
| Security | helmet, CORS allowlist from `CLIENT_URL`, rate limits on auth (5/15 min) and globally (300/15 min) | 51, 57 |
| Security | Ownership checks on every event mutation; a user cannot read another user's registrations by changing an id | 57, 69 |
| Security | Secrets only in env vars; `.env.example` committed, `.env` gitignored; nothing secret in client env | 54 |
| Security | `npm audit` passes with no high or critical issues | 69 |
| Accessibility | Semantic landmarks, labelled inputs, visible focus, WCAG AA contrast, keyboard-only flows work | 8, 10 |
| Accessibility | Lighthouse accessibility score 95 or higher on Home, Events, Event details | 10, 18 |
| Performance | Lighthouse performance 90 or higher on Home (desktop); images lazy-loaded; admin routes code-split | 18, 43 |
| Performance | List endpoints use indexes (verified with `explain()`), `lean()` for reads, pagination capped at 50 | 59, 62 |
| Caching | `Cache-Control: public, max-age=60` on GET /events and /clubs; no caching on authenticated routes | 66 |
| Responsive | Mobile-first; works at 360 px, 768 px, 1280 px | 15 |
| Testing | Unit: pure utils and reducers (Vitest). Component: EventCard, filters, registration form (RTL) | 44 |
| Testing | API integration: auth, events CRUD, registration rules incl. full and duplicate cases (Supertest + mongodb-memory-server) | 55, 68 |
| Testing | One Playwright E2E: student logs in, registers, sees it in My Registrations | 68 |
| CI/CD | GitHub Actions on every PR: install, lint, test, build for client and server | 72 |
| Deployment | Client on Vercel, API on Render, DB on Atlas; production cookies `Secure` + `SameSite=None` across domains | 72 |
| Observability | Structured JSON logs with a request id per request; `/health` checks DB connection | 73 |
| Code quality | ESLint + Prettier, small functions, routes / controllers / services split, comments explain why | 25, 50 |

## Repo, config and delivery plan

**Repo layout** (client and server folders, per Video 32) \[syllabus\]

```
campushub/
  client/          Vite + React app
    src/{api,components/ui,features,hooks,context,pages,routes,redux-comparison,test}
  server/          Express API
    src/{config,db,models,routes,controllers,services,middleware,validators,jobs,sockets,utils}
    scripts/seed.js
    tests/
  e2e/             Playwright
  .github/workflows/ci.yml
  README.md  AI_LOG.md  SPEC.md
```

**Environment variables** (names only)

| Where | Variables |
| --- | --- |
| server/.env | PORT, NODE\_ENV, MONGODB\_URI, JWT\_ACCESS\_SECRET, JWT\_REFRESH\_SECRET, ACCESS\_TOKEN\_TTL, REFRESH\_TOKEN\_TTL, CLIENT\_URL, UPLOAD\_DIR, SMTP\_HOST, SMTP\_PORT, SMTP\_USER, SMTP\_PASS, EMAIL\_FROM |
| client/.env | VITE\_API\_URL, VITE\_SOCKET\_URL |

**Build milestones** (one commit series and git tag each, so you can check out any stage while scripting)

1. `ref-m5-api`: Express server, in-memory events, middleware, Zod, error handler, Supertest tests.
2. `ref-m5-auth`: register / login / refresh with in-memory users, roles, rate limiting.
3. `ref-m6-db`: Mongoose models, seed script, controllers on MongoDB, indexes, pagination, aggregation.
4. `ref-m4-client`: React client with routes, contexts, hooks, ui primitives, against the real API.
5. `ref-m6-full`: persistent auth across the stack, dashboards, uploads, live seats, reminder job, caching.
6. `ref-m7-ship`: E2E test, security pass, CI workflow, deploy configs, logging, README.

**Seed data:** 3 clubs, 1 admin, 2 club admins, 5 students, 24 events across all categories (some past, some full), and sample registrations. Demo passwords are printed by the seed script and documented in the README as development-only.

**Out of scope:** TypeScript, payments, SSO / OAuth, push notifications, native mobile, Next.js, the Semester 2 AI assistant, and the Module 2-3 static and vanilla JS versions.

**Open questions for you**

- [ ] Is Render still your preferred API host, or Railway / Fly.io?
- [ ] Should students be able to request club-admin access in-app, or is it admin-assigned only (current spec)?
- [ ] Do you want a separate prompt for the static (Module 2) and vanilla JS (Module 3) reference versions?
- [ ] Keep refresh tokens, or simplify to a single httpOnly session cookie for beginners?
