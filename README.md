# CM Funnel

A multi-step ad campaign funnel built on **Cloudflare Workers + D1 + KV**, with a **React + Vite + TailwindCSS** frontend. Supabase is wired in as the secondary contact-data destination in a subsequent phase.

---

## Project Structure

```
cm-funnel/
├── client/                  # React SPA (Vite + TailwindCSS v4)
│   ├── index.html
│   ├── vite.config.ts
│   ├── public/
│   │   └── assets/          # Static assets (images, favicon, etc.)
│   └── src/
│       ├── main.tsx          # React entry point
│       ├── App.tsx           # Route definitions (wouter)
│       ├── components/       # Shared UI components
│       │   ├── FunnelLayout.tsx
│       │   ├── FunnelProgress.tsx
│       │   └── ui/           # Primitive UI components
│       ├── hooks/
│       │   └── useFunnelState.ts  # Cross-step lead state (sessionStorage)
│       ├── lib/
│       │   ├── api.ts         # Typed fetch client for /api/*
│       │   └── utils.ts       # cn() and other helpers
│       ├── pages/
│       │   ├── LandingPage.tsx   # / — entry CTA
│       │   ├── StepOne.tsx       # /step/1 — contact info
│       │   ├── StepTwo.tsx       # /step/2 — qualification
│       │   ├── StepThree.tsx     # /step/3 — final details + consent
│       │   ├── ThankYou.tsx      # /thank-you — confirmation
│       │   └── NotFound.tsx      # 404
│       └── styles/
│           └── globals.css       # Tailwind v4 import + CSS variables
│
├── worker/                  # Cloudflare Worker (backend API)
│   └── src/
│       ├── index.ts          # Worker entry point
│       ├── lib/
│       │   ├── env.ts         # Env binding types
│       │   ├── router.ts      # Pattern-based API router
│       │   └── response.ts    # JSON response helpers
│       ├── middleware/
│       │   └── cors.ts        # CORS header helper
│       └── routes/
│           ├── health.ts      # GET /api/health
│           └── leads.ts       # POST /api/leads, PATCH /api/leads/:id
│
├── shared/                  # Code shared between client and worker
│   ├── types/
│   │   └── funnel.ts          # FunnelLead, ApiResponse types
│   └── validation/
│       └── funnel.ts          # Zod schemas for all funnel steps
│
├── migrations/              # D1 SQL migrations
│   └── 0001_create_leads.sql
│
├── wrangler.toml            # Cloudflare Worker config
├── tsconfig.json
├── package.json
└── README.md
```

---

## Funnel Flow

```
/ (LandingPage)
  └─► /step/1 (Contact Info)
        └─► /step/2 (Qualification)
              └─► /step/3 (Final Details + Consent)
                    └─► /thank-you (Confirmation)
```

Each step persists partial lead data to **sessionStorage** on the client and submits it to the Worker API, which writes to **D1**. The lead ID is threaded through all steps so each PATCH update targets the same record.

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- Wrangler CLI (`pnpm add -g wrangler`)
- A Cloudflare account

### Install dependencies

```bash
pnpm install
```

### Configure Cloudflare resources

1. Update `wrangler.toml` with your real D1 database ID and KV namespace ID (see **Cloudflare Setup** below).
2. Set required secrets:

```bash
wrangler secret put JWT_SECRET
# Supabase secrets (Phase 2)
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### Run locally

```bash
pnpm dev
```

- Client: http://localhost:5173
- Worker: http://localhost:8787

### Apply D1 migrations

```bash
pnpm db:migrate:local   # local dev
pnpm db:migrate         # production
```

### Deploy

```bash
pnpm deploy
```

---

## Cloudflare Setup

The following Cloudflare resources are required:

| Resource | Name | Purpose |
|---|---|---|
| D1 Database | `cm-funnel-db` | Lead storage |
| KV Namespace | `cm-funnel-kv` | Session / cache |
| Worker | `cm-funnel` | API + SPA serving |

After creating these resources, update the `database_id` and KV `id` fields in `wrangler.toml`.

---

## Environment Variables / Secrets

| Variable | Where | Description |
|---|---|---|
| `JWT_SECRET` | Wrangler secret | JWT signing key |
| `SUPABASE_URL` | Wrangler secret | Supabase project URL (Phase 2) |
| `SUPABASE_ANON_KEY` | Wrangler secret | Supabase anon key (Phase 2) |
| `SUPABASE_SERVICE_ROLE_KEY` | Wrangler secret | Supabase service role key (Phase 2) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TailwindCSS v4, wouter, react-hook-form, Zod |
| Backend | Cloudflare Workers (TypeScript) |
| Database | Cloudflare D1 (SQLite at the edge) |
| Cache / Sessions | Cloudflare KV |
| Future: CRM sync | Supabase (Phase 2) |
