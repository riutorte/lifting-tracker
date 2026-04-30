---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-23
tier: OPERATIONAL
content_class: operational
---

# XRSize4 ALL / Lifting Tracker — Kanban

Live work tracker across all Claude sessions (Dispatch, Code, Chrome, other). Dispatch maintains this file continuously; `## Other Session Work` is updated manually by Eric with anything Dispatch can't see.

**Sprint numbering.** Sprint 0x (0a, 0b, ...) for pre-programming phases. Sprint 1+ for programming. The existing `lift-track-roadmap_v0.4.0.md` "Sprint 0 — Foundation" will be re-numbered to Sprint 1 when that work lands.

**CM integration.** Planned. Once the `document-cm` skill is built, kanban moves under its workflow — add as Q12 to `docs/reference/lift-track-source-document-cm_v0.3.0.md` Section 10 in the next revision (how kanban updates flow through CM: skill-invoked on status change? Manual? Hook on commit? TBD).

**Tier:** OPERATIONAL. Date-based versioning per CM design §2.2; no semver on this file.

---

## Current Sprint — Sprint 0a — Foundation Research & CM Design

**Dates:** 2026-04-21 → ongoing

**Final stack (decided 2026-04-23):**

- Backend: Supabase self-hosted on Railway (Postgres + Auth + Realtime + Storage + Edge Functions)
- Local store: expo-sqlite + Drizzle ORM
- Sync: custom Supabase sync adapter (BYO, single-user-per-device pattern)
- State / server cache: TanStack Query
- Styling: NativeWind
- Auth: Supabase magic-link MVP, OAuth rails (Apple + Google) post-MVP
- Language: TypeScript with TC39 Type Annotations as open-standards escape hatch
- Observability: HyperDX OSS (MIT) self-hosted on Railway
- Hosting: Railway (all self-hosted services as Docker containers)
- Research repo: Reach4All (Sprint 0b week 1)
**Close criteria:** CM design approved (after validated-review incorporation), stack validation decisions made, ready to scope Sprint 0b (skill build + Concept agent refactor).
**Goal:** Validate stack and CM approach against current online sources; import Concept agent suite; design `document-cm` skill; prepare for implementation phases.

### In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| Claude Code internals research (retry) | Dispatch → Cowork task `local_a596636d` | 2026-04-23 | Extract architectural insights from publicly-available deobfuscated `@anthropic-ai/claude-code` source. Targets: content-drop mechanics, CLAUDE.md hierarchy resolution, skill/subagent/hook internals, prompt composition, workflow patterns. Scope expanded: also informs code-cm design, application build process, engineering-process patterns. Output: `reach4all://docs/research/claude-code-internals-findings.md`. Multi-hour. Retry — first attempt (`local_d32ec2e8`) hit API stream timeout. Gates CM brief v0.3.0 spawn. |
| Context-hub research | Dispatch → Cowork task `local_8fd58e09` | 2026-04-23 | Analyze Andrew Ng's `andrewyng/context-hub`. Questions: architecture, content-preservation mechanisms, context layering (CLAUDE.md parallel?), governance primitives (WF-003 parallel?), extensibility, MCP comparison. Output: `reach4all://docs/research/context-hub-platform-findings.md` with alignment map (ALIGNED / EXTENDS-US / CONTRADICTS / NEUTRAL) against our open problems. Also feeds CM brief v0.3.0. |
| Workato research | Dispatch → Cowork task `local_779c7f12` | 2026-04-23 | Analyze Workato (enterprise iPaaS + AI agent platform). Questions: object model (recipes, connectors, triggers), runtime, versioning/CM, observability, reliability, AI agent primitives, connector-vs-MCP comparison, citizen integrator model. Output: `reach4all://docs/research/workato-findings.md` with alignment map against our open problems. Informs WF-001..WF-006 design, Concept agent refactor, CM baseline, MCP strategy, XRSize4 ALL cross-cutting services. |
| Agentic AI landscape scan | Dispatch → Cowork task `local_48b77239` | 2026-04-23 | Parallel to Eric's Gemini Deep Research query — breadth-first landscape scan of agentic-AI discussion sources across Anthropic / OpenAI / Google / Perplexity / xAI / open-source / academic / community ecosystems. Source types: docs, blogs, cookbooks, code repos, courses, books, podcasts, forums, papers, benchmarks, standards, aggregators. Target 80-150 distinct sources with quality signal and "why it matters" per entry. Output: `reach4all://docs/research/agentic-ai-landscape-scan.md`. Comparison artifact — Gemini's output will be overlaid to spot gaps/agreements/disagreements. |
| ChatGPT agentic AI research | Dispatch → Cowork task `local_edfdb2c1` | 2026-04-23 | Via Claude in Chrome: access Eric's active ChatGPT chat (`69ea1d4a`) and share link (`69ea1f28`), extract existing research, optionally send up to 3 gap-closing follow-ups. Output: `reach4all://docs/research/chatgpt-agentic-ai-findings.md`, mirrored schema against Cowork landscape scan for direct diff. Anti-contamination rule: do NOT feed ChatGPT our Cowork findings. |
| Gemini agentic AI research | Dispatch → Cowork task `local_00b4cf77` | 2026-04-23 | Two inputs: (a) `~/Downloads/agentic_ai_report_v2.pdf` (Eric's Safari Gemini Deep Research export), (b) fresh Gemini Deep Research run via Claude in Chrome. Merge both into `reach4all://docs/research/gemini-agentic-ai-findings.md` with PDF-only / Chrome-only / both provenance tags per source. Completes the four-way comparison set: Gemini-PDF + Gemini-Chrome + ChatGPT + Cowork. |
| Grok agentic AI research | Dispatch → Cowork task `local_b5eba0d6` | 2026-04-23 | Via Claude in Chrome: access Grok (grok.com or x.com/i/grok), use DeepSearch mode if available, virgin prompt. Output: `reach4all://docs/research/grok-agentic-ai-findings.md`, schema-mirrored with the other research-system findings docs. Extends the comparison set to five systems: Gemini-PDF + Gemini-Chrome + ChatGPT + Cowork + Grok. |
| Gartner AI-native SWE review | Dispatch → Cowork task `local_fc4bb7fc` | 2026-04-23 | Four screenshots (IMG_5428-5431) of Gartner 844801: AI-Native SWE L1-L5 maturity framework + AI Exposure Heatmap + Actions-and-Cautions playbook. Identify publication, paraphrase framework (copyright discipline — Gartner IP), self-position Eric's practice on L1-L5, map heatmap + playbook to Concept / XRSize4 ALL. Output: `reach4all://docs/research/gartner-ai-native-swe-review.md`. |
| AI productivity + DataOps paper | Dispatch → Cowork task `local_08f447c0` | 2026-04-23 | Eleven screenshots (IMG_5432-5442) of an ~12-page study on AI productivity in SDLC and DataOps, GitLab-centric. Identify publication, paraphrase content, benchmark Eric's solo+AI setup against typical productivity boosts, audit GitLab-vs-GitHub generalization, map DataOps blueprint to Supabase/Lifting Tracker, surface baselining metrics Eric could adopt. Output: `reach4all://docs/research/ai-productivity-sdlc-dataops-review.md`. |
| Frontier models catalog | Dispatch → Cowork task `local_e7c2574e` | 2026-04-23 | Current (April 2026) catalog of frontier LLMs across 12-15 labs (Anthropic, OpenAI, Google, Meta, xAI, Mistral, Cohere, DeepSeek, Qwen, Kimi, Baidu, Zhipu, IBM, Nova, Phi). Schema per model: name, lab, release date, positioning, modalities, context window, API availability, pricing tier, known-for, benchmarks, weight license. Freshness-stamped (valid-as-of, re-check-by). Output: `reach4all://docs/research/frontier-models-catalog.md`. |
| What are agents research | Dispatch → Cowork task `local_3d54a6ac` | 2026-04-23 | Grounding reference: what is an agent? Identify Bornet's recent book as primary, compare to academic canon (Russell & Norvig, Wooldridge & Jennings, Sutton & Barto), lab definitions (Anthropic, OpenAI, Google, others), analyst framings (Gartner, Forrester), and philosophical grounding. Synthesis + proposed working definition compatible with D19, Authority Rule, 16-agent Concept suite. Output: `reach4all://docs/research/what-are-agents.md`. |
| GitHub pay-to-play research | Dispatch → Cowork task `local_e89deede` | 2026-04-23 | Assess whether MS is materially turning GitHub into pay-to-play, for a solo+AI dev profile. Concrete pricing changes since 2023, Copilot pricing evolution (premium requests / token-metering), free-tier restrictions, MS acquisition pattern (LinkedIn/Skype/Nuance), migration tooling state. Output with specific timeline recommendation (months, not "eventually"). `reach4all://docs/research/github-pay-to-play-assessment.md`. LANDED 2026-04-23: target decisive migration 9-15 months (Jan-July 2027); outside edge Q4 2027. |

### In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| Source-doc CM design brief | `docs/reference/lift-track-source-document-cm_v0.3.0.md` (1,607 lines, v0.2.0) | 18 ADD-NOW items incorporated, 12 DEFER-FUTURE, 3 DECLINE. v0.3.0 revision task deliberately HELD — awaiting Claude Code internals research findings so both Anthropic patterns + internals findings roll into one revision pass. |
| Stack validation report | `reach4all://docs/research/lifting-tracker-stack-validation.md` (641 lines) | 4 stack-impact calls: offline-first RECONSIDER (PowerSync recommended over WatermelonDB), Auth SOFTEN (add OAuth rails), State ADD TanStack Query, Styling SOFTEN (NativeWind perf validation or Unistyles v3). |
| CM design validated review | `reach4all://docs/research/source-doc-cm-design-validated-review.md` (506 lines) | 29 gaps (26 original + G27–G29 added). 3 must-fix (G7 rollback, G11 secrets, G24 evals), 15 should-incorporate, 6 nice-to-have, 5 decline. Three clusters collapse to single motions. ~2 days writing + 0.5 day CI to close must-fix + should-incorporate. |
| Agentic AI Bible findings | `reach4all://docs/research/agentic-ai-bible-findings.md` (369 lines) | Proposes new Q11 (evaluation harness) in CM design §10. 3 paywalled gaps flagged. |
| Anthropic engineering patterns review | `reach4all://docs/research/anthropic-engineering-patterns-review.md` (600 lines) | Workflow patterns Dec 2024 → Apr 2026 re-examined. Key finding: XML-tagged markdown workflows are prompt-chaining monolithic variant (deviation from canonical chained pattern but not forbidden). Feeds CM v0.3.0. |
| Building Agentic AI Systems findings | `reach4all://docs/research/building-agentic-ai-systems-findings.md` (521 lines) | Biswas & Talukdar (Packt 2025) mapped to our work: 6 ALIGNED, 5 EXTENDS-US, 4 CONTRADICTS. Key finding: TravelEpisode Pydantic schema portable to `ai_interactions` table. |
| Managed policy research | `reach4all://docs/research/managed-ai-policy-platforms-research.md` (1,310 lines) | Corrects macOS path (`/Library/Application Support/ClaudeCode/CLAUDE.md`, not `/etc/claude-code/`). Recommends `managed-settings.json` for tool/permission policy. Three-layer pattern (CLAUDE.md norm → pre-commit hook → CI check) for 5 of 7 controls. Tier 1 setup worth it when Fernando joins. |
| April 10 session analysis | `reach4all://docs/research/concept-computing-april-10-failure-analysis.md` | 14 pre-April-10 share URLs integrated chronologically (1 fetch failed: `f0492d52` — needs re-share). Key discovery: share `21c654fa` IS the April 10 session itself (548 turns ≈ 546-turn local archive). 13 failure patterns, 35+ user interventions, decisions provenance-traced, compound pivot trigger identified, three-tier severity synthesis with hard requirements for CM brief v0.3.0. |

### Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| D25 ADR — Source-Document CM | CM design v0.3.0 approval | Design must land before ADR can reference it. |
| D26 Language decision | Your review of stack-validation TypeScript verdict | Finding: CONFIRM with TC39 Type Annotations as open-standards escape hatch. |
| Tier 1 CLAUDE.md hierarchy cleanup (unify Cowork + CLI globals, reconcile layered files) | Stack validation done — waiting your go | Orthogonal to research outcomes; safe to proceed whenever. User memory already fixed 2026-04-22 (stale pre-pivot archived). |
| `document-cm` skill implementation | CM design v0.3.0 approval | 2–4 hours of Code work once green-lit. |
| `.cm/manifest.yaml` for Lifting Tracker | Skill implementation | Created during skill rollout. |
| Concept agent refactor (16 → surviving + replaced + dropped) | Skill implementation + Claude Code internals findings | Target forms being re-evaluated pending internals research. Visibility argument means more agents may stay than originally projected. |
| Data merge — 11 April 2026 sessions from `data/merge_2026-04-14.txt` | Standalone — not actually blocked | Can spawn `claude -p` one-shot whenever you want. |
| `README.md` at Lifting Tracker root | Sprint-defer | Good hygiene, not on critical path. |
| `CHANGELOG.md` at Lifting Tracker root | Sprint-defer | Same. |
| `lift-track-dispatch-handoff_v0.1.0.md` update | Sprint 0a close | Rewrite to reflect current state when we close this sprint. |

### Backlog (in-sprint, not yet picked up)

- Architecture.md updates from stack validation (D8 soften, add D19 context strategy paragraph, add D25 CM when approved, potentially D26 language).
- `docs/lift-track-risks_v0.1.0.md` lightweight risk register (CM design §7 recommended at Sprint 0b start).
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
- **2026-04-22** — `docs/kanban-sprint-<id>.md` created (this file).
- **2026-04-22** — Anthropic engineering patterns review delivered (600 lines).
- **2026-04-22** — Building Agentic AI Systems findings delivered (521 lines).
- **2026-04-22** — Managed policy research delivered (1,310 lines).
- **2026-04-22** — User memory `~/.claude/CLAUDE.md` fixed (90 lines; stale pre-pivot archived to `~/.claude/archive/CLAUDE.md.pre-2026-04-23`).
- **2026-04-22** — Concept bundle committed (`4450a02`): 37 untracked + 4 modified from `~/Concept/` landed.
- **2026-04-22** — Source-doc CM design brief revised to v0.2.0 (1,607 lines; 18 ADD-NOW gaps + Anthropic patterns + Q11–Q13 integrated).
- **2026-04-23** — April 10 session analysis delivered (`reach4all://docs/research/concept-computing-april-10-failure-analysis.md`). 14 pre-April-10 share URLs integrated chronologically; 13 failure patterns; decisions provenance-traced; CM v0.3.0 hard requirements identified.
- **2026-04-23** — Four governance decisions locked: CM approval model Eric-only manual; no CI mechanical gate (WF-003 Step 6 GATE is sole approval); no GitHub signed-commits enforcement on main; Option B tags only (signed baseline tags, autonomous Claude Code commits). Saved to memory as `project_cm_approval_model.md`.
- **2026-04-23** — Claude Code internals research first attempt (`local_d32ec2e8`) failed to API stream timeout; retry (`local_a596636d`) spawned with incremental-save, Chrome-based share URL fetch, and batched research questions.

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
- **Sprint 0c — (TBD).** Candidates: D19 context strategy update, data merge, CLAUDE.md hierarchy cleanup, NFR tier formalization, risk register, stack validation findings landed in lift-track-architecture_v0.4.0.md.
- **Sprint 1 — Foundation** (was `lift-track-roadmap_v0.4.0.md` "Sprint 0 — Foundation"). Expo + Supabase scaffold, auth, schema. Renumbered from original Sprint 0 because this doc's Sprint 0 is pre-programming.

---

## Conventions

- **One session owner per card.** If two sessions coordinate, one holds, the other is noted.
- **Status inline in chat** at major handoff points (new card, completion, blocker).
- **Sprint boundary = explicit close.** New section header; carry-over cards moved deliberately.
- **Eric owns Other Session Work section.** Dispatch does not guess what other sessions did.
- **Tier: OPERATIONAL.** Date-based versioning; no semver.

---

© 2026 Eric Riutort. All rights reserved.
