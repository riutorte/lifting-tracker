---
author: Eric Riutort
created: 2026-04-14
updated: 2026-04-21
---

# Dispatch Handoff — Lifting Tracker

**Read this first.** This is the context document for a new Dispatch session picking up the Lifting Tracker project.

## Current state (2026-04-21, evening)

Planning is complete. Best practices research is complete. Implementation is starting.

### What exists

- **Full planning doc set** in `~/lifting-tracker/docs/`:
  - `xrsize4all_concept.md` — XRSize4 ALL platform concept (system of systems)
  - `architecture.md` — 24 decisions (D1–D24), full data model with 30+ tables
  - `user-stories.md` — 114 user stories, MVP through v4+
  - `themes-epics-features.md` — 8 themes, 31 epics, 109 features
  - `roadmap.md` — 8 MVP sprints with Kanban tables, dependencies, sizing
  - `effort-estimate.md` — calendar time estimates (MVP ~6 months at 10–15 hrs/week)
  - `architecture-comparison.md` — 7-approach comparison + platform evolution through 5 phases
- **Best practices research** at `docs/reference/best-practices-review.md` — YouTube course analysis, Anthropic engineering patterns, 5 gaps identified
- **CLAUDE.md** at repo root — updated for Expo + Supabase / XRSize4 ALL
- **Legacy v1 PWA** — deployed to GitHub Pages, superseded by new architecture
- All docs committed and pushed to GitHub

### What does NOT exist yet

- No Expo project scaffolded
- No Supabase schema deployed
- No app code
- Docker and Supabase CLI not installed on Eric's Mac
- Community research doc not yet written (web search data gathered but not compiled)

### Active sessions

- **Lifting Tracker project session** ("Review dispatch handoff documentation") — completed best practices research, currently idle, asked Eric about making review doc into an artifact
- **Sprint 0 Code task** — was started then paused because Supabase CLI isn't installed yet. May need to be restarted fresh.

### Pending work items

1. **Community research doc** — web search data from 8 searches already gathered (offline-first libraries, RLS pitfalls, EAS Build gotchas, magic-link deep linking, migration best practices, starter templates, Claude Code real-world lessons). Needs to be compiled into `docs/reference/community-research.md`.
2. **Close 5 gaps from best practices review** — D19 context strategy, Sprint 6 split, tool-design standards, memory-tool pattern, CLAUDE.md guardrails. See `docs/reference/best-practices-review.md`.
3. **Data merge** — `data/merge_2026-04-14.txt` (11 cleaned April sessions) still not merged into `combined_workout_log.txt`. Multiple prior Code tasks failed.
4. **Sprint 0 implementation** — Docker + Supabase CLI install, Expo scaffolding, schema deployment, auth flow, offline sync skeleton.

## Key decisions (quick reference)

- **D8**: Expo (React Native) + Supabase, offline-first
- **D3**: Hierarchical RBAC: Athlete → Coach → Gym → Super Admin
- **D12**: Ontological schema — all relationships above Session are nullable FKs
- **D14/D15**: Weight = per-implement; limb config is property of exercise
- **D19**: AI follows Reasoner Duality — Tier 1 deterministic governs, Tier 2 LLM explains

## Workspace conventions

- **Dispatch** = orchestrator. Spawns and monitors Code tasks. Strategy and planning discussions. Can be driven from phone.
- **Lifting Tracker project tasks** = research, architecture discussions, document drafting. Created from the project home.
- **Claude Code tasks** (`start_code_task`) = all implementation, commits, pushes.
- **Claude Code CLI** = interactive coding. `~/lifting-tracker/CLAUDE.md` loads automatically.
- Work autonomously. Only ask Eric when genuinely ambiguous, risky, or requiring domain knowledge.
- Every doc: YAML frontmatter (author: Eric Riutort) + copyright footer.
- Always check Anthropic's published docs before making AI-related architecture recommendations.

## Cowork setup

- **Lifting Tracker project** exists with `~/lifting-tracker` attached
- **Global instructions** set (planning/architecture role, Eric's background, files-over-memory, attribution, structured deliverables)
- **Domain allowlist** changed to "All domains" — new sessions should have unrestricted web access
- **Extensions installed**: Filesystem, Read/Write Apple Notes, Control your Mac
- **Connectors**: GitHub Integration, Claude in Chrome
- **Code permissions**: Auto mode

## Immediate next step

Compile the community research doc from gathered web search data, then proceed to Sprint 0 implementation (install Docker + Supabase CLI on Eric's Mac, scaffold Expo project, deploy schema).

---

© 2026 Eric Riutort. All rights reserved.
