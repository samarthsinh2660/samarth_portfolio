# Samarth — Project Portfolio (Master Doc)

> Single source of truth for every project we've built. Use this to create project pages,
> case studies, and marketing sections on the website. Each entry has: pitch, features,
> tech stack, architecture highlights, links, and available assets/screenshots.

**Projects covered:**

1. [Multi-Tenant Inventory Management (SaaS)](#1-multi-tenant-inventory-management-saas)
2. [UNIUN — Decentralized Second Brain](#2-uniun--decentralized-second-brain)
3. [Payroll Studio — Payroll & HR for Indian SMBs](#3-payroll-studio--payroll--hr-for-indian-smbs)
4. [UNIUN Inference Platform — AI Gateway](#4-uniun-inference-platform--ai-gateway)
5. [BillReward — Scan Bills, Earn Cashback](#5-billreward--scan-bills-earn-cashback) *(formerly "Cheel")*
6. [Uttarakhand Next — Digital News Platform](#6-uttarakhand-next--digital-news-platform)
7. [BillBridge OCR — Bill Scanner to Excel / Tally](#7-billbridge-ocr--bill-scanner-to-excel--tally)
8. [Enterprise Chat — Internal Communication Suite](#8-enterprise-chat--internal-communication-suite)
9. [Pulse — Autonomous AI Content & Publishing Engine](#9-pulse--autonomous-ai-content--publishing-engine)

---

## 1. Multi-Tenant Inventory Management (SaaS)

**One-line pitch:** A production-ready, multi-tenant SaaS inventory platform where every
factory gets its own fully isolated database — with real-time stock, invoicing, BOM
formulas, audit trails, and automated backups.

**Category:** B2B SaaS · Manufacturing / Warehouse
**Status:** Production-ready
**Links:**
- Demo / launch site: **https://inventory-system-launch-site.vercel.app/**

**Asset:** `public/work/inventory.png` (live dashboard screenshot)

### The Problem It Solves
Factories and SMBs run inventory on spreadsheets or shared single-database tools where
one tenant's data leak or load spike affects everyone. This platform gives each factory
**its own MySQL database** — true data isolation, not just a `tenant_id` column.

### Key Features
- **One database per factory (tenant)** — strict isolation, zero cross-tenant queries
- **Self-serve tenant onboarding** — a 6-field registration form spins up a full factory
  DB, schema, and admin user automatically
- **Unified multi-tenant auth** — login as `username@factory_db`; JWT embeds tenant + role
- **Dynamic connection pooling** — per-tenant pools created/cached on demand and
  auto-scaled with user count (`max_connections = max(users + 2, 5)`)
- **Full inventory suite** — products, multi-location stock (Warehouse → Zone → Shelf),
  suppliers, subcategories, transfers, bulk import/export
- **Product formulas (BOM)** — multi-level bill of materials with JSON components,
  batch sizing, scaling, substitution and cost analysis
- **Complete invoice system** — multi-product invoices, tax systems (HSN/SAC),
  discounts, and optional auto-creation of `sales_out` inventory entries with full
  invoice-item traceability
- **Stock alerts & notifications** — thresholds, low-stock reorder alerts, in-app delivery
- **Audit logging** — every inventory change recorded with rich filtering (user,
  location, action, date range, product hierarchy)
- **Automated backups** — every 4 hours via `mysqldump` (central + all tenant DBs),
  7-day retention, manual master-only trigger/cleanup endpoints
- **Crash recovery system** — uncaught exception / rejection capture, detailed crash
  logs, automatic 2-second restart; plays well with Docker/PM2/Kubernetes

### Mobile & Web Client (React Native)
- Cross-platform app (iOS / Android / web) with real-time stock views
- Barcode scanning, batch & expiry tracking
- Role-based access: **Master** (full control + analytics), **Employee**
  (operations + department reports), **User** (read-only)
- Multi-layer crash prevention: ErrorBoundary fallbacks, offline queuing with
  retry/backoff, 23+ automated error-scenario tests
- Analytics dashboards: turnover, movement, cost/profit, trends & forecasts

### Tech Stack
| Layer | Technology |
|---|---|
| Backend | Node.js, TypeScript, Express, MySQL |
| Mobile/Web | React Native 0.72+, Expo, Redux Toolkit + RTK Query, React Native Paper |
| Auth | JWT (tenant + role embedded), bcrypt |
| Infra | Docker Compose, node-cron backups, health checks |

---

## 2. UNIUN — Decentralized Second Brain

**One-line pitch:** A decentralized, offline-first knowledge platform that fuses personal
note-taking, social networking, and **fully on-device AI** — your data never leaves
your device.

**Category:** Consumer · Knowledge Management · Privacy-first Social
**Status:** Waitlist / pre-launch
**Links:**
- Website: **https://uniun.in/**
- GitHub (open source): **https://github.com/basictech01/uniun**
- Platforms: Android, iPhone, Desktop (coming soon)

### Tagline
> *"Your decentralized second brain."*

### The Three Pillars (Hindu-trinity naming)
**🪷 Brahma — Create**
- Notes as the atomic unit of knowledge
- Interactive canvas for building knowledge graphs — draw connections between references
- **Manas** — curate named subsets of notes
- Drafts for unpublished work-in-progress

**🌊 Vishnu — Share & Reflect**
- Chronological feed from people you follow — **no algorithmic curation, ever**
- Threads for conversation trees
- Public and private channels with membership control
- End-to-end encrypted direct messages
- Bookmarks and subscriptions

**🔥 Shiv — Transform**
- On-device AI chat grounded in *your* notes
- **Nataraj** — fuse multiple notes into new ideas
- **Ganas** — autonomous agents for scheduled actions
- Inline composer-chat intelligence
- Runs lightweight local models: Qwen3 0.6B, DeepSeek R1 1.5B, Gemma variants

### Sovereignty & Security
- MLS encryption for private channels and DMs
- User-controlled keypair identity — you own your identity
- Open-source codebase, self-hostable relay
- Permanent note storage (no forced deletion)
- **All AI processing stays on-device** — no cloud, no data harvesting

---

## 3. Payroll Studio — Payroll & HR for Indian SMBs

**One-line pitch:** A complete custom payroll & HR web app built end-to-end for a real
Indian client — biometric attendance sync, a three-pass salary engine, and
government-submission-ready statutory reports (PF, ESIC, PT, TDS).

**Category:** B2B · HR-Tech / Fintech · Client project
**Status:** In production for client
**Assets:** `public/projects/payroll/payroll-catalog.png` (4-screen catalog), `public/projects/payroll/screens/*.png`

### What Makes It Special
Hard-coded for Indian statutory rules, Rupee-formatted everywhere (₹1,50,000 style),
and tailored for a real shop floor + office workforce. Two portals from one codebase:
- **Admin Console** — full HR / payroll / compliance control surface
- **Employee Self-Service** — profile, payslips, attendance, leave requests

### Key Features
- **Employee master** — full CRUD, Officer vs Worker types, statutory IDs (Aadhaar,
  PAN, UAN, ESI, PF), multiple bank accounts, departments & job roles
- **Dual salary-rule engines** — Officer rules (CTC-based, linked salary structures,
  per-rule PF/ESIC/PT/TDS toggles, plain-English "explain rule" view) and Worker rules
  (hourly + OT rate)
- **Salary structures** — components (Basic, HRA, Conveyance, …) with calculation types
  `fixed / % of CTC / % of basic / balance`, drag-to-reorder priority honoured by engine
- **Three-pass payroll engine** — mirrored on frontend so the employee-profile salary
  preview always matches the backend payslip exactly
- **Biometric attendance (DMPS device) integration** — live punches, day-wise summary,
  idempotent date-range sync, auto device registration when an employee is created
- **Attendance ledger** — per-day status, cross-midnight night-shift support, admin
  correction modal, monthly per-employee stats
- **Leaves & holidays** — leave types, balances, approve/reject workflow with
  auto-balance adjustment, department-scoped public holiday calendar
- **Payroll runs** — `draft → generated → approved → locked` lifecycle, admin overrides
  with audit trail, immutable payslips, "why is this employee missing?" diagnostics
- **Statutory compliance** — configurable PF/ESIC ceilings (₹15,000 / ₹21,000 defaults),
  state-wise PT slabs, annual TDS slabs applied monthly
- **Report center** — statutory breakdowns, department-wise costs, anomaly detection
  (zero pay, salary drops, abnormal OT), attendance/OT reports with CSV/PDF export, and
  **gov-format PDFs**: PF Summary (12-column EPS/EPF), ESI Summary, PT Summary, and
  **Gujarat Form 5** — submission-ready with certification block
- **Full audit logs** — `before_data`/`after_data` JSON diffs on every entity change

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, TanStack Query v5, Tailwind (light/dark) |
| Validation | Zod runtime API validation |
| Backend | Express + MySQL, JWT auth with refresh flow, Result-pattern architecture |
| Testing | Cypress E2E; unit + testcontainers integration tests on backend |

---

## 4. UNIUN Inference Platform — AI Gateway

**One-line pitch:** "Our own OpenRouter" — a unified AI inference gateway: one UNIUN API
key, one standard endpoint, and the platform decides whether a request is served by a
Claude subscription, a paid provider API, or self-hosted models.

**Category:** AI Infrastructure · Developer Platform
**Status:** Architecture & design phase (detailed HLD/LLD complete)
**Links:**
- Product page: **https://www.uniun.in/ai-inference**

**Assets:** `public/projects/uniun-inference/gateway.png` (branded product visual — terminal →
gateway → provider routing), `ai-inference.jpg` (UNIUN site banner)

### The Problem
Every team integrating multiple LLM providers repeats the same work: different APIs,
auth schemes, pricing, streaming quirks, and vendor lock-in. UNIUN Inference is a single
abstraction layer between applications and all AI providers.

### How It Works — Own / Run / Build
1. **Own (the brain):** a fork of `openziti/llm-gateway` (~6k LOC Go) — OpenAI **and**
   Anthropic-compatible frontends, provider routing with failover, semantic
   difficulty-cascade smart routing, OTel metrics
2. **Run (the pool):** `CLIProxyAPI` sidecar (~140k LOC Go, untouched, own container) —
   turns subscription logins (Claude, Codex/ChatGPT, Gemini, Grok, Kimi) into
   OpenAI/Anthropic-compatible endpoints with multi-account load balancing
3. **Build (the moat):** the UNIUN layer — DB-backed API keys & accounts, per-token
   metering, rate limits, billing, and the routing policy

### Design Principles
- Multi-protocol frontends — real tools (Claude Code, Aider, Cline) need
  provider-specific behavior, so both OpenAI and Anthropic APIs are first-class
- A backend is a `Provider` config entry, not a fork in the code — swapping
  Claude-subscription → Anthropic API → local model is config, never a caller change
- Smart routing: cheap/simple work → cheap source, hard work → premium models
- One repo, two containers, one `docker-compose up`

### Tech Stack
Go (llm-gateway fork + CLIProxyAPI sidecar) · PostgreSQL (keys/usage) · Docker Compose ·
OpenTelemetry · OpenAI + Anthropic wire protocols

---

## 5. BillReward — Scan Bills, Earn Cashback

*(Working title — formerly "Cheel"; internal name "Extract Bill & Pay". Final brand TBD.)*

**One-line pitch:** A mobile-first cashback platform where users upload purchase
receipts (Swiggy, Zomato, Zepto, Blinkit…), an AI pipeline extracts and fraud-checks the
bill, and users earn cashback through a gamified chest-opening experience.

**Category:** Consumer Fintech · AI / OCR · Rewards
**Status:** Built (Expo app v1.1.8 + admin console + dual backend)

**Screenshots:** `public/projects/billreward/` —
`home_dashboard.png`, `upload_bill.png`, `verification_result.png`, `wallet.png`
(these four cover the core loop: dashboard → upload → verification → cashback wallet;
more screens available in the repo's `ui-ux/` folder if ever needed)

### The Win-Win Ecosystem
- **Users** get cashback plus a smart purchase-history tracker
- **Businesses** get structured, verified consumer purchase insights from real bills

### Key Features
- **Passwordless onboarding** — email OTP login, one-time profile setup, wallet
  auto-created on registration
- **Three upload paths** — camera, gallery, or PDF/document
- **AI extraction pipeline (FastAPI + Node.js):**
  1. File validation + SHA-256 dedup hashing
  2. Text extraction — `pypdf` for PDFs, OpenCV + Google Vision for images
  3. **Authenticity verification** — GSTIN regex, IRN (GST-portal invoice reference)
     check, platform GSTIN registry (Zepto/Swiggy/Zomato/Blinkit), fraud scoring
  4. **GPT-4o structured parsing** — platform, order ID, merchant, items, taxes,
     discounts (regex fallback if quota exhausted)
  5. Cross-user dedup (exact hash + order_id/platform) before any reward is credited
- **Gamified rewards** — chest-opening cashback reveal (₹50–100 max per upload)
- **In-app wallet** — balance on home screen, ₹100 minimum withdrawal, UPI (GPay)
  payout flow, no KYC needed at v1 reward tiers
- **Admin console (Next.js)** — bill review, user management, payout handling, analytics

### Tech Stack
| Layer | Technology |
|---|---|
| Mobile | Expo + React Native (iOS/Android), OTA updates via EAS |
| Bill pipeline | Python FastAPI, OpenCV, Google Vision, OpenAI GPT-4o, pypdf |
| Backend | Node.js, TypeScript, Express, MySQL — Result pattern, Zod validation, cursor pagination |
| Admin | Next.js, TypeScript, Tailwind |
| Infra | Docker Compose, Winston logging, Jest + testcontainers |

---

## 6. Uttarakhand Next — Digital News Platform

**One-line pitch:** A premium digital publication chronicling the socio-economic and
cultural transformation of Uttarakhand — powered by a modern GraphQL backend with full
editorial workflows.

**Category:** Media / Publishing · Full-stack
**Status:** Live (frontend deployed)
**Links:**
- Live site: **https://un-frontend-neon.vercel.app/**

### Tagline
> *"Empower Future, Inspire Generations."*

### The Product
Six thematic content universes:
**Voices & Visionaries · Learning & Ladders · Growth & Grit · State & Stewardship ·
Nature & Nurture · Spirit & Story** — each covering a different dimension of the
Himalayan state's development story, with a Latest Stories feed, editorial pages
(About, Editorial Policy, Archives), and Next.js-optimized imagery.

### Backend Features
- **GraphQL API** — type-safe, Apollo Server 5
- **JWT authentication** for authors and admins with bcrypt hashing
- **Role-based access** — granular author vs administrator permissions
- **Editorial workflow** — `Draft → Pending → Approved / Rejected` approval flow
- **Article management** — full CRUD with approval gates
- **Trending & views** — article popularity tracking and trending surfacing
- **Fully Dockerized** — dev and production compose setups

### Tech Stack
| Layer | Technology |
|---|---|
| Backend | Node.js 22, TypeScript, Express 5, Apollo Server 5 (GraphQL), MySQL 8.4 |
| Frontend | Next.js (deployed on Vercel), optimized images |
| Auth | JWT + bcrypt |
| Infra | Docker + Docker Compose |

---

## 7. BillBridge OCR — Bill Scanner to Excel / Tally

*(Working title — final brand TBD.)*

**One-line pitch:** Point a camera at any bill and it lands as clean, structured rows in
Excel — or directly as vouchers in Tally. Built for shops, accountants, and SMBs
drowning in manual data entry.

**Category:** B2B Productivity · AI / OCR · Accounting Automation
**Status:** In development

### The Problem
Indian SMBs and accounting firms re-type thousands of paper bills into Excel and Tally
every month — slow, error-prone, and expensive. Existing OCR tools give raw text, not
accounting-ready entries.

### Planned Features
- **Scan anything** — camera capture, gallery images, or PDF invoices
- **AI-powered extraction** — vendor, GSTIN, invoice number, date, line items,
  quantities, rates, taxes (CGST/SGST/IGST), and totals as structured data
  (built on the same proven OCR + LLM pipeline as BillReward)
- **Excel export** — clean, columnar spreadsheets ready for reconciliation and audits
- **Tally integration** — push extracted bills as purchase/sales vouchers directly into
  Tally, mapped to the correct ledgers
- **Validation layer** — GSTIN checks, total-vs-line-item reconciliation, duplicate
  detection before anything is exported
- **Batch mode** — process a folder or stack of bills in one go

### Tech Stack (planned)
Python (FastAPI) OCR pipeline — OpenCV + Google Vision + LLM parsing · Node.js/TypeScript
API · Excel (xlsx) generation · Tally XML/ODBC integration

---

## 8. Enterprise Chat — Internal Communication Suite

**One-line pitch:** A WhatsApp-style, real-time enterprise chat platform for admins and
employees — with moderated chat requests, media sharing, presence, push notifications,
plus built-in storage management, and internal payroll & inventory modules for admins.

**Category:** B2B · Enterprise Communication
**Status:** Built (Expo app targeting iOS, Android & web; TestFlight deployment guide in repo)
**Assets:** `public/projects/enterprise-chat/chat-app.png` (branded product visual — group chat
with read receipts, presence, media & voice notes), `analytics-dashboard.jpeg` (real in-app
Analytics screen)

### Key Features
- **Secure login** — email/username + password or OTP; persistent JWT access + refresh
  sessions; admin-deactivation force-logout
- **Role-based experience:**
  - *Admins* — manage users & conversations, create direct/group chats, moderate
    employee chat requests, admin dashboards
  - *Employees* — own chats & groups, request permission to chat with colleagues
- **WhatsApp-style UX** — message bubbles, typing indicators, read receipts (direct
  *and* group), online status, unread counts, last-message previews, infinite-scroll
  history
- **Rich media** — images, documents, audio, and video uploads
- **Presence & notifications** — Redis-backed heartbeat presence, Expo push
  notifications, live `user_online` / `user_offline` / `messages_read` events
- **Device-aware connections** — stable device IDs; new devices get a fast-heartbeat
  warm-up mode for reliable first connections without draining battery on every device
- **Admin tooling beyond chat** — storage management, internal-communication oversight,
  and integrated **payroll** and **inventory** admin views

### Architecture
```
Expo Router Screens → Contexts / Redux Store → typed API helpers (HTTP) ┐
                                              → Socket.io client (WS)   ┤→ Node.js backend
                                                                         ├→ MySQL (data)
                                                                         └→ Redis (presence, real-time)
```
State flows one way: backend → API/socket → Redux → components. Screens stay thin;
all network traffic goes through typed `api/*` helpers or the shared socket client.

### Tech Stack
| Layer | Technology |
|---|---|
| Client | Expo + React Native (iOS/Android/web), Expo Router, Redux, Tamagui design system |
| Real-time | Socket.io (client + server), Redis heartbeat presence |
| Backend | Node.js, Express REST API, MySQL |
| Auth | JWT access + refresh, secure async storage, silent refresh |
| Notifications | Expo push / platform channels |

---

## 9. Pulse — Autonomous AI Content & Publishing Engine

**One-line pitch:** A 24/7 autonomous pipeline that collects articles from RSS/news feeds,
Hacker News and GitHub Trending, deduplicates and AI-summarises them into short editorial
notes, and auto-publishes the signed results to a decentralized (Nostr protocol) social
feed — so a new social channel never launches empty.

**Category:** AI Infrastructure · Content Automation · Backend Service
**Status:** Built (Dockerized, running with a live monitoring dashboard)

### The Problem
A social feed with zero content on day one has no reason for anyone to open it twice.
Pulse solves the cold-start problem by running as a fully independent background
service — no manual curation, no editors — continuously feeding multiple topic channels
(e.g. daily news, tech, motivation) with fresh, on-brand, deduplicated content.

### How It Works
```
RSS / Hacker News / GitHub Trending
        │  every 15 min
        ▼
Content Collector (pluggable per source type)
        │
        ▼
Deduplication Engine — SHA-256(url + title), skip if already seen
        │
        ▼
AI Processor — summarise, title, tag, and quality-score the article
        │  quality_score ≥ 0.5
        ▼
Publisher — signs a decentralized protocol event per bot identity
        │
        ▼
Live channel feed
```

- **Multi-source collectors** — RSS (`feedparser` + `trafilatura` full-text extraction),
  Hacker News (Firebase API), GitHub Trending; adding a new source type is a
  one-file, zero-touch-elsewhere change; adding a new *feed* is a single YAML entry
- **Dual-provider AI layer with automatic failover** — a primary provider is tried across
  a 6-model fallback chain (handles rate limits, quota exhaustion, and model
  deprecation transparently); if the entire chain fails, a second independent provider
  (fast open-weight Llama models) takes over automatically — the pipeline never stalls
  because one AI vendor is down or throttled
- **Structured AI output** — each article becomes a JSON object: punchy title,
  ~120-150 word markdown note (headings, bold, bullet list, closing source link),
  topic tags, and a quality score; only notes clearing the quality bar get published
- **Per-channel bot identities** — each topic channel (daily news / tech / motivation)
  publishes under its own signing key, routed purely by the source's configured
  category — no code change to add a channel
- **Clean layered architecture** — business logic (`collector` / `dedup` / `ai_processor`
  / `publisher`) never touches SQL directly; it only calls repository *interfaces*
  backed by DTOs. A `UnitOfWork` wires the interfaces to a SQL implementation, so
  swapping the database engine is a five-import change in one file, nothing else
- **Operator dashboard** (Streamlit) — 6 live metrics, pause/resume + force-collect
  controls, per-source health and enable/disable toggles, a live article/publish
  monitor, analytics charts (volume, quality distribution, funnel, top tags), the
  full published-notes log, and a module-level error log
- **Dry-run mode** — a `preview.py` script fetches and AI-processes articles with no
  database or publishing keys required, for fast local iteration on prompts/sources

### Architecture Notes
- Strict one-way dependency rule: `modules/` → repository interfaces (pure Python,
  no SQL) → `db/impl/` (the only layer that imports the ORM) → wired by
  `db/unit_of_work.py`
- Scheduler (APScheduler) runs collection every 15 minutes and publishing every 5
  minutes, checking a pause flag the dashboard controls before each run
- Designed with an explicit V2 path (async queue-based AI workers) that requires no
  changes to business logic — only a new queue-backed repository implementation

### Tech Stack
| Layer | Technology |
|---|---|
| Language | Python |
| Collection | `feedparser`, `httpx`, `trafilatura` (full-text extraction) |
| AI | Primary provider 6-model fallback chain + secondary provider (Llama models) automatic failover |
| Data | MySQL, SQLAlchemy (repository + unit-of-work pattern) |
| Scheduling | APScheduler |
| Publishing | Decentralized protocol client, per-channel signing keys |
| Dashboard | Streamlit, Plotly, Pandas |
| Monitoring | Sentry, structured logging |
| Infra | Docker, Docker Compose (service + database + dashboard) |

---

## Cross-Portfolio Summary (for the website)

| # | Project | Category | Status | Live Link |
|---|---|---|---|---|
| 1 | Multi-Tenant Inventory | B2B SaaS | Production-ready | https://inventory-system-launch-site.vercel.app/ |
| 2 | UNIUN | Consumer / Privacy AI | Waitlist | https://uniun.in/ |
| 3 | Payroll Studio | B2B HR-Tech | Client production | — |
| 4 | UNIUN Inference | AI Infrastructure | Design phase | — |
| 5 | BillReward *(ex-Cheel)* | Consumer Fintech + AI | Built (v1.1.8) | — |
| 6 | Uttarakhand Next | Media / Publishing | Live | https://un-frontend-neon.vercel.app/ |
| 7 | BillBridge OCR | B2B Accounting AI | In development | — |
| 8 | Enterprise Chat | B2B Communication | Built | — |
| 9 | Pulse | AI Infrastructure / Content Automation | Built | — |

**Recurring strengths to market:**
- End-to-end delivery: mobile (Expo/RN) + web (Next.js) + backend (Node/Go/Python) + infra (Docker)
- AI/OCR pipelines in production (Google Vision, OpenCV, GPT-4o, on-device LLMs)
- Autonomous AI pipelines with multi-provider failover (never depend on a single AI vendor)
- Real-time systems (Socket.io + Redis presence)
- Multi-tenant SaaS architecture with true data isolation
- Indian-market compliance depth (GST, PF/ESIC/PT/TDS, Tally, UPI)
- Rigorous engineering: Result pattern, Zod validation, testcontainers, crash recovery, audit logging

**Available image assets:**
- `public/work/inventory.png`, `public/projects/payroll/payroll-catalog.png` (+ `payroll/screens/*.png`)
- `public/projects/billreward/*.png` (4 core app screens)
- `public/projects/enterprise-chat/analytics-dashboard.jpeg` (Enterprise Chat analytics screen)
- `public/projects/uniun-inference/ai-inference.jpg` (UNIUN site banner)
- More UI-kit screens available: `~/Work/reward/ui-ux/<screen>/screen.png`
  (admin, bill_details, bill_history, notifications, rejection_flow, upload_guidelines…)
- UNIUN product screenshots available on https://uniun.in/

---

## Combined Tech Stack (Across All Projects)

One consolidated view of every technology used across the portfolio — useful for the
website's "Our Expertise" / capabilities section.

### Languages
TypeScript · JavaScript · Python · Go · SQL

### Frontend (Web)
Next.js 15/16 (App Router) · React 19 · Tailwind CSS (v4, custom design tokens,
light/dark mode) · TanStack Query v5 · Redux Toolkit + RTK Query · Apollo Client (GraphQL)

### Mobile (Cross-Platform)
React Native · Expo (EAS builds, OTA updates, Expo Router) · Tamagui · React Native
Paper · React Navigation · TestFlight / Play Store deployment

### Backend & APIs
Node.js (18–22) · Express 5 · Apollo Server 5 (GraphQL) · Python FastAPI ·
Go (llm-gateway) · REST + GraphQL + OpenAI/Anthropic-compatible APIs ·
Result-pattern architecture · Zod runtime validation · cursor-based pagination ·
Python scheduled/background services (APScheduler), repository + unit-of-work pattern

### AI / ML & OCR
OpenAI GPT-4o (structured bill parsing) · Google Vision OCR · OpenCV · pypdf ·
on-device LLMs (Qwen3, DeepSeek R1, Gemma) · LLM gateway routing (multi-provider,
difficulty-cascade smart routing) · autonomous content summarisation with
multi-provider AI failover (Llama fallback)

### Real-Time & Messaging
Socket.io (client + server) · Redis (presence, heartbeats, pub/sub) ·
Expo push notifications · MLS end-to-end encryption (UNIUN)

### Databases & Storage
MySQL 8.4 (incl. one-DB-per-tenant multi-tenancy) · PostgreSQL · Redis ·
automated mysqldump backup pipelines with retention

### Auth & Security
JWT (access + refresh, RS256) · bcrypt · email/SMS OTP flows · role-based access
control · rate limiting · audit logging with before/after diffs · GSTIN/IRN fraud
verification

### DevOps & Quality
Docker + Docker Compose · PM2 / crash-recovery systems · node-cron · Winston logging ·
OpenTelemetry · Jest + testcontainers integration tests · Cypress E2E · Vercel deploys ·
GitHub-based workflows

### Domain Integrations
DMPS biometric attendance devices · Tally (planned) · UPI payouts · Indian statutory
compliance (GST/HSN/SAC, PF, ESIC, PT, TDS, Gujarat Form 5)
