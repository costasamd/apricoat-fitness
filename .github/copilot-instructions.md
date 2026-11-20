# Apricot Fitness Center – Copilot Instructions

## Project

All-in-one fitness platform: coaching, custom fitness plans, and a gym-gear store.
The source of truth for features is `specs/001-apricot-fitness/spec.md`. Build Phase 1 (MVP) first.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS 4 for all styling (no CSS modules)
- Database: PostgreSQL (relational)
- Auth: Auth.js (email + password credentials, session-based)
- Next.js 16 has breaking changes. Check `node_modules/next/dist/docs/` before using Next APIs.

## Project structure

- Pages: `app/<route>/page.tsx`
- API routes: `app/api/<resource>/route.ts` (e.g. `app/api/plans/route.ts`)
- Components: `components/` at the project root, one PascalCase component per file
  (e.g. `components/MemberCard.tsx`)

## Data model

- Roles: `member`, `coach`, `admin`. Public sign-up only creates `member`.
  Coach and admin accounts are created by an admin or seeded in the database.
- Member: profile, goals, training preferences, optional `coachId`, account status
- FitnessPlan: title, description, schedule, exercises, target outcomes, `memberId`
- Goals and preferences are part of the member profile
  (saved with `PATCH /api/users/:id`, read with `GET /api/users/me`).
- Workout and WorkoutExercise: part of a FitnessPlan (MVP)
- Product, Order: Phase 2 (don't build yet)

## Phase 1 API endpoints

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`
- `GET /api/users/me`, `GET /api/users`, `GET /api/users/:id`, `PATCH /api/users/:id`
- `POST /api/plans`, `GET /api/plans/:id`, `GET /api/plans?memberId=:memberId`

## Access rules

- Members see only their own data.
- Coaches see only members whose `coachId` matches theirs, and only those members' plans.
- Only coaches create plans. Only admins can set `coachId`.
- Unauthenticated → 401; wrong role/owner → 403; login errors stay generic.

## Naming

- camelCase for fields and variables (`coachId`, `memberId`, `createdAt`)
- PascalCase for components and types (`FitnessPlan`, `MemberCard`)

## Code style

- Prettier: 4-space indent, no semicolons, double quotes, trailing commas (es5)
- Prefer Server Components; add "use client" only when needed
- Validate all request input on the server and return clear error messages

## Testing

- No test framework is set up yet. Until the team adds one, check every change with:
    - `npm run lint` (ESLint)
    - `npx tsc --noEmit` (TypeScript type check)
    - `npm run build` (production build must pass)
- Planned (not installed yet): unit tests in `tests/unit/` and end-to-end tests in `tests/e2e/`.
  Don't install a test framework or add test files unless the task asks for it.
- For every feature, test the happy path and the main failure path:
    - Valid input → success and the saved data appears
    - Invalid input → 400 with a clear message
    - Not logged in → 401
    - Wrong role or not the owner → 403
    - Record not found → 404
- Before opening a pull request, check the feature against its GitHub issue's acceptance criteria.
- Test access rules with the three seed accounts (member, coach, admin): each role sees only what it should.
- Never use real passwords or real member data in tests or seed files.
