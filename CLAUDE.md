## Project
Lifting Tracker — the first sub-system of XRSize4 ALL. A coach-client workout tracking app with hierarchical RBAC (Athlete → Coach → Gym → Super Admin). MVP ships the athlete experience; coach and admin views follow iteratively.

## Stack (MVP)
- Expo (React Native) — single codebase for iPhone app (TestFlight) + web dashboard (Expo Web on Vercel)
- Supabase — Postgres, auth (magic-link), real-time, storage, edge functions
- Offline-first — AsyncStorage + sync queue; reconcile on reconnect
- AI — Supabase Edge Functions → external LLM API for NL workout parsing and summaries

## Architecture docs (read before making decisions)
- `docs/lift-track-architecture_v0.4.0.md` — 24 decisions (D1–D24), full data model, non-decisions list
- `docs/lift-track-user-stories_v0.2.0.md` — 114 user stories, MVP through v4+
- `docs/lift-track-themes-epics-features_v0.2.0.md` — 8 themes, 31 epics, 109 features
- `docs/xrsize4all_concept_v0.2.0.md` — platform-level system-of-systems concept
- `docs/architecture-comparison_v0.3.0.md` — platform comparison and evolution through 5 phases
- `docs/lift-track-roadmap_v0.4.0.md` — 8 MVP sprints with backlog and dependencies

## Key decisions (quick reference)
- D2: Per-set granularity. User → Session → Exercise → Set.
- D4: Cloud DB (Supabase Postgres) is sole source of truth. Devices cache locally.
- D12: Schema is ontological — all relationships above Session are nullable FKs. Never force structure.
- D14: Weight stored as per-implement (what's on the dumbbell), not total. Volume computed from limb config.
- D15: Limb configuration (together/apart_simultaneous/apart_alternating/single/none) is a property of the exercise.
- D16: Rest in integer seconds with session → exercise → set defaulting cascade.
- D17: Set grouping via group_id (supersets, drop sets).
- D19: AI follows Reasoner Duality — Tier 1 deterministic governs decisions, Tier 2 LLM explains and suggests.

## Commands
- Dev: `npx expo start` (iOS simulator + web)
- Build iOS: `eas build --platform ios --profile preview` (cloud build, no local Xcode)
- Build Web: `npx expo export --platform web` then deploy to Vercel
- Test: not yet configured — add Jest + React Native Testing Library
- Lint: not yet configured — add ESLint + Prettier

## Structure (target — not yet scaffolded)
- `app/` — Expo Router screens
- `components/` — reusable UI components
- `lib/` — Supabase client, sync engine, AI service
- `data/` — workout log files (historical import source)
- `docs/` — architecture, stories, roadmap, comparisons
- `supabase/` — migrations, seed data, edge functions

## Conventions
- Mobile-first design — iPhone is the primary device for all roles
- Offline-first — every write goes to local storage first, syncs when online
- Schema-complete from day one — all D1–D24 tables exist even if MVP UI doesn't expose them
- Exercise variations with different limb configs are distinct exercises, grouped by family
- Weight entered = per-implement; volume = computed from limb config at analytics time
- AI outputs are always drafts — user confirms before any write to athlete data
- Every doc gets YAML frontmatter (author: Eric Riutort, created/updated dates) and a copyright footer

## Don't
- Don't make architectural decisions without checking `docs/lift-track-architecture_v0.4.0.md` first
- Don't store weight as total load — always per-implement (D14)
- Don't force Sessions into Programs/Routines — all parent relationships are nullable (D12)
- Don't let AI write data without user confirmation (D19 Authority Rule)
- Don't build coach/admin UI in MVP — schema supports it, UI doesn't expose it yet
- Don't use localStorage for auth tokens — use Expo SecureStore
- Don't skip offline support — gym connectivity is unreliable

## Legacy
The repo contains a v1 PWA prototype (vanilla HTML/CSS/JS, GitHub Pages). It's superseded by this architecture but stays in git history. The `data/combined_workout_log.txt` is the historical import source (400+ sessions).
