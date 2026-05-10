# GITHUB_ISSUES.md — MVP V0 Feature Breakdown

Fixed technical choices:

```txt
Validation: Zod
Testing: Jest
```

Each issue should have: type label, area label when applicable, priority, status, and `codex-ready` when scoped.

# Phase 0 — Project Foundation

## Issue 01 — Initialize Next.js app structure

Labels:

```txt
type:infra
priority:high
status:todo
codex-ready
good-first-issue
```

Scope:
- Create recommended folder structure.
- Add TypeScript strict config if missing.
- Add MUI setup.
- Add base app shell.
- Add placeholder pages for `/`, `/trips`, and `/trips/[tripId]`.

Acceptance Criteria:
- App starts locally.
- TypeScript compiles.
- Basic pages render.
- No business feature is implemented yet.

---

## Issue 02 — Add MongoDB Atlas connection utility

Labels:

```txt
type:backend
type:infra
priority:high
status:todo
codex-ready
```

Scope:
- Add `src/lib/db/mongodb.ts`.
- Read `MONGODB_URI` and `MONGODB_DB_NAME`.
- Cache the MongoDB client across invocations.
- Add safe error handling for missing env vars.

Acceptance Criteria:
- Server code can get DB instance.
- No MongoDB connection is created unnecessarily per request.
- No secret is exposed to frontend.

---

## Issue 03 — Add shared API error helpers

Labels:

```txt
type:backend
priority:medium
status:todo
codex-ready
good-first-issue
```

Scope:
- Add API error types.
- Add helper for JSON error responses.
- Add helper to convert Zod validation errors to `VALIDATION_ERROR`.

Acceptance Criteria:
- API routes can return consistent error shape.
- Zod errors can be returned in the shared format.

---

## Issue 04 — Configure Jest test setup

Labels:

```txt
type:infra
type:test
priority:high
status:todo
codex-ready
good-first-issue
```

Scope:
- Add Jest dependencies/config if missing.
- Add `jest.config.ts`.
- Add `jest.setup.ts` if needed.
- Add test script.
- Ensure TypeScript tests can run.

Acceptance Criteria:
- `npm test` or equivalent runs Jest.
- TypeScript test files are supported.
- No Vitest dependency/config is introduced.

# Phase 1 — User Session

## Issue 05 — Backend: create lightweight user session API

Labels:

```txt
type:backend
area:user
priority:high
status:todo
codex-ready
```

Scope:
- Add Zod user validation schema.
- Add user repository/service.
- Add `POST /api/users/session`.
- Add `GET /api/users/me`.
- Store current user in HTTP-only cookie/session.

Acceptance Criteria:
- Existing user is found by `phoneNumber`.
- New user is created when `phoneNumber` does not exist.
- `phoneNumber` is unique.
- Session cookie is HTTP-only.
- Request body is validated with Zod.

---

## Issue 06 — Frontend: create user setup screen

Labels:

```txt
type:frontend
area:user
priority:high
status:todo
codex-ready
```

Scope:
- Create `UserSetupForm`.
- Add form to `/`.
- Submit to `POST /api/users/session`.
- Redirect/show trips page after success.
- Display validation/API errors.

Acceptance Criteria:
- User can create/resume session.
- Required fields are validated.
- Error message is understandable.

# Phase 2 — Trips

## Issue 07 — Backend: create trip API

Labels:

```txt
type:backend
area:trip
priority:high
status:todo
codex-ready
```

Scope:
- Add Zod create trip validation schema.
- Add `POST /api/trips`.
- Generate unique random `joinCode`.
- Add creator as owner TripMember.

Acceptance Criteria:
- Authenticated user can create Trip.
- Trip has unique `joinCode`.
- Creator becomes active owner member.
- Request body is validated with Zod.

---

## Issue 08 — Backend: list current user's trips

Labels:

```txt
type:backend
area:trip
priority:high
status:todo
codex-ready
```

Scope:
- Add `GET /api/trips`.
- Query `trip_members` by current user.
- Return related Trips.

Acceptance Criteria:
- User sees only their Trips.
- Non-member Trips are not returned.
- Unauthenticated request gets `401`.

---

## Issue 09 — Backend: join trip by joinCode

Labels:

```txt
type:backend
area:trip
priority:high
status:todo
codex-ready
```

Scope:
- Add Zod join trip validation schema.
- Add `POST /api/trips/join`.
- Normalize `joinCode`.
- Create TripMember if needed.

Acceptance Criteria:
- Valid `joinCode` adds user as active member.
- Invalid `joinCode` returns `404`.
- Existing member does not create duplicate.
- Request body is validated with Zod.

---

## Issue 10 — Backend: trip detail and member-only access helper

Labels:

```txt
type:backend
area:trip
priority:high
status:todo
codex-ready
```

Scope:
- Add `isTripMember(currentUserId, tripId)`.
- Add helper to require active Trip member.
- Add `GET /api/trips/:tripId`.
- Add `GET /api/trips/:tripId/members`.

Acceptance Criteria:
- Active member can view Trip detail.
- Non-member gets `403`.
- Removed member gets `403`.

---

## Issue 11 — Frontend: trips list page

Labels:

```txt
type:frontend
area:trip
priority:high
status:todo
codex-ready
```

Scope:
- Implement `/trips`.
- Fetch `GET /api/trips`.
- Render Trip cards.
- Add empty state.

Acceptance Criteria:
- User sees their Trips.
- Empty state is clear.
- Trip cards link to detail page.

---

## Issue 12 — Frontend: create trip dialog

Labels:

```txt
type:frontend
area:trip
priority:high
status:todo
codex-ready
```

Scope:
- Add `CreateTripDialog`.
- Submit to `POST /api/trips`.
- Refresh trips list after success.
- Show validation/API errors.

Acceptance Criteria:
- User can create Trip.
- New Trip appears in list.
- Required name validation works.

---

## Issue 13 — Frontend: join trip dialog

Labels:

```txt
type:frontend
area:trip
priority:high
status:todo
codex-ready
```

Scope:
- Add `JoinTripDialog`.
- Submit to `POST /api/trips/join`.
- Navigate to Trip detail after success.

Acceptance Criteria:
- User can join valid Trip.
- Invalid Trip code shows friendly error.
- Already-member flow works.

---

## Issue 14 — Frontend: trip detail shell

Labels:

```txt
type:frontend
area:trip
priority:medium
status:todo
codex-ready
```

Scope:
- Implement `/trips/[tripId]`.
- Fetch Trip detail and members.
- Display Trip name, joinCode, and members.
- Add placeholders for bills, balance, owes-who, settlements.

Acceptance Criteria:
- Member can view Trip detail.
- Join code is visible for sharing.
- No bill/balance feature is implemented yet.

# Phase 3 — Split Logic

## Issue 15 — Domain: equal split utility

Labels:

```txt
type:domain
type:test
area:bill
priority:high
status:todo
codex-ready
good-first-issue
```

Scope:
- Add `splitEqual(amount, userIds)`.
- Sort userIds before assigning remainder.
- Add Jest unit tests.

Acceptance Criteria:
- Positive integer amount is split fully.
- Remainder is distributed deterministically.
- Empty user list is rejected.
- Jest tests pass.

---

## Issue 16 — Domain: balance calculation

Labels:

```txt
type:domain
type:test
area:balance
priority:high
status:todo
codex-ready
```

Scope:
- Add `calculateBalance`.
- Add Jest unit tests.

Acceptance Criteria:
- Bills increase payer balance and decrease split user balance.
- Settlements reduce debt correctly.
- Fully settled trip returns zero balances.
- Jest tests pass.

---

## Issue 17 — Domain: who owes who calculation

Labels:

```txt
type:domain
type:test
area:balance
priority:high
status:todo
codex-ready
```

Scope:
- Add `calculateOwesWho`.
- Match debtors to creditors.
- Add Jest unit tests.

Acceptance Criteria:
- Returns payer/payee suggestions.
- Handles multiple debtors and creditors.
- Produces no suggestions for settled trip.
- Jest tests pass.

# Phase 4 — Bills

## Issue 18 — Backend: create bill API

Labels:

```txt
type:backend
area:bill
priority:high
status:todo
codex-ready
```

Scope:
- Add Zod bill validation schema.
- Add `POST /api/trips/:tripId/bills`.
- Use `splitEqual`.
- Store `paidBy[]` and computed `splits[]`.

Acceptance Criteria:
- Member can create Bill.
- Non-member gets `403`.
- Sum of splits equals amount.
- Request body is validated with Zod.

---

## Issue 19 — Backend: list bills API

Labels:

```txt
type:backend
area:bill
priority:medium
status:todo
codex-ready
```

Scope:
- Add `GET /api/trips/:tripId/bills`.
- Enforce member-only access.
- Sort by `billDate` descending or `createdAt` descending.

Acceptance Criteria:
- Member can list bills.
- Non-member gets `403`.

---

## Issue 20 — Frontend: add bill dialog

Labels:

```txt
type:frontend
area:bill
priority:high
status:todo
codex-ready
```

Scope:
- Add `AddBillDialog`.
- Fields: title, amount, paidBy, split between, date, note.
- Submit to create bill API.

Acceptance Criteria:
- User can create equal-split Bill.
- Required fields are validated.
- API errors are shown.

---

## Issue 21 — Frontend: bill list

Labels:

```txt
type:frontend
area:bill
priority:medium
status:todo
codex-ready
```

Scope:
- Add `BillList`.
- Fetch `GET /api/trips/:tripId/bills`.
- Show title, amount, payer, date.

Acceptance Criteria:
- Bills render clearly.
- Empty state is clear.

# Phase 5 — Balance and Who Owes Who

## Issue 22 — Backend: trip balance API

Labels:

```txt
type:backend
area:balance
priority:high
status:todo
codex-ready
```

Scope:
- Add `GET /api/trips/:tripId/balance`.
- Load active members, bills, settlements.
- Use `calculateBalance`.

Acceptance Criteria:
- Member can view balances.
- Non-member gets `403`.
- Balances reflect bills and settlements.

---

## Issue 23 — Backend: who owes who API

Labels:

```txt
type:backend
area:balance
priority:high
status:todo
codex-ready
```

Scope:
- Add `GET /api/trips/:tripId/owes-who`.
- Compute balances.
- Use `calculateOwesWho`.

Acceptance Criteria:
- Member can view suggestions.
- Non-member gets `403`.
- Settled Trip returns empty list.

---

## Issue 24 — Frontend: balance summary

Labels:

```txt
type:frontend
area:balance
priority:high
status:todo
codex-ready
```

Scope:
- Add `BalanceSummary`.
- Fetch balance API.
- Show positive, negative, and zero states clearly.

Acceptance Criteria:
- Users can understand who owes and who is owed.
- Empty/zero state is clear.

---

## Issue 25 — Frontend: who owes who list

Labels:

```txt
type:frontend
area:balance
priority:high
status:todo
codex-ready
```

Scope:
- Add `OwesWhoList`.
- Fetch owes-who API.
- Show `from -> to` and amount.

Acceptance Criteria:
- Suggestions render clearly.
- Settled Trip shows empty state.

# Phase 6 — Settlements

## Issue 26 — Backend: create settlement API

Labels:

```txt
type:backend
area:settlement
priority:high
status:todo
codex-ready
```

Scope:
- Add Zod settlement validation schema.
- Add `POST /api/trips/:tripId/settlements`.
- Enforce current user member access.
- Enforce from/to users are active members.

Acceptance Criteria:
- Member can create Settlement.
- Non-member gets `403`.
- fromUser and toUser must be different.
- Request body is validated with Zod.

---

## Issue 27 — Backend: list settlements API

Labels:

```txt
type:backend
area:settlement
priority:medium
status:todo
codex-ready
```

Scope:
- Add `GET /api/trips/:tripId/settlements`.
- Enforce member-only access.
- Sort by `settledAt` descending or `createdAt` descending.

Acceptance Criteria:
- Member can list settlements.
- Non-member gets `403`.

---

## Issue 28 — Frontend: add settlement dialog

Labels:

```txt
type:frontend
area:settlement
priority:high
status:todo
codex-ready
```

Scope:
- Add `AddSettlementDialog`.
- Fields: from, to, amount, date, note.
- Submit to settlement API.

Acceptance Criteria:
- User can create settlement.
- Required fields are validated.
- from and to cannot be same.

---

## Issue 29 — Frontend: settlement list

Labels:

```txt
type:frontend
area:settlement
priority:medium
status:todo
codex-ready
```

Scope:
- Add `SettlementList`.
- Fetch settlements API.
- Show from, to, amount, date.

Acceptance Criteria:
- Settlements render clearly.
- Empty state is clear.

# Phase 7 — Final Integration

## Issue 30 — Integration: refresh Trip detail after mutations

Labels:

```txt
type:frontend
area:trip
priority:medium
status:todo
codex-ready
```

Scope:
- Refresh relevant frontend data after creating bill.
- Refresh relevant frontend data after creating settlement.

Acceptance Criteria:
- After adding Bill, bills, balance, and owes-who update.
- After adding Settlement, settlements, balance, and owes-who update.

---

## Issue 31 — Review: MVP V0 access control, Zod validation, and Jest tests pass

Labels:

```txt
type:test
priority:high
status:todo
codex-ready
```

Scope:
- Check all Trip-scoped APIs enforce member-only access.
- Check API inputs use Zod schemas.
- Check consistent error responses.
- Add missing Jest tests where practical.

Acceptance Criteria:
- Non-member cannot access Trip-scoped APIs.
- API input validation uses Zod.
- Validation errors are consistent.
- Jest tests pass.
