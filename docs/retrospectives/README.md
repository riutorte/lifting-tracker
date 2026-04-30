---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-30
tier: OPERATIONAL
content_class: reference
---

# Sprint Retrospectives

Historical record of every sprint, kept for future-session context. Each retrospective is a one-file record of what was delivered, what worked, what didn't, what to improve, and what got saved to memory.

## Content class

Operational (per `docs/reference/lift-track-source-document-cm_v0.3.0.md` v0.3.0 §3.7 Content Classes). Date-versioned, no WF-003, no GATE, no staleness tag (retros are historical records — they don't go stale, they just get added to).

## Filename convention

Per CONVENTIONS_v0.2.4.md §6.1 (descriptiveness rule) and §6.2 (point-in-time docs):

`sprint-retro-<id>.md` where `<id>` is the sprint identifier. Type prefix `sprint-retro-` at the start; sprint ID at the end ("version at end" rule).

- `lift-track-sprint-retro-0a.md` — first foundation sprint (pre-programming)
- `lift-track-sprint-retro-0b.md` — second foundation sprint
- `lift-track-sprint-retro-0b1.md` — insert sprint between 0b and 0c (rules codification)
- `lift-track-sprint-retro-0b2.md` — insert sprint between 0b1 and 0c (rules application)
- `lift-track-sprint-retro-0c.md` — third
- `sprint-retro-1.md` — first programming sprint
- `sprint-retro-2.md` — etc.

Sprint 0x naming for pre-programming phases (research, design, infrastructure stand-up). Sprint 1+ for programming phases. Insert sprints (`0b1`, `0b2`, etc.) per §14.3 sprint-numbering rule. See `docs/kanban-sprint-<id>.md` for the per-sprint live tracker.

## Template structure

Every retro carries:

1. **Frontmatter** — author, created, updated, tier: OPERATIONAL, content_class: operational, sprint, sprint_name, sprint_dates, duration_days.
2. **Header** — sprint name, dates, duration, goal, close criteria.
3. **Outcome** — close criteria met / unmet, formal status.
4. **Stats** — tasks spawned, docs delivered, decisions resolved, memory updates, any meaningful counts.
5. **Artifacts delivered** — file list by category, linkable for future cross-reference.
6. **What worked** — concrete patterns worth continuing, with specific examples.
7. **What didn't work** — concrete failures, with specific examples and root cause where identifiable.
8. **What to improve in the next sprint** — numbered improvement list that the next sprint's kickoff can consult directly.
9. **Key takeaways** — the handful of insights worth carrying forward beyond the next sprint.
10. **Memory updates from this sprint** — list of `feedback_*.md` or `project_*.md` files added/updated, so the retro is self-referential against the memory system.
11. **Next sprint scoped** — a block from the just-closed sprint's planning for the next one.

## Why this exists

Retros without a persistent home evaporate into conversation history. Eric flagged on 2026-04-23 that future-session context requirements depend on having retros available. This directory is that record.

Retros are not polished prose. They are honest operational records. Specific examples over generalities. Named failure modes over abstract platitudes.

## Linking from kanban

Each closed sprint's `kanban-sprint-<id>.md` should reference its retrospective file by relative path. Makes cross-reference mechanical.

## Index of retrospectives

Living index. Updated atomically alongside each new retro at sprint close (per CONVENTIONS_v0.2.4.md §14.4). Most recent at the top.

| Sprint | Theme | Dates | Duration | Retro file |
|---|---|---|---|---|
| 0c2 | Sandboxing Discipline + Destructive-Op Policy (worktree-default + 5-tier governance framework) | 2026-04-30 → 2026-04-30 | 1 day | [lift-track-sprint-retro-0c2.md](lift-track-sprint-retro-0c2.md) |
| 0c1.5 | Naming-Convention Rename Pass (mass-rename branch + merge-before-close pattern validated) | 2026-04-29 → 2026-04-30 | 2 days | [lift-track-sprint-retro-0c1.5.md](lift-track-sprint-retro-0c1.5.md) |
| 0c1 | Documentation Hygiene + AV-2 Enrichment + First Prevention Action (parallel methodology validated) | 2026-04-28 → 2026-04-29 | 2 days | [lift-track-sprint-retro-0c1.md](lift-track-sprint-retro-0c1.md) |
| 0c0.5 | Decision Consolidation Sweep + Bindfs Lock-Reaper Install (CC8 MOVED) | 2026-04-28 | 1 day | [lift-track-sprint-retro-0c0.5.md](lift-track-sprint-retro-0c0.5.md) |
| 0c | document-cm Skill Build (UNMET — closed early) | 2026-04-27 → 2026-04-28 | 2 days | [lift-track-sprint-retro-0c.md](lift-track-sprint-retro-0c.md) |
| 0b2 | Documentation Rule Application | 2026-04-27 | 1 day | [lift-track-sprint-retro-0b2.md](lift-track-sprint-retro-0b2.md) |
| 0b1 | Documentation Rule Codification | 2026-04-27 | 1 day | [lift-track-sprint-retro-0b1.md](lift-track-sprint-retro-0b1.md) |
| 0b | Foundation Sprint Day 1 | 2026-04-24 | 1 day | [lift-track-sprint-retro-0b.md](lift-track-sprint-retro-0b.md) |
| 0a | Foundation Research & CM Design | 2026-04-21 → 2026-04-23 | 3 days | [lift-track-sprint-retro-0a.md](lift-track-sprint-retro-0a.md) |

---

© 2026 Eric Riutort. All rights reserved.
