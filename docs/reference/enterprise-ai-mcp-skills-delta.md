---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
valid_as_of: 2026-04-24
re_check_by: 2026-07-24
tier: REFERENCE
content_class: research
---

# Enterprise-Angled AI Research Delta — Insurance / Governance Input vs Portfolio Assessments

Cross-reference of an enterprise-flavored AI research output (pasted by Eric 2026-04-24, source unlabeled, scope: enterprise AI strategy + insurance workflows + agentic governance) against the four prior reference docs: `skills-to-add-assessment.md`, `mcp-servers-to-add-assessment.md`, `gemini-mcp-skills-delta.md`, `youtube-mcp-skills-research.md`. Goal: classify each named item on TWO axes (fit-with-research AND fit-with-Eric's-context), and decide whether the Lifting Tracker top-10s shift or whether a separate enterprise-consulting research track is warranted.

---

## 1. Executive summary

- **The input does NOT change the Lifting Tracker / XRSize4 ALL top-10 in any material way.** Of 12 named MCPs, 1 was already added at rank 8 from Gemini (Firecrawl), 1 already on list (GitHub at rank 9 HOLD), 7 are ENTERPRISE-ONLY SaaS that fail the composite principle, 1 is borderline-relevant (Docker Hub MCP — already at Q10 HOLD), 1 is novel-but-irrelevant (Cortex AI Arbitrage — crypto), and 1 (Brave Search via Phase 1) is already at rank 7. Net change: **zero**.
- **The 5 named "skills" are all CATEGORY-MISMATCH — none are installable skills.** Each maps to a capability we already cover via document-cm, D19 reasoner duality, pgvector plans, or D27 deferral. The one item with novel-product specificity is **Excalidraw** for architecture diagrams (MIT, self-hostable) — worth BUILD-or-INTEGRATE consideration as a discovery aid, NOT a top-10 entry.
- **The input is fundamentally scoped to a different Eric-context** — insurance/enterprise consulting — than the portfolio research has been. HIPAA, Salesforce, K2view, Snowflake, Jira, Slack, and AMICA/Starr are not in the Lifting Tracker / Concept / Reach4All stack. **Recommendation: do NOT over-adopt.** If Eric is standing up a separate consulting / enterprise-architect engagement track, that warrants its own research doc with its own top-10 — not contamination of the personal portfolio assessment.
- **Novel signal not in Gemini, Grok, or BridgeMind:** K2view, Vectara, Cortex AI Arbitrage, Locus/YourMemory (memory products), Excalidraw, Remotion. Of these, only **Excalidraw** survives composite-principle scrutiny for either context. The rest are SaaS-locked, vendor-specific, or domain-irrelevant.
- **Convergent signal:** Firecrawl (this input + Gemini) and GitHub MCP (this input + YouTube + Gemini + our own list) — both already incorporated. No new convergent signal emerges. The enterprise input is the most divergent of the four external sources.

---

## 2. Source provenance

- **Source:** Unlabeled AI output, pasted verbatim by Eric into Cowork on 2026-04-24. Reproduced in the originating Cowork prompt; not duplicated here. Style markers (table formatting, "Phase 1/2/3" framing, insurance-specific framing with HIPAA + AMICA + Starr Insurance, recommends "Persistent Memory" + "Policy Verification" as immediate priorities) suggest ChatGPT or an enterprise-tuned commercial LLM rather than Gemini or Grok.
- **Scope of source:** Enterprise AI strategy, insurance workflows, agentic governance. Names HIPAA + GDPR compliance, Salesforce/HubSpot CRM, Snowflake/BigQuery/K2view data fabric, LangGraph/CrewAI multi-agent frameworks, Vectara RAG-over-policy-documents, Jira/Slack workflow integration. Cites two named insurance carriers (AMICA, Starr Insurance) as competitive comparators.
- **No external citations provided in the input.** All product names presented as bare assertions. K2view, Vectara, Salesforce, Snowflake, BigQuery, Jira, Slack, GitHub, Docker, LangGraph, CrewAI, Excalidraw, Remotion, Brave Search, Firecrawl are all real, verifiable products. **Cortex AI Arbitrage** and **Locus/YourMemory** are flagged as not-independently-verified within this delta — see §6.
- **Stratification across all four external sources:**
  - YouTube/BridgeMind — vibe-coding product layer (PostHog, Sentry, Exa, Context7).
  - Gemini — generic dev-tool MCP layer (Firecrawl, DuckDB, Desktop Commander).
  - Grok — protocol/standards/governance layer (MCP, A2A, AAIF, OTel GenAI, AG-UI).
  - **This input — enterprise SaaS + insurance vertical layer** (K2view, Vectara, Salesforce, Snowflake, HIPAA workflows).
  - The four sources are nearly disjoint. This input is the most domain-specific and the least applicable to Lifting Tracker.

---

## 3. Dual-axis delta table

Axis A: ALREADY-ON-OUR-LIST (rank) / NEW-TO-OUR-LIST / CONTRADICTED / CATEGORY-MISMATCH.
Axis B: LIFTING-TRACKER-APPLICABLE / ENTERPRISE-ONLY / BOTH.

### 3.1 MCP servers (12 named)

| # | Item | Axis A — fit with research | Axis B — fit with Eric context | Disposition |
|---|---|---|---|---|
| M1 | **K2view MCP** | NEW-TO-OUR-LIST | ENTERPRISE-ONLY | DECLINE — SaaS data-fabric vendor; insurance legacy-system focus; no Lifting Tracker analog. |
| M2 | **Vectara MCP** | NEW-TO-OUR-LIST | ENTERPRISE-ONLY | DECLINE — SaaS RAG-as-a-service; policy-document RAG is enterprise-insurance-specific. Self-hosted alternative for our context = pgvector (already in three-layer plan). |
| M3 | **BigQuery MCP** | NEW-TO-OUR-LIST | ENTERPRISE-ONLY | DECLINE — Google-managed data warehouse; Eric's data tier is self-hosted Supabase Postgres (D4). |
| M4 | **Snowflake MCP** | NEW-TO-OUR-LIST | ENTERPRISE-ONLY | DECLINE — Same reasoning as BigQuery; SaaS warehouse, not in stack. |
| M5 | **Salesforce MCP** | NEW-TO-OUR-LIST | ENTERPRISE-ONLY | DECLINE — SaaS CRM; no CRM in portfolio. |
| M6 | **HubSpot MCP** | NEW-TO-OUR-LIST | ENTERPRISE-ONLY | DECLINE — Same as Salesforce. |
| M7 | **GitHub MCP** | ALREADY-ON-OUR-LIST (rank 9 HOLD) | BOTH | No change. Existing nuanced HOLD posture stands. |
| M8 | **Jira MCP** | ALREADY-ON-ANTI-LIST (per Gemini delta §4.7) | ENTERPRISE-ONLY | DECLINE confirmed. Eric uses `docs/kanban.md` not Jira. |
| M9 | **Slack MCP** | ALREADY-ON-ANTI-LIST (mcp-assessment §7) | ENTERPRISE-ONLY | DECLINE confirmed. Concept Computing stack names Mattermost not Slack. |
| M10 | **Cortex AI Arbitrage** | NEW-TO-OUR-LIST | NEITHER (crypto-focused) | SKIP — input itself acknowledges it's "crypto-focused, repurposed." Pattern reuse without product adoption; no value. |
| M11 | **Firecrawl** | ALREADY-ON-OUR-LIST (rank 8 — added via Gemini delta) | BOTH | No change. Convergent signal with Gemini is now reinforced by this input — strengthens the rank-8 commit. |
| M12 | **Brave Search** (Phase 1 mention) | ALREADY-ON-OUR-LIST (rank 7 COMMIT) | BOTH | No change. |
| M13 | **Docker Hub MCP** (Phase 3 mention) | ALREADY-ON-OUR-LIST (Q10, HOLD) | BOTH | No change. Already HOLD-Sprint-3+; this input doesn't shift the timeline. |

### 3.2 Skills (5 named)

| # | Item | Axis A | Axis B | Disposition |
|---|---|---|---|---|
| S1 | **Governance & Compliance Verification** (HIPAA / GDPR / underwriting) | CATEGORY-MISMATCH | ENTERPRISE-ONLY for HIPAA/GDPR specifics; LIFTING-TRACKER-APPLICABLE for the underlying pattern | Pattern already covered: `content-drop-detector` (rank 7), D19 Tier 2 concern log, document-cm content-class governance. HIPAA-specific policy hooks would be ENTERPRISE-ONLY add-ons. No top-10 change. |
| S2 | **Persistent Project Memory** (Locus / YourMemory) | CATEGORY-MISMATCH | BOTH (the capability) | Capability already covered by three-layer plan — `memory_type` enum (CM brief v0.3.0), pgvector tier, `reach4all-research-mcp` (Q18). Locus/YourMemory as named products: see §6, low-confidence on existence. |
| S3 | **Structured Data Synthesis** (SQL/NoSQL orchestration over Snowflake/BigQuery) | CATEGORY-MISMATCH | ENTERPRISE-ONLY at the named-stack level; LIFTING-TRACKER-APPLICABLE at the capability level | Capability already covered by Supabase MCP (rank 3) + planned `postgres` (rank 6). No top-10 change. |
| S4 | **Multi-Agent Coordination / "Manager" Skill** (LangGraph/CrewAI swarm orchestration) | CATEGORY-MISMATCH | BOTH (the capability) | Maps directly to D27 (multi-agent interop protocol, deferred Sprint 0a). Grok delta already raised this layer (AAIF, A2A, AG-UI). LangGraph/CrewAI specifically violate composite principle — Claude Agent SDK is the stack (per Grok delta §3.5.2). No top-10 change; D27 follow-up already tracked. |
| S5 | **Frontend & Diagramming** (Excalidraw / Remotion) | NEW-TO-OUR-LIST (Excalidraw); NEW-TO-OUR-LIST (Remotion) | BOTH | See §6. Excalidraw is a legitimate novel signal worth investigating as a discovery/architecture-diagram aid. Remotion is video-generation; out of scope for both contexts in current sprint horizon. |

### 3.3 Classification rollup

- MCP items: 12 total → 0 ADD, 4 ALREADY-ON-LIST (no change), 6 DECLINE-as-ENTERPRISE-ONLY-SaaS, 1 SKIP-irrelevant, 1 confirmed-anti-list.
- Skills items: 5 total → 0 named-skill ADDs, 5 CATEGORY-MISMATCH (4 already covered, 1 surfaces a novel discovery aid in Excalidraw).
- Net top-10 changes proposed for Lifting Tracker context: **zero**.

---

## 4. Convergent signals across sources

Items appearing in MULTIPLE external sources are stronger signals than any single source.

| Item | This input | Gemini | Grok | YouTube | Our list | Net |
|---|---|---|---|---|---|---|
| **Firecrawl** | ✅ (Phase 1) | ✅ (added rank 8) | ✗ | ✗ | ✅ (rank 8) | Triangulated. Rank 8 commit reinforced. |
| **GitHub MCP** | ✅ (Phase 3) | ✅ | ✗ | ✅ (Tech With Tim) | ✅ (rank 9 HOLD) | Already triangulated; HOLD posture (Gitea migration) is the load-bearing nuance no external source captured. |
| **Brave Search** | ✅ (Phase 1) | ✗ | ✗ | ✗ | ✅ (rank 7) | Two-source signal (this input + our list). Modest reinforcement. |
| **Multi-agent / orchestration** (capability) | ✅ (S4) | ✅ (G1 workflow chaining) | ✅ (LangGraph/CrewAI named) | ✅ (Subagents chapter — Tech With Tim) | ✅ (D27, Q17 concept-agent-invoker) | Strongest capability convergence. Reinforces D27 priority. |
| **Persistent memory** (capability) | ✅ (S2) | ✅ (G2) | ✗ | ✅ (Memory Architecture chapter) | ✅ (memory_type, pgvector, reach4all-research-mcp) | Three-source signal reinforces three-layer plan. |
| **Verification loops / governance** (capability) | ✅ (S1) | ✅ (G3 error handling) | Partial (OTel tracing) | ✗ | ✅ (rank 4 evals harness, rank 7 content-drop, D19) | Three-source signal reinforces evals harness (rank 4). |
| **MCP Registry / awesome-mcp-servers** | ✗ | ✗ | ✅ | ✗ | ✅ | Grok-only product layer; no shift. |

**Convergence verdict:** Every convergent signal lands on items already in our top-10 or already in the architecture (D27, three-layer memory). The enterprise input adds NO new convergent signal that would force a re-rank.

---

## 5. Items unique to the enterprise-angled input

Per-item assessment for items NOT surfaced by Gemini, Grok, or YouTube.

### 5.1 K2view MCP — DECLINE (ENTERPRISE-ONLY, SaaS, vendor-niche)

K2view is a real enterprise data-fabric vendor (k2view.com) targeting data unification across siloed legacy systems — heavy in telco, banking, insurance verticals. SaaS / on-prem-licensed; not OSS. **Composite principle: fails self-hostable (commercial license), fails not-SaaS (commercial), fails MCP-able-friction-reduction for our context (no siloed legacy systems to unify).** Strictly enterprise-consulting-context relevant.

### 5.2 Vectara MCP — DECLINE (ENTERPRISE-ONLY, SaaS)

Vectara is a real RAG-as-a-service vendor (vectara.com) with hosted semantic search and a free tier. SaaS only — no self-hosted build available as of 2026 research. **Composite principle: fails self-hostable, fails not-SaaS.** Our self-hosted analog is pgvector + Supabase + (eventually) `reach4all-research-mcp`. No Lifting Tracker need; ENTERPRISE-ONLY for insurance policy-document RAG.

### 5.3 BigQuery / Snowflake MCPs — DECLINE (ENTERPRISE-ONLY, SaaS)

Both are SaaS-managed data warehouses. Eric's stack is self-hosted Supabase Postgres on Railway (D4). No analytical-warehouse layer exists or is planned for Lifting Tracker MVP. ENTERPRISE-ONLY by definition.

### 5.4 Salesforce / HubSpot MCPs — DECLINE (ENTERPRISE-ONLY, SaaS)

Both are SaaS CRMs. No CRM in any portfolio sub-system (Lifting Tracker is coach-athlete training, not sales pipeline). ENTERPRISE-ONLY for any insurance / consulting client engagement.

### 5.5 Jira MCP — DECLINE confirmed (already on Gemini-delta anti-list)

Eric uses `docs/kanban.md` + `docs/roadmap.md` for project tracking. Already explicitly added to anti-list in Gemini delta §4.7 + §5. No further action.

### 5.6 Slack MCP — DECLINE confirmed (already on mcp-assessment anti-list)

mcp-assessment.md §7 explicitly lists Slack MCP under "SaaS-locked, no Slack workspace in portfolio." Concept Computing stack names Mattermost. ENTERPRISE-ONLY for client engagements that use Slack. No further action.

### 5.7 Cortex AI Arbitrage — SKIP (irrelevant to both contexts)

The input itself acknowledges Cortex AI Arbitrage is "crypto-focused" and only suggests it as architectural inspiration ("blueprint for high-speed scanning ... can be adapted for insurance market comparisons"). No product adoption proposed; no Lifting Tracker analog; no Eric-context cryptocurrency relevance. **Pattern-only, not product-only.** SKIP. Flagged as **novel-but-unverified** — independent existence as a discrete MCP server should not be assumed. May be a hallucinated or repurposed reference; the input source's framing ("repurposed") suggests the input itself is uncertain.

### 5.8 Phase-3 Docker Hub MCP — already covered

Already at Q10 in mcp-assessment (HOLD, Sprint 3+). This input flags it under "Phase 3 Developer Lead" alongside GitHub for "autonomous code management and deployment of agentic swarms." Our existing rationale (Railway abstracts Docker today; matters more once Concept / Fuseki containers come online) stands. **No change.**

---

## 6. Items worth investigating for BOTH contexts

Per-item assessment of items the input names that COULD apply to both Lifting Tracker AND enterprise consulting work.

### 6.1 Excalidraw (MIT, self-hostable) — INVESTIGATE as discovery/architecture-diagram aid

Excalidraw is a real, well-maintained MIT-licensed virtual whiteboard (`excalidraw/excalidraw` on GitHub, ~80K+ stars). Self-hostable as a static SPA; no backend required. A community **excalidraw-mcp-server** exists (multiple variants on GitHub as of 2026; surveyed maturity = MEDIUM, single-maintainer projects). **Composite principle: passes self-hostable, passes not-SaaS, passes MCP-able (community variant); AI-native friction reduction = clear when generating architecture diagrams from text descriptions.**

- **LIFTING-TRACKER-APPLICABLE:** Yes — generating architecture diagrams for `docs/architecture.md` from natural-language descriptions could speed D-decision visualization. Currently those decisions are text-only with no visual layer.
- **ENTERPRISE-CONSULTING-APPLICABLE:** Yes — strategy decks, reference architectures, system-of-systems diagrams all benefit.
- **Recommendation:** NOT a top-10 entry. Add as a **tie-breaker rank 13** on the MCP shortlist behind DuckDB MCP (rank 12 from Gemini delta). Investigate self-hosted excalidraw-mcp-server maturity in Sprint 1 alongside Reach4All standup. **Caveat:** community MCP variants need maintenance review before commit.

### 6.2 Remotion — INVESTIGATE for ENTERPRISE-ONLY (defer for Lifting Tracker)

Remotion is a real, MIT-licensed React-based programmatic video generation library (remotion.dev). Not an MCP server; a code library. Generating videos programmatically is meaningful for marketing / explainer / training content — likely valuable in an enterprise consulting context (client deliverables, training materials). For Lifting Tracker MVP: out of scope. **Recommendation:** flag for hypothetical enterprise-track research doc; do NOT add to Lifting Tracker shortlists.

### 6.3 Locus / YourMemory — UNVERIFIED, low-confidence

The input names "Locus/YourMemory" as concrete persistent-memory tools. Independent verification within this delta scope: **inconclusive.** "Locus" is a common product name across many domains (logistics, mapping, etc.); no obvious authoritative match for an agent-memory / Claude-skill product with that name as of 2026 research. "YourMemory" is generic enough to be a hallucinated product name. **Recommendation:** treat as unverified. Do NOT adopt without verification. Our three-layer memory plan (memory_type enum + pgvector + reach4all-research-mcp) covers the capability; named-product adoption is unnecessary unless Locus/YourMemory turn out to be real and OSS + self-hostable.

### 6.4 Firecrawl — convergent signal, already at rank 8

This input and Gemini delta both name Firecrawl. Already added at rank 8 of the MCP top-10 in Gemini delta §5. **Two-source convergence reinforces the commit.** No further re-ranking; Firecrawl stays at rank 8.

---

## 7. Proposed top-10 revisions

### 7.1 For Lifting Tracker / XRSize4 ALL context — NO CHANGES

The MCP top-10 (post-Gemini-delta) and the Skills top-10 both stand unchanged. No new ADDs, no re-ranks, no demotions triggered by this input. Only additive notes:

| Action | Item | Where it lands |
|---|---|---|
| Reinforce existing rank | Firecrawl (rank 8) | Two-source convergence (Gemini + this input) — confidence increases. No re-rank. |
| Tie-breaker addition | `excalidraw-mcp-server` (community, MIT) | Tie-breaker **rank 13** behind DuckDB MCP (rank 12). Investigate Sprint 1. Discovery aid for architecture-diagram generation; not load-bearing. |
| Anti-list additions (explicit) | K2view, Vectara, BigQuery, Snowflake, Salesforce, HubSpot MCPs | Add to mcp-assessment §7 anti-list as a "SaaS-locked enterprise vendor MCPs" cluster. Already implied; this input forces explicit naming. |
| Anti-list addition | Cortex AI Arbitrage MCP | Add as "crypto-focused, irrelevant to portfolio." |
| No skill changes | — | All 5 skill items in the input are CATEGORY-MISMATCH; capabilities already covered. |

### 7.2 For hypothetical enterprise-consulting context — separate research track warranted

If Eric is standing up consulting / enterprise-architect engagement work — particularly in insurance, healthcare, or any HIPAA/GDPR-regulated vertical — this input outlines a defensible **starting shortlist for THAT context**:

| Tier | Item | Rationale |
|---|---|---|
| Tier 1 (engagement-dependent) | Salesforce MCP | If client uses Salesforce CRM. |
| Tier 1 | HubSpot MCP | If client uses HubSpot CRM. |
| Tier 1 | Snowflake MCP **OR** BigQuery MCP | If client has cloud data warehouse. |
| Tier 1 | Slack MCP | If client communicates on Slack. |
| Tier 1 | Jira MCP | If client tracks work in Jira. |
| Tier 2 (vertical-specific) | K2view MCP | Insurance / banking / telco data-fabric integration. |
| Tier 2 | Vectara MCP | RAG over policy / underwriting documents. |
| Tier 3 (architecture content) | Excalidraw MCP | Diagram generation for client deliverables. |
| Tier 3 | Remotion | Programmatic video generation for training / explainer content. |
| Capability tier | HIPAA/GDPR/underwriting policy-verification skill (custom) | Per-engagement custom build; the capability the input named under S1. |

**These do NOT belong in the Lifting Tracker portfolio assessment.** They belong in a separate `docs/reference/enterprise-consulting-tools-assessment.md` IF Eric is building that engagement-track muscle. Recommendation in §8.

### 7.3 Architecture follow-ups (none triggered)

Unlike the Grok delta — which materially updated D27 (AAIF, A2A canonical URLs) and Sprint 0c observability (OTel GenAI conventions) — this input triggers **no architecture-doc follow-up**. The S4 multi-agent capability reinforces existing D27 deferral but doesn't change the protocol-pick options (LangGraph/CrewAI are framework-layer, already declined per Grok delta §3.5.2 logic).

---

## 8. Open questions

1. **Is Eric standing up an enterprise consulting / professional architect track distinct from the personal portfolio?** If yes, a separate `docs/reference/enterprise-consulting-tools-assessment.md` is warranted, scoped against a different composite principle (client-stack-driven, not Eric-self-hostable-driven). If no, this input is largely informational and no further action.
2. **Locus / YourMemory product verification** — are these real, OSS, self-hostable agent-memory products? If real and they meet composite principle, they may merit inclusion in a future delta. Current confidence: low. Verification cost: ~30 minutes of search.
3. **Excalidraw MCP variant selection** — multiple community excalidraw-mcp-server variants exist on GitHub. Pick one with active maintenance for the rank-13 tie-breaker before Sprint 1. Document choice in a follow-up note.
4. **HIPAA / GDPR governance skill scoping** — even within Lifting Tracker, athlete biometric/training data has privacy implications (especially if the platform later supports clinical / rehab use cases). Worth a tripwire: if Lifting Tracker's data-class scope expands beyond fitness-self-tracking, revisit HIPAA-aware governance hooks. NOT urgent.
5. **Cross-source stratification observation (carry-forward from Gemini delta §8.10):** Four external sources in 11 days, four nearly-disjoint coverage layers (vibe-coding YouTube, generic dev-tool MCPs Gemini, protocols/standards Grok, enterprise SaaS this input). Future research sweeps should explicitly request product-layer + protocol-layer + vertical-layer coverage from each source to control for accidental stratification.
6. **Source attribution of the input itself** — Eric pasted unlabeled. Worth confirming with Eric whether this came from ChatGPT, Claude, Gemini-deep-research, or a different commercial LLM, to track which sources reliably produce enterprise-flavored vs personal-portfolio-flavored output. Pattern: this input "phases" the recommendation (Phase 1/2/3) and uses a "Decision Support & Governance Stack" frame that suggests a heavily enterprise-trained system prompt or persona.
7. **Convergent-signal threshold policy** — across four sources, only Firecrawl + GitHub MCP achieved 2+-source convergence on a specific named MCP. Consider documenting a "convergent-signal-strengthens-rank" rule for the next delta: a 2+-source-named-product moves up one rank-band, all else equal. Would need explicit convention to avoid ad-hoc bumps.

---

## 9. Sources

- [Excalidraw](https://github.com/excalidraw/excalidraw) — MIT virtual whiteboard.
- [Remotion](https://www.remotion.dev/) — React-based programmatic video framework, MIT.
- [K2view](https://www.k2view.com/) — enterprise data-fabric vendor (commercial).
- [Vectara](https://www.vectara.com/) — RAG-as-a-service vendor (commercial).
- [Firecrawl](https://github.com/mendableai/firecrawl) — Apache-2.0 self-hosted build (already cited Gemini delta).
- [AMICA Mutual Insurance](https://www.amica.com/) — named comparator in input.
- [Starr Insurance](https://www.starrcompanies.com/) — named comparator in input.
- Cross-references: `docs/reference/skills-to-add-assessment.md`, `docs/reference/mcp-servers-to-add-assessment.md`, `docs/reference/gemini-mcp-skills-delta.md`, `docs/reference/youtube-mcp-skills-research.md`.

Verbatim input source: pasted by Eric into Cowork 2026-04-24; reproduced in the originating prompt, not duplicated here. Eric owns the input text.

---

© 2026 Eric Riutort. All rights reserved.
