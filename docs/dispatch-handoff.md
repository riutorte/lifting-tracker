---
author: Eric Riutort
created: 2026-04-14
updated: 2026-04-14
---

# Dispatch Handoff — Lifting Tracker

**Read this first** when picking up a fresh Dispatch session for the lifting-tracker project. It's the curated context; raw archives in `conversation-archive/` have full detail.

## Where things stand (one paragraph)

PWA v1 is built and deployed to GitHub Pages from this repo. It works as a personal tracker (parser, Overview/History/Log tabs, localStorage, PWA shell). Eric is now pivoting the product from "personal tracker" to "coach-client alpha." The Xcode + iCloud direction was considered and rejected because it doesn't support multi-user / cross-Apple-ID sync. Current direction: web app on **Vercel + Supabase** (Postgres + auth + JS SDK). Architecture decisions captured in `architecture.md` (D1–D6 closed, O1–O5 open).

## Files to know

| File | What it is |
|---|---|
| `docs/architecture.md` | Working architecture doc. D1–D6 settled, O1–O5 open. Source of truth for design decisions. |
| `data/combined_workout_log.txt` | Eric's full historical workout log. Currently the source of truth for the v1 PWA's Overview and History views. After Supabase migration, becomes a read-only seed archive. |
| `data/pending_notes_2026-04-14.txt` | Raw iPhone Notes paste, 3/18/26–4/14/26, ~30 sessions. Annotated with cleanup questions. |
| `data/merge_2026-04-14.txt` | Cleaned draft of those sessions, ready to merge into `combined_workout_log.txt`. **Not yet merged.** |
| `docs/conversation-archive/2026-04-14_claude-code-build.md` | Verbatim Claude Code session transcript: v1 build, parser fixes, data merge work, architecture pivot conversation. |
| `docs/conversation-archive/2026-04-14_chat-claude-setup-extract.md` | Curated extract from the chat Claude conversation (CLAUDE.md template guidance + Cowork/Dispatch architectural argument). |

## Settled (don't re-litigate)

- **D1**: Entry + analysis are equally first-class. Analytics is alpha, not v2.
- **D2**: Per-set granularity. `User → Session → Exercise → Set` hierarchy.
- **D3**: One app, role-aware UI. A user can be coach + athlete on one account.
- **D4**: Cloud DB is sole source of truth post-import. Text log becomes archive.
- **D5**: Seeded canonical exercise library + user-scoped custom exercises with alias mapping.
- **D6**: Real auth from day one (likely magic-link email).

Full rationale in `architecture.md`.

## Open (need answers before code)

- **O1**: Alpha audience scope — narrow (Eric + his clients) vs broad (any coach). Current lean: narrow.
- **O2**: Platform — web PWA vs native iOS vs Capacitor. Current lean: web (testers may not all use iPhones).
- **O3**: Business model — free in alpha, revisit before beta.
- **O4**: Ethan's role in the system — client / co-coach / co-developer / placeholder?
- **O5**: Business-vs-hobby framing — affects how much is invested beyond alpha minimum.

## Pending implementation work (not for Dispatch — route to Claude Code)

1. **Merge `data/merge_2026-04-14.txt`** into `data/combined_workout_log.txt` (Eric reviewed and approved the cleanup; merge was paused mid-conversation when scope shifted to architecture).
2. **Update v1 PWA** for any data changes after merge (parser re-run, Overview stats refresh).
3. **Eventually**: Supabase project setup, schema implementation, import script for `combined_workout_log.txt`, auth, frontend rebuild. None of this should start until O1 and O2 are answered.

## Workspace conventions (project-specific)

- Dispatch (this layer) = **strategy, planning, architecture, docs**. No code edits beyond docs.
- Claude Code sessions = **all implementation work**. Spawn via `start_code_task` against `~/lifting-tracker`.
- Architecture decisions live in `docs/architecture.md`; update there before declaring anything settled.
- Data files in `data/` are versioned; the existing v1 PWA reads them directly.

## Concept Computing — parked

Eric also runs a Concept Computing project at `~/Concept` (different paradigm — formal Concepts, tiered docs, gated workflows). It was raised as a candidate paradigm for the tracker's data model but **deferred to v2 consideration**. Alpha uses a conventional schema. See `~/Concept/CLAUDE.md` if you want context, but don't apply it here without explicit go.

## Cowork setup notes

- Global instructions (Settings → Cowork) are set: planning/architecture role, Eric's professional background, files-over-memory, attribution to Eric Riutort on every doc.
- Folders granted: `~/lifting-tracker`, `~/Concept`.
- A Cowork **Space** for "Lifting Tracker" (and one for "Concept Computing") is being set up so future sessions inherit folder access automatically.

## Immediate next step

Work through O1–O5 with Eric, then update `architecture.md` with the answers and commit.

---

© 2026 Eric Riutort. All rights reserved.
