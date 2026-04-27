---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
tier: OPERATIONAL
content_class: architecture
status: accepted
decision_id: D28
version: 0.1.0
---

# D28 — Architectural discipline profile for Lifting Tracker and XRSize4 ALL sub-systems

## Status

**Accepted** — 2026-04-24 (Sprint 0b Day 1).

The seven-discipline profile this ADR codifies was committed verbally on 2026-04-23 during architecture-discipline planning and refined the same session against the Concept Computing framework's full UML/SysML/BPMN tool stack. This ADR is the single-page summary of that commitment, drafted 2026-04-24, linkable from `architecture_v0.4.0.md`, `CONVENTIONS_v0.2.2.md`, and the per-view DoDAF artifact files that follow it. Authoritative narrative for any specific view lives in the view's own file under `docs/architecture/views/`.

## Context

Lifting Tracker is the first sub-system of XRSize4 ALL. The remaining sub-systems — identity, coaching, content, biometrics, wearables, form analysis, instructional content, and the rest of the platform-of-systems backlog in `xrsize4all_concept_v0.2.0.md` — are queued behind it. Each will scaffold under whatever architectural-discipline posture is in force when its repo is created. Like the governance framework landed in D25, an architectural-discipline framework landed now applies cleanly to every sub-system; landed later it has to be retrofitted. The Sprint 0b window is the cheapest moment to lock the profile.

The Concept Computing framework (`~/Concept/`, §16 Implementation Architecture) prescribes a heavyweight discipline stack: Gaphor for UML/SysML, Open-BPMN for process flows, Gitea/Mattermost/LXC for delivery infrastructure. That stack is appropriate at the *framework* level — Concept Computing is itself a methodology and tool-chain product — but it is over-scaled for a solo-plus-AI sub-system being built inside a Claude-Code-hosted session. The Concept stack assumes a team of trained systems engineers maintaining a tool-of-record (Cameo, Gaphor, Sparx EA) with formal model interchange. Lifting Tracker has none of that and does not need it; it does need *some* discipline, and the discipline it picks must be importable into the presentation tools Eric actually uses (PowerPoint, Google Slides, Keynote), readable by any reasonable systems engineer or architect walking in cold, and standards-grounded enough to survive scrutiny when XRSize4 ALL grows beyond solo scope.

The opposite extreme — pure narrative architecture documents with no diagrammatic discipline at all — is also rejected. The April 10, 2026 session analysis (`reach4all://docs/research/concept-computing-april-10-failure-analysis.md`) showed that prose-only architecture artifacts drift under long-horizon sessions; visual artifacts catch drift faster because they make structural claims that text obscures. D25 closed the *governance* side of that gap (CM framework + content classes + workflows). D28 closes the *visual-discipline* side: a calibrated subset of formal practice that is git-native, AI-codegen-friendly, and standards-anchored.

Eric's architectural background sets the calibration. Trained systems architect, enterprise architect, and systems engineer; fluent in DoDAF; not currently fluent in TOGAF or Zachman. The framework chosen here is the one Eric already operates in, applied with judgment rather than ceremony. "Fit-for-purpose" is the explicit governing principle: produce the views the decision needs, omit the ones it does not, and use SysML iconography wherever it preserves architect-readability without dragging in tool-stack overhead.

This ADR fits alongside D25 (Source-Document CM): D25 governs *how documents change*; D28 governs *how architecture is depicted inside those documents*. The two compose. Architecture-class documents under D25 produce DoDAF views under D28; the views inherit D25's WF-003 workflow, content-drop defenses, and baseline snapshots.

## Decision

Adopt a seven-discipline architectural profile for Lifting Tracker and all XRSize4 ALL sub-systems. The profile is calibrated to solo-plus-AI scale, expressed in markdown + Mermaid, and grounded in DoDAF + SysML standards.

### The seven disciplines

1. **Pseudocode first — selective.** Pseudocode is adopted for *complex components only*. Routine CRUD, straightforward UI bindings, and well-understood patterns proceed straight to implementation. Components flagged complex (concurrency, sync reconciliation, AI-pipeline orchestration, governance hooks) get a pseudocode pass before code. Selectivity is judgment-based, not list-based — the producer decides per component.

2. **Software hierarchy — OOB logical class hierarchy + interface catalog + data exchange list.** The hierarchy is *logical* (object-oriented breakdown of the system's classes and their relationships), not a *technical stack diagram* (which is a deployment view, captured separately if needed). Out-of-the-box practice: every sub-system declares its class hierarchy, the interfaces those classes expose, and the data they exchange. The catalog and the exchange list are first-class deliverables alongside the hierarchy itself.

3. **IPO (Input-Process-Output) — universal in code, not a separate deliverable.** IPO is the discipline of naming inputs, processes, and outputs for every function, module, and service. It is enforced *in code* (function signatures, type annotations, docstrings) and *implicitly covered* by the interface catalog, the process flow diagrams, and the DoDAF views. No separate IPO artifact is produced; the discipline is satisfied when those upstream artifacts are present and consistent.

4. **Diagram standards — Mermaid as primary, SysML iconography within Mermaid's limits.** All diagrams ship as Mermaid blocks inside markdown files. Within Mermaid's expressive limits, SysML stereotypes (`«block»`, `«interface»`, `«service»`, `«valueType»`), multiplicities, association directionality, and formal naming are applied. Diagrams must be readable by any reasonable systems engineer or architect without a translation layer. **No formal modeling tools** (Gaphor, draw.io, Cameo, Sparx EA) are adopted for sub-system work — the import/export friction and tool-of-record overhead exceed the precision benefit at this scale. If a diagram exceeds Mermaid's expressive capacity, fall back to inline SVG or descriptive markdown rather than introducing a tool.

5. **Process flow diagrams — full logical flows for load-bearing processes, DoDAF OV-5 compliant.** Every load-bearing process (auth, sync reconciliation, AI inference pipeline, GATE workflow, baseline snapshot) gets a full logical-flow diagram conformant to DoDAF OV-5 standards (operational activity model, with roles, decision points, and data flows named). Trivial sequences do not get a diagram; the flow has to *carry weight* in the architecture before it earns one.

6. **Architectural views — DoDAF, fit-for-purpose.** The curated DoDAF view set (below) is the menu; the producer decides per artifact which views serve the decision. Fit-for-purpose explicitly authorizes adding a view the menu omits or omitting one the menu lists, when judgment dictates. Slavish production of every DoDAF view for every artifact is *non-policy* — it is the failure mode the profile rejects.

7. **Framework — DoDAF (not TOGAF), SysML-compliant, in markdown + Mermaid.** DoDAF is the framework of record. TOGAF, 4+1 view model, Zachman, and C4 are recognized but not adopted as primary. SysML compliance is preserved within Mermaid's expressive limits per discipline 4. The deliverable medium is markdown files containing Mermaid diagrams — git-native, diffable, AI-codegen-friendly, importable to PowerPoint/Google/Apple via SVG/PNG export.

### Curated DoDAF view set

The eleven views below are the menu. Producers select per artifact under fit-for-purpose.

| View | Purpose | Typical artifact |
|---|---|---|
| AV-1 | All Viewpoint overview summary | One per major architecture artifact; names scope, stakeholders, assumptions |
| AV-2 | Integrated Dictionary / Data Dictionary | Cross-cutting glossary; lives in `docs/glossary.md` once stood up |
| CV | Capability Viewpoint | Capabilities the system delivers; maps to themes/epics/features |
| OV-1 | High-Level Operational Concept Graphic | The "blob diagram"; one per sub-system |
| OV-2 | Operational Resource Flow | Roles + resources + flows between them |
| OV-5a / OV-5b | Operational Activity Model | The process flows from discipline 5; OV-5a is decomposition, OV-5b is the flow |
| SV-1 | Systems Interface Description | Interface catalog from discipline 2, in DoDAF form |
| SV-6 | Systems Data Exchange Matrix | Data exchange list from discipline 2, in DoDAF form |
| SvcV | Services Viewpoint | Services the system exposes / consumes; maps to MCP tools, edge functions, third-party APIs |
| DIV-2 | Logical Data Model | Entity-relationship of the data model; class hierarchy from discipline 2 in data-modeling form |
| StdV-1 | Standards Profile | Standards adopted (DoDAF, SysML, OpenAPI, OAuth, etc.); one per portfolio, not per sub-system |

### Composition with D25 and Concept Computing

D28 produces; D25 governs the production. Architecture-class documents under D25 carry DoDAF views under D28; the views inherit D25's WF-003 workflow, content-drop defenses, baseline snapshots, and the human GATE at Step 6. The DoDAF view files live under `docs/architecture/views/` (path provisional pending CONVENTIONS update) and are CIs in the `.cm/manifest.yaml`.

Concept Computing's full tool stack (Gaphor + Open-BPMN + Gitea/Mattermost/LXC, per `~/Concept/` §16) operates at the framework level, not the sub-system level. D28 explicitly forks: Concept retains its tool-of-record posture; sub-systems use the markdown+Mermaid subset. Both are correct for their scale.

### Scope fences (what this ADR does NOT cover)

- **Code-level UML.** Class diagrams of *implementation* code (post-scaffold, after the codebase exists) are deferred to a future code-cm discipline. D28 governs *architectural* depiction; it does not govern reverse-engineered class diagrams of running source.
- **Deployment view (technical stack diagram).** Discipline 2 explicitly named the software hierarchy as *logical*, not *technical*. A deployment view (servers, containers, network topology) is a separate artifact that may be produced as a DoDAF SV-2 (Systems Resource Flow) when relevant — it is not assumed to be present for every sub-system.
- **Tool-chain selection for code.** D28 governs diagrams; D26 governs language; a future code-cm ADR governs build, lint, test, and deployment toolchains.
- **Cross-portfolio architecture authoring tool.** Whether `~/xrsize4all/` (the future portfolio-meta repo) adopts a heavier toolchain when it stands up is out of scope here. D28 binds Lifting Tracker and the XRSize4 ALL *sub-systems*; the portfolio-meta layer may make its own choice.
- **Visual style standards.** Color, font, and layout conventions for diagrams are not specified here. They will be added to `CONVENTIONS_v0.2.2.md` if and when consistency-cost across views warrants it.

## Consequences

### Positive

**Calibrated rigor matches solo-plus-AI scale.** The profile is heavy enough to catch architectural drift (DoDAF views, SysML iconography, OV-5 process flows) and light enough to maintain solo (no tool-of-record, no formal-model interchange, no per-view ceremony). The calibration is the value — neither pure prose nor full Concept stack would deliver it.

**AI-codegen-friendly tooling.** Mermaid diagrams are text. Claude Code, Claude Desktop, and any LLM with a markdown-aware editor can read, write, and edit them without a binary-format step. The same can not be said of `.gaphor`, `.bpmn`, `.mdj`, or `.eapx` files; they require tool-side rendering and have no clean text-diff representation. AI-codegen-friendliness is a first-class requirement at solo scale because the architect's pair is an LLM.

**Git-native diagrams.** Mermaid blocks are part of the markdown file. They version with the file, baseline with the file, and diff with the file. There is no separate diagram repo, no orphaned `.png` exports, and no "the diagram and the doc disagree" failure mode. D25's content-drop defenses (Fresh-Read, post-mutation verify, baseline snapshot) extend to the diagrams without modification.

**Lower learning curve than full SysML toolchain.** A new collaborator (Fernando, future hires, future agents) reads a Mermaid block in their browser. No tool install, no license, no model-of-truth onboarding. The view-readability bar is "any reasonable systems engineer or architect," which Mermaid+SysML-iconography clears without further training.

**Consistent with CM v0.3.0 Content Classes.** Architecture-class documents already inherit WF-003, semver, GATE, and `superseded_by:` semantics under D25. DoDAF views are architecture-class artifacts; they inherit the same envelope without bespoke rules.

**SysML iconography preserves architect-readability.** Stereotype tags, multiplicities, and association directionality are the symbols a trained architect already knows. Using them inside Mermaid (rather than ad-hoc box-and-arrow) means the diagrams are not "Mermaid diagrams that happen to be about systems" — they are "systems diagrams that happen to render in Mermaid." The standards-grounding requirement is met without the tool overhead.

**Fit-for-purpose preserves judgment.** Slavish production of every DoDAF view for every artifact is the failure mode of bureaucratic architecture practice. Fit-for-purpose makes view selection a producer decision, not a checklist obligation. The eleven-view menu is a tool, not a contract.

**Standards-grounded for future scrutiny.** When XRSize4 ALL grows beyond solo (Fernando joins, an enterprise customer audits, a partner integration requires architectural disclosure), DoDAF + SysML are recognized standards that survive that scrutiny. Pure prose or ad-hoc-diagram architecture would not.

### Negative / tradeoffs

**Mermaid has expressive limits relative to full SysML.** Internal Block Diagrams (IBD), parametric diagrams, use-case diagrams, and full state-machine notation are not natively supported in Mermaid. The profile accepts this: when a diagram exceeds Mermaid's capacity, fall back to inline SVG or descriptive markdown. The fallback path is documented; it is not a defect, but it is real friction for the diagrams that need it.

**No live diagram-to-tool sync.** Importing a Mermaid diagram into PowerPoint/Google/Apple is via PNG/SVG export, not live binding. If the diagram changes, the slide deck does not auto-update. This is acceptable because slide decks are presentation artifacts, not source-of-truth; the markdown file is source-of-truth, the slide is a snapshot. But producers have to remember to re-export when they re-present.

**Concept Computing rigor diverges.** Concept's framework-level posture (Gaphor + Open-BPMN + formal model interchange) does not apply at the sub-system level. This is by design — the two scales are different — but it means a Concept-trained collaborator walking into Lifting Tracker sees a different toolchain. The fork is documented; it is not a contradiction, but it requires explanation when the two contexts meet.

**SysML iconography in Mermaid is convention-by-discipline, not enforcement.** Mermaid does not natively understand `«block»` or `«interface»` — the stereotypes are typed in as string labels and the discipline is in the producer's hand. D25's hooks could enforce schema at write-time eventually, but for now the convention is enforced by review, not by tooling. The fallback when a diagram drifts from convention is the WF-003 review step.

**Eleven-view menu is a learning curve for non-DoDAF readers.** A reader unfamiliar with DoDAF reads "OV-5a" without context. The first artifact under each view will need a one-line view-purpose footnote until a portfolio glossary stands up; AV-2 (Data Dictionary) absorbs that role once it exists.

**Profile is judgment-heavy.** "Fit-for-purpose," "complex components only," "load-bearing processes" — every selector requires the producer to make a call. This is the right tradeoff (the alternative is bureaucratic ceremony) but it puts more weight on the producer's judgment than a checklist would. The mitigation is that judgment calls are reviewed at the WF-003 GATE.

## Alternatives considered

**Full Concept Computing rigor (Gaphor + Open-BPMN + formal SysML/UML, with model-of-record).** Rejected for sub-system scale.

The Concept stack is correct at the *framework* level — `~/Concept/` is a methodology product and earns the tooling — but at the sub-system level it adds tool-of-record overhead, formal-model-interchange burden, and a binary-format step that breaks AI-codegen workflows. The cost is justified for a team of trained systems engineers maintaining a methodology; it is not justified for solo-plus-AI sub-system development. The fork between framework and sub-system levels is by design, not by accident.

**TOGAF / 4+1 / Zachman frameworks.** Rejected because Eric is fluent in DoDAF, not in those.

DoDAF, TOGAF, and Zachman all express overlapping architectural concerns; choosing among them is mostly a fluency question once the rigor level is set. Choosing the framework Eric already operates in cuts learning-curve cost to zero. 4+1 is a view-organization model rather than a full framework; its content is subsumed by DoDAF's broader view set. None of the rejected frameworks deliver a capability DoDAF does not, given Eric's background.

**Pure Mermaid without SysML iconography.** Rejected — not architect-readable enough; fails the standards-compliance ask.

Mermaid alone produces "boxes and arrows" without architectural semantics. A reader can not tell from the diagram alone whether a connection is composition, aggregation, or association; whether a box is a class, an interface, or a service; whether a multiplicity is `1`, `0..1`, or `1..*`. SysML iconography fills that gap inside Mermaid's expressive limits. Dropping the iconography would cut the marginal authoring cost (~10% per diagram) at the cost of architectural meaning — an unfavorable trade.

**C4 model as primary framework.** Rejected as primary.

C4's four levels (Context, Containers, Components, Code) are an excellent decomposition for software architecture, but they do not cover the operational and capability viewpoints that DoDAF does. For a system-of-systems platform like XRSize4 ALL, the operational view (who uses what, how the platform supports what missions) is first-class, and DoDAF expresses that natively while C4 does not. C4PlantUML's Mermaid syntax may be used *inside* DoDAF views (e.g., as the substrate for an SV-1 systems-interface view) where appropriate; it is a tool, not a competing framework.

**Excalidraw + draw.io as primary diagram tools.** Rejected — not git-native, manual export, no AI-codegen path.

Excalidraw produces `.excalidraw` JSON with embedded image data; draw.io produces `.drawio` XML. Both can be edited in their respective web tools and exported to SVG/PNG, but neither survives a clean text-diff or an LLM-driven edit. The git-native and AI-codegen-friendly requirements rule them out.

**Plan-mode-enforced architecture docs.** Declined per `project_plan_mode_decision` memory.

Plan-mode would force every architecture-document edit through a pre-execution plan step. This was considered as a hardening for D25's GATE but rejected because plan-mode does not understand DoDAF view semantics and would gate routine updates without adding value. The WF-003 GATE remains the human checkpoint; plan-mode is reserved for cases where Eric explicitly invokes it.

**Architecture documents without diagrams (prose-only).** Rejected — drift-prone under long-horizon sessions.

The April 10 analysis is the evidence. Prose architecture documents drift because text claims are not structurally enforced; a diagram makes a structural claim (this entity has *exactly* these relationships) that text obscures. The cost of producing diagrams is the cost of forcing those structural claims to be explicit, which is the value.

## References

### Source documents (in this repo)

- `docs/reference/source-doc-cm-design.md` v0.3.0 §3.7 — Content Classes definition; the architecture class this profile produces under.
- `docs/architecture_v0.4.0.md` v0.4.0 — D1–D27 plus D26 (TypeScript) and D27 (multi-agent interop). D28 will be added to this file's decisions list when the file is next touched.
- `docs/CONVENTIONS_v0.2.2.md` — file structure and versioning rules; will be amended to add `docs/architecture/views/` once the first DoDAF view ships.
- `docs/adrs/D25-source-document-cm_v0.1.0.md` — the governance framework D28 composes with.
- `reach4all://docs/research/concept-computing-april-10-failure-analysis.md` — evidence base for prose-only drift; motivates the visual-discipline requirement.

### Memory references

- `feedback_risk_vs_ops_discipline` — the selective-enterprise-rigor posture this profile operationalizes.
- `user_background` — Eric's systems-architect / DoDAF fluency baseline.
- `project_plan_mode_decision` — the rejection of plan-mode-enforced architecture docs.

### External references

- Concept Computing §16 Implementation Architecture (in `~/Concept/`, outside this repo) — Gaphor + Open-BPMN + Gitea/Mattermost/LXC stack at the framework level. D28 forks from this at the sub-system level.
- DoDAF 2.02 official documentation — the framework of record.
- SysML 1.6 OMG specification — the iconography standard applied within Mermaid's limits.
- Mermaid documentation — the rendering substrate.

### Related decisions

- **D19 (AI/LLM reasoning — Reasoner Duality with Authority Rule).** AI-pipeline process flows produced under D28 are OV-5 flows; the Tier 1 / Tier 2 boundary is named in the activity model.
- **D25 (Source-Document CM).** The governance framework D28 composes with; DoDAF views are architecture-class CIs under D25.
- **D26 (TypeScript with TC39 Type Annotations).** TypeScript signatures are the IPO discipline (#3) made executable; the type system is where IPO is enforced in code.
- **D27 (multi-agent interop protocol — deferred).** When the protocol is selected, its interface description goes in an SV-1 view and its data-exchange shape goes in an SV-6 matrix.

## Decision date and signer

**Decision:** 2026-04-23 (architectural-discipline planning session)
**Signer:** Eric Riutort (sole approver per Sprint 0a governance lock)

## Change history

| Date | Change |
|---|---|
| 2026-04-24 | ADR created (Sprint 0b Day 1). Captures the seven-discipline profile committed 2026-04-23 with the curated eleven-view DoDAF menu and the fit-for-purpose / SysML-iconography refinements. |

---

© 2026 Eric Riutort. All rights reserved.
