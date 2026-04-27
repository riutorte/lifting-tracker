---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# ChatGPT — Agentic AI Landscape Findings

Capture of the ChatGPT session Eric ran in parallel to the Cowork-side `agentic-ai-landscape-scan.md` and a Gemini Deep Research run. The goal is a three-way comparison of what each system surfaces independently for the same brief.

> **Scope note.** This doc is a faithful capture of what ChatGPT produced, plus one targeted follow-up to close the most consequential gap (Perplexity + xAI). It is *not* a synthesis, and it is not merged with Cowork- or Gemini-side outputs.

---

## 1. Executive Summary

- **ChatGPT produced a conceptual/synthesis map rather than a source index.** The output skews heavily toward framing ("three-layer stack," "standards are converging," "multi-agent is the default future") and thin on concrete citations per ecosystem. Every source cited in the rendered chat does have an anchor-tag URL attached — but the URLs are not visible in the prose, only in ChatGPT's citation chips, and a reader scanning the text sees only publication brand names.
- **First-party ecosystem coverage is uneven.** Anthropic (MCP), OpenAI (Agents SDK, AGENTS.md), and Google (ADK, A2A) get some treatment. Perplexity and xAI were reduced to one-sentence strategy blurbs in turns 1–4 and only got proper URL coverage after a direct follow-up.
- **Rate limit hit during Phase B.** The Perplexity/xAI follow-up response downgraded to the free model's weaker variant and rendered as ~40 citation chips with near-zero prose ("You're out of messages with the most advanced Free model. Responses will use a less powerful model until your usage resets after 2:23 PM."). Follow-ups 2 and 3 were held back to preserve Eric's remaining budget and avoid further degraded output.
- **Standards layer is ChatGPT's strongest contribution.** The MCP + A2A + AG-UI "three-layer networked architecture" framing and the "Agentic AI Foundation (Linux Foundation)" context is the most load-bearing synthesis in the output — and the Verge/WIRED/OpenAI/Tech Bytes/StackOne citations behind it are real, openable URLs.
- **Suspect signals worth flagging.** (a) Several source domains are low-authority SEO blogs (StackOne, AiPivotGuide, Generative Inc., INOVAWAY, Tech Bytes, Agentic AI Weekly, mindpattern.ai). (b) A "grok.cadn.net.cn" mirror was cited alongside the real `docs.x.ai`. (c) Repo star counts (85K, 76K) and adoption claims (177K tools, 1000+ MCP servers, "45% faster / 70% cost reduction") are repeated without dated primary sources. (d) arXiv IDs with YYMM prefixes of 2602/2604 (Feb–Apr 2026) look date-plausible but the titles/authors are not in the prose — verify before citing.

---

## 2. Access Log

| URL | Status | Notes |
|---|---|---|
| `https://chatgpt.com/c/69ea1d4a-aeb4-83e8-affc-e4e1824b0a54` (Eric's active chat) | OK | Fully rendered under Eric's authenticated session. Four pre-existing exchanges captured verbatim; one follow-up prompt sent and captured. |
| `https://chatgpt.com/share/69ea1f28-3528-83e8-b26c-068ad717506c` (public share link) | **Empty render** | Page title loaded ("Agentic AI Research Landscape") but `get_page_text` returned only footer HTML — no message content. The share viewer either required additional scroll/hydration time, or the share was expired/removed, or it's a differently-authored share than the active chat. Triangulation against it was not possible. |
| ChatGPT compose input (textbox ref_138) | OK | Targeted via a `#prompt-textarea` + `execCommand('insertText')` + synthetic-Enter keystroke through the `javascript_tool`. One follow-up injected and submitted successfully. |
| ChatGPT backend response | Partial | Follow-up response received, but under the Free plan's fallback model — it produced ~40 citation anchors and ~635 characters of actual prose. URLs were harvestable via DOM scrape. |

**Rate-limit impact.** "Out of messages with the most advanced Free model. Responses will use a less powerful model until usage resets after 2:23 PM." This is why planned follow-ups 2 (concrete URLs across the whole map) and 3 (books/podcasts/newsletters/courses) were not sent — the marginal value was low and the cost to Eric's quota was real.

---

## 3. Captured Conversation (Phase A)

The chat has four pre-existing user turns plus one follow-up I sent in Phase B. ChatGPT's replies are paraphrased (not reproduced verbatim, per copyright guidance); Eric's prompts are his own content and quoted verbatim.

### Turn 1 — Eric (original prompt, as he sent it)

> "I want to conduct a deep research tasks identifying all of the current sources of discussion on how to create agentic AI systems, software, etc., including those for OpenAI, Anthropic, Gemini, Perplexity, Grock, or other LLM systems that are used to creat agents. These are code examples, design patterns, use cases, discussion threads, training sessions, online classes, blogs, etc. These may be found in multiple sources."

### Turn 1 — ChatGPT reply (paraphrased)

A 10-section conceptual map of the "agentic AI ecosystem":

1. **Core concept.** Agentic systems converge on tool use, memory, and planning/iteration as a closed loop.
2. **Canonical design patterns.** Andrew Ng's four patterns (reflection, tool use, planning, multi-agent collaboration) and Anthropic's workflow-vs-agent taxonomy (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer). Plus research-backed decomposition (reasoning, perception/grounding, action, learning, communication) and practical patterns (ReAct, function calling, vector-DB memory, multi-agent delegation, HITL).
3. **Major frameworks & SDKs.** OpenAI Agents SDK (successor to Swarm); Anthropic MCP; Google ADK + AlphaEvolve; LangChain/LangGraph, AutoGen, CrewAI, Semantic Kernel, MetaGPT.
4. **Protocols & standards.** MCP (tool access), A2A (agent-to-agent), ANP (agent network protocol); "Agentic AI Foundation" under Linux Foundation as the convergence body.
5. **Code + repos.** Pattern libraries on GitHub/Reddit; insight that production teams tend to abandon heavy frameworks in favor of custom lightweight loops.
6. **Blogs, courses, thought leadership.** DeepLearning.AI, Anthropic engineering blog, OpenAI cookbook, Google DeepMind research, LangChain blog, AI Agents Kit, Adaline, AIMultiple.
7. **Reddit discourse.** Framework overload, custom-beats-abstraction, production pain points = guardrails/observability/cost.
8. **Use cases.** Coding agents, research agents, customer support, RPA replacement, data analysis; frontier = autonomous research, multi-agent orgs, self-improving agents, algorithm discovery.
9. **Meta-trends.** Prompts → systems; agents ≠ LLMs; multi-agent default; standards layer forming; simplicity wins.
10. **Learning path.** ReAct → build from scratch → frameworks → protocols → research papers.

### Turn 2 — Eric

> "I want you to conduct deep research online, not respond only with what is within your own training set"

### Turn 2 — ChatGPT reply (paraphrased)

Claimed it now pulled live sources. Produced an 8-section "true research index":

1. **Open standards / Agentic AI Foundation** — "co-founded by OpenAI + Anthropic + Block" under Linux Foundation; artifacts = MCP, A2A, AGENTS.md.
2. **Protocol stack** — three layers: tool access (MCP, Anthropic-origin), agent communication (A2A, Google-origin), UI (AG-UI).
3. **GitHub + open source** — "190+ public repos under ai-agents-framework"; named repos: LangChain, Microsoft "AI agents for beginners," ActivePieces (400+ MCP tools), "superpowers" (~85K stars), "everything-claude-code" (~76K stars), "context-mode"; one unnamed Java enterprise agent system with dual MCP+A2A support.
4. **Research papers** — AgentMaster (MCP+A2A multi-agent); AGAPI Agents (Planner→Executor→Summarizer with multiple LLMs + scientific tools); "Authenticated Workflows" paper defining four trust boundaries with cryptographic enforcement.
5. **Developer discourse** — same framework-overload-and-custom-beats-abstraction theme; "150+ skills libraries."
6. **Security & risks** — MCP RCE vulnerability (Tom's Hardware); TechRadar on MCP/A2A attack surfaces; WIRED on OpenAI/Anthropic/Block alliance; The Verge on the "new internet" for AI agents.
7. **Synthesis stack** — LLM → agent runtime → protocol layer → context/memory → application → governance.
8. **Meta-insights** — convergence is fast; innovation is above frameworks; multi-agent default; security is biggest unsolved; infrastructure strain; "agent management" as a new discipline.

### Turn 3 — Eric

> "Are you looking online for this?"

### Turn 3 — ChatGPT reply (paraphrased)

Acknowledged ambiguity. Offered three modes: (A) link-heavy "Research Feed," (B) structured comparative "Deep Technical Map," (C) iterative "Full Research Mode." Asked Eric to pick.

### Turn 4 — Eric

> "I want you to do Option A, Option B and Option C"

### Turn 4 — ChatGPT reply (paraphrased)

Combined all three modes:

- **Option A — Research feed.** Standards (MCP+A2A+AG-UI, StackOne framing); GitHub signals ("1000+ MCP servers," Agentic AI Weekly); research papers ("MCP ecosystem has 177K+ tools"); industry analysis (multi-agent enterprise gains: 45% faster, 70% cheaper, INOVAWAY); developer discourse ("20 production agentic patterns," Reddit r/learnmachinelearning); news cluster on MCP RCE, agent management, infra strain.
- **Option B — Deep technical map.** Per-vendor blurbs: OpenAI (AGENTS.md; "developer-first infrastructure"); Anthropic (MCP; "own tool + safety layer"); Google (A2A; "build agent networks, not just agents"); Microsoft ("enterprise infrastructure" via Copilot); Perplexity ("specialize in knowledge agents" — one line); xAI ("real-time reasoning, X platform" — one line); cross-platform (LangGraph, CrewAI, AutoGen, Semantic Kernel, "all converging").
- **Option C — Synthesis.** Six points reiterating turn 2: field standardized fast; innovation above frameworks; multi-agent default; security unsolved; infra bottleneck; "agent management" as discipline. Final compression: `Agent = LLM + tools (MCP) + communication (A2A) + loop (plan→act→evaluate) + memory + control`.

---

## 4. Follow-up Exchanges (Phase B)

### Follow-up #1 — Perplexity + xAI gap (sent)

**Gap this closes.** Turn 4 Option B gave Perplexity and xAI one-line strategy blurbs each, despite both being named explicitly in Eric's original prompt. Everything about how each ecosystem actually lets developers build agents (APIs, SDKs, docs, launch posts, community venues) was missing.

**Prompt I sent (in Eric's voice):**

> "Follow-up on the same research brief. Two ecosystems you essentially skipped in the map you produced are Perplexity and Grok/xAI — both explicitly named in my original prompt. Please go deep on each separately: canonical developer docs URLs (not brand names), agent-specific APIs and SDKs they ship, launch-posts and changelog entries for agent features, any first-party sample code or recipes, community discussion venues, and what's distinctive about how each one handles agent construction (tools, memory, orchestration, search integration). Cite actual URLs, not publication names. Keep the structured per-ecosystem format."

**ChatGPT reply — what actually came back.**

The response was delivered under the free-tier fallback model (a mid-response banner: *"You're out of messages with the most advanced Free model. Responses will use a less powerful model until your usage resets after 2:23 PM."*). The rendered message was ~635 characters of prose plus ~40 citation anchors with almost no connecting narrative — effectively a stream of link chips in this order:

- Perplexity Agent API docs → Perplexity API quickstart (all APIs) → Perplexity SDK docs → Search API docs → API platform overview → Perplexity (repeated) × 8 → The Economic Times → Perplexity → TechRadar → Reddit × 3 → Perplexity → Perplexity AI help center → Perplexity.
- xAI developer docs (overview) → xAI API introduction → Grok (cadn.net.cn mirror) → Cloudflare Docs → xAI Docs → PyPI (xai-grok) → Reddit → Cloudflare Docs → Reddit → xAI Docs → Reddit × 3 → xAI Docs → arXiv → xAI Docs → Reddit × 2.

No prose explanation of *why* each URL matters was produced. Suggested follow-ups it offered at the end were "map actual GitHub repos using each ecosystem," "show real production architectures using Perplexity vs Grok," "break down how to build the same agent in both stacks side-by-side."

**Conclusion of Phase B.** The URLs themselves are useful and harvested into §5. But because the prose collapsed, a second and third follow-up would almost certainly yield more chip-streams with no context — at additional cost to Eric's rate-limit budget. Follow-ups 2 and 3 were not sent.

### Follow-up #2 — concrete-URL sweep (held back)

**Planned gap.** Across turns 1–3, most citations were publication-level (`StackOne`, `arXiv`, `Reddit`). I'd already recovered those URLs by DOM-scraping the anchor tags, which made this follow-up unnecessary.

**Decision.** Not sent. Already covered by the Phase A URL harvest in §5.

### Follow-up #3 — books/podcasts/newsletters/courses (held back)

**Planned gap.** ChatGPT named DeepLearning.AI once as an organization and "Agentic AI Weekly" as the only newsletter. Zero books, zero podcasts, zero specific course titles across any ecosystem.

**Decision.** Not sent. Rate-limit budget + degraded-model reply quality made the cost-benefit unfavorable. This is a known gap (see §6), and the Cowork-side scan covers it with specific book/podcast/course entries that Eric can diff directly.

---

## 5. Aggregated Sources

All sources cited across turns 1–5, with URLs harvested from the DOM (including citation chips that did not appear in the prose). Tracking parameter `?utm_source=chatgpt.com` appears on all URLs as ChatGPT inserts it automatically — noted here once, stripped from the column below for readability.

### 5.1 Anthropic

| Name | URL | Type | Freshness | Why-it-matters (ChatGPT framing) | Quality |
|---|---|---|---|---|---|
| Anthropic Model Context Protocol (MCP) | — (brand named, no canonical URL given by ChatGPT in the main prose) | standard | "widely adopted" | Cited as the dominant tool-access protocol and Anthropic's central agentic artifact. | HIGH — real standard; Cowork scan has canonical URL. |
| Anthropic engineering blog | — (brand only) | blog | unstated | Listed as high-signal source in turn 1 §6. | HIGH — real publication; no specific post linked. |
| Tom's Hardware — MCP RCE exposed | https://www.tomshardware.com/tech-industry/artificial-intelligence/anthropics-model-context-protocol-has-critical-security-flaw-exposed | news | "Yesterday" at turn 2 | Claimed MCP RCE affecting ~200K AI servers. | MED — real outlet; claim worth independent verification. |

### 5.2 OpenAI

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| OpenAI — Agentic AI Foundation announcement | https://openai.com/index/agentic-ai-foundation/ | docs | 2025–26 | OpenAI's own post on the Linux-Foundation-hosted body. | HIGH. |
| OpenAI Agents SDK (successor to Swarm) | — (brand only) | code | active | Framework for tool calling, tracing, guardrails, handoffs. | HIGH — real product; no URL in prose. |
| OpenAI cookbook / docs | — (brand only) | docs/code | active | Cited as high-signal training surface. | HIGH — real publication; no URL in prose. |
| AGENTS.md standard | — (brand only) | standard | "emerging" | OpenAI-contributed agent-instruction file format. | MED — brand only. |
| r/OpenAI — open-source agent patterns repo thread | https://www.reddit.com/r/OpenAI/comments/1o6eb4z/i_built_an_opensource_repo_to_learn_and_apply_ai/ | forum | 2025–26 | Practitioner thread sharing a pattern-library repo. | MED. |
| r/OpenAI — agent pattern discussion | https://www.reddit.com/r/OpenAI/comments/1oh7s3l | forum | 2025–26 | Cited for "30+ AI agentic patterns." | MED. |
| r/OpenAI — framework-overload thread | https://www.reddit.com/r/OpenAI/comments/1ne71t7 | forum | 2025–26 | Cited for "frameworks are mostly the same patterns." | MED. |

### 5.3 Google / Gemini / DeepMind

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Google ADK (Agent Development Kit) | — (brand only) | code | active | Google's first-party agent SDK. | HIGH — real product; no URL in prose. |
| AlphaEvolve (Wikipedia) | https://en.wikipedia.org/wiki/AlphaEvolve | docs | current | DeepMind evolutionary / algorithm-discovery agent. | MED — Wikipedia, not primary source. |
| A2A protocol | — (brand only) | standard | "emerging" | Agent-to-agent communication; Google-originated. | HIGH — real standard; no URL in prose. |

### 5.4 Perplexity (surfaced only via Phase B follow-up)

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Perplexity Agent API / agentic-research quickstart | https://docs.perplexity.ai/docs/agentic-research/quickstart | docs | active | Canonical entry point for Perplexity's agent API. | HIGH. |
| Perplexity API quickstart (all APIs) | https://docs.perplexity.ai/docs/getting-started/quickstart | docs | active | Top-level developer onboarding. | HIGH. |
| Perplexity SDK docs (search) | https://docs.perplexity.ai/guides/perplexity-sdk-search | docs | active | Perplexity SDK usage guide for the search API. | HIGH. |
| Perplexity Search API quickstart | https://docs.perplexity.ai/docs/search/quickstart | docs | active | Search-specific quickstart, useful for search-augmented agents. | HIGH. |
| Perplexity API platform overview | https://www.perplexity.ai/api-platform | docs | active | Marketing + docs hub for the API platform. | HIGH. |
| Perplexity help center — "What is the Perplexity API Platform?" | https://www.perplexity.ai/help-center/en/articles/10354842-what-is-the-perplexity-api-platform | docs | active | Support-article-level explainer. | MED. |
| The Economic Times — Perplexity real-time search API | https://m.economictimes.com/tech/artificial-intelligence/perplexity-brings-real-time-search-api-to-ai-all-you-need-to-know/articleshow/124230784.cms | news | 2025–26 | Cited as a launch-coverage reference. | MED. |
| TechRadar — Perplexity/Comet vulnerability claim rebuttal | https://www.techradar.com/pro/security/perplexity-responds-to-comet-browser-vulnerability-claims-argues-fake-news | news | 2025–26 | Security coverage of Comet agentic browser. | MED. |
| r/perplexity_ai — "Come on Perplexity" | https://www.reddit.com/r/perplexity_ai/comments/1sb9edv/come_on_perplexity/ | forum | 2025–26 | Practitioner discourse thread. | LOW–MED. |
| r/perplexity_ai — 1nqe3t6 | https://www.reddit.com/r/perplexity_ai/comments/1nqe3t6 | forum | 2025–26 | Practitioner discourse thread (title not captured in prose). | LOW–MED. |
| r/perplexity_ai — "please help me fix this bug" | https://www.reddit.com/r/perplexity_ai/comments/1rcmhsg/please_help_me_fix_this_bug/ | forum | 2025–26 | Practitioner support thread. | LOW. |

### 5.5 xAI / Grok (surfaced only via Phase B follow-up)

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| xAI developer docs (overview) | https://docs.x.ai/ | docs | active | Canonical xAI developer root. | HIGH. |
| xAI API introduction | https://docs.x.ai/docs/introduction | docs | active | Developer onboarding for the xAI API. | HIGH. |
| Grok docs mirror (cadn.net.cn) | https://grok.cadn.net.cn/docs/introduction.html | docs | unclear | Cited alongside the official site — appears to be a Chinese CDN mirror, not first-party. | LOW — not authoritative; prefer docs.x.ai. |
| Cloudflare AI Gateway — Grok provider | https://developers.cloudflare.com/ai-gateway/providers/grok/ | docs | active | Cloudflare's third-party integration guide for Grok. | MED — useful for infra, secondary to xAI docs. |
| PyPI — xai-grok package | https://pypi.org/project/xai-grok/ | code | active | Python SDK package page. | MED — verify it's the canonical one before use. |
| r/aipromptprogramming — 1oy42e8 | https://www.reddit.com/r/aipromptprogramming/comments/1oy42e8 | forum | 2025–26 | Practitioner thread (context not in ChatGPT prose). | LOW. |
| r/LLMDevs — Grok API key/credits | https://www.reddit.com/r/LLMDevs/comments/1gkrxqy/free_xai_grok_api_keycredits_in_2024/ | forum | 2024+ | Older thread on API access. | LOW. |
| r/singularity — Grok Imagine enters public API | https://www.reddit.com/r/singularity/comments/1qq3ccx/xai_grok_imagine_enters_public_api_as_major/ | forum | 2025–26 | Launch-coverage thread for Grok Imagine. | LOW–MED. |
| r/aicuriosity — Grok Voice Agent API launch | https://www.reddit.com/r/aicuriosity/comments/1pp61ks/xai_grok_voice_agent_api_launch_key_features_and/ | forum | 2025–26 | Launch-coverage thread for voice agent. | MED — directly agent-relevant. |
| arXiv 2602.11286 (title not in prose) | https://arxiv.org/abs/2602.11286 | paper | 2026-02 | Cited in xAI section; paper title/authors not in the prose — needs verification. | LOW–MED until verified. |

### 5.6 Multi-vendor standards & cross-ecosystem

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Tech Bytes — Agentic AI Alliance explainer | https://techbytes.app/posts/agentic-ai-alliance-mcp-agents-md-open-standards/ | blog | 2025–26 | Cited for AAIF / MCP / AGENTS.md convergence framing. | LOW–MED — niche outlet. |
| StackOne — AI agent tools landscape 2026 | https://www.stackone.com/blog/ai-agent-tools-landscape-2026 | blog | 2026 | Source of the "three-layer stack" framing (MCP + A2A + AG-UI). | MED — vendor blog; check claims. |
| AiPivotGuide — Agentic AI Foundation / MCP / AGENTS.md 2026 | https://www.aipivotguide.com/guides/agentic-ai-foundation-mcp-agents-md-2026.html | blog | 2026 | Cited on Linux Foundation hosting. | LOW — niche. |
| Generative, Inc. — Agentic AI in 2026 | https://www.generative.inc/agentic-ai-in-2026-how-ai-went-from-chatting-to-doing | blog | 2026 | Cited on MCP cross-platform integration. | LOW — niche. |
| Agentic AI Weekly — 2026-02-27 post | https://agenticaiweekly.org/posts/2026-02-27/ | newsletter | 2026-02-27 | Source for "1000+ MCP servers" claim and "frameworks converging on MCP/A2A/OpenTelemetry." | MED. |
| INOVAWAY — Multi-agent AI 2026 | https://inovaway.org/en/blog/multi-agent-ai-2026 | blog | 2026 | Source for "45% faster / 70% cost reduction" enterprise ROI figures. | LOW — marketing-tone claims, unverified. |
| WIRED — OpenAI/Anthropic/Block teaming on agent standards | https://www.wired.com/story/openai-anthropic-and-block-are-teaming-up-on-ai-agent-standards | news | Dec 9, 2025 | Cited as primary news coverage of AAIF formation. | HIGH — major outlet. |
| The Verge — AI companies want a new internet | https://www.theverge.com/ai-artificial-intelligence/841156/ai-companies-aaif-anthropic-mcp-model-context-protocol | news | Dec 10, 2025 | Cited on the broader MCP/AAIF shift. | HIGH — major outlet. |
| TechRadar — Agentic AI security challenges | https://www.techradar.com/pro/agentic-ai-introduces-new-security-challenges-in-era-of-mcp-and-a2a | news | Oct 27, 2025 | Cited on attack-surface framing. | MED–HIGH. |
| Business Insider — "AI agent management" (middle-management crash course) | https://www.businessinsider.com/ai-agent-management-software-engineer-openai-anthropic-google-coding-2026-4 | news | Apr 2026 | Cited for the "agent management as new discipline" framing. | MED. |
| Business Insider — AI compute limits | https://www.businessinsider.com/ai-compute-limits-anthropic-github-2026-4 | news | Apr 2026 | Cited for the infrastructure-bottleneck framing. | MED. |

### 5.7 Design patterns / analyst blogs

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Adaline — Top agentic LLM models + frameworks for 2026 | https://www.adaline.ai/blog/top-agentic-llm-models-frameworks-for-2026 | blog | 2026 | Cited for the three-capability definition (tool use + memory + planning). | LOW–MED. |
| Softmax Data Blog — agentic design pattern comparison | https://blog.softmaxdata.com/agentic-design-pattern-comparisoneveryones-talking-about-ai-agents-right-now-and-honestly-its-getting-hard-to-keep-up-every-week-theres-a-new-framework-a-new-sdk-a-new-revolutionary-app/ | blog | 2025–26 | Primary citation for Ng's four patterns + Anthropic's workflow/agent taxonomy framing. | MED. |
| AIMultiple — agentic AI design patterns | https://research.aimultiple.com/agentic-ai-design-patterns/ | blog | 2025–26 | Cited for practical pattern list (ReAct, tool calling, memory, HITL, etc.). | MED. |
| mindpattern.ai — blog 2026-03-15 | https://mindpattern.ai/blog/2026-03-15 | blog | 2026-03-15 | Source of the "superpowers ~85K stars / everything-claude-code ~76K stars / context-mode new layer" claims. | LOW — niche; star-count claims unverified. |

### 5.8 Repos / code

| Name | URL | Type | Freshness | Why-it-matters | Quality |
|---|---|---|---|---|---|
| Wingie/a2aResumeAgent | https://github.com/Wingie/a2aResumeAgent | code | active | ChatGPT's cited "Java-based enterprise agent system" example with MCP+A2A dual-protocol, stateful execution, multi-LLM. | MED — single-dev repo; useful as a pattern illustration. |
| LangChain / LangGraph | — (brand only) | code | active | Default OSS orchestration framework. | HIGH — real project; Cowork scan has URLs. |
| AutoGen, CrewAI, Semantic Kernel, MetaGPT, ActivePieces, "superpowers," "everything-claude-code," "context-mode," Microsoft "AI agents for beginners" | — (all brand-only, no URLs in prose) | code | active / varies | Cited as the cross-platform OSS layer. | HIGH (for the real, known repos) / LOW (for the three star-count repos with no URL). |

### 5.9 Research papers (arXiv IDs only — titles not in prose)

The IDs below appeared as citation anchors without accompanying paper titles in ChatGPT's prose. IDs are noted but should be opened and verified before citing in downstream work.

| arXiv ID | URL | Section where cited | Quality |
|---|---|---|---|
| 2601.19752 | https://arxiv.org/abs/2601.19752 | Turn 1 — research-backed design patterns | LOW until verified. |
| 2601.03624 | https://arxiv.org/abs/2601.03624 | Turn 1 — multi-agent governance framing | LOW until verified. |
| 2508.10146 | https://arxiv.org/abs/2508.10146 | Turn 1 — cross-platform frameworks comparison | LOW until verified. |
| 2507.21105 | https://arxiv.org/abs/2507.21105 | Turn 2 — "AgentMaster" framing | LOW until verified. |
| 2512.11935 | https://arxiv.org/abs/2512.11935 | Turn 2 — "AGAPI Agents" framing | LOW until verified. |
| 2602.10465 | https://arxiv.org/abs/2602.10465 | Turn 2 & turn 4 — "Authenticated Workflows" / cryptographic enforcement | LOW until verified. |
| 2604.05969 | https://arxiv.org/abs/2604.05969 | Turn 4 — "177K+ tools" and "security research" framing | LOW until verified. |
| 2602.15055 | https://arxiv.org/abs/2602.15055 | Turn 4 — ACP / multi-agent orchestration protocols framing | LOW until verified. |
| 2602.11286 | https://arxiv.org/abs/2602.11286 | Phase B follow-up — cited in xAI section, context unclear | LOW until verified. |

### 5.10 Reddit threads (used as community-discourse evidence)

| Thread | URL | Section | Quality |
|---|---|---|---|
| r/AI_Agents — "so many agentic frameworks, what's the..." | https://www.reddit.com/r/AI_Agents/comments/1p19n5v/so_many_agentic_frameworks_out_there_whats_the/ | Turn 1 | MED. |
| r/Agentic_AI_For_Devs — 1nj5bgd | https://www.reddit.com/r/Agentic_AI_For_Devs/comments/1nj5bgd | Turn 1 | LOW–MED. |
| r/AgentsOfAI — "MCP and A2A are misleading" | https://www.reddit.com/r/AgentsOfAI/comments/1pv4asz/hot_take_mcp_and_a2a_are_misleading_and_somewhat/ | Turn 2 | MED — skeptical-view thread. |
| r/webmcp — open-sourced agentic commerce plugins | https://www.reddit.com/r/webmcp/comments/1s57af6/we_opensourced_10_agentic_commerce_plugins/ | Turn 2 | MED. |
| r/modelcontextprotocol — awesome A2A libraries | https://www.reddit.com/r/modelcontextprotocol/comments/1pqhgkf/awesome_a2a_libraries_a_curated_list_of/ | Turn 4 — Option A | MED. |
| r/AI_Agents — "5 agent skills I'd install" | https://www.reddit.com/r/AI_Agents/comments/1roe8k8/5_agent_skills_id_install_before_starting_any_new/ | Turn 4 — Option A | MED. |
| r/learnmachinelearning — "Compiled 20 production agentic patterns" | https://www.reddit.com/r/learnmachinelearning/comments/1s7vite/compiled_20_production_agentic_ai_patterns/ | Turn 4 — Option A | MED. |
| r/perplexity_ai × 3 (see §5.4) | see §5.4 | Phase B follow-up | LOW–MED. |
| r/aipromptprogramming, r/LLMDevs, r/singularity, r/aicuriosity — Grok threads | see §5.5 | Phase B follow-up | LOW–MED. |

---

## 6. Gaps

What ChatGPT did NOT surface, relative to the original brief and to what a responsible ecosystem scan ought to include.

**Ecosystems badly under-covered.**

- **Perplexity** — turn-4 Option B was one line. Phase B follow-up recovered first-party Perplexity docs and a handful of Reddit/news URLs, but no prose synthesis, no Comet deep-dive, no changelog index.
- **xAI / Grok** — turn-4 Option B was one line. Phase B follow-up surfaced `docs.x.ai` + `docs.x.ai/docs/introduction` + a Cloudflare integration page + PyPI + scattered Reddit. No mention of Grok 4.1 Fast, Agent Tools API specifics, the 2M-context model, or Grok Voice Agent docs beyond a Reddit launch-post link.
- **AWS Bedrock AgentCore / Strands Agents** — not mentioned anywhere.
- **Azure AI Foundry Agent Service / Microsoft Agent Framework** — only generic "Copilot ecosystem / enterprise integration." No product URLs.
- **Meta / Llama Stack** — not mentioned.
- **Mistral Agents API** — not mentioned.
- **Cohere agents / tool use** — not mentioned.
- **IBM watsonx Orchestrate, Databricks Mosaic Agents, Snowflake Cortex, NVIDIA NIM / Agent Blueprints, Salesforce Agentforce** — none mentioned.
- **Chinese-ecosystem tooling** (Qwen-Agent, DeepSeek, Kimi) — not mentioned (except the questionable `grok.cadn.net.cn` mirror).

**Source types thin or missing.**

- **Benchmarks.** Zero mentioned. SWE-bench Verified, GAIA, WebArena, OSWorld, τ²-bench, Terminal-Bench, BFCL — all absent. This is a significant gap: benchmark literacy is table-stakes for agent builders in 2026.
- **Books.** Zero. (e.g., Biswas & Talukdar *Building Agentic AI Systems*, Chip Huyen *AI Engineering*.)
- **Podcasts.** Zero. (e.g., Latent Space, Interconnects, TWIML, The Cognitive Revolution.)
- **Newsletters.** Only "Agentic AI Weekly."
- **Specific online courses.** DeepLearning.AI named as an org only; no course titles, no Coursera / edX / Pluralsight / Maven / O'Reilly entries.
- **Academic venues.** arXiv referenced as a bucket; no NeurIPS, ICLR, COLM, ACL, ICML, EMNLP callouts.
- **Practitioner operators (named).** Simon Willison, Hamel Husain, Jason Liu, Nathan Lambert (Interconnects), Chip Huyen, Andrej Karpathy — none surfaced.
- **Anthropic Skills / Claude Code** as a specific agent surface — absent.
- **Google Gemini CLI** as a specific agent surface — absent (though A2A and ADK were named).
- **MCP Registry** (official catalog) and **awesome-mcp-servers** — absent.

**Source-quality provenance.**

- Several of the recurring sources (StackOne, AiPivotGuide, Generative Inc., INOVAWAY, Tech Bytes, Agentic AI Weekly, mindpattern.ai, Adaline) are low- to medium-authority. None is a practitioner of record.
- Star-count claims (85K, 76K) and adoption claims (177K tools, 1000+ MCP servers, 45%/70% ROI figures) are given without dated primary sources — flag as unverified.
- `grok.cadn.net.cn` was cited alongside `docs.x.ai`; it is a Chinese CDN mirror and should not be treated as primary.

**Structural gaps in how ChatGPT handled the task.**

- Confused "synthesis about the ecosystem" with "map of sources." Eric's prompt explicitly asked for the latter.
- Repeated itself across turns 1, 2, and 4 — the "live research" mode added press-coverage citations but few named primary sources beyond the first turn.
- In the Phase B follow-up, once rate-limited, the answer collapsed from prose to raw citation chips. A stronger chat tier would likely have produced prose around the same URLs.

---

## 7. Head-to-Head Readiness Note

Mapping this capture onto `docs/reference/agentic-ai-landscape-scan.md` (Cowork-side output) for direct comparison:

| Cowork scan section | ChatGPT equivalent | Diff readiness |
|---|---|---|
| §3.1 Anthropic | Turn 1 §3.B; Turn 4 Option B | **PARTIAL.** ChatGPT names MCP + the engineering blog as brands only, no first-party URLs. Cowork has ~20 specific Anthropic sources. |
| §3.2 OpenAI | Turn 1 §3.A; Turn 2 §1 (AAIF post); Turn 4 Option B | **PARTIAL.** ChatGPT supplies one OpenAI URL (AAIF announcement) and several Reddit threads. Cowork has ~20 specific OpenAI sources. |
| §3.3 Google / Gemini / ADK | Turn 1 §3.C; Turn 4 Option B | **PARTIAL.** ChatGPT names ADK + AlphaEvolve Wikipedia only. Cowork has ~14 specific Google sources. |
| §3.4 Perplexity | Phase B follow-up only | **RECOVERED (partial).** ChatGPT now has 5 first-party Perplexity docs URLs + 2 news + 3 Reddit — useful, no prose. Cowork has ~6 specific Perplexity sources. |
| §3.5 xAI / Grok | Phase B follow-up only | **RECOVERED (partial).** ChatGPT now has 2 `docs.x.ai` URLs, a Cloudflare integration page, a PyPI link, several Reddit launch threads, 1 arXiv ID. Cowork has ~6 specific xAI sources. |
| §3.6 Multi-vendor standards | Turns 2–4 | **STRONGEST AREA.** ChatGPT supplies 4 major-outlet news URLs (WIRED, Verge, TechRadar, Tom's Hardware) and the OpenAI AAIF post. Cowork has deeper registry-level and spec-level URLs (MCP Registry, dated spec revisions, A2A GitHub, OpenTelemetry Gen AI). |
| §3.7 Other major labs (AWS, Azure, Meta, Mistral, Cohere, NVIDIA, IBM, Databricks, Snowflake, Salesforce) | Not covered | **ABSENT — significant gap.** |
| §4 By source type (docs/blog/code/course/forum/paper/benchmark) | Turn 1 §6 only | **PARTIAL.** ChatGPT has the genre taxonomy (blogs/courses/thought-leadership) but no specific entries per genre except one newsletter. |
| Benchmarks | None | **ABSENT.** |
| Practitioner operators (Willison, Husain, Liu, Lambert, Huyen, Karpathy) | None | **ABSENT.** |
| Books | None | **ABSENT.** |
| Podcasts / newsletters | "Agentic AI Weekly" only | **NEARLY ABSENT.** |
| Discourse (Reddit threads) | Turns 1, 2, 4, Phase B | **GOOD.** ChatGPT supplies 13+ specific Reddit thread URLs across OpenAI, AI_Agents, AgentsOfAI, perplexity_ai, LLMDevs, singularity, aicuriosity, modelcontextprotocol, webmcp, learnmachinelearning, Agentic_AI_For_Devs. Cowork naming of subreddits-by-name diffable against ChatGPT's actual threads. |

**Source count (raw).** ~55 distinct URLs recovered across turns 1–5 (counting repeated URLs once). Plus ~20 brand-only citations where the URL was not embedded. Total distinct resources referenced: ~75. This clears the "≥30 sources even on a partial reply" verification threshold set in the task brief.

**Recommended diff methodology for three-way comparison (Cowork / ChatGPT / Gemini).**

1. Normalize all three outputs to a common row schema: `name | url | type | ecosystem | freshness | one-line why-it-matters | quality`. The ChatGPT side is now in that shape in §5 of this doc.
2. Build a coverage matrix: rows = ecosystems/source-types, columns = Cowork / ChatGPT / Gemini, cells = ✅ / partial / ❌. This surfaces systematic blind spots per system.
3. Where the same source appears in multiple outputs, compare framings — ChatGPT tends toward strategy framing ("own the safety layer"), Cowork tends toward artifact-level framing ("Skills: folders of instructions loaded dynamically"), and the Gemini run will likely skew home-field on Google/ADK.
4. Treat ChatGPT's synthesis framings (three-layer stack, "agent management as discipline," AAIF) as *hypotheses to test against the other two outputs*, not as facts to inherit. Several of the supporting domains (StackOne, AiPivotGuide, Generative, INOVAWAY, Tech Bytes) are low-authority and their claims deserve independent verification before being promoted to "findings."
5. Flag all arXiv IDs from §5.9 for title/author verification before any are cited downstream.

---

© 2026 Eric Riutort. All rights reserved.
