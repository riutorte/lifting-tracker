---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
title: What Are Agents? A Grounding Reference
status: v1 complete
---

# What Are Agents? A Grounding Reference

**Purpose.** Canonical reference for the term "agent" as used across Eric Riutort's XRSize4 ALL portfolio, Concept Computing framework, and 16-agent Concept suite. Other documents (`architecture.md`, `source-doc-cm-design.md`, the Concept Computing docs) cite this when they need to anchor terminology. This is not a literature review; it is a working definition backed by a defensible synthesis of how the term is used across the academic canon, the 2025–2026 lab and vendor ecosystem, industry analysts, and cognitive-science antecedents.

---

## 1. Executive summary

- **Where everyone agrees.** An agent is a system that (a) perceives some environment, (b) selects actions in pursuit of goals, and (c) acts on that environment through effectors. This is the Russell–Norvig minimum and every serious framing is a specialization of it.
- **Where the real disagreement lies.** Not on the definition — on the *threshold*. How much autonomy, planning, memory, and tool-use is required before a system crosses from "program that uses an LLM" to "agent." Academic frames (Russell–Norvig, BDI, RL) are permissive: thermostats and chess programs are agents. Current-lab frames (Anthropic, OpenAI, Google) are stricter: an agent must dynamically direct its own process, choose its own tools, and operate over multiple steps without per-step human direction. Bornet occupies a middle layer and insists higher autonomy is not always better.
- **The minimum set that actually distinguishes an agent in the 2026 LLM context.** Goal representation + autonomous action selection over multiple steps + tool/effector use + some form of state or memory across the loop. Every other property (planning, reflection, multi-agent coordination, learning) is a *specialization*, not a definition.
- **Working definition for this portfolio (see §8).** An *agent* is a bounded-authority system that perceives a context, selects and executes actions in service of goals it represents, persists state across the loop, and is accountable under a governance rule that binds its outputs — with the Reasoner Duality (D19) determining which tier holds decision authority and which tier advises. This definition intentionally excludes single-shot LLM calls and pure retrieval pipelines.
- **What this document is not.** Not a taxonomy of every framework. Not a product comparison. It is the shortest thing that is still correct.

---

## 2. Pascal Bornet — *Agentic Artificial Intelligence* (2025)

### The book

Pascal Bornet, Jochen Wirtz, Thomas H. Davenport and 24 co-contributors, *Agentic Artificial Intelligence: Harnessing AI Agents to Reinvent Business, Work, and Life*, World Scientific, March 2025. 572 pages. Research base: 167 companies, 27 contributors. Forbes selected it a "Top 10 Must-Read Tech Book." Bornet's prior book (*Intelligent Automation*, Wiley 2021) shapes the lineage: agentic AI is positioned as a maturity stage *along a continuous progression* from RPA through intelligent automation, not a replacement for automation.

### Bornet's framing of what an agent is

Bornet does not offer a single tight one-line definition. The closest operational framing: agents are *task-oriented* systems that excel at orchestrating well-defined workflows with clear instructions, explicitly positioned *against* the Jarvis/Samantha fully-autonomous vision. The book's central diagnosis is the "brilliant advisor trap" — AI that thinks and analyzes but fails to get stuff done in the real world. Agentic AI, for Bornet, is the shift from analysis to execution.

An agent in Bornet's sense has the full **SPAR loop** plus **Three Keystones** (Action, Reasoning, Memory) working together; any system missing one is "brilliant but cannot handle messy reality."

### SPAR — the four capabilities

- **Sense** — perceive and gather information from the environment (documents, alerts, user inputs, signals).
- **Plan** — reason over inputs; evaluate options; develop strategies toward goals.
- **Act** — execute in the real world: send messages, update databases, trigger workflows, control physical systems.
- **Reflect** — learn from experience, evaluate performance, adapt future behavior.

SPAR is both a diagnostic (used to rate agents across the progression levels) and a design frame.

### Agentic AI Progression Framework — six levels (L0–L5)

- **L0 — Manual Operations.** Humans do all tasks; basic digital tools, no automation.
- **L1 — Rule-Based Automation.** RPA, macros, if-then scripts. Brittle outside parameters. (Cruise-control analogy.)
- **L2 — Intelligent Process Automation.** Automation + NLP/ML/CV; handles semi-structured data, pattern-based decisions. Bornet's "sweet spot" for most organizations today.
- **L3 — Agentic Workflows.** True AI agents: generate content, plan multi-step processes, chain tools, maintain context. Autonomous-highway-driving analogy.
- **L4 — Semi-Autonomous Systems.** Set their own sub-goals, learn from experience, adapt strategies. Largely experimental.
- **L5 — Fully Autonomous Systems.** Theoretical endpoint; operate independently across all scenarios in a domain. Bornet flags unresolved accountability/control questions.

**Critical claim: higher is not always better.** A Level 2 solution that ships beats a Level 4 system that never deploys. Organizations must build data-quality and process discipline at L1/L2 before jumping to L3+. The recommended stance is a *portfolio approach* — different levels for different functions.

### Other Bornet taxonomies

- **AI Agent Collaboration Capability Model** — four skill transitions: Task → Workflow Thinking; Control → Delegation; Simple Interactions → True Collaboration; Augmentation → Value Creation.
- **Agent-to-Agent Economy** — AI systems transacting, negotiating, collaborating autonomously.
- **Three Competencies of the Future** — named in launch material but not specified in accessible sources.

### Distinctive contribution

Three things separate Bornet's framing from lab and academic definitions:

1. **Portfolio over progression.** Where lab framings treat "more agentic = better," Bornet explicitly rejects that as a design principle.
2. **Deployment is the hard part.** "Design for failure." "Suggestion mode" (human-approved actions first) as the default deployment pattern — autonomy graduates over time.
3. **Continuity with automation.** Agents are a new class of enterprise "worker" on the same maturity curve as RPA and IPA, not a discontinuity.

Bornet's signature phrase — "task-oriented, not job replacements" — is the single line that most clearly fixes his position relative to both the hype and the academic literature.

---

## 3. Academic foundations

### Russell & Norvig — *Artificial Intelligence: A Modern Approach*, 4th ed (2021)

The canonical textbook definition sets the floor for every subsequent framing: an agent is anything that perceives its environment through sensors and acts upon it through actuators. A *rational* agent, for each percept sequence, selects the action expected to maximize its performance measure given prior knowledge. Task environments are specified by the **PEAS** frame — Performance measure, Environment, Actuators, Sensors. The textbook distinguishes five agent architectures of increasing sophistication: simple reflex, model-based reflex, goal-based, utility-based, and learning. Rationality is deliberately decoupled from omniscience, success, or intelligence — a rational agent is one whose action selection is correct given what it can know. This is the definition current-lab framings inherit and specialize.

### Wooldridge & Jennings — *Intelligent Agents: Theory and Practice* (1995); Wooldridge, *An Introduction to MultiAgent Systems* (2009)

The AI-agents literature in the 1990s split the concept along a *weak* and *strong* notion of agency. The weak notion requires four properties: **autonomy** (operating without direct human intervention), **reactivity** (responding to environment changes), **pro-activeness** (goal-directed initiative), and **social ability** (interaction with other agents). The strong notion adds mentalistic predicates — the agent is modeled as having *beliefs*, *desires*, and *intentions*, drawing on Bratman's philosophy of practical reason. The resulting **BDI** architecture treats agents as deliberative reasoners that derive intentions from desires filtered through beliefs. BDI remains the closest thing the field has to a principled cognitive model of an agent, and its four weak-notion properties are still the most defensible non-ML tests of whether a system is meaningfully an agent at all.

### Sutton & Barto — *Reinforcement Learning: An Introduction*, 2nd ed (2018)

RL's contribution is the **agent–environment interface** as the primitive: at each time step *t* the agent receives a state and reward, selects an action, and the environment returns a new state and reward. Everything the agent can decide is the agent; everything else is environment — an operational boundary rather than a metaphysical one. The goal is defined by the reward signal; the agent's objective is to learn a policy that maximizes expected cumulative reward. This framing is indifferent to how the agent is implemented (table, network, symbol system) and has become the reference loop diagram for every subsequent "agentic" architecture, including tool-using LLM agents where tool calls substitute for environment actions.

### Simon, Newell, and the historical grounding

Newell & Simon's **physical symbol system hypothesis** (1976) — that a physical symbol system has the necessary and sufficient means for general intelligent action — is the founding claim that a computational system could be an agent in any meaningful sense. Simon's **bounded rationality** (1955, 1957) is the other side: real agents optimize under computational, informational, and temporal limits, not in the unbounded Bayesian sense. Together they frame every modern agent as a satisficer — selecting actions good enough to achieve goals under constraints, not optimal ones. Current-lab framings that emphasize "good enough" tool use, backtracking, and reflection are direct descendants of Simon, whether they cite him or not.

## 4. Lab and vendor definitions

### Anthropic — *Building Effective Agents* (Dec 2024)

Anthropic draws the most consequential line in the current discourse: the split between **workflows** and **agents**. Workflows are systems where LLMs and tools are orchestrated through predefined code paths — deterministic graphs with LLM calls at nodes. Agents are systems where LLMs *dynamically direct their own processes and tool usage*, maintaining control over how they accomplish tasks. Both are "agentic systems," but the architectural and operational implications diverge sharply. The post's governing advice — find the simplest solution; don't build an agent if a workflow suffices — is itself a definitional move: it concedes that most production use cases are workflows, and reserves the term "agent" for genuinely model-directed loops. This is also where the patterns vocabulary (prompt chaining, routing, parallelization, orchestrator–workers, evaluator–optimizer) enters mainstream practice.

### OpenAI — Assistants API, Agents SDK (2024–2026)

OpenAI's operational definition evolved from the Assistants API (a thread + tools primitive) to the Agents SDK (Python and TypeScript) released in 2025. An agent in the SDK sense is an LLM configured with instructions, tools, and optional runtime behavior including **handoffs** (delegation to other agents), **guardrails** (input and output filtering that can halt generation), and **structured outputs**. The distinguishing move from "tool-using model" to "agent" is *orchestration*: the agent runs a loop that spans multiple steps, routes between sub-agents, enforces guardrails, and maintains context. OpenAI makes this explicit: supplying tools does not yet make an agent; it takes the orchestration envelope for the system to cross the line. The framework is provider-agnostic, which matters for the definition — it treats "agent" as an architecture pattern rather than a model capability.

### Google DeepMind — Agent Development Kit (ADK), Google Cloud NEXT 2025

Google's ADK defines an agent as *a self-contained execution unit designed to act autonomously to achieve specific goals* — able to perform tasks, interact with users, use external tools, and coordinate with other agents. The framing is event-driven and state-first: context (sessions, memory, tool outputs, artifacts) is treated "like source code" — a structured, versioned object the framework manages rather than a prompt-history afterthought. The ADK is explicitly designed for **multi-agent architectures** from the ground up, making agent-to-agent coordination a primitive rather than a retrofit. Compared to Anthropic's definitional clarity and OpenAI's orchestration focus, Google's contribution is the *engineering primitive* framing — agent as deployable unit with a managed lifecycle.

### Where the three labs converge and diverge

All three treat an agent as a loop (LLM + tools + state) that runs beyond a single prompt–response turn. They disagree on where the threshold sits. Anthropic draws a hard line at *model-directed* control — if the code path is predefined, it is a workflow, not an agent. OpenAI draws a softer line at *orchestration* — handoffs, guardrails, and multi-step execution. Google draws a pragmatic line at *deployability* — an agent is a unit you can instantiate, manage, and compose. The labs agree on what agents *do*; they disagree on what makes something count as one.

### LangChain and LangGraph (v1.0, Oct 2025)

LangChain treats the agent as a *loop around tool use* — an LLM that repeatedly chooses a tool, executes, and evaluates the result until a stopping condition. LangGraph, the lower-level runtime, reframes this as an **explicit state graph** — nodes are computations (LLM calls or tool executions), edges are transitions, and state is the framework's first-class object. The shift from LangChain's implicit agent loop to LangGraph's explicit graph mirrors Anthropic's workflow-vs-agent distinction: the field has converged on the view that production systems need explicit control flow, and the unconstrained LLM loop is reserved for cases where flexibility outweighs predictability. LangChain now recommends LangGraph for new agent implementations — a de facto concession that "agent as LLM loop" is too loose for production.

### Microsoft — AutoGen → Microsoft Agent Framework (Oct 2025)

AutoGen's original contribution was **multi-agent conversation** — a framing where agents are actors that talk to each other to solve problems, including a human-in-the-loop agent as a first-class participant. As of October 2025, AutoGen is in maintenance mode; its patterns have been merged with Semantic Kernel into the **Microsoft Agent Framework**, which recasts the agent as a production unit with session-based state, type safety, telemetry, filters, and extensive model support. The through-line: Microsoft's framing is *conversational* — agents as participants in a protocol, not as solitary loops. This is the clearest contrast to Anthropic's single-agent dynamic-control framing.

### Hugging Face — smolagents

The smolagents framework offers the most epistemically honest definition in the current ecosystem: an AI agent is a program where LLM outputs *control the workflow*, and **agency exists on a continuous spectrum** determined by how much influence the LLM has over downstream code paths. Their signature design choice — the **CodeAgent** that writes its actions in Python rather than producing JSON tool calls — is itself a definitional claim: executable code is a more expressive action space than structured tool selection, and an agent whose actions are code is more agentic than one whose actions are enumerated functions. The entire framework fits in roughly a thousand lines. It is the most useful operational definition for thinking about edge cases.

## 5. Analyst framings

### Gartner (2025 Hype Cycle)

Gartner's operational definition treats AI agents as autonomous or semi-autonomous software entities that use AI techniques to perceive, decide, act, and achieve goals in digital or physical environments. This is essentially Russell–Norvig with "AI techniques" inserted. AI agents sit at the Peak of Inflated Expectations on the 2025 Hype Cycle with a 2–5 year horizon to the Plateau of Productivity. Gartner's substantive contribution is on risk, not definition: access security, data security, governance, and trust in unsupervised operation are the named blockers to enterprise adoption.

### Forrester

Forrester splits the terms deliberately. **AI agents** are applications that achieve specific goals using predefined rules. **Agentic AI** is the broader capability layer — systems that plan, decide, and act autonomously, orchestrating workflows with minimal human intervention. The distinction matters because it separates the *unit* (an agent) from the *property* (agentic-ness). Forrester's mental model treats an agent as having a **dual identity**: an agent is simultaneously a *skill* (a bounded, reusable cognitive capability) and a *product* (deployed on a platform with managed dependencies, telemetry, governance, and policy enforcement). Forrester also evaluates the emerging **Agent Control Plane** market — telemetry, policy, and identity for agent operations — which is the analyst acknowledgment that agents are infrastructure-grade objects.

### IDC

IDC defines agentic AI as software systems capable of reasoning, acting, and learning autonomously — systems that don't just support decision-making but *make, orchestrate, and optimize* it. IDC's contribution is scale projection: by 2029, more than one billion actively deployed AI agents worldwide; agentic systems accounting for nearly half of all AI spending. Their governance framing — "agentic AI as critical infrastructure" — positions the question as one of operational reliability and regulatory exposure, not capability.

### ThoughtWorks (Technology Radar)

The most honest analyst-adjacent framing: *the industry still lacks a shared definition of the term 'agent.'* ThoughtWorks names this explicitly as **semantic diffusion** — the same term meaning subtly different things in different contexts, inducing miscommunication. Their substantive position: **supervised agentic modes** (developer-driven, agent-executes) are working in practice; **fully autonomous** coding agents remain unconvincing. ThoughtWorks also introduces the **cognitive debt** concept — that AI-generated code creates a growing distance between humans and the systems they maintain — which is a distinct agent-governance concern not present in the other analyst framings.

## 6. Philosophical grounding

### Dennett — the intentional stance

Daniel Dennett's 1987 framing is the most useful philosophical move for this whole discussion. An observer can adopt three stances toward a system: the **physical stance** (predict by physics), the **design stance** (predict by assumed function), or the **intentional stance** (predict by ascribing beliefs and desires). The intentional stance is warranted whenever it is *predictively useful* — not when the system "really has" beliefs. On this reading, "agent" is partly a stance we adopt, not only a property the system has. A thermostat can be usefully described in intentional terms ("it wants the room at 68"); whether it is "really" an agent is a less interesting question than whether the intentional description earns its keep. This is the right frame for reasoning about contested cases (is a single LLM call an agent? is a RAG pipeline?) — the question is *when does the intentional description buy us predictive power we would not get from the design stance alone*.

### Minsky — *Society of Mind* (1986)

Minsky's thesis is that mind is not a single agent but a *society of agents* — many simple, specialized processes (agents and agencies) whose interaction produces intelligence. This is the direct antecedent of modern multi-agent system framing, including Minsky's "agent" as a process that does something simple and composes with others to produce complex behavior. The contemporary orchestrator-plus-workers pattern (Anthropic, AutoGen, Microsoft Agent Framework) is Minsky-shaped; so is Eric's 16-agent Concept suite. Minsky also anticipates the problem the field now calls *coordination* — getting heterogeneous agents to cooperate without a global controller.

### Agent vs. tool — the cognitive-science distinction

Cognitive science draws the line sharply in principle: a **tool** is an extension of the user's intent — the user remains the locus of agency. An **agent** initiates action in pursuit of goals it represents. A hammer is a tool; a person is an agent. This distinction gets interesting in HCI and philosophy of mind: Andy Clark's **extended mind** thesis argues that tools can become part of the agent's cognitive system when the coupling is tight enough (a blind person's cane, a pilot's instruments). The relevance here: LLMs-plus-tools systems sit precisely on the contested boundary. An LLM call orchestrated by a deterministic workflow is a very capable tool. An LLM directing its own tool choices over multiple steps, with persistent state and goal representation, is an agent. The threshold between them is not metaphysical; it is engineered, and engineers decide where to draw it.

## 7. Synthesis

### Where there is genuine consensus

Every framing surveyed — from Russell–Norvig in 2021 to Gartner in 2025 to Bornet in 2025 — agrees on three things:

1. **An agent perceives an environment and acts on it.** This is the Russell–Norvig floor and no subsequent framing contradicts it.
2. **An agent has some degree of autonomy over action selection.** Weak-notion agency (Wooldridge–Jennings) requires it; SPAR presupposes it; every lab framing specializes it.
3. **An agent operates over more than a single percept–action step.** The loop is the unit. This is why single LLM calls are not agents in any framing.

### Where the disagreement is substantive

1. **Autonomy threshold.** How much autonomy is required? Gartner says "autonomous or semi-autonomous." Anthropic draws the line at *dynamic* model-directed control. Forrester separates "AI agents" (rule-based, goal-specific) from "Agentic AI" (the broader autonomy property). Bornet rejects the premise that more autonomy is always better. This is a real disagreement, not just a semantic one — it dictates whether the same system gets called an agent or a workflow.
2. **Goal representation.** BDI requires *explicit* goals expressed as desires and intentions; RL is happy with policies implicitly encoding goals via reward. The 2026 lab framings inherit both traditions without resolving the tension.
3. **Multi-agent as native or retrofit.** Minsky, Microsoft Agent Framework, and Google ADK treat coordination as a primitive. Russell–Norvig and smolagents treat the single agent as primary and multi-agent as an extension. Framework choice encodes this commitment.
4. **Whether an LLM-plus-tools constitutes an agent by itself.** OpenAI says no — you need orchestration (handoffs, guardrails, multi-step). Hugging Face says yes, but with varying degrees of agency along a spectrum. Anthropic says it depends on who controls the loop.

### Where the disagreement is merely semantic

Gartner's "autonomous or semi-autonomous software entities" and Anthropic's "LLMs dynamically directing their own processes" describe the same operational target with different vocabulary. IDC's "reasoning, acting, learning autonomously" tracks Bornet's SPAR. The phrase "AI agent" vs. "agentic system" vs. "agentic AI" is mostly terminological — ThoughtWorks is right to call this **semantic diffusion**.

### The minimum defensible set

An agent is distinguished from a non-agent system by the conjunction of four properties. Each is necessary; none alone is sufficient:

1. **Goal representation.** Explicit (BDI-style) or implicit (reward-encoded). A system with no goal it can be said to pursue is not an agent in any serious framing.
2. **Autonomous action selection over multiple steps.** The loop — not a single prompt, not a single deterministic pipeline execution.
3. **Tool or effector use.** The system changes something outside itself. Pure advisors are not agents; they are advisors.
4. **State persistence across the loop.** Memory of what was perceived, what was tried, what the environment returned. Without this, the "multiple steps" collapse into independent single-shot calls.

This four-property test is what survives a hostile review. "LLM + tools" is too loose (most RAG pipelines satisfy it); "autonomous system" is too loose (RPA bots satisfy it); the full conjunction is what makes an agent an agent.

### Edge cases against the test

- **Single LLM call returning advice.** Fails test 2 (no multi-step) and test 4 (no state). Not an agent. It is a *tool-using model* or an *advisor*.
- **RAG pipeline.** Depends on whether retrieval is deterministic. Fixed retrieve-then-generate pipeline fails test 2 and test 1 (no real goal beyond "answer this query"). Dynamic agentic RAG (LLM decides when/what to retrieve over multiple steps) satisfies all four. The term "agentic RAG" is earning its adjective when the loop is real.
- **Classical chess program.** Satisfies all four trivially. Is an agent by Russell–Norvig and fails most lab tests because there is no LLM in the loop. This is the clearest case where the academic and current-lab frames disagree. The academic frame wins on principle; the lab frame is narrower for pragmatic reasons (they are designing for LLM architectures specifically).
- **Claude Code running on a dev machine.** Satisfies all four: goal (user's stated task), multi-step autonomous tool use, tools (filesystem, shell, web), state (conversation + todo list + file state). Is an agent. Bounded authority — can refuse, can ask before destructive actions.
- **The 16-agent Concept suite.** Each Concept in the suite is intended to satisfy all four properties within its domain, with authority bounded by D19 (decisions belong to Tier 1; Concepts propose and explain). Under the working definition, these are agents in full standing — *constrained* agents, not *weak* agents.

---

## 8. Proposed working definition for this portfolio

**Agent (general definition — clauses 1–4).** An *agent* is a system that:

1. **Represents a goal** — explicitly, or implicitly via an evaluable objective.
2. **Selects and executes actions over multiple steps** in service of that goal, choosing what to do next based on prior observations rather than a predetermined path.
3. **Uses tools or effectors** that change something outside itself (state, messages, files, physical actions).
4. **Persists state across the loop** — memory of observations, actions taken, and intermediate results.

Clauses 1–4 are the minimum defensible set from §7. Necessary and sufficient, in conjunction, to distinguish an agent from a tool-using model, a workflow, an advisor, or a deterministic pipeline.

**Agent (portfolio definition — clause 5 added).** Within Eric's portfolio, an agent must additionally:

5. **Operate under a governance rule that binds its outputs** — explicit accountability for what it may and may not do without human confirmation or Tier 1 authorization.

The fifth clause is portfolio-specific. A system satisfying 1–4 but not 5 is still an agent in the technical sense; it is simply not one this portfolio should build, deploy, or trust. Clause 5 is the enforcement surface for D19 and the Authority Rule.

### Alignment with D19 Reasoner Duality

D19 holds that the **Tier 1 deterministic reasoner governs decisions**; the **Tier 2 LLM reasoner explains and suggests**. Under the working definition:

- A Concept that only generates text, explanations, or drafts is an agent *only* if it satisfies properties 1–4 *and* its outputs are bound by the Authority Rule (draft status until user confirms or Tier 1 authorizes).
- The Tier 1 reasoner itself may or may not be an agent depending on whether it has its own multi-step action-selection loop. A rule engine that deterministically evaluates decisions on demand is *not* an agent; it is a decision function. A Tier 1 reasoner that actively monitors state, checks conditions, and invokes actions over time *is* an agent.
- An LLM component that writes to persistent state without Tier 1 authorization violates D19 and, by the fifth clause of this definition, is not a well-formed agent in this portfolio even if it is an agent in the technical sense.

### Alignment with the Authority Rule

The Authority Rule — *AI outputs are drafts until the user confirms writes to athlete data* — is the concrete instantiation of the fifth clause for the Lifting Tracker subsystem. It generalizes to: *no Tier 2 output causes a side effect on protected state without either human confirmation or Tier 1 authorization.* Agents in this portfolio ship with this rule pre-wired; agents without it are tooling, not production systems.

### Alignment with the 16-agent Concept suite

Each Concept in the suite should be describable as:

- **Goal**: the Concept's stated responsibility.
- **Actions**: the tools it may call and the state it may read.
- **State**: the memory it keeps across invocations.
- **Authority**: the specific outputs it may produce as drafts, the specific outputs requiring Tier 1 or human authorization, and the specific outputs forbidden.
- **Loop**: the trigger, the step pattern, the stopping condition.

A Concept specification that cannot be written in this form is not yet an agent specification; it is a tool specification dressed in agent vocabulary.

### Test cases

1. *A single LLM call that drafts a workout description for a coach to review.* Not an agent — no multi-step loop, no state persistence. It is a draft generator used by the human. The right thing.
2. *A Lifting Tracker "Coaching Suggestion" feature that retrieves recent sessions, analyzes them, proposes next-session modifications, presents to the coach for approval.* Agent, bounded. Satisfies all five clauses: goal (improve athlete outcomes), multi-step (retrieve → analyze → propose), tools (DB read, analysis), state (reasoning context), governance (presents; coach decides).
3. *An autonomous background process that writes to `session.next_scheduled_exercise` based on LLM output, without explicit confirmation.* Agent in the technical sense; **disallowed** under the Authority Rule. Fails the fifth clause for this portfolio.
4. *A deterministic rule engine that enforces rest-time defaults cascading from session → exercise → set (D16).* Not an agent. No autonomous action selection; it is a decision function. Correctly classified as Tier 1 infrastructure.
5. *Claude Code used by Eric in a session to refactor the 16-agent suite.* Agent in full standing, bounded by user approval on destructive changes. The right tool for the job, not a subsystem of the portfolio.

---

## 9. Glossary

Terms used across this portfolio when discussing agents. Every entry is deliberately narrow.

- **Agent.** A bounded-authority system satisfying all five clauses of the working definition (§8). Used strictly; not as a synonym for "LLM-powered feature."
- **Agentic system.** Umbrella term for any system exhibiting some agent-like behavior. Includes agents, workflows with LLM nodes, and mixed architectures. Used when precision on agent vs. workflow is not yet required.
- **Workflow.** A system where LLM calls and tool invocations are orchestrated through predefined code paths (Anthropic's definition). Deterministic control flow with AI components. Not an agent.
- **Tool-using model.** An LLM that can invoke tools within a single completion, without multi-step state or autonomous control flow. A capability, not an agent.
- **Advisor / drafter.** A Tier 2 component whose output is text, explanation, or a draft for human or Tier 1 consumption, with no side effects. May be called by an agent; not itself an agent unless it satisfies the five clauses.
- **Autonomous system.** A system that operates without per-action human approval. Orthogonal to agency — an unsupervised RPA bot is autonomous but not an agent; an agent under strict Authority Rule is an agent with constrained autonomy.
- **Orchestrator.** A control pattern (not a noun category) in which one agent decomposes tasks and routes work to sub-agents or tools. The orchestrator is itself an agent.
- **Multi-agent system (MAS).** A system of two or more agents coordinating. Coordination may be peer-to-peer (conversational, AutoGen-style) or hierarchical (orchestrator–workers).
- **Tier 1 reasoner (D19).** Deterministic reasoner holding decision authority. Rule-based, verifiable, explainable without LLM intervention.
- **Tier 2 reasoner (D19).** LLM-based reasoner that explains, suggests, drafts. No decision authority; outputs are drafts.
- **Authority Rule.** Governance rule (this portfolio): no Tier 2 output causes a side effect on protected state without explicit human confirmation or Tier 1 authorization.
- **Concept (as in "the 16-agent Concept suite").** A specific agent specification in this portfolio, with goal, actions, state, authority, and loop explicitly defined. Every Concept must be an agent by the working definition or it should be re-classified.
- **SPAR (Bornet).** Sense, Plan, Act, Reflect — Bornet's four-capability diagnostic. Useful for agent evaluation; not itself a definition.
- **PEAS (Russell–Norvig).** Performance measure, Environment, Actuators, Sensors — the canonical framework for specifying task environments.
- **BDI (Wooldridge–Jennings).** Beliefs, Desires, Intentions — the canonical cognitive model of an explicit-goal agent.

---

## 10. Open questions / edge cases

1. **Memory vs. learning.** A SPAR-style Reflect loop that adjusts behavior across sessions is arguably learning; most current systems persist trajectory-level state without modifying the underlying model. The distinction between *state across invocations* and *weight updates* matters for accountability and will matter more when online fine-tuning is routine.
2. **Agent identity.** Is an agent's identity tied to its running process or to its configuration? Restart with the same config and fresh memory — same agent, or different? Forrester's "agent as product" suggests configuration identity; Minsky's society suggests process identity. The portfolio currently assumes configuration identity; this should be made explicit.
3. **Single-agent-with-sub-processes vs. multi-agent.** When a single agent's internal planning decomposes into parallel evaluations, is that a multi-agent system or one agent with concurrency? Semantically debatable, but governance applies differently: multi-agent coordination introduces its own failure modes (deadlock, divergence, inconsistency).
4. **Does the Tier 1 reasoner count as an agent?** A rule engine invoked on demand does not. A Tier 1 reasoner that monitors state continuously, evaluates triggers, and invokes actions under its own control loop does. The distinction affects whether the five-clause definition applies uniformly across the portfolio or only to Tier 2–mediated systems.
5. **Where does the Authority Rule stop scaling?** Human confirmation on every write is correct for the athlete-facing MVP. For higher-throughput internal operations (analytics pipelines, monitoring, scheduled jobs) the rule needs a graduated form — possibly Bornet-style "suggestion mode" that graduates to autonomy within defined boundaries. This is architectural work still owed.
6. **Chess programs and thermostats.** The working definition (via clause 1) admits any system with a goal representation and a loop. Russell–Norvig is correct that this is the right floor. The lab framings are narrower for pragmatic reasons specific to LLM architectures. The portfolio should use the full definition for conceptual clarity and the lab framing as a specialization when the implementation is LLM-based.
7. **Semantic diffusion.** ThoughtWorks' warning applies here too. Enforcing the working definition across the portfolio documents — rather than letting "agent" drift into "AI feature" — requires editorial discipline. Every doc that uses "agent" without satisfying the five clauses should be flagged and either corrected or re-termed ("advisor," "drafter," "workflow," "tool").

---

## Sources

### Bornet

- Bornet, P., Wirtz, J., Davenport, T. H., et al. *Agentic Artificial Intelligence: Harnessing AI Agents to Reinvent Business, Work and Life.* World Scientific, 2025. https://www.worldscientific.com/worldscibooks/10.1142/14380
- Wang, N. "Truly Useful AI: Reviewing Pascal Bornet's Five-Level Guide to Getting Stuff Done with Agents." AgenticFoundry, Sep 2025. https://www.agenticfoundry.ai/post/truly-useful-ai-reviewing-pascal-bornet-s-five-level-guide-to-getting-stuff-done-with-agents
- Winstanley, T. "Book Review: Agentic Artificial Intelligence — A Pragmatic Map for the Age of Agents." Medium, May 2025. https://medium.com/just-another-blog-for-kicks/book-review-agentic-artificial-intelligence-pragmatic-and-structured-playbook-25353f2f5eb8
- Bornet, P. "Special Edition Newsletter: Agentic AI Book Launch." Substack, Mar 2025. https://pascalbornet.substack.com/p/special-edition-newsletter-agentic

### Academic foundations

- Russell, S. J., & Norvig, P. *Artificial Intelligence: A Modern Approach*, 4th ed. Pearson, 2021. Ch. 2, "Intelligent Agents." http://aima.cs.berkeley.edu/4th-ed/pdfs/newchap02.pdf
- Wooldridge, M., & Jennings, N. R. "Intelligent Agents: Theory and Practice." *The Knowledge Engineering Review* 10(2), 115–152, 1995. https://www.cs.ox.ac.uk/people/michael.wooldridge/pubs/ker95.pdf
- Wooldridge, M. *An Introduction to MultiAgent Systems*, 2nd ed. Wiley, 2009.
- Sutton, R. S., & Barto, A. G. *Reinforcement Learning: An Introduction*, 2nd ed. MIT Press, 2018.
- Newell, A., & Simon, H. A. "Computer Science as Empirical Inquiry: Symbols and Search." *Communications of the ACM* 19(3), 1976.
- Simon, H. A. "A Behavioral Model of Rational Choice." *Quarterly Journal of Economics* 69, 1955.

### Labs and vendors

- Anthropic. "Building Effective Agents." Dec 2024. https://www.anthropic.com/research/building-effective-agents and https://www.anthropic.com/news/building-effective-agents
- OpenAI. "Agents SDK." https://openai.github.io/openai-agents-python/ and https://openai.github.io/openai-agents-python/agents/
- OpenAI. "The Next Evolution of the Agents SDK." https://openai.com/index/the-next-evolution-of-the-agents-sdk/
- Google. "Agent Development Kit (ADK)." https://google.github.io/adk-docs and https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/
- LangChain. "LangGraph." https://www.langchain.com/langgraph and "LangChain and LangGraph v1.0," https://blog.langchain.com/langchain-langgraph-1dot0/
- Microsoft. "Microsoft Agent Framework Overview." https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview
- Microsoft. "AutoGen." https://www.microsoft.com/en-us/research/project/autogen/
- Hugging Face. "smolagents." https://huggingface.co/docs/smolagents/en/index and "Introducing smolagents," https://huggingface.co/blog/smolagents
- Hugging Face. "What are agents?" https://huggingface.co/docs/smolagents/conceptual_guides/intro_agents

### Analysts

- Gartner. "Gartner Hype Cycle Identifies Top AI Innovations in 2025," Aug 2025. https://www.gartner.com/en/newsroom/press-releases/2025-08-05-gartner-hype-cycle-identifies-top-ai-innovations-in-2025
- Forrester. "AI Agents Vs. Agentic AI: Definitions and Use Cases." https://www.forrester.com/what-it-means/ep403-ai-agent-use-cases/
- Forrester. "The Right Mental Model for Agentic AI." https://www.forrester.com/blogs/the-right-mental-model-for-agentic-ai/
- Forrester. "Announcing Our Evaluation of the Agent Control Plane Market." https://www.forrester.com/blogs/announcing-our-evaluation-of-the-agent-control-plane-market/
- IDC. "Agent Adoption: The IT Industry's Next Great Inflection Point." https://www.idc.com/resource-center/blog/agent-adoption-the-it-industrys-next-great-inflection-point/
- IDC. "FutureScape 2026: Moving into the Agentic Future." https://www.idc.com/resource-center/blog/futurescape-2026-moving-into-the-agentic-future/
- IDC. "Agentic AI Governance: When AI Becomes Critical Infrastructure." https://www.idc.com/resource-center/blog/agentic-ai-is-critical-infrastructure/
- ThoughtWorks. "Technology Radar v34 — Combat AI Cognitive Debt." https://www.thoughtworks.com/about-us/news/2026/combat-ai-cognitive-debt-radar-v34
- ThoughtWorks. "Software Engineering Agents." https://www.thoughtworks.com/radar/tools/software-engineering-agents

### Philosophical

- Dennett, D. C. *The Intentional Stance*. MIT Press, 1987.
- Minsky, M. *The Society of Mind*. Simon & Schuster, 1986.
- Clark, A., & Chalmers, D. "The Extended Mind." *Analysis* 58(1), 1998.

### Portfolio cross-references

- `docs/architecture.md` — D19 (Reasoner Duality), Authority Rule, full D1–D24 decision set
- `docs/xrsize4all_concept.md` — platform-level system-of-systems concept
- `docs/reference/source-doc-cm-design.md` — Concept Computing design for the 16-agent suite

---

© 2026 Eric Riutort. All rights reserved.
