# Verifying AI-written code

AI can write a lot of plausible code very fast. Plausible is not the same as correct. This is the
protocol for every change where AI helped, followed by a prompt you can reuse to get an AI review
of your own diff. The AI is a second reviewer, never the only one, and never the last word.

## The protocol

1. **Predict first.** Before you run AI code, write down what you expect it to do and one way it
   could go wrong. If you cannot predict it, you do not understand it yet: ask for an explanation.
2. **Read every line.** Mark anything you could not have typed yourself. Ask "why is this here?"
   until nothing is marked. Delete what nobody can justify.
3. **Check it against the source of truth.** `SPEC.md` decides behaviour; the API contract decides
   shapes and status codes. AI often invents a field, a status code or an option that does not exist.
4. **Verify the APIs it used.** Look up every library call in the official docs for the version in
   `package.json`. Old answers for old versions are the most common AI bug.
5. **Run it, then break it.** Try the happy path, then empty input, wrong types, no login, someone
   else's id, two requests at once. Each bug you find becomes a test.
6. **Tests must fail first.** Revert the fix and watch the test go red. A test that passes either way
   proves nothing (AI loves writing those).
7. **Security pass.** Use the Security section of [review-checklist.md](review-checklist.md):
   server-side auth, ownership, validation, no secrets, nothing personal in logs or URLs.
8. **Log it.** Add a line to `AI_LOG.md`: what you asked, what you learned, what you changed yourself.

## Red flags in AI code

- New dependencies you did not ask for, or a version number that does not exist (`npm view <pkg>`).
- Checks done only in React ("hide the button") with nothing on the server.
- `try { ... } catch {}` that swallows errors, or `console.log` left behind.
- Read-then-write logic where two requests can race (counters, seats, unique names).
- Tests that mock the very thing they claim to test.
- Confident comments that describe something the code does not do.

## Reusable review prompt

Paste this into your AI assistant together with the output of `git diff main`:

```text
You are reviewing a pull request for CampusHub, a MERN app (React 19, Express 5, Mongoose 9, Zod).
SPEC.md is the source of truth. Review ONLY the diff below.

Report, most severe first:
1. Bugs: wrong behaviour, missed edge cases (empty, invalid, full, expired, concurrent requests).
2. Security: missing server-side auth (401) or permission (403) checks, ownership of ids,
   unvalidated input reaching MongoDB, secrets, personal data in logs, caches or URLs.
3. Tests: behaviour that changed without a test, or tests that would pass without the change.
4. Readability: unclear names, comments that explain "what" instead of "why", dead code.

For each finding give: file and line, what goes wrong with a concrete example input, and a
minimal fix. If you are not sure, say so instead of guessing. Do not rewrite the whole file,
do not suggest new libraries, and do not comment on formatting (Prettier handles it).

<diff>
PASTE THE DIFF HERE
</diff>
```

Then treat every finding like a teammate's comment: check it yourself before you act on it.
Some will be wrong. Write down in the PR which ones you accepted and why.
