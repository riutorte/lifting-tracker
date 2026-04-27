---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
tier: OPERATIONAL
content_class: architecture
version: 0.1.0
status: draft
---

# AV-2 — Integrated Dictionary

## Purpose

Authoritative term registry for the XRSize4 ALL portfolio. AV-2 is the place every other view (and every other doc) cites when a term needs a definition. The dictionary is **living** — every sprint that introduces new D-numbers, sub-systems, agents, workflows, or content classes adds rows here.

The columns are deliberately narrow. Long-form definitions live in the source documents the dictionary points to; the entry below is a one-line gloss plus the citation. When the gloss and the source disagree, the source wins and the dictionary entry is wrong (flag it).

Three lookup conventions:

- **By term** — alphabetic within each section.
- **By identifier** — D-numbers (D1–D27), workflow IDs (WF-001–WF-006), risk IDs (R-CI-01, etc.), and US/feature/epic/theme IDs each have their own range.
- **By content class** — the "Class" column shows whether the term sits in the architecture, research, operational, or reference governance profile per CONVENTIONS_v0.2.2.md §2.

## Section 1 — Architectural decisions (D1–D27)

| Term | Definition (one-line gloss) | References | Class |
|---|---|---|---|
| D1 — Primary purpose: entry + analysis | Logging and progress analysis are equally first-class; "entering data without analysis is pointless." | architecture_v0.4.0.md §D1 | architecture |
| D2 — Per-set granularity | Data model stores individual sets; all stats derived from sets, not pre-computed. | architecture_v0.4.0.md §D2 | architecture |
| D3 — Hierarchical RBAC, one app | Single role-aware app; Athlete → Coach → Gym → Super Admin via inheritance. | architecture_v0.4.0.md §D3 | architecture |
| D4 — Cloud DB sole source of truth | Supabase Postgres is canonical; devices cache locally for offline. | architecture_v0.4.0.md §D4 | architecture |
| D5 — Seeded + extensible exercise library | Canonical seeded catalog; user-extensible with alias system. | architecture_v0.4.0.md §D5 | architecture |
| D6 — Real auth from day one | Magic-link email; no anonymous use. | architecture_v0.4.0.md §D6 | architecture |
| D7 — Closed 4–6 user alpha | Invite-only, named users. No self-serve signup in alpha. | architecture_v0.4.0.md §D7 | architecture |
| D8 — Expo + Supabase, offline-first | Single codebase iPhone + Web; offline-first via expo-sqlite + Drizzle + TanStack Query + custom Supabase sync adapter (Sprint 0a revision). | architecture_v0.4.0.md §D8 | architecture |
| D9 — Free in alpha, subscription later | No billing in alpha; `tier` field on users/orgs reserves room for it. | architecture_v0.4.0.md §D9 | architecture |
| D10 — Ethan as Coach (inherits Athlete) | One account per person; Ethan logs his own training and manages clients. | architecture_v0.4.0.md §D10 | architecture |
| D11 — Personal tool → business trajectory | Build to product quality; multi-tenant aware; neutral branding. | architecture_v0.4.0.md §D11 | architecture |
| D12 — Schema is ontological, not taxonomic | Session is atomic; all parents (Program, Routine, Class, Type) are nullable FKs. | architecture_v0.4.0.md §D12 | architecture |
| D13 — Training hierarchy above Session | Exercise Program → Exercise Type → Routine/Class → Session → Exercise → Set → Reps. | architecture_v0.4.0.md §D13 | architecture |
| D14 — Per-implement weight, not total | User enters per-implement load; volume math derives total from limb config. | architecture_v0.4.0.md §D14 | architecture |
| D15 — Limb configuration is exercise property | `upper_limb_config` and `lower_limb_config` enums on every exercise; variations are distinct entries grouped by family. | architecture_v0.4.0.md §D15 | architecture |
| D16 — Rest in integer seconds, three-level cascade | Session → exercise → set defaulting; null falls through. | architecture_v0.4.0.md §D16 | architecture |
| D17 — Set grouping via group_id | Nullable integer on `sets`; same group_id = back-to-back (supersets, drop sets, cluster). | architecture_v0.4.0.md §D17 | architecture |
| D18 — Multi-weight notation expands on import | WxR → 1 row, WxRxN → N rows, paren group → shared group_id, WxR(big) → one continuous set. | architecture_v0.4.0.md §D18 | architecture |
| D19 — Reasoner Duality + Authority Rule | Tier 1 deterministic reasoner governs decisions; Tier 2 LLM explains and suggests; Tier 1 wins. | architecture_v0.4.0.md §D19 | architecture |
| D20 — Watch + wearable apps are separate targets | Apple Watch / Wear OS / glasses outside the Expo single-codebase model. Three priority watch features named. | architecture_v0.4.0.md §D20 | architecture |
| D21 — Goals are first-class entities | Seven categories supported in schema (body comp, strength, endurance, skill, habit, health, aesthetic). MVP scope: strength + body weight. | architecture_v0.4.0.md §D21 | architecture |
| D22 — Progress photos: private by default, sensitivity-aware | Encrypted at rest, EXIF stripped, no gamification, neutral language. | architecture_v0.4.0.md §D22 | architecture |
| D23 — Form analysis from video, layered | L1 storage + coach review (v2); L2 pose estimation (v3); L3 NL feedback via Reasoner Duality (v3-v4); L4 real-time (v5+). | architecture_v0.4.0.md §D23 | architecture |
| D24 — Instructional content from three sources | Coach-produced, platform-curated, AI-generated. MVP: text + external link. | architecture_v0.4.0.md §D24 | architecture |
| D25 — Source-document CM | Document configuration management discipline for the portfolio; full design in CM brief v0.3.0. | docs/adrs/D25-source-document-cm_v0.1.0.md | architecture |
| D26 — Language: TypeScript with TC39 escape hatch | TypeScript primary; TC39 Type Annotations is the open-standards migration path. | architecture_v0.4.0.md §D26 | architecture |
| D27 — Multi-agent interop is first-class | Promoted from Phase 5 per Gartner L5; specific protocol (A2A / AAIF / custom) deferred. | architecture_v0.4.0.md §D27 | architecture |
| D28 — DoDAF + SysML iconography (fit-for-purpose) | DoDAF view set in Mermaid; SysML stereotypes; producer authority to add/subtract content per view. | (this dir; ADR pending) | architecture |

## Section 2 — Sub-systems (XRSize4 ALL portfolio)

| Term | Definition | References | Class |
|---|---|---|---|
| Lifting Tracker | First sub-system; weightlifting, strength training, bodybuilding. Alpha in progress. | architecture_v0.4.0.md scope note; xrsize4all_concept_v0.2.0.md | architecture |
| Reach4All | Portfolio-level research repository; native-tools-only. Standing up Sprint 0b. | CONVENTIONS_v0.2.2.md §3, §5 | reference |
| Concept Computing | Architectural framework. Provides four-tier doc hierarchy and 16-agent suite. | source-doc-cm-design.md §3.4 | architecture |
| Identity and Trust | Cross-cutting auth/authz/role assignment sub-system. Shared by all training sub-systems. | xrsize4all_concept_v0.2.0.md (Sub-Systems) | architecture |
| Ontology and Data | Canonical model and persistence. Shared entities live here. | xrsize4all_concept_v0.2.0.md | architecture |
| Goals | Goal setting, tracking, progress computation. First-class per D21. | architecture_v0.4.0.md §D21 | architecture |
| Biometrics | Wearable + health-store integration. Schema placeholder in Lifting Tracker; population deferred. | architecture_v0.4.0.md (biometric_samples) | architecture |
| Intelligence (AI Reasoning) | Cross-system AI agent capability layer. Implements Reasoner Duality. | architecture_v0.4.0.md §D19 | architecture |
| Content | Hosting, publishing, moderation. Used by training, coaching, social, creators. | xrsize4all_concept_v0.2.0.md | architecture |
| Social and Community | Groups, follows, comments, messaging, challenges. Heavily deferred. | architecture_v0.4.0.md non-decisions | architecture |
| Coaching | Coach-client relationship, assignment, review workflows. | architecture_v0.4.0.md §D3, §D10 | architecture |
| Commerce | Subscriptions, payments, payouts, marketplace. App-monetization (D9) and coach-to-client billing distinguished. | architecture_v0.4.0.md §D9 + non-decisions | architecture |
| Proximity and Discovery | Location-aware matching; venue-based affinity. Heavily deferred. | architecture_v0.4.0.md non-decisions | architecture |
| Wearable Integration | Watch / glasses / earbuds app surfaces. Outside Expo per D20. | architecture_v0.4.0.md §D20 | architecture |
| Instruction and Form Analysis | Paired capabilities: how to do it (D24) and how it was done (D23). | architecture_v0.4.0.md §D23, §D24 | architecture |
| Training Sub-Systems (future) | Running, Martial Arts, Yoga, Cycling, Swimming, Climbing, Group Fitness. Future. | xrsize4all_concept_v0.2.0.md | architecture |

## Section 3 — Workflows (WF-001 through WF-006)

| Term | Definition | References | Class |
|---|---|---|---|
| WF-001 — Session Start | Load context, report state. Concept form: Python exec chain gated by Starter. Target: auto-loaded CLAUDE.md + `cm status` skill invocation. | source-doc-cm-design.md §5.1 | reference |
| WF-002 — Session End | Save report, persist context, stop. Target: Stop hook + `cm report` skill. | source-doc-cm-design.md §5.1 | reference |
| WF-003 — Document Update | 9-step doc update with Step 4 GATE. Pattern: chain-with-gate + embedded evaluator-optimizer-verify. Target: `cm update <doc>` skill + pre-commit hook + GitHub Action. | source-doc-cm-design.md §5.1, §5.5 | reference |
| WF-003L — Light Document Update | ~5-step lightweight variant for Research-class docs. GATE optional per finding; required for landscape syntheses. | source-doc-cm-design.md §3.7.3 | reference |
| WF-004 — Reconciliation | Compare N docs, produce workbook, log gaps. Target: `cm reconcile` skill dispatching to Book Boss `reconcile.py`. | source-doc-cm-design.md §5.1 | reference |
| WF-005 — New Document | Draft → review → register. Target: `cm new <tier> <id>` skill scaffolds from template + adds manifest entry. | source-doc-cm-design.md §5.1 | reference |
| WF-006 — New Agent / New Skill | Design → skeleton → namespace → register. Target: `cm new-skill <id>` over Anthropic skill-creator + manifest entry. | source-doc-cm-design.md §5.1 | reference |

## Section 4 — Concept agents (16-agent suite)

All 16 agents are **operational and authoritative** as of v0.3.0 amendments (2026-04-23). The disposition column shows the candidate target form pending empirical equivalence evidence per the trust-but-verify posture (§6.0a). No agent is deprecated in this revision.

| Term | Class (agent role) | Candidate disposition | References |
|---|---|---|---|
| Primer | Super Agent | Drop (CLAUDE.md auto-load replaces) | source-doc-cm-design.md §6.0a, table |
| Starter | Meta/Gov (Delegator) | Drop (Claude Code session lifecycle) | source-doc-cm-design.md §6.0a |
| Book Boss | Doc Mgmt | Stay as skill script (`book_boss.py`) | source-doc-cm-design.md §6.1 |
| Doc Librarian | Doc Mgmt | Replace with `.cm/manifest.yaml` + `cm status` | source-doc-cm-design.md §6.0a |
| Notekeeper | Meta/Gov (Delegator) | Stay or migrate to GitHub Issues (Q3) | source-doc-cm-design.md §5.6 |
| Scorekeeper | Meta/Gov | Stay as skill script; append-only `.cm/scorekeeper.json` | source-doc-cm-design.md §6.7 |
| Historian | Meta/Gov | Replace with `cm history <doc>` over `git log --tags` | source-doc-cm-design.md §5.6 |
| Agent Registrar | Meta/Gov | Drop (SKILL.md auto-discovery) | source-doc-cm-design.md §5.6 |
| Courier | Utility/Export | Drop (git push / releases / tar) | source-doc-cm-design.md §5.6 |
| Timekeeper | Meta/Obs | Drop (session report header) | source-doc-cm-design.md §5.6 |
| Reporter | Meta/Obs | Stay as skill script; Stop-hook invoked | source-doc-cm-design.md §6.1 |
| Agent Architect | Meta/Gov | Drop (Anthropic SKILL.md is the open standard) | source-doc-cm-design.md §5.6 |
| Version Coordinator | Meta/Gov | Drop (git + semver + tag discipline) | source-doc-cm-design.md §5.6 |
| Instruction Verifier | Meta/Gov | Drop (CLAUDE.md is always loaded) | source-doc-cm-design.md §5.6 |
| Context Persistence | Meta/Gov | Replace with Claude memory + session reports | source-doc-cm-design.md §5.6 |
| Format Controller | Meta/Gov | Replace with pre-commit + PostToolUse hook + CI | source-doc-cm-design.md §5.6 |

## Section 5 — Content classes (CONVENTIONS_v0.2.2.md §2)

| Term | Definition | References | Class |
|---|---|---|---|
| Architecture | ADRs, architecture_v0.4.0.md, concept docs, ontology plans. WF-003 full. Semver. GATE required. No staleness. | CONVENTIONS_v0.2.2.md §2 | reference |
| Research | Finding reports, landscape scans, vendor analyses. WF-003L. Date-based version. GATE optional per finding, required for syntheses. Mandatory `stale_after:`. | CONVENTIONS_v0.2.2.md §2; source-doc-cm-design.md §3.7.3 | reference |
| Operational | Kanban, metrics, risks, dispatch-handoff, retros, roadmap. Direct-edit or WF-003L. `updated:` is the version. GATE optional. Sprint-boundary review. | CONVENTIONS_v0.2.2.md §2 | reference |
| Reference | CLAUDE.md, README.md, CONVENTIONS_v0.2.2.md, orchestration. WF-003 full (soft GATE if no downstream pins). Semver on structural revisions. | CONVENTIONS_v0.2.2.md §2 | reference |
| Code (NAMED-BUT-DEFERRED) | Source, tests, build scripts, IaC. Governance deferred to future code-cm discipline. | source-doc-cm-design.md §3.7 | reference |

## Section 6 — Architectural principles

| Term | Definition | References | Class |
|---|---|---|---|
| Composite tool-selection principle | Filter for MCP-able + self-hostable + not-SaaS + AI-native friction; survives vendor pressure. | architecture_v0.4.0.md (Hosting posture); D8 revision | architecture |
| MCP-first sub-system strategy | Every sub-system ships an MCP server before further UI investment. Lifting Tracker ships `lifting-tracker-mcp` after athlete MVP. | architecture_v0.4.0.md (cross-cutting principles); source-doc-cm-design.md §6.6 | architecture |
| Three-layer data architecture | Transactional (Supabase Postgres) + Vector (pgvector) + Semantic (Apache Jena Fuseki). Mobile reaches Fuseki only via MCP. | architecture_v0.4.0.md (cross-cutting principles) | architecture |
| Hosting posture | Docker containers on Railway. Commitment is to Docker, not Railway. | architecture_v0.4.0.md (cross-cutting principles) | architecture |
| Observability stance | HyperDX OSS, ClickHouse-backed, OTel-native. SigNoz fallback. Grafana stack declined on AGPL grounds. | architecture_v0.4.0.md (cross-cutting principles) | architecture |
| Reasoner Duality | Tier 1 deterministic governs decisions; Tier 2 LLM explains and suggests. | architecture_v0.4.0.md §D19 | architecture |
| Authority Rule | LLM (Tier 2) cannot override deterministic (Tier 1) findings on consequential decisions. User confirmation required for any AI write to athlete data. | architecture_v0.4.0.md §D19 | architecture |
| Tier 2 concern log | Monitoring surface (`.cm/tier2-concerns.json`) detecting Authority Rule rubber-stamping signals. Not a gate. | architecture_v0.4.0.md §D19 (added 2026-04-23) | architecture |
| Four content-drop defenses | Fresh-Read Discipline, Post-Mutation Verify, 20K-Token Pre-Flight Cap on Write, Baseline Snapshots. Load-bearing for any session on files >1,500 lines. | source-doc-cm-design.md §5.7 | reference |
| Trust-but-verify (16-agent posture) | All 16 Concept agents remain operational; Claude Code natives run in parallel as redundant observability; deprecation requires empirical evidence. | source-doc-cm-design.md §6.0a | architecture |
| Brain-hands separation | Reasoning (LLM) and execution (skill scripts, hooks, CI) are decoupled. Interfaces outlast implementations. | source-doc-cm-design.md §1.4 | reference |
| Generator-evaluator separation | Writer cannot be the verifier. Book Boss verify (Step 7 of WF-003) implements this. | source-doc-cm-design.md §1.4, §5.1 | reference |
| Composition discipline (CC-017) | Governance steps must be composed (skill calls a script that runs the check), not listed in prose. Prose erodes; composed tools do not. | source-doc-cm-design.md §1.4, §5.4 | reference |
| Fit-for-purpose view authority (D28) | The producer of a DoDAF view has authority to add or subtract content based on what genuinely supports the decision the view exists to inform. | (this directory; D28 ADR pending) | architecture |

## Section 7 — Tiers (CONVENTIONS_v0.2.2.md §3 / source-doc-cm-design.md §3)

| Term | Definition | References | Class |
|---|---|---|---|
| REFERENCE tier | Foundational; describes *what things are* and the vocabulary other docs use. Updates propagate widely. | source-doc-cm-design.md §3.2 | reference |
| COMPANION tier | Deep-dive; describes *how things work* in a specific dimension. Cites references. | source-doc-cm-design.md §3.2 | reference |
| MASTER tier | Integration; the single doc a newcomer reads. Authority lives in the tier it integrates from. | source-doc-cm-design.md §3.2 | reference |
| OPERATIONAL tier | Live; describes the *current state* of the system. Registries, change logs, roadmaps. Shortest half-life, lowest edit bar. | source-doc-cm-design.md §3.2 | reference |
| ARCHITECTURE tier | Used in frontmatter for architecture-class artifacts. Orthogonal to content_class. | CONVENTIONS_v0.2.2.md §7 | reference |

## Section 8 — Roles (XRSize4 ALL participants)

| Term | Definition | References | Class |
|---|---|---|---|
| Athlete | Any individual who trains. Foundational role; every other role inherits or relates to it. | xrsize4all_concept_v0.2.0.md (People) | architecture |
| Coach / Instructor | Provides guidance, assigns programming, reviews performance. Trust relationship with one or more Athletes. | xrsize4all_concept_v0.2.0.md; architecture_v0.4.0.md §D3 | architecture |
| Class Instructor | Leads group sessions at fixed venues. Many-to-one relationship; session-based. | xrsize4all_concept_v0.2.0.md | architecture |
| Client | Athlete in a paid relationship with a Coach. | xrsize4all_concept_v0.2.0.md | architecture |
| Training Partner | Athlete who trains alongside another. No commercial relationship. | xrsize4all_concept_v0.2.0.md | architecture |
| Gym / Gym Owner | Organization or individual operating a training facility. | xrsize4all_concept_v0.2.0.md; architecture_v0.4.0.md §D3 | architecture |
| Gym Member | Athlete affiliated with a specific Gym. | xrsize4all_concept_v0.2.0.md | architecture |
| Content Creator / Influencer | Produces instructional, motivational, or commercial content. | xrsize4all_concept_v0.2.0.md | architecture |
| Community Moderator | Maintains norms and safety of social spaces. | xrsize4all_concept_v0.2.0.md | architecture |
| Super Admin | Platform operator. Full visibility, full control. | xrsize4all_concept_v0.2.0.md; architecture_v0.4.0.md §D3 | architecture |
| AI Agent | First-class system participant under D19 Authority Rule. | xrsize4all_concept_v0.2.0.md (AI Agent as Participant); architecture_v0.4.0.md §D19 | architecture |

## Section 9 — Infrastructure and tools

| Term | Definition | References | Class |
|---|---|---|---|
| Supabase | Postgres + auth + realtime + storage + edge functions. Self-hosted on Railway per Sprint 0a. | architecture_v0.4.0.md §D8; source-doc-cm-design.md §6.8 | architecture |
| Railway | Container hosting platform. Runs all self-hosted services. Commitment is to Docker, not to Railway. | architecture_v0.4.0.md (Hosting posture) | architecture |
| HyperDX OSS | MIT-licensed observability stack. ClickHouse backend. OTel-native. First-party RN SDK. | architecture_v0.4.0.md (Observability) | architecture |
| ClickHouse | Column-oriented storage backend for HyperDX. Watch for relicense signal (R-TV-06). | observability-backend-assessment.md | reference |
| Expo | React Native framework. Single codebase iPhone + Web. | architecture_v0.4.0.md §D8 | architecture |
| expo-sqlite | SQLite on-device via Expo's module. Local store per Sprint 0a revision. | architecture_v0.4.0.md §D8 (revision) | architecture |
| Drizzle ORM | Type-safe query layer over SQLite. | architecture_v0.4.0.md §D8 (revision) | architecture |
| TanStack Query | Server-state cache + optimistic updates + background refetch. | source-doc-cm-design.md §6.8 | architecture |
| NativeWind | Tailwind utilities on React Native. | source-doc-cm-design.md §6.8 | architecture |
| Custom Supabase sync adapter | BYO sync layer; single-user-per-device, last-write-wins. | architecture_v0.4.0.md §D8 (revision) | architecture |
| pgvector | Postgres extension for vector storage. Activates Sprint 2+ for semantic search. | architecture_v0.4.0.md (Three-layer data) | architecture |
| Apache Jena Fuseki | Semantic-layer SPARQL endpoint. Sprint 3+ or Phase 2. Accessed only via MCP. | architecture_v0.4.0.md (Three-layer data) | architecture |
| MCP | Model Context Protocol — JSON-RPC over stdio/HTTP. Anthropic-owned protocol. | architecture_v0.4.0.md (MCP-first); StdV-1 | architecture |
| document-cm | The first MCP server in the portfolio; governs source documents. Dual CLI + MCP adapter over shared `lib/`. | source-doc-cm-design.md §6.6 | architecture |
| lifting-tracker-mcp | Planned MCP server exposing `query_sessions`, `log_session`, `get_coach_hierarchy`, `assign_program`. | architecture_v0.4.0.md (MCP-first) | architecture |
| Magic-link auth | Supabase email-based passwordless auth. MVP entrypoint. | architecture_v0.4.0.md §D6 | architecture |

## Section 10 — Risk identifiers (sample; full register lives in `risks_v0.1.0.md`)

| Term | Definition | References | Class |
|---|---|---|---|
| R-CI-01 | Content drops via micro_compact during document writes. High severity. Open. | risks_v0.1.0.md §3.1 | operational |
| R-CI-02 | 25K-token Read ceiling throws on large docs. Medium severity. Open. | risks_v0.1.0.md §3.1 | operational |
| R-CI-04 | Self-reported verification is untrustworthy. High severity. Open. | risks_v0.1.0.md §3.1 | operational |
| R-TV-01 | GitHub pay-to-play migration window closes. High severity. | risks_v0.1.0.md §3.2 | operational |
| R-GV-04 | CC-017 — governance step omission under content pressure. High severity. | risks_v0.1.0.md §3.4 | operational |
| R-SD-01 | Tier 2 concern log not yet instrumented. High severity. | risks_v0.1.0.md §3.7 | operational |

For the full risk register including IDs not enumerated here (R-CI-03, R-TV-02 through R-TV-06, R-OR-01 through R-OR-03, R-GV-01 through R-GV-03, R-PR-01 through R-PR-04, R-PT-01 through R-PT-04, R-SD-02, R-PE-*), see `docs/risks_v0.1.0.md`. The dictionary will absorb additional rows as risks promote to portfolio-level reference status.

## Section 11 — Themes and capability identifiers (sample; full hierarchy in `themes-epics-features_v0.2.0.md`)

| Term | Definition | References | Class |
|---|---|---|---|
| T1 — Platform Foundation | Identity, access, deployment, infrastructure. Anchors: D3, D4, D6, D7, D8, D9, D11. | themes-epics-features_v0.2.0.md §T1 | architecture |
| T2 — Core Athlete Experience | Log, view, analyze, import. MVP heart. Anchors: D1, D2, D4, D5, D12, D14, D15, D16, D17, D18. | themes-epics-features_v0.2.0.md §T2 | architecture |
| T3 — Coaching Platform | Manage clients, assign work, review progress. v2. Anchors: D3, D10, D11. | themes-epics-features_v0.2.0.md §T3 | architecture |
| T4 — Training Structure | Programs, Routines, Classes, Exercise Types. Anchors: D12, D13. | themes-epics-features_v0.2.0.md §T4 | architecture |
| T5 — Goals and Progress | Goals first-class; progress photos. Anchors: D21, D22, D19. | themes-epics-features_v0.2.0.md §T5 | architecture |
| T6 — Form and Content | Instructional content + form analysis. Anchors: D23, D24, D15. | themes-epics-features_v0.2.0.md §T6 | architecture |
| T7 — Intelligence | AI/LLM via Reasoner Duality. Anchors: D19. | themes-epics-features_v0.2.0.md §T7 | architecture |
| T8 — Extended Platforms | Wearables, glasses, voice, Android. Anchors: D20. | themes-epics-features_v0.2.0.md §T8 | architecture |

Epic and feature IDs (E1.1 through E8.3; F1.1.1 through F8.3.1) are catalogued in `themes-epics-features_v0.2.0.md` and will populate AV-2 only as their definitions become contested across views.

## Section 12 — User-story prefixes (catalog in `user-stories_v0.2.0.md`)

| Term | Definition | References | Class |
|---|---|---|---|
| US-0XX | Athlete-facing MVP stories. | user-stories_v0.2.0.md Phase 1 | architecture |
| US-1XX | Coach + training-structure + goals-expansion + form-capture stories (v2). | user-stories_v0.2.0.md Phase 2 | architecture |
| US-2XX | Admin / Gym / Teams stories (Future). | user-stories_v0.2.0.md (Future phases) | architecture |
| US-3XX | NFR-class stories: performance, security, privacy, sync, data portability. | user-stories_v0.2.0.md (Cross-cutting NFRs) | architecture |

Individual story IDs (US-001 through ~US-330) are not listed here; they are looked up in `user-stories_v0.2.0.md` directly. The dictionary captures only ID-range conventions.

## Maintenance protocol

This dictionary is **append-only by sprint**. Every sprint that introduces new terms adds rows. Removed terms are marked deprecated (struck-through with an end-date) rather than deleted, so cross-references remain resolvable.

When a row's definition contradicts its source document, the source wins and the row is wrong — open a sprint task to reconcile. The dictionary is convenience, not authority.

## Cross-references

**Architectural decisions referenced:** D1–D27 (full list).

**User stories referenced:** prefix-level only (US-0XX, US-1XX, US-2XX, US-3XX); individual story IDs catalogued in `user-stories_v0.2.0.md`.

**Sprint of last revision:** Sprint 0b Day 1 (2026-04-24). Initial population.

**Other DoDAF views referenced:** AV-1 (orientation), CV-capabilities (theme/epic IDs), SV-1 (component names), StdV-1 (standards terms), DIV-2 (table names).

---

© 2026 Eric Riutort. All rights reserved.
