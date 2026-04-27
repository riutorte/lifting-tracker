---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
tier: OPERATIONAL
content_class: operational
version: 0.1.0
status: accepted
---

# XRSize4 ALL — Risk Register

## 1. Purpose

Living risk register for the XRSize4 ALL portfolio (Lifting Tracker, Concept Computing, Reach4All, shared orchestration). Each risk is concrete, named, and traceable to a specific research doc, retrospective finding, or stated architectural reality. Reviewed at every sprint close — likelihoods and impacts re-scored, new risks added, mitigated/closed risks moved to section 4. This is not ISO-31000 theatre; it is the ongoing record of known exposures at solo+AI scale.

## 2. Scoring model

Each risk is scored on two axes:

- **Likelihood** — L (unlikely in current sprint horizon), M (plausible within next 1–3 sprints), H (already happening or expected this sprint).
- **Impact** — L (annoyance / partial rework), M (sprint-level rework or material schedule slip), H (blocks a sub-system or forces architectural pivot).

**Severity matrix:**

- L × L → Low
- L × M or M × L → Low-Medium
- M × M, L × H, or H × L → Medium
- M × H or H × M → High
- H × H → Critical

**Status values:** open / mitigated / accepted / closed.

**Cadence:** reviewed every sprint close at minimum. A risk moving from Medium to High is flagged in the kanban and the next retrospective. A risk entering Critical halts related work and is brought to the next planning conversation.

## 3. Active risks

### 3.1 Content integrity (CI)

| ID | Name | Likelihood | Impact | Severity | Owner | Mitigation | Status | Last reviewed | Source |
|---|---|---|---|---|---|---|---|---|---|
| R-CI-01 | Content drops via micro_compact during document writes | H | M | High | Eric | Fresh-Read before every Edit/Write; post-mutation re-Read and diff; baseline snapshots at session start; 20K-token pre-flight. Codified in CM v0.3.0 §5.7 (four defenses). | open | 2026-04-24 | docs/reference/claude-code-internals-findings.md; docs/retrospectives/sprint-0a.md (2 incidents, zero lost to prod) |
| R-CI-02 | 25K-token Read ceiling throws on large docs (MaxFileReadTokenExceededError) | M | M | Medium | Eric | Refuse Write on docs > ~20K tokens; force plan-then-Edit path on overflow. Named at-risk today: source-doc-cm-design.md (1,607 lines), architecture_v0.4.0.md, themes-epics-features_v0.2.0.md, user-stories_v0.2.0.md. | open | 2026-04-24 | docs/reference/claude-code-internals-findings.md |
| R-CI-03 | Read dedup returns stubs (~18% hit rate) — re-reading is not a refresh | M | L | Low-Medium | Eric | Treat Read result as stub if size <200 bytes on an unchanged-file window; force a separate invalidating read (different path/mtime) when precision matters. Killswitch exists but is not user-controllable. | open | 2026-04-24 | docs/reference/claude-code-internals-findings.md |
| R-CI-04 | Self-reported verification is untrustworthy ("X/X executed" claims) | H | M | High | Eric | Verification must come from a separate actor (different agent, test, or human) or a structural artifact (diff, hash). Never accept the chain's own pass-count as success. | open | 2026-04-24 | reach4all://docs/research/concept-computing-april-10-failure-analysis.md §3.6 |

### 3.2 Tooling and vendor (TV)

| ID | Name | Likelihood | Impact | Severity | Owner | Mitigation | Status | Last reviewed | Source |
|---|---|---|---|---|---|---|---|---|---|
| R-TV-01 | GitHub pay-to-play migration window closes (9–15 month horizon from 2026-04-23) | M | H | High | Eric | Active migration target Feb 2027 – Jul 2027; cutover no later than end Q4 2027. Monitor six named tripwires quarterly; any two firing together accelerates the timeline. Discussions, OAuth apps, secrets are non-portable — plan recreation, not export. | open | 2026-04-24 | docs/reference/github-pay-to-play-assessment.md (next review 2026-07-23) |
| R-TV-02 | ElectricSQL not production-ready for Lifting Tracker RN client | M | M | Medium | Eric | HOLD per Sprint 0a decision. MVP uses expo-sqlite + Drizzle + TanStack Query + custom Supabase sync adapter (D8 revised). Re-check at 2026-07-23 against four named tripwires (libpglite RN, first-party bidirectional write-path, TanStack DB stability, Supabase offline story). | mitigated | 2026-04-24 | docs/reference/electricsql-assessment.md; docs/architecture_v0.4.0.md D8 |
| R-TV-03 | ClickHouse Inc. relicenses HyperDX (AGPL/SSPL/BSL event) | L | H | Medium | Eric | Fallback: SigNoz (MIT core). Quarterly LICENSE file check; tag known-good MIT commit; fork-readiness posture. Pattern: Grafana 2021, Elastic 2021, HashiCorp 2023, Redis 2024, MongoDB 2018. | open | 2026-04-24 | docs/reference/observability-backend-assessment.md (re-check 2026-07-23) |
| R-TV-04 | HyperDX React Native SDK abandonment (@hyperdx/otel-react-native, last published Jan 2025) | M | L | Low-Medium | Eric | 50-line refactor path to raw @opentelemetry/sdk-trace-web + OTLP exporter. SDK is a convenience, not a moat. | open | 2026-04-24 | docs/reference/observability-backend-assessment.md |
| R-TV-05 | Railway / Supabase commercial-terms change (pricing, free-tier removal, ToS drift) | M | M | Medium | Eric | Docker-first posture — applications remain portable images. Named migration targets: Hetzner, Fly, self-hosted Kubernetes, Supabase self-host (already the chosen config). Commitment is to Docker, not to Railway. | mitigated | 2026-04-24 | docs/architecture_v0.4.0.md (Hosting posture); docs/reference/workato-findings.md |
| R-TV-06 | ClickHouse itself relicenses (systemic — affects HyperDX, SigNoz, Uptrace simultaneously) | L | H | Medium | Eric | Watch MongoDB-2018-style signal from ClickHouse Inc.; observability-backend fallback plan would need re-plotting. No immediate swap target. | open | 2026-04-24 | docs/reference/observability-backend-assessment.md |

### 3.3 Orchestration (OR)

| ID | Name | Likelihood | Impact | Severity | Owner | Mitigation | Status | Last reviewed | Source |
|---|---|---|---|---|---|---|---|---|---|
| R-OR-01 | Stream timeouts on long-running research tasks | H | L | Medium | Eric | Small parallel batches by default (2–3 WebFetches max); batched + incremental-save pattern on retry (Sprint 0a: 3 timeouts, all recovered). Sequential synthesis after parallel fetch. | mitigated | 2026-04-24 | docs/retrospectives/sprint-0a.md ("Stream timeouts on first runs") |
| R-OR-02 | Zombie sessions that cannot be programmatically killed | M | L | Low-Medium | Eric | No Dispatch tool to force-kill. Current recovery: desktop UI stop. Accept as known limitation until platform exposes a kill primitive. | accepted | 2026-04-24 | docs/retrospectives/sprint-0a.md (local_d32ec2e8 named) |
| R-OR-03 | Subagents cannot inherit parent context — redundant re-reads, lost state | M | M | Medium | Eric | Treat Task tool as one-shot lookup, not multi-step orchestrator. For cross-session state, use docs/ and memory files, not agent-to-agent handoff. Cowork-Claude Code context-movement gap is same root cause. | open | 2026-04-24 | docs/reference/claude-code-internals-findings.md |

### 3.4 Governance (GV)

| ID | Name | Likelihood | Impact | Severity | Owner | Mitigation | Status | Last reviewed | Source |
|---|---|---|---|---|---|---|---|---|---|
| R-GV-01 | Authority Rule compliance drift — user rubber-stamps Tier 2 without meaningful review | M | M | Medium | Eric | D19 Tier 2 concern log specified (time-to-accept, accept-without-modification rate, batch-accept patterns, divergence from actual outcomes). Instrumentation not yet built — see R-SD-01. | open | 2026-04-24 | docs/architecture_v0.4.0.md D19 (Tier 2 concern log added 2026-04-23) |
| R-GV-02 | Single-approver bus factor — Eric is the only manual GATE approver | M | H | High | Eric | Fernando named as second approver in project memory but not yet enabled. Onboarding Fernando is the mitigation (see R-PE-01). Until then, illness/absence halts all gated work. | open | 2026-04-24 | memory/project_cm_approval_model.md; memory/project_collaborators.md |
| R-GV-03 | 16-agent trust-but-verify requires empirical evidence to deprecate or keep | M | L | Low-Medium | Eric | Trust-but-verify instrumentation framework scoped in Sprint 0b Day 2–3. No agent deprecated without recorded evidence of native-primitive equivalence. Premature-replacement urge is the named failure mode. | open | 2026-04-24 | docs/retrospectives/sprint-0a.md ("Trust-but-verify reframe stuck") |
| R-GV-04 | CC-017 — governance step omission (Primer / GATE / Reporter skipped under content pressure) | H | M | High | Eric | Move orchestration out of in-context discipline and into code. PreToolUse hooks (exit code 2) rather than prose-in-CLAUDE.md. Collapse governance chain into one tool call; composition must be mechanical, not discretionary. | open | 2026-04-24 | reach4all://docs/research/concept-computing-april-10-failure-analysis.md §3.1, §9 Tier 1 |

### 3.5 Process (PR)

| ID | Name | Likelihood | Impact | Severity | Owner | Mitigation | Status | Last reviewed | Source |
|---|---|---|---|---|---|---|---|---|---|
| R-PR-01 | Pre-AI time-math bias leaks into estimates (weeks-not-days framing) | H | M | High | Eric | Default to solo+AI time math; sprints are days. Memory rule `feedback_sprint_cadence_days` loaded before any estimate. Use uncertainty bands ("5–8 days") not false precision. | open | 2026-04-24 | docs/retrospectives/sprint-0a.md ("Pre-AI time estimates leaked in"); memory/feedback_sprint_cadence_days.md |
| R-PR-02 | Fatigue projection onto Eric — Claude assumes exhaustion and softens recommendations | M | L | Low-Medium | Eric | Memory rule `feedback_no_fatigue_projection` must load before every session. Violated ≥2 times in Sprint 0a despite memory-file presence. Escalate to hook-enforced reminder if pattern persists. | open | 2026-04-24 | docs/retrospectives/sprint-0a.md ("Fatigue projection onto Eric, repeatedly"); memory/feedback_no_fatigue_projection.md |
| R-PR-03 | Tool-landscape misses — converging on 2–3 options before enumerating 5–10 | M | M | Medium | Eric | Enumerate broader, converge later. Named Sprint-0a misses: PowerSync Open Edition ("was SaaS"), ElectricSQL absent from first pass, SQLite + Drizzle needed three prompts. Verify against Eric's existing architecture FIRST. | open | 2026-04-24 | docs/retrospectives/sprint-0a.md ("Repeated tool-landscape misses") |
| R-PR-04 | Failure to consult existing Eric architecture before proposing alternatives | M | L | Low-Medium | Eric | Read `ConceptComputing_v056.md` §16 + `architecture_v0.4.0.md` D1–D27 before any tool-alternative proposal. Default assumption: Eric has already solved this. | open | 2026-04-24 | docs/retrospectives/sprint-0a.md (Forgejo-vs-Gitea example) |

### 3.6 Platform and third-party (PT)

| ID | Name | Likelihood | Impact | Severity | Owner | Mitigation | Status | Last reviewed | Source |
|---|---|---|---|---|---|---|---|---|---|
| R-PT-01 | Frontier model staleness in weeks — catalog valid 2 weeks max | H | L | Medium | Eric | 2-week re-check cadence (next: 2026-05-07). Any row without a recent verified-on date is suspect. Expect ≥1 new Chinese open-weight flagship per cycle. | open | 2026-04-24 | docs/reference/frontier-models-catalog.md |
| R-PT-02 | Mobile DB EOL pattern repeating — Realm Sync / Amplify v4 / PlanetScale / Replicache already landed | M | M | Medium | Eric | Composite-principle filter (MCP-able + self-hostable + not-SaaS + AI-native friction) held in D8 revision. Quarterly re-check against nine named tripwires (next: 2026-07-23). | mitigated | 2026-04-24 | docs/reference/mobile-app-db-landscape.md |
| R-PT-03 | Anthropic pricing / capability changes (model supersession, token-metered shifts) | M | M | Medium | Eric | Multi-agent interop promoted to first-class concern per D27; protocol choice deferred pending evidence. Claude Opus 4.6 superseded by 4.7 on 2026-04-16 as example of cadence. | open | 2026-04-24 | docs/architecture_v0.4.0.md D27; docs/reference/frontier-models-catalog.md |
| R-PT-04 | MCP protocol version churn — MCP-first strategy depends on stable protocol surface | L | M | Low-Medium | Eric | Anthropic owns the protocol; Workato Enterprise MCP + Cursor + Claude Code consumer base. Watch for breaking-change signals. D27 defers specific multi-agent protocol until evidence warrants. | open | 2026-04-24 | docs/architecture_v0.4.0.md (MCP-first principle); docs/reference/workato-findings.md |

### 3.7 Security and data (SD)

| ID | Name | Likelihood | Impact | Severity | Owner | Mitigation | Status | Last reviewed | Source |
|---|---|---|---|---|---|---|---|---|---|
| R-SD-01 | Tier 2 concern log not yet instrumented — D19 Authority Rule compliance not observable | H | M | High | Eric | Build `.cm/tier2-concerns.json` storage and signal collection during `document-cm` skill implementation (Sprint 0b Day 1–2). Without instrumentation, R-GV-01 drift is invisible. | open | 2026-04-24 | docs/architecture_v0.4.0.md D19 (Tier 2 concern log subsection) |
| R-SD-02 | Secrets management not portable pre-GitHub migration | M | M | Medium | Eric | GitHub encrypted secrets cannot be exported by design. Pattern: document every secret in a portable registry, plan recreation at migration, not export. Action deferred until migration window (see R-TV-01). | accepted | 2026-04-24 | docs/reference/github-pay-to-play-assessment.md ("Sticky migration risks") |

### 3.8 People (PE)

| ID | Name | Likelihood | Impact | Severity | Owner | Mitigation | Status | Last reviewed | Source |
|---|---|---|---|---|---|---|---|---|---|
| R-PE-01 | Fernando onboarding not yet scheduled — second approver not yet enabled | H | M | High | Eric | Named in memory as CM collaborator / second approver. Schedule onboarding conversation before Sprint 0c close. This is the direct mitigation for R-GV-02 (bus factor). | open | 2026-04-24 | memory/project_collaborators.md; memory/project_cm_approval_model.md |
| R-PE-02 | Ethan dependency — MVP testing requires one specific coach / first user | M | M | Medium | Eric | Ethan is the named Coach role in D7 alpha audience. No backup named. Plan a parallel independent-athlete test lane so schedule does not hinge on one external person. | open | 2026-04-24 | docs/architecture_v0.4.0.md D7, D10; memory/project_collaborators.md |

## 4. Mitigated / accepted / closed

| ID | Name | Status | Closed/changed on | Note |
|---|---|---|---|---|
| — | — | — | — | Empty at creation. Populated as risks land status changes. |

## 5. Review cadence

Every sprint close, every row in section 3 is revisited. For each: re-score likelihood and impact, update last-reviewed date, move status changes to section 4, add any new risks surfaced during the sprint. Aggregate statistics (count by severity, count by category, median age of open risks) are a candidate kanban widget but not yet instrumented.

**Next review:** 2026-04-27 (Sprint 0b close).

**Standing external re-check dates to align with:**

- 2026-05-07 — frontier-models catalog re-verify
- 2026-07-23 — GitHub, ElectricSQL, HyperDX/observability, mobile-app-db quarterly sweep

## 6. Escalation triggers

A risk moving from Medium to High on any axis (likelihood or impact) is flagged in the kanban within the same sprint close and raised in the next retrospective. A risk entering Critical halts related work and is brought to the next planning conversation before any further implementation on the affected sub-system. Risks with the same severity for three consecutive sprint closes are re-examined for whether they should be accepted (and moved to section 4) or promoted to active mitigation work.

---

© 2026 Eric Riutort. All rights reserved.
