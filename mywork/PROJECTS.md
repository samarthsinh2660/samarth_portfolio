# Samarth — Project Portfolio (Master Doc)

> Single source of truth for every project we've built. Use this to create project pages,
> case studies, and marketing sections on the website. Each entry has: pitch, features,
> tech stack, architecture highlights, links, and available assets/screenshots.
>
> **Attribution:** Unless a project's entry says otherwise, it's Samarth's own build.
> Projects 10–13 (Universal Web Automation Agent, Prompt-to-Reel, Electoral Roll
> Extraction Pipeline, Broadway Ticket Monitor) are marked **Built by: Hritik**.

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
10. [Universal Web Automation Agent — Vision-Driven Computer Use](#10-universal-web-automation-agent--vision-driven-computer-use)
11. [Prompt-to-Reel — AI Video Generation Platform](#11-prompt-to-reel--ai-video-generation-platform)
12. [Electoral Roll Extraction Pipeline — Government Data at Scale](#12-electoral-roll-extraction-pipeline--government-data-at-scale)
13. [Broadway Ticket Monitor — Real-Time Seat Alerts](#13-broadway-ticket-monitor--real-time-seat-alerts)
14. [Pramāṇa AI — Indian Legal Intelligence](#14-pramāṇa-ai--indian-legal-intelligence)
15. [Paper Checker — Answer Sheet Mapping & Grading](#15-paper-checker--answer-sheet-mapping--grading) *(formerly "VedaAI")*
16. [SecurePass — Face-Verified Delivery Platform](#16-securepass--face-verified-delivery-platform)

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
**Asset:** `public/projects/pulse/pulse-dashboard-catalog.png` (generated operator-dashboard
catalog — Monitor, Sources, Analytics and Notes pages, in the product's own indigo/slate theme)

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

## 10. Universal Web Automation Agent — Vision-Driven Computer Use

**One-line pitch:** An agentic AI that *looks* at a web page like a human does — screenshot
in, action out — and drives any form on any website to completion, with no site-specific
selectors, scripts, or integrations written in advance.

**Category:** Agentic AI · Computer Use · Browser Automation
**Status:** Built and running in production automation workloads
**Built by:** Hritik

### The Problem It Solves
Classic web automation is a maintenance treadmill: every site needs its own selectors, and
every redesign breaks them. This agent removes that coupling entirely. It receives a
screenshot of the current viewport, reasons about what it sees, and emits **one structured
action at a time** — click, type, select, scroll, upload, switch tab — then observes the
result and decides the next step. A site it has never seen before needs zero new code.

### How the Agent Loop Works
```
screenshot + page context ──▶ vision-language model ──▶ structured JSON action
        ▲                                                        │
        │                                                        ▼
   observe result  ◀── loop guards ◀── action dispatcher ──▶ real browser (CDP)
```
1. **Observe** — a viewport screenshot plus a compact DOM/form-scan context block
2. **Think** — the model emits one `AgentStep`: an optional `note` (facts worth carrying
   forward) plus exactly one `tool_call`
3. **Act** — the dispatcher translates normalized `[0,1000]` coordinates into real
   CDP mouse/keyboard events against the live page
4. **Guard** — loop detection, submit-confirmation checks and scroll guards inspect the
   outcome and feed corrective feedback back into the conversation

### Key Engineering
- **Strict structured outputs** — every action is a Pydantic-discriminated union
  (20 tools: `click`, `click_and_write`, `click_and_clear`, `select_option`, `scroll`,
  `scroll_to_element`, `upload_file`, `switch_tab`, `refresh_page`, `request_email_otp`,
  `request_mobile_otp`, `task_complete`, `failed`, …). The model's JSON schema is enforced
  server-side, so a malformed action can't reach the browser
- **Resolution-independent coordinates** — the model works in a normalized 0–1000 space
  that is scaled to the real viewport, so the same policy works on any screen size
- **Bounded visual memory** — a conversation manager keeps only the last **3 screenshots**
  in context (older ones are evicted to `[screenshot evicted]` placeholders) and caps
  history at 60 turns; an *emergency trim* halves the context and retries when the model
  returns an empty completion from context overflow
- **Loop guards** — detects exact-repeat actions, multi-action cycles, and runaway
  scrolling inside custom dropdowns, then injects targeted corrective instructions
  ("stop scrolling, reopen the dropdown and use `select_option`") instead of failing
- **Anti-hallucinated-success** — `task_complete` is *blocked* unless a real confirmation
  signal is detected on the page or in the URL; ambiguity after a submit click triggers a
  forced top-to-bottom validation-error sweep
- **Hard problems handled in the dispatcher** — cross-origin iframes (point→frame
  resolution), shadow DOM piercing, native `<select>` patching, custom autocomplete
  scanning, file-chooser interception for uploads, date/time inputs, and multi-tab flows
- **Human-in-the-loop escape hatches** — the agent can request an email OTP (IMAP polling
  with delivery-delay tolerance) or an SMS OTP from the user mid-run, then continue
- **Human-block overlay** — a transparent capture-phase overlay stops a watching user from
  accidentally clicking mid-run, with a debug cursor rendered so the agent's actions are
  visible in real time
- **Reasoning trace streaming** — the model's thinking channel is surfaced to the UI for
  live explainability, but deliberately *not* spliced back into history
- **Self-hosted model, proxied** — traffic is routed through a backend proxy so the
  inference key never ships with the client; per-call token accounting reports peak
  sequence length to right-size the vLLM `--max-model-len`

### Scale & Reach
Ships alongside a library of **50+ site-specific fast-path clients and mapping profiles**
(major ATS platforms and enterprise portals). The universal agent is the fallback that
handles everything not covered — and can *rebase* onto a dedicated client when it
recognises a known platform mid-run.

### Tech Stack
| Layer | Technology |
|---|---|
| Agent | Python 3.11+, asyncio, Pydantic structured outputs, OpenAI-compatible client |
| Model | Self-hosted vision-language model served via vLLM behind an auth proxy |
| Browser | nodriver (CDP), stealth patches, human-like mouse/typing kinematics |
| Perception | Viewport screenshots + injected DOM/form-scan JavaScript |
| Integrations | IMAP OTP retrieval, captcha solver providers, IPC bridge for concurrent runs |

---

## 11. Prompt-to-Reel — AI Video Generation Platform

**One-line pitch:** Type a prompt, get a finished narrated video — script, voiceover,
talking avatar, b-roll, generated scenes and a rendered edit, produced end to end by a
chained AI pipeline.

**Category:** Generative AI · Media Production · SaaS
**Status:** Built (Dockerized full stack)
**Built by:** Hritik

### The Product
A project-based studio where a user describes a video, refines the script through chat,
and the platform builds it: an LLM writes and structures the script, TTS generates the
voiceover, an avatar service produces the talking head, and generative models fill in
b-roll and scene imagery — all composited by FFmpeg into a final render.

### The Pipeline
```
prompt ─▶ script generation ─▶ chat refinement ─▶ finalize
       ─▶ timeline (scene breakdown + timings)
       ─▶ voiceover (TTS) ─▶ word-level alignment (WhisperX)
       ─▶ avatar video   ┐
       ─▶ b-roll clips   ├─▶ FFmpeg composite ─▶ final MP4
       ─▶ scene images   ┘
```

### Key Features
- **Chat-driven scripting** — generate a draft, then refine it conversationally before
  locking it in; finalizing a script auto-produces the scene timeline
- **Timeline engine** — the script is decomposed into timed scenes, each routed to the
  right generator (avatar / b-roll / still image)
- **Multi-avatar support** — custom and private avatar libraries, per-avatar default
  voices, dual-avatar compositions
- **Word-level audio alignment** — WhisperX timestamps keep visuals synced to narration
- **Project workspace** — JWT auth, per-user projects, asset management, long-running
  render jobs with polling-based status
- **Fully containerized** — one `docker-compose up` brings up web, API and Postgres

### Tech Stack
| Layer | Technology |
|---|---|
| Backend | Python FastAPI, SQLAlchemy 2, PostgreSQL, JWT (python-jose) + bcrypt |
| Frontend | Next.js (App Router), TypeScript |
| Generative AI | LLM script/timeline generation, TTS voiceover, AI avatar video, generative b-roll & image models |
| Media | FFmpeg compositing, WhisperX forced alignment |
| Infra | Docker + Docker Compose, spec-driven module architecture |

---

## 12. Electoral Roll Extraction Pipeline — Government Data at Scale

*(Client project — client anonymized.)*

**One-line pitch:** A GPU-accelerated pipeline that turns millions of scanned,
Devanagari-script electoral roll PDFs into a clean, verified, structured voter dataset —
OCR'd on GPU, then cross-verified record-by-record against the official government portal.

**Category:** Data Engineering · Computer Vision / OCR · Public-Data Extraction
**Status:** Delivered — production runs across multiple districts & constituencies
**Built by:** Hritik

### The Problem
Electoral rolls are published as image-only PDFs: thousands of pages, each a grid of
voter cells printed in Hindi (Devanagari) with a Latin EPIC voter-ID strip. There is no
machine-readable source. Naive OCR produces garbage; a per-cell, layout-aware approach
plus an authoritative cross-check is the only way to get usable data.

### The Three-Stage Pipeline
**Stage 1 — Ingest**
Streams source PDFs out of Azure Blob Storage per district / constituency, with
download → process → delete sequencing so a cheap GPU box never runs out of disk.

**Stage 2 — GPU OCR extraction**
- Renders pages at a tuned **300 DPI** (empirically better *and* faster than 400 DPI for
  this model)
- **Detects voter cells per page** with OpenCV — the count varies page to page
- One PaddleOCR pass per page, then text fragments are **grouped back into their cell**
  and parsed into fields (name, relation type & name, house no., age, sex, status, EPIC)
- Two OCR modes: `hi_only` (Hindi model handles body text *and* the EPIC strip — ~1 GB
  VRAM per worker) and `dual` (separate Hindi + English models for safer Latin recall)
- **Multiprocess batch runner** with a resume layer — workers sized to available VRAM
  (3 on an 8 GB GPU, 6 on 24 GB), interrupted runs pick up where they stopped

**Stage 3 — Official-portal verification**
- Looks up **every extracted EPIC** against the government voter API, at ~60 concurrent
  threads on a cheap CPU box (deliberately decoupled from the GPU stage — the lookup is
  network-bound, so it shouldn't burn GPU rental hours)
- Handles the portal's real protocol: **AES-256-GCM captcha decryption**, captcha OCR via
  a **custom-trained ONNX model**, and **RSA + AES-GCM payload encryption**
- **IP rotation via ephemeral AWS API Gateway endpoints** across 9–16 regions, with a
  cleanup utility to tear down leftover gateways
- Per-thread session caching to amortize TLS handshakes
- **Provenance on every row** — portal data replaces OCR fields where available
  (`source=web`); where the portal returns nothing the OCR fields are kept (`source=pdf`),
  so nothing is silently dropped
- Emits a stats sidecar per constituency: total / web-verified / pdf-only / deleted /
  errored / wall-clock

### Ops Design
Built for **rented GPU instances** (vast.ai / AWS g6): a one-shot `setup.sh` bootstraps
poppler, the venv and PaddlePaddle-GPU on a fresh box, and a multi-constituency runner
loops the whole download → extract → delete cycle unattended.

### Tech Stack
| Layer | Technology |
|---|---|
| OCR | PaddleOCR 3 (GPU), OpenCV, pdf2image / poppler, multiprocessing |
| Verification | Python requests, pycryptodome (AES-GCM / RSA-OAEP), custom ddddocr ONNX captcha model |
| Networking | `requests-ip-rotator` over AWS API Gateway (multi-region), boto3 |
| Storage | Azure Blob Storage, CSV deliverables + JSON run stats |
| Infra | Rented GPU instances (vast.ai / AWS), bootstrap + batch shell runners |

---

## 13. Broadway Ticket Monitor — Real-Time Seat Alerts

*(Client project — delivered.)*

**One-line pitch:** A monitoring app that watches Broadway seat inventory across two
ticketing platforms in real time, renders live interactive seat maps, and emails the user
the moment the seats they want appear.

**Category:** Real-Time Monitoring · Web Scraping / Anti-Bot · Consumer Tooling
**Status:** Delivered — shipped as a one-click desktop bundle
**Built by:** Hritik

### The Problem
Premium Broadway seats surface and vanish within minutes, and the two major ticketing
platforms expose no public availability API — both sit behind session cookies, bot
detection and rate limits. This app keeps a continuously refreshed picture of inventory
and turns it into actionable alerts.

### Key Features
- **Dual-platform coverage** — one unified data model over two independent ticketing
  platforms, each with its own scraper service
- **Interactive seat map** — zoom/pan seat layouts with live availability and price levels
- **Email alerts** — fire when matching seats open; **recurring alerts** stay armed after
  firing instead of self-disabling
- **Automatic alert expiry** — alerts for performances that have passed are marked expired
  rather than deleted, preserving history
- **Performance calendar** — month-filtered performance browsing, synced from live sources
- **Self-healing sessions** — automated cookie/session capture and refresh per platform,
  triggerable from the UI when a session goes stale
- **Runtime proxy management** — the proxy pool lives in Postgres and is editable from a
  `/proxies` admin page; services hot-reload proxies with **no rebuild or restart**
- **Tiered sync scheduling** — alert-focused performance sync every 10 minutes, global
  catalog sync every 6 hours, plus a startup sync on backend boot
- **Batch rotation scraper** — cycles all tracked shows continuously so every show has
  fresh cached availability on a predictable interval

### Anti-Bot Approach
Scrapers run **Camoufox / Playwright under Xvfb inside Docker**, behind a managed
rotating-proxy pool with per-platform session cookie lifecycles — the difference between
a scraper that works for an hour and one that runs unattended for months.

### Delivery
Packaged as a **macOS DMG** for a machine that only has Docker installed: the recipient
drags one folder across and double-clicks a launcher — no Node, no terminal, no setup.
`npm run ticketapp` on a dev box builds and starts every container, waits for health
checks, runs migrations, seeds shows and venues, initializes platform sessions and syncs
performance dates in a single command.

### Architecture
```
+--------------------------------------------------------------+
|                       Docker Network                          |
+------------+-------------+---------------+-------------------+
|  Frontend  |   Backend   |   Scraper A   |     Scraper B     |
|  (React)   |  (Express)  | (Playwright)  |    (Playwright)   |
+------------+-------------+---------------+-------------------+
|            PostgreSQL (shows, seats, alerts, proxies)         |
+--------------------------------------------------------------+
```

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (seat map with zoom/pan) |
| Backend | Node.js, Express, TypeScript, SQL migrations |
| Scrapers | Python + Camoufox, Playwright, Xvfb, rotating proxy pool |
| Database | PostgreSQL (shows, venues, seat layouts, performances, sessions, proxies, availability cache) |
| Notifications | Email alert service with test-send + toggle controls |
| Infra | Docker Compose, health-checked startup orchestration, macOS DMG packaging |

---

## 14. Pramāṇa AI — Indian Legal Intelligence

**One-line pitch:** An AI-first legal research platform for Indian law that retrieves from
primary legal sources, keeps provenance on every claim, and verifies every generated
statement against its cited source before showing it to the user — instead of a chatbot
that invents case law.

**Category:** Legal Tech · AI Research / RAG · Knowledge Graph
**Status:** Built, actively developed — live
**Links:**
- Live: **https://legal-ai-swart-one.vercel.app/**

**Assets:** `public/projects/pramana/pramana-catalog.png` (4-screen catalog — Research, Case
Workspace, Dashboard, Citation Graph — captured from the live `design/pramana-ui.html`
prototype), `public/projects/pramana/screens/*.jpg`. Source prototype also has
`design/BRAND.md`, `design/DESIGN_SYSTEM.md`, `design/UX_FLOWS.md`.

### The Problem
General-purpose LLMs asked Indian legal questions confidently invent case names and
misquote statutes. Pramāṇa's fix is architectural, not prompt-level — every claim in an
answer is checked against its cited source before a user ever sees it.

### How It Works
- A multi-agent pipeline: **Supervisor → three parallel Researchers (Static/trusted
  corpus, Dynamic/live search, Active/usage-derived candidates) → Analyst → Draft →
  Verification agent.** Unsupported claims trigger more research instead of a guess
- All sub-agents share one read-only context object built once per thread, so they never
  re-derive or disagree on the same facts
- **Three authority tiers** for knowledge — Static (curated/versioned: Constitution, India
  Code, settled Supreme Court rulings), Dynamic (live-retrieved per query), and Active
  (learned from usage, never authoritative until independently validated — popularity is
  explicitly not treated as correctness)
- **Citation graph** for multi-hop precedent traversal (which case cites which section,
  which judgment decided by which bench), paired with hybrid keyword + vector search over
  the statute/judgment corpus — "two databases, not four"
- Two product surfaces: standalone **Research** threads vs. persistent **Case**
  workspaces that seed context from a matter's own documents, facts and history

### Key Features
- Real ingested corpus: **35,601 statute sections, 12,337 judgments, 860 acts, 332,025
  embedded chunks**
- Published evaluation numbers: claim-verification accuracy 0.92–0.94 (50 frozen claims),
  treatment-classification agreement 0.92 with law reporters (150 cases), retrieval
  recall@10 68%, bench extraction 97% of Supreme Court judgments correctly parsed
- An honest, non-inflated "what's not done yet" section in the project's own README — no
  multi-tenant isolation yet, currency/re-scraping skipped, conflict detection built but
  untested
- Citation graph visualization (force-directed, draggable/zoomable) in the frontend

### Tech Stack
| Layer | Technology |
|---|---|
| Backend / AI | Python 3.11+, FastAPI, LangGraph, LangChain-core, Google Gemini |
| Retrieval | PostgreSQL + pgvector (hybrid keyword/vector search), Neo4j (citation graph), sentence-transformers |
| Frontend | Next.js 16 (App Router), React 19, TanStack Query, Radix UI / shadcn, D3 (graph viz), Tailwind, Zod |
| Auth | JWT (PyJWT), Argon2 |
| Infra | Docker Compose (Postgres, Neo4j, API) |

---

## 15. Paper Checker — Answer Sheet Mapping & Grading

*(Formerly "VedaAI".)*

**One-line pitch:** Upload a question paper and a student's handwritten answer sheet — the
app extracts every question, reads the handwriting, matches each answer to its question,
grades it against a rubric, and highlights exactly where on the page each answer was written.

**Category:** AI / EdTech · Computer Vision & LLM Grading
**Status:** Built and deployed
**Links:**
- Live: **https://vedaai.billappreward.sbs**

**Assets:** `public/projects/paper-checker/paper-checker-catalog.png` (2-screen catalog —
Upload, Mapping & Grading — built from the app's own real screenshots),
`public/projects/paper-checker/screens/*.png`. Source repo also has ~20 exported Figma UI
assets in `public/figma/`.

### The Problem
Manually grading handwritten answer sheets against a question paper is slow and
error-prone — matching mis-ordered or mislabelled answers to the right question, judging
diagrams, and applying partial-credit rubrics consistently is hard to do at scale.

### How It Works
- The question paper's PDF text layer is parsed directly when available (deterministic, no
  vision model, no hallucination risk), falling back to vision only for scanned papers with
  no text layer
- Answer sheet pages are rendered to images in the browser and read **one page per
  request** — a deliberate bound that stops the model from fabricating a fluent
  full-sheet transcription in one shot
- **Two-step answer matching:** a handwritten label is proposed first, then the answer's
  actual content verifies or corrects that label (a label is 1–2 illegible glyphs vs. a
  full paragraph of content) — content wins when it disagrees with the label
- Bounding boxes are stored normalized, so highlights stay accurate at any zoom level; an
  answer can carry multiple regions to span a page break

### Key Features
- Handles answers out of page order, answers spanning two pages, unanswered questions
  (reported explicitly, never zero-scored silently), answers matching no question (kept
  unmatched rather than force-matched), and sub-part numbering (11(a)/11(b) preserved)
- **Rubric-based grading** across 5 mark categories — content, diagram, labelling, working
  (method/steps), accuracy — with marks awarded per line, including half-marks
- Diagrams are graded from the actual page image, not the transcript; step-marking keeps
  method marks even when the final numeric answer is wrong
- **Semantic grading** — full marks for correct meaning in the student's own words,
  synonyms or examples; nothing deducted for phrasing, spelling or handwriting quality
- Model fallback chain (comma-separated model list) — falls through to the next model on
  quota exhaustion
- **Nothing is persisted** — no database, no files written to disk; pages are held
  in-browser and sent in one request/response, so there's no student-data retention risk
- Click a question in the paper → the answer sheet auto-scrolls and zooms to that answer
  and outlines it
- Documented accuracy: ~88% word accuracy on real handwriting transcription, ~0.89 IoU on
  highlight regions vs. hand-marked ground truth

### Tech Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · `pdfjs-dist` (PDF
parsing/rendering) · Google Gemini API · Zod · Docker + Docker Compose behind nginx

---

## 16. SecurePass — Face-Verified Delivery Platform

*(Working title.)*

**One-line pitch:** A B2B platform for bullion/precious-metals dealers that verifies
deliveries with facial recognition — a courier photographs the receiver at the door, the
system matches it against an enrolled reference photo, and only a match (or an admin's
manual override) completes the handover, producing a tamper-proof delivery record.

**Category:** B2B SaaS · Fintech-adjacent (Precious Metals / Bullion Trade Security)
**Status:** Built — enrollment, live face verification, and manual-approval review are all
shipped and tested (unit + integration + E2E, including Maestro mobile E2E tests). Delivery
proof PDF/hash certificates and a live-tracking map view are still planned, not built.

**Assets:** `public/projects/securepass/securepass-catalog.png` (4-panel catalog —
Overview, Admin Dashboard, Delivery Queue, Face Verification — captured from the
`UI-design/` Vite + React + Tailwind prototype), `public/projects/securepass/screens/*.jpg`
(also includes a Super Admin screen).

### The Problem
High-value bullion deliveries need proof that the *right person* received the shipment,
not just a signature — and dealers need that proof to hold up as an audit trail, with a
human fallback for the cases automated matching can't confidently resolve.

### How It Works
- **Multi-tenant backend** — database-per-tenant, mirroring the same isolation model used
  on the Inventory platform
- **Delivery flow:** dealer creates an invoice (party, number, date, value, product,
  weight) → a QR code is generated → the courier scans it on arrival, which starts the
  delivery with a GPS-tagged timestamp
- **Face verification is a swappable provider**, not hard-wired to one vendor — a
  `FaceProvider` interface abstracts the recognition engine (shipped against a
  self-hosted engine, switchable to a cloud provider via one config value with zero
  controller code changes)
- **1:1 comparison, not 1:N search** — the courier selects the claimed receiver, and the
  live photo is checked only against that specific person's enrolled template (multiple
  reference photos per receiver are supported, to handle beard/glasses/aging variation),
  at a ≥85% confidence threshold
- Every verification attempt — match or no-match — is logged to a forensic audit trail;
  **three consecutive no-matches automatically escalate** the delivery to manual review
  instead of blocking it outright
- An admin reviews the logged attempts and approves or rejects with a mandatory,
  audit-logged reason

### Key Features
- Invoice → QR generation, GPS-tagged delivery start, live face capture, confidence-scored
  1:1 face match, 3-strike escalation to manual review, full audit trail
- Role-based access (admin / staff / delivery personnel) with multi-tenant data isolation
- Offline-capable mobile app for couriers, so a delivery can start and capture a
  verification even with a weak signal, syncing once back online

### Tech Stack
| Layer | Technology |
|---|---|
| Backend | Express 5, TypeScript, MySQL, JWT auth, QR generation, PDF generation, Winston logging, Jest + Supertest + testcontainers |
| Admin web | Next.js 16, React 19, TanStack Query, Tailwind, live maps, charts, QR scanning, Cypress E2E |
| Courier mobile | Expo Router, React Native, Tamagui, Redux Toolkit, TanStack Query, camera/location/offline storage/push notifications |
| Face recognition | Self-hosted face-recognition engine behind a swappable provider interface |

---

## Cross-Portfolio Summary (for the website)

| # | Project | Category | Status | Live Link | Built by |
|---|---|---|---|---|---|
| 1 | Multi-Tenant Inventory | B2B SaaS | Production-ready | https://inventory-system-launch-site.vercel.app/ | Samarth |
| 2 | UNIUN | Consumer / Privacy AI | Waitlist | https://uniun.in/ | Samarth |
| 3 | Payroll Studio | B2B HR-Tech | Client production | — | Samarth |
| 4 | UNIUN Inference | AI Infrastructure | Design phase | — | Samarth |
| 5 | BillReward *(ex-Cheel)* | Consumer Fintech + AI | Built (v1.1.8) | — | Samarth |
| 6 | Uttarakhand Next | Media / Publishing | Live | https://un-frontend-neon.vercel.app/ | Samarth |
| 7 | BillBridge OCR | B2B Accounting AI | In development | — | Samarth |
| 8 | Enterprise Chat | B2B Communication | Built | — | Samarth |
| 9 | Pulse | AI Infrastructure / Content Automation | Built | — | Samarth |
| 10 | Universal Web Automation Agent | Agentic AI / Computer Use | Production | — | **Hritik** |
| 11 | Prompt-to-Reel | Generative AI / Media | Built | — | **Hritik** |
| 12 | Electoral Roll Extraction | Data Engineering / OCR | Client delivered | — | **Hritik** |
| 13 | Broadway Ticket Monitor | Real-Time Monitoring | Client delivered | — | **Hritik** |
| 14 | Pramāṇa AI | Legal Tech / RAG | Live | https://legal-ai-swart-one.vercel.app/ | Samarth |
| 15 | Paper Checker *(ex-VedaAI)* | AI / EdTech | Live | https://vedaai.billappreward.sbs | Samarth |
| 16 | SecurePass | B2B SaaS / Fintech-adjacent | Built | — | Samarth |

**Recurring strengths to market:**
- End-to-end delivery: mobile (Expo/RN) + web (Next.js) + backend (Node/Go/Python) + infra (Docker)
- **Agentic AI in production** — vision-driven computer-use agents with structured-output
  tool calling, loop guards, and bounded visual memory
- AI/OCR pipelines in production (Google Vision, OpenCV, PaddleOCR on GPU, GPT-4o, on-device LLMs)
- **Generative media pipelines** — script → voiceover → avatar → b-roll → FFmpeg render
- **Hard-target data acquisition** — stealth browser automation, proxy/IP rotation, session
  lifecycle management, custom captcha models, encrypted-API reverse engineering
- Autonomous AI pipelines with multi-provider failover (never depend on a single AI vendor)
- **Multi-agent AI systems with built-in verification** — claims checked against cited
  sources before a user sees them, not just generated and trusted
- **Biometric verification workflows** — swappable face-recognition provider, 1:1 match
  scoring, automatic escalation to human review on repeated failure
- Real-time systems (Socket.io + Redis presence)
- Multi-tenant SaaS architecture with true data isolation
- Indian-market compliance depth (GST, PF/ESIC/PT/TDS, Tally, UPI)
- Rigorous engineering: Result pattern, Zod validation, testcontainers, crash recovery, audit logging
- **Cost-aware infrastructure** — GPU vs CPU stage splitting, rented-GPU bootstrap scripts,
  disk-frugal streaming pipelines

**Available image assets:**
- `public/work/inventory.png`, `public/projects/payroll/payroll-catalog.png` (+ `payroll/screens/*.png`)
- `public/projects/billreward/*.png` (4 core app screens)
- `public/projects/enterprise-chat/analytics-dashboard.jpeg` (Enterprise Chat analytics screen)
- `public/projects/uniun-inference/ai-inference.jpg` (UNIUN site banner)
- More UI-kit screens available: `~/Work/reward/ui-ux/<screen>/screen.png`
  (admin, bill_details, bill_history, notifications, rejection_flow, upload_guidelines…)
- UNIUN product screenshots available on https://uniun.in/
- **No assets yet for projects 10–13.** Candidates worth capturing: an agent run with the
  debug cursor + reasoning trace visible (10), the video studio timeline and a rendered
  sample reel (11), a sample verified voter CSV / run-stats screenshot (12), the interactive
  seat map and alert creator (13)
- **Live on the website for 14–16**: all three now have generated marketing catalogs built
  from real captured screens — `public/projects/pramana/pramana-catalog.png`,
  `public/projects/paper-checker/paper-checker-catalog.png`,
  `public/projects/securepass/securepass-catalog.png` — plus individual screens in each
  project's `screens/` folder, wired into `features/site/content/work.ts` (orders 10–12)

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
Result-pattern architecture (`neverthrow`) · Zod runtime validation · cursor-based pagination ·
Python scheduled/background services (APScheduler), repository + unit-of-work pattern ·
asyncio agent loops with Pydantic structured outputs · multi-agent LangGraph pipelines
(supervisor/researcher/analyst/verifier roles)

### AI / ML & OCR
OpenAI GPT-4o (structured bill parsing) · Google Gemini (document/handwriting reading,
legal research) · Google Vision OCR · OpenCV · pypdf · PaddleOCR 3 (GPU-accelerated,
Devanagari script) · on-device LLMs (Qwen3, DeepSeek R1, Gemma) · self-hosted
vision-language models served via vLLM · LLM gateway routing (multi-provider,
difficulty-cascade smart routing) · autonomous content summarisation with multi-provider
AI failover (Llama fallback) · generative video pipelines (LLM script/timeline, TTS
voiceover, AI avatar, generative b-roll/scene imagery, WhisperX forced alignment) ·
agentic computer-use (structured tool calling, loop guards, bounded visual memory,
anti-hallucinated-success checks) · claim-verification RAG (citation-grounded answers,
hybrid keyword + vector retrieval, knowledge graph traversal) · face recognition (1:1
biometric verification via a swappable provider interface)

### Real-Time & Messaging
Socket.io (client + server) · Redis (presence, heartbeats, pub/sub) ·
Expo push notifications · MLS end-to-end encryption (UNIUN) · email alert services

### Databases & Storage
MySQL 8.4 (incl. one-DB-per-tenant multi-tenancy) · PostgreSQL (incl. pgvector for hybrid
search) · Neo4j (citation/knowledge graph) · Redis · Azure Blob Storage · automated
mysqldump backup pipelines with retention

### Auth & Security
JWT (access + refresh, RS256) · bcrypt · email/SMS OTP flows · role-based access
control · rate limiting · audit logging with before/after diffs · GSTIN/IRN fraud
verification · AES-256-GCM / RSA-OAEP payload encryption · custom ONNX captcha-solving
models

### Browser & Data Acquisition
nodriver / nodriver-CDP · Camoufox · Playwright (under Xvfb) · stealth browser
automation · rotating-proxy pools (`requests-ip-rotator` over AWS API Gateway,
multi-region) · self-healing session/cookie lifecycle management

### DevOps & Quality
Docker + Docker Compose · PM2 / crash-recovery systems · node-cron · Winston logging ·
OpenTelemetry · Jest + testcontainers integration tests · Cypress E2E · Vercel deploys ·
GitHub-based workflows · rented-GPU bootstrap scripts (vast.ai / AWS g6) ·
one-click macOS DMG packaging

### Domain Integrations
DMPS biometric attendance devices · Tally (planned) · UPI payouts · Indian statutory
compliance (GST/HSN/SAC, PF, ESIC, PT, TDS, Gujarat Form 5) · government voter-portal
integration (captcha decryption, encrypted API reverse engineering) · Broadway
ticketing-platform integrations
