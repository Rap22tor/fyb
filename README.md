# FYP - Study group finder
A study group finder application as the final project for the Advanced Web Programming course @ SeoulTech.

## Architecture

Fullstack application (Frontend + Backend + Database)

- **Frontend**: React + Vite / TypeScript, styled with Tailwind CSS
- **Backend** Node.js + ExpressAPI / TypeScript
- **Database** SQLite

Automated testing of all backend code, as well as 
end-to-end tests for major interactions and security 
relevant code.

A CI pipline will be set up to run automated testing on
every merge. 

Auth is handled by a custom implementation using express
sessions with bycrpt. This is not production grade and 
should usually not be done, but for this type of project
and to learn how this stuff works, this is fine.

### Requirements

- Node 25.8

### Additional requirements set by the course:
- **Safe SQL** Every query uses parameters ( ?
placeholders). No user input is ever
concatenated into SQL.
- **Status Codes** Correct codes for each outcome: 200,
201, 400, 401, 403 or 404, 409, 500.
- **Registration** Server-side validation of every field;
duplicate email returns 409.
- **Password storage** Passwords hashed with bcrypt (cost
10 or more). Never stored or logged in
plaintext.
- **Sessions** express-session with an httpOnly, sameSite
cookie; session regenerated on login and destroyed on
logout. Same error message for unknown email and wrong 
password.
- **Authentication** A requireAuth middleware protects
every private route (401 when not signed in). 
- **Authorization** Every read, update and delete is
filtered by the session's userId. owner_id is never 
taken from the browser. Another user's record returns 403 
or 404
- **Frontend Pages** use fetch() for every API call,
show the server's messages, and insert user data with 
textContent, not innerHTML.
- **Secrets an repo** SESSION_SECRET (32+ characters)
in .env; .env, node_modules and the database file listed 
in .gitignore. Code in a GitHub repository.

## Development

### First-time setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in `SESSION_SECRET` (at least 32
   characters). You can generate one with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   The server refuses to start if the secret is missing or too short.
   `.env` is gitignored, never commit it.

The SQLite database file is created automatically at `DB_PATH`
(default `./data/app.db`) on first start.

### Running with live reload

```bash
npm run dev
```

This starts two processes side by side:

| Process | URL | What it does |
|---|---|---|
| Vite dev server (`web`) | http://localhost:5173 | Serves the React client with hot reload. **Open this one while developing.** |
| Express API (`api`) | http://localhost:3000 | Runs the backend with `tsx watch`, which restarts on changes in `src/server`. |

Vite proxies every `/api` request to Express, so the browser only talks to
port 5173 and session cookies stay same-origin.

> Port 3000 also serves a copy of the client, but that is the last production
> build from `dist/client`. It does not reload when you edit files. If your
> changes do not show up, you are probably looking at port 3000.

### Production mode

```bash
npm start
```

Builds the client once (`vite build`) and serves it together with the API from
a single port (http://localhost:3000). There is no file watching in this mode,
so restart it after every change. This is the mode the course expects
(`npm install` and `npm start`).

### Other scripts

| Command | Purpose |
|---|---|
| `npm test` | Run all tests once (Vitest) |
| `npm run test:security` | Run only the security tests in `tests/security` |
| `npm run typecheck` | Type-check client, server and tests with `tsc` |
| `npm run build` | Build the client into `dist/client` |
| `npm run lint` | Lint with ESLint (`npm run lint:fix` applies auto-fixes) |
| `npm run format` | Format with Prettier (`npm run format:check` only checks) |

## Credits and reuse

- `src/client/src/api.ts`: the typed `get` / `post` / `put` / `patch` / `del`
  helpers, the query string builder and the error class are adapted from
  `BackendRaw.ts`, a fetch wrapper from an earlier personal project by
  @Rap22tor. What changed for this project: the Auth0 bearer token and the
  `BACKEND_URL` prefix were dropped (we use same-origin session cookies), errors
  carry the server's own message, and only JSON is handled.

## Features

- **User Authentication & Session Management**: Secure registration and login using `bcrypt` password hashing and cookie-based sessions (`express-session` with `httpOnly` and `sameSite` configuration).
- **Group Catalog & Discovery**: Browse public and private study groups, with advanced filtering and real-time search by title/tags.
- **Flexible Group Management**: 
  - Create public or private study groups with custom capacity limits and unique invite links.
  - Direct member addition via system usernames or invite links, with pending request approvals for private groups.
- **Interactive Study Sessions**: Admins can schedule, update, or remove upcoming study sessions (including date, time, and conference links) for group members.
- **Group Discussions**: Integrated comment sections allowing members to collaborate, share resources, and communicate within their groups (with strict access privacy for private groups).
- **Robust Access Control**: Comprehensive ownership and membership checks ensuring that only authorized administrators can modify group settings, manage participants, or handle sessions.

## AI Usage

In accordance with the rules set out by the professor for this project, AI was used responsibly in the development
of this project. AI was used to validate architecture decisions, discuss ideas and generate boilerplate code.
All code in the final product was either hand-written or validated by the team members themselves.

Tools used:
- Claude Code
- Gemini