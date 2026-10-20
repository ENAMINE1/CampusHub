# CampusHub

CampusHub is a campus events hub: students discover events and clubs, register, and get
reminders, while club admins publish and manage events. It is the reference app for the
MERN course, built one video at a time. Every video has a git tag, so you can check out
any step and see exactly what that video added.

## My goal

> Write one sentence about what you want to be able to build when you finish this course,
> and read it again whenever a video feels hard.

## The four AI rules

1. **Predict before you run.** Say what you expect the code to do before you run it.
2. **Ask AI to explain.** When AI hands you code, ask it why each part is there.
3. **Type it yourself.** Never paste code you could not have typed and explained.
4. **Teach it back.** Explain the step out loud (or in `AI_LOG.md`) as if to a friend.

## Prerequisites

- Node.js 24 LTS (`.nvmrc` says `24`; run `nvm use` if you use nvm)
- npm 11 or newer
- Git
- A MongoDB database: a free MongoDB Atlas cluster, or MongoDB running locally (for example
  with Docker: `docker run -d -p 27017:27017 --name campushub-mongo mongo:8`)

## Setup

```bash
npm install
cp server/.env.example server/.env
```

The repo is an npm workspace: one `npm install` at the root installs `client/` and `server/`,
with a single `package-lock.json`.

Then edit `server/.env`:

| Variable                                  | What it is                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| `NODE_ENV`                                | `development` on your laptop, `production` on a server                       |
| `PORT`                                    | Port the API listens on (3000)                                               |
| `CLIENT_URL`                              | The React app's address; the only origin CORS allows (http://localhost:5173) |
| `MONGODB_URI`                             | MongoDB connection string, including the database name `campushub`           |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Two different random strings of 32+ characters that sign login tokens        |
| `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`   | Token lifetimes (`15m` and `7d`)                                             |

Generate a secret with `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`.

**Free Atlas connection string:** create a free M0 cluster at cloud.mongodb.com, add a database
user (Database Access), allow your IP (Network Access), then Connect → Drivers and copy the
string. Put `campushub` before the `?`. More in [docs/mongosh-cheatsheet.md](docs/mongosh-cheatsheet.md).

Load the sample events once (this replaces the events in that database):

```bash
npm run seed --workspace server
```

Tests do not need any of this: they start a throwaway in-memory MongoDB (the first run
downloads a MongoDB binary, about 100 MB).

## How to run

All commands run from the repo root.

| Command                              | What it does                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `npm run dev`                        | Starts both apps: Vite at http://localhost:5173 and the API at http://localhost:3000 (restarts on save) |
| `npm test`                           | Every workspace's tests: client (Vitest + RTL) and server (Vitest + Supertest)                          |
| `npm run lint`                       | ESLint over the whole repo                                                                              |
| `npm run build`                      | Production build into `client/dist`                                                                     |
| `npm run preview --workspace client` | Serves `client/dist` at http://localhost:4173 to check the build                                        |

### Deploying the client

`client/vercel.json` rewrites every path to `index.html`. React Router handles URLs in the
browser, so without this rule a refresh on `/events/evt-101` would return a 404 from the host.
On Vercel, set the project root to `client/`; the build command is `npm run build` and the
output directory is `dist`.

## API

The Express API lives in `server/` and listens on http://localhost:3000. In development the React
app reaches it through the Vite proxy at `/api/v1`. The full contract (including endpoints that
arrive in later videos) is in [docs/api-contract.md](docs/api-contract.md).

| Method | Path                                | What it does                                                                                                                                           |
| ------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | /api/v1/health                      | `{ status, uptime }`                                                                                                                                   |
| GET    | /api/v1/events                      | Paged list `{ data, page, totalPages, total }`. Query: `page`, `limit` (max 50), `sort=date` or `title`, `category`, `club`, `q` (word search), `when` |
| GET    | /api/v1/events/:id                  | One event with `seatsLeft`                                                                                                                             |
| POST   | /api/v1/events                      | Create an event (validated with Zod). **Owner**: admin, or club admin of that club                                                                     |
| PATCH  | /api/v1/events/:id                  | Update some fields. **Owner**                                                                                                                          |
| DELETE | /api/v1/events/:id                  | Delete an event. **Owner**                                                                                                                             |
| POST   | /api/v1/events/:id/registrations    | Register yourself (**student** login): 409 duplicate, 422 full or closed                                                                               |
| GET    | /api/v1/events/:id/registrations    | Registrant list. **Owner**                                                                                                                             |
| POST   | /api/v1/auth/register               | Sign up `{ name, email, password }`: returns `{ user, accessToken }` and sets the refresh cookie                                                       |
| POST   | /api/v1/auth/login                  | Log in: same response as register; one generic 401; 5 attempts per 15 min per IP                                                                       |
| POST   | /api/v1/auth/refresh                | New access token from the refresh cookie (the cookie is rotated)                                                                                       |
| POST   | /api/v1/auth/logout                 | Clears the cookie and forgets the stored token                                                                                                         |
| GET    | /api/v1/auth/me                     | The logged-in user. Needs `Authorization: Bearer <accessToken>`                                                                                        |
| GET    | /api/v1/clubs                       | All clubs                                                                                                                                              |
| GET    | /api/v1/clubs/:slug                 | One club with its upcoming events                                                                                                                      |
| GET    | /api/v1/me/registrations            | My registrations with event details. Query `when=upcoming` or `past`. **Login**                                                                        |
| GET    | /api/v1/admin/stats                 | Registrations per event and per category (aggregation). **Admin**                                                                                      |
| DELETE | /api/v1/events/:id/registrations/me | Cancel my registration and free the seat (until the event starts). **Login**                                                                           |
| GET    | /api/v1/me/favorites                | My favorite events. **Login**                                                                                                                          |
| PUT    | /api/v1/me/favorites/:eventId       | Add a favorite (idempotent, 204). **Login**                                                                                                            |
| DELETE | /api/v1/me/favorites/:eventId       | Remove a favorite (idempotent, 204). **Login**                                                                                                         |
| GET    | /api/v1/me/clubs                    | Clubs I manage, for the dashboard. **Club admin / admin**                                                                                              |

No token or a bad token gives **401**; a valid token without permission gives **403**.

### Demo accounts (development only)

`npm run seed --workspace server` creates these, all with the password `campushub-demo`.
Never use them in production.

| Email                      | Role                          |
| -------------------------- | ----------------------------- |
| admin@campushub.dev        | admin                         |
| code.lead@campushub.dev    | clubAdmin of Code Club        |
| culture.lead@campushub.dev | clubAdmin of Cultural Society |

Every error uses one shape:

```json
{ "error": { "code": "EVENT_FULL", "message": "This event is full.", "details": [] } }
```

Try it from a terminal while `npm run dev` is running:

```bash
curl "http://localhost:3000/api/v1/events?category=tech"
```

API tests (Vitest + Supertest) live in `server/tests` and run with `npm test`.

## Course map

| Video | Tag                        | What it added                                                                                                                                                            |
| ----- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4, 7  | `v07-foundation`           | Git ignore rules, ESLint + Prettier, `.nvmrc`, README, AI log                                                                                                            |
| 32    | `v32-vite-setup`           | Vite + React app in `client/` with Tailwind 4 and a CampusHub heading                                                                                                    |
| 33    | `v33-components`           | `Header`, `Footer`, `EventCard` components, brand colour tokens in `@theme`                                                                                              |
| 34    | `v34-props-lists`          | Sample `events.js`, `EventList` with keys, `EmptyState`, "Full" vs seats-left rendering                                                                                  |
| 35    | `v35-usestate`             | Search, category filter and favorites in `useState`; filtered list derived, not stored                                                                                   |
| 36    | `v36-forms`                | Controlled `RegistrationForm` with one state object, blur and submit validation, accessible errors                                                                       |
| 37    | `v37-useeffect`            | Events fetched from `public/data/events.json` with loading/error states, abort cleanup, tab title, 300 ms search debounce                                                |
| 38    | `v38-custom-hooks`         | `useFetch`, `useDebounce`, `useLocalStorage` hooks; favorites survive a reload                                                                                           |
| 39    | `v39-routing`              | React Router layout with `Outlet` and `NavLink`; Home, Events, Event details, Clubs, Register, NotFound; filters in the URL                                              |
| 40    | `v40-ui-kit`               | `components/ui` (Button, Input, Select, Card, Badge, Spinner, ErrorState, EmptyState, Modal with focus trap and Esc); pages refactored                                   |
| 41    | `v41-context`              | `ThemeContext` (dark mode), `FavoritesContext` (no more prop drilling), in-memory `AuthContext`                                                                          |
| 42    | `v42-reducer`              | Registrations with `useReducer` and a My registrations page; `redux-comparison/registrationsSlice.js` (teaching only)                                                    |
| 43    | `v43-performance`          | `ErrorBoundary` around pages, one justified `useMemo`, lazy-loaded My registrations route with `Suspense`                                                                |
| 44    | `v44-react-tests`          | Vitest + React Testing Library: EventCard, search filter, registration form, reducer, error boundary                                                                     |
| 45    | `v45-campushub-v2`         | `build`/`preview` scripts, Vercel SPA rewrite, README run section (CampusHub v2: the React app)                                                                          |
| 46    | `v46-node-npm`             | `server/` package with a first Node script; npm workspaces with one root lockfile                                                                                        |
| 47    | `v47-core-modules`         | `server/scripts/report.js` reads `events.json` with `fs/promises` and `path`, writes a summary report                                                                    |
| 48    | `v48-express`              | Express app: `GET /api/health`, `GET /api/events`; `app.js` / `server.js` split; `node --watch`; one `npm run dev` for both                                              |
| 49    | `v49-rest-design`          | `docs/api-contract.md`: endpoints, auth levels, status codes, one error shape (docs only)                                                                                |
| 50    | `v50-routing`              | `express.Router`, routes → controllers → services; events CRUD on an in-memory array with filters; `/api/v1`                                                             |
| 51    | `v51-middleware`           | Request logger (morgan), helmet, CORS allowlist with credentials, 404 handler, four-argument error handler                                                               |
| 52    | `v52-validation`           | Zod schemas + `validate` middleware, `ApiError`, one error shape; in-memory registrations (409 duplicate, 422 full or closed)                                            |
| 53    | `v53-react-express`        | React calls the API through `api/client.js` (`ApiError`), Vite proxy for `/api`, `VITE_API_URL`, API errors shown in the UI                                              |
| 54    | `v54-config`               | `dotenv` + `config/index.js` validates env vars at startup; `server/.env.example`, `client/.env.example`                                                                 |
| 55    | `v55-api-tests`            | Supertest suites for events and registrations; root `npm test` runs both workspaces; README API section                                                                  |
| 56    | `v56-auth`                 | bcrypt (cost 12) sign-up/login with in-memory users; 15-min access token; 7-day httpOnly refresh cookie, hashed and rotated; refresh and logout                          |
| 57    | `v57-rbac`                 | `requireAuth`, `requireRole`, `requireEventOwner`; owner-only event changes and registrant list; login rate limit; 401 vs 403 tests                                      |
| 58    | `v58-mongodb`              | `docs/mongosh-cheatsheet.md` (insert/find/update/delete, indexes); `MONGODB_URI` in `.env.example`                                                                       |
| 59    | `v59-mongoose`             | Mongoose connection, `Event` and `User` models with validators, events service on MongoDB, first seed script, in-memory MongoDB for tests                                |
| 60    | `v60-data-modeling`        | `Club` model and event `club` reference, users in MongoDB, `Registration` model with unique `{ event, user }`; registering needs a student login                         |
| 61    | `v61-populate-aggregation` | Populated club with logo on event details, `GET /clubs` and `/clubs/:slug`, `GET /me/registrations`, `GET /admin/stats` aggregation                                      |
| 62    | `v62-pagination`           | SPEC indexes (checked with `explain()`); paged, sorted, text-searched `GET /events`; `Pagination` and sort in React                                                      |
| 63    | `v63-auth-fullstack`       | React login/register pages, real `AuthContext` with silent refresh, `ProtectedRoute`, logout, refresh-and-retry in `api/client.js`; registrations loaded from the server |
| 64    | `v64-crud-roles`           | Atomic register and cancel, club-admin dashboard (create/edit/delete events, registrant list), role-based nav, server favorites with guest merge                         |

## Stack (exact installed versions)

| Tool                             | Version |
| -------------------------------- | ------- |
| Node.js                          | 24.22.0 |
| npm                              | 12.2.0  |
| eslint                           | 10.13.0 |
| prettier                         | 3.9.10  |
| react, react-dom                 | 19.2.9  |
| vite                             | 8.3.4   |
| @vitejs/plugin-react             | 6.1.2   |
| tailwindcss, @tailwindcss/vite   | 4.3.3   |
| react-router                     | 7.18.4  |
| @reduxjs/toolkit (teaching only) | 2.13.0  |
| vitest                           | 5.0.5   |
| @testing-library/react           | 16.3.3  |
| @testing-library/user-event      | 14.6.8  |
| @testing-library/jest-dom        | 7.0.1   |
| jsdom                            | 30.1.3  |
| express                          | 5.3.0   |
| concurrently                     | 10.0.6  |
| cors                             | 2.8.6   |
| morgan                           | 1.12.1  |
| helmet                           | 8.3.0   |
| zod                              | 4.6.7   |
| dotenv                           | 18.0.8  |
| supertest                        | 7.3.1   |
| bcrypt                           | 6.0.0   |
| jsonwebtoken                     | 9.0.3   |
| cookie-parser                    | 1.4.7   |
| express-rate-limit               | 8.7.1   |
| mongoose                         | 9.11.2  |
| mongodb-memory-server            | 11.3.0  |
