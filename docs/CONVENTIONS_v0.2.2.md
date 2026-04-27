---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-27
tier: OPERATIONAL
content_class: reference
version: 0.2.2
---

# CONVENTIONS — File Structure and Versioning Rules

## 1. Purpose

Authoritative file-placement and versioning specification for the XRSize4 ALL portfolio — Lifting Tracker, Reach4All, Concept, and future programs. When a session asks "where does this doc go, what do I name it, and how is it versioned," CONVENTIONS_v0.2.2.md is the answer of record. Downstream docs cite this file rather than restate the rules.

This file is Reference class and carries semver on structural revisions (see §8). Minor text edits bump `updated:` only.

## 2. Content classes recap

Four content classes govern every in-scope artifact in the portfolio, plus one named-but-deferred class. The canonical definition lives in `docs/reference/source-doc-cm-design.md` v0.3.0 §3.7. The matrix below is the scannable summary.

| Class | Typical artifacts | Workflow | Version scheme | GATE | Staleness policy |
|---|---|---|---|---|---|
| Architecture | ADRs, `architecture_v0.4.0.md`, `xrsize4all_concept_v0.2.0.md`, ontology plans | WF-003 full | Semver | Required | None (cited by pin; drift handled via `superseded_by:`) |
| Research | Finding reports, landscape scans, vendor analyses, book digestions | WF-003L (light) | Date-based default; semver if promoted to Reference | Optional per finding; **required** for landscape synthesis | Mandatory `stale_after:` tag, 90-day default |
| Operational | Kanban, metrics, risks, dispatch-handoff, retros, roadmap | Direct-edit or WF-003L depending on scope | Date-based (`updated:` is the version) | Optional; required only for material reorganization | Sprint-boundary review; read-only after 30 days |
| Reference | `CLAUDE.md`, `README.md`, `CONVENTIONS_v0.2.2.md`, orchestration, glossary | WF-003 full (soft GATE if no downstream pins) | Semver on structural revisions | Required | 180-day review horizon |
| Code | Source, tests, build scripts, IaC | **Deferred** to future code-cm | Not specified here | Not specified here | Not specified here |

Three inter-class invariants apply: every in-scope artifact declares its class in the manifest; the governance profile is machine-readable from the manifest; cross-class migration is an ADR.

## 3. Repo taxonomy

Each repo owns a distinct slice of the portfolio. A doc lives in exactly one repo; cross-repo pins express dependencies.

| Repo | Scope | Owned content |
|---|---|---|
| `~/lifting-tracker/` | Lifting Tracker app and its project docs | App code; project-scoped architecture, ADRs, retros, kanban, metrics, risks, orchestration; project-scoped reference docs |
| `~/reach4all/` | Portfolio-level research shared across XRSize4 ALL, Concept, and future programs | Landscape scans, vendor analyses, book findings, tool assessments, session analyses, pattern reviews, industry reports, CM design reviews |
| `~/Concept/` | Concept Computing architectural framework | Pipeline / MVCR / Design Principles docs under Concept's own Pipeline discipline |
| `~/xrsize4all/` (future) | Portfolio-level meta and cross-program artifacts | Program-level architecture, cross-program roadmaps |
| `~/document-cm/` and `~/code-cm/` (future) | Skill repos | SKILL.md, lib/, hooks/, manifests |
| `~/setup/` (future) | Distribution of skills, plugins, managed policy | Install scripts, managed-settings.json, plugin bundles |

Lifting Tracker is the authoritative copy of CONVENTIONS_v0.2.2.md today because most existing docs live there. When Reach4All matures a portfolio-level CONVENTIONS mirror, that mirror links back here and this file stays canonical until explicitly superseded.

## 4. lifting-tracker/docs/ structure

Canonical layout. Every existing doc in the repo resolves into one of these slots.

| Path | Content | Class |
|---|---|---|
| `docs/CLAUDE.md` (root) | Project-scoped Claude config | Reference |
| `docs/CONVENTIONS_v0.2.2.md` (this file) | Rule of record | Reference |
| `docs/architecture_v0.4.0.md` | D1–D27 full architecture record | Architecture |
| `docs/xrsize4all_concept_v0.2.0.md` | Platform-level system-of-systems concept | Architecture |
| `docs/architecture-comparison_v0.3.0.md` | Platform comparison and evolution phases | Architecture |
| `docs/themes-epics-features_v0.2.0.md` | Feature decomposition | Architecture |
| `docs/user-stories_v0.2.0.md` | 114 user stories | Architecture |
| `docs/ontology-plan_v0.1.0.md` | Exercise ontology plan | Architecture |
| `docs/roadmap_v0.4.0.md` | Sprint backlog and dependencies | Operational |
| `docs/kanban.md` | Live work tracker | Operational |
| `docs/metrics_v0.1.0.md` | Productivity baseline | Operational |
| `docs/risks_v0.1.0.md` | Risk register | Operational |
| `docs/dispatch-handoff.md` | Session-to-session handoff | Operational |
| `docs/effort-estimate_v0.1.0.md` | Effort planning | Operational |
| `docs/orchestration_v0.1.0.md` | Three-surface orchestration pattern | Reference |
| `docs/adrs/D##-slug.md` | One file per decision | Architecture |
| `docs/retrospectives/README_v0.1.0.md` | Retrospective convention | Reference |
| `docs/retrospectives/sprint-<id>.md` | Per-sprint retro | Operational |
| `docs/reference/` | Project-scoped reference ONLY after migration; portfolio-level research migrates to Reach4All | Mixed — migrate or reclassify |
| `docs/conversation-archive/` | Historical transcripts, date-prefixed | Operational (historical) |

Staging exception. Until Reach4All is stood up (Sprint 0b Day 1), portfolio-level research is staged under `docs/reference/`. Those files migrate per §9. After migration, `docs/reference/` holds only Lifting-Tracker-specific references.

## 5. reach4all/docs/ structure

Canonical layout for the portfolio-level research repo.

| Path | Content |
|---|---|
| `docs/architecture/` | Portfolio-level Architecture class (source-doc-cm-design.md, future code-cm-design.md, cross-program architecture) |
| `docs/research/ai-landscape/` | agentic-ai-landscape-scan, chatgpt/gemini/grok-agentic-ai-findings |
| `docs/research/vendors/` | workato-findings, context-hub-findings |
| `docs/research/books/` | building-agentic-ai-systems-findings, agentic-ai-bible-findings |
| `docs/research/tool-assessments/` | electricsql-assessment, mobile-app-db-landscape, observability-backend-assessment, frontier-models-catalog, github-pay-to-play-assessment |
| `docs/research/patterns/` | anthropic-engineering-patterns-review, managed-policy-research, what-are-agents |
| `docs/research/sessions/` | april-10-session-analysis and future session analyses |
| `docs/research/industry-reports/` | gartner-ai-native-swe-review, ai-productivity-sdlc-dataops-review |
| `docs/research/internal-research/` | community-research, best-practices-review, stack-validation |
| `docs/research/cm-design-reviews/` | source-doc-cm-design-validated-review and future CM-design peer reviews |
| `docs/operational/` | Portfolio-level operational docs (empty at standup) |
| `docs/reference/` | Portfolio-level Reference class (CONVENTIONS-portfolio mirror, glossary, etc. — empty at standup) |
| `skills/` | Portfolio-level SKILL.md files |
| `.cm/` | document-cm manifest and hooks once the skill ships |

New research docs land directly in the appropriate subcategory. Research added to a topic not yet represented spawns a new subfolder; reclassification is cheap and git-tracked.

## 6. Filename conventions

- **Case.** kebab-case for every filename except the uppercase rule docs (`CLAUDE.md`, `CONVENTIONS_v<version>.md`, `README_v<version>.md`), which follow the industry convention for repo-rule files.
- **Extension.** `.md` for markdown docs. Other extensions as appropriate (`.yaml`, `.json`, `.py`).
- **Date prefix.** For chronological content that accumulates without a monotonic ID: `YYYY-MM-DD_<slug>.md`. Used in `conversation-archive/`.
- **No date prefix where an ID is monotonic.** Sprint retros are `sprint-0a.md`, `sprint-0b.md`, etc. The sprint ID already orders the series; a date prefix would be redundant and brittle.
- **ADR naming.** `D##-slug_v<version>.md` where `##` is the decision number, `slug` is kebab-case, and `<version>` is the ADR's semver (`D25-source-document-cm_v0.1.0.md`).
- **Version in filename — semver-versioned docs only.** Files governed by semver (Architecture class, Reference class, substantive Operational class per the §7 amendment) carry their current version in the filename per the Concept Computing pattern: `<name>_v<version>.md` (underscore + lowercase v + dotted semver). Examples: `architecture_v0.4.0.md`, `CONVENTIONS_v0.2.2.md`, `roadmap_v0.4.0.md`, `D25-source-document-cm_v0.1.0.md`. Each version bump renames the file. Cross-references update at the same time. The filename and the frontmatter `version:` field carry the same value; mismatch is a defect.
- **No version in filename — Research class and point-in-time docs only.** Research-class docs use `valid_as_of:` + `re_check_by:` for freshness signals; point-in-time docs (sprint retros `sprint-<id>.md`, dated conversation archives `YYYY-MM-DD_<slug>.md`) encode their temporal scope in the filename. Both classes keep bare filenames because they have no semver to mirror.
- **Operational ledgers (kanban, dispatch-handoff) DO carry semver in the filename**, bumped at sprint boundaries. See §8 for the bump rule. The earlier informal practice of keeping `kanban.md` and `dispatch-handoff.md` as bare ledgers is reversed under v0.2.2 to prevent silent overwrite of historical state.
- **Baseline snapshots.** `.baseline-<state>-YYYYMMDD.md` at the same directory as the file they shadow. Examples: `.baseline-v0.2.0-20260423.md`, `.baseline-pre-sprint-0b-20260424.md`. Baselines do not carry a version-in-filename suffix — the `<state>` field already encodes the version they shadow.

### 6.1 Filename descriptiveness rule

Every filename must telegraph its content. Reading the name alone — without opening the file or consulting an index — a reader should know what's inside. Vague single-word names that don't name a topic (e.g., `community-research.md`, `best-practices-review.md`, `stack-validation.md`, `managed-policy-research.md`, `context-hub-findings.md`) are defects under this rule and must be qualified. Hashes, share IDs, ticket numbers, or other opaque tokens may not appear as the only descriptor in a filename — they may appear as a supplementary element if the descriptor is also present.

Apply at file creation and at any rename. When in doubt, choose the longer, more specific name. Filename length is not a constraint at portfolio scale; comprehension is.

### 6.2 Fixed-name exceptions

A small set of filenames is reserved by industry or repo convention and does NOT carry a version suffix or descriptor qualifier. The list is exhaustive — additions require a CONVENTIONS amendment.

| Fixed name | Convention source | Why no version |
|---|---|---|
| `CLAUDE.md` | Claude Code | Tool-specific reserved name |
| `README.md` | Industry standard | Repo-root convention |
| `MEMORY.md` | Auto-memory system | Tool-specific reserved name |
| `LICENSE` / `LICENSE.md` | Industry standard | Legal-document convention |
| `CHANGELOG.md` | Industry standard | Repo-root convention (when used) |
| `.gitignore`, `.gitkeep`, `.gitattributes` | Git | Tool-specific reserved name |
| `package.json`, `tsconfig.json`, etc. | Per-tool | Tool-specific reserved name |

Two prefix-conventions also exist; under these, the prefix is fixed but the rest of the filename remains descriptive and may carry a version suffix:

- ADRs: `D##-<descriptive-slug>_v<version>.md` — the `D##` numeric prefix is fixed; the slug must satisfy §6.1.
- DoDAF views: `<view-code>-<descriptive-slug>_v<version>.md` — the view code (AV-1, OV-5c, SV-6, etc.) is fixed; the slug must satisfy §6.1.

Point-in-time documents (sprint retros, dated conversation archives) carry no semver because they are not revised post-publication; their names encode the temporal scope and must remain descriptive of WHAT happened (sprint retros use `sprint-<id>.md` because the sprint ID identifies the work; conversation archives use `YYYY-MM-DD_<slug>.md` where the slug satisfies §6.1).

## 7. Required frontmatter fields per content class

Every in-scope doc carries YAML frontmatter. Fields marked required below must be populated; optional fields are listed in the `source-doc-cm-design.md` manifest schema. Every doc also closes with the copyright footer per §12.

### Architecture class

Required: `author`, `created`, `updated`, `tier`, `content_class`, `version`, `status`. ADRs additionally carry `decision_id`.

```yaml
---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-24
tier: ARCHITECTURE
content_class: architecture
version: 0.3.0
status: accepted
---
```

### Research class

Required: `author`, `created`, `updated`, `valid_as_of`, `re_check_by`, `tier`, `content_class`. Landscape-synthesis subtype additionally carries `subtype: landscape-synthesis`; individual findings carry `subtype: finding` (default).

```yaml
---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-23
tier: REFERENCE
content_class: research
---
```

### Operational class

Required: `author`, `created`, `updated`, `tier`, `content_class`. No version field — `updated:` is the version.

```yaml
---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-24
tier: OPERATIONAL
content_class: operational
---
```

### Reference class

Required: `author`, `created`, `updated`, `tier`, `content_class`, `version`.

```yaml
---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
tier: OPERATIONAL
content_class: reference
version: 0.1.0
---
```

Tier and content class are orthogonal. A Reference-class doc can sit at OPERATIONAL tier (retrospectives/README_v0.1.0.md, this file) or at REFERENCE tier (what-are-agents). The tier expresses authority; the content class expresses governance profile.

## 8. Versioning rules per content class

Unambiguous decision rules. Given any edit, the rule below answers "do I bump a version, and if so, which part."

**Architecture class — semver.** MAJOR on a breaking change to the model that consumers pin to. MINOR on additive changes (new section, new decision, new table). PATCH on clarifications and non-substantive wording. Baseline snapshot preserved on every MINOR and MAJOR bump (`.baseline-v<prev>-YYYYMMDD.md`). PATCH bumps do not require a snapshot.

**Research class — date-based default.** `updated:` is the version. Minor research-doc updates bump `updated:` only. A research doc that acquires a pinned downstream consumer promotes to Reference class via ADR (per §3.7.2 invariant 3) and adopts semver at that point.

**Operational class — date-based for documents, semver for ledgers.** Most Operational docs (metrics, risks, roadmap, retros, dispatch-handoff content) use `updated:` as the version; minor edits bump `updated:` only and git log carries the change history.

**Ledger exception (kanban, dispatch-handoff).** Pure work-tracking ledgers carry semver in the filename and are bumped at sprint boundaries. The MINOR digit increments on each sprint close (`kanban_v0.5.0.md` → `kanban_v0.6.0.md` at Sprint 0c close). MAJOR bumps reserved for ledger-schema changes (column addition, status-field redefinition). PATCH unused for ledgers. The bump renames the file, preserves the prior version in git history, and prevents silent overwrite of mid-sprint state.

**Reference class — semver on structural revisions only.** MINOR on a structural revision (new section, new rule, reorganization). PATCH on clarifications. Minor text edits that don't change the rule model bump `updated:` only, not `version`. CLAUDE.md, README.md, CONVENTIONS_v0.2.2.md, orchestration_v0.1.0.md are Reference class.

**Bump propagation.** When an Architecture-class doc bumps MINOR or MAJOR, consumers that pin to it are not auto-migrated. Consumers update their pin explicitly in a separate commit; manifest validation surfaces unpinned consumers.

## 9. Migration rules

Migration moves a doc from one repo or directory to another without data loss. The staging path — lifting-tracker/docs/reference/ as temporary home for portfolio-level research — generates the largest near-term migration load.

**Staging-to-Reach4All migration (per doc):**

1. Determine the target subcategory in Reach4All per §5.
2. COPY the doc (not move) to the target path. Preserve the body byte-for-byte.
3. Update frontmatter on the copy: add `migrated_from: <source-repo-path>` and `migrated_date: YYYY-MM-DD`. Reset `re_check_by:` if the migration itself triggers a review.
4. Verify byte-level body match: `diff <source> <target>` should differ only in frontmatter. A body diff is a defect — stop, reconcile, retry.
5. In a separate commit after verification, remove the original from lifting-tracker.
6. Update cross-references that pointed at the old path. Grep the portfolio for the old path; every hit is a pin to update.
7. Record the migration in the destination repo's manifest (when document-cm ships) or in a migration log until then.

**Reorganization within a repo (flat → subcategorized, etc.).** Same pattern: COPY → VERIFY → REMOVE → UPDATE-CROSS-REFS. The copy-first discipline prevents partial-migration states where a doc is neither findable at the old path nor complete at the new path.

**Cross-repo pins.** A doc in Repo A that cites a doc in Repo B uses a repo-qualified path: `reach4all://docs/research/ai-landscape/agentic-ai-landscape-scan.md`. The manifest resolves qualified paths when document-cm ships; until then, the qualified path is documentary.

**Class migration.** Moving a doc from Research to Reference (or any cross-class move) requires an ADR naming the authority shift, per `source-doc-cm-design.md` §3.7.2 invariant 3. The ADR bumps Architecture-class semver in the ADRs directory.

## 10. Change-log and baseline-snapshot discipline

**Change log.** Architecture and Reference class docs (anything with semver) carry a change log at or near the top of the document:

- Header table — version → date → one-line summary.
- Footer section — one expanded paragraph per row with concrete details.

Operational class docs (kanban, metrics, risks, retros, roadmap) do NOT carry explicit change logs. Git is the change log.

Research class docs may carry a change log if the finding is actively maintained. Point-in-time research snapshots do not — their `valid_as_of:` and `re_check_by:` tags carry the freshness signal.

**Baseline snapshots.** Required:

- Every Architecture-class MAJOR or MINOR version bump.
- Every significant Reference-class structural revision.
- Before any multi-edit session on a tier-1 (REFERENCE) or tier-2 (COMPANION) doc per `source-doc-cm-design.md` §5.7 Defense 4.

Not required for Operational or Research class unless manually invoked for a specific revision.

Filename: `.baseline-<state>-YYYYMMDD.md`. State is either the previous semver (`v0.2.0`) or a named checkpoint (`pre-sprint-0b`). Stored at the same directory level as the file it shadows. Immutable for the duration of the session that created it.

Periodic pruning allowed after one year. A pruned baseline is recoverable from git; the side-car file exists for session-scope diffability, not for permanent archival.

## 11. Diagrams and architectural views

Per ADR D28, the portfolio adopts a calibrated rigor profile for architectural diagrams: DoDAF view set, SysML iconography, rendered through mermaid in markdown. This section specifies the conventions; D28 carries the rationale for the discipline level chosen at solo+AI scale.

### 11.1 Overall posture

Mermaid embedded in markdown is the canonical diagram tool for the portfolio. Markdown is the canonical diagram format. NO formal SysML/UML modeling tools (Gaphor, draw.io as canonical, Cameo, Sparx EA) are used for sub-system architectural work. The repo is the model; the markdown+mermaid file is the source of truth. Per D28, this is the deliberate calibration for solo+AI scale — sufficient rigor to govern decisions, light enough to maintain without a modeling team.

### 11.2 DoDAF view set adopted

The portfolio adopts eleven named DoDAF views. Each view has a defined purpose, a preferred mermaid diagram type, and a canonical file location under `docs/dodaf/`.

| View | Purpose | Preferred mermaid type | Canonical location |
|---|---|---|---|
| AV-1 Overview & Summary | Plain-language scope, purpose, stakeholders, environment | mindmap or flowchart | `docs/dodaf/AV-1-overview_v0.1.0.md` |
| AV-2 Integrated Dictionary | Glossary of terms used across views | table (markdown), no diagram required | `docs/dodaf/AV-2-dictionary_v0.1.0.md` |
| CV Capability Viewpoint | Capability hierarchy and dependencies | mindmap (hierarchy) + flowchart (dependencies) | `docs/dodaf/CV-capabilities_v0.1.0.md` |
| OV-1 High-Level Operational Concept Graphic | The "one-picture concept" — actors, environment, value flow | flowchart with actor stereotypes | `docs/dodaf/OV-1-concept-graphic_v0.1.0.md` |
| OV-2 Operational Resource Flow Description | Operational nodes and the flows between them | flowchart (directed, labeled edges) | `docs/dodaf/OV-2-resource-flows.md` |
| OV-5a/5b Operational Activity Model | Activity decomposition (5a) and event-traced behavior (5b) | flowchart (5a) + sequenceDiagram (5b) | `docs/dodaf/OV-5-activity-model.md` |
| SV-1 Systems Interface Description | Systems, sub-systems, interfaces between them | classDiagram (SysML BDD-equivalent) or flowchart | `docs/dodaf/SV-1-interfaces_v0.1.0.md` |
| SV-4 Systems Functionality | Functional decomposition of each system | flowchart | folded into SV-1 unless complex |
| SV-6 Systems Resource Flow Matrix | Data and control exchanges between systems | erDiagram or table + sequenceDiagram | `docs/dodaf/SV-6-data-exchanges_v0.1.0.md` |
| SvcV Services Viewpoint | Service contracts, MCP servers, API surfaces | classDiagram with «service» stereotype | `docs/dodaf/SvcV-services.md` |
| DIV-1/2/3 Data and Information Viewpoint | Conceptual (1), logical (2), physical (3) data models | erDiagram | `docs/dodaf/DIV-2-logical-data_v0.1.0.md` (DIV-2 is the load-bearing one) |
| StdV-1 Standards Profile | Standards the system commits to (protocols, schemas, regulatory) | table (markdown), no diagram required | `docs/dodaf/StdV-1-standards_v0.1.0.md` |

Each DoDAF view file carries: `content_class: architecture`, semver in frontmatter per §7/§8, the diagram(s) embedded as mermaid blocks, and supporting prose stating the view's purpose and the decisions/stories it informs.

### 11.3 Fit-for-purpose principle

Each view producer has authority to ADD to or SUBTRACT from the standard DoDAF view contents based on what the specific view actually needs to support. Don't slavishly produce every DoDAF artifact — the framework is a checklist of available views, not a mandatory production list. State the purpose at the top of each view file. If a section of the standard DoDAF view template adds nothing for the sub-system in question, omit it; if a sub-system needs something the standard template doesn't carry, add it. Calibration over completeness.

### 11.4 SysML iconography conventions

Apply SysML iconography within mermaid's expressive limits. Where mermaid renders a SysML construct natively, use the SysML form. Where mermaid falls short, fall back gracefully (see §11.7).

- **Stereotypes in node labels.** Use SysML stereotypes: `«block»`, `«interface»`, `«service»`, `«valueType»`, `«requirement»`, `«activity»`, `«port»`, `«property»`. Render in mermaid node labels: `A["«block»\nLiftingTracker"]`.
- **Multiplicities.** Show on associations: `1`, `0..1`, `0..*`, `1..*`, `*`. Render on association edges in classDiagram and on labeled edges in flowchart.
- **Directionality.** Show association navigability with arrows. SysML: `--` for non-navigable, `-->` for unidirectional, `<-->` for bidirectional. Map to mermaid arrow syntax.
- **Compartments.** Where mermaid `classDiagram` supports it, use attribute and operation syntax for blocks: `+propertyName: ValueType` for properties, `+operationName(): ReturnType` for operations.
- **Naming.** PascalCase for blocks (`LiftingTracker`, `SessionRecord`). camelCase for properties and operations (`exerciseList`, `recordSet()`). UPPER_SNAKE for value-type enumerations.
- **Relationships.** Inheritance (`<|--`), composition (`*--`), aggregation (`o--`), and association (`--`) distinguished per UML/SysML standard. Mermaid classDiagram supports all four; honor the semantics.

### 11.5 Mermaid diagram type → DoDAF view mapping

| Mermaid type | Primary DoDAF view(s) | SysML equivalence |
|---|---|---|
| `flowchart` | OV-1, OV-2, OV-5a, SV-1, SV-4, SvcV | Activity Diagram / Block Diagram (informal) |
| `classDiagram` (with stereotypes) | SV-1, CV, SvcV | Block Definition Diagram (BDD) |
| `sequenceDiagram` | OV-5b, SV-6 (interaction sub-views) | Sequence Diagram |
| `stateDiagram` | Behavioral views, sub-system lifecycle | State Machine Diagram |
| `erDiagram` | DIV-2 (logical data model) | DIV-2 native form |
| `requirementDiagram` | Cross-cuts views; pinned to ADRs | Requirements Diagram |
| `mindmap` | CV (capability hierarchy), AV-1 | Informal hierarchical view |
| `timeline` / `gantt` | Roadmap (project schedule, not a DoDAF view per se) | n/a |
| C4-PlantUML mermaid syntax | May be embedded WITHIN DoDAF views where useful (e.g., C4 Container view inside SV-1) | Adjunct to BDD/IBD |

### 11.6 Cross-reference discipline

Every DoDAF view file links to:

- **Decisions it informs** — by D# reference into `docs/architecture_v0.4.0.md` (e.g., "supports D14, D15").
- **User stories it covers** — by US-### reference into `docs/user-stories_v0.2.0.md`.
- **Sprint(s) it was produced or revised in** — by sprint ID.
- **Other DoDAF views it depends on** — by view ID and path.

These per-file cross-references roll up into the portfolio-level cross-reference matrix at `docs/dodaf-cross-reference.md` (its own deliverable, governed separately from this CONVENTIONS file). The matrix is the auditable record that decisions, stories, and views are mutually consistent.

### 11.7 What gets which views

Sub-system maintainers are not on the hook for every view. The portfolio splits view production by scope:

- **Per sub-system (load-bearing four).** Every sub-system in XRSize4 ALL produces, at minimum: OV-1, SV-1, SV-6, DIV-2. These four answer "what does it do, what are its interfaces, what data does it exchange, what's its data model." Without these four, the sub-system isn't governable.
- **Portfolio / XRSize4 ALL platform level.** AV-1, AV-2, CV, StdV-1, OV-2, OV-5 are produced once at the platform level and cited from each sub-system. Sub-systems do not duplicate them.
- **Conditional.** SvcV is produced when the sub-system ships an MCP server (per the MCP-first principle). SV-4 is produced when functional decomposition is complex enough that SV-1 alone can't carry it. DIV-1 and DIV-3 are produced when the conceptual or physical layer needs explicit treatment beyond the DIV-2 logical model.

### 11.8 Tool fallback options

Where a diagram type genuinely cannot be rendered in mermaid + markdown (rare — examples include SysML Internal Block Diagrams with detailed port routing and Parametric Diagrams), acceptable fallbacks in order of preference:

1. **Inline SVG** via the orchestrator's visualize tool patterns. The SVG source lives in the markdown file or alongside it; the markdown file remains canonical.
2. **PNG export from a one-shot use of an external tool** (Excalidraw, draw.io, Gaphor) with the source file checked in alongside the PNG. The source file (e.g., `.excalidraw`, `.drawio`) is the regenerable artifact; the PNG is the rendered view.
3. **Descriptive markdown with explicit SysML-style notation in tables** when the diagram's information content is better expressed tabularly (e.g., a port matrix).

Excalidraw remains acceptable for sketch / brainstorming / non-canonical work. It is NOT acceptable for canonical DoDAF views — those must round-trip through the canonical mermaid+markdown form.

### 11.9 Presentation portability

Mermaid renders to SVG via build pipeline (`mermaid-cli` locally, GitHub native rendering for browse-time). For one-off presentation use in PowerPoint, Google Slides, or Apple Keynote, export the SVG and import into the slide. Live editing of architectural views inside those presentation tools is OUT OF SCOPE — the canonical view lives in markdown+mermaid in the repo. Presentations are derived artifacts and may drift from the canonical view; the repo is authoritative when they disagree.

## 12. Attribution rule recap

Every doc in the portfolio carries YAML frontmatter with `author: Eric Riutort`, `created: YYYY-MM-DD` (immutable after creation), `updated: YYYY-MM-DD` (bumped on every material edit), plus a footer line `© YYYY Eric Riutort. All rights reserved.`

This rule predates CONVENTIONS_v0.2.2.md and stays binding. No exceptions. An unattributed doc is a defect.

## 13. How future sessions use this doc

A session creating a new doc follows this decision sequence:

1. **Determine content class** (§2). Architecture / Research / Operational / Reference.
2. **Determine repo** (§3). Project-specific → lifting-tracker; portfolio-level → Reach4All; framework-level → Concept.
3. **Determine exact subfolder** (§4 for lifting-tracker, §5 for Reach4All).
4. **Apply frontmatter template** for the class (§7).
5. **Name the file** per §6 conventions.
6. **Apply versioning rule** per §8.
7. **If the doc is staged in lifting-tracker pending promotion, plan the migration** per §9.

A session that reads CONVENTIONS_v0.2.2.md first should be able to place any new doc correctly without asking. When the placement is ambiguous, flag the ambiguity as a CONVENTIONS_v0.2.2.md revision candidate — ambiguity is a defect in this doc, not a judgment call to be made per-session.

## 14. SDLC methodology

This section codifies the development methodology in use across the portfolio. It is descriptive (records what we do) and prescriptive (binds future sessions). When a session asks "is this how we work," §14 is the answer of record. If §14 omits a case the team encounters, surface the gap as a CONVENTIONS amendment candidate rather than improvise.

### 14.1 Sprint cadence

Sprints are measured in days, not weeks, under solo+AI execution. Sprint 0a ran 3 days. Sprint 0b ran 1 day. Sprint 0b1 (this sprint) is scoped at 1-2 days. Estimating in weeks reflects pre-AI human-developer time math and is a defect — Claude Code does the heavy implementation; sprint-scale work that would have taken a 2015 solo developer two weeks is typically 2-4 days under this stack.

When estimating any task or sprint, the baseline question is "what would Claude Code complete in a single day here," not "how long would a human take." If a task genuinely requires calendar weeks (external dependency, user trial period, legal review cycle), call out the specific reason explicitly.

### 14.2 Sprint structure

Each sprint runs four phases: planning → execution → close → retrospective.

- **Planning.** Scope is set with explicit close criteria (3-7 items). Close criteria are testable; "approved" means a defined artifact exists in a defined state.
- **Execution.** Work proceeds. Close criteria are not negotiable mid-sprint without an explicit re-scope. Items that surface mid-sprint and are not in scope land in the cleanup queue or the next sprint's backlog, not the current sprint.
- **Close.** All close criteria verified. Sprint state frozen — kanban semver-bumped, ledger snapshots committed, retrospective drafted.
- **Retrospective.** Written into `docs/retrospectives/sprint-<id>.md` per the retro convention (§14.4). The retro is the auditable record of what landed, what didn't, and what carries forward.

### 14.3 Sprint numbering

Primary sprints carry letter suffixes: `0a`, `0b`, `0c`, ... (then `1a`, `1b`, ... for major release cycles). Numeric inserts between letter sprints are permitted when scope demands a tight, focused sprint between two larger sprints — `0b1` between `0b` and `0c`, for instance. Inserts retain the prior letter (the `0b` family) and add a digit; they are full sprints with their own retro and close criteria, not sub-tasks of the parent letter sprint.

Reserved sprint IDs (`0a`, `0b`, `0b1`, `0c`) are not reused. A sprint that is cancelled or absorbed into another retains its ID in the historical record with a note in the retrospective.

### 14.4 Retrospective convention

Sprint retrospectives live at `docs/retrospectives/sprint-<id>.md` (no version, no semver — the sprint ID is the descriptor and the retro is point-in-time). Standard sections per the retros README: Outcome, Stats, Artifacts delivered, What worked, What didn't work, Improvements for next sprint, Key takeaways, Memory updates, Next sprint scoped.

The retrospective is mandatory at sprint close. A sprint without a retrospective is not closed.

### 14.5 SDLC work modes (between-sprint and continuous work)

Not all work fits the sprint-bounded model. Seven work modes exist, each with its own cadence and accountability:

1. **Sprint-bounded work** — primary mode. Scoped at planning, executed during the sprint, retrospected at close.
2. **Operational continuous work** — kanban grooming, status updates, dispatch-handoff edits. Happens within sprints but is not itself sprint-bounded; the kanban is the audit trail.
3. **Continuous-research streams** — Reach4All landscape scans, vendor assessments. Triggered by external events (vendor announcement, paper publication) on no fixed cadence; landings are commits, not sprint deliverables.
4. **Sprint-boundary activities** — close, retrospective, next-sprint planning. Ten-percent overhead at each boundary; sequenced as the final actions of the closing sprint and the first actions of the opening sprint.
5. **Cleanup queue / technical-debt sweep** — accumulated items too small to justify a sprint slot but too important to leave indefinite. Drained at sprint boundaries, in dedicated cleanup sprints (like 0b1), or rolled into the first day of the following sprint.
6. **Scheduled / cron-style work** — staleness reviews (`re_check_by:` triggers), baseline pruning at one-year mark, license renewals. Driven by date triggers, not sprint cadence.
7. **Memory updates** — feedback-class memory writes, project-class memory updates. Triggered by recognition events (user correction, successful pattern, scope shift) at any time; not sprint-bounded.

Each work mode has different governance. Sprint-bounded work follows full WF-003 with retrospective. Continuous-research follows WF-003L (light gate) per CM brief v0.3.0 §3.7. Operational continuous work direct-edits with git as the audit trail. Memory updates are file-only with no formal gate.

### 14.6 Gating model

The portfolio uses Eric-only manual gating. CM brief v0.3.0 §5 establishes the WF-003 Step 6 GATE as the single human-approval mechanism; no CI mechanical gate, no signed-commits-on-main, no multi-approver flow. This is the deliberate calibration for solo+AI scale. If the team grows to multi-approver or external-collaborator scope, this section is revisited via ADR.

Plan Mode (Claude Code Shift+Tab feature) is available to Eric for user-driven sessions on judgment-call work but is not enforced by hook or policy at autonomous-task scope. See `project_plan_mode_decision.md` memory file for the full rationale.

### 14.7 Where SDLC methodology lives

§14 is the current home for SDLC methodology, folded into CONVENTIONS for low overhead. If §14 grows past three pages or accrues sub-sections that don't fit the rest of CONVENTIONS, extract to a dedicated `sdlc-methodology_v<version>.md` doc at the lifting-tracker (or future xrsize4all) docs/ root. Until extraction, this section is authoritative.

## Change log

| Version | Date | Summary |
|---|---|---|
| 0.1.0 | 2026-04-24 | Initial version. Establishes content-class matrix, repo taxonomy, per-class frontmatter templates, versioning rules, migration procedure, baseline-snapshot discipline. |
| 0.2.0 | 2026-04-24 | DoDAF + SysML diagrams section added per D28. |
| 0.2.1 | 2026-04-27 | §6 Filename conventions amended: semver-versioned docs carry version in filename per Concept Computing pattern (`<name>_v<version>.md`). Reverses prior "no version in filename" rule. Date-versioned and pure-ledger docs unchanged. |
| 0.2.2 | 2026-04-27 | §6 Filename conventions amended — descriptiveness rule (§6.1), fixed-name exceptions (§6.2), ledger semver. §8 Operational ledger semver at sprint boundaries. New §14 SDLC methodology (sprint cadence, structure, numbering, retro convention, 7 work modes, gating). Sprint 0b1 deliverable. |

**v0.1.0 (2026-04-24).** First release. Codifies the rules that had been accumulating informally across `source-doc-cm-design.md` v0.3.0 §3.7, `retrospectives/README_v0.1.0.md`, `kanban.md`, `metrics_v0.1.0.md`, and the existing frontmatter patterns in `docs/adrs/` and `docs/reference/`. The Reach4All subfolder taxonomy (§5) reflects the staging → portfolio migration plan for Sprint 0b Day 1. No prior version to diff against; baseline is implicit in the Sprint 0a closing state captured in `.baseline-pre-sprint-0b-20260424.md` at the docs/ root.

**v0.2.0 (2026-04-24).** Adds §11 "Diagrams and architectural views" codifying the discipline established in ADR D28: mermaid-in-markdown as canonical diagram tool, eleven named DoDAF views (AV-1, AV-2, CV, OV-1, OV-2, OV-5a/5b, SV-1, SV-4, SV-6, SvcV, DIV-1/2/3, StdV-1) with file-location and per-view production guidance, SysML iconography conventions applied within mermaid's expressive limits, mermaid-type → DoDAF-view mapping table, fit-for-purpose ADD/SUBTRACT authority for view producers, cross-reference discipline tying views to D# decisions and US-### stories, fallback options for diagrams mermaid can't render, and presentation-portability rules. Renumbers prior §11 (Attribution) → §12 and prior §12 (How future sessions use this doc) → §13. Internal §11 reference in §7 frontmatter prose updated to §12. No content removed; §11 is purely additive. Baseline at `docs/.baseline-CONVENTIONS-v0.1.0-20260424.md`.

**v0.2.2 (2026-04-27).** Sprint 0b1 deliverable. Three substantive amendments and one new section.

- §6 Filename conventions: added §6.1 filename descriptiveness rule (every filename must telegraph its content; vague single-word names like `community-research.md`, `best-practices-review.md`, `stack-validation.md` are defects requiring qualification; opaque hashes/IDs may not be the sole descriptor) and §6.2 fixed-name exceptions list (CLAUDE.md, README.md, MEMORY.md, LICENSE, CHANGELOG.md, .gitignore, package.json/tsconfig.json — exhaustive list — plus prefix-conventions for ADRs and DoDAF views).
- §6 amended bullet: Operational ledgers (`kanban.md`, `dispatch-handoff.md`) reverse from bare filenames to `<name>_v<version>.md` semver pattern. Reverses the prior "pure ledger" exemption to prevent silent overwrite of historical state.
- §8 Versioning rules: amended Operational class rule — most Operational docs continue date-based, but ledgers (kanban, dispatch-handoff) carry semver bumped at sprint boundaries. MINOR increments on each sprint close.
- §14 SDLC methodology (new): sprint cadence in days under solo+AI; sprint structure (planning/execution/close/retro); sprint numbering with insert-sprints (0b1 between 0b and 0c); retrospective convention; 7 SDLC work modes (sprint-bounded, operational continuous, continuous-research, sprint-boundary, cleanup queue, scheduled, memory updates); Eric-only gating model with reference to CM brief v0.3.0 §5 and `project_plan_mode_decision.md`.
- Cross-references: all `CONVENTIONS_v0.2.1.md` references updated to `CONVENTIONS_v0.2.2.md` portfolio-wide. Baseline at `docs/.baseline-CONVENTIONS-v0.2.1-20260427.md`.

**v0.2.1 (2026-04-27).** §6 Filename conventions amended to encode the Concept Computing filename-versioning pattern. Files governed by semver — Architecture class, Reference class, substantive Operational class — now carry the version in the filename as `<name>_v<version>.md` (underscore + lowercase v + dotted semver). The prior "No version in filename" rule is reversed for these classes. Date-versioned (Research class) and pure-ledger (`kanban.md`, `dispatch-handoff.md`, sprint retros) docs continue to use bare filenames because they have no semver to mirror. Baselines also keep bare names; their `<state>` field already encodes the version they shadow. The ADR-naming bullet was updated to reflect that ADRs (Architecture class) carry version in filename per the new rule. CLAUDE.md and project-rule README files are noted as version-bearing where they have semver. The rule is self-applied: this file is `CONVENTIONS_v0.2.1.md`. Cross-references portfolio-wide were updated in the same Sprint 0b Day 1 commit that introduced filename versioning. No baseline snapshot for this minor amendment — change is small and the §6 text was the only material edit; the prior content survives at `docs/CONVENTIONS_v0.2.0.md` in git history (commit `df89d3f` — that earlier filename was renamed to `docs/CONVENTIONS_v0.2.1.md` as part of this amendment, applying the new rule to itself).

---

© 2026 Eric Riutort. All rights reserved.
