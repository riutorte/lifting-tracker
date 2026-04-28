---
author: Eric Riutort
created: 2026-04-27
updated: 2026-04-27
tier: OPERATIONAL
content_class: operational
sprint: 0b1
sprint_name: Documentation Rule Codification
sprint_dates: 2026-04-27
duration_days: 1
---

# Sprint 0b1 Retrospective — Documentation Rule Codification

**Dates:** 2026-04-27 (single day, insert sprint between 0b and 0c)
**Goal:** Codify documentation hygiene rules in CONVENTIONS — filename descriptiveness, fixed-name exceptions, operational-ledger semver, SDLC methodology. Establish the rules before applying them, so the apply step has a definitional anchor.
**Close criteria:** CONVENTIONS v0.2.1 → v0.2.2 amendment landed with four substantive changes; cross-references swept across DoDAF views + ADR D28; baseline preserved; Sprint 0b2 scoped as the apply-the-rules follow-on.

## Outcome

All four close criteria met. CONVENTIONS v0.2.2 committed as `0d4335f` with §6.1 descriptiveness rule, §6.2 fixed-name exceptions, §8 operational-ledger semver, and new §14 SDLC methodology section (seven sub-sections covering cadence, structure, numbering, retros, work modes, and gating). Cross-refs in DoDAF AV-2 dictionary, OV-1 concept graphic, SV-6 data exchanges, StdV-1 standards, and ADR D28 updated to v0.2.2. Baseline at `docs/.baseline-CONVENTIONS-v0.2.1-20260427.md`. Closed 2026-04-27.

## Stats

- Duration: 1 day (single-day insert sprint)
- Commits on main: 1 substantive (`0d4335f`) plus a follow-up linter touch (`d0be55c`) that landed during 0b2 close-prep
- Lines changed in CONVENTIONS: ~120 net additions across §6, §8, §14
- New sections: §6.1, §6.2, §14.1–§14.7 (8 new sub-sections)
- Cross-references swept: 18 hits across 5 dependent files
- Memory files added during the sprint: 3 (`feedback_code_task_lock_cleanup`, `project_cowork_dispatch_sandbox_limits`, `feedback_stopping_code_tasks`)

## Artifacts delivered

- `docs/CONVENTIONS_v0.2.2.md` — amended rule of record
- `docs/.baseline-CONVENTIONS-v0.2.1-20260427.md` — pre-amendment baseline
- Cross-reference updates in `docs/dodaf/AV-2-dictionary_v0.1.0.md`, `docs/dodaf/OV-1-concept-graphic_v0.1.0.md`, `docs/dodaf/SV-6-data-exchanges_v0.1.0.md`, `docs/dodaf/StdV-1-standards_v0.1.0.md`, `docs/adrs/D28-architectural-discipline-profile_v0.1.0.md`

Memory files (in `~/Library/Application Support/Claude/.../agent/memory/`):

- `feedback_stopping_code_tasks.md` — TaskStop fails for Code session IDs; use `mcp__dispatch__send_message` ABORT instead
- `feedback_code_task_lock_cleanup.md` — every Code task spawn must include Step 0 stale-lock cleanup
- `project_cowork_dispatch_sandbox_limits.md` — Dispatch sandbox bindfs blocks `.git/` deletes and tracked-file unlinks during merges

## What worked

- **Self-applying the new rule.** The CONVENTIONS_v0.2.2.md filename satisfies its own §6.1 descriptiveness rule (the version suffix telegraphs the version; the file's content is implied by the §6.2 fixed-name exception list). The rule passed its own dogfood test.
- **Sprint thematic split (0b1 vs 0b2).** Eric's instinct to split "rules-establishment" from "rules-application" produced a cleaner sprint structure than a single 0b1 doing both. Each sprint had a single thematic deliverable.
- **§14 SDLC methodology surfaced 7 work modes.** Naming the work modes (sprint-bounded, operational continuous, continuous-research, sprint-boundary, cleanup queue, scheduled, memory updates) disciplined how between-sprint work gets accounted. Previously these were ad-hoc and invisible to the schedule.
- **Cross-reference sweep was mechanical and complete.** sed-based pass found and updated all 18 dependent-file references in one pass. No manual review required after the rule was decided.
- **Baseline discipline held.** Pre-amendment state preserved at the side-car file; future sessions can diff against it without git-archaeology.

## What didn't work

- **Cowork-spawned Code tasks default to plan mode.** Three consecutive Code task spawns hit ExitPlanMode hangs requiring user intervention. Auto mode toggle on Eric's interactive sessions did not propagate to Cowork-spawned children. Anthropic-side defect; filed via thumbs-down. Eric eventually toggled the global mode to break the cycle.
- **Bindfs in Dispatch sandbox blocks `.git/index.lock` removal.** Every git operation from Dispatch creates a lock and cannot clean it up; subsequent operations are blocked. Required Eric's terminal `rm` intervention multiple times during the sprint. Recorded in `project_cowork_dispatch_sandbox_limits.md`.
- **Initial commit broke git rename-detection lineage.** The 0d4335f commit had `R 100%` from CONVENTIONS_v0.2.1.md → baseline (byte-identical) and a fresh ADD for v0.2.2.md, breaking `git log --follow` from v0.2.2 to v0.2.1. The redundant Code task that ran in parallel (later aborted) had cleaner staging — split rename-edit from baseline-add into separate commits to preserve the lineage. Worth adopting as a future pattern.
- **Initial CONVENTIONS amendment had change-log paragraph order wrong.** Inserted v0.2.2 paragraph above v0.2.1, breaking the chronological-old-first pattern established at v0.1.0/v0.2.0. Linter pass corrected post-commit; landed as a separate small commit (`d0be55c`).
- **Spent significant cycles on lock-cycle troubleshooting and Code task plan-mode debugging.** ~40% of the sprint's session time was spent on bindfs and plan-mode side effects rather than the substantive amendment work. Most of that is Anthropic-product calibration, not Eric-side fixable.

## What to improve in Sprint 0b2 (and beyond)

1. **Pre-commit `rm .git/*.lock` as standard prelude for every Code task spawn.** Memorialized in `feedback_code_task_lock_cleanup.md`.
2. **Use `send_message` ABORT for redundant Code tasks rather than asking for tab-stop.** Memorialized in `feedback_stopping_code_tasks.md`.
3. **Split rename-and-edit commits from baseline-add commits.** Preserves rename detection in `git log --follow`. Apply to any future major doc bump where baseline and target are byte-similar.
4. **When inserting a new section in a numbered doc with a chronological ledger (change log), maintain the established order.** Don't invert it.
5. **For multi-file portfolio-wide rule changes, use the file Edit tool over sed where the change is per-section structural.** sed-with-replace is for filename-level rewrites; structural edits to specific sections benefit from precise targeting.

## Key takeaways

1. **Define rules before applying them.** Splitting "establish CONVENTIONS amendment" (0b1) from "apply CONVENTIONS amendment" (0b2) created two clean sprints with single themes. The temptation to bundle was strong; resisting paid off.
2. **The §6.1 descriptiveness rule is the most testable rule in CONVENTIONS.** Every filename can be checked against it mechanically. Worth automating into a pre-commit hook eventually (Sprint 0c+).
3. **§14 SDLC methodology was overdue.** The team's actual work pattern (insert sprints, parallel research streams, cleanup queues) was already in use; codifying it took 30 minutes and gave subsequent sprints a vocabulary.
4. **Anthropic-product friction (plan mode, bindfs) is now well-characterized.** Three new memory files capture the workarounds. Future sessions can avoid the same dance.
5. **One-day sprints are real.** Sprint 0b1 fit comfortably in a single day with substantive deliverables. The methodology section now codifies "days, not weeks" as the cadence.

## Memory updates from this sprint

- `feedback_stopping_code_tasks.md` — added; technique to abort running Code tasks via send_message
- `feedback_code_task_lock_cleanup.md` — added; mandatory lock-cleanup prelude for every Code task spawn
- `project_cowork_dispatch_sandbox_limits.md` — added; Dispatch sandbox bindfs limits and pivot rules
- `MEMORY.md` — three index entries appended

## Sprint 0b2 — scoped at 0b1 close

Goal: apply the CONVENTIONS v0.2.2 rules to the existing portfolio. Estimated 1-2 days.

Items in scope:

1. Filename rename pass (7 vague-named research docs in reach4all per §6.1)
2. Stream B follow-up — rewrite cross-refs in lifting-tracker as `reach4all://docs/research/<X>.md` (per §9 cross-repo pin convention)
3. Migration cleanup — remove the 34 staging copies in lifting-tracker/docs/reference/ that were never deleted post-Sprint-0b migration
4. Hardware research deliverable (Mac Mini cluster recommendation)
5. LLM build scoping research (frontier-adjacent decision support)
6. Sprint 0b1 retrospective (this file)
7. Sprint 0b2 retrospective at close
8. Kanban semver bump per the new §8 rule (pending naming-convention decision: kanban_v0.5.0.md vs kanban-sprint-0b2.md)

Items deferred to Sprint 0c:

- `source-doc-cm-design.md` rename to satisfy filename versioning convention + ~140 cross-reference updates
- `architecture-v0.3-to-v0.4-audit.md` misclassification fix (research-class file in operational location)
- Status-vocab consistency settle between CONVENTIONS and orchestration
- `document-cm` skill build (originally Sprint 0b Day 2+, now Sprint 0c primary deliverable)
- `.cm/manifest.yaml` for Lifting Tracker
- Trust-but-verify instrumentation framework
- MCP installs (filesystem + git + brave + Firecrawl)

---

© 2026 Eric Riutort. All rights reserved.
