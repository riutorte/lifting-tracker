---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
valid_as_of: 2026-04-24
re_check_by: 2026-07-24
tier: REFERENCE
content_class: research
---

# Skills Portfolio — Adoption and Build Assessment

Assessment of which Claude Code / Cowork skills to adopt from existing catalogs, which to build custom, and which to explicitly skip. Scoped against Eric's composite principle: **MCP-able (or trivially so) + self-hostable + not SaaS + AI-native friction reduction**. All recommendations assume solo+AI scale; rework costs if scaled.

---

## 1. Executive summary

- **Top-3 adopt now:** (a) `anthropics/skills:mcp-builder` — Sprint 0c MCP scaffolding hits D27 directly; (b) `anthropics/skills:claude-api` — referenced by evals harness and Edge Function work; (c) Pin `anthropic-skills:skill-creator` (already installed) as the substrate for every custom skill we author.
- **Top-3 build custom:** (a) `document-cm` — WF-003 orchestrator, Sprint 0b Day 2+; (b) `cm-status` + `cm-report` + `cm-verify` — bundled under document-cm; (c) `agentic-ai-evals-harness` — §9.5 of the CM brief is load-bearing and unbuilt.
- **Top-1 explicit skip:** `obra/superpowers` full bundle — HOLD per prior `claude-plan-mode-superpowers.md` decision; methodology overlaps with Book Boss + WF-003. Revisit at Sprint 0d boundary after scoped pilot.
- **Secondary skip:** any UI-scaffolding skill — Expo templates already cover this; any generic Python-agent skill — Concept's 16-agent suite already occupies that surface and is under D19 trust-but-verify posture.
- **Composite principle scorecard:** 8 of top-10 score HIGH on all four axes (everything in document-cm family plus the Anthropic first-party skills). The two exceptions — `superpowers` skills pulled individually, and `workout-log-parser` — need deliberate design to score HIGH on MCP-ability.

---

## 2. Current inventory recap

Installed as Anthropic / Cowork defaults (no user-authored skills yet):

| Skill | Source | Purpose |
|---|---|---|
| `schedule` | Cowork | Scheduled task creation |
| `docx`, `pdf`, `pptx`, `xlsx` | `anthropics/skills` | Document creation suite |
| `skill-creator` | `anthropics/skills` | Scaffold / edit / benchmark skills |
| `setup-cowork` | Cowork | Guided plugin/tool onboarding |
| `consolidate-memory` | Cowork | Memory file hygiene |
| `init`, `review`, `security-review` | Claude Code | Project init + PR review |

Baseline is minimal and cleanly Anthropic-first. No legacy custom skills to deprecate.

---

## 3. Available skills not yet adopted

### 3.1 Anthropic first-party (`github.com/anthropics/skills`)

| Skill | License | Fit | Adopt? | Reason |
|---|---|---|---|---|
| `claude-api` | Anthropic | HIGH | Adopt Sprint 0c | Needed when evals harness and Supabase Edge Functions call the API directly. Reduces boilerplate. |
| `mcp-builder` | Anthropic | HIGH | Adopt Sprint 0c | Generates MCP servers from spec. Directly relevant to §6.6 MCP-first exposure and the per-sub-system MCP pattern in architecture_v0.4.0.md. |
| `frontend-design` | Anthropic | MEDIUM | Pilot Sprint 1+ | Design-system authoring. 277K installs signals maturity. Relevant when Expo UI work begins; not load-bearing for schema/logging MVP. |

### 3.2 Community marketplaces and bundles

| Source | Type | Maturity | Action |
|---|---|---|---|
| `obra/superpowers` | Plugin bundle (20+ skills) | Very high (120K+ stars, Anthropic marketplace accepted Jan 2026) | HOLD — see `claude-plan-mode-superpowers.md`. Pilot individual skills (`using-git-worktrees`, `writing-plans`) in Sprint 0c if bounded. |
| `obra/superpowers-skills` | Community-editable companion | Medium | Defer. Source if a specific skill from superpowers scores but full bundle rejected. |
| `daymade/claude-code-skills` | Third-party bundle | Low-medium | Skip. No inspection done; not worth the integration tax. |
| `mhattingpete/claude-skills-marketplace` | Third-party bundle | Low | Skip. |
| `awesome-claude-skills` (travisvn) | Curated index | — | Use as discovery list only; not an installable artifact. |
| SkillsMP, Skills Directory, claudemarketplaces.com | Registries | Fragmented | Monitor. No dominant curated registry as of April 2026; Anthropic's marketplace remains the most reliable endorsement surface. |

### 3.3 `obra/superpowers` individual skill inventory

Surveyed for future à-la-carte pulls if the full-bundle decision stays HOLD.

| Skill | Potential value if pulled standalone |
|---|---|
| `writing-plans` | Bite-sized task breakdown with file paths. Could augment Plan Mode for code work; redundant with Book Boss for docs. |
| `using-git-worktrees` | Isolated branch workspaces. Cleanest single-skill pull candidate. |
| `test-driven-development` | RED-GREEN-REFACTOR enforcement. Over-prescriptive for Expo offline-first integration-test-heavy code. |
| `systematic-debugging` | 4-phase debugging. Useful ad hoc; low integration cost. |
| `subagent-driven-development` | Per-task subagents. Token-expensive; defer until Sprint 0c metrics justify. |
| `brainstorming` | Socratic pre-plan refinement. Potential conflict with Book Boss change-map extraction (§6.4 of prior research). |
| `using-superpowers`, `writing-skills` | Meta-skills. Only meaningful if full bundle adopted. |

---

## 4. Custom skills already planned

| Skill | Status | Source | Scope |
|---|---|---|---|
| `document-cm` | Design v0.3.0 approved pending Sprint 0b Day 2+ build | `source-doc-cm-design.md` §5.5, §6, §6.6 | WF-003 orchestrator (9 steps with GATE); baseline verify; content-class governance; MCP-exposed (§6.6 dual CLI + MCP adapter). Wraps Book Boss verify script. |
| `code-cm` | NAMED-BUT-DEFERRED | `source-doc-cm-design.md` §3.7.4 | Parallel discipline for source code. PR-primitive workflow, not WF-003. Adopts GitHub PR as artifact triple. SLSA provenance, test gates, SBOM likely in scope. Sprint 0d+ earliest. |

Both are well-specified in the design brief; this assessment does not re-design them. Cross-link: `docs/reference/source-doc-cm-design.md` §3.7, §5.5, §5.7, §6.6, §10.4.

---

## 5. Custom skills proposed

Candidates surfaced from corpus scan of design briefs, kanban, retros, and research findings. Effort estimates are under solo+AI with document-cm in place; most reduce materially once the doc-cm harness exists.

### 5.1 WF-family (bundled under document-cm plugin)

| # | Skill | Source | Rationale | Effort (solo+AI) |
|---|---|---|---|---|
| 1 | `cm-status` | design §6 table, WF-001 | Replaces Concept Starter chain; queries manifest + git state | 0.5 day (with document-cm) |
| 2 | `cm-report` | design §6 table, WF-002 | Stop-hook-invoked session report; scorekeeper emit | 0.5 day (with document-cm) |
| 3 | `cm-verify` | design §2.4, §9.2 | Manifest consistency + baseline-pin freshness; surfaces dependent-version staleness | 1 day |
| 4 | `cm-reconcile` | design §6 table, WF-004 | N-way doc comparison workbook | 1-2 days |
| 5 | `cm-new` / `cm-new-skill` | design §6 table, WF-005/006 | Thin wrappers over skill-creator + manifest append | 0.5 day each |

### 5.2 Cross-cutting platform

| # | Skill | Source | Rationale | Effort |
|---|---|---|---|---|
| 6 | `agentic-ai-evals-harness` | design §9.5, §1.4 | Load-bearing per D19; 9 scenarios; golden-output framework | 2-3 days |
| 7 | `content-drop-detector` | internals findings §3.2-§3.4; design §5.7 | Post-mutation baseline compare; flags micro_compact content loss | 1 day |
| 8 | `managed-policy-installer` | `managed-policy-research.md` | Deploy machine-wide CLAUDE.md + managed-settings.json; integrity check | 1 day (triggered when Fernando joins) |
| 9 | `mcp-server-factory` | architecture_v0.4.0.md §D27; design §6.6 | Scaffold MCP server directories with tool stubs | **Defer — `anthropics/skills:mcp-builder` covers this** |
| 10 | `trust-but-verify-instrumenter` | design v0.3.0 amendment (a) | Tier 2 concern log; time-to-acceptance + rubber-stamp detection | 1 day |
| 11 | `metrics-collector` | `metrics_v0.1.0.md` | Automated Monday pull of six DORA-adjacent metrics | 1 day |
| 12 | `kanban-sync` | kanban.md line 14 (Q12) | Keep kanban in sync with CM state changes; hook on WF-003 completion | 0.5 day |

### 5.3 Domain-specific (Lifting Tracker sub-system)

| # | Skill | Source | Rationale | Effort |
|---|---|---|---|---|
| 13 | `workout-log-parser` | roadmap Sprint 3 (US-040, US-041); Sprint 6 (US-070) | Parses combined_workout_log.txt and NL entries; D19 Tier 2 draft → user confirm → Tier 1 write | 3-5 days (Sprint 3 or 6) |
| 14 | `ontology-validator` | `ontology-plan_v0.1.0.md` Sprint 3 | Classifies exercises against PACO/KHMO/EXMO; flags unmapped. Likely **app code, not skill** — reconsider scope | Skip as skill |
| 15 | `exercise-library-seeder` | roadmap Sprint 1 (US-020) | Seeds canonical exercise library from workout log + historical data | 1 day (one-shot; arguably a script not a skill) |
| 16 | `schema-drift-detector` | architecture D2/D4/D14; Sprint 0 foundation | Compare Supabase live schema against Drizzle/migrations; flag drift | 1-2 days (Sprint 0c) |
| 17 | `sync-reconciler-test-harness` | architecture D8; stack-validation | Simulates offline edits, network partitions; validates last-write-wins | 2 days (Sprint 2) |

### 5.4 Research-process skills

| # | Skill | Source | Rationale | Effort |
|---|---|---|---|---|
| 18 | `research-finding-scaffolder` | pattern from 12 `docs/reference/*-findings.md` | Template-fill new finding doc with frontmatter, freshness stamps, content class | 0.5 day |
| 19 | `stale-doc-detector` | CONVENTIONS / `re_check_by` frontmatter | Sweep re_check_by dates; emit list of docs past expiry | 0.5 day |
| 20 | `reach4all-curator` | kanban Sprint 0b; amendment (b) | Move research docs from lifting-tracker to reach4all repo; preserve provenance | 1 day (Sprint 0b week 1) |

Corpus-scan also surfaced `sprint-retro-generator`, `ADR-generator`, `risk-reviewer`, `onboarding-validator`, `concept-agent-invoker`, `context-hub-alignment-mapper`, `anthropic-patterns-validator`, `orchestration-harness`. All valid but either (a) subsumed by document-cm once built, (b) premature until Fernando joins or Concept refactor lands, or (c) thin enough to be bash scripts not skills. Not in the top-20.

---

## 6. Top-10 prioritized list

Ranked by composite of velocity impact, feasibility at solo+AI scale, composite-principle fit, and dependency-ordering (what unblocks what).

| Rank | Skill | Impact | Feasibility | Principle fit | Unblocks |
|---|---|---|---|---|---|
| 1 | `document-cm` | HIGH — gates every architecture edit | HIGH — design v0.3.0 locked | HIGH all axes | cm-status, cm-report, cm-verify, cm-reconcile, code-cm |
| 2 | `cm-status` + `cm-report` + `cm-verify` (bundle) | HIGH — WF-001/002 + manifest integrity | HIGH — bundled with #1 | HIGH all axes | CI readiness; scorekeeper |
| 3 | `anthropics/skills:mcp-builder` | HIGH — Sprint 0c MCP work | HIGH — off-the-shelf | HIGH all axes (Anthropic first-party) | Per-sub-system MCP pattern |
| 4 | `agentic-ai-evals-harness` | HIGH — without evals skills erode | MEDIUM — 2-3 days | HIGH all axes | Measurable WF-003 quality |
| 5 | `cm-reconcile` | MEDIUM — needed at sprint-boundaries and Concept migration | HIGH with #1 installed | HIGH all axes | Concept agent refactor |
| 6 | `anthropics/skills:claude-api` | MEDIUM — reduces Edge Function boilerplate | HIGH — off-the-shelf | HIGH all axes | Workout-log-parser (D19 Tier 2 calls) |
| 7 | `content-drop-detector` | HIGH — §5.7 Defense 2 + 4 | MEDIUM — needs snapshot primitive | HIGH all axes | Safe long-file edits |
| 8 | `stale-doc-detector` + `research-finding-scaffolder` | MEDIUM — research velocity hygiene | HIGH — 0.5 day each | HIGH all axes | Reach4All operations |
| 9 | `metrics-collector` + `kanban-sync` | MEDIUM — velocity measurement | HIGH — 1 + 0.5 day | HIGH all axes | Retro quality |
| 10 | `workout-log-parser` | HIGH for product — Sprint 6 gating | MEDIUM — needs ontology | MEDIUM — MCP surface optional | US-070 (NL entry) and US-040/041 (import) |

`code-cm` is rank 11 — high value but deliberately Sprint 0d+; premature before Sprint 0c implementation work generates the patterns it will codify.

---

## 7. Build vs use matrix (top-10)

| Skill | Decision | Rationale |
|---|---|---|
| `document-cm` | **BUILD** | No equivalent exists. Book Boss verify + content-class governance + WF-003 GATE are XRSize4-ALL-specific; not portable. |
| `cm-status`/`cm-report`/`cm-verify` | **BUILD (with #1)** | Bundled under document-cm plugin; share the Python lib. No third-party alternative. |
| `mcp-builder` | **USE (Anthropic)** | First-party, maintained by the source of truth. Building a custom `mcp-server-factory` duplicates. |
| `agentic-ai-evals-harness` | **BUILD** | Project-specific scenarios (WF-003/004/005). Off-the-shelf eval frameworks (LangChain evaluators, OpenAI Evals) fail self-hosting + MCP-able axes. |
| `cm-reconcile` | **BUILD (with #1)** | Same lib as document-cm. |
| `claude-api` | **USE (Anthropic)** | First-party; adopt now, zero build cost. |
| `content-drop-detector` | **BUILD** | Could start as a `scheduled-task` that diffs snapshots; promote to skill once usage pattern is clear. Hybrid: **scheduled-task first, skill second.** |
| `stale-doc-detector` + `research-finding-scaffolder` | **BUILD (scheduled-task for detector, skill for scaffolder)** | Detector is a scheduled scan → scheduled-task is the right primitive. Scaffolder is interactive → skill. |
| `metrics-collector` + `kanban-sync` | **SCHEDULED-TASK for collector, skill for kanban-sync** | Metrics pull is time-triggered; kanban-sync is event-triggered (on WF-003 completion). Different primitives. |
| `workout-log-parser` | **BUILD** | Core product functionality (D19 Tier 2 AI draft). External NL parsers don't have exercise-family + limb-config awareness. |

Summary: 7 BUILD, 2 USE (Anthropic first-party), 3 hybrid BUILD-with-scheduled-task-primitive.

---

## 8. Anti-list — skills NOT to build

| Skill / Bundle | Why not |
|---|---|
| `obra/superpowers` (full bundle) | HOLD — see `claude-plan-mode-superpowers.md` §9.2. Methodology overlaps with Book Boss + WF-003. Pilot individual skills only if bounded. |
| UI-scaffolding skill | Expo templates (create-expo-app) cover this; NativeWind + TanStack Query scaffolding is boilerplate, not repeatable governance. |
| Generic Python-agent skill | Concept's 16-agent suite occupies that surface under v0.3.0 amendment (a) trust-but-verify; building another generic agent framework duplicates. |
| `mcp-server-factory` (custom) | Subsumed by `anthropics/skills:mcp-builder`. Build only if Anthropic's deprecates. |
| `ontology-validator` as standalone skill | Validation logic belongs in app code (Sprint 3), not a governance skill. Reconsider if ontology work escapes into multiple repos. |
| `orchestration-harness` as dedicated skill | D27 is decision-deferred to Sprint 0c+. Premature. `document-cm` Coordinator/Delegator/Worker roles already test the pattern at a bounded scope. |
| `sprint-retro-generator`, `ADR-generator`, `risk-reviewer` | Thin templates; become scheduled-tasks or shell aliases. Not worth skill-creator overhead until repeat-use signal exists. |
| `onboarding-validator` | Premature until Fernando joins. `managed-policy-installer` covers the deployment half; validator half is 0.25 day once needed. |
| Individual `superpowers` skills except `using-git-worktrees` | `writing-plans` redundant with Book Boss; `test-driven-development` wrong fit for Expo integration-heavy tests; `brainstorming` potentially conflicts with change-map extraction. |
| Any ChatGPT/Gemini skill bridge | Research workflow uses Claude in Chrome + manual copy; bridge is premature and costs composite-principle on SaaS axis. |

Count: **10 items** explicitly on the anti-list.

---

## 9. Roadmap

| Sprint | Land | Notes |
|---|---|---|
| **Sprint 0b Day 2+** (current) | `document-cm` + `cm-status` + `cm-report` + `cm-verify` bundle | Design approved; 2-4 hours of build per kanban. Install Anthropic `mcp-builder` and `claude-api` skills opportunistically in same sprint (zero build cost). |
| **Sprint 0b week 1** | `research-finding-scaffolder`, `reach4all-curator` | Support Reach4All repo creation and research migration. 1-1.5 days combined. |
| **Sprint 0c** | `cm-reconcile`, `agentic-ai-evals-harness`, `content-drop-detector`, `stale-doc-detector`, `schema-drift-detector`, `metrics-collector`, `kanban-sync` | Bulk of the harness. Pilot `obra/superpowers` individual skills per `claude-plan-mode-superpowers.md` §10.2. Adopt Plan Mode across architecture-class edits. |
| **Sprint 0d** | `code-cm` design freeze + initial build; `trust-but-verify-instrumenter` if Tier 2 concern log has accumulated signal | Builds on Sprint 0c evidence. |
| **Sprint 1-2** | `sync-reconciler-test-harness` | Validates D8 offline-first before sync goes to prod. |
| **Sprint 3** | `workout-log-parser` (first pass) + `exercise-library-seeder` | Gates US-020, US-040, US-041. |
| **Sprint 6** | `workout-log-parser` (NL entry variant under D19) | Extends Sprint 3 parser to NL + D19 draft/confirm. |
| **Deferred** | `managed-policy-installer` | One-line trigger when Fernando joins (per CLAUDE.md). |
| **Deferred** | `frontend-design` adoption | Sprint 1+ when UI work begins. Not critical path for MVP schema/auth. |

---

## 10. Open questions

1. **Does `document-cm` ship as a single skill or a plugin bundle** containing `cm-status`/`cm-report`/`cm-verify`/`cm-reconcile`/`cm-new`/`cm-new-skill`? Design brief §6 implies a plugin; confirm before Sprint 0b Day 2 starts so scaffolding uses the right layout.
2. **Can `content-drop-detector` ride on document-cm's Book Boss verify** rather than be its own skill? Architectural-consequence decision: single-surface is cleaner but ties two concerns. Pilot during document-cm build.
3. **Scheduled-task vs skill** for `stale-doc-detector` and `metrics-collector` — `scheduled-task` primitive is free; skill-form gives the operator a prompt. Recommendation: start as scheduled-task, promote only if manual invocation pattern emerges.
4. **Does Anthropic's `mcp-builder` actually produce servers that satisfy §6.6 dual-CLI-plus-MCP-adapter-over-shared-lib**, or does it emit MCP-only servers? Validate before Sprint 0c commits. If not, a thin wrapper skill may be needed.
5. **Is `workout-log-parser` a Lifting-Tracker-specific skill or an XRSize4-ALL-wide pattern** (parser-under-D19)? Answer affects where it lives and whether code-cm governance eventually applies.
6. **Quarterly re-check**: `obra/superpowers` HOLD decision — Sprint 0d boundary per prior research. If pilot gains are realized, fork-and-pin specific skills rather than adopting whole bundle.
7. **Evals harness format** — should `agentic-ai-evals-harness` use Anthropic's documented evals pattern, DeepEval, or custom? Composite principle favors custom + self-hosted; confirm in Sprint 0c design.

---

© 2026 Eric Riutort. All rights reserved.
