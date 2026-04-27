---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# Grok — Agentic AI Landscape Findings

Capture of the Grok session Eric ran in parallel to the Cowork-side `agentic-ai-landscape-scan.md`, the Gemini Deep Research runs (PDF + Chrome), and the ChatGPT run (`docs/reference/chatgpt-agentic-ai-findings.md`). Fifth data point in a five-way ecosystem-scan comparison.

> **Scope note.** Grok was accessed via Eric's authenticated X session at `x.com/i/grok`; `grok.com` is not authenticated in his Chrome and was not used. The `DeepSearch`/`Deeper` mode asked about in the task brief does not exist on the `x.com/i/grok` surface — only `Auto`, `Fast`, and `Expert`. The closest-equivalent Expert mode ("thinks hard") failed the research prompt three times with a backend-error banner. `Fast` mode produced the successful replies captured here. One follow-up completed; a second follow-up stalled with zero output and was aborted; a third was held back per the degradation-stop rule in the task brief.

> **Copyright note.** Grok output is paraphrased throughout. Under-15-word quotes in quotation marks only where a specific phrasing is the identifying handle.

---

## 1. Executive Summary

- **Grok surfaced 82 distinct URLs across the initial reply and one completed follow-up.** Above the 40-source verification threshold. Coverage is meaningfully different from ChatGPT's: richer on design-patterns literature and protocols/standards; thinner on per-ecosystem depth, benchmarks, and practitioner operators.
- **Grok Fast is the only mode that worked for this prompt.** Expert mode (the task-brief-preferred DeepSearch equivalent) failed three times. Auto mode failed twice. Fast succeeded after a page reload and a fresh chat. **This is a material asymmetry vs. Gemini Deep Research and the ChatGPT run** — Grok's deep/expert surface was not usable, so this capture is from the quickest tier.
- **Strongest area: design-patterns literature.** Grok named the Springer "Agentic Design Patterns" book, a YouTube "Master ALL 20 Agentic AI Design Patterns" course, an interactive `zeljkoavramovic/agentic-design-patterns` GitHub tutorial, MongoDB's 7-pattern blog, KDnuggets, Daily Dose of DS, Towards AI, and AWS's prescriptive-guidance patterns — a cluster neither ChatGPT nor (per the PDF) Gemini emphasized.
- **Strongest follow-up recovery: protocols/standards layer.** The follow-up produced canonical URLs for MCP (`modelcontextprotocol.io/specification/latest`, the spec GitHub, reference servers, the MCP Registry, `awesome-mcp-servers`), A2A (`a2a-protocol.org` + `github.com/a2aproject/A2A` with Python SDK + samples), AG-UI (`github.com/ag-ui-protocol/ag-ui` + `docs.ag-ui.com`), AAIF (`aaif.io`, `github.com/aaif`, the Linux Foundation press release, Anthropic's donation post), and OpenTelemetry GenAI semantic conventions (per-section specs for agent spans, GenAI events, spans, metrics, and the attribute registry). **This recovery inverts Grok's initial weakness and makes the standards coverage comparable to or stronger than ChatGPT's.**
- **Per-ecosystem weaknesses unchanged by the follow-ups.** Perplexity first-party URLs were never surfaced (one Medium tutorial is the entire footprint — no `docs.perplexity.ai`, no Sonar API, no Comet). xAI first-party URLs stayed at one (`x.ai/news/grok-4-1-fast`) plus one third-party tutorial — `docs.x.ai`, Agent Tools API specific page, PyPI SDK, Cloudflare AI Gateway all still absent. A planned follow-up #2 targeting exactly these gaps stalled with zero output and was aborted.
- **Signals worth flagging.** (a) Grok displayed `Searching the web — 0 results` at the top of both replies despite producing 50 and 77 citation chips respectively — the "0 results" appears to reference a specific sub-query failure, not the overall retrieval. (b) The Springer book ISBN-suggestive URL (`10.1007/978-3-032-01402-3`) resolves but verify the edition/date before citing. (c) `github.com/aaif` appeared in Grok's output as the AAIF GitHub org — the actual Linux Foundation AAIF landing page is `aaif.io`; the GitHub slug should be verified (Grok said "github.com/aaif" which is unusual; the AAIF project may live under a different GitHub org).

---

## 2. Access Log

| URL / surface | Status | Notes |
|---|---|---|
| `https://grok.com/` | **Auth wall** | Sign in / Sign up visible. Eric's cookies not present on `grok.com`. DeepSearch / Deeper mode (equivalent to Gemini Deep Research) is gated behind this login. Per task instructions, no credentials entered. |
| `https://x.com/i/grok` | **Authenticated as @RiutortEric** | Primary research surface. Mode options: `Auto`, `Fast`, `Expert`. No DeepSearch / Deeper mode on this surface. |
| x.com Grok — **Expert mode** | **Failed 3×** | Each of three attempts returned `Sorry about that, something didn't go as planned. Please try again, and if you're still seeing this message, go ahead and restart the app.` Regenerate also failed. |
| x.com Grok — **Auto mode** | **Failed 2×** | Same banner. A sanity test prompt ("What is machine learning?") succeeded in Auto, ruling out account-level block. |
| x.com Grok — **Fast mode** | **Initial attempts failed with `Grok was unable to reply. Something went wrong…` + `Retry`. After page reload + new chat + Fast mode: SUCCESS.** | 9,190 chars of prose + 50-URL citation panel. A `Searching the web — 0 results` banner preceded the reply; the reply was nonetheless comprehensive and cited 50 URLs. |
| x.com Grok — **Fast mode — follow-up #1 (protocols/standards)** | **Success** | 8,091 chars of new prose + 77-URL citation panel (≈32 genuinely new; the rest overlap with the initial 50). The response streamed completely including a "How These Fit into Agentic AI Design" synthesis. |
| x.com Grok — **Fast mode — follow-up #2 (Perplexity + xAI first-party docs)** | **Stalled — zero output** | Prompt accepted into the conversation log; "still generating" indicator appeared for >90 s with 0 new chars of prose and no new citation panel. Cancel + reload confirmed no reply was persisted. **Aborted per the task-brief degradation-stop rule.** |
| x.com Grok — **Fast mode — follow-up #3** | **Held back** | Not sent. Rationale: follow-up #2 produced zero output, which matches the ChatGPT-precedent degradation signal ("held back 2 of 3 follow-ups when free-tier rate limit hit"). |
| x.com Grok citation dialogs | OK | Both dialogs scraped via DOM (`[role="dialog"] a[href]`). URLs harvested as `origin + pathname`; tracking params stripped. |

**Mode-asymmetry note.** The task brief asked for DeepSearch/Deeper mode as the apples-to-apples comparator for Gemini Deep Research. On `x.com/i/grok` that mode is absent; Expert is the closest tier and it failed on this prompt. The capture here is from `Fast` — a lower-effort tier. This should be borne in mind when diffing depth of analysis against the Gemini or ChatGPT runs: **Grok's best-available mode for this account was not used because its best-available mode refused the prompt.**

---

## 3. Captured Conversation

### Turn 1 — Eric's prompt (sent verbatim with bracket normalizations shown literally)

> "I want to conduct a deep research [task] identifying all of the current sources of discussion on how to create agentic AI systems, software, etc., including those for OpenAI, Anthropic, Gemini, Perplexity, Gro[c]k, or other LLM systems that are used to creat[e] agents. These are code examples, design patterns, use cases, discussion threads, training sessions, online classes, blogs, etc. These may be found in multiple sources."

Sent first with literal brackets (`[task]`, `Gro[c]k`, `creat[e]`). When Auto and Expert failed, one variant was also tried with brackets stripped (same failure). Fast mode produced the successful reply on the bracketed version after page reload.

### Turn 1 — Grok Fast reply (paraphrased)

Opens with a one-paragraph framing: agentic AI = LLM-powered systems doing reasoning, tool use, planning, reflection, multi-agent collaboration, and workflows. Canonical patterns: ReAct, reflection, Tree-of-Thoughts, routing, parallelization, tool calling, memory management, HITL, multi-agent orchestration. Then fans out:

1. **General Frameworks and Design Patterns.** LangChain + LangGraph (LangChain Academy free course, YouTube tutorials, pattern coverage via KDnuggets); LlamaIndex (data-aware agents, `developers.llamaindex.ai` "Building an agent" page); CrewAI (role-based multi-agent "crews," quick-prototype positioning); AutoGen (multi-agent conversations, now unified in Microsoft Agent Framework); Semantic Kernel (enterprise, .NET/Python/Java, compliance-heavy use cases). Pattern-resources cluster: MongoDB "7 Design Patterns for Agentic Systems" (Medium + MongoDB docs), `zeljkoavramovic/agentic-design-patterns` GitHub tutorial (29 patterns), YouTube "Master ALL 20 Agentic AI Design Patterns," Springer "Agentic Design Patterns" book (LangChain/LangGraph, CrewAI, Google ADK code), AWS prescriptive-guidance patterns, KDnuggets / Daily Dose of DS / Machine Learning Mastery pattern posts, r/AI_Agents threads.

2. **OpenAI-specific.** Swarm (educational multi-agent with handoffs, routines, context variables) via `github.com/openai/swarm` (basic, `triage_agent`, `weather_agent`, airline multi-agent examples). Tutorials: Medium step-by-step, YouTube intros with Colab code, FutureSmart.ai hands-on intro. Assistants API + function calling are named as the foundation.

3. **Anthropic-specific.** `anthropic.com/research/building-effective-agents` (Anthropic's customer-pattern research post); `platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent` (calendar agent in five concentric rings); Claude Code / Claude Agent SDK via a dabit3 GitHub gist; `anthropic.com/engineering/writing-tools-for-agents`; MCP named as Anthropic's tool-integration protocol.

4. **Google Gemini-specific.** `docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system`; `blog.google` Gemini-3 examples post; freeCodeCamp "Build a Python Coding Agent with Gemini"; `medium.com/google-cloud` "Build an AI Agent with Gemini CLI and ADK"; `developers.google.com/gemini-code-assist` agent-mode docs; `ai.google.dev/gemini-api/docs/coding-agents` MCP + Skills.

5. **Perplexity-specific.** Single Medium tutorial "Build a Perplexity Research Analyst Agent in 15 Minutes" paired with n8n / Make.com automation. No first-party `docs.perplexity.ai` URL.

6. **xAI Grok-specific.** `x.ai/news/grok-4-1-fast` (Grok 4.1 Fast + Agent Tools API announcement); `getstream.io/blog/xai-python-multi-agent` (multi-agent tutorial with Grok + Cursor + Agno); YouTube breakdowns of a "4-agent architecture"; a LangGraph dental-appointment example with supervisor routing; simple finance agents in ~20 lines with yfinance / Phidata.

7. **Additional Frameworks and Comparisons.** Microsoft Agent Framework (AutoGen + Semantic Kernel unified); iswift.dev "Top 5 AI Agent Frameworks" + codetocloud.io "Microsoft Agent Frameworks Compared" as the comparison articles; Akka "Agentic AI In Action" webinar (event-driven scalable agents).

8. **Where to Find Ongoing Discussions.** GitHub (search "agentic design patterns," `openai/swarm`, LangGraph examples, MongoDB GenAI Showcase); YouTube (search "agentic AI patterns course," "LangGraph tutorial 2026," "Claude Agent SDK workshop"); Medium / Towards AI / KDnuggets; Reddit r/AI_Agents + r/MachineLearning; LinkedIn guides; vendor docs (LangChain/LangGraph academy, Anthropic platform docs, Google AI Studio/ADK, xAI API, Perplexity API).

9. **Books / Courses.** Springer "Agentic Design Patterns" (the one book named); Codecademy "How to Build Agentic AI with LangChain and LangGraph."

10. **Tips for Deep Research.** Patterns first (ReAct, reflection, multi-agent) → pick a framework (LangGraph for control, CrewAI for fast start) → integrate one LLM's tools/API → test tool-calling loops before scaling → address observability/error-handling/cost/human-oversight. Final nudge: "check GitHub stars/trends, LangChain's 'State of Agent Engineering' reports, and vendor blogs."

**Footer.** `88 web pages` link (opens the citation panel — 50 unique URLs harvestable), two suggestion chips: `Deep dive into LangGraph patterns` and `Explore multi-agent collaboration use cases`.

---

## 4. Follow-up Exchanges

### Follow-up #1 — protocols / standards gap (SENT; reply succeeded)

**Gap this closes.** The initial reply mentioned MCP only as a phrase inside the Anthropic and Gemini sections. No A2A, no AG-UI, no Agentic AI Foundation, no OpenTelemetry Gen AI semantic conventions, no MCP Registry, no awesome-mcp-servers. This is the entire area where ChatGPT was strongest — closing it makes the five-way diff much more useful.

**Prompt I sent (in Eric's voice):**

> "Follow-up on the same brief. Your first answer skipped the whole protocols and standards layer. Please go deep: Model Context Protocol (MCP) spec URL, Agent-to-Agent (A2A) protocol, AG-UI, the Agentic AI Foundation under the Linux Foundation, OpenTelemetry's Gen AI semantic conventions. Give actual canonical URLs (spec pages, GitHub repos, foundation landing pages), not just brand names. Also cover the MCP Registry and awesome-mcp-servers if they exist."

**Grok reply (paraphrased).**

Opens with a frame — the protocols layer complements frameworks and model APIs; standards reduce glue code, enable reusable components, and support security/discovery/monitoring. Five named protocols/standards:

- **MCP.** Client-server with JSON-RPC 2.0; primitives = Tools, Resources, Prompts (server) + Roots, Sampling (client). Originally Anthropic, late 2024; de-facto adopted. Canonical URLs: `modelcontextprotocol.io`, `modelcontextprotocol.io/specification/latest`, `modelcontextprotocol.io/specification/2025-11-25` (versioned), `github.com/modelcontextprotocol/modelcontextprotocol` (spec + TS schema), `github.com/modelcontextprotocol/servers` (reference servers — GitHub, Slack, Postgres, Puppeteer, etc.), SDKs in TS, Python, Java, Kotlin, C#. Noted security features: OAuth for remote servers.

- **MCP Registry + awesome lists.** Official MCP Registry = community "app store" with REST API, DNS-based namespace verification, `server.json` schema. `registry.modelcontextprotocol.io`, `github.com/modelcontextprotocol/registry`. Popular awesome lists: `github.com/punkpeye/awesome-mcp-servers` (curated list, with searchable catalog at `mcpservers.org`); forks by appcypher, wong2, etc.

- **A2A.** Open protocol for agent-to-agent interoperability across frameworks/vendors. Client-server, JSON-RPC + optional gRPC. Capabilities exposed via "Agent Cards"; manages task lifecycles. Canonical: `a2a-protocol.org`, `a2a-protocol.org/latest/specification/`, `github.com/a2aproject/A2A`, `github.com/a2aproject/a2a-python`, `github.com/a2aproject/a2a-samples`. Framing: "often discussed alongside MCP for full agentic stacks."

- **AG-UI.** Lightweight, event-based protocol for real-time bidirectional comms between agent backends and user-facing frontends. Uses SSE / WebSockets; ~26 standard event types. Canonical: `github.com/ag-ui-protocol/ag-ui`, `docs.ag-ui.com`. Noted integrations: CopilotKit, Semantic Kernel, various runtimes.

- **Agentic AI Foundation (AAIF).** Directed fund under the Linux Foundation, launched December 2025. Founding contributions: Anthropic MCP, Block goose (agent tooling), OpenAI AGENTS.md. Canonical: `aaif.io`, `linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation`, `github.com/aaif` (Grok's claim — see §1 flag; verify this slug).

- **OpenTelemetry GenAI Semantic Conventions.** Traces/metrics/events/spans for LLMs, agents, frameworks. Standardizes attributes (`gen_ai.operation.name`, `gen_ai.request.model`, tool calls, agent spans). Canonical: `opentelemetry.io/docs/specs/semconv/gen-ai/` (root), agent-spans page, events page, spans page, metrics page, attribute registry, plus `github.com/open-telemetry/semantic-conventions`.

**Synthesis close — "How These Fit into Agentic AI Design."**

- MCP → Tools / Context layer (agent ↔ external systems/data)
- A2A → Collaboration layer (agent ↔ agent)
- AG-UI → Interaction layer (agent ↔ user/UI)
- AAIF → Governance for the ecosystem
- OpenTelemetry GenAI → Observability across all layers

Plus: "Together with model APIs (function/tool calling from OpenAI, Anthropic, Gemini, Grok/xAI, etc.), they form a composable stack." Example given: a LangGraph-based agent using MCP servers for tools, A2A for sub-agents, AG-UI for a frontend, and OpenTelemetry for tracing.

**Footer.** `77 web pages` citation panel (≈32 genuinely new URLs vs. the initial 50; the rest overlap). Ended with an offer to deep-dive any one protocol. Mode: `Fast`.

### Follow-up #2 — Perplexity + xAI first-party docs (SENT; reply stalled; aborted)

**Gap.** The initial reply gave Perplexity one paragraph (one Medium tutorial URL) and xAI one paragraph (one `x.ai/news/grok-4-1-fast` URL + one third-party tutorial). Canonical dev-docs roots (`docs.perplexity.ai`, `docs.x.ai`) absent for both — despite both ecosystems being explicitly named in Eric's original prompt.

**Prompt I sent:**

> "One more follow-up. Two ecosystems I specifically named in my original prompt — Perplexity and Grok/xAI — got one paragraph each in your first answer. Please go deep on each, with canonical first-party URLs: Perplexity's developer docs (docs.perplexity.ai), Sonar API reference, agent/agentic-research endpoints, Comet browser, any changelog/launch posts. For xAI: docs.x.ai root, API reference, Agent Tools API specific page, Grok 4.1 Fast changelog, Grok Voice Agent, PyPI SDK package, Cloudflare AI Gateway integration. Actual URLs only, not brand names."

**What came back.** The prompt was accepted into the conversation log (verified via DOM). The "still generating" indicator appeared and persisted for 90+ seconds. Zero new prose was rendered. No new citation panel appeared. The Cancel button was clicked; after a page reload, the conversation contained the prompt but no reply attached to it.

**Interpretation.** Either (a) a transient Grok-side backend failure on this specific sub-query — consistent with the "Searching the web — 0 results" banner that preceded every reply in this session — or (b) a quiet refusal to enumerate canonical competitor URLs when the question is framed as "go deep on competitors named in my prompt." Either way, the signal matches the task-brief degradation trigger.

**Decision.** Aborted. Not retried.

### Follow-up #3 — practitioner operators / books / podcasts / benchmarks (HELD BACK)

**Planned gap.** Named practitioners (Willison, Husain, Liu, Lambert, Huyen, Karpathy, Ng), books beyond Springer, podcasts (Latent Space, Interconnects, TWIML, Cognitive Revolution), newsletters beyond vague "check LangChain's reports," specific benchmarks (SWE-bench Verified, GAIA, WebArena, OSWorld, τ²-bench, Terminal-Bench, BFCL), academic venues (NeurIPS/ICLR/COLM/ACL/ICML).

**Decision.** Not sent. Per the task-brief rate-limit/degradation stop rule (ChatGPT precedent: held back 2 of 3 follow-ups), the empty output on follow-up #2 was a stop signal. Pushing a third prompt would most likely produce either another empty reply or a stall, with no upside. This gap is preserved and will be closed by cross-referencing against the Cowork-side scan and the ChatGPT run at comparison time.

---

## 5. Aggregated Sources

Master list of URLs harvested from both citation dialogs plus inline canonical URLs in the follow-up prose. 82 distinct URLs total. Tracking params stripped; paths normalized to `origin + pathname`.

### 5.1 Anthropic

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Introducing the Model Context Protocol | https://www.anthropic.com/news/model-context-protocol | docs / launch post | 2024 | Canonical MCP launch post. | HIGH. |
| Building Effective AI Agents (research) | https://www.anthropic.com/research/building-effective-agents | blog | 2024/25 | Seminal Anthropic post — customer implementations, SWE-bench coding agents. | HIGH. |
| Writing effective tools for AI agents | https://www.anthropic.com/engineering/writing-tools-for-agents | blog | 2025 | Tool evaluation and optimization with Claude Code. | HIGH. |
| Donating the Model Context Protocol and establishing of the Agentic AI Foundation | https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation | news / launch post | Dec 2025 | Anthropic's own post on donating MCP to AAIF. | HIGH. |
| Code execution with MCP: building more efficient AI agents | https://www.anthropic.com/engineering/code-execution-with-mcp | blog | 2025/26 | MCP-centric efficient-agent patterns. | HIGH. |
| Tutorial: Build a tool-using agent (Claude API Docs) | https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent | docs | active | Calendar-management agent in five concentric rings with cURL/Python/TS. | HIGH. |
| GitHub Gist (dabit3) — Building AI agents with the Claude Agent SDK | https://gist.github.com/dabit3/93a5afe8171753d0dbfd41c80033171d | code | n/a | Practitioner walk-through of the Claude Agent SDK. | MED. |
| Medium (Ajay Arunachalam) — Anthropic's Claude Agents: simple multi-agent demo | https://ajay-arunachalam08.medium.com/anthropics-claude-agents-simple-demo-of-building-powerful-ai-multi-agents-using-claude-model-3945fb7d13f2 | blog | n/a | Multi-agent demo using Claude. | LOW–MED. |
| Medium (Alireza Rezvani) — Claude Agent SDK Playbook | https://alirezarezvani.medium.com/the-claude-agent-sdk-builders-playbook-build-your-first-autonomous-agent-in-30-minutes-88a1952f637e | blog | n/a | SDK build guide. | LOW–MED. |
| Dev.to (Dextralabs) — How to Build an AI Agent from Scratch Using Claude API | https://dev.to/dextralabs/how-to-build-an-ai-agent-from-scratch-using-claude-api-with-full-code-4b40 | blog | n/a | Full-code three-tool agent example. | MED. |
| Medium (Richard Hightower) — Set up Git MCP with Claude Desktop | https://medium.com/@richardhightower/anthropics-mcp-set-up-git-mcp-agentic-tooling-with-claude-desktop-beceb283a59c | blog | n/a | MCP-with-Claude-Desktop walkthrough. | LOW–MED. |
| Facebook group — Guide to building AI agents with Claude | https://www.facebook.com/groups/viettechies/posts/1508533647264976/ | forum | n/a | Community guide on Claude Code + agents. | LOW. |
| Medium (Vardhman Android) — How I Built My First Agentic AI | https://vardhmanandroid2015.medium.com/how-i-built-my-first-agentic-ai-and-finally-understood-what-it-means-6526f2f9a03c | blog | n/a | Beginner-POV Python assistant build. | LOW. |

### 5.2 OpenAI

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| openai/swarm (GitHub) | https://github.com/openai/swarm | code | active | Canonical Swarm repo with `triage_agent`, `weather_agent`, airline multi-agent examples. | HIGH. |
| Medium (Pankaj Pandey) — Building Agents from Scratch using OpenAI Swarm | https://medium.com/@pankaj_pandey/building-agents-from-scratch-using-openai-swarm-framework-a-simple-guide-for-developers-6fe46a620900 | blog | n/a | Step-by-step Swarm tutorial. | MED. |
| FutureSmart AI — OpenAI Swarm: A Hands-On Introduction | https://blog.futuresmart.ai/openai-swarm-a-hands-on-introduction | blog | n/a | Hands-on Swarm walk-through. | MED. |
| Galileo — OpenAI Swarm Framework Guide | https://galileo.ai/blog/openai-swarm-framework-multi-agents | blog | n/a | Production-failure-avoidance framing. | MED. |
| Dev.to (vishalmysore) — Swarm AI Agents with Java and OpenAI | https://dev.to/vishalmysore/swarm-ai-agents-with-java-and-openai-384e | blog | n/a | Java port of Swarm concepts. | LOW–MED. |
| Class Central — Introducing Swarm (YouTube course listing) | https://www.classcentral.com/course/youtube-introducing-swarm-with-code-examples-openai-s-groundbreaking-agent-framework-352913 | course | n/a | Aggregator listing for a Swarm YouTube course. | LOW–MED. |
| Analytics Vidhya — Managing Multi-Agent Systems (2024/12) | https://www.analyticsvidhya.com/blog/2024/12/managing-multi-agent-systems | blog | 2024-12 | Multi-agent management primer. | MED. |

### 5.3 Google / Gemini / DeepMind

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Google Cloud — Choose a design pattern for your agentic AI system | https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system | docs | active | Google's first-party pattern-selection guide. | HIGH. |
| The Keyword (blog.google) — 15 examples of what Gemini 3 can do | https://blog.google/products-and-platforms/products/gemini/gemini-3-examples-demos/ | blog | 2025/26 | Gemini 3 agentic-coding demo cluster. | HIGH. |
| Google Developers Blog — Real-world agent examples with Gemini 3 | https://developers.googleblog.com/real-world-agent-examples-with-gemini-3/ | docs / blog | 2025/26 | Production-style Gemini 3 agent examples (Agno, Eigent, Letta, Browser Use integrations). | HIGH. |
| Google Developers — Use the Gemini Code Assist agent mode | https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer | docs | active | Agent-mode configuration for pair programming. | HIGH. |
| Google AI for Developers — Set up your coding assistant with Gemini MCP and Skills | https://ai.google.dev/gemini-api/docs/coding-agents | docs | active | First-party Gemini MCP + Skills guidance. | HIGH. |
| freeCodeCamp — Build an AI Coding Agent with Python and Gemini | https://www.freecodecamp.org/news/build-an-ai-coding-agent-with-python-and-gemini/ | blog | n/a | "Basic Claude Code" clone on the free Gemini API. | HIGH. |
| Medium (Google Cloud) — Build an AI Agent with Gemini CLI and ADK | https://medium.com/google-cloud/build-an-ai-agent-with-gemini-cli-and-agent-development-kit-bca4b87c9a35 | blog | n/a | Gemini CLI + ADK tutorial. | MED. |

### 5.4 Perplexity

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Medium (gbouslov) — Build a Perplexity Research Analyst Agent in 15 Minutes | https://medium.com/@gbouslov/build-a-perplexity-research-analyst-agent-in-15-minutes-11f8fd540102 | blog | n/a | The only Perplexity-specific URL Grok surfaced. Compare to ChatGPT's 5 first-party `docs.perplexity.ai` URLs. | LOW–MED. |

_(See §6 Gaps for Perplexity coverage that was targeted but not recovered.)_

### 5.5 xAI / Grok

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| xAI — Grok 4.1 Fast news post | https://x.ai/news/grok-4-1-fast | docs / announcement | 2025/26 | Grok 4.1 Fast + Agent Tools API first-party announcement. Only first-party xAI URL Grok surfaced. | HIGH. |
| GetStream.io — xAI Grok + Cursor + Agno: Build a Multi-Agent AI App in Python | https://getstream.io/blog/xai-python-multi-agent/ | blog | n/a | Third-party multi-agent tutorial using Grok. | MED. |

_(See §6 Gaps. `docs.x.ai` canonical dev root not surfaced by Grok. Compare to ChatGPT, which had it.)_

### 5.6 Multi-vendor standards & protocols (recovered via follow-up #1)

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Model Context Protocol — root site | https://modelcontextprotocol.io/ | standard / docs | active | Canonical MCP landing / docs. | HIGH. |
| MCP — latest specification | https://modelcontextprotocol.io/specification/latest | standard / spec | active | Latest spec page. | HIGH. |
| MCP — 2025-11-25 versioned spec | https://modelcontextprotocol.io/specification/2025-11-25 | standard / spec | 2025-11-25 | Dated snapshot of the spec. | HIGH. |
| MCP — spec + schema GitHub | https://github.com/modelcontextprotocol/modelcontextprotocol | code / spec | active | Spec source and TypeScript schema. | HIGH. |
| MCP — reference servers repo | https://github.com/modelcontextprotocol/servers | code | active | GitHub, Slack, Postgres, Puppeteer, etc. reference servers. | HIGH. |
| MCP org landing | https://github.com/modelcontextprotocol | code | active | Organization overview and SDK list. | HIGH. |
| MCP Registry | https://registry.modelcontextprotocol.io/ | registry / docs | 2025/26 | Community "app store" with REST API and DNS namespace verification. | HIGH. |
| MCP Registry GitHub | https://github.com/modelcontextprotocol/registry | code | active | Registry implementation + `server.json` schema. | HIGH. |
| awesome-mcp-servers (punkpeye) | https://github.com/punkpeye/awesome-mcp-servers | code / aggregator | active | Most-cited curated list of MCP servers. | HIGH. |
| MCP servers catalog | https://mcpservers.org/ | aggregator | active | Searchable catalog paired with the `punkpeye` list. | MED. |
| A2A — protocol site | https://a2a-protocol.org/ | standard / docs | 2025/26 | A2A landing page. | HIGH. |
| A2A — latest specification | https://a2a-protocol.org/latest/specification/ | standard / spec | 2025/26 | Canonical A2A spec page. | HIGH. |
| A2A — core GitHub | https://github.com/a2aproject/A2A | code / spec | active | A2A repo with spec and docs. | HIGH. |
| A2A — project org | https://github.com/a2aproject | code | active | A2A org overview. | HIGH. |
| A2A — specification.md (main branch) | https://github.com/a2aproject/A2A/blob/main/docs/specification.md | spec | active | Spec markdown rendered on GitHub. | HIGH. |
| A2A — Python SDK | https://github.com/a2aproject/a2a-python | code / SDK | active | Official A2A Python SDK. | HIGH. |
| A2A — samples repo | https://github.com/a2aproject/a2a-samples | code / examples | active | Sample A2A implementations. | HIGH. |
| A2A — Server API Specification Format (issue) | https://github.com/a2aproject/A2A/discussions/102 | forum | 2025/26 | Community-discussion thread on A2A server-API spec format. | MED. |
| A2A directory — TypeScript guide | https://github.com/sing1ee/a2a-directory/blob/main/docs/a2a-typescript-guide.md | code / docs | n/a | Community TS guide to A2A. | MED. |
| Agent-to-Agent (A2A) Protocol Implementation (sap156) | https://github.com/sap156/Agent-to-Agent-A2A-Protocol-Implementation | code | n/a | Practical A2A implementation example. | MED. |
| Searce blog — A2A with Jira and GitHub | https://blog.searce.com/building-an-agentic-system-with-googles-a2a-protocol-jira-and-github-integration-aedde4ca71cc | blog | 2025/26 | A2A integration walkthrough. | MED. |
| Hermes-agent — A2A feature request (Nous Research) | https://github.com/NousResearch/hermes-agent/issues/514 | forum | 2025/26 | Downstream-framework A2A-support request. | MED. |
| AG-UI — protocol GitHub | https://github.com/ag-ui-protocol/ag-ui | code / spec | active | AG-UI repo and docs. | HIGH. |
| AG-UI — org | https://github.com/ag-ui-protocol | code | active | AG-UI organization. | HIGH. |
| AG-UI — docs site | https://docs.ag-ui.com/ | docs | active | Canonical AG-UI documentation. | HIGH. |
| AG-UI — Open Agent Spec integration (issue #828) | https://github.com/ag-ui-protocol/ag-ui/issues/828 | forum | 2025/26 | Open Agent Spec integration discussion. | MED. |
| AG-UI — Semantic Kernel integration guide | https://github.com/MicrosoftDocs/semantic-kernel-docs/blob/main/agent-framework/integrations/ag-ui/getting-started.md | docs | active | Microsoft Semantic Kernel ↔ AG-UI getting-started. | HIGH. |
| AG-UI — Spring AI discussion | https://github.com/spring-projects/spring-ai/discussions/5761 | forum | 2025/26 | AG-UI support in Spring AI. | MED. |
| AG-UI — AG-UI-4K (Kotlin) | https://github.com/Contextable/ag-ui-4k | code | n/a | Kotlin Multiplatform AG-UI client. | MED. |
| AG-UI — Microsoft agent-framework issue #2331 | https://github.com/microsoft/agent-framework/issues/2331 | forum | 2025/26 | AG-UI support in Microsoft Agent Framework. | MED. |
| AG-UI — benchmark (namastexlabs) | https://github.com/namastexlabs/agui-benchmark | code / benchmark | n/a | AG-UI protocol benchmark suite. | MED. |
| AG-UI — A2UI ↔ AG-UI (CopilotKit) | https://www.copilotkit.ai/blog/build-with-googles-new-a2ui-spec-agent-user-interfaces-with-a2ui-ag-ui | blog | 2025/26 | Google's A2UI spec compared/paired with AG-UI. | MED. |
| AG-UI — zediot guide | https://zediot.com/blog/ag-ui-protocol/ | blog | 2025/26 | AG-UI quick-start blog. | LOW–MED. |
| Agentic AI Foundation — landing page | https://aaif.io/ | foundation / docs | 2025/26 | AAIF home. | HIGH. |
| Agentic AI Foundation — GitHub org | https://github.com/aaif | code | active | Grok claims this is the AAIF org. **Verify slug** — may be under a different org. | MED (pending verify). |
| Linux Foundation — AAIF formation press release | https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation | news / foundation | Dec 2025 | Linux Foundation's announcement. | HIGH. |
| Linux Foundation — AAIF welcomes 97 new members | https://www.linuxfoundation.org/press/agentic-ai-foundation-welcomes-97-new-members | news / foundation | 2026 | Post-launch membership update. | HIGH. |
| Linux Foundation Training — Agentic AI 101 | https://trainingportal.linuxfoundation.org/courses/agentic-ai-101 | course | 2025/26 | Foundation-hosted course. | HIGH. |
| PRNewswire — Linux Foundation announces AAIF (anchored by MCP, Goose, AGENTS.md) | https://www.prnewswire.com/news-releases/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation-aaif-anchored-by-new-project-contributions-including-model-context-protocol-mcp-goose-and-agentsmd-302636897.html | news | Dec 2025 | Press-release-level AAIF announcement with project contributions. | HIGH. |
| Reddit r/linux — Linux Foundation announces AAIF | https://www.reddit.com/r/linux/comments/1piqmrc/linux_foundation_announces_the_formation_of_the/ | forum | Dec 2025 | Community discourse on AAIF formation. | MED. |
| Reddit r/linux — Anthropic donates MCP | https://www.reddit.com/r/linux/comments/1pidsib/anthropic_donates_model_context_protocol_mcp_to/ | forum | Dec 2025 | Community discourse on MCP donation. | MED. |
| LinkedIn — Swami Sivasubramanian on AAIF | https://www.linkedin.com/posts/swaminathansivasubramanian_linux-foundation-announces-the-formation-activity-7404226859636412417-2pTu | social / post | Dec 2025 | AWS-exec commentary on AAIF launch. | MED. |
| Credal — What is the Agentic AI Foundation (AAIF)? | https://www.credal.ai/blog/what-is-the-agentic-artificial-intelligence-foundation-aaif | blog | 2025/26 | Third-party explainer. | LOW–MED. |
| GitHub Blog — MCP joins the Linux Foundation (open-source maintainers) | https://github.blog/open-source/maintainers/mcp-joins-the-linux-foundation-what-this-means-for-developers-building-the-next-era-of-ai-tools-and-agents/ | blog | 2025/26 | GitHub blog take on MCP → LF. | HIGH. |
| InfoQ — Anthropic Publishes Model Context Protocol Specification | https://www.infoq.com/news/2024/12/anthropic-model-context-protocol/ | news | 2024-12 | InfoQ coverage of MCP launch. | MED–HIGH. |
| Black Hills InfoSec — Model Context Protocol | https://www.blackhillsinfosec.com/model-context-protocol/ | blog / security | 2025/26 | Security-POV MCP review. | MED. |
| GPT Trainer — Anthropic's Model Context Protocol (MCP) | https://gpt-trainer.com/blog/anthropic+model+context+protocol+mcp | blog | 2025/26 | Cross-agent-reuse framing of MCP. | LOW–MED. |
| Milvus — How Anthropic is evolving the MCP spec | https://milvus.io/ai-quick-reference/how-is-anthropic-supporting-or-evolving-the-model-context-protocol-mcp-spec | docs | 2025/26 | Vendor-hosted quick-reference on MCP governance. | LOW–MED. |
| YouTube — How To Use Anthropic's MCP | https://www.youtube.com/watch | video | n/a | MCP walkthrough (specific video ID not captured — YouTube watch URL only). | LOW–MED. |
| Stanford CS329T slides — Model Context Protocol (Yusuf Ozuysal) | https://web.stanford.edu/class/cs329t/slides/Model%20Context%20Protocol%20(%20Yusuf%20Ozuysal).pdf | course / slides | 2025/26 | Graduate-course MCP lecture slides. | HIGH. |
| OpenTelemetry — GenAI semantic conventions root | https://opentelemetry.io/docs/specs/semconv/gen-ai/ | standard / spec | active | OTel GenAI semconv root. | HIGH. |
| OpenTelemetry — GenAI agent / framework spans | https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/ | spec | active | Agent-specific OTel spans. | HIGH. |
| OpenTelemetry — GenAI events | https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/ | spec | active | GenAI event conventions. | HIGH. |
| OpenTelemetry — GenAI spans | https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/ | spec | active | GenAI span conventions. | HIGH. |
| OpenTelemetry — GenAI metrics | https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-metrics/ | spec | active | GenAI metrics conventions. | HIGH. |
| OpenTelemetry — GenAI attribute registry | https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/ | spec / registry | active | Attribute-level registry (`gen_ai.*` names). | HIGH. |
| OpenTelemetry — semantic-conventions GitHub | https://github.com/open-telemetry/semantic-conventions | code / spec | active | Source repo for all OTel semconv. | HIGH. |

### 5.7 Design patterns / cross-ecosystem analyst content

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Springer — Agentic Design Patterns (book) | https://link.springer.com/book/10.1007/978-3-032-01402-3 | book | 2025/26 | 21 essential patterns with LangChain/LangGraph, CrewAI, Google ADK code. The one named book. | HIGH. |
| MongoDB (Medium) — 7 Design Patterns for Agentic Systems You NEED to Know | https://medium.com/mongodb/here-are-7-design-patterns-for-agentic-systems-you-need-to-know-d74a4b5835a5 | blog | n/a | Canonical 7-patterns reference cited repeatedly. | MED. |
| MongoDB — 7 Practical Design Patterns for Agentic Systems | https://www.mongodb.com/resources/basics/artificial-intelligence/agentic-systems | blog / docs | n/a | MongoDB-first-party version of same 7 patterns. | MED. |
| KDnuggets — 5 Essential Design Patterns for Robust Agentic AI | https://www.kdnuggets.com/5-essential-design-patterns-for-building-robust-agentic-ai-systems | blog | 2025/26 | Five-pattern framing inside the LangGraph section. | MED. |
| zeljkoavramovic/agentic-design-patterns (GitHub) | https://github.com/zeljkoavramovic/agentic-design-patterns | code / tutorial | n/a | Interactive single-file tutorial on 29 patterns. | MED. |
| Interactive Tutorial: Agentic Design Patterns (GitHub Pages) | https://zeljkoavramovic.github.io/agentic-design-patterns/ | course | n/a | Hosted tutorial. | MED. |
| YouTube — Master ALL 20 Agentic AI Design Patterns (Complete Course) | https://www.youtube.com/watch | course | n/a | Video course; repo with diagrams/Mermaid. | MED. |
| Level Up Coding — Building 17 Agentic AI Patterns | https://levelup.gitconnected.com/building-17-agentic-ai-patterns-and-their-role-in-large-scale-ai-systems-f4915b5615ce | blog | n/a | Multi-agent-at-scale pattern analysis. | LOW–MED. |
| Dev Genius — Design Patterns for Agentic AI Systems | https://blog.devgenius.io/design-patterns-for-agentic-ai-systems-89457710f19b | blog | n/a | Orchestrator / Collaborator framing. | LOW–MED. |
| Akka — Design patterns for agentic AI (webinar) | https://akka.io/blog/webinar-agentic-ai-design-patterns | course | n/a | Event-driven agent webinar. | MED. |
| Reddit r/AI_Agents — I built a simple AI agent from scratch… | https://www.reddit.com/r/AI_Agents/comments/1mc74s3/i_built_a_simple_ai_agent_from_scratch_these_are/ | forum | n/a | From-scratch practitioner thread. | MED. |
| Medium (Dasari) — Developer Copilot Using Agentic Design Patterns | https://medium.com/@dasari2828/building-a-developer-copilot-using-agentic-design-patterns-f3f1ca720662 | blog | n/a | Practitioner essay referencing Gulli's book. | LOW–MED. |
| LinkedIn Pulse — Guide to 20 Agentic AI Design Patterns (Ahuja) | https://www.linkedin.com/pulse/guide-20-agentic-ai-design-patterns-building-autonomous-rajat-ahuja-a5ycc | blog | n/a | Practitioner primer on 20 patterns. | LOW–MED. |
| Daily Dose of DS — 5 Agentic AI Design Patterns (Avi Chawla) | https://blog.dailydoseofds.com/p/5-agentic-ai-design-patterns | newsletter / blog | n/a | Visual practitioner newsletter. | MED. |
| Machine Learning Mastery — 7 must-know patterns | https://machinelearningmastery.com | blog | n/a | Named but specific post URL not captured. | MED. |
| Towards AI — Agentic Design Patterns You Must Know in 2025 | https://pub.towardsai.net/agentic-design-patterns-you-must-know-in-2025-abf49bdfdc76 | blog | 2025 | Reflection/Tool Use/Planning/Routing/Multi-Agent Collaboration canon. | MED. |
| AWS — Agentic AI patterns and workflows (prescriptive guidance) | https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-patterns/introduction.html | docs | active | AWS-first-party patterns/workflows guidance. | HIGH. |
| LaunchFa.st — (pattern content) | https://www.launchfa.st | blog | n/a | Specific article URL not captured. | LOW. |

### 5.8 Framework comparison / orchestration

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| LangChain Academy — Introduction to LangGraph (free) | https://academy.langchain.com/courses/intro-to-langgraph | course | active | Canonical free LangGraph course. | HIGH. |
| LlamaIndex — Understanding agents (Python framework) | https://developers.llamaindex.ai/python/framework/understanding/agent/ | docs | active | First-party "Building an agent" section. | HIGH. |
| Medium — LlamaIndex 101: Building LLM Agents with LlamaIndex and HuggingFace | https://medium.com/@dipankar0705018/llamaindex-101-building-llm-agents-with-llamaindex-and-hugging-face-8843183ee5ec | blog | n/a | LlamaIndex + HF tutorial. | MED. |
| iSwift — Top 5 AI Agent Frameworks | https://www.iswift.dev/comparisons/top-5-ai-agent-frameworks | blog | 2025/26 | LangGraph / CrewAI / AutoGen / LlamaIndex / Swarm comparison. | LOW–MED. |
| Code to Cloud — Microsoft Agent Frameworks Compared | https://codetocloud.io/blog/microsoft-agent-frameworks-compared.html | blog | 2025/26 | AutoGen + Semantic Kernel → Microsoft Agent Framework unification. | LOW–MED. |

---

## 6. Gaps

What Grok did NOT surface, relative to the prompt and a responsible ecosystem scan.

**Perplexity first-party.** Zero `docs.perplexity.ai` URLs. No Sonar API reference. No Comet browser coverage. No changelog / launch-post index. Grok also did not surface Perplexity Search API quickstarts or the help-center explainer that ChatGPT recovered. Follow-up #2 targeted this gap explicitly and produced zero output.

**xAI first-party.** Only `x.ai/news/grok-4-1-fast`. Missing: `docs.x.ai` canonical dev root, the `docs.x.ai/docs/introduction` page, a dedicated Agent Tools API reference URL, the `xai-grok` PyPI package page, the Cloudflare AI Gateway integration doc. Follow-up #2 targeted these — produced zero output.

**Other major labs.** Zero URLs for AWS Bedrock AgentCore / Strands Agents, Azure AI Foundry Agent Service, Microsoft Agent Framework GitHub, Meta / Llama Stack, Mistral Agents API, Cohere, IBM watsonx Orchestrate, Databricks Mosaic Agents, Snowflake Cortex, NVIDIA NIM / Agent Blueprints, Salesforce Agentforce. Microsoft Agent Framework was named in prose but without a GitHub URL.

**Chinese-ecosystem tooling.** Zero — no Qwen-Agent, DeepSeek, Kimi. (ChatGPT also missed these; Cowork scan may have them.)

**Benchmarks.** Zero — no SWE-bench Verified, GAIA, WebArena, OSWorld, τ²-bench, Terminal-Bench, BFCL. Grok did reference `SWE-bench coding agents` inside the Anthropic section (paraphrasing the Anthropic research post), but no benchmark-URL or benchmark-specific coverage.

**Practitioner operators.** Zero named individuals. No Willison, Husain, Liu, Lambert, Huyen, Karpathy, Ng (Andrew Ng's four-patterns framing underpins the whole response but he is not named).

**Podcasts.** Zero — no Latent Space, Interconnects, TWIML, Cognitive Revolution.

**Newsletters.** Named Daily Dose of DS as "visual practitioner newsletter" and referenced "LangChain's 'State of Agent Engineering' reports" in the tips section, but no canonical newsletter URLs beyond that.

**Books.** One — Springer. No Biswas & Talukdar, no Chip Huyen *AI Engineering*, no Gulli (though Gulli is mentioned in one of the cited Medium posts).

**Academic venues.** Zero arXiv IDs, zero NeurIPS / ICLR / COLM / ACL / ICML / EMNLP.

**Security / risk literature.** Zero — no MCP RCE coverage (Tom's Hardware), no WIRED / Verge / TechRadar clusters that ChatGPT had. Grok's one security-flavored URL is the Black Hills Information Security blog in the MCP section.

**Specific online courses.** Named two (LangChain Academy "Introduction to LangGraph" + Codecademy "How to Build Agentic AI with LangChain and LangGraph") + the Linux Foundation Training's "Agentic AI 101." No Coursera / edX / Pluralsight / Maven / O'Reilly entries.

**Structural gap.** Grok ran fewer follow-ups than any other run because follow-up #2 produced zero output. This is a real ceiling on Grok's usefulness for this task under the account/mode constraints.

**Provenance concerns.**

- "github.com/aaif" surfaced as Grok's AAIF GitHub org. The canonical AAIF GitHub org name should be verified against the `aaif.io` landing page before this URL is treated as authoritative.
- `mcpservers.org` is cited as the searchable MCP-servers catalog paired with `awesome-mcp-servers`. Verify it is not a squatter site before publishing downstream.
- The YouTube watch URL was captured as a bare `/watch` (no `?v=…`) because the citation chip scraped into the DOM had its video-ID query param stripped by the same origin+pathname normalization used for every URL. Any YouTube URL in this doc is underspecified and needs to be re-fetched before use.

---

## 7. Comparison-Readiness Note

Mapping this capture onto the ChatGPT-findings schema (`docs/reference/chatgpt-agentic-ai-findings.md` §5) for mechanical five-way diff:

| ChatGPT-doc section | Grok equivalent | Diff readiness |
|---|---|---|
| §5.1 Anthropic (3 URL rows, several brand-only) | §5.1 (13 URLs) | **Grok stronger on first-party URLs** — supplies `platform.claude.com` tool-tutorial + `anthropic.com/engineering/writing-tools-for-agents` + `anthropic.com/research/building-effective-agents` + the MCP launch post + the MCP-donation post + `anthropic.com/engineering/code-execution-with-mcp`. ChatGPT had MCP as brand-only and mostly Reddit threads. |
| §5.2 OpenAI | §5.2 (7 URLs) | **Grok stronger on Swarm** — cites `github.com/openai/swarm` directly plus 4 Swarm tutorials. **ChatGPT stronger on AAIF post** (`openai.com/index/agentic-ai-foundation`) and on AGENTS.md framing. Neither surfaced the Agents SDK docs URL. |
| §5.3 Google / Gemini | §5.3 (7 URLs) | **Grok much stronger** — `docs.cloud.google.com` pattern-selection page, `developers.googleblog.com` Gemini-3 examples, `developers.google.com/gemini-code-assist`, `ai.google.dev/gemini-api/docs/coding-agents`, `blog.google`, freeCodeCamp, Medium. ChatGPT had ADK + AlphaEvolve Wikipedia only. |
| §5.4 Perplexity (5 first-party + news + Reddit) | §5.4 (1 Medium tutorial) | **ChatGPT stronger.** ChatGPT recovered 5 `docs.perplexity.ai` URLs + news + Reddit. Grok has one Medium tutorial. Follow-up #2 attempt to close this gap produced zero output. |
| §5.5 xAI (2 `docs.x.ai` + Cloudflare + PyPI + Reddit + arXiv) | §5.5 (2 URLs) | **ChatGPT stronger.** Both runs are weak here; ChatGPT cited `docs.x.ai` root, which Grok did not. Follow-up #2 attempt to close this gap produced zero output. |
| §5.6 Multi-vendor standards (WIRED, Verge, TechRadar, Tom's Hardware, OpenAI AAIF post) | §5.6 (49 URLs after follow-up) | **Grok much stronger after follow-up.** Grok recovered full MCP + A2A + AG-UI + AAIF + OpenTelemetry spec stack with canonical URLs. ChatGPT had the major-outlet news cluster that Grok lacks. Genuinely complementary sets — use both. |
| §5.7 Design patterns / analyst blogs (4 ChatGPT rows) | §5.7 (18 URLs) | **Grok much stronger.** Springer book, YouTube 20-patterns course, MongoDB 7-patterns (both Medium and MongoDB.com), KDnuggets, Daily Dose of DS, Towards AI, AWS prescriptive guidance, Level Up Coding, Dev Genius, Akka webinar, interactive GitHub tutorial. |
| §5.8 Repos / code (brand-only in ChatGPT) | §5.2+§5.7+§5.8 | **Grok stronger on named repos with URLs** — `openai/swarm`, `zeljkoavramovic/agentic-design-patterns`, the protocol-implementation repos via follow-up. ChatGPT had Wingie/a2aResumeAgent + LangChain/LangGraph brand-only. |
| §5.9 Research papers (arXiv) | Absent in Grok | **ChatGPT nominally stronger, but all its arXiv IDs are unverified.** Grok surfaced zero arXiv. |
| §5.10 Reddit threads (13+ specific URLs) | Grok has 4 specific Reddit URLs (r/AI_Agents × 1, r/linux × 2, r/AI_Agents from follow-up × 1) | **ChatGPT much stronger on Reddit discourse.** |
| Benchmarks | Absent | **Both absent.** |
| Practitioner operators | Absent | **Both absent.** |
| Books | Springer | **Grok stronger — one named book with canonical Springer URL vs. ChatGPT's zero.** |
| Podcasts | Absent | **Both absent.** |
| Newsletters | Daily Dose of DS (implicit) | **ChatGPT named "Agentic AI Weekly" with URL; Grok didn't name a newsletter with URL.** |

**Source count (final).** 82 distinct URLs from Grok across initial + follow-up #1. Well above the 40-URL verification threshold.

**Mode-asymmetry caveat (repeated).** Grok's DeepSearch/Deeper mode on `grok.com` was not accessible (auth wall). The closest equivalent on the authenticated `x.com/i/grok` surface is Expert, which failed 3× on this prompt. **The capture is from `Fast` mode — the lowest-effort tier** — not from a research-depth mode. Treat depth-of-analysis comparisons against Gemini Deep Research with this caveat.

**Recommended five-way diff methodology.**

1. Normalize all five outputs to the common schema: `name | url | type | ecosystem | freshness | why-it-matters | quality`. All five docs are now in this shape.
2. Build a coverage matrix: rows = ecosystems / source-types, columns = Cowork / ChatGPT / Gemini-PDF / Gemini-Chrome / Grok, cells = ✅ / partial / ❌. Surfaces systematic blind spots per system.
3. Where the same source appears in multiple outputs, compare framings. Grok's framing ("protocols reduce glue code", "design patterns first, framework next, then API", "composable stack") is closer to the Cowork-side scan's artifact-level framing than to ChatGPT's strategy-level framing. The Gemini runs should be diffed against both.
4. Treat the ChatGPT "three-layer stack" framing, Grok's "5-layer composable stack" framing, and the Cowork scan's own layering as **hypotheses to test against each other**, not facts inherited from any single source.
5. Flag the four provenance items in §6 (`github.com/aaif`, `mcpservers.org`, the truncated YouTube watch URLs, the Springer book edition) for verification before any is promoted to "finding."
6. The Perplexity + xAI gap is shared between Grok and (to a lesser degree) ChatGPT. This likely indicates the gap is real in public-web discourse — not a per-LLM blindspot. The Cowork scan probably has better coverage here; use it as ground truth for those two ecosystems.

---

© 2026 Eric Riutort. All rights reserved.
