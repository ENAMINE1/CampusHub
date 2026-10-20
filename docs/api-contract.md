# CampusHub API contract

The agreement between the React client and the Express API. Write it before the code, and
change it on purpose (with the client and tests) rather than by accident. Source: `SPEC.md`,
"API contract".

## Conventions

- **Base path:** `/api/v1`. The version lives in the URL so a future `/api/v2` can change
  shapes without breaking old clients.
- **JSON only:** requests send `Content-Type: application/json`, except the poster upload (multipart).
- **Nouns, not verbs:** `/events/:id/registrations`, not `/registerForEvent`. The HTTP method is the verb.
- **Ids** are strings. Dates are ISO 8601 strings (`2026-11-10T10:30:00.000Z`).

## Who can call what

| Label  | Meaning                                                    |
| ------ | ---------------------------------------------------------- |
| Public | Anyone, no login                                           |
| Cookie | Needs the httpOnly refresh-token cookie                    |
| Auth   | Any logged-in user (`Authorization: Bearer <accessToken>`) |
| Owner  | A club admin of the event's club, or an admin              |
| Admin  | Users with the `admin` role                                |

Missing or invalid token → **401 Unauthorized**. Valid token without permission → **403 Forbidden**.

## Endpoints

| Method | Path                         | Auth           | Success | Notes                                                                |
| ------ | ---------------------------- | -------------- | ------- | -------------------------------------------------------------------- |
| GET    | /health                      | Public         | 200     | `{ status, uptime, db }`                                             |
| POST   | /auth/register               | Public         | 201     | 409 duplicate email, 422 invalid body                                |
| POST   | /auth/login                  | Public         | 200     | Sets refresh cookie; rate-limited to 5 per 15 min per IP             |
| POST   | /auth/refresh                | Cookie         | 200     | New access token                                                     |
| POST   | /auth/logout                 | Auth           | 204     | Clears cookie                                                        |
| GET    | /auth/me                     | Auth           | 200     | Current user                                                         |
| GET    | /events                      | Public         | 200     | Query: `page, limit, sort, category, club, q, when=upcoming or past` |
| GET    | /events/:id                  | Public         | 200     | Club populated, `seatsLeft`                                          |
| POST   | /events                      | Owner          | 201     | Body validated with Zod                                              |
| PATCH  | /events/:id                  | Owner          | 200     | Partial update                                                       |
| DELETE | /events/:id                  | Owner          | 204     | Cascades registrations                                               |
| POST   | /events/:id/poster           | Owner          | 200     | multipart field `poster`                                             |
| POST   | /events/:id/registrations    | Auth (student) | 201     | 409 duplicate, 422 full or past deadline                             |
| DELETE | /events/:id/registrations/me | Auth           | 204     | Cancel own registration                                              |
| GET    | /events/:id/registrations    | Owner          | 200     | Registrant list                                                      |
| GET    | /me/registrations            | Auth           | 200     | Query `when=upcoming or past`                                        |
| GET    | /me/favorites                | Auth           | 200     | Populated events                                                     |
| PUT    | /me/favorites/:eventId       | Auth           | 204     | Idempotent add                                                       |
| DELETE | /me/favorites/:eventId       | Auth           | 204     | Idempotent remove                                                    |
| GET    | /clubs                       | Public         | 200     |                                                                      |
| GET    | /clubs/:slug                 | Public         | 200     | With upcoming events                                                 |
| POST   | /clubs                       | Admin          | 201     |                                                                      |
| PATCH  | /clubs/:id                   | Admin          | 200     | Includes `adminEmails`                                               |
| GET    | /admin/stats                 | Admin          | 200     | Registrations per event and per category                             |

### `GET /events` query parameters

| Param      | Values                                                                | Default |
| ---------- | --------------------------------------------------------------------- | ------- |
| `page`     | 1, 2, 3…                                                              | 1       |
| `limit`    | 1–50                                                                  | 12      |
| `sort`     | `date`, `title`                                                       | `date`  |
| `category` | `tech`, `cultural`, `sports`, `workshop`, `career`, `social`, `other` | all     |
| `club`     | club id                                                               | all     |
| `q`        | text searched in title and description                                | none    |
| `when`     | `upcoming`, `past`                                                    | all     |

The list response is `{ "data": [...events], "page": 1, "totalPages": 2, "total": 24 }`.

## Status codes we use

| Code                      | When                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| 200 OK                    | A read or update succeeded                                               |
| 201 Created               | Something new was created (`POST`)                                       |
| 204 No Content            | Success with nothing to send back (delete, logout, favorites)            |
| 400 Bad Request           | Malformed JSON                                                           |
| 401 Unauthorized          | Not logged in, or the token is invalid or expired                        |
| 403 Forbidden             | Logged in, but not allowed                                               |
| 404 Not Found             | The resource or route does not exist (`NOT_FOUND`)                       |
| 409 Conflict              | Duplicate email, already registered                                      |
| 422 Unprocessable Content | Valid JSON that breaks the rules (validation, event full, past deadline) |
| 429 Too Many Requests     | Rate limit hit                                                           |
| 500 Internal Server Error | A bug on our side; details go to the server log, never the response      |

## One error shape everywhere

Every error response has this body, whatever went wrong:

```json
{ "error": { "code": "EVENT_FULL", "message": "This event is full.", "details": [] } }
```

- `code`: a stable, machine-readable string the client can switch on.
- `message`: a human-readable sentence safe to show users.
- `details`: field errors for 422 validation failures, otherwise `[]`.

Stack traces are logged on the server and never sent to clients.

## Real-time (Socket.IO)

- The client emits `event:join` with an event id to join that event's room.
- After every registration or cancellation, the server emits `event:seats` with
  `{ eventId, seatsLeft }` to that room.
