# Production-Ready Spec — MVP V0

## Deployment

```txt
Frontend + backend: Next.js full-stack
Hosting: Vercel
Database: MongoDB Atlas
```

## Fixed Technical Choices

```txt
Validation: Zod
Testing: Jest
Component testing: Jest + React Testing Library when needed
```

Do not introduce Vitest or another test framework.

# 1. Environment Variables

```txt
MONGODB_URI=
MONGODB_DB_NAME=
SESSION_COOKIE_NAME=split_bill_session
SESSION_SECRET=
NEXT_PUBLIC_APP_NAME=Split Bill
```

# 2. Collections

## users

```ts
User {
  _id: ObjectId
  phoneNumber: string
  displayName: string
  createdAt: Date
  updatedAt: Date
}
```

Index:

```ts
db.users.createIndex({ phoneNumber: 1 }, { unique: true })
```

## trips

```ts
Trip {
  _id: ObjectId
  name: string
  currency: 'VND'
  joinCode: string
  ownerUserId: ObjectId
  status: 'active' | 'archived'
  createdAt: Date
  updatedAt: Date
}
```

Indexes:

```ts
db.trips.createIndex({ joinCode: 1 }, { unique: true })
db.trips.createIndex({ ownerUserId: 1 })
```

## trip_members

```ts
TripMember {
  _id: ObjectId
  tripId: ObjectId
  userId: ObjectId
  displayNameSnapshot: string
  role: 'owner' | 'member'
  status: 'active' | 'removed'
  joinedBy: 'created' | 'join_code'
  createdAt: Date
  updatedAt: Date
}
```

Indexes:

```ts
db.trip_members.createIndex({ tripId: 1, userId: 1 }, { unique: true })
db.trip_members.createIndex({ userId: 1, status: 1 })
db.trip_members.createIndex({ tripId: 1, status: 1 })
```

## bills

```ts
Bill {
  _id: ObjectId
  tripId: ObjectId
  title: string
  amount: number
  currency: 'VND'
  paidBy: Array<{ userId: ObjectId; amount: number }>
  splitType: 'equal'
  splits: Array<{ userId: ObjectId; amount: number }>
  category?: string
  billDate: Date
  note?: string
  createdByUserId: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

Indexes:

```ts
db.bills.createIndex({ tripId: 1, billDate: -1 })
db.bills.createIndex({ tripId: 1, createdAt: -1 })
```

## settlements

```ts
Settlement {
  _id: ObjectId
  tripId: ObjectId
  fromUserId: ObjectId
  toUserId: ObjectId
  amount: number
  currency: 'VND'
  note?: string
  settledAt: Date
  createdByUserId: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

Indexes:

```ts
db.settlements.createIndex({ tripId: 1, settledAt: -1 })
db.settlements.createIndex({ tripId: 1, createdAt: -1 })
```

# 3. Session Model

MVP V0 uses lightweight session.

```txt
POST /api/users/session
body: phoneNumber, displayName
```

Flow:

```txt
1. Validate input with Zod.
2. Normalize phoneNumber.
3. Find user by phoneNumber.
4. If user exists, optionally update displayName if changed.
5. If user does not exist, create user.
6. Set HTTP-only session cookie.
7. Return current user.
```

# 4. API Routes

```txt
POST /api/users/session
GET /api/users/me
GET /api/trips
POST /api/trips
POST /api/trips/join
GET /api/trips/:tripId
GET /api/trips/:tripId/members
GET /api/trips/:tripId/bills
POST /api/trips/:tripId/bills
GET /api/trips/:tripId/balance
GET /api/trips/:tripId/owes-who
GET /api/trips/:tripId/settlements
POST /api/trips/:tripId/settlements
```

# 5. Zod Validation

All API inputs must use Zod.

Recommended files:

```txt
src/lib/validation/userSchemas.ts
src/lib/validation/tripSchemas.ts
src/lib/validation/billSchemas.ts
src/lib/validation/settlementSchemas.ts
```

## User Session

```txt
phoneNumber: required string
displayName: required string, max 50
```

## Create Trip

```txt
name: required string, max 100
```

## Join Trip

```txt
joinCode: required string, max 32
```

## Create Bill

```txt
title: required string, max 100
amount: positive integer
paidByUserId: required ObjectId string
splitUserIds: non-empty unique array
billDate: valid date
note: optional string, max 500
```

## Create Settlement

```txt
fromUserId: required ObjectId string
toUserId: required ObjectId string
amount: positive integer
settledAt: valid date
note: optional string, max 500
```

# 6. Business Logic

## Equal Split

```txt
base = Math.floor(amount / memberCount)
remainder = amount % memberCount
```

Sort selected member IDs before assigning the remainder.

## Balance Calculation

```txt
balance[payer] += paid amount
balance[split user] -= split amount
balance[fromUser] += settlement amount
balance[toUser] -= settlement amount
```

## Who Owes Who

```txt
creditors = balance > 0
debtors = balance < 0
match debtors to creditors
```

# 7. Jest Test Plan

Use Jest for all tests.

Minimum unit tests:

```txt
src/domain/split/splitEqual.test.ts
src/domain/split/calculateBalance.test.ts
src/domain/split/calculateOwesWho.test.ts
```

Recommended validation tests:

```txt
src/lib/validation/userSchemas.test.ts
src/lib/validation/tripSchemas.test.ts
src/lib/validation/billSchemas.test.ts
src/lib/validation/settlementSchemas.test.ts
```

Recommended setup files:

```txt
jest.config.ts
jest.setup.ts
```

# 8. Error Format

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have access to this trip."
  }
}
```

# 9. Vercel Notes

- Cache MongoDB client across serverless invocations.
- Use Node.js runtime for routes that access MongoDB.
- Do not use Edge runtime for database routes.

# 10. MVP Done Checklist

- Core logic has Jest tests.
- API inputs use Zod validation.
- App deploys to Vercel using MongoDB Atlas.
