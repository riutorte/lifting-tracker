---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
status: Working draft
source: Gartner, figure/asset ID 844801 (footer on screenshots); almost certainly pulled from "A CIO's Guide to Redesigning the Software Engineer Job in the Age of AI" (Gartner document 7304830), sibling to Gartner's CIO's-Guide-to-Redesigning-the-X-Job-in-the-Age-of-AI series (IAM Engineer 7404930, ML Engineer 7521953, SOC Analyst 7389630, Enterprise Architect 7233630)
access: Four screenshots supplied by Eric; full text of the parent Gartner report is proprietary and paywalled; this review paraphrases Gartner's framework and does not reproduce it
---

# Gartner AI-Native Software Engineering — Review and Mapping to XRSize4 ALL / Concept Computing

## 1. Executive summary

- Gartner's 5-level maturity ladder (static assistant → embedded helper → task-specific agent → operational collaborator → autonomous SDLC) is a useful shared vocabulary, but its unit of analysis is the **organization's job design**, not a practitioner's personal operating model. Eric's solo+AI shop is running a genuinely L4-leaning workflow on several capability axes while still L2 on others; the ladder is not a single dial.
- The AI Exposure Heatmap predicts that the parts of the job Eric is disproportionately doing — system architecture stewardship, governance/risk tradeoffs, cross-team leadership, innovation/experimentation, AI automation orchestration — retain the most human centrality even at L5. This is ALIGNED with Eric's implicit bet, and it means the Max-plan/24/7 Claude leverage is going where Gartner says it matters most: freeing the human to stay in the domains that don't automate away.
- Gartner's "Actions and Cautions" playbook is effectively a policy for retraining a workforce. Concept Computing's WF-001–WF-006 workflow decomposition and the D19 Reasoner Duality already satisfy Steps 1–2 (workflow analysis, job deconstruction) for a shop of one. Steps 3–4 (capability portfolio, team organization) are latent in the Concept agent/role scaffolding but not named. Step 5 (activation signals, stretch monitoring) has no analog in Eric's current architecture — worth considering.
- The L4 → L5 transition, as Gartner frames it, hinges on **agent interoperability across platforms** and event-driven multi-agent workflows — not just more capable single agents. XRSize4 ALL's Intelligence sub-system is currently conceived single-agent-per-user; the L5 frame argues for surfacing agent-to-agent protocol, shared state, and event-bus semantics as a first-class architecture concern sooner than the Phase 5 roadmap admits.
- Gartner's framing treats "AI engineer" and "product engineer" as two new skill-sets layered on top of the classical software engineer. Eric's Concept Computing stance is more radical: the ontology layer is architectural, not a skill, and the reasoner layer (D19 Tier 1) is deterministic, not LLM-driven. This is a principled divergence from Gartner's implicit "more capable LLM ≈ higher autonomy" axis, worth flagging as an **EXTENDS-US** position.

## 2. Source provenance

- Slide/figure footer on IMG_5428 and IMG_5430: `Source: Gartner / 844801`. This six-digit ID pattern matches Gartner's internal figure-asset numbering (not the seven-digit document IDs like 7304830).
- The page furniture ("Software Engineer" tag top-right, section numbering `1. Start With Workflows` and `2. Deconstruct the Job for AI Impact Assessment`, the Actions-and-Cautions rubric) matches Gartner's "CIO's Guide to Redesigning the X Job in the Age of AI" template. The parent document is almost certainly **Gartner document 7304830, "A CIO's Guide to Redesigning the Software Engineer Job in the Age of AI"**.
- Related Gartner research in the same program (identified during source search, useful for downstream follow-up):
  - 6076795 — *Innovation Insight for AI-Native Software Engineering* (Jan 2025)
  - 6852666 — *Software Engineering Foundations for the AI-Native Era*
  - 7586633 — *Gartner Maturity Model for AI-Native Software Engineering*
  - 5109131 — *Generative AI Is Reshaping Software Engineering*
  - 5724051 — *AI Will Not Replace Software Engineers (and May, in Fact, Require More)*
  - 6888866 — *Innovation Insight: AI Agent Development Frameworks*
  - 5332663 — *Innovation Insight: AI Agents*
- Full text of 7304830 is paywalled. The four screenshots Eric provided are the only direct access; this review is built from them plus public Gartner press releases, analyst commentary (Veracode, Solace, SD Times, webpronews, DEVOPSdigest) summarizing neighbor documents, and inference from the slide structure. Where Gartner's specific phrasing matters for accurate paraphrase it has been transcribed internally and then rewritten here; verbatim passages are not reproduced in this document per copyright discipline.
- Date of publication: not directly visible on the screenshots. Sibling documents in the series cluster in 2025; the neighboring "Innovation Insight for AI-Native Software Engineering" (6076795) is dated Jan 13, 2025. 7304830 is most likely 2025 as well.

## 3. Framework reconstruction (paraphrased)

### 3.1 The five-level ladder

Gartner arrays AI's role in the software engineering job along five levels of autonomy. The labels — which function as identifying handles and are quoted for reference — are:

- **L1** — "Static, disconnected assistant"
- **L2** — "Embedded helper"
- **L3** — "Task-specific automation"
- **L4** — "Operational collaborator"
- **L5** — "Autonomous SDLC"

In paraphrase: L1 is a chatbot that sits outside the engineer's real tools — question-in, answer-out, manual copy-paste back into the IDE. L2 is the AI pulled inside the IDE, giving local autocomplete and answering questions about the immediately-visible code. L3 is where the agent takes on a whole task description and works across several files with its own plan, still checking in before consequential writes. L4 is a pattern where the engineer is running several agent processes concurrently, each handling a unit of feature-level or maintenance-level work, and the engineer reviews results rather than supervising turn-by-turn. L5 is a pipeline of agents passing work to one another across platform boundaries, triggered by system events rather than human prompts, where the engineer's role is design, policy, and exception handling rather than participation in the change stream. The upward motion is not primarily "each agent gets smarter" — what changes is the **unit of work the human assigns** (query → snippet → task → feature → outcome). That shift in unit-of-work is the more interesting variable than raw model capability.

A footnote on the slide clarifies that "AI" here covers generative models plus agent technologies, and that the levels describe how much autonomy is delegated, not how capable the technology is.

### 3.2 The AI Exposure Heatmap

A 14-row × 5-column matrix (rows = capability domains, columns = L1–L5). Capability domains are grouped into three bands:

- **Core engineering work**: software design and architecture; code implementation and review; integration and deployment; QA and testing; maintenance and support.
- **Contextual engineering work**: reliability and observability; security and compliance; scalability and resilience; cross-team leadership; innovation and experimentation.
- **Shared (human-AI collaboration) work**: system architecture stewardship; product experimentation and strategy; governance and risk tradeoffs; AI automation orchestration.

The cell shading encodes five states from "fully human-driven, AI impact minimal" through "shared responsibility" to "highly automatable." The **pattern** (not reproducing the cell-by-cell shading):

- At L1, every row is nearly fully human-driven. The matrix is almost uniformly dark.
- Moving rightward across the columns, the **Core** rows lighten fastest — code implementation, QA, integration/deployment — reaching "highly automatable" by L4–L5.
- The **Contextual** rows lighten more slowly. Reliability/observability and security/compliance reach "AI does most work, human oversight" by L4. Cross-team leadership and innovation lighten only partially even at L5.
- The **Shared** rows lighten least. System architecture stewardship, product strategy, governance/risk tradeoffs, and AI automation orchestration are called out as "shared responsibility" or "mostly human" even at L5.
- Gartner's captioning under the heatmap flags a trap: treating the heatmap as a cost-reduction map (shrink the human job to fit what's automatable) produces efficiency without growth. The intended read is **capability expansion** — use the freed capacity to push into the contextual and shared rows, which most teams currently under-invest in.

### 3.3 Actions and Cautions

A prerequisite and five numbered actions. Paraphrased freely (labels below are mine, for the mapping later in this doc):

- **Prerequisite — shared definition of the job.** Different parts of the organization tend to hold different mental models of what a software engineer does. Close that gap before attempting any redesign, and express the result as outcomes the job produces, not as duties it performs.
- **Step 1 — redraw the workflow.** For each work stream, draw the line between what the human does and what the agent does, then name the handoff. Implicit, undocumented AI use is the thing to eliminate.
- **Step 2 — decompose to capabilities and assess exposure.** Refactor the job into its capability units. Score each unit against the ladder. The resulting exposure picture shows where the redesign has the most room to move.
- **Step 3 — assemble a forward capability portfolio.** Identify the capabilities the job will need next, and offer people several routes to acquire them. One career path fits few.
- **Step 4 — re-organize around that portfolio.** Hiring, org structure, and development investment should target the capabilities the portfolio names, not the ones that are legacy.
- **Step 5 — pace the transition to the people.** Change too much too fast and the people being asked to change can't absorb it. Watch for the signals that they're being stretched past that point, and let them own the speed of their own adoption.

The framing is workforce transformation more than technical architecture. The implicit reader is a CIO or head of engineering running a team of dozens, not an individual practitioner.

## 4. Findings against Eric's open questions

### Q1 — Where does Eric sit on L1–L5?  [finding tag: ALIGNED with mild EXTENDS-US]

**Gartner's implicit measure.** The ladder is defined by the unit of work a human assigns. At L4, the engineer has several agent processes running at once on feature-, triage-, and maintenance-sized units, and is spending the freed capacity on higher-leverage work. At L5, agents hand work to each other across the delivery pipeline with the human mostly out of the turn-by-turn loop.

**Eric's current operation.** The Max plan + 24/7 Claude + this Cowork session + the parallel Claude Code sessions that live in the `lifting-tracker` repo is functionally L4 on *coding*, *documentation*, and *research* work. The unit-of-work Eric is assigning is already "feature" or "architectural question" rather than "snippet." Multiple asynchronous agent sessions run in parallel.

**Where Eric is not yet L4.** Integration and deployment (no CI/CD on this repo yet — Section 7 below), governance (no explicit agent-authority policy document beyond D19's principle statement), QA (no test harness yet, agents are not running tests between task iterations). These are not L4 on the ladder; they're L2-L3 at best.

**Implication.** The L1–L5 ladder is better read as a *profile* than a *score*. Eric's profile is strongly bimodal: L4 on cognitive/architectural work, L2 on operational infrastructure. Peer/client framing: "I'm running an L4-leaning design loop on top of L2 infrastructure" is more honest than "I'm at L4."

**EXTENDS-US note.** Gartner's ladder implicitly assumes capability grows with autonomy. Eric's D19 Reasoner Duality deliberately caps LLM autonomy (Authority Rule: Tier 1 governs decisions) to preserve accuracy on health-adjacent outputs. Under D19, pushing to L5 on certain domains (coaching prescriptions, goal synthesis, progressive overload planning) is *not* the target state; the target state is **high L4 capability bounded by a deterministic reasoner**. The ladder as presented does not have vocabulary for "deliberately capped autonomy" — that's a distinct architectural posture, not a lower-maturity one.

### Q2 — Heatmap as diagnostic for Eric's attention allocation  [finding tag: ALIGNED, strongly]

Eric's disproportionate domains — system architecture stewardship, governance/risk tradeoffs, cross-team leadership (in the solo case: the coach/gym/coach-client relational design), innovation/experimentation — are all in the **Shared** or slow-lightening **Contextual** bands. Gartner's read on these rows at L4–L5 is "shared responsibility" or "mostly human" with AI assisting on routine sub-parts.

**Implication.** Eric's time budget is already concentrated where the heatmap says human leverage persists longest. This is not luck — it's a consequence of (a) working at architecture level by training and (b) being one person, which removes the pull toward the Core rows that a larger team would generate.

**Actionable read.** The heatmap carries an explicit warning that using it purely as a cost-reduction target (shrink the human footprint to fit what's automatable) captures efficiency while forfeiting growth. Eric is not in that trap: the capacity freed on the Core rows by AI automation is being spent on *more* architecture and governance work, not on shipping the same architecture faster. That's the intended L4 usage. Worth naming explicitly.

**Caveat.** The capability "AI automation orchestration" appears as a Shared-band row that remains human-led at L5. That's a capability Eric currently does entirely by hand (crafting agent prompts, orchestrating Claude sessions, managing context, deciding when to run what). Gartner's heatmap treats this as a durable human responsibility. This suggests the orchestration layer is worth treating as a **first-class artifact** — documented patterns, reusable flows — not just a habit.

### Q3 — Actions-and-Cautions as playbook vs. Concept Computing  [finding tag: ALIGNED on Steps 1–2, LATENT on Steps 3–4, GAP on Step 5]

| Gartner step | Concept Computing / XRSize4 ALL analog | Status |
|---|---|---|
| Prerequisite: agree on the job, outcome-focused | Concept's emphasis on capabilities and outcomes over verbs | DONE in spirit |
| Step 1: Start with workflows | Concept Computing WF-001–WF-006 workflow decomposition | DONE |
| Step 2: Deconstruct the job | D19 Reasoner Duality (Tier 1 vs Tier 2 allocation); agent-role decomposition in XRSize4 ALL (AI Agent authority boundaries in xrsize4all_concept.md §AI Agent as Participant) | DONE |
| Step 3: Capability portfolio | Not formally present. The XRSize4 ALL roadmap (Phases 1–5) is capability **sequencing**, not capability **portfolio** — no named skill-development paths for the human side of the pair, because the human side is one person. Still, there's a latent version: the D1–D24 decision log is a capability map by proxy. | LATENT — worth making explicit |
| Step 4: Organize teams | N/A at current scale (solo + AI). The analog at XRSize4 ALL v1 is which agents occupy which roles in the coaching / athlete / content / moderation scaffolds. This is already explicit in `xrsize4all_concept.md` §AI Agent as Participant. | DONE in product, N/A for Eric's own org |
| Step 5: Activation signals / stretch monitoring | No analog. Eric has no explicit mechanism for noticing when he (or the agents) is being asked to stretch too far. | GAP |

**The Step 5 gap is the most interesting finding.** Gartner's warning is about humans in a workforce transformation. The same warning applies inside Eric's own head at a solo shop, and it applies to **agent reliability** — the signals that an agent is operating beyond its calibrated envelope (hallucination, premature closure, scope creep) are exactly the stretch signals Step 5 names for humans. This is a natural place to extend the D19 framework: an explicit "stretch signal" layer that flags when Tier 2 outputs are being relied on in ways D19's Authority Rule was designed to prevent.

### Q4 — What the L4 → L5 transition requires  [finding tag: EXTENDS-US / NEUTRAL]

Gartner's L5 description centers on three properties (paraphrased):

1. **Interoperable agents across platforms** — agents speak a common enough protocol that they can hand work off to each other across IDE, CI/CD, observability, issue tracker, etc.
2. **Event-driven multi-agent workflows** — the pipeline is triggered by events (commits, alerts, user requests) rather than by human orchestration of each agent turn.
3. **Minimal human oversight enabling continuous delivery** — the human is out of the critical path for most changes, not just some.

**Where Eric is on each, candidly:**

1. Interoperability: the XRSize4 ALL Intelligence sub-system is specified as a capability layer used by every other sub-system, but the current implementation horizon is "Claude via Supabase Edge Functions" — a single model accessed by edge-function calls, not a multi-agent interop fabric. The platform architecture is compatible with evolution to multi-agent interop (because the Intelligence layer is factored out), but the actual protocol, shared state, and handoff semantics are not designed. **Flag:** this is the architectural gap most relevant to Eric's stated ambition.
2. Event-driven: Supabase real-time + edge functions + webhook triggers make this mechanically possible; no such workflows are designed or documented.
3. Minimal oversight: D19's Authority Rule is the explicit anti-pattern of this. AI drafts, human confirms — by design. Under D19, reducing human oversight below a floor is prohibited for consequential decisions. **This is a principled EXTENDS-US divergence, not a gap.** L5 as Gartner describes it cannot apply to the health-adjacent parts of the Lifting Tracker domain; the Authority Rule caps it at L4.

**Implication.** The path to L5 in Eric's work is not "make Tier 2 LLM more capable." It's "build the interop + event-driven fabric so multiple Tier 1 + Tier 2 pairs compose across sub-systems, with D19 in force at each." That is a different design problem than Gartner's framing implies. Worth naming in Concept Computing terms as "interop-first L5, authority-preserving" rather than Gartner's implicit "autonomy-first L5."

### Q5 — Heatmap row "AI automation orchestration" vs XRSize4 ALL cross-cutting services  [finding tag: ALIGNED]

XRSize4 ALL lists eleven cross-cutting sub-systems (Identity and Trust, Ontology and Data, Goals, Biometrics, Intelligence, Content, Social and Community, Coaching, Commerce, Proximity and Discovery, Wearable Integration, Instruction and Form Analysis — the count is twelve if Instruction/Form is counted separately from Coaching; eleven if merged). None is named "AI Automation Orchestration."

Gartner's heatmap row of the same name is described as a durable shared-responsibility domain even at L5. It is a *capability* in Gartner's frame, not a *service*.

**Mapping.** AI automation orchestration as Gartner uses it = (i) deciding which agent does which kind of work, (ii) stitching agent outputs into end-to-end flows, (iii) handling agent failure, escalation, and human handoff, (iv) measuring agent performance and retuning. In XRSize4 ALL terms, this is:

- A *platform capability* within the Intelligence sub-system (authority boundaries, routing, fallback, audit).
- A *cross-cutting concern* in the same category as Governance (§Cross-Cutting Concerns in `xrsize4all_concept.md`).
- **Not yet named.** The Intelligence sub-system description focuses on reasoning (Tier 1/Tier 2); it does not yet name orchestration, routing, failover, or cross-agent state.

**Implication.** Consider adding an explicit concern or sub-capability within Intelligence titled *Orchestration and Handoff* (or a similar name), with its own authority rules, observability requirements, and failure semantics. Gartner's heatmap treats this as durable human-led work; giving it a first-class name in the architecture makes it a place where Eric can deliberately stay rather than a place that gets lost between roadmap phases.

## 5. Self-positioning exercise

Eric's practice on the L1–L5 ladder, by capability domain and honestly scored:

| Capability domain | Current level | Notes |
|---|---|---|
| Software design and architecture | L4 | Claude as design interlocutor, multi-session async work, human authoring the decision log |
| Code implementation and review | L3 → L4 | Agentic IDE patterns in Claude Code; still human-final for commits |
| Integration and deployment | L1–L2 | No CI/CD, no automated release — manual Expo builds and Vercel deploys |
| QA and testing | L1 | Tests not yet configured; agents do not run tests between iterations |
| Maintenance and support | N/A (pre-launch) | |
| Reliability, observability | L1 | No logging/monitoring design yet beyond Supabase defaults |
| Security and compliance | L2 | Considered in architecture (D22 privacy defaults, auth-token policy), not yet operationalized |
| Scalability and resilience | L2 | Offline-first architecture is a resilience posture; no load/chaos discipline |
| Cross-team leadership | N/A (solo) | At XRSize4 ALL v1, the relational design between coach / athlete / gym / admin roles is in `xrsize4all_concept.md`; the *meta* version (Eric coordinating across agents and humans on the project itself) is nascent |
| Innovation and experimentation | L4 | This document is an instance — using AI as a research and synthesis partner at feature-of-work unit |
| System architecture stewardship | L4 with L5 elements | Human-authored architecture.md + xrsize4all_concept.md; agents assist with cross-file consistency, drafts, reviews |
| Product experimentation and strategy | L3 | User stories, roadmap, themes-epics-features — agent-assisted, human-decided |
| Governance and risk tradeoffs | L3 | D19 Authority Rule is a governance principle; no governance *process* yet |
| AI automation orchestration | L3 | Hand-crafted orchestration (this Cowork + Claude Code pattern); no codified patterns or named artifact yet |

**Honest summary.** "L4 architecture loop on L1–L2 ops" is the accurate one-line. The parts of the job that look most impressive at L4 are also the parts Gartner's heatmap says stay human-led at L5 — so the advantage is real but it's not "ahead on the ladder." It's "the ladder's most durable floors already have the lights on."

**What this means for how Eric talks about the work.** Avoid the claim "I'm running L5 autonomous SDLC with AI." It isn't true and it overclaims on the one axis Gartner reserves for long-horizon transformation. More defensible: "I'm running an L4-operational-collaborator model on design and architecture work, with a principled cap on autonomy for consequential decisions per D19 Reasoner Duality. Integration and deployment are still L2 — deliberately, because operational hardening is a later phase." That's accurate *and* signals architectural literacy.

## 6. Heatmap cross-cut — Eric's disproportionate domains at L4/L5

Four domains where Eric's attention concentrates, with Gartner's L4/L5 read and the implication:

### System architecture stewardship
- **Gartner at L4–L5:** shared responsibility; AI assists with consistency checking, cross-reference, draft generation, trade-off articulation; human holds the stewardship role (ownership of the canonical model, naming, decision authority).
- **Implication for Eric:** the architecture.md / xrsize4all_concept.md stance (human-authored decision log, AI-assisted review and drafting) is exactly the L4–L5 shared model Gartner describes. Keep the human as author-of-record. Don't let the agent's fluency in generating architecture prose seduce into letting it become decision-maker — it's a consistency and articulation tool, not an architect.

### Governance and risk tradeoffs
- **Gartner at L4–L5:** mostly human; AI automates routine audit, logging, policy-conformance checks, but the tradeoff-making itself stays human because tradeoffs are value-laden.
- **Implication:** D19 already encodes this as a principle. The gap is operational — there's no governance *process* yet (no cadence for reviewing AI authority decisions, no artifact collecting deviations or near-misses). Gartner's heatmap predicts this is durable human work at any level of maturity; worth investing in a lightweight governance cadence now rather than later.

### Cross-team leadership
- **Gartner at L4–L5:** mostly human, lightens only at L5 and only partially; AI helps with coordination artifacts (summaries, status, risk digests), humans hold the relational authority.
- **Implication for Eric:** at a solo shop, the direct analog is minimal, but the XRSize4 ALL platform embeds "cross-team-like" dynamics inside the product (coach ↔ athlete, gym ↔ member, creator ↔ audience, moderator ↔ group). Gartner's heatmap suggests these relational edges are where humans remain central in the platform's own operation. Product design implication: the platform should treat relational work (assigning, reviewing, intervening, disputing) as durably human-in-the-loop even as other surfaces (logging, analytics, reminders) go full-automation.

### Innovation and experimentation
- **Gartner at L4–L5:** shared responsibility; AI generates candidate ideas and evaluates them against evidence, humans select what's worth pursuing.
- **Implication:** this document is literally the flow Gartner describes. The productive pattern is already in use. Worth noting that L5 "innovation" in Gartner's frame does not mean AI innovates autonomously — it means AI generates, humans select, much faster.

**Attention-allocation takeaway.** All four rows say the same thing: human authority, AI acceleration. This is already Eric's de-facto stance. Naming it explicitly (in architecture.md or in a new governance doc) converts it from habit to policy and makes it defensible to outside observers.

## 7. Actions-and-Cautions playbook — mapped to Concept / XRSize4 ALL

### What's already done
- **Prerequisite + Step 1.** Concept Computing's workflow decomposition (WF-001–WF-006) *is* the "start with workflows" move. The flows in `xrsize4all_concept.md` §Process (training, coaching, instruction, content, community, commerce, safety, governance, AI) enumerate process categories at the platform level. Lifting Tracker's user stories (`user-stories.md`) enumerate at the sub-system level.
- **Step 2 (human-AI allocation).** D19 Reasoner Duality allocates decisions to deterministic logic and narration to LLM; the xrsize4all_concept.md AI-Agent-as-Participant section allocates authority classes (observe / suggest / automate routine / may-not-decide). Together these are the job-deconstruction Gartner is asking for, at architectural rather than HR granularity.
- **Step 2 (heatmap).** Not formalized but §5 above is a first pass.

### What's latent and worth naming
- **Step 3 capability portfolio.** For a solo shop, this translates to "named skill paths Eric is developing" — e.g., agent orchestration patterns, ontology design, governance process design, AI architecture. Worth a short living doc, not because Eric will switch jobs but because it clarifies where to spend discretionary study time.
- **Step 4 org organization.** At the product level, this is the agent-role decomposition already in xrsize4all_concept.md. At the shop level, it's "which agent sessions are for what" — arguably Concept Computing already names this, but it's not codified in `lifting-tracker`.

### What's not in the current design
- **Step 5 activation signals.** No stretch-monitoring mechanism for either Eric or the agents. The D19 Authority Rule is the *policy* that agents should not over-reach; there is no *signal* that tells Eric when over-reach is happening. Candidate artifact: a small "Tier 2 concern log" — interactions where Tier 2 output was accepted in a way that Tier 1 couldn't confirm, flagged for later review. This is the Step 5 analog most portable to Eric's solo context.
- **An orchestration artifact.** Gartner's heatmap treats AI automation orchestration as a durable human capability. Eric does it by hand. Consider a `docs/orchestration.md` naming the patterns in use (Cowork for architecture/research, Claude Code for in-repo work, how context moves between them, when each is the right choice, failure modes observed). This is the artifact Gartner's Step 3 would produce for a team; for a solo shop it produces the same value with less ceremony.

## 8. Open questions and principled divergences

- **Autonomy as the ladder's axis.** Gartner measures progress by how much the human gets out of the loop. D19 Reasoner Duality *refuses* to maximize that on consequential decisions. This is not a maturity lag; it's a deliberate architectural stance in a health-adjacent domain. Flag where Eric talks about maturity: the correct framing is "L4 with authority-preserving cap," not "almost L5." DIVERGENCE — PRINCIPLED.
- **LLM-centricity.** Gartner's framing treats "AI" as GenAI + agents (footnote on IMG_5428). Concept Computing adds a formal-ontology layer (PACO / EXMO / KHMO / FoodOn / CMO-inspired). Gartner's framework has no vocabulary for "the AI system also has a non-LLM formal-semantic layer." This is an EXTENDS-US position. When comparing frameworks, be careful not to retrofit the ontology layer into Gartner's LLM-centric buckets.
- **Unit of analysis.** Gartner writes for CIOs redesigning teams of engineers. Eric is one engineer redesigning one job. The framework ports partially — heatmap and ladder port well; Step 4 (organize teams) ports poorly; Step 3 (capability portfolio) ports with reframing. Beware using Gartner's HR-oriented steps as if they were technical architecture steps.
- **Scale assumption.** Gartner assumes scale generates the need for agent-to-agent interop (many engineers, many workflows, coordination overhead). A solo shop with 24/7 Claude has some of the same interop needs (Cowork session ↔ Claude Code session ↔ shared repo) at a smaller scale. The interop problem is real at both scales but the economics of investment are different.
- **What Gartner doesn't address that Eric needs.** (a) Cost/economics of running L4 on a solo budget. (b) How to keep a single human architect's mental model in sync with a code base that agents can modify faster than the human reads. (c) How to audit trust in agent outputs over time. These are visible gaps relative to what the screenshots cover; they may be addressed in the parent document or in neighbor Gartner research.

## 9. Follow-up research suggestions

Prioritized for Eric's use:

1. **Gartner 7586633 — Maturity Model for AI-Native Software Engineering.** Likely the closest complement to the material in the screenshots. If accessible, it should contain the evaluation criteria behind the L1–L5 labels and a self-assessment instrument.
2. **Gartner 6076795 — Innovation Insight for AI-Native Software Engineering.** The foundational piece; likely introduces the "AI-native" definition and scope.
3. **Gartner 6888866 — Innovation Insight: AI Agent Development Frameworks.** Relevant to the L4 → L5 interop question (Section 4, Q4). Likely discusses the protocols, runtimes, and patterns Gartner expects to mature.
4. **Gartner 6852666 — Software Engineering Foundations for the AI-Native Era.** Likely covers the platform/operational prerequisites (API integration, data, modern data architecture, adaptive practices, rapid deployment) that Eric's L2 ops rows would lean on.
5. **Gartner 7304830 — A CIO's Guide to Redesigning the Software Engineer Job in the Age of AI.** The screenshots' parent. If accessible, should contain the full L1–L5 descriptions, the full heatmap with cell-level commentary, and full Actions/Cautions text.

Non-Gartner follow-ups worth considering:
- Academic or vendor research on multi-agent interop protocols (A2A, MCP, etc.) as they relate to Gartner's L5 interop claim.
- Anthropic's own writing on agent patterns (Eric already has `anthropic-engineering-patterns-review.md` in this reference folder — compare findings).
- Operational governance patterns for AI in regulated/health-adjacent domains — a principled floor on autonomy is a specific literature worth checking (ISO/IEC 42001 AI management systems, NIST AI RMF).

---

© 2026 Eric Riutort. All rights reserved.
