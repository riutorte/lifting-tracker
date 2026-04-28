---
author: Eric Riutort
created: 2026-04-28
updated: 2026-04-28
tier: OPERATIONAL
content_class: operational
sprint: 0e
sprint_name: Scheduler + Listener + Custom-LLM Research
sprint_dates: TBD → TBD
status: draft
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0e)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0e's per-sprint kanban. **Drafted ahead of sprint open** during Sprint 0c1; finalized at the actual sprint-open commit when Sprint 0d closes. Frozen at sprint close as the immutable record.

## Sprint 0e — Scheduler + Listener + Custom-LLM Research

**Theme:** Stand up portfolio sensing capability — a pull-based scheduler running cron-driven research tasks, plus a push-based listener architecture with the first 3-5 high-priority feeds installed. Per CONVENTIONS_v0.2.4 §14.5 work modes 6 (scheduled cadence) + 8 (event-driven listener). In parallel, run the LLM-research stream that informs the eventual local-LLM build — model selection, fine-tuning posture, and system-prompt strategy for unrestricted research extraction.

**Dates:** TBD → TBD (estimated 3-5 days under solo+AI; three parallel workstreams)

**Goal:** Operational sensing layer — 17 cron-driven research tasks live and landing findings on schedule, 3-5 listeners watching the highest-priority external signals, custom-LLM research deliverable in reach4all that informs Eric's eventual local-LLM build decision (no external translation/quote constraints imposed on Eric's own LLM).

**Close criteria (3 items):**

1. NEW — Scheduler implementation: 17 cron-driven research tasks set up via `mcp__scheduled-tasks__create_scheduled_task`. Tasks run on Eric's host on cron schedules; findings land in `~/reach4all/docs/research/`. Five cadence tiers:
   - **Daily:** Anthropic news, frontier-model releases, AI coding-agent failure incidents, Claude Code release notes
   - **Weekly:** skill/MCP ecosystem, open-source AI tooling, Lifting Tracker tech stack, Anthropic Cowork/Dispatch product changes
   - **Bi-weekly:** vendor commercial-terms watch, GitHub pay-to-play indicators
   - **Monthly:** mobile DB landscape, observability backend ecosystem, Apple platform changes
   - **Quarterly:** DoDAF/UAF/OMG, IEEE/ISO/SEI standards, OWASP releases, DISA STIG updates
   Each task: prompt template, output destination, idempotency rule (don't re-land identical findings), failure-handling.
2. NEW — Listener / sniffer architecture: RSS-polling primary, GitHub webhook secondary. Architecture doc lands in `~/reach4all/docs/architecture/listener-architecture_v0.1.0.md` capturing the design (polling cadence, dedup strategy, signal-classification rule, intake-to-research handoff). First 3-5 high-priority listeners installed:
   - Apple App Store guideline changes
   - Anthropic news/blog/changelog
   - Vendor LICENSE-file commit watch on HyperDX, Railway, Supabase, ClickHouse
   - GitHub release watch on Anthropic `claude-code` repo + critical Lifting Tracker dependencies
   - CVE feeds for stack components (Expo, Supabase SDK, Postgres major versions, Node)
3. NEW — LLM research stream: model selection / fine-tuning / system-prompt strategy for unrestricted research extraction. Per Eric's call: a self-hosted LLM that Eric configures should not impose external translation/quote constraints. Anthropic's <15-word translated-quote rule applies to Claude outputs, NOT to a local LLM Eric runs. Research deliverable lands in `~/reach4all/docs/research/custom-llm-strategy-research.md` covering:
   - Open-weight model candidates (Llama, Qwen, Mistral, DeepSeek family — current as of sprint open)
   - Fine-tuning posture: base + LoRA vs base + system-prompt vs full fine-tune; cost/benefit
   - System-prompt strategy for research extraction without externally-imposed quoting/translation limits
   - Hardware sizing reconciled against the deferred hardware decision (M4 Mac mini vs WWDC defer vs cloud-rental validation)
   - Decision-trigger criteria — what observable conditions tip toward "build now" vs "keep renting cloud"

**Plus retro at close** — `sprint-retro-0e.md` (or `lift-track-sprint-retro-0e.md` per naming convention).

**Stretch (only if 1-3 land cleanly with capacity remaining):**

- Listener #6-10 expansion (Anthropic SDK changelogs, Expo SDK release notes, additional CVE feeds)
- First scheduled-task validation pass: confirm at least one daily and one weekly task has landed two cycles' worth of findings
- Cross-link the scheduler's research findings into the relevant listener feeds (close the loop between pull and push)

---

## Open-items migration from Sprint 0d

Per §14.2 inheritance rule. **To be populated at actual sprint open from Sprint 0d's close kanban per CONVENTIONS §14.2.** At draft time (Sprint 0d not yet open), the expected pattern is:

- Bring-forward items: any Sprint 0d close criteria that didn't fully close, plus the three items already pre-staged for 0e (scheduler, listener, custom-LLM research)
- Carry-forward backlog: any deferred items from 0c2 / 0d — likely the second/third rollback playbooks if they didn't land as 0d stretch, Concept-side manifest, trust-but-verify instrumentation framework, MCP installs, DoDAF cross-reference matrix
- Out-of-band: hardware purchase decision (may resolve post-WWDC), LLM cloud-rental validation results, `f0492d52` URL re-share

| Item | Source | Disposition |
|---|---|---|
| (Placeholder. Populate at 0e sprint-open commit by reviewing frozen `kanban-sprint-0d.md` Done / Open / Carry-forward state.) | — | — |

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

## Done — Sprint 0e

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

- Prior sprint's kanban (frozen at 0d close): `docs/kanban-sprint-0d.md` (or `docs/lift-track-kanban-sprint-0d.md`)
- Sprint 0d retrospective: `docs/retrospectives/sprint-retro-0d.md`
- Sprint 0e retrospective at close: `docs/retrospectives/sprint-retro-0e.md`
- Methodology: `docs/CONVENTIONS_v0.2.4.md` §14, §14.5 work modes 6 (scheduled cadence) + 8 (event-driven listener)
- LLM scoping prior research: `reach4all://docs/research/frontier-adjacent-local-llm-build-scoping-research.md` (Sprint 0c)
- Hardware research: `reach4all://docs/research/hardware-selection-research.md` (Sprint 0c)
- Anthropic translated-quote rule: applies to Claude outputs, not to Eric's self-hosted LLM (per Eric's call documented in this sprint's CC3)

---

© 2026 Eric Riutort. All rights reserved.
