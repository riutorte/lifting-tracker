---
author: Eric Riutort
created: 2026-04-21
updated: 2026-04-21
valid_as_of: 2026-04-21
re_check_by: 2026-07-20
tier: REFERENCE
content_class: research
---

# Best-Practices Review — Pre-Implementation

Review of external guidance against our current architecture before Sprint 0. Compiled from four sources covering Claude Code usage patterns, context engineering, tool design, agent architecture, and practitioner workflow experience. Organized to answer one question per decision: does this validate what we've decided, or does it change it?

## Sources

| # | Source | Status | Notes |
|---|---|---|---|
| 1 | YouTube — "Build & Sell with Claude Code (10+ Hour Course)", Nate Herk | Retrieved in full (20,888-segment transcript, 10.0 hrs) | Practitioner-focused. Heavy on n8n workflow automation; partial overlap with our native-app build |
| 2 | `~/Concept/anthropic_engineering_patterns_for_claude.md` | Local file, read in full | Eric's own synthesis of 21 Anthropic Engineering posts (Sep 2024 – Apr 2026); covers 12 numbered patterns |
| 3 | anthropic.com/engineering/claude-code-best-practices → docs.claude.com | Fetched in full (~31 KB text) | Authoritative Claude Code usage guide |
| 4 | anthropic.com/engineering/effective-context-engineering-for-ai-agents | Fetched in full (~22 KB text, Sep 29 2025) | Core context-budget principles |
| 5 | anthropic.com/engineering/writing-tools-for-agents | Fetched in full (~22 KB text, Sep 11 2025) | How to design tools for LLM consumption |
| 6 | resources.anthropic.com/building-effective-ai-agents | Landing page only — content gated behind a HubSpot eBook form | Not extractable via fetch. The substance is covered by source #2 items 1, 7, 12 (workflow patterns, multi-agent coordination, poka-yoke) |

## Executive summary

The four accessible sources converge strongly. Nothing we've decided is contradicted. Several decisions are explicitly validated — especially **D19 (Reasoner Duality)**, the workspace split (Dispatch for planning, Claude Code for implementation), and the offline-first + schema-complete-from-day-one stance.

**Validated (keep doing):** D19 generator-evaluator separation, D8 single-codebase Expo, D12 ontological nullability, D4 cloud as source of truth, schema completeness from day one, the project `CLAUDE.md` kept lean with pointers to `docs/`, the per-session commit discipline from the workspace rules.

**Changes / new standards we should adopt before Sprint 6:**

1. **Evaluation framework for AI features is missing.** The literature is unanimous that eval sets built on real tasks are the only reliable way to develop tool-consuming agents. D19 specifies the duality but not how we measure Tier 2 quality. Add an eval harness to Sprint 6 scope (or a Sprint 5.5).
2. **Tool-design standard for Edge Functions.** Our Supabase Edge Functions that call the LLM need to be designed as *tools to be called by an agent*, not as REST endpoints. Token efficiency, natural-language identifiers, consolidation of multi-step operations, `response_format` enum. Draft `docs/reference/tool-design-standards.md` before Sprint 6 begins.
3. **Context strategy for the NL workout parser.** The full exercise ontology (~400+ entries and growing) cannot be stuffed into every parse call. Adopt just-in-time retrieval with lightweight identifiers (name + family + disambiguator) and an agentic lookup step. This should be called out in D19 or a follow-on decision.
4. **Memory pattern for athlete context.** When coach-AI summaries ship (v2), athlete history belongs in the memory tool (file-backed, outside context window), not in the prompt. Note in roadmap now so the data layer is ready.
5. **Compaction policy for long coaching sessions.** Define what survives a compact: active program, open recommendations, unresolved flags. Define what gets discarded: raw tool outputs, redundant history. Not needed for MVP but should be drafted when D19 is extended.

**No changes required for MVP Sprint 0–5.** The above gaps all concern Sprint 6+ AI features.

## Findings by source

### Source 1 — Nate Herk 10-hour course

Signal density is mixed. The course is practitioner-heavy and oriented toward n8n workflow automation (turning existing workflows into web apps), which is tangential to our native-mobile build. But there's solid Claude Code usage discipline worth capturing.

High-signal takeaways relevant to us:

- **WAT framework** (Workflows–Agents–Tools): workflows orchestrate, agents reason, tools execute. Matches the brain-hands separation from Anthropic's harness literature.
- **`CLAUDE.md` under ~200 lines, treated as a table of contents.** "Not a know-it-all file, it's a 'I know where everything I need to find lives' file." Route out to per-domain files; don't stuff. Our project `CLAUDE.md` is already ~90 lines and follows this pattern.
- **Model strategy:** Sonnet for 80% of work, switch to Opus for complex architecture decisions or tricky bugs. Our current Dispatch sessions have been on Opus, which aligns with the "architecture decisions" branch.
- **Context management commands:** `/context` to visualize token budget, `/compact` (optionally with instructions) to summarize and continue, `/clear` between unrelated tasks, `/rewind` for undo. MCP servers are explicitly called out as token-heavy — audit periodically and prune unused ones.
- **Settings hierarchy:** local (`.claude/settings.local.json`) > project (`.claude/settings.json`) > global (`~/.claude/settings.json`). Most-specific wins.
- **Handoff docs before `/clear`.** Write a temporary or permanent summary file of what you were doing, then clear. The new session picks up from the file. This is the same pattern as our Concept project's session-report discipline.
- **Parallel sessions: 3–4 max.** More than that and you lose awareness of each session's context state; context rot starts quietly degrading outputs you're no longer double-checking.
- **Sub-agents for isolated tasks.** File-heavy investigations go to sub-agents in separate context windows; main context stays clean for implementation.

Not applicable to us:

- The entire "turn n8n workflow into a web app" thread.
- Most of the "executive assistant" build (personal productivity, not coach-client app).
- The "monetize this knowledge" chapter.

### Source 2 — `~/Concept/anthropic_engineering_patterns_for_claude.md`

This is already a high-quality synthesis of 21 Anthropic Engineering posts. The 12 numbered patterns are load-bearing; I won't re-summarize, only flag the ones most relevant to our next six months of work:

- **#1 Workflow patterns.** Chain, Route, Parallel, Orchestrator-Workers, Evaluator-Optimizer, Autonomous Agent. Our Sprint 0–5 is implementation work (chain with gates). Sprint 6's NL parser and summary generator are generator → Tier-1 verifier → generator (Evaluator-Optimizer).
- **#2 Context engineering.** Already reflected in our `CLAUDE.md` discipline. Add "put most important instructions first and last" as an explicit convention.
- **#3 Verification.** "The single highest-leverage thing." For the lifting app: every AI feature must have a verification criterion *before* we ship it. Tier 1 deterministic output is the natural verifier for Tier 2.
- **#7 Multi-agent coordination.** Orchestrator-worker is the right shape for future batch work (coach weekly summaries across all clients, once that ships).
- **#8 Long-running session management.** We already follow this between Dispatch sessions (this `dispatch-handoff.md` file exists exactly for that reason). Note for Claude Code sessions too: each Sprint's Claude Code task should end with a handoff note to the next.
- **#9 Generator-evaluator separation.** This is the structural argument for D19's Reasoner Duality. Write generator and verifier as separate modules; never let the LLM evaluate its own Tier 2 output without Tier 1 in the loop.
- **#10 Brain-hands separation.** Maps cleanly to our Supabase Edge Functions layer: Edge Functions are "hands" (deterministic execution), the Anthropic API call from inside them is the "brain." Keep interfaces stable.
- **#12 Poka-yoke.** Fail loudly with guidance, never silently. Relevant for Edge Function error responses — a `{ error: "something went wrong" }` is a poka-yoke failure. Return specific, actionable errors the next agent call can act on.

### Source 3 — Claude Code Best Practices

Most of this validates Claude Code usage patterns we've already adopted. New points worth capturing:

- **"Give Claude a way to verify its work" is named the single highest-leverage thing.** For this project: tests + lint + typecheck + a visible simulator/preview for UI work. Sprint 0 should set all of these up before any feature code lands.
- **Explore → Plan → Execute.** Plan Mode is the right default for multi-file changes or anything we haven't seen before. Skip it for one-line fixes where we could describe the diff in one sentence.
- **`CLAUDE.md` — what to include vs. exclude.** Bash/build commands, repo etiquette, architectural decisions specific to the project, gotchas and non-obvious behavior, env-var quirks. **Exclude** things Claude already knows, standard language conventions, obvious reminders, API docs that should be linked, file-by-file descriptions, information that changes frequently. We're already largely compliant; the one thing to watch is that every material `docs/architecture.md` decision that constrains implementation needs a one-liner pointer in `CLAUDE.md`.
- **Subagents** for file-heavy investigations. "Use subagents to investigate how our auth system handles token refresh and whether we have existing OAuth utilities I should reuse." Keeps main context clean.
- **Non-interactive mode** (`claude -p`) for batch operations. Relevant for the data merge task — the stuck `merge_2026-04-14.txt` merge could be a `claude -p` one-shot rather than an interactive session.
- **Writer/Reviewer pattern** using two sessions. Session A implements. Session B, with fresh context, reviews. Useful for security-sensitive code (auth flow, Supabase RLS policies in Sprint 2).
- **Auto mode** with classifier-gated permissions. Safe default for routine implementation work.
- **Five named failure patterns to watch for:** kitchen-sink session, correcting over and over, over-specified CLAUDE.md, trust-then-verify gap, infinite exploration. All have explicit remedies.

### Source 4 — Effective Context Engineering (Sep 29 2025)

This is the deepest-cutting source for our AI layer design.

- **Context is a finite resource with diminishing marginal returns.** The "attention budget" framing is the operational model. Every token costs attention.
- **Context rot** is empirically real across all models: as tokens in the window increase, recall accuracy decreases. This is not a bug to be fixed by larger context windows; it's an architectural property of transformers (n² pairwise attention, training distribution skewed to shorter sequences).
- **System prompts at "the right altitude."** Goldilocks zone between brittle if-else hardcoding and vague high-level guidance. Organize with XML tags or Markdown headers. Start minimal with the strongest available model, add only based on observed failure modes.
- **Just-in-time context retrieval.** This is the major shift. Agents maintain lightweight identifiers (file paths, stored queries, URLs) and load data on demand via tools, rather than pre-loading everything. Mirrors human cognition — we use file systems and bookmarks, not total recall.
- **Hybrid strategies** (some pre-loaded, some agentic retrieval) work best for domains with some stable context and some dynamic. Our lifting app is this shape: exercise ontology is mostly stable (pre-load a pruned subset), athlete history is dynamic (agentic lookup).
- **Long-horizon techniques:** (1) **Compaction** — summarize and restart, preserving architectural decisions, unresolved bugs, implementation details; discard redundant tool outputs. Tune for recall first, then improve precision. Tool-result clearing is the "safest, lightest-touch" form. (2) **Structured note-taking** — the agent writes notes to a file outside context, pulls them back in on demand. Anthropic's file-based memory tool is now in public beta on the Developer Platform. (3) **Sub-agent architectures** — each sub-agent gets its own context window; returns a 1–2K token distilled summary.
- **Tool consolidation.** One of the most common failure modes is bloated tool sets with ambiguous decision points. "If a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better." Curate minimal viable tool sets.

Direct quotes worth citing:

> "Good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome."

> "Do the simplest thing that works."

### Source 5 — Writing Tools for Agents (Sep 11 2025)

- **Tools are contracts between deterministic systems and non-deterministic agents.** Don't write them the way you'd write an API for another developer. Design them for agents.
- **Don't wrap existing API endpoints one-to-one.** Consolidate: `schedule_event` beats `list_users` + `list_events` + `create_event`. `search_logs` beats `read_logs`. `get_customer_context` beats three separate calls. This is about token efficiency *and* reducing the "which tool?" decision surface.
- **Namespacing matters.** `asana_search` / `jira_search` separates by service; `asana_projects_search` / `asana_users_search` separates by resource. The choice measurably affects evaluation scores. Pick based on evals, not theory.
- **Return meaningful context, not raw API shapes.** Prefer `name`, `image_url`, `file_type` over `uuid`, `256px_image_url`, `mime_type`. Natural-language identifiers beat cryptic UUIDs for LLM precision; consider a 0-indexed ID scheme if UUIDs are unavoidable.
- **`response_format` enum** (`"concise"` vs `"detailed"`) gives the agent control over verbosity. Slack tool example: 72 tokens vs 206 tokens for the same underlying data.
- **Token efficiency:** pagination, range selection, filtering, truncation with sensible defaults. Claude Code caps tool responses at 25,000 tokens by default.
- **Error responses are agent-facing prompts, not logs.** A helpful error tells the agent what to do differently. An unhelpful error is a traceback.
- **Tool descriptions — "think new-hire."** Make implicit context explicit. Unambiguous parameter names: `user_id` not `user`. Strict data models enforced at the boundary.
- **Evaluation is the forcing function.** Run evals with real-world tasks and realistic data (not toy sandboxes). Tasks should often require dozens of tool calls. Collect accuracy, runtime, tool-call count, token consumption, and errors. Let agents analyze their own transcripts to suggest improvements — this is how Anthropic produced most of the recommendations in the post.

Direct quote worth citing:

> "Effective tools are intentionally and clearly defined, use agent context judiciously, can be combined together in diverse workflows, and enable agents to intuitively solve real-world tasks."

### Source 6 — Building Effective AI Agents (gated eBook)

URL is a HubSpot landing page. Actual content is gated behind a lead-capture form. The eBook's positioning mentions single-agent designs, multi-agent orchestration, agentic workflows, sequential/parallel/evaluator-optimizer patterns, and a decision framework for matching complexity to business value.

The substantive content overlaps with source #2's pattern #1 (six workflow patterns), #7 (multi-agent coordination), and the earlier public Anthropic post "Building Effective AI Agents" (which source #2 is distilled from). Treat this source as covered.

Action: if Eric wants the eBook's specifics, submit the form and save the PDF to `docs/reference/`. Not required for current planning.

## Alignment matrix — our decisions vs. best practices

| Decision | Verdict | Notes |
|---|---|---|
| D1 entry + analysis equally | Validated | Orthogonal to best-practices content |
| D2 per-set granularity | Validated | Orthogonal |
| D3 hierarchical RBAC | Validated | Orthogonal |
| D4 cloud as source of truth | Validated | Matches "files > memory, authoritative sources named explicitly" principle |
| D5–D7 MVP athlete-first | Validated | "Do the simplest thing that works" |
| D8 Expo + Supabase | Validated | Single-codebase posture reduces surface area |
| D9–D11 ontology/variations | Validated | Orthogonal |
| D12 ontological nullability | Validated | Matches just-in-time retrieval pattern — structure is declared but not forced |
| D13 units per-user | Validated | Orthogonal |
| D14 per-implement weight | Validated | Orthogonal |
| D15 limb configuration | Validated | Orthogonal |
| D16 rest cascade | Validated | Orthogonal |
| D17 set grouping | Validated | Orthogonal |
| D18 offline-first | Validated | Aligns with "cache locally, sync on reconnect" — the sync queue *is* a structured note-taking pattern for the network boundary |
| **D19 Reasoner Duality** | **Strongly validated, needs extension** | See gaps below |
| D20 watch/wearables deferred | Validated | Orthogonal |
| D21 goals | Validated | Orthogonal |
| D22 biometric placeholder | Validated | Orthogonal |
| D23 progress photos | Validated | Orthogonal |
| D24 instructional content | Validated | Orthogonal |

## Gaps — proposed updates

### Gap 1: D19 should name the context strategy

D19 defines the two tiers and the Authority Rule but doesn't specify *how* context is managed for Tier 2. Proposed addition (a new paragraph inside D19 or a D19.1):

> **Context strategy (Tier 2).** Tier 2 calls use just-in-time retrieval for domain data. The system prompt carries only the minimal ontology slice needed for the specific call (e.g., exercise family resolution carries the family taxonomy, not all exercises). Athlete history is passed by reference (session IDs, date ranges) and fetched by tool call when needed. For long-running coaching interactions, conversation state is compacted with explicit preservation rules: active program, open recommendations, and unresolved flags survive; raw tool outputs and redundant context do not.

### Gap 2: Evaluation harness missing from roadmap

Sprint 6 should not be "build the NL parser"; it should be "build the NL parser **and its eval set**." Proposed roadmap edit:

- Add Sprint 5.5 or split Sprint 6 into 6a (eval harness + ground-truth corpus from `combined_workout_log.txt`) and 6b (parser + session summaries against the eval set).
- Held-out test set discipline: never tune against the same prompts used for evaluation.
- Metrics to capture: parse accuracy, tool-call count, token consumption per call, error rate by error type.

### Gap 3: Tool-design standard for Edge Functions

Before Sprint 6, draft `docs/reference/tool-design-standards.md` covering:

- Naming convention (prefix or suffix? pick one; test on evals)
- Parameter naming rules (unambiguous, `_id` suffix for identifiers, strict data models)
- Response shape defaults (`response_format` enum, token caps, pagination)
- Error response format (agent-facing, actionable)
- When to consolidate vs. split (the `schedule_event` principle)
- When to wrap an existing API vs. build a new tool

### Gap 4: Memory tool pattern for athlete context

Not an MVP concern, but flag in `docs/roadmap.md` post-MVP backlog: when coach-AI summaries ship, athlete context (goals, injuries, recent milestones, active program) uses the Anthropic memory tool pattern — file-backed, loaded on demand, not packed into the system prompt.

### Gap 5: Failure patterns listed as explicit anti-patterns

Anthropic's five named failure patterns should be called out in `CLAUDE.md` or a lightweight `docs/reference/working-with-claude-code.md`, so every Claude Code session inherits the guardrails:

- Kitchen-sink session → `/clear` between unrelated tasks
- Correcting twice on same issue → `/clear` and restart with better prompt
- Over-specified `CLAUDE.md` → prune ruthlessly
- Trust-then-verify gap → always provide verification
- Infinite exploration → scope investigations narrowly or delegate to subagents

## Recommendations by sprint

**Sprint 0 (local dev + schema):**

- Set up Jest + React Native Testing Library, ESLint, Prettier, TypeScript typecheck. Verification infrastructure first.
- Draft `docs/reference/tool-design-standards.md` skeleton even if empty — reserve the slot.
- Confirm `CLAUDE.md` audit: every material `docs/architecture.md` constraint that touches implementation has a one-liner pointer in the project `CLAUDE.md`.

**Sprint 1–2 (auth + exercise library + session CRUD):**

- Writer/Reviewer pattern for Supabase RLS policies (two sessions, fresh context for review).
- End every Claude Code task with a handoff note. Session summary plus state of tests/lint.

**Sprint 3–5 (session views, analytics, offline sync):**

- Sub-agents for any cross-cutting investigation (e.g., "where do we touch the sync queue from?").
- No Tier 2 AI integration in these sprints.

**Sprint 6 (AI features):**

- Split into 6a (eval harness + corpus) and 6b (parser + summaries).
- Design Edge Functions using tool-design standards from Sprint 0's doc.
- NL parser uses just-in-time exercise lookup, not pre-loaded ontology.
- Session summary generator has Tier 1 volume/1RM/PR computations as grounding; Tier 2 only narrates.
- Every AI output tagged with model ID, Tier 1 inputs, and user-confirmation state (per D19).

---

© 2026 Eric Riutort. All rights reserved.
