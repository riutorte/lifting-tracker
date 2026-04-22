---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-22
---

# Source Document Configuration Management — Design Brief

Configuration management design for source documents across the XRSize4 ALL portfolio. First application targets the Lifting Tracker and the Concept Computing project; the design is intentionally portable to the remaining XRSize4 ALL sub-systems (identity, coaching, content, biometrics, wearables, form analysis, instructional content) as each gets its own repo.

This is a design brief, not an implementation plan. Nothing in this document commits code, agents, or workflows. It names the target state, the trade-offs that got there, and the open questions that remain for Eric.

**Scope note.** "Source documents" here means architecture documents, decision records, specs, roadmaps, user stories, themes/epics/features, workflow definitions, companion references, and their manifests. It does not mean code, tests, or CI pipelines — those live in their own lifecycle. But it does cover the agent-and-skill definitions that operate on source documents, because those definitions are source documents too (a `SKILL.md` is a document; an agent's `AGENT_META` is a document fragment).

**Prior art in this repo.** This brief builds on `~/Concept/CLAUDE.md`, `~/Concept/AgentSuiteReference_v4.md`, `~/Concept/DesignPrinciples_v3.md`, and the two April-10-2026 migration plans (`migration_plan_claude_code.md`, `migration_plan_managed_agents_v2.md`, neither executed). It aligns with `docs/architecture.md` (D1–D24), `docs/themes-epics-features.md`, `docs/roadmap.md`, and `docs/reference/best-practices-review.md`. Where this brief contradicts any of those, this brief is wrong — flag it and correct the brief.

---

## 1. Alignment Context — Four Frames

This design must hold together under four disciplines at once. Below is what each frame demands, where they reinforce one another, and where they pull in opposite directions. The design choices in later sections are the specific reconciliations.

### 1.1 Agile methodology

The active agile structure in Lifting Tracker is Theme → Epic → Feature → Story → Task, with 8 themes, 31 epics, 109 features, and 114 stories organized into 8 two-week MVP sprints. This matches SAFe Essential and maps cleanly to a lightweight Scrum or Kanban overlay.

What agile demands of CM: documents must be tractable inside a sprint. Nothing in the CM discipline can require a multi-day approval cycle for a routine change. Backlog items must link to the story/feature they satisfy (traceability), but the linkage should not require a separate tracking system to maintain. Progress is measured in working software, not completed documents; but when the documents are the product (architecture, specs, ontologies), the rule inverts — working documents are working software for that project phase.

Tension with CI/CD: agile's rapid feedback loop wants short commit cycles; CM's baseline discipline wants stable named versions that downstream consumers can pin against. The design reconciles this with a split — working versions on trunk, baselines at tagged commits (Section 2).

### 1.2 CI/CD best practices

2026 state of the art for small-team CI/CD converges on: trunk-based development with short-lived branches, conventional commits that feed a `semantic-release`-style versioner, automated checks at PR time and pre-commit, declarative pipelines (GitHub Actions / GitLab CI), artifacts signed and version-tagged, and reproducible builds. Monorepo-capable tools (GitVersion 6, `semantic-release-monorepo`) let a single repo release multiple artifacts independently based on which paths changed.

What CI/CD demands of CM: every document bump is a commit; every commit is either testable or documented-as-untestable; every baseline is a named artifact. Validation belongs in hooks and Actions, not in human checklists. The manifest must be machine-readable so a CI job can parse it.

Tension with SDLC: CI/CD's bias toward automation conflicts with SDLC's bias toward documented manual decisions. The reconciliation is that automation handles mechanical checks (format, schema, link resolution, baseline preservation), while the GATE step in WF-003 — the single human-approval checkpoint — remains human and is surfaced as a PR review comment or a Claude Code skill prompt, not as an Action that fails the build.

### 1.3 SDLC discipline

IEEE/ISO/IEC 12207:2017 names configuration management as one of the technical-management processes required for any software life cycle and explicitly allows tailoring — "adopt high-risk areas first," not everything at once. The relevant disciplines: identification (what's a configuration item?), control (who can change it and how?), status accounting (what state is each item in?), auditing (periodic verification that the real state matches the recorded state), and traceability (requirements → design → implementation → test, tracked bidirectionally).

For documents, the ADR (Architectural Decision Record) pattern is the operational form this takes. MADR (Markdown ADRs) and Y-Statements are the two live formats; Y-Statements are terser and agile-friendly ("In the context of X, facing Y, we decided Z to achieve Q, accepting R"); MADR carries full alternatives and tradeoff analysis, suitable for decisions that will be re-litigated.

What SDLC demands of CM: configuration items are identified, their state is recorded, their change history is auditable, and dependencies between items are declared. The Concept Computing 4-tier hierarchy is already doing this (REFERENCE → COMPANION → MASTER → OPERATIONAL) — it's the identification and control mechanism.

Tension with agile: SDLC will add overhead if taken at face value (traceability matrices, formal CM boards, baseline audits). Section 7 (risk-vs-ops calibration) is where each discipline is individually graded adopt / adapt / skip.

### 1.4 Agentic-AI-dev best practices

2025–2026 agentic-AI engineering literature (Anthropic engineering posts, LangChain/LangGraph 1.0 docs, the Agentic AI Bible books from 2025, OpenAI agent guidance) has converged on a small set of load-bearing patterns relevant to documents:

- **Context engineering.** "Context is a finite resource with diminishing returns" (Anthropic, Sep 2025). Every token in a system prompt competes for attention. CLAUDE.md and its equivalents should be pointers to docs, not copies of docs.
- **Just-in-time retrieval** over pre-loading. Lightweight identifiers (paths, IDs, URLs) cheaper than whole-file loading.
- **Generator-evaluator separation.** The writer cannot be the verifier. The Book Boss verify step (Step 9 of WF-003) is exactly this pattern.
- **Brain-hands separation.** Reasoning (Claude) and execution (skill scripts, hooks, CI jobs) are decoupled. Interfaces outlast implementations.
- **Poka-yoke.** Fail loudly with guidance, never silently. The Concept ACL-004 Librarian bug is the cautionary example — silent title-match failure masked drift for a whole session.
- **Open skill format.** Anthropic published the Agent Skills specification as an open standard in December 2025; OpenAI adopted the same `SKILL.md` format for Codex CLI and ChatGPT. As of 2026 the same skill file runs across Claude Code, Cursor, Gemini CLI, Codex CLI, Antigravity IDE. This is significant for portability — it means Eric's skill investment survives a vendor switch.
- **Evaluation as the forcing function.** Anthropic's "Writing Tools for Agents" and the broader literature: without evals on realistic tasks, you can't tell whether a skill or tool is actually working. Applies to this CM discipline itself — the manifest and skills need to be evaluable against real doc-update scenarios, not theoretical ones.

What agentic-AI-dev demands of CM: the CM discipline must be AI-consumable. A human may read the manifest; an agent must be able to parse it, compute deltas from it, and generate commits against it. The agent must have composed tools (skills with scripts) because anything not composed into a tool gets skipped over long sessions — this is CC-017, the lesson Eric learned from Concept's governance erosion.

Tension with SDLC's human-authored discipline: the agent may *draft* the doc but cannot be the last word. Generator-evaluator separation and human GATE steps are how these are reconciled.

### 1.5 The four frames — alignment matrix

| Design dimension | Agile demand | CI/CD demand | SDLC demand | Agentic-AI-dev demand | Reconciliation |
|---|---|---|---|---|---|
| Cadence | Sprint-bound changes | Short commit cycles | Baselines at milestones | Per-skill-invocation changes | Trunk with tagged baselines |
| Format | Human-readable | Machine-parseable | Standardized | AI-consumable | YAML manifest + Markdown docs |
| Authority | Team consensus | PR review | ADR + CM board | Human GATE + AI draft | Single-person GATE for solo; ADR for significant; auto for trivial |
| Traceability | Story → feature → code | Commit → test → artifact | Requirement → design → impl → test | Skill invocation → output → verification | Frontmatter IDs + git log |
| Change control | Backlog grooming | Branch protection | Change Request Board | Skill + hook + CI | Conventional commits + tag protection |
| Auditability | Burndown + velocity | CI logs | CM audit | Scorekeeper log | git log + scorekeeper.json |

---

## 2. Versioning Scheme

Three kinds of thing get versioned, and they do not share a scheme.

### 2.1 Documents that express binding decisions or serve as dependencies → Semver

Architecture documents, agent specs, skill definitions, workflow definitions, ontology specs, and anything whose meaning other artifacts pin to. Version format: `MAJOR.MINOR.PATCH`.

- **MAJOR** — breaking: a downstream consumer that pinned to the prior version will produce wrong results without revisiting. Examples: D2 (per-set granularity) is rescinded; the set-grouping convention in D17 changes semantics; a canonical tier name changes.
- **MINOR** — additive: new decisions, new sections, new options; existing pins remain valid. Examples: D25 is added; a new section elaborates an existing decision without altering it.
- **PATCH** — typo, clarification, formatting, reordering without meaning change. Examples: a sentence is rephrased; a table header is clarified; a cross-reference is fixed.

This is the Concept pattern already in use: `concept_computing_pipeline_v5.md`, `DesignPrinciples_v3.md`, `AgentSuiteReference_v4.md`. Semver-in-the-filename is retained, because the filename is the first thing a consumer sees; any manifest-only version number invites drift (Concept's ACL-004 is precisely this kind of silent drift).

### 2.2 Append-only records → Date-based

Session reports, change logs, historian narratives, scorekeeper entries. These do not have "versions" in the semver sense because nothing pins to them; they accumulate. Version format: `YYYY-MM-DD` in the filename or as an ISO 8601 timestamp in the record. Ordering is chronological; no "next" entry contradicts a prior entry because they are factual records, not decisions.

Concept already does this: `reconcile/<date>` branches, session reports stamped with dates. Keep as-is.

### 2.3 Operational state → None

`notekeeper_data.json` (the backlog) and `doc_librarian_data.json` (the catalog) are mutable operational state. They do not carry a version; their authority comes from git history, not from a field inside the file. Concept previously tried to version these (`_file_version` inside JSON) and then explicitly replaced that with git — keep the replacement.

### 2.4 Bump propagation rules

- Bumping a **REFERENCE** document may force MINOR bumps in every COMPANION that cites it. This is not automatic; it is surfaced by the `cm verify` skill (see Section 9), which flags dependents whose pinned-version field in the manifest still points at the old version.
- Bumping a **COMPANION** may force a MINOR in MASTER.
- Bumping **MASTER** forces a PATCH or MINOR in OPERATIONAL (the registry row; the change log row).
- PATCH bumps never propagate. A clarification in the Pipeline doc does not force anything downstream to move.
- MAJOR bumps always propagate. A downstream doc must either re-pin to the new MAJOR (and potentially become MAJOR itself) or be explicitly frozen against the prior version in the manifest (see Section 4.4 on pinning).

### 2.5 Baselines vs working drafts

A **baseline** is a tagged commit where every in-scope doc is at a known version and the manifest reflects it. Baselines are what consumers pin to. Working drafts are the interval between baselines — trunk commits where individual docs are being updated. The manifest always describes the current state of trunk, not the latest baseline. Consumers who need baseline stability check out the tag.

Two kinds of baseline:

- **Per-document baseline** — `doc/<name>/v<version>` tag, created every time a single doc bumps. Already in Concept.
- **Portfolio baseline** — `baseline/<portfolio>/<YYYY-MM-DD>` tag, created when a coherent multi-doc state is worth naming (end of sprint, end of reconciliation pass, before a migration). Not frequent; opt-in.

### 2.6 Git tag discipline

Every semver bump creates a git tag atomically with the commit:

```
git tag doc/architecture/v1.3.0
git tag doc/design-principles/v3.1.0
```

Tags are immutable — never force-pushed. A wrong tag is retracted with a new tag, not a force-push. GitHub/GitLab tag protection rules enforce this.

Conventional commit prefix attaches the scope:

```
doc(architecture): add D25 offline sync conflict policy

Bumps architecture.md from v1.2.0 to v1.3.0 (MINOR, additive).
Resolves: NK-042
```

The scope (`architecture`, `design-principles`, `agent-suite-reference`, `workflow-003`, `skill-document-cm`) matches the document or artifact ID in the manifest.

### 2.7 When a bump is required vs optional

| Change | Bump? |
|---|---|
| New D-number added | MINOR required |
| D-number revised (meaning changes) | MAJOR required |
| D-number retracted | MAJOR required |
| Cross-reference fixed | PATCH required |
| Typo, markdown formatting, table alignment | PATCH optional — batch PATCHes are fine |
| YAML frontmatter `updated` date changed without content change | No bump — date alone is not a version trigger |
| Footer, copyright year updated | No bump |
| New document added | `v1.0.0` on first commit; no earlier versions |

Rule: if a downstream agent or reader would behave differently, bump. If they would not, don't.

---

## 3. Tier Model

### 3.1 Concept 4-tier as the canonical base

The Concept hierarchy is load-bearing and survives: REFERENCE → COMPANION → MASTER → OPERATIONAL, with the update rule that tiers cascade upward. Keep this for Concept Computing. The names are descriptive and the update rule (companions authoritative; master integrates; operational follows) is correct.

### 3.2 Tier definitions — portable, not Concept-specific

Rewriting the tier semantics so they apply to any XRSize4 ALL sub-system, not just Concept:

- **REFERENCE** — foundational; describes *what things are* and the vocabulary other docs use. Tends to change slowly. A reference doc being wrong means many other docs are wrong. Updates here propagate widely.
- **COMPANION** — deep-dive; describes *how things work* in a specific dimension. Cites references, elaborates them. Typically one per major architectural concern.
- **MASTER** — integration; the single doc a newcomer reads to understand the whole system. Pulls from references and companions. Never authoritative on its own — authority lives in the tier it integrates from.
- **OPERATIONAL** — live; describes the *current state* of the system. Registries, change logs, roadmaps, active-work trackers. Has the shortest half-life and the lowest bar for edits.

### 3.3 Lifting Tracker tier assignment

Applying these definitions to the existing `docs/` folder:

| Doc | Tier | Rationale |
|---|---|---|
| `xrsize4all_concept.md` | REFERENCE | Platform-level vocabulary the entire portfolio pins to. Lifting Tracker is *a sub-system of* XRSize4 ALL. |
| `user-stories.md` | REFERENCE | Canonical story catalog; every feature and every sprint cites a story ID. |
| `ontology-plan.md` | REFERENCE | Exercise ontology schema; the data model and the NL parser both pin to it. |
| `architecture.md` | MASTER | Integrates D1–D24 across the subsystem. |
| `architecture-comparison.md` | COMPANION | Elaborates architectural evolution; not canonical on its own. |
| `themes-epics-features.md` | COMPANION | Agile-layer elaboration of `user-stories.md`; derived, not authoritative. |
| `effort-estimate.md` | COMPANION | Sizing analysis; cites roadmap and stories. |
| `roadmap.md` | OPERATIONAL | Active planning doc; sprint contents mutate. |
| `dispatch-handoff.md` | OPERATIONAL | Session handoff artifact; regenerated each planning cycle. |
| `docs/reference/best-practices-review.md` | COMPANION | Analysis of external sources against architecture decisions. |
| `docs/reference/community-research.md` | COMPANION | Market/community landscape; informs but does not decide. |
| `docs/reference/source-doc-cm-design.md` | COMPANION | This document. |
| `docs/conversation-archive/*` | OPERATIONAL | Session records; append-only. |

Update order — any tier cascades upward. A change to `user-stories.md` (REFERENCE) may force changes in `themes-epics-features.md` (COMPANION) and then `architecture.md` (MASTER) and then `roadmap.md` (OPERATIONAL).

### 3.4 Concept tier assignment (existing, unchanged)

Keep as-is. Listed for portfolio coherence:

| Doc | Tier |
|---|---|
| `concept_computing_pipeline_v5.md`, `mvcr_v6.md`, `semantic_layers_v4.md`, `AgentSuiteReference_v4.md` | REFERENCE |
| `DesignPrinciples_v3.md`, `ConceptLifecyclePrinciples_v2.md`, `OntologySourceConsumption_v2.md`, `SystemsEngineeringConcerns_v2.md`, `Section19_BuildFramework_v2.md` | COMPANION |
| `ConceptComputing_v056.md` | MASTER |
| `ArchitectureRegistry_v2.md`, `AgentChangeLog_v2.md` | OPERATIONAL |

### 3.5 XRSize4 ALL portfolio view

XRSize4 ALL is a system of systems. Each sub-system (Lifting Tracker, Concept Computing, and the rest as they arrive) has its own tier stack. The portfolio view is:

```
XRSize4 ALL (root)
├── REFERENCE (portfolio-level)
│   └── xrsize4all_concept.md (lives in lifting-tracker today; may be promoted to its own repo later)
├── COMPANION (portfolio-level)
│   └── platform_comparison_v1.md (lives in Concept today)
└── Sub-systems
    ├── lifting-tracker/ (its own REF/COMP/MASTER/OPS stack)
    ├── Concept/ (its own REF/COMP/MASTER/OPS stack)
    └── [future sub-systems]
```

The portfolio-level REFERENCE docs are the ones every sub-system pins to. When `xrsize4all_concept.md` becomes contested across two sub-systems, it graduates to its own repo with its own manifest. That is a *future* decision (see Section 10 Q1), not a now-decision.

### 3.6 Tier is metadata, not a folder

Concept's migration plan v1 proposes folder-per-tier (`architecture/master/`, `architecture/companion/`, etc.). This brief recommends against it. Rationale: tier is a property of the document that can change; a folder move is disruptive (breaks links, breaks git blame continuity at a glance); and the manifest is the canonical source of the tier anyway. Keep docs in flat or semantic folders (`docs/`, `docs/reference/`, `docs/conversation-archive/`), carry tier in the manifest entry.

The one exception: `docs/reference/` is idiomatic for "background docs consumed by this project" and may stay as a folder convention. It does not map 1:1 to the CM tier — best-practices-review.md lives in `docs/reference/` as a folder-name but is a COMPANION tier doc.

---

## 4. Document Manifest Format

### 4.1 Purpose and authority

The manifest is the single machine-readable source of truth for: what docs exist, what tier they're in, what version they're at, what depends on what, and what state each is in. Where it conflicts with a doc's frontmatter, the manifest wins — the manifest is the authority for the catalog; the doc is the authority for its own content.

Per-project manifest at `<repo>/.cm/manifest.yaml`. This is the direct successor to Concept's `doc_librarian_data.json` and `ArchitectureRegistry_v2.md`. It replaces both.

### 4.2 Why YAML, not JSON

Open standards audit (Section 8) lands on YAML because:

- Human-readable for review (the manifest is commented, re-sorted, and audited by humans at least as often as by agents).
- Supports comments (`# Pinned to avoid D12 churn — revisit 2026-Q3`); JSON does not.
- Parseable by every target runtime (Python, Node, Go, Rust, shell via `yq`).
- Adopted by every adjacent tool (GitHub Actions, West manifests, Kubernetes, Zephyr, Cloud Foundry).
- Versioned-and-stable: YAML 1.2 (2009) is frozen; YAML 1.2.2 (2021) is a clarification, not a breaking change.

JSON would also satisfy the open-standards test, but would sacrifice comments. A JSON Schema accompanies the YAML manifest for validation (Section 9).

### 4.3 Minimal manifest schema

```yaml
# .cm/manifest.yaml
schema_version: "1.0"
project: lifting-tracker
updated: 2026-04-22
owner: ericriutort@gmail.com
portfolio:
  name: xrsize4all
  role: sub-system

# Documents in this project's CM scope
documents:
  - id: architecture
    path: docs/architecture.md
    tier: MASTER
    version: 1.2.0
    status: active           # draft | active | frozen | deprecated
    created: 2026-04-14
    updated: 2026-04-17
    owners: [ericriutort]
    depends_on:
      - id: user-stories
        version: ">=1.0.0,<2.0.0"
      - id: xrsize4all-concept
        version: "~1.0"        # compatible-with 1.0.x
    integrates:                # MASTER-only field
      - id: user-stories
      - id: themes-epics-features
    hash: sha256:0000...       # optional; set by 'cm freeze'
    tags:
      - doc/architecture/v1.2.0

  - id: user-stories
    path: docs/user-stories.md
    tier: REFERENCE
    version: 1.0.0
    status: active
    created: 2026-04-14
    updated: 2026-04-17
    owners: [ericriutort]
    depends_on: []

  - id: themes-epics-features
    path: docs/themes-epics-features.md
    tier: COMPANION
    version: 1.0.0
    status: active
    created: 2026-04-17
    updated: 2026-04-17
    owners: [ericriutort]
    depends_on:
      - id: user-stories
        version: "~1.0"
    derives_from:
      - id: user-stories

  - id: roadmap
    path: docs/roadmap.md
    tier: OPERATIONAL
    version: 0.9.0
    status: active
    created: 2026-04-19
    updated: 2026-04-19
    owners: [ericriutort]
    depends_on:
      - id: architecture
        version: ">=1.0"
      - id: themes-epics-features
        version: ">=1.0"

# Agent / skill artifacts that operate on this project's docs
skills:
  - id: document-cm
    path: .claude/skills/document-cm/
    version: 0.1.0
    status: draft
    provides: [baseline, change-map, verify, freeze, reconcile]
    depends_on:
      - id: manifest
        version: "1.0"

# Workflow definitions (Concept's WF-* or equivalents)
workflows:
  - id: wf-003-document-update
    path: docs/workflows/wf-003.md
    version: 1.0.0
    status: active
    replaces: [concept/wf_document_update.md]
    implemented_as: .claude/skills/document-cm/scripts/wf003.py

# Portfolio-level cross-references (pins to sibling projects)
portfolio_refs:
  - id: xrsize4all-concept
    repo: lifting-tracker          # may later move to its own repo
    path: docs/xrsize4all_concept.md
    pinned_version: "1.0.0"
```

### 4.4 Dependency pinning semantics

Pinning follows the npm/Cargo semver grammar so every runtime can interpret it consistently:

| Pin string | Meaning |
|---|---|
| `1.2.0` | Exact — any change bumps |
| `~1.2.0` | Compatible with 1.2.x; PATCH ok, MINOR forbidden |
| `^1.2.0` | Compatible with 1.x; MINOR ok, MAJOR forbidden |
| `>=1.0.0,<2.0.0` | Range |
| `latest` | Anti-pattern; manifest validation rejects |

Pinning is how frozen baselines survive active drift. A doc may pin its REFERENCE at an exact version and decide on a schedule when to un-pin.

### 4.5 Status lifecycle

- **draft** — not yet reviewed, not yet cite-worthy. A doc in draft is visible but not "published" for CM purposes.
- **active** — current; will be cited by other docs.
- **frozen** — intentionally pinned at a version, not being updated. Cite is still valid, but the doc will not bump. Used for docs that captured a specific state (a past decision, a past migration plan).
- **deprecated** — superseded. The manifest keeps the entry so old cites resolve. `superseded_by:` field names the replacement.

The two April-10-2026 migration plans (`migration_plan_claude_code.md`, `migration_plan_managed_agents_v2.md`) should both be `status: frozen` — they captured a moment, neither was executed, and the choice they represent is itself a decision worth preserving (Section 10 Q2).

### 4.6 Machine-readable but not machine-authoritative

The manifest is parseable, but it is not the last word on any doc's content. A doc's own frontmatter carries `author`, `created`, `updated`, and (per Eric's global standard) a copyright footer. The manifest does not duplicate those — it indexes to the doc where they live. Keeping content metadata in the doc and catalog metadata in the manifest prevents the ACL-004 style bug where a mismatched row in the catalog silently diverged from the filename.

### 4.7 What the manifest does not do

- Does not store document content or excerpts. Use the doc.
- Does not store commit history. Use `git log`.
- Does not store change proposals. Use `notekeeper_data.json` (or GitHub Issues — Section 10 Q3).
- Does not store full audit trail of changes. Use `scorekeeper.json` + `git log`.
- Does not encode business rules or decision content. Use ADRs inside the docs.

---

## 5. Workflow Integration Matrix

The Concept six-workflow set (WF-001 through WF-006) is the prior art. The question is what survives as-is, what becomes a GitHub Action, what becomes a local pre-commit or hook, and what becomes a skill-invoked check.

Guiding rule, derived from CC-017 and the "what's in the tool runs" lesson: governance steps must be *composed*, not listed. A workflow that says "the agent should remember to do X" will erode. A workflow that invokes a skill which runs a script which does X will not.

### 5.1 Mapping table

| WF | What it is | Current form (Concept) | Target form (Lifting Tracker + future) | Why |
|---|---|---|---|---|
| WF-001 Session Start | Load context, report state | Python exec chain, gated by Starter | Auto-loaded CLAUDE.md + `cm status` skill invocation | CLAUDE.md is loaded natively; explicit Starter unnecessary in Claude Code |
| WF-002 Session End | Save report, persist context, stop | Python exec chain | Stop hook + `cm report` skill | Hook ensures it runs on every Stop; skill formats the report |
| WF-003 Document Update | 15-step doc update with GATE | Python exec chain with embedded workflow | `cm update <doc>` skill (baseline → change-map → GATE → write → verify → record → tag) + pre-commit hook (format, schema) + GitHub Action (tag protection, baseline verification) | Skill is orchestrator; hook catches mechanical errors; Action catches tag/CI violations |
| WF-004 Reconciliation | Compare N docs, produce workbook, log gaps | Python exec chain | `cm reconcile <doc-a> <doc-b> [...]` skill | Skill reads manifest, dispatches to Book Boss reconcile.py |
| WF-005 New Document | Draft → review → register | Python exec chain | `cm new <tier> <id>` skill (scaffolds from template; adds manifest entry) + manual content authoring | Scaffolding is mechanical; content is not |
| WF-006 New Agent / New Skill | Design → skeleton → namespace → register | Python exec chain | `cm new-skill <id>` skill (uses Anthropic skill-creator as substrate) + manifest entry | skill-creator plugin already exists and handles the scaffold |

### 5.2 GitHub Actions — what runs in CI

Keep CI surface small. Only things that genuinely belong there:

1. **Manifest validation** — parse `.cm/manifest.yaml` against JSON Schema; fail build on schema violation.
2. **Link and cross-reference resolution** — every `[text](path)` and `doc/<id>` reference in every tier doc resolves; every `depends_on` in the manifest points at an `id` that exists.
3. **Version-monotonicity check** — a PR cannot decrease a doc's version unless it is explicitly a retraction (labeled so).
4. **Tag discipline** — on `main`, every `doc/*/v*` tag matches a commit that actually bumped that doc's version in the manifest.
5. **Frontmatter + footer audit** — every doc has the Eric-standard frontmatter and copyright footer.
6. **Format Controller equivalent** — no `.docx`, `.xlsx`, `.pdf` in version control; only `.md` / `.py` / `.json` / `.yaml` / `.yml` (expansion from Concept's three-format rule; see Section 8).
7. **Baseline preservation (opt-in)** — on tagged `baseline/*` commits, run the Book Boss verify step across the named documents.

Explicitly *not* in CI:

- Change-map generation (too interactive; belongs in the skill).
- Human GATE step (that's the whole point of being human).
- Governance recording (Scorekeeper / Historian / Reporter runs — those happen during the skill invocation, not in CI).
- AI-assisted content review (can run as an optional action, but gating builds on LLM judgment is anti-poka-yoke).

### 5.3 Pre-commit hooks — what runs locally before a commit

Local hooks catch mistakes before they reach the PR. Keep the list to things the developer (or Claude) can fix in seconds:

- `cm manifest-lint` — validate YAML + schema.
- `cm frontmatter-lint` — all modified `.md` files in `docs/` have author/created/updated/footer.
- `cm links-lint` — modified docs' internal links resolve.
- `cm format-check` — file extension is in the allow-list; no binary files snuck into `docs/`.

Runtime: should be under 3 seconds for a typical commit. Implemented either with `pre-commit` (the tool, config in `.pre-commit-config.yaml`) or as Claude Code Stop/PreToolUse hooks; both work. Recommend `pre-commit` the tool for open-standards portability — works without Claude Code.

### 5.4 Claude Code hooks — what runs on skill invocations

Different concept from pre-commit — these run when Claude is editing, not when the human commits. Useful when:

- **PreToolUse hook (Write/Edit on docs/)** — runs `cm frontmatter-inject` to add or update the `updated:` frontmatter date on any Markdown in `docs/`.
- **PostToolUse hook (Write on docs/)** — runs `cm format-check` immediately.
- **Stop hook** — runs `cm report --session` to generate the session report.
- **SessionStart hook** — runs `cm status` and attaches it to context.

These are thin wrappers around the same CLI scripts the CI uses. Brain-hands separation — skills don't re-implement checks, they call the same binary.

### 5.5 Skill-invoked checks — inside `cm update <doc>`

The skill composes the governance steps so they cannot be skipped:

```
cm update <doc-id>
 ├── 1. Read manifest entry for <doc>
 ├── 2. book_boss extract-baseline → .cm/scratch/<doc>-baseline.json
 ├── 3. book_boss build-change-map sources → .cm/scratch/<doc>-changemap.md
 ├── 4. Present change map to human — GATE (skill prompts Claude to stop, human approves)
 ├── 5. [After approval] Claude writes new version of <doc>
 ├── 6. cm validate <doc> (format, frontmatter, links)
 ├── 7. book_boss verify baseline against new version — refuse to proceed on content loss
 ├── 8. cm record <doc> <version-before> <version-after> <change-ids>
 │     ├── appends to .cm/scorekeeper.json
 │     ├── updates .cm/manifest.yaml (version, updated date, hash)
 │     ├── stages the commit
 │     └── creates tag doc/<id>/v<version>
 └── 9. cm report --session
```

Every one of those steps is a script. The skill's SKILL.md does not implement them inline — it orchestrates. This is the composition discipline Concept arrived at after CC-017.

### 5.6 What changed vs Concept

- **Primer**: Gone. CLAUDE.md is auto-loaded by Claude Code; no separate loader needed.
- **Starter + gate**: Gone. Claude Code session model replaces it.
- **Format Controller**: Becomes a hook + CI check; the Python agent is retired.
- **Version Coordinator**: Gone. Git + semver replaces it.
- **Agent Registrar**: Replaced by skill discovery (Anthropic Skills format — SKILL.md files auto-discovered).
- **Timekeeper**: Dropped. CI job duration and `session-started-at` in the report suffice.
- **Courier**: Dropped. Git is the transport.
- **Agent Architect**: Dropped. Skill format is the open standard; no separate blueprint authority needed.
- **Instruction Verifier**: Dropped. CLAUDE.md is always loaded; the check was infrastructure-theatre after native loading arrived.

- **Book Boss**: Stays as a script inside the `document-cm` skill.
- **Notekeeper**: Stays as `.cm/notekeeper.json`, *or* migrates to GitHub Issues with the `cm-backlog` label (open question — Section 10 Q3).
- **Scorekeeper**: Stays as `.cm/scorekeeper.json`, append-only. Complements `git log`; the two are redundant but the JSON is easier to script against.
- **Doc Librarian**: Replaced by the manifest. This is the big consolidation.
- **Historian**: Largely replaced by `git log` + `git tag`; retain a thin `cm history <doc>` skill command that queries git and formats the output.
- **Context Persistence**: Replaced by Claude's native memory + the session reports in `reports/`.
- **Reporter**: Stays as a script; output is Markdown session reports.

---

## 6. Agent-to-Skill Refactor Plan

This section is the audit trail for every agent in the Concept 16-agent suite. One row per agent. The column "Disposition" is the recommendation; the column "Justification" is why.

| # | Agent | Class | Disposition | Target form | Justification |
|---|---|---|---|---|---|
| 0 | Primer | Super Agent | **Drop** | CLAUDE.md auto-loaded by Claude Code + `@file.md` imports | The Primer exists to solve a Phase-0 loading problem that Claude Code solves natively. Keeping it would be infrastructure theatre. |
| 1 | Starter | Meta/Gov | **Drop** | Claude Code session lifecycle | Same rationale — the gate exists because `exec()`ing 15 Python files into a Claude.ai conversation is fragile. Claude Code sessions are already gated. |
| 2 | Book Boss | Doc Mgmt | **Stay** — as skill script | `.claude/skills/document-cm/scripts/book_boss.py` | This is the core analysis engine. Extracts baselines, builds change maps, verifies. Cannot be replaced by a hook or a git convention — it requires judgment (LLM) and structured output. Stay, but shrink: the skill handles orchestration, so Book Boss does only what's unique to it. |
| 3 | Doc Librarian | Doc Mgmt | **Replace** | `.cm/manifest.yaml` + `cm status` skill command | The Librarian was a pre-git catalog. Git + manifest replace the catalog function; skill command replaces the query interface. The ACL-004 title-match bug vanishes because the manifest is keyed on stable IDs, not on fuzzy title matching. |
| 4 | Notekeeper | Meta/Gov | **Stay** — as skill script, *or* migrate to GitHub Issues | `.cm/notekeeper.json` + `cm note` / `cm notes` commands, or GitHub Issues with `cm-backlog` label | The backlog function is real and Claude needs to query it. JSON keeps it offline-first; GitHub Issues is more portable and gets UI for free. Decision deferred — Section 10 Q3. |
| 5 | Scorekeeper | Meta/Gov | **Stay** — as skill script, auto-recorded by skill | `.cm/scorekeeper.json`, append-only | Append-only audit trail. `git log` is redundant but the JSON is easier for skills to analyze. Keep both; they reconcile. |
| 6 | Historian | Meta/Gov | **Replace, mostly** | `cm history <doc>` skill command that queries `git log --tags` | The Historian wrote narrative changelogs. `git log --follow --all doc/<id>/v*` replaces 90% of this. The remaining 10% — the narrative summary — is a skill invocation on demand. |
| 7 | Agent Registrar | Meta/Gov | **Drop** | Anthropic skill discovery (SKILL.md files auto-registered) | Skills are discovered natively. A separate registry is duplicate state. |
| 8 | Courier | Utility/Export | **Drop** | Git push / GitHub releases / `tar` | The Courier packages and exports files. Git does this. |
| 9 | Timekeeper | Meta/Obs | **Drop** | Session report header carries wall-clock start / end | Interesting but not load-bearing. Remove and revisit if it ever actually gets used. |
| 10 | Reporter | Meta/Obs | **Stay** — as skill script, invoked by Stop hook | `.claude/skills/document-cm/scripts/reporter.py` → writes `reports/session_<timestamp>.md` | Session reports are high-value for long-running work. Keep. Simplify output — markdown, no legacy `.txt`. |
| 11 | Agent Architect | Meta/Gov | **Drop** | Anthropic SKILL.md format is the open standard; use Anthropic's `skill-creator` plugin for scaffolding | Replacing an open standard with a bespoke blueprint is a lock-in mistake. |
| 12 | Version Coordinator | Meta/Gov | **Drop** | Git + semver + tag discipline | This agent exists because the Claude.ai environment didn't have git. Now we do. |
| 13 | Instruction Verifier | Meta/Gov | **Drop** | CLAUDE.md is always loaded | Per-prompt verification was a compensating control for unreliable loading. Claude Code loads CLAUDE.md deterministically. |
| 14 | Context Persistence | Meta/Gov | **Replace** | Claude Code auto memory + session reports | Native memory system at `~/.claude/memory/` plus markdown session reports in `reports/` cover this. Cross-session recall is a native feature now. |
| 15 | Format Controller | Meta/Gov | **Replace** | Pre-commit hook + PostToolUse hook + CI check | Format validation is the textbook use case for hooks. No LLM needed. |

### 6.1 What's in the skill — concrete file layout

```
.claude/skills/document-cm/
├── SKILL.md                      # single entry point
├── scripts/
│   ├── book_boss.py              # baseline / change-map / verify
│   ├── reporter.py               # session report generator
│   ├── manifest.py               # manifest CRUD + schema validation
│   ├── reconcile.py              # N-doc comparison
│   ├── notekeeper.py             # backlog operations (if JSON path chosen)
│   └── wf003.py                  # WF-003 orchestrator
├── references/
│   ├── workflow-patterns.md      # Chain, Route, Parallel, etc. (from Anthropic)
│   ├── verification-criteria.md  # what "correct" means per task
│   └── tier-model.md             # explanation of REF/COMP/MASTER/OPS
├── templates/
│   ├── reference-doc.md          # frontmatter + outline for a new REFERENCE
│   ├── companion-doc.md
│   ├── adr-madr.md               # MADR ADR template
│   └── adr-ystatement.md         # Y-Statement ADR template
└── schemas/
    └── manifest.schema.json      # JSON Schema for manifest.yaml
```

This layout is portable — the same skill package drops into Concept as-is (only the `references/` files differ in content where Concept has its own tier conventions, but the filenames and structure match).

### 6.2 What's NOT in the skill

- No GATE enforcement inside the skill script. The GATE is a Claude-prompted human approval, not an `input()` call.
- No LLM prompt templates encoded in Python. The skill's SKILL.md carries the orchestration prompt; scripts do deterministic work only.
- No dependency on Anthropic-specific runtime features. The scripts run under plain Python 3.11+ and can be called from any shell or CI job. This is deliberate portability.

### 6.3 Retention vs retirement at a glance

- **Stays (as skill script)**: Book Boss, Notekeeper (pending Q3), Scorekeeper, Reporter. That's 4 of 16.
- **Replaced by native mechanism**: Doc Librarian (→ manifest), Historian (→ git log), Context Persistence (→ Claude memory), Format Controller (→ hook), Version Coordinator (→ git), Primer (→ CLAUDE.md), Starter (→ session), Instruction Verifier (→ always-loaded), Agent Registrar (→ skill discovery), Agent Architect (→ SKILL.md standard). That's 10 of 16.
- **Dropped outright**: Timekeeper, Courier. That's 2 of 16.

From 16 bespoke Python agents to 4 skill scripts. The ones that survive survive because they do real work an LLM + open standard can't do for free.

---

## 7. Risk-vs-Ops Calibration

Every discipline below is individually graded against a solo-plus-AI team reality. The question for each row is: *does the failure mode this discipline prevents actually bite Eric, given his working pattern?*

Calibration rule, saved in Eric's agent memory: **this is solo and AI-assisted, not enterprise. A practice that would be mandatory with a 12-person team may be irrational with one person plus Claude.** Adopt the discipline only if the failure mode is real for this size and speed of work.

### 7.1 Risk-vs-ops matrix

| Practice | Risk / failure mode prevented | Throughput cost | Recommend | Rationale |
|---|---|---|---|---|
| **Full MADR ADRs for every decision** | Missed alternatives; future re-litigation without context | 20–45 min per decision | **Adapt** | Use MADR only for MAJOR architectural decisions (trigger = MAJOR bump). Use Y-Statements inline in the doc for MINOR. Don't ADR trivia. |
| **Y-Statement ADRs inline** | Unstated rationale; drift | 2–5 min per decision | **Adopt** | Near-zero cost; captures `we decided X because Y, accepting Z` in one sentence. D1–D24 in Lifting Tracker are already essentially Y-Statements. |
| **Traceability matrix (story → feature → test → commit)** | Orphan features; dead code; regression coverage gaps | 1–2 hr/sprint to maintain as a separate artifact; 5 min/sprint if embedded | **Adapt** | Don't build a separate matrix. Use story IDs (US-XXX) as tags in feature docs, commit messages, and PR titles. `git log --grep="US-042"` is the traceability query. |
| **Frozen baselines (git tag per version bump)** | Downstream consumer breakage; irreproducible past states | Minor — one `git tag` per bump | **Adopt** | Concept already does this. No-brainer. |
| **Portfolio baselines (multi-doc coherent tag)** | Inability to answer "what was the state on date X" | One tag at end of sprint / migration | **Adopt** | Low cost, high value at quarter boundaries. Don't over-tag. |
| **Quality gates — format, frontmatter, link resolution** | Silent drift; broken cross-refs | Zero ongoing (it's automated) | **Adopt** | Hooks and CI. Must be < 10s total. |
| **Quality gates — baseline preservation (Book Boss verify)** | Content loss during updates | 10–30s per run | **Adopt** | This is the single highest-leverage check Eric has. Keep. |
| **Quality gates — LLM-assisted content review** | Subtle regressions LLM can spot | 30s–3min per run; may fail build on judgment | **Adapt** | Run as non-gating advisory check. Never fail a build on LLM judgment — poka-yoke violation. |
| **Change Control Board / formal approval workflow** | Unreviewed decisions in shared codebase | Hours per decision; requires multiple people | **Skip** | No board exists. Human GATE at WF-003 Step 6 *is* the change control — one person, one decision, approved inline. |
| **Full CM audit (periodic verification that recorded state matches reality)** | Drift between catalog and files (ACL-004 class bug) | A full day per audit | **Adapt** | The daily equivalent is `cm validate` in CI, which validates every PR. Skip the periodic audit — the CI job is the audit, run continuously. |
| **Traceability — bidirectional (requirements ↔ tests ↔ impl)** | Requirement silently dropped | High; requires tooling and discipline | **Skip for MVP**; **Adapt for v2+** | MVP has 114 stories and one person. `git log --grep="US-"` is enough. At v2 scale with multiple contributors, revisit. |
| **Risk register (strategic risks + mitigations, tracked)** | Blind spots on threats that are nobody's immediate problem | 30 min / quarter | **Adapt** | Keep as an OPERATIONAL doc, `docs/risks.md`, reviewed at sprint boundaries. Four-to-six rows. Don't let it become a compliance artifact. |
| **Change proposals captured as tickets** | Loss of "we almost changed X but decided not to" | 30 sec per item | **Adapt** | GitHub Issues with `cm-backlog` label, or `.cm/notekeeper.json`. Either works. Q3 to decide. |
| **Scorekeeper — append-only change ledger** | Audit trail loss; inability to reconstruct "what was done and when" | Auto-recorded by skill | **Adopt** | Redundant with `git log` in content, but the JSON is easier to query programmatically. Near-zero cost since the skill writes it. |
| **Session reports (Reporter)** | Loss of context across sessions | Auto-generated by Stop hook | **Adopt** | High value when Claude picks up work days later. Keep. |
| **Conventional commits (feat/fix/doc/breaking)** | Inability to auto-generate changelogs or detect breaking changes | Trivial — one prefix per commit | **Adopt** | Feeds `semantic-release` if Eric ever wants automated version bumping. |
| **Automated version bumping (semantic-release)** | Manual version management errors | One-time setup + config | **Skip for now**, **revisit at v2** | For source docs specifically, MAJOR / MINOR / PATCH judgment is nontrivial and deserves human thought. Don't automate the bump. Do automate the tag creation after the human decides. |
| **Per-doc ownership in manifest** | Diffusion of responsibility | Zero — one field per entry | **Adopt** | Eric is the owner for all of them today. Cost is symbolic; value arrives when collaborators arrive. |
| **Document deprecation lifecycle (deprecated + superseded_by)** | Stale docs masquerading as current | One field per entry | **Adopt** | The two April-10 migration plans are exhibit A. Mark both `frozen` with a note. |
| **Portfolio-level manifest aggregation** | Cross-project drift | Low at N=2; grows with N | **Defer** | Not needed until N ≥ 3 sub-systems. Lifting Tracker + Concept is not yet a portfolio in the CM sense. |
| **Schema-complete manifest entry (dependencies, hash, tags, owners)** | Manifest-as-narrative instead of machine-readable | One-time entry | **Adopt** | Fill the fields. They cost little and enable every automation downstream. |
| **Hooks for CLAUDE.md loading verification (Instruction Verifier analog)** | Claude starts work without reading instructions | Per-prompt overhead | **Skip** | CLAUDE.md is always loaded in Claude Code. This check existed to compensate for Claude.ai's looser loading. |
| **SDLC-style Configuration Items identified with unique IDs** | Ambiguous references | Zero — use manifest `id:` field | **Adopt** | The `id:` field in the manifest *is* the CI-identifier. |
| **Formal Release Notes per version bump** | Consumers don't know what changed | 5–15 min per bump | **Adapt** | One-line changelog entry in the doc's YAML frontmatter or in a release-notes section. Don't write a marketing blurb. |

### 7.2 Summary — what this adds up to in practice

**Adopt (13 practices):** Y-Statement ADRs inline, frozen per-doc baselines, portfolio baselines at sprint boundaries, format / frontmatter / link quality gates, baseline preservation gate, scorekeeper ledger, session reports, conventional commits, per-doc ownership, deprecation lifecycle, schema-complete manifest, SDLC CI IDs, status accounting via manifest `status:` field.

**Adapt (8 practices):** MADR only for MAJOR, traceability via IDs not matrices, LLM review advisory-only, risk register lightweight, change proposals via Issues or JSON (Q3), CM audit via continuous CI, release notes as one-liners, full traceability deferred to v2.

**Skip (3 practices):** Change Control Board, automated version bumping (for source docs), per-prompt instruction verification.

**Defer (2 practices):** Portfolio-level manifest aggregation until N≥3, full bidirectional traceability until team grows.

Net — the CM discipline proposed here is Concept's best ideas distilled down, not expanded. The emphasis is on mechanical checks that run in seconds and human decisions that happen once.

---

## 8. Open-Standards Audit

Every format choice in this design gets a line here justifying its open-standards status. Eric's stance on open standards is non-negotiable (Concept Design Principles §2.1 — "OWL as Canonical Representation"; broader principle: all standards open, all code open, all knowledge shared).

### 8.1 Format audit

| Format | Role | Standard | Status | Lock-in risk |
|---|---|---|---|---|
| **Markdown** | Document format | CommonMark 0.31 (2024) | Open, widely implemented | None. Renders in every editor, every VCS, every browser. |
| **YAML** | Manifest, frontmatter | YAML 1.2.2 (2021 clarification; 1.2 frozen since 2009) | Open, Apache-licensed libraries everywhere | None. Parseable by Python, Node, Go, Rust, shell (`yq`). |
| **JSON** | Agent data files (scorekeeper, notekeeper) | ECMA-404 (2013), RFC 8259 (2017) | Open, universal | None. |
| **JSON Schema** | Manifest validation | JSON Schema 2020-12 | Open, in widespread use | None. |
| **Semver** | Version strings | semver 2.0.0 | Open spec; semver.org | None. |
| **Conventional Commits** | Commit message format | Conventional Commits 1.0.0 | Open, CC BY 3.0 | None. Used by `semantic-release`, Commitizen, and many CI tools. |
| **Git** | Version control | Git 2.x; plumbing protocols public | Open source, widely mirrored | None. Even GitHub/GitLab lock-in is limited — the repo moves with a `git push`. |
| **SKILL.md** | Skill package format | Anthropic Agent Skills spec, December 2025; adopted by OpenAI Codex CLI, Cursor, Gemini CLI, Antigravity IDE, ChatGPT | **Open as of Dec 2025**, universal as of 2026 | **Low as of 2026** — multi-vendor adoption reduced lock-in. Before the December 2025 standardization this would have been a flag; it is no longer. |
| **Python** | Skill script runtime | Python Software Foundation, PEP-governed | Open | None — runs on any POSIX + Windows. |
| **GitHub Actions YAML** | CI workflow definitions | GitHub-controlled syntax | **Vendor-specific** | **Medium** — migrating to GitLab CI, CircleCI, or Dagger requires rewriting. Mitigation: keep the shell commands inside Actions minimal; most logic lives in `cm *` CLI commands in the skill, which run anywhere. |
| **`pre-commit` tool** | Local hook framework | Apache-2.0, `pre-commit/pre-commit` | Open | None. |
| **Claude Code hooks** | Editor-integrated hooks | Anthropic-documented | **Vendor-specific** | **Medium** — hooks only run in Claude Code. Mitigation: all substantive logic is in `cm *` CLI; the hook is a one-line invocation. Moving to another IDE means rewriting one file. |

### 8.2 Hidden-lock-in review

The two vendor-specific surfaces (GitHub Actions, Claude Code hooks) are both thin wrappers around open-standards CLI commands. If GitHub becomes untenable or Eric moves off Claude Code, the CI and hooks rewrite is hours, not weeks, because the substance is in:

- Markdown docs (portable)
- YAML manifest (portable)
- Python scripts in the skill (portable)
- Git repo and tags (portable)
- JSON data files (portable)

This is the brain-hands separation principle applied to CM tooling. Vendor-specific layers are hands; the brain (the design, the scripts, the data) is portable.

### 8.3 Proprietary surface that is Eric's own IP

The Concept `*_agent.py` scripts are proprietary and marked as such (copyright Eric, "Proprietary and Confidential" watermarks). This brief recommends (Section 10 Q6) that Eric relicense the surviving scripts (Book Boss, Notekeeper, Scorekeeper, Reporter) under an open license (Apache-2.0 or MIT) when they move into the `document-cm` skill — *or* keep proprietary if he prefers. This is an IP decision, not a CM decision. Both are compatible with the CM design.

### 8.4 What the open-standards stance forbids

- Proprietary document formats (`.docx`, `.pptx`, `.xlsx`, Notion export-only, Google Docs native). These may be produced as derived artifacts but cannot be canonical CM sources.
- Proprietary version control systems (Perforce, ClearCase). Use git.
- Closed manifest or registry formats (Notion databases, Airtable, proprietary ADR tools). Use YAML + JSON Schema.
- Vendor-locked agent runtimes (frameworks that only run on one cloud). LangChain, LangGraph, LlamaIndex are all open source and portable; Anthropic's skill format is now an open standard; Claude API is callable from any HTTP client.

---

## 9. Implementation Sketch

Concrete examples of every file the design refers to. These are illustrative, not prescribed — they show what the design materializes as, so Section 10's open questions are resolvable against real artifacts.

### 9.1 File tree — per-project CM directory

```
lifting-tracker/
├── .cm/
│   ├── manifest.yaml             # single source of truth for docs in scope
│   ├── scorekeeper.json          # append-only change ledger
│   ├── notekeeper.json           # pending-change backlog (if JSON path chosen)
│   ├── scratch/                  # transient working files from cm commands; .gitignore'd
│   │   ├── architecture-baseline.json
│   │   └── architecture-changemap.md
│   └── README.md                 # explains the CM layout to a human walking in cold
├── .claude/
│   ├── skills/
│   │   └── document-cm/          # the CM skill package
│   │       ├── SKILL.md
│   │       ├── scripts/
│   │       ├── references/
│   │       ├── templates/
│   │       └── schemas/
│   └── hooks/
│       └── cm-hooks.json         # PreToolUse / PostToolUse / Stop / SessionStart wiring
├── .github/
│   └── workflows/
│       ├── cm-validate.yml       # manifest lint, links, frontmatter, tag discipline
│       └── cm-baseline.yml       # runs on baseline/* tags only
├── .pre-commit-config.yaml
├── CLAUDE.md                     # pointers, not content; < 200 lines
├── docs/                         # all canonical CM sources
│   ├── architecture.md
│   ├── user-stories.md
│   ├── themes-epics-features.md
│   ├── roadmap.md
│   ├── xrsize4all_concept.md
│   ├── ontology-plan.md
│   ├── effort-estimate.md
│   ├── dispatch-handoff.md
│   ├── reference/
│   │   ├── best-practices-review.md
│   │   ├── community-research.md
│   │   └── source-doc-cm-design.md
│   └── conversation-archive/
├── reports/                      # session reports; append-only; .gitignore'd or committed (Q7)
└── ... (code tree unchanged)
```

### 9.2 `.cm/manifest.yaml` — full worked example for Lifting Tracker as of 2026-04-22

```yaml
schema_version: "1.0"
project: lifting-tracker
updated: 2026-04-22
owner: ericriutort@gmail.com
portfolio:
  name: xrsize4all
  role: sub-system

documents:
  - id: xrsize4all-concept
    path: docs/xrsize4all_concept.md
    tier: REFERENCE
    version: 1.0.0
    status: active
    created: 2026-04-14
    updated: 2026-04-14
    owners: [ericriutort]
    note: >
      Portfolio-level reference. Temporarily lives in the lifting-tracker repo;
      may be promoted to its own repo when a second sub-system depends on it.

  - id: user-stories
    path: docs/user-stories.md
    tier: REFERENCE
    version: 1.0.0
    status: active
    created: 2026-04-14
    updated: 2026-04-17
    owners: [ericriutort]

  - id: ontology-plan
    path: docs/ontology-plan.md
    tier: REFERENCE
    version: 0.9.0
    status: draft
    created: 2026-04-17
    updated: 2026-04-17
    owners: [ericriutort]

  - id: architecture
    path: docs/architecture.md
    tier: MASTER
    version: 1.2.0
    status: active
    created: 2026-04-14
    updated: 2026-04-17
    owners: [ericriutort]
    depends_on:
      - {id: user-stories, version: "~1.0"}
      - {id: xrsize4all-concept, version: "~1.0"}
      - {id: ontology-plan, version: "^0.9"}
    integrates:
      - {id: user-stories}
      - {id: themes-epics-features}

  - id: themes-epics-features
    path: docs/themes-epics-features.md
    tier: COMPANION
    version: 1.0.0
    status: active
    created: 2026-04-17
    updated: 2026-04-17
    owners: [ericriutort]
    depends_on:
      - {id: user-stories, version: "~1.0"}
    derives_from: [user-stories]

  - id: architecture-comparison
    path: docs/architecture-comparison.md
    tier: COMPANION
    version: 1.0.0
    status: active
    created: 2026-04-14
    updated: 2026-04-14
    owners: [ericriutort]

  - id: effort-estimate
    path: docs/effort-estimate.md
    tier: COMPANION
    version: 1.0.0
    status: active
    owners: [ericriutort]
    depends_on: [{id: roadmap, version: "*"}]

  - id: best-practices-review
    path: docs/reference/best-practices-review.md
    tier: COMPANION
    version: 1.0.0
    status: active
    owners: [ericriutort]

  - id: community-research
    path: docs/reference/community-research.md
    tier: COMPANION
    version: 1.0.0
    status: active
    owners: [ericriutort]

  - id: source-doc-cm-design
    path: docs/reference/source-doc-cm-design.md
    tier: COMPANION
    version: 0.1.0
    status: draft
    created: 2026-04-22
    updated: 2026-04-22
    owners: [ericriutort]
    note: >
      Design brief for this CM framework. Will move to active and bump to 1.0.0
      when Eric approves the design and the first skill implementation lands.

  - id: roadmap
    path: docs/roadmap.md
    tier: OPERATIONAL
    version: 0.9.0
    status: active
    created: 2026-04-19
    updated: 2026-04-19
    owners: [ericriutort]
    depends_on:
      - {id: architecture, version: ">=1.0"}
      - {id: themes-epics-features, version: ">=1.0"}

  - id: dispatch-handoff
    path: docs/dispatch-handoff.md
    tier: OPERATIONAL
    version: 1.0.0
    status: active
    owners: [ericriutort]

skills:
  - id: document-cm
    path: .claude/skills/document-cm/
    version: 0.1.0
    status: draft
    provides:
      - cm.status
      - cm.validate
      - cm.update
      - cm.reconcile
      - cm.freeze
      - cm.new-doc
      - cm.new-skill
      - cm.history
      - cm.note
      - cm.report
    depends_on:
      - {id: manifest-schema, version: "1.0"}

workflows:
  - id: wf-003-document-update
    path: docs/workflows/wf-003-document-update.md
    version: 1.0.0
    status: active
    pattern: chain-with-gate        # per Anthropic workflow taxonomy
    gates: 1
    steps: 9                         # consolidated from Concept's 15 via skill composition
    implemented_as: .claude/skills/document-cm/scripts/wf003.py

  - id: wf-004-reconciliation
    path: docs/workflows/wf-004-reconciliation.md
    version: 1.0.0
    status: active
    pattern: orchestrator-workers
    implemented_as: .claude/skills/document-cm/scripts/reconcile.py

portfolio_refs:
  - id: xrsize4all-concept
    repo: lifting-tracker
    path: docs/xrsize4all_concept.md
    pinned_version: "1.0.0"
```

### 9.3 `.cm/manifest.schema.json` — JSON Schema (core fragment)

Full schema lives in `.claude/skills/document-cm/schemas/manifest.schema.json`. The document-entry fragment, which is the load-bearing part:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "XRSize4 ALL — CM Manifest document entry",
  "type": "object",
  "required": ["id", "path", "tier", "version", "status", "owners"],
  "properties": {
    "id":       {"type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$"},
    "path":     {"type": "string"},
    "tier":     {"enum": ["REFERENCE", "COMPANION", "MASTER", "OPERATIONAL"]},
    "version":  {"type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$"},
    "status":   {"enum": ["draft", "active", "frozen", "deprecated"]},
    "created":  {"type": "string", "format": "date"},
    "updated":  {"type": "string", "format": "date"},
    "owners":   {"type": "array", "items": {"type": "string"}},
    "depends_on": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "version"],
        "properties": {
          "id":      {"type": "string"},
          "version": {"type": "string"}
        }
      }
    },
    "superseded_by": {"type": "string"},
    "hash":    {"type": "string"},
    "tags":    {"type": "array", "items": {"type": "string"}},
    "note":    {"type": "string"}
  }
}
```

### 9.4 `.claude/skills/document-cm/SKILL.md` — full example

```markdown
---
name: document-cm
description: Configuration management for source documents. Use when updating, creating, reconciling, or auditing documents in this project's docs/ tree, when bumping versions, when the user says "update doc X" or "run WF-003," when verifying that a documented update preserved its baseline, or when producing a session report at the end of work. Reads .cm/manifest.yaml as the source of truth. Writes to .cm/ (scorekeeper.json, notekeeper.json), creates git tags, and produces session reports in reports/.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Document CM — Source-Document Configuration Management

This skill manages the lifecycle of source documents (architecture, references,
companions, masters, operational) in a project that has a `.cm/manifest.yaml`.

Load this skill when the user asks to:
- update a document ("update doc X", "run WF-003 on X", "bump X")
- create a new document ("new REFERENCE doc for Y")
- reconcile two or more documents ("compare X and Y")
- freeze a baseline ("tag current state as baseline Q2-2026")
- audit manifest vs filesystem ("run cm validate")
- produce a session report ("generate session report")

## Always read first

- `.cm/manifest.yaml` — the document catalog
- `CLAUDE.md` — project instructions
- the doc's own frontmatter (author, created, updated)

## Workflow: update a document (WF-003)

1. Read the manifest entry for the target doc. Confirm tier order — REFERENCE
   dependencies update before COMPANIONs that pin to them; COMPANIONs before
   MASTER; OPERATIONAL last.
2. Call `scripts/book_boss.py extract-baseline <doc>`. This writes
   `.cm/scratch/<id>-baseline.json` (sections, key terms, cross-refs, word
   counts). Do not modify it.
3. Call `scripts/book_boss.py build-change-map <doc> --sources <src1> <src2>`.
   This writes `.cm/scratch/<id>-changemap.md`. Read it back.
4. **GATE — present the change map to the human and STOP.** Do not proceed
   without the word "approved." This is the only gate in the workflow.
5. After approval, write the updated document to its path. Preserve every
   baseline item — zero content loss.
6. Call `scripts/book_boss.py verify <doc>`. If it reports content loss, fix
   the draft and re-run. Do not proceed past a failed verify.
7. Call `scripts/manifest.py record <doc> --version <new> --changes <ids>`.
   This updates the manifest entry (version, updated, hash) and appends to
   `.cm/scorekeeper.json`.
8. Create git tag `doc/<id>/v<new>` on the commit.
9. Call `scripts/reporter.py session-report`. Writes
   `reports/session_<timestamp>.md`.

## Workflow: reconcile N documents (WF-004)

Call `scripts/reconcile.py --docs <id1> <id2> [...] --output <path>`. Produces
a Markdown comparison matrix (ALIGNED / GAP / PARTIAL / NEW). Each GAP becomes
a `.cm/notekeeper.json` entry with a stable change ID.

## Workflow: validate manifest + filesystem (cm validate)

Call `scripts/manifest.py validate`. Checks:
- every `path:` exists
- every `depends_on:` resolves to a real entry
- versions are valid semver
- frontmatter matches `updated:` within one day
- tags in git match the manifest

Fails loudly with specific field names. Never fails silently (poka-yoke).

## What this skill does NOT do

- It does not decide whether a change is MAJOR, MINOR, or PATCH. That is a
  human judgment. The skill may suggest based on keywords in the commit
  message, but the human confirms.
- It does not commit. The human or Claude writes the commit with a
  conventional-commits message; the skill stages the manifest and ledger.
- It does not push. Push is a human decision.
- It does not rewrite content. Claude rewrites content; the skill
  orchestrates.

## Verification criteria — what "correct" means per operation

- Update: baseline preserved; manifest version bumped; tag created; scorekeeper
  appended; session report saved.
- Reconcile: output file produced; notekeeper entries added; scorekeeper
  reconciliation entry added.
- Validate: exit 0 and report "manifest in sync" or exit 1 with specific field
  failures.

## Conventions

- Tier order cascades: REFERENCE → COMPANION → MASTER → OPERATIONAL.
- Semver: MAJOR breaks consumers, MINOR adds, PATCH clarifies.
- Tags: `doc/<id>/v<version>`.
- Commit prefix: `doc(<id>): <summary>`.
- Formats: `.md`, `.py`, `.json`, `.yaml`, `.yml`. Nothing else in `docs/`.

## See also

- `references/workflow-patterns.md` for Chain / Route / Parallel / Orchestrator-Workers / Evaluator-Optimizer.
- `references/verification-criteria.md` for per-workflow correctness definitions.
- `references/tier-model.md` for REFERENCE / COMPANION / MASTER / OPERATIONAL definitions.
```

### 9.5 `.github/workflows/cm-validate.yml` — CI stub

```yaml
name: CM Validate
on:
  pull_request:
    paths:
      - 'docs/**'
      - '.cm/**'
      - '.claude/skills/document-cm/**'
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # for tag checks

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install cm CLI
        run: pip install -e .claude/skills/document-cm

      - name: Manifest schema + links + frontmatter
        run: cm validate --strict

      - name: Tag discipline (main only)
        if: github.ref == 'refs/heads/main'
        run: cm validate-tags

      - name: Version monotonicity on PRs
        if: github.event_name == 'pull_request'
        run: cm validate-monotonic --base ${{ github.event.pull_request.base.sha }}

      - name: Baseline preservation (opt-in label)
        if: contains(github.event.pull_request.labels.*.name, 'baseline-verify')
        run: cm verify-baselines
```

### 9.6 `.pre-commit-config.yaml` — local hooks

```yaml
repos:
  - repo: local
    hooks:
      - id: cm-manifest-lint
        name: cm manifest-lint
        entry: cm validate --quick
        language: system
        pass_filenames: false
        always_run: true

      - id: cm-frontmatter-lint
        name: cm frontmatter-lint
        entry: cm frontmatter-lint
        language: system
        files: '^docs/.*\.md$'

      - id: cm-format-check
        name: cm format-check
        entry: cm format-check
        language: system
        files: '^docs/'
```

### 9.7 Sample `cm status` output (illustrative)

```
$ cm status
lifting-tracker @ 2026-04-22

REFERENCE
  xrsize4all-concept      v1.0.0  active    (no pending)
  user-stories            v1.0.0  active    (1 pending: NK-042)
  ontology-plan           v0.9.0  draft     (2 pending)

COMPANION
  themes-epics-features   v1.0.0  active    (pins user-stories ~1.0) ✓
  architecture-comparison v1.0.0  active
  effort-estimate         v1.0.0  active
  best-practices-review   v1.0.0  active
  community-research      v1.0.0  active
  source-doc-cm-design    v0.1.0  draft     ← this brief

MASTER
  architecture            v1.2.0  active    (pins user-stories ~1.0 ✓, ontology-plan ^0.9 ✓)

OPERATIONAL
  roadmap                 v0.9.0  active
  dispatch-handoff        v1.0.0  active

PENDING (notekeeper)
  NK-042  user-stories  US-018 set-grouping clarification
  NK-043  ontology-plan exercise-family schema revision
  NK-044  ontology-plan aliases table

LATEST BASELINE
  baseline/2026-Q1/v1  (2026-03-31)  15 docs frozen

NO VIOLATIONS
```

---

## 10. Open Questions for Eric

These are the decisions this brief deliberately did not make. Each is a named choice with a recommended direction and the consequences of each path. No question here is trivial — every one of them changes something downstream.

### Q1. Portfolio-level repo — when does `xrsize4all_concept.md` graduate to its own repo?

Today `docs/xrsize4all_concept.md` lives in `lifting-tracker/` because Lifting Tracker is the first sub-system. When the second sub-system (say, coaching or content) needs to pin to it, either the second repo vendors a copy (drift-prone) or the doc moves to a shared `xrsize4all/` repo.

**Recommendation**: keep it in `lifting-tracker/` until the second sub-system starts. At that point, promote to `~/xrsize4all/` repo with its own manifest and mark `portfolio_refs:` in every sub-system manifest pinning to it.

**Risk of deferring**: low. The move is a `git mv` + manifest pin update.

### Q2. Frozen vs deprecated for the two April-10 migration plans

`migration_plan_claude_code.md` and `migration_plan_managed_agents_v2.md` both describe paths Eric did not take. They have value as captured decisions but should not be cited as current guidance.

**Options**:

- **A — Both frozen.** Mark `status: frozen`, add `note:` explaining neither was executed. Preserves them as historical context. Recommended.
- **B — Both deprecated with `superseded_by: source-doc-cm-design`.** Treats this brief as the resolution. Risk: this brief is not a migration plan; it is a design. The two things are different artifacts.
- **C — One of each.** If Eric decides the Claude Code path is closer to what he actually wants, mark the Managed Agents plan deprecated and the Claude Code plan frozen.

**Recommendation**: A. This brief is not a replacement for either plan; it is orthogonal (CM, not platform migration). The plans can stay as frozen context and a future migration-decision ADR cites both.

### Q3. Notekeeper — JSON file or GitHub Issues?

The backlog lives somewhere. Options:

- **A — `.cm/notekeeper.json`.** Offline-first. Agent-readable without API calls. Cheap. Matches Concept's current approach. Loses UI, loses multi-person collab, loses cross-ref to PRs.
- **B — GitHub Issues with `cm-backlog` label.** UI for free. Cross-ref to PRs for free. Multi-person-ready. Requires network access. Creates a GitHub dependency the open-standards audit would flag as Medium lock-in. Loses offline capability.
- **C — Both — Issues as primary, JSON as a mirror.** Skill syncs one-way from Issues to JSON. Complexity tax; two sources of truth risk.

**Recommendation**: A for MVP. The offline-first stance (D18) and solo-team reality make the JSON path strictly better today. Revisit at v2 if collaborators arrive. Changing later is a one-time import script.

### Q4. Changes to Concept — touch or don't?

This brief deliberately does not modify the Concept repo. But the design implies that when Concept is migrated out of Claude.ai, it would adopt the same `document-cm` skill, the same manifest format, and the same tier model — which are all already in Concept in slightly different form.

**Options**:

- **A — Leave Concept alone.** Concept continues with its 16-agent suite until Eric decides to migrate it. Recommended.
- **B — Start the Concept migration now** using this CM design as the target. Concept becomes the proving ground. Risk: Concept's content is more complex than Lifting Tracker's docs; it will expose design gaps earlier.
- **C — Build `document-cm` skill in Lifting Tracker first, then port to Concept.** Low-risk; Lifting Tracker is simpler.

**Recommendation**: C. Build on the smaller project first; port when it works.

### Q5. Conventional-commits scope naming — `doc` / `agent` / `workflow` / `data` (Concept) or `doc(<id>)` (this brief)?

Concept uses `[DOC]` / `[AGENT]` / `[WORKFLOW]` / `[DATA]` as a bracketed prefix. This brief proposes `doc(<id>): <summary>` (conventional-commits 1.0 scope style). They are close but not identical.

**Options**:

- **A — Adopt `doc(<id>):`** across both projects. Standardized, feeds `semantic-release`, parseable. Migration for Concept is a one-time rewrite of the commit template.
- **B — Keep Concept's `[DOC]`**, use conventional-commits in Lifting Tracker. Two conventions.
- **C — Do both as optional alternatives.** Over-engineering.

**Recommendation**: A. Standardization is worth a few commit-message edits.

### Q6. License the `document-cm` skill as open source?

The Concept agents are proprietary. The `document-cm` skill, if built, could be:

- **Proprietary** — matches the existing Concept posture. Keeps the design confidential. Limits portability.
- **Apache-2.0** — permissive, allows commercial use, standard. Recommended if open-sourcing.
- **MIT** — simpler, similar effect.

**Recommendation**: Apache-2.0 for the skill, because it's a CM framework that gains value from being common across Eric's projects (and, potentially, shareable if XRSize4 ALL ever wants a community around it). Keep domain content (architecture docs, ontology, migration plans) under the existing proprietary copyright.

**Counter-consideration**: if Eric wants the CM approach itself to be a competitive differentiator — "the XRSize4 ALL way of managing architecture docs" — proprietary is defensible. But "process as moat" is historically weak.

### Q7. `reports/` — committed or gitignored?

Session reports are append-only markdown. Options:

- **A — Commit.** Full audit trail in git. Repo grows ~1KB/session. Scales indefinitely at this rate.
- **B — Gitignore, keep local.** Clean repo. No external audit trail.
- **C — Commit to a separate orphan branch (`reports/`).** Neither in `main` nor lost. Standard git-pages pattern.

**Recommendation**: A. Session reports are how Claude picks up context next session; losing them defeats the purpose. Repo size is not a concern at solo scale.

### Q8. When does a `docs/risks.md` get created?

Section 7 recommended adopting a lightweight risk register. This brief did not draft one. The trigger: when Eric has more than 3 operational risks that aren't already tracked somewhere.

**Recommendation**: create at Sprint 2 boundary (post-auth, when Supabase + Expo + RLS are all live and risks are real, not theoretical). Not before.

### Q9. Claude Mythos / Project Glasswing implications

The April 7, 2026 Anthropic announcement (Claude Mythos Preview + Project Glasswing) confirmed that current-generation models can autonomously identify critical security vulnerabilities. The CM implications for document management specifically are limited — source documents are not executable code — but there is a legitimate concern:

- Skill scripts (`book_boss.py`, etc.) are executable and run on Eric's machine.
- A compromised or malicious skill could modify documents or exfiltrate content.

**Recommendations (not decisions, because they're operational):**

- Pin skill dependencies (Python packages) to exact versions in a `requirements.txt`.
- Code-review any skill script that came from outside Eric's repo before enabling it.
- Use Claude Code hooks' `allowed-tools` frontmatter to restrict what a skill can touch.
- Don't run skills from third-party plugin marketplaces without reading the scripts.
- Revisit at v2 when the skill may be shared outside Eric's own use.

This is Medium priority — real, not theoretical, but not urgent at today's scope.

### Q10. Portfolio terminology + this brief's own versioning

Two small-but-load-bearing naming calls:

- **"Portfolio" vs "platform" vs "system of systems."** The brief uses `portfolio:` in the manifest. XRSize4 ALL's own planning vocabulary may prefer one of the other terms. Resolve once in `xrsize4all_concept.md`, propagate. Cost of deferring: search-and-replace later.
- **This brief's own version.** `source-doc-cm-design.md` lands at `v0.1.0 / status: draft`. Trigger for `v1.0.0 / active`: Eric approves the design *and* the `document-cm` skill has shipped its first working invocation against Lifting Tracker docs. Until then, this is a design brief, not an in-force framework — exactly the pre-infrastructure state Concept's Design Principles §1 warns against treating as binding.

---

## Sources

External references informing this design:

- Anthropic engineering posts aggregated in `~/Concept/anthropic_engineering_patterns_for_claude.md` (12 patterns across 21 posts, Sep 2024 – Apr 2026).
- Anthropic Agent Skills specification (December 2025, open standard adopted by OpenAI Codex CLI, Cursor, Gemini CLI, Antigravity IDE, ChatGPT); SKILL.md format.
- [Claude Mythos Preview — red.anthropic.com](https://red.anthropic.com/2026/mythos-preview/) and [Project Glasswing — anthropic.com/project/glasswing](https://www.anthropic.com/project/glasswing) (April 7, 2026).
- [MADR (Markdown Architectural Decision Records)](https://adr.github.io/madr/) and [Y-Statements — Olaf Zimmermann](https://medium.com/olzzio/y-statements-10eb07b5a177).
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) and [semantic-release](https://semantic-release.gitbook.io/).
- [ISO/IEC/IEEE 12207:2017 — Software life cycle processes](https://www.iso.org/standard/63712.html), specifically the CM process family under technical-management processes.
- The Agentic AI Bible (2025 book family — multiple authors; Collins, Caldwell, Alder). General agent-design patterns; specific citations would require the eBook PDFs, which are not currently on disk.
- [LangChain / LangGraph 1.0 release notes](https://blog.langchain.com/langchain-langgraph-1dot0/) — maintenance horizons for 0.x through December 2026.
- [Trunk-based development vs Git-Flow — Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development) and solo-developer workflow guidance circa 2026.
- [Claude Code Hooks — code.claude.com/docs/en/hooks-guide](https://code.claude.com/docs/en/hooks-guide).
- Concept Computing repository: `CLAUDE.md`, `AgentSuiteReference_v4.md`, `DesignPrinciples_v3.md`, `migration_plan_claude_code.md`, `migration_plan_managed_agents_v2.md`, `wf_*.md`, the 16 `*_agent.py` scripts (AGENT_META + copyright blocks).
- Lifting Tracker: `docs/architecture.md` (D1–D24), `docs/themes-epics-features.md`, `docs/roadmap.md`, `docs/user-stories.md`, `docs/reference/best-practices-review.md`.

---

© 2026 Eric Riutort. All rights reserved.
