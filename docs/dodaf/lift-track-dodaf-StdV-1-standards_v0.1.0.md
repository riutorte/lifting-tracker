---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-30
tier: OPERATIONAL
content_class: architecture
version: 0.1.1
status: draft
---

# StdV-1 — Standards Profile

## Purpose

StdV-1 is the registry of standards — open, vendor, and internal — that the XRSize4 ALL portfolio binds to. It exists so SV-6 has a target for every "Standard" column entry, so reviewers can see at a glance what specifications the portfolio commits to (and which it deliberately does not), and so future migrations have an explicit list to re-check against when the standard evolves.

The matrix is divided into three sections:

1. **External open standards** — published by standards bodies, RFCs, or industry consortia. Adoption is policy.
2. **De facto / vendor standards** — adopted because the vendor owns the spec and is dominant in the relevant market. Adoption acknowledges the lock-in vector.
3. **Internal standards (XRSize4 ALL portfolio)** — principles, patterns, and conventions authored within the portfolio. Documented here for completeness; cross-listed with their authoring docs.

Binding status uses four levels:
- **Required** — adoption is non-negotiable; deviation is a defect.
- **Adopted** — chosen for the portfolio; deviation requires an ADR.
- **Watched** — under observation for adoption when conditions warrant.
- **Declined** — explicitly rejected with rationale; presence in the matrix prevents accidental re-adoption.

## 1. External open standards

| Standard | Scope | Applies to | Binding status | Notes / source |
|---|---|---|---|---|
| **MCP 1.0 — Model Context Protocol** (Anthropic, open) | Agent tool-and-resource exchange protocol; JSON-RPC over stdio or HTTP | Every sub-system MCP server (`document-cm`, `lifting-tracker-mcp`, `fuseki-mcp`, future) | Required | Owned by Anthropic; consumer base spans Claude Code, Cursor, Codex CLI, Workato. MCP-first sub-system strategy depends on a stable protocol surface. R-PT-04 tracks version churn. |
| **PostgreSQL** (PostgreSQL Global Development Group; PostgreSQL License — permissive) | Relational database wire protocol + SQL dialect | SupabasePostgres (canonical source of truth, D4) | Required | Self-hosted on Railway. Migration path to any Postgres-compatible host is one Dockerfile. |
| **SQLite** (D. Richard Hipp; public domain) | Embedded relational database | LocalStore on every device (`expo-sqlite`) | Required | Per D8 Sprint 0a revision. Open standard; format is forward-compatible across versions. |
| **OpenTelemetry — traces, metrics, logs** (CNCF; Apache 2.0) | Telemetry data model + transport | All components emitting telemetry; HyperDX ingest | Required | OTLP-HTTP and OTLP-gRPC are both supported. Wire format outlives any specific backend. |
| **OpenTelemetry GenAI semantic conventions** (CNCF; under stabilization) | Semantic conventions for LLM call instrumentation | Edge Functions when calling Tier 2 LLM APIs | Adopted | Spans for LLM calls follow the GenAI conventions (operation, model, token counts, cost). Conventions still stabilizing as of 2026; review on each minor release. |
| **OAuth 2.0 + OpenID Connect 1.0** (IETF + OpenID Foundation) | Auth flows for third-party identity providers | Sign in with Apple, Google Sign In (post-MVP per D6) | Adopted | Required by Apple Guideline 4.8 once any third-party sign-in is added. Supabase GoTrue handles the protocol. |
| **JWT (RFC 7519)** + **Bearer Token Usage (RFC 6750)** | Session token format and HTTP transport | SupabaseAuth issuance; MobileClient → SupabasePostgres on every PostgREST call | Required | Token storage in Apple Keychain via Expo SecureStore (US-003); never AsyncStorage. |
| **TLS 1.3 (RFC 8446)** | Transport encryption | Every network exchange (see SV-6: every row carries TLS) | Required | Per D22 + US-310. Earlier TLS versions disabled at server. |
| **HTTP/2 + HTTP/3 (where supported)** | Transport multiplexing | Public web edges (Vercel) | Adopted | Configured by host; not application-layer. |
| **JSON-RPC 2.0** | RPC envelope used by MCP | All MCP servers | Required | Foundational to MCP transport. |
| **JSON Schema (Draft 2020-12)** | Tool and message schema validation | MCP tool contracts; manifest schema; OpenAPI bodies | Adopted | Used by `cm.update / approve / record / verify / status / history` tool definitions. |
| **YAML 1.2** | Frontmatter and manifest format | All in-scope docs (frontmatter); `.cm/manifest.yaml` | Required | Per CONVENTIONS_v0.2.4.md §7. |
| **Markdown (CommonMark + GitHub-flavored extensions)** | Document format | All in-scope docs | Required | Per CONVENTIONS_v0.2.4.md §6 (extension `.md`). |
| **Mermaid (current spec)** | Diagram-as-code format | All DoDAF view diagrams (this directory); xrsize4all_concept_v0.2.0.md process diagrams | Required | Per `xrsize4all_concept_v0.2.0.md` Process section ("Mermaid notation … expressible in plain text … machine-parseable for tooling"). |
| **SysML 1.x notation (within Mermaid limits)** | Stereotypes, cardinalities, association directionality | DoDAF view diagrams in this directory | Adopted | Per D28. Where Mermaid cannot render a SysML construct (delegation ports, item flows on connectors, allocation arrows), descriptive markdown carries the intent. |
| **DoDAF 2.02 viewpoints** | Architecture description framework | This directory | Adopted | Per D28 — DoDAF over TOGAF for this portfolio. Fit-for-purpose authority: the producer of any view may add or subtract content per what supports the decision the view exists to inform. |
| **SemVer 2.0.0** | Version numbering for documents and software | Architecture-class docs; Reference-class docs; software releases | Required | Per CONVENTIONS_v0.2.4.md §8. |
| **Conventional Commits** | Commit message format | All git commits in scope | Adopted | Per lift-track-source-document-cm_v0.3.0.md §2.6. Drives `semantic-release`-style tooling when adopted. |
| **OWASP LLM Top 10 (2025)** | Threat model for LLM-integrated applications | Edge Functions invoking Tier 2 LLM; AI_INTERACTIONS audit row design; Tier 2 concern log | Required | Cross-listed: D19 Reasoner Duality, AI_INTERACTIONS hybrid schema, Authority Rule. Specific defenses: prompt-injection guard on user-supplied text; least-privilege on LLM outputs; confirmation gate before any write to athlete data. |
| **OWASP DevSecOps Maturity Model — Level 1 baseline** | Security controls for the development pipeline | CI; pre-commit hooks; secret scanning rollout | Adopted | Per lift-track-source-document-cm_v0.3.0.md §5.2 staged-rollout for gitleaks. |
| **NIST SP 800-128** (Guide for Security-Focused CM of Information Systems) | Configuration management baseline taxonomy | Document-cm discipline (the lifecycle taxonomy is orthogonal per source-doc-cm §3.0) | Adopted (cited; not pinned to functional/allocated/product nomenclature) | Cited for lineage. The portfolio's REFERENCE / COMPANION / MASTER / OPERATIONAL hierarchy is a different axis from NIST's functional/allocated/product baseline taxonomy. |
| **ISO/IEC 10007:2017** — Quality management — Guidelines for CM | CM activity decomposition (identification, change control, status accounting, audit) | Document-cm discipline and any future code-cm | Adopted | Per lift-track-source-document-cm_v0.3.0.md §1.3. ISO 10007 is a guidelines standard, not a certifiable-requirements standard; citation cost is low and it anchors vocabulary to an international baseline. |
| **SAE EIA-649-C (2019, reaffirmed 2024)** — National Consensus Standard for Configuration Management | Five CM functions (planning/management, identification, change management, status accounting, verification/audit) | Document-cm discipline | Adopted (cited; conformance not claimed) | US consensus CM standard. Five-function decomposition visible throughout lift-track-source-document-cm_v0.3.0.md §4–§6. |
| **IEEE/ISO/IEC 12207:2017** | Software life cycle processes; CM as a technical-management process | Portfolio-wide methodology | Adopted (tailored) | Tailoring rule: "adopt high-risk areas first, not everything at once." |
| **SLSA v1.0** (Supply-chain Levels for Software Artifacts) | Build provenance attestation framework | Skill-script supply chains; immutable git tags as content-addressed identifiers | Adopted (Level 1 implicit; L2 deferred) | Per lift-track-source-document-cm_v0.3.0.md §2.5 (immutable artifacts) + §6.7 (tamper-evidence scorekeeper as solo-scale equivalent). G12/G13 deferred. |
| **CycloneDX v1.6** (SBOM format) | Software Bill of Materials | Skill-package SBOMs generated on every baseline tag | Adopted | Per lift-track-source-document-cm_v0.3.0.md §5.2 step 8. `cyclonedx-py` is the generator. |
| **sigstore / cosign / gitsign** | Cryptographic artifact and commit signing | Future portfolio expansion | Watched | Per lift-track-source-document-cm_v0.3.0.md §6.7. Adoption deferred until second contributor joins; sigstore is layered onto the existing scorekeeper schema without breaking changes. |
| **gitleaks** | Secret scanning | Pre-commit + CI | Adopted | Staged six-step rollout per lift-track-source-document-cm_v0.3.0.md §5.2. |
| **GitHub push protection (secret scanning)** | Outermost secret-scan ring | Repository hosting | Adopted | Final step of the secret-scan rollout. R-TV-01 names GitHub migration window — push protection re-evaluated at migration. |
| **OWASP ASVS (Application Security Verification Standard)** | Application security control verification | Future surface for security review of MVP and beyond | Watched | Not yet pinned; adoption candidate when external security review becomes load-bearing. |
| **W3C PROV-DM / DataOps** | Data provenance taxonomy | `data/combined_workout_log.txt` import + future external data ingestion | Adopted (out-of-scope for document-cm; in-scope for data lineage) | Per lift-track-source-document-cm_v0.3.0.md scope note (G28). |
| **WCAG 2.2 AA** | Web accessibility | Expo Web dashboard | Adopted | Per `xrsize4all_concept_v0.2.0.md` Accessibility cross-cutting concern. iOS app accessibility follows Apple platform guidelines. |
| **iCalendar (RFC 5545)** | Calendar data exchange | Future class scheduling and program calendar export | Watched | Reserved for Classes scheduling export; not in MVP. |

## 2. De facto / vendor standards

| Standard | Scope | Applies to | Binding status | Notes / source |
|---|---|---|---|---|
| **TypeScript** (Microsoft; Apache 2.0) + **TC39 Type Annotations (Stage 1)** | Programming language with structural typing | Expo client; Edge Functions; document-cm CLI/MCP adapters | Required (TS) + Watched (TC39 escape hatch) | Per D26. TC39 Type Annotations is the open-standards escape hatch if the TypeScript ecosystem moves adversely. |
| **Apple App Store Review Guidelines** | App distribution policy | iOS app via TestFlight + App Store | Required | Including Guideline 4.8 (third-party sign-in symmetry); evolving constraint. |
| **Apple StoreKit / Server-to-Server Notifications (SBP)** | In-app subscription billing | App-monetization (D9) — post-alpha | Required when D9 lands | Apple Subscription Billing Platform; required for any consumer subscription on iOS. |
| **Apple Sign in with Apple** | Identity provider | Auth post-MVP | Required when any third-party sign-in is added | Tied to Guideline 4.8. |
| **Apple HealthKit framework spec** | Biometrics ingestion on iOS | Platform Biometrics sub-system (deferred) | Required when HealthKit ingestion lands | Per lift-track-architecture_v0.4.0.md non-decisions. |
| **Android Health Connect** | Biometrics ingestion on Android | Platform Biometrics sub-system on Android (deferred) | Required when Android target ships | Equivalent to HealthKit on Android; same data class. |
| **PostgREST conventions** (Supabase-bundled) | Auto-generated REST API over Postgres | MobileClient ↔ SupabasePostgres | Required | Sync adapter and TanStack Query both speak PostgREST. |
| **Phoenix Channels protocol** (Elixir; underlies Supabase Realtime) | Real-time WebSocket channel framing | SupabaseRealtime ↔ MobileClient | Adopted | Wire format owned by Supabase Realtime; subject to Supabase release cadence. |
| **Drizzle ORM** (open source; permissive) | TypeScript-first SQL DSL | LocalStore queries | Required | Per D8 Sprint 0a revision. Composite-principle-aligned alternative to ORM frameworks with heavy abstraction. |
| **TanStack Query** (open source; MIT) | Server-state caching pattern | MobileClient state management | Required | Per D8 Sprint 0a revision. Chosen over Redux / Zustand. |
| **NativeWind** (open source; MIT) | Tailwind utility classes on React Native | MobileClient styling | Required | Per lift-track-source-document-cm_v0.3.0.md §6.8. |
| **Expo + EAS Build** (Expo; permissive) | React Native framework + cloud build | iOS app + Web dashboard | Required | Per D8. EAS Build replaces local Xcode for iOS. |
| **pgvector** (Postgres extension; permissive) | Vector storage and similarity search | Co-located with SupabasePostgres; Sprint 2+ activation | Adopted | Per Three-layer data architecture principle. Avoids a separate vector DB. |
| **Apache Jena Fuseki** (ASF; Apache 2.0) | SPARQL endpoint, OWL reasoning | Semantic layer; Sprint 3+ or Phase 2 | Adopted | Per Three-layer data architecture principle. Accessed only through `fuseki-mcp`. |
| **HyperDX OSS** (MIT; ClickHouse Inc. stewardship) | Observability backend | Self-hosted on Railway | Adopted | R-TV-03 watches for relicense signal; SigNoz fallback. |
| **ClickHouse** (Apache 2.0 today) | Column-oriented OLAP database | HyperDX storage backend | Adopted | R-TV-06 watches for systemic relicense risk affecting HyperDX/SigNoz/Uptrace. |
| **Docker (OCI image format)** | Container packaging | All self-hosted services | Required | Per Hosting posture. The portfolio's commitment is to Docker, not to Railway. |
| **Railway platform conventions** | Container hosting + git-driven deploy | Hosting today | Adopted (with explicit substitutability) | R-TV-05 names commercial-terms risk; migration targets Hetzner / Fly / self-hosted Kubernetes. |
| **Anthropic Messages API schema** | Tier 2 LLM request/response | Edge Functions → LLMAPI | Adopted | Vendor schema; subject to Anthropic release cadence (R-PT-03). Provider abstraction is a future concern, not a current one. |
| **OpenAI Chat Completions API schema** | Alternative Tier 2 LLM provider | Edge Functions → LLMAPI | Adopted | Same observation as Anthropic; multi-provider routing is post-MVP. |
| **Vercel deployment conventions** | Web hosting for Expo Web target | Expo Web dashboard | Adopted | Free-tier-acceptable for alpha; reassessed if traffic grows. |
| **Anthropic Agent Skills format (SKILL.md)** | Skill packaging for Claude Code, Cursor, Codex CLI, Antigravity, Gemini CLI | document-cm and future skills | Adopted | Open standard published by Anthropic Dec 2025; cross-host portability per lift-track-source-document-cm_v0.3.0.md §1.4. |
| **GitHub Actions** | CI/CD substrate | Validation workflows for the portfolio | Adopted | R-TV-01 names migration window; Forgejo / Gitea are the named migration targets. |

## 3. Internal standards (XRSize4 ALL portfolio)

These are principles, patterns, and conventions authored within the portfolio. Listed for completeness so reviewers see the full standards surface; each row points at its authoring document.

| Standard | Scope | Applies to | Binding status | Authoring source |
|---|---|---|---|---|
| **D19 Reasoner Duality + Authority Rule** | Two-tier AI architecture: Tier 1 deterministic governs decisions; Tier 2 LLM explains and suggests | Every AI feature in the portfolio | Required | lift-track-architecture_v0.4.0.md §D19 |
| **Composite tool-selection principle** | Filter for MCP-able + self-hostable + not-SaaS + AI-native friction | Every tool/library adoption decision | Required | lift-track-architecture_v0.4.0.md (D8 revision; Hosting posture) |
| **MCP-first sub-system strategy** | Each XRSize4 ALL sub-system ships an MCP server before further UI investment | Lifting Tracker (`lifting-tracker-mcp`); document-cm; future sub-systems | Required | lift-track-architecture_v0.4.0.md (Cross-cutting principles); lift-track-source-document-cm_v0.3.0.md §6.6 |
| **Three-layer data architecture** | Transactional (Postgres) + Vector (pgvector) + Semantic (Fuseki via MCP) | Portfolio data layer | Required | lift-track-architecture_v0.4.0.md (Cross-cutting principles) |
| **Hosting posture** | Docker containers on Railway; commitment to Docker, not Railway | All self-hosted services | Required | lift-track-architecture_v0.4.0.md (Cross-cutting principles) |
| **Observability stance** | HyperDX OSS, ClickHouse-backed, OTel-native; SigNoz fallback; Grafana stack declined on AGPL grounds | All telemetry exchanges | Required | lift-track-architecture_v0.4.0.md (Cross-cutting principles); R-TV-03 |
| **Four content-drop defenses** | Fresh-Read Discipline; Post-Mutation Verify; 20K-Token Pre-Flight Cap on Write; Baseline Snapshots | Any session operating on docs >1,500 lines | Required | lift-track-source-document-cm_v0.3.0.md §5.7 |
| **Trust-but-verify (16-agent posture)** | All 16 Concept agents remain operational; Claude Code natives run in parallel as redundant observability; deprecation requires empirical evidence via Tier 2 concern log | Concept agent suite vs Claude Code primitives | Required | lift-track-source-document-cm_v0.3.0.md §6.0a |
| **Brain-hands separation** | Reasoning (LLM) and execution (skill scripts, hooks, CI) are decoupled; interfaces outlast implementations | Every skill design | Required | lift-track-source-document-cm_v0.3.0.md §1.4 |
| **Generator-evaluator separation** | Writer cannot be the verifier; Book Boss verify is structurally separate from the writer | Every WF-003 invocation | Required | lift-track-source-document-cm_v0.3.0.md §1.4, §5.5 |
| **Composition discipline (CC-017)** | Governance steps must be composed (skill calls a script that runs the check), not listed in prose | Every load-bearing rule in the CM discipline | Required | lift-track-source-document-cm_v0.3.0.md §1.4, §5.4 |
| **Tier 2 concern log** | Monitoring surface (`.cm/tier2-concerns.json`) detecting Authority Rule rubber-stamping signals | All Tier 2 LLM outputs | Required | lift-track-architecture_v0.4.0.md §D19; R-GV-01; R-SD-01 |
| **GATE artifact triple (request / assignment / resolution + timeout + reassignment)** | Three-record audit structure for every WF-003 GATE invocation | document-cm GATE flows | Required | lift-track-source-document-cm_v0.3.0.md §5.5a |
| **Tamper-evidence scorekeeper (prev_hash chain)** | SHA-256 chained append-only ledger | `.cm/scorekeeper.json` | Required | lift-track-source-document-cm_v0.3.0.md §6.7 |
| **Hybrid `ai_interactions` schema** | Always-populated `input_raw` + typed `output_episode` | AI_INTERACTIONS table writes | Required | lift-track-source-document-cm_v0.3.0.md §4.9 + §6.8 |
| **Closed-vocabulary feedback labels** | Fixed positive/negative label sets for AI/governance feedback | document-cm feedback surfaces; future Lifting Tracker AI feedback | Required | lift-track-source-document-cm_v0.3.0.md §6.6 |
| **`console.log → stderr` guard for MCP stdio** | Three-line redirect of console output to stderr in any MCP stdio server | Every MCP stdio server in the portfolio | Required | lift-track-source-document-cm_v0.3.0.md §6.6 |
| **Per-implement weight + limb-config volume math (D14, D15)** | Internal data convention for weight entry and volume computation | Lifting Tracker analytics | Required | lift-track-architecture_v0.4.0.md §D14, §D15 |
| **Three-level rest defaulting cascade (D16)** | Session → exercise → set rest_seconds defaulting | Lifting Tracker logging | Required | lift-track-architecture_v0.4.0.md §D16 |
| **Set grouping via group_id (D17)** | Nullable integer on sets; same group_id = back-to-back | Lifting Tracker logging + analytics | Required | lift-track-architecture_v0.4.0.md §D17 |
| **Schema-completeness from day one (D12 corollary)** | Every table from lift-track-architecture_v0.4.0.md exists in MVP even if UI doesn't expose it | Database migrations | Required | lift-track-architecture_v0.4.0.md MVP approach + D12 |
| **D28 Fit-for-purpose DoDAF view authority** | The producer of a DoDAF view may add or subtract content per what supports the decision | This directory | Required | (D28 ADR pending; convention applied here) |
| **CONVENTIONS_v0.2.4.md frontmatter + footer rule** | Every doc carries YAML frontmatter (author / created / updated / tier / content_class / version / status as required by class) and `© YYYY Eric Riutort. All rights reserved.` footer | All in-scope docs | Required | CONVENTIONS_v0.2.4.md §7, §11 |

## 4. Declined standards (presence prevents accidental re-adoption)

| Standard | Scope | Why declined | Source |
|---|---|---|---|
| **Grafana Labs LGTM stack** (Loki + Grafana + Tempo + Mimir) | Observability backend | AGPL 3.0 since 2021; fails composite-principle's permissive-license preference | lift-track-architecture_v0.4.0.md (Observability); R-TV-03 historical context |
| **WatermelonDB** | Offline-first reactive database for React Native | "Most-commonly-used" argument lost to composite-principle alignment with SQLite + Drizzle (maximum AI-codegen fluency, zero abstraction layer) | lift-track-architecture_v0.4.0.md §D8 (Sprint 0a revision) |
| **PowerSync Open Edition (for MVP)** | Sync layer for offline-first | Considered as alternate; declined for MVP; revisit when multi-user coach-athlete collaboration becomes real (Sprint 2+) | lift-track-architecture_v0.4.0.md §D8 (Sprint 0a revision); R-TV-02 |
| **ElectricSQL (for MVP)** | Offline sync via Postgres CDC | Not production-ready for RN client at Sprint 0a; HOLD per four named tripwires | R-TV-02; electricsql-assessment.md |
| **Standalone vector DB (Pinecone, Weaviate, etc.)** | Vector storage | pgvector co-located in Postgres is sufficient at this scale; second system not earned | lift-track-architecture_v0.4.0.md (Three-layer data architecture) |
| **Bespoke skill blueprint framework (replacing Anthropic SKILL.md)** | Skill scaffolding | Replacing an open standard with a bespoke blueprint is a lock-in mistake; Anthropic Agent Skills is the open standard | lift-track-source-document-cm_v0.3.0.md §6.0a (Agent Architect disposition) |
| **Server-side Pydantic enforcement of `ai_interactions.output_episode`** | Typed schema enforcement | Resolved as documentation-only typed-episode contracts (Q15); enforcement at application-code layer | lift-track-source-document-cm_v0.3.0.md §4.9 (v0.3.0 amendments 2) |
| **Folder-per-tier doc layout** | Document filesystem organization | Tier is metadata, not folder; folder moves break links and git blame continuity | lift-track-source-document-cm_v0.3.0.md §3.6 |

## 5. Watched / candidate standards

| Standard | Scope | Why watched | Trigger for adoption |
|---|---|---|---|
| **A2A (Anthropic-to-Anthropic agent communication)** | Multi-agent interop protocol | D27 promoted multi-agent interop to first-class; specific protocol deferred | Sprint 0c+; first cross-sub-system multi-agent workflow |
| **AAIF (Agent-to-Agent Interop Framework)** | Multi-agent interop protocol alternative | Same as above — D27 candidate | Same as above |
| **Custom MCP-over-MCP composition pattern** | Multi-agent interop via MCP server chaining | Same as above — current `send_message` + MCP composition is adequate for MVP, not a long-term answer | Same as above |
| **TC39 Type Annotations (Stage 1 → Stage 2+)** | Open-standards type-annotation syntax | Escape hatch from TypeScript per D26 | TypeScript ecosystem deteriorates or TC39 reaches Stage 3 |
| **HTTP/3 (QUIC, RFC 9114)** | Transport multiplexing over UDP | Post-MVP performance optimization; configured at host level | Vercel / Cloudflare default ON; no app change |
| **WebAuthn / Passkeys** | Phishing-resistant auth | Post-magic-link evolution candidate | Apple/Google passkey ecosystem maturity + Supabase support |
| **CycloneDX VEX (Vulnerability Exploitability eXchange)** | Per-vulnerability assessment artifacts | Post-SBOM addition; useful when SBOMs are consumed by downstream auditors | Second contributor or external security review |
| **OWASP ASVS** | Application security control verification | Adoption candidate when external security review becomes load-bearing | First external security audit |

## Maintenance protocol

This profile is **append-only** with phase transitions allowed. Operations:

1. **Add a row** when a new standard becomes relevant.
2. **Promote a row** from Watched to Adopted, or from Adopted to Required, with a brief rationale and an ADR if the standard is load-bearing.
3. **Demote** rarely — moving a Required standard down requires an ADR and a migration plan.
4. **Decline** new candidates with rationale captured in section 4 so the rejection is durable.

When a standard's source URL or version changes, bump StdV-1 PATCH and update the row.

## Cross-references

**Architectural decisions:** D4 (Postgres), D6 (auth standards), D8 (Expo + Supabase + Sprint 0a sync stack standards), D9 (StoreKit / SBP for billing post-alpha), D17 (group_id convention is internal standard), D19 (Reasoner Duality is the foundational internal standard), D22 (TLS + encrypted storage), D26 (TypeScript + TC39 escape hatch), D27 (multi-agent interop watched standards), D28 (DoDAF + SysML iconography). Cross-cutting principles: every internal standard in section 3 maps to one or more.

**User stories:** US-001 (magic-link standard), US-003 (Apple Keychain), US-013 / US-014 / US-320 / US-321 (sync standards), US-050 (TestFlight + Apple submission), US-051 (Vercel + Web standards), US-070 / US-071 (LLM API + GenAI semantic conventions), US-090–US-095 (encryption + signed URL standards), US-310 (TLS), US-311 (RLS conventions), US-313 (AI transparency — internal hybrid `ai_interactions` standard).

**Sprint of last revision:** Sprint 0b Day 1 (2026-04-24). Initial population.

**Other DoDAF views referenced:** AV-2 §6 (architectural-principle definitions cross-listed in §3), SV-1 (the components that adopt the standards in §1 + §2), SV-6 (the rows that pin to the Standard column entries here), DIV-2 (the schema that adopts the data-format standards), CV-capabilities (the capabilities whose realization depends on these standards).

---

© 2026 Eric Riutort. All rights reserved.
