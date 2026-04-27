---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# Gemini Deep Research — Agentic AI Findings

Third data point in a four-way landscape scan comparison (Gemini-Safari PDF + Gemini-Chrome live + ChatGPT-via-Chrome + Cowork-independent). This doc consolidates the Gemini-sourced findings from the two Gemini data layers and is structured to be row-level diffable against the sibling documents in `docs/reference/`.

> **Scope note.** The Gemini-Chrome live run could not be executed — see §2 Provenance. The Gemini data layer in this doc is therefore a single layer (PDF only), not two, and the source count reflects that.

---

## 1. Executive summary

- **Gemini's synthesis is radically compressed relative to the Cowork scan.** The Safari Deep Research output names ~23 distinct sources, organized into 4 thematic sections. By contrast, the Cowork scan catalogs ~300 deduplicated URLs across 12 source-type tables and 7 ecosystem tables. The delta is structural — Gemini curates a top-of-funnel shortlist; Cowork maps the full surface.
- **Gemini framed the space as "model-agnostic orchestration" first, platform-specific second.** Top-of-report billing goes to LangGraph, CrewAI, and PydanticAI before any lab-specific SDK is named. This is an interpretive choice, not a fact — the Cowork scan treats vendor SDKs (Anthropic Agent SDK, OpenAI Agents SDK, Google ADK) and OSS frameworks as peers.
- **Gemini covered only three labs** (Anthropic, OpenAI, Google Gemini) at the ecosystem level. Perplexity, xAI (Grok), AWS Bedrock, Azure AI Foundry, Cohere, Mistral, Meta/LLaMA Stack, Databricks, Snowflake, NVIDIA NIM, IBM watsonx, Salesforce Agentforce — none are surfaced. This is the single largest coverage gap.
- **Gemini named "Antigravity IDE" as Google's flagship agentic-coding surface.** This is the Gemini-specific framing; the Cowork scan surfaces Gemini CLI + ADK + Vertex Agent Engine instead. Both surfaces exist; Gemini chose to highlight the IDE.
- **Three canonical design patterns are surfaced** — Reflection, Planning (Plan-Act-Observe), Multi-Agent Handoffs (Supervisor/Worker). These map cleanly onto Andrew Ng's four-pattern framing (Reflection, Tool Use, Planning, Multi-Agent) but drop "Tool Use" — an odd omission given MCP is simultaneously highlighted.
- **MCP is called out as Anthropic-pioneered open standard.** Framing matches Cowork scan. Gemini does not mention A2A, ACP, or OpenTelemetry Gen AI semconv — the other cross-vendor protocol/standards layer.
- **Gemini's "discussion hubs" list is narrow but representative.** Blogs named: TheSequence, OpenAI Blog, Anthropic Research, Google DeepMind Blog. Communities: Perplexity / LangChain / Anthropic Discord, r/AI_Agents. Training: DeepLearning.AI, Krishnaik.in. No practitioners named at all — no Karpathy, Simon Willison, Chip Huyen, Hamel Husain, Nathan Lambert, Jason Liu, Harrison Chase, Swyx. This is the second-largest gap.
- **No academic venues, no benchmarks, no industry reports, no books named.** arXiv / NeurIPS / SWE-bench / GAIA / τ²-bench / WebArena / OSWorld / State of AI / Stanford AI Index / Chip Huyen's *AI Engineering* / Biswas-Talukdar's *Building Agentic AI Systems* — all absent. The Safari DR export appears to be a condensed synthesis, not a full DR report with citations; this may be a PDF-export artifact rather than a Gemini limitation.
- **Zero URL citations in the PDF.** Every source is named by label only. URLs in §3 below are canonical references I have attached for diff purposes, marked `[inferred]` throughout.
- **Where this doc is directly comparable to the Cowork scan**: §3 (Source catalog), §4 (By ecosystem), §5 (By source type). Schema — Name, URL, Type, Ecosystem, Freshness, Why-it-matters, Source layer, Quality — is harmonized with the Cowork scan's row format.

---

## 2. Provenance

### Data layers

| Layer | Status | Source file / session | Sources captured |
|---|---|---|---|
| Safari PDF (Eric's prior DR run, exported to PDF) | Captured | `/Users/ericriutort/Downloads/agentic_ai_report_v2.pdf` (2 pages, 2,230 chars) | ~23 distinct |
| Chrome live DR run (fresh run with same prompt) | **BLOCKED** | n/a | 0 |

### Why the Chrome run did not happen

Navigated to `gemini.google.com/app` in Eric's Chrome. The session was not authenticated (Sign-in button visible top-right; home screen showed "Meet Gemini, your personal AI assistant"). Opened the Tools menu to verify Deep Research access — the Deep Research option was rendered **disabled/greyed-out** with the prompt "Get access to all tools and features" and a "Sign in" CTA adjacent.

This means: (a) the Chrome profile in use is not signed into a Google account with Gemini Advanced / Deep Research entitlement, and (b) even if I signed in (which is a prohibited action for me without explicit Eric-chat confirmation, and even with confirmation I cannot enter passwords), Deep Research may require a paid Gemini subscription tier to unlock.

Per the brief ("if not, report that and proceed with PDF only"), I fell back to the PDF-only path and noted the Chrome-run absence here rather than retrying.

### Divergence between PDF and Chrome — not applicable

Because there is no Chrome layer, no PDF-vs-Chrome divergence analysis can be produced. If Eric re-runs this task after signing into Gemini in Chrome, the Chrome-layer data should be appended to this doc as a new column in §3 (currently all rows read "PDF only"), and §2 updated with the PDF-vs-Chrome diff.

### What the PDF looks like

The PDF is a short, densely-formatted 2-page synthesis titled "Research Report: Agentic AI Systems (2026)" with a standing-head note "Prepared for deep research on current sources and methodologies for creating agentic AI software." It reads as a Gemini DR *summary export*, not the full report with per-claim citations. Structure:

1. Model-Agnostic Orchestration — 3 frameworks
2. Platform-Specific Agent Ecosystems — 3 labs
3. Key Design Patterns — 3 patterns
4. Major Discussion Hubs & Training — 4 resource types, ~12 named venues

No footnotes, no URLs, no bibliography, no methodology note. This is likely the condensed output of Gemini's DR "share as PDF" flow rather than the inline-cited version visible in the Gemini web UI.

---

## 3. Source catalog

Aggregated across Gemini layers (PDF only; Chrome = empty). Deduplicated. URLs are canonical references attached by me for diff-against-Cowork-scan purposes; Gemini did not cite URLs in the PDF.

| Name | URL | Type | Ecosystem | Freshness | Why-it-matters (Gemini's framing, paraphrased) | Source layer | Quality |
|---|---|---|---|---|---|---|---|
| LangGraph | https://github.com/langchain-ai/langgraph *[inferred]* | code (framework) | multi-vendor / open-source | 2026 report | Named as "industry standard" for stateful multi-agent workflows built on directed cyclic graphs; emphasis on control + persistence | PDF only | HIGH |
| CrewAI | https://github.com/crewaiinc/crewai *[inferred]* | code (framework) | multi-vendor / open-source | 2026 report | Role-based agent collaboration; positioned for "agentic teams" where personas cover research / coding / QA | PDF only | HIGH |
| PydanticAI | https://github.com/pydantic/pydantic-ai *[inferred]* | code (framework) | multi-vendor / open-source | 2026 report | Python-native, type-safe, structured-data-first; framed as the productionize/test-friendly option | PDF only | HIGH |
| Anthropic (company) | https://www.anthropic.com *[inferred]* | lab (org) | Anthropic | 2026 report | Named as MCP originator and Computer Use vendor; Opus 4.x cited by version | PDF only | HIGH |
| Model Context Protocol (MCP) | https://modelcontextprotocol.io *[inferred]* | standard | Anthropic / multi-vendor | 2026 report | Open standard for agent access to local data + tools; framed as Anthropic-pioneered | PDF only | HIGH |
| Claude "Computer Use" (Opus 4.x) | https://www.anthropic.com/news/developing-computer-use *[inferred]* | product / capability | Anthropic | 2026 report | Opus models navigate UI elements autonomously | PDF only | HIGH |
| Anthropic Research (blog) | https://www.anthropic.com/research *[inferred]* | blog | Anthropic | 2026 report | Named in discussion-hubs table as a primary agentic-AI blog | PDF only | HIGH |
| OpenAI (company) | https://openai.com *[inferred]* | lab (org) | OpenAI | 2026 report | Positioned around Swarm + Agents SDK; lightweight coordination framing | PDF only | HIGH |
| OpenAI Swarm | https://github.com/openai/swarm *[inferred]* | code (framework) | OpenAI | 2026 report | Framed as active experimental framework for multi-agent handoffs. **Caveat:** actually archived; superseded by Agents SDK (Cowork scan flags this) | PDF only | MED |
| OpenAI Agents SDK | https://openai.github.io/openai-agents-python/ *[inferred]* | code / docs | OpenAI | 2026 report | "Robust" SDK for tool-calling + conversation state management | PDF only | HIGH |
| OpenAI Blog | https://openai.com/blog *[inferred]* | blog | OpenAI | 2026 report | Named as primary agentic-AI blog | PDF only | HIGH |
| Google Gemini Antigravity (IDE) | https://antigravity.google *[inferred]* | IDE / product | Google | 2026 report | "Vibe coding" IDE where AI plans + executes entire software modules | PDF only | HIGH |
| Vertex AI Agent Builder | https://cloud.google.com/products/agent-builder *[inferred]* | platform / docs | Google | 2026 report | Enterprise-grade grounding + long-term memory | PDF only | HIGH |
| Google DeepMind Blog | https://deepmind.google/blog/ *[inferred]* | blog | Google | 2026 report | Named as primary agentic-AI blog | PDF only | HIGH |
| TheSequence | https://thesequence.substack.com *[inferred]* | newsletter / blog | community | 2026 report | Named as primary agentic-AI blog | PDF only | MED |
| GitHub — "awesome-mcp-servers" | https://github.com/wong2/awesome-mcp-servers *[inferred, primary]* | aggregator | multi-vendor / community | 2026 report | Named as canonical MCP-server catalog via GitHub search | PDF only | HIGH |
| GitHub — "LangGraph templates" | https://github.com/langchain-ai/langgraph/tree/main/examples *[inferred]* | code | multi-vendor / open-source | 2026 report | Named as canonical LangGraph template resource via GitHub search | PDF only | MED |
| Perplexity Discord | *not publicly stable URL* | forum | Perplexity / community | 2026 report | Named in community hubs list | PDF only | MED |
| LangChain Discord | https://discord.com/invite/langchain *[inferred]* | forum | multi-vendor / community | 2026 report | Named in community hubs list | PDF only | MED |
| Anthropic Discord | *not publicly stable URL* | forum | Anthropic / community | 2026 report | Named in community hubs list — note: Anthropic's primary community presence is actually claude.ai forums + subreddit, Discord is third-party-run | PDF only | LOW |
| r/AI_Agents | https://www.reddit.com/r/AI_Agents/ *[inferred]* | forum | community | 2026 report | Named as primary agentic-AI subreddit | PDF only | HIGH |
| DeepLearning.AI — Agentic Workflows courses | https://www.deeplearning.ai/courses/ *[inferred]* | course | multi-vendor / education | 2026 report | Flagship training mentioned for agentic workflows | PDF only | HIGH |
| Krishnaik.in | https://krishnaik.in *[inferred]* | course / YouTube | community / education | 2026 report | Named as training resource | PDF only | MED |

**Distinct sources: 23.** Of these, 1 is LOW-quality (Anthropic Discord framing is imprecise), 6 are MED, and 16 are HIGH.

### Design patterns surfaced (not sources, but called out for completeness)

| Pattern | Gemini's framing | Notes |
|---|---|---|
| Reflection | Agents critique their own output and iterate before final response | Standard Andrew-Ng-framework pattern #1 |
| Planning | Breaking complex prompts into sub-tasks via Plan-Act-Observe loops | Standard pattern; alt name ReAct-style |
| Multi-Agent Handoffs | Supervisor agent passes context to specialized worker agents | Maps to supervisor/worker orchestration |

**Notable omission from the pattern list:** Tool Use (the 4th of Andrew Ng's canonical four). Gemini highlights MCP as a tool-protocol standard but does not enumerate Tool Use as a design pattern peer to Reflection / Planning / Multi-Agent — an inconsistency in its own framing.

---

## 4. By ecosystem

### 4.1 Anthropic

| Name | URL | Type | Why Gemini surfaced it | Quality |
|---|---|---|---|---|
| Anthropic (company) | https://www.anthropic.com *[inferred]* | lab | MCP originator + Computer Use vendor | HIGH |
| Model Context Protocol | https://modelcontextprotocol.io *[inferred]* | standard | Open standard for agent tool access | HIGH |
| Claude Computer Use (Opus 4.x) | https://www.anthropic.com/news/developing-computer-use *[inferred]* | product | UI navigation capability | HIGH |
| Anthropic Research | https://www.anthropic.com/research *[inferred]* | blog | Primary agentic-AI blog | HIGH |
| Anthropic Discord | *ambiguous* | forum | Named in community hubs | LOW |

**Not surfaced (present in Cowork scan):** Claude Agent SDK (Python + TypeScript), Claude Skills, Claude Cookbooks, `anthropics/skills` repo, Anthropic Engineering blog, "Building Effective AI Agents" post, "Effective context engineering" post, "Multi-agent research system" post, "Effective harnesses" post, "Code execution with MCP" post, Claude.ai community forums.

### 4.2 OpenAI

| Name | URL | Type | Why Gemini surfaced it | Quality |
|---|---|---|---|---|
| OpenAI (company) | https://openai.com *[inferred]* | lab | Swarm + Agents SDK vendor | HIGH |
| OpenAI Swarm | https://github.com/openai/swarm *[inferred]* | code | Experimental multi-agent handoffs | MED (actually archived) |
| OpenAI Agents SDK | https://openai.github.io/openai-agents-python/ *[inferred]* | code | Tool-calling + conversation state | HIGH |
| OpenAI Blog | https://openai.com/blog *[inferred]* | blog | Primary agentic-AI blog | HIGH |

**Not surfaced (present in Cowork scan):** AgentKit, Agent Builder visual workflow authoring, ChatKit, Responses API, OpenAI Agents SDK JS/TS, OpenAI Cookbook, "Orchestrating agents" notebook, "Structured Outputs multi-agent" notebook, Parallel agents notebook, Deep Research API, OpenAI Developer Community (Discourse), OpenAI Forum, MLE-bench, BrowseComp.

### 4.3 Google

| Name | URL | Type | Why Gemini surfaced it | Quality |
|---|---|---|---|---|
| Gemini Antigravity IDE | https://antigravity.google *[inferred]* | IDE | "Vibe coding" — plans + executes software modules | HIGH |
| Vertex AI Agent Builder | https://cloud.google.com/products/agent-builder *[inferred]* | platform | Enterprise grounding + long-term memory | HIGH |
| Google DeepMind Blog | https://deepmind.google/blog/ *[inferred]* | blog | Primary agentic-AI blog | HIGH |

**Not surfaced (present in Cowork scan):** Agent Development Kit (ADK) — Python / TS / Go / Java; ADK docs; Vertex AI Agent Engine; Gemini CLI; Gemini CLI subagents + plan mode; A2A protocol; A2A samples + codelabs; Google Developers Blog; Google Cloud Blog "Agent Factory" series; Partner Skills ADK/MCP/A2A learning path; Gemini API docs (ai.google.dev).

### 4.4 Perplexity — NOT SURFACED

Cowork scan carries 6 Perplexity sources (Perplexity API docs, Agent API announcement, changelog, Comet Resource Hub, Comet Enterprise, llms-full.txt). **Gemini surfaces only "Perplexity Discord"** in the community-hubs list and nothing about Perplexity's actual developer surface.

### 4.5 xAI (Grok) — NOT SURFACED

Cowork scan carries 6 xAI sources (API landing, docs overview, quickstart, Models & pricing, Grok 4.1 Fast / Agent Tools API launch, Voice Agent API). **Gemini surfaces zero.**

### 4.6 Multi-vendor / Cross-vendor standards

| Name | URL | Type | Why Gemini surfaced it | Quality |
|---|---|---|---|---|
| Model Context Protocol | https://modelcontextprotocol.io *[inferred]* | standard | Open tool-access standard | HIGH |
| awesome-mcp-servers | https://github.com/wong2/awesome-mcp-servers *[inferred, primary]* | aggregator | Canonical MCP server catalog | HIGH |

**Not surfaced (present in Cowork scan):** MCP Registry; MCP reference servers; A2A Protocol (spec, GitHub, codelabs, Linux Foundation governance); ACP; OpenTelemetry Gen AI semconv; Agent Protocol (LangChain-origin).

### 4.7 Other major labs — NOT SURFACED

Cowork scan covers AWS Bedrock AgentCore + Strands Agents, Azure AI Foundry Agent Service + Microsoft Agent Framework + Semantic Kernel, Cohere agents + tool use, Mistral Agents API, Meta LLaMA Stack, Databricks Mosaic Agents, Snowflake Cortex Agents, NVIDIA NIM + Agent Blueprints, IBM watsonx Orchestrate, Salesforce Agentforce. **Gemini surfaces zero sources across this entire column.**

### 4.8 Open-source frameworks

| Name | URL | Type | Why Gemini surfaced it | Quality |
|---|---|---|---|---|
| LangGraph | https://github.com/langchain-ai/langgraph *[inferred]* | framework | Industry standard for graph-based stateful agents | HIGH |
| CrewAI | https://github.com/crewaiinc/crewai *[inferred]* | framework | Role-based multi-agent | HIGH |
| PydanticAI | https://github.com/pydantic/pydantic-ai *[inferred]* | framework | Type-safe Python-native | HIGH |
| LangGraph templates | https://github.com/langchain-ai/langgraph/tree/main/examples *[inferred]* | code | Example templates | MED |

**Not surfaced (present in Cowork scan):** LangChain, DeepAgents (LangChain), AutoGen, Microsoft Agent Framework, Semantic Kernel, smolagents (Hugging Face), LlamaIndex + AgentWorkflow, DSPy, Haystack, Strands Agents, Agno / Phidata.

---

## 5. By source type

### 5.1 Official documentation — NOT SURFACED AS SUCH

Gemini did not enumerate docs roots per vendor (unlike Cowork scan §4.1). Closest PDF analogues are the Agents-SDK + Vertex AI Agent Builder + MCP naming-by-label.

### 5.2 Vendor engineering blogs

| Vendor | Blog name (Gemini's label) | URL |
|---|---|---|
| Anthropic | Anthropic Research | https://www.anthropic.com/research *[inferred]* |
| OpenAI | OpenAI Blog | https://openai.com/blog *[inferred]* |
| Google | Google DeepMind Blog | https://deepmind.google/blog/ *[inferred]* |
| Community | TheSequence | https://thesequence.substack.com *[inferred]* |

**Gaps vs Cowork scan §4.2**: Microsoft Foundry devblog, Semantic Kernel blog, AWS ML blog, Databricks blog, Perplexity Hub, xAI news, Cohere blog, Mistral news, LangChain blog, LlamaIndex blog, Hugging Face blog, Langfuse blog, Anthropic Engineering (distinct from Research), Google Developers Blog, Google Cloud Blog.

### 5.3 Cookbooks / sample-code repos — NOT SURFACED

Gemini references "awesome-mcp-servers" and "LangGraph templates" as GitHub search hints but does not list any cookbook (Anthropic Cookbooks, OpenAI Cookbook, ADK samples, AWS AgentCore samples, Azure AI Foundry samples, LangChain cookbook, LangGraph examples, CrewAI examples, smolagents examples, LlamaIndex agent examples, Pydantic AI examples, AutoGen samples, Agno cookbook — all absent).

### 5.4 Open-source frameworks (repo form)

See §4.8. Three named: LangGraph, CrewAI, PydanticAI. Cowork scan enumerates ~15 first-class OSS frameworks plus ~5 aggregator repos; Gemini delta is ~12 missing frameworks.

### 5.5 Training courses

| Course / platform | URL | Notes |
|---|---|---|
| DeepLearning.AI — Agentic Workflows courses | https://www.deeplearning.ai/courses/ *[inferred]* | Generic pointer to DLAI hub |
| Krishnaik.in | https://krishnaik.in *[inferred]* | Not in Cowork scan — Gemini-unique surface |

**Gaps vs Cowork scan §4.5**: Specific DLAI courses (Agentic AI by Andrew Ng, AI Agents in LangGraph, A2A, ACP, Multi-AI Agent Systems with CrewAI, Long-Term Agentic Memory with LangGraph); Hugging Face AI Agents Course; LangChain Academy; Udemy agent courses; Pluralsight enterprise-agent course; Google Partner Skills ADK/MCP/A2A path; Hamel Husain's Open LLM Course.

### 5.6 Books — NOT SURFACED

Zero books named. Cowork scan §4.6 carries 7 titles incl. Biswas & Talukdar *Building Agentic AI Systems* (Packt 2025), Chip Huyen's *AI Engineering* (O'Reilly 2025), the Yan/Husain/Liu/Bischof/Frye/Shankar "What we learned" essay series, AI Agents in Action (Lanham), Building LLMs for Production.

### 5.7 Podcasts — NOT SURFACED

Zero. Cowork scan §4.7 carries 10 shows (Latent Space, The Cognitive Revolution, No Priors, Dwarkesh, Practical AI, AI Engineer Podcast, MLST, TWIML, Gradient Dissent, etc.).

### 5.8 Discussion forums & community

| Venue (Gemini's label) | URL | Notes |
|---|---|---|
| Perplexity Discord | *ambiguous* | Third-party-run; no stable official URL |
| LangChain Discord | https://discord.com/invite/langchain *[inferred]* | Matches Cowork scan entry |
| Anthropic Discord | *ambiguous* | Anthropic's official community is claude.ai forums, not Discord; label is imprecise |
| r/AI_Agents | https://www.reddit.com/r/AI_Agents/ *[inferred]* | Matches Cowork scan entry |

**Gaps**: r/LocalLLaMA, r/LangChain, r/MachineLearning, r/ClaudeAI, r/OpenAI, r/GoogleGeminiAI; HN threads; OpenAI Developer Community (Discourse); Latent Space Discord; Hugging Face Discord; CrewAI Discord; MCP Discord; Pydantic AI Discord; LlamaIndex Discord; Stack Overflow tags.

### 5.9 Academic venues & papers — NOT SURFACED

Zero. Cowork scan §4.9 carries 16 entries (arXiv cs.MA, NeurIPS, ICLR, ICML, ACL/EMNLP, COLM, 8 surveys/papers, PapersWithCode, OpenReview).

### 5.10 Benchmarks — NOT SURFACED

Zero. Cowork scan §4.10 carries 21 benchmarks (SWE-bench, WebArena, OSWorld, GAIA, τ²-bench, Terminal-Bench, BFCL, AgentBench, MLE-bench, BrowseComp, RE-Bench, WebVoyager, Mind2Web, Steel.dev leaderboard, Holistic Agent Leaderboard, philschmid compendium, RDI Berkeley benchmark-exploit critique).

### 5.11 Industry reports — NOT SURFACED

Zero. Cowork scan §4.11 carries 13 reports (State of AI, Stanford AI Index 2025/2026, Anthropic Economic Index, Thoughtworks Technology Radar 32/33, O'Reilly "What we learned", Gartner, MITTR, Langfuse comparison).

### 5.12 Observability / evaluation tools — NOT SURFACED

Zero. Cowork scan §4.11b carries 13 tools (LangSmith, Langfuse, Arize Phoenix, Arize AX, Braintrust, Patronus, Helicone, W&B Weave, Ragas, DeepEval, OpenLLMetry, LangWatch, Galileo).

### 5.13 Aggregators / awesome-lists

| Name | URL | Notes |
|---|---|---|
| awesome-mcp-servers | https://github.com/wong2/awesome-mcp-servers *[inferred]* | Only aggregator Gemini named by specific handle |

**Gaps**: awesome-ai-agents-2026 (caramaschiHG + Zijian-Ni), awesome-llm-agents, Awesome-AI-Agents (Jenqyang), awesome-agents (kyrolabs), awesome-llm-powered-agent, awesome-Efficient-Agents, awesome-ai-agent-papers, Awesome-LLM, awesome-claude-skills, awesome-LangGraph, Agents Index, PapersWithCode agents.

---

## 6. Notable practitioners Gemini surfaced

**None.** Zero individual practitioners are named in the PDF. This is one of the sharpest coverage gaps vs the Cowork scan, which names ~24 individuals (Karpathy, Simon Willison, Jason Liu, Hamel Husain, Chip Huyen, Andrew Ng, Nathan Lambert, Swyx, Harrison Chase, Omar Sanseviero, Shreya Shankar, Eugene Yan, Charles Frye, Bryan Bischof, Greg Kamradt, Alex Albert, Logan Kilpatrick, Peter Steinberger, Erik Meijer, Jerry Liu, Yohei Nakajima, Thomas Ahle / João Moura, Nathan Benaich, Sebastian Raschka).

Implicit attributions only: "Google's Antigravity" (Google collective), "Anthropic's Computer Use" (Anthropic collective), DeepLearning.AI courses (implicitly Andrew Ng but not named). No individual is attributed as an authoritative source.

---

## 7. Gaps relative to the prompt

The original prompt requested "all of the current sources of discussion on how to create agentic AI systems… code examples, design patterns, use cases, discussion threads, training sessions, online classes, blogs, etc." Gemini's output under-serves on these fronts:

**Ecosystems missed entirely** — Perplexity, xAI/Grok, AWS Bedrock, Azure AI Foundry, Cohere, Mistral, Meta/LLaMA Stack, Databricks, Snowflake, NVIDIA NIM, IBM watsonx, Salesforce Agentforce, the Chinese LLM ecosystem (Qwen-Agent, ModelScope Agent, AgentScope, Baidu Qianfan, Zhipu GLM-Agent, DeepSeek, Kimi, MiniMax). None of these appear in the PDF at all. Delta: ~13 ecosystems unaddressed.

**Source types missed entirely** — academic papers, benchmarks, industry reports, observability/eval tools, books, podcasts, agent-security/governance resources (OWASP GenAI, NIST AI RMF, Microsoft Agent Governance Toolkit, Simon Willison's prompt-injection writing). Six major source-type categories absent.

**Individual practitioners missed entirely** — all ~24 people the Cowork scan tracks. The "who to follow" dimension of the prompt is unaddressed.

**Design-pattern coverage is thin but not wrong** — 3 patterns listed (Reflection, Planning, Multi-Agent Handoffs), missing Tool Use despite MCP being highlighted in the same document. A more complete pattern list would include Tool Use, Memory (short/long-term), Self-Correction, ReAct vs Plan-then-Act as distinct patterns, Routing vs Orchestration, Deep Research pattern itself.

**Protocol / standards coverage is incomplete** — MCP is surfaced, but A2A (Agent2Agent, Linux-Foundation-governed since June 2025) and ACP (Agent Communication Protocol) and OpenTelemetry Gen AI semconv are absent. For a 2026-dated report that's a material omission.

**Freshness signals are absent for every source.** Gemini names LangGraph, CrewAI, Antigravity etc. without publication / activity / version dates. The Cowork scan tracks freshness per-row.

**No quality or authority scoring.** Gemini lists each source as-if-equal. No HIGH/MED/LOW filter.

**No cross-references to OSS frameworks beyond the big 3.** LangChain (parent of LangGraph), AutoGen, smolagents, LlamaIndex, DSPy, Haystack are all missing from the frameworks section.

**Possible-error flag: OpenAI Swarm.** Gemini's PDF frames Swarm as an active experimental framework. As of late 2024 / early 2025, OpenAI marked Swarm as archived/experimental and pointed users to the Agents SDK as the go-forward path. Gemini's framing is not wrong per se (Swarm is still a public reference implementation) but reading the PDF alone, a newcomer could conclude Swarm is the active OpenAI multi-agent path when it is not. Cowork scan flags this explicitly.

---

## 8. Comparison-readiness note

The schema in §3 (Name / URL / Type / Ecosystem / Freshness / Why-it-matters / Source layer / Quality) matches the Cowork scan's §3 row format and the ChatGPT-side findings schema. Ecosystem tags (Anthropic, OpenAI, Google, Perplexity, xAI, multi-vendor, open-source, academic, community, education) are harmonized. Source-type tags (docs, blog, code, course, forum, paper, benchmark, standard, aggregator, other) are harmonized. The "Source layer" column (PDF only / Chrome only / both) is the Gemini-doc-specific additional field — for direct diff against the other three docs, ignore this column or normalize all rows to "Gemini" as a scan-wide source tag.

For the four-way diff (Gemini-PDF, Gemini-Chrome [absent], ChatGPT-Chrome, Cowork-independent), the recommended workflow: (1) extract each doc's source-URL list via grep; (2) full-outer-join on normalized URL (lowercase, strip trailing slash, drop `www.` prefix); (3) produce a diff matrix flagging which scan surfaced which source; (4) triage by "shared across all 4 = canonical" / "in 3 = strong" / "in 2 = interesting" / "in 1 = long-tail or hallucination". This doc is structured to survive that workflow without further normalization.

The single structural asymmetry: the Cowork scan produces 300 URLs across 12 source-type tables; this Gemini doc produces 23 sources across 4 source-type clusters. At row level they're comparable; at section-count level they're not. A row-level coverage ratio (Gemini / Cowork) of ~7.7% is the headline diff — useful as a measurement of synthesis compression rather than as a quality indictment of either scan.

---

## Appendix A — PDF structural outline (audit trail)

Source file: `/Users/ericriutort/Downloads/agentic_ai_report_v2.pdf` (2 pages, 2,230 characters). Raw text extracted to scratch via `pypdf` and preserved at `/sessions/sharp-loving-tesla/mnt/outputs/pdf_extract/pypdf_text.txt`. The structural outline is summarized below without reproducing the Gemini-generated prose (copyright discipline — output is Google-generated synthesis).

Structural outline only:

- Title block: "Research Report: Agentic AI Systems (2026)" with a single standing-head line framing the doc as prepared for deep research on creating agentic AI software.
- §1 Model-Agnostic Orchestration — three bulleted framework entries (LangGraph, CrewAI, PydanticAI), each with a one-to-two-sentence characterization.
- §2 Platform-Specific Agent Ecosystems — three sub-headings (Anthropic with "Opus 4.x & MCP"; OpenAI with "Swarm & Agents SDK"; Google Gemini with "Antigravity & Vertex AI"), each with a one-to-two-sentence framing.
- §3 Key Design Patterns — three bulleted patterns (Reflection, Planning, Multi-Agent Handoffs), each with a one-sentence definition.
- §4 Major Discussion Hubs & Training — 4-row table with columns "Resource Type" and "Key Sources"; rows: Blogs, Repositories, Communities, Training.

No footnotes, no URL citations, no bibliography, no methodology block, no author attribution, no version number. Page break falls mid-§2 — OpenAI ends page 1, Google starts page 2.

---

© 2026 Eric Riutort. All rights reserved.
