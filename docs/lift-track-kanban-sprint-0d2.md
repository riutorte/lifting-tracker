---
author: Eric Riutort
created: 2026-04-30
updated: 2026-04-30
tier: OPERATIONAL
content_class: operational
sprint: 0d2
sprint_name: Framework rename + reference architecture + xrsize4all repo standup + D-decision amendments + new SD entries
sprint_dates: TBD → TBD
sprint_open_date: TBD
status: drafted
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0d2)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0d2's per-sprint kanban. **Drafted ahead of sprint open from the prep deliverable** at `reach4all://docs/research/0d2-prep-amendments-and-sd-entries.md`. Finalized at the actual sprint-open commit when Sprint 0d1 closes (or earlier if 0d2 opens parallel to 0d1 per Q9.7 in the prep doc). Frozen at sprint close as the immutable record.

## Sprint 0d2 — Framework Rename + Reference Architecture + xrsize4all Repo Standup + D-Decision Amendments + New SD Entries

**Theme:** Architecture-discipline upgrade that Sprint 0c1 retro and the strategic-implications research surfaced as load-bearing. Lands the framework rename to AAF (Agentic Architecture Framework), the v0.1.0 reference architecture release, the new xrsize4all portfolio-level repo, four new SD entries (SD-013 / SD-014 / SD-015 / SD-016), Strategic Implications amendments to 13 D-decisions plus 2 cross-cutting principles, and a process amendment bundle (ADR template Strategic Implications section, audit-class version-suffix rule, three-layer DoDAF view layering, decision-history traceability discipline, synthesize-across as work-mode-3 sub-pattern). Source-of-truth text for every paste-in is consolidated in the prep deliverable; sprint capacity is paste-and-commit + the three authored-anew artifacts (framework doc, reference architecture, rolled-up overviews).

**Dates:** TBD → TBD (estimated 4-7 days under solo+AI per prep §7.1 effort estimate; authoring of CC-1 / CC-2 / CC-3 is the long pole; CC-4 / CC-7 / CC-8 are paste-and-commit; CC-5 / CC-6 are checklist-driven with cross-reference sweep as the one risk surface)

**Goal:** xrsize4all repo is master for portfolio-level architecture, research-promoted-to-architecture, and XRSize4 ALL-specific (not Lifting Tracker-specific) artifacts. AAF is the new official framework name; "DoDAF" references in active artifacts are reframed as "DoDAF view set within AAF." Reference architecture is v0.1.0 released and is the inheritance source for sub-system #2 onboarding when that occurs. Strategic Implications discipline and decision-history traceability discipline are binding from 0d2 forward. Reach4all retains research-class docs only.

**Input substrate:** Two parallel prep deliverables drafted 2026-04-29 / 2026-04-30:

- `reach4all://docs/research/0d2-prep-amendments-and-sd-entries.md` (1,775 lines, drafted 2026-04-30) — D-decision Strategic Implications amendments + new SD entries + process amendments. Feeds CC-1 / CC-3 / CC-4 / CC-5 / CC-6 / CC-7 / CC-8.
- `reach4all://docs/architecture/xrsize4all-reference-architecture-starter_v0.1.0.md` (2,007 lines, drafted 2026-04-29) — reference-architecture starter for SD-007. Feeds CC-2 directly (the starter IS the substrate; CC-2 is migration + framework-name substitution + sprint-bound open-question resolution + Lifting Tracker back-port reconciliation, NOT from-scratch authoring). See CC-2 sub-criteria below.

Every CC below maps to one or more sections of the prep deliverables; paste-in (CC-4 / CC-7 / CC-8) is mechanical at sprint open per §1.2 of the amendments-and-SD prep.

---

## Close criteria (8 items)

Per prep §7.1 close-criteria framing matrix. Effort estimates and risk classes are reproduced from the prep doc. Each CC's entry condition is the prior CC in the §8.1 sequence; exit condition is "all paste-in committed and cross-references resolve."

### CC-1 — Framework rename (SD-006)

**Deliverable.** AAF doc lands at `xrsize4all://docs/architecture/aaf_v0.1.0.md`. CONVENTIONS §11 amended to reframe DoDAF view set as one component within AAF. ADR D28 amendment lands.

**Maps to.** Prep §1.1 item 1, SD-006.

**Effort.** 1-2 days authoring.

**Risk.** Low — naming research already locked in `reach4all://docs/research/ai-architecture-framework-naming-research.md`; AAF replaces AIAF as leading name per that research.

**Entry.** CC-5 + CC-6 + CC-4 done (repo exists; ADR template binding; migration sweep clean).

**Exit.** AAF doc committed; CONVENTIONS §11 reframing committed; D28 amendment committed; cross-references in research docs that cite "DoDAF as framework" updated to "DoDAF view set within AAF."

### CC-2 — Reference architecture v0.1.0 release (SD-007)

**Deliverable.** `xrsize4all://docs/architecture/xrsize4all-reference-architecture_v0.1.0.md` lands as v0.1.0 release. Starter doc (`xrsize4all-reference-architecture-starter_v0.1.0.md`) archived or merged into the release.

**Maps to.** Prep §1.1 item 2, SD-007. Substrate: `reach4all://docs/architecture/xrsize4all-reference-architecture-starter_v0.1.0.md` (2,007 lines, drafted 2026-04-29 in Sprint 0c1 adjacency, 11 sections — executive summary; ref-arch as discipline; seven-pattern catalog (P1 Identity / P2 Ontology+Data / P3 Intelligence / P4 Content / P5 Commerce / P6 Analytics / P7 Lifecycle); per-sub-system instantiation template; cross-cutting capability catalog (eight capabilities); four architectural invariants; specialization guidelines; lifecycle; DoDAF/AAF view layering across three abstraction tiers; ten open questions; cross-references).

**Effort.** 1-2 days. **Reframed per starter content review:** authoring is largely complete in the starter — CC-2 work is re-home + framework-name substitution + sprint-bound open-question resolution + Lifting Tracker back-port reconciliation, not from-scratch authoring. The "1-2 days" upper bound holds; the dominant cost is decision-making on §10 open questions, not prose composition.

**Risk.** Low.

**Entry.** CC-1 done (AAF naming binds; reference architecture inherits from AAF); CC-6 done (starter doc migrated from reach4all to xrsize4all per prep §6 + starter §10.9).

**Exit.** Reference architecture v0.1.0 committed in xrsize4all; starter doc disposition committed (archive or merge); v0.1.0 inheritance source ready for sub-system #2 onboarding; sprint-bound open questions from starter §10 (10.1, 10.6, 10.9) resolved or explicitly deferred at sprint close per starter §10.11 timing matrix.

**Sub-criteria (additive — sourced from `reach4all://docs/architecture/xrsize4all-reference-architecture-starter_v0.1.0.md` review on 2026-04-30; do not renumber CC-1 through CC-8):**

- **CC-2.1 — Re-home and de-starter.** Move `reach4all://docs/architecture/xrsize4all-reference-architecture-starter_v0.1.0.md` to `xrsize4all://docs/architecture/xrsize4all-reference-architecture_v0.1.0.md`; drop the `-starter` suffix; remove the provenance note at the document head per starter §10.9. Version remains 0.1.0 (re-home is not a substantive revision per starter top-of-doc note). Coordinated with CC-6 migration sweep — this is one entry in the §6 migration ledger.

- **CC-2.2 — Framework-name substitution.** Replace the placeholder term "the framework" throughout the migrated doc with the SD-006-finalized name (AAF per current leading candidate from `reach4all://docs/research/ai-architecture-framework-naming-research.md`). Targets per starter top-of-doc framework-name caveat: §1 caveat block; §9 view-layering section (framework-name placeholder); all inline references reading "the framework." DoDAF view names (AV-1, AV-2, CV, OV-1, OV-5c, SV-1, SV-6, SvcV-1, StdV-1, DIV-2) are RETAINED — they are inherited as components within AAF, not renamed. Resolves starter §10.1 sprint-bound open question; same answer as Q9.x framework-name in this kanban.

- **CC-2.3 — Three-tier view-layering ratification (Eric's 2026-04-29 correction).** Confirm starter §9.1 three-tier abstraction (Reference → Platform → Sub-system) as the binding view-layering discipline. Cross-reference and align with the new CONVENTIONS §11.7 amendment landing in CC-4 ("three-layer DoDAF view layering"). The view-layering matrix in starter §9.4 stands as the v0.1.0 reference. Each tier produces the same DoDAF view set (per starter §9.3.5 R-5). Cross-references layer downward, compliance flows upward (per starter §9.3.3 R-3 + §9.3.4 R-4). Reference-layer view extraction into standalone files (per starter §9.7 / §10.4) DEFERRED to v0.X.0+ per starter §10.11 timing matrix.

- **CC-2.4 — Sprint-bound open-question resolution per starter §10.11.** Resolve the three open questions starter §10.11 marks "Sprint 0d2 open" / "Sprint 0d" timing:
  - §10.1 — Framework name lock-in (paired with CC-1 + Q9.x; default AAF).
  - §10.6 — Concept Computing inheritance depth. Decide whether the seven directly-applicable concerns (CC-011 Reasoner Duality, CC-013, CC-014, CC-015, CC-016 Autonomous Agent Governance, CC-017 LLM Instruction Fidelity, CC-018) get portfolio-level resolution status analogous to SD-009. CC-017 is the most acute case per starter §10.6 — referenced extensively but has no formal portfolio home.
  - §10.9 — Migration timing (resolved by CC-6 sequencing; CC-2.1 above is the operational expression).
  - Other §10 questions (§10.2 specialization strictness; §10.3 phase-mandatoriness per pattern; §10.4 reference-layer view extraction; §10.5 patterns catalog completeness; §10.7 publication-primitive reshape; §10.8 OWL companion timing; §10.10 ARB scope) EXPLICITLY DEFERRED per starter §10.11 — flag in the v0.1.0 release note that these remain open for v0.2.0+ per their suggested timing.

- **CC-2.5 — Lifting Tracker back-port reconciliation.** Starter §4.3 contains the worked instantiation back-port: Lifting Tracker pattern-by-pattern — six patterns Inherit-or-Inherit-with-extension, P5 Commerce Phase-deferred, no formal Deviations. CC-2 confirms the back-port lands either (a) as a new section / appendix in `lifting-tracker://docs/lift-track-architecture_v0.4.0.md` cross-referencing the reference architecture, OR (b) as a new companion doc `lift-track-reference-architecture-instantiation_v0.1.0.md`. Per starter §4.3.3, the strategic-implications research §8.5 D19 amendment is the ONLY formal back-port required to bring Lifting Tracker fully into compliance with reference architecture v0.1.0 — that amendment is already scoped in CC-8 (D19 Strategic Implications block). Decide format (a vs b) at sprint open.

- **CC-2.6 — CM-governance posture binding.** Starter §8.1 establishes this document as Architecture-class under WF-001 (ADR-based workflow per `lift-track-source-document-cm_v0.3.0.md`). Confirm binding at v0.1.0 release: material changes (pattern adds/removes; mandatory→optional shifts; invariant changes; instantiation-template required-field changes; lifecycle policy changes) require WF-001 ADR. Non-material changes (examples added, wording clarified, placeholders filled, cross-references updated) follow lighter cadence per starter §8.1. Every future amendment carries a Strategic Implications block per starter §6.5 invariant I-4 (binds regardless of when SD-006 / SD-009 / SD-013 / SD-014 finalize). Couples to CC-4 ADR template binding (the I-4 discipline IS the §4.1 ADR template Strategic Implications section).

### CC-3 — Rolled-up architectural overviews (SD-008)

**Deliverable.** Portfolio-level overview at `xrsize4all://docs/architecture/xrsize4all-architectural-overview_v0.1.0.md`. Sub-system overview at `lifting-tracker://docs/lift-track-architectural-overview_v0.1.0.md`. Both pull OV-1 + SV-1 + DIV-2 + selected views into single coherent narratives for executive / technical / implementer audiences.

**Maps to.** Prep §1.1 item 3, SD-008.

**Effort.** 1-2 days authoring.

**Risk.** Low.

**Entry.** CC-1 + CC-2 done (overviews inherit from AAF + reference architecture).

**Exit.** Both overviews committed; narratives reviewed by Eric; cross-references to per-DoDAF-view docs resolve.

### CC-4 — Process amendments

**Deliverable.** Six process amendments land per prep §4:

- §4.1 ADR template Strategic Implications section (`xrsize4all://docs/reference/adr-template_v0.1.0.md` newly authored)
- §4.2 CONVENTIONS §14.5 — synthesize-across as work-mode-3 sub-pattern
- §4.3 Decision-review cadence
- §4.4 CONVENTIONS §11.7 — three-layer DoDAF view layering
- §4.5 CONVENTIONS §11.8 — audit-class artifact version-suffix rule
- §4.6 CONVENTIONS §11.9 — decision-history traceability discipline

**Maps to.** Prep §1.1 item 7 + §4 of prep, plus prep §1.1 item 8 (Sprint 0c1 retro decision-history traceability discipline = §4.6).

**Effort.** 0.5 day paste-and-commit.

**Risk.** Low — drop-in-ready text in §4 of prep doc.

**Entry.** CC-5 done (xrsize4all repo exists; CONVENTIONS migration target path valid).

**Exit.** All six amendments committed in `xrsize4all://docs/reference/conventions_v0.2.0.md` (per §11.8 audit-class version-suffix rule). ADR template at `xrsize4all://docs/reference/adr-template_v0.1.0.md`. Strategic Implications discipline and decision-history traceability discipline binding from 0d2 forward.

**Sprint-open reconciliation flag.** Current `lifting-tracker://docs/CONVENTIONS_v0.2.4.md` already occupies §11.7 (What gets which views), §11.8 (Tool fallback options), §11.9 (Presentation portability), and §14.5 (SDLC work modes). The prep doc's amendment numbering assumes new §11.7 / §11.8 / §11.9 / §14.5 slots — collision must be resolved at sprint open: either renumber existing 11.7-11.9 to 11.10-11.12 (disruptive but preserves prep numbering) or push new amendments to §11.10-§11.12 (preserves existing numbering; deviates from prep). §14.5 is cleaner — prep proposes a sub-pattern WITHIN existing §14.5, which is additive. See Q9.4 below.

### CC-5 — xrsize4all repo standup

**Deliverable.** `~/xrsize4all/` repo created with §5 directory structure, README, CLAUDE.md, LICENSE, .gitignore.

**Maps to.** Prep §1.1 item 4 + §5 of prep.

**Effort.** 0.5 day.

**Risk.** Low — checklist-driven.

**Entry.** None (foundational).

**Exit.** Repo exists at `~/xrsize4all/`; clean git init; first commit lands; ready as migration target for CC-6.

### CC-6 — Migration from lifting-tracker + reach4all to xrsize4all

**Deliverable.** All files in §6.1 + §6.2 of prep migrate to xrsize4all. All cross-references in §6.4 updated. No broken links across all three sibling repos (lifting-tracker, reach4all, concept-computing).

**Maps to.** Prep §1.1 item 4 + §6 of prep.

**Effort.** 0.5-1 day.

**Risk.** Medium — cross-reference sweep is the one risk surface in the sprint. Per prep §6.5 step 5: BEFORE removing originals, run cross-reference sanity-check (`grep -rn "reach4all://docs/architecture/" ~/lifting-tracker ~/reach4all ~/concept-computing` should return zero hits for migrated paths). Non-zero results block originals removal.

**Entry.** CC-5 done (target paths valid).

**Exit.** All migrated files at target paths; cross-references resolving; originals removed only after verification gate clears; xrsize4all is master for CM governance, SD log, security baseline, framework doc, reference architecture, rolled-up overviews; reach4all retains research-class docs only.

### CC-7 — New SD entries (SD-013 / SD-014 / SD-015 / SD-016)

**Deliverable.** Four new SD entries land in `xrsize4all://docs/architecture/strategic-decisions-log_v0.2.0.md` per prep §2.1-§2.4. SD-001 through SD-012 chain-block backfill per prep §2.5. Log version bumps to v0.2.0.

**Maps to.** Prep §1.1 item 6 + §2 of prep.

**Effort.** 0.5 day paste-and-commit.

**Risk.** Low — drop-in-ready text in §2 of prep doc. SD numbering subject to Q9.1 reconciliation at sprint open.

**Entry.** CC-1 + CC-2 + CC-3 done (SD entries cite AAF + reference architecture + overviews); CC-6 done (SD log migrated to xrsize4all); CC-4 done (ADR template binding for any SD that gets promoted).

**Exit.** Four SD entries appended; chain-block backfill committed; log v0.2.0 released; cross-references from D-amendments (CC-8) resolve.

### CC-8 — D-decision Strategic Implications amendments

**Deliverable.** 13 PROVISIONAL D-decisions plus 2 cross-cutting principles get Strategic Implications blocks added per prep §3. Targets: D3, D4, D5, D6, D8, D9, D11, D19, D20, D22, D23, D24, D27 + Hosting Posture cross-cutting + Observability cross-cutting. All paste into `lifting-tracker://docs/lift-track-architecture_v0.4.0.md`.

**Maps to.** Prep §1.1 item 5 + §3 of prep.

**Effort.** 0.5 day paste-and-commit.

**Risk.** Low — drop-in-ready text in §3 of prep doc.

**Entry.** CC-7 done (D-amendments cite SD-013 / SD-014 / SD-015 / SD-016 — they must exist first); CC-4 done (ADR template Strategic Implications section binds).

**Exit.** All 15 amendment blocks committed; cross-references to SD log resolve; D9 / D24 / D27 status reconciliation per Q9.6 applied.

---

## Total effort estimate

4-7 days under solo+AI per prep §7.1. Authoring (CC-1 / CC-2 / CC-3) is the long pole; CC-4 / CC-7 / CC-8 are paste-and-commit; CC-5 / CC-6 are checklist-driven with cross-reference sweep as the one risk surface.

---

## Sequencing within sprint

Per prep §8.1 recommended sprint sequence. Wrong order produces broken references at intermediate states.

| Step | Close criterion | Why this order |
|---|---|---|
| 1 | CC-5 — xrsize4all repo standup | Repo must exist before migration target paths are valid. |
| 2 | CC-4 — Process amendments | Establishes the binding rules for everything else in the sprint. ADR template binding from 0d2 forward; CC-1 / CC-2 / CC-3 / CC-7 / CC-8 all author per the new template. |
| 3 | CC-6 — Migration to xrsize4all | Foundational; subsequent CCs cite migrated paths. Cross-reference sweep happens here. |
| 4 | CC-1 — Framework rename / AAF doc | Frame name binds before reference architecture; reference architecture inherits from AAF. |
| 5 | CC-2 — Reference architecture v0.1.0 release | Builds on AAF (CC-1) and on the migrated source-document-CM, security-controls-baseline. |
| 6 | CC-3 — Rolled-up architectural overviews | Builds on AAF + reference architecture + existing per-DoDAF-view docs. |
| 7 | CC-7 — New SD entries + chain-block backfill | Lands in migrated SD log (xrsize4all); references AAF, reference architecture, security baseline. |
| 8 | CC-8 — D-decision Strategic Implications amendments | Cites SD-013 / SD-014 / SD-015 / SD-016 (which must exist first) and the new ADR template. |

**Critical-path dependencies (per prep §8.3):**

```
CC-5 → CC-6 → CC-1 → CC-2 → CC-3
         ↓        ↓
        CC-4 ──→ CC-7 → CC-8
```

**Parallelization opportunities (per prep §8.2):**

- CC-7 and CC-8 are independent of each other once CC-1 through CC-3 have landed; they can run in parallel.
- CC-2 and CC-3 share substrate (DoDAF views, reference-architecture starter); they could be authored in parallel by different sessions / agents but the same human reviewer.
- CC-4 amendments are independent of each other and could be split into separate commits if Eric prefers smaller PRs (per Q9.2).

**Mid-sprint reset triggers (per prep §8.4):**

If any of these surface mid-sprint, pause and re-plan:

- AAF naming research surfaces a new displacement (e.g., another organization claims AAF acronym). Pause CC-1; re-evaluate naming candidates. Low probability per Sprint 0c1.5 naming research lock-in.
- Migration sweep (CC-6) surfaces broken references to docs not anticipated in prep §6.4. Pause CC-6; expand sweep scope; re-verify before originals removal.
- Reference architecture (CC-2) authoring surfaces structural gaps in the starter doc that warrant a re-pass on `xrsize4all-reference-architecture-starter_v0.1.0.md` first. Demote CC-2 from v0.1.0 release to v0.1.0-rc.1; ship release in Sprint 0d3.
- Eric's open-question answers below produce different SD numbering or different process-amendment binding date. Re-thread numbering through prep §2 and §3; impact small if caught at sprint open.

---

## What Sprint 0d2 does NOT do (scope-creep prevention, per prep §1.4 + §7.4)

- Does NOT close SD-004 (bindfs bypass install). Remains DEFERRED-TO-POST-SPRINT-0D2 per existing decision. Sprint 0d2's framework rename, reference architecture, and SD log expansion are PRECONDITIONS for SD-004 install; SD-004 install awaits a dedicated 0d3 / pre-0e micro-sprint.
- Does NOT author the formal STIG-format compensating-control doc for SD-004. Re-sequenced from Sprint 0d CC3b to post-Sprint-0d1 placement; Sprint 0d2 is precondition substrate, not the STIG doc itself.
- Does NOT build the document-cm skill. That's Sprint 0d. Sprint 0d2 produces preconditions (framework name, reference architecture, SD log, CM governance master-copy migration) that the document-cm skill operates against.
- Does NOT author SD-009 security controls baseline. That's Sprint 0d1.
- Does NOT stand up Phase 1 production hosting per SD-014. Phase 1 stand-up sequencing is Q9.7 — likely Sprint 0d1 or Sprint 0e per Eric's call.
- Does NOT exercise the four-environment topology per SD-015 beyond standing up dev environment. Test, prod, coop stand-up phases are Sprint 0e and beyond.
- Does NOT revise Lifting Tracker MVP timeline. None of D1-D27 require revision; all amendments are paragraph-scale additions.
- Does NOT touch existing SD-001 through SD-012 entries. Append-only per the strategic-decisions-log maintenance protocol.
- Does NOT change the four-tier content-class discipline (Architecture / Research / Operational / Reference). Sprint 0d2 honors the existing CLAUDE.md taxonomy.
- Does NOT revise schema, RBAC model, or AI Reasoner Duality core (D19 gets implementation-machinery additions per prep §3 but not principle revision).

---

## Decisions required at sprint open

These are the calls Eric needs to make at Sprint 0d2 sprint-open per prep §9. Each has a recommended default in the prep doc; each is reversible at low cost. Listed verbatim from prep §9; **NOT pre-empted in this kanban.** Eric ratifies or overrides at sprint-open commit.

### Q9.1 — SD numbering and ordering

SD-013 / SD-014 / SD-015 / SD-016 — confirm the assignments?

Prep default: SD-013 = retention principle (data-retention research); SD-014 = strategic hosting + storage architecture (merged from strategic-implications + data-storage research); SD-015 = environment topology (environment-strategy research); SD-016 = decision-history traceability (Sprint 0c1 retro). Reflects dependency order: principle → architecture → topology → discipline. Alternative: temporal order of original drafting.

**Eric's call.** Default OR explicit alternative. **Blocks CC-7 and CC-8.**

### Q9.2 — D-amendment merge mechanics

Prep §3 produces 15 amendment blocks. Should they paste into `lifting-tracker://docs/lift-track-architecture_v0.4.0.md` as a single PR with a single review pass, or D-by-D commits?

Prep default: Single commit, one PR, one review pass. Amendment blocks are independent; reviewer reads each once; no cross-block dependencies.

Trade-off: single commit = fast, complete picture; harder to revert individual amendments. D-by-D commits = granular revert; reviewer fatigue across 15 rounds.

**Eric's call.** Default OR D-by-D commits OR custom grouping (e.g., the four PROVISIONAL→DEFERRED amendments separate from the eleven PROVISIONAL→RESOLVED). **Affects CC-8 commit cadence.**

### Q9.3 — Repo standup timing within sprint

Prep §8.1 sequences CC-5 (repo standup) at step 1. Confirm that order, OR delay repo standup until after CC-1 / CC-2 / CC-3 are authored (they could land in reach4all temporarily and migrate after).

Prep default: CC-5 first per §8.1. Standup is a half-day; subsequent CCs land in xrsize4all directly. Cross-references clean.

**Eric's call.** Default OR delay (and accept double-authoring pain). **Affects sprint sequence.**

### Q9.4 — Process amendment binding date

Prep §4.1 ADR template binding text reads "From Sprint 0d2 forward." Confirm wording, OR specify a different binding date.

Prep default: Sprint 0d2 forward.

Alternatives: "from inception of this prep doc" (2026-04-30) — slightly earlier, captures any decisions made between this prep and Sprint 0d2 commit. "From next sprint after 0d2" — defers binding by one sprint.

**Eric's call.** Default OR explicit alternative. **Affects CC-4 amendment text + every Strategic Implications block authored after the binding date.**

**Sub-question on §11.7 / §11.8 / §11.9 numbering.** Per CC-4 sprint-open reconciliation flag: existing CONVENTIONS_v0.2.4 already uses §11.7 / §11.8 / §11.9 / §14.5 for unrelated content. The prep doc proposes new content for those numbers — collision must be resolved. Options: (a) renumber existing §11.7-§11.9 to §11.10-§11.12 to free the prep numbering; (b) push prep amendments to §11.10-§11.12 and keep existing numbering; (c) a third reorganization. §14.5 is additive (sub-pattern within existing §14.5), no collision.

### Q9.5 — Promotion of SD-013 / SD-014 / SD-015 to formal ADR

Per `strategic-decisions-log_v0.1.0.md` promotion criteria, SD-013 / SD-014 / SD-015 likely meet ADR criteria (affect schema, hosting architecture, environment topology). Promote at first amendment iteration, or stay as SD-format until a formal-amendment trigger fires?

Prep default: Stay as SD-format through Sprint 0d2 + Sprint 0e. Promote to ADR if/when sub-system #2 inherits any of them (forces formal versioning + governance), OR at first material amendment, OR at production-launch readiness gate.

**Eric's call.** Default OR promote at Sprint 0d2 commit OR custom trigger. **Affects CC-7 deliverable scope (SD-only vs. SD + ADR).**

### Q9.6 — D-decision amendments — D9 / D24 / D27 status reconciliation

Prep §3.6 (D9), §3.12 (D24), §3.13 (D27) are flagged DEFERRED in the amendment summary matrix (§3.16). Confirm DEFERRED is the right status, OR push them to RESOLVED with explicit deferral language baked in.

Prep default: DEFERRED. Each of D9 / D24 / D27 has open scope (Stripe adoption sprint; content-production scope; protocol adoption scope) where the strategic implications activate.

Trade-off: DEFERRED keeps status flag visible in amendment summary; quarterly review re-checks. RESOLVED with baked-in deferral language is cleaner status ledger but loses open-scope visibility.

**Eric's call.** Default OR alternative status framing. **Affects CC-8 status flags.**

### Q9.7 — Phase 1 hosting stand-up sprint placement

SD-014 implementation says "Sprint 0e: Phase 1 Hetzner stand-up live." Per `portfolio-strategic-implications-and-ownership-trajectory-research.md` open question 9, Phase 1 stand-up could land at Sprint 0d1 (alongside SD-009 security baseline) OR Sprint 0d2 (alongside SD-007 reference architecture) OR its own micro-sprint OR Sprint 0e.

Prep default: Sprint 0e per the SD-014 implementation ladder. Sprint 0d2 establishes the architectural decision (SD-014); Sprint 0d1 establishes the controls (SD-009); Sprint 0e operationalizes both.

**Eric's call.** Default OR earlier (0d1 / 0d2) OR own micro-sprint (0d3 / 0d.5). **Outside Sprint 0d2 scope unless Eric chooses 0d2 placement (would expand scope).**

### Q9.8 — Sprint 0d2 close-criteria count

Prep §7 proposes 8 close criteria. Sprint 0d had 9. Confirm 8, or expand / contract.

Prep default: 8.

Alternatives: 6 (compress CC-1 / CC-2 / CC-3 into one "Sprint 0d2 framework + reference + overview triple"); 10 (split CC-7 into per-SD commits, split CC-8 into per-D-decision commits).

**Eric's call.** Default OR alternative count.

### Q9.9 — Migration completion drill cadence

Per SD-014's restoration drill commitment, the Phase 1 → Phase 2 migration is exercised quarterly through Phase 1. Should the lifting-tracker → xrsize4all migration (CC-6) carry an analogous drill cadence?

Prep default: No. The lifting-tracker → xrsize4all migration is one-shot; once complete, originals are removed and rollback is git-history.

**Eric's call.** Default OR add quarterly drill.

### Q9.10 — reach4all role going forward

After Sprint 0d2 migration, reach4all retains research-class docs only. Should reach4all also serve as scratch / pre-decision space for portfolio-level architecture (i.e., "draft in reach4all, promote to xrsize4all when committed"), or should pre-decision portfolio-architecture work happen directly in xrsize4all from inception?

Prep default: Reach4all is research-only; portfolio-architecture work happens in xrsize4all from inception (drafts land at `<name>_v0.1.0-rc.1.md` and graduate to v0.1.0 release).

**Eric's call.** Default OR alternative pattern.

---

## Sprint 0d2 entry conditions (per prep §7.2)

- This kanban committed and Eric has reviewed it.
- Prep doc (`reach4all://docs/research/0d2-prep-amendments-and-sd-entries.md`) is committed and Eric has reviewed it.
- Sprint 0d1 (security controls baseline) is closed OR explicitly carved off; SD-009 home is established before Sprint 0d2 commits SD-013 / SD-014 cross-references to security controls.
- No active conflicting work that would block file migration (no in-flight commits to `reach4all://docs/architecture/strategic-decisions-log_v0.1.0.md` or `lifting-tracker://docs/lift-track-architecture_v0.4.0.md` outside Sprint 0d2 scope).
- Eric has answered Q9.1 (SD numbering) and Q9.4 (process-amendment binding date) — both block sprint commit.

---

## Sprint 0d2 exit conditions (per prep §7.3)

- All 8 close criteria above marked DONE.
- xrsize4all repo is master for portfolio-level architecture; reach4all remains master for research-class docs.
- Strategic Implications discipline binding from 0d2 forward (per Q9.4 wording).
- Decision-history traceability discipline binding from 0d2 forward (per Q9.4 wording).
- AAF (Agentic Architecture Framework) is the new official name; "DoDAF" references in active artifacts are reframed as "DoDAF view set within AAF."
- Reference architecture is v0.1.0 released and is the inheritance source for sub-system #2 onboarding when that occurs.

---

## Open-items migration from Sprint 0d / Sprint 0d1

Per §14.2 inheritance rule. **To be populated at actual sprint open from Sprint 0d / Sprint 0d1's close kanbans.** At draft time, neither has closed; this section is a placeholder.

| Item | Source | Disposition |
|---|---|---|
| (Placeholder. Populate at 0d2 sprint-open commit by reviewing frozen Sprint 0d / Sprint 0d1 kanbans.) | — | — |

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| (Empty at sprint open. Items added as work begins.) | — | — | — |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| (Empty at sprint open. Q9.1-Q9.10 should be resolved at sprint open commit, not held in review queue.) | — | — |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Done — Sprint 0d2

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

- **Input substrate (two parallel prep deliverables):**
  - `reach4all://docs/research/0d2-prep-amendments-and-sd-entries.md` (1,775 lines, 2026-04-30) — feeds CC-1 / CC-3 / CC-4 / CC-5 / CC-6 / CC-7 / CC-8.
  - `reach4all://docs/architecture/xrsize4all-reference-architecture-starter_v0.1.0.md` (2,007 lines, 2026-04-29) — feeds CC-2 (the starter IS the substrate; CC-2 sub-criteria 2.1-2.6 enumerate the operational steps).
- **Source research feeding the prep doc** (per prep §10.1):
  - `reach4all://docs/research/portfolio-strategic-implications-and-ownership-trajectory-research.md`
  - `reach4all://docs/research/data-retention-policy-research.md`
  - `reach4all://docs/research/data-storage-and-archiving-strategy-research.md`
  - `reach4all://docs/research/environment-strategy-and-promotion-demotion-architecture-research.md`
- **Prior sprint kanbans:** `docs/lift-track-kanban-sprint-0d.md` (document-cm skill build); `docs/lift-track-kanban-sprint-0d1.md` (security controls baseline — TBD if drafted).
- **Sprint 0d2 retrospective at close:** `docs/retrospectives/lift-track-sprint-retro-0d2.md`.
- **Sprint 0e (next sprint, opens at 0d2 close):** pre-drafted in `docs/lift-track-kanban-sprint-0e.md`.
- **Methodology:** `docs/CONVENTIONS_v0.2.4.md` §14 (and any v0.2.5 amendments landing in CC-4).
- **Architecture decisions referenced in CC-8:** `docs/lift-track-architecture_v0.4.0.md` D3 / D4 / D5 / D6 / D8 / D9 / D11 / D19 / D20 / D22 / D23 / D24 / D27 + Hosting Posture + Observability cross-cutting.
- **SD log:** currently `reach4all://docs/architecture/strategic-decisions-log_v0.1.0.md`; migrates to `xrsize4all://docs/architecture/strategic-decisions-log_v0.2.0.md` in CC-6 + CC-7.
- **Naming research lock-in:** `reach4all://docs/research/ai-architecture-framework-naming-research.md` (AAF over AIAF).

---

© 2026 Eric Riutort. All rights reserved.
