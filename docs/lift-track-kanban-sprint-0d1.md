---
author: Eric Riutort
created: 2026-04-30
updated: 2026-04-30
tier: OPERATIONAL
content_class: operational
sprint: 0d1
sprint_name: Security Controls Baseline integration
sprint_dates: TBD → TBD
sprint_open_date: TBD
duration_days: TBD
status: drafted
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0d1)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0d1's per-sprint kanban. **Drafted ahead of sprint open from the prep deliverable** at `reach4all://docs/architecture/security-controls-baseline_v0.1.0.md` (the baseline itself, drafted 2026-04-29 per SD-009, status: accepted at v0.1.0). Finalized at the actual sprint-open commit when Sprint 0d closes (or earlier if 0d1 opens parallel to 0d per OQ10 below). Frozen at sprint close as the immutable record.

## Sprint 0d1 — Security Controls Baseline Integration

**Theme:** Per SD-009. The portfolio-level Security Controls Baseline v0.1.0 is authored and accepted as of 2026-04-29 — it catalogs 16 frameworks (NIST 800-53 r5, CSF 2.0, 800-128, SSDF, ISO 27001:2022 / 27034 / 25010, MITRE ATT&CK / CWE / CAPEC / D3FEND, OWASP ASVS / DSOMM / LLM Top 10, CIS v8, DISA STIG) with explicit ADOPTED / PARTIAL / DECLINED / N/A posture per applicable control, Concept Computing inheritance for CC-013/14/15/16/17, and the compensating-control register (DEV-001 bindfs reaper, DEV-002 GIT_OPTIONAL_LOCKS env var). Sprint 0d1 is the **integration sprint**: it does NOT re-author the baseline; it lands the baseline as binding governance reference across the portfolio. Per baseline §1.3: every D-decision touching security posture cites the controls it satisfies / partially satisfies / deviates from; every existing deviation (SD-004) is hardened with explicit controls-in-tension citation; every new sub-system architecture spec inherits the baseline and surfaces posture amendments. Sprint 0d1 also lands the cheap-and-high-value pre-commit gitleaks + GitHub Push Protection install (per baseline §4.3 implementation notes) as a CC-015 supply-chain quick win that should land before the SBOM workstream.

**Dates:** TBD → TBD (estimated 3-5 days under solo+AI per the integration scope below; CC-1 §10 open-questions resolution is the long pole — 10 sub-questions each with strategic-decision weight; CC-2 / CC-3 / CC-7 are paste-and-cross-reference; CC-4 / CC-5 / CC-8 are checklist-driven; CC-6 is install-and-verify with low risk).

**Goal:** The Security Controls Baseline v0.1.0 is portfolio-binding governance reference. Every architectural decision touching security posture cites the baseline. SD-004's DEV-001 / DEV-002 entries are hardened with explicit controls-in-tension. Lifting Tracker's production-readiness gate matrix (baseline §3.16a.A) is operationalized as a tracking artifact in `~/lifting-tracker/docs/`. Quarterly review cadence per baseline §6.2 is operationalized (first review scheduled). Pre-commit gitleaks + GitHub Push Protection installed across three sibling repos. Architectural-change reflection mechanism (Security Implications sub-block in every new ADR / SD / sub-system spec) binding from Sprint 0d1 forward — coordinated with Sprint 0d2 CC-4 §4.1 ADR template Strategic Implications section so both bind from the same date and ride the same ADR template.

**Input substrate:** `reach4all://docs/architecture/security-controls-baseline_v0.1.0.md` (2,658 lines, drafted 2026-04-29, status: accepted at v0.1.0, authored Sprint 0d1 per SD-009 commitment per baseline §12 v0.1.0 entry). Path will migrate to `xrsize4all://docs/architecture/security-controls-baseline_v0.1.0.md` per Sprint 0d2 CC-6 — see OQ2 below for the timing call. Every CC below maps to one or more sections of the baseline; integration is mechanical for CC-2 / CC-3 / CC-7 / CC-8 and strategic for CC-1.

---

## Close criteria (8 items)

Each CC carries effort estimate, risk class, entry condition (the prior CC in the §8.1 sequencing block below), and exit condition.

### CC-1 — §10 open questions resolution

**Deliverable.** Each of baseline §10.1 through §10.10 is either ANSWERED (Eric's strategic call recorded) or FORMALLY DEFERRED (explicit trigger condition + re-evaluation date named, replacing the implicit "Eric's call needed" in the current baseline). Resolution lands as an SD-009 amendment block in `strategic-decisions-log_v0.1.0.md` (or the migrated v0.2.0 if Sprint 0d2 opens parallel and CC-7 lands first — see OQ2). Each answer / deferral updates the corresponding §10.X entry in the baseline doc itself; baseline version bumps to v0.1.1 (PATCH per §1.7c) since these are clarifications of authored content rather than new control entries.

**Maps to.** Baseline §10.1 (compliance certification posture), §10.2 (HIPAA defensive posture vs explicit non-applicability), §10.3 (SBOM workstream sequencing), §10.4 (Concept inheritance promotion triggers for CC-013/14/15), §10.5 (declined-controls rationale codification cycle), §10.6 (framework prioritization order if conflicts), §10.7 (production-readiness gate binary vs continuous), §10.8 (risk register vs deviation register reconciliation), §10.9 (reviewer rotation / external review triggers), §10.10 (baseline scope-creep posture — portfolio-level vs sub-system-detail).

**Effort.** 1-2 days. The long pole. Each question has a recommended default in the baseline doc; Eric ratifies or overrides per question.

**Risk.** Medium. §10.1 (certification posture) + §10.2 (HIPAA) shape posture for next 12-24 months — wrong call here generates retrofit cost. §10.3 (SBOM timing) blocks CC-015 Phase 2 sequencing. §10.6 (framework priority order) is the foundation for every future framework-conflict resolution. Recommended approach: time-box per question (~1h each); take the baseline's recommended default unless Eric has explicit deviating intent.

**Entry.** None (foundational; CC-1 unblocks baseline-amendment authoring and CC-3 / CC-4 / CC-7 cross-references).

**Exit.** All 10 sub-items resolved (ANSWER or FORMAL DEFERRAL); SD-009 amendment block committed; baseline §10 entries updated to reflect resolution; baseline v0.1.1 PATCH released; cross-references from CC-2 through CC-8 resolve to the resolved §10 state.

### CC-2 — D-decision Security Implications integration

**Deliverable.** Each architecture-class D-decision in `lift-track-architecture_v0.4.0.md` that touches security posture gets a **Security Implications** sub-block per baseline §1.3 framing. The block names the controls satisfied / partially satisfied / deviated from per the relevant framework families (NIST 800-53 r5 by control ID, CSF 2.0 by sub-category, ISO 27001:2022 by Annex A reference, ASVS by V-section, CIS v8 by control number). Coordinates with Sprint 0d2 CC-8 (D-decision Strategic Implications amendments) so a single D-amendment commit can carry both Strategic Implications + Security Implications blocks if Eric chooses parallel sprint open (OQ10).

**Maps to.** Baseline §1.3 (authorship of new architecture artifacts; Strategic Implications block + Security Implications sub-block), §3 (per-framework control catalog), §3.17 (cross-framework alignment matrix for cluster citations).

**D-decisions in scope (sprint-open determined per OQ8).** Recommended default scope: D5 RBAC (AC-3 / AC-6 / IA-2(1) / A.5.15 / V4); D6 magic-link auth (IA-2 / IA-5 / A.5.16 / A.8.5 / V2 / V3.6 federated re-auth deferred per CC-013 inheritance); D11 AI ingestion (LLM01 prompt injection, LLM02 sensitive disclosure, LLM06 excessive agency); D19 Reasoner Duality (LLM06 + AC-3 + AU-2 + IR-4 + Concept CC-016 EXTEND posture); D22 sensitivity defaults (PT-7 sensitive PII categories + A.5.34 + data-retention research cross-reference); D23 sync/offline (SC-8 transmission + SC-28 at-rest + iOS Keychain + FileVault inheritance). D14 / D15 (per-implement weight + limb config) are non-security; D17 (set grouping) is non-security; D2 / D4 / D12 / D16 are scope-and-schema, indirectly relevant via D22.

**Effort.** 0.5 day paste-and-cross-reference (baseline §3 has the control text already; integration is naming the controls against each D, not authoring new posture).

**Risk.** Low — drop-in patterning per baseline §1.3.

**Entry.** CC-1 done (baseline §10 resolved; framework priority order per §10.6 binds the citation order).

**Exit.** Each in-scope D-decision carries a Security Implications sub-block; cross-references to baseline §3 entries resolve; baseline §3 implementation-site index (§8.2) updated to cite each D-decision back.

### CC-3 — DEV-001 / DEV-002 hardening + SD-004 baseline cross-reference

**Deliverable.** SD-004 entry in `strategic-decisions-log_v0.1.0.md` is amended with an explicit **Controls in tension** block citing baseline §5.1 (DEV-001) and §5.2 (DEV-002), which in turn name the in-tension controls per §3.17 alignment matrix (NIST CM-3, CM-6, CM-7, AC-3, AU-2, AU-3, RA-3, CA-7; ISO A.5.36, A.8.9, A.8.32; CIS 4, CIS 8; STIG GPOS-SRG; ASVS V14; LLM06). DEV-001 / DEV-002 entries in baseline §5 are cross-referenced back to SD-004 with explicit residual-risk + re-evaluation-trigger blocks. Closes the bindfs research v3 §10 finding "the bypass needs accompanying documentation to graduate from ad-hoc to documented compensating-control configuration."

**Maps to.** Baseline §5.1 (DEV-001 bindfs delete-gate bypass), §5.2 (DEV-002 GIT_OPTIONAL_LOCKS env var), §5.4 (compensating-control authoring template), §3.17 (alignment matrix highest-leverage actions), bindfs research v3 §10.7 (formal change-record / risk-acceptance ADR action).

**Effort.** 0.5 day. Drop-in text from baseline §5; SD-004 amendment is paste-and-cite.

**Risk.** Low. STIG-format compensating-control doc itself is **NOT in scope for Sprint 0d1** — per existing Sprint 0d kanban CC3b deferral, the formal STIG doc re-sequences to post-Sprint-0d1 placement (see OQ4 for confirmation). CC-3 here is the prerequisite: SD-004 cites the baseline; the future STIG cites SD-004 + the baseline.

**Entry.** CC-1 done (baseline v0.1.1 PATCH released; §10.8 risk-register-vs-deviation-register reconciliation pattern resolved).

**Exit.** SD-004 carries Controls in tension block; DEV-001 + DEV-002 entries in baseline §5 reflect SD-004 cross-reference; bindfs research v3 §10 finding closure citation lands in SD-004; lift-track-risks_v0.1.0.md R-TV-* entries that interact with deviations get cross-references per §10.8 default (separate-but-cross-referenced).

### CC-4 — Lifting Tracker production-readiness gate matrix tracker

**Deliverable.** Baseline §3.16a.A (Lifting Tracker production-readiness control set, 31 control rows) is operationalized as a tracking artifact at `lifting-tracker://docs/lift-track-production-readiness-controls_v0.1.0.md`. Each control's **Status required at gate / Current posture / Closure plan / sprint placement** carries forward; closure-plan column is updated as work lands across Sprints 0d1 / 0d2 / 0e / pre-launch QA sprint. Acts as the operator's gate-evaluation checklist when Lifting Tracker approaches D7 alpha → public.

**Maps to.** Baseline §3.16a.A (Lifting Tracker production-readiness control set), §3.16a.B (controls deferred to post-launch), §6.9 (production-readiness gate review cadence).

**Effort.** 0.5 day — paste-and-format from baseline §3.16a; add tracking columns (sprint placement, owner, status-since date).

**Risk.** Low — pure derivative artifact; no new content authored.

**Entry.** CC-1 done (§10.7 production-readiness gate binary vs continuous resolved; tracker frequency follows that resolution).

**Exit.** Tracker artifact committed at lifting-tracker path; cross-referenced from `lift-track-roadmap_v0.4.0.md` Sprint pre-launch entry; cross-referenced from `lift-track-architecture_v0.4.0.md` non-decisions list (production-readiness handled by tracker, not by architecture doc); first sweep populates current-posture column from baseline §3.16a.A as of 2026-04-29 baseline version.

### CC-5 — Quarterly review cadence operationalization

**Deliverable.** First quarterly comprehensive review per baseline §6.2 is scheduled. Calendar entry / cron task / scheduled-task lands at the operator-chosen cadence (per OQ5 — 90 days from baseline v0.1.0 publish = 2026-07-29 is the §6.2 default first review). Review checklist per §6.2 (each framework version status check; each control posture status check; each deviation re-evaluation trigger check; declined-controls rationale audit per §10.5; risk register vs deviation register reconciliation per §10.8) is captured as a checklist artifact at `lifting-tracker://docs/lift-track-baseline-review-checklist_v0.1.0.md` OR (preferred) at the eventual `xrsize4all://` path post-Sprint-0d2 migration.

**Maps to.** Baseline §6.1 (cadence summary), §6.2 (quarterly comprehensive review), §10.5 (declined-controls rationale audit cycle).

**Effort.** 0.25 day — checklist authoring + scheduled-task creation.

**Risk.** Low — checklist is derivative from baseline §6.2.

**Entry.** CC-1 done (§10.5 declined-controls rationale audit cadence resolved; §10.7 production-readiness gate frequency resolved).

**Exit.** Review checklist artifact committed; first review scheduled (calendar / cron / scheduled-task entry); §6.2 cadence operationalized (not just authored).

### CC-6 — Pre-commit gitleaks + GitHub Push Protection install

**Deliverable.** Pre-commit gitleaks installed in the three sibling repos (lifting-tracker, reach4all, concept-computing) per baseline §4.3 implementation notes. GitHub Push Protection enabled at the Eric-account level + per-repo enforcement enabled. Closes CWE-798 (hardcoded credentials) + LLM02 (sensitive information disclosure) mitigations per baseline §3.9 + §3.14. Per baseline §4.3: "Pre-commit gitleaks + GitHub Push Protection are cheap (1-2h per failure-modes §7.2) and unblock CWE-798 / LLM02 mitigations. Should be adopted before formal SBOM workstream."

**Maps to.** Baseline §4.3 (CC-015 Supply Chain Integrity, ADAPT posture; Phase 1 partial → Phase 2 forward), §3.9 (CWE-798), §3.14 (LLM02), failure-modes research v2 §7.2 (gitleaks + Push Protection cheap-and-high-value row).

**Effort.** 0.25-0.5 day per OQ7 — staging call (all three repos in CC-6, or lifting-tracker first + reach4all/concept-computing follow-on micro-task).

**Risk.** Low — well-trodden install path; pre-commit framework + gitleaks GitHub Action published; rollback is uninstall.

**Entry.** None (independent of CC-1 through CC-5; could parallelize).

**Exit.** Pre-commit gitleaks installed in lifting-tracker (and per OQ7 in reach4all + concept-computing); Push Protection enabled at account level + per-repo; CWE-798 + LLM02 implementation-site entries in baseline §8.2 updated with the new install paths; commit-time secret-scanning is now baseline behavior.

### CC-7 — Architectural-change reflection mechanism

**Deliverable.** Every new ADR / SD / sub-system architecture spec authored from Sprint 0d1 forward carries a **Security Implications** sub-block (within the broader Strategic Implications section per Sprint 0d2 CC-4 §4.1 ADR template work). Bind date: Sprint 0d1 close per OQ3 default. The Security Implications sub-block names: (a) controls satisfied / partially satisfied / declined / N/A per applicable framework families; (b) deviations introduced or closed; (c) sub-system applicability per baseline §3.16a inheritance pattern; (d) Concept Computing CC-* inheritance posture if applicable. Coordinated with Sprint 0d2 CC-4 (process amendments — ADR template) so the ADR template at `xrsize4all://docs/reference/adr-template_v0.1.0.md` carries BOTH Strategic Implications AND Security Implications as a single template, not two competing templates.

**Maps to.** Baseline §1.3 (authorship of new architecture artifacts), §6.6 (architectural-change reflection cadence trigger), §6.5 (sub-system onboarding inherits baseline + surfaces amendments).

**Effort.** 0.5 day — bind-date statement authoring + coordination commit with Sprint 0d2 CC-4. If Sprint 0d1 closes before Sprint 0d2 opens, CC-7 publishes the Security Implications mechanism as a standalone bind statement in CONVENTIONS_v0.2.4.md (or v0.2.5 if Sprint 0d2's CONVENTIONS amendments land first); the ADR template work in Sprint 0d2 CC-4 picks up the Security Implications block as input.

**Risk.** Low — coordination risk only. Mitigation: explicit cross-reference between Sprint 0d1 CC-7 and Sprint 0d2 CC-4 §4.1 deliverable pointing to the same bind date and the same ADR template.

**Entry.** CC-1 done (§10.6 framework priority order binds the Security Implications citation order); CC-2 / CC-3 done (Security Implications block pattern is exemplified in existing artifacts before being made binding).

**Exit.** Bind-date statement committed (CONVENTIONS amendment OR standalone document); Sprint 0d2 CC-4 §4.1 ADR template work has Security Implications block as input; from sprint-close date forward, every new architecture artifact carries the block; existing artifacts are NOT retroactively amended (those are CC-2 / CC-3 + future sweep work).

### CC-8 — lift-track-risks ↔ baseline §5 cross-reference integration

**Deliverable.** Each R-TV-* vendor-watch entry in `lifting-tracker://lift-track-risks_v0.1.0.md` (renamed to its current path per Sprint 0c1.5 work) that interacts with a baseline §5 deviation gets a cross-reference. Each baseline §5 deviation that is vendor-driven gets a cross-reference back to the relevant R-TV-* entry. Implements the §10.8 separate-but-cross-referenced default. Quarterly review (CC-5) reconciles. Per baseline §10.8: "lift-track-risks tracks vendor relicense / sunset / external risks; §5 tracks deviations (internal compensating-controls). Some events fit both."

**Maps to.** Baseline §10.8 (risk register vs deviation register reconciliation), §11.9 portfolio cross-references entry for lift-track-risks, §6.2 (quarterly review reconciles).

**Effort.** 0.25 day — cross-reference sweep is small (single-digit R-TV-* entries + 2 §5 deviations as of v0.1.0 baseline).

**Risk.** Low.

**Entry.** CC-1 done (§10.8 reconciliation pattern resolved — separate-but-cross-referenced is the baseline default).

**Exit.** Cross-references resolve in both directions; quarterly review checklist (CC-5) carries a "reconcile R-TV-* ↔ §5" line item.

---

## Total effort estimate

3-5 days under solo+AI. CC-1 is the long pole (10 strategic-decision sub-items); CC-2 / CC-3 / CC-7 are paste-and-cross-reference; CC-4 / CC-5 / CC-8 are checklist-driven derivative artifacts; CC-6 is install-and-verify. No authoring of new posture content — Sprint 0d1 is the integration sprint, not an authoring sprint.

---

## Sequencing within sprint

Wrong order produces broken cross-references at intermediate states.

| Step | Close criterion | Why this order |
|---|---|---|
| 1 | CC-1 — §10 open questions resolution | Foundational. Resolves the parameters that CC-2 / CC-3 / CC-4 / CC-5 / CC-7 cite (framework priority order, gate frequency, audit cycle, reconciliation pattern, scope-creep posture). |
| 2 | CC-6 — Pre-commit gitleaks + Push Protection | Independent of CC-1; can start day 1. Install-and-verify; quick win. |
| 3 | CC-2 — D-decision Security Implications integration | Cites resolved framework priority order from CC-1; exemplifies the Security Implications block pattern that CC-7 will make binding. |
| 4 | CC-3 — DEV-001 / DEV-002 hardening + SD-004 cross-reference | Cites resolved §10.8 reconciliation pattern from CC-1; second exemplification of Security Implications-style cross-citation. |
| 5 | CC-4 — Lifting Tracker production-readiness gate matrix tracker | Cites resolved §10.7 gate frequency from CC-1. |
| 6 | CC-5 — Quarterly review cadence operationalization | Cites resolved §10.5 audit cycle + §10.7 gate frequency from CC-1. First-review schedule lands. |
| 7 | CC-7 — Architectural-change reflection mechanism | Binds the Security Implications block discipline from sprint close forward; CC-2 + CC-3 are the in-sprint exemplars. |
| 8 | CC-8 — lift-track-risks ↔ baseline §5 cross-reference | Tail. Cross-reference sweep; no dependencies beyond CC-1 §10.8 resolution. |

**Critical-path dependencies:**

```
CC-1 ──┬──→ CC-2 ──┐
       ├──→ CC-3 ──┼──→ CC-7
       ├──→ CC-4   │
       ├──→ CC-5 ──┘
       └──→ CC-8
CC-6 (independent; parallel)
```

**Parallelization opportunities:**

- CC-6 (gitleaks install) is independent of all other CCs and can run in parallel from sprint open.
- CC-2 + CC-3 + CC-4 + CC-5 + CC-8 are independent of each other once CC-1 resolves; they can run in parallel by different sessions / agents.
- CC-7 must follow CC-2 + CC-3 (those are the in-sprint exemplars).

**Mid-sprint reset triggers:**

If any of these surface mid-sprint, pause and re-plan:

- CC-1 §10.6 (framework priority order) lands in a way that contradicts existing posture in baseline §3 — pause CC-2 / CC-3 / CC-7; reconcile §3 posture against new priority order; baseline may need MAJOR version bump (per §1.7c, framework prioritization change is major-scale).
- CC-1 §10.2 (HIPAA defensive posture) lands as DEFENSIVE — Sprint 0d1 scope expands to include initial HIPAA-defensive posture amendments per the ~10-20% extra cost framing in baseline §10.2; consider re-scoping CC-2 to capture HIPAA-relevant D-decision amendments.
- CC-6 gitleaks install surfaces existing committed secrets in any of the three repos — pause install rollout; rotate exposed credentials; clean git history (filter-repo or BFG); only then complete install. Per failure-modes research §7 incident playbook.
- Sprint 0d2 opens parallel and CC-7 ↔ Sprint 0d2 CC-4 §4.1 coordination produces conflicting bind dates or template structures — pause CC-7; reconcile with 0d2 owner; single ADR template carrying both Strategic + Security Implications is the recommended outcome (per OQ3).
- §10.5 declined-controls rationale audit (initiated as CC-5 line item) surfaces declined controls without explicit rationale — those declines are surfaced in the sprint as ad-hoc CCs to author rationale; if the count is large (>10), consider deferring to Sprint 0d2 or 0e and noting in retro.

---

## What Sprint 0d1 does NOT do (scope-creep prevention)

- Does NOT re-author the Security Controls Baseline. The baseline is authored at v0.1.0 status: accepted as of 2026-04-29; Sprint 0d1 is the integration sprint, not the authoring sprint. CC-1 produces a v0.1.1 PATCH (§10 resolution clarifications); v0.2.0 lands at first quarterly review (per §6.2) or sooner per §6 ad-hoc trigger types.
- Does NOT migrate the baseline to the eventual `~/xrsize4all/` repo. Per OQ2 default, the baseline stays at `reach4all://docs/architecture/security-controls-baseline_v0.1.0.md` through Sprint 0d1 close; migration happens in Sprint 0d2 CC-6. Eric can override at sprint open if he wants the migration to land in 0d1.
- Does NOT author the formal STIG-format compensating-control doc for SD-004. Per existing Sprint 0d kanban CC3b deferral, the formal STIG re-sequences to post-Sprint-0d1 placement (likely post-0d2 micro-sprint or its own sprint) so it cites the formal baseline + the SD-004 amendment from CC-3 here. Sprint 0d1 CC-3 lands the prerequisites; the STIG itself is post-0d1 work.
- Does NOT install the bindfs Layer 2 reaper. Per SD-004 status (DEFERRED-TO-POST-SPRINT-0D2), the install awaits the framework rename (SD-006 / Sprint 0d2), reference architecture (SD-007 / Sprint 0d2), and rolled-up overview (SD-008 / Sprint 0d2). Sprint 0d1 lands the controls baseline that the future install will cite.
- Does NOT exercise the §6.9 production-readiness gate against Lifting Tracker. The tracker artifact (CC-4) is operational scaffolding; gate exercise is pre-launch QA sprint, not Sprint 0d1.
- Does NOT pursue compliance certification. §10.1 resolution names trigger conditions; certification pursuit itself is a future strategic call when triggers fire.
- Does NOT author SBOM tooling. §10.3 resolution names the timing trigger (recommended: Lifting Tracker first-public-deploy); SBOM workstream is post-0d1.
- Does NOT promote any Concept Computing inheritance from ADAPT to FULL ADOPT. §10.4 resolution names triggers; promotion itself is event-driven.
- Does NOT reorganize §3 framework selection. Adding or removing a framework would be a MAJOR baseline version bump per §1.7c — not Sprint 0d1 work.
- Does NOT touch existing SD-001 through SD-012 entries except SD-004 (CC-3). Append-only per the strategic-decisions-log maintenance protocol; SD-009 amendment block (CC-1) is appended, not modified.
- Does NOT exercise external review (per §10.9 default — defer to trigger conditions).
- Does NOT expand baseline scope to per-sub-system detail (per §10.10 default — stay portfolio-level).

---

## Decisions required at sprint open

These are the calls Eric needs to make at Sprint 0d1 sprint-open. Each has a recommended default; each is reversible at low cost. **NOT pre-empted in this kanban.** Eric ratifies or overrides at sprint-open commit.

### OQ1 — Sprint 0d1 close-criteria count

This kanban proposes 8 close criteria. Sprint 0d had 7+1 sub-item; Sprint 0d2 has 8.

**Default.** 8.

**Alternatives.** 6 (compress CC-2 / CC-3 / CC-7 into one Security Implications integration block; compress CC-4 / CC-5 / CC-8 into one quarterly-review-readiness block); 10 (split CC-1 into per-question commits — 10 sub-items, 10 commits).

**Eric's call.** Default OR alternative count.

### OQ2 — Baseline migration timing

Baseline currently lives at `reach4all://docs/architecture/security-controls-baseline_v0.1.0.md`. Per Sprint 0d2 CC-6, all portfolio-level architecture migrates to `~/xrsize4all/`. Should the baseline migrate in Sprint 0d1 (parallel to 0d2 CC-5 repo standup OR pre-0d2-open) OR wait for 0d2 CC-6's bulk migration?

**Default.** Wait for 0d2 CC-6. Sprint 0d1 cross-references use `reach4all://...` paths; Sprint 0d2 CC-6 sweeps these to `xrsize4all://...` along with all other migrated paths. Single migration event; cleaner cross-reference sweep.

**Alternative.** Migrate baseline in 0d1 parallel to 0d2 CC-5 (xrsize4all repo standup must precede; coordination required). Risk: cross-reference debt if 0d2 CC-6 misses the already-migrated baseline.

**Eric's call.** Default OR migrate-in-0d1. **Affects all CC paths in this kanban + coordination with 0d2 owner.**

### OQ3 — CC-7 ↔ Sprint 0d2 CC-4 §4.1 binding-date coordination

Sprint 0d2 CC-4 §4.1 lands the ADR template Strategic Implications section binding "from Sprint 0d2 forward" (per 0d2 prep §4.1, with Q9.4 sub-question allowing earlier binding). CC-7 here lands the Security Implications block binding. Should both bind from the SAME date (whichever sprint closes second), or independently?

**Default.** Both bind from the same date. Sprint 0d1's CC-7 publishes the Security Implications block discipline; Sprint 0d2's CC-4 §4.1 carries the unified ADR template (Strategic + Security Implications); the ADR template is the binding artifact and its publish date is the bind date. If Sprint 0d1 closes first, CC-7 publishes a placeholder bind ("from ADR template publish forward") and Sprint 0d2 CC-4 §4.1 lands the actual date. If Sprint 0d2 closes first, CC-7 cites the Sprint 0d2 ADR template publish date.

**Alternative.** Independent bind dates — Security Implications binds at 0d1 close, Strategic Implications binds at 0d2 close. Risk: ADR template authored after both bind dates contains both blocks, but artifacts authored between 0d1 close and 0d2 close carry only Security Implications.

**Eric's call.** Default OR independent. **Coordinates with Sprint 0d2 Q9.4.**

### OQ4 — STIG-format compensating-control doc placement

Per existing Sprint 0d kanban CC3b deferral, the formal STIG-format doc for SD-004 / DEV-001 re-sequences to "post-Sprint-0d1 placement (sprint TBD when 0d1 closes — likely 0d2 CC or its own micro-sprint between 0d1 and 0d2)." Confirm post-0d1 deferral, OR pull into Sprint 0d1 (would expand scope by ~0.5-1 day).

**Default.** Post-0d1 deferral. Sprint 0d1 CC-3 lands the prerequisites (SD-004 cross-references baseline §5; DEV-001 entry hardened); the STIG itself is its own sprint or 0d2 CC.

**Alternative.** Pull into Sprint 0d1 as CC-9. Argument: the STIG cites baseline §5 + SD-004; both are 0d1 deliverables; co-locating the STIG authoring with its inputs reduces cross-sprint context-switching.

**Eric's call.** Default OR pull-into-0d1. **Affects sprint capacity + Sprint 0d2 CC scope.**

### OQ5 — §10 resolution scope (CC-1)

CC-1 proposes resolving all 10 §10 questions. Should all 10 land in Sprint 0d1, or split (e.g., 10.1/10.2/10.3 high-leverage land in 0d1; 10.4-10.10 defer to first quarterly review)?

**Default.** All 10. Each question has a recommended default in the baseline; ratification is light-touch. Splitting creates re-context-switching cost across sprints.

**Alternative.** Subset (3-5 high-leverage questions; the rest go to first quarterly review per §6.2). Argument: §10.1 (certification) + §10.2 (HIPAA) + §10.3 (SBOM) shape near-term posture; §10.5 + §10.7 + §10.10 are review-cadence-relevant and naturally land at first review.

**Eric's call.** Default OR subset (which subset?).

### OQ6 — Phase 1 hosting stand-up sprint placement (cross-references 0d2 Q9.7)

Per Sprint 0d2 Q9.7 + portfolio-strategic-implications research open question 9, Phase 1 Hetzner stand-up (SD-014) could land at Sprint 0d1, 0d2, own micro-sprint, or 0e. The 0d2 prep default is 0e. Confirm 0e, OR pull into 0d1 (alongside the security baseline integration — controls and hosting land together).

**Default.** 0e per 0d2 prep. Sprint 0d1 establishes the controls (SD-009); Sprint 0d2 establishes the architectural decision (SD-014); Sprint 0e operationalizes both.

**Alternative.** Pull into 0d1. Argument: hosting stand-up needs the controls baseline as gate-input; co-locating reduces hand-off friction. Counter-argument: 0d1 is already integration-heavy; expanding scope risks under-delivery.

**Eric's call.** Default OR alternative placement. **Affects Sprint 0d1 scope + Sprint 0e contents.**

### OQ7 — Pre-commit gitleaks + Push Protection rollout scope (CC-6)

CC-6 proposes installing across all three sibling repos (lifting-tracker, reach4all, concept-computing). Should all three land in Sprint 0d1, or staged (lifting-tracker first; reach4all + concept-computing follow as a 0d2 / 0e micro-task)?

**Default.** All three. Install path is well-trodden; per-repo cost is ~30 min including verification. Staging adds re-context-switching cost.

**Alternative.** Lifting-tracker only in 0d1; reach4all + concept-computing follow. Argument: lifting-tracker is the production-bound repo (athlete data → Apple TestFlight → App Store); reach4all + concept-computing are research/architecture repos with no athlete data; risk is asymmetric.

**Eric's call.** Default OR staged.

### OQ8 — D-decision Security Implications scope (CC-2)

CC-2 proposes 6 D-decisions get the block (D5 / D6 / D11 / D19 / D22 / D23). Should the full sweep cover ALL D-decisions (including non-security ones marked "N/A — non-security") for completeness, OR only the in-scope 6?

**Default.** 6 in-scope. Non-security D-decisions (D14 / D15 / D17 / etc.) get nothing — the absence is the signal. Adding "N/A — non-security" blocks across all 24+ D-decisions adds visual noise without governance value.

**Alternative.** Full sweep. Every D-decision carries the block; non-security ones declare "N/A" explicitly. Argument: explicit-over-implicit per Eric's risk-acceptance discipline (per SD-004 framing).

**Eric's call.** Default OR full sweep. **Affects CC-2 effort estimate (0.5 day → 1 day for full sweep).**

### OQ9 — Sprint 0d1 dates + duration estimate confirmation

Estimated 3-5 days under solo+AI. Sprint open date depends on Sprint 0d close (or parallel-open per OQ10). Confirm 3-5 day estimate, or amend.

**Default.** 3-5 days. CC-1 is the long pole (1-2 days); CC-2 / CC-3 / CC-4 / CC-5 / CC-7 / CC-8 are 0.25-0.5 day each; CC-6 is 0.25-0.5 day depending on OQ7 staging.

**Alternative.** Tighter estimate if subset OQ5 default is taken (would shave 0.5-1 day from CC-1); wider estimate if OQ4 / OQ6 pulled-into-0d1 expansions are taken (would add 0.5-1.5 days).

**Eric's call.** Default OR alternative.

### OQ10 — Sprint open ratification — sequential vs parallel with Sprint 0d2

Sprint 0d closes; Sprint 0d1 + Sprint 0d2 both have drafted kanbans. Open sequentially (0d1 first; 0d2 after 0d1 close), or parallel (both opened at same commit; CC-coordination flagged in both kanbans)?

**Default.** Sequential. 0d1's CC-1 §10 resolution is upstream input to several 0d2 CCs (e.g., 0d2 CC-4 §4.1 ADR template depends on 0d1 CC-7 Security Implications mechanism). Sequential opening matches dependency graph.

**Alternative.** Parallel. Argument: 0d2 CC-5 / CC-6 (xrsize4all repo standup + migration) are independent of 0d1's content; 0d2 CC-1 / CC-2 / CC-3 (AAF + reference architecture + overviews) are independent of 0d1 content; only 0d2 CC-4 + CC-7 + CC-8 depend on 0d1 CC-1 / CC-7. Parallel opening + careful sequencing within each sprint reduces total elapsed time.

**Eric's call.** Default (sequential) OR parallel. **Coordinates with 0d2 entry-condition statement.**

---

## Sprint 0d1 entry conditions

- This kanban committed and Eric has reviewed it.
- Baseline doc (`reach4all://docs/architecture/security-controls-baseline_v0.1.0.md`) is at v0.1.0 accepted (✓ as of 2026-04-29).
- Sprint 0d (document-cm skill build) is closed OR explicitly carved off; CC-1 §10 resolution doesn't block on Sprint 0d's deliverables but CC-7's bind-date coordination is cleaner if 0d is in a stable state.
- Eric has answered OQ1 (CC count), OQ5 (§10 resolution scope), OQ8 (D-decision scope), OQ10 (sequential vs parallel with 0d2) — each blocks sprint commit.

---

## Sprint 0d1 exit conditions

- All 8 close criteria above marked DONE.
- Security Controls Baseline v0.1.1 PATCH released (CC-1 §10 resolution amendments).
- SD-009 amendment block in `strategic-decisions-log_v0.1.0.md` (or v0.2.0 if 0d2 lands first per OQ2 / OQ10) committed.
- SD-004 amended with Controls in tension block citing baseline §5.1 + §5.2.
- Lifting Tracker production-readiness gate matrix tracker artifact at `lifting-tracker://docs/lift-track-production-readiness-controls_v0.1.0.md`.
- Quarterly review cadence operationalized — first review scheduled (calendar / cron / scheduled-task).
- Pre-commit gitleaks + GitHub Push Protection installed in scoped repos (per OQ7).
- Architectural-change reflection mechanism (Security Implications block) bind-date statement committed; coordinated with Sprint 0d2 CC-4 §4.1 ADR template work (per OQ3).
- lift-track-risks ↔ baseline §5 cross-references resolve in both directions.
- Baseline is binding governance reference: every architectural decision touching security posture going forward MUST cite the baseline.

---

## Open-items migration from Sprint 0d

Per §14.2 inheritance rule. **To be populated at actual sprint open from Sprint 0d's close kanban.** At draft time, Sprint 0d is open (sprint_open_date 2026-04-30 per its kanban frontmatter). This section is a placeholder.

| Item | Source | Disposition |
|---|---|---|
| (Placeholder. Populate at 0d1 sprint-open commit by reviewing frozen `lift-track-kanban-sprint-0d.md` Done / Open / Carry-forward state. Likely items: Sprint 0d CC3b STIG-format doc — see OQ4 for placement; any document-cm skill / manifest / STIG carry-forward if 0d under-delivered; Supabase PITR + off-account backup status per CC4-5 of 0d.) | — | — |

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| (Empty at sprint open. Items added as work begins.) | — | — | — |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| (Empty at sprint open. OQ1-OQ10 should be resolved at sprint open commit, not held in review queue.) | — | — |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Done — Sprint 0d1

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

- **Input substrate (the prep deliverable):** `reach4all://docs/architecture/security-controls-baseline_v0.1.0.md` (2,658 lines, 2026-04-29, status: accepted at v0.1.0). Every CC maps to one or more sections of this doc.
- **Path note:** baseline migrates to `xrsize4all://docs/architecture/security-controls-baseline_v0.1.0.md` per Sprint 0d2 CC-6 — see OQ2 for Sprint 0d1's migration timing call.
- **Authorization:** SD-009 in `reach4all://docs/architecture/strategic-decisions-log_v0.1.0.md`.
- **Source research feeding the baseline** (per baseline §11.9):
  - `reach4all://docs/architecture/concept-computing-inheritance-analysis_v0.1.0.md` — CC-013/14/15/16/17 inheritance digestion
  - `reach4all://docs/research/cowork-dispatch-bindfs-git-lock-fix-research.md` — bindfs research v3 §10 controls-framework review
  - `reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md` — failure-modes research v2 §6 + §7 + §8 incident playbooks
  - `reach4all://docs/research/portfolio-strategic-implications-and-ownership-trajectory-research.md` — Strategic Implications discipline (§10)
  - `reach4all://docs/research/data-retention-policy-research.md` — retention informing PT family + A.5.34
  - `reach4all://docs/research/data-storage-and-archiving-strategy-research.md` — storage/archiving informing CP family
- **Prior sprint kanban:** `docs/lift-track-kanban-sprint-0d.md` (document-cm skill build).
- **Adjacent sprint kanban:** `docs/lift-track-kanban-sprint-0d2.md` (framework rename + reference architecture + xrsize4all repo standup) — coordination required for OQ3 (CC-7 / 0d2 CC-4 §4.1 bind-date) and OQ10 (sequential vs parallel sprint open).
- **Sprint 0d1 retrospective at close:** `docs/retrospectives/lift-track-sprint-retro-0d1.md`.
- **Sprint 0e (next sprint after 0d2):** pre-drafted in `docs/lift-track-kanban-sprint-0e.md`.
- **Methodology:** `docs/CONVENTIONS_v0.2.4.md` §6.2 (frontmatter), §8 (per-sprint kanban), §14 (sprint open / close / carry-forward).
- **D-decisions in CC-2 scope:** `docs/lift-track-architecture_v0.4.0.md` D5 (RBAC), D6 (magic-link auth), D11 (AI ingestion), D19 (Reasoner Duality), D22 (sensitivity defaults), D23 (sync/offline) — final list per OQ8.
- **SD log (current):** `reach4all://docs/architecture/strategic-decisions-log_v0.1.0.md`; migrates to `xrsize4all://docs/architecture/strategic-decisions-log_v0.2.0.md` in Sprint 0d2 CC-6 + CC-7.
- **Risk register:** `lifting-tracker://lift-track-risks_v0.1.0.md` — CC-8 cross-reference target.
- **Baseline §10 open-questions resolution lands as:** SD-009 amendment block + baseline v0.1.1 PATCH (§10 entries updated to reflect resolved status).
- **Baseline §3.16a.A operationalization lands at:** `lifting-tracker://docs/lift-track-production-readiness-controls_v0.1.0.md` (CC-4 deliverable).
- **Quarterly review checklist lands at:** `lifting-tracker://docs/lift-track-baseline-review-checklist_v0.1.0.md` (CC-5 deliverable; consider xrsize4all path post-0d2 migration).

---

© 2026 Eric Riutort. All rights reserved.
