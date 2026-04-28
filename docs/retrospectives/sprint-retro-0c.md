---
author: Eric Riutort
created: 2026-04-28
updated: 2026-04-28
tier: OPERATIONAL
content_class: operational
sprint: 0c
sprint_name: document-cm Skill Build (UNMET — bandwidth displaced)
sprint_dates: 2026-04-27 → 2026-04-28
duration_days: 2
---

# Sprint 0c Retrospective — document-cm Skill Build (closed early)

**Dates:** 2026-04-27 → 2026-04-28 (2 days)
**Goal (planned):** Operational `document-cm` skill installable via `/skills install`, with a working `.cm/manifest.yaml` for Lifting Tracker validating against it.
**Close criteria (planned, 3 items):** document-cm skill repo scaffolded; `.cm/manifest.yaml` for Lifting Tracker; Sprint 0c1 scoped at 0c close.

## Outcome

**Closed early per Eric's decision (2026-04-28).** Primary close criteria UNMET. Document-cm skill scaffold and `.cm/manifest.yaml` were not started — bandwidth was consumed by architecture-review work, multiple research deliverables, and surfaced cleanup needs that grew Sprint 0c1 / 0c2 / 0d / 0e scopes substantially. The decision to close early rather than continue Sprint 0c reflects a methodology call: rather than let Sprint 0c run-on indefinitely until primary work landed, close it honestly, document the bandwidth displacement, and start Sprint 0c1 cleanly with the cleanup-and-conventions work that's now load-bearing for downstream sprints.

Sprint 0c1 was scoped at close with 10 close criteria. document-cm skill build moves to Sprint 0d.

## Stats

- Duration: 2 days
- Commits on main: 1 (the 0c close commit, pending approval at retro-write time)
- Research deliverables landed (in reach4all): 6
- Research deliverables running at close: 1 (wide/deep failure modes + rollback strategy)
- Sprint scope expansions: 4 follow-on sprints scoped (0c1, 0c2, 0d, 0e)
- Decisions locked: 5 strategic + Q1-Q4 naming convention
- Memory files added: 0 (existing memory base sufficient; new memory likely lands in 0c1 close)

## Artifacts delivered

Reach4All research docs (6 landed during Sprint 0c):

- `dedicated-claude-work-machine-hardware-selection.md` — 306 lines, hardware recommendation (originally 1× M4 Pro 32GB, refined to 2× M4 base 24GB with cloud-rental LLM validation phase)
- `frontier-adjacent-local-llm-build-scoping-research.md` — LLM build scoping; recommendation: defer hardware, validate via Lambda Labs cloud rental first
- `mac-markdown-mermaid-rendering-tools-research.md` — 285 lines, recommendation: QLMarkdown + Obsidian (free for commercial use as of Feb 2025)
- `markdown-vs-jupyter-vs-pandoc-doc-tooling-comparison-research.md` — recommendation: keep .md canonical, Obsidian primary viewer, reject .ipynb migration
- `dodaf-dm2-and-av2-guidelines-reference-research.md` — DoDAF 2.02 + DM2 + Vocabulary-Driven AV-2 Guidelines reference (supersedes prior `dodaf-dm2-reference-research.md`)
- `dodaf-drive-folder-supplemental-research.md` — supplement based on Eric's authored work in two Drive folders; CARP confirmed as official DoD-published, BTA Primitives Project lineage

Inline-staged in lifting-tracker (committed in Sprint 0c close commit):

- `docs/CONVENTIONS_v0.2.3.md` — §14.4 amended with retros README discipline (atomic commit of retro + README index update); `updated:` bumped to 2026-04-28
- `docs/retrospectives/README.md` — renamed from `README_v0.1.0.md` per §6.2 fixed-name rule, added "Index of retrospectives" section
- `docs/.gitignore` — added `.obsidian/` for Obsidian vault settings
- `docs/kanban-sprint-0c.md` — closed-state finalized
- `docs/retrospectives/sprint-retro-0c.md` — this file

Inline-staged in reach4all (committed in Sprint 0c close commit):

- `.gitignore` — added `.obsidian/` for Obsidian vault settings

External, non-repo:

- Obsidian installed on Eric's Mac (manual install from .dmg downloaded via Claude in Chrome)
- Obsidian vault opened on `~/lifting-tracker` — architecture review unblocked

## What worked

- **Architecture review surfaced real defects cleanly.** Eric's pass through the architecture set caught (a) mermaid not rendering in his viewer, (b) GFM tables not rendering, (c) AV-2 lacking DoDAF DM2 type assignment + missing domain concepts, (d) retros README missing index, (e) filename naming not fully self-describing out of repo context. Each defect was substantive, not cosmetic. The review process was high-value even though it consumed sprint bandwidth.
- **Research-task spawning at the right depth.** The six research deliverables each surfaced findings that materially shifted decisions: the DoDAF research de-scoped AV-2 enrichment (DM2 typing optional, not mandatory); the doc-tooling research surfaced Obsidian's Feb-2025 free-for-work change which moved it from "deprioritized" to "primary recommendation"; the LLM scoping research recommended cloud-rental-first instead of hardware-first; the failure-modes research identified concrete prevention actions for Sprint 0c1.
- **Decision velocity, with fit-for-purpose calibration.** All five Sprint 0c decisions were answered (4 with locked answers, 1 = AV-2 scope deferred to research land which then arrived). Eric's "I just want to understand what we're building, not full enterprise compliance" calibration kept scope from growing into multi-week reorganizations.
- **Obsidian unblocked architecture review in <60 seconds of install.** The Chrome-spawned download → manual install → vault open path worked cleanly. Mermaid rendering + GFM tables + the architecture set became reviewable in their authored form. Critique #1-5 (rendering issues) all resolved by the tooling change, no file rewrites needed.
- **Sprint thematic discipline held under temptation to bundle.** When the architecture-review work began, the urge was to fold "fix the rendering" into Sprint 0c primary scope. Resisting and naming the rendering issue as a doc-tooling decision (separate research) kept Sprint 0c primary scope (skill build) cleanly separable from the side work — even though the side work eventually displaced primary work entirely.
- **Eric-authored DoDAF lineage acknowledged in research.** The Drive folder review surfaced that Eric was a co-author of seven Vol 1 draft sections from the BTA Primitives Project. The "fit-for-purpose views" framing in his current CONVENTIONS §11 traces directly to BTA-authored work he was involved in. Research now properly cites this lineage.

## What didn't work

- **Sprint 0c primary scope was unrealistic given the architecture-review trigger.** Going into Sprint 0c, primary scope was document-cm skill build. The architecture-review request — which was itself reasonable and high-value — wasn't anticipated at sprint open. Result: 100% of the primary scope unmet despite 2 days of focused work. Lesson: sprints opened immediately after major-doc-version events (CONVENTIONS v0.2.3 here) should expect review-cycle bandwidth and either scope smaller, or formally include "review and amend" as a close criterion.
- **Sprint 0c1 scope grew faster than 0c could absorb.** What started as a 5-item naming-convention sprint grew to 10 items as architecture review surfaced more cleanup needs (directory READMEs, .gitignore Obsidian, DoDAF compliance pass, failure-modes prevention deny list, wide/deep research). 0c1 is now at the upper edge of §14.2's recommended range; 0c2 and 0d are also growing.
- **Bandwidth-consumed-by-research pattern continues.** Sprint 0a was research-heavy (validated stack, designed CM). Sprint 0b shipped DoDAF + ADRs. Sprint 0b1 shipped CONVENTIONS rules. Sprint 0b2 shipped naming application + cleanup. Sprint 0c was supposed to be the BUILD sprint but instead was research+review+rescope. Implementation work has been consistently displaced by upstream cleanup. Either the cleanup approach is too ambitious, or the build approach needs to start without waiting for "everything tidy first."
- **Bindfs lock-cycle issue still recurring.** Multiple times during 0c, Eric had to rm `.git/*.lock` from his terminal to unblock Dispatch git operations. The pattern is now well-characterized in `feedback_code_task_lock_cleanup.md` and `project_cowork_dispatch_sandbox_limits.md` memory files but the underlying Cowork-product issue is unresolved. Filed via thumbs-down on Anthropic; no fix landed in 0c.
- **Two redundant Code tasks were spawned for the same CONVENTIONS work earlier in the conversation arc**, requiring abort-via-send_message. Pattern recorded in `feedback_stopping_code_tasks.md` memory file. Did not cost main-branch state but burned cycles.
- **Initial failure-modes research was too thin.** The first version (561 lines, 5 incidents) gave a defensible starting picture but wasn't deep enough for portfolio-readiness. Eric flagged at end of 0c, triggering a wider/deeper respawn (currently running). Lesson: when commissioning research on safety-critical topics, err toward the heavier scope on first run.

## What to improve in Sprint 0c1

1. **Open Sprint 0c1 with a SCOPE CAP.** 10 close criteria is over §14.2's "3-7 items" recommendation. Resist adding more mid-sprint; if new work surfaces, name it as a 0c2 or backlog item rather than absorbing.
2. **Start the rename pass FIRST.** Naming-convention rename is the most mechanical and most impactful close-criterion. Doing it first means subsequent items (READMEs, AV-2 enrichment, deny list) all land under the new naming and don't need re-renaming.
3. **Run AV-2 enrichment in parallel with the rename pass.** They touch different files; safe to overlap. Cuts elapsed sprint time.
4. **Keep the .claude/settings.json deny list as the FIRST shippable item.** Highest yield-to-cost (~1 hour for portfolio-wide protection against documented destructive-command incidents). Don't let it slip behind larger items.
5. **Wide/deep failure-modes research is sized to land within 0c1.** It's running now; will inform the deny list specifics. If it doesn't land within 0c1's 2-3 day target, decouple it as a 0c1.5 / standalone deliverable rather than block sprint close.
6. **Do NOT spawn redundant Code tasks.** Use send_message ABORT pattern from `feedback_stopping_code_tasks.md` memory if a task is in flight; don't spawn a parallel one.
7. **Pre-clean stale .git/*.lock files in every Code-task spawn prompt.** Memory file `feedback_code_task_lock_cleanup.md` already specifies this; honor it consistently.

## Key takeaways

1. **The "build sprint" hasn't happened yet.** Five sprints in (0a, 0b, 0b1, 0b2, 0c) and document-cm skill — the planned implementation deliverable since Sprint 0a — has been deferred at every close. The cleanup approach is winning over the build approach. This is either: (a) the cleanup is genuinely load-bearing and worth the elapsed time, or (b) we're hiding from the build difficulty in cleanup work. Worth Eric's reflection going into 0c1: is the document-cm skill build actually ready to start, or are there real prerequisites still missing?
2. **The §6.1 descriptiveness rule has self-applied successfully four times now.** First catch (Sprint 0b2): vague research-doc names. Second (Sprint 0b2): missing type indicator on retros. Third (this sprint): system context missing from filenames. Fourth (this sprint): retros README itself is a §6.2 violation. The rule generates work as it surfaces violations — but every violation it catches is genuinely worth fixing.
3. **Architecture review without rendered diagrams is review of blank screens.** The Obsidian fix is small-cost-high-value tooling change that should have been recommended at Sprint 0b when DoDAF views were first produced. Lesson: when authoring docs intended for human review, verify the reviewer's tooling renders them BEFORE delivering.
4. **CARP/CARPO is officially DoD-published**, contradicting the prior research's "practitioner mnemonic" framing. Eric's firsthand involvement in the BTA Primitives Project surfaced this. Lesson: when the user has domain expertise on a research topic, defer to their judgment rather than over-relying on external sources.
5. **Scheduled and event-driven sensing are both real architectural needs.** Sprint 0e captures both in scope (scheduler + listener). The DeepSeek V4 article that triggered the conversation was a missed catch the scheduler would have prevented; the Apple iOS guideline-change concern is a missed catch only a listener can prevent.
6. **Cloud-rental validation before LLM hardware purchase is the right path.** Eric's initial instinct (HW first, then LLM) reversed to (cloud-rental, then HW, then local) after reflection. Cap-protected discovery before capex.

## Memory updates from this sprint

No new memory files added during Sprint 0c. The architecture-review patterns and decision sequencing here are sprint-specific and don't yet warrant a feedback or project memory file. Likely candidates for memory writes during Sprint 0c1 close:

- A `feedback_doc_review_tooling.md` capturing the lesson that doc review needs viewer verification before delivery
- A `feedback_research_depth_calibration.md` if the wide/deep failure-modes research surfaces patterns that should bias future research-task scoping toward heavier first runs

## Sprint 0c1 — scoped at 0c close

**Theme:** Documentation hygiene + AV-2 enrichment + first prevention action

**Dates:** 2026-04-28 → TBD (estimated 2-4 days under solo+AI)

**Goal:** Apply the v0.2.3 + v0.2.4 naming and convention rules portfolio-wide; land directory READMEs; close the AV-2 enrichment to inclusion-completeness; ship the highest-yield failure-modes prevention action; deliver wide/deep failure-modes + rollback strategy research.

**Close criteria (10 items):**

1. CONVENTIONS_v0.2.4 amendment landed (already inline-staged in 0c close commit; 0c1 inherits)
2. Directory READMEs added — `docs/dodaf/README.md`, `docs/adrs/README.md`, `docs/conversation-archive/README.md`, `docs/README.md` (top-level)
3. Retros README rename + index landed (already inline-staged in 0c close commit; 0c1 inherits)
4. Naming-convention rename pass — apply `lift-track-` prefix to ~25 system-specific files; rename DoDAF views, ADRs, retros (`sprint-retro-0a` etc.), kanbans
5. `source-doc-cm-design.md` rename to `lift-track-source-document-cm_v0.3.0.md` + ~140 cross-reference updates portfolio-wide
6. `dispatch-handoff.md` rename to `lift-track-dispatch-handoff_v0.1.0.md` + semver bump per §6.2
7. `.gitignore` Obsidian additions (already inline-staged in 0c close commit; 0c1 inherits)
8. AV-2 enrichment fit-for-purpose pass — inclusion-completeness across all 10 views, CARP/CARPO subset typing, four authoring rules applied (verb-object activities, no-and, synonym-collapse, bracketed-context-tag), domain concepts (Session, Exercise, Set, etc.) added as standalone rows
9. Project-level `.claude/settings.json` deny list across 3 repos — minimum set per failure-modes research §7-B (rm-rf variants, force push, terraform destroy, supabase db reset, cat .env, etc.)
10. Wide/deep failure-modes + rollback strategy research delivered — `claude-code-failure-modes-and-rollback-strategy-research.md` lands in reach4all (currently running)

**Sprint 0c2 — already scoped:**

- Default `--worktree` for Cowork/Dispatch Code-task spawns + shell alias for interactive Mac sessions
- `destructive-operation-policy.md` per failure-modes research §7-G

**Sprint 0d — already scoped:**

- `~/document-cm/` skill scaffold (the originally Sprint 0c primary scope, deferred again)
- `.cm/manifest.yaml` for Lifting Tracker
- STIG alignment doc (in `~/document-cm/` per Q4 = C, lands once skill repo exists)

**Sprint 0e — already scoped:**

- Scheduler implementation + 17 cron-driven research tasks
- Listener / sniffer architecture + first 3-5 high-priority listeners (Apple, Anthropic, vendor license watch)

**Open externally (Eric's actions, not sprint-bound):**

- Hardware purchase decision (deferred per Eric)
- LLM cloud-rental validation phase setup (Lambda Labs ~$200, 60 days) — pre-HW
- Re-share f0492d52 Claude.ai URL (failed fetch from earlier research)

---

© 2026 Eric Riutort. All rights reserved.
