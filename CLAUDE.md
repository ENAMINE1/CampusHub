# CampusHub: conventions for Claude Code

`SPEC.md` decides what to build; never edit it. The course videos decide the order.

## Commits and tags

- Message format: `<type>(<scope>): V<NN> <what>`, e.g. `feat(client): V35 search and category filter as state`.
- One or two commits per video; tag the last one `vNN-topic` (e.g. `v35-usestate`).
- Every commit runs: the app starts, `npm run lint` passes, tests pass.
- Add the video's row to the README "Course map".

## Code style

- JavaScript only, ES modules (`"type": "module"`). No TypeScript.
- About 150 changed lines per video; components and other modules under 150 lines.
- Plain code: no barrel `index.js`, no HOCs, factories, base classes or DI.
- Every file starts with a one-to-two line comment saying what it is for. Comments explain why.
- Use a concept only from the video that teaches it onward (no Context before V41, no Router before V39, no database before V59).
- Tailwind utility classes in JSX; only a few `@theme` colour tokens.
- Add a dependency only in the video that needs it, pinned to an exact version checked with `npm view`.
- No secrets in git: only `.env.example`. No stray `console.log` besides startup messages.
