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
npm run lint
cd client
npm install
npm run dev
```

The React app opens at http://localhost:5173.

## Course map

| Video | Tag               | What it added                                                                                      |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------- |
| 4, 7  | `v07-foundation`  | Git ignore rules, ESLint + Prettier, `.nvmrc`, README, AI log                                      |
| 32    | `v32-vite-setup`  | Vite + React app in `client/` with Tailwind 4 and a CampusHub heading                              |
| 33    | `v33-components`  | `Header`, `Footer`, `EventCard` components, brand colour tokens in `@theme`                        |
| 34    | `v34-props-lists` | Sample `events.js`, `EventList` with keys, `EmptyState`, "Full" vs seats-left rendering            |
| 35    | `v35-usestate`    | Search, category filter and favorites in `useState`; filtered list derived, not stored             |
| 36    | `v36-forms`       | Controlled `RegistrationForm` with one state object, blur and submit validation, accessible errors |

## Stack (exact installed versions)

| Tool                           | Version |
| ------------------------------ | ------- |
| Node.js                        | 24.22.0 |
| npm                            | 12.2.0  |
| eslint                         | 10.13.0 |
| prettier                       | 3.9.10  |
| react, react-dom               | 19.2.9  |
| vite                           | 8.3.4   |
| @vitejs/plugin-react           | 6.1.2   |
| tailwindcss, @tailwindcss/vite | 4.3.3   |
