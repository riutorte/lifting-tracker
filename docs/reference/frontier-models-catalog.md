---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-05-07
tier: REFERENCE
content_class: research
---

# Frontier AI Models — Reference Catalog

Valid as of **2026-04-23**. Re-check by **2026-05-07**. Frontier-model data drifts in weeks; treat any row without a recent release or verified-on date as suspect and re-source before load-bearing use.

---

## 1. Executive Summary

- **Overall reasoning leaders** as of April 2026 form a three-way cluster inside Artificial Analysis's composite confidence interval: **Claude Opus 4.7** (Anthropic), **GPT-5.4** (OpenAI), and **Gemini 3.1 Pro** (Google). No benchmark cleanly ranks them; capability splits are by task (coding vs science reasoning vs agentic) rather than by model.
- **Coding leader** is **Claude Opus 4.7** on SWE-bench Verified (87.6%) and SWE-bench Pro (64.3%), with **Gemini 3 Flash** and **GPT-5.3 Codex** close behind on specific sub-benchmarks. **Gemini 3.1 Pro** leads LiveCodeBench; **Qwen3-Coder** leads open-weight coding.
- **Open-weight frontier** is effectively Chinese: **DeepSeek V3.2** (MIT), **Qwen3.5-397B-A17B** (Apache 2.0), **Kimi K2.6** (modified MIT), **GLM-5.1** (MIT), and **MiniMax M2.5** (modified MIT) deliver frontier-adjacent quality under permissive licenses. The strongest Western open-weight contenders are **Mistral Large 3** (Apache 2.0, 675B MoE) and **Meta Llama 4 Maverick** (community license).
- **Longest context:** **Grok 4 Fast** at 2M input tokens; **Llama 4 Scout** at 10M (open-weight); the **1M-token tier** has normalized across Anthropic Claude 4.x, Google Gemini 3, OpenAI GPT-5.x, and Amazon Nova 2.
- **Moving fastest:** Anthropic (Opus 4.6 Feb → Opus 4.7 April), Google (Gemini 3 Pro Nov 2025 → Gemini 3.1 Pro Feb 2026), and the Chinese labs (Qwen, Kimi, Z.ai, DeepSeek all shipped frontier releases in Q1 2026).
- **Chinese labs** are the open-weight pace-setters and the cost-efficiency leaders, but their flagships (Qwen3.6-Max, ERNIE 5.0, Doubao Seed 2.0) are trending toward closed weights for monetization. International availability is strong for DeepSeek / Qwen / Kimi / MiniMax / Z.ai via OpenRouter, Together, and Fireworks; ERNIE and ByteDance remain primarily China-facing.
- **Cheapest per token for decent quality:** open-weight Chinese models self-hosted or via OpenRouter (DeepSeek V3.2 at ~$0.27/$0.41 per MTok is roughly 20× cheaper than frontier Western premium tiers). Among closed APIs, **Gemini 3 Flash** ($0.50/$3) and **Claude Haiku 4.5** ($1/$5) are the cheapest frontier-quality options.
- **Specialty and modality fronts:** Google leads native multi-in/out multimodality (text+image+audio+video); **Qwen3.5-Omni** is the open-weight counterpart. **OpenAI GPT-5.4** is first to ship native computer-use in its general-purpose tier (75% OSWorld). **Anthropic** leads agentic long-horizon tool use. Chinese **Kimi K2.6** extends this with a 300-sub-agent swarm architecture for long-horizon coding.

---

## 2. How to Read This Catalog

**Scope.** "Frontier" here means a flagship or near-flagship production model from a lab that is competitive on general-purpose reasoning or on at least one critical modality (coding, vision, long-context, agentic tool use) as of April 2026. The catalog includes one flagship per lab minimum, plus specialty variants where they materially differ (a reasoning variant vs a speed variant vs a coding variant). It is not a census of every checkpoint.

**Columns.** Each entry carries: canonical name and lab; most-recent release date with source; positioning tag (flagship / speed / reasoning / coding / multimodal / open-weight / specialty); modalities (input and output separately where they differ); context window in input tokens; max output tokens; disclosed training knowledge cutoff; API availability; pricing tier (cheap / mid / premium, with source link — not exact cents because rates drop mid-quarter); a one-line "known for"; two to three public benchmark scores with source URLs; weight license.

**Freshness.** Every row carries a release date. Where a specific field could not be verified against a vendor or authoritative source, it is marked `UNVERIFIED` rather than filled in from memory. The header `valid-as-of` and `re-check-by` dates govern the whole document — re-source any row before load-bearing use past those dates.

**Sources.** Vendor pages and announcement posts take precedence over third-party summaries. Hugging Face model cards are primary for open-weight model specs. LMArena and Artificial Analysis are primary for leaderboard standings. Aggregator sites (Vellum, NxCode, llm-stats, DataCamp, BenchLM) are cited only where vendor docs don't surface a specific number; those citations are flagged inline.

**Caveats on benchmark numbers.** Vendor-reported scores, Artificial Analysis re-runs, and third-party aggregator numbers can diverge 5–15 points on the same benchmark for the same model, depending on scaffold, effort level, pass@k, and contamination handling. Compare within a methodology regime, not across. Benchmark saturation (HumanEval, MATH-500, MMLU, AIME 2024) limits differentiation at the frontier — prefer SWE-bench Pro, HLE, ARC-AGI-2, LiveCodeBench, Terminal-Bench 2.0 as current load-bearing evaluations.

**Attribution.** This catalog is research output synthesized from public vendor sources and leaderboards. Vendor marketing copy is paraphrased, not reproduced. Benchmark scores and model names are factual and cited; short quoted phrases (under 15 words) appear in quotation marks only where a phrase is itself an identifying handle.

---

## 3. Master Catalog

Alphabetical by lab. Entries grouped by lab; within a lab, flagships listed first, then specialty variants. Benchmark scores cite vendor sources where possible; aggregator citations are marked.

### Alibaba Qwen

#### Qwen3.6-Max-Preview
- Canonical: `qwen3.6-max-preview`
- Lab: Alibaba Cloud / Qwen Team
- Released: 2026-04-20 ([source — Decrypt coverage](https://decrypt.co/364948/alibaba-qwen-3-6-max-preview-most-powerful-model))
- Positioning: flagship / closed-weights (first Qwen flagship to go closed)
- Modalities: text in/out
- Context: 260k tokens
- Max output: UNVERIFIED
- Parameters: UNVERIFIED (not disclosed)
- Knowledge cutoff: UNVERIFIED
- API: Alibaba Cloud Model Studio; OpenAI- and Anthropic-compatible endpoints
- International availability: full (via Alibaba Cloud)
- Pricing tier: preview (final pricing pending GA)
- Known for: Qwen's move to closed flagship; vendor claims six benchmark #1s (SWE-Bench Pro, Terminal-Bench 2.0, SkillsBench, QwenClawBench, QwenWebBench, SciCode); `preserve_thinking` feature for multi-turn agents
- Benchmarks:
  - SWE-Bench Pro: vendor #1 claim ([source — aggregator](https://tokenmix.ai/blog/qwen3-6-max-preview-benchmark-review-2026))
  - Terminal-Bench 2.0: vendor #1 claim (same source)
- License: closed — proprietary

#### Qwen3.5-397B-A17B
- Canonical: `Qwen/Qwen3.5-397B-A17B`
- Lab: Alibaba Cloud / Qwen Team
- Released: 2026-02-16 ([source — HuggingFace Qwen org](https://huggingface.co/Qwen))
- Positioning: flagship efficient / open-weight
- Modalities: text in/out
- Context: 256k tokens
- Max output: UNVERIFIED
- Parameters: 17B active / 397B total (hybrid Gated Delta Network + sparse MoE)
- Knowledge cutoff: UNVERIFIED
- API: Alibaba Cloud Model Studio, OpenRouter, Together, Fireworks, SiliconFlow, self-host
- International availability: full
- Pricing tier: low — claims 19× faster decode vs Qwen3-Max at 256k
- Known for: efficiency leader — beats their own trillion-param Qwen3-Max on reasoning/coding at 4.3% activation ratio
- Benchmarks:
  - MMLU-Pro: 87.8% ([source — VentureBeat](https://venturebeat.com/technology/alibabas-qwen-3-5-397b-a17-beats-its-larger-trillion-parameter-model-at-a))
  - GPQA Diamond: 88.4% (same)
  - SWE-bench Verified: 80.0% (same)
- License: open-permissive — Apache 2.0 (Qwen standard; UNVERIFIED for this specific checkpoint)

#### Qwen3-Max
- Canonical: `qwen3-max`
- Lab: Alibaba Cloud / Qwen Team
- Released: 2025-09-23 ([source — VentureBeat](https://venturebeat.com/ai/qwen3-max-arrives-in-preview-with-1-trillion-parameters-blazing-fast))
- Positioning: prior flagship / trillion-scale / closed
- Modalities: text in/out
- Context: 262,144 tokens (input ≤258,048, output ≤32,768)
- Max output: 32,768
- Parameters: >1T total (MoE); active count undisclosed
- Knowledge cutoff: 2025-06-30
- API: Alibaba Cloud Model Studio, OpenRouter
- International availability: full
- Pricing tier: mid
- Known for: Qwen's first trillion-parameter model; no dedicated thinking mode
- Benchmarks:
  - LiveBench (Nov 2024 version): 79.3% ([source — VentureBeat](https://venturebeat.com/ai/qwen3-max-arrives-in-preview-with-1-trillion-parameters-blazing-fast))
- License: closed — proprietary

#### Qwen3.5-Omni
- Canonical: `Qwen/Qwen3.5-Omni`
- Lab: Alibaba Cloud / Qwen Team
- Released: 2026-03-30 ([source — MarkTechPost](https://www.marktechpost.com/2026/03/30/alibaba-qwen-team-releases-qwen3-5-omni-a-native-multimodal-model-for-text-audio-video-and-realtime-interaction/))
- Positioning: native multimodal / speech / open-weight
- Modalities: text, image, audio (in+out, incl. speech), video
- Context: 256k (Plus variant)
- Max output: UNVERIFIED
- Parameters: UNVERIFIED exact; native Audio Transformer (AuT) encoder
- Knowledge cutoff: UNVERIFIED
- API: Alibaba Cloud Model Studio, SiliconFlow, HuggingFace inference
- International availability: full
- Pricing tier: mid
- Known for: unified text/image/audio/video in one pipeline; 113 languages and dialects; trained on 100M+ hours of AV data
- Benchmarks: vendor claims 215 SOTA results across audio/AV benchmarks; audio-understanding lead over Gemini 3.1 Pro (source above)
- License: open-permissive — Apache 2.0 (Qwen standard; UNVERIFIED specific)

#### Qwen3-Coder-480B-A35B
- Canonical: `Qwen/Qwen3-Coder-480B-A35B-Instruct`
- Lab: Alibaba Cloud / Qwen Team
- Released: 2025 (specific date UNVERIFIED)
- Positioning: coding / agentic / open-weight
- Modalities: text in/out
- Context: 256k (UNVERIFIED exact)
- Max output: UNVERIFIED
- Parameters: 35B active / 480B total (MoE); also 30B-A3B and Coder-Next variants
- Knowledge cutoff: UNVERIFIED
- API: Alibaba Cloud Model Studio, OpenRouter, Together, Fireworks, self-host
- International availability: full
- Pricing tier: low
- Known for: strongest open-weight coder family; agentic tool use
- Benchmarks:
  - Qwen3-Coder-Next SWE-bench Verified: 58.7% ([source — GitHub](https://github.com/QwenLM/Qwen3-Coder))
- License: open-permissive — Apache 2.0

### Amazon (Nova)

#### Nova 2 Pro (Preview)
- Canonical: `amazon.nova-2-pro-v1:0` (preview)
- Lab: Amazon AGI
- Released: 2025-12-02 preview at re:Invent 2025 ([source — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/nova-2-foundation-models-amazon-bedrock/))
- Positioning: flagship reasoning (preview — not GA as of 2026-04-23)
- Modalities: text, image, video in; text out
- Context: 1M tokens ([source — AWS blog](https://aws.amazon.com/blogs/aws/introducing-amazon-nova-2-lite-a-fast-cost-effective-reasoning-model/))
- Max output: UNVERIFIED
- Parameters: UNVERIFIED
- Knowledge cutoff: UNVERIFIED
- API: Amazon Bedrock (exclusive)
- Pricing tier: mid — $2.19 / $17.50 per MTok ([source — CloudPrice aggregator](https://cloudprice.net/models/amazon-nova-2-pro-preview))
- Known for: extended thinking with low/medium/high intensity dial; multistep agentic tasks
- Benchmarks: listed on Artificial Analysis — specific scores UNVERIFIED here
- License: closed

#### Nova 2 Lite
- Canonical: `amazon.nova-2-lite-v1:0`
- Lab: Amazon AGI
- Released: 2025-12-02 GA ([source — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/nova-2-foundation-models-amazon-bedrock/))
- Positioning: speed / cost-effective reasoning workhorse
- Modalities: text, image, video in; text out
- Context: 1M tokens
- Max output: UNVERIFIED
- Parameters: UNVERIFIED
- Knowledge cutoff: UNVERIFIED
- API: Amazon Bedrock
- Pricing tier: cheap — $0.30 / $2.50 per MTok ([source — PricePerToken aggregator](https://pricepertoken.com/pricing-page/model/amazon-nova-2-lite-v1))
- Known for: three-tier extended-thinking dial; fast multimodal for enterprise agents
- Benchmarks: UNVERIFIED
- License: closed

#### Nova Sonic
- Canonical: `amazon.nova-sonic-v1:0` (specialty — speech-to-speech)
- Lab: Amazon AGI
- Released: 2025-04-08 GA ([source — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/04/amazon-nova-sonic-speech-to-speech-conversations-bedrock/))
- Positioning: specialty (real-time voice agents)
- Modalities: audio in, audio out (unified S2S)
- Context: UNVERIFIED
- Max output: streaming
- API: Amazon Bedrock bidirectional streaming
- Pricing tier: UNVERIFIED
- Known for: unified S2S with emotion sensing; English, Spanish, French, Italian, German (as of July 2025)
- License: closed

#### Nova Act
- Canonical: Nova Act (research preview)
- Lab: Amazon AGI
- Released: 2025-03-31 research preview ([source — AWS Nova page](https://aws.amazon.com/ai/generative-ai/nova))
- Positioning: specialty (browser-agent action model)
- Modalities: screen/DOM in, action out
- API: Nova Act SDK (preview)
- Pricing tier: UNVERIFIED (preview)
- Known for: browser automation counterpart to Anthropic computer-use and OpenAI Operator
- License: closed

#### Nova Canvas
- Canonical: `amazon.nova-canvas-v1:0` (specialty — image generation)
- Lab: Amazon AGI
- Released: 2024-12-03 GA ([source — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-nova-foundation-models-bedrock/))
- Positioning: specialty — text+image in, image out
- API: Amazon Bedrock
- Pricing tier: UNVERIFIED (per-image)
- License: closed

#### Nova Reel
- Canonical: `amazon.nova-reel-v1:0` (specialty — video generation)
- Lab: Amazon AGI
- Released: 2024-12-03 GA; longer clips rolled out through 2025 ([source — AWS model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-reel.html))
- Positioning: specialty — T2V / I2V
- Max output: originally 6s clips, up to ~2min compositions per later roadmap
- API: Amazon Bedrock
- Pricing tier: UNVERIFIED
- License: closed

### Anthropic

#### Claude Opus 4.7
- Canonical: `claude-opus-4-7` (Bedrock alias `anthropic.claude-opus-4-7`)
- Lab: Anthropic
- Released: 2026-04-16 ([source — Anthropic](https://www.anthropic.com/news/claude-opus-4-7))
- Positioning: flagship / coding / agentic
- Modalities: text in/out; image in
- Context: 1M tokens
- Max output: 128,000 tokens
- Knowledge cutoff: UNVERIFIED (not disclosed in announcement)
- API: Anthropic API, Amazon Bedrock, Google Vertex AI, Microsoft Foundry
- Pricing tier: premium — $5 / $25 per MTok in/out ([source — what's new](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7))
- Known for: SOTA agentic coding; 1M context at standard pricing (no long-context premium)
- Benchmarks:
  - SWE-bench Verified: 87.6% ([source — Vellum aggregator citing Anthropic](https://www.vellum.ai/blog/claude-opus-4-7-benchmarks-explained))
  - SWE-bench Pro: 64.3% (same)
  - Humanity's Last Exam (with tools): 54.7% ([source — Anthropic](https://www.anthropic.com/news/claude-opus-4-7))
- License: closed API

#### Claude Opus 4.6
- Canonical: `claude-opus-4-6`
- Lab: Anthropic
- Released: 2026-02-05 ([source — Anthropic](https://www.anthropic.com/news/claude-opus-4-6))
- Positioning: prior flagship (superseded 2026-04-16; still widely deployed)
- Modalities: text in/out; image in
- Context: 1M tokens (beta)
- Max output: UNVERIFIED (64k documented for 4.5 lineage)
- Knowledge cutoff: UNVERIFIED
- API: Anthropic API, Bedrock, Vertex AI, Azure AI
- Pricing tier: premium — $5 / $25 per MTok ([source — Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing))
- Known for: led Humanity's Last Exam and Terminal-Bench 2.0 at release
- Benchmarks:
  - SWE-bench Verified: 80.8% ([source — Vellum aggregator](https://www.vellum.ai/blog/claude-opus-4-6-benchmarks))
  - GPQA Diamond: 91.3% (same)
  - Terminal-Bench 2.0: led at release ([source — Anthropic](https://www.anthropic.com/news/claude-opus-4-6))
- License: closed API

#### Claude Sonnet 4.6
- Canonical: `claude-sonnet-4-6`
- Lab: Anthropic
- Released: 2026-02-17 ([source — Anthropic](https://www.anthropic.com/news/claude-sonnet-4-6))
- Positioning: mid-tier workhorse / coding / agentic
- Modalities: text in/out; image in
- Context: 1M tokens (beta)
- Max output: ~300k (aggregator-reported; UNVERIFIED against vendor)
- Knowledge cutoff: 2025-08 ([source — DataCamp aggregator](https://www.datacamp.com/blog/claude-sonnet-4-6))
- API: Anthropic API, Bedrock, Vertex AI, Azure
- Pricing tier: mid — $3 / $15 per MTok ([source — Anthropic](https://www.anthropic.com/news/claude-sonnet-4-6))
- Known for: near-flagship quality at roughly one-fifth the Opus price; default model in claude.ai
- Benchmarks:
  - SWE-bench Verified: 79.6% ([source — Anthropic](https://www.anthropic.com/news/claude-sonnet-4-6))
  - OSWorld (computer use): 72.5% (same)
- License: closed API

#### Claude Haiku 4.5
- Canonical: `claude-haiku-4-5`
- Lab: Anthropic
- Released: 2025-10-15 ([source — Anthropic](https://www.anthropic.com/news/claude-haiku-4-5))
- Positioning: speed / cost-efficient / sub-agents
- Modalities: text in/out; image in
- Context: 200k tokens
- Max output: UNVERIFIED
- Knowledge cutoff: UNVERIFIED
- API: Anthropic API, Bedrock, Vertex AI
- Pricing tier: cheap — $1 / $5 per MTok ([source — Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing))
- Known for: first Haiku with extended thinking and computer use; roughly one-third Sonnet cost
- Benchmarks:
  - SWE-bench Verified: 73.3% ([source — Anthropic](https://www.anthropic.com/news/claude-haiku-4-5))
- License: closed API

### Baidu (ERNIE)

#### ERNIE 5.0
- Canonical: `ERNIE-5.0-0110`
- Lab: Baidu
- Released: 2026-01-22 ([source — AIBase](https://news.aibase.com/news/22776))
- Positioning: flagship / native full-modal / closed
- Modalities: text, image, audio, video (understanding + generation)
- Context: UNVERIFIED
- Parameters: 2.4T total; active count UNVERIFIED (likely MoE)
- Knowledge cutoff: UNVERIFIED
- API: Baidu Qianfan / ERNIE Bot (yiyan.baidu.com)
- International availability: China-only (partial via Baidu Cloud international)
- Pricing tier: UNVERIFIED
- Known for: Native Full-modality Unified Modeling; first Chinese model into LMArena global top 10 at ~1460 Elo
- Benchmarks:
  - LMArena text: ~1460 Elo (top 10 global) ([source — The Decoder](https://the-decoder.com/baidus-ernie-5-0-tops-all-chinese-ai-models-in-lmarena-with-2-4-trillion-parameters/))
- License: closed — proprietary

#### ERNIE X1.1
- Canonical: `ERNIE-X1.1`
- Lab: Baidu
- Released: 2025-09-09 (upgrade to X1; X1 originally 2025-03) — vendor announcement URL UNVERIFIED; coverage aggregated at Baidu developer portal
- Positioning: reasoning / multimodal deep-thinking / closed
- Modalities: text, image
- Context: UNVERIFIED
- API: Baidu Qianfan
- International availability: partial (China-primary)
- Known for: first Chinese reasoning model rated "4+" by CAICT; vendor claims parity with DeepSeek R1 at half price
- License: closed — proprietary

#### ERNIE 4.5 Open-Weight Variants
- Canonical: `baidu/ERNIE-4.5-21B-A3B-Thinking`, `baidu/ERNIE-4.5-VL-28B-A3B-Thinking`
- Lab: Baidu
- Released: base 2025-03; Thinking variants later 2025 ([source — HF](https://huggingface.co/baidu/ERNIE-4.5-21B-A3B-Thinking))
- Positioning: mid-size open-weight reasoning / multimodal
- Parameters: 3B active / 21B or 28B total (MoE)
- API: HuggingFace weights; Baidu Qianfan
- International availability: full (weights open)
- License: open-restricted — ERNIE license (UNVERIFIED exact terms)

### ByteDance (Doubao / Seed)

#### Doubao Seed 2.0
- Canonical: `doubao-seed-2.0-pro` (proprietary); `ByteDance-Seed/Seed1.5-VL` (open)
- Lab: ByteDance (Volcano Engine)
- Released: 2026-02-14 ([source — Evolink review](https://evolink.ai/blog/doubao-seed-2-0-review-benchmarks-pricing))
- Positioning: flagship / multimodal / largely closed
- Modalities: text, vision (Seed-VL); video generation via Seedance
- Context: 256k (Doubao-Seed-Code)
- Parameters: UNVERIFIED (undisclosed MoE)
- API: Volcano Engine (China primary)
- International availability: China-primary; limited international
- Pricing tier: ultra-low domestic
- Known for: powers Doubao chatbot (#1 China, ~155M WAU); strong math/code — AIME 2025 98.3 (Pro), Codeforces 3020, VideoMME 89.5
- License: mostly closed; some Seed variants open (Apache 2.0 for Seed1.5-VL)

### Cohere

#### Command A
- Canonical: `command-a-03-2025`
- Lab: Cohere
- Released: 2025-03 ([source — Cohere docs](https://docs.cohere.com/docs/command-a))
- Positioning: enterprise flagship / agentic / RAG
- Modalities: text in/out; tool use
- Context: 256,000 tokens
- Parameters: 111B dense
- Knowledge cutoff: UNVERIFIED
- API: Cohere Platform, HuggingFace (CC-BY-NC weights), Oracle OCI, AWS Bedrock, Azure
- Pricing tier: premium — $2.50 / $10.00 per MTok ([source — Artificial Analysis](https://artificialanalysis.ai/models/command-a))
- Known for: runs on 2× H100/A100 GPUs; 73 tok/s at 100k context; 23-language enterprise focus
- Benchmarks:
  - MMLU: 85.5% ([source — Command A paper](https://arxiv.org/pdf/2504.00698))
  - BFCL: 63.8% (same)
  - Tau-Bench: 51.7% (same)
- License: open-restricted — CC-BY-NC 4.0 for research weights; commercial via API ([source — HF](https://huggingface.co/CohereLabs/c4ai-command-a-03-2025))

#### Command A Reasoning
- Canonical: `command-a-reasoning-08-2025`
- Lab: Cohere
- Released: 2025-08 ([source — Cohere docs](https://docs.cohere.com/docs/command-a-reasoning))
- Positioning: reasoning / enterprise agentic
- Modalities: text in/out; tool use
- Context: 256,000 tokens
- Parameters: 111B dense
- API: Cohere Platform, HuggingFace (CC-BY-NC), Oracle OCI
- Pricing tier: premium
- Known for: Cohere's first reasoning model; strongest tool-use in the Command family
- License: open-restricted — CC-BY-NC 4.0 weights; commercial via API

#### Command A Translate
- Canonical: `command-a-translate-08-2025`
- Lab: Cohere
- Released: 2025-08-28 ([source — Cohere changelog](https://docs.cohere.com/changelog/2025-08-28-command-a-translate))
- Positioning: specialty — enterprise translation
- Modalities: text in/out
- Context: 16,000 tokens (8k in / 8k out)
- Parameters: 111B dense
- API: Cohere Platform, HuggingFace, private deployment
- Pricing tier: free within rate limits ([source — docs](https://docs.cohere.com/docs/command-a-translate))
- Known for: SOTA quality across 23 languages; "Deep Translation" agentic multi-step refinement
- License: open-restricted — CC-BY-NC 4.0 weights

#### Command R7B
- Canonical: `command-r7b-12-2024`
- Lab: Cohere
- Released: 2024-12 ([source — Cohere blog](https://cohere.com/blog/command-r7b))
- Positioning: small / on-device / RAG
- Modalities: text in/out
- Context: 128,000 tokens
- Parameters: 7B dense
- API: Cohere Platform, HuggingFace, local
- Pricing tier: cheap
- Known for: smallest R-family; on-device viability; RAG-focused
- License: open-restricted — CC-BY-NC 4.0 weights

#### Aya Expanse 32B
- Canonical: `c4ai-aya-expanse-32b`
- Lab: Cohere Labs
- Released: 2024-10 ([source — Cohere docs](https://docs.cohere.com/docs/aya-expanse))
- Positioning: multilingual research
- Modalities: text in/out
- Context: 128k (32B; 8B deprecated 2026-04-04)
- Parameters: 32B dense
- API: HuggingFace, Cohere Platform
- Pricing tier: cheap / weights free
- Known for: tuned for 23 languages including Arabic, Chinese, Hindi, Japanese, Russian
- License: open-restricted — CC-BY-NC 4.0

#### Embed v4 (specialty)
- Canonical: `embed-v4.0`
- Lab: Cohere
- Released: 2025 ([source — AWS Bedrock docs](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-embed-v4.html))
- Positioning: multimodal retrieval / embeddings
- Modalities: text + image in; vector out (interleaved multimodal)
- Context: ~128k
- Output dims: Matryoshka 256/512/1024/1536; float/int8/uint8/binary/ubinary
- API: Cohere Platform, AWS Bedrock, Oracle OCI
- Pricing tier: cheap (per-embedding)
- Known for: first-class multimodal document retrieval (tables, figures, charts inline with text)
- License: closed (API/service)

### DeepSeek

#### DeepSeek V3.2
- Canonical: `deepseek-ai/DeepSeek-V3.2`
- Lab: DeepSeek (Hangzhou)
- Released: 2025-12-01 with Jan 2026 refinement ([source — DeepSeek API docs](https://api-docs.deepseek.com/news/news251201))
- Positioning: flagship / unified chat+reasoning / open-weight
- Modalities: text in/out
- Context: 160k (163,840) tokens; OpenRouter exposes 131k
- Max output: 32,768 (UNVERIFIED; HF card implies larger reasoning budget)
- Parameters: 37B active / 685B total (MoE)
- Knowledge cutoff: UNVERIFIED
- API: DeepSeek Platform, OpenRouter, Together, Fireworks, DeepInfra, SiliconFlow
- International availability: full
- Pricing tier: ultra-low — ~$0.27 / $0.41 per MTok; cache-hit input ~$0.07 ([source — OpenRouter](https://openrouter.ai/deepseek/deepseek-v3.2))
- Known for: first major model integrating thinking into tool use; DeepSeek Sparse Attention (DSA) architecture
- Benchmarks: IMO 2025 / IOI 2025 gold-medal tier (source above)
- License: open-permissive — MIT (weights); code MIT

#### DeepSeek V3.1
- Canonical: `deepseek-ai/DeepSeek-V3.1`
- Lab: DeepSeek
- Released: 2025-08 ([source — HuggingFace](https://huggingface.co/deepseek-ai))
- Positioning: prior flagship / optimized for domestic accelerators / open-weight
- Modalities: text in/out
- Context: 128k
- Parameters: 37B active / 685B total (MoE)
- API: DeepSeek Platform, OpenRouter, Together, Fireworks
- International availability: full
- Pricing tier: ultra-low ([source — GetDeploying](https://getdeploying.com/llms/deepseek-v3.1))
- Known for: tuned for Huawei Ascend domestic accelerators — supply-chain signal
- License: open-permissive — MIT

#### DeepSeek R1-0528
- Canonical: `deepseek-ai/DeepSeek-R1-0528`
- Lab: DeepSeek
- Released: 2025-05-28 ([source — HuggingFace](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528))
- Positioning: reasoning / open-weight
- Modalities: text in/out
- Context: ~128k (UNVERIFIED exact)
- Max output: ~64k reasoning budget (UNVERIFIED)
- Parameters: 37B active / 671B total (MoE); distilled variants from 1.5B to 70B
- API: DeepSeek Platform, OpenRouter, Together, Fireworks, DeepInfra
- International availability: full
- Pricing tier: low
- Known for: landmark open-weight reasoning model; original R1 launch reshaped the open-weight reasoning landscape
- Benchmarks:
  - AIME 2025: 87.5% ([source — VentureBeat](https://venturebeat.com/ai/deepseek-r1-0528-arrives-in-powerful-open-source-challenge-to-openai-o3-and-google-gemini-2-5-pro))
- License: open-permissive — MIT

#### DeepSeek R2 (unreleased)
- Status: Not released as of 2026-04-23. Delayed from May 2025; reports in late Feb 2026 of imminent release alongside V4 did not materialize into public weights ([source — Rest of World](https://restofworld.org/2025/deepseek-china-r2-ai-model-us-rivalry/)). Treat specs as UNVERIFIED until DeepSeek publishes.

### Google DeepMind (Gemini)

#### Gemini 3.1 Pro
- Canonical: `gemini-3.1-pro-preview`
- Lab: Google DeepMind
- Released: 2026-02-19 ([source — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/))
- Positioning: flagship / reasoning / multimodal
- Modalities: text in/out; image in; audio in; video in
- Context: 1M tokens
- Max output: UNVERIFIED
- Knowledge cutoff: 2025-01 ([source — AI Studio docs](https://ai.google.dev/gemini-api/docs/gemini-3))
- API: Google AI Studio, Vertex AI, Gemini Enterprise, Gemini app
- Pricing tier: premium ([source — pricing](https://ai.google.dev/gemini-api/docs/pricing); specific 3.1 Pro rate UNVERIFIED)
- Known for: Google-claimed leader on 13 of 16 major public benchmarks at release
- Benchmarks:
  - GPQA Diamond: 94.3% ([source — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/))
  - SWE-bench Verified: 80.6% ([source — NxCode aggregator](https://www.nxcode.io/resources/news/gemini-3-1-pro-complete-guide-benchmarks-pricing-api-2026))
  - ARC-AGI-2: 77.1% ([source — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/))
  - Humanity's Last Exam: 44.4% (same)
- License: closed API

#### Gemini 3 Pro
- Canonical: `gemini-3-pro` (preview deprecated 2026-03-09)
- Lab: Google DeepMind
- Released: 2025-11-18 ([source — Google](https://blog.google/products/gemini/gemini-3/))
- Positioning: prior flagship
- Modalities: text in/out; image in; audio in; video in
- Context: 1M tokens
- Knowledge cutoff: 2025-01
- API: Vertex AI (preview shut down 2026-03-09)
- Pricing tier: premium
- License: closed API

#### Gemini 3 Deep Think
- Canonical: `gemini-3-deep-think`
- Lab: Google DeepMind
- Released: 2026-02-12 major upgrade ([source — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/))
- Positioning: specialty / System-2 reasoning
- Modalities: text in/out; image in
- Context: 1M tokens
- Knowledge cutoff: 2025-01
- API: Gemini app (Google AI Ultra subscription); API early access
- Pricing tier: premium (subscription-gated; API rate UNVERIFIED)
- Known for: test-time reasoning with multi-hypothesis refinement; IMO gold-medal performance
- Benchmarks:
  - HLE (no tools): 48.4% ([source — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/))
  - ARC-AGI-2: 84.6% (same)
  - Codeforces Elo: 3455 (same)
- License: closed API

#### Gemini 3 Flash
- Canonical: `gemini-3-flash-preview`
- Lab: Google DeepMind
- Released: 2025-12-17 ([source — Google](https://blog.google/products/gemini/gemini-3-flash/))
- Positioning: speed / cost-efficient / multimodal
- Modalities: text in/out; image in; audio in; video in
- Context: 1M tokens
- Knowledge cutoff: 2025-01
- API: Google AI Studio, Vertex AI, Gemini app, AI Mode in Search
- Pricing tier: cheap — $0.50 / $3 per MTok ([source — Google](https://blog.google/products/gemini/gemini-3-flash/))
- Known for: roughly 3× faster than Gemini 2.5 Pro at a fraction of the cost; beats Gemini 3 Pro on SWE-bench Verified
- Benchmarks:
  - SWE-bench Verified: 78% ([source — Google](https://blog.google/products/gemini/gemini-3-flash/))
  - GPQA Diamond: 90.4% (same)
  - MMMU-Pro: 81.2% (same)
  - HLE (no tools): 33.7% (same)
- License: closed API

#### Gemini 3.1 Flash-Lite
- Canonical: `gemini-3.1-flash-lite-preview`
- Lab: Google DeepMind
- Released: 2026 (exact date UNVERIFIED) ([source — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-lite/))
- Positioning: speed / ultra-cheap / edge
- Modalities: text in/out; image in (UNVERIFIED full multimodal)
- Context: UNVERIFIED
- API: Gemini API, Vertex AI
- Pricing tier: cheap (exact rate UNVERIFIED)
- Known for: most cost-effective Gemini to date
- License: closed API

### IBM (Granite)

#### Granite 4.0 H Small
- Canonical: `granite-4.0-h-small`
- Lab: IBM
- Released: 2025-10 ([source — IBM](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models))
- Positioning: open-weight / enterprise flagship of Granite 4
- Modalities: text in/out
- Context: 128k
- Parameters: 32B total / 9B active (hybrid Mamba-2 + transformer MoE)
- Knowledge cutoff: UNVERIFIED
- API: watsonx.ai, HuggingFace, Ollama, Replicate, NVIDIA NIM, LM Studio, Docker Hub, Kaggle, Dell Enterprise Hub, AWS Marketplace
- Pricing tier: cheap — $0.06 / $0.25 per MTok on watsonx ([source — CloudPrice aggregator](https://cloudprice.net/models/watsonx/ibm/granite-4-h-small))
- Known for: first ISO 42001 certified open models; hybrid Mamba-2 cuts memory ~70%
- Benchmarks: IBM claims top-of-category Global-MMLU-Lite/Full and agentic IFEval/BFCL for its size (exact numbers UNVERIFIED)
- License: open-permissive — Apache 2.0

#### Granite 4.0 H Tiny
- Canonical: `granite-4.0-h-tiny`
- Lab: IBM
- Released: 2025-10 ([source — IBM](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models))
- Positioning: open-weight / edge / efficient
- Context: 128k
- Parameters: 7B total / 1B active (hybrid MoE)
- API: watsonx.ai, HuggingFace, Ollama, Replicate, AWS Marketplace
- Pricing tier: cheap
- License: open-permissive — Apache 2.0

#### Granite 4.0 H Micro / Micro
- Canonical: `granite-4.0-h-micro`, `granite-4.0-micro`
- Lab: IBM
- Released: 2025-10 ([source — HF](https://huggingface.co/ibm-granite/granite-4.0-h-micro))
- Positioning: open-weight / on-device
- Context: 128k
- Parameters: 3B dense (H-Micro hybrid; Micro pure transformer)
- API: HuggingFace, Ollama, LM Studio, watsonx.ai
- Pricing tier: free-open (weights)
- License: open-permissive — Apache 2.0

#### Granite 4.0 3B Vision (specialty)
- Canonical: `granite-4.0-3b-vision`
- Lab: IBM
- Released: 2026-04-01 ([source — MarkTechPost](https://www.marktechpost.com/2026/04/01/ibm-releases-granite-4-0-3b-vision-a-new-vision-language-model-for-enterprise-grade-document-data-extraction/))
- Positioning: specialty (VLM / enterprise document AI)
- Modalities: image + text in, text out
- Parameters: 3B
- API: HuggingFace, watsonx.ai
- Known for: enterprise document data extraction (tables, forms, scans)
- License: open-permissive — Apache 2.0

#### Granite TimeSeries (specialty)
- Canonical: `granite-timeseries-ttm-*`
- Lab: IBM
- Released: 2025-02-26 refresh; ongoing ([source — IBM](https://www.ibm.com/new/announcements/ibm-granite-3-2-open-source-reasoning-and-vision))
- Positioning: specialty — forecasting only
- Modalities: numeric time series
- Parameters: <10M (TinyTimeMixers)
- API: HuggingFace, watsonx.ai
- License: open-permissive — Apache 2.0

#### Granite Guardian 3.2 (specialty)
- Canonical: `granite-guardian-3.2-*`
- Lab: IBM
- Released: 2025-02-26 ([source — IBM](https://www.ibm.com/new/announcements/ibm-granite-3-2-open-source-reasoning-and-vision))
- Positioning: specialty — input/output safety classifier
- Modalities: text in, safety label + confidence out
- Parameters: sub-3B variants
- API: HuggingFace, watsonx.ai
- Known for: verbalized-confidence safety scoring for agentic pipelines
- License: open-permissive — Apache 2.0

### Meta (Llama)

#### Llama 4 Maverick
- Canonical: `meta-llama/Llama-4-Maverick-17B-128E-Instruct`
- Lab: Meta
- Released: 2025-04-05 ([source — Meta](https://ai.meta.com/blog/llama-4-multimodal-intelligence/))
- Positioning: flagship (shipped) / multimodal / open-weight
- Modalities: text + image in; text out (native early-fusion multimodal)
- Context: 1,048,576 tokens (1M)
- Max output: 16,384 ([source — Artificial Analysis](https://artificialanalysis.ai/models/llama-4-maverick))
- Parameters: 17B active / 400B total (128 experts, MoE)
- Knowledge cutoff: 2024-08
- API: HuggingFace, OpenRouter, AWS Bedrock, Azure, Databricks, DeepInfra, SambaNova, Snowflake, Novita, Groq, local
- Pricing tier: cheap — ~$0.15 / $0.60 per MTok OpenRouter floor; ~$0.31 / $0.91 median ([source — OpenRouter](https://openrouter.ai/meta-llama/llama-4-maverick))
- Known for: vendor claims on-par with GPT-4o / Claude 3.5 Sonnet on MMLU / HumanEval / GPQA at ~10× lower cost
- License: open-restricted — Llama 4 Community License Agreement ([source — HF](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E/blob/main/LICENSE))

#### Llama 4 Scout
- Canonical: `meta-llama/Llama-4-Scout-17B-16E-Instruct`
- Lab: Meta
- Released: 2025-04-05 ([source — Meta](https://ai.meta.com/blog/llama-4-multimodal-intelligence/))
- Positioning: open-weight / long-context / multimodal
- Modalities: text + image in; text out
- Context: 10,000,000 tokens (10M)
- Parameters: 17B active / 109B total (16 experts, MoE)
- Knowledge cutoff: 2024-08
- API: llama.com direct, HuggingFace, AWS Bedrock, Azure, Databricks, Snowflake, OpenRouter, Groq, Together, local
- Pricing tier: cheap ([source — OpenRouter](https://openrouter.ai/meta-llama/llama-4-scout))
- Known for: industry-leading 10M-token context on a single H100 (Int4); 30T-token pretraining (2× Llama 3)
- License: open-restricted — Llama 4 Community License Agreement

#### Llama 4 Behemoth (unreleased)
- Status: not released as of 2026-04-23; delayed indefinitely from original target over capability-gap concerns ([source — SiliconANGLE](https://siliconangle.com/2025/05/15/meta-postpone-release-llama-4-behemoth-model-report-claims/))
- Announced specs: 288B active / ~2T total MoE; internal teacher for Scout/Maverick distillation
- License (if released): Llama 4 Community License

#### Llama 5 (unreleased)
- Status: no public Meta announcement of a Llama 5 family as of 2026-04-23. UNVERIFIED.

### Microsoft (Phi / MAI)

#### Phi-4
- Canonical: `microsoft/phi-4`
- Lab: Microsoft Research
- Released: 2024-12-12 ([source — HF](https://huggingface.co/microsoft/phi-4))
- Positioning: open-weight / small dense / STEM reasoning
- Modalities: text in/out
- Context: 16k
- Parameters: 14B dense
- Knowledge cutoff: 2024-06
- API: HuggingFace, Azure AI Foundry, Ollama, local
- Pricing tier: free-open (weights) / cheap on Azure
- Known for: matches/beats much larger models on STEM via synthetic-data curriculum
- License: open-permissive — MIT

#### Phi-4-mini-instruct
- Canonical: `microsoft/Phi-4-mini-instruct`
- Lab: Microsoft Research
- Released: 2025-02 ([source — HF](https://huggingface.co/microsoft/Phi-4-mini-instruct))
- Positioning: speed / on-device / long-context small
- Modalities: text in/out
- Context: 128k
- Parameters: ~3.8B dense
- API: HuggingFace, Azure AI Foundry, Ollama
- Pricing tier: free-open / cheap
- License: open-permissive — MIT

#### Phi-4-multimodal-instruct
- Canonical: `microsoft/Phi-4-multimodal-instruct`
- Lab: Microsoft Research
- Released: 2025-02 ([source — HF](https://huggingface.co/microsoft/Phi-4-multimodal-instruct))
- Positioning: multimodal small / open-weight
- Modalities: text, image, audio (speech) in; text out
- Context: 128k
- Parameters: ~5.6B (unified LoRA-over-base architecture)
- API: HuggingFace, Azure AI Foundry
- Known for: first Phi with audio input; mixture-of-LoRAs
- License: open-permissive — MIT

#### Phi-4-reasoning / Phi-4-reasoning-plus
- Canonical: `microsoft/Phi-4-reasoning`, `microsoft/Phi-4-reasoning-plus`
- Lab: Microsoft Research
- Released: 2025-04-30 ([source — MSR](https://www.microsoft.com/en-us/research/articles/phi-reasoning-once-again-redefining-what-is-possible-with-small-and-efficient-ai/))
- Positioning: reasoning at small scale / open-weight
- Modalities: text in/out
- Parameters: 14B
- Known for: beats o1-mini and DeepSeek-R1-Distill-Llama-70B on most benchmarks; comparable to DeepSeek R1 on AIME 2025
- Benchmarks:
  - AIME 2025 (Plus): 82.5% ([source — aggregator](https://dev.to/best_codes/phi-4-reasoning-benchmarks-model-specs-and-comparisons-4hk))
  - LiveCodeBench: 28.0% → 53.8% (+25 pts over base; same source)
- License: open-permissive — MIT

#### MAI-Voice-1 / MAI-Transcribe-1 / MAI-Image-2
- Lab: Microsoft AI (MAI division, distinct from MS Research)
- Released: 2026-04-02 ([source — TechCrunch](https://techcrunch.com/2026/04/02/microsoft-takes-on-ai-rivals-with-three-new-foundational-models/), [VentureBeat](https://venturebeat.com/technology/microsoft-launches-3-new-ai-models-in-direct-shot-at-openai-and-google))
- Positioning: specialty — speech synthesis / ASR / image generation (NOT a general LLM)
- Modalities: Voice-1 audio out; Transcribe-1 audio in; Image-2 image out
- API: Microsoft Foundry, MAI Playground
- Pricing tier: UNVERIFIED
- Known for: first shipped MAI models after Microsoft's October 2025 revision of the OpenAI contract; Transcribe-1 ~2.5× faster than Azure Fast across 25 languages
- License: closed

Note: a general-purpose MAI text flagship (MAI-1 successor) has not shipped publicly as of 2026-04-23. Microsoft's general-purpose tier on Azure remains Azure-hosted OpenAI and Anthropic.

### MiniMax

#### MiniMax M2.5
- Canonical: `MiniMaxAI/MiniMax-M2.5`
- Lab: MiniMax (Shanghai)
- Released: 2026-02-12 ([source — MiniMax](https://www.minimax.io/news/minimax-m25))
- Positioning: agentic / efficient / open-weight
- Modalities: text in/out
- Context: 200k
- Parameters: 10B active / 229B total (MoE)
- API: MiniMax API, OpenRouter, HuggingFace
- International availability: full
- Pricing tier: ultra-low
- Known for: frontier-class agentic at 1/10–1/20 cost of proprietary peers; lightning attention lineage from M1
- License: open-permissive — modified MIT

#### MiniMax M1
- Canonical: `MiniMaxAI/MiniMax-M1`
- Lab: MiniMax
- Released: 2025 ([source — GitHub](https://github.com/MiniMax-AI/MiniMax-M1))
- Positioning: first open-weight hybrid-attention reasoning model
- Parameters: 45.9B active / 456B total (MoE) + lightning attention
- License: open-permissive

### Mistral AI

#### Mistral Large 3
- Canonical: `mistral-large-2512` / `mistralai/Mistral-Large-3-675B-Instruct-2512`
- Lab: Mistral AI
- Released: 2025-12-02 ([source — Mistral](https://mistral.ai/news/mistral-3))
- Positioning: flagship / open-weight / multimodal
- Modalities: text + image in; text out
- Context: 256,000 tokens
- Parameters: 41B active / 675B total (granular MoE)
- API: Mistral La Plateforme, HuggingFace, self-host, OpenRouter, AWS Sagemaker, IBM watsonx, NVIDIA NIM, Azure AI Foundry, Google Vertex
- Pricing tier: mid ([source — OpenRouter](https://openrouter.ai/mistralai/mistral-large-2512))
- Known for: largest fully-open (Apache 2.0) flagship at launch; LMArena #2 open-source non-reasoning at release
- License: open-permissive — Apache 2.0 ([source — HF](https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512))

#### Mistral Medium 3
- Canonical: `mistral-medium-2505`
- Lab: Mistral AI
- Released: 2025-05-07 ([source — Mistral](https://mistral.ai/news/mistral-medium-3))
- Positioning: mid-tier workhorse (closed API)
- Modalities: text in/out
- Context: 131,000 tokens
- Parameters: UNVERIFIED
- API: Mistral La Plateforme, AWS Sagemaker, IBM watsonx, NVIDIA NIM, Azure AI Foundry, Google Vertex, OpenRouter
- Pricing tier: cheap — $0.40 / $2.00 per MTok ([source — Mistral](https://mistral.ai/news/mistral-medium-3))
- Known for: Mistral claims ≥90% of Claude Sonnet 3.7 on benchmarks at roughly one-eighth the cost
- Benchmarks:
  - Artificial Analysis Intelligence Index: 19 ([source — AA](https://artificialanalysis.ai/models/mistral-medium-3))
- License: closed (API only)

#### Mistral Small 4
- Canonical: `mistral-small-2603`
- Lab: Mistral AI
- Released: 2026-03-16 ([source — Mistral](https://mistral.ai/news/mistral-small-4))
- Positioning: unified hybrid (instruct + reasoning + coding) / multimodal / open-weight
- Modalities: text + image in; text out; configurable reasoning effort
- Context: 256,000 tokens
- Parameters: 119B (MoE) — collapses Small + Magistral + Pixtral + Devstral into one target
- API: Mistral La Plateforme, HuggingFace, OpenRouter, self-host
- Pricing tier: cheap — $0.15 / $0.60 per MTok ([source — Mistral](https://mistral.ai/news/mistral-small-4))
- Known for: single deployment target replacing four prior products; vendor claims 40% faster, 3× throughput vs predecessor
- License: open-permissive — Apache 2.0

#### Ministral 3 (3B / 8B / 14B)
- Canonical: `Ministral-3-3B-Instruct-2512`, `Ministral-3-8B-Instruct-2512`, 14B variant
- Lab: Mistral AI
- Released: 2025-12 ([source — Mistral](https://mistral.ai/news/mistral-3))
- Positioning: edge / on-device / open-weight
- Modalities: text + image in; text out (reasoning and instruct variants)
- Context: 128,000 tokens
- Parameters: 3B / 8B / 14B dense
- API: HuggingFace, Ollama, LM Studio, Mistral La Plateforme, local
- Pricing tier: cheap / self-host free
- Known for: 8B fits 12GB VRAM FP8; 3B fits 8GB VRAM FP8; 14B reasoning hits AIME '25 85%
- Benchmarks:
  - AIME 2025 (14B reasoning): 85% ([source — Mistral](https://mistral.ai/news/mistral-3))
- License: open-permissive — Apache 2.0

#### Codestral 25.01
- Canonical: `codestral-2501`
- Lab: Mistral AI
- Released: 2025-01 ([source — Mistral](https://mistral.ai/news/codestral-2501))
- Positioning: coding specialist
- Context: 256,000 tokens
- Parameters: 22B dense
- API: Mistral La Plateforme, HuggingFace (Mistral Non-Production License)
- Pricing tier: cheap
- Known for: fill-in-the-middle; 80+ languages; low-latency IDE use
- License: Mistral Non-Production License (research + non-prod); commercial license sold separately

#### Pixtral Large (deprecated, rolled into Small 4)
- Canonical: `pixtral-large-2411`
- Lab: Mistral AI
- Released: 2024-11-18 ([source — Mistral](https://mistral.ai/news/pixtral-large))
- Positioning: historical multimodal flagship
- Modalities: text + image in; text out
- Context: 128k (up to 30 high-res images)
- Parameters: 124B total (123B decoder + 1B vision encoder)
- API: deprecated on API; weights still on HuggingFace
- License: open-restricted — Mistral Research License (research-only); commercial requires separate license

### Moonshot AI (Kimi)

#### Kimi K2.6
- Canonical: `moonshotai/Kimi-K2.6`
- Lab: Moonshot AI (Beijing)
- Released: 2026-04-20 ([source — MarkTechPost](https://www.marktechpost.com/2026/04/20/moonshot-ai-releases-kimi-k2-6-with-long-horizon-coding-agent-swarm-scaling-to-300-sub-agents-and-4000-coordinated-steps/))
- Positioning: flagship / agentic / coding / open-weight
- Modalities: text (native multimodal claims — scope UNVERIFIED)
- Context: 262,144 tokens
- Max output: up to 98,304 (reasoning budget)
- Parameters: 32B active / 1T total (MoE); Muon optimizer
- API: kimi.com, Moonshot Platform, OpenRouter, Cloudflare Workers AI, Puter
- International availability: full
- Pricing tier: mid
- Known for: 300-sub-agent swarm scaling, 4,000-step coordinated execution — current public agentic leader
- Benchmarks:
  - SWE-Bench Pro: 58.6 ([source — Artificial Analysis](https://artificialanalysis.ai/articles/kimi-k2-6-the-new-leading-open-weights-model))
  - SWE-Bench Verified: 80.2 (same)
  - HLE-Full (with tools): 54.0 (same)
- License: open-permissive — modified MIT

#### Kimi K2.5
- Canonical: `moonshotai/Kimi-K2.5`
- Lab: Moonshot AI
- Released: 2026-01 ([source — OpenRouter](https://openrouter.ai/moonshotai/kimi-k2.5))
- Positioning: agentic / open-weight predecessor
- Context: 256k
- Parameters: 32B active / 1T total (MoE)
- API: Moonshot Platform, OpenRouter
- Pricing tier: mid
- Known for: first K2 generation with 100-sub-agent swarm; ~76% cost reduction vs Claude Opus 4.5 at HLE 50.2
- Benchmarks:
  - HLE: 50.2% ([source — Codecademy](https://www.codecademy.com/article/kimi-k-2-5-complete-guide-to-moonshots-ai-model))
  - SWE-Bench Pro: 50.7 (same)
- License: open-permissive — modified MIT

#### Kimi K2 (base)
- Canonical: `moonshotai/Kimi-K2`
- Lab: Moonshot AI
- Released: 2025 ([source — HF](https://huggingface.co/moonshotai/Kimi-K2-Instruct))
- Positioning: agentic base / open-weight
- Context: 256k (extended from 128k)
- Parameters: 32B active / 1T total (MoE)
- License: open-permissive — modified MIT

### NVIDIA (Nemotron)

#### Nemotron 3 Nano 30B A3B
- Canonical: `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16` (also FP8)
- Lab: NVIDIA
- Released: 2026 Q1 ([source — HF](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16); [NVIDIA news](https://nvidianews.nvidia.com/news/nvidia-debuts-nemotron-3-family-of-open-models))
- Positioning: open-weight / agentic / unified reasoning+non-reasoning
- Modalities: text in/out
- Context: 1M (family-level claim)
- Parameters: 30B total / 3B active (MoE; hybrid Mamba–Transformer)
- API: HuggingFace, NVIDIA NIM
- Pricing tier: free-open
- Known for: hybrid Mamba–Transformer MoE tuned for NVIDIA accelerators
- License: open (NVIDIA Open Model License — verify specific terms)

#### Nemotron 3 Nano 4B
- Canonical: `nvidia/NVIDIA-Nemotron-3-Nano-4B-BF16`
- Lab: NVIDIA
- Released: 2026 Q1 ([source — HF blog](https://huggingface.co/blog/nvidia/nemotron-3-nano-4b))
- Positioning: edge / agentic SLM
- Parameters: 4B dense (hybrid)
- API: HuggingFace, NVIDIA NIM, local (Jetson Thor, RTX, DGX Spark)
- License: open (NVIDIA Open Model License)

Nemotron 3 Super and Ultra announced for H1 2026 but GA status UNVERIFIED as of 2026-04-23.

### OpenAI

#### GPT-5.4
- Canonical: `gpt-5.4` (also `gpt-5.4-thinking`, `gpt-5.4-pro`)
- Lab: OpenAI
- Released: 2026-03-05 (direct OpenAI announcement URL UNVERIFIED; reported via [Wikipedia](https://en.wikipedia.org/wiki/GPT-5.4))
- Positioning: flagship / multimodal / native computer-use
- Modalities: text in/out; image in; audio in (inherits 4o-class; UNVERIFIED for 5.4 specifically)
- Context: ~1M tokens (922k in / 128k out per aggregator; input pricing doubles above 272k)
- Max output: 128,000 tokens
- Knowledge cutoff: UNVERIFIED
- API: OpenAI API, Azure OpenAI, Microsoft Foundry
- Pricing tier: mid (premium for Pro) — $2.50 / $15 per MTok standard; $30 / $180 Pro ([source — NxCode aggregator](https://www.nxcode.io/resources/news/gpt-5-4-complete-guide-features-pricing-models-2026))
- Known for: first OpenAI general-purpose model with native computer-use — 75% OSWorld
- Benchmarks:
  - AIME 2025: 100% ([source — BenchLM aggregator](https://benchlm.ai/models/gpt-5-4))
  - SWE-bench Pro: 57.7% ([source — NxCode aggregator](https://www.nxcode.io/resources/news/gpt-5-4-complete-guide-features-pricing-models-2026))
  - OSWorld: 75% (same)
- License: closed API

#### GPT-5.4 Mini
- Canonical: `gpt-5.4-mini`
- Lab: OpenAI
- Released: 2026-03-17 ([source — OpenAI](https://openai.com/index/introducing-gpt-5-4-mini-and-nano/))
- Positioning: speed / cost-efficient
- Modalities: text in/out; image in
- Context: 400k
- API: OpenAI API, Azure
- Pricing tier: cheap — $0.75 / $4.50 per MTok ([source — OpenRouter](https://openrouter.ai/openai/gpt-5.4-mini))
- Known for: frontier-grade coding at roughly 6× cost reduction vs GPT-5.4
- Benchmarks:
  - SWE-bench Pro: 54.4% ([source — NxCode aggregator](https://www.nxcode.io/resources/news/gpt-5-4-complete-guide-features-pricing-models-2026))
- License: closed API

#### GPT-5.4 Nano
- Canonical: `gpt-5.4-nano`
- Lab: OpenAI
- Released: 2026-03-17 ([source — OpenAI](https://openai.com/index/introducing-gpt-5-4-mini-and-nano/))
- Positioning: speed / edge / ultra-cheap
- Modalities: text in/out; image in (UNVERIFIED)
- Context: UNVERIFIED
- API: OpenAI API
- Pricing tier: cheap ([source — OpenAI pricing](https://openai.com/api/pricing/); exact rates UNVERIFIED)
- License: closed API

#### GPT-5
- Canonical: `gpt-5` (family: `gpt-5-main`, `gpt-5-main-mini`, `gpt-5-thinking`, `gpt-5-thinking-mini`)
- Lab: OpenAI
- Released: 2025-08-07 ([source — OpenAI](https://openai.com/index/introducing-gpt-5/))
- Positioning: prior flagship / unified fast+thinking routing
- Modalities: text in/out; image in; audio in
- Context: UNVERIFIED (varies across variants)
- API: OpenAI API, Azure
- Pricing tier: mid
- Known for: first OpenAI flagship with unified fast/thinking routing
- License: closed API

#### OpenAI o3 / o3-pro
- Canonical: `o3`, `o3-pro`
- Lab: OpenAI
- Released: 2025 (full public API release date UNVERIFIED; announced via [OpenAI](https://openai.com/index/introducing-o3-and-o4-mini/))
- Positioning: reasoning
- Modalities: text in/out; image in
- API: OpenAI API, Azure
- Pricing tier: mid — $2 / $8 per MTok after 80% cut; o3-pro $20 / $80 ([source — VentureBeat](https://venturebeat.com/ai/openai-announces-80-price-drop-for-o3-its-most-powerful-reasoning-model))
- Known for: reasoning-optimized; set SoTA on Codeforces / SWE-bench / MMMU at launch
- Benchmarks:
  - AIME: 96.7% ([source — OpenAI](https://openai.com/index/introducing-o3-and-o4-mini/))
  - GPQA Diamond: 87.7% (same)
  - SWE-bench Verified: 71.7% (same)
  - ARC-AGI: 87.5% (same)
- License: closed API

#### OpenAI o4-mini
- Canonical: `o4-mini`
- Lab: OpenAI
- Released: 2025 ([source — OpenAI](https://openai.com/index/introducing-o3-and-o4-mini/))
- Positioning: reasoning / cheap / fast
- Modalities: text in/out; image in
- API: OpenAI API (retired from ChatGPT 2026-02-13; API continues) ([source — OpenAI retirement page](https://openai.com/index/retiring-gpt-4o-and-older-models/))
- Pricing tier: cheap — $1.10 input / MTok ([source — aggregator](https://www.aipricing.guru/openai-pricing/))
- Known for: top AIME 2024/2025 scores among cheap reasoning models at release
- License: closed API

#### GPT-4.1 (deprecating)
- Canonical: `gpt-4.1`
- Lab: OpenAI
- Released: 2025 ([source — OpenAI retirement page](https://openai.com/index/retiring-gpt-4o-and-older-models/))
- Positioning: prior-gen long-context coder
- Context: ~1M tokens (UNVERIFIED exact)
- API: OpenAI API (retirement 2026-10-14); Azure (retirement no earlier than 2026-04-11) ([source — OpenAI](https://openai.com/index/retiring-gpt-4o-and-older-models/), [Azure](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements?view=foundry-classic))
- Pricing tier: mid (legacy)
- License: closed API

### Tencent (Hunyuan)

#### Hunyuan 2.0 / Hunyuan-T1
- Canonical: `tencent/Hunyuan-2.0`, `tencent/Hunyuan-T1`
- Lab: Tencent
- Released: Hunyuan 2.0 2025-12-05 ([source — TechNode](https://technode.com/2025/12/08/tencent-releases-hunyuan-2-0-its-next-generation-ai-model/)); T1 2025-03
- Positioning: flagship / hybrid Transformer–Mamba MoE / partial-open
- Modalities: text (Hunyuan Large family); multimodal variants exist
- Context: 256k (Hunyuan 2.0)
- Parameters: 32B active / 406B total (Hunyuan 2.0 MoE)
- API: Tencent Cloud; Yuanbao (consumer)
- International availability: partial
- Known for: first ultra-large Hybrid-Transformer-Mamba MoE; T1 reasoning competitive with R1 on MMLU-Pro / C-Eval / AIME
- Benchmarks:
  - IMO-AnswerBench: 73.4 (Hunyuan 2.0 Think)
  - SWE-bench Verified: 53.0
- License: open-restricted — Tencent Hunyuan License (HF for Hunyuan-Large)

### xAI

#### Grok 4
- Canonical: `grok-4`
- Lab: xAI
- Released: 2025-07-09 ([source — xAI](https://x.ai/news/grok-4))
- Positioning: flagship / reasoning
- Modalities: text + image in; text out; tool use, structured outputs
- Context: 256,000 tokens
- Parameters: UNVERIFIED (not disclosed)
- API: xAI direct, OpenRouter, Oracle, Azure Foundry
- Pricing tier: premium — $3 input / $15 output per MTok; higher tier above 128k ([source — xAI docs](https://docs.x.ai/developers/models))
- Known for: top of Humanity's Last Exam at launch
- Benchmarks:
  - HLE: 35% base / 45% with reasoning ([source — SmythOS aggregator](https://smythos.com/developers/ai-models/whats-new-in-grok-4-release-facts-benchmarks-and-value/))
  - HLE with tools: 38.6% ([source — Fello AI](https://felloai.com/grok-4-release-date-confirmed-how-does-it-compare-to-the-anticipated-gpt-5-and-gemini-3-0/))
- License: closed

#### Grok 4 Heavy
- Canonical: `grok-4-heavy` (SuperGrok Heavy tier)
- Lab: xAI
- Released: 2025-07-09 ([source — xAI](https://x.ai/news/grok-4))
- Positioning: reasoning / multi-agent flagship
- Modalities: text + image in; text out
- Context: 256,000 tokens
- Parameters: multi-agent orchestration of Grok 4 instances (exact UNVERIFIED)
- API: SuperGrok Heavy subscription ($300/month); limited API
- Pricing tier: premium — $300/month consumer subscription ([source — Tesery](https://www.tesery.com/blogs/news/xai-launches-grok-4-with-new-300-month-supergrok-heavy-subscription))
- Known for: "study group" multi-agent architecture; ~17% lift over Grok 4 on internal reasoning
- Benchmarks:
  - HLE with tools: 44.4% ([source — SmythOS aggregator](https://smythos.com/developers/ai-models/whats-new-in-grok-4-release-facts-benchmarks-and-value/))
  - HLE extended-thinking + tools: up to 50.7% ([source — 36Kr](https://eu.36kr.com/en/p/3368178797709062))
- License: closed

#### Grok 4 Fast
- Canonical: `grok-4-fast` (reasoning and non-reasoning variants)
- Lab: xAI
- Released: 2025 ([source — xAI](https://x.ai/news/grok-4-fast))
- Positioning: speed / cost-efficient multimodal
- Modalities: text + image in; text out
- Context: 2,000,000 tokens (2M)
- Max output: 30,000
- API: xAI direct, OpenRouter
- Pricing tier: cheap — $0.20 / $0.50 per MTok ([source — Artificial Analysis](https://artificialanalysis.ai/models/grok-4-fast-reasoning))
- Known for: 2M-context flagship-tier multimodal at commodity pricing; ~155–200 tok/s
- Benchmarks:
  - AA Intelligence Index: 35 (reasoning), 23 (non-reasoning) (same source)
- License: closed

#### Grok Code Fast 1
- Canonical: `grok-code-fast-1`
- Lab: xAI
- Released: 2025-08-28 ([source — xAI](https://x.ai/news/grok-code-fast-1))
- Positioning: coding / agentic / speed
- Modalities: text in/out; tool use
- Context: 256,000 tokens
- Parameters: ~314B MoE (community estimate; not confirmed)
- API: xAI direct, Oracle, Azure Foundry, GitHub Copilot, Cursor, Cline, Windsurf
- Pricing tier: cheap — $0.20 / $1.50 per MTok; $0.02 cached ([source — xAI docs](https://docs.x.ai/developers/models/grok-code-fast-1))
- Known for: SWE-Bench-Verified 70.8% (xAI internal eval); ~90–100 tok/s; TypeScript/Python/Rust/Go focus
- Benchmarks:
  - SWE-Bench-Verified: 70.8% (xAI internal) ([source — xAI](https://x.ai/news/grok-code-fast-1))
- License: closed

#### Grok 5 (unreleased)
- Status: not released as of 2026-04-23. Public roadmap points to Q2 2026 beta, Q3 2026 API GA. Training underway on Colossus 2 (1GW, expanding to 1.5GW April 2026). Target specs circulating — 6T params, 1.5M context, native text/image/audio/video — are UNVERIFIED ([source — NxCode aggregator](https://www.nxcode.io/resources/news/grok-5-release-date-latest-news-2026)).

### Z.ai (formerly Zhipu AI)

#### GLM-5.1
- Canonical: `zai-org/GLM-5.1`
- Lab: Z.ai (Beijing)
- Released: 2026-04-07/08 ([source — MarkTechPost](https://www.marktechpost.com/2026/04/08/z-ai-introduces-glm-5-1-an-open-weight-754b-agentic-model-that-achieves-sota-on-swe-bench-pro-and-sustains-8-hour-autonomous-execution/))
- Positioning: flagship / agentic / open-weight
- Modalities: text in/out
- Context: 200k
- Max output: 128k
- Parameters: ~40B active / 754B total (MoE); uses DeepSeek Sparse Attention (DSA)
- API: Z.ai platform, OpenRouter, WaveSpeed, HuggingFace
- International availability: full
- Pricing tier: low-mid
- Known for: SOTA SWE-Bench Pro claim; sustained 8-hour autonomous execution
- License: open-permissive — MIT

#### GLM-5
- Canonical: `zai-org/GLM-5`
- Lab: Z.ai
- Released: 2026-02-11 ([source — HF](https://huggingface.co/zai-org/GLM-5))
- Positioning: flagship open-weight / agentic
- Modalities: text in/out
- Context: 200k (UNVERIFIED)
- Parameters: 44B active / 745B total (MoE; 256 experts, 8 activated)
- API: Z.ai, OpenRouter, HuggingFace
- International availability: full
- Pricing tier: low-mid ([source — Zhipu pricing](https://bigmodel.cn/pricing))
- Known for: first frontier model from a publicly-listed Chinese AI company (HK IPO Jan 2026); 28.5T training tokens
- License: open-permissive — MIT

#### GLM-4.6 / GLM-4.7
- Lab: Z.ai
- Released: 4.6 late September 2025; 4.7 December 2025 ([source — Z.ai HF org](https://huggingface.co/zai-org))
- Positioning: prior-gen open-weight
- Parameters: 32B active / 355B total (4.5 base)
- API: Z.ai, OpenRouter, HuggingFace
- License: open-permissive — MIT

#### GLM-V family (multimodal)
- Canonical: `zai-org/GLM-V` family
- Lab: Z.ai
- Positioning: multimodal reasoning / open-weight
- Known for: scalable RL for multimodal reasoning
- License: open-permissive — MIT

### Allen Institute for AI (AI2)

#### OLMo 3 32B / OLMo 3.1 32B Think
- Canonical: `allenai/Olmo-3-1125-32B`, `allenai/Olmo-3.1-32B-Think`
- Lab: Allen Institute for AI
- Released: OLMo 3 32B base 2025-11-25; OLMo 3.1 Think early 2026 ([source — HF](https://huggingface.co/allenai/Olmo-3-1125-32B); [AI2 blog](https://allenai.org/blog/olmo3))
- Positioning: fully-open reasoning — weights + data + training flow
- Modalities: text in/out
- Context: 65,536 tokens
- Parameters: 32B dense
- API: HuggingFace, local
- Pricing tier: free-open
- Known for: first fully-open 32B reasoning model; complete transparency via Dolma/Dolci data; competitive with Qwen3 8B on math
- Benchmarks:
  - AIME 2024/25: within a few points of Qwen3 8B (source: AI2 blog)
  - HumanEvalPlus: leads comparison set (same)
  - IFEval / IFBench: OLMo 3.1 gains +4 / +20 over OLMo 3 (same)
- License: open-permissive — Apache 2.0

#### OLMo 2 32B
- Canonical: `allenai/OLMo-2-0325-32B-Instruct`
- Lab: AI2
- Released: 2025-03 ([source — AI2](https://allenai.org/blog/olmo2))
- Positioning: fully-open generalist; superseded by OLMo 3 for most new work
- Parameters: 32B dense
- API: HuggingFace
- Known for: first fully-open model to beat GPT-3.5-Turbo and GPT-4o mini on AI2's multi-skill suite
- License: open-permissive — Apache 2.0

---

## 4. Per-Lab Detail

### Anthropic

Anthropic ships a three-tier lineup (Opus flagship, Sonnet workhorse, Haiku small/fast) on a roughly three-to-four-month cadence; the 4.x generation converged all tiers on 1M-token contexts and native extended thinking. Strategic bet is agentic coding: every release headlines SWE-bench Verified, Terminal-Bench, and computer-use gains, with Opus 4.7 extending the lead into April 2026. Licensing is strictly closed-API — no open weights — but distribution is maximally fanned out across Anthropic direct, Amazon Bedrock, Google Vertex AI, and Microsoft Foundry, with per-tier pricing held flat across point releases. The lineup does not ship native audio in/out or image generation — text plus image input only. A reported unreleased internal model ("Claude Mythos Preview") has appeared in leaderboard submissions; treat scores attributed to it as provisional until a public release.

### OpenAI

OpenAI's 2026 lineup is the GPT-5.x family (Standard / Mini / Nano / Pro) plus the o-series reasoning track (o3, o3-pro, o4-mini), with legacy GPT-4.1 / 4o / o4-mini on a scheduled deprecation path through October 2026. Strategy converges on unified "thinking" models with routing: GPT-5.4 rolls computer-use natively into the general-purpose tier, which is the clearest positioning divergence from Anthropic's and Google's current lineups. Pricing across the tiers has dropped materially (o3 took an 80% cut in 2025), and Mini/Nano undercut Haiku and Flash on headline rates. All models remain closed-API; primary distribution is OpenAI direct plus Azure / Microsoft Foundry, with no Bedrock or Vertex presence. Multimodality (image, audio in and out) is broader than Anthropic's but GPT-5.4-era audio-out specifics were not fully re-verified in this pass.

### Google DeepMind

Google's Gemini 3 generation (Pro, Flash, Deep Think, Flash-Lite) ships as a tightly coordinated tier stack with unified multimodality (text + image + audio + video in, plus strong native tool-use). Gemini 3.1 Pro leads 13 of 16 published frontier benchmarks per Google's claim, and Deep Think extends that with test-time compute for science/engineering reasoning. Pricing leadership is clearest at the Flash tier ($0.50 / $3 per MTok undercuts Haiku 4.5). Distribution spans Google AI Studio, Vertex AI, Gemini app, AI Mode in Search, and Android/Pixel integrations — the broadest surface area of the three US labs. Licensing: Gemini is closed-API; Google's open-weights play lives in the separate Gemma family (not covered in this reference). Knowledge cutoff across Gemini 3 sits at January 2025 — the oldest of the three US labs' current flagships where disclosed.

### Meta

Meta's Llama 4 (April 2025) was the family's first pivot to MoE and native multimodality, shipping Scout (17B/109B, 10M context) and Maverick (17B/400B, 1M context) under the Llama 4 Community License. Both remain the firm's frontline open-weight models a year later — no Llama 5 has shipped and Behemoth (288B active / ~2T total) is still unreleased amid internal concerns that its capability gain doesn't justify shipping cost. Positioning against DeepSeek and Qwen has narrowed: Scout/Maverick now compete on cost-per-token and context length rather than raw benchmark dominance. Meta's strategic moat remains distribution through Bedrock/Azure/Databricks and the permissive-for-most-uses Community License. Expect Llama 5 pressure to build through 2026 if Chinese open-weights continue to close the gap on coding and reasoning.

### xAI

Grok 4 (July 2025) vaulted xAI onto the reasoning frontier on the strength of Humanity's Last Exam performance, with the multi-agent Heavy tier extending that lead behind a $300/month paywall. The product line has since fanned out: Grok 4 Fast targets the 2M-context cost-efficient segment at $0.20 / $0.50, while Grok Code Fast 1 is a purpose-built agentic-coding model distributed through Copilot / Cursor / Windsurf. Grok 5 remains unreleased and the public roadmap language is speculative — the confirmed factual base is that training is underway on Colossus 2. xAI's positioning is benchmark-top reasoning at the flagship tier plus aggressive commodity pricing at the fast tier, with everything closed-weight. The firm is the only major US lab that publishes no parameter counts for its flagship.

### Mistral AI

Mistral's 2025–2026 arc is defined by two moves. First, December 2025's "Mistral 3" refresh made Mistral Large 3 (41B active / 675B MoE, Apache 2.0) the largest genuinely open-permissive flagship on the market; Ministral 3 (3B/8B/14B) rounds out the edge tier on the same license. Second, March 2026's Mistral Small 4 unified the previously separate Magistral (reasoning), Pixtral (vision), and Devstral (agentic coding) lines into one 119B MoE with configurable reasoning effort. Mistral Medium 3 remains the closed API-only cost/performance play. Licensing is Mistral's distinctive signal: Apache 2.0 for the open flagship and small/edge models, Mistral Research License for historical Pixtral Large, closed API for Medium — a deliberate contrast to Meta's Community License and Cohere's CC-BY-NC.

### Cohere

Cohere's 2025–2026 strategy is explicitly enterprise. Command A (111B dense, 256k context, 2-GPU deployable) is the flagship, and its two specialty siblings — Command A Reasoning (August 2025) and Command A Translate (August 2025) — extend the same weights into agentic and translation workloads. Command R7B serves the on-device / cheap-RAG niche; Aya Expanse provides open multilingual research weights. Cohere's distinctive licensing posture is CC-BY-NC 4.0 on open weights (research-only) with commercial use gated to the API — a deliberate contrast to Mistral's Apache 2.0 and Meta's Community License. Embed v4 and Rerank round out a stack tuned for enterprise RAG rather than consumer chat. The firm does not compete on leaderboard HLE / GPQA scores; it competes on two-GPU footprint, 23-language coverage, and tool-use accuracy.

### DeepSeek

DeepSeek defines the open-weight reasoning frontier. R1 was the 2025 landmark that forced Western labs to respond, and V3.2's sparse attention plus native thinking-with-tool-use set architectural precedent for the 2026 generation. The lab ships on MIT licensing with full technical reports, and pricing via OpenRouter / Together / Fireworks sits roughly 20× below Western premium tiers. R2, the anticipated reasoning successor, remains unreleased as of April 2026 — delayed from May 2025 over reported quality-bar and Huawei Ascend training-stability issues.

### Alibaba Qwen

Qwen runs the broadest portfolio of any Chinese lab: flagship closed (Qwen3.6-Max-Preview, April 2026), efficient open-weight (Qwen3.5-397B-A17B, 17B active on 397B total), trillion-param (Qwen3-Max), native multimodal omni (Qwen3.5-Omni), and agentic coding (Qwen3-Coder-480B-A35B). Distribution is fully international via Alibaba Cloud, OpenRouter, Together, Fireworks, and SiliconFlow. The notable shift in April 2026 is Qwen3.6-Max going closed weights — breaking Qwen's prior open-weight flagship tradition and mirroring the closed-flagship trend visible at Baidu and ByteDance.

### Moonshot AI (Kimi)

Moonshot leads agentic depth. Kimi K2.6 (April 2026) scales to 300 sub-agents coordinating across 4,000 steps — the most aggressive public agentic architecture as of this catalog. K2.5 (January 2026) introduced the swarm pattern at 100 sub-agents. Weights are modified-MIT; international availability via OpenRouter, Cloudflare Workers AI, and the direct Moonshot Platform is strong. Benchmark claims put K2.6 at SWE-Bench Pro 58.6 and HLE-Full (with tools) 54.0 — leading positions among open weights as of mid-April 2026.

### Baidu (ERNIE)

ERNIE 5.0 (January 2026) is Baidu's flagship and the first Chinese model to crack LMArena's global top 10 at roughly 1460 Elo. It ships as a 2.4T-parameter native-full-modality (text/image/audio/video in and out) closed system primarily for Chinese enterprise customers — international availability is China-primary with partial reach through Baidu Cloud international. ERNIE X1.1 is the reasoning-focused sibling. The ERNIE 4.5 open-weight variants (21B-A3B and 28B-A3B-VL "Thinking" models) are available on Hugging Face under the ERNIE license. Baidu's English benchmarking tends to trail Chinese benchmarking for ERNIE models.

### Z.ai (Zhipu)

Z.ai became the first publicly-traded Chinese AI company with an HK IPO in January 2026. GLM-5 (February 2026) and GLM-5.1 (April 2026) are aggressively open under MIT and competitive on agentic coding — GLM-5.1 claims SOTA on SWE-Bench Pro and sustained 8-hour autonomous execution. Architecturally the 5.x line uses DeepSeek Sparse Attention (DSA) inherited from DeepSeek V3.2, signaling cross-lab architectural standardization among Chinese open-weight labs. Distribution via Z.ai direct, OpenRouter, and HuggingFace is strong internationally.

### MiniMax

MiniMax M2.5 (February 2026) targets frontier-class agentic behavior at 1/10–1/20 the cost of proprietary peers, using the hybrid lightning-attention lineage first shown in M1. Parameters: 10B active on 229B total MoE, 200k context, modified-MIT licensing. Distribution via MiniMax API, OpenRouter, and HuggingFace is fully international. MiniMax is the cost-efficiency play within the Chinese ecosystem for agentic workloads.

### ByteDance (Doubao / Seed)

Doubao Seed 2.0 (February 2026) powers the Doubao consumer chatbot (~155M WAU, #1 in China). Positioning is closed flagship for China-primary deployments; strong on math and code (AIME 2025 98.3, Codeforces Elo 3020, VideoMME 89.5). International availability is limited. Some Seed variants (e.g. Seed1.5-VL) are open under Apache 2.0, but the Doubao Seed 2.0 Pro flagship itself is closed. ByteDance also runs the Seedance video-generation line.

### Tencent (Hunyuan)

Tencent Hunyuan 2.0 (December 2025) is the first ultra-large Hybrid-Transformer-Mamba MoE — 32B active / 406B total, 256k context. The reasoning-focused Hunyuan-T1 (March 2025) is competitive with DeepSeek R1 on MMLU-Pro / C-Eval / AIME. Distribution via Tencent Cloud and Yuanbao (consumer) is China-primary with partial international availability. Weights for the Hunyuan-Large base are on Hugging Face under the Tencent Hunyuan License (open-restricted).

### IBM (Granite)

IBM is not chasing frontier general capability. Granite 4.0 competes on cost, regulatory posture (first ISO 42001 certified open models), and enterprise integration with watsonx, Red Hat OpenShift AI, NVIDIA NIM, and partner channels. The hybrid Mamba-2 / transformer + MoE architecture is the technical differentiator — small active-parameter counts let 32B-class models run cheap on modest GPUs with 128k context. Specialty variants (Vision for documents, TimeSeries for forecasting, Guardian for safety) are narrow by design and should not be treated as general-purpose. If an organization is already on watsonx or Red Hat OpenShift AI and needs predictable cost, governance, and on-prem, Granite is a credible default for text tasks, typically paired with a frontier model for hard reasoning.

### Amazon (Nova)

Nova 2 (Lite GA, Pro preview) launched at re:Invent 2025 supersedes the Nova 1 understanding tier with 1M-token context and a three-level extended-thinking dial. Nova Premier from the Nova 1 family is GA but being positioned out by Nova 2. Nova Sonic (speech-to-speech) is GA; Nova Act (browser agent) is still research preview as of April 2026. The content models (Canvas image, Reel video) are narrow specialties. The entire line is Bedrock-only — the value proposition is pick-Nova-when-you're-already-on-AWS for cost and IAM/VPC/Guardrails integration. On raw capability per dollar at the frontier, Bedrock-hosted Anthropic Claude still typically wins on hard tasks, which AWS explicitly allows by hosting both.

### Microsoft (Phi + MAI)

Microsoft runs two parallel lines. Phi (MS Research, small, open-weight MIT, capability-dense): Phi-4 (14B, Dec 2024), Phi-4-mini (3.8B, Feb 2025), Phi-4-multimodal (5.6B with audio in, Feb 2025), and Phi-4-reasoning / reasoning-plus (April 2025) — the reasoning variants beat o1-mini and DeepSeek-R1-Distill-Llama-70B on most benchmarks at 14B scale. MAI (MS AI division under Mustafa Suleyman, closed, Copilot-facing): the April 2026 launch shipped narrow generative specialties — MAI-Voice-1, MAI-Transcribe-1, MAI-Image-2 — but has not yet shipped a general-purpose text frontier model. Azure's general-purpose frontier offer remains Azure-hosted OpenAI and Anthropic until MAI ships a text flagship. Phi distribution covers Azure AI Foundry, HuggingFace, and Ollama.

### NVIDIA and AI2 (frontier-adjacent open lines)

NVIDIA's Nemotron 3 Nano pair (4B dense, 30B-A3B MoE with hybrid Mamba–Transformer) is open-weight and explicitly aimed at agentic pipelines on NVIDIA hardware (NIM, Jetson Thor, RTX, DGX Spark). AI2's OLMo 3 / 3.1 32B Think is the most credible fully-open frontier-adjacent line in the West — it ships training data and code alongside weights, which matters for auditability and research, and OLMo 3.1 is competitive with small Qwen3 reasoning models. Neither lab leads on general capability; they compete on openness, integration, and specialty.

---

## 5. By Capability Cluster

Short tables grouped by capability. Scores reference the master catalog; methodology caveats in §6 apply. "Open-weight" in these tables means weights available under a license that permits at least self-hosting for research; commercial-use restrictions vary (see master catalog's License field).

### 5a. Best-at-Coding

| Model | Lab | SWE-bench Pro | SWE-bench Verified | License |
|---|---|---|---|---|
| Claude Opus 4.7 | Anthropic | 64.3% | 87.6% | closed |
| GPT-5.4 xHigh (SEAL scaffold) | OpenAI | 59.1% | ~80% UNVERIFIED | closed |
| Kimi K2.6 | Moonshot | 58.6 | 80.2 | open (mod-MIT) |
| Qwen3-Coder-Next | Alibaba | — | 58.7% | open (Apache 2.0) |
| GLM-5.1 | Z.ai | SOTA claim | — | open (MIT) |
| Grok Code Fast 1 | xAI | — | 70.8% (xAI internal) | closed |
| Claude Sonnet 4.6 | Anthropic | — | 79.6% | closed |
| Gemini 3 Flash | Google | — | 78% | closed |

### 5b. Best-at-Reasoning

| Model | Lab | HLE (no tools) | GPQA Diamond | ARC-AGI-2 |
|---|---|---|---|---|
| Gemini 3.1 Pro | Google | 44.4% | 94.3% | 77.1% |
| Gemini 3 Deep Think | Google | 48.4% | — | 84.6% |
| GPT-5.4 xHigh | OpenAI | ~41.6% (AA) | ~92% UNVERIFIED | — |
| Claude Opus 4.7 | Anthropic | 54.7% (with tools) | — | — |
| Claude Opus 4.6 | Anthropic | — | 91.3% | — |
| Kimi K2.6 | Moonshot | 54.0 (with tools) | — | — |
| DeepSeek R1-0528 | DeepSeek | — | — | — (AIME 2025 87.5%) |
| Grok 4 Heavy | xAI | 50.7% (ext+tools) | — | — |

### 5c. Longest-Context

| Model | Lab | Context | Type |
|---|---|---|---|
| Llama 4 Scout | Meta | 10,000,000 | open-weight |
| Grok 4 Fast | xAI | 2,000,000 | closed |
| Gemini 3.1 Pro | Google | 1,000,000 | closed |
| Gemini 3 Flash | Google | 1,000,000 | closed |
| Claude Opus 4.7 | Anthropic | 1,000,000 | closed |
| Claude Opus 4.6 | Anthropic | 1,000,000 | closed |
| Claude Sonnet 4.6 | Anthropic | 1,000,000 | closed |
| GPT-5.4 | OpenAI | ~1,000,000 (922k in) | closed |
| Nova 2 Pro / Lite | Amazon | 1,000,000 | closed |
| Llama 4 Maverick | Meta | 1,048,576 | open-weight |
| Qwen3.6-Max-Preview | Alibaba | 260,000 | closed |

### 5d. Cheapest Premium-Quality

Pricing shown as input / output USD per million tokens. "Premium-quality" means the model is competitive on at least one load-bearing frontier benchmark (SWE-bench Pro, HLE, GPQA Diamond, ARC-AGI-2).

| Model | Lab | Price | Notes |
|---|---|---|---|
| DeepSeek V3.2 (OpenRouter) | DeepSeek | ~$0.27 / $0.41 | open, ultra-low |
| Grok 4 Fast | xAI | $0.20 / $0.50 | 2M context |
| Gemini 3 Flash | Google | $0.50 / $3.00 | frontier-tier on SWE-bench Verified |
| Mistral Small 4 | Mistral | $0.15 / $0.60 | open, Apache 2.0 |
| Mistral Medium 3 | Mistral | $0.40 / $2.00 | closed API |
| Amazon Nova 2 Lite | Amazon | $0.30 / $2.50 | 1M context |
| GPT-5.4 Mini | OpenAI | $0.75 / $4.50 | frontier-grade coding tier |
| Claude Haiku 4.5 | Anthropic | $1.00 / $5.00 | extended thinking, computer use |

### 5e. Best Open-Weights

| Model | Lab | License | Active / Total |
|---|---|---|---|
| Kimi K2.6 | Moonshot | mod-MIT | 32B / 1T |
| GLM-5.1 | Z.ai | MIT | ~40B / 754B |
| DeepSeek V3.2 | DeepSeek | MIT | 37B / 685B |
| Qwen3.5-397B-A17B | Alibaba | Apache 2.0 | 17B / 397B |
| Qwen3-Coder-480B-A35B | Alibaba | Apache 2.0 | 35B / 480B |
| Mistral Large 3 | Mistral | Apache 2.0 | 41B / 675B |
| Llama 4 Maverick | Meta | Llama 4 Community | 17B / 400B |
| Llama 4 Scout | Meta | Llama 4 Community | 17B / 109B |
| MiniMax M2.5 | MiniMax | mod-MIT | 10B / 229B |
| Phi-4-reasoning-plus | Microsoft | MIT | 14B dense |
| IBM Granite 4.0 H Small | IBM | Apache 2.0 | 9B / 32B |
| OLMo 3.1 32B Think | AI2 | Apache 2.0 | 32B dense |
| DeepSeek R1-0528 | DeepSeek | MIT | 37B / 671B |

### 5f. Best Multimodal

Input modalities plus output beyond text. Native = trained in one pipeline rather than bolted-on encoders.

| Model | Lab | Native Mod Scope | Notes |
|---|---|---|---|
| Gemini 3.1 Pro | Google | text+image+audio+video in, text out | unified frontier |
| Gemini 3 Flash | Google | text+image+audio+video in, text out | cheaper multimodal frontier |
| Qwen3.5-Omni | Alibaba | text+image+audio+video in, text+audio out | open-weight omni |
| ERNIE 5.0 | Baidu | text+image+audio+video in+out | closed, China-primary |
| GPT-5.4 | OpenAI | text+image+audio in, text out (UNVERIFIED audio-out) | + native computer-use |
| Amazon Nova 2 Pro/Lite | Amazon | text+image+video in, text out | 1M context |
| Llama 4 Maverick/Scout | Meta | text+image in, text out | open-weight native early-fusion |
| Phi-4-multimodal | Microsoft | text+image+audio in, text out | small open-weight |
| Pixtral Large (deprecated) | Mistral | text+image in, text out | rolled into Small 4 |
| Claude Opus 4.7 | Anthropic | text+image in, text out | no audio/video |

---

## 6. Benchmarks Context

Brief orientation to the public benchmarks that vendors cite and aggregators track. A model's numbers on the same benchmark can differ 5–15 points across vendor-reported, Artificial Analysis re-run, and aggregator re-runs depending on scaffold, effort level, pass@k, and contamination handling — compare within a methodology regime, not across.

**LMArena (Chatbot Arena)** — crowdsourced pairwise human preference Elo across blind head-to-head chats, maintained by LMArena (formerly LMSYS, UC Berkeley spin-out). The 1500 Elo barrier was broken in Q1 2026. Current top tier (around 1504–1505 Elo) clusters Claude Opus 4.7 and Opus 4.6 Thinking, with GPT-5.4 and Gemini 3.1 Pro close behind. Documented structural critiques through 2025–2026 include style bias (verbosity, markdown, emoji, confident-wrong preference), vote-quality concerns (SurgeAI reported disagreement with ~52% of sampled votes), and vendor gaming via private variants (Meta's 27 private Llama-4 variants pre-release is the widely cited example). Scale's Seal Showdown (September 2025) uses paid expert raters rather than crowdsourcing as a direct competitor. Source: https://lmarena.ai/leaderboard.

**Artificial Analysis Intelligence Index** — composite of ~10 evaluations across Agents, Coding, General, and Scientific Reasoning (25% each) yielding an aggregate "intelligence" score. As of April 2026 (index v4.0.4) Claude Opus 4.7, Gemini 3.1 Pro Preview, and GPT-5.4 xhigh tie at 57 — a three-way tie within AA's own published confidence interval. Real caveats: component CIs are wider than the composite CI; equal-weighted categories can bury capability differences; effort levels and scaffolds are chosen per-submission, favoring models with strong test-time-compute modes; costs and latency are tracked separately but not part of the "intelligence" number. Treat as a useful snapshot, not ground truth. Source: https://artificialanalysis.ai/models.

**SWE-bench Verified / SWE-bench Pro** — agent resolves real GitHub issues. Verified is a human-verified subset (~500 tasks from 12 Python OSS repos, maintained by Princeton NLP); Pro is the contamination-resistant successor (1,865 tasks across 41 professional repos, maintained by Scale AI). Verified is saturating — Claude Mythos Preview reportedly at 93.9%, Opus 4.7 at 87.6%, GPT-5.3 Codex at 85%, with contamination concerns fueling Pro's creation. Pro is currently the most discriminating coding benchmark at the frontier: Opus 4.7 at 64.3% (Anthropic-reported), GPT-5.4 xHigh at 59.1% (Scale standardized SEAL scaffold), Kimi K2.6 at 58.6%. Scale's standardized SEAL scaffold produces lower numbers than vendor-submitted agent scores; headline numbers often conflate the two. Sources: https://swebench.com and https://labs.scale.com/leaderboard/swe_bench_pro_public.

**GPQA Diamond** — 198 Google-proof graduate-level multiple-choice questions in physics, chemistry, and biology. Rapid rise 39% (2023) → 77% (o1, 2024) → 94% (2026); human PhD-expert baseline is roughly 81%. Gemini 3.1 Pro leads at 94.1–94.3%. Saturating — AA has cut its composite weight to 6.25% and it is expected to lose discriminatory power within 12 months. Source: https://artificialanalysis.ai/evaluations/gpqa-diamond.

**MATH / MATH-500 and AIME 2024/2025** — competition math. MATH-500 (the OpenAI-curated subset) is fully saturated — GPT-5 high 99.4%, o3 99.2%, Grok 3 mini Reasoning high 99.2%. AIME 2024 is effectively saturated; AIME 2025 has models reported at 100% on specific effort settings. Contamination is a persistent risk for released-year problems; MathArena mitigates by rotating ongoing-competition problems. AA's MATH-500 weight in the composite has dropped to roughly 5%. Useful only as a floor check at the frontier. Sources: https://artificialanalysis.ai/evaluations/math-500, https://artificialanalysis.ai/evaluations/aime-2025, https://matharena.ai/.

**HumanEval / MMLU / MMLU-Pro** — fully saturated (HumanEval) or saturating (MMLU-Pro). HumanEval 164 Python function-completion problems from OpenAI's 2021 paper — universally treated as dead for frontier differentiation, 1-point gaps are noise. MMLU suffers from 2020-era contamination concerns. MMLU-Pro (TIGER-Lab, 12k harder questions with 10 answer choices) still differentiates at the top, with Gemini 3 Pro Preview at 89.8%, Claude Opus 4.5 at 89.5%, Gemini 3 Flash Preview at 89.0%. Source: https://artificialanalysis.ai/evaluations/mmlu-pro.

**LiveCodeBench** — contamination-free competitive programming with continuously refreshed LeetCode / Codeforces-style problems (UC Berkeley, Jain et al.). Gemini 3 Pro Preview at 91.7%, Gemini 3 Flash Preview at 90.8%, DeepSeek V3.2 Speciale at 89.6%. Multiple versions in circulation (v5, v6) — scores are not comparable across versions. Stronger signal than HumanEval by design. Source: https://livecodebench.github.io/leaderboard.html.

**Terminal-Bench 2.0 / TAU-bench (τ²-bench)** — agentic evaluations. Terminal-Bench 2.0 (Laude Institute / Stanford) runs LLM agents on real terminal/CLI/repo tasks; leaders include Claude Mythos Preview 82.0%, GPT-5.3 Codex 77.3%, GPT-5.4 75.1%, and top agent+model combos (ForgeCode + Opus 4.6 / ForgeCode + GPT-5.4 at 81.8%). τ²-bench (Sierra Research, the current version of TAU-bench) evaluates multi-turn tool use in retail / airline / telecom domains. Both benchmarks are load-bearing but scaffold-sensitive — raw model scores and agent+framework scores should not be compared directly. Sources: https://www.tbench.ai/leaderboard, https://artificialanalysis.ai/evaluations/tau2-bench.

**ARC-AGI-2** — abstract visual reasoning puzzles resistant to pattern-matching, maintained by the ARC Prize Foundation (Chollet). As of April 2026, Gemini 3.1 Pro leads at 0.771 (llm-stats, refinement-loop result). Baseline Gemini 3 Pro was 31% raw, 54% with refinement. Human baseline sits at ~60%. ARC-AGI-3 is planned for 2026 with interactive-reasoning format. Currently the key non-saturated reasoning benchmark. Source: https://arcprize.org/leaderboard.

**Humanity's Last Exam (HLE)** — 2,500 closed-ended expert questions across dozens of academic subjects (Scale AI + CAIS), designed as the last hard closed-ended academic benchmark. Highest text-only / tool-free score reported is Gemini 3.1 Pro at 44.4–44.7%. GPT-5.4 xhigh 41.6%. Aggregator numbers that credit Claude Mythos Preview at 64.7% or Opus 4.7 at 54.7% with-tools reflect a different methodology regime — use the primary source (https://agi.safe.ai/) for vendor submissions.

**Emerging / specialty benchmarks.** AA-Omniscience tracks hallucination rate and factual recall (Gemini 3.1 Pro leads). SciCode (research-level scientific coding) and CritPt (research-level physics reasoning) entered AA's composite in v4.0 as replacements for saturated benchmarks — Gemini 3.1 Pro Preview tops both in AA's 2026-Q1 reporting. These are early and should be treated as signal, not ground truth, until third-party validation accumulates.

**Governance / integrity issues on the public record.** LMArena gaming allegations (Meta/Llama-4 pre-release, documented by third-party researchers). SWE-bench Verified contamination, a primary motivator for SWE-bench Pro. Multiple aggregator leaderboards publish numbers substantially diverging from primary sources — not necessarily fraud, but a citation-hygiene risk. When in doubt, prefer vendor-authoritative sources (announcement blog, system card) or benchmark-maintainer leaderboards over third-party aggregators, and note the methodology regime (effort level, scaffold, tool-use, pass@k) alongside any cited score.

---

## 7. Chinese-Ecosystem Note

**Lab distinctions.** DeepSeek defines the open-weight reasoning frontier — R1 was the 2025 landmark that forced Western labs to respond, and V3.2's sparse attention (DSA) with native thinking+tool-use set the architectural precedent now being adopted by Z.ai's GLM-5 line. Alibaba Qwen runs the broadest portfolio (coding, multimodal Omni, trillion-param Max, efficient A17B sparse MoE) and is the most production-ready for global developers — but Qwen3.6-Max-Preview closed its weights in April 2026, breaking Qwen's open-weight flagship tradition. Moonshot Kimi leads agentic depth: K2.6's 300-sub-agent swarm and 4,000-step coordination is the most aggressive public agentic architecture. Baidu ERNIE 5.0 is strongest on native multimodal unification (2.4T params, text/image/audio/video I/O) but remains primarily China-facing. Z.ai (Zhipu) is the first publicly-traded Chinese AI company (HK IPO January 2026); GLM-5 / 5.1 are aggressively open under MIT. MiniMax competes on cost efficiency — M2.5 delivers frontier-adjacent agentic at 1/10–1/20 Western pricing. ByteDance Doubao Seed 2.0 is closed, China-primary, and optimized for the consumer Doubao chatbot.

**Open vs closed posture.** DeepSeek (MIT), Moonshot (modified MIT), Z.ai (MIT), MiniMax (modified MIT), and Qwen's base / coder / omni lines (Apache 2.0) keep Chinese labs well ahead of Western peers on open-weight frontier availability. The emerging trend is clear: Qwen3.6-Max going closed mirrors Baidu's and ByteDance's closed flagships. The strategic split within labs — flagship monetization vs open-weight developer mindshare — is becoming deliberate. Z.ai's post-IPO posture (aggressive open MIT at GLM-5/5.1) is the counterpoint.

**International availability.** DeepSeek, Qwen (open variants), Kimi, MiniMax, and GLM are fully available via OpenRouter, Together, Fireworks, DeepInfra, SiliconFlow, and self-hosting. Qwen3.6-Max-Preview is reachable internationally through Alibaba Cloud. ERNIE and ByteDance Doubao/Seed are primarily China-facing with limited international presence. Tencent Hunyuan sits between: Hunyuan-Large weights on Hugging Face, Hunyuan 2.0 cloud access primarily China.

**Known gaps and caveats.** Models from ERNIE and Doubao show weaker documented English performance relative to Chinese. Benchmark claims from Chinese vendors are often self-reported and should be treated as preliminary pending Artificial Analysis or LMArena independent verification. Chinese-origin models exhibit documented content restrictions on PRC-sensitive topics (Tiananmen, Taiwan sovereignty, Xi Jinping criticism) — behavior varies between API-hosted (heavier filters) and self-hosted open weights (lighter). For production use cases where such content is relevant, self-hosting gives more control.

**Where Chinese labs lead.** (1) Open-weight reasoning — DeepSeek R1 and V3.2 remain the open-weight reasoning ceiling. (2) Agentic scale — Kimi K2.6 and GLM-5.1 hold current public records for long-horizon agent execution. (3) Cost efficiency — MiniMax M2.5, DeepSeek V3.2, and Qwen3.5-397B-A17B deliver frontier-adjacent quality at 1/10 to 1/20 Western per-token pricing. (4) Native multimodal — Qwen3.5-Omni and ERNIE 5.0 push unified text/image/audio/video further than most Western open offerings. (5) Sparse MoE architecture — Chinese labs are the engineering leaders on ultra-sparse activation (Qwen3.5-397B-A17B at 4.3% activation, GLM-5 at 5.9%, Kimi K2.6 at 3.2%).

---

## 8. Open-Weight Frontier Models

Open-weight models have distinct use cases from closed APIs: fine-tuning on proprietary data, self-hosting for privacy or data-residency requirements, on-prem deployment, and architectural research. Licensing nuance matters — "open" covers a spectrum from permissive (MIT, Apache 2.0) through restricted (Llama Community, CC-BY-NC, ERNIE, Tencent Hunyuan) to research-only (Mistral Research License).

### Permissive (MIT / Apache 2.0): production-safe for most commercial uses

- **DeepSeek V3.2** — 37B active / 685B total, MIT. The open-weight reasoning ceiling as of April 2026.
- **DeepSeek R1-0528** — 37B active / 671B total, MIT. Landmark reasoning-only release; distilled variants down to 1.5B.
- **Qwen3.5-397B-A17B** — 17B active / 397B total, Apache 2.0 (Qwen standard; verify for specific checkpoint). Efficiency leader.
- **Qwen3-Coder-480B-A35B** — 35B active / 480B total, Apache 2.0. Strongest open-weight coder.
- **Mistral Large 3** — 41B active / 675B total, Apache 2.0. Largest genuinely open-permissive Western flagship.
- **Mistral Small 4** — 119B MoE, Apache 2.0. Unified instruct+reasoning+coding.
- **Ministral 3 (3B / 8B / 14B)** — dense, Apache 2.0. Edge tier.
- **Phi-4 / Phi-4-reasoning** — 14B dense, MIT. Small-model reasoning leader.
- **IBM Granite 4.0 (H Small / H Tiny / H Micro / Vision / TimeSeries / Guardian)** — Apache 2.0. Enterprise-governance story.
- **NVIDIA Nemotron 3 Nano (4B / 30B-A3B)** — NVIDIA Open Model License (verify specifics). NVIDIA-hardware-optimized.
- **AI2 OLMo 3 / 3.1 32B Think** — Apache 2.0. Full transparency (weights + data + training code).

### Modified permissive (modified MIT with minor restrictions)

- **Kimi K2.6 / K2.5 / K2** — 32B active / 1T total, modified MIT. Agentic leader.
- **MiniMax M2.5** — 10B active / 229B total, modified MIT. Cost-efficient agentic.
- **GLM-5.1 / GLM-5** — 40–44B active / 745–754B total, MIT. Post-IPO open-weight flagship.

### Restrictive community / research licenses (review terms carefully)

- **Llama 4 Maverick / Scout** — 17B active / 400B or 109B total, Llama 4 Community License. Commercial use permitted with provisions (user-count thresholds, attribution, acceptable-use).
- **Cohere Command A / A Reasoning / A Translate / R7B** — 111B or 7B dense, CC-BY-NC 4.0 for weights. Non-commercial only on weights; commercial requires API.
- **Cohere Aya Expanse 32B** — dense, CC-BY-NC 4.0.
- **Baidu ERNIE 4.5 21B-A3B / VL-28B-A3B Thinking** — 3B active MoE, ERNIE license (exact terms UNVERIFIED).
- **Tencent Hunyuan-Large base** — Tencent Hunyuan License (HuggingFace).
- **Mistral Pixtral Large** — Mistral Research License, research-only; commercial license sold separately (deprecated in favor of Small 4 which is Apache 2.0).
- **Mistral Codestral 25.01** — Mistral Non-Production License; commercial license sold separately.

### Decision heuristic

If fine-tuning on proprietary data, self-hosting, or data residency matters: start with the permissive tier (DeepSeek V3.2, Qwen3.5-397B-A17B, Mistral Large 3). If you need a small dense model for edge or on-device: Phi-4-reasoning (14B, MIT), Ministral 3 (3B/8B/14B, Apache 2.0), Granite 4.0 H Micro (3B, Apache 2.0). If agentic long-horizon execution matters: Kimi K2.6 or GLM-5.1 (modified MIT / MIT). If full auditability (weights + data + training code) matters for research or regulated uses: AI2 OLMo 3.1. If commercial deployment at scale and AWS distribution matters: Llama 4 Maverick or Scout under the Community License (read the thresholds).

---

## 9. Staleness and Next Review

**Valid as of:** 2026-04-23. **Re-check by:** 2026-05-07 (two weeks).

**Release cadence observations.** Anthropic has been shipping a flagship (Opus) refresh every 2–3 months across the 4.x line; expect a 4.8 or a sibling Sonnet 4.7 / Haiku 4.6 release before the end of Q2 2026. OpenAI has been shipping flagship refreshes quarterly (GPT-5.x); GPT-5.5 or a successor o-series release is plausible within the re-check window. Google has been shipping Gemini 3.x point releases roughly quarterly since Gemini 3 Pro in November 2025; Gemini 3.2 or a Deep Think refresh is plausible. xAI is the slowest of the US frontier labs — Grok 5 is public-roadmap Q2 2026 beta / Q3 API GA, but dates have slipped before.

**Chinese labs move fastest.** Qwen, Kimi, Z.ai, DeepSeek all shipped frontier releases in Q1 2026; Qwen and Kimi both shipped in April 2026 (Qwen3.6-Max-Preview 2026-04-20; Kimi K2.6 2026-04-20). Expect at least one new Chinese open-weight flagship by 2026-05-07.

**Meta** has not shipped a frontier release since April 2025 (Llama 4 Maverick / Scout). The pressure is building and a Llama 5 family is plausible by mid-2026 but unscheduled publicly.

**Priority re-verification items** (highest likelihood of being stale by 2026-05-07, in rough priority order):

1. OpenAI GPT-5.x — direct announcement URL for GPT-5.4, audio-out confirmation, max-output tokens, knowledge cutoff; check against platform.openai.com and openai.com/index/*.
2. Anthropic Opus 4.7 — knowledge cutoff (not disclosed in announcement); check the Opus 4.7 system card when Anthropic publishes it.
3. Anthropic next release — Sonnet 4.7 or Haiku 4.6; check anthropic.com/news and platform.claude.com/docs.
4. Claude Mythos Preview — status. Currently reported via CNBC/Axios as unreleased. Track anthropic.com/news.
5. DeepSeek R2 — status. Track huggingface.co/deepseek-ai and api-docs.deepseek.com.
6. Qwen3.6-Max — GA pricing and licensing. Track alibabacloud.com.
7. Kimi K3 and DeepSeek V4 — unreleased status; track huggingface.co.
8. Grok 5 — roadmap slips; track x.ai/news.
9. Amazon Nova 2 Pro GA, Nova Act GA — track aws.amazon.com/ai/generative-ai/nova.
10. Microsoft MAI general text flagship — not yet shipped; track blogs.microsoft.com.

**How to refresh.** Pull vendor announcement feeds (anthropic.com/news, openai.com/index, blog.google, x.ai/news, ai.meta.com/blog, mistral.ai/news), HuggingFace org pages for each open-weight lab, LMArena and Artificial Analysis leaderboards, and OpenRouter catalog. Mark any row that cannot be re-verified as UNVERIFIED rather than carrying forward stale data. Update the `valid-as-of` and `re-check-by` dates in frontmatter on every refresh. Bump the `updated` frontmatter date on any material edit.

---

© 2026 Eric Riutort. All rights reserved.
