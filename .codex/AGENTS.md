# AGENTS.md

## Project

Split Bill & Tracking web app.

## Source of Truth

Read before implementation:

* `docs/MVP_V0.md`
* `docs/PROD_SPEC.md`
* `docs/GITHUB_ISSUES.md`

If these files conflict:

* `docs/PROD_SPEC.md` wins for implementation details
* `docs/MVP_V0.md` defines product scope

## Workflow

Work by one GitHub issue at a time.

Required flow:

```txt
01-collect -> 02-analyze -> 03-plan -> 04-execute -> 05-review
```

Each run must focus on exactly one issue.

## Tech Stack

* Next.js full-stack application
* TypeScript strict
* React
* Tailwind CSS
* shadcn/ui for UI components
* Radix UI primitives
* MongoDB Atlas
* Zod for all data validation
* Jest for all tests
* React Testing Library for component tests when needed
* Vercel for deployment

## Architecture

Use Next.js for both frontend and backend.

Recommended structure:

```txt
src/
  app/
  components/
    base/
    app/
  domain/
    split/
      splitEqual.ts
      calculateBalance.ts
      calculateOwesWho.ts
  lib/
    db/
      mongodb.ts
    auth/
      currentUser.ts
      session.ts
    access/
      tripAccess.ts
    validation/
      userSchemas.ts
      tripSchemas.ts
      billSchemas.ts
      settlementSchemas.ts
    errors/
      apiErrors.ts
  server/
    repositories/
    services/
  types/
```

## MVP V0 Scope

Implement only:

* User management by `phoneNumber` and `displayName`
* Create Trip
* Join Trip by `joinCode`
* Member-only Trip access
* Trip members
* Add Bill
* Equal split only
* View Trip Balance
* View Who Owes Who
* Add Settlement

## Issue Scope Rules

For every issue:

* Use exactly one GitHub issue as input.
* Stay within that issue.
* Do not implement adjacent features.
* Do not refactor unrelated files.
* If the issue is too broad, stop and split it.
* If required context is missing, ask for it during Collect.
* If the issue conflicts with specs, state the conflict and stop implementation until resolved.

## UI Rules

* Use shadcn/ui components when suitable.
* Prefer Radix primitives for accessibility and interactions.
* Keep UI mobile-first and touch-friendly.
* Keep components small and composable.
* Keep business logic separate from UI.

## Validation Rules

Use Zod for all input validation.

Required:

* API request bodies must be validated with Zod.
* API route params should be validated where practical.
* Shared validation schemas should live under `src/lib/validation/`.
* Do not hand-roll validation logic when Zod can express it clearly.
* Convert Zod errors to the shared API error format.

## Testing Rules

Use Jest for all tests.

Required:

* Unit tests must use Jest.
* Component tests, if needed, should use Jest + React Testing Library.
* Do not introduce Vitest.
* Do not mix test frameworks.
* Core domain logic must have Jest tests.

Minimum tests across MVP:

```txt
src/domain/split/splitEqual.test.ts
src/domain/split/calculateBalance.test.ts
src/domain/split/calculateOwesWho.test.ts
```

## Access Control

Every Trip-scoped API must check:

```ts
isTripMember(currentUserId, tripId)
```

Return `403 Forbidden` if the current user is not an active member.

## Must

* Keep implementation minimal and readable.
* Use server-side validation and access checks.
* Use MongoDB indexes defined in `docs/PROD_SPEC.md`.
* Handle money as integer VND amounts.
* Return consistent API errors.
* Prefer reusable domain logic over duplicated logic.
* Avoid unnecessary abstractions.

## Must Not

* Do not add login/register complexity beyond MVP V0 lightweight session.
* Do not add multi-currency.
* Do not add advanced split types.
* Do not add receipt upload.
* Do not add OCR.
* Do not add payment gateway.
* Do not add real-time collaboration.
* Do not add analytics dashboards.
* Do not add role permission complexity beyond `owner` and `member`.
* Do not implement features outside `docs/MVP_V0.md`.
* Do not introduce Vitest or another test framework.

## Environment Variables

```txt
MONGODB_URI=
MONGODB_DB_NAME=
SESSION_COOKIE_NAME=split_bill_session
SESSION_SECRET=
NEXT_PUBLIC_APP_NAME=Split Bill
```

## Definition of Done

A task is done only when:

* The selected issue is implemented.
* The change stays within issue scope.
* TypeScript has no errors.
* Relevant Jest tests pass.
* Zod validation is used for new API inputs.
* Member-only access is preserved.
* No unrelated feature or refactor is introduced.
* Implementation remains deployable to Vercel with MongoDB Atlas.
