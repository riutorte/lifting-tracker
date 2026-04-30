---
author: Eric Riutort
created: 2026-04-28
updated: 2026-04-29
sprint_open_date: 2026-04-28
sprint_close_date: 2026-04-29
tier: OPERATIONAL
content_class: operational
sprint: 0c1
sprint_name: Documentation Hygiene + AV-2 Enrichment + First Prevention Action
sprint_dates: 2026-04-28 → 2026-04-29
duration_days: 2
status: closed
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0c1)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0c1's per-sprint kanban. Created at sprint open with explicit open-items migration from `lift-track-kanban-sprint-0c.md`. Frozen at sprint close as the immutable record.

## Sprint 0c1 — Documentation Hygiene + AV-2 Enrichment + First Prevention Action

**Theme:** Apply the v0.2.3 + v0.2.4 naming and convention rules portfolio-wide; land directory READMEs; close AV-2 to inclusion-completeness; ship the highest-yield failure-modes prevention action; deliver the wide/deep failure-modes + rollback strategy research.

**Dates:** 2026-04-28 → TBD (estimated 2-4 days under solo+AI; over-scoped at 10 close criteria, may run longer)

**Goal:** Portfolio-wide naming convention applied; directory READMEs in place; AV-2 dictionary enriched to fit-for-purpose DoDAF compliance; first failure-modes prevention action shipped (deny list); rollback strategy research delivered.

**Close criteria (7 items after Sprint 0c1.5 split — original 10, 3 moved to dedicated rename sprint):**

Original CC numbering retained for cross-reference stability. CC4, CC5, CC6 (rename pass + source-doc-cm-design rename + dispatch-handoff rename) moved to new dedicated Sprint 0c1.5 per Eric's call at Sprint 0c1 mid-stream (2026-04-28): "push rename to its own sprint without anything else in the sprint." Sprint 0c1.5 inserts between 0c1 and 0c2 as a rename-only micro-sprint per CONVENTIONS_v0.2.4 §14.3 decimal-numbering pattern.

1. ✅ INHERITED — CONVENTIONS_v0.2.4 §14.4 retros README discipline amendment landed (committed in Sprint 0c close commit; this kanban inherits as baseline)
2. NEW — Directory READMEs created: `docs/dodaf/README.md` (DoDAF view index + §11 reference), `docs/adrs/README.md` (ADR index + ADR template), `docs/conversation-archive/README.md` (date-organized index), `docs/README.md` (top-level docs/ overview)
3. ✅ INHERITED — Retros README rename + index landed (committed in Sprint 0c close commit; this kanban inherits as baseline)
4. **MOVED to Sprint 0c1.5** — Naming-convention rename pass (~25 files + cross-references). See `lift-track-kanban-sprint-0c1.5.md`.
5. **MOVED to Sprint 0c1.5** — `lift-track-source-document-cm_v0.3.0.md` rename + ~140 cross-reference updates. See `lift-track-kanban-sprint-0c1.5.md`.
6. **MOVED to Sprint 0c1.5** — `lift-track-dispatch-handoff_v0.1.0.md` rename + semver bump. See `lift-track-kanban-sprint-0c1.5.md`.
7. ✅ INHERITED — `.gitignore` Obsidian additions × 2 repos (committed in Sprint 0c close commit; this kanban inherits as baseline)
8. NEW — AV-2 enrichment fit-for-purpose pass: inclusion-completeness across all 10 views, CARP/CARPO subset typing, four authoring rules applied (verb-object activities, no-and, synonym-collapse, bracketed-context-tag), domain concepts (Session, Exercise, Set, Limb Configuration, Volume, Rest Cascade, Goal, Progress Photo, etc.) added as standalone rows. ~8 hours per DoDAF research.
9. NEW — Project-level `.claude/settings.json` deny list across 3 repos (lifting-tracker, reach4all, Concept). Minimum set per failure-modes research §7-B: `rm -rf` variants, `git push --force`, `terraform destroy`, `supabase db reset`, `cat .env`, secret-pattern-blocking. ~1 hour, highest yield-to-cost prevention action.
10. ✅ INHERITED-DONE — Wide/deep failure-modes + rollback strategy research already landed in `claude-code-failure-modes-and-rollback-strategy-research.md` (2,574 lines, 10 sections), committed in Sprint 0c close batch (`3691516`). Inadvertently double-counted at 0c1 sprint-open; status marked here for accuracy.

**Stretch (only if 1-10 land cleanly with capacity remaining):**

- DoDAF cross-reference matrix (`docs/lift-track-dodaf-cross-reference.md`) per CONVENTIONS §11.6 promise
- Reach4All bindfs-residue cleanup (worktree branches, untracked `.claude/`)

**Operational items (non-CC; quick-fix; land first thing on day 1):**

- **`GIT_OPTIONAL_LOCKS=0` env var (Layer 1 of bindfs lock-reaper)** — **DEFERRED-TO-POST-SPRINT-0D1** per Eric's correction at Sprint 0c1 mid-stream (2026-04-28). The env var bypasses Cowork's bindfs sandbox lock-handling behavior; even though the implementation is one shell-rc line, it IS a compensating control. The earlier "architecturally trivial — no compensating-control posture needed" framing was wrong. Both Layer 1 (env var) and Layer 2 (full reaper install per SD-004) are compensating controls and defer until the security controls baseline (SD-009 / Sprint 0d1) is in place so the deviation is documented against the formal baseline rather than freelancing. Layer 1 specifically defers to post-Sprint-0d1; Layer 2 stays at post-Sprint-0d2 per its broader architectural-pattern dependencies. Implementation note: single line `export GIT_OPTIONAL_LOCKS=0` in `~/.zshrc` (or `~/.bashrc`). Validation: in a fresh shell, `cd ~/lifting-tracker && git status && ls .git/*.lock 2>/dev/null && echo "lock present" || echo "no lock created"` should print "no lock created."

---

## Open-items migration from Sprint 0c0.5 (immediate predecessor)

Per §14.2 inheritance rule. Sprint 0c0.5 inserted between 0c and 0c1 (decimal half-step per CONVENTIONS_v0.2.4 §14.3). Each 0c0.5 close-criterion evaluated below. Sprint 0c0.5 closed cleanly with 7 of 8 CCs DONE; only CC8 carried forward, and it deferred PAST 0c1 per architectural-discipline correction.

### From Sprint 0c0.5 close (1 item evaluated)

| Item | 0c0.5 status | Disposition for 0c1 |
|---|---|---|
| CC1 — CONVENTIONS §14 amendments + version bump 0.2.3 → 0.2.4 | DONE | Released; 0c1 inherits the amendment as baseline |
| CC2 — Strategic-decisions log v0.1.0 (12 SD entries) | DONE | Released; 0c1 cites the log as authoritative |
| CC3 — CLAUDE.md tier-architecture v0.1.0 | DONE | Released; 0c1 cites the doc as authoritative |
| CC4 — lift-track-kanban-sprint-0c2.md draft | DONE | Released; 0c1 cites it as the next sprint's draft |
| CC5 — lift-track-kanban-sprint-0d.md draft | DONE | Released; 0c1 cites the updated 0d kanban (CC8 install removed, CC3a re-scoped, CC3b moved out) |
| CC6 — lift-track-kanban-sprint-0e.md draft | DONE | Released; 0c1 cites it |
| CC7 — Memory files (project_strategic_decisions_log + feedback_decision_promotion) | DONE | Released; pattern propagated |
| CC8 — Bindfs lock-reaper install (Layer 1 + Layer 2) | DEFERRED-TO-POST-SPRINT-0D2 (Layer 2) / POST-SPRINT-0D1 (Layer 1) | Does NOT carry forward to 0c1. Layer 2 (full LaunchAgent + fswatch reaper install) stays deferred to post-Sprint-0d2 per architectural-pattern dependencies (SD-007 reference architecture, SD-008 rolled-up overview, SD-006 framework rename). Layer 1 (env var) deferred to post-Sprint-0d1 per Eric's 2026-04-28 correction — even the env var is a compensating control bypassing bindfs behavior; defers until security controls baseline (SD-009 / Sprint 0d1) is in place |

Net: nothing from 0c0.5 close requires 0c1 sprint-scope work. The 0c0.5 deliverables become 0c1's authoritative substrate.

## Open-items migration from Sprint 0c (prior to 0c0.5)

Per §14.2 inheritance rule. Each Sprint 0c carry-forward evaluated. (This section was authored at 0c close, before 0c0.5 was inserted; it remains accurate because 0c0.5 specifically drained chat-state without touching 0c→0c1 carry-forward items.)

### Bring forward to Sprint 0c1 (10 items, in scope per the close-criteria above)

| Item | Source | Disposition |
|---|---|---|
| Directory READMEs | New, surfaced by Eric's review | Bring forward as 0c1 CC2 |
| Naming-convention rename pass | Sprint 0c1 original scope | Bring forward as 0c1 CC4 |
| source-doc-cm-design rename + cross-refs | Sprint 0b2 carryover | Bring forward as 0c1 CC5 |
| dispatch-handoff rename + semver bump | Sprint 0b2 carryover | Bring forward as 0c1 CC6 |
| AV-2 enrichment fit-for-purpose pass | New, from DoDAF research | Bring forward as 0c1 CC8 |
| `.claude/settings.json` deny list | New, from failure-modes research | Bring forward as 0c1 CC9 — highest yield |
| Wide/deep failure-modes + rollback research | New, from Eric's call to deepen the prior research | Bring forward as 0c1 CC10 (running) |

### Defer to Sprint 0c2 (2 items)

| Item | Source | Reason for defer |
|---|---|---|
| Default `--worktree` for Cowork/Dispatch Code-task spawns + shell alias | Failure-modes research §7-D | Behavior change to spawning pattern; implement after deny list lands and is validated |
| `destructive-operation-policy.md` | Failure-modes research §7-G | Policy doc; depends on deny list and worktree default to be operational first |

### Defer to Sprint 0d (3 items)

| Item | Source | Reason |
|---|---|---|
| `~/document-cm/` skill scaffold | Originally Sprint 0c primary scope — deferred again | Remains the load-bearing skill build; once 0c1 + 0c2 cleanup lands, 0d can focus on it |
| `.cm/manifest.yaml` for Lifting Tracker | Originally Sprint 0c primary scope — deferred again | Companion to document-cm skill |
| STIG alignment doc | 0b backlog (G31), originally 0c primary | Per Q4 = C, lands in `~/document-cm/` repo once it stands up — depends on document-cm scaffold |

### Defer to Sprint 0e (3 streams)

| Item | Source | Reason |
|---|---|---|
| Scheduler implementation + 17 cron-driven research tasks | Sprint 0e primary | Operational sensing capability; needs the cleanup to land first |
| Listener / sniffer architecture + first 3-5 listeners (Apple, Anthropic, vendor license watch) | Sprint 0e (folded in per Eric's call) | Event-driven sensing; complements scheduler |
| LLM research — model selection / fine-tuning / system-prompt strategy for unrestricted research extraction | Sprint 0e (added per Eric's call) | Researches LLM choice for the eventual local LLM build; aim is no external constraints on translation/research-pull quoting |

### Out-of-band / external (3 items, not sprint-bound)

| Item | Owner | Status |
|---|---|---|
| Hardware purchase decision | Eric | Deferred per Eric — likely post-WWDC if M5 lands |
| LLM cloud-rental validation phase setup (Lambda Labs ~$200, 60 days) | Eric | Pre-HW validation per LLM scoping research recommendation |
| Re-share `f0492d52` Claude.ai URL | Eric | Trivial; failed fetch from earlier research |

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| Wide/deep failure-modes + rollback research | Dispatch → Cowork task `local_ebd730f1` | 2026-04-28 | Running. Target ~1500-2000 lines. Lands as `claude-code-failure-modes-and-rollback-strategy-research.md` in reach4all, supersedes prior. CC10. |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Done — Sprint 0c1

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

- Prior sprint's kanban (frozen): `docs/lift-track-kanban-sprint-0c.md`
- Sprint 0c retrospective: `docs/retrospectives/lift-track-sprint-retro-0c.md`
- Sprint 0c1 retrospective at close: `docs/retrospectives/lift-track-sprint-retro-0c1.md` (or `lift-track-sprint-retro-0c1.md` once rename pass lands during this sprint)
- Methodology: `docs/CONVENTIONS_v0.2.4.md` §14
- Naming convention rules: §6.1 + §6.2 + the abbreviation table established in Sprint 0c (lift-track / concept-comp / xrsize4all)
- Failure modes prior research: `reach4all://docs/research/claude-code-failure-modes-and-prevention-research.md` (superseded by CC10 deliverable)
- DoDAF reference: `reach4all://docs/research/dodaf-dm2-and-av2-guidelines-reference-research.md` + `dodaf-drive-folder-supplemental-research.md`

---

© 2026 Eric Riutort. All rights reserved.
