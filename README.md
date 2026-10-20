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

## Setup

```bash
npm install
```

The repo is an npm workspace: one `npm install` at the root installs `client/` and `server/`,
with a single `package-lock.json`.

## How to run

All commands run from the repo root.

| Command                              | What it does                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `npm run dev`                        | Starts both apps: Vite at http://localhost:5173 and the API at http://localhost:3000 (restarts on save) |
| `npm test`                           | Every workspace's tests (Vitest + React Testing Library in `client/src/test`)                           |
| `npm run lint`                       | ESLint over the whole repo                                                                              |
| `npm run build`                      | Production build into `client/dist`                                                                     |
| `npm run preview --workspace client` | Serves `client/dist` at http://localhost:4173 to check the build                                        |

### Deploying the client

`client/vercel.json` rewrites every path to `index.html`. React Router handles URLs in the
browser, so without this rule a refresh on `/events/evt-101` would return a 404 from the host.
On Vercel, set the project root to `client/`; the build command is `npm run build` and the
output directory is `dist`.

## Course map

| Video | Tag                | What it added                                                                                                                          |
| ----- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 4, 7  | `v07-foundation`   | Git ignore rules, ESLint + Prettier, `.nvmrc`, README, AI log                                                                          |
| 32    | `v32-vite-setup`   | Vite + React app in `client/` with Tailwind 4 and a CampusHub heading                                                                  |
| 33    | `v33-components`   | `Header`, `Footer`, `EventCard` components, brand colour tokens in `@theme`                                                            |
| 34    | `v34-props-lists`  | Sample `events.js`, `EventList` with keys, `EmptyState`, "Full" vs seats-left rendering                                                |
| 35    | `v35-usestate`     | Search, category filter and favorites in `useState`; filtered list derived, not stored                                                 |
| 36    | `v36-forms`        | Controlled `RegistrationForm` with one state object, blur and submit validation, accessible errors                                     |
| 37    | `v37-useeffect`    | Events fetched from `public/data/events.json` with loading/error states, abort cleanup, tab title, 300 ms search debounce              |
| 38    | `v38-custom-hooks` | `useFetch`, `useDebounce`, `useLocalStorage` hooks; favorites survive a reload                                                         |
| 39    | `v39-routing`      | React Router layout with `Outlet` and `NavLink`; Home, Events, Event details, Clubs, Register, NotFound; filters in the URL            |
| 40    | `v40-ui-kit`       | `components/ui` (Button, Input, Select, Card, Badge, Spinner, ErrorState, EmptyState, Modal with focus trap and Esc); pages refactored |
| 41    | `v41-context`      | `ThemeContext` (dark mode), `FavoritesContext` (no more prop drilling), in-memory `AuthContext`                                        |
| 42    | `v42-reducer`      | Registrations with `useReducer` and a My registrations page; `redux-comparison/registrationsSlice.js` (teaching only)                  |
| 43    | `v43-performance`  | `ErrorBoundary` around pages, one justified `useMemo`, lazy-loaded My registrations route with `Suspense`                              |
| 44    | `v44-react-tests`  | Vitest + React Testing Library: EventCard, search filter, registration form, reducer, error boundary                                   |
| 45    | `v45-campushub-v2` | `build`/`preview` scripts, Vercel SPA rewrite, README run section (CampusHub v2: the React app)                                        |
| 46    | `v46-node-npm`     | `server/` package with a first Node script; npm workspaces with one root lockfile                                                      |
| 47    | `v47-core-modules` | `server/scripts/report.js` reads `events.json` with `fs/promises` and `path`, writes a summary report                                  |
| 48    | `v48-express`      | Express app: `GET /api/health`, `GET /api/events`; `app.js` / `server.js` split; `node --watch`; one `npm run dev` for both            |
| 49    | `v49-rest-design`  | `docs/api-contract.md`: endpoints, auth levels, status codes, one error shape (docs only)                                              |
| 50    | `v50-routing`      | `express.Router`, routes → controllers → services; events CRUD on an in-memory array with filters; `/api/v1`                           |
| 51    | `v51-middleware`   | Request logger (morgan), helmet, CORS allowlist with credentials, 404 handler, four-argument error handler                             |

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
