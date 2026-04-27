---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
valid_as_of: 2026-04-24
re_check_by: 2026-07-24
tier: REFERENCE
content_class: research
---

# External LLM Research Delta — Gemini + Grok vs Portfolio Assessments

Cross-reference of two external LLM research sessions (Eric's Gemini session + Eric's Grok share, both 2026-04-24) against the two completed portfolio assessments: `skills-to-add-assessment.md` and `mcp-servers-to-add-assessment.md`. Objective: identify gaps, validate alignments, surface contradictions, and decide whether either top-10 list needs revision.

**Change log**
- 2026-04-24 initial — Gemini delta synthesized.
- 2026-04-24 revision — Grok share added as second external source (§3.5); §5 and §6 revised to reflect three-way analysis. Title and provenance sections updated.

---

## 1. Executive summary

- **One NEW-TO-OUR-LIST MCP merits adoption (Gemini-sourced):** Firecrawl (self-hosted Apache-2.0 build) fills a gap Brave Search does not cover (URL → LLM-ready Markdown). Recommend rank 8.
- **One conditional ADD (Gemini-sourced):** DuckDB MCP for ad-hoc analytics against `data/combined_workout_log.txt` and local JSONL — self-hostable, OSS, complements Supabase MCP. Tie-breaker rank 12.
- **Grok adds the standards/governance layer that neither Gemini nor our assessments addressed:** AAIF (Agentic AI Foundation under Linux Foundation, Dec 2025), OpenTelemetry GenAI semantic conventions, AG-UI protocol. None are MCPs or skills — they are **architecture-level** inputs that should update `docs/architecture.md` D27 discussion and our observability choice. Grok does not change the MCP top-10 but materially changes D27 context.
- **Convergence signal (weak):** Gemini and Grok agree on almost no specific MCPs. They operate at different abstraction layers — Gemini at the product layer (install these MCPs), Grok at the protocol layer (adopt these standards). Only MCP Registry and the MCP spec itself appear in both; our assessment already names both.
- **Three Gemini MCPs fail our composite filter and should be explicitly declined:** Supadata (SaaS, TOS risk), Jira MCP (no Jira in stack), Gemini MCP (SaaS, weak ROI). Desktop Commander is borderline decline.
- **Our MCP top-10 needs one add (Firecrawl, rank 8) and one re-rank cascade.** Skills top-10 stands. Architecture doc needs a follow-up edit to fold in AAIF + OTel GenAI awareness.

---

## 2. Input provenance

- **Source 1 (Gemini):** Eric's Gemini (chat) research session, output pasted verbatim into Cowork 2026-04-24. Eric owns the text; reproduced in the originating Cowork prompt, not duplicated here. Gemini cites one external source: BridgeMind YouTube video *"Top 5 MCP Servers For Vibe Coding In 2026"* (~9K views). Not independently verified.
- **Source 2 (Grok):** Shared Grok conversation at `x.com/i/grok/share/7845dd36bf414545b71a2f930c9edd72`, fetched 2026-04-24 via Claude in Chrome (Eric's signed-in session as @RiutortEric). Two-turn conversation: (a) agentic AI sources survey — frameworks, design patterns, vendor-specific resources; (b) follow-up on the protocols-and-standards layer — MCP spec, A2A, AG-UI, AAIF, OpenTelemetry GenAI conventions. Grok cites 88 + 77 web pages across the two turns; citation chips are embedded in the transcript (e.g., `anthropic.com`, `github.com`, `linuxfoundation.org`, `opentelemetry.io`). Extract captured via `get_page_text` on the SPA.
- `docs/reference/youtube-mcp-skills-research.md` — **does not exist** as of 2026-04-24. BridgeMind video not independently verified. If that doc lands later, re-run this delta against it.

---

## 3. Skills delta

Five Gemini "skills." All five are capability categories, not named installable skills. Classifying each:

### 3.G1 Workflow Chaining & State Management — CATEGORY-MISMATCH

- **Map to our work:** `document-cm` (WF-003 nine-step GATE workflow) + Cowork's `scheduled-tasks` + native Claude Code multi-turn orchestration.
- **Verdict:** Not a skill; a capability we already implement through document-cm and Book Boss/Notekeeper orchestration. No new entry needed.

### 3.G2 Agentic Memory & Context Retention — CATEGORY-MISMATCH (with a live question)

- **Map to our work:** Three-layer memory architecture already sketched — (a) `memory_type` enum in CM brief v0.3.0; (b) planned pgvector layer (Supabase); (c) `reach4all-research-mcp` BUILD candidate (Q18).
- **Gemini's nuance:** Suggests a "personal vector DB" specifically for cross-session memory of user preferences and past decisions — distinct from research-content retrieval.
- **Open question surfaced:** Is user-preference memory a separate store from the content-indexing pgvector layer, or one unified store with namespace tags? Architectural-consequence decision; flag for next architecture review.
- **Verdict:** No new skill entry. But Gemini's framing sharpens an open design question on memory segmentation.

### 3.G3 Error Handling & Self-Correction — ALREADY-ON-OUR-LIST

- **Map to our work:** `agentic-ai-evals-harness` at **rank 4** of skills top-10; `content-drop-detector` at **rank 7**; D19 Tier 1/Tier 2 reasoner duality is the load-bearing framework (architecture.md).
- **Verdict:** Our coverage is stronger and more specific than Gemini's generic "verification loop." No change.

### 3.G4 Multimodal Orchestration — CATEGORY-MISMATCH + LOW-PRIORITY

- **Map to our work:** Not in scope for Lifting Tracker MVP. Voice/image → document workflows are a post-MVP concern. The `docx`/`pptx`/`xlsx` skills we already have provide basic multimodal document creation; no gap for current roadmap.
- **Verdict:** Defer. Not in top-10, not proposed for addition.

### 3.G5 Token Optimization & Async Execution — CATEGORY-MISMATCH

- **Map to our work:** Cowork's task orchestration + `scheduled-tasks` already provides async execution. Token optimization is cross-cutting; partially addressed by our decision to start `content-drop-detector` as a scheduled-task (not skill) and by Playwright CLI-over-MCP guidance (4x token reduction per Microsoft 2026).
- **Verdict:** No new skill. Could warrant a convention doc on "when scheduled-task vs skill vs in-chat" — low priority.

**Skills delta count:** 5 Gemini items → 0 ADDs, 1 sharpens an open question (3.2), 4 already-mapped or declined. Our skills top-10 stands.

---

## 3.5 Grok delta

Grok's answer operates at a different abstraction layer than Gemini's — it covers (a) agentic AI frameworks (model-layer choices), and (b) the protocols-and-standards layer. Neither is a product-level MCP shopping list. Classification below reflects this structural difference; heavy overlap with Gemini is minimal because Grok largely avoided the product layer.

### 3.5.1 Protocol and standards layer — per-item classification

| Grok item | Canonical URL (per Grok) | Classification | Our position |
|---|---|---|---|
| **MCP spec** | `modelcontextprotocol.io/specification/latest` | ALREADY-ON-OUR-LIST (implicit) | Architecture §2.1 "MCP-first principle" already ratifies this. No change. |
| **MCP Registry** | `registry.modelcontextprotocol.io` | ALREADY-ON-OUR-LIST | Named in mcp-assessment §3. Grok confirms canonical URL. |
| **awesome-mcp-servers (punkpeye)** | `github.com/punkpeye/awesome-mcp-servers` | NEW-TO-OUR-LIST (discovery aid, not an MCP) | Our §3 lists registries (PulseMCP, Glama, Docker Catalog) but not awesome-list style community curation. Add as a discovery-aid footnote, not a top-10 entry. |
| **A2A (Agent-to-Agent) protocol** | `a2a-protocol.org`, `github.com/a2aproject/A2A` | ALREADY-ON-OUR-LIST (D27 tension) | Architecture D27 explicitly names A2A as one of three interop candidates (A2A vs AAIF-sponsored vs MCP-for-interop). Grok provides the canonical URLs we can cite. **Update D27 notes.** |
| **AG-UI protocol** | `github.com/ag-ui-protocol/ag-ui`, `docs.ag-ui.com` | **NEW-TO-OUR-LIST** | Agent-to-UI event protocol (~26 standard event types, SSE/WebSockets). Not on our radar. Relevance: if Lifting Tracker's coach dashboard eventually needs agent-driven UI updates (D19 Tier 2 drafts streaming to the UI), AG-UI is a candidate over custom WebSocket protocol. **Architecture follow-up, not MCP top-10.** |
| **AAIF (Agentic AI Foundation under Linux Foundation)** | `aaif.io`, `linuxfoundation.org/press/...agentic-ai-foundation`, `github.com/aaif` | **NEW-TO-OUR-LIST — material** | Neutral governance foundation launched Dec 2025; founding contributions include Anthropic's MCP, Block's goose, OpenAI's AGENTS.md. Our D27 discussion names "AAIF" as a protocol candidate but predates this governance context. Grok's framing reframes AAIF from "a candidate protocol" to "a foundation under which MCP already lives." **Materially updates D27 reasoning.** Recommend edit to `architecture.md` D27 narrative and a short finding doc. |
| **OpenTelemetry GenAI semantic conventions** | `opentelemetry.io/docs/specs/semconv/gen-ai/`, `github.com/open-telemetry/semantic-conventions` | **NEW-TO-OUR-LIST — material for HyperDX decision** | Standard attribute set for tracing LLM/agent/tool calls (`gen_ai.operation.name`, `gen_ai.request.model`, agent spans). Our Sprint 0c observability decision (HyperDX/ClickHouse) has not yet committed to an instrumentation convention. Adopting OTel GenAI conventions now makes our observability vendor-portable. **Sprint 0c follow-up.** |

### 3.5.2 Framework layer — CATEGORY-MISMATCH across the board

Grok's first turn lists: LangChain/LangGraph, LlamaIndex, CrewAI, AutoGen, Semantic Kernel, OpenAI Swarm, Claude Agent SDK, Google ADK, and comparisons. None are MCPs or Anthropic Skills.

- **Our stance:** We are a Claude Agent SDK + Claude Code shop by default (architecture.md). Framework choice is already settled implicitly. Third-party agent frameworks (LangGraph, CrewAI, AutoGen) are not in our stack and would violate the composite principle's "self-hostable + not-SaaS + AI-native friction reduction" axis by adding abstraction layers over the Anthropic stack.
- **CATEGORY-MISMATCH verdict:** None of these belong in the MCP or Skills top-10. A follow-up `docs/reference/agent-framework-comparison.md` could document the decline rationale if the question recurs — not urgent.

### 3.5.3 Convergence and divergence vs Gemini

- **Convergence:** Both surface the MCP Registry and the MCP ecosystem broadly. That's essentially the only specific overlap. Both implicitly endorse MCP-as-default for tool-calling.
- **Divergence (material):** Gemini names 7 specific MCPs (Desktop Commander, Firecrawl, etc.); Grok names zero MCP products beyond the reference/registry. Grok names AAIF/AG-UI/OTel-GenAI; Gemini names none of these. The two sources operate at different layers of the agentic-stack decomposition.
- **Independent signal count:** Items surfaced by both sources independently = 1 (MCP Registry). Too thin to use as a convergence-strengthens-signal lever on any specific product pick.

**Grok delta count:** 7 protocol/standards items → 2 NEW-TO-OUR-LIST-material (AAIF, OTel GenAI), 1 NEW-TO-OUR-LIST-discovery-aid (awesome-mcp-servers), 2 NEW-TO-OUR-LIST-architecture-follow-up (AG-UI), 2 ALREADY-ON-OUR-LIST (MCP spec, MCP Registry, A2A). Framework layer (9+ items): all CATEGORY-MISMATCH.

---

## 4. MCP delta

Seven Gemini-named MCPs. Per-entry classification + composite-principle assessment.

### 4.1 Desktop Commander — BORDERLINE / DECLINE

- **Classification:** Overlaps with our rank-1 filesystem MCP + Cowork's native bash.
- **License / self-host:** MIT, local-only. Passes composite.
- **What it adds over filesystem + bash:** Diff-preview editing, unified surface for file + terminal ops.
- **Why decline:** (a) Anthropic first-party filesystem MCP is our baseline; (b) Cowork already exposes bash natively; (c) third-party maintainer risk (single-maintainer community project) vs Anthropic first-party. Consolidating file + terminal into one MCP is convenience, not capability.
- **Rank rec:** Not in top-10. Monitor; revisit if Anthropic's filesystem gains direct terminal integration or if Desktop Commander ships Anthropic-blessed.

### 4.2 Firecrawl — **NEW-TO-OUR-LIST / ADD**

- **Classification:** NEW. Our list has `brave-search` (rank 7) for search but no URL-to-Markdown conversion MCP.
- **License / self-host:** SaaS by default (firecrawl.dev, paid tiers). **Self-hosted OSS build exists under Apache-2.0** on GitHub (mendableai/firecrawl), Docker-deployable. Railway-deployable with moderate effort (requires Playwright/Puppeteer browser pool).
- **Composite fit:** Self-hosted passes all four axes; SaaS variant fails "not-SaaS." Only the self-hosted build is acceptable.
- **Use case:** Reach4All research refresh (scrape citations to markdown for staleness checks); Book Boss corpus intake from URLs; architecture research when a single-URL deep extract beats Brave Search's summaries.
- **Rank rec:** **Rank 8 or 9**, displacing `playwright` HOLD (which is already HOLD-leaning). Defers to Sprint 1 — aligns with Reach4All standup.
- **Caveat:** Self-hosted Firecrawl runs headless browsers; Railway cost may spike. Budget a spike during Sprint 1 standup before committing.

### 4.3 Brave Search — ALREADY-ON-OUR-LIST

- **Classification:** Our **rank 7** (COMMIT, Sprint 1). Matches Gemini's recommendation.
- **Verdict:** Aligned. No change.

### 4.4 Supadata — DECLINE (composite failure + TOS risk)

- **Classification:** NEW but fails filter.
- **License / self-host:** SaaS (supadata.ai), paid API. **No self-hosted build.**
- **Composite fit:** Fails "self-hostable" and "not SaaS" axes.
- **TOS risk:** YouTube ToS explicitly prohibit systematic transcript scraping outside their Data API. Supadata's mechanism is opaque; using it in a portfolio that eventually ships publicly is a legal tail-risk.
- **Alternative:** `yt-dlp --write-subs --skip-download` + OpenAI Whisper (self-hosted) if a transcript workflow is ever needed. No MCP required; shell tool suffices.
- **Rank rec:** Explicit SKIP. Add to anti-list under "SaaS-locked video-transcript services."

### 4.5 DuckDB MCP — **NEW-TO-OUR-LIST / CONDITIONAL ADD**

- **Classification:** NEW. Our list names `sqlite` (HOLD, archived reference) and `drizzle-mcp` (HOLD, Sprint 1+) but not DuckDB specifically.
- **License / self-host:** DuckDB itself is MIT. Community DuckDB MCPs exist (self-hosted, OSS). MotherDuck variant is SaaS — skip. Use community/OSS variant only.
- **Composite fit:** Self-hosted DuckDB MCP passes all four axes.
- **Use case:** Ad-hoc analytics against `data/combined_workout_log.txt` (400+ sessions historical import source), JSONL exports, CSV staging tables — without round-trip to Supabase. DuckDB reads Parquet/CSV/JSONL natively; Supabase Postgres does not without extensions.
- **Additive or redundant:** Additive. Supabase MCP is for the production DB (RLS, migrations, types). DuckDB MCP is for local analytics/prototyping that doesn't want to touch production schema. Different concerns.
- **Rank rec:** **Tie-breaker rank 11–12**, Sprint 1+ when historical import work (US-040/041) begins. Not urgent enough for top-10 displacement.

### 4.6 GitHub MCP — ALREADY-ON-OUR-LIST

- **Classification:** Our **rank 9** (HOLD, tactical through Gitea migration). Matches Gemini's general recommendation but our stance is more nuanced: HOLD-level commitment, wrap calls in abstraction, migrate to `gitea-mcp` (our rank 10) at Sprint 1.5–2.
- **Verdict:** Aligned with caveats Gemini didn't surface. Our research is stronger here.

### 4.7 Jira MCP — DECLINE (CATEGORY-SKIP)

- **Classification:** NEW but out of scope.
- **Rationale:** Eric uses `docs/kanban.md` + `docs/roadmap.md` for project tracking. No Jira workspace in portfolio. Already implied-SKIP in our anti-list under SaaS-locked work-tracking category (Linear is explicit; Jira is the same pattern).
- **Rank rec:** Add to anti-list explicitly alongside Linear/Notion/Slack.

### 4.8 Gemini MCP (cross-model) — DECLINE

- **Classification:** NEW but fails filter.
- **License / self-host:** Community-built; calls Gemini API (SaaS, Google).
- **Composite fit:** Fails "not SaaS." Also questionable ROI — cross-model fact-checking is better served by independent evals (our `agentic-ai-evals-harness`) than by pipelining through another paid LLM API.
- **Rank rec:** Explicit SKIP. Already covered in our anti-list under "Any ChatGPT/Gemini skill bridge."

**MCP delta count:** 7 Gemini items → 1 ADD (Firecrawl), 1 CONDITIONAL-ADD (DuckDB), 2 ALREADY-ON-LIST (Brave Search, GitHub), 3 DECLINE (Supadata, Jira, Gemini MCP), 1 BORDERLINE-DECLINE (Desktop Commander).

---

## 5. Proposed top-10 revisions

### Skills top-10 (no changes)

No revisions. Gemini's skill items are capability categories, not installable skills. The one sharpening (3.2 memory segmentation) feeds an architecture open question, not a skill addition.

### MCP top-10 — one addition, one re-rank

| Action | MCP | Change | Reasoning |
|---|---|---|---|
| **ADD at rank 8** | `firecrawl` (self-hosted Apache-2.0) | Insert; bump `playwright`, `github`, `gitea-mcp` down one each | Fills URL → LLM-ready Markdown gap. Brave Search is search; Firecrawl is extraction. Different tool. Composite-fit passes on self-hosted build only. |
| **RE-RANK `playwright` to 9** | — | Was 8 | Playwright is already HOLD (Microsoft 2026 guidance: CLI over MCP, 4x token reduction). Firecrawl is a cleaner COMMIT than Playwright's HOLD. |
| **RE-RANK `github` MCP to 10** | — | Was 9 | Still HOLD through Gitea migration. Position drops by one to accommodate Firecrawl. |
| **DROP `gitea-mcp` off top-10** | — | Was 10 | Moves to tie-breaker 11. Still COMMIT (conditional on Gitea standup), but the specific sprint is farther out than Firecrawl's Sprint 1. |
| **Tie-breaker 11** | `gitea-mcp` | Added here | Unchanged commitment; just no longer in top-10 due to timing. |
| **Tie-breaker 12** | `duckdb-mcp` (OSS/self-hosted variant) | New addition | Ad-hoc analytics against local data files. Sprint 1+ when historical import work begins. |

**Anti-list additions** (to §7 of MCP assessment):

- `supadata` and similar SaaS video-transcript services — TOS risk + SaaS-locked. Alternative: `yt-dlp + Whisper` self-hosted pipeline if ever needed.
- `jira` MCP — SaaS-locked work-tracking, no Jira in stack (same reasoning as Linear).
- Gemini MCP (cross-model bridge) — SaaS API dependency, weak ROI, already implicitly covered; make explicit.
- Desktop Commander — not anti-list, but document the "filesystem + bash covers this surface" rationale as a DECLINE-NOT-SKIP entry.
- Third-party agent frameworks (LangGraph, CrewAI, AutoGen, LlamaIndex, Swarm) — from Grok turn 1. Not MCPs, but if the question recurs: DECLINE — Claude Agent SDK is the stack, adding a framework layer violates composite principle.

**Grok does NOT change the MCP top-10 rankings.** Grok's contributions are architecture-level (protocols, governance, observability conventions), not product-level. Those feed `docs/architecture.md` D27 and Sprint 0c observability, not the MCP adoption top-10.

### Architecture follow-ups triggered by Grok (not top-10 changes)

| Item | Follow-up | Priority |
|---|---|---|
| AAIF (Linux Foundation) | Update `architecture.md` D27 narrative to reflect that MCP now lives under AAIF governance. Reframes "MCP vs A2A vs AAIF" as "MCP + A2A both under AAIF stewardship." | Sprint 0c |
| OpenTelemetry GenAI conventions | Add to Sprint 0c observability decision record — adopt as default instrumentation convention for HyperDX/ClickHouse pipeline. Vendor-portable. | Sprint 0c |
| AG-UI protocol | Add a tripwire: if/when agent-driven UI updates become a requirement (coach dashboard with D19 Tier 2 streaming drafts), evaluate AG-UI vs custom WebSocket before building. | Deferred / tripwire |
| A2A canonical URLs | Cite `a2a-protocol.org` in D27 alongside existing A2A references. | Housekeeping |
| `awesome-mcp-servers` (punkpeye) | Add as a discovery-aid footnote to MCP assessment §3. Not a top-10 entry. | Housekeeping |

---

## 6. Three-way Venn — who covered what

Blind spots and strengths across the three sources. Columns: our internal assessment (IA), Gemini (G), Grok (K).

| Topic | IA | G | K | Who's strongest |
|---|---|---|---|---|
| **Portfolio-specific MCPs** (Supabase, gitea-mcp, document-cm adapter, lifting-tracker-domain-mcp, Concept/Reach4All MCPs) | ✅ | ✗ | ✗ | IA |
| **Generic dev-tool MCPs** (Desktop Commander, Firecrawl, DuckDB, Brave Search) | Partial | ✅ | ✗ | G |
| **MCP protocol spec + Registry canonical URLs** | ✅ | ✗ | ✅ | IA = K |
| **A2A protocol** | ✅ (D27) | ✗ | ✅ | IA (deeper) + K (URLs) |
| **AAIF (Linux Foundation, Dec 2025)** | ✗ | ✗ | ✅ | K only — blind spot for IA and G |
| **OpenTelemetry GenAI semantic conventions** | ✗ | ✗ | ✅ | K only — blind spot for IA and G |
| **AG-UI (agent↔UI protocol)** | ✗ | ✗ | ✅ | K only |
| **Playwright CLI-over-MCP token economics** | ✅ | ✗ | ✗ | IA only |
| **HyperDX/ClickHouse observability decision** | ✅ | ✗ | ✗ | IA only |
| **Composite-principle filter (self-host + not-SaaS + MCP-able + friction)** | ✅ | ✗ | ✗ | IA only |
| **Agentic AI frameworks (LangGraph/CrewAI/AutoGen)** | Declined (implicit) | ✗ | ✅ | K (named); IA correctly declined |
| **Token optimization / async execution** | Partial (scheduled-tasks convention) | ✅ | ✗ | Toss-up |
| **Error handling / verification loops / evals** | ✅ (rank 4) | ✅ (generic) | Partial (OTel tracing) | IA (specific) |
| **Memory / vector DB / context retention** | ✅ (pgvector + reach4all-research-mcp) | ✅ (framing) | ✗ | IA (planned) + G (framing) |
| **Video/multimedia content ingestion** | ✗ | ✅ (Supadata — declined) | ✗ | None — all paths fail filter or are out of scope |
| **Workflow chaining / state management** | ✅ (document-cm WF-003) | ✅ (generic) | ✅ (LangGraph) | IA (specific) |
| **Security / OAuth / RLS / governance** | ✅ (Supabase OAuth, managed-policy) | ✗ | Partial (AAIF) | IA (deeper) |

**Summary:** Our internal assessment is strongest on portfolio specificity and composite-principle discipline. Gemini is strongest on product-layer MCP enumeration. Grok is strongest on the protocols/governance/observability-convention layer. The three are complementary, not competitive — the overlap is narrow.

---

## 7. Unique contributions worth incorporating

### From Gemini

- **Firecrawl** — legitimate gap. Adopting at rank 8.
- **DuckDB MCP** — legitimate additive analytics tool for historical import work. Adding as tie-breaker 12.
- **"Personal vector DB" framing for memory** (§3.G2) — sharpens an open question on memory segmentation.
- **Explicit Supadata / Jira / Gemini MCP SKIP entries** — forces us to name anti-list entries we'd left implicit.

### From Grok

- **AAIF awareness + canonical URLs** — material for `docs/architecture.md` D27. MCP under AAIF governance reframes the protocol-choice discussion.
- **OpenTelemetry GenAI semantic conventions** — material for Sprint 0c observability decision. Vendor-portable instrumentation standard we should adopt as default with HyperDX/ClickHouse.
- **AG-UI protocol awareness** — tripwire for future coach dashboard work; keep a pointer but do not commit.
- **A2A canonical URLs** (`a2a-protocol.org`) — citable in D27.
- **awesome-mcp-servers (punkpeye)** — community-curation discovery aid; add as footnote to MCP assessment §3.

Everything else from either source either duplicates our list, fails the composite filter, or lives at the framework-layer we've already declined by adopting Claude Agent SDK as default.

---

## 8. Open questions / follow-up

1. **Firecrawl Railway cost spike** — headless browser pool is not cheap. Budget a cost-spike investigation during Sprint 1 standup before committing.
2. **DuckDB MCP variant selection** — multiple community variants exist. Pick one with active maintenance and 2K+ stars; document choice in `docs/reference/` follow-up.
3. **Memory architecture segmentation** (from §3.G2) — is user-preference memory separate from content-indexing pgvector, or one unified store with namespace tags? Architecture review.
4. **AAIF governance implications on D27** (Grok) — MCP, A2A, and potentially AG-UI are now under AAIF stewardship. Does adopting these protocols implicitly commit to AAIF's governance trajectory? What's our exit path if AAIF direction diverges from our needs? Flag for architecture.md D27 update.
5. **OpenTelemetry GenAI adoption for HyperDX** (Grok) — confirm ClickHouse/HyperDX side supports the OTel GenAI attribute set natively. If yes, standardize on it Sprint 0c. If no, evaluate the delta.
6. **AG-UI tripwire** (Grok) — when does a coach dashboard streaming D19 Tier 2 drafts become concrete enough to warrant an AG-UI vs custom-WebSocket evaluation? Not Sprint 0c; flag for Sprint 1-2 UI kickoff.
7. **BridgeMind video** — if `youtube-mcp-skills-research.md` lands later, re-run this delta against the primary source. Gemini's summary may have compressed away nuance.
8. **Firecrawl self-hosted auth model** — verify it plays cleanly with Claude Code MCP config before Sprint 1 commit.
9. **Explicit anti-list rewrite** — fold Supadata, Jira MCP, Gemini MCP, Desktop Commander DECLINE rationale, and Grok's framework-layer items into `mcp-servers-to-add-assessment.md` §7 in the next edit.
10. **Three-way research hygiene** — this delta synthesized two external LLM sessions with differing coverage layers. Future research sweeps should explicitly request both product-layer and protocol-layer coverage from each source to avoid the accidental stratification observed here.

---

© 2026 Eric Riutort. All rights reserved.
