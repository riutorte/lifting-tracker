---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
tier: OPERATIONAL
content_class: reference
version: 0.1.0
---

# Sprint Retrospectives

Historical record of every sprint, kept for future-session context. Each retrospective is a one-file record of what was delivered, what worked, what didn't, what to improve, and what got saved to memory.

## Content class

Operational (per `docs/reference/source-doc-cm-design.md` v0.3.0 §3.7 Content Classes). Date-versioned, no WF-003, no GATE, no staleness tag (retros are historical records — they don't go stale, they just get added to).

## Filename convention

`sprint-<id>.md` where `<id>` is the sprint identifier:

- `sprint-0a.md` — first foundation sprint (pre-programming)
- `sprint-0b.md` — second foundation sprint
- `sprint-0c.md` — third
- `sprint-1.md` — first programming sprint
- `sprint-1.5.md` — mid-sprint decision check-ins if warranted
- `sprint-2.md` — etc.

Sprint 0x naming for pre-programming phases (research, design, infrastructure stand-up). Sprint 1+ for programming phases. See `docs/kanban.md` for the live sprint tracker.

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

Each sprint entry in `docs/kanban.md`'s "Done" section should name its retro file by relative path. Makes cross-reference mechanical.

---

© 2026 Eric Riutort. All rights reserved.
