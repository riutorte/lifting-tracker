---
author: Eric Riutort
created: 2026-04-29
updated: 2026-04-29
tier: REFERENCE
content_class: reference
version: 0.1.0
---

# Lifting Tracker — `docs/` Directory

Index of the Lifting Tracker project documentation. New sessions read this file first to find what they need; cross-references resolve from here. The authoritative rule of record for placement, naming, and versioning is `CONVENTIONS_v0.2.4.md`.

## Project rule files (Reference class)

Files at the top level governing how the docs/ tree is structured and how decisions are recorded.

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project-scoped Claude Code config |
| `CONVENTIONS_v0.2.4.md` | Authoritative file-placement, naming, and versioning rule of record (also home for the §14 SDLC methodology) |
| `orchestration_v0.1.0.md` | Three-surface orchestration pattern (Cowork / Dispatch / Code) |

## Architecture (Architecture class — semver versioned, ADR-governed)

The decision-of-record set. Pinned by downstream consumers; version bumps require explicit ADRs.

| File | Purpose |
|---|---|
| `lift-track-architecture_v0.4.0.md` | D1–D27 full architecture record |
| `xrsize4all_concept_v0.2.0.md` | Platform-level system-of-systems concept (XRSize4 ALL) |
| `architecture-comparison_v0.3.0.md` | Platform comparison and evolution through five phases |
| `lift-track-themes-epics-features_v0.2.0.md` | Feature decomposition (8 themes / 31 epics / 109 features) |
| `lift-track-user-stories_v0.2.0.md` | 114 user stories — MVP through v4+ |
| `lift-track-ontology-plan_v0.1.0.md` | Exercise ontology plan |

## Operational (Operational class — date-versioned or sprint-tagged)

Living docs that track current state. Most use `updated:` as the version; sprint-bounded ledgers use sprint-tagged naming per CONVENTIONS §6.2.

| File | Purpose |
|---|---|
| `lift-track-roadmap_v0.4.0.md` | Sprint backlog and dependencies |
| `lift-track-effort-estimate_v0.1.0.md` | Effort planning under solo+AI baseline |
| `lift-track-metrics_v0.1.0.md` | Productivity baseline |
| `lift-track-risks_v0.1.0.md` | Risk register (R-TV-* vendor watch, etc.) |
| `lift-track-dispatch-handoff_v0.1.0.md` | Session-to-session handoff (currently bare-name; renames to `lift-track-dispatch-handoff_v0.1.0.md` in Sprint 0c1.5) |
| `kanban-sprint-<id>.md` | Per-sprint work tracker; new file at sprint open with explicit open-items migration; frozen at sprint close as immutable record |

Sprint kanbans currently in-tree:

- `lift-track-kanban-sprint-0b2.md`, `lift-track-kanban-sprint-0c.md`, `lift-track-kanban-sprint-0c0.5.md`, `lift-track-kanban-sprint-0c1.md` (active), `lift-track-kanban-sprint-0c1.5.md`, `lift-track-kanban-sprint-0c2.md`, `lift-track-kanban-sprint-0d.md`, `lift-track-kanban-sprint-0e.md`

## Subdirectories

| Path | Purpose | README |
|---|---|---|
| `adrs/` | Architecture Decision Records — one file per decision | `adrs/README.md` |
| `dodaf/` | DoDAF view set produced for the portfolio | `dodaf/README.md` |
| `retrospectives/` | Sprint retrospectives (point-in-time, immutable) | `retrospectives/README.md` |
| `conversation-archive/` | Historical Cowork / Dispatch transcripts (date-prefixed) | `conversation-archive/README.md` |
| `reference/` | Project-scoped Reference docs and baselines (subset migrating to Reach4All — see CONVENTIONS §9) |  — |

## Baselines

Side-car snapshots taken before structural revisions. Per CONVENTIONS §10. Stored at the same directory level as the file they shadow. Not part of the active doc set; safe to ignore on day-to-day reads.

Currently in-tree at `docs/`: `.baseline-lift-track-architecture-pre-sprint-0b-20260424.md`, `.baseline-CONVENTIONS-v0.1.0-20260424.md`, `.baseline-CONVENTIONS-v0.2.1-20260427.md`, `.baseline-CONVENTIONS-v0.2.2-20260427.md`, `.baseline-CONVENTIONS-v0.2.3-20260428.md`, `.baseline-lift-track-roadmap-pre-timeline-20260424.md`.

## Navigating to portfolio-level concerns

Lifting Tracker is the first sub-system of XRSize4 ALL. Portfolio-level research, cross-program architecture, and CM design live in `~/reach4all/` per CONVENTIONS §3 repo taxonomy:

- Portfolio architecture and strategic-decisions log: `~/reach4all/docs/architecture/`
- Continuous-research stream landings: `~/reach4all/docs/research/`
- Concept Computing framework: `~/Concept/`

## How to use this index

A new session asks "where does this thing live?" — read this file first; if the artifact-class isn't covered here, fall back to `CONVENTIONS_v0.2.4.md` §4 (lifting-tracker docs structure) for the canonical placement rules. If a placement is genuinely ambiguous, that's a CONVENTIONS amendment candidate, not an improvisation cue.

---

© 2026 Eric Riutort. All rights reserved.
