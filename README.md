# SecureSub

SecureSub is a production-oriented Next.js SaaS starter focused on subscription billing, security, and maintainable architecture. It includes a modern UI shell, protected dashboard routes, Prisma-backed persistence, audit logging, and a Stripe billing integration (checkout + webhook syncing).

## Project Overview

SecureSub is designed as a realistic foundation for a subscription-based SaaS:

- **App Router** routes and server-side APIs
- **Credentials auth** with secure password hashing and JWT sessions
- **Stripe** checkout + webhook syncing into your database
- **Audit logging** for important auth/billing actions
- **Security baseline**: Zod validation, CSRF checks, rate limiting, centralized API error handling

## Tech Stack

- **Framework**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Auth**: NextAuth (Credentials provider)
- **Database**: PostgreSQL + Prisma (Prisma 7 config via `prisma.config.ts`)
- **Payments**: Stripe (server-side SDK)
- **Validation**: Zod

## Architecture

The project is organized to keep UI, business logic, and integrations separate:

- `src/app/` — App Router routes (pages + API route handlers)
- `src/components/` — Reusable UI + layout components (`Button`, `Card`, `Navbar`, etc.)
- `src/lib/` — Cross-cutting concerns (auth config, Prisma client, API handler, security utilities, validation schemas)
- `src/services/` — Business/integration logic (billing repository, Stripe service, password hashing, audit logging)
- `src/types/` — Shared TypeScript types
- `src/utils/` — Utility helpers (`cn`, formatting, API JSON error responses)

Key modules:

- **Auth**
  - NextAuth config: `src/lib/auth.ts`
  - Registration API: `src/app/api/auth/register/route.ts`
  - Protected dashboard middleware: `middleware.ts`
- **API hardening**
  - Central handler: `src/lib/api/handler.ts`
  - Rate limiting: `src/lib/security/rateLimit.ts`
  - CSRF checks: `src/lib/security/csrf.ts`
  - Request schemas: `src/lib/validation/*`
- **Billing + Stripe**
  - Checkout Session API: `src/app/api/stripe/checkout-session/route.ts`
  - Webhook API: `src/app/api/stripe/webhook/route.ts`
  - Stripe sync logic: `src/services/stripeSyncService.ts`
- **Audit trail**
  - Model: `AuditLog` in `prisma/schema.prisma`
  - Writer: `src/services/auditLogService.ts`

## Setup Instructions

### Prerequisites

- Node.js (modern LTS recommended)
- PostgreSQL database
- Stripe account (for billing)

### Install dependencies

```bash
npm install
```

### Environment Variables

Copy the example file and fill in values:

```bash
cp .env.example .env
```

Required:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` — app base URL (e.g. `http://localhost:3000`)
- `NEXTAUTH_SECRET` — long random secret for signing JWT/session tokens
- `BCRYPT_COST` — bcrypt cost factor (defaults to 12 if unset)
- `STRIPE_SECRET_KEY` — Stripe secret key (`sk_...`)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (`whsec_...`)

### Database Setup (Prisma)

Generate Prisma client:

```bash
npm run prisma:generate
```

Create/update tables in development:

```bash
npx prisma migrate dev
```

This repo includes models for `User`, `Subscription`, `Invoice`, and `AuditLog`. Stripe IDs are stored on `User`/`Subscription`/`Invoice` to support syncing.

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Stripe Integration Guide

### 1) Create products/prices

In the Stripe Dashboard, create a **Product** and at least one **Price** (subscription). You’ll use the Stripe **Price ID** (`price_...`) when creating checkout sessions.

### 2) Create a subscription Checkout Session

Call:

- `POST /api/stripe/checkout-session`

Body:

```json
{
  "priceId": "price_...",
  "successUrl": "http://localhost:3000/dashboard/billing",
  "cancelUrl": "http://localhost:3000/dashboard/billing"
}
```

Notes:

- Requires an authenticated NextAuth session.
- Protected with CSRF checks and rate limiting.

### 3) Configure the webhook endpoint

Set your Stripe webhook endpoint to:

- `POST /api/stripe/webhook`

Enable (minimum) events used for syncing:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.finalized`
- `invoice.paid`
- `invoice.payment_failed`
- `invoice.voided`
- `invoice.marked_uncollectible`

Webhook security:

- The handler validates `stripe-signature` using `STRIPE_WEBHOOK_SECRET`.
- The route reads the **raw request body** and constructs the event using Stripe’s webhook utility.

### 4) Subscription status updates + invoice syncing

On webhook delivery, Stripe objects are upserted into Prisma:

- Subscriptions are stored by `stripeSubscriptionId` and mapped into the app’s `SubscriptionStatus`.
- Invoices are stored by `stripeInvoiceId` and mapped into the app invoice status enum.

## Testing

Run the test suite:

```bash
npm test
```

If you hit Windows policy/EPERM issues in locked-down environments, pinning Vitest to a v3.x release is a common workaround.
