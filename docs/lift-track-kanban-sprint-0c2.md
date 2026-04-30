---
author: Eric Riutort
created: 2026-04-28
updated: 2026-04-28
tier: OPERATIONAL
content_class: operational
sprint: 0c2
sprint_name: Sandboxing Discipline + Destructive-Op Policy
sprint_dates: TBD → TBD
status: draft
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0c2)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0c2's per-sprint kanban. **Drafted ahead of sprint open** during Sprint 0c1; finalized at the actual sprint-open commit when Sprint 0c1 closes. Frozen at sprint close as the immutable record.

## Sprint 0c2 — Sandboxing Discipline + Destructive-Op Policy

**Theme:** Ship the second-tier failure-modes prevention actions — default sandbox isolation for all spawned Code tasks, plus a written policy doc for destructive operations. Removes blast-radius overlap on long-running concurrent work and makes future hook updates auditable.

**Dates:** TBD → TBD (estimated 1-2 days under solo+AI; small surface area but two distinct artifacts)

**Goal:** Every Cowork/Dispatch Code-task spawn defaults to an isolated worktree; interactive Mac shell sessions have a matching alias; portfolio-level destructive-operation policy is committed and citable from future hook PRs.

**Close criteria (2 items):**

1. NEW — Default `--worktree` for Cowork/Dispatch Code-task spawns + shell alias for interactive Mac sessions. Per failure-modes research §7-D. Removes blast-radius overlap and isolates document-cm skill work from concurrent Lifting Tracker work. Operationalize via:
   - Spawn-prompt template update (Cowork + Dispatch) so Code tasks default to `isolation: "worktree"` unless the task is read-only or explicitly needs the live tree
   - Mac shell alias for `claude` (or `cc`) that wires `--worktree` for interactive sessions started from Eric's terminal
   - Document the override path for the read-only / live-tree exception cases
2. NEW — `destructive-operation-policy.md` lands in `~/lifting-tracker/docs/` (or `~/reach4all/docs/architecture/` if classified portfolio-level — placement decision at sprint open). Per failure-modes research §7-G. States:
   - Which commands are blocked outright by the deny list (cite Sprint 0c1 CC9)
   - Which commands require explicit approval before invocation
   - Which commands are sandbox-only (require `--worktree` or equivalent isolation)
   - Cites the failure-modes + rollback strategy research (Sprint 0c1 CC10) as source
   - Establishes the audit trail rule for future hook / deny-list updates

**Plus retro at close** — `sprint-retro-0c2.md` (or `lift-track-sprint-retro-0c2.md` if naming-convention rename pass landed in 0c1).

**Stretch (only if 1-2 land cleanly with capacity remaining):**

- Validate the worktree default with a smoke-test Code-task spawn that intentionally tries to write outside its worktree (confirms isolation holds)
- Add a CONVENTIONS reference to the new policy doc so it's discoverable from the methodology spine

---

## Open-items migration from Sprint 0c1

Per §14.2 inheritance rule. **To be populated at actual sprint open from Sprint 0c1's close kanban per CONVENTIONS §14.2.** At draft time (Sprint 0c1 still open), the expected pattern is:

- Bring-forward items: any Sprint 0c1 close criteria that didn't fully close, plus the two items already pre-staged for 0c2 (worktree default, destructive-op policy)
- Defer-to-0d items: document-cm skill scaffold, `.cm/manifest.yaml`, STIG alignment doc, Supabase PITR + off-account backup, rollback playbooks, `git config --global gc.reflogExpire never`
- Defer-to-0e items: scheduler + 17 cron tasks, listener architecture + first 3-5 listeners, custom-LLM research stream
- Out-of-band: hardware purchase decision, LLM cloud-rental validation, `f0492d52` URL re-share

| Item | Source | Disposition |
|---|---|---|
| (Placeholder. Populate at 0c2 sprint-open commit by reviewing frozen `lift-track-kanban-sprint-0c1.md` Done / Open / Carry-forward state.) | — | — |

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

## Done — Sprint 0c2

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

- Prior sprint's kanban (frozen at 0c1 close): `docs/lift-track-kanban-sprint-0c1.md` (or `docs/lift-track-kanban-sprint-0c1.md` if rename pass landed)
- Sprint 0c1 retrospective: `docs/retrospectives/lift-track-sprint-retro-0c1.md`
- Sprint 0c2 retrospective at close: `docs/retrospectives/sprint-retro-0c2.md`
- Sprint 0d (next sprint, opens at 0c2 close): pre-drafted in `docs/lift-track-kanban-sprint-0d.md`
- Methodology: `docs/CONVENTIONS_v0.2.4.md` §14
- Failure-modes research source: `reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md` (delivered Sprint 0c1 CC10), §7-D + §7-G
- Deny list precedent: Sprint 0c1 CC9 (project-level `.claude/settings.json` across 3 repos)

---

© 2026 Eric Riutort. All rights reserved.
