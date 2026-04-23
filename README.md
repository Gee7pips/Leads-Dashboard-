# Carter Digitals Lead Dashboard

A modern lead management and sales pipeline dashboard for Carter Digitals, a South African digital agency specializing in websites for small businesses.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (SQLite for local dev)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui

## Features

- **Dashboard Overview** — Key metrics, pipeline value, conversion rate, and recent activity at a glance
- **Leads Management** — Full CRUD for leads with filtering by sector, tier, stage, status, and search
- **Pipeline Visualization** — Kanban-style view of leads across sales stages
- **Email Generator** — AI-powered cold email and follow-up generation
- **Strategy Guides** — Sector-specific outreach strategies and playbooks
- **Pricing Calculator** — Package pricing and value estimation tools
- **Campaign Tracker** — Track outreach campaigns across email, WhatsApp, and LinkedIn
- **Analytics** — Sector distribution, tier breakdown, and stage funnel analytics

## Local Development

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Push database schema
npx prisma db push

# Seed the database with 50 leads
npx prisma db seed

# Start the dev server
bun run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Vercel Deployment

The app includes built-in fallback seed data so it works on Vercel's serverless platform without a database. All API routes gracefully fall back to in-memory seed data when the database is unavailable.

For **persistent data** on Vercel, connect an external database:
- **Turso (libSQL)** — Recommended for SQLite compatibility
- **PostgreSQL** — Via Vercel Postgres or any external provider

To switch to Turso or PostgreSQL, update the `DATABASE_URL` in your Vercel environment variables and change the `provider` in `prisma/schema.prisma`.
