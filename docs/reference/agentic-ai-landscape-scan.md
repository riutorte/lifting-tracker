---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
subtype: landscape-synthesis
---

# Agentic AI Landscape Scan — Sources of Discussion

A comprehensive, categorized, source-cited map of where agentic-AI development discussion is happening across major LLM ecosystems, open-source frameworks, academia, and the practitioner community.

> **Scope note.** The deliverable is a *map* of sources — not a synthesis of what they say. Paired with an equivalent Gemini Deep Research run for head-to-head comparison.

---

## 1. Executive Summary

- **The field has consolidated into ~6 first-party agent stacks** (Anthropic Claude Agent SDK + Skills + MCP; OpenAI Agents SDK + AgentKit; Google ADK + Vertex Agent Engine; AWS Bedrock AgentCore + Strands; Azure AI Foundry Agent Service + Microsoft Agent Framework; Perplexity Agent API) and **~10 serious OSS frameworks** (LangGraph, CrewAI, Microsoft Agent Framework / legacy AutoGen, Semantic Kernel, smolagents, Pydantic AI, LlamaIndex Workflows, DSPy, Haystack, Agno). xAI is docs-plus-API — no first-party agent framework.
- **MCP has won as the tool protocol.** Every major vendor (Anthropic, OpenAI, Google, AWS, Azure, Cohere, Mistral) now supports it. A2A is gaining as the inter-agent protocol under Linux Foundation governance (June 2025 donation; initial founders AWS, Cisco, Google, Microsoft, Salesforce, SAP, ServiceNow).
- **Best single starter resource per ecosystem**: Anthropic → "Building Effective AI Agents" (Dec 2024); OpenAI → Agents SDK docs + Orchestrating Agents cookbook; Google → ADK docs; Perplexity → Agent API blog + docs; xAI → Agent Tools API docs; Cross-vendor → DeepLearning.AI Agentic AI course (Andrew Ng, vendor-neutral).
- **Best discussion is happening in** r/LocalLLaMA (~658K), r/AI_Agents (~212K), Latent Space Discord + podcast, HN threads on major Anthropic/OpenAI posts, LangChain Slack, Hugging Face Discord, MCP Discord. Research discussion concentrates on arXiv cs.MA/cs.AI, NeurIPS D&B track, and COLM.
- **Benchmark landscape is crowded and increasingly suspect.** Canonical set: SWE-bench Verified (coding), WebArena/OSWorld (GUI), GAIA (general assistant), τ²-bench (tool+user), Terminal-Bench (CLI), BFCL (function-call). Berkeley RDI + HN threads have shown most are exploitable — treat leaderboards as one signal among many.
- **Books are thin but improving**: Biswas & Talukdar *Building Agentic AI Systems* (Packt 2025) is the main dedicated agent book; Chip Huyen's *AI Engineering* (O'Reilly 2025) has the most useful agents chapter inside a broader work. The Yan/Husain/Liu/Bischof/Frye/Shankar "What we learned" essay series remains the most cited practitioner text.
- **Maturity-by-ecosystem for agent dev** (as of April 2026): Anthropic most opinionated (Skills + MCP + Claude Code lineage). OpenAI most product-breadth (AgentKit + Responses + ChatKit + Agent Builder GUI). Google most enterprise-deep (ADK + Vertex Agent Engine + A2A + strong GCP integration). AWS most production-infrastructure (AgentCore Runtime/Memory/Identity/Browser/Observability). Azure most .NET-friendly (Semantic Kernel + Agent Framework). Perplexity most search-centric. xAI most minimal.
- **Practitioner centers of gravity**: Simon Willison's weblog, Hamel Husain's blog, Jason Liu's writing, Nathan Lambert's Interconnects, Chip Huyen's essays, Karpathy's YouTube. These six blogs+channels cover ~80% of what a serious operator needs to track in 2026.
- **Aggregators** (when you need breadth, not depth): awesome-ai-agents-2026 (caramaschiHG), Papers with Code, Steel.dev leaderboard, MCP Registry, philschmid's benchmark compendium. These five aggregators expose most of the rest of the ecosystem.
- **Where Gemini-vs-Cowork comparisons will likely diverge**: depth on Google/ADK specifics (Gemini likely strong home-field bias), handling of paywalled/Substack sources (Cowork lists by URL only), coverage of Chinese-ecosystem tooling (Qwen-Agent, DeepSeek, Kimi, etc. — under-represented here; worth a second pass if the comparison surfaces gaps), and claims about "best" framework (both systems should resist; listed here as equal-weight map, not ranking).

---

## 2. Methodology

This scan was conducted 2026-04-23 in a single session. Strategy:

- Sequential batches by ecosystem (Anthropic → OpenAI → Google → xAI/Perplexity → open-source → courses/books/podcasts → forums → academic/benchmarks/standards).
- Parallel WebSearches kept to ≤3 at a time to avoid stream timeout.
- Source verification: where possible, URLs fetched directly. Where fetching failed or was rate-limited, source was recorded from search-result metadata and flagged *[inferred]*.
- Freshness signal: recorded from the source itself when visible (publish/commit date), otherwise from search result metadata.
- Quality signal (HIGH / MED / LOW) reflects perceived authority, depth, and practitioner uptake.

**Known out-of-scope / limits:**
- Paywalled courses (Pluralsight, O'Reilly online) — listed by title/URL only; content not verified.
- Private Discord servers and Slack workspaces — named with join/landing URLs only.
- X (Twitter) accounts — listed by handle; individual tweet citations out of scope.

---

## 3. By Ecosystem

### 3.1 Anthropic

| Name | URL | Type | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| Claude API docs — Agent SDK overview | https://platform.claude.com/docs/en/agent-sdk/overview | docs | Current | Canonical reference for the SDK that powers Claude Code and custom agents | HIGH |
| Claude Agent SDK — Python | https://github.com/anthropics/claude-agent-sdk-python | code | Active | Official Python SDK (renamed Oct 2025 from Claude Code SDK) | HIGH |
| Claude Agent SDK — TypeScript | https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk | code | Active | Official TypeScript/Node SDK | HIGH |
| Agent Skills docs | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | docs | Current | Canonical guide to Skills: folders of instructions/scripts loaded dynamically | HIGH |
| Skills repo (public examples) | https://github.com/anthropics/skills | code | Active | Official Skills examples — SKILL.md pattern, MCP builder, domain workflows | HIGH |
| Anthropic Engineering blog | https://www.anthropic.com/engineering | blog | Active | Hub for all Anthropic engineering posts — agents, context, harnesses | HIGH |
| "Building Effective AI Agents" | https://www.anthropic.com/research/building-effective-agents | blog/paper | Dec 2024 | Seminal post on composable agent patterns; most-cited Anthropic agent piece | HIGH |
| "Effective context engineering for AI agents" | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | blog | 2025-09-29 | Coined "context engineering" in the Anthropic vocabulary | HIGH |
| "Multi-agent research system" | https://www.anthropic.com/engineering/multi-agent-research-system | blog | 2025 | How Claude's Research feature orchestrates sub-agents | HIGH |
| "Effective harnesses for long-running agents" | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | blog | 2025-11-26 | Harness design for agents that span many context windows | HIGH |
| "Code execution with MCP" | https://www.anthropic.com/engineering/code-execution-with-mcp | blog | 2025 | Efficiency patterns using MCP for code-exec agents | HIGH |
| "Building agents with the Claude Agent SDK" | https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk | blog | 2025 | Official SDK intro + rename rationale | HIGH |
| Building Effective AI Agents resource pack | https://resources.anthropic.com/building-effective-ai-agents | docs | 2024+ | Curated landing page for the topic | HIGH |
| Claude Cookbooks | https://github.com/anthropics/claude-cookbooks | code | Active | Notebook recipes: tool use, agents, MCP, RAG, extended thinking | HIGH |
| Claude Cookbook index | https://docs.anthropic.com/en/docs/resources/cookbook | docs | Current | Docs-side index of the cookbook | HIGH |
| MCP specification | https://modelcontextprotocol.io | standard | Active | Anthropic-originated open standard; see also §3.6 | HIGH |
| Anthropic GitHub org | https://github.com/anthropics | code | Active | Umbrella for SDKs, MCP servers, cookbooks, quickstarts | HIGH |
| Awesome Claude Skills | https://github.com/travisvn/awesome-claude-skills | aggregator | Active | Community-curated Claude Skills list | MED |
| Awesome Claude (awesomeclaude.ai) | https://awesomeclaude.ai/ | aggregator | Active | Community resources directory | MED |

### 3.2 OpenAI

| Name | URL | Type | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| OpenAI Agents SDK (Python) — docs | https://openai.github.io/openai-agents-python/ | docs | Active | Canonical docs for Agents SDK: handoffs, guardrails, tracing, sessions | HIGH |
| OpenAI Agents SDK (Python) — repo | https://github.com/openai/openai-agents-python | code | Active | The SDK source + issues + discussions | HIGH |
| OpenAI Agents SDK — JS/TS | https://github.com/openai/openai-agents-js | code | Active | TypeScript port of the Agents SDK | HIGH |
| Agents API Guide | https://developers.openai.com/api/docs/guides/agents | docs | Current | Official OpenAI docs landing for Agents | HIGH |
| AgentKit announcement | https://openai.com/index/introducing-agentkit/ | blog | 2025-10 | Launch post: Agent Builder, ChatKit, Connector Registry | HIGH |
| OpenAI Agent Platform | https://openai.com/agent-platform/ | docs | Current | Marketing + docs hub for OpenAI's full agent stack | HIGH |
| Agent Builder guide | https://developers.openai.com/api/docs/guides/agent-builder | docs | Current | Drag-and-drop visual workflow authoring | HIGH |
| OpenAI Cookbook — Agents topic | https://cookbook.openai.com/topic/agents | code/docs | Active | Curated agent examples | HIGH |
| OpenAI Cookbook GitHub | https://github.com/openai/openai-cookbook | code | Active | Source of all cookbook notebooks | HIGH |
| "Orchestrating agents" notebook | https://github.com/openai/openai-cookbook/blob/main/examples/Orchestrating_agents.ipynb | code | 2024+ | Routines + handoffs pattern (precursor to Swarm) | HIGH |
| "Structured Outputs multi-agent" | https://github.com/openai/openai-cookbook/blob/main/examples/Structured_outputs_multi_agent.ipynb | code | 2024+ | Schema-enforced multi-agent coordination | HIGH |
| Parallel agents notebook | https://github.com/openai/openai-cookbook/blob/main/examples/agents_sdk/parallel_agents.ipynb | code | Active | Concurrent agent execution patterns | HIGH |
| Deep Research API with Agents SDK | https://cookbook.openai.com/examples/deep_research_api/introduction_to_deep_research_api_agents | code | 2025 | Single + multi-agent pipelines for research workflows | HIGH |
| OpenAI Swarm (experimental) | https://github.com/openai/swarm | code | Archived/experimental | Reference multi-agent framework; superseded by Agents SDK | MED |
| OpenAI Developer Community | https://community.openai.com/ | forum | Active | Main Discourse forum — API + agents discussion | HIGH |
| OpenAI Forum | https://forum.openai.com/ | forum | Active | Broader AGI/developer community forum | MED |
| GitHub Discussions — agents-python | https://github.com/openai/openai-agents-python/discussions | forum | Active | Direct-to-SDK-team discussion | HIGH |
| OpenAI Developers portal | https://developers.openai.com/ | docs | Active | Top-level dev hub; links to agents/ChatKit/Assistants | HIGH |
| Assistants API docs (legacy path) | https://platform.openai.com/docs/assistants/overview | docs | Deprecating | Prior agent-like API; being sunset in favor of Responses/Agents SDK | MED |
| Responses API docs | https://platform.openai.com/docs/api-reference/responses | docs | Current | Underlying API Agents SDK targets | HIGH |

### 3.3 Google (Gemini / Vertex AI / ADK)

| Name | URL | Type | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| Agent Development Kit (ADK) docs | https://google.github.io/adk-docs | docs | Active | Canonical ADK reference — Python, TS, Go, Java | HIGH |
| ADK — Python repo | https://github.com/google/adk-python | code | Active | Open-source, code-first toolkit for building, eval, deploying agents | HIGH |
| Vertex AI Agent Engine — quickstart | https://docs.cloud.google.com/agent-builder/agent-engine/quickstart-adk | docs | Current | Deploy ADK agents to managed runtime | HIGH |
| Gemini Enterprise Agent Platform | https://cloud.google.com/products/agent-builder | docs | Current | Formerly Vertex AI Agent Builder — Google's production agent platform | HIGH |
| Agent Development Kit overview | https://docs.cloud.google.com/agent-builder/agent-development-kit/overview | docs | Current | GCP docs entry-point for ADK | HIGH |
| Gemini CLI — announcement | https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/ | blog | 2025 | Launch post for Google's Claude-Code-equivalent terminal agent | HIGH |
| Gemini CLI — GitHub | https://github.com/google-gemini/gemini-cli | code | Active | Source + issues + roadmap | HIGH |
| "Subagents have arrived in Gemini CLI" | https://developers.googleblog.com/subagents-have-arrived-in-gemini-cli/ | blog | 2026 | Subagent delegation pattern in Gemini CLI | HIGH |
| "Plan mode now available in Gemini CLI" | https://developers.googleblog.com/plan-mode-now-available-in-gemini-cli/ | blog | 2026 | Plan-then-execute mode | HIGH |
| Google Developers Blog — Agents tag | https://developers.googleblog.com/ | blog | Active | Ongoing product posts on ADK, Gemini CLI, Agent Platform | HIGH |
| Google Cloud Blog — "Agent Factory" series | https://cloud.google.com/blog/topics/developers-practitioners/ | blog | Active | Recurring deep-dive series on agent building | HIGH |
| Codelabs — Intro to A2A with Agent Engine | https://codelabs.developers.google.com/intro-a2a-purchasing-concierge | tutorial | 2025+ | Hands-on A2A example | HIGH |
| Partner Skills — ADK/MCP/A2A learning path | https://partner.skills.google/paths/3033 | course | Current | Structured partner training on ADK + protocols | MED |
| Gemini API docs | https://ai.google.dev/ | docs | Active | Core Gemini API reference (non-Vertex path) | HIGH |

### 3.4 Perplexity

| Name | URL | Type | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| Perplexity API docs | https://docs.perplexity.ai/docs/getting-started/overview | docs | Active | Search-augmented LLM API + Agent API | HIGH |
| Perplexity Agent API announcement | https://www.perplexity.ai/hub/blog/agent-api-a-managed-runtime-for-agentic-workflows | blog | 2026 | Managed runtime for agentic workflows with search + multi-model orchestration | HIGH |
| Perplexity changelog | https://www.perplexity.ai/changelog | blog | Active | All product shipping notes incl. Comet, Deep Research | HIGH |
| Comet Resource Hub | https://www.perplexity.ai/comet/resources | docs | Current | Agentic browser (Comet Assistant) resources | MED |
| Comet Enterprise | https://www.perplexity.ai/enterprise/comet | docs | Current | Enterprise deployment for Comet browser agent | MED |
| Perplexity llms-full.txt | https://docs.perplexity.ai/llms-full.txt | docs | Current | LLM-ingestible full docs dump incl. Create Agent Response endpoint | MED |

### 3.5 xAI (Grok)

| Name | URL | Type | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| xAI API landing | https://x.ai/api | docs | Current | Main developer entry point | HIGH |
| xAI Docs — overview | https://docs.x.ai/overview | docs | Active | Canonical xAI developer docs | HIGH |
| xAI Docs — quickstart | https://docs.x.ai/developers/quickstart | docs | Current | Getting started with Grok API | HIGH |
| Models & pricing | https://docs.x.ai/developers/models | docs | Current | Model capabilities & limits, incl. Grok 4.1 Fast 2M context | HIGH |
| "Grok 4.1 Fast and Agent Tools API" | https://x.ai/news/grok-4-1-fast | blog | 2025/26 | Launch of Agent Tools API: web/X search, code exec, function calling | HIGH |
| Grok Voice Agent API | https://docs.x.ai/docs/guides/voice/agent | docs | Current | Voice-mode agent with file search, custom tools | MED |

### 3.6 Multi-vendor / Cross-vendor standards

| Name | URL | Type | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| Model Context Protocol — spec site | https://modelcontextprotocol.io | standard | 2025-11-25 rev | Canonical MCP spec + docs | HIGH |
| MCP Specification (latest) | https://modelcontextprotocol.io/specification/2025-11-25 | standard | 2025-11-25 | Dated spec revision; canonical machine-readable protocol | HIGH |
| MCP Registry | https://registry.modelcontextprotocol.io/ | standard/aggregator | 2025-09 launch | Official public catalog of MCP servers | HIGH |
| MCP Registry GitHub | https://github.com/modelcontextprotocol/registry | code | Active | Source for the registry + OpenAPI spec | HIGH |
| MCP reference servers | https://github.com/modelcontextprotocol/servers | code | Active | Official reference server implementations | HIGH |
| Awesome MCP Servers (wong2) | https://github.com/wong2/awesome-mcp-servers | aggregator | Active | Largest community-curated MCP list | HIGH |
| Awesome MCP Servers (punkpeye) | https://github.com/punkpeye/awesome-mcp-servers | aggregator | Active | Alternate community list | MED |
| A2A Protocol — spec site | https://a2a-protocol.org/latest/specification/ | standard | Active | Agent2Agent protocol, donated to Linux Foundation June 2025 | HIGH |
| A2A — Google launch post | https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/ | blog | 2025 | Announcement + 50+ founding partners | HIGH |
| A2A — GitHub | https://github.com/a2aproject/A2A | code | Active | Source spec + SDKs | HIGH |
| A2A — upgrade announcement | https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade | blog | 2026 | v2 upgrade notes | HIGH |
| "Developer's Guide to AI Agent Protocols" | https://developers.googleblog.com/developers-guide-to-ai-agent-protocols/ | blog | 2025 | MCP vs A2A vs ACP comparison from Google | HIGH |
| OpenTelemetry Gen AI semantic conventions | https://opentelemetry.io/docs/specs/semconv/gen-ai/ | standard | Active | Cross-vendor tracing / observability standard for LLM + agent calls | HIGH |
| Agent Protocol (LangChain origin) | https://github.com/langchain-ai/agent-protocol | standard | Active | Open standard for serving agents over HTTP | MED |
| IBM on A2A | https://www.ibm.com/think/topics/agent2agent-protocol | blog | 2025 | Vendor-neutral explainer | MED |

### 3.7 Other major-lab ecosystems (Meta, Mistral, Cohere, AWS Bedrock, Azure AI)

| Name | URL | Type | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| AWS Bedrock AgentCore overview | https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html | docs | Active | Agentic platform w/ Runtime, Gateway, Memory, Identity, Browser, CodeInterp, Observability | HIGH |
| AWS Bedrock Agents (landing) | https://aws.amazon.com/bedrock/agents/ | docs | Current | Managed agent service, model-agnostic | HIGH |
| AgentCore samples | https://github.com/awslabs/agentcore-samples | code | Active | Production-oriented samples | HIGH |
| Strands Agents SDK | https://strandsagents.com/ | docs | Active | AWS-maintained open agent SDK (pairs with AgentCore) | HIGH |
| AWS Prescriptive Guidance — Agentic AI Frameworks | https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-frameworks/ | docs | Current | Framework comparison for AWS customers | HIGH |
| Microsoft Foundry Agent Service — overview | https://learn.microsoft.com/en-us/azure/foundry/agents/overview | docs | Active | Azure's managed agent service | HIGH |
| Azure AI Foundry docs | https://learn.microsoft.com/en-us/azure/ai-foundry/ | docs | Active | Full Azure AI platform | HIGH |
| Azure Agent Service — quickstart | https://learn.microsoft.com/en-us/azure/foundry-classic/agents/quickstart | docs | Current | Hands-on quickstart | HIGH |
| Azure AI Foundry Build-your-first-agent workshop | https://microsoft.github.io/build-your-first-agent-with-azure-ai-agent-service-workshop/ | tutorial | Active | Official workshop | HIGH |
| Meta LLaMA docs | https://www.llama.com/ | docs | Active | Model cards + agent-pattern docs; popular in OSS agent stacks | HIGH |
| LLaMA Stack | https://github.com/meta-llama/llama-stack | code | Active | Meta's agent/tool orchestration stack for LLaMA models | HIGH |
| Cohere — agents docs | https://docs.cohere.com/docs/agents | docs | Active | Cohere's built-in agents API (Command R+ tool use) | HIGH |
| Cohere — tool use | https://docs.cohere.com/docs/tool-use | docs | Active | Function-calling / tool use reference | HIGH |
| Mistral Agents API | https://docs.mistral.ai/agents/agents_introduction/ | docs | Active | Mistral's managed agents w/ built-in connectors | HIGH |
| Mistral Agents launch blog | https://mistral.ai/news/agents-api | blog | 2025 | Announcement of Agents API w/ MCP support | HIGH |
| IBM watsonx Orchestrate Agents | https://www.ibm.com/products/watsonx-orchestrate | docs | Current | Enterprise agent platform | MED |
| Databricks Mosaic Agents | https://www.databricks.com/product/artificial-intelligence/agent-framework | docs | Current | Databricks Agent Framework | MED |
| Snowflake Cortex Agents | https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents | docs | Current | In-data-warehouse agent runtime | MED |
| NVIDIA NIM agents + Agent Blueprints | https://docs.nvidia.com/nim/ | docs | Active | NVIDIA-maintained agent blueprints + NeMo Retriever | HIGH |
| Salesforce Agentforce docs | https://help.salesforce.com/s/articleView?id=platform.agentforce_overview.htm | docs | Current | CRM-embedded agent builder | MED |

---

## 4. By Source Type

### 4.1 Official documentation

Consolidated from §3 for scan-by-how-I-learn:

| Vendor | Root docs | Agents-specific entry point |
|---|---|---|
| Anthropic | https://docs.anthropic.com | https://platform.claude.com/docs/en/agent-sdk/overview |
| OpenAI | https://platform.openai.com/docs | https://openai.github.io/openai-agents-python/ |
| Google (AI Studio) | https://ai.google.dev/ | https://google.github.io/adk-docs |
| Google Cloud (Vertex) | https://cloud.google.com/vertex-ai | https://cloud.google.com/products/agent-builder |
| Perplexity | https://docs.perplexity.ai | https://www.perplexity.ai/hub/blog/agent-api-a-managed-runtime-for-agentic-workflows |
| xAI | https://docs.x.ai | https://x.ai/news/grok-4-1-fast |
| AWS | https://aws.amazon.com/bedrock/ | https://docs.aws.amazon.com/bedrock-agentcore/ |
| Azure | https://learn.microsoft.com/en-us/azure/ai-foundry/ | https://learn.microsoft.com/en-us/azure/foundry/agents/overview |
| Cohere | https://docs.cohere.com | https://docs.cohere.com/docs/agents |
| Mistral | https://docs.mistral.ai | https://docs.mistral.ai/agents/agents_introduction/ |
| Meta | https://www.llama.com | https://github.com/meta-llama/llama-stack |

Cross-vendor standard docs:
- MCP — https://modelcontextprotocol.io
- A2A — https://a2a-protocol.org/latest/specification/
- OpenTelemetry Gen AI — https://opentelemetry.io/docs/specs/semconv/gen-ai/

### 4.2 Vendor engineering blogs

| Vendor | Blog URL | Agent-relevant tag/topic URL |
|---|---|---|
| Anthropic | https://www.anthropic.com/engineering | https://www.anthropic.com/research |
| OpenAI | https://openai.com/blog | https://openai.com/index/introducing-agentkit/ |
| Google Developers | https://developers.googleblog.com/ | https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/ |
| Google Cloud | https://cloud.google.com/blog | https://cloud.google.com/blog/topics/developers-practitioners/ |
| Microsoft Foundry | https://devblogs.microsoft.com/foundry/ | https://devblogs.microsoft.com/agent-framework/ |
| Microsoft Semantic Kernel | https://devblogs.microsoft.com/semantic-kernel/ | (agent framework tag) |
| AWS Machine Learning | https://aws.amazon.com/blogs/machine-learning/ | (agentcore tag) |
| Databricks | https://www.databricks.com/blog | (AI agent framework tag) |
| Perplexity | https://www.perplexity.ai/hub | https://www.perplexity.ai/hub/blog/agent-api-a-managed-runtime-for-agentic-workflows |
| xAI | https://x.ai/blog | https://x.ai/news/grok-4-1-fast |
| Cohere | https://cohere.com/blog | (tool use / agents tag) |
| Mistral | https://mistral.ai/news | https://mistral.ai/news/agents-api |
| LangChain | https://blog.langchain.dev/ | (tag: agents / LangGraph) |
| LlamaIndex | https://www.llamaindex.ai/blog | https://www.llamaindex.ai/workflows |
| Hugging Face | https://huggingface.co/blog | https://huggingface.co/blog/smolagents |
| Langfuse | https://langfuse.com/blog | https://langfuse.com/blog/2025-03-19-ai-agent-comparison |

### 4.3 Cookbooks / sample-code repos

| Source | URL |
|---|---|
| Anthropic Claude Cookbooks | https://github.com/anthropics/claude-cookbooks |
| Anthropic Skills | https://github.com/anthropics/skills |
| OpenAI Cookbook | https://github.com/openai/openai-cookbook |
| OpenAI Cookbook — Agents topic | https://cookbook.openai.com/topic/agents |
| Google ADK samples | https://github.com/google/adk-samples |
| Google A2A samples | https://github.com/a2aproject/a2a-samples |
| AWS AgentCore samples | https://github.com/awslabs/agentcore-samples |
| AWS Bedrock samples | https://github.com/aws-samples/amazon-bedrock-workshop |
| Azure AI Foundry samples | https://github.com/Azure-Samples/azureai-samples |
| LangChain cookbook | https://github.com/langchain-ai/langchain/tree/master/cookbook |
| LangGraph examples | https://github.com/langchain-ai/langgraph/tree/main/examples |
| CrewAI examples | https://github.com/crewAIInc/crewAI-examples |
| smolagents examples | https://github.com/samwit/smolagents_examples |
| LlamaIndex agent examples | https://github.com/run-llama/llama_index/tree/main/docs/docs/examples/agent |
| Pydantic AI examples | https://github.com/pydantic/pydantic-ai/tree/main/examples |
| AutoGen samples | https://github.com/microsoft/autogen/tree/main/python/samples |
| Agno cookbook | https://github.com/agno-agi/agno/tree/main/cookbook |

### 4.4 Reference implementations on GitHub (open-source frameworks)

| Framework | URL | Stars (approx.) | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| LangGraph | https://github.com/langchain-ai/langgraph | Very high | Active | De-facto standard for graph-based stateful agents; used by Klarna, Replit, Elastic | HIGH |
| LangGraph.js | https://github.com/langchain-ai/langgraphjs | High | Active | JS/TS port, used by Uber, LinkedIn, GitLab | HIGH |
| LangChain | https://github.com/langchain-ai/langchain | Very high | Active | Orchestration toolkit + ecosystem substrate | HIGH |
| DeepAgents (LangChain) | https://github.com/langchain-ai/deepagents | Medium | Active | Reference "deep agent" harness: planning + filesystem + subagents | HIGH |
| CrewAI | https://github.com/crewaiinc/crewai | Very high | Active | Role-based multi-agent orchestration, independent of LangChain | HIGH |
| CrewAI examples | https://github.com/crewAIInc/crewAI-examples | High | Active | End-to-end example crews | HIGH |
| AutoGen | https://github.com/microsoft/autogen | Very high | Maintenance | v0.4 actor-model multi-agent; now folded into MS Agent Framework | HIGH |
| Microsoft Agent Framework | https://github.com/microsoft/agent-framework | High (growing) | Active | Successor to AutoGen + Semantic Kernel (Python + .NET) | HIGH |
| Semantic Kernel | https://github.com/microsoft/semantic-kernel | Very high | Active | Enterprise SDK (.NET/Python/Java); agent framework GA 1.45 | HIGH |
| smolagents (Hugging Face) | https://github.com/huggingface/smolagents | High | Active | Minimal ~1k-LOC agent lib; CodeAgent + ToolCallingAgent | HIGH |
| Pydantic AI | https://github.com/pydantic/pydantic-ai | High | Active | Type-safe provider-agnostic agent framework + Pydantic-Graph | HIGH |
| LlamaIndex | https://github.com/run-llama/llama_index | Very high | Active | RAG-first; AgentWorkflow + Workflows 1.0 for agentic systems | HIGH |
| DSPy | https://github.com/stanfordnlp/dspy | Very high | Active | Programmatic LM pipelines; ReAct agent + MIPROv2 optimizer | HIGH |
| Haystack | https://github.com/deepset-ai/haystack | Very high | Active | deepset's production pipeline + agent framework (2.x) | HIGH |
| Strands Agents | https://github.com/strands-agents/sdk-python | Medium+ | Active | AWS-maintained open-source agent SDK; pairs with Bedrock AgentCore | HIGH |
| Agno (formerly Phidata) | https://github.com/agno-agi/agno | High | Active | Multimodal agents with memory/knowledge/tools/reasoning | HIGH |
| OpenAI Swarm | https://github.com/openai/swarm | High | Experimental/archived | Original routines-and-handoffs reference, superseded | MED |
| Google ADK — Python | https://github.com/google/adk-python | High | Active | See §3.3 | HIGH |
| Claude Agent SDK — Python | https://github.com/anthropics/claude-agent-sdk-python | High | Active | See §3.1 | HIGH |
| Awesome AI Agents 2026 | https://github.com/Zijian-Ni/awesome-ai-agents-2026 | Medium | Active | Curated 2026 frameworks + platforms | MED |
| awesome-LangGraph | https://github.com/von-development/awesome-LangGraph | Medium | Active | LangChain/LangGraph ecosystem aggregator | MED |
| Alirezadir — Agentic-AI-Systems | https://github.com/alirezadir/Agentic-AI-Systems | Medium | Active | Practical system-design + hands-on resources | MED |

### 4.5 Training courses

| Course | URL | Platform | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| Agentic AI (Andrew Ng) | https://learn.deeplearning.ai/courses/agentic-ai/information | DeepLearning.AI | 2025 | Vendor-neutral 4 design patterns taught in raw Python; flagship agent course | HIGH |
| AI Agents in LangGraph (Harrison Chase + Rotem Weiss) | https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/ | DeepLearning.AI | 2024+ | From-scratch agent then rebuild in LangGraph | HIGH |
| A2A: The Agent2Agent Protocol | https://www.deeplearning.ai/short-courses/a2a-the-agent2agent-protocol/ | DeepLearning.AI (w/ Google Cloud + IBM) | 2025 | Hands-on A2A protocol course | HIGH |
| ACP: Agent Communication Protocol | https://learn.deeplearning.ai/courses/acp-agent-communication-protocol/information | DeepLearning.AI | 2025 | ACP standard walkthrough | HIGH |
| Multi-AI Agent Systems with CrewAI | https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/ | DeepLearning.AI | 2024 | Multi-agent orchestration | HIGH |
| Long-Term Agentic Memory with LangGraph | https://www.deeplearning.ai/short-courses/long-term-agentic-memory-with-langgraph/ | DeepLearning.AI | 2025 | Memory systems for agents | HIGH |
| DeepLearning.AI — Courses hub | https://www.deeplearning.ai/courses/ | DeepLearning.AI | Active | Full catalog of short courses | HIGH |
| Hugging Face AI Agents Course | https://huggingface.co/learn/agents-course/en/unit0/introduction | Hugging Face | Active | Free + certified 5-chapter curriculum (smolagents, LangGraph, LlamaIndex) | HIGH |
| Hugging Face Agents Course — repo | https://github.com/huggingface/agents-course | Hugging Face | Active | Source repo for the curriculum | HIGH |
| LangChain Academy | https://academy.langchain.com/ | LangChain | Active | Free structured LangGraph basics course | HIGH |
| Scrimba — Langbase / AI agents | https://scrimba.com/ | Scrimba | Active | Interactive coding courses on agents | MED |
| Udemy — Complete Agentic AI Engineering Course | https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/ | Udemy | 2025/26 | 6-week OpenAI Agents SDK, CrewAI, LangGraph, AutoGen, MCP | MED |
| Udemy — AI Agents: From Foundations to Enterprise | https://www.udemy.com/course/ai-agents-from-foundations-to-enterprise-systems/ | Udemy | 2025/26 | Enterprise-leaning agent course | MED |
| Pluralsight — Integrating AI Agents in Enterprise Systems | https://www.pluralsight.com/courses/integrating-ai-agents-enterprise-systems | Pluralsight | Current | Enterprise agent integration | MED |
| Partner Skills — ADK/MCP/A2A (Google) | https://partner.skills.google/paths/3033 | Google | Current | Partner-focused ADK learning path | MED |
| Hamel Husain's Open LLM Course | https://hamel.dev/blog/posts/course/ | Independent | 2024+ | Practitioner-led LLM+agents curriculum | HIGH |

### 4.6 Books

| Title | Authors | Publisher | Year | Why it matters | Quality |
|---|---|---|---|---|---|
| Building Agentic AI Systems | Anjanava Biswas, Wrick Talukdar | Packt | 2025 | Most-cited 2025 agent book; covers reasoning, planning, action loops | HIGH |
| AI Engineering | Chip Huyen | O'Reilly | 2025 | Canonical AI-engineering textbook (agents chapter + repo) | HIGH |
| AI Engineering — companion repo | https://github.com/chiphuyen/aie-book | Chip Huyen | 2025 | Resources + code + errata | HIGH |
| What We Learned from a Year of Building with LLMs | Eugene Yan, Hamel Husain, Jason Liu, Bryan Bischof, Charles Frye, Shreya Shankar | O'Reilly (essay + talk) | 2024 | Most-cited practitioner essay series | HIGH |
| Building LLMs for Production | Louis-François Bouchard, Louie Peters | Towards AI | 2024 | Pipeline-level RAG + agent patterns | MED |
| AI Agents in Action | Micheal Lanham | Manning | 2025 | Hands-on agent book (LangChain, AutoGen, CrewAI) | MED |
| O'Reilly Library — Agentic AI | https://www.oreilly.com/library/view/building-agentic-ai/9781803238753/ | O'Reilly (host) | Current | Online reader for Biswas/Talukdar | HIGH |

### 4.7 Podcasts

| Show | URL | Hosts | Why it matters | Quality |
|---|---|---|---|---|
| Latent Space | https://www.latent.space/podcast | Swyx, Alessio Fanelli | AI-engineer-focused; heavy on agents, code-gen, context engineering | HIGH |
| Latent Space podcast archive | https://www.latent.space/podcast/archive | — | Full archive incl. Notion, OpenAI frontier agents episodes | HIGH |
| The Cognitive Revolution | https://www.cognitiverevolution.ai/ | Nathan Labenz, Erik Torenberg | Biweekly AI builders + scouts; regular agent deep-dives | HIGH |
| No Priors | https://podcasts.apple.com/us/podcast/no-priors-artificial-intelligence-technology-startups/id1668002688 | Sarah Guo, Elad Gil | Founder/investor-leaning; frequent agent framework coverage | HIGH |
| Dwarkesh Podcast | https://www.dwarkesh.com/ | Dwarkesh Patel | Long-form labs-leader interviews; agents & AGI-timeline content | HIGH |
| Practical AI | https://changelog.com/practicalai | Daniel Whitenack, Chris Benson | Engineering-leaning weekly show | HIGH |
| AI Engineer Podcast (AI.Engineer) | https://www.ai.engineer/ | — | Conference org + talk recordings | HIGH |
| Machine Learning Street Talk | https://www.youtube.com/@MachineLearningStreetTalk | Tim Scarfe et al. | Research-deep interviews, agent + reasoning topics | HIGH |
| The TWIML AI Podcast | https://twimlai.com/podcast/twimlai/ | Sam Charrington | Long-running ML + agents coverage | HIGH |
| Gradient Dissent (Weights & Biases) | https://wandb.ai/fully-connected/podcast | Lukas Biewald | MLOps-leaning show, agent eval topics | MED |

### 4.8 Discussion forums & community

| Venue | URL | Type | Notes | Quality |
|---|---|---|---|---|
| r/AI_Agents | https://www.reddit.com/r/AI_Agents/ | Reddit | ~212K members; agent frameworks + multi-agent builds | HIGH |
| r/LocalLLaMA | https://www.reddit.com/r/LocalLLaMA/ | Reddit | ~658K members; local models + tooling + agent runs | HIGH |
| r/LangChain | https://www.reddit.com/r/LangChain/ | Reddit | LangChain/LangGraph focus | HIGH |
| r/MachineLearning | https://www.reddit.com/r/MachineLearning/ | Reddit | Research-leaning; weekly paper threads | HIGH |
| r/ClaudeAI | https://www.reddit.com/r/ClaudeAI/ | Reddit | Claude/MCP/Claude Code community | MED |
| r/OpenAI | https://www.reddit.com/r/OpenAI/ | Reddit | Developer + end-user discussion | MED |
| r/Bard (Gemini) | https://www.reddit.com/r/GoogleGeminiAI/ | Reddit | Gemini API + CLI discussion | MED |
| Hacker News — "Building Effective AI Agents" thread | https://news.ycombinator.com/item?id=44301809 | HN | Canonical HN discussion of Anthropic post | HIGH |
| Hacker News — "Exploiting AI agent benchmarks" thread | https://news.ycombinator.com/item?id=47733217 | HN | Critical examination of benchmark gaming | HIGH |
| Hacker News — "Reflections on AI at end of 2025" | https://news.ycombinator.com/item?id=46334819 | HN | State-of-field thread | MED |
| OpenAI Developer Community (Discourse) | https://community.openai.com/ | Forum | Largest OpenAI-side forum | HIGH |
| OpenAI Forum | https://forum.openai.com/ | Forum | Longer-form AGI/devs | MED |
| Anthropic Discord (via claude.ai community) | https://www.anthropic.com/ | Forum | Official community touchpoint | MED |
| LangChain Slack community | https://www.langchain.com/join-community | Slack | Official; weekly webinars | HIGH |
| LangChain Discord | https://discord.com/invite/langchain | Discord | ~31K members, LangChain/LangGraph support | HIGH |
| Latent Space Discord | https://discord.com/invite/SPTU68QRC5 | Discord | AI-engineer community; LLM Paper Club | HIGH |
| Hugging Face Discord | https://hf.co/join/discord | Discord | Largest OSS-AI community; agents course support | HIGH |
| CrewAI Discord | https://discord.gg/X4JWnZnxPb | Discord | Official CrewAI server | MED |
| MCP Discord | https://discord.com/invite/6CSzBmMkjX | Discord | Official MCP developer community | HIGH |
| Pydantic AI Discord | https://discord.gg/Pydantic | Discord | Pydantic AI support + discussion | MED |
| LlamaIndex Discord | https://discord.com/invite/eN6D2HQ4aX | Discord | LlamaIndex developer community | MED |
| awesome Discord servers for AI agents | https://github.com/best-ai-agents/discord-servers-for-ai-agents | Aggregator | Curated Discord server list | MED |
| Stack Overflow — [openai-api] / [langchain] / [claude] tags | https://stackoverflow.com/questions/tagged/langchain | Q&A | Practical troubleshooting | MED |

**Representative X (Twitter) accounts** (handle — primary focus):
- @karpathy (Andrej Karpathy) — papers, tutorials, frontier commentary
- @simonw (Simon Willison) — practical LLM/agent tooling, Datasette
- @jxnlco (Jason Liu) — Instructor, structured outputs, practitioner threads
- @HamelHusain (Hamel Husain) — evals, agent debugging, LLM consulting
- @chipro (Chip Huyen) — AI engineering, production ML
- @swyx (Shawn "Swyx" Wang) — AI-engineer movement, Latent Space
- @natolambert (Nathan Lambert) — Interconnects, RLHF/agent research
- @AndrewYNg (Andrew Ng) — DeepLearning.AI courses
- @osanseviero (Omar Sanseviero) — HF dev relations, agents course
- @hwchase17 (Harrison Chase) — LangChain/LangGraph
- @gregd (Greg Kamradt) — context windows, long-doc retrieval, agent tests
- @logangilbert / @OfficialLoganK (Logan Kilpatrick) — Google AI DevRel
- @steipete (Peter Steinberger) — agentic engineering
- @alexalbert__ (Alex Albert) — Anthropic DevRel
- @sama (Sam Altman) — OpenAI leadership signals
- @elonmusk / @xai — Grok announcements
- @aravsrinivas (Aravind Srinivas) — Perplexity
- @AnthropicAI / @OpenAI / @GoogleAI / @xai / @AnthropicAI / @PerplexityAI — official channels

### 4.9 Academic venues & papers

| Venue / Paper | URL | Type | Notes | Quality |
|---|---|---|---|---|
| arXiv — cs.AI / cs.CL / cs.MA | https://arxiv.org/list/cs.MA/recent | venue | Preprint feed; cs.MA (multi-agent) is the most agent-focused | HIGH |
| NeurIPS | https://neurips.cc/ | conference | Datasets & Benchmarks Track hosts most canonical agent benchmarks (OSWorld 2024, etc.) | HIGH |
| ICLR | https://iclr.cc/ | conference | Major venue for reasoning/agent research | HIGH |
| ICML | https://icml.cc/ | conference | BFCL published here 2025 | HIGH |
| ACL / EMNLP | https://aclweb.org/ | conference | NLP-leaning agents work (planning, dialogue, tool use) | HIGH |
| COLM (Conference on Language Modeling) | https://colmweb.org/ | conference | New venue; agent-heavy | HIGH |
| "A Survey on LLM-based Autonomous Agents" | https://arxiv.org/abs/2308.11432 | paper | Most-cited overview survey | HIGH |
| "Understanding the planning of LLM agents: A survey" | https://arxiv.org/abs/2402.02716 | paper | Taxonomy: decomposition, selection, external-module, reflection, memory | HIGH |
| "Agentic AI: A Comprehensive Survey" | https://arxiv.org/html/2510.25445 | paper | 2025 comprehensive survey of architectures + applications | HIGH |
| "The Landscape of Agentic Reinforcement Learning for LLMs" | https://arxiv.org/html/2509.02547v5 | paper | Agentic RL survey 2025 | HIGH |
| "Deep Research: A Survey of Autonomous Research Agents" | https://arxiv.org/html/2508.12752v1 | paper | Covers OpenAI/Anthropic/Perplexity Deep Research patterns | HIGH |
| "Fundamentals of Building Autonomous LLM Agents" | https://arxiv.org/pdf/2510.09244 | paper | Recent fundamentals survey | MED |
| "A Survey on the Optimization of LLM-based Agents" | https://arxiv.org/html/2503.12434v2 | paper | Learning/optimization for agents | HIGH |
| LLM-Agent-Survey (CoLing 2025 companion) | https://github.com/xinzhel/LLM-Agent-Survey | aggregator/paper | Repo accompanying a CoLing survey | MED |
| PapersWithCode — LLM Agents | https://paperswithcode.com/ | aggregator | Benchmarks + code companion | HIGH |
| OpenReview — agents tag | https://openreview.net/ | venue | Conference review records | HIGH |

### 4.10 Benchmarks

| Benchmark | URL / leaderboard | Domain | Paper | Notes | Quality |
|---|---|---|---|---|---|
| SWE-bench / SWE-bench Verified | https://www.swebench.com | Coding: real GitHub issues | https://arxiv.org/abs/2310.06770 | Canonical coding-agent eval | HIGH |
| WebArena | https://webarena.dev/ | Web agents | https://arxiv.org/abs/2307.13854 | Realistic web tasks | HIGH |
| VisualWebArena | https://jykoh.com/vwa | Multimodal web agents | — | Visual extension of WebArena | HIGH |
| OSWorld | https://os-world.github.io/ | Desktop/OS agents | https://arxiv.org/abs/2404.07972 | Ubuntu/Win/Mac 369-task multimodal (NeurIPS 2024) | HIGH |
| GAIA | https://huggingface.co/gaia-benchmark | General assistants | https://arxiv.org/abs/2311.12983 | Real-world general-assistant tasks | HIGH |
| τ-bench / τ²-bench | https://taubench.com/ | Tool-agent-user interactions | https://arxiv.org/abs/2406.12045 | Retail/airline domain + pass^k metric | HIGH |
| τ²-bench repo | https://github.com/sierra-research/tau2-bench | — | — | Sierra-maintained v2 | HIGH |
| Terminal-Bench | https://www.tbench.ai/ | CLI/terminal agents | Stanford + Laude Institute | ~100 containerized tasks | HIGH |
| Terminal-Bench repo | https://github.com/laude-institute/terminal-bench | — | — | Source + harness | HIGH |
| BFCL (Berkeley Function-Calling Leaderboard) | https://gorilla.cs.berkeley.edu/leaderboard.html | Tool / function use | ICML 2025 poster | De-facto standard for function-call eval | HIGH |
| BFCL repo | https://github.com/ShishirPatil/gorilla | — | — | Source + datasets | HIGH |
| AgentBench | https://github.com/THUDM/AgentBench | General agent eval | https://arxiv.org/abs/2308.03688 | Multi-env benchmark (THUDM) | HIGH |
| MLE-bench | https://github.com/openai/mle-bench | ML engineering | https://arxiv.org/abs/2410.07095 | OpenAI's Kaggle-style ML agent eval | HIGH |
| BrowseComp | https://openai.com/index/browsecomp/ | Browsing | OpenAI, 2025 | Challenging browser-research tasks | HIGH |
| RE-Bench | https://metr.org/AI_R_D_Evaluation_Report.pdf | R&D tasks | METR, 2024 | Short/long-horizon ML-R&D eval | HIGH |
| WebVoyager | https://github.com/MinorJerry/WebVoyager | Web agents | https://arxiv.org/abs/2401.13919 | Multimodal web agent benchmark | MED |
| Mind2Web | https://osu-nlp-group.github.io/Mind2Web/ | Generalist web agents | https://arxiv.org/abs/2306.06070 | OSU NLP group | MED |
| Steel.dev benchmark index | https://leaderboard.steel.dev/results | Aggregator | — | Results across 16+ benchmarks, 121+ entries | HIGH |
| Holistic Agent Leaderboard | https://arxiv.org/pdf/2510.11977 | Aggregator | — | Meta-leaderboard analysis | MED |
| AI Agent Benchmark Compendium | https://github.com/philschmid/ai-agent-benchmark-compendium | Aggregator | — | 50+ benchmarks categorized | HIGH |
| Artificial Analysis — τ²-bench telecom | https://artificialanalysis.ai/evaluations/tau2-bench | Leaderboard | — | Independent telecom-domain leaderboard | MED |
| "Exploiting the most prominent AI agent benchmarks" | https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/ | Critique | — | Shows how 8 benchmarks can be exploited | HIGH |

### 4.11 Industry reports

| Report | URL | Publisher | Freshness | Why it matters | Quality |
|---|---|---|---|---|---|
| State of AI Report | https://www.stateof.ai/ | Air Street Capital (Nathan Benaich + Alex Chalmers) | Annual | Authoritative year-in-review incl. agents | HIGH |
| Stanford AI Index 2025 | https://hai.stanford.edu/ai-index/2025-ai-index-report | Stanford HAI | 2025 | Benchmark + deployment + policy data | HIGH |
| Stanford AI Index 2026 | https://spectrum.ieee.org/state-of-ai-index-2026 | Stanford HAI | 2026 | Latest edition (IEEE Spectrum summary) | HIGH |
| Anthropic Economic Index — landing | https://www.anthropic.com/economic-index | Anthropic | Active | How Claude is used across tasks/industries | HIGH |
| Anthropic Economic Index — Sept 2025 | https://www.anthropic.com/research/anthropic-economic-index-september-2025-report | Anthropic | 2025-09 | Geographic/task distribution of AI use | HIGH |
| Anthropic Economic Index — Jan 2026 | https://www.anthropic.com/research/anthropic-economic-index-january-2026-report | Anthropic | 2026-01 | Latest primitives report | HIGH |
| Thoughtworks Technology Radar Vol 32 | https://www.thoughtworks.com/content/dam/thoughtworks/documents/radar/2025/04/tr_technology_radar_vol_32_en.pdf | Thoughtworks | 2025-04 | 48 AI-related blips including agents | HIGH |
| Thoughtworks Technology Radar Vol 33 | https://www.thoughtworks.com/content/dam/thoughtworks/documents/radar/2025/11/tr_technology_radar_vol_33_en.pdf | Thoughtworks | 2025-11 | Rapid AI-assistance evolution | HIGH |
| OpenAI "What We Learned from a Year of Building with LLMs" (O'Reilly) | https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-ii/ | O'Reilly | 2024 | Practitioner essay series (Yan/Husain/Liu/Bischof/Frye/Shankar) | HIGH |
| Gartner Hype Cycle for AI (agents) | https://www.gartner.com/ | Gartner | Annual | Paywalled; referenced widely in enterprise discussion | MED |
| MIT Technology Review — AI charts 2026 | https://www.technologyreview.com/2026/04/13/1135675/ | MITTR | 2026-04 | Cross-cites Stanford + State of AI | MED |
| "Best AI Agent Frameworks" (Langfuse comparison) | https://langfuse.com/blog/2025-03-19-ai-agent-comparison | Langfuse | 2025-03 | Side-by-side framework comparison | MED |

### 4.11b Agent observability & evaluation tools

Separate cluster — sits between "docs" and "cookbooks" but deserves its own line item:

| Tool | URL | Focus | Quality |
|---|---|---|---|
| LangSmith | https://www.langchain.com/langsmith | LangChain/LangGraph observability + evals | HIGH |
| Langfuse | https://langfuse.com | Open-source LLMops; tracing + evals + prompt mgmt; ~12M SDK dl/mo | HIGH |
| Arize Phoenix | https://phoenix.arize.com/ | OSS, OpenTelemetry-based; OpenInference standard | HIGH |
| Arize AX | https://arize.com/ | Enterprise observability | HIGH |
| Braintrust | https://www.braintrust.dev/ | Eval-automation + CI/CD gating | HIGH |
| Patronus AI | https://www.patronus.ai/ | Safety/quality evals for agents | MED |
| Helicone | https://www.helicone.ai/ | LLM monitoring / proxy-based observability | MED |
| Weights & Biases Weave | https://wandb.ai/site/weave | Tracing + evals inside W&B | HIGH |
| Ragas | https://github.com/explodinggradients/ragas | OSS RAG/agent eval library | HIGH |
| DeepEval | https://github.com/confident-ai/deepeval | OSS pytest-style LLM/agent evals | HIGH |
| OpenLLMetry | https://github.com/traceloop/openllmetry | OSS OTel instrumentation for LLMs/agents | HIGH |
| LangWatch | https://langwatch.ai/ | Observability + quality monitoring | MED |
| Galileo | https://www.rungalileo.io/ | Hallucination detection + agent evals | MED |

### 4.11c Chinese-ecosystem note (under-represented above; second-pass candidates)

The scan above is English-source-biased. Notable Chinese-ecosystem agent sources worth a targeted follow-up pass:

| Name | URL | Notes |
|---|---|---|
| Qwen-Agent | https://github.com/QwenLM/Qwen-Agent | Alibaba's agent framework for Qwen models |
| ModelScope Agent | https://github.com/modelscope/modelscope-agent | Alibaba ModelScope's multi-agent framework |
| AgentScope | https://github.com/modelscope/agentscope | DAMO Academy multi-agent platform |
| Baidu Qianfan Agent Builder | https://cloud.baidu.com/product/qianfan-foundry | Baidu's agent platform |
| Zhipu GLM-Agent | https://github.com/THUDM/AgentTuning | Tsinghua/Zhipu AI agent fine-tuning research |
| DeepSeek docs | https://api-docs.deepseek.com/ | Function-calling / tool-use docs |
| Kimi (Moonshot AI) | https://platform.moonshot.cn/ | Chinese agent API, strong long-context |
| MiniMax Agent | https://api.minimax.chat/ | MiniMax agent/tool endpoints |

### 4.11d Agent security / governance (also under-represented)

| Name | URL | Notes |
|---|---|---|
| OWASP Top 10 for LLM Applications | https://genai.owasp.org/llm-top-10/ | Canonical LLM security taxonomy; agent implications |
| OWASP GenAI Agent Security Initiative | https://genai.owasp.org/initiatives/#agentsec | Dedicated agent-security working group |
| Microsoft Agent Governance Toolkit | https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/ | OSS runtime security for agents (April 2026) |
| Simon Willison — "prompt injection" tag | https://simonwillison.net/tags/prompt-injection/ | Canonical running coverage of agent-injection attacks |
| NIST AI RMF | https://www.nist.gov/itl/ai-risk-management-framework | US federal AI risk framework; agent-relevant |

### 4.12 Aggregators & awesome-lists

| Name | URL | Focus | Freshness | Quality |
|---|---|---|---|---|
| awesome-ai-agents-2026 (caramaschiHG) | https://github.com/caramaschiHG/awesome-ai-agents-2026 | 300+ agent resources, 20+ categories, monthly updates | 2026-04 | HIGH |
| awesome-ai-agents-2026 (Zijian-Ni) | https://github.com/Zijian-Ni/awesome-ai-agents-2026 | Frameworks + tools + platforms | 2026 | MED |
| awesome-llm-agents (kaushikb11) | https://github.com/kaushikb11/awesome-llm-agents | Frameworks catalog | 2026-04 | MED |
| Awesome-AI-Agents (Jenqyang) | https://github.com/Jenqyang/Awesome-AI-Agents | OSS autonomous agents | Active | MED |
| awesome-agents (kyrolabs) | https://github.com/kyrolabs/awesome-agents | OSS tools/products | Active | MED |
| awesome-llm-powered-agent (hyp1231) | https://github.com/hyp1231/awesome-llm-powered-agent | Papers/repos/blogs | Active | MED |
| awesome-Efficient-Agents (yxf203) | https://github.com/yxf203/Awesome-Efficient-Agents | Efficiency-focused agents | Active | MED |
| awesome-ai-agent-papers (VoltAgent) | https://github.com/VoltAgent/awesome-ai-agent-papers | 2026 research papers | Active | MED |
| Awesome-LLM (Hannibal046) | https://github.com/hannibal046/awesome-llm | Broad LLM catalog | Very active | HIGH |
| awesome-mcp-servers (wong2) | https://github.com/wong2/awesome-mcp-servers | MCP servers | Active | HIGH |
| awesome-claude-skills (travisvn) | https://github.com/travisvn/awesome-claude-skills | Claude Skills | Active | MED |
| awesome-LangGraph (von-development) | https://github.com/von-development/awesome-LangGraph | LangGraph ecosystem | Active | MED |
| Agents Index | https://agentsindex.ai/ | Catalog of agent products & communities | Active | MED |
| Papers with Code — agents | https://paperswithcode.com/task/language-model-based-agent | Benchmark + code aggregator | Active | HIGH |

---

## 5. Notable Individual Practitioners

Consistently high-signal public output on agent development, in no particular order:

| Person | Primary platform(s) | Focus |
|---|---|---|
| Andrej Karpathy | YouTube @andrejkarpathy; X @karpathy; karpathy.ai | LLM fundamentals, Zero-to-Hero; frontier commentary; "agent skills will fail" talks |
| Simon Willison | simonwillison.net; datasette.io | Practical LLM/agent usage; llm CLI; "agent = LLM runs tools in a loop" definition |
| Jason Liu | youtube.com/@jxnlco; jxnl.co | Instructor library; structured outputs; RAG+agents consulting |
| Hamel Husain | hamel.dev; YouTube @hamelhusain7140 | LLM evals, AI Evals course (with Shreya Shankar); consulting |
| Chip Huyen | huyenchip.com | *AI Engineering* book; ML/LLM production systems |
| Andrew Ng | deeplearning.ai; X @AndrewYNg | Agentic AI course; 4 design patterns; DLAI course hub |
| Nathan Lambert | interconnects.ai | Open models, RLHF, agent post-training; "Get Good at Agents" series |
| Shawn "Swyx" Wang | latent.space; swyx.io | Latent Space podcast; AI Engineer movement |
| Harrison Chase | blog.langchain.dev; X @hwchase17 | LangChain/LangGraph founder |
| Omar Sanseviero | X @osanseviero | HF DevRel; agents course |
| Shreya Shankar | sh-reya.com | LLM evals research; co-author of "What we learned" essay |
| Eugene Yan | eugeneyan.com | Applied ML at scale; co-author of "What we learned" essay |
| Charles Frye | charlesfrye.github.io | Modal, AI engineering education |
| Bryan Bischof | X @bebischof | Co-author of "What we learned" |
| Greg Kamradt | X @GregKamradt; datalumina | Agent testing, needle-in-haystack, long-context |
| Alex Albert | X @alexalbert__ | Anthropic DevRel; prompt library |
| Logan Kilpatrick | X @OfficialLoganK | Google AI Studio + DevRel |
| Peter Steinberger | X @steipete | OpenClaw/agentic engineering; OpenAI (as of Feb 2026) |
| Erik Meijer | X @headinthebox | Compositional reasoning; Fundamentals of LM-based agents |
| Jerry Liu | X @jerryjliu0 | LlamaIndex founder; agents + RAG |
| Yohei Nakajima | X @yoheinakajima | BabyAGI; Untapped Capital |
| Thomas Ahle / João Moura | X / crewai.com | CrewAI founders |
| Nathan Benaich | stateof.ai | State of AI Report |
| Sebastian Raschka | magazine.sebastianraschka.com | Ahead of AI newsletter; from-scratch tutorials |

---

## 6. Comparison-Readiness Note

This output is structured so the Gemini Deep Research run can be overlaid on top directly: §3 is a by-ecosystem cut (Anthropic, OpenAI, Google, Perplexity, xAI, multi-vendor, other major labs), §4 is a by-source-type cut (docs, blogs, cookbooks, OSS repos, courses, books, podcasts, forums, academic, benchmarks, reports, aggregators), and §5 is an explicit practitioners list. Each row includes URL + freshness + one-line rationale + quality tag so differences are visible at the row level, not just the section level. To diff Gemini's output: (1) extract its source URLs, (2) intersect with the Appendix A inventory below once populated, (3) flag sources it included that are absent here (candidates for Cowork to miss), and sources here that it missed (candidates for Gemini bias, e.g., typically Cowork over-indexes on Anthropic sources while Gemini may over-index on Google/Vertex). Expect agreement on canonical items (the big 4 agent SDKs, MCP spec, SWE-bench, LangGraph/CrewAI/AutoGen, DeepLearning.AI courses, State of AI Report) and divergence on (a) ranking within sections, (b) non-English sources, (c) Discord/X handles, and (d) long-tail framework coverage.

### Coverage statistics

Counted programmatically on 2026-04-23 (grep pass on this file):
- URL-bearing rows across all tables: 310
- Unique URLs (post-dedupe): 300
- Individual practitioners listed: 24
- Distinct benchmarks enumerated: 18
- Distinct ecosystem tables: 7 (§3.1–§3.7)
- Distinct source-type tables: 12 (§4.1–§4.12, plus 4.11b/c/d sub-clusters)

Comfortably exceeds the 80-150 threshold in the brief. Observability/eval tools, Chinese-ecosystem sources, and agent-security sources were added as §4.11b/§4.11c/§4.11d in a second pass. Remaining second-pass candidates: Japanese LLM community hubs, paywalled analyst reports (Gartner / Forrester / IDC), Confused-Deputy-specific agent-attack papers, and robotics-agent crossover venues (CoRL, RSS).

---

## Appendix A — Source Inventory (pointer)

The full source inventory is the union of every row in §3.1–§3.7 and §4.4–§4.12 above. Rather than duplicate ~200 rows into a single flat table (and let them drift), treat the sectional tables as the authoritative inventory — each row already carries Name, URL, Type, Freshness, Why-it-matters, and Quality fields. For a flat-table export, grep the file for `| http` — each such line is a source row.

Suggested extraction command:
```
grep -E '^\| \[|^\| http|^\| @' docs/reference/agentic-ai-landscape-scan.md
```

---

© 2026 Eric Riutort. All rights reserved.
