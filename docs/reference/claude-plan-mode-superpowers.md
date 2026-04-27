---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
valid_as_of: 2026-04-24
re_check_by: 2026-07-23
tier: REFERENCE
content_class: research
---

# Claude Code Plan Mode and the Superpowers Plugin — Research and Adoption Decision

Research report on (a) Claude Code's native Plan Mode, (b) the obra/superpowers plugin, and (c) whether either should be adopted for XRSize4 ALL / Lifting Tracker. Scoped to what is publicly verifiable as of April 2026 and to how each option composes (or conflicts) with document-cm WF-003 and Eric's composite principle (MCP-able + self-hostable + not SaaS + AI-native friction).

---

## 1. Executive summary

- **Native Plan Mode — COMMIT.** Plan Mode is a first-party Anthropic capability, already installed, at zero marginal install cost, and semantically isomorphic to WF-003's GATE step. ExitPlanMode is a hidden tool that blocks for explicit user approval before mode transition, which is exactly the GATE contract. **Strongest reason: the ExitPlanMode approval is the cheapest possible enforcement surface for WF-003's "STOP until approved" step and can replace the "prompt Claude to pause" approach with a tool-layer gate.** Cost per invocation is marginal; the prompt-layer constraint ("you MUST NOT make any edits") plus the filtered tool manifest is a poka-yoke that matches what we already want agents to do on Architecture/Reference-class docs.

- **obra/superpowers — HOLD (pilot in Sprint 0c; decide at Sprint 0d boundary).** Superpowers is a mature MIT-licensed Claude Code plugin with very strong adoption signals (120–166K GitHub stars depending on source/time, officially accepted into Anthropic's claude-plugins-official marketplace in January 2026, v5.0.7 on 2026-03-31). It scores high on the composite principle (self-hostable, not SaaS, MIT). **Strongest reason to hold: it ships a full software development *methodology* (brainstorm → design → plan → TDD subagent execution → code review → branch finish) that materially overlaps with Book Boss + WF-003 and with our future code-cm. Adopting both methodologies simultaneously risks two competing governance disciplines in the same repo. The individual skills (writing-plans, using-git-worktrees, subagent-driven-development) are valuable in isolation; the whole pipeline may be too much.** Pilot plan in §10.2.

- **Ultraplan — REJECT for now.** Ultraplan (launched April 2026) offloads planning to a cloud Claude Code session. It fails the composite principle (SaaS, not self-hostable, requires GitHub integration, network-gated). Local Plan Mode covers the same semantic surface with no cloud dependency. Revisit if Anthropic publishes a self-hostable variant.

- **Mechanism clarification.** Plan Mode is primarily a **system-reminder prompt injection** ("you MUST NOT make any edits") plus a **tool-manifest filter** (only read-only tools + ExitPlanMode) plus a **permission-layer gate**. There is no separate model or separate inference path. This means plan mode is cheap to enter/exit and can be toggled mid-conversation without state loss — making it a low-friction fit for per-mutation workflows like WF-003.

- **Reasoner Duality alignment (D19).** The Plan Mode → ExitPlanMode → user approval sequence is a literal instantiation of our Tier 1 / Tier 2 split. Plan Mode's mandatory STOP is Tier 1 deterministic (enforced by tool-manifest + permission gate); the plan itself, and Claude's explanation of it, is Tier 2 LLM output. WF-003 Step 4 GATE is the same pattern at the doc-cm layer. These are not two competing gates — they are the same gate expressed at two layers, which strengthens the case for COMMIT.

---

## 2. Native Plan Mode — what it is

### 2.1 Definition and entry points

Plan Mode is Claude Code's read-only exploration phase. In Anthropic's docs, plan mode instructs Claude to research and propose changes without making them. Claude reads files, runs shell commands for exploration, and writes a plan — but cannot edit source, run non-readonly tools, change configs, or commit.

Entry points:

- **Interactive CLI — Shift+Tab** cycles through permission modes (`default → acceptEdits → plan`). Current mode shows in the status bar.
- **Slash command — `/plan [description]`** enters plan mode and starts analysis.
- **Startup flag — `claude --permission-mode plan`** for headless/SDK usage.
- **Web and IDE surfaces** — VS Code / Desktop / claude.ai expose a mode selector.
- **SDK — `permissionMode: "plan"`** in Claude Agent SDK agent queries.

These are different entry points to the same mechanism; not distinct implementations.

### 2.2 System prompt behavior

Plan mode is primarily **prompt-driven**, not model-swap-driven. When plan mode is active, a system-reminder block is injected into each user message. The canonical reminder (as extracted by reverse-engineered system prompts) is approximately: *"Plan mode is active. The user indicated that they do not want you to execute yet — you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system."*

This is layered with two defense-in-depth mechanisms:

1. **Tool-manifest filtering** — write tools (Edit, Write, mutation-capable Bash) are dropped from the manifest Claude sees. Only read-only tools (Read, Glob, Grep, AskUserQuestion) plus the hidden ExitPlanMode tool are available.
2. **Permission-layer gate** — even if Claude attempted a write, the permission layer would reject it.

The system prompt otherwise is unchanged. Plan mode is cheap to enter/exit because no full system-prompt rewrite or model reload occurs. This matters for per-mutation workflows where we might toggle into plan mode dozens of times per session.

### 2.3 ExitPlanMode tool mechanics

ExitPlanMode is a hidden internal tool (not listed in the normal user-facing tool manifest). Its schema per publicly extracted system prompts (Piebald-AI/claude-code-system-prompts) is:

```json
{
  "type": "object",
  "required": ["plan"],
  "properties": {
    "plan": { "type": "string", "description": "markdown plan for user approval" }
  }
}
```

Behavior:

1. Claude calls ExitPlanMode with a markdown plan payload.
2. The tool presents the plan to the user in the UI and **blocks execution** until the user explicitly approves or denies.
3. If approved → mode transitions to the previous non-plan mode (default / acceptEdits / auto), Claude proceeds with execution, and the plan remains in context.
4. If denied → Claude remains in plan mode and can revise.

ExitPlanMode is the **tool-layer embodiment of the WF-003 GATE**: both are explicit "STOP until human says proceed" mechanisms, both present a structured proposal, both refuse to proceed without affirmative approval.

Known failure modes as of April 2026: sporadic approval-flow hangs with certain MCP server configurations (GitHub issue #19623); transient context loss in remote sessions after container restart (fixed in recent changelog entries); occasional conflicting-reminder states where Claude receives both "plan mode active" and "exited plan mode" simultaneously (issue #14004).

### 2.4 Taxonomy — one mechanism, multiple surfaces

The four things that look like distinct plan-mode variants are actually the same `permission_mode: "plan"` exposed differently:

| Surface | Trigger | Scope |
|---|---|---|
| Interactive CLI | Shift+Tab | Session-wide toggle |
| `/plan` slash command | User types `/plan` | Same session-wide toggle, convenience shortcut |
| `--permission-mode plan` flag | CLI start | Entire process scoped |
| Subagent `permission_mode: plan` | `.claude/agents/*.md` YAML | Subagent-scoped only; parent unaffected |
| Plan-mode-only skills | Skill `SKILL.md` annotation | UI guardrail; same underlying gate |

This unification matters: any integration design for plan mode applies equally to all surfaces. A PreToolUse hook that checks for ExitPlanMode approval works identically whether the user used Shift+Tab or the flag.

### 2.5 Recent changes (April 2026)

- **opusplan alias.** Claude Code now supports an `opusplan` model alias that runs Opus during plan mode (for deep reasoning) and switches to Sonnet for execution. Cost-optimization pattern: plan where reasoning is load-bearing, execute where it's not.
- **xhigh reasoning effort default for plans.** Opus 4.7 introduced `xhigh` (between `high` and `max`); Claude Code defaults to `xhigh` for plans specifically. Task budgets can cap thinking-token spend (`MAX_THINKING_TOKENS`, `/effort`).
- **Ultraplan (research preview).** Offloads planning to a cloud Claude Code session running Opus with up to 30 minutes and 1M-token context. Requires Claude Code v2.1.91+, a GitHub repo, and a Claude Code on the web account. **Fails Eric's composite principle on three axes (SaaS, cloud-only, GitHub-gated); REJECT until a self-hostable variant exists.**

### 2.6 Cross-reference to `claude-code-internals-findings.md`

The internals findings doc (v2026-04-23) does not explicitly cover Plan Mode — its §Q8 covers the permission/safety model at the layer above but treats the five permission types generically. **This doc fills that gap.** Concretely:

- Internals findings §Q8 item 1 ("Built-in permission prompts. Every destructive/irreversible tool call pops a permission dialog by default") — Plan Mode is the generalization: the prompt surface is elevated from per-tool to per-plan, so instead of N prompts during execution you get 1 plan-approval prompt.
- Internals findings §Q5 (PreToolUse hooks can exit 2 with structured feedback) — ExitPlanMode complements this: it presents a plan to the human for go/no-go before execution; PreToolUse hooks enforce rules during execution. Together they bracket the action window.
- Internals findings §3.3 (compression cascade as the content-drop actor) — **Plan Mode is a countermeasure for the compression problem**. In plan mode, the model constructs a plan before tool_results age out; the plan is then the anchor for execution, providing a durable in-context summary that survives micro_compact. This reframes plan mode as not just a human-approval mechanism but a compression-resilience mechanism.

---

## 3. Superpowers — identification

| Field | Value |
|---|---|
| Canonical URL | https://github.com/obra/superpowers |
| Author | Jesse Vincent (`obra`), Prime Radiant |
| License | MIT |
| Stars (April 2026) | 120,000–165,000 range across reporting; trending in GitHub top ~20 of 2026 |
| Latest release | v5.0.7 (2026-03-31); 7 patch releases between 2026-03-11 and 2026-03-31 |
| Marketplace status | **Officially accepted into Anthropic's `claude-plugins-official` marketplace** (Jan 2026) |
| Contributors | 14+ |
| Languages | Shell, JavaScript, HTML, Python, TypeScript |

Related repos: `obra/superpowers-marketplace` (curated), `obra/superpowers-skills` (community-editable), `obra/superpowers-lab` (experimental), `obra/superpowers-chrome` (Chrome DevTools control), `obra/superpowers-developing-for-claude-code`.

**Maturity read.** Very mature. Release cadence is rapid. Marketplace acceptance is an endorsement proxy from Anthropic. 120K+ stars inside six months is a strong adoption signal. Critical reports are primarily Windows-environment hook bugs; core agent behavior is considered stable.

**Position statement.** From the repo README and Jesse Vincent's Oct 2025 announcement, paraphrased: coding agents skip straight to code without stopping to think; Superpowers imposes the discipline of a senior engineering lead — stop, think, plan, then build. Skills auto-trigger; the agent "just has Superpowers." It describes itself as "a complete software development methodology for your coding agents."

---

## 4. What Superpowers adds over native Plan Mode

Plan Mode produces one plan per toggle, ephemeral, reviewed by the user, then execution. Superpowers produces an **orchestrated pipeline** where each skill triggers the next, the plan is persisted as a file, execution happens via per-task subagents under TDD, and review gates punctuate the flow.

| Capability | Native Plan Mode | Superpowers |
|---|---|---|
| Brainstorm-first refinement before planning | no | `brainstorming` skill — Socratic refinement, saves a **design document** to disk |
| Plan persisted as on-disk artifact | no (plan lives in context) | `writing-plans` — bite-sized tasks (2–5 min each), exact file paths, complete code, verification steps |
| Git worktree isolation for plan execution | no | `using-git-worktrees` |
| Subagent-per-task execution with review | no | `subagent-driven-development`, `executing-plans` — fresh subagent per task, two-stage review (spec compliance + code quality) |
| TDD enforced against plan steps | no | `test-driven-development` — RED-GREEN-REFACTOR, "deletes code written before tests" |
| 4-phase systematic debugging | no | `systematic-debugging` (root-cause-tracing, defense-in-depth, condition-based-waiting) |
| Inter-task code review gate | no | `requesting-code-review`, `receiving-code-review` (severity-graded; critical blocks) |
| Parallel subagent dispatch | no | `dispatching-parallel-agents` |
| Branch-finish workflow | no | `finishing-a-development-branch` |
| Skill-authoring toolkit | no | `writing-skills`, `using-superpowers` |

Installation: `/plugin install superpowers@claude-plugins-official` (or add `obra/superpowers-marketplace` as a secondary marketplace). Works on Cursor, Codex CLI, OpenCode, Copilot CLI, Gemini CLI — the skills library is portable across hosts because the SKILL.md format is an open standard (see internals findings §9).

Plumbing (three integration points):

1. **SessionStart hook** — `hooks/hooks.json` with matcher `startup|resume|clear|compact` injects orientation text on every fresh context. Windows version is `run-hook.cmd`; Unix is `session-start.sh`.
2. **Skills (auto-triggered)** — each is a markdown file under the plugin's `skills/` directory. Claude Code auto-discovers and triggers based on description matching.
3. **Subagents (dynamic dispatch)** — not declared in `.claude/agents/`; spawned dynamically by skills that need them.

**It does not ship an MCP server.** This is a notable gap for our composite principle.

Known issues (April 2026, relevant to our stack):

- Windows `SessionStart` hook failures — backslash substitution in `${CLAUDE_PLUGIN_ROOT}` (issue #420), blocks terminal input (#419), blank terminal window (#292), marketplace-cache failures (Anthropic issue #31433). Not relevant for Eric's macOS-primary dev but relevant if Lifting Tracker ever runs CI on Windows agents.
- Plugin/hook discovery intermittent across Claude Code versions (#653, #773, #10373).
- `SessionStart` hook output sometimes not injected on new conversations (#10373).
- Mandatory TDD consumes more tokens and session time; users have reported 2–3× cost per task.
- Project does not accept contributions of new skills upstream; community skill innovation is in `superpowers-skills` / `superpowers-lab`, not upstream.

---

## 5. When plan-based approaches help vs hurt

Synthesized from practitioner reports (April 2026):

**Plan Mode pays off on:**

- Complex systems / legacy code / code archaeology (understand why code is the way it is before changing it).
- Multi-file refactors (practitioner heuristic: >3–5 files affected).
- Architecture-adjacent changes (new module, new dependency, schema migration).
- Unfamiliar codebases — plan mode forces an exploration phase before action.
- High-blast-radius changes (migrations, production-adjacent configs).
- Anywhere rework would cost more than the plan-mode overhead.

**Plan Mode is overkill on:**

- Typo fixes, single-function additions, one-line bug patches.
- Greenfield scaffolding without existing constraints.
- Write-a-unit-test tasks.
- Tight-loop iterative work where toggle overhead dominates task cost.

**Superpowers pays off on:**

- Feature work where TDD + code review + branch discipline are genuinely wanted.
- Teams with junior engineers or agents needing enforced structure.
- Codebases where the author wants a consistent methodology across all changes.

**Superpowers is overkill on:**

- Simple changes where the full brainstorm → design → plan → TDD → review pipeline is disproportionate.
- Doc-only edits (where TDD is nonsensical).
- Research sessions / exploration.
- Projects where the author already has a preferred methodology (e.g., document-cm's Book Boss + WF-003).

**Cost/latency signal.** With Opus 4.7 + xhigh thinking defaults, plan-mode thinking tokens are billed at 5× input pricing ($25/M on Opus 4.7). A plan-mode round for a multi-file refactor may consume 5,000–20,000 thinking tokens ≈ $0.12–$0.50 per plan, plus exploration reads. This is cheap relative to the rework cost of a wrong implementation on anything non-trivial. The threshold heuristic: **if the implementation is projected to take more than ~30 minutes of agent time, plan mode pays for itself.** Below that threshold, toggle overhead dominates.

**Interaction with extended thinking.** Plan mode and extended thinking are **complementary, not redundant**. Plan mode governs *what the agent is allowed to do*; extended thinking governs *how much the model reasons before responding*. Opus 4.7's xhigh effort level is the default inside plan mode, which is sensible — plan mode is precisely when we want more thinking. Outside plan mode, extended thinking is still useful but without the read-only safety guarantee.

**Interaction with Opus vs Sonnet vs Haiku.** The `opusplan` alias (Opus during plan, Sonnet during execution) is the default-recommended pattern. Our project's D19 Reasoner Duality aligns: Opus-in-plan is the Tier 2 explainer operating at its best; Sonnet-in-execute is the competent, cheaper workhorse. Haiku should not be used for plan mode on architecture-class work.

---

## 6. Integration with WF-003 Step 4 GATE (a.k.a. "Book Boss change map + GATE")

The user's brief refers to "WF-003 Step 5: Book Boss change map + GATE." For precision, in `source-doc-cm-design.md` v0.2.0, the canonical WF-003 steps are:

- **Step 3**: `scripts/book_boss.py build-change-map <doc> --sources <src1> <src2>` — writes `.cm/scratch/<id>-changemap.md`.
- **Step 4**: *"GATE — present the change map to the human and STOP. Do not proceed without the word 'approved.'"*
- **Step 5**: After approval, write the updated document.

The user's shorthand "Step 5: Book Boss change map + GATE" compresses Steps 3–5. I'll treat the semantic unit as "**the change map + GATE + apply block**" and answer at that level.

### 6.1 Are Plan Mode and the WF-003 GATE redundant, overlapping, or complementary?

**Complementary, at different layers. Not redundant.**

| Dimension | Book Boss change map (Step 3) | Plan Mode plan (ExitPlanMode) |
|---|---|---|
| Generation mechanism | Deterministic Python (parse baseline, parse sources, emit structured diff) | LLM-generated |
| Content form | Structured change map with section IDs, content deltas, cross-ref impacts | Freeform markdown plan |
| Tier (per D19) | Tier 1 deterministic | Tier 2 LLM explanation |
| Scope | Doc mutations only | Any mutation (doc, code, config) |
| Trigger | Operator explicitly runs workflow | Toggled via Shift+Tab / flag / slash |
| Approval surface | Human reads change map; types "approved" | Human clicks approve in ExitPlanMode dialog |

They operate at different layers. Book Boss produces the *what* (a deterministic diff of what will change); Plan Mode produces the *how* (an LLM narrative of how Claude intends to apply the change). WF-003 Step 4's "STOP until approved" is satisfied by **either** a typed "approved" or by ExitPlanMode approval — but the best design uses **both sequentially**:

1. WF-003 Step 3 produces the change map (deterministic).
2. Claude enters plan mode automatically, reads the change map, constructs an execution plan keyed to change-map items.
3. Claude calls ExitPlanMode. Human reviews **the combination**: structured change map + LLM execution plan.
4. On approval, mode exits; Claude applies the changes per WF-003 Step 5.

This sequencing is what the D19 Reasoner Duality actually looks like when operationalized: Tier 1 (Book Boss) produces an objective truth; Tier 2 (plan mode) narrates the intended action against that truth; Human is the final authority.

### 6.2 Does Plan Mode replace WF-003 Step 4?

No. Plan Mode's approval surface is generic ("approve this plan"); it does not enforce the Book Boss-specific artifact-triple (§5.5a in source-doc-cm-design.md). For Architecture-class docs, the full WF-003 triple (request / assignment / resolution) remains load-bearing. For REFERENCE-class docs (this report's class), the single-line approval suffices and Plan Mode's ExitPlanMode dialog *does* cover that case adequately.

### 6.3 Does Superpowers' `writing-plans` replace Book Boss?

No. `writing-plans` produces a plan for *code work* (bite-sized tasks, file paths, verification steps). Book Boss produces a change map for *doc mutations* (section-level deltas, cross-ref impacts, baseline preservation). Different domains; different artifact shapes. They could coexist — `writing-plans` for code changes, Book Boss for doc changes — but combining them on the same task would duplicate the planning surface.

### 6.4 Does Superpowers' `brainstorming` conflict with Book Boss?

**Potentially, yes.** `brainstorming` is a Socratic refinement step that precedes plan-writing. For doc-cm, Book Boss's input is *source documents* (usually pre-existing); the brainstorming step would either be useful (refine the change scope before Book Boss extracts) or redundant (the sources already scope the change). Pilot needed — this is a named tripwire in §11.

---

## 7. Composite principle scorecard

Scoring against Eric's composite principle: **MCP-able + self-hostable + not SaaS + AI-native friction low.**

### Native Plan Mode

| Axis | Score | Notes |
|---|---|---|
| MCP-able | N/A → HIGH | Plan Mode is a permission mode, not a tool. But ExitPlanMode is a first-class tool (JSON schema, parameter payload) and behaves like an MCP tool call. The mechanism is typed and inspectable. |
| Self-hostable | HIGH | Lives inside Claude Code's agent loop; runs locally with no external dependency. |
| Not SaaS | HIGH (local) / LOW (Ultraplan variant) | Local plan mode has no SaaS dependency. Ultraplan is cloud-only and fails this axis — **REJECT Ultraplan**. |
| AI-native friction | HIGH (low friction) | Trivial to toggle (Shift+Tab, /plan, flag); state is additive; no session restart needed. |
| **Overall** | **COMMIT (local only)** | First-party, free, zero install. |

### obra/superpowers

| Axis | Score | Notes |
|---|---|---|
| MCP-able | MEDIUM | No MCP server ships with the plugin. Skills and hooks are the integration points; they are not MCP-exposed. If we wanted MCP access (e.g., Cowork invoking Superpowers workflows), we'd need to wrap skills in an MCP shim. |
| Self-hostable | HIGH | MIT repo; plugin can be cloned / forked / pinned to a specific commit. No external service dependency. |
| Not SaaS | HIGH | No SaaS. Optional `primeradiant.com` mailing list is just a mailing list. |
| AI-native friction | HIGH (low friction) | Skills are markdown; hooks are shell. Easy for agents to read, modify, extend. Policy of not accepting upstream skill contributions pushes innovation to `superpowers-skills` (community-editable) — deliberate fork-friendly design. |
| **Overall** | **HIGH alignment overall, MCP gap** | Only blocker for COMMIT is the methodology-overlap question from §6, not the composite principle. |

### Ultraplan

| Axis | Score |
|---|---|
| MCP-able | N/A (mode, not tool) |
| Self-hostable | **LOW** (cloud-only) |
| Not SaaS | **FAIL** |
| AI-native friction | MEDIUM (requires GitHub, Claude Code on web account) |
| **Overall** | **REJECT** |

---

## 8. Adoption signal — who's using this

### Plan Mode

First-party Anthropic feature, so adoption is by default broad. Signals of *serious* use:

- Anthropic's own investment: Ultraplan launched April 2026 (dedicated product surface); `opusplan` model alias shipped; `xhigh` thinking-effort default for plans shipped with Opus 4.7.
- Armin Ronacher's December 2025 technical analysis ("What Actually Is Claude Code's Plan Mode?") — an in-depth read-through concluding plan mode is "custom prompts and system reminders." Treated by practitioners as the canonical outside-looking-in reference.
- Steve Kinney's AI Development course includes a Plan Mode module.
- ClaudeLog community docs maintain a Plan Mode mechanics page.
- HN / Medium practitioner reports consistently recommend plan mode for legacy code / architecture work / large refactors.

### Superpowers

- **Stars**: 120K+ (trending; 165,855 reported by one source at an earlier fetch). Among the top trending OSS projects of 2026.
- **Anthropic marketplace acceptance** (Jan 2026) — the strongest third-party endorsement available.
- **Hacker News** front-page multiple times: "SuperPowers: Agentic skills framework that works" (Oct 2025); "A Rave Review of Superpowers (For Claude Code)"; "Superpowers: How I'm using coding agents in October 2025" — surfaced on Simon Willison's blog.
- **Simon Willison endorsement** (Oct 2025) — substantial signal.
- **Cross-host portability** — same skills library works on Cursor, Codex CLI, OpenCode, Copilot CLI, Gemini CLI.
- **Critical voices**: at least one HN commenter reports that "eventually, Plan mode became enough and I stopped using it" — i.e., Superpowers is not universally retained once the workflow is internalized. Treat as calibration: Superpowers is scaffolding that some practitioners outgrow.

### Competing/complementary projects worth noting

- **GSD** (Get Stuff Done) — constrains execution environment; prevents context rot.
- **gstack** — models a virtual engineering team (~23 roles) for role-based governance.
- **Hermes** — similar framework lane.
- Community consensus: *"gstack thinks, GSD stabilizes, Superpowers executes"* — combine rather than choose.

---

## 9. Recommendation

### 9.1 Native Plan Mode — COMMIT

**Decision: COMMIT (local only).** Adopt Plan Mode for:

1. All ARCHITECTURE-class doc mutations (per content-class governance in source-doc-cm-design.md §3.7.1). Plan mode precedes or accompanies WF-003 Steps 3–5.
2. All REFERENCE-class doc mutations (this doc's class). Plan mode's approval surface substitutes for WF-003's full triple when the softer GATE applies.
3. All code changes touching >3 files or any D1–D24 schema table or any D14/D15/D16 invariant.
4. All migration authoring (Supabase migrations in Sprint 0c+).
5. Any change to hooks or skills (meta-change; high blast radius).

**Do NOT use Plan Mode for:**

1. Typo fixes, comment updates, whitespace normalization.
2. Single-file, single-function additions where the function is clearly bounded.
3. OPERATIONAL-class doc direct-edits (sprint-board updates, scorekeeper pings).
4. Research-session reads (already read-only; toggle adds no value).

**Strongest reason: ExitPlanMode is the cheapest tool-layer gate for our existing WF-003 GATE pattern, and the composite principle scores HIGH on every axis (for local plan mode). Zero install cost. First-party. Reasoner-Duality-aligned.**

**REJECT Ultraplan** on composite-principle grounds (cloud-only, not self-hostable). Revisit if Anthropic publishes a self-hostable variant.

### 9.2 Superpowers — HOLD (pilot Sprint 0c, decide at Sprint 0d boundary)

**Decision: HOLD pending pilot.** Superpowers scores high on composite principle and has strong adoption signals. The only blocker is methodology overlap with Book Boss + WF-003.

**Pilot criteria (Sprint 0c):**

1. Install Superpowers via `/plugin install superpowers@claude-plugins-official`.
2. Use it on two well-bounded pieces of Sprint 0c work:
   - **Pilot A**: Lifting Tracker scaffold (Expo init + Supabase client + routing shell). Apply Superpowers end-to-end.
   - **Pilot B**: One Supabase migration (D1–D24 schema subset). Apply Superpowers end-to-end.
3. **Do not** use Superpowers on any doc-cm work in Sprint 0c. Doc-cm keeps Book Boss + WF-003 unchanged for the pilot.
4. At Sprint 0d boundary, assess:
   - Did Superpowers' `brainstorming` skill conflict with or reinforce our existing decision hygiene?
   - Did `writing-plans` produce plans materially better than plain Plan Mode?
   - Did `subagent-driven-development` actually deliver its promised quality gain or did it multiply token cost without outcome improvement?
   - Is the mandatory TDD pipeline appropriate for Expo + Supabase where many tests are integration-level?

**Decision tree at Sprint 0d boundary:**

- If Pilot A + B both show clear value → **COMMIT** for code work; leave doc-cm on Book Boss.
- If only specific skills (e.g., `writing-plans`, `using-git-worktrees`) provide value → **PARTIAL COMMIT** — fork the valuable skills into Eric's own plugin, reject the rest.
- If conflicts outweigh gains → **REJECT** Superpowers; retain Plan Mode alone.

**Strongest reason to hold, not commit: the full methodology overlaps materially with Book Boss. Piloting against bounded work in Sprint 0c is cheap; choosing a methodology sight-unseen is not.**

### 9.3 Ultraplan — REJECT (for now)

Fails composite principle on SaaS + self-hostability. Local Plan Mode covers the same semantic surface. Revisit quarterly at the `re-check-by:` date.

---

## 10. Integration plan (conditional on §9 decisions)

### 10.1 Plan Mode integration — Sprint 0b (now) through Sprint 0c

**Sprint 0b (current):**

1. **Update `CLAUDE.md`** (project-level, `/Users/ericriutort/lifting-tracker/CLAUDE.md`) to add a "Plan Mode Policy" section — concise prose specifying when plan mode is required (the list in §9.1 above) and when it is skipped.

2. **Update `source-doc-cm-design.md`** to formalize plan-mode's role in WF-003. Proposed edit: insert a Step 3.5 before the existing Step 4, reading approximately: *"Enter plan mode. Claude drafts an execution plan against the change map and calls `ExitPlanMode` with the plan. Human approval on the ExitPlanMode dialog satisfies WF-003 Step 4 GATE for REFERENCE-class docs; ARCHITECTURE-class docs require the plan **plus** the full artifact triple per §5.5a."*

3. **Add a PreToolUse hook** on `Edit` / `Write` for paths under `docs/` that checks a session-scoped approval artifact (e.g., `.cm/scratch/<id>-gate-approved.flag`). If absent → exit 2 with a structured error: *"WF-003 GATE not satisfied. Enter plan mode (`/plan`) and call ExitPlanMode; the approval handler writes the gate-approved flag."* This wires the doc-cm gate to the plan-mode gate deterministically. (Hook design inherits from internals findings §Q5 pattern.)

4. **Document the model policy.** Plan mode uses `opusplan` alias by default (Opus for plan, Sonnet for execute). Update the project's model configuration accordingly.

**Sprint 0c:**

5. **Apply plan mode** to every task in §9.1's scope list. Track cost and latency in the sprint retro.

6. **Evaluate the PreToolUse hook** — does it fire cleanly; does it produce useful feedback to Claude; does it create any edit-retry loops.

### 10.2 Superpowers pilot plan — Sprint 0c

1. **Install**: `/plugin install superpowers@claude-plugins-official` on the Lifting Tracker repo only (scoped, not global).

2. **Scope the pilot** to Pilot A (Expo scaffold) and Pilot B (one Supabase migration). Record Claude session transcripts for each.

3. **Capture metrics**:
   - Token spend per pilot (Superpowers vs estimated "plain Plan Mode only" counterfactual).
   - Wall-clock time to complete.
   - Number of review-cycle iterations.
   - Explicit tripwires hit (from §11).
   - Subjective quality of deliverable vs baseline expectation.

4. **At Sprint 0d boundary**, run a structured deliverable (comparison matrix, not prose) covering the decision-tree questions in §9.2. The matrix drives the COMMIT / PARTIAL COMMIT / REJECT decision.

5. **If PARTIAL COMMIT** — identify valuable individual skills and fork them into a local Concept-specific plugin under `.claude/plugins/` (or a separate repo). Do not depend on upstream Superpowers for our canonical methodology.

### 10.3 Composition with existing primitives

- **Skills.** Plan mode composes cleanly with skills (§Q3 of internals findings). A skill can recommend entering plan mode; a skill can itself be scoped to run only when plan mode is active (Plan-mode-only skills, §2.4).
- **Hooks.** PreToolUse hooks fire orthogonally to plan mode; a `deny` in a hook blocks the action regardless of plan-mode state. The PreToolUse hook proposed in §10.1 #3 is the integration point.
- **MCP servers.** Neither plan mode nor Superpowers ships MCP. Our Supabase-mcp, expo-mcp, lifting-tracker-domain-mcp plans (per internals findings §7 application-build section) are unaffected.
- **Cowork orchestrator.** Cowork-initiated Claude Code sessions can pass `--permission-mode plan` at launch. Cowork's approval UX could route ExitPlanMode approvals back through Dispatch if a bridge is built; not needed for Sprint 0b/0c.

---

## 11. Open questions and tripwires

### 11.1 Open questions

1. **Does a PreToolUse hook that `deny`s writes until ExitPlanMode approval exists cause edit-retry loops?** If Claude receives "denied; plan mode approval required" and simply re-attempts the edit rather than toggling into plan mode, we have a deadlock. Mitigation: hook message should include an explicit instruction ("call `/plan` first"), and the retry should be capped at 2 attempts before escalating to the user.

2. **Does `readFileState` persist across plan-mode toggles?** If entering and exiting plan mode resets the read-state tracking, post-mutation verify (internals findings §3.4 #2) may require additional re-reads. Likely not, but not confirmed.

3. **Can ExitPlanMode approvals be programmatically granted (headless)?** For CI jobs that need plan-mode benefits without a human in the loop, is there a way to auto-approve an ExitPlanMode call? Unclear from current documentation. Affects whether plan mode is usable in automated CI runs of document-cm.

4. **Does Superpowers' `brainstorming` skill conflict with or reinforce Book Boss's change-map extraction?** Pilot A and B should stress this.

5. **Does Superpowers TDD enforcement apply sensibly to Expo + Supabase where many tests are integration-level (device, network)?** Mandatory TDD on offline-first mobile code is not a clean fit if unit coverage is sparse. Pilot needed.

6. **Does Superpowers' SessionStart hook play nicely with a custom SessionStart hook Eric writes for Primer replacement** (internals findings §5 mapping matrix)? Two hooks both injecting orientation content could collide.

7. **If Ultraplan becomes self-hostable**, does it change the REJECT? Quarterly re-check.

### 11.2 Tripwires

1. **Methodology collision.** Running Superpowers + Book Boss simultaneously on the same repo in the same session risks contradictory instructions to Claude (e.g., "stop and brainstorm" vs "extract change map and stop"). Tripwire: any session that both invokes Book Boss and uses `brainstorming` in the same turn should be halted and reviewed.

2. **Windows hook failures.** If CI ever runs on Windows agents, Superpowers' SessionStart hook bugs will bite. Document the macOS/Linux constraint.

3. **Cost escalation.** Superpowers + plan mode + TDD + xhigh thinking can compound to 5–10× the token cost of a plain direct edit. Tripwire: per-session token-spend alert at 3× baseline expectation.

4. **Ultraplan drift.** If Anthropic changes Ultraplan's availability (e.g., makes plan mode cloud-default), local plan mode may lose investment over time. Watch changelog; treat as a quarterly re-read.

5. **Plugin ecosystem churn.** Claude Code plugin/hook discovery has been inconsistent across versions (Superpowers issues #653, #773). A Claude Code upgrade that breaks the plugin mid-sprint is a material risk. Pin the Claude Code version in `package.json` / lockfile; upgrade deliberately.

6. **Compression-cascade interaction.** Plan mode was identified in §2.6 as a potential compression-resilience mechanism. If this hypothesis is wrong — if plan mode's plan also gets micro_compacted out — the benefit shrinks. Verify empirically during Sprint 0c pilots.

7. **Skill-authoring forks.** If we fork Superpowers skills into a local plugin, we commit to maintaining them against upstream changes. Default to *not* forking; adopt whole plugin or not at all. Only fork if we need a skill Anthropic isn't going to standardize.

---

## Sources

Access date for all sources: 2026-04-23.

### Anthropic official

- Claude Code Docs — Permission Modes: https://code.claude.com/docs/en/permission-modes
- Claude Code Docs — How Claude Code Works: https://code.claude.com/docs/en/how-claude-code-works
- Claude Code Docs — Ultraplan: https://code.claude.com/docs/en/ultraplan
- Claude Code Docs — Changelog: https://code.claude.com/docs/en/changelog
- Claude Code Docs — Model Config: https://code.claude.com/docs/en/model-config
- Claude Code Docs — Costs: https://code.claude.com/docs/en/costs
- Claude Code Docs — Hooks: https://code.claude.com/docs/en/hooks
- Claude Agent SDK — Permissions: https://platform.claude.com/docs/en/agent-sdk/permissions
- Anthropic engineering: Claude Code Auto Mode: https://www.anthropic.com/engineering/claude-code-auto-mode

### GitHub

- anthropics/claude-code CHANGELOG: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- anthropics/claude-code Issues #10373, #14004, #19623, #21468, #23279, #31433
- Piebald-AI/claude-code-system-prompts (ExitPlanMode tool description): https://github.com/Piebald-AI/claude-code-system-prompts
- obra/superpowers: https://github.com/obra/superpowers
- obra/superpowers (plugin.json): https://raw.githubusercontent.com/obra/superpowers/main/.claude-plugin/plugin.json
- obra/superpowers Issues #292, #419, #420, #653, #773
- obra/superpowers-marketplace: https://github.com/obra/superpowers-marketplace
- obra/superpowers-skills / -lab / -chrome / -developing-for-claude-code
- obra/superpowers on DeepWiki: https://deepwiki.com/obra/superpowers

### Analyses and community

- Armin Ronacher — "What Actually Is Claude Code's Plan Mode?" (Dec 2025): https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/
- Sergey Karayev (@sergeykarayev) on X — plan mode analysis: https://x.com/sergeykarayev/status/1965575615941411071
- Jesse Vincent — Superpowers release announcement (Oct 2025): https://blog.fsck.com/2025/10/09/superpowers/
- Jesse Vincent — v5.0.7 release (Mar 2026): https://blog.fsck.com/releases/2026/03/31/superpowers-v5-0-7/
- Simon Willison — Superpowers (Oct 2025): https://simonwillison.net/2025/Oct/10/superpowers/
- ClaudeLog — Plan Mode mechanics: https://claudelog.com/mechanics/plan-mode/
- Steve Kinney — Claude Code Plan Mode course module: https://stevekinney.com/courses/ai-development/claude-code-plan-mode
- BSWEN — Claude Code Plan Mode When and How (Mar 2026): https://docs.bswen.com/blog/2026-03-25-claude-code-plan-mode-guide/
- MindStudio — Ultraplan vs Local Plan Mode: https://www.mindstudio.ai/blog/claude-code-ultra-plan-vs-local-plan-mode
- MindStudio — gstack vs Superpowers vs Hermes: https://www.mindstudio.ai/blog/gstack-vs-superpowers-vs-hermes-claude-code-frameworks
- Builder.io — Superpowers plugin review: https://www.builder.io/blog/claude-code-superpowers-plugin
- Pulumi — Claude Code orchestration frameworks: https://www.pulumi.com/blog/claude-code-orchestration-frameworks/
- Medium (Dev.to) — combining Superpowers + gstack + GSD: https://dev.to/imaginex/a-claude-code-skills-stack-how-to-combine-superpowers-gstack-and-gsd-without-the-chaos-44b3
- Medium — Superpowers, GSD, and GStack explained: https://medium.com/@tentenco/superpowers-gsd-and-gstack-what-each-claude-code-framework-actually-constrains-12a1560960ad
- LLM Stats — Claude Opus 4.7 launch: https://llm-stats.com/blog/research/claude-opus-4-7-launch
- Finout — Claude Opus 4.7 pricing: https://www.finout.io/blog/claude-opus-4.7-pricing-the-real-cost-story-behind-the-unchanged-price-tag
- HN threads: https://news.ycombinator.com/item?id=47623101 ; 45547344 ; 47418626 ; 47341827 ; 47338664
- ClaudePluginHub — Superpowers: https://www.claudepluginhub.com/plugins/obra-superpowers-2
- Emelia (secondary) — Superpowers marketplace acceptance date: https://emelia.io/hub/superpowers-claude-code-framework
- Mejba Ahmed — I Tested Superpowers review: https://www.mejba.me/blog/superpowers-plugin-claude-code-review

### Internal cross-reference

- `docs/reference/claude-code-internals-findings.md` (v2026-04-23) — referenced throughout; this doc fills the Plan Mode gap at §Q8 / §Q5.
- `docs/reference/source-doc-cm-design.md` (v0.2.0) — WF-003 definition and content-class governance profiles.

---

© 2026 Eric Riutort. All rights reserved.
