---
author: Eric Riutort
created: 2026-04-28
updated: 2026-04-28
tier: OPERATIONAL
content_class: operational
sprint: 0c0.5
sprint_name: Decision Consolidation Sweep + Bindfs Lock-Reaper Install
sprint_dates: 2026-04-28 → TBD
status: open
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0c0.5)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0c0.5's per-sprint kanban. Insert sprint between 0c (closed) and 0c1. Single-purpose: drain chat-volatile decisions into durable docs + install the operational fix for the bindfs lock cycle so all subsequent sprints have a clean git operations baseline.

## Sprint 0c0.5 — Decision Consolidation Sweep + Bindfs Lock-Reaper Install

**Theme:** Promote chat-state to durable form, codify methodology gaps surfaced during 0c, install the bindfs lock-reaper to remove operational friction, set up forward sprint kanbans so sprint opens are ready.

**Dates:** 2026-04-28 → TBD (estimated 2-4 hours under solo+AI; a deliberate micro-sprint to defragment governance state before bigger work begins)

**Goal:** All chat-derived decisions captured in durable docs (CONVENTIONS, ADRs, memory, future-sprint kanbans). CLAUDE.md tier model consolidated into a single reference doc. Bindfs lock-reaper installed and validated. Sprint 0c1 inherits a clean state.

**Close criteria (8 items):**

1. **CONVENTIONS §14 methodology amendments** (single edit pass; bumps to v0.2.4 if structural, just `updated:` if clarifications):
   - 8th SDLC work mode added to §14.5: event-driven sensing (listener/sniffer)
   - Early-sprint-close pattern documented in §14.2 ("close early with honest retro" as recognized pattern)
   - Inherited-baseline pattern noted in §14.2 (a sprint can inherit prior-sprint close-commit content as baseline)
   - Parallel-sprints stub added to §14.3 (placeholder; full methodology defers to first-real-parallel-sprint)
   - Research-spawn pattern noted in §14.5 work mode 3 (research tasks during sprints are standard, not exception)
   - Sprint numbering refinement: decimal/half-step inserts (e.g., `0c0.5`) added as recognized pattern in §14.3

2. **ADRs (or bundled operational-decisions doc) for chat-derived strategic decisions:**
   - D29 (or operational decision doc): hardware purchase deferral — why deferred, what triggers reconsideration
   - D30 (or doc): LLM build approach — cloud-rental-first phase, then post-hardware local
   - D31 (or doc): doc tooling = Obsidian — operational tooling decision, why over alternatives
   Naming convention question: are these ADRs (architectural decisions) or operational-decisions log entries? Lean: lighter operational-decisions log unless they have architectural consequences. Format TBD during sprint.

3. **CLAUDE.md tier-architecture consolidated reference doc** at `~/reach4all/docs/architecture/claude-md-tier-architecture_v0.1.0.md`. Covers all 9 layers (Tier 1 managed policy, Cowork plugin-marketplace global, user auto-memory, project CLAUDE.md ×N, auto-memory files, conversation context). Authoring rules per tier. Precedence and conflict-resolution. Lookup order. Single source of truth for the model.

4. **lift-track-kanban-sprint-0c2.md draft** (open-state, ready when 0c2 opens):
   - Default `--worktree` for Cowork/Dispatch Code-task spawns + shell alias
   - `destructive-operation-policy.md` per failure-modes research §7-G

5. **lift-track-kanban-sprint-0d.md draft** (open-state):
   - `~/document-cm/` skill scaffold (the Sprint 0c primary work, deferred again)
   - `.cm/manifest.yaml` for Lifting Tracker
   - STIG alignment doc (lands in `~/document-cm/` per Q4 = C)
   - First 3 rollback playbooks operationalized per failure-modes research §6 (database, files, git)
   - Supabase PITR + off-account backup setup before any production data lands

6. **lift-track-kanban-sprint-0e.md draft** (open-state):
   - Scheduler implementation + 17 cron-driven research tasks (full list in `mac-markdown-mermaid-rendering-tools-research.md` cousin or split into a separate `scheduled-research-tasks-spec.md`)
   - Listener / sniffer architecture + first 3-5 high-priority listeners (Apple App Store, Anthropic news, vendor license watch, GitHub releases for direct deps, CVE feeds for stack components)
   - LLM research stream — model selection / fine-tuning / system-prompt strategy for unrestricted research extraction (per Eric's call: local LLM should not impose external translation/quote constraints)

7. **Memory file: chat-derived decisions captured** with citation pointers to this conversation arc. Plus `feedback_decision_promotion.md` codifying "promote chat-state to durable docs as ongoing operational responsibility, not just at sprint close" practice.

8. **Bindfs lock-reaper install (Layer 1 + Layer 2)** — **DEFERRED-TO-POST-SPRINT-0D2** (Eric's decision at 0c0.5 close, 2026-04-28). Per the architectural-discipline correction: the bindfs bypass is part of the architecture (SD-004), not a one-off operational fix. The install materializes a compensating-control pattern with hard architectural dependencies that all land in or after Sprint 0d2: (a) security controls baseline (SD-009 / Sprint 0d1) for the substrate the deviation cites against; (b) reference architecture (SD-007 / Sprint 0d2) for the architectural pattern home; (c) rolled-up overview doc (SD-008 / Sprint 0d2) for the multi-view narrative; (d) framework rename (SD-006 / Sprint 0d2) for the AAF stamp at creation; (e) STIG-format compensating-control doc (post-Sprint-0d1 placement, citing the baseline). Installing in 0c0.5 ahead of these would be ad-hoc bypass with retroactive STIG'ing — the exact pattern the bindfs research v3 controls-framework review explicitly warned against. Install target sprint: TBD when Sprint 0d2 closes (will be a dedicated 0d3 / 0e prep micro-sprint scoped at 0d2 close per §14.2 inheritance discipline). Operational mitigations active during the deferral window (Sprints 0c1 / 0c2 / 0d / 0d1 / 0d2): keep `GIT_OPTIONAL_LOCKS=0` env var (Layer 1, architecturally trivial — turns off an optional lock, no compensating-control posture needed) AND spawn Code tasks for Dispatch git operations (Code tasks run natively on host, don't trip bindfs gate). Layer 1 adoption added to Sprint 0c1 as a separate operational item per Eric's call. Implementation artifacts (`git-lock-watcher.sh` + `com.eriutort.git-lock-watcher.plist`) drafted from research §8.1; ready to install once architectural dependencies land.

**Plus:** Sprint 0c0.5 retrospective at close (`lift-track-sprint-retro-0c0.5.md`).

---

## Open-items migration from Sprint 0c

Per §14.2 inheritance rule. 0c was closed early; most carryforward items go to 0c1, not 0c0.5. 0c0.5 specifically draws from chat-state capture, NOT 0c1's planned scope.

### Bring forward to Sprint 0c0.5 (8 items, in scope per close criteria above)

All eight close criteria are 0c0.5-specific. Drawn from:
- Chat conversation arc that needs to land in durable form (CC1, CC2, CC3, CC7)
- Forward-sprint planning that should be ready when each opens (CC4, CC5, CC6)
- Operational fix surfaced by bindfs research that should land before any more sprint work (CC8)

### Defer to Sprint 0c1 (10 items per lift-track-kanban-sprint-0c1.md)

No change. 0c1 stays at its planned 10 close criteria (cleanup + naming + AV-2 + deny list + wide/deep failure-modes research).

### Defer to Sprint 0c2, 0d, 0e (per their respective kanban drafts which 0c0.5 produces)

See CC4, CC5, CC6.

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| Bindfs lock-reaper deepening research | Dispatch → Cowork task `local_1c110b90` (continuation message sent) | 2026-04-28 | Running. Six new investigation lines: NOT_PLANNED reasoning, Cowork+Dispatch+Code prevalence, security-model rationale, reaper risks, intentional-friction question, workaround best-practices. CC8 dependency — install awaits deepening land. |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| (Empty at sprint open. Will populate with decisions from CC2 (ADR-vs-operational-decisions log) and CC3 (CLAUDE.md tier doc placement details) as work progresses.) | — | — |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Done — Sprint 0c0.5

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
- Sprint 0c0.5 retrospective at close: `docs/retrospectives/lift-track-sprint-retro-0c0.5.md`
- Next sprint's kanban (after 0c0.5 close): `docs/lift-track-kanban-sprint-0c1.md`
- Methodology: `docs/CONVENTIONS_v0.2.4.md` §14 (will bump to v0.2.4 in CC1 if structural)
- Bindfs research: `reach4all://docs/research/cowork-dispatch-bindfs-git-lock-fix-research.md`
- Failure-modes research: `reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md`

---

© 2026 Eric Riutort. All rights reserved.
