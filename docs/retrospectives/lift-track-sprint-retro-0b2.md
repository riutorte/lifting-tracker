---
author: Eric Riutort
created: 2026-04-27
updated: 2026-04-27
tier: OPERATIONAL
content_class: operational
sprint: 0b2
sprint_name: Documentation Rule Application
sprint_dates: 2026-04-27
duration_days: 1
---

# Sprint 0b2 Retrospective — Documentation Rule Application

**Dates:** 2026-04-27 (single day, second insert sprint between 0b and 0c)
**Goal:** Apply the CONVENTIONS v0.2.2 rules to the existing portfolio. Rename vague-named research docs per §6.1 descriptiveness rule. Drain Sprint 0b migration cleanup queue. Land hardware research and LLM-build scoping research. Self-discover §6.1 violations and fix them.
**Close criteria:** Stream B rename + cross-ref sweep landed; lifting-tracker docs/reference/ trimmed to kept files; reach4all renames merged to main; hardware + LLM scoping research committed; CONVENTIONS v0.2.3 amendment for retro-naming + kanban Path B; Sprint 0b1 retro authored; Sprint 0b2 retro authored (this file); kanban renamed to per-sprint convention.

## Outcome

Close criteria met (with one item rolled to Sprint 0c). Stream B reach4all renames landed (`901c35e`, ff-merged to main as part of close). Lifting-tracker migration cleanup landed (`be4aaef` — 34 files removed). Cross-ref second pass landed (`bc21019` — 80 references rewritten as `reach4all://...`). CONVENTIONS v0.2.2 paragraph reorder landed (`d0be55c`). Hardware research + LLM scoping research committed in reach4all (`e42e718`). CONVENTIONS v0.2.3 amendment authored (covers retro-naming and kanban Path B). Sprint 0b1 retro authored (will rename to `lift-track-sprint-retro-0b1.md` per the new rule). Sprint 0b2 retro authored (this file, written under the new naming). Kanban rename to `lift-track-kanban-sprint-0b2.md` queued for the close batch.

Rolled to Sprint 0c: `lift-track-source-document-cm_v0.3.0.md` rename + ~140 cross-reference updates; `lift-track-architecture-v0.3-to-v0.4-audit_v0.1.0.md` misclassification fix (currently in lifting-tracker/docs/reference/, should be operational); status-vocab consistency settle.

## Stats

- Duration: 1 day (single-day insert sprint)
- Commits on main (lifting-tracker): 4 in this sprint (`be4aaef`, `bc21019`, `d0be55c`, plus the v0.2.3 amendment commit landing at close)
- Commits on main (reach4all): 2 in this sprint (`901c35e` ff-merged, `e42e718`)
- Files renamed: 7 in reach4all (per §6.1) + the close-batch retro renames + kanban rename
- Files deleted: 34 in lifting-tracker (deferred §9 migration cleanup)
- Cross-references rewritten: ~80 across 9 lifting-tracker active docs
- Research docs delivered: 2 (hardware-selection, frontier-adjacent LLM scoping)
- Memory files added during the sprint: 1 (`feedback_stopping_code_tasks.md` — TaskStop-vs-send_message-ABORT technique)
- Self-discovered §6.1 violations and fixed: 2 categories (research-doc names, retro filenames missing type indicator)

## Artifacts delivered

Lifting-tracker:

- `docs/CONVENTIONS_v0.2.3.md` (rename of v0.2.2 with this sprint's amendments)
- `docs/.baseline-CONVENTIONS-v0.2.2-20260427.md` — v0.2.2 baseline
- `docs/retrospectives/lift-track-sprint-retro-0b1.md` (rename of sprint-0b1.md)
- `docs/retrospectives/lift-track-sprint-retro-0b.md` (rename of sprint-0b.md)
- `docs/retrospectives/lift-track-sprint-retro-0a.md` (rename of sprint-0a.md)
- `docs/retrospectives/lift-track-sprint-retro-0b2.md` (this file)
- `docs/retrospectives/README_v0.1.0.md` (updated for new naming convention)
- `docs/lift-track-kanban-sprint-0b2.md` (rename of kanban.md, frozen as 0b2 close state)
- ~80 cross-reference rewrites across `docs/kanban`, `docs/lift-track-risks_v0.1.0.md`, `docs/reference/lift-track-source-document-cm_v0.3.0.md`, `docs/lift-track-architecture_v0.4.0.md`, `docs/adrs/lift-track-D25-source-document-cm_v0.1.0.md`, `docs/orchestration_v0.1.0.md`, `docs/lift-track-roadmap_v0.4.0.md`, `docs/lift-track-metrics_v0.1.0.md`
- 34 files removed from `docs/reference/` (deferred Sprint 0b §9 migration-remove)

Reach4all:

- `docs/research/agentic-ai-developer-community-research.md` (renamed from community-research.md)
- `docs/research/agentic-coding-best-practices-review.md` (renamed from best-practices-review.md)
- `docs/research/lifting-tracker-stack-validation.md` (renamed from stack-validation.md)
- `docs/research/managed-ai-policy-platforms-research.md` (renamed from managed-policy-research.md)
- `docs/research/context-hub-platform-findings.md` (renamed from context-hub-findings.md)
- `docs/research/cowork-vs-dispatch-taxonomy-findings.md` (renamed from claude-share-c6324783-findings.md)
- `docs/research/concept-computing-april-10-failure-analysis.md` (renamed from april-10-session-analysis.md)
- `docs/research/dedicated-claude-work-machine-hardware-selection.md` (new — hardware research)
- `docs/research/frontier-adjacent-local-llm-build-scoping-research.md` (new — LLM scoping research)

## What worked

- **Self-applying §6.1 produced two consecutive catches.** First pass caught vague research-doc names (community-research.md, etc.). Second pass — Eric's "how do I know it's a retrospective" — caught missing type indicators on retros. Both got fixed in the same sprint. The rule is doing its job, and the dogfood test surfaces gaps the rule's authors missed.
- **Path B kanban naming aligns with retros.** Both follow `<type>-sprint-<id>.md` template. Once you see the pattern, every other point-in-time doc snaps to it. Worth checking other doc classes for similar alignment opportunities (e.g., baselines could be `baseline-<state>-<date>.md` instead of `.baseline-<state>-<date>.md`).
- **"Version at end of everything" is a clean structural rule.** Eric's articulation of it tightened §6.1 from "filename should be descriptive" to "filename has TWO mandatory pieces: type indicator + version/scope, in this order." Easy to teach, easy to check.
- **Stream B rename pass + migration cleanup combined cleanly.** The "apply the descriptiveness rule" work and the "drain the migrate-without-remove queue" work overlapped enough that one Code task batched both. 41 files affected in lifting-tracker, 14 file ops in reach4all — single review pass.
- **LLM scoping research recommendation was sharper than expected.** The task explicitly pushed back on Eric's "frontier-adjacent" framing — pointed out that true frontier weights don't fit in workstation budgets, recommended cloud-rental validation before committing capex, and surfaced the Apple-vs-CUDA gap for fine-tuning specifically. Better than a research task that just answers the question as posed.

## What didn't work

- **Bindfs lock cycle persisted across the entire sprint.** Every git operation from Dispatch created a stale lock that bindfs prevented from being unlinked. Eric had to `rm .git/*.lock` from his terminal at least 4 times during the sprint, and the merge of the reach4all worktree branch had to happen from his terminal because the bindfs blocked tracked-file unlinks during merge. This is the dominant friction of the day.
- **Code task plan-mode default re-occurred even after explicit auto-mode toggle.** Spawned Code tasks defaulted to plan mode, hung at ExitPlanMode, required user approval. Eric's "auto mode" toggle on his interactive Code session did not propagate to Cowork-spawned children. Eventually Eric toggled the global mode to fix it, but the cycle consumed multiple troubleshooting rounds.
- **Forgot the type-indicator part of §6.1.** When I codified §6.1 in v0.2.2, I focused on "must telegraph content" and gave examples of vague names. I did NOT make explicit that "type indicator" is one of the two mandatory components. Eric's pushback in 0b2 close-prep added it explicitly. The omission cost a partial v0.2.2 retroactive correction.
- **Two redundant Code tasks were spawned for CONVENTIONS v0.2.2 work.** First spawn hit ExitPlanMode hang; I respawned a second; meanwhile Eric cleared the lock and I started doing the work inline. Three actors targeting the same file produced a near-race condition. Aborted both Code tasks via send_message ABORT (memory file `feedback_stopping_code_tasks.md` captures the technique).
- **Initial reach4all merge attempt left the working tree in a partial state.** My ff-merge from Dispatch sandbox failed on tracked-file unlinks. The new files were created but old files weren't deleted; main pointer didn't advance. Required Eric to manually `rm` the leftover untracked files before retrying the merge from his terminal.
- **Sprint 0b1 retro filename was wrong on first authoring.** Wrote `sprint-0b1.md` per the §6.2 convention as it stood at v0.2.2. Eric's pushback on type-indicator made it `lift-track-sprint-retro-0b1.md`. Both the file rename AND the §6.2 amendment landed in 0b2 close.

## What to improve in Sprint 0c

1. **Audit ALL filenames against the v0.2.3 §6.1 type-indicator rule.** Sprint 0b2 caught retros and research; there may be others. Candidates to check: dispatch-handoff (now `dispatch-handoff_v<version>.md`?), any docs with bare names, any conversation archives.
2. **Cross-ref sweep for `kanban.md` → `kanban-sprint-<id>.md`.** Active docs (CONVENTIONS, orchestration, retros README, metrics, roadmap) reference `kanban.md`. Need a sed pass to rewrite to the per-sprint convention or to a generic "active kanban" reference.
3. **Address bindfs lock cycle at the protocol level.** Every Code task spawn now includes Step 0 lock cleanup per `feedback_code_task_lock_cleanup.md`. Each Dispatch git operation should likewise pre-clean if recovery from prior failed runs is plausible. Consider a wrapper alias `git-safe = rm -f .git/*.lock && git`.
4. **Promote lift-track-source-document-cm_v0.3.0.md to versioned filename.** Currently `docs/reference/lift-track-source-document-cm_v0.3.0.md` (no version) — should be `source-document-cm-design_v0.3.0.md` per §6.1+§8. Triggers ~140 cross-reference updates portfolio-wide. Originally Sprint 0c cleanup-queue item 2; rolled forward.
5. **Move `lift-track-architecture-v0.3-to-v0.4-audit_v0.1.0.md` to operational location.** Currently in `docs/reference/` (research-classified path) but content is operational (audit of architecture migration). Reclassify per §3.7 invariant 3 (cross-class migration is an ADR — short ADR or just a move with rationale in commit message).
6. **Retire lift-track-dispatch-handoff_v0.1.0.md → dispatch-handoff_v0.1.0.md.** Per §6.2 amendment, semver applies. Trivial rename.

## Key takeaways

1. **§6.1 is a generative rule, not a declarative one.** Each application surfaces new edge cases (vague names, missing type indicators, ordering preferences). The rule will keep tightening as more docs are checked against it. Plan an audit pass into Sprint 0c.
2. **Path B (per-sprint files) extends to all point-in-time docs naturally.** Retros, kanbans, possibly audits and post-mortems too. The sprint ID at the end of the filename is the structural sortable key.
3. **"Version at end of everything" is a worthwhile global filename rule.** Sorted listings group by type; chronological sort is preserved within type. Industry-standard for docs/code: this is the right call.
4. **Self-application of doc rules is the cheapest test.** Two §6.1 violations were found by checking whether the rule held against the rule's authors' own outputs. Build the habit: every new rule, immediately ask "does the rule apply to its own author's other recent outputs?"
5. **Anthropic-side product friction (bindfs, plan mode) is now a recurring tax.** Three memory files capture workarounds. The product fixes are out of our control, but documenting the workarounds keeps future sprints from re-discovering them.

## Memory updates from this sprint

- `feedback_stopping_code_tasks.md` — added; abort running Code tasks via `mcp__dispatch__send_message` ABORT (TaskStop fails for Code session IDs).
- `MEMORY.md` index — entries appended.

(Note: 0b1's memory updates `feedback_code_task_lock_cleanup.md` and `project_cowork_dispatch_sandbox_limits.md` predated this sprint slightly but both bear directly on 0b2 execution.)

## Sprint 0c — scoped at 0b2 close

Goal: stand up document-cm skill foundations + Lifting Tracker scaffold + remaining cleanup carryovers from 0b/0b2. Estimated 3-5 days.

Items in scope:

1. `lift-track-source-document-cm_v0.3.0.md` rename to `source-document-cm-design_v0.3.0.md` + ~140 cross-reference updates (carryover from 0b cleanup queue)
2. `lift-track-architecture-v0.3-to-v0.4-audit_v0.1.0.md` misclassification fix — move to operational location
3. Status-vocab consistency settle between CONVENTIONS and orchestration
4. `lift-track-dispatch-handoff_v0.1.0.md` → `dispatch-handoff_v0.1.0.md` rename per §6.2 v0.2.3 amendment
5. CONVENTIONS_v0.2.3 type-indicator audit pass — every active filename checked against §6.1
6. `document-cm` skill implementation (the original Sprint 0c primary scope)
7. `.cm/manifest.yaml` for Lifting Tracker
8. Trust-but-verify instrumentation framework for 16 Concept agents
9. MCP installs (filesystem + git + brave + Firecrawl) — Eric's action
10. DoDAF cross-reference matrix
11. Reach4All bindfs-residue cleanup (worktree branches, .claude/ untracked)
12. New kanban file `lift-track-kanban-sprint-0c.md` created at sprint open with explicit open-items migration

Items deferred or external:

- Hardware purchase decision (pending Eric's call on M4 vs M5/WWDC timing)
- LLM build go/no-go (pending cloud-rental validation, per LLM scoping doc recommendation)
- Multi-machine setup (after hardware lands)

---

© 2026 Eric Riutort. All rights reserved.
