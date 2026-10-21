# Code review checklist

Use this when you review a teammate's pull request (and before you open your own).
Review the change, not the person: ask questions, suggest, and say what is good too.

## 1. Understand it first

- [ ] I read the PR description and know what problem it solves.
- [ ] I pulled the branch and ran it (`npm install`, `npm run dev`), or the change is docs only.
- [ ] The PR does one thing. If it mixes a feature with a big refactor, ask to split it.

## 2. Correctness

- [ ] It does what the description says, including the unhappy paths (empty, invalid, full, expired).
- [ ] Errors use the one shape `{ error: { code, message, details } }` with the right status.
- [ ] Async code awaits what it should; no unhandled promise or forgotten `await`.
- [ ] React: effects clean up (abort, unsubscribe); lists have stable keys; no state that could be derived.
- [ ] Database: writes that race are atomic (`findOneAndUpdate` with a condition, unique indexes).

## 3. Security

- [ ] Every new route checks who you are (401) and what you may do (403) **on the server**.
- [ ] Every id in the URL is checked for ownership, not just existence.
- [ ] Request bodies and queries go through a Zod schema; nothing raw reaches MongoDB.
- [ ] No secrets in code or git; new settings go into `.env.example` with a comment.
- [ ] Nothing personal (emails, tokens) is logged, cached publicly, or put in a URL.

## 4. Tests

- [ ] New behaviour has a test that fails without the change.
- [ ] Tests check behaviour (status codes, what the user sees), not implementation details.
- [ ] `npm run lint` and `npm test` pass on the branch.

## 5. Readability

- [ ] Names say what things are; each file starts with a short "what this is for" comment.
- [ ] Comments explain _why_, not _what_.
- [ ] Components stay under about 80 lines, other modules under about 120.
- [ ] No dead code, commented-out code or stray `console.log`.

## 6. User experience (UI changes)

- [ ] Works at phone, tablet and desktop width, in light and dark mode.
- [ ] Usable with the keyboard alone; focus is visible; form errors are announced.
- [ ] Loading, empty and error states exist.

## Writing comments

- Prefix optional ideas with **nit:** so the author knows they are not blockers.
- Ask instead of tell: "What happens if two students click at once?"
- Approve when it is better than before and safe, not when it is perfect.
