---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-22
tier: OPERATIONAL
---

# XRSize4 ALL / Lifting Tracker — Kanban

Live work tracker across all Claude sessions (Dispatch, Code, Chrome, other). Dispatch maintains this file continuously; `## Other Session Work` is updated manually by Eric with anything Dispatch can't see.

**Sprint numbering.** Sprint 0x (0a, 0b, ...) for pre-programming phases. Sprint 1+ for programming. The existing `roadmap.md` "Sprint 0 — Foundation" will be re-numbered to Sprint 1 when that work lands.

**CM integration.** Planned. Once the `document-cm` skill is built, kanban moves under its workflow — add as Q12 to `docs/reference/source-doc-cm-design.md` Section 10 in the next revision (how kanban updates flow through CM: skill-invoked on status change? Manual? Hook on commit? TBD).

**Tier:** OPERATIONAL. Date-based versioning per CM design §2.2; no semver on this file.

---

## Current Sprint — Sprint 0a — Foundation Research & CM Design

**Dates:** 2026-04-21 → ongoing
**Close criteria:** CM design approved (after validated-review incorporation), stack validation decisions made, ready to scope Sprint 0b (skill build + Concept agent refactor).
**Goal:** Validate stack and CM approach against current online sources; import Concept agent suite; design `document-cm` skill; prepare for implementation phases.

### In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| Anthropic engineering patterns re-examination | Dispatch → Code task `local_e90bc5ed` | 2026-04-22 | Enumerate every Anthropic pattern from Dec 2024 through Apr 2026. Assess current XML-tagged markdown workflow approach + document-cm skill design vs canonical patterns. Output: `docs/reference/anthropic-engineering-patterns-review.md`. Multi-hour. Gates the CM v0.2.0 revision — findings may shape skill architecture. |

### In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| Source-doc CM design brief | `docs/reference/source-doc-cm-design.md` (1,259 lines) | Decisions captured: 18 ADD-NOW items, 12 DEFER-FUTURE, 3 DECLINE (includes G30 BOM + G31 STIG). v0.2.0 revision task pending — HOLDING spawn until Anthropic patterns re-examination lands, so both sets of findings incorporate in a single pass. |
| Stack validation report | `docs/reference/stack-validation.md` (641 lines) | 4 stack-impact calls: offline-first RECONSIDER (PowerSync recommended over WatermelonDB), Auth SOFTEN (add OAuth rails), State ADD TanStack Query, Styling SOFTEN (NativeWind perf validation or Unistyles v3). |
| CM design validated review | `docs/reference/source-doc-cm-design-validated-review.md` (506 lines) | 29 gaps (26 original + G27–G29 added). 3 must-fix (G7 rollback, G11 secrets, G24 evals), 15 should-incorporate, 6 nice-to-have, 5 decline. Three clusters collapse to single motions. ~2 days writing + 0.5 day CI to close must-fix + should-incorporate. |
| Agentic AI Bible findings | `docs/reference/agentic-ai-bible-findings.md` (369 lines) | Proposes new Q11 (evaluation harness) in CM design §10. 3 paywalled gaps flagged. |

### Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| D25 ADR — Source-Document CM | CM design approval (after validated review lands) | Design must land before ADR can reference it. |
| D26 Language decision | Your review of stack-validation TypeScript verdict | Finding: CONFIRM with TC39 Type Annotations as open-standards escape hatch. |
| Tier 1 CLAUDE.md cleanup (archive stale CLI global, unify Cowork + CLI) | Stack validation done — now waiting your go | Orthogonal to research outcomes; safe to proceed whenever. |
| `document-cm` skill implementation | CM design + validated review approval | 2–4 hours of Code work once green-lit. |
| `.cm/manifest.yaml` for Lifting Tracker | Skill implementation | Created during skill rollout. |
| Concept agent refactor (16 → 4 surviving + 10 replaced + 2 dropped) | Skill implementation | Target forms named in CM design brief §6. |
| Git commit: `~/Concept/` bundle import | Your review of what landed | 37 untracked + 4 modified. Includes v1/v3 bundle docs alongside existing v2/v4 (intentional, per your direction). |
| Data merge — 11 April 2026 sessions from `data/merge_2026-04-14.txt` | Standalone — not actually blocked | Can spawn `claude -p` one-shot whenever you want. |
| `README.md` at Lifting Tracker root | Sprint-defer | Good hygiene, not on critical path. |
| `CHANGELOG.md` at Lifting Tracker root | Sprint-defer | Same. |
| `dispatch-handoff.md` update | Sprint 0a close | Rewrite to reflect current state when we close this sprint. |

### Backlog (in-sprint, not yet picked up)

- Architecture.md updates from stack validation (D8 soften, add D19 context strategy paragraph, add D25 CM when approved, potentially D26 language).
- `docs/risks.md` lightweight risk register (CM design §7 recommended at Sprint 0b start).
- Q12 added to CM design §10 — kanban/CM integration.

### Done — Sprint 0a (this sprint)

- **2026-04-21** — All 13 `lifting-tracker/docs/*.md` read firsthand.
- **2026-04-21** — All 3 `docs/conversation-archive/*` read firsthand.
- **2026-04-21** — `~/Concept/CLAUDE.md`, `AgentSuiteReference_v4.md`, `DesignPrinciples_v3.md`, both migration plans read firsthand.
- **2026-04-22** — Concept bundle imported to `~/Concept/` (16 Python agents + 7 workflow MDs + 8 JSONs + 5 bundle MDs). 4 pre-existing JSONs backed up as `*_data.pre-bundle.json`.
- **2026-04-22** — Share conversation archived at `~/Concept/conversation-archive/2026-04-10_concept-session-share.txt` (290 KB, 546 turns).
- **2026-04-22** — Source-doc CM design brief delivered (1,259 lines).
- **2026-04-22** — Stack validation report delivered (641 lines).
- **2026-04-22** — CM design review first pass delivered (26 gaps from memory).
- **2026-04-22** — Agentic AI Bible findings delivered (369 lines).
- **2026-04-22** — CM design validated review delivered (506 lines, 29 gaps with HIGH/MED confidence + must-fix/should/nice/decline priority).
- **2026-04-22** — `docs/kanban.md` created (this file).

---

## Other Session Work (Eric-maintained)

_Dispatch cannot see what other Claude sessions have done. Eric fills this in when work happens in sessions outside Dispatch's orchestration._

**Known sessions Dispatch can see in `list_sessions` but does not own:**

| Session ID | Title | Last seen | What it did / is doing |
|---|---|---|---|
| `local_886ad5a1-ddc9-4664-875f-07df715e24b3` | Create dispatch session | running | _(Eric: fill in)_ |
| `local_3e4c2e1c-9e02-4ef8-b760-c0d51db5528b` | Review dispatch handoff documentation | idle | _(Eric: fill in)_ |
| `local_702ce9fe-b082-4c16-b9f2-cc9acd52ab5a` | Review dispatch handoff documentation | idle | _(Eric: second instance of same title; fill in)_ |
| `local_738fa51c-0b0c-40dc-b4c0-c8e1791412a6` | Plan ontology structure and design | idle | _(Eric: fill in)_ |

**Sessions Dispatch cannot see at all** — Chrome/mobile/other. Eric adds rows as needed.

| Description | Date | Outcome / status |
|---|---|---|
| _(empty — add as needed)_ | | |

---

## Future Sprints (placeholder — not committed)

- **Sprint 0b — CM + Skill Build.** Implement `document-cm` skill, manifest, hooks, CI/Actions, pre-commit. Refactor Concept agents. Lock D25.
- **Sprint 0c — (TBD).** Candidates: D19 context strategy update, data merge, CLAUDE.md hierarchy cleanup, NFR tier formalization, risk register, stack validation findings landed in architecture.md.
- **Sprint 1 — Foundation** (was `roadmap.md` "Sprint 0 — Foundation"). Expo + Supabase scaffold, auth, schema. Renumbered from original Sprint 0 because this doc's Sprint 0 is pre-programming.

---

## Conventions

- **One session owner per card.** If two sessions coordinate, one holds, the other is noted.
- **Status inline in chat** at major handoff points (new card, completion, blocker).
- **Sprint boundary = explicit close.** New section header; carry-over cards moved deliberately.
- **Eric owns Other Session Work section.** Dispatch does not guess what other sessions did.
- **Tier: OPERATIONAL.** Date-based versioning; no semver.

---

© 2026 Eric Riutort. All rights reserved.
