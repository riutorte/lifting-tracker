---
author: Eric Riutort
created: 2026-04-14
updated: 2026-04-21
---

# Dispatch Handoff — Lifting Tracker

**Read this first** when picking up a fresh Dispatch session for the lifting-tracker project. It's the curated context; raw archives in `conversation-archive/` and the full doc set in `docs/` have the detail.

## Where things stand (2026-04-21)

Planning is complete. Implementation has not started.

The project has evolved from "personal lifting tracker" to **XRSize4 ALL** — a system of systems for fitness, training, coaching, and community. The **Lifting Tracker** is the first sub-system, shipping as MVP. All planning documents are written, reviewed, committed, and pushed to GitHub.

## Document set (all in `~/lifting-tracker/docs/`)

| File | What it is | Lines |
|---|---|---|
| `xrsize4all_concept.md` | Platform-level concept: people, process, technology, 11 roles, 5-phase roadmap | 361 |
| `architecture.md` | Lifting Tracker architecture: 24 decisions (D1–D24), full data model, non-decisions | 735 |
| `user-stories.md` | 114 user stories, MVP through v4+, organized by phase and role | 359 |
| `themes-epics-features.md` | 8 themes, 31 epics, 109 features, release planning view | 470 |
| `roadmap.md` | 8 MVP sprints with Kanban tables, dependencies, sizing, post-MVP backlog | ~200 |
| `effort-estimate.md` | Calendar time estimates per phase, Claude Code productivity analysis | 205 |
| `architecture-comparison.md` | 7-approach comparison + Platform Evolution through 5 XRSize4 ALL phases | 369 |
| `architecture-comparison.xlsx` | Spreadsheet version (MVP comparison only — outdated vs .md) | — |
| `ontology-plan.md` | Exercise ontology planning | 162 |
| `dispatch-handoff.md` | This file | — |
| `conversation-archive/` | 2 archived transcripts from April 14 | — |

## Key decisions (quick reference)

- **D8**: Expo (React Native) + Supabase, offline-first. Real iPhone app via TestFlight + web dashboard from same codebase.
- **D3**: Hierarchical RBAC: Athlete → Coach → Gym → Super Admin. Roles inherit downward.
- **D12**: Schema is ontological — all relationships above Session are nullable FKs.
- **D19**: AI follows Reasoner Duality — Tier 1 deterministic governs, Tier 2 LLM explains.
- Full list: D1–D24 in `architecture.md`.

## What's been decided but NOT yet built

Everything. The repo has planning docs and a legacy v1 PWA. No Expo project, no Supabase schema, no app code.

## Immediate next steps (implementation)

1. **Set up local dev environment** — Docker + Supabase CLI + Expo scaffolding. All local, no cloud accounts needed yet.
2. **Deploy schema** — full D1–D24 data model to local Supabase Postgres.
3. **Auth flow** — magic-link via Supabase Auth.
4. **Exercise library seed** — parse canonical exercises from `data/combined_workout_log.txt`.
5. **Follow Sprint 0 in `roadmap.md`** for the full breakdown.

## Pending tasks not yet done

- **Data merge** — `data/merge_2026-04-14.txt` (11 cleaned April sessions) was never merged into `combined_workout_log.txt`. Multiple Code tasks attempted but hit worktree/auth issues. Still pending.
- **Anthropic docs review** — D19 and AI feature design should be cross-checked against Anthropic's published engineering patterns before Sprint 6. See memory file `feedback_check_anthropic_docs.md`.
- **YouTube transcript** — Eric wants to study "Build & Sell with Claude Code (10+ Hour Course)" (youtube.com/watch?v=mpALXah_PBg). YouTube was added to the domain allowlist but the setting requires a new Dispatch session to take effect.

## Workspace conventions

- **Dispatch** = strategy, planning, architecture, document work. No code.
- **Claude Code tasks** (`start_code_task`) = all implementation, commits, pushes.
- **Claude Code CLI** = interactive coding sessions. `~/lifting-tracker/CLAUDE.md` is updated and loads automatically.
- Work autonomously on routine tasks. Only ask Eric when genuinely ambiguous, risky, or requiring domain knowledge.
- Every generated document gets YAML frontmatter (author: Eric Riutort, created/updated dates) and `© YYYY Eric Riutort. All rights reserved.` footer.

## Cowork setup

- **Lifting Tracker project** exists in Cowork with `~/lifting-tracker` attached.
- **Global instructions** are set in Settings → Cowork (planning/architecture role, Eric's background, files-over-memory, attribution, structured deliverables).
- **Network allowlist** updated to include `www.youtube.com` and `youtu.be` — requires new session to take effect.
- **Memory files** persist across sessions: user background, attribution rule, workspace split, project state, autonomous work, Anthropic docs check.

## Stale sessions to clean up

Multiple idle Code tasks and Dispatch tasks from prior attempts. All work from them is either completed, superseded, or captured in docs. Safe to ignore.

---

© 2026 Eric Riutort. All rights reserved.
