---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
tier: OPERATIONAL
content_class: architecture
version: 0.1.0
status: accepted
decision_id: D25
---

# D25 — Source-Document CM

## Status

**Accepted** — 2026-04-23 (Eric's formal v0.3.0 approval, closing Sprint 0a).

This ADR was drafted 2026-04-24 (Sprint 0b Day 1) to give the decision a single-page summary linkable from other architecture documents. The authoritative detail remains in `docs/reference/source-doc-cm-design.md` v0.3.0 (2,298 lines). If this ADR and the design brief disagree, the brief wins and this ADR is wrong — flag it and correct the ADR.

## Context

Source documents — architecture decisions, specs, roadmaps, stories, themes/epics/features, workflow definitions, and the agent-and-skill definitions that operate on them — are the load-bearing artifacts of this portfolio. When they drift, the system drifts. The XRSize4 ALL portfolio has no governance framework for those documents today, and recent evidence shows this is no longer acceptable.

The April 10, 2026 session analysis (`docs/reference/april-10-session-analysis.md`) documented thirteen distinct content-drop and governance-erosion failure patterns across ten-plus Claude.ai sessions attempting to synchronize eleven architecture documents under the Concept Computing agent suite. Failures clustered around three mechanical causes: silent compression eviction (`micro_compact`) removing tool-result content from context without the model noticing; the 25K-token Read ceiling forcing long-doc writes into patterns that corrupt mid-document; and governance rules stated in CLAUDE.md prose that the model ignored or re-interpreted across long sessions.

The Claude Code internals analysis (`docs/reference/claude-code-internals-findings.md`) traced the last of these to a specific runtime property: **CLAUDE.md is read-time only; enforcement is execution-time**. CLAUDE.md files concatenate into the system prompt and are interpreted; they do not constrain. Hooks, on the other hand, operate in the tool-call layer and can refuse a mutation outright. Rules written as prose are suggestions; only hooks enforce. This is the generalized CC-017 finding from Concept Computing: governance steps that are *listed* erode; steps that are *composed into tools* do not.

The Concept Computing framework's sixteen agents and six workflows encode Eric's prior governance posture, but their principles are not enforced at execution time — they are interpreted by the LLM at read time, and under long-horizon compression they are selectively forgotten. Meanwhile, the Lifting Tracker is about to scaffold, `reach4all` (the portfolio-level research repo) is about to be created, and the remaining XRSize4 ALL sub-systems are queued behind those. The governance gap needs to close before the content fans out, not after.

Fan-out matters because each new sub-system inherits whatever governance posture is in place when it is scaffolded. A governance framework landed now applies cleanly to `lifting-tracker`, to `reach4all`, and to identity / coaching / content / biometrics / wearables / form-analysis / instructional-content as each gets its own repo. A governance framework landed later has to be retrofitted into each of those repos in turn, with compounding cost and inconsistent discipline. The Sprint 0a window is the cheapest moment to land the framework.

The operating posture this ADR commits to is *rigor proportional to stakes*: architectural decisions carry the full workflow and the human GATE, research notes carry a lightweight variant, and the system respects the difference. A one-size-fits-all workflow would either choke the fast-moving research layer or under-govern the load-bearing architecture layer. The framework adopted here lets both coexist.

## Decision

Adopt the Source-Document CM framework as specified in `docs/reference/source-doc-cm-design.md` v0.3.0.

The framework governs architecture documents, decision records, specs, roadmaps, stories, themes/epics/features, workflow definitions, companion references, and the agent-and-skill definitions that operate on them. Raw data files (the 400+ session historical log, athlete data, seed CSVs) are out of scope; their ingestion rules (e.g., `docs/data-import.md`) are in scope as companion-tier documentation CIs. Code is recognized as a fifth content class but deferred to a separate code-cm discipline.

### Key shape of the framework

**Four workflows.**

- **WF-003** — full 15-step workflow for architecture-class documents. Includes a human GATE at Step 6 that Eric resolves via the artifact triple (request / assignment / resolution, with timeout and reassignment semantics).
- **WF-003L** — lightweight variant for research-class documents. ~5 steps. GATE is optional; class-appropriate.
- **WF-002** — session-end workflow. Reconciles working notes back into source documents.
- **WF-004** — reconciliation workflow for the multi-document case. Orchestrator-worker pattern layered over WF-003 when several documents are updating in parallel.

**Five content classes.** Architecture / Research / Operational / Reference / Code (named-but-deferred).

Each class carries its own workflow variant, version scheme, governance level, and staleness policy. The class determines the discipline level applied; a research note does not need the same ceremony as an architectural decision. This is the operating-posture reconciliation described in the Context section, expressed as structure.

**Eric-only manual GATE approval model.** No CI mechanical gate. No signed-commits requirement on main. Option B tags only — baseline tags are signed, individual commits are not.

Single human approver matches solo-plus-AI scale. Migration to multi-approver is deferred until Fernando (named collaborator per memory) or another human joins the write path; when that happens, the framework extends by adding approvers to the artifact-triple resolution, not by re-architecting the governance model.

**Four content-drop defenses.** These close the failure surface that `micro_compact` and the 25K Read ceiling create.

1. **Fresh-Read Discipline** — always re-Read a document immediately before mutating it; never trust in-context memory.
2. **Post-mutation Read-after-Write verification** against disk truth, not against the model's remembered content.
3. **20K-token pre-flight cap on Write** — converts a long-doc-write into a long-doc-edit-series, routing around the 25K ceiling.
4. **Baseline snapshots** at every tagged revision, so a detected drop can be reverted to a known-good version.

**CC-017 migration.** Load-bearing governance rules move from CLAUDE.md prose to PreToolUse hooks using the `exit 2` blocking-with-feedback contract.

CLAUDE.md becomes norms-and-context (read-time framing); hooks become enforcement (execution-time refusal). CLAUDE.md still matters — but it instructs, it does not constrain. Rules that were formerly "the agent should remember to do X" are re-expressed as "the hook refuses the tool call unless X is true."

**Belt-and-suspenders GATE enforcement (Q13 C).** The SKILL.md GATE remains expressed as an XML-tagged markdown instruction (readable narrative for the LLM and for a human walking in cold) *and* a PreToolUse hook refuses `Edit`/`Write` on `docs/**` until a matching approval artifact exists.

Prose instructs; hook enforces. Both layers in place because either alone has failure modes: prose-only is bypassable by the LLM, hook-only is opaque to a human reading the skill.

**Implementation surface.** A `document-cm` skill authored during Sprint 0b (Day 2+) carries the four workflows, the defenses, and the CC-017 hooks.

A `.cm/manifest.yaml` in each governed repo names the CIs, their classes, their current versions, and their baselines. The skill is exposed via a dual CLI + MCP adapter over a shared Python `lib/`, per the MCP-first posture. The same `lib/` underpins both surfaces so the CM logic has a single canonical implementation.

**Portfolio reach.** Governs both `~/lifting-tracker/` and `~/reach4all/` (the research repo, to be created Sprint 0b Week 1).

Content-class relaxations are applied by default in `reach4all` since its dominant class is Research; Architecture-class documents in the research repo still carry WF-003.

**Schema adoption.** `ai_interactions` adopts the hybrid TravelEpisode-derived schema (Q19):

- `input_raw` — ground-truth input, always populated
- `input_mode` — the input channel/shape
- `output_episode_type` — typed output discriminator
- `output_episode` — structured output (documentation-only Pydantic; enforced at application-code layer per Q15)
- `reasoning_trace` — the reasoning steps, where captured
- `thread_id` — conversation/session grouping
- `memory_scope` — `session / user / exercise_family / coach_athlete / global` (Q14 adopted now)
- `memory_type` — `working / long_term_semantic / long_term_episodic / procedural` (orthogonal to scope)

**Procedural memory is first-class.** SKILL.md files are versioned code and are the portfolio's canonical procedural-memory surface (Q18 finding from `building-agentic-ai-systems-findings.md` Ch 7). Treating procedural memory as code means it is reviewable, diff-able, and governed by the same WF-003 that governs any architecture document.

**Delegator role is explicit.** The WF-003 orchestration pattern names three roles — Coordinator / Delegator / Worker.

The Step 6 GATE is a Delegator-to-human delegation point. Every `ai_interactions` row carries its role tag (Q16). This lets the ledger filter by step type — "show me all the WF-003 delegation points that waited more than N minutes" becomes a query, not a narrative reconstruction.

### Scope fences (what this ADR does NOT cover)

- **Code-cm.** Governance for source code, tests, and build artifacts is deliberately deferred. Code is the fifth content class only in name; its workflow is a future design.
- **Data lineage.** Raw data artifacts and their provenance are out of scope. That is a W3C PROV-DM / DataOps concern, tracked separately.
- **CI/CD pipeline decisions.** How the skill gets built and deployed is code-cm territory, not document-cm.
- **The `document-cm` skill itself.** This ADR commits to the framework; the skill that implements it is Sprint 0b Day 2+ work and may warrant its own ADR if architectural consequences surface during implementation.

## Consequences

### Positive

**Content drops become detectable and recoverable.** The four defenses close the `micro_compact` and 25K-Read failure surface that drove ten-plus prior session failures. Fresh-Read discipline plus post-mutation verify plus baseline snapshots give three independent ways to notice a drop and one way to recover from it.

**Governance is enforced at execution time, not interpreted at read time.** Rules that matter to outcomes live in hooks that refuse non-compliant tool calls with `exit 2`. Rules that matter to framing live in CLAUDE.md. The two layers stop competing for the same job, and the load-bearing ones become tamper-proof against LLM interpretation drift.

**Discipline level matches document stakes.** Architecture-class documents carry the 15-step WF-003; research notes carry WF-003L. The framework does not impose architecture-tier ceremony on a reading-notes file, and does not let an architectural decision slip through with research-tier rigor. This is the rigor-proportional-to-stakes posture made operational.

**Single-approver Eric-only model matches the current operating scale.** No CI gate to tune, no signing keys to rotate, no multi-approver review queue to run — Eric approves, the artifact moves. The friction profile is appropriate for a solo-plus-AI operation.

**Migration path to multi-approver is forward-compatible.** When Fernando or another collaborator joins the write path, the framework extends by adding approvers to the artifact-triple resolution, not by re-architecting the governance model. The artifact triple is traceability enrichment today; it becomes a multi-party contract later without schema churn.

**Hybrid `ai_interactions` schema preserves raw input alongside typed output.** Every interaction is auditable in its ground-truth form (`input_raw`) while downstream consumers can filter on structured fields (`memory_scope`, `output_episode_type`, `role`). Typed-episode contracts are documentation-only; flexibility is retained at the Edge Function layer so schemas can evolve without a server-side Pydantic migration on every change.

**Procedural memory becomes a versioned, reviewable artifact.** SKILL.md files are the procedural-memory surface — they are code, they are in git, they carry the same governance as any other architecture-class document. This closes the "how does the system actually do X?" gap that Concept's agent definitions used to leave open.

**Delegator role is explicit in the orchestration pattern.** The three-role decomposition (Coordinator / Delegator / Worker) names what the WF-003 GATE actually is — a delegation to a human — and lets the `ai_interactions` ledger filter by step type. This makes governance observability a query, not an interpretation.

### Negative / tradeoffs

**Operational burden of maintaining the sixteen Concept agents in parallel with Claude Code primitives during the trust-but-verify period.** The v0.3.0 amendment reversed the earlier-drafted replacement plan in favor of keeping all sixteen agents authoritative while native primitives run as redundant observability.

This is the right call at solo-plus-AI scale — single-layer failure is costly, Python agents holding state in JSON files are immune to `micro_compact` content-drop, and the compound-pivot-trigger lesson from the April 10 analysis counsels against wholesale replacement. But it is real operational cost until empirical evidence via the Tier 2 concern log justifies deprecating individual agents. The budget for that cost has to be visible in sprint planning.

**WF-003's 15 steps add latency to architecture-class document updates.** A routine architecture edit that might have taken fifteen minutes now has fifteen workflow steps. This is accepted — the alternative is the April-10 failure mode — but it is a real tax, and it needs to be visible when estimating sprint capacity. The WF-003L variant offsets the tax for research-class work, which is most of the writing volume.

**Hooks-as-enforcement requires Sprint 0b Day 2+ implementation before governance is actually enforced rather than aspirational.** Between now and that implementation, the governance posture is defined but not yet tamper-proof. Interim operation depends on Eric reading SKILL.md and on the LLM respecting the XML-tagged GATE instructions.

This is a transitional risk, not a framework defect. The mitigation is to keep Sprint 0b Day 2+ on the critical path and not let the gap widen; if the skill slips, the interim governance regime is weaker than desired and content-drop risk is not yet materially lower than pre-framework baseline.

**Content classes need to be applied consistently to every new document from this point forward.** Existing documents need class assignments in their frontmatter. This is tractable (it's a retrofitting pass, not a rewrite) but it is work. The cost is amortized across Sprint 0b; any document that gets touched in the sprint inherits a class assignment as part of the touch.

**`.cm/manifest.yaml` becomes a new artifact to maintain per governed repo.** The manifest names CIs, classes, current versions, and baselines. It is machine-readable so automation can act on it, but it also has to be kept in sync with the actual repo state. The skill handles most of this (a `cm` CLI command mutates manifest and artifact together), but drift between manifest and reality is a new failure mode the framework has to stay vigilant about — caught by the post-mutation verify defense in practice, but worth naming explicitly so it is not a surprise.

**Framework authority concentrates decision power in one human.** The Eric-only approval model is the right choice for today's scale, but it does mean that every architectural decision is single-threaded through Eric. If Eric is unavailable, architecture-class work queues. This is accepted given current scale and is the tradeoff for not having a CI gate or multi-approver overhead.

## Alternatives considered

**CI-based mechanical GATE.** A GitHub Actions workflow that fails a PR if certain checks don't pass. Rejected.

Eric's approval model (Q13 + the Sprint 0a governance lock) is Eric-only manual; a CI gate adds friction without adding judgment, and the things a CI gate checks well (format, link resolution, schema) are not the things that actually fail in content-drop incidents. Those checks still run — they just aren't the gate. The gate is a human reading the resolution artifact.

**Signed-commits-required on main.** Every commit to main must be GPG-signed by an approved identity. Rejected.

The Sprint 0a governance lock chose Option B — tags only. Baseline tags are signed; individual commits to main remain autonomous so Claude Code can iterate without ceremony. Signing the individual commits adds a security theater layer that buys nothing in the solo-plus-AI threat model — the threat is content drop and governance erosion, not repository spoofing.

**Single lean workflow for all content classes.** One workflow, WF-003-lite, applied uniformly. Rejected for architecture-class but accepted for research-class as WF-003L.

The class-specific workflow decomposition *is* the reconciliation between "don't let architecture decisions slip" and "don't choke on research notes." A single workflow has to choose one failure mode to avoid; having two lets us avoid both. The cost is a small amount of conceptual surface (two workflows instead of one), which is tractable because the classes are few and stable.

**Replace all sixteen Concept agents with Claude Code primitives.** The §6.0a mapping matrix was originally staged as a replacement plan. Rejected — reversed in the v0.3.0 amendment.

Trust-but-verify: the sixteen agents stay authoritative, Claude Code primitives run in parallel as redundant observability, and individual agents are deprecated only when the Tier 2 concern log produces empirical evidence that a native equivalent is sufficient. Single-layer failure at this scale is too expensive to take on speculatively.

**Third-party knowledge overlay (Notion, Obsidian vault, dedicated wiki).** Put the research content in a purpose-built knowledge tool. Rejected.

The Sprint 0a governance lock committed to native-tools-only for the research repo — `reach4all` is markdown in git, governed by the same document-cm framework as `lifting-tracker`. A third-party overlay splits the source of truth and adds a vendor dependency for a problem that `.md` + `git` already solves.

**Do nothing — keep operating on Concept's existing agent-suite posture.** Rejected by the thirteen April-10 failure patterns. The posture is not wrong in principle (the agents encode real governance), but the evidence is that it is not enforceable in a Claude-Code-hosted session without execution-time backing. Doing nothing means accepting the failure rate; this ADR accepts the framework that closes it.

## References

### Source documents (in this repo)

- `docs/reference/source-doc-cm-design.md` — the full design brief (v0.3.0, 2,298 lines). Authoritative; this ADR summarizes it.
- `docs/reference/source-doc-cm-design-validated-review.md` — gap-closure review that fed v0.2.0 and v0.3.0.
- `docs/reference/april-10-session-analysis.md` — the thirteen failure patterns that motivated the framework.
- `docs/reference/claude-code-internals-findings.md` — the runtime analysis that proved CC-017 and named the 25K Read ceiling and the three-layer compression cascade.
- `docs/retrospectives/sprint-0a.md` — sprint close; records the governance locks (Eric-only manual, Option B tags, native-tools-only, research-repo=`reach4all`).
- `docs/architecture_v0.4.0.md` — D1–D24 plus D26 (TypeScript) and D27 (multi-agent interop) added in Sprint 0a.

### External references

- Concept Computing §16 Implementation Architecture — the Gitea VCS + Mattermost comms + LXC containers stack (in `~/Concept/`, outside this repo).
- Memory files: `project_cm_approval_model.md`, `project_research_repo.md`, `project_collaborators.md` (written during Sprint 0a).

### Related decisions

- **D19 (AI/LLM reasoning — Reasoner Duality with Authority Rule).** The hybrid `ai_interactions` schema adopted here is the concrete storage shape that D19 audit logging requires. Every Tier 2 interaction writes to the same table, indexed by `memory_scope` and `role`.
- **D26 (TypeScript with TC39 Type Annotations).** The `document-cm` skill's client-side typed-episode contracts are TypeScript; the open-standards posture this framework assumes is what D26 locks in.
- **D27 (multi-agent interop protocol).** D27 is deferred but in-scope for the framework — when the protocol choice is made in Sprint 0c+, the `document-cm` skill and its MCP surface need to accommodate it.

## Decision date and signer

**Decision:** 2026-04-23
**Signer:** Eric Riutort (sole approver per Sprint 0a governance lock)

## Change history

| Date | Change |
|---|---|
| 2026-04-24 | ADR created (Sprint 0b Day 1). Summarizes `source-doc-cm-design.md` v0.3.0. |

---

© 2026 Eric Riutort. All rights reserved.
