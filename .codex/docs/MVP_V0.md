# MVP V0 — Split Bill & Tracking

## Goal

Build a web app for managing shared expenses by Trip.

Each Trip contains:

- Members
- Bills
- Computed balances
- "Who owes who" settlement suggestions
- Settlements

## Deployment Direction

Use:

```txt
Next.js full-stack app
Vercel hosting
MongoDB Atlas database
```

## Technical Decisions

```txt
Validation: Zod
Testing: Jest
Component tests: Jest + React Testing Library when needed
```

## Core Entities

```txt
User
Trip
TripMember
Bill
Settlement
```

## MVP Flow

```txt
Create/resume user session
Create trip
Join trip by code
View trip members
Add bills
View balance
View who owes who
Add settlement
```

# 0. User Management

```ts
User {
  id: string
  phoneNumber: string
  displayName: string
  createdAt: string
  updatedAt: string
}
```

Rules:

- `phoneNumber` is required and unique.
- `displayName` is required and max 50 chars.
- No complex authentication in MVP V0.
- Use lightweight HTTP-only cookie/session.

# 1. Create Trip

```ts
Trip {
  id: string
  name: string
  currency: 'VND'
  joinCode: string
  ownerUserId: string
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
}
```

Rules:

- `name` is required and max 100 chars.
- `currency` defaults to `VND`.
- `joinCode` is unique, random, and shareable.
- Do not expose MongoDB `_id` as `joinCode`.
- Creator is automatically added as Trip owner.

# 2. Join Trip

Flow:

```txt
1. User enters joinCode.
2. App normalizes joinCode.
3. App finds Trip by joinCode.
4. If not found, show error.
5. If user is already a member, open Trip detail.
6. If user is not a member, create TripMember.
7. Open Trip detail.
```

# 3. Members

```ts
TripMember {
  id: string
  tripId: string
  userId: string
  displayNameSnapshot: string
  role: 'owner' | 'member'
  status: 'active' | 'removed'
  joinedBy: 'created' | 'join_code'
  createdAt: string
  updatedAt: string
}
```

# 4. Add Bill

```ts
Bill {
  id: string
  tripId: string
  title: string
  amount: number
  currency: 'VND'
  paidBy: BillPayer[]
  splitType: 'equal'
  splits: BillSplit[]
  category?: string
  billDate: string
  note?: string
  createdByUserId: string
  createdAt: string
  updatedAt: string
}
```

MVP supports equal split only.

# 5. View Trip Balance

Positive balance means member should receive money.  
Negative balance means member owes money.  
Zero balance means member is settled.

# 6. View Who Owes Who

Generate suggested payments from computed balances.

# 7. Add Settlement

Record that one member paid another member.

# Access Rule

Only active Trip members can see or mutate Trip data.

# Non-goals

Do not implement in MVP V0:

- Full auth system
- Password login
- OTP verification
- Email invite
- Invite approval
- Multi-currency
- Advanced split types
- Receipt upload
- OCR
- Payment gateway
- Push notification
- Real-time collaboration
- Analytics dashboard
- Complex role permissions
