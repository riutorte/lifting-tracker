---
author: Eric Riutort
created: 2026-04-28
updated: 2026-04-30
tier: OPERATIONAL
content_class: operational
sprint: 0d
sprint_name: document-cm Skill Build + STIG + Rollback Readiness
sprint_dates: 2026-04-30 → TBD
sprint_open_date: 2026-04-30
status: open
amended_at: 2026-04-30
amendment_note: CC8–CC15 added additively from document-cm skill design specification prep deliverable (reach4all/docs/research/document-cm-skill-design-specification.md v0.1.0). Existing CC1–CC7 + CC3a/3b unchanged.
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0d)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0d's per-sprint kanban. **Drafted ahead of sprint open** during Sprint 0c1; finalized at the actual sprint-open commit when Sprint 0c2 closes. Frozen at sprint close as the immutable record.

## Sprint 0d — document-cm Skill Build + STIG + Rollback Readiness

**Theme:** Ship the `document-cm` skill that has been deferred since Sprint 0a, with its first-consumer manifest and STIG alignment doc co-located in the skill repo. In parallel, operationalize the top 3 rollback playbooks (database, files, git) and stand up the Supabase PITR + off-account backup posture before any production data lands. This sprint converts the failure-modes research's prevention-tier recommendations into recovery-tier readiness.

**Dates:** TBD → TBD (estimated 4-6 days under solo+AI; high close-criteria count and skill build is load-bearing)

**Goal:** Operational `document-cm` skill installable via `/skills install`, validating Lifting Tracker's `.cm/manifest.yaml`, with STIG alignment documented in the skill repo. Production-data prerequisites met: PITR enabled, off-account backup runner running, top-3 rollback playbooks operationalized, git reflog-expiration disabled on dev workstation.

**Close criteria (CC1–CC7 + CC3a sub-item from original scope, plus CC8–CC15 added 2026-04-30 from document-cm skill design specification prep deliverable; CC3b moved out at 0c0.5 close):**

1. NEW — `~/document-cm/` skill scaffold complete: `SKILL.md`, `lib/` (validation logic), `hooks/` (pre/post-write hooks), validation harness with test fixtures, `README.md`, frontmatter governance per CONVENTIONS_v0.2.4 §6 (and any v0.2.4 amendments landed by then). Installable via `/skills install` from local path. The skill build that has been carried forward from Sprint 0a → 0b → 0b2 → 0c → 0c1 — this sprint's load-bearing deliverable.
2. NEW — `~/lifting-tracker/.cm/manifest.yaml` — `content_class` declarations for every doc in `docs/`. First-consumer manifest validating the skill end-to-end. Tier (STRATEGIC / TACTICAL / OPERATIONAL / REFERENCE) and content_class declared per doc; skill validates frontmatter alignment.
3. NEW — STIG alignment doc lands in `~/document-cm/stig-alignment_v0.1.0.md` per Q4 = C decision (skill repo placement, not portfolio-level reach4all/docs/architecture/). DISA Python STIG controls adopted, controls declined-with-rationale, code-review checklist for the skill's hooks. Closes G31 commitment carried since Sprint 0b backlog.
3a. NEW — Cowork bypass attack-vector-to-mitigation mapping doc at `~/reach4all/docs/research/cowork-bypass-attack-mitigation-analysis_v0.1.0.md`. Added per Eric's call 2026-04-28: deferred from Sprint 0c0.5 to keep that sprint focused. **Re-scoped at Sprint 0c0.5 close per architectural-discipline correction:** lands as research/prep doc, NOT a formal STIG. For each hardening mechanism in the Rev 2 reaper script (TOCTOU prevention via `realpath -e` + containment check, path containment via `-not -type l`, size-0 requirement, lsof check, kill switch at `~/Library/Application Support/git-lock-watcher.disabled`, restrictive perms, dual logging, absolute-path binaries), document the specific attack class it closes (CWE-22, CWE-367, CWE-426, CAPEC-27, CAPEC-29, etc.). Cites bindfs research v3 controls-framework review. Acts as the input to CC3b's formal STIG once that re-sequences to post-Sprint-0d1.

3b. **MOVED OUT of Sprint 0d** at 0c0.5 close per architectural-discipline correction. Cowork bypass STIG-format compensating-control doc re-sequences to post-Sprint-0d1 placement (sprint TBD when 0d1 closes — likely 0d2 CC or its own micro-sprint between 0d1 and 0d2) so it cites the formal security controls baseline (SD-009 / Sprint 0d1) rather than freelancing controls. Format intent unchanged from prior framing: DISA STIG format with Vulnerability ID, Severity Code (CAT I/II/III), Discussion, Check Text, Fix Text, CCI references, applicable STIG family; MITRE ATT&CK T1070.004 acknowledgment + allowlist entry. Per the bindfs research v3 finding: "the bypass needs accompanying documentation to graduate from ad-hoc to documented compensating-control configuration." Per Eric: "this is why we have STIGS." The deferral preserves that intent — STIG cites formal baseline, not provisional controls knowledge.
4. NEW — Supabase PITR add-on enabled on the planned Lifting Tracker production project. Pre-condition for any rollback story for production data — without PITR there is no point-in-time recovery story. Action item: enable in Supabase dashboard, document the rollback window and cost in the rollback playbook (CC6).
5. NEW — Off-account S3 backup runner with Object Lock + KMS, cross-account-isolated. Per failure-modes research §7-A. Runner schedule, retention policy, restore-test procedure all documented. Cross-account isolation prevents a compromised primary account from deleting backups.
6. NEW — First rollback playbook operationalized: database wipe rollback. Per failure-modes research §6.A. Step-by-step runbook covering Supabase PITR restore path, off-account backup restore path, decision tree for which path to take. Tested at least once in dry-run against a non-production project.
7. NEW — `git config --global gc.reflogExpire never` set on dev workstation. 5-min one-off, but worth tracking as a CC for completeness — without it, recovering from accidental branch deletion or rebase mistakes has a hard time-bound. Per failure-modes research's git-recovery section.

**Plus retro at close** — `sprint-retro-0d.md` (or `lift-track-sprint-retro-0d.md` per naming convention).

---

## Additional CCs from document-cm skill design specification prep deliverable

Added 2026-04-30. Source: `~/reach4all/docs/research/document-cm-skill-design-specification.md` v0.1.0 (2118 lines, dated 2026-04-29). The prep deliverable fixes design choices for CC1's skill build so Sprint 0d work focuses on construction, not redesign. CC8–CC15 below are additive deliverables and acceptance gates that the prep doc commits to but that are not explicitly captured by CC1–CC7's text. **CC1–CC7 + CC3a remain authoritative as written; CC3b remains MOVED OUT.** These additions extend the build surface; they do not renumber, supersede, or modify the prior CCs.

These eight items are scoped against the prep deliverable's §3 (lib/), §5 (manifest schema), §6 (eval harness), §7 (install), §9 (STIG), §11 (open questions). Each cites the specific section of the prep deliverable that defines it.

8. **NEW — Manifest schema v1.0 → v1.1 migration tooling.** `cm migrate-manifest --from 1.0 --to 1.1` CLI ships with `cm` toolchain. Migration adds `content_class` (architecture / research / operational / reference), `subtype` (finding / landscape-synthesis / source-digestion / kanban / retro / sprint-plan), `valid_as_of`, `re_check_by`, `stale_after` to the manifest schema additively (MINOR bump). Migration auto-infers `content_class` from directory placement and seeds research-class staleness fields with sensible defaults (today + 90d). Existing v1.0 manifests continue to validate against v1.1. Per prep deliverable §5.5. Acceptance: Lifting Tracker's `.cm/manifest.yaml` (CC2 deliverable) is generated by or migrated through this tooling, not hand-authored.

9. **NEW — JSON Schema artifacts shipped under `~/document-cm/schemas/`.** Five schema files: `manifest.schema.json` (with `allOf` conditional-required rules per content class — research-class requires `valid_as_of`/`re_check_by`/`stale_after`/`subtype`; deprecated entries require `superseded_by`; architecture-class requires semver `version`), `frontmatter-schema.json` (per-class field requirements), `gate-request.schema.json` + `gate-assignment.schema.json` + `gate-resolution.schema.json` (the §5.5a artifact triple), `scorekeeper-entry.schema.json` (with `prev_hash` chain field). Each schema's `$id` carries semver matching the manifest's `schema_version`. Per prep deliverable §2.6 + §5.4. Acceptance: validators in `lib/validators/` reference these schemas; `cm validate` exits 1 with JSON Schema error path quoted on validation failure.

10. **NEW — Eval harness scenario corpus (~25 scenarios) with coverage gate.** Two complementary surfaces under `~/document-cm/`: `tests/` (pytest unit + integration) and `evals/` (fixture-based scenario harness with golden diffs). The seven canonical scenarios from §9.5 of source-design v0.3.0 (`add-new-adr`, `typo-patch-bump`, `rescind-major`, `new-doc-register`, `rename-doc`, `reconcile-two-drifted-docs`, `freeze-portfolio-baseline`) are the v0.1.0 floor; eighteen expansion scenarios (research-class lifecycle, GATE artifact triple happy/rejected/expired/edit-refused, four content-drop defenses, three STIG violations, attribution mismatch cases, manifest 1.0→1.1 migration, tier-2 concern log, scorekeeper tamper detection) are added per §6.4. Coverage gate at v0.1.0 ship: every validator has at least one positive test and at least one negative test per failure mode listed in §3.4 — 100% validator × failure-mode coverage matrix per §6.5. Asymmetric pytest threshold per §11.4 recommendation D: 100% on `lib/validators/`, 80% on `lib/` orchestration. Plus `evals/install-into-empty-repo/` install-reproducibility scenario per §7.6 (fresh tempdir → install → `cm init` → assert layout, file presence, hooks executable, sample `cm status` runs). Per prep deliverable §6 + §7.6 + §11.4.

11. **NEW — Content-class templates ship under `~/document-cm/templates/`.** Six templates: `architecture-doc.md`, `research-doc.md` (with `valid_as_of` / `re_check_by` / `stale_after` frontmatter), `operational-doc.md` (date-based versioning), `reference-doc.md` (semver + 180d staleness default), `adr-madr.md` (full MADR-format with alternatives + tradeoffs), `adr-ystatement.md` (terse Y-statement inline ADR). Each template carries the YAML frontmatter the consumer doc requires plus a starter outline. `cm new-doc <class> <id>` instantiates the appropriate template, fills in `author`, `created`, `updated`, `version` (or date), and writes to the path the user names. Per prep deliverable §2.5 + §11.5 (recommendation A — ship all four classes at v0.1.0; cost is small; benefit is consumer repos can scaffold any class on day one).

12. **NEW — `validators/stig.py` with 8 DISA Python STIG checks enforced in code.** Specific checks: (1) no `eval()` / `exec()` calls (`ast.literal_eval` whitelisted as safe substitute); (2) no `pickle.loads` / `pickle.load` / `marshal.loads` / `shelve.open` on user-controlled input; (3) `yaml.safe_load` mandatory (never bare `yaml.load` without `Loader=SafeLoader`); (4) no `subprocess.shell=True` (argv list only); (5) no `requests.verify=False` or unverified-SSL flags; (6) no `os.popen()` (use `subprocess.run` with argv list); (7) no hardcoded credentials (regex match against AWS-style keys, OAuth tokens, common API-key patterns); (8) pinned dependencies in `pyproject.toml` (`~=` compatible-release or exact version; no unbounded `>=` without `<`; no bare `*`). Runs against the skill's OWN code on `cm validate --stig` and as a CI step on PRs touching `~/document-cm/`. Cross-walks to CC3 deliverable (`stig-alignment_v0.1.0.md`) — every adopted control in that doc maps to a check in this validator. Per prep deliverable §3.4.9 + §9.3. **Note:** CC3 is the alignment doc (rationale + adoption decisions); CC12 is the executable enforcement code. Both are required for STIG-readiness.

13. **NEW — Source-design v0.3.0 ↔ skill-module cross-walk traceability table.** ~33-row table populated under `~/document-cm/references/` (likely as `source-design-crosswalk.md` or embedded in `references/verification-criteria.md`) per §3.6 of prep deliverable. Every governance rule named in `lift-track-source-document-cm_v0.3.0.md` v0.3.0 (semver discipline §2.1, bump propagation §2.4, immutable tags §2.5, content classes §3.7, manifest format §4, GATE artifact triple §5.5a, four content-drop defenses §5.7, MCP-first §6.6, tamper-evident scorekeeper §6.7, DISA STIG §8.6, eval harness §9.5, threat model §10.0, least-privilege §10.2, and ~20 more) maps to a specific skill module / validator that enforces it. Acts as a **build-acceptance gate** — any row with a missing module is a gap. Per prep deliverable §3.6: "this is what Sprint 0d build is graded against. Every row is a build-acceptance criterion; missing rows are gaps." Acceptance at sprint close: zero rows missing; zero rows referencing modules that do not exist.

14. **NEW — MCP server stub shipped at v0.1.0.** `~/document-cm/mcp/server.py` ships with at least one MCP tool wired through to the shared `lib/` API (e.g., `cm validate` exposed as an MCP tool), demonstrating the MCP-first dual CLI/MCP exposure pattern from §6.6 of source-design v0.3.0. Full MCP coverage (every public `lib/` function exposed as an MCP tool) deferred to v0.2.0 per prep deliverable §11.6 (recommendation C — "the pattern is the load-bearing part; full coverage is plumbing"). Acceptance: a client can spawn the MCP server, call the wired tool, and receive a response that matches the equivalent CLI invocation. Validates the architectural commitment without paying full implementation cost at v0.1.0.

15. **NEW — Open-question resolution batch.** 13 design questions surfaced in §11 of the prep deliverable resolved by Eric BEFORE or DURING Sprint 0d build to lock implementation path. The questions: (§11.1) Python 3.11+ confirmation; (§11.2) validation strictness defaults at first install — fail-fast / auto-fix-and-warn / grace-period / configurable; (§11.3) error-handling philosophy — always-block on CRITICAL or configurable; (§11.4) test-coverage threshold — 80% / 85% / 90% / asymmetric (spec recommends asymmetric, captured in CC10); (§11.5) ship all four templates at v0.1.0 (spec recommends yes, captured in CC11); (§11.6) MCP server at v0.1.0 — full / stub / deferred (spec recommends stub, captured in CC14); (§11.7) evals on every PR or only on tag — spec recommends hybrid; (§11.8) SessionStart hook output to context vs notification — spec recommends context; (§11.9) `pre-commit` (the tool) auto-wired vs opt-in — spec recommends opt-in; (§11.10) HyperDX OTel at v0.1.0 — spec recommends defer; (§11.11) Tier 2 concern log at v0.1.0 — spec recommends yes; (§11.12) skill license — spec recommends defer to v0.2.0; (§11.13) ADR home — spec recommends both skill-internal + portfolio. Each spec recommendation is a draft default; Eric confirms or reverses. Some answers (CC10, CC11, CC14) already encoded in the additive CCs above as the spec recommendation; remaining answers should be written into a single `~/document-cm/docs/adr/0001-design-decisions-batch.md` ADR before code touches keyboard. Per prep deliverable §11.

**Note on relationship to CC1.** Several of CC8–CC15 are deliverables that, in a less-detailed sprint plan, would simply be sub-items within CC1's "skill scaffold complete." Promoting them to peer CCs serves three purposes: (a) makes them explicit acceptance criteria visible at sprint-close review; (b) lets each one be dispositioned independently (DONE / partial / DEFERRED-TO-0e) rather than buried in CC1; (c) creates the auditable record that the prep deliverable's commitments did not silently disappear during Sprint 0d build. CC1 retains its authority as the umbrella deliverable; CC8–CC15 add specificity.

**Note on sprint capacity.** The prep deliverable estimates `lib/` at ~3500–4000 lines of Python at v0.1.0 (§3.2), plus templates, schemas, eval harness, MCP stub. Sprint 0d's 4–6 day estimate (in the existing kanban) is now under tighter pressure with CC8–CC15 added. **Eric should review at sprint-open** whether to (i) expand Sprint 0d's day-budget, (ii) defer some of CC8–CC15 to a Sprint 0d half-sprint (0d.5) before Sprint 0d1 opens, or (iii) accept that Sprint 0d ships v0.1.0 with several CCs marked "partial — completes in 0d.5". **Recommendation:** Review at the next sprint-open commit; the prep deliverable's content was not yet authored at the original 0d scoping.

---

**Note on bindfs install:** Sprint 0c0.5 CC8 (Bindfs lock-reaper install) does NOT land in Sprint 0d. Per Eric's architectural-discipline correction at 0c0.5 close (2026-04-28), the install is DEFERRED-TO-POST-SPRINT-0D2 — it depends on the security controls baseline (SD-009 / Sprint 0d1), reference architecture (SD-007 / Sprint 0d2), rolled-up overview doc (SD-008 / Sprint 0d2), and framework rename (SD-006 / Sprint 0d2) all landing first. Sprint 0d retains CC3a (Cowork bypass attack-vector-to-mitigation mapping as research/prep doc, no formal STIG framing yet); CC3b (STIG-format compensating-control doc) re-sequences to post-Sprint-0d1 placement so it cites the formal baseline rather than freelancing controls. Operational mitigations active during the deferral window: `GIT_OPTIONAL_LOCKS=0` env var (Layer 1, added to Sprint 0c1 per Eric's call) + spawn Code tasks for Dispatch git operations.

**Stretch (only if 1-7 land cleanly with capacity remaining):**

- Second rollback playbook (file-system recovery)
- Third rollback playbook (git history restoration)
- Concept-side `.cm/manifest.yaml` (tests skill against a second consumer)
- Trust-but-verify instrumentation framework for the 16 Concept agents (was deferred from 0c)

---

## Open-items migration from Sprint 0c2

Per §14.2 inheritance rule. **To be populated at actual sprint open from Sprint 0c2's close kanban per CONVENTIONS §14.2.** At draft time (Sprint 0c2 not yet open), the expected pattern is:

- Bring-forward items: any Sprint 0c2 close criteria that didn't fully close, plus the seven items already pre-staged for 0d (document-cm skill, manifest, STIG, PITR, off-account backup, first rollback playbook, gc.reflogExpire)
- Defer-to-0e items: scheduler + 17 cron tasks, listener architecture, custom-LLM research stream
- Carry-forward backlog from earlier sprints: lift-track-architecture-v0.3-to-v0.4-audit_v0.1.0.md misclassification fix, status-vocab consistency settle, MCP installs (filesystem + git + brave + Firecrawl), DoDAF cross-reference matrix, Reach4All bindfs-residue cleanup
- Out-of-band: hardware purchase decision, LLM cloud-rental validation, `f0492d52` URL re-share

| Item | Source | Disposition |
|---|---|---|
| (Placeholder. Populate at 0d sprint-open commit by reviewing frozen `lift-track-kanban-sprint-0c2.md` Done / Open / Carry-forward state.) | — | — |

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| (Empty at sprint open. Items added as work begins.) | — | — | — |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Done — Sprint 0d

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

- Prior sprint's kanban (frozen at 0c2 close): `docs/lift-track-kanban-sprint-0c2.md` (or `docs/lift-track-kanban-sprint-0c2.md`)
- Sprint 0c2 retrospective: `docs/retrospectives/sprint-retro-0c2.md`
- Sprint 0d retrospective at close: `docs/retrospectives/sprint-retro-0d.md`
- **Next sprint (opens at 0d close, or parallel per 0d1 OQ10):** Sprint 0d1 — Security Controls Baseline integration — pre-drafted in `docs/lift-track-kanban-sprint-0d1.md` (scoped from `reach4all://docs/architecture/security-controls-baseline_v0.1.0.md` per SD-009)
- **Adjacent sprint (also pre-drafted; sequencing per 0d1 OQ10):** Sprint 0d2 — framework rename + reference architecture + xrsize4all repo standup — `docs/lift-track-kanban-sprint-0d2.md`
- Sprint 0e (downstream sprint, opens after 0d1 + 0d2 close): pre-drafted in `docs/lift-track-kanban-sprint-0e.md`
- Methodology: `docs/CONVENTIONS_v0.2.4.md` §14
- CM design source: `lift-track-source-document-cm_v0.3.0.md` (renamed in Sprint 0c1 CC5)
- Failure-modes research source: `reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md` (Sprint 0c1 CC10) — §6.A, §7-A
- DISA Python STIG reference: cited in skill-co-located alignment doc per Q4 = C
- G31 commitment: STIG alignment carried since Sprint 0b backlog
- document-cm skill design specification (CC8–CC15 source): `reach4all/docs/research/document-cm-skill-design-specification.md` v0.1.0 (2026-04-29; 2118 lines; 12 sections + 13 open questions). Operationalizes `lift-track-source-document-cm_v0.3.0.md` v0.3.0; cited against Anthropic Agent Skills spec (Dec 2025) verified 2026-04-29.
- **Sprint 0d CC3b STIG-format doc placement:** see Sprint 0d1 OQ4 for confirmation of post-0d1 deferral or pull-into-0d1 alternative

---

© 2026 Eric Riutort. All rights reserved.
