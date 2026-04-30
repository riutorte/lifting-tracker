---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
tier: OPERATIONAL
content_class: operational
sprint: 0b
sprint_name: Foundation infrastructure
sprint_dates: 2026-04-24
duration_days: 1
---

# Sprint 0b Retrospective — Foundation infrastructure

**Dates:** 2026-04-24 (1 calendar day; ~10–12 hours autonomous Cowork operation)
**Goal:** Stand up infrastructure so implementation can begin.
**Close criteria:** Reach4All operational; `lift-track-architecture_v0.4.0.md` reflects all decisions; D25 + D28 ADRs landed; `CONVENTIONS_v0.2.1.md` codifies DoDAF + SysML + filename versioning; 10 DoDAF views produced; operational docs (metrics, orchestration, risks, roadmap) created; Sprint 0a retro + retros README; frontmatter normalization + filename versioning across architecture/operational/reference docs; all work committed cleanly. Stretch criteria (`document-cm` skill, trust-but-verify instrumentation, MCP installs) explicitly deferred to Sprint 0c per Eric's mid-sprint call.

## Outcome

Eight of eleven close criteria met. Three explicitly deferred to Sprint 0c (not failed — re-scoped mid-sprint when Day 2+ work was promoted out of Sprint 0b). Sprint formally closed 2026-04-24.

- ✅ Reach4All operational — 36 docs migrated, archive→research clean
- ✅ `lift-track-architecture_v0.4.0.md` reflects all decisions — D8 revision, D19 Tier 2 concern log, D26 TypeScript, D27 multi-agent interop, four cross-cutting principles
- ✅ D25 + D28 ADRs landed
- ✅ `CONVENTIONS_v0.2.1.md` — DoDAF + SysML diagrams section + filename-versioning rule
- ✅ 10 DoDAF views produced (AV-1, AV-2, OV-1, OV-5c, CV, SV-1, SV-6, SvcV-1, DIV-2, StdV-1)
- ✅ Operational docs created (`lift-track-metrics_v0.1.0.md`, `orchestration_v0.1.0.md`, `lift-track-risks_v0.1.0.md`, `lift-track-roadmap_v0.4.0.md` with timeline + mermaid gantt)
- ✅ Sprint 0a retrospective + retros README v0.1.0
- ✅ Frontmatter normalization + filename versioning swept across architecture/operational/reference docs
- ✅ All work committed cleanly (4 commits)
- ⏸️ `document-cm` skill build — DEFERRED to Sprint 0c
- ⏸️ Trust-but-verify instrumentation — DEFERRED to Sprint 0c
- ⏸️ MCP installs — DEFERRED to Sprint 0c (Eric's action via Claude Desktop config)

## Stats

- Duration: 1 calendar day (~10–12 hours autonomous operation)
- Commits to lifting-tracker: 4 (gitignore cleanup, Sprint 0a research landings + CM brief v0.3.0, Sprint 0b Day 1 omnibus, CONVENTIONS v0.2.1)
- ADRs added: 2 (D25 Source-Document CM, D28 Architectural Discipline Profile)
- DoDAF views produced: 10
- D-number additions/revisions to architecture: 4 (D8 revision, D26, D27, D28) + 4 cross-cutting principles (MCP-first, three-layer data, Railway hosting, HyperDX observability)
- Cross-cutting principles codified: 4
- Files renamed under `<name>_v<version>.md` pattern: 25
- Cross-references updated across renames: 48 files touched
- External repo created and populated: Reach4All (~/reach4all/) with 36 docs
- Operational docs created: 4 (metrics, orchestration, risks, roadmap)
- Memory files added or updated: 0 (sprint focus was execution, not preference capture)

## Artifacts delivered

**Architecture & ADRs:**

- `docs/lift-track-architecture_v0.4.0.md` — D8 revision (SQLite + Drizzle + custom sync), D19 Tier 2 concern log, D26 TypeScript, D27 multi-agent interop promoted, D28 referenced, four cross-cutting principles (MCP-first, three-layer data, Railway hosting, HyperDX observability)
- `docs/adrs/lift-track-D25-source-document-cm_v0.1.0.md`
- `docs/adrs/lift-track-D28-architectural-discipline-profile_v0.1.0.md`

**Conventions & operational:**

- `docs/CONVENTIONS_v0.2.1.md` — DoDAF + SysML diagrams section + filename-versioning rule
- `docs/lift-track-metrics_v0.1.0.md`
- `docs/orchestration_v0.1.0.md`
- `docs/lift-track-risks_v0.1.0.md`
- `docs/lift-track-roadmap_v0.4.0.md` — timeline + mermaid gantt

**DoDAF views (10):**

- `docs/dodaf/lift-track-dodaf-AV-1-overview_v0.1.0.md`
- `docs/dodaf/AV-2-dictionary_v0.1.0.md`
- `docs/dodaf/lift-track-dodaf-OV-1-concept-graphic_v0.1.0.md`
- `docs/dodaf/lift-track-dodaf-OV-5c-activity-sequence_v0.1.0.md`
- `docs/dodaf/lift-track-dodaf-CV-capabilities_v0.1.0.md`
- `docs/dodaf/lift-track-dodaf-SV-1-interfaces_v0.1.0.md`
- `docs/dodaf/lift-track-dodaf-SV-6-data-exchanges_v0.1.0.md`
- `docs/dodaf/lift-track-dodaf-SvcV-1-services-context_v0.1.0.md`
- `docs/dodaf/lift-track-dodaf-DIV-2-logical-data_v0.1.0.md`
- `docs/dodaf/lift-track-dodaf-StdV-1-standards_v0.1.0.md`

**Retrospectives:**

- `docs/retrospectives/README_v0.1.0.md`
- `docs/retrospectives/lift-track-sprint-retro-0a.md`
- `docs/retrospectives/lift-track-sprint-retro-0b.md` (this file)

**External:**

- `~/reach4all/` repo created and populated with 36 docs (research migration from `lifting-tracker/docs/reference/`, archive→research consolidation)

**Verification artifacts:**

- `docs/reference/lift-track-architecture-v0.3-to-v0.4-audit_v0.1.0.md` — formal content-drop audit confirming zero drops across architecture revision

**Sweep work (no new files, but 25 renamed + 48 touched):**

- 25 files renamed to `<name>_v<version>.md` per Concept Computing pattern (architecture, ADRs, DoDAF views, operational docs, CONVENTIONS, retros README)
- 48 files updated with revised cross-references to the renamed targets

## What worked

- **Filename versioning at scale.** 25 files renamed via `git mv` with cross-reference updates across 48 files in one task partition. Cascade was bounded because each rename was paired with a grep pass for inbound references before the move landed.
- **DoDAF view production at velocity.** 10 views produced in a single task partition using mermaid + SysML iconography for fit-for-purpose authority. No Gaphor dependency; ASCII-renderable diagrams sufficient at Lifting Tracker scale.
- **Content-drop defenses validated formally.** `lift-track-architecture-v0.3-to-v0.4-audit_v0.1.0.md` performed a section-by-section diff and confirmed zero content drops across the v0.3 → v0.4 architecture revision. Fresh-Read + post-mutation verify + 20K pre-flight + baseline snapshot pattern (codified in CM v0.3.0 §5.7) held up under a high-mutation revision.
- **Multi-task parallelism when partitioned to disjoint files.** Architecture revision, DoDAF view production, and Reach4All migration ran in parallel without merge conflicts because each task owned a distinct file set.
- **Trust-but-verify reframe extended beyond agents.** Eric's mid-sprint correction ("kanban needs change-detection too") generalized the pattern: every doc deserves a way to detect overwrites. Codified into the filename-versioning rule and queued for CONVENTIONS v0.2.2.
- **Sprint re-scoping mid-flight.** When Day 2+ work (document-cm skill, instrumentation, MCP installs) couldn't fit the calendar day, Eric's call to push them to Sprint 0c was honored cleanly — three close criteria moved to ⏸️ DEFERRED rather than ❌ MISSED, and Sprint 0c picked them up explicitly.
- **DoDAF + SysML + mermaid composition.** SysML iconography embedded in mermaid diagrams gave the views formal-enough authority for the project's scale without requiring a heavyweight modeling tool. Decision is captured for future revisit.

## What didn't work

- **Code task spawn auth issues recurring.** `mkdir reach4all` got stuck on plan-mode; ExitPlanMode 401'd on the first Reach4All scaffold attempt. Trivial filesystem operations should not require a Code task spawn at all.
- **Plan-mode default on spawned Code tasks caused friction.** Eric had to manually approve each spawn or set auto-mode. The friction compounded across the sprint because Code tasks were used for operations that didn't warrant them.
- **Frontmatter normalization sweep had unanticipated conflicts.** The initial sweep paused twice — once on the roadmap class (operational vs reference) and once on the architecture status field — because the sweep prompt didn't pre-resolve those edge cases. Each pause required a clarifying round-trip with Eric.
- **"Pure ledgers don't get semver" rule was wrong as written.** Eric flagged mid-sprint that kanban needed change-detection too, since overwrites without a version bump are silently destructive. Rule corrected: pure ledgers still need a version mechanism (sprint-boundary semver bumps for kanban). The original framing under-specified what "pure ledger" meant.
- **Bindfs sandbox left residue in Reach4All scaffold.** `.git.broken` and `test1.txt` were left behind by the Code task that scaffolded the repo. Follow-up Code tasks to clean up timed out. Cleanup queued for Sprint 0c.
- **Default class for ambiguous "convention" docs was guessed wrong.** CONVENTIONS itself and the retros README both got initial class assignments that had to be revised. The pattern: when a doc's role straddles operational and reference, defaulting to operational under-classes it.
- **Filename versioning was retroactive, not from-creation.** All 25 renames were sweep work after the fact. New architecture/operational/reference docs created earlier in the sprint landed without `_v<version>` and had to be moved later. The cascade cost (48 cross-reference updates) was avoidable.

## What to improve in Sprint 0c

1. **Don't spawn trivial Code tasks.** `mkdir`, file copies, simple renames — ask Eric directly or use a Cowork-bash workaround. Spawning a Code task for a one-line shell command is over-engineering and triggers the plan-mode friction.
2. **Default to Reference class for ambiguous "convention" docs.** CONVENTIONS, retros README, and similar meta-docs that describe how the project works should default to `content_class: reference`. Operational class is for live state (kanban, metrics, current risks).
3. **Apply filename versioning from creation, not retroactively.** Every new architecture/operational/reference doc lands with `<name>_v<version>.md` in its first commit. The retroactive sweep is what cost 48 cross-reference updates.
4. **Verify cross-references BEFORE renaming.** A single grep pass for "what depends on this filename" before any rename means the cascade is bounded and predictable. Already validated in the Sprint 0b sweep — formalize as required pre-rename step.
5. **Honor Eric's stated patterns and generalize.** When Eric said "kanban needs version control too," the underlying request was about change detection. Generalize: every doc deserves a way to detect overwrites. Apply the principle wherever it lands, not only to the file Eric named.
6. **Pre-resolve sweep edge cases.** Before launching a frontmatter normalization or filename versioning sweep, walk through the doc set and surface the ambiguous cases (class, status, version) up front. One clarifying round-trip beats two pauses mid-sweep.
7. **Bound Code task scope to actual code.** Reach4All scaffold residue happened because a Code task was used for repo setup with embedded shell ops. Either keep Code tasks tightly scoped to a single code change or use direct shell from Cowork for setup.

## Key takeaways

1. **Filename versioning at scale works.** 25 files renamed cleanly with cross-references updated across 48 files in a single task partition. The Concept Computing `<name>_v<version>.md` pattern is now the project standard and held up under a high-mutation sweep.
2. **DoDAF + mermaid + SysML iconography is sufficient for Lifting Tracker scale.** No Gaphor or other heavyweight modeling tool needed yet. 10 views were produced in one task using markdown + mermaid only. Revisit if scope expands beyond what mermaid can express.
3. **Sprint 0b's massive scope was achievable in one calendar day under solo+AI.** 10 DoDAF views + 4 ADRs + CONVENTIONS overhaul + frontmatter sweep + filename versioning + Reach4All migration in ~10–12 hours. The breakthrough wasn't a single magic spawn — it was Eric's per-decision feedback loop catching wrong defaults early enough that no major task needed redo.
4. **Trust-but-verify generalizes from agents to documents.** Kanban's version need is the same logic as the 16 Concept agents: don't assume the system handles change detection — instrument it. The principle now drives the filename-versioning rule and will drive document-cm in Sprint 0c.
5. **Sprint boundaries are good places to bump kanban semver.** Sprint close = kanban v0.X.0. Codifies change detection without requiring per-edit version bumps. Queued for CONVENTIONS v0.2.2.
6. **Mid-sprint re-scoping is cheaper than missing close criteria.** Eric's call to push Day 2+ to Sprint 0c kept Sprint 0b honestly closed instead of partially failed. Future sprints should explicitly leave room for re-scoping decisions when scope reality diverges from sprint-open scope.

## Memory updates from this sprint

No new memory files added. Sprint focus was execution and codification (CONVENTIONS, ADRs, DoDAF views) rather than preference capture. The only memory-adjacent change was the reaffirmation of `project_plan_mode_decision` (already captured Day 0; reaffirmed Sprint 0b after the Reach4All scaffold plan-mode friction).

Implicit takeaways queued for memory in Sprint 0c:

- `feedback_no_trivial_code_spawns.md` — don't spawn Code tasks for operations that fit in one shell line
- `feedback_default_reference_for_meta_docs.md` — convention/meta docs default to `content_class: reference`
- `project_filename_versioning_from_creation.md` — `<name>_v<version>.md` lands at first commit, not retroactively

## Sprint 0c — scoped

Per Eric's mid-Sprint-0b call to move Day 2+ work to a new sprint, Sprint 0c carries the deferred infrastructure plus the cleanup and follow-up that surfaced during Sprint 0b. Sprint 0c is scoped as a multi-day sprint (3–5 days estimated) because document-cm is the centerpiece work and is multi-hour Code-task scale.

1. `document-cm` skill implementation (3–5 days, multi-hour Code task)
2. `.cm/manifest.yaml` for Lifting Tracker (depends on #1)
3. Trust-but-verify instrumentation framework for the 16 Concept agents
4. MCP installs — filesystem + git + brave-search + Firecrawl (Eric's action via Claude Desktop config)
5. DoDAF cross-reference matrix — `docs/lift-track-dodaf-cross-reference.md` linking user stories + sprints + DoDAF views + decisions
6. Reach4All bindfs residue cleanup (`.git.broken`, `test1.txt`)
7. `lift-track-architecture-v0.3-to-v0.4-audit_v0.1.0.md` → migrate to `reach4all/docs/operational/`
8. CONVENTIONS amendment v0.2.1 → v0.2.2 — kanban gets semver bumped at sprint boundaries
9. kanban semver bump → `kanban_v0.4.0.md` with Sprint 0b CLOSED + Sprint 0c OPEN content
10. Sprint 0b retrospective (this file — completed at Sprint 0c open)
11. Sprint 0c scope doc
12. `lift-track-source-document-cm_v0.3.0.md` rename to `_v<version>.md` + ~140 cross-reference updates (deferred from Sprint 0b)

Sprint 0d (was originally planned as Sprint 0c implementation work, pushed back one slot):

- Initial Supabase self-hosted on Railway
- Initial Lifting Tracker scaffold
- HyperDX deployment
- Custom MCP server builds (`lifting-tracker-domain-mcp`, `document-cm` MCP adapter)

---

© 2026 Eric Riutort. All rights reserved.
