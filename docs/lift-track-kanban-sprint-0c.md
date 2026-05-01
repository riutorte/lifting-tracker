---
author: Eric Riutort
created: 2026-04-27
updated: 2026-04-30
tier: OPERATIONAL
content_class: operational
sprint: 0c
sprint_name: document-cm Skill Build (UNMET — closed early, bandwidth displaced)
sprint_dates: 2026-04-27 → 2026-04-28
duration_days: 2
status: closed
close_reason: primary scope unmet; bandwidth consumed by architecture-review and research; closed early per Eric's call to avoid sprint run-on
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0c)

Per CONVENTIONS_v0.2.3.md §8 + §14.2, this is Sprint 0c's per-sprint kanban. Created at sprint open with explicit open-items migration from `lift-track-kanban-sprint-0b2.md`. Frozen at sprint close as the immutable record.

## Sprint 0c — `document-cm` Skill Build (CLOSED EARLY — primary scope unmet)

**Theme (planned):** Ship the `document-cm` skill and its first-consumer manifest for Lifting Tracker.

**Dates:** 2026-04-27 → 2026-04-28 (2 days)

**Goal (planned):** Operational `document-cm` skill installable via `/skills install`, with a working `.cm/manifest.yaml` for Lifting Tracker validating against it.

**Close criteria (planned, 3 items):**

1. ❌ NOT STARTED — `~/document-cm/` skill repo scaffolded. Moves to Sprint 0d.
2. ❌ NOT STARTED — `~/lifting-tracker/.cm/manifest.yaml`. Moves to Sprint 0d.
3. ✅ MET — Sprint 0c1 scoped at 0c close (full 10-criteria plan in this kanban + lift-track-sprint-retro-0c.md and lift-track-kanban-sprint-0c1.md).

**Outcome:** Closed early per Eric's decision (2026-04-28) rather than continue Sprint 0c run-on. Bandwidth consumed by architecture-review work (Eric's pass through DoDAF + architecture set) and research deliverables (6 landed in reach4all). Document-cm skill build deferred to Sprint 0d. See `docs/retrospectives/lift-track-sprint-retro-0c.md` for full retro.

**What landed during Sprint 0c (substantial side-work):**

- 6 research deliverables in reach4all/docs/research/: hardware-selection, frontier-adjacent-LLM-scoping, mac-markdown-mermaid-rendering-tools, doc-tooling-comparison, dodaf-dm2-and-av2-guidelines, dodaf-drive-folder-supplemental
- 1 research running at close: wide/deep failure-modes + rollback strategy (lands in Sprint 0c1)
- Architecture review unblocked via Obsidian install (Mac vault opened)
- 5 strategic decisions locked (hardware defer, LLM cloud-rental-first, doc tooling = Obsidian, Q1-Q4 naming convention, AV-2 enrichment scope)
- Sprint 0c1 / 0c2 / 0d / 0e all scoped forward with concrete close criteria

**Inline-staged for the Sprint 0c close commit:**

- `docs/CONVENTIONS_v0.2.3.md` — §14.4 amended with retros README discipline; `updated:` bumped to 2026-04-28 (technically a v0.2.4 amendment per §8 Reference-class clarification rules; renaming to v0.2.4 deferred since it's a clarification, not structural revision)
- `docs/retrospectives/README.md` — renamed from `README_v0.1.0.md` per §6.2 fixed-name rule, added "Index of retrospectives" section listing all four retros (0a, 0b, 0b1, 0b2 — 0c added at this commit)
- `docs/.gitignore` — added `.obsidian/` for Obsidian vault settings
- `docs/lift-track-kanban-sprint-0c.md` — this file (closed-state)
- `docs/lift-track-kanban-sprint-0c1.md` — Sprint 0c1 open-state with 10 close criteria
- `docs/retrospectives/lift-track-sprint-retro-0c.md` — this sprint's retro
- `~/reach4all/.gitignore` — added `.obsidian/`

**Stretch (only if 1-4 land cleanly with capacity remaining):**

- Begin drafting CONVENTIONS_v0.2.4 system-prefix amendment text (will formally land in 0c1).

---

## Open-items migration from Sprint 0b2

Per §14.2 inheritance rule. Each item from `lift-track-kanban-sprint-0b2.md` evaluated explicitly: bring-forward / defer / drop.

### Bring forward to Sprint 0c (2 items, in scope)

| Item | Source | Disposition |
|---|---|---|
| `document-cm` skill implementation | 0b2 Blocked | Bring forward as 0c CC1. CM brief v0.3.0 approved; ready to build. |
| `.cm/manifest.yaml` for Lifting Tracker | 0b2 Blocked | Bring forward as 0c CC2. Companion to document-cm skill. |

### Defer to Sprint 0c1 (8 items — naming convention work + STIG)

| Item | Source | Reason |
|---|---|---|
| CONVENTIONS_v0.2.4 amendment — system-prefix rule + README discipline | 0c1 primary | Codifies what the rename pass applies. |
| Directory READMEs added (dodaf, adrs, conversation-archive, top-level docs/) | New, surfaced by Eric's review | One README per directory, kept current. |
| Retros README rename + index | 0b2 close-prep inline-staged | `README_v0.1.0.md` → `README.md` per §6.2; add Index of retrospectives section. |
| System-prefix renames (12 lifting-tracker docs) | New, surfaced by Eric's review | Filename must self-describe out of context. |
| DoDAF system-prefix renames (10 view files) | New, surfaced by Eric's review | Same. |
| source-doc-cm-design rename + ~140 cross-refs | 0b2 carryover | Was 0c CC; moved to 0c1 since it's naming-convention work. |
| dispatch-handoff rename + semver bump | 0b2 carryover | Same. |
| STIG alignment doc | 0b backlog (G31 commitment) | Originally scoped to 0c CC3; moved to 0c1 per Eric's call. Lands in `~/reach4all/docs/architecture/stig-alignment_v0.1.0.md` (placement TBD pending Q4 answer). |

### Defer to Sprint 0d (6 items)

| Item | Source | Reason |
|---|---|---|
| lift-track-architecture-v0.3-to-v0.4-audit_v0.1.0.md misclassification fix | 0b2 → 0c carryover | Independent cleanup; not blocking 0c. |
| Status-vocab consistency settle (CONVENTIONS vs orchestration) | 0b2 → 0c carryover | Light cleanup; not blocking. |
| Trust-but-verify instrumentation framework (16 Concept agents) | 0b2 → 0c original | Concept-side work; depends on document-cm skill landing first. |
| MCP installs (filesystem + git + brave + Firecrawl) | 0b2 → 0c original | Eric's terminal action; can happen any time. |
| DoDAF cross-reference matrix (`docs/lift-track-dodaf-cross-reference.md`) | 0b2 stretch goal | Promised in CONVENTIONS §11.6. |
| Reach4All bindfs-residue cleanup | 0b2 → 0c original | Worktree branches, untracked `.claude/`. Housekeeping. |

### Defer / external (3 items, not in any sprint)

| Item | Owner | Status |
|---|---|---|
| Hardware purchase decision | Eric | Pending — 1× Mac mini M4 base 24/512 vs WWDC defer vs frontier-adjacent path. |
| LLM build go/no-go | Eric | Per `frontier-adjacent-local-llm-build-scoping-research.md` — defer until trigger fires (privacy-bound use case, API spend $300/mo sustained, or measurable accuracy/cost/latency win). |
| Re-share f0492d52 Claude.ai URL (April 10 session research gap) | Eric | Trivial; can happen anytime. |

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| (Empty at sprint open. Items added as work begins.) | — | — | — |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| Sprint 0c1 naming-convention questions | (this kanban + Eric review of architecture docs) | A) System-prefix pattern: `<system>-<existing>` at start? B) ADRs: keep `D##` only, or also add system prefix? C) CONVENTIONS itself: leave as-is portfolio-level? D) STIG placement confirmation (lean: reach4all/docs/architecture). |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Done — Sprint 0c

| Card | Closed | Artifact | Notes |
|---|---|---|---|
| (Empty at sprint open. Items move here as they close.) | — | — | — |

---

## Other Session Work

Eric-maintained — sessions Dispatch cannot see (Chrome, mobile, other CLI).

| Session | Started | Status | Notes |
|---|---|---|---|
| (Empty at sprint open.) | — | — | — |

---

## Cross-reference

- Prior sprint's kanban (frozen at 0b2 close): `docs/lift-track-kanban-sprint-0b2.md`
- Sprint 0b2 retrospective: `docs/retrospectives/lift-track-sprint-retro-0b2.md`
- Sprint 0c retrospective at close: `docs/retrospectives/lift-track-sprint-retro-0c.md`
- Next sprint's kanban (after 0c close): `docs/lift-track-kanban-sprint-0c0.5.md`
- Methodology: `docs/CONVENTIONS_v0.2.3.md` §14
- Roadmap context: `docs/lift-track-roadmap_v0.4.0.md`

---

© 2026 Eric Riutort. All rights reserved.
