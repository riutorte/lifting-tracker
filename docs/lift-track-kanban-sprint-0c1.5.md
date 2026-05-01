---
author: Eric Riutort
created: 2026-04-28
updated: 2026-04-30
tier: OPERATIONAL
content_class: operational
sprint: 0c1.5
sprint_name: Naming-Convention Rename Pass
sprint_dates: 2026-04-29 → 2026-04-30
sprint_open_date: 2026-04-29
sprint_close_date: 2026-04-30
duration_days: 2
status: closed
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0c1.5)

Per CONVENTIONS_v0.2.4 §8 + §14.2 + §14.3 (decimal/half-step inserts), this is Sprint 0c1.5's per-sprint kanban. Drafted at Sprint 0c1 mid-stream per Eric's call 2026-04-28: "push rename to its own sprint without anything else in the sprint." Inserts between Sprint 0c1 and Sprint 0c2 as a rename-only micro-sprint. Frozen at sprint close as the immutable record.

## Sprint 0c1.5 — Naming-Convention Rename Pass

**Theme:** Apply the `lift-track-` prefix system-wide to system-specific files; complete the source-doc-cm-design and dispatch-handoff renames; sweep cross-references portfolio-wide. Single-purpose sprint with no other in-scope work — per Eric's "rename to its own sprint" call (2026-04-28) preventing scope dilution.

**Dates:** TBD → TBD (estimated 1-2 days under solo+AI; mostly mechanical edits + cross-reference sweep)

**Goal:** Portfolio-wide naming convention applied. Every system-specific file carries the `lift-track-` prefix; every cross-reference resolves to the new name; CONVENTIONS §6.1 descriptiveness rule self-applied across the file tree.

**Close criteria (3 items):**

1. NEW — Naming-convention rename pass: apply `lift-track-` prefix to ~25 system-specific files. Includes:
   - `lift-track-architecture_v0.4.0.md` → `lift-track-architecture_v0.4.0.md`
   - `lift-track-roadmap_v0.4.0.md` → `lift-track-roadmap_v0.4.0.md`
   - `lift-track-risks_v0.1.0.md` → `lift-track-risks_v0.1.0.md`
   - `lift-track-metrics_v0.1.0.md` → `lift-track-metrics_v0.1.0.md`
   - `lift-track-effort-estimate_v0.1.0.md` → `lift-track-effort-estimate_v0.1.0.md`
   - `lift-track-ontology-plan_v0.1.0.md` → `lift-track-ontology-plan_v0.1.0.md`
   - `lift-track-themes-epics-features_v0.2.0.md` → `lift-track-themes-epics-features_v0.2.0.md`
   - `lift-track-user-stories_v0.2.0.md` → `lift-track-user-stories_v0.2.0.md`
   - `kanban-sprint-<id>.md` → `lift-track-kanban-sprint-<id>.md` (× all existing sprint kanbans)
   - `sprint-retro-<id>.md` → `lift-track-sprint-retro-<id>.md` (× all existing retros)
   - ADRs: `D##-<slug>_v<version>.md` → `lift-track-D##-<slug>_v<version>.md`
   - DoDAF views: `<view-code>-<slug>_v<version>.md` → `lift-track-dodaf-<view-code>-<slug>_v<version>.md`
   - Plus cross-reference sweep across all active docs

2. NEW — `lift-track-source-document-cm_v0.3.0.md` rename to `lift-track-source-document-cm_v0.3.0.md` + ~140 cross-reference updates portfolio-wide. Was 0c1 CC5; pulled into 0c1.5 with the broader rename pass.

3. NEW — `lift-track-dispatch-handoff_v0.1.0.md` rename to `lift-track-dispatch-handoff_v0.1.0.md` + semver bump per §6.2 v0.2.3 amendment. Was 0c1 CC6; pulled into 0c1.5.

**Plus retro at close** — `sprint-retro-0c1.5.md` per CONVENTIONS §14.4 retro convention.

**Stretch:** none. Per Eric's call, this sprint is RENAME-ONLY. Other work (DoDAF cross-reference matrix, AV-2 enrichment, deny list, etc.) stays in their assigned sprints.

---

## Open-items migration from Sprint 0c1

Per §14.2 inheritance rule. Sprint 0c1.5 inherits ONLY the three rename CCs from 0c1 (CC4, CC5, CC6 in original 0c1 numbering); all other 0c1 work stays in 0c1.

| Item | Source | Disposition |
|---|---|---|
| Naming-convention rename pass (was 0c1 CC4) | Sprint 0c1 | Bring forward as 0c1.5 CC1 |
| source-doc-cm-design rename (was 0c1 CC5) | Sprint 0c1 | Bring forward as 0c1.5 CC2 |
| dispatch-handoff rename (was 0c1 CC6) | Sprint 0c1 | Bring forward as 0c1.5 CC3 |

All other Sprint 0c1 close criteria stay in 0c1 and close there.

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| (Empty at sprint draft. Sprint opens after 0c1 closes.) | — | — | — |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| (Empty at sprint draft.) | — | — |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint draft.) | — | — |

## Done — Sprint 0c1.5

| Card | Closed | Artifact | Notes |
|---|---|---|---|
| (Empty at sprint draft. Items move here as they close.) | — | — | — |

---

## Other Session Work

Eric-maintained — sessions Dispatch cannot see (Chrome, mobile, other CLI).

| Session | Started | Status | Notes |
|---|---|---|---|
| (Empty at sprint draft.) | — | — | — |

---

## Cross-reference

- Prior sprint's kanban (frozen at 0c1 close): `docs/lift-track-kanban-sprint-0c1.md`
- Sprint 0c1 retrospective: `docs/retrospectives/lift-track-sprint-retro-0c1.md`
- Sprint 0c1.5 retrospective at close: `docs/retrospectives/lift-track-sprint-retro-0c1.5.md`
- Next sprint's kanban (after 0c1.5 close): `docs/lift-track-kanban-sprint-0c2.md`
- Methodology: `docs/CONVENTIONS_v0.2.4.md` §14
- Filename rule source: `docs/CONVENTIONS_v0.2.4.md` §6.1 descriptiveness rule + §6.2 fixed-name exceptions

---

© 2026 Eric Riutort. All rights reserved.
