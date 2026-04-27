---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
title: Workato — Architectural Findings
status: draft
---

# Workato — Architectural Findings

*Research target: Workato (workato.com). Purpose: extract architectural patterns relevant to Concept Computing, document-cm v0.3.0, the Concept-agent → Claude Skill refactor, D19 Reasoner Duality, MCP strategy, and XRSize4 ALL cross-cutting services. Not a vendor evaluation. Sources: Workato docs (docs.workato.com), Workato engineering/product blog (workato.com/the-connector, /product-hub), academy, Contrary Research, PitchBook, TechCrunch, InfoQ-adjacent third-party coverage. Some Workato docs are client-rendered SPAs; substance was confirmed via targeted search snippets rather than raw fetch.*

---

## 1. Executive summary

- Workato's object model is **flat and composable**: recipe, connector, connection, project, environment, callable recipe (now "recipe function"), lookup table. No monolithic workflow concept. The parallel for Concept Computing is clean — WF-001…006 map to "recipe functions," Concept agents map to "genies," and shared data stores map to "lookup tables / data tables." Worth stealing: the flatness, not the nomenclature.
- Workato's **Agent Studio / genie** architecture is an explicit orchestrator-worker pattern with a hard rule: deterministic work lives in recipes, judgment work lives in genies. That is D19 Reasoner Duality, verbatim, shipped by a $5.7B (now ~$1.7B secondary) vendor. Strong external validation of Eric's Tier 1/Tier 2 separation.
- Workato ships **business approvals as a first-class primitive** — a skill recipe creates an approval request, assigns a task, and blocks until approve/reject/expire. This is WF-003's GATE pattern with more enterprise plumbing (task expiry, assignee routing, chat-native UI). Eric's 15-step + human GATE design is directionally right; the operational details around timeout, re-assignment, and audit are where Workato has more depth.
- **Workato Enterprise MCP** launched October 2025 with 100+ planned pre-built MCP servers, OAuth2 user authorization, and rate-limiting. This is an iPaaS vendor eating MCP as a delivery channel — validates Eric's MCP-as-contract bet but also signals that the "100 connectors to legacy SaaS" moat is being reframed as "100 MCP servers to legacy SaaS." For XRSize4 ALL, the relevant pattern is: **every sub-system should expose an MCP server, not just a REST API.**
- Workato's **recipe lifecycle management (RLCM)** is a three-environment (dev → test → prod) asset-promotion model with version history, restore-to-version, and optional external git as a snapshot store. It is explicitly not git-native — the platform is the system of record and git is a mirror. This is a meaningful divergence from Eric's document-cm posture; worth interrogating whether "platform as SoR" trades off correctly for a solo + AI build.
- Workato's custom connector SDK is **Ruby DSL with an official gem + CLI + RSpec harness**. Connector = curly-brace root with `connection`, `test`, `actions`, `triggers`, `object_definitions`, `methods`. That is tighter than MCP's tool-list schema and much looser than OpenAPI. For code-cm (future sibling), the takeaway: contract-first authoring with a runnable local harness matters more than contract format.

## 2. Workato overview

**What it is.** Enterprise iPaaS (integration platform as a service) with a business-user-first recipe authoring model, 1,200+ pre-built SaaS connectors, and a 2024–2025 pivot into agentic automation (Agent Studio, genies, Enterprise MCP). Positions itself as the automation/orchestration fabric spanning app-to-app integration, API management, workflow automation, and now AI agents.

**Target customer.** Mid-market and enterprise IT/operations teams. Annual contract values typically $25K–$500K+, with small deployments at ~$30–80K and enterprise at $150–400K. Pricing is task-based (starting at 1M tasks) plus a workspace fee. Editions: Standard, Business, Enterprise, and Workato One (adds agentic). The "citizen integrator" / business-technologist persona is the explicit target, not pure software engineers.

**Maturity signal.** Founded 2013, Mountain View. Founders Vijay Tella (CEO), Gautham Viswanathan, Harish Shetty. Series E in Nov 2021 at $5.7B valuation on $200M raise. Reported $150M revenue, ~11,000 customers, ~1,290 employees. Secondary-market valuation reportedly dropped toward ~$1.7B by mid-2025. Still private. Reads as a mature-stage iPaaS re-anchoring its narrative around agents + MCP to defend against Zapier/Make (SMB pressure), Boomi/Mulesoft (enterprise), and the vibe-coded n8n/LangGraph wave.

---

## 3. Object model

Precise relationships inferred from docs:

- **Connector** — code (Ruby DSL or prebuilt) that defines a typed contract with an external system. Declares: `connection` schema, `test` (credentials probe), one or more `actions`, one or more `triggers`, `object_definitions` (reusable schemas), `methods` (private helpers). Prebuilt connectors exist for ~1,200 SaaS apps; custom connectors extend the pool. A connector is a **class**; a connection is an **instance**.
- **Connection** — an authenticated instance of a connector. Token/OAuth creds live here, not in the recipe. Connections are reused across recipes.
- **Trigger** — the entry point of a recipe. Four delivery models: polling, real-time (webhook), scheduled, change-data-capture. Triggers maintain in-sequence delivery and dedupe processed-job records (idempotency at the trigger layer, not the step layer).
- **Action** — a step inside a recipe. Can be an app action (via a connector), a control-flow primitive (if, repeat-for-each, handle-errors), a call to a recipe function, a long-action (async, minutes-to-hours), or a genie invocation.
- **Recipe** — trigger + ordered action tree. Unit of execution. Versioned on every save; previous versions restorable.
- **Recipe function** (supersedes callable recipe) — a recipe with a declared input schema and response schema, invoked from other recipes. This is subroutine-with-typed-contract. Parent composition primitive.
- **Project** — container of recipes, connections, lookup tables, and other assets. Unit of deployment/promotion.
- **Folder** — filesystem-style hierarchy inside a project.
- **Environment** — dev / test / prod isolation within a workspace. Projects promote from dev → test → prod. Production cannot be edited directly; all changes originate in dev and deploy forward.
- **Lookup table / data table** — structured key-value or row-based state store scoped to the workspace. Used for reference data and as the persistence layer for things like approval requests.
- **Workspace** — the tenant. Contains environments, members, roles, assets.
- **Agent Studio / genie** — a separately modeled entity that sits alongside recipes. A genie is (job_description + AI_model + knowledge_base + skills + chat_interface). Skills can wrap recipes, MCP servers, or app actions. Genies are invoked from recipes via an `Assign task to genie` action; recipes are invoked from genies via skills.
- **MCP server** — a published bundle of tools/skills generated from project assets (API recipe collections, connector actions, recipe functions). Registered in an MCP server registry. Consumed by external agents (Claude, ChatGPT, Cursor) over MCP.

Relationships worth marking: connector→connection is 1:N; project→recipe is 1:N; recipe→recipe-function is N:N via action invocation; genie→skill is 1:N; skill→recipe is typically 1:1 (skill recipe) but can wrap MCP or callable assets; MCP-server→tool is 1:N; tool→recipe/action is 1:1.

---

## 4. Findings by research question

### Q1. What is Workato?

Positioning: "orchestration platform" covering iPaaS + workflow + API management + agentic automation. Target: mid-market / enterprise IT and ops. Pricing opaque, workspace + task-package model. Four editions, with Workato One the agentic-inclusive top tier.

**Implication for Eric.** [NEUTRAL — positioning] Reinforces that packaging "deterministic workflow + agent layer + MCP" as one thing is a market-validated product shape. For XRSize4 ALL, this is the same packaging instinct: Concept Computing (workflows) + Concept agents (soon Skills) + MCP endpoints, sold internally as one platform.

### Q2. Core abstractions

Covered in section 3. Key observation: **no monolithic "workflow" concept**. The graph is recipe-as-leaf, recipe-function-as-subroutine, project-as-module, environment-as-stage. Composition is explicit, not emergent.

**Implication.** [ALIGNED — Concept Computing workflow design] WF-001 through WF-006 should remain flat recipes that can call each other via typed contracts. Resist the temptation to model a super-workflow container. The promotion boundary is the project, not the workflow.

### Q3. Runtime / execution model

Four trigger delivery modes (polling, real-time, scheduled, CDC). Scheduler minimum interval 5 minutes. Long actions are a distinct class that runs minutes to hours. Stateful execution across the cloud-native runtime; state persists between steps. "Units of work" are self-contained and carry their triggering event. Triggers guarantee in-sequence delivery and job dedup.

Error handling: explicit `Handle errors` control block with configurable retry count, wait time, and conditional `Retry IF`. Audit-log streaming uses exponential backoff with a 7-day retention-then-fail cutoff. No native dead-letter queue documented; the idiomatic replacement is a combination of `Handle errors` + corrective step + manual rerun via job history.

**Implication.** [EXTENDS-US — engineering patterns / reliability baseline] For document-cm and code-cm, the equivalent of "units of work with event payload attached" is every WF step carrying its input doc state forward. The 7-day audit retention-then-fail policy is a forcing function worth importing: we should pick an explicit failure horizon rather than retry forever. The absence of a real DLQ is a Workato weakness, not a pattern to copy.

### Q4. Versioning, promotion, change management

Every recipe save produces a version. Versions are restorable. Environments are dev / test / prod inside one workspace. Projects (not individual recipes) are the unit of deployment. Deployment flows dev → test → prod; prod cannot be edited directly. Access to deploy is role-gated. External git integration is supported but positioned as snapshot/staging, not source-of-truth — Workato explicitly warns against editing recipes in git because it bypasses platform validation.

No native multi-step human approval workflow for promotion itself that I found — deployment is gated by RBAC, not by a GATE. The human-GATE pattern Workato does ship lives inside recipes, not in the promotion pipeline (see Q7).

**Implication.** [CONTRADICTS — document-cm / code-cm] Workato's "platform is system of record, git is a mirror" posture diverges from Eric's file-authoritative, git-native stance. Workato can afford platform-SoR because the platform is a business and has validation/edit-time linting. For a solo + AI build, git remains SoR — but importing Workato's "project is the promotion unit" and "environments are first-class" ideas is worth it. The missing piece in Workato that Eric already has: WF-003's 15-step human GATE applied to *promotion itself*. Workato gates promotion with RBAC only; Eric gates it with a workflow. That is EXTENDS-US.

### Q5. Observability and audit

Per-recipe job history with full input/output at every step, filterable and searchable. Workato Logging Service adds centralized log search across recipes including loop iterations (batch visibility). Activity audit logs cover user activity, recipe modifications, connection events; stored 1 year; streamable to external SIEM. Job history supports replay via `Rerun` from any failed job.

Lineage framing: "analyze the lifecycle of a record as it gets processed over time in multiple recipes and jobs." Lineage is constructed from the log stream, not declared.

**Implication.** [ALIGNED — governance / CM baseline] Confirms that per-step telemetry with replay is the right baseline. For Concept Computing, every WF step should emit a structured log event with input hash, output hash, and a workflow-run-id correlator. That gives us lineage-on-demand without building a lineage service. [EXTENDS-US — XRSize4 ALL logging cross-cutting service] 1-year audit retention with SIEM streaming is the enterprise default; XRSize4 ALL's logging service should offer at minimum the same.

### Q6. Reliability semantics

`Handle errors` block provides try/catch with retry-count + backoff + corrective-step. Retry IF supports conditional retries. Managed File Transfer auto-retries transient failures up to 10 attempts. Long actions carry state across minutes-to-hours. Triggers dedup jobs; per-step idempotency is the recipe author's job, not the runtime's. No published DLQ primitive; corrective steps + lookup-table-as-quarantine is the pattern.

**Implication.** [NEUTRAL] The reliability surface is a superset of what Concept Computing needs at v0.3.0. The interesting gap: Workato pushes idempotency responsibility onto the recipe author. That is a pragmatic call but means every connector and every recipe reinvents the wheel. For code-cm / document-cm, the better pattern is to make idempotency a *framework* property (content-addressed step outputs keyed on input hash), not a recipe-author property.

### Q7. AI agent product

**Current naming (verified for 2026):** Agent Studio is the product; genies are the agents. Workbot (Slack/Teams) is the legacy chatbot surface, still shipped but subordinate to genies. "Automation Copilot" refers to the AI recipe-authoring assistant that drafts recipes from natural language, not the runtime agent product. "IQ" is not current product naming I found.

A genie = (AI model + job description + knowledge base + skills + chat interface). Default model is Anthropic Claude; OpenAI GPT and BYO-LLM supported. Recommended models: Claude Sonnet 4.0, GPT 4.1.

**Recipe ↔ genie boundary.** Bidirectional. Recipes invoke genies via `Assign task to genie`. Genies invoke recipes via skills (a skill recipe is a recipe exposed to a genie with a declared input/output contract). Complex workflows must be decomposed into a recipe-orchestrated multi-genie topology — "recipes handle deterministic data retrieval and sequencing, while individual genies focus on specific inference tasks." That is D19 in Workato's own words.

**Human-in-the-loop.** Business approvals are a first-class primitive in Agent Studio. A skill recipe with a business approval creates an approval request row in a data table, assigns a task to a named approver via the chat interface, blocks until approve / reject / expire, and only then executes the consequential action. Approval request, approver, justification, and outcome are all recorded.

**Implication.** [ALIGNED — D19 Reasoner Duality; Concept agent refactor] This is D19 shipped as product. Two things follow:
1. Eric's Tier 1/Tier 2 framing is externally validated at enterprise scale. The phrasing "deterministic data retrieval and sequencing" vs "specific inference tasks" is close enough to Tier 1/Tier 2 that it is defensible in any architecture review.
2. When refactoring the 16 Concept agents to Claude Skills, the `(AI model + job description + knowledge base + skills + chat interface)` decomposition is a reasonable target shape. "Job description" maps to Skill description + system prompt; "knowledge base" maps to Skill-bundled reference docs; "skills" inside a genie map to sub-skills or tools the Skill can invoke.

[ALIGNED — WF-003 human GATE] Workato's business approvals validates the pattern: approval is a recipe step that creates a row, assigns a task, blocks on human response, and continues or aborts. Eric's WF-003 15-step design with human GATE should adopt the same three logged artifacts: request, assignment, resolution. Add: explicit expiry/timeout behavior, which Workato has and many homegrown GATEs don't.

### Q8. Agent design pattern

Published pattern is **orchestrator-worker**. The orchestrator is a recipe; workers are specialized genies. Stated rules:
- One genie per focused judgment task.
- Different genies in a workflow get different job descriptions (specialized prompts, not shared).
- Process items concurrently via parallel `Repeat for each` loops with genies, not sequential per-item calls.
- Keep the conversational front-end genie separate from backend processing genies.
- Deterministic steps stay in the recipe, not in a genie.

This is not evaluator-optimizer, not prompt-chain, not pure tool-using loop. It is: **deterministic orchestrator + specialized inference workers**, with the orchestrator owning state and sequencing.

**Implication.** [ALIGNED — Concept agent refactor] When the 16 Concept agents become Skills, the orchestration layer that calls them should be deterministic code (Concept Computing workflow engine), not another Skill. The Skill is the worker; the workflow is the orchestrator. Do not build an uber-Skill-of-Skills — that pattern is explicitly not what Workato ships.

### Q9. Extensibility — connector SDK vs MCP

**Custom connector SDK.** Ruby DSL distributed as `workato-connector-sdk` gem. Connector code is a Ruby hash with top-level keys: `connection`, `test`, `actions`, `triggers`, `object_definitions`, `methods`, `pick_lists`, `streams`. RSpec harness for unit tests. CLI for local run/test. As of March 2025, Workato removed Ruby whitelisting — full Ruby 2.7 stdlib + gems are available in the connector container.

**MCP contract model.** Each MCP server is a bundle of tools/skills. Each tool has input schema, output schema, description — consumable by any MCP client (Claude, ChatGPT, Cursor). Workato exposes two creation paths: prebuilt MCP servers for named apps (Slack, Jira, GitHub, etc.) and custom MCP servers built from project assets (API recipe collections, recipe functions, connector actions). Auth: OAuth2 user-authorization for per-user provenance; token-based also supported.

**Comparison — Workato connector SDK vs MCP:**

| Dimension | Workato Connector SDK | MCP |
|---|---|---|
| Language | Ruby DSL, hash-structured | Language-agnostic, JSON-schema contract |
| Coupling | Tight to Workato runtime | Loose; any MCP client |
| Test harness | Official gem + RSpec + CLI | SDK per language; ecosystem varies |
| Auth | Connection abstraction, platform-managed | OAuth2 per-user (Workato MCP); whatever the server implements (general MCP) |
| Scope per unit | One external system | One logical toolset (can span systems) |
| Discovery | Platform registry only | MCP server registry, can be public |

**Implication.** [EXTENDS-US — MCP integration strategy] Workato's bet is visible: wrap every connector as an MCP server and make the connector-platform into a tool-platform for external agents. For XRSize4 ALL, the equivalent move is: every sub-system (Lifting Tracker included) ships an MCP server as its outward contract, not just a REST API. The Ruby DSL is less interesting — but the local-CLI + test-harness pattern is. Code-cm should ship with a local harness that lets the author test a contract without round-tripping through the platform.

### Q10. Surprises

1. **Workato is not git-native and is explicit about it.** For a platform whose customers are IT teams, this is a bet that platform validation + per-save versioning beats git workflows. For a solo + AI build where AI writes most diffs, git IS the validator — the bet inverts.
2. **Business approvals are framed as part of recipe authoring, not as a separate workflow engine.** Anyone can add a GATE to any recipe. This democratizes human-in-the-loop rather than centralizing it. The equivalent posture in Concept Computing: any workflow step can be a GATE; WF-003's 15-step design is a convention, not a runtime privilege.
3. **Genies default to Anthropic Claude.** Workato explicitly recommends Claude Sonnet 4.0 and GPT 4.1 as the two known-good options. BYO-LLM is supported but not the recommended path. For XRSize4 ALL, validates Claude-first posture.
4. **Orchestrator-worker is Workato's only published multi-agent pattern.** No published material on evaluator-optimizer, reflection, or self-critique loops. Enterprise customers apparently prefer deterministic orchestration with bounded inference, and Workato designs to that.
5. **The connector SDK removed its Ruby whitelist in 2025.** Full Ruby 2.7 + gems inside customer connector containers. This is a notable security/sandbox decision — they traded container isolation for developer productivity. For code-cm, the analogue question: how much language freedom inside a Skill vs how much sandbox? Workato's answer is "a lot of freedom + container isolation."
6. **Agent Studio ships specific anti-patterns.** The docs explicitly warn against sequential per-item genie calls inside loops, against monolithic mega-genies, and against using genies for deterministic work. That prescriptive opinionation is a quality signal. Concept Computing should publish its own anti-patterns list (candidates: "do not let a Skill call itself," "do not embed a GATE inside a Skill," "do not skip the deterministic Tier 1").

---

## 5. Alignment map

| Eric's open problem | Workato's position | Tag | Action for us |
|---|---|---|---|
| Concept Computing workflow design (WF-001…006) | Flat recipes + typed recipe functions; project is promotion unit; no monolithic workflow concept | ALIGNED | Keep WF-001…006 as sibling recipes with typed I/O contracts between them. Project = Concept Computing as a whole. Don't invent an uber-workflow object. |
| WF-003 15-step human GATE | Business approvals are a first-class recipe primitive: request row → task assignment → block → approve/reject/expire | ALIGNED, EXTENDS-US | Adopt their three-artifact logging (request / assignment / resolution). Add explicit timeout + re-assignment behavior that WF-003 currently does not specify. |
| Concept agent refactor (16 agents → Claude Skills) | Genie = (AI model + job description + KB + skills + chat UI); orchestrator-worker only; one focused job per genie | ALIGNED | Each Skill = one focused job. Orchestration stays in deterministic code. Do not build Skills that invoke other Skills as a primary composition mode — let the workflow engine do that. |
| document-cm v0.3.0 revision | Platform is SoR; external git is snapshot mirror; per-save versioning; environment promotion | CONTRADICTS (on SoR) / ALIGNED (on promotion) | Keep git-SoR posture — solo build can't afford a platform. Import "project-as-promotion-unit" and "dev/test/prod environments" concepts explicitly into document-cm. |
| code-cm (future sibling) | Custom connector SDK = Ruby DSL + gem + CLI + RSpec; contract-first; per-file lint at platform | NEUTRAL / EXTENDS-US | Contract-first authoring with local harness is the right baseline. The specific DSL choice is not load-bearing; the runnable-locally property is. |
| D19 Reasoner Duality | Recipes = deterministic; genies = inference; enforced by Workato's own design guidance | ALIGNED | D19 is externally validated. In design reviews, cite Workato's orchestrator-worker + business-approvals pattern as precedent, not invention. |
| MCP integration strategy | Enterprise MCP product with 100+ prebuilt servers; OAuth2 per-user; custom servers from project assets | EXTENDS-US | Every XRSize4 ALL sub-system should expose an MCP server. Lifting Tracker should ship one before coach/admin UI. Treat MCP as primary outward contract; REST is secondary. |
| XRSize4 ALL cross-cutting services (logging, auth, analytics) | Activity audit log (1yr, SIEM-streamable); RBAC for deployment; workspace-level auth | NEUTRAL | Match the 1yr retention + SIEM streaming baseline in the logging service. Keep RBAC at the sub-system boundary. |
| Engineering-process pattern (solo + AI as "citizen integrator") | Business users author recipes; power users drop to code; AI drafts recipes from NL | ALIGNED | Eric + AI pair is structurally a "citizen integrator" + power-user hybrid. NL-to-workflow drafting with human confirm is exactly D19 on the authoring path. Worth building explicitly. |
| CM baseline (governance) | Per-step job history, replay, audit log, environment RBAC, recipe versioning | ALIGNED | Baseline matches. The thing Workato doesn't ship that we should: a multi-step human-GATE on promotion itself, not just on runtime actions. |

---

## 6. Patterns worth stealing

1. **Orchestrator-worker with a hard deterministic/inference line.** This is D19 made operational. Recipes own state and sequencing; genies own judgment. Never blur.
2. **Business approvals as a recipe primitive, not a separate system.** A GATE is just a step. Any workflow can have one. Three logged artifacts: request, assignment, resolution. Plus explicit expiry.
3. **Typed recipe functions for composition.** Every sub-workflow declares input and response schemas. Composition is explicit, not emergent. This is what WF-001…006 should look like when they call each other.
4. **Environments as first-class, project as promotion unit.** Not a git branch model. Dev / test / prod with explicit promote action. Adopt for document-cm promotion, not just code.
5. **Per-step job history with input/output snapshots, replayable.** Every step's I/O is captured and rerunnable. This is the reliability and debugging baseline. Cheap to implement if designed in from step 1; expensive to retrofit.
6. **Specialized prompts per genie, not shared prompts.** When we break the 16 Concept agents into Skills, each gets its own tightly-scoped system prompt. No shared global prompt.
7. **Anti-patterns as published doctrine.** Workato documents what NOT to do as prominently as what to do. Concept Computing should ship an anti-patterns list (see Q10 surprise #6).
8. **Expose outward contracts as MCP servers.** For Lifting Tracker and every future XRSize4 ALL sub-system, MCP is the primary integration surface, not an afterthought.

## 7. Patterns NOT worth copying

1. **Platform as system of record.** Workato can afford it because Workato is the business. For a solo + AI build, git is SoR and must stay so. Don't build a "document-cm platform" that gates edits.
2. **No real dead-letter queue, idempotency pushed to recipe author.** Make idempotency a framework property via content-addressed step outputs, not an author-burden. Workato's gap, not a precedent.
3. **Ruby DSL for connector authoring.** The DSL is fine but load-bearing only because Workato had to pick something. We don't need a DSL — MCP's JSON-schema tool contract + a thin TypeScript-or-Python SDK is sufficient. Don't invent a DSL.
4. **Promotion gated by RBAC only.** Workato promotes with role checks. For document-cm / code-cm, promotion should itself be a workflow with a human GATE, not an RBAC toggle. Keep WF-003 stronger than Workato's pipeline.
5. **Scheduler 5-minute floor.** Arbitrary. We should pick our own floor based on what actually matters (probably 1 min for analytics pulls, event-driven for everything else). Don't copy the constraint.
6. **BYO-LLM as a second-class path.** Workato recommends Claude Sonnet or GPT and treats everything else as optional. For us, Claude-first is fine; pretending other LLMs are equally supported is marketing, and Workato does it. Be honest in our own docs: Claude is the default and the only fully supported path in v0.3.0.
7. **Workbot / Workato GO chat interface assumption.** Genies assume a chat front-end (Slack, Teams, Workato GO). Many Concept workflows don't need chat at all — CLI invocation or file trigger is enough. Don't force chat-as-interface.

## 8. Open questions

- **Recipe version semantics on recipe functions.** Does a recipe-function version bump break downstream recipes? Docs don't explicitly cover. For Concept Computing's typed inter-workflow contracts, we need an explicit answer.
- **Dead-letter and replay after code change.** If a step fails, we replay, but the recipe code has changed since — does Workato replay against old code or new? Not documented clearly. This matters for Concept Computing replay semantics.
- **Agent Studio multi-tenant isolation.** Genies share a knowledge base; how is cross-tenant leakage prevented? Security docs are generic. Likely answered in SOC2/ISO docs behind a login.
- **Cost model for MCP calls.** Is an MCP tool invocation one task, or is it the underlying recipe's task count? Pricing page is opaque. Matters for sizing our own MCP surface economically.
- **Approval expiry semantics.** What happens when a business-approval task expires — does the recipe fail, branch, or default? Docs hint at "expire" as an outcome but don't specify branching. We should pick an explicit answer in WF-003.
- **Custom connector SDK → MCP path.** Now that Workato has Enterprise MCP, is the connector SDK being deprecated, merged, or kept parallel? No migration guide found. Signals that Workato itself hasn't fully resolved the SDK/MCP duality.

---

Sources (substantive):

- Workato Docs: Agent Studio (docs.workato.com/agentic/agent-studio.html)
- Workato Docs: Genie key components (docs.workato.com/en/agentic/agent-studio/genies-configuration.html)
- Workato Docs: Design genie workflows with multiple steps
- Workato Docs: Business approvals (docs.workato.com/en/agentic/agent-studio/business-approvals.html)
- Workato Docs: MCP (docs.workato.com/mcp.html), MCP servers, MCP server skills, MCP server tool design
- Workato Docs: Environments, Recipe lifecycle management, Deployment, Best practices
- Workato Docs: Recipe Version Management, External source control
- Workato Docs: Error handling best practices, Rerunning jobs
- Workato Docs: Callable recipes → Recipe Functions migration
- Workato Docs: Scheduler, Triggers, Long actions
- Workato Docs: Activity Audit Log, Logging Service
- Workato Docs: Connector SDK (quickstart, Ruby methods, CLI, best practices)
- Workato Connector: "Orchestrating Intelligence: How to Build Enterprise AI Agents"
- Workato Connector: "Workato Enterprise MCP: The Future of Agentic Automation"
- BusinessWire: Workato Enterprise MCP launch announcement, Oct 2025
- Contrary Research: Workato business breakdown and founding story
- TechCrunch: $5.7B valuation Series E (Nov 2021)
- PitchBook, Crunchbase, Tracxn: company profile and funding
- Activepieces, Vendr, Spendflo: pricing breakdowns (third-party, cross-checked)

© 2026 Eric Riutort. All rights reserved.
