---
author: Eric Riutort
created: 2026-04-29
updated: 2026-04-29
tier: OPERATIONAL
content_class: operational
sprint: 0c1
sprint_name: Documentation Hygiene + AV-2 Enrichment + First Prevention Action
sprint_dates: 2026-04-28 → 2026-04-29
duration_days: 2
---

# Sprint 0c1 Retrospective — Documentation Hygiene + AV-2 Enrichment + First Prevention Action

**Dates:** 2026-04-28 → 2026-04-29 (2 days)
**Goal:** Apply the v0.2.3 + v0.2.4 naming and convention rules portfolio-wide; land directory READMEs; close the AV-2 enrichment to inclusion-completeness; ship the highest-yield failure-modes prevention action; deliver wide/deep failure-modes + rollback strategy research.
**Close criteria (planned, 10 items):** CONVENTIONS v0.2.4 amendment (inherited); directory READMEs; retros README rename + index (inherited); naming-convention rename pass; source-doc-cm-design rename + cross-refs; dispatch-handoff rename + semver bump; .gitignore Obsidian additions (inherited); AV-2 enrichment fit-for-purpose pass; .claude/settings.json deny list across 3 repos; wide/deep failure-modes + rollback strategy research delivered.

## Outcome

**Closed clean. 7 of 10 CCs DONE; 3 CCs MOVED to dedicated Sprint 0c1.5 mid-sprint per Eric's "rename to its own sprint" call.** Plus 2 stretch items landed (DoDAF cross-reference matrix + Reach4All bindfs-residue cleanup). Plus 5 parallel-research-stream deliverables landed in flight (0d / 0d1 / 0d2 / 0e prep).

This sprint validated **parallel-sprint methodology** (CONVENTIONS §14.3 deferred-methodology) for the first time. Five concurrent Cowork research streams ran alongside the active CC work — every stream landed cleanly, no working-tree conflicts, traceability preserved per Eric's reproducibility discipline.

## Stats

- Duration: 2 days (2026-04-28 → 2026-04-29)
- Close criteria: 10 planned, 7 DONE, 3 MOVED to Sprint 0c1.5
- Stretch items: 2 DONE (DoDAF cross-reference matrix, Reach4All bindfs-residue cleanup)
- Parallel-research deliverables landed during 0c1: 5 (document-cm spec, security controls baseline, reference architecture starter, LLM strategy, plus AV-2 enrichment as in-sprint deliverable)
- Commits on main during sprint: 9 (lifting-tracker), 5 (reach4all)
- Total lines committed: ~14,500+ across both repos
- Memory files added: 2 (`feedback_attachment_disambiguation`, `feedback_compensating_control_framing`)
- Architectural corrections surfaced: 3 (compensating-control framing for env var, 3-layer DoDAF view layering, China dropped from production scope replaced by Brazil)
- Defects surfaced: 12 (DoDAF cross-reference matrix §6) for cleanup in Sprint 0c2/0d

## Artifacts delivered

Sprint 0c1 fresh CCs landed:

- **CC2** — 4 directory READMEs (top-level docs, dodaf, adrs, conversation-archive). Commit `d141b1c`.
- **CC8** — AV-2 dictionary v0.1.0 → v0.2.0 enrichment: 215 net rows added, CARP/CARPO type column populated, 4 authoring rules applied (verb-object, no-and, synonym-collapse, bracketed-context-tag), 12 domain concepts as standalone rows, ~38 renames triggered, ~12 synonyms collapsed, bracketed-context tags on 23 ambiguous terms. Tier corrected from OPERATIONAL to ARCHITECTURE. Commit `f959479`.
- **CC9** — `.claude/settings.json` deny list deployed across 3 repos (lifting-tracker, reach4all, Concept). 60 deny entries across 8 categories (rm -rf variants, git destructive ops, cloud infra destruction, database wipe, secret exposure, permission cascade, project-specific repo paths, bulk operation safety). Schema verified against current Anthropic Claude Code docs. Commits `5e8646c` (lifting-tracker), `67ab44b` (reach4all), `a37ccd6` (Concept).

Sprint 0c1 stretch items landed:

- **DoDAF cross-reference matrix v0.1.0** — `docs/dodaf-cross-reference.md` 611 lines, 8 sections, mermaid dependency graph, 12 defects surfaced honestly. Closes CONVENTIONS §11.6 commitment. Commit `d387f3d`.
- **Reach4All bindfs-residue cleanup** — 5 stale worktrees removed (`adoring-goodall`, `focused-yonath`, `funny-yonath`, `jolly-gauss`, `sweet-nightingale`) + 5 matching merged branches deleted. Working tree clean. No commit needed (git ops only).

Sprint 0c1 inherited-DONE (closed in earlier sprints, recorded here for traceability):

- **CC1** — CONVENTIONS_v0.2.4 §14.4 retros README discipline amendment (Sprint 0c close commit, `3691516`)
- **CC3** — Retros README rename + index landed (Sprint 0c close commit)
- **CC7** — `.gitignore` Obsidian additions across both repos (Sprint 0c close commit)
- **CC10** — Wide/deep failure-modes + rollback strategy research (`claude-code-failure-modes-and-rollback-strategy-research.md`, 2574 lines, Sprint 0c close commit `3691516`)

Sprint 0c1 MOVED to Sprint 0c1.5:

- **CC4** — Naming-convention rename pass (~25 system-specific files + cross-reference sweep)
- **CC5** — `source-doc-cm-design.md` rename + ~140 cross-reference updates
- **CC6** — `dispatch-handoff.md` rename + semver bump

Parallel-research deliverables landed during 0c1 (continuous-research streams per CONVENTIONS §14.5 work mode 3):

- **Sprint 0d prep** — document-cm skill design specifications (2118 lines, 12 sections). Commit `c7abca3`.
- **Sprint 0d1 prep** — Security Controls Baseline v0.1.0 / SD-009 (2658 lines, ~1030 control rows × 16 frameworks). Commit `73b308a`.
- **Sprint 0d2 prep** — Reference architecture starter v0.1.0 / SD-007 (2007 lines, 7 patterns × 8 sub-systems, draft status). Commit `ea48d2d`.
- **Sprint 0e prep** — LLM unrestricted-research-extraction strategy (1817 lines, recommends Qwen 3.5-122B-A10B + Llama 3.3 70B Instruct on Lambda Labs validation phase). Commit `d035220`.
- **Earlier in sprint:** Strategic-implications + ownership-trajectory research (1593 lines, commit `83a1b57`); data retention policy research (2165 lines, China-focused before redirect, kept as comparative reference); data storage and archiving research (1724 lines with COOP scope addition); environment strategy + promotion/demotion research (1851 lines, four-environment topology). All committed in `7581a03`.

Memory files added:

- `feedback_compensating_control_framing.md` — bypassing vendor safety behavior is a compensating control even if implementation is one line; defer until controls baseline is in place; distinguish from prevention/detection/response controls
- `feedback_attachment_disambiguation.md` — multiple README.md attached together overwrite each other in Downloads on both mobile and macOS; copy to outputs with disambiguating prefix before attaching

Architectural corrections recorded as feedback memory:

- `feedback_close_clean_push_extra.md` — close sprints clean; route new work to subsequent sprints
- `feedback_decision_promotion.md` — promote chat-state to durable docs as ongoing operational responsibility
- `project_strategic_decisions_log.md` — strategic-decisions log as new persistence tier between memory and ADR

## What worked

- **Parallel-sprint methodology validated.** Five concurrent Cowork research streams ran during active CC work without conflict. Total throughput across the sprint was substantially higher than serial execution would have produced. CONVENTIONS §14.3 parallel-sprints-deferred entry can be amended in 0d2 with the lessons learned: parallel works at solo+AI scale because each stream produces independent deliverables to non-overlapping file paths, and the orchestrator (Dispatch) holds the integration responsibility.

- **Eric's traceability + reproducibility discipline produced visible artifacts.** Decision-history is now traceable across SD log → research → architectural amendments → commits. The DoDAF cross-reference matrix surfaced 12 defects honestly (rather than cosmetically); each is sized and assigned to a downstream sprint. Commit messages reflected accurate counts (after the 1030-vs-1125 correction). Working-tree state was clean at every approval cycle.

- **Compensating-control discipline correction landed mid-sprint.** Eric flagged that the env var Layer 1 fix is a compensating control (not architecturally trivial) and pulled it from 0c1 immediate-action to post-Sprint-0d1 deferral. This is exactly the kind of architectural-process discipline the strategic-implications research recommended. The correction landed as feedback memory so future sessions inherit the prevention-vs-compensating distinction.

- **Three-layer DoDAF view layering surfaced as architectural insight.** Eric's correction that DoDAF views layer by abstraction (reference architecture / platform / sub-system) refines the CONVENTIONS §11.7 simplified two-layer framing. Captured for §11.7 amendment in Sprint 0d2.

- **China-dropped, Brazil-deferred decision held.** Production scope correctly tightened mid-sprint. The retention research stays as comparative reference; no Brazil-specific deep-dive needed yet.

- **CC9 deny list deployed cleanly across three repos in one task.** First multi-repo coordinated deploy with schema verification against Anthropic docs, JSON validation, structural-and-behavioral check, all wrapped in atomic commits per repo. Validates the pattern for future multi-repo work.

- **AV-2 enrichment substantially exceeded expectations.** 215 net rows added (planned ~58 domain concepts; landed ~215 across 7 new sections + 4 expansions); CARP/CARPO typing applied per row; 4 authoring rules applied with traceable renames; 23 bracketed-context tags. Tier-correction (OPERATIONAL → ARCHITECTURE) was a defect cleanup that the enrichment naturally surfaced.

- **0c1 restructure (move CC4-6 to 0c1.5) honored close-clean methodology.** Per Eric's "rename to its own sprint without anything else" call. Sprint 0c1.5 drafted as dedicated rename-only sprint mid-stream; 0c1 closed clean at 7 fresh CCs instead of bloating to 10 partial.

## What didn't work

- **Commit-message accuracy required mid-flight correction twice.** "1125 vs 1030 control rows" (Cowork-task author count vs mechanical grep) and "7 vs 8 sub-systems" (my brief miscounted by treating Lifting Tracker as separate from the seven future sub-systems). Both caught before commit but cost review cycles. Lesson: commit messages should cite mechanically-reproducible counts OR explicitly note "author count"; mixing the two breeds inaccuracies.

- **Voice-to-text artifacts in user messages caused multiple ambiguity passes.** Eric on mobile via voice produced "0cq" (intended 0c1), "go for repo 1" (after I had already pushed go), "0d2 prep" terminology that I needed to clarify between the data-retention research framing and Brazil/LGPD. Each artifact required clarification round-trip. Lesson: when user message is short and ambiguous, pause and ask before proceeding rather than guessing — even at fast-cadence pace.

- **Attachment overwrite issue with multi-README batches.** Sending 4 `README.md` files as attachments resulted in mobile + macOS Downloads collision (last save wins). Eric flagged. Captured as `feedback_attachment_disambiguation.md` memory; standing rule going forward.

- **Sprint 0c1 ran at 10 CCs (over §14.2 recommended 3-7 range).** The retro for Sprint 0c flagged this as a defect; 0c1 retained the 10-CC scope as inherited from 0c close. Lesson: when inheriting from a prior sprint that opened over-scoped, push some CCs to subsequent sprints at the inheritance commit rather than running over-scoped through the new sprint.

- **DoDAF cross-reference matrix surfaced 12 defects** (US-073 missing, CONVENTIONS version drift in 3 views, D28 ADR pending stale, AV-1 prose stale, CV "and"-form, US-100a/b/c/d alphanumeric, SvcV-1 one-sided, v2/v3 stories without coverage, future stories without coverage, the matrix itself missing until now). Each is sized and assigned but they accumulated without prior detection. Lesson: cross-reference sweeps should run on every Architecture-class doc version bump, not just at sprint stretch deliverables.

- **Hetzner/cloud-rental research recommendation retracted mid-sprint after Eric pushed back on subscription model.** The strategic-implications research initially recommended Phase 1 = Hetzner Cloud rental → Phase 2 = owned hardware. Eric's "buy once / not stuck in pay-by-the-month" preference reversed it briefly to "owned-from-day-one," then he settled on Hybrid (self-hosted Supabase Docker on Hetzner for MVP/alpha/beta, scaling decision deferred). Multiple framings attempted; final stance held. Lesson: research recommendations should explicitly map to user's stated preferences; if preference matrix isn't in the brief, recommendation might miss.

## What to improve in Sprint 0c1.5

1. **Hold scope at 3 CCs.** Sprint 0c1.5 is the rename pass only per Eric's call. No additions. If new work surfaces, route to 0c2 or backlog.
2. **Mechanical work first; cross-reference sweep after.** Rename pass is mechanical (file moves + grep-replace); the cross-reference sweep is also mechanical but error-prone. Spawn separately so each can pause for review independently.
3. **Verify CONVENTIONS_v0.2.4 references aren't broken.** The rename touches files that CONVENTIONS itself references (CONVENTIONS table at §4 lists current filenames). Sweep CONVENTIONS too.
4. **Don't forget portfolio cross-references.** reach4all and Concept may reference some lifting-tracker docs by old name; sweep both repos.
5. **Pause for "go" at the rename diff and again at the cross-reference sweep diff.** Two-stage commit per repo gives Eric better review granularity.

## Key takeaways

1. **Parallel-sprint methodology now has empirical data.** Five Cowork research streams + sprint CC work + parallel commit cycles all ran cleanly. Tooling (Cowork + Dispatch + Code) held; bindfs lock-cycle didn't bite during 0c1; integration via Dispatch worked. Sprint 0d2's CONVENTIONS §14.3 amendment (parallel-sprints methodology) can land with these findings as input.

2. **Decision-history traceability is a separate discipline from Strategic Implications.** Strategic Implications captures cost / lock-in / retention / ownership / exit per decision (forward-looking). Decision-history traceability captures what informed each decision and what each decision constrains downstream (backward + forward chains). Both belong in the architecture-process amendment landing in 0d2.

3. **Reproducibility discipline forces honest counts in commit messages.** Mechanical-reproducible numbers vs author-judgment counts are different things; commit messages should be explicit which they cite. Saved as memory.

4. **The strategic-implications gap pattern is a recurring finding.** This sprint surfaced THREE more architectural gaps the prior process didn't catch (compensating-control framing on env var, three-layer DoDAF view layering, environment topology missing dev/test/prod/coop). The Strategic Implications discipline amendment in 0d2 should explicitly add a "gap-detection cadence" — at every sprint boundary, run the strategic-implications filter across new architecture-touching artifacts.

5. **Eric's "scientific experiment" framing is more than metaphor.** Each parallel research stream was a hypothesis test (does the recommendation fit Eric's preferences? does the data support the recommendation? what's the cost trajectory?). Each correction (China→Brazil, two-layer→three-layer, hosting framing) was a refined hypothesis. The portfolio's accumulating evidence about its own architectural process is itself research output — captured implicitly across SD log + retros + memory but not yet as a primary artifact. Worth considering an "experimental log" artifact in 0d2 alongside the architecture-process amendment.

6. **Build sprint still hasn't happened.** Seven sprints in (0a, 0b, 0b1, 0b2, 0c, 0c0.5, 0c1) and document-cm skill build — the planned implementation deliverable since Sprint 0a — is still deferred (now scheduled for Sprint 0d, with design spec landed during 0c1 parallel research). Pattern from 0c retro persists. Sprint 0d's design-spec input is ready; the build still pending.

## Memory updates from this sprint

Two new memory files added:

- `feedback_compensating_control_framing.md` — bypassing vendor safety behavior is a compensating control even if implementation is one line of config; defer until controls baseline is in place; distinguish from prevention/detection/response controls which can ship sooner
- `feedback_attachment_disambiguation.md` — multiple files with same name (READMEs, CLAUDE.md across repos) overwrite each other in Downloads on both mobile and macOS; copy to outputs with disambiguating prefix before attaching

`MEMORY.md` index updated. Existing memory files (`feedback_close_clean_push_extra`, `feedback_decision_promotion`, `project_strategic_decisions_log`, etc.) remain accurate post-0c1; no edits needed.

Likely candidate for memory write during 0c1.5 close:
- `feedback_scientific_experiment_framing.md` — Eric's reproducibility-via-tracking + each-stream-as-hypothesis-test framing; Save as standing methodology rather than per-conversation observation

## Sprint 0c1.5 — already scoped

**Theme:** Naming-Convention Rename Pass

**Dates:** 2026-04-29 → TBD

**Goal:** Apply `lift-track-` prefix system-wide; complete source-doc-cm-design + dispatch-handoff renames; sweep cross-references portfolio-wide.

**Close criteria (3 items):**
1. Naming-convention rename pass: `lift-track-` prefix on ~25 system-specific files + cross-reference sweep
2. `source-doc-cm-design.md` rename → `lift-track-source-document-cm_v0.3.0.md` + ~140 cross-reference updates
3. `dispatch-handoff.md` rename → `lift-track-dispatch-handoff_v0.1.0.md` + semver bump per CONVENTIONS §6.2

**Stretch:** none. Single-purpose rename-only sprint per Eric's "rename to its own sprint without anything else" call.

## Open externally / on Eric's plate (carried from 0c1)

- Layer 1 env var (`GIT_OPTIONAL_LOCKS=0`) — DEFERRED-TO-POST-SPRINT-0D1 per compensating-control discipline. No action until 0d1 controls baseline lands.
- `Untitled.canvas` at lifting-tracker repo root — separate handling; delete OR move to proper location OR add `*.canvas` to `.gitignore`.
- 12 defects in DoDAF cross-reference matrix §6 — assigned to Sprint 0c2 / 0d cleanup.
- f0492d52 Claude.ai URL re-share — pushed to Sprint 0e backlog.
- WWDC 2026 hardware-purchase reminder will surface in May/June.

---

© 2026 Eric Riutort. All rights reserved.
