# Nexovate — Agency Website, Client Portal, CRM & Admin

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · MongoDB Atlas (Mongoose)

## What's included

| Area | Features |
|---|---|
| **Public website** | Home, About, Services plus 10 service pages, Pricing (packages from the database), Portfolio, Case Studies, Blog, FAQ, Contact, Get a Quote, Book a Consultation, Privacy, Terms, Refund and Cookie policies, 404, sitemap, robots.txt, structured data (Organization, Service, Breadcrumb, Article, FAQ) |
| **Accounts** | Register, login, logout, email verification, forgot/reset password, profile with country and timezone, password change |
| **Roles (RBAC)** | Super Admin, Admin, Sales Manager, Sales Rep, Project Manager, Developer, Designer, Marketing Manager, Support Agent, Customer. Enforced in middleware, pages, server actions and API routes |
| **Service commerce** | Fixed-price packages (one-time or monthly), checkout, orders with a price snapshot, automatic invoices, manual payment recording, partial payments and refunds |
| **Proposals** | Create one from a lead, send it by email, track when it's viewed, the client signs in and accepts or declines, acceptance creates the order, milestones and invoice in one transaction. Edits after sending are versioned |
| **Customer dashboard** | Overview, orders and projects (milestones, updates, requirements), proposals, invoices (printable or save as PDF), support conversations, consultations, profile and security |
| **CRM** | Leads pipeline (New → Won/Lost), search, filters, notes, activity, UTM and referrer tracking, AI qualification, create a proposal from a lead, CSV export |
| **Consultation booking** | Timezone-aware slots that only show real availability. The database blocks double-booking. Confirmation email with a cancel link |
| **Admin panel** | Live overview (leads, orders, revenue per currency, outstanding balances, leads by country and source, win rate), orders and projects (status flow, milestones, customer updates, internal notes, assignment, payments), invoices, packages, customers, support, consultations, blog, portfolio, testimonials, team and roles, audit log |
| **AI** | Website chatbot that answers only from your services, FAQs and packages. AI lead qualification. Server-side only and rate-limited. Hidden when not configured |
| **Email** | Transactional emails through Resend (welcome/verify, password reset, lead acknowledgement, order, proposal, status changes, project updates, ticket replies, booking). Without a key, emails are logged to the server console |

## Architecture

```
src/
├─ app/                     routes only — thin
│  ├─ (site)/               public website + auth + checkout + proposal pages
│  ├─ dashboard/            customer portal
│  ├─ admin/                staff panel (each section permission-checked)
│  └─ api/                  leads (public form), ai/chat, admin/leads, admin/export
├─ components/              UI — ui/, layout/, sections/, forms/, commerce/, admin/, support/, ai/
├─ content/                 site info, services, FAQs, countries (edit these)
├─ lib/                     shared by client AND server — pure, no DB
│  ├─ constants, permissions, money, order-status, slots, text, format
│  └─ validations/          zod schemas
├─ server/                  server-only (never reaches the browser)
│  ├─ db/mongodb.ts         cached connection + transactions
│  ├─ models/               Mongoose schemas
│  ├─ queries/              reads for pages (always scoped to the signed-in user)
│  ├─ actions/              mutations (validate → authorize → write → audit → email)
│  ├─ services/             lead service, AI knowledge base
│  ├─ auth/                 sessions (JWT cookie), passwords (scrypt), tokens
│  ├─ lib/                  email, ai, rate-limit, audit, numbering, forms
│  └─ config.ts             all optional features read from env in one place
└─ middleware.ts            first gate for /admin, /dashboard, /checkout
tests/unit.test.ts          business-logic tests
```

Data flows **page → query** for reading and **form → server action → model** for writing. Money is stored as integer cents with its currency. Orders and invoices keep a snapshot, so later price changes never alter past orders.

## Setup

1. **MongoDB Atlas**
   - Create a cluster. The free tier works.
   - Add a database user.
   - Under Network Access, allow your IP. For Vercel, allow `0.0.0.0/0`.
   - Copy the connection string.
2. **Environment**: `cp .env.example .env.local`, then fill in the REQUIRED section.
3. **Run**
   ```bash
   npm install
   npm run dev          # http://localhost:3000
   npm test             # unit tests
   npm run typecheck
   npm run build
   ```
4. **First login**: go to `/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. This creates the Super Admin. Add your team under **Admin → Team & Roles**.
5. **Deploy (Vercel)**: import the repo, add the env vars, set `NEXT_PUBLIC_SITE_URL=https://nexovate.solutions`, then connect the domain using the DNS records Vercel shows you.

## Status (honest)

**Verified (21 Nov 2026):** `npm install`, `npm run typecheck`, `npm run lint`, `npm test` (10/10 pass) and `npm run build` all succeed. Every public page was smoke-tested on the production server: 200 on all pages, 404 for unknown routes, protected areas redirect to login, forged session cookies are rejected, and the lead API validates its input.

**Not verified yet:** flows that need a live database (register/login, checkout, proposals, bookings, admin actions) still need an end-to-end run against your MongoDB Atlas cluster. Set up `.env.local` first.

**Needs your accounts or config before it works live:**

- Email delivery: a Resend key and a verified domain.
- AI: a provider key and model id.
- Payments: currently manual. Customers see your `PAYMENT_MANUAL_INSTRUCTIONS`, and staff record payments on the order. No card gateway is connected. Add one, such as Stripe, Paddle or a regional provider, only after confirming Nexovate is eligible for it. Then verify its webhooks server-side and call the same payment-recording logic.
- Legal pages are plain-language drafts. Have them reviewed for the countries you sell to.

**Not built yet:**

- File uploads. Clients share links instead. Add S3, R2 or Cloudinary for uploads.
- Additional website languages. Content is English-only for now.
- Live exchange rates. Every price stays in its own currency and nothing is converted.
- Automated follow-up sequences and abandoned-inquiry recovery.
- Email campaigns. Newsletter subscribers are stored with consent but no campaigns are sent.
- AI cost estimator, SEO analyzer and content generator.
- End-to-end browser tests.
- Backups and monitoring. Atlas has backups on paid tiers.

## Content rules

No fake prices, testimonials, clients, stats or results are included. Packages, portfolio and testimonials stay empty until you add real ones in the admin panel. Hide any service you can't deliver yet with `published: false` in `src/content/services.ts`.
