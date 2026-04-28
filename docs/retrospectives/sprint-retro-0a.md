---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
tier: OPERATIONAL
content_class: operational
sprint: 0a
sprint_name: Foundation Research & CM Design
sprint_dates: 2026-04-21 → 2026-04-23
duration_days: 3
---

# Sprint 0a Retrospective — Foundation Research & CM Design

**Dates:** 2026-04-21 → 2026-04-23 (3 days)
**Goal:** Validate stack and CM approach against current online sources; import Concept agent suite; design `document-cm` skill; prepare for implementation phases.
**Close criteria:** CM design approved; stack validation decisions made; ready to scope Sprint 0b.

## Outcome

All three close criteria met. CM brief v0.3.0 approved. Full stack locked. Sprint 0b scoped. Closed 2026-04-23 with final CM brief amendment running.

## Stats

- Duration: 3 days
- Tasks spawned: ~25
- Research docs delivered: ~25 (total ~15,000 lines across `docs/reference/`)
- Q-decisions resolved: 20 (Q1–Q20)
- D-number decisions: 4 (D8 revised, D26 TypeScript, D27 multi-agent interop promoted, Tier 2 concern log added to D19)
- Stack-validation calls resolved: 4 (offline-first, auth, state, styling)
- Governance decisions locked: 4 (approval model, signed-commits, native-tools, research-repo)
- Content-drop incidents during the sprint: 2 (both caught in verification, zero lost to production)
- Stream timeouts on long-running tasks: 3 (all recovered via retry with batched + incremental save)
- Memory files added / updated: 5 (voice-to-text, plain-text lists, risk-vs-ops, no-fatigue-projection, sprint-cadence-days, CM approval model, research-repo, collaborators, sprint-cadence-days)

## Artifacts delivered

Research docs (in `docs/reference/` at sprint close; migrating to Reach4All in Sprint 0b):

- community-research.md
- best-practices-review.md
- stack-validation.md
- source-doc-cm-design.md (v0.2.0 → v0.3.0, amended)
- source-doc-cm-design-validated-review.md
- agentic-ai-bible-findings.md
- anthropic-engineering-patterns-review.md
- building-agentic-ai-systems-findings.md (Ch 4 + Ch 7 focused pass appended)
- managed-policy-research.md
- april-10-session-analysis.md
- context-hub-findings.md
- workato-findings.md
- claude-code-internals-findings.md
- agentic-ai-landscape-scan.md (Cowork, 300 sources)
- chatgpt-agentic-ai-findings.md
- gemini-agentic-ai-findings.md
- grok-agentic-ai-findings.md
- frontier-models-catalog.md
- what-are-agents.md
- github-pay-to-play-assessment.md
- electricsql-assessment.md
- mobile-app-db-landscape.md
- observability-backend-assessment.md
- gartner-ai-native-swe-review.md
- ai-productivity-sdlc-dataops-review.md

Operational docs:

- docs/kanban-sprint-<id>.md
- docs/metrics_v0.1.0.md
- docs/orchestration_v0.1.0.md
- docs/retrospectives/sprint-retro-0a.md (this file)

External work:

- Concept bundle imported and committed (4450a02) in `~/Concept/`

## What worked

- **Content-drop mystery solved.** Claude Code internals research identified `micro_compact` as root cause. Four defenses specified (Fresh-Read, post-mutation verify, 20K pre-flight, baselines). Codified in CM v0.3.0 §5.7.
- **Five-way landscape comparison executed.** Cowork + ChatGPT + Gemini-PDF + Grok + Safari. Schema-mirrored outputs so diff is mechanical.
- **Composite principle emerged and held.** "MCP-able + self-hostable + not-SaaS + AI-native friction" — applied consistently to DB, VCS, observability, sync. Gave us a coherent filter for tool selection.
- **Trust-but-verify reframe stuck.** Eric's call on the 16 Concept agents (keep all, measure, deprecate only on evidence) caught a premature-replacement instinct. Better governance, lower transition risk.
- **Scope-creep → continuous-research reframe.** When Eric said landscape scans weren't creep, the architectural move was right: Reach4All as portfolio-level concern with its own CM profile.
- **Autonomous decision velocity.** ~25 research docs + 20 Q-decisions + 4 stack calls + Sprint close in 3 days. No task required more than one retry after the batched + incremental-save pattern was adopted.
- **Governance locks.** Eric-only manual GATE, no CI gate, no signed commits on main, Option B tags, single approver — written to memory so future sessions don't re-litigate.

## What didn't work

- **Repeated tool-landscape misses.** PowerSync Open Edition existed; initial framing said "PowerSync is SaaS." ElectricSQL wasn't in the first stack-validation pass. SQLite + Drizzle wasn't surfaced until Eric pushed three times. Pattern: converging on 2-3 options too early instead of enumerating 5-10 upfront.
- **Didn't consult Concept Computing stack before proposing alternatives.** Proposed Forgejo for VCS when Gitea was already named in `ConceptComputing_v056.md` §16. Eric had to point at his own architecture to correct.
- **Pre-AI time estimates leaked in.** Said WatermelonDB was "2–4 weeks"; Eric corrected to 3–6 days under solo+AI. Later in the same sprint, wrote "Week 1 / Week 2" for Sprint 0b scope despite Sprint 0a itself running 3 days. Bias saved to memory as `feedback_sprint_cadence_days`.
- **Fatigue projection onto Eric, repeatedly.** Memory file existed and was violated at least twice in-sprint.
- **Stream timeouts on first runs.** Anthropic patterns re-examination, Claude Code internals first attempt, Gemini-Chrome. All recovered via batched + incremental-save retry. The lesson: small parallel batches by default.
- **Zombie sessions.** `local_d32ec2e8` stayed "running" in `list_sessions` after API stream death. No Dispatch tool to force-kill; Eric had to stop from desktop UI.
- **CM brief initial 16-agent mapping was wrong.** Proposed 9-replaced / 5-MCP / 2-skills BEFORE Eric's trust-but-verify call. Required amendment.
- **Copyright discipline caught one miss.** Gartner section of CM brief had a 25-word quote that needed paraphrasing on final verification. Process worked; the near-miss is worth naming.
- **Research depth varied with system.** Gemini-Chrome empty (auth wall). ChatGPT rate-limited mid-follow-up. Grok blocked from DeepSearch. Comparison set is honest about asymmetry but the comparison itself is less clean than planned.

## What to improve in Sprint 0b

1. **Verify against Eric's existing architecture FIRST.** Read `ConceptComputing_v056.md` §16 + `architecture_v0.4.0.md` D1–D27 before proposing any tool alternative. Default assumption: Eric has already solved this.
2. **Enumerate broader, converge later.** For any tool decision, surface 5–10 options with license and posture before narrowing.
3. **Default to solo+AI time math.** Compute every estimate against Claude Code doing the work. Sprints are measured in days.
4. **Check memory files BEFORE making recommendations about Eric's style.** Not after he pushes back. Load `feedback_*.md` into reasoning on every judgment call.
5. **Small parallel batches by default.** 2–3 parallel WebFetches max, sequential synthesis.
6. **Trust-but-verify for existing systems.** When Eric's architecture has a working answer, the first move is "keep + instrument," not "replace with native equivalent."
7. **Pre-commit a verification pass on every substantive recommendation.** Does the tool exist as advertised, does it meet the composite principle, has the project done what I think it has.
8. **More honest estimates with uncertainty bands.** "5–8 days under solo+AI" is more useful than "5 days" when sync-protocol edge cases haven't been verified.

## Key takeaways

1. Content drops aren't a discipline problem — they're a compaction problem. Now-fixable with Fresh-Read Discipline + post-mutation verify + 20K-token pre-flight + baseline snapshots.
2. "Most commonly used" and "composite principle aligned" can compose (Railway + Supabase self-hosted + SQLite + Drizzle is both canonical AND principle-pure).
3. Eric's pushback loop is the highest-leverage QA mechanism. My job is to make it unnecessary more often.
4. 16 agents should stay until evidence says otherwise. The native-primitive-replacement urge is premature optimization.
5. Trust-but-verify generalizes beyond agents — applies to tools, patterns, and architectural decisions.
6. Sprint cadence is days, not weeks. Pre-AI time math is stale.

## Memory updates from this sprint

Files added or updated in `~/Library/Application Support/Claude/local-agent-mode-sessions/.../agent/memory/`:

- `feedback_voice_to_text.md` — silently auto-correct voice-to-text artifacts
- `feedback_plain_text_lists.md` — mobile copy-paste friendly lists
- `feedback_risk_vs_ops_discipline.md` — selective enterprise rigor
- `feedback_no_fatigue_projection.md` — don't project fatigue onto Eric
- `feedback_sprint_cadence_days.md` — sprints are days not weeks
- `project_collaborators.md` — Fernando (CM collaborator) vs Ethan (LT coach user)
- `project_cm_approval_model.md` — Eric-only manual GATE
- `project_research_repo.md` — Reach4All as portfolio-level concern

## Sprint 0b — scoped

Goal: stand up infrastructure so implementation can begin. Estimated 2–4 days.

**Day 1:**
1. Reach4All repo creation + migrate research docs from `lifting-tracker/docs/reference/`
2. `architecture_v0.4.0.md` consolidated updates (D8 revision, D19 Tier 2 concern log, D26 TypeScript, D27 multi-agent interop, MCP-first principle, three-layer data story, Railway hosting, HyperDX observability)
3. D25 ADR — Source-Document CM

**Day 1–2:**
4. `docs/risks_v0.1.0.md` creation
5. `document-cm` skill implementation
6. `.cm/manifest.yaml` for Lifting Tracker

**Day 2–3:**
7. Pre-commit + PreToolUse hooks per Q13 C (belt-and-suspenders)
8. Trust-but-verify instrumentation framework

Sprint 0c opens on 0b close with Supabase self-hosted setup, Lifting Tracker scaffold, and HyperDX deployment.

---

© 2026 Eric Riutort. All rights reserved.
