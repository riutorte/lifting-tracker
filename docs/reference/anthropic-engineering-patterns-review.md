---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-22
valid_as_of: 2026-04-22
re_check_by: 2026-07-21
tier: REFERENCE
content_class: research
---

# Anthropic Engineering Patterns Review (2024-12 → 2026-04)

Structured review of canonical Anthropic engineering patterns over the 17-month window spanning "Building Effective Agents" (Dec 2024) through current best-practice posts (April 2026), assessing whether the XML-tagged-markdown workflow approach used in Concept Computing and the planned `document-cm` skill align with published Anthropic guidance.

The review is scoped to answer a concrete question: does the current approach of reading a whole `wf_document_update.md` file with embedded `<workflow>`, `<phase>`, `<step>`, `<gate>`, `<execute>` XML and having Claude execute from it implement Anthropic's prompt chaining pattern, deviate from it, or implement something else entirely? Where it deviates, does the deviation matter?

---

## §1 Scope and Method

### 1.1 Sources consulted

Primary Anthropic Engineering posts (dated, linked, all on `anthropic.com/engineering` unless otherwise noted):

| Date | Post | Status |
|---|---|---|
| 2024-12-19 | [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — Schluntz & Zhang | Fetched; five-pattern taxonomy confirmed |
| 2025-04-18 (approx.) | [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) | Covered via prior review in `best-practices-review.md` |
| 2025-09-11 | [Writing (Effective) Tools for Agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | Fetched; consolidation, `response_format`, evals-as-forcing-function confirmed |
| 2025-09-29 | [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Fetched; JIT retrieval, context rot, three long-horizon techniques confirmed |
| 2025-10-16 | [Equipping Agents for the Real World with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (update tagged "open standard" 2025-12-18) | Fetched; three-level progressive disclosure, `name`/`description` triggering confirmed |
| 2025-10-20 | [Beyond Permission Prompts: Making Claude Code More Secure and Autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing) | Indexed; sandboxing / hooks-adjacent |
| 2025-11-04 | [Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) | Indexed |
| 2025-11-24 | [Introducing Advanced Tool Use on the Claude Developer Platform](https://www.anthropic.com/engineering/advanced-tool-use) | Indexed |
| 2025-11-26 | [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Indexed |
| 2026-01-09 | [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Indexed |
| 2026-03-06 | [Eval Awareness in Claude Opus 4.6's BrowseComp Performance](https://www.anthropic.com/engineering/eval-awareness-browsecomp) | Indexed |
| 2026-03-24 | [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Indexed |
| 2026-03-25 | [Claude Code Auto Mode: a Safer Way to Skip Permissions](https://www.anthropic.com/engineering/claude-code-auto-mode) | Indexed |
| 2026-03-25 | [Quantifying Infrastructure Noise in Agentic Coding Evals](https://www.anthropic.com/engineering/infrastructure-noise) | Indexed |
| 2026-03-25 | [Scaling Managed Agents: Decoupling the Brain from the Hands](https://www.anthropic.com/engineering/managed-agents) | Indexed; brain-hands separation in multi-agent context |
| 2026-04-07 | [Claude Mythos Preview — red.anthropic.com](https://red.anthropic.com/2026/mythos-preview/) and [Project Glasswing](https://www.anthropic.com/project/glasswing) | Referenced via source-doc-cm-design.md §10 Q9 |

Secondary corpus already synthesized and re-used:

- `docs/reference/best-practices-review.md` — prior review of Anthropic posts against D1–D24 (223 lines).
- `docs/reference/agentic-ai-bible-findings.md` — book findings cross-referenced against engineering posts (369 lines).
- `docs/reference/source-doc-cm-design.md` — CM design brief, §1.4 is the agentic-AI-dev frame (1,259 lines).
- `docs/reference/source-doc-cm-design-validated-review.md` — 26 gaps + 3 newly-identified; G24 evals harness and G25 multi-skill coordination are load-bearing (506 lines).

Date of last post reviewed: **2026-04-07** (Claude Mythos / Glasswing). No post dated later than that was indexed on `anthropic.com/engineering` at the time of this review.

### 1.2 What this review is not

This review does not:

- Redesign the `document-cm` skill. Any recommended changes are proposed as deltas against `source-doc-cm-design.md`, not as a replacement.
- Modify `wf_*.md` workflow definitions or any other file.
- Commit. Deliverable is this document only.
- Cover the OpenAI Agents SDK, LangGraph, or AutoGen as primary sources; those are cross-referenced only where they clarify a pattern.

### 1.3 Access limitations acknowledged up front

- `~/Concept/` filesystem mount was unavailable at review time. Concept Computing workflow definitions (`wf_*.md`) are known to this review through the description in the brief (source-doc-cm-design.md §5.5, §6) and the task prompt. The XML-tagged structure with `<workflow>`, `<phase>`, `<step>`, `<gate>`, `<action>`, `<execute>` tags and attributes (`number`, `agent`, `mandatory`, `type`) is taken as given per the prompt.
- Anthropic's docs.claude.com pages for Agent Skills redirected repeatedly. The authoritative engineering announcement (Oct 16, 2025 with Dec 18, 2025 "open standard" update) was used as the canonical source. SKILL.md frontmatter beyond `name` and `description` (e.g., `allowed-tools`, `version`) is not confirmed from primary source; it is inferred from the CM brief's own usage.
- Full prose of the two largest fetched posts (Building Effective Agents, Context Engineering) was present in local cache but only queryable by phrase-grep given single-line HTML envelope constraints. Confirmed phrases are quoted where available; other claims are paraphrased from the prior-review synthesis.

### 1.4 Method

Each of the ten specific questions in the task prompt is answered in §4. The supporting work is organized in §2 (pattern enumeration, chronological) and §3 (per-pattern assessment of our current approach). §5 consolidates recommendations; §6 captures residual open questions for Eric; §7 lists access limitations in full.

Fair-use quotes are held to ≤15 words each. All other claims are paraphrase unless specifically tagged as quote.

---

## §2 Pattern Enumeration (2024-12 → 2026-04)

### 2.1 The five workflow patterns — "Building Effective Agents" (2024-12-19)

**Workflows vs. agents — the foundational distinction.** Workflows are systems where LLMs and tools are orchestrated through predefined code paths; agents are systems where LLMs dynamically direct their own processes and tool usage. The post advocates starting with the simplest solution and only adding agentic complexity when it demonstrably improves outcomes. Key fair-use quote: agentic systems "trade latency and cost for better task performance — consider whether the tradeoff is justified."

Two core postures in the post: (a) start with a single LLM call augmented with retrieval and tools; (b) prefer workflows (predictable, testable) over agents (autonomous, less predictable) unless the problem actually requires agent-level flexibility. The five workflow patterns below are the building blocks.

The five patterns:

1. **Prompt chaining** — decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one. Optional gated checks between steps. Use when the task cleanly decomposes into fixed subtasks and you are willing to trade latency for accuracy. Our use case fit: **high** for the `document-cm` WF-003 document-update workflow, which is a 9-step sequence (baseline → changemap → gate → write → verify → record → tag → report).
2. **Routing** — classifies an input and directs it to a specialized follow-up task. Use when a complex task has distinct categories better handled separately and classification is accurate. Our use case fit: **low** for `document-cm` directly; potential fit for a future `cm dispatch` that routes between update / reconcile / freeze based on natural-language intent.
3. **Parallelization** — two variants: sectioning (split task into independent subtasks) and voting (run same task multiple times for diverse outputs). Use when subtasks are independent enough to parallelize. Our use case fit: **medium** for `cm reconcile <doc-a> <doc-b> <doc-c>` where per-pair comparisons could be parallelized, but latency is not the bottleneck.
4. **Orchestrator-workers** — a central LLM dynamically decomposes tasks, delegates to worker LLMs, and synthesizes results. Use when subtasks are not pre-defined. Our use case fit: **medium** — this is the shape of Claude-orchestrating-skill-scripts within `cm update`, where the orchestrator decides which sub-script to call based on manifest state.
5. **Evaluator-optimizer** — one LLM generates a response while another evaluates and provides feedback in a loop. Use when clear evaluation criteria exist and iterative refinement provides measurable value. Our use case fit: **high** for the Book Boss verify step (WF-003 step 7 in the CM brief; step 9 in the task prompt numbering). Generator writes the updated document; evaluator checks baseline preservation.
6. **Autonomous agents** — not one of the five workflow patterns but the sixth option: full agent loops where the model decides its own path. Use when paths cannot be pre-specified and latency/cost trade-offs are acceptable. Our use case fit: **low** — the `document-cm` skill is explicitly single-shot and human-gated; full agent autonomy would violate the Authority Rule (D19) and the GATE discipline.

### 2.2 Context engineering — "Effective Context Engineering for AI Agents" (2025-09-29)

Context is a finite resource with diminishing marginal returns; "context rot" empirically degrades recall as tokens grow. The operational prescription is to find the "smallest possible set of high-signal tokens" that maximize likelihood of the desired outcome.

Three techniques for long-horizon work:

- **Compaction** — summarize and replace earlier conversation turns once they approach window limits, preserving architectural decisions and open recommendations while discarding verbose intermediate reasoning.
- **Structured note-taking** — the agent writes durable notes (plans, findings) to external files that persist across turns and are reloaded selectively.
- **Sub-agent architectures** — spawn specialized sub-agents with clean context windows for bounded subtasks; parent receives only the distilled result.

The "just-in-time retrieval" principle: agents maintain lightweight identifiers (file paths, IDs, URLs) and load content on demand via tools, rather than pre-loading everything. The framing is "progressive disclosure" — reveal detail only when reasoning requires it. This contrasts with the RAG pattern of embedding-all-potentially-relevant-material-upfront.

### 2.3 Tools for agents — "Writing Tools for Agents" (2025-09-11)

Core thesis: tools are a contract between deterministic systems and non-deterministic agents, so they must be designed for agents, not for developers.

Named practices:

- **Tool consolidation.** `schedule_event` beats `list_users` + `list_events` + `create_event`. `search_logs` beats `read_logs`. Rationale: token efficiency and reducing the "which tool?" decision surface. Warning: too many tools or overlapping tools distract agents.
- **Namespacing.** `asana_search` / `jira_search` by service, or `asana_projects_search` / `asana_users_search` by resource. Choose via evaluation, not theory.
- **`response_format` enum** (`CONCISE` / `DETAILED`) gives the agent control over verbosity.
- **Error responses are agent-facing prompts, not developer logs.** An error that says "what to do differently" beats a traceback.
- **Evaluation is the forcing function.** Held-out test sets, real tasks, measured token/accuracy/runtime outcomes.

### 2.4 Agent skills — open-standard SKILL.md format (2025-10-16, updated 2025-12-18 to open-standard status)

The canonical skill structure:

- A skill is a directory containing a `SKILL.md` file with YAML frontmatter.
- Required frontmatter fields per the primary source: `name` and `description`. Other fields (e.g., `allowed-tools`) are used in practice but not confirmed as required from the docs.claude.com page (which redirected at review time).
- The `name` and `description` are pre-loaded into the agent's system prompt at startup (level 1 of progressive disclosure).
- Claude loads the full SKILL.md body only when it decides the skill is relevant to the current task (level 2).
- The skill directory can reference additional files (`references/*.md`, `scripts/*.py`, `templates/*.md`) that Claude loads on demand (level 3). Skills bundle "too much context to fit into a single SKILL.md" by externalizing it.
- Skill-invokes-skill composition is not explicitly documented. "Composable" is used at the capability-packaging level, not at a formal step-sequencer level.

Explicit Anthropic quote (fair-use): "skills let Claude load information only as needed." And: "Agents with a filesystem and code execution tools don't need to read the entirety of a skill into their context window."

### 2.5 Brain-hands separation — "Scaling Managed Agents: Decoupling the Brain from the Hands" (2026-03-25)

Concept Computing and the `document-cm` design both invoke this pattern. The Mar 2026 post extends it to multi-agent harnesses: the reasoning layer (brain) is decoupled from the execution layer (hands) so that interfaces outlast implementations, and so that hands can be swapped (language, runtime, even agent identity) without disturbing reasoning.

### 2.6 Harnesses for long-running agents — "Effective Harnesses for Long-Running Agents" (2025-11-26) and "Harness Design for Long-Running Application Development" (2026-03-24)

Two posts extending the long-horizon context-engineering techniques to concrete harness design. Relevant motifs: checkpoint state between steps, use structured note-taking as the inter-step persistence mechanism, and bound per-step token budgets so a degraded step fails fast rather than silently contaminating the next.

### 2.6.1 Brief detail on the harness-design motifs

Across the three harness-related posts (Nov 2025 and both March 2026 posts), five motifs surface that are relevant to our workflow architecture:

- **Checkpoint state between steps.** Each step's output should be durable outside the LLM context. If the LLM loses context, the next step can be resumed from the checkpoint. `.cm/scratch/*` is exactly this; `.cm/scorekeeper.json` is the longer-lived ledger.
- **Bound per-step token budgets.** A step that silently consumes 50K tokens is a harness-design problem even if it succeeds; it signals unstable upstream state. The brief doesn't specify budgets today. §5.a recommendation 7 proposes a defensive check.
- **Fail-fast on degraded state.** If Step 6 verify fails, don't attempt Step 7; surface the failure to the human immediately. The brief's `cm update` design already does this (§5.5: "refuse to proceed on content loss").
- **Structured inputs and structured outputs between harness stages.** Each step's output should be machine-readable so the next step doesn't have to re-parse prose. `.cm/scratch/<id>-baseline.json` is structured; `.cm/scratch/<id>-changemap.md` is less structured but still has predictable sections.
- **Observable state transitions.** The harness should emit structured events (e.g., "Step 6 started", "Step 6 completed with N content-loss flags") that can be aggregated for telemetry. The brief's scorekeeper captures outcomes; per-step events are not captured today.

### 2.7 Evals — "Demystifying Evals for AI Agents" (2026-01-09) and "Eval Awareness" (2026-03-06) and "Quantifying Infrastructure Noise" (2026-03-25)

The January post codifies evaluation as the discipline for any non-trivial agent system: curated task sets, golden outputs, measurable outcomes across accuracy, runtime, tool-call count, token consumption, and error rate. The March "Eval Awareness" post flags that frontier models (Opus 4.6) can detect when they are being evaluated and adjust behavior — which pushes evaluation toward production-traffic sampling and away from purely synthetic benchmarks. The "Infrastructure Noise" post quantifies how much run-to-run variance is driven by non-model factors (network, sandbox startup, cache state), which argues for repeated runs and statistical thinking about eval results.

### 2.8 Claude Code sub-agents and hooks — via `best-practices-review.md` (current as of April 2026)

Two related mechanisms in the Claude Code tooling, both load-bearing for our workflow architecture:

**Sub-agents (`.claude/agents/*.md`).** Each sub-agent has its own system prompt, allowed-tools, and context window. Parent invokes via the Agent tool and receives only a distilled result (usually 1–2K tokens). The sub-agent never sees the parent's full conversation; the parent never sees the sub-agent's intermediate reasoning. Canonical uses (per `best-practices-review.md` Source 3 and Source 2 #8):

- File-heavy investigations that would otherwise flood the parent's context.
- Independent code-review passes (writer/reviewer pattern — two sessions, fresh context for the reviewer).
- Parallel analysis where each branch returns a structured finding.
- Reasoning that requires a different allowed-tools scope than the parent (e.g., a read-only investigation sub-agent called by an edit-capable parent).

The key architectural property: sub-agents isolate context. This is the single-process implementation of the "sub-agent architectures" long-horizon technique from the Sep 2025 context-engineering post.

**Hooks (`.claude/hooks/*.json` wired to SessionStart / PreToolUse / PostToolUse / Stop).** Deterministic code (usually a shell command or Python script) that runs at lifecycle events. Unlike sub-agents, hooks do not involve an LLM — they are pure enforcement. Canonical uses:

- **SessionStart hook:** load project context (e.g., `cm status` output attached automatically).
- **PreToolUse hook:** validate or block a tool call before it executes. Example: refuse to `Edit` `docs/*.md` unless an approval artifact exists.
- **PostToolUse hook:** react to a completed tool call. Example: auto-inject an `updated:` frontmatter date after any `Edit` on `docs/`.
- **Stop hook:** run at session end. Example: generate a session report to `reports/session_<timestamp>.md`.

Hooks are the enforcement primitive that converts "the skill tells Claude to do X" into "Claude cannot avoid doing X." For governance workflows (our primary use case), this distinction is the difference between CC-017-vulnerable and CC-017-resistant architectures. The Oct 2025 "Beyond Permission Prompts" post and the Mar 2026 "Claude Code Auto Mode" post extend this layer with classifier-gated permission prompts, which is an LLM-mediated variant of the same enforcement motif.

### 2.9 Security — sandboxing, auto mode, Mythos / Glasswing

The October 2025 "Beyond Permission Prompts" and March 2026 "Claude Code Auto Mode" posts extend the safety envelope: permission prompts move from interrupting the user to being classified by a gating model, with sandbox (container) isolation for risky tool calls. The April 2026 Mythos Preview and Project Glasswing announcements confirm autonomous vulnerability-identification capability, which (per source-doc-cm-design.md §10 Q9) raises the bar for skill-script vetting even at solo scale.

---

## §3 Per-Pattern Assessment

Assessment of our current approach (Concept XML-tagged markdown workflows + the planned `document-cm` skill) against each pattern identified in §2. Verdict: **ALIGNED** (we implement it or intend to), **DEVIATED** (we implement something different, with or without justification), or **N/A** (pattern doesn't apply to this surface).

### 3.1 Matrix

| Pattern | Source | Verdict | Evidence |
|---|---|---|---|
| Prompt chaining | Dec 2024 | **DEVIATED** (monolithic-file variant) | See §3.2; Concept WF-003 embeds the entire chain in one `wf_*.md` file that Claude reads once and executes from, rather than invoking discrete API calls with programmatic checks between each step. |
| Routing | Dec 2024 | N/A | Not used today; candidate for a future `cm dispatch`. |
| Parallelization (sectioning) | Dec 2024 | N/A | `cm reconcile` is sequential; no need to parallelize at solo scale. |
| Parallelization (voting) | Dec 2024 | N/A | No current use case. |
| Orchestrator-workers | Dec 2024 | **ALIGNED** partially | The `document-cm` SKILL.md orchestrates calls to `book_boss.py`, `manifest.py`, `reporter.py` etc. Orchestrator is Claude reading SKILL.md; workers are the Python scripts. The Concept 16-agent suite was a heavier orchestrator-workers implementation that the brief correctly refactors down to 4 scripts. |
| Evaluator-optimizer | Dec 2024 | **ALIGNED** | Book Boss verify (WF-003 step 7 in the brief, step 9 in the task prompt numbering) is exactly this: generator (Claude or Book Boss) writes the updated doc; evaluator (Book Boss `verify`) checks baseline preservation. See §4.4. |
| Autonomous agents | Dec 2024 | **N/A — deliberate decline** | `document-cm` is single-shot, human-gated. Full autonomy conflicts with D19 Authority Rule and the single GATE discipline. |
| Just-in-time retrieval | Sep 2025 | **DEVIATED** for workflow files; **ALIGNED** for skill references | §4.5 elaborates. The wf_*.md file is read in its entirety; the skill's `references/` folder follows progressive disclosure correctly. |
| Context rot / attention budget | Sep 2025 | **ALIGNED** at project layer, **partially DEVIATED** at workflow layer | Project CLAUDE.md is lean (~90 lines, pointers only). But a 500+ line wf_*.md loaded in full competes for the same attention budget. |
| Compaction | Sep 2025 | N/A for `document-cm` (single-shot) | Relevant for D19 Tier 2 coaching sessions post-MVP. |
| Structured note-taking | Sep 2025 | **ALIGNED** | `.cm/scratch/*` for intermediate files, `.cm/scorekeeper.json` for the append-only ledger, `reports/session_*.md` for session handoffs. This is the pattern. |
| Sub-agent architectures | Sep 2025 | **UNDER-USED** | The brief recommends scripts, not sub-agents. See §4.7 — there is a case for at least the Book Boss verify step to be a Claude Code sub-agent. |
| Tool consolidation | Sep 2025 | **ALIGNED** | `cm update <doc>` is a consolidated operation (9 steps in one command). The Edge Functions layer for Lifting Tracker's D19 Tier 2 is explicitly tool-designed per `best-practices-review.md` Gap 3. |
| Namespacing | Sep 2025 | **ALIGNED** | `cm.*` namespace (`cm.update`, `cm.status`, `cm.validate`) mirrors the `asana_*` / `jira_*` pattern. |
| `response_format` enum | Sep 2025 | N/A currently; recommended for future | `cm` commands return Markdown session reports or JSON ledger entries; no verbosity-enum is needed today. |
| Error-as-agent-prompt | Sep 2025 | **ALIGNED** | The brief's poka-yoke principle (§1.4 fifth bullet) and the specific Edge Function error-response guidance in `best-practices-review.md` Source 5 cover this. |
| Evals as forcing function | Sep 2025 + Jan 2026 | **COMMITTED but NOT IMPLEMENTED** | §1.4 of source-doc-cm-design.md commits to the principle; G24 of the validated review flags this as must-fix. See §4.8. |
| SKILL.md three-level progressive disclosure | Oct 2025 (updated Dec 2025) | **PARTIALLY ALIGNED** | SKILL.md `name` + `description` triggering is correct. `references/` folder exists in the brief's layout (§6.1) and is correctly externalized. BUT: Concept `wf_*.md` files sit outside this scheme and are read in full rather than JIT. See §4.5, §4.6. |
| Brain-hands separation | Mar 2026 (extended from earlier posts) | **ALIGNED** | Skill's SKILL.md is brain; `scripts/*.py` are hands. The brief is explicit about this (§6.2: "No LLM prompt templates encoded in Python"). |
| Harness design / checkpoint between steps | Nov 2025 + Mar 2026 | **PARTIALLY ALIGNED** | `.cm/scratch/*` provides between-step persistence; scorekeeper provides the ledger. But per-step token budgets are not enforced. Minor gap. |
| Claude Code sub-agents | 2025–2026 | **NOT USED** | See §4.7 for where they fit. |
| Claude Code hooks | 2025–2026 | **PLANNED** | The brief commits to PreToolUse / PostToolUse / Stop / SessionStart hooks at §5.4. Not yet implemented. |
| Sandboxing / auto mode | Oct 2025 + Mar 2026 | **FUTURE** | G15 in the validated review (filesystem scope, network-off default for skill bash steps) lands in this cluster. |

### 3.2 Notes on specific matrix rows

**Orchestrator-workers — ALIGNED partially.** The alignment is "partial" because the canonical orchestrator-workers pattern has LLM workers — the central LLM dispatches to worker LLMs, each of which reasons within its own invocation. Our implementation dispatches to Python scripts, which is orchestrator-workers with deterministic workers. This is not worse — it is a hybrid that gains reproducibility at the cost of flexibility. The Concept 16-agent suite was closer to canonical (each agent was Claude invoking Python that invoked Claude), which the brief correctly judges as more infrastructure than the job required.

**JIT retrieval — split verdict.** SKILL.md's `references/` mechanism implements progressive disclosure correctly (level 1: name + description in system prompt; level 2: full SKILL.md on trigger; level 3: references loaded on demand). The deviation is elsewhere: the Concept `wf_*.md` file pattern, which sits outside the SKILL.md three-level scheme, is read in full. This is not a SKILL.md problem — it's a workflow-definition-location problem that the brief's §9 layout hasn't yet fully resolved. §4.6 lays out the fix.

**Context rot — partially deviated at the workflow layer.** A 500-line wf_*.md is not catastrophic in an Opus 4.6 200K-context session, but the Sep 2025 guidance is that attention budget degrades well before context limits hit. For MVP scale this is fine; for v2+ scale with coaching sessions running alongside, it is a predictable degradation source.

**Sub-agent architectures — under-used.** The brief's §6 agent-to-skill refactor retires the Concept 16-agent suite and collapses to 4 scripts. This is correct for the operational surface (Book Boss, Notekeeper, Scorekeeper, Reporter). But §4.7 of this review argues that at least two of those operations (build change map, session report) should be sub-agents rather than scripts, because they involve LLM reasoning and benefit from isolated context.

**Evals committed but not implemented.** The single most load-bearing row. The brief's §1.4 commits to the principle ("Evaluation as the forcing function"); no implementation is in §9 or §10. G24 of the validated review names this as must-fix.

### 3.3 The prompt-chaining verdict, stated precisely

Anthropic's canonical prompt chaining is: discrete LLM call → programmatic check → discrete LLM call → programmatic check → ... with state threaded through by the orchestrator. Each step's API call is independent; each check is a deterministic gate.

Concept's `wf_*.md` approach is: one LLM call reads a markdown+XML document that contains all steps, and executes the whole chain within a single turn (or a few turns) inside that one context. The gates are not programmatic API boundaries — they are XML tags (`<gate type="HUMAN_APPROVAL">`) that instruct Claude to pause.

These are distinct architectures. Both can implement the same semantic chain. The canonical form gets more reliable gating (a gate is an API boundary, which is tamper-proof in the way an XML tag is not). The monolithic form is cheaper to author (one file, one edit point), easier to version (one git object), and — critically — survives as long as the whole wf_*.md fits comfortably within the context window without crowding out the rest of the task.

This is a deviation. Whether it matters depends on whether the trade-offs hold at the scale the workflow operates at. §4 works through the specific consequences.

---

## §4 Answers to the 10 Questions

### 4.1 Does XML-tagged markdown implement Anthropic's "prompt chaining" pattern? Which variant?

**Short answer.** Yes, semantically. The XML-tagged workflow implements prompt chaining in the monolithic-file variant, not in the canonical-chained variant.

**Longer.** The five steps of WF-003 (baseline extract → change-map build → GATE → write → verify → record → tag → report) form a sequential chain where each step's output feeds the next. That is prompt chaining by definition. What differs from Anthropic's canonical formulation is the mechanism:

- **Canonical chained variant.** Each step is its own API call. Between steps, a deterministic orchestrator (code) inspects intermediate output, runs a programmatic check, and decides whether to call the next step. The orchestrator is the stable artifact; individual prompts are short.
- **Monolithic-file variant (Concept).** Claude reads one `wf_*.md` file that encodes all steps, their order, their gates, and their execute blocks. Claude is both orchestrator and worker. Gates are XML tags that instruct Claude to stop. The file is the stable artifact; the orchestrator is the runtime Claude interpreting it.

Both produce the same end-to-end behavior when everything goes well. They diverge when the context grows, when a step silently fails, when an XML tag is misinterpreted, or when a later session needs to resume partway through.

**Why the distinction is load-bearing.** Anthropic's "Building Effective Agents" emphasizes programmatic checks between steps as the reliability mechanism — an LLM that drifts mid-chain can be caught by a check that runs outside the LLM. In the monolithic variant, the LLM is the check. That is weaker, but not structurally broken — it is a trade-off.

### 4.2 Is the monolithic-file variant a valid Anthropic pattern or a deviation? Documented trade-offs?

**Verdict.** Deviation. Not forbidden, not endorsed, not discussed in the 2024-12 post or in any subsequent post located in this review. The pattern exists in practice (it is what Claude Code sub-agent files look like; it is what SKILL.md files look like when they inline workflow steps). But Anthropic's published guidance does not name it as "prompt chaining" and does not document its trade-offs.

**Trade-offs we can document from first principles and adjacent guidance:**

| Dimension | Monolithic file | Canonical chained |
|---|---|---|
| Authoring cost | One file, one edit point, one git version | N files, N prompts, orchestrator code to maintain |
| Reliability of gating | Gate is an instruction inside an LLM context — can be skipped if attention drifts (CC-017 class failure) | Gate is an API boundary — cannot be skipped short of the orchestrator misbehaving |
| Context budget cost | The entire wf_*.md sits in the context window — competes with the task | Only the current step's prompt is in context |
| Resume / replay | Hard — reasoning about mid-chain state requires rereading the full file | Easy — each step is a checkpoint |
| Observability | Session-level (one transcript) | Step-level (N API calls with structured outputs) |
| Debuggability | Hard — failure mode is "the LLM didn't do step 7" | Easy — each step has a traceable return value |
| Portability | High — a markdown file runs anywhere Claude runs | Medium — orchestrator is a code artifact that needs a runtime |
| Vendor portability | Highest — open standard format | Depends on orchestrator implementation (SDK-dependent) |

**The steady-state judgment.** For a 9-step workflow under ~500 lines with a cooperative user running it once per document update, the monolithic variant is reasonable. For a 30-step workflow, for workflows that fail partway through regularly, for workflows where gate compliance matters for audit, the canonical variant wins.

**The CC-017 failure mode is the main argument against monolithic.** Concept's own governance erosion — steps getting skipped over long sessions — is exactly what monolithic is vulnerable to. The brief's explicit compensation is skill composition (source-doc-cm-design.md §5.5 and the validated-review's note that "anything not composed into a tool gets skipped over long sessions"). That compensation is correct; it is also what makes the variant workable.

### 4.3 Which of the five patterns is canonical for the `document-cm` skill? Why?

**Primary pattern: prompt chaining (with gates).** The 9-step WF-003 sequence is chain-shaped. No single step requires multi-path routing or parallel decomposition. The chain has one human gate (Step 4 in the CM brief's numbering of §5.5; Step 6 in the Concept-original wf_document_update.md — the numbering varies because the brief consolidates 15 original Concept steps into 9).

**Embedded evaluator-optimizer: Book Boss verify.** Within the chain, Steps 6 (Book Boss verify) is an evaluator-optimizer: a generator (Claude writing the new doc in Step 5) and an evaluator (Book Boss checking baseline preservation in Step 6) with the loop-back being "refuse to proceed on content loss" — which forces Step 5 to redo rather than allowing Step 7 to proceed. This is a clean, local evaluator-optimizer embedded in the chain.

**Supporting pattern: orchestrator-workers at the SKILL.md layer.** Claude reading SKILL.md and dispatching to `book_boss.py` / `manifest.py` / `reporter.py` is orchestrator-workers. The workers are deterministic Python scripts rather than other LLM calls, but the shape is the same: central reasoner decides which worker to invoke based on state.

**Not used: routing, parallelization, autonomous agents.** Routing is absent because the entry point is `cm update <doc>`, not natural language. Parallelization is absent because step ordering is load-bearing (baseline before change-map; verify before record). Autonomous agents are absent because the whole skill is explicitly human-gated (D19 Authority Rule; the GATE at step 4).

**Composite label.** The canonical label is "chain with gate, composed from an orchestrator-workers SKILL.md and an embedded evaluator-optimizer for content verification." The brief already uses "chain-with-gate" as the workflow's `pattern` field in the manifest (source-doc-cm-design.md §9.2, `workflows.wf-003-document-update.pattern`), which is accurate as far as it goes but understates the embedded evaluator-optimizer. Recommend annotating that field to `chain-with-gate + evaluator-optimizer-verify`.

### 4.4 Is the Book Boss verify step correctly implemented as evaluator-optimizer?

**Short answer.** Yes, architecturally. The pattern is right. The implementation details determine how much of the evaluator-optimizer benefit is captured.

**Architectural check.**

- **Generator:** Claude (or a sub-process) writes the updated document in Step 5.
- **Evaluator:** `book_boss.py verify` in Step 6 compares the new version against the baseline extracted in Step 2.
- **Loop:** If verify reports content loss, the skill refuses to proceed; the generator must redraft.
- **Separation:** The generator and the evaluator are distinct processes (one is Claude reasoning against the source material; the other is deterministic extraction against the new file). This is the core property the Dec 2024 post calls out: "one LLM call generates a response while another provides evaluation."

**Where the pattern can be strengthened.**

1. **Evaluator should not be the generator's own reread.** If `book_boss.py verify` calls the same Claude that wrote the update and asks "did you preserve everything?", that is not evaluator-optimizer — that is self-evaluation, which the pattern explicitly warns against (best-practices-review.md Source 2 #9: "never let the LLM evaluate its own Tier 2 output without Tier 1 in the loop"). The brief is correct on this: the Book Boss verify is deterministic extraction (sections, key terms, cross-refs, word counts per source-doc-cm-design.md §5.5 step 2), not an LLM reread. Good.

2. **The loop-back must actually loop.** The brief says "refuse to proceed on content loss" — this is a one-shot refusal, not an iterative refinement. In the canonical evaluator-optimizer, the evaluator provides feedback the generator uses to improve. Our refusal is a harder edge: reject, force the human to intervene. That is acceptable for a single-person, single-session cadence but is not the full evaluator-optimizer pattern. Tagging as "evaluator-gated generator" might be more precise than "evaluator-optimizer." The operational difference is small.

3. **What "baseline preservation" means is the hard part.** Per the brief (§5.5 step 2), baseline extraction captures sections, key terms, cross-refs, word counts. This covers structural preservation well. It does not cover semantic drift (the words are all still there, but the argument changed), or rhetorical drift (the tone shifted). For the kind of drift our docs tend to suffer, structural preservation is the 80% case. Anthropic's own Sep 2025 tools post recommends evals with held-out real tasks — the Book Boss verify is effectively a single, fixed eval that runs every time. That is a reasonable approach; G24 in the validated review would expand it with a broader eval corpus (ADR add, semver bump, baseline freeze, manifest update, skill registration scenarios).

**Net verdict.** Book Boss verify is correctly the evaluator-optimizer arm of WF-003 in architectural shape. Two refinements are worth naming: (a) evaluator should remain deterministic, never LLM self-reread, and (b) the "refuse to proceed" gate is stricter than canonical evaluator-optimizer's iterative feedback loop — note the distinction in future design work.

### 4.5 Does reading the entire wf_*.md file into context violate Anthropic's just-in-time retrieval principle?

**Short answer.** Yes, technically. Whether it matters operationally is a scale question.

**The violation.** Sep 2025's context-engineering post argues that large files should be identified by lightweight pointers and loaded on demand. A 400–800 line wf_*.md (Concept WF-003 is in this range; the brief's consolidated 9-step skill version is smaller) loaded at the start of every update operation sits in the context window for the duration of the operation, competing with the task-specific content (the actual document being updated, the baseline JSON, the change map). That is pre-loading, not JIT.

**Whether it matters.**

- *At current scale.* Lifting Tracker's `docs/architecture_v0.4.0.md` is ~1200 lines, `docs/user-stories_v0.2.0.md` is ~1500 lines, the largest reference docs are ~1500 lines. A 500-line wf_*.md plus a 1500-line doc plus baseline JSON plus change map is well under Claude's Opus 4.6 200K context. The attention-budget concern is that context rot starts degrading recall well before the window fills — but "well before" for a 200K model probably means tens of thousands of tokens, not hundreds. Operationally, it is unlikely to bite at MVP scale.
- *At v2+ scale.* If a coaching-session workflow runs alongside (athlete history, 30 sessions of structured data, LLM-generated summaries, plus the workflow definition), the budget pressure mounts. By then, architectural remediation is cheap because the workflow itself is smaller after skill refactoring.
- *At failure mode.* The more acute concern is CC-017: a long session that silently skips a governance step because the governance step's XML tag is now 400 lines back in the context. This is not a JIT violation per se — it is an attention-budget violation. Both point to the same fix: get the workflow file shorter, or out of context entirely.

**Alternatives, in ascending cost.**

1. **Skill-reference externalization.** Move the step details into `references/wf-003-step-details.md` and keep SKILL.md as 40–60 lines of orchestration. Claude loads the step details only when a specific step is ambiguous. This is what the SKILL.md progressive-disclosure pattern was designed for. **Near-zero cost.**
2. **Script-per-step.** Each step becomes a named script (`book_boss.py extract-baseline`, `manifest.py record`, `reporter.py session-report`) that Claude calls by name. The workflow is the sequence of calls, not a file. Claude reads SKILL.md (short), then executes. **Medium cost** — roughly what the brief's §5.5 already does.
3. **Canonical chained variant.** Each step is its own API call with programmatic gates. The workflow file becomes an orchestrator script. **Higher cost, higher reliability.** Appropriate when monolithic starts failing.

**What to do now.** The brief's approach already does #2. The question is whether wf_*.md lives on alongside the SKILL.md, or whether SKILL.md absorbs the orchestration and wf_*.md becomes a companion reference. See §4.6.

### 4.6 How should wf_*.md files relate to the SKILL.md per the December 2025 Agent Skills spec?

**Three design options, each with published or inferred Anthropic guidance.**

**Option A — wf_*.md inlined into SKILL.md.** The SKILL.md body *is* the workflow. Anthropic's Oct 2025 post describes skills that "bundle instructions" in SKILL.md plus additional files for context too large to fit. For a 9-step workflow, inlining is viable — the 60–80 lines of orchestration fit comfortably in SKILL.md. The Concept wf_*.md concept goes away; it was an artifact of a non-skill-aware environment. **Pros:** simplest; matches Anthropic's published model. **Cons:** loses the wf_*.md as a human-readable standalone doc; governance metadata (who owns the workflow, when was it last changed) collapses into SKILL.md.

**Option B — wf_*.md externalized into `references/`.** SKILL.md says "for WF-003 update flow, see `references/wf-003.md`." Claude loads the reference only when needed. This is the canonical progressive-disclosure pattern. **Pros:** keeps the workflow as a standalone, versioned, governance-owned doc. Respects JIT retrieval. **Cons:** adds one layer of indirection. Claude must know to load the reference at the right time — either SKILL.md instructs, or the decision is implicit.

**Option C — wf_*.md as the skill, SKILL.md as a thin shim.** The wf_*.md is a first-class tier COMPANION doc (this is how the brief's manifest actually categorizes workflows — source-doc-cm-design.md §9.2 lists workflows as their own kind of manifest entry with a `pattern` field). SKILL.md is a 20-line trigger ("when the user says 'update doc X', invoke WF-003"). **Pros:** keeps the architectural documentation clean. **Cons:** requires Claude to do more reasoning about which file is authoritative.

**Recommendation.** Option B. Reasons:

- The brief's §9.4 SKILL.md example is already ~80 lines — including inline WF-003 orchestration in "Workflow: update a document (WF-003)" section. Moving the detailed orchestration steps into `references/wf-003.md` brings SKILL.md back under ~50 lines and matches the three-level progressive disclosure.
- Governance needs to own the workflow as a standalone artifact (for baseline preservation verification, for version-bump tracking). An externalized `references/wf-003.md` satisfies that.
- The Anthropic "references/forms.md" example from the Oct 2025 post is exactly this shape.

**What changes in the brief.** §9.4's SKILL.md example inlines the workflow; move lines 944–966 (the numbered 1–9 workflow steps) into `.claude/skills/document-cm/references/wf-003.md` and replace with a "For the detailed update flow, see `references/wf-003.md`" line. The manifest entry (§9.2) is already correct — it already points to `docs/workflows/wf-003-document-update.md` as the workflow's canonical path.

**One subtlety.** The brief's manifest has `workflows.wf-003-document-update.path: docs/workflows/wf-003-document-update.md` as a governance-owned doc *and* `implemented_as: .claude/skills/document-cm/scripts/wf003.py`. If Option B is adopted, a third path emerges: `references/wf-003.md` as a skill-internal copy. That is duplication. Cleaner: make the skill's reference a symlink or a build-time copy of `docs/workflows/wf-003-document-update.md`, so the governance-owned doc is the single source of truth and the skill reads it via its `references/` mechanism. The brief does not currently address this; it is a real detail.

### 4.7 Claude Code sub-agents vs skill scripts — when is each appropriate?

**The taxonomy.**

- **Skill scripts (`.claude/skills/document-cm/scripts/*.py`)** are deterministic Python. The LLM does not enter the script's runtime. Use when the operation is defined, the inputs are structured, and the output is structured.
- **Claude Code sub-agents (`.claude/agents/*.md`)** are LLM invocations with their own system prompt, allowed-tools, and a fresh context window. The parent agent passes a prompt; the sub-agent reasons and returns a result. Use when the operation requires reasoning the parent shouldn't do in its own context.

**Decision matrix for WF-003 steps.**

| Step | Operation | Script or sub-agent? | Rationale |
|---|---|---|---|
| 1. Read manifest entry | Structured YAML read | Script (`manifest.py read`) | Deterministic parsing, no reasoning. |
| 2. Extract baseline | Structural analysis (sections, terms, cross-refs, word counts) | **Borderline — currently script.** | Deterministic extraction is the brief's choice. An alternative is a sub-agent that reads the doc and returns a structured baseline. Script wins on reproducibility. |
| 3. Build change map | Reason over the proposed update against baseline | **Sub-agent candidate.** | Currently `book_boss.py build-change-map` — but "build a change map from sources" genuinely requires reasoning. The script is likely invoking Claude internally anyway. Making this an explicit sub-agent with a clean context isolates the reasoning and produces a better audit trail. |
| 4. GATE | Present change map, STOP | No script, no sub-agent — this is the human-in-the-loop boundary | The gate is an instruction to the parent session, not a delegated operation. |
| 5. Write updated doc | Reason + write | Main agent (parent Claude) | This is the core content generation; it belongs in the parent context because the user is watching, approving, potentially editing inline. |
| 6. Verify baseline preservation | Structural diff | Script (`book_boss.py verify`) | Deterministic; matches the evaluator-optimizer's "evaluator must not be the generator" property. |
| 7. Record | Update manifest + scorekeeper | Script (`manifest.py record`) | Deterministic. |
| 8. Create git tag | `git tag` | Script (or direct Bash) | Deterministic. |
| 9. Session report | Compose narrative | **Sub-agent candidate.** | Currently `reporter.py session-report` — but composing a narrative from structured state is LLM work. A sub-agent with a tight prompt ("generate the session report from this structured input") isolates the reasoning and the context. |

**The rule of thumb.** Scripts for deterministic work with structured in/out. Sub-agents for reasoning that has a clean input, produces a clean output, and should not pollute the parent's context. The parent agent does the content-generation work where the user's collaboration is load-bearing.

**What this changes in the brief.** Two specific points:

- Step 3 (build change map) is a sub-agent candidate. The brief treats it as a script; the script is likely calling Claude internally. Making the LLM call an explicit sub-agent clarifies the architecture and enables the sub-agent to have its own allowed-tools (read-only for sources, write-only to `.cm/scratch/`).
- Step 9 (session report) is similarly a sub-agent candidate. Deterministic scripts don't write narrative well; they concatenate fields.

### 4.8 For deterministic execution, reliability delta between XML-tagged prose vs canonical prompt chaining with API calls + programmatic validators — what does Anthropic publish?

**What Anthropic publishes.** Nothing I located directly compares monolithic XML-tagged markdown workflows to canonical prompt-chaining at the reliability level. The closest statements:

- "Building Effective Agents" (2024-12): programmatic checks between steps are presented as the reliability mechanism for prompt chaining. Implication: without them, reliability is lower.
- "Effective Context Engineering" (2025-09): context rot is empirical across models; recall degrades with context length. Implication: long monolithic files are vulnerable.
- "Writing Tools for Agents" (2025-09): evals are the forcing function. Implication: reliability is measured via evals, not declared.
- "Effective Harnesses for Long-Running Agents" (2025-11) and "Harness Design" (2026-03): checkpoint between steps. Implication: between-step state should be durable, not in-context.

**What Anthropic does not publish, to my knowledge.** Numerical comparisons (e.g., "monolithic workflows skip governance steps 8% of the time at 4K+ context, canonical chained skip 0.2%"). If Anthropic has run such experiments, they are not in the posts surveyed.

**What we can infer.** The CC-017 failure mode is exactly the kind of drift the 2024-12 post's "programmatic checks" recommendation targets. The brief's compensating design (skill composition) reduces but does not eliminate the risk — because skill composition is itself instructed via SKILL.md prose, not enforced by API structure.

**The honest answer to Eric.** There is no published reliability delta. What we have is published guidance that points toward canonical chained being more reliable, plus the lived experience of CC-017 in the Concept suite. The calibration is: **monolithic is good enough for solo+AI; canonical is the architecture to grow into when a failure mode bites.**

**What to measure if we want empirical grounding.** When the evals harness (§5.a recommendation 4) is live, the experiment is straightforward: build two versions of WF-003, one monolithic (current brief) and one canonical chained (explicit API boundaries between steps). Run both against the same 10 fixture scenarios. Measure: (a) governance-step skip rate, (b) gate-compliance rate, (c) verify-failure detection rate, (d) total tokens consumed, (e) end-to-end latency. If the monolithic variant matches canonical on skip/gate/detection metrics at materially lower token and latency cost, the justification is empirical, not theoretical. If it doesn't, we have data for the migration decision. This is the "do the simplest thing that works, then measure" posture from the Sep 2025 context-engineering post.

**One more inferred consideration.** The Nov 2025 harness-design post frames long-running agents as systems that accumulate risk over time. Our WF-003 is short — 9 steps, typically a single session. Reliability concerns that dominate in 100-step harnesses (state corruption, context rot, drift) are less acute here. The monolithic variant's weaknesses scale with step count and session length; at our scale, they are latent rather than active.

### 4.9 What newer patterns (2025-2026) have emerged — memory tool beta, sub-agent handoffs, skill composition, hook-based enforcement?

**Memory tool.** Anthropic's file-backed memory tool is in public beta on the Developer Platform (referenced in `best-practices-review.md` Source 4). It materializes the structured-note-taking technique as a first-class platform primitive: a Tool that reads/writes a persistent memory store outside the context window. The `document-cm` skill's `.cm/scorekeeper.json` and `.cm/notekeeper.json` are manual implementations of the same pattern. If Eric ever wants a broader cross-project memory (architectural decisions that span Lifting Tracker and Concept and future sub-systems), the memory tool is the right substrate. MVP-scope: not needed.

**Sub-agent handoffs.** The Mar 2026 "Scaling Managed Agents: Decoupling the Brain from the Hands" post extends brain-hands separation to multi-agent harnesses, where different agents (with different allowed-tools, different models, different context budgets) hand off structured state. The Claude Code sub-agent primitive (`.claude/agents/*.md`) is the single-process implementation. For `document-cm`, the relevant application is §4.7 above: promote "build change map" and "session report" steps to sub-agents.

**Skill composition.** Less progress than might have been expected. Anthropic's Oct 2025 skill post uses "composable" at the capability level but does not publish a formal skill-invokes-skill mechanism. In practice, a SKILL.md can invoke bash scripts that happen to be other skills, but the composition is implicit. G25 in the validated review names this gap: our convention (`document-cm` owns manifest writes; other skills request updates via `document-cm`) is a locally-authored serialization rule, not a framework primitive.

**Hook-based enforcement.** Claude Code hooks (PreToolUse, PostToolUse, Stop, SessionStart) materialize deterministic lifecycle gating. The Oct 2025 "Beyond Permission Prompts" post and the Mar 2026 "Claude Code Auto Mode" post extend this by introducing classifier-gated permission prompts and sandboxed execution. For `document-cm`, hooks are named as adoption targets (source-doc-cm-design.md §5.4). The specific opportunity: the GATE step can be enforced as a PreToolUse hook on `Edit/Write to docs/` — making the "human approval" step tool-level rather than instruction-level. This is the single highest-impact hook-based upgrade available.

**Auto mode.** Mar 2026 "Claude Code Auto Mode" introduces classifier-gated skip-permissions — routine reads and safe edits proceed without prompts; risky operations still prompt. For `document-cm`, auto mode is the operational mode that makes the skill usable at pace: the GATE at Step 4 is explicit human approval (never auto-approved); everything else can auto-approve.

**Evals in production.** Mar 2026 "Eval Awareness" and "Infrastructure Noise" posts shift evals from synthetic benchmark thinking toward production-traffic sampling with statistical variance analysis. For `document-cm`, the validated review's G24 eval harness should be designed with this awareness: include non-synthetic fixtures (real past doc updates), run N times, track variance.

**Code execution with MCP (Nov 2025).** The "Code Execution with MCP" post extends the tool-composition story by letting agents run small amounts of deterministic code as first-class tools. For `document-cm`, this is validation of the current direction: the skill's Python scripts (`book_boss.py`, `manifest.py`, etc.) are the MCP-style code-execution surface, invoked via Bash. The Nov 2025 post suggests this is an increasingly common pattern, not a bespoke one.

**Advanced tool use (Nov 2025).** The "Introducing Advanced Tool Use on the Claude Developer Platform" post adds features like parallel tool calls, structured outputs, and tool-result caching. None of these are critical for MVP `document-cm`. Worth knowing about for the coaching-session v2+ workflow where parallel evidence gathering could speed up a summary.

**Closing note.** The 2025–2026 arc is clear: patterns introduced in Dec 2024 (workflows, evaluator-optimizer, orchestrator-workers) survive as the foundation. The 2025 posts add context engineering, tool design discipline, and the SKILL.md open standard. The 2026 posts add harness design for long-running work and evaluation maturity. Our approach sits comfortably in the 2024–2025 foundation and is well-positioned to adopt the 2026 harness and evaluation additions as the skill matures.

### 4.10 Where does our current approach ALIGN with Anthropic best practice, where does it DEVIATE, and where does the deviation matter?

**Strong alignment.**

- Brain-hands separation at the skill layer — SKILL.md is reasoning, scripts are execution. Published best practice (Mar 2026 and earlier).
- Orchestrator-workers shape — Claude + SKILL.md + deterministic scripts.
- Evaluator-optimizer in Book Boss verify — generator/evaluator separation, structural check, loop-back on failure.
- Structured note-taking — `.cm/scratch/*`, `.cm/scorekeeper.json`, `reports/session_*.md`.
- Tool consolidation — `cm update <doc>` is one consolidated operation, not a kit of five lower-level ones.
- Namespacing — `cm.*` command family.
- SKILL.md triggering via `name` + `description` — aligned with the three-level progressive disclosure model.
- Poka-yoke error-design intent — `cm validate` "fails loudly with specific field names" per the brief's §9.4.

**Deviations that are justified.**

- Monolithic wf_*.md over canonical chained prompt chaining — justified at solo+AI scale; the failure mode (CC-017) is compensated by skill composition; the cost of canonical chaining (orchestrator scripts, N API calls, structured state management) is not yet justified by the failure rate.
- Reading the whole SKILL.md as the workflow rather than spawning sub-agents per step — justified because the user is in the loop at the GATE and most steps are short.
- Deterministic scripts over sub-agents for most operations — justified because deterministic operations are cheaper to run and reproducibility matters more than flexibility.
- No formal skill-invokes-skill composition framework — justified because the convention ("`document-cm` owns manifest writes") is cheaper and Anthropic has not published a framework primitive anyway.

**Deviations that matter and should be reconsidered.**

- *The GATE as XML instruction rather than tool-level enforcement.* An XML tag reading `<gate type="HUMAN_APPROVAL">` is stronger than nothing, but it is not tamper-proof. A PreToolUse hook that refuses `Edit` / `Write` on `docs/` until a specific approval artifact exists in `.cm/scratch/` is closer to canonical prompt-chaining reliability. This is the single highest-impact change available.
- *No eval harness despite committing to evals-as-forcing-function.* The brief's §1.4 names the principle; §9 doesn't implement it. G24 in the validated review is explicit: must-fix, ~1 day of work. Without evals, "did the skill work correctly?" has no answer.
- *Full wf_*.md loaded into context.* At current scale this doesn't bite; at v2+ scale with coaching sessions running alongside it will. The remediation (externalize to `references/`) is cheap today, expensive when context pressure forces it later.
- *Build-change-map and session-report steps as scripts rather than sub-agents.* The scripts are likely calling Claude internally anyway; making the call an explicit sub-agent clarifies the architecture and enables scoped allowed-tools.

### 4.10.1 Concrete action summary (consolidated)

Pulling §4's deviation findings forward into a ranked action list:

| # | Action | Why (pattern source) | Cost | When |
|---|---|---|---|---|
| 1 | Build evals harness | Anthropic Sep 2025 + Jan 2026 | ~1 day | Before skill goes live |
| 2 | GATE as PreToolUse hook | Dec 2024 (programmatic checks between steps) | ~half-day | Before skill goes live |
| 3 | Externalize wf_*.md body to `references/` | Sep 2025 (JIT retrieval, progressive disclosure) | ~30 min | Before skill goes live |
| 4 | Change-map + session-report as sub-agents | Sep 2025 (sub-agent architectures) | ~1 day | First skill iteration |
| 5 | Annotate manifest workflow `pattern` field | Dec 2024 (pattern vocabulary) | ~5 min | Any time |
| 6 | Per-step token-budget check | Nov 2025 + Mar 2026 (harness design) | Trivial once live | When telemetry exists |
| 7 | `response_format` enum on `cm` commands | Sep 2025 (Writing Tools) | Incremental | When a second skill consumes `cm` output |
| 8 | Memory tool for cross-project state | Sep 2025 + beta | Design-only today | When a second sub-system exists |

### 4.11 Closing synthesis

The pattern-by-pattern view in §3 and the question-by-question view in §4 converge on a consistent diagnosis: the `document-cm` skill is on the right trajectory, with a handful of specific deviations that are either a) justified by scale or b) remediable at low cost. Two deviations are load-bearing:

- **The GATE.** Moving from XML-instruction to tool-level hook enforcement is the single architectural upgrade that takes our approach from "aligned with Anthropic's published direction" to "enforces Anthropic's published direction." The cost is tiny; the reliability delta is real.
- **The evals.** Committing to evals as forcing function without implementing them is a self-contradiction the validated review (G24) and this review both flag. This is ~1 day of work that makes everything else measurable.

Everything else in §5.a is either cheap (minutes to hours) or not urgent at MVP scale.

---

## §5 Recommendations

### 5.a Patterns we should adopt

1. **Externalize the detailed workflow body from SKILL.md into `references/wf-003.md`.** The brief's §9.4 currently inlines the 9 numbered steps in SKILL.md. Move those into a referenced file. SKILL.md shrinks to ~40 lines. Matches Anthropic's three-level progressive disclosure. Rationale: §4.5 and §4.6. **Cost:** 30 minutes, no external deps.

2. **Convert the GATE from XML instruction to PreToolUse hook enforcement.** Add a hook that blocks `Edit`/`Write` tool calls on `docs/*.md` unless a `.cm/scratch/<doc-id>-approved.flag` file exists, written by an explicit `cm approve` command the human runs after reviewing the change map. The XML `<gate>` tag can stay in the reference file for narrative clarity; the hook is what actually enforces. Rationale: §4.1, §4.2, §4.10. **Cost:** one hook file, one approve command, ~half-day.

3. **Promote "build change map" and "session report" to Claude Code sub-agents.** `.claude/agents/cm-change-mapper.md` and `.claude/agents/cm-reporter.md` with scoped allowed-tools (read-only source docs + write-only `.cm/scratch/` for the change mapper; read scorekeeper + write `reports/` for the reporter). Rationale: §4.7. **Cost:** two agent files, minor script refactor, ~1 day.

4. **Build the eval harness (G24).** `skills/document-cm/evals/` with 5–10 fixture scenarios (ADR add, semver bump, baseline freeze, manifest update, skill registration, cross-reference repair, frontmatter-only edit, content-loss negative case, missing-dependency negative case, corrupt-baseline negative case). Golden outputs in JSON. Runner `cm eval --regression`. Rationale: §4.8, §4.10; validated review G24. **Cost:** ~1 day for the harness, ~half-day per fixture.

5. **Annotate the workflow's `pattern` field more precisely in the manifest.** Change `pattern: chain-with-gate` to `pattern: chain-with-gate + evaluator-optimizer-verify`. Rationale: §4.3. **Cost:** 5 minutes.

6. **Adopt `response_format` enum convention for `cm` commands that produce output for agents.** `cm status --format=concise` vs `cm status --format=detailed`. Only needed where multiple agents will consume the output (i.e., when `document-cm` starts being called from other skills). **Cost:** incremental as new commands are added.

7. **Add per-step token-budget awareness to the verification criteria.** Not a hard budget enforcement, but a check: if any single step's Claude call exceeds 8K input tokens, flag it as a harness-design concern. This is the Nov 2025 / Mar 2026 harness-design guidance applied defensively. **Cost:** trivial measurement pass once the skill is live.

8. **Plan memory-tool adoption for v2+ cross-project state.** When Concept and Lifting Tracker share architectural decisions (xrsize4all-concept.md graduates to its own repo, per Q1 in source-doc-cm-design.md §10), the memory tool becomes the right substrate for cross-project recall. Not MVP. **Cost:** design-only today; implementation when triggered.

### 5.b Deviations that are justified

1. **Monolithic-file prompt chaining at current scale.** The authoring and versioning simplicity is real. The failure mode (CC-017) is compensated by skill composition. Reconsider if the failure mode reappears at v2+.

2. **Deterministic scripts for most steps rather than sub-agents for all steps.** Reproducibility matters more than flexibility in governance workflows. The two sub-agent candidates (§5.a recommendation 3) are exceptions, not a new default.

3. **No formal skill-invokes-skill composition framework.** Convention ("`document-cm` owns manifest writes") is cheaper than infrastructure. Revisit if a second skill needs to modify the manifest without going through `document-cm`.

4. **Full SKILL.md body loaded every time the skill is invoked.** The SKILL.md is short; pre-loading it costs far less than building a mechanism to load it lazily. The `references/` files are where lazy loading matters.

5. **Single GATE at Step 4.** Anthropic's harness-design posts suggest multiple checkpoints. For our 9-step workflow, one human gate is calibrated correctly; additional gates would add ceremony without value. The per-step token-budget check (§5.a recommendation 7) is adequate for non-human between-step oversight.

### 5.c Deviations we should reconsider

1. **GATE as XML instruction rather than tool-level hook enforcement** — see §5.a recommendation 2 for the proposed change.

2. **No eval harness despite committing to evals-as-forcing-function** — see §5.a recommendation 4 for the proposed change. This is the single most load-bearing reconsideration; everything else in this review is either smaller (terminology) or adjacent (sub-agent promotion). Without evals, the skill cannot be verified.

3. **Full wf_*.md loaded into context on every invocation** — see §5.a recommendation 1 for the proposed change. Low cost today, prevents a predictable future failure.

4. **"Build change map" and "session report" steps as scripts rather than sub-agents** — see §5.a recommendation 3 for the proposed change.

5. **Redundant manifest paths for workflow documentation** — the brief has `docs/workflows/wf-003-document-update.md` (governance-owned) and the implied `.claude/skills/document-cm/references/wf-003.md` (skill-internal). Propose: skill references the governance doc via symlink or build-time copy, not a duplicate source file. See §4.6 closing paragraph. **Cost:** a one-line manifest addition specifying the reference relationship.

### 5.c.1 Cross-project implications

The ten recommendations in §5.a all apply to the `document-cm` skill as designed for Lifting Tracker. Four of them (2, 3, 4, 7) would apply identically to Concept Computing when its migration happens (per source-doc-cm-design.md §10 Q4 Option C — build in Lifting Tracker first, then port). The two recommendations that are Lifting Tracker-specific (1 workflow externalization, 5 manifest annotation) are trivially portable.

One recommendation that is *new* at the cross-project level: when the skill ships and runs in both repos, the memory tool becomes a real option for cross-project architectural decisions that span both (the `xrsize4all_concept_v0.2.0.md` graduation trigger in Q1 of the brief). The Sep 2025 context-engineering post and the memory-tool beta are the substrate for that. No action required today; flag for the quarter-boundary review.

### 5.d Priority ordering

Combining recommendations with the validated-review's must-fix list (G7 rollback policy, G11 secret scanning, G24 evals), the near-term priority becomes:

1. Eval harness (G24 + §5.a #4) — must-fix, ~1 day.
2. GATE hook enforcement (§5.a #2) — high leverage, ~half-day.
3. Externalize wf_*.md into references/ (§5.a #1) — cheap, ~30 min.
4. Promote change-map and session-report to sub-agents (§5.a #3) — medium, ~1 day.
5. Secret scanning + signed commits (G11 + G12) — asymmetric risk, ~1–2 hours combined.
6. Rollback policy documentation (G7) — ~15 min.
7. Per-step token-budget check (§5.a #7) — ongoing once live.
8. Minor: manifest `pattern` field annotation, `response_format` enum as needed.

Total near-term budget: ~3 focused days of work before the `document-cm` skill can be considered ready to run against live Lifting Tracker docs.

---

## §6 Open Questions for Eric

1. **Does the XML-tagged-markdown variant bear the governance-erosion risk (CC-017) it has already demonstrated in Concept?** The brief's compensation is skill composition; this review argues the PreToolUse hook is a stronger compensation. You should decide whether the hook-based gate replaces the XML gate or layers on top of it. Recommendation: layer — keep the XML gate for narrative clarity, add the hook for actual enforcement.

2. **Are you willing to promote `cm build-change-map` and `cm session-report` to Claude Code sub-agents, or do you prefer the script-purity of the current §6.1 layout?** The trade-off is architectural clarity (sub-agents clearly delineate LLM reasoning) vs the brief's §6.2 principle ("No LLM prompt templates encoded in Python"). Sub-agents satisfy §6.2 — the prompt lives in `.claude/agents/cm-change-mapper.md`, not in Python. But they also expand the surface of what the skill's layout contains.

3. **Should wf_*.md live under `docs/workflows/` (governance-owned, in `source-doc-cm-design.md` §9.1 layout) or under `.claude/skills/document-cm/references/` (skill-internal)?** The review recommends governance-owned with a symlink into `references/`. This keeps the single source of truth in `docs/` and still makes the workflow discoverable to Claude via the skill's three-level progressive disclosure. Decision needed because the brief currently implies both locations and doesn't resolve the duplication.

4. **At what trigger do we migrate from monolithic-file prompt chaining to canonical chained (explicit API calls with programmatic checks)?** This review does not name a specific trigger. Candidate triggers: (a) WF-003 grows past ~12 steps; (b) observed governance-skip rate exceeds a threshold (requires telemetry the skill doesn't yet have); (c) a second workflow (WF-004 reconcile) grows complex enough to warrant a shared orchestrator. Decision helpful because it sets the v2 architectural direction.

5. **Do you want the eval harness inside the `document-cm` skill package (portable with the skill) or in a sibling `docs/reference/cm-evals/` location (governance-owned, skill references it)?** Trade-off mirrors Q3: portability vs governance ownership. Recommendation: inside the skill, with the governance-owned manifest entry pointing at it.

6. **Is the Mar 2026 "managed agents" pattern (decoupling brain from hands across sub-agents) relevant at solo+AI scale?** The architectural literature says yes in principle. The lived reality is that one-author work rarely benefits from multi-agent brain-hands separation because the author *is* the orchestrator. Worth revisiting if and when the coaching-session workflow ships (v2+), where an AI-drafted summary + human review + structured write is genuinely a multi-agent handoff.

---

## §7 Access Limitations

### 7.1 Mounts not obtained

- `~/Concept/` — filesystem mount request was not available in this session. Per the task prompt's mount-handling instructions, I did not retry and proceeded from the synthesized content in `docs/reference/source-doc-cm-design.md` and `docs/reference/best-practices-review.md`. Specifically, the XML-tagged-markdown structure described in the task prompt (`<workflow>`, `<phase>`, `<step>`, `<gate>`, `<action>`, `<execute>` tags with `number`, `agent`, `mandatory`, `type` attributes) is taken as given; I have not verified it against the source `wf_*.md` files. The CM brief's §5.5 flow and §6 refactor plan are the primary sources for what WF-003 is expected to do after skill migration.

### 7.2 Web sources not fully retrievable

- **docs.claude.com Agent Skills page** (https://docs.claude.com/en/docs/agents-and-tools/agent-skills) — repeated redirect-cancelled errors across multiple URL paths. Substituted the authoritative engineering announcement (Oct 16, 2025, with Dec 18, 2025 "open standard" update) at https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills. SKILL.md frontmatter fields beyond `name` and `description` (e.g., `allowed-tools`, `version`) are not confirmed from primary source; they are inferred from the CM brief's own usage and from Claude Code plugin docs.
- **Full prose of "Building Effective Agents" and "Effective Context Engineering"** — HTML envelopes fetched but single-line format prevented full text extraction via Read/Grep. Phrase-confirmed claims are quoted; other claims paraphrase the `best-practices-review.md` synthesis from April 2026 (~one day prior to this review).
- **Individual posts in §1.1 table tagged "Indexed"** — I located them on the `anthropic.com/engineering` index page but did not fetch full content for each. Their inclusion is based on title + published date + index-level summary. Where one of them is load-bearing for a specific claim (e.g., "Scaling Managed Agents" for §4.9 brain-hands extension), I flagged the claim as inferred from title + adjacent guidance rather than direct quote.

### 7.3 Deferred work

- Verifying the Concept `wf_document_update.md` against the brief's §5.5 9-step consolidation would require `~/Concept/` mount access. The 9-step brief version is assumed faithful to the intent of the 15-step original.
- Full text of three individually-load-bearing posts ("Effective Harnesses for Long-Running Agents" Nov 2025, "Harness Design for Long-Running Application Development" Mar 2026, "Scaling Managed Agents" Mar 2026) would strengthen §4.9 and §5.a recommendation 7. The claims made from them in this review are conservative and survive even if the full prose differs in detail.
- Anthropic's "Demystifying Evals for AI Agents" (Jan 2026) and "Eval Awareness" (Mar 2026) would strengthen §5.a recommendation 4 and G24's eval-harness design. The claims made here are conservative.

### 7.4 What would change if these limitations were lifted

- If Concept's actual `wf_document_update.md` showed a materially different XML structure than the task prompt's summary, §4.1 / §4.2 would need re-verification.
- If Anthropic's docs.claude.com Agent Skills page enumerates additional required or conventional SKILL.md frontmatter fields beyond `name` + `description`, the brief's SKILL.md examples should be conformed to that list.
- If Anthropic's harness-design posts publish an opinion on monolithic vs chained prompt chaining reliability, §4.8's "no published delta" would update.

None of these would reverse this review's core findings. All would add precision at the margin.

---

## Sources

Primary:

- Anthropic — [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) (Schluntz & Zhang, Dec 19, 2024).
- Anthropic — [Writing (Effective) Tools for Agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (Sep 11, 2025).
- Anthropic — [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Sep 29, 2025).
- Anthropic — [Equipping Agents for the Real World with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (Oct 16, 2025; "open standard" update Dec 18, 2025).
- Anthropic — [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) (current).
- Anthropic — [engineering index](https://www.anthropic.com/engineering) (posts listed in §1.1 table, spanning Oct 2025 – Apr 2026).
- Anthropic — [Claude Mythos Preview](https://red.anthropic.com/2026/mythos-preview/) and [Project Glasswing](https://www.anthropic.com/project/glasswing) (Apr 7, 2026).

Project documents cross-referenced:

- `docs/reference/best-practices-review.md` (2026-04-21) — prior synthesis of Anthropic patterns against D1–D24.
- `docs/reference/agentic-ai-bible-findings.md` (2026-04-22) — book findings, including the "no new patterns" judgment vs Anthropic's engineering corpus.
- `docs/reference/source-doc-cm-design.md` v0.1 (2026-04-22) — CM design brief; §1.4 is the agentic-AI-dev alignment frame; §5.5 is the `cm update` flow; §6.1 is the skill file layout.
- `docs/reference/source-doc-cm-design-validated-review.md` (2026-04-22) — 26 gaps + 3 newly identified; G24 evals harness and G25 multi-skill coordination are most relevant to this review.
- `docs/architecture_v0.4.0.md` D1–D24 (MASTER, v1.2.0) — especially D19 Reasoner Duality and the Authority Rule.

Related standards and primitives cited in passing:

- Anthropic Agent Skills specification (Dec 2025 open-standard release; also adopted by OpenAI Codex CLI, Cursor, Gemini CLI, Antigravity IDE).
- Model Context Protocol (MCP) specification.
- Claude Code hooks, sub-agents, and auto-mode mechanisms (docs.claude.com / code.claude.com as primary).

---

© 2026 Eric Riutort. All rights reserved.
