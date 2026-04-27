---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# Claude Code Internals — Findings from Publicly-Available Analysis

Delta-focused research report on what publicly-reverse-engineered Claude Code source reveals about primitives we interact with daily, aimed at informing: the content-drop problem, document-cm skill v0.3.0, code-cm design, the 16-agent Concept refactor, CLAUDE.md hierarchy handling, Lifting Tracker build process, and engineering-process pattern reuse. Scoped to what goes beyond what Anthropic publishes at docs.claude.com and code.claude.com.

---

## 1. Executive summary

- **Claude Code enforces Read-before-Write with three error codes and a double staleness check. Content drops cannot originate in the tool layer; they must originate in Claude's construction of `new_string` or `content` while its in-context representation of the file is degraded — the compression layer is the suspect, not the write layer.** This reframes the document-cm design: validation against a disk-truth snapshot (not Claude's remembered content) is the only reliable defense.

- **Read's 256 KB / 25,000-token cap throws `MaxFileReadTokenExceededError` rather than truncating** (a truncation implementation was reverted in issue #21841, Mar 2026). For any architecture doc over ~25K tokens Claude cannot Write-overwrite at all — only Edit works. That converts the "long-doc-write" pattern into a "long-doc-edit-series" pattern with entirely different failure surface.

- **The three-layer context-compression cascade (micro_compact / auto_compact / manual compact) is the hidden actor in long-horizon sessions.** Every turn, `micro_compact` silently replaces tool_results older than `KEEP_RECENT` with `[Previous: used {tool_name}]` placeholders. The model never sees that its file-content memory has been evicted. This is the mechanistic story behind "Claude dropped content on the 12th doc update."

- **Skills resolve by three-level progressive disclosure: metadata (always in context) → SKILL.md body (loaded on trigger) → bundled resources (loaded on demand).** The teaching implementation confirms a straightforward `SkillLoader` pattern: rglob for `SKILL.md`, YAML frontmatter parse, directory name as identifier, descriptions injected into system prompt at boot. Combined with Claude Code's hook and task-graph primitives, 9 of Eric's 16 Concept agents can be replaced outright; 5 stay as deterministic Python tools (exposed via MCP); 2 stay as skills/workflows (details in §5).

- **CLAUDE.md hierarchy is explicitly ordered: Managed Policy (server-managed > MDM/OS > file-based > HKCU registry) > User (`~/.claude/`) > Project (`./CLAUDE.md`) > Directory walk-up > `@import` > `CLAUDE.local.md` > `.claude/rules/`. "More specific wins within a tier; managed always wins across tiers."** There is no runtime conflict-resolution engine — precedence is document-order concatenation into the system prompt. Policy enforcement is read-time, not execution-time. Eric's CC-017 ("principles not enforced at execution time") is a correct diagnosis of this gap — the hierarchy only governs WHAT Claude sees at session start, not WHAT Claude is allowed to do mid-session. Hooks fill that role.

---

## 2. Sources

| Source | Access date | Credibility | Copyright posture |
|---|---|---|---|
| shareAI-lab/analysis_claude_code (repo redirects to `learn-claude-code`) | 2026-04-23 | HIGH — structured teaching reconstruction, explicit scope disclosure on what is simplified/omitted | Teaching pseudocode, MIT license, not verbatim source |
| markdown.engineering Lesson 18 (File Tools: Read, Write, Edit) | 2026-04-23 | HIGH — author states course built from 1,902 leaked source files; content matches public behavior exactly, cites specific GrowthBook flag names and issue numbers | Short technical excerpts paraphrased; longer verbatim reproductions avoided |
| Claude Code public docs — code.claude.com and platform.claude.com | 2026-04-23 | HIGH — authoritative but describes behavior, not internals | Public |
| DeepWiki mirror of anthropics/claude-code and related repos | 2026-04-23 | MED — generated summaries, occasionally stale | Paraphrased |
| Anthropic engineering posts (Agent Skills, Context Engineering) | already in Eric's corpus | HIGH | Public |
| dnakov/claude-code-reverse-engineered | 2026-04-23 | — | Repo returned 404; either renamed, deleted, or DMCA'd |
| Claude share URL `abf45918` (primary task input) | 2026-04-23 | LOW for internals | Session rendered successfully via Chrome+JS; content is governance-discipline (CLAUDE_CODING, WorkflowIndex, Reporter skip — Apr 4, 2026), not Claude Code internals. Corroborates prior research in `april-10-session-analysis.md`; does not add internals findings. Mentions `claw-code` at `github.com/instructkr/claw-code` and speculative "KAIROS mode" / March-31 npm leak claims — the latter specifics appear to be model hallucinations from that session's web search and are not corroborated |

Copyright discipline applied throughout: no large verbatim code listings from deobfuscated source, short attributed quotes held under 15 words, architectural patterns described in paraphrase.

---

## 3. Content-drop investigation

The biggest open problem. Prior research (`april-10-session-analysis.md`) logs it as pattern #1 across 10+ sessions. This section traces the drop to its mechanical root.

### 3.1 The tool layer is not the culprit

Write enforces a three-phase contract — Read the file → `validateInput()` checks `readFileState` → `call()` runs the staleness check again synchronously inside the atomic critical section — and returns one of three distinct error codes (`2` no read / partial read, `3` file modified after read, `9` on Edit for multiple matches without `replace_all`). Partial reads are tagged `isPartialView: true` and explicitly rejected by Write. On Windows, Write falls back to content comparison for full reads because mtime alone is unreliable under cloud-sync and antivirus. Trailing whitespace on `new_string` is stripped, except on `.md`/`.mdx` where two trailing spaces means Markdown hard line break and stripping would silently change semantics. Line endings are forced to LF regardless of the existing file — a prior "preserve line endings" approach was removed because it silently corrupted bash scripts. Quote normalization in Edit (`findActualString()` / `preserveQuoteStyle()` — uses `/\p{L}/u` for contraction detection) preserves curly quotes in the file even when Claude types straight ASCII in `old_string`. The staleness check runs twice — once pre-permission in `validateInput`, once inside the atomic synchronous `call()` — to close the race between permission prompt and actual write.

None of that leaks content. If a content drop ships, the drop happened before the tool call.

### 3.2 Read's token cap throws, doesn't truncate

Read enforces a **25,000-token** default cap (memoized first-call; env var `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` and GrowthBook flag `tengu_amber_wren` can override; limit precedence is env > GrowthBook > hardcoded, with invalid values falling through to defaults). A two-stage gate uses a fast rough estimate first; only if the estimate exceeds ¼ of the cap does an exact API-based token count fire. A **256 KB size gate** runs before the read. Over-cap files throw `MaxFileReadTokenExceededError` — not truncate. The truncation path was implemented, tested, and reverted in issue `#21841` (Mar 2026) because a truncated read returned ~25K tokens of useless content while a throw returns ~100 bytes. Issue closure logic: better to fail cheap than pollute context with partial content the model can't use.

**Consequence for long docs:** any architecture doc beyond ~25K tokens (roughly 18–20K words of prose — `source-doc-cm-design.md` at 1,607 lines is above this by Eric's own measure; `architecture_v0.4.0.md`, `themes-epics-features_v0.2.0.md`, `user-stories_v0.2.0.md` are all candidates) **cannot be read in one call**. The workflow becomes: read offset 0–N, operate, read offset N–2N, operate, etc. Partial reads set `isPartialView: true` — and partial reads cannot satisfy Write's preconditions. So for these docs, Write is effectively unavailable; only Edit works. This changes the Claude behavior profile: on long docs, Claude is forced into a chain of surgical Edit calls rather than whole-file Writes, which means Claude is operating on a mental composite of (partial-read content + prior-edit memory) rather than any single source of truth.

### 3.3 The compression cascade is the likely actor

Three layers, increasing aggressiveness:

- **Layer 1 — micro_compact.** Runs silently on every turn before the LLM call. Walks `messages[]`, finds all tool_result parts older than `KEEP_RECENT` turns, rewrites their `content` to `[Previous: used {tool_name}]` (only if the current content length > 100). The model is not notified.
- **Layer 2 — auto_compact.** Fires when estimated tokens exceed a threshold (50,000 in the teaching impl; production Claude Code likely higher and experiment-gated). Writes full `messages[]` as JSONL to `.transcripts/transcript_{ts}.jsonl` then issues a separate LLM call asking for a continuity summary; `messages[:]` is replaced with a single `[Compressed]\n\n{summary}` user message.
- **Layer 3 — manual compact tool.** Same summarization, triggered by the agent calling the `compact` tool.

Transcripts preserve on-disk history for forensic recovery. But the in-context representation the model operates on is the summary — not the original tool_results.

**The content-drop mechanism, reconstructed.** Session turn N: Claude reads `source-doc-cm-design.md` with offset 0, limit 800; gets lines 1–800 stored in readFileState. Turn N+K: Claude does a round of analysis and minor edits elsewhere. Turn N+K+M: `micro_compact` has replaced that 800-line tool_result with `[Previous: used Read]`. Claude's active context no longer contains the actual prose. But `readFileState` still shows a valid Read entry for that file at offset 0, limit 800, with `isPartialView: true` — so Write would still reject. Claude instead uses Edit. The Edit `old_string` is constructed from Claude's memory-of-the-document, not from the compressed-out tool_result. Claude believes it is reproducing section 5.2 faithfully; it reproduces section 5.2 *as compressed by whatever summary was in scope* plus model-internal paraphrase filler. The Edit call succeeds (old_string matches because Claude's memory happens to preserve enough to match; if it didn't match, Edit would error, which is the other visible failure mode). The new_string includes the paraphrase drift. **Content was not dropped — it was paraphrased by the model's reconstruction-from-memory, and the tool layer had no way to catch it because the Edit succeeded cleanly.**

This also explains the asymmetry Eric has observed: content drops correlate with session length and with number-of-prior-reads, not with file size alone. Fresh session → full read → write succeeds. Long session → earlier read compressed → Edit on paraphrased memory → drift.

### 3.4 What this implies for document-cm v0.3.0

Four concrete design deltas, tagged to this finding:

1. **Force a fresh Read immediately before every Edit/Write within document-cm workflows.** `Book Boss` or its successor skill should wrap edit operations in a mandatory pre-read step that produces a fresh `readFileState` entry within the same turn. Cost: one extra Read per mutation. Benefit: eliminates the paraphrase-from-memory vector entirely.
2. **After every mutation, re-Read and diff against a pre-mutation snapshot. Flag the diff if it extends beyond the expected edit region.** This is the structured-deliverable discipline Eric already enforces for comparison work (from global CLAUDE.md), applied programmatically to mutations. Produces a change-log row per edit, which Doc Librarian can consume.
3. **Never issue Write on a doc over 20,000 tokens.** Pre-flight check on content length; on overflow, refuse and route to a plan-then-Edit workflow. Turns an undiagnosable content-drop into a deterministic plan-gate failure.
4. **Archive a baseline snapshot at session start.** Before any mutation in a session, a snapshot goes to `.document-cm/snapshots/{doc}_{session}.md`. Recovery from a content-drop becomes `diff snapshot current` and a manual restore. Complements the built-in `.transcripts/` recovery.

---

## 4. Findings by question

### Q1 — Document write mechanics (content-drop tagged)

Covered in §3. Summary of mechanisms not in §3:

- **`readFileState` is keyed on full path and includes `{content, timestamp, offset, limit}`.** Edit and Write also *update* `readFileState` after success so a subsequent Write in the same turn doesn't re-trigger a staleness error. But they write with `offset: undefined` — this is why Read's dedup mechanism (see Q3-adjacent below) skips those entries: it only dedups reads that originated from actual Read calls.
- **Dedup:** ~18% of Read calls hit the same file+range again. A stub message (under 200 bytes) replaces the full content when mtime matches. GrowthBook killswitch `tengu_read_dedup_killswitch` can disable the behavior. Implication for us: when composing document-cm workflows, don't rely on re-reading as a "refresh" — if nothing changed on disk, the tool returns a stub and Claude still operates on the (possibly compressed) prior content.
- **On-write side-effects:** LSP `didChange`+`didSave` fire, VSCode diff panel refreshes, a path-match against `/CLAUDE.md` logs telemetry (`tengu_write_claudemd`), and skill discovery re-runs fire-and-forget. For document-cm, the skill-discovery side-effect means writing a new `SKILL.md` should be picked up within the same session without a restart.
- **Desanitization table in Edit.** If an exact `old_string` match fails, Edit retries against a desanitized version — the API sanitizes XML-like tokens (`<function_results>` → `<fnr>`, `<name>` → `<n>`, `<output>` → `<o>`, `<error>` → `<e>`, `\n\nHuman:` → `\n\nH:`, `\n\nAssistant:` → `\n\nA:`) to prevent prompt injection through tool outputs. Same map is applied to `new_string` for consistency. Implication for document-cm: content that literally contains `<function_results>` or `\n\nHuman:` in prose (which our doc-CM specs will, because they document agent behavior) can trigger this path. The desanitization should be invisible to us, but if an Edit call is failing on what looks like a correct old_string, this is the likely reason.

*Tags: content-drop, document-cm, code-cm.*

### Q2 — CLAUDE.md hierarchy and memory

Precedence order, documented explicitly in Claude Code docs and community references:

1. **Managed Policy** (IT/security-enforced, highest, cannot be overridden).  
   Within the managed tier: server-managed > MDM/OS-level > file-based (`managed-settings.d/*.json`, `managed-settings.json`) > HKCU registry (Windows only).  
   Canonical paths: macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux/WSL `/etc/claude-code/CLAUDE.md`.
2. **User-level** `~/.claude/` — personal preferences across all projects.
3. **Project-level** `./CLAUDE.md` — shared project instructions.
4. **Directory walk-up.** Running Claude Code in `foo/bar/` loads both `foo/bar/CLAUDE.md` and `foo/CLAUDE.md`. Ancestor directories contribute automatically.
5. **`@import` syntax** inside any CLAUDE.md pulls in a referenced file.
6. **`CLAUDE.local.md`** for personal overrides at the project level (not checked in).
7. **`.claude/rules/`** for path-scoped rules.

The documented rule: "more specific wins within a tier; managed always wins across tiers." Example: user says "use tabs", project says "use 2-space indentation" → project wins (more specific). Organization managed policy says "never use raw SQL" → project-level override cannot unset it.

**Mechanism.** There is no sophisticated conflict-resolution engine at runtime. Hierarchy is *read order into the system prompt*. Each file in the hierarchy is concatenated (in precedence order) into the final system prompt. "Overriding" just means the later, more-specific rule appears later in the text. This is important because it means the mechanism is purely textual — if two rules conflict but don't share identical wording, Claude reads both and decides which to follow based on the model's interpretation. Hard enforcement only happens via Hooks and Permissions (Q5, Q8). The CLAUDE.md hierarchy governs **what Claude sees**, not **what Claude is allowed to do**.

Settings (JSON) vs Memory (CLAUDE.md): settings files control permissions/env/tool behavior; memory files provide instructions and context. Use CLAUDE.md for "what to build", `.claudeignore` for "what to see", settings files for "how to operate."

**Implication for Concept's CC-017.** CC-017 is the failure pattern "principles not enforced at execution time." The CLAUDE.md hierarchy offers zero help here — it's a read-time mechanism. Enforcement belongs in Hooks (PreToolUse can block), not in CLAUDE.md files. The prior research's observation that "Python gets executed, prose gets ignored" is correct: prose-in-CLAUDE.md is a suggestion, whereas a PreToolUse hook that exits with code 2 is a command. This validates Eric's `wf_*.py` direction.

*Tags: CLAUDE.md hierarchy, content-drop (adjacent), engineering-process patterns, D19 Reasoner Duality.*

### Q3 — Skill resolution

**Three-level progressive disclosure** is the documented pattern:

- **Level 1 — Metadata.** `name` and `description` from SKILL.md YAML frontmatter. Always in system prompt from session start. Typical cost: ~100 tokens per skill.
- **Level 2 — SKILL.md body.** Loaded only when Claude calls a skill-invocation tool with the skill's name. Typical cost: ~2000 tokens per skill.
- **Level 3 — Bundled resources** (`scripts/`, `references/`, `assets/`). Loaded on demand from within the skill's flow.

Teaching implementation (shareAI-lab):
```
class SkillLoader:
  - __init__(skills_dir): rglob('SKILL.md') sorted; parse YAML frontmatter;
    name = meta.get('name', parent_dir_name); store {meta, body}
  - get_descriptions(): format "- {name}: {description}" per skill → injected into system prompt
  - get_content(name): wrap body in <skill name="{name}">...</skill> and return
Tool handler 'load_skill' is a lambda wrapping get_content.
```

So skills are discovered by filesystem scan at SkillLoader construction. Directory name is the skill ID if `name` is absent from frontmatter. The system-prompt injection is just the description list, nothing else. On-demand loading is a normal tool_result — no special machinery.

**Production reality goes further** — Claude Code supports skill bundles with `scripts/`, `references/`, `assets/`, and per-skill `allowed-tools` restrictions. The triggering signal is the `description` field: it's both a discovery affordance (Claude scans descriptions to decide to invoke) and an eligibility predicate (if description doesn't match the task, skill isn't triggered). Effective skill descriptions are long enough to enumerate triggering conditions and include negative examples of when NOT to trigger.

Skill discovery on write: when Write lands on a path that looks like it could be inside a skill directory, skill discovery re-runs non-blocking. So a `SKILL.md` created mid-session becomes available without a restart.

**Implication for Concept's 16-agent refactor.** If we keep thinking of agents as "instances that get invoked," we're fighting the progressive-disclosure pattern. Skills are not agents. Skills are on-demand domain knowledge the model pulls into its own context. The Python-backed agents that actually *do work* (workflow orchestrators, stateful trackers) are not skills — they're tools (or workflows run by the main agent). Mapping matrix in §5 applies this distinction.

*Tags: document-cm, Concept agent refactor, engineering-process patterns.*

### Q4 — Subagent / Task tool internals

`task` tool spawns a subagent with:
- **Fresh `messages = []`.** No parent context inherited.
- **Only the final assistant text message returns to parent**, wrapped in a normal `tool_result` block. Intermediate tool calls are discarded.
- **Child tool set = parent tools minus `task`** — no recursive spawning.
- **Safety limit on iterations.** 30 in teaching code; production value unknown.
- **Per-result truncation.** In teaching code, tool_result content is truncated to 50,000 characters inside the subagent's loop. Production may differ but the pattern is: subagents observe truncated tool results before compression even enters the picture.
- **Optional model selection** per subagent (e.g., use Haiku for cheap broad searches, Sonnet for analysis).
- **`run_in_background: true`** lets the subagent run asynchronously; notifications fire on completion.

AgentDefinition fields: `name`, `description`, `prompt` (system instructions), optional `model`, optional `tools` allowlist. Public SDK exposes subagent definitions as files under `.claude/agents/*.md` with YAML frontmatter.

**The one channel from parent to subagent is the `prompt` string on the Task tool call.** No file handles, no shared state, no message replay. Any context the subagent needs must be inlined. This has a direct consequence for long-horizon work: a subagent cannot "pick up where the parent left off" — it starts clean with only what the parent spelled out in the prompt.

**Implication for document-cm.** Subagents are good for: scoped investigations with compact return values (Read N files, return one paragraph), parallel breadth-first exploration (4 different searches in parallel), verification passes (isolated independent review). Subagents are bad for: stateful sequential work that depends on the parent's live context. Our doc-update workflow is the second kind. Using the Task tool for a multi-document synchronization pass would lose the parent's context on every invocation; we'd end up redundantly re-reading docs in each subagent. Better: keep the orchestration in the main loop and use subagents only for scoped read/verify operations.

**Implication for code-cm.** Subagents make much more sense for code review: "spawn a subagent to run the test suite and return pass/fail plus failing test names" is a clean, scoped, parallel-safe pattern. Code CM can use subagents as evaluator-optimizer pairs (main agent implements, subagent verifies, iterate).

*Tags: Concept agent refactor, document-cm, code-cm, engineering-process patterns.*

### Q5 — Hook system

Documented events — all fire around tool execution and session lifecycle. The canonical set (all 12 hooks) includes PreToolUse, PostToolUse, SessionStart, SessionEnd, UserPromptSubmit, Stop, Notification, SubagentStop, PreCompact, and config-change events. The critical one: **PreToolUse is the only hook that can block an action.**

PreToolUse decision model:
- **Exit code 0 with no output** → proceed normally (falls through to standard permission system).
- **Exit code 0 with explicit `allow`** → execute immediately, bypassing permission prompt.
- **Exit code 0 with explicit `deny`** → block the tool call.
- **Exit code 2** → blocking error; Claude Code halts the action and feeds the hook's stderr back into Claude's context so the model can adjust its plan.

Two handler types:
- **Prompt hooks** send a prompt to a Claude model for single-turn evaluation using `$ARGUMENTS` as the tool payload placeholder.
- **Agent hooks** spawn a subagent with `Read`, `Grep`, `Glob` (read-only) for deeper verification.

Payload to PreToolUse includes `tool_name` and `tool_input` (the exact parameters). So a PreToolUse hook on `Write` sees the target path and the full content being written.

**Implication for Eric's CC-017 (principles not enforced at execution time).** Hooks are the answer. A PreToolUse hook on Write/Edit that validates content-CM rules — frontmatter present, footer present, version bumped correctly, file in expected directory — is deterministic enforcement. A `deny` return blocks the write entirely; an exit-code-2 return sends structured feedback ("missing `updated:` field in frontmatter") back to Claude, which will then fix and retry. This is the Reasoner Duality D19 pattern in its most literal form: the hook is the Tier 1 deterministic gate, Claude's response to the gate error is Tier 2 LLM explanation/repair.

For Lifting Tracker's build process specifically: pre-commit hooks + PreToolUse hooks should enforce the schema-complete-from-day-one invariant (D24), the frontmatter+footer attribution rule (global CLAUDE.md), and the D14 weight-as-per-implement invariant if anyone ever writes code that tries to store totals. The hooks do not replace tests — they prevent a class of errors from reaching commit.

*Tags: content-drop (adjacent, not root), CC-017 / Concept agent refactor, D19 Reasoner Duality, application build process, engineering-process patterns.*

### Q6 — Tool composition and prompt construction

Claude Code's agent loop is minimal and published as such: `while response.stop_reason == "tool_use": append tool_results, call model again`. The system prompt is **concatenated** from sources in a fixed order:

1. Base Claude Code system prompt (tool descriptions, role framing, safety rules).
2. Built-in tool specifications and their descriptions.
3. MCP-server-declared tools (after MCP connection resolves).
4. Merged CLAUDE.md content in the precedence order from Q2.
5. Skill descriptions (Layer 1 of progressive disclosure).
6. Dynamic insertions — `<system-reminder>` blocks for reminders like stale tasks and memory nags.

The `<system-reminder>` mechanism is worth noting. Claude Code injects reminders at turn boundaries — stale-task reminders (if todo list hasn't been updated in N rounds), attached-file reminders, memory hints. The reminders are inserted inside the turn-boundary user message, not into the system prompt itself. This is the mechanism behind the "nag reminder" pattern from s03 TodoWrite: when `rounds_since_todo >= 3`, a `<reminder>Update your todos.</reminder>` block is inserted into the last user message's content list.

Truncation behavior:
- **Tool results** — teaching impl truncates to `[:50000]` chars; production limits are per-tool. Read's is the 25K-token cap.
- **System prompt** — no documented truncation; hard-limited by the model's context window.
- **Messages array** — managed by the compression cascade (Q1/Q3).

**Implication for document-cm.** Skill descriptions are your primary lever for triggering. If document-cm's SKILL.md description doesn't include concrete trigger phrases matching what users actually type, the skill won't fire. Anthropic's skill authoring docs emphasize this — descriptions need explicit trigger conditions and negative examples.

*Tags: document-cm, engineering-process patterns, content-drop (compression side).*

### Q7 — MCP integration mechanics

MCP = Model Context Protocol. JSON-RPC 2.0 over a pluggable transport. Claude Code runs as an MCP host; each external service runs as an MCP server; one dedicated MCP client per server.

Transports:
- **stdio** — `claude mcp add --transport stdio <name> -- <command>`. Claude Code spawns the server as a child process, communicates over stdin/stdout. Server starts automatically when Claude Code launches.
- **HTTP/SSE** for remote servers.
- **OAuth** for authenticated remote servers.

MCP server primitives: **Tools**, **Resources**, **Prompts**. Discovery via `*/list` methods (`tools/list`, `resources/list`, `prompts/list`). Execution via `tools/call`, `resources/read`, `prompts/get`. All discovery is lazy — MCP clients call `*/list` when the host requests.

**Tool Search** is the on-demand tool-discovery mechanism: Claude initially sees only tool names; when it needs a capability, it calls a `tools/search` mechanism to pull the full schema. This keeps the system prompt bounded even when dozens of MCP servers are connected.

**MCPConnectionManager** orchestrates multiple client instances — discovery, connection state transitions, reconnection. This runs in the main Claude Code process alongside the agent loop.

**Implication for Lifting Tracker.** Supabase integration via an MCP server (if we stand one up for schema introspection, RLS policy testing, migration application) is strictly better than tool-use shims because the discovery/execution is typed end-to-end and works with Tool Search. Same for Expo build tooling — an MCP server exposing `ios/build/status`, `web/deploy/status`, `migration/apply` as tools keeps the deploy pipeline inside Claude's action space without custom prompt engineering.

*Tags: application build process, engineering-process patterns.*

### Q8 — Permission / safety model

Layered:

1. **Built-in permission prompts.** Every destructive/irreversible tool call pops a permission dialog by default. Users can `allow-once`, `allow-for-session`, `allow-for-project`, or `deny`.
2. **Settings allowlists / denylists** — per-project `.claude/settings.json` can pre-allow trusted tools and pre-deny dangerous ones, removing the prompt.
3. **PreToolUse hooks** (Q5) — deterministic gate, can override permissions with `allow`/`deny` decisions.
4. **Auto-mode / sandboxing** — `claude --auto` runs without prompts inside a sandboxed worktree with reduced filesystem and network access.
5. **Managed policy** — enterprise-enforced denylist at the top of the precedence stack; cannot be overridden by user or project.

Worktree isolation (s12 in shareAI-lab) — each parallel task runs in its own git worktree so concurrent tools can't step on each other. Task + worktree are bound by ID.

**Implication for Lifting Tracker development.** Pre-allow the safe tools (`Read`, `Grep`, `Glob`), pre-deny the dangerous ones (`rm -rf`, `git push --force`, production Supabase endpoints). Use worktree isolation when running multi-step migrations — one worktree per migration so a rollback doesn't corrupt parallel work.

*Tags: application build process, engineering-process patterns.*

### Q9 — Workflow patterns in the source

The shareAI-lab progression is itself a canonical workflow-pattern taxonomy inside Claude Code, layered atop Anthropic's published "Building Effective Agents" five-pattern set:

- **s01 The agent loop** — while + `stop_reason == "tool_use"`, the minimal executable pattern.
- **s02 Tool dispatch** — `{name: handler}` dict; adding tools never changes the loop.
- **s03 Planning (TodoWrite)** — plan-first with nag reminder at 3+ rounds silent, single-in-progress constraint.
- **s04 Subagent isolation** — fresh context per spawned task; only final message returns.
- **s05 Skills** — progressive disclosure (metadata / body / resources).
- **s06 Context compaction** — micro/auto/manual three-layer cascade.
- **s07 Task graph** — on-disk JSON-per-task with `blockedBy` dependency edges; auto-unblocks dependents on completion; **survives compression and restarts**.
- **s08 Background tasks** — daemon threads + notification queue; agent keeps reasoning while long ops run.
- **s09 Agent teams** — persistent teammates via JSONL mailboxes.
- **s10 Team protocols** — request-response FSM for coordination (plan approval, shutdown).
- **s11 Autonomous scan-and-claim** — teammates scan the task board and claim available work.
- **s12 Worktree isolation** — per-task git worktree so parallel execution doesn't interfere.

Anthropic's five workflow patterns map onto these layers:
- **Prompt chaining** = s03 TodoWrite (plan-then-execute decomposition).
- **Routing** = s02 tool dispatch (model chooses the handler).
- **Parallelization** = s04 + s09 (subagents for scoped parallelism, agent teams for persistent parallelism).
- **Orchestrator-workers** = s09 + s11 (teammates + scan-and-claim).
- **Evaluator-optimizer** = s04 applied to verification — main agent implements, subagent reviews, main agent iterates.

**The task graph (s07) is the canonical durability substrate.** It survives both the compression cascade *and* full session restarts because it's on disk, not in messages[]. This is what the Concept `Task*` tools in Cowork are — a direct port of this pattern, surfaced via MCP to Cowork.

*Tags: document-cm, code-cm, engineering-process patterns, Concept agent refactor.*

### Q10 — Unexpected findings

- **GrowthBook is everywhere.** Claude Code runs live experiments inside production, gated by flags like `tengu_read_dedup_killswitch`, `tengu_amber_wren` (token/byte limits), `targetedRangeNudge` (read-whole-vs-range prompt A/B), `tengu_write_claudemd` (CLAUDE.md write telemetry). The A/B harness implies per-user variance in behavior. If you see Claude Code doing something differently on two machines or two sessions — that's why. Concept's reproducibility goals should account for this: reproducing a session from a shared link requires pinning the experiment state, which is not exposed.
- **CLAUDE.md writes are tracked specifically.** `tengu_write_claudemd` is a named telemetry event separate from other file writes. Anthropic is watching what we put into CLAUDE.md files — probably to inform the model's training data for "good" CLAUDE.md usage and to detect misuse patterns. Privacy-sensitive project instructions should not go into CLAUDE.md.
- **Read dedup is ~18% hit rate.** An A/B measure of how often the model re-reads the same file without change. That rate tells us the model would waste ~18% of its Read token budget without the intervention — a real cost the harness actively engineers against.
- **Truncation-vs-throw decisions are made empirically.** The Read truncation path was implemented, shipped behind a flag, measured (produced ~25K useless tokens vs ~100-byte throw), and reverted. Anthropic revises tool behavior based on live measurements, not just design instinct.
- **Line endings forced to LF is a past-bug scar.** Silent LF→CRLF preservation corrupted bash scripts in real user repos. The fix was to ignore the existing file's line endings entirely. Similar scars likely exist for other behaviors and aren't always documented.
- **Jupyter notebooks get a separate editor (`NotebookEdit`).** Edit is explicitly rejected for `.ipynb`. Implication: treat non-text file formats (docx, xlsx, pdf) the same way — they need dedicated skills, not naïve Write/Edit.
- **Contraction detection in Edit uses `/\p{L}/u`.** This is not a behavior we can introspect; it's documented only in the source. If Eric ever writes prose that has a curly apostrophe not flanked by Unicode letters (e.g., a possessive at the end of a word followed by punctuation), Edit's preservation heuristic might pick a left-curly instead of right-curly. Corner case; unlikely to bite but worth cataloguing.

*Tags: all categories.*

---

## 5. Mapping matrix — Concept's 16 agents to Claude Code primitives

Applying the skills/tools/workflow distinction from Q3 and Q9: **Skills are on-demand domain knowledge.** **Tools are actions.** **Workflows (coded in Python) are orchestrations that run atop both.** Agents — as Eric has defined them — are a mix. Each row below evaluates where it belongs.

| # | Concept agent | Disposition | Replacement / substrate | Rationale |
|---|---|---|---|---|
| 1 | Primer | Replace with Claude Code primitive | **CLAUDE.md + session-start hook** | Primer's job — load required context at session start and verify instruction-file presence — is precisely the CLAUDE.md hierarchy's job. The "verify files present" piece becomes a SessionStart hook that exits 2 if required files are missing. No agent needed. |
| 2 | Starter | Replace | **TodoWrite + task graph (s03 + s07)** | Starter kicks off a run. That's `TodoWrite` creating initial tasks, period. |
| 3 | Book Boss | Keep as workflow, not agent | **Python workflow (`wf_*.py`) + document-cm skill** | Book Boss orchestrates document mutations with gates. Mutations happen via Claude Code's Edit/Write. The gate logic is Python; the doc-handling discipline is the skill. Book Boss is the *integration* — it should not be one "agent" but a workflow that invokes the skill. |
| 4 | Notekeeper | Replace | **On-disk pending-changes file + Edit tool** | Notekeeper tracks pending changes. That's a file, mutated via Edit. The "agent" wrapper adds nothing. |
| 5 | Scorekeeper | Keep as Python tool, not agent | **Python module invoked via Bash or MCP tool** | Scorekeeper computes session metrics. Deterministic. Not Claude's job. Expose as a `bash` command or an MCP tool. |
| 6 | Historian | Keep as Python tool | **Python module + versioned artifact directory** | Version lineage tracking is deterministic; belongs in code. |
| 7 | Doc Librarian | Replace | **Filesystem + Skill + Read dedup** | Doc Librarian indexes documents. The filesystem is already the index. A skill can provide lookup helpers. Read's dedup already prevents redundant work. The ACL-004 title-match bug Eric has tracked is symptomatic of re-implementing what the filesystem gives us. |
| 8 | Reporter | Replace with hook | **SubagentStop hook + Python report generator** | Reporter writes the session-end report. Run it as a SubagentStop (or SessionEnd) hook that exits 2 if the report fails to write — that removes the "Claude forgot to run Reporter" CC-017 failure mode permanently. |
| 9 | Format Controller | Keep as tool / linter | **Pre-commit + PreToolUse hook** | Frontmatter, footer, wording conventions. Deterministic rules. Run as pre-commit hooks in the repo and PreToolUse hooks for in-session enforcement. |
| 10 | Context Persistence | Replace | **`.transcripts/` + task graph** | Claude Code already persists transcripts to disk and the task graph survives compression. Rebuilding this is duplicative. |
| 11 | Agent Registrar | Drop (or replace with filesystem scan) | — | If agents become skills, the filesystem *is* the registry. `SkillLoader` already scans. |
| 12 | Agent Architect | Keep as meta-skill | **`skill-creator` (Anthropic's) or a Concept-specific skill** | Creating new skills is a first-class activity; the `skill-creator` skill exists. Concept's equivalent should add Concept-specific conventions (D19, MVCR+D). |
| 13 | Version Coordinator | Keep as Python tool | **Python module + git hooks** | Version bumping is deterministic. Belongs in code and in pre-commit. |
| 14 | Instruction Verifier | Replace with hook | **SessionStart + PreToolUse hooks** | Verifying that instructions were followed at execution time is exactly the Hook mechanism's job. |
| 15 | Courier | Replace | **MCP tool or background task (s08)** | Delivering artifacts (files, messages) between humans and the session. Claude Code already has this via its file tools, MCP, and background tasks. |
| 16 | Timekeeper | Keep as Python tool | **Python module + scheduled-tasks MCP** | Time-aware scheduling is deterministic. Cowork already has scheduled-tasks MCP. |

**Summary verdicts:**
- **Replace with Claude Code primitives: 9 of 16** (Primer, Starter, Notekeeper, Doc Librarian, Reporter, Context Persistence, Agent Registrar, Instruction Verifier, Courier).
- **Keep as Python code exposed as tools or MCP servers: 5** (Scorekeeper, Historian, Format Controller, Version Coordinator, Timekeeper).
- **Keep as skills/workflow orchestration: 2** (Book Boss as Python workflow + document-cm skill; Agent Architect as meta-skill).

The 16 collapse to roughly 5 Python utility modules + 2 skills + a set of hooks. That's the target architecture. Everything else is framing overhead.

---

## 6. Recommended changes to document-cm design (v0.3.0 deltas)

Annotated delta list against `docs/reference/source-doc-cm-design.md` (v0.2.0, 1,607 lines).

1. **Add §X.X "Fresh-Read Discipline" — mandatory.** Before any Edit or Write on a governed doc, force a Read of the target file within the same turn. This invalidates the content-drop compression vector (§3.3). Non-negotiable. (Implements finding §3.4 #1.)

2. **Add "Post-mutation verify" as a workflow step.** After Edit/Write, re-Read and diff against the pre-mutation snapshot. Flag unexpected changes. Produces a deterministic change-log row per mutation. (Finding §3.4 #2.)

3. **Add a `pre_flight_size_check`.** Refuse Write on docs over ~20K tokens (buffer below Read's 25K cap); force plan-then-Edit path. Eliminates Read-cap-related silent failures. (Finding §3.4 #3.)

4. **Add `.document-cm/snapshots/` baseline archival.** Session-start snapshot; manual restore path. Complements Claude Code's own `.transcripts/`. (Finding §3.4 #4.)

5. **Re-specify the 16-agent architecture per §5's mapping matrix.** The current design brief treats agents as first-class; the revision should treat them as "one of {skill, hook, Python tool, Python workflow}." Drop Primer, Starter, Agent Registrar sections entirely; move Notekeeper, Doc Librarian, Context Persistence, Courier, Instruction Verifier to "superseded by Claude Code primitives." Retain Book Boss, Format Controller, Scorekeeper, Historian, Reporter (as hook), Agent Architect, Version Coordinator, Timekeeper.

6. **Describe hook integration as first-class, not optional.** PreToolUse hook wrapping Write/Edit enforces attribution, frontmatter, footer, version-bump rules. The skill should ship reference hook scripts the user can install into `.claude/hooks/`.

7. **Add explicit Read dedup awareness.** Document that `readFileState` dedup returns stubs on re-reads — so re-reading is NOT a cure for "I think my context is stale." Only a *fresh* Read after a known file mutation resets state reliably; within the same unchanged-file window, dedup will short-circuit.

8. **Treat `.md` and `.mdx` as first-class file types.** Specify that trailing whitespace is preserved (Markdown hard line break = two trailing spaces). Specify LF line endings. These are already enforced by the tool layer but the skill should document them so users aren't surprised.

9. **Decouple governance from description.** Skill descriptions are not the place for policy — they're the trigger signal. Policy goes in SKILL.md body and (for enforcement) hooks. The current design bleeds policy into description because it evolved as an agent-oriented doc.

10. **Add evals harness.** G24 in Eric's prior validated-review already flags this. The findings here say: every new skill in document-cm should ship with eval cases covering the content-drop scenario, the partial-read refusal path, the desanitization corner case, and the compression-after-N-turns recovery path.

---

## 7. Application build process implications (Lifting Tracker)

Apply the findings to Expo + Supabase + CI/CD.

**Pre-commit hooks as mandatory gate.** Port the Format Controller logic (attribution frontmatter/footer check) into a pre-commit hook. Add: schema-completeness-from-day-one check (D24 — migrations must include all D1–D24 tables), D14 weight-as-per-implement check (static scan for suspicious `weight * reps * sets` that implies total-load storage), D16 rest-in-integer-seconds check. Pre-commit catches them before review.

**PreToolUse hooks mirror pre-commit.** Same rules enforced mid-session so Claude can't write code that fails pre-commit. Reduces the edit-commit-reject-reedit loop.

**MCP servers for the deployment surface.** Expose:
- `supabase-mcp`: migration status, RLS policy introspection, edge-function logs tail.
- `expo-mcp`: `eas build` status, TestFlight submission status, Vercel deploy status.
- `lifting-tracker-domain-mcp`: compute-volume-from-sets (D14+D15), compute-1RM-from-session, run D19 Tier 1 reasoner.

Each MCP tool exposed via the same `tools/list` → `tools/call` protocol. Claude Code's Tool Search keeps the prompt size bounded.

**Worktree isolation for migrations.** Each migration runs in its own git worktree per s12. Parallel migrations don't step on each other. Rollback is `git worktree remove`.

**D19 Reasoner Duality mapped to hook-vs-model.** Tier 1 (deterministic reasoner) is where hooks live; Tier 2 (LLM explainer) is Claude generating user-facing copy explaining the hook's verdict. This is not a metaphor; it's literally how Claude Code's permission + hook model already behaves.

**CI: add a `transcripts-and-snapshots` job.** After every Claude-driven commit, the job archives the `.transcripts/` and `.document-cm/snapshots/` entries into a build-artifact store so incidents can be reconstructed. Respects telemetry caveats — scrub secrets.

**What NOT to build.** Don't build custom content-preservation logic on top of Claude Code's Write — it already has the right contract. Don't build custom skill registries — the filesystem is the registry. Don't build a custom CLAUDE.md overlay — use `@import` and directory walk-up. Don't build a custom hook bus — use Claude Code's.

---

## 8. Code-CM implications

Where code edits differ from doc edits, and what code-cm should inherit vs reinvent.

**Similarity: the tool contract is identical.** Write and Edit work the same on `.ts`, `.py`, `.md`. Same Read-before-Write, same staleness, same quote normalization (except Edit doesn't curly-quote-preserve code because code doesn't have curly quotes normally, but the mechanism is active either way). So everything document-cm enforces about mutation discipline applies verbatim to code-cm.

**Differences that matter:**

- **Syntactic validity is non-negotiable.** A code edit that breaks syntax is catastrophic in a way that a doc edit isn't. Code-cm should add a PostToolUse hook that runs the language's parser (or equivalent — TypeScript's `tsc --noEmit`, Python's `python -c "compile(open(path).read(), path, 'exec')"`, similar). Exit 2 if parse fails, which feeds Claude the error and triggers a fix. Doc-cm doesn't need this.
- **Test suite integration.** Code changes should trigger relevant tests. Subagent-as-verifier pattern (s04 applied to test execution) fits here: main agent edits, subagent runs tests, main agent iterates. Doc-cm can use the same pattern for link-check / spell-check / example-validation — but those are cheaper and less critical.
- **Dependency-aware invalidation.** Changing a shared type affects many files. Code-cm needs the task graph (s07) with real `blockedBy` edges — "after changing `ExerciseSet`, re-check all consumers." Doc-cm mostly gets by with per-file linear workflows.
- **Formatter/linter integration.** Prettier/ESLint/Ruff normalize after every edit. These are file-mutation events that Claude Code sees (mtime changes, triggers the staleness check). Code-cm workflows need to anticipate the formatter-modifies-file-between-edits pattern and Re-Read proactively. Doc-cm rarely has this problem.
- **Diff review.** Code edits should land on a branch with a real diff reviewable by a human. Doc edits often land directly. Code-cm workflows should always create a branch + PR, not commit straight to main, even when the edit is trivially safe.

**What code-cm and doc-cm share:**
- Fresh-Read Discipline.
- Post-mutation verify.
- Baseline snapshots.
- Hook-based enforcement of attribution and conventions.
- Evals per skill.

**What they share with application build:** the same MCP and hook stack; different content under the same scaffolding.

---

## 9. Engineering-process patterns worth stealing

Beyond the item-by-item findings:

- **The three-layer compression cascade is a pattern, not just an implementation detail.** Any long-running human-in-loop workflow should compress in tiers: silent-local (latest turn matters most), explicit-global (when the session gets long, summarize everything explicitly), and tool-driven (let the user ask for a summary). This is a reusable architecture for Cowork-style UIs.
- **"More specific wins within a tier; managed always wins across tiers" as a general config-merge rule.** Lifting Tracker's own settings (user preferences, coach overrides, gym policy, organization compliance) can follow this exact shape. Written once as a library function, reused everywhere.
- **The nag reminder pattern.** Inject a `<reminder>` block into the user message after N quiet rounds. Cheap, effective, and invisible when not needed. Use for stale-todo, missing-attribution, uncommitted-changes. The s03 teaching implementation shows the insertion into `message["content"]` as a list element is the key — not a new message, not a system prompt change; just a reminder inside the normal turn boundary.
- **Task graph on disk as the durability substrate.** One JSON file per task; auto-unblock on completion via `blockedBy` edge removal. Survives compression, restart, session boundaries. This is a near-drop-in replacement for the Python `TodoManager` in Concept.
- **Evaluator-optimizer via subagent.** Main agent implements; subagent reviews in isolated context; main agent iterates. The subagent isolation (fresh messages, only final result returns) means the reviewer can't be biased by the implementer's chain of thought.
- **Exit-code-2 hooks for structured feedback.** Using stderr + exit code 2 to feed errors back to the model is a tiny, elegant protocol. A shell-exit-code is the ultimate universal API. Use this pattern in any custom tool integration.
- **GrowthBook-style flags for behavior experiments.** If Lifting Tracker wants to A/B test coach-feedback copy or AI-suggestion presentation, use a flag service and memoize the flag value at session start (Claude Code's precedence shows how: env > flag > default, memoized first-read). Avoid flag-value changing mid-session.

---

## 10. Open questions

- **What is the production `KEEP_RECENT` value for micro_compact?** Teaching impl uses some small N; production value determines how quickly file-content memory evicts. Affects the fresh-read policy calibration.
- **What is the production auto_compact threshold?** 50K in teaching; production likely scales with model context window. Affects when the content-drop window opens.
- **Does `readFileState` persist across auto_compact events?** If yes, a Write after compression can still satisfy its preconditions even though Claude's *contextual* memory of the file content is gone. This is the exact pathway §3.3 describes, but I could not confirm the persistence from secondary sources. Worth verifying if we can get a source reader with more access.
- **Are SessionStart hooks allowed to block a session from starting?** Documentation suggests yes (exit 2 halts) but the semantics of "halt at session start" aren't fully clear. Affects Primer-replacement design.
- **How are PreCompact hooks invoked and what payload do they see?** Docs mention the hook exists; whether it can cancel the compaction or only observe it matters for any content-preservation strategy.
- **Do the experiment flags (`targetedRangeNudge`, `tengu_amber_wren`) have published behavioral contracts?** If not, sessions are reproducibility-degraded by design. Plan accordingly.
- **The dnakov reverse-engineered repo 404.** Was it renamed, removed, or DMCA'd? If the latter, the legal posture of rely-on-deobfuscated-source analyses may be shifting, and future findings should favor Anthropic's own published materials plus careful inference.
- **Cowork's file tools (Read/Write/Edit here) — do they share the `readFileState` / staleness / dedup machinery with stand-alone Claude Code?** If Cowork's tools are a different implementation, the content-drop symptoms may differ between the two environments in ways we haven't isolated. Worth testing.

---

© 2026 Eric Riutort. All rights reserved.
