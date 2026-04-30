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
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0d)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0d's per-sprint kanban. **Drafted ahead of sprint open** during Sprint 0c1; finalized at the actual sprint-open commit when Sprint 0c2 closes. Frozen at sprint close as the immutable record.

## Sprint 0d — document-cm Skill Build + STIG + Rollback Readiness

**Theme:** Ship the `document-cm` skill that has been deferred since Sprint 0a, with its first-consumer manifest and STIG alignment doc co-located in the skill repo. In parallel, operationalize the top 3 rollback playbooks (database, files, git) and stand up the Supabase PITR + off-account backup posture before any production data lands. This sprint converts the failure-modes research's prevention-tier recommendations into recovery-tier readiness.

**Dates:** TBD → TBD (estimated 4-6 days under solo+AI; high close-criteria count and skill build is load-bearing)

**Goal:** Operational `document-cm` skill installable via `/skills install`, validating Lifting Tracker's `.cm/manifest.yaml`, with STIG alignment documented in the skill repo. Production-data prerequisites met: PITR enabled, off-account backup runner running, top-3 rollback playbooks operationalized, git reflog-expiration disabled on dev workstation.

**Close criteria (7 items + 1 sub-item per CC3a; CC3b moved out at 0c0.5 close):**

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
- Sprint 0e (next sprint, opens at 0d close): pre-drafted in `docs/lift-track-kanban-sprint-0e.md`
- Methodology: `docs/CONVENTIONS_v0.2.4.md` §14
- CM design source: `lift-track-source-document-cm_v0.3.0.md` (renamed in Sprint 0c1 CC5)
- Failure-modes research source: `reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md` (Sprint 0c1 CC10) — §6.A, §7-A
- DISA Python STIG reference: cited in skill-co-located alignment doc per Q4 = C
- G31 commitment: STIG alignment carried since Sprint 0b backlog

---

© 2026 Eric Riutort. All rights reserved.
