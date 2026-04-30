---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-30
tier: OPERATIONAL
content_class: reference
version: 0.2.0
status: accepted
---

# Solo+AI Orchestration — Cowork, Claude Code, and Chrome

## 1. Purpose

This document names and governs the orchestration pattern Eric runs across three Claude surfaces — Cowork (Dispatch), Claude Code, and Claude in Chrome — plus the shared-state files that move work between them. Gartner's AI-Native SWE heatmap (`reach4all://docs/research/gartner-ai-native-swe-review.md`) treats "AI automation orchestration" as durable shared-responsibility work that remains human-led at L5; this is the artifact that converts Eric's informal habit into a documented practice so the capability stops being tacit. Living reference: revisions land at sprint close and on each newly observed failure mode.

## 2. Tools and their lanes

### Cowork (Dispatch)

Primary surface for strategic orchestration. Runs on the desktop app, spawns sibling tasks via MCP, renders a TodoList widget, maintains `docs/kanban-sprint-<id>.md`, holds persistent memory across sessions, can attach files and screenshots, and can reach Claude in Chrome.

Use for: research, landscape scans, document authoring and revision, source-doc CM work, framework reviews, screenshot analysis, long-horizon planning, coordinating multiple children, and anything that needs the memory layer or attachments.

Do not use for: large multi-file code refactors, heavy git operations, long-running local builds, or persistent filesystem work across host folders Cowork does not have mounted. File mutations in Cowork run against mounted views; if the canonical source is elsewhere, Claude Code is the right tool.

### Claude Code

Primary surface for code, the host filesystem, and git. Runs directly in the terminal, sees the full repo, understands ignored files, runs tests, commits, pushes, and operates without the mount indirection.

Use for: code and test changes, multi-file refactors, git operations (commit, push, rebase, tag, branch), long-running local dev servers, package installs, schema migrations, and anything where repo-wide search or build tooling matters.

Do not use for: research tasks with heavy web fetching, multi-step browser automation, or coordinating sibling tasks. Claude Code does not have Cowork's memory layer, the kanban widget, Chrome access, or native task-graph siblings — spawning peers is an anti-pattern here.

### Claude in Chrome

Browser automation surface, reachable from Cowork. Operates inside Eric's signed-in Chrome; useful precisely because it inherits authenticated sessions.

Use for: fetching share-link SPAs that plain WebFetch cannot render, driving SaaS UIs (Gemini Deep Research, ChatGPT chats, Grok DeepSearch, Claude.ai share pages), pulling screenshots of rendered pages, and anything that requires post-auth DOM rendering.

Do not use for: tasks that could be done with a plain HTTP fetch; tasks that require logging into a new account (Chrome must already hold the session); bulk scraping. Auth-walled targets should report a clean failure and hand back to Dispatch — never attempt to log in.

## 3. Decision tree — when to spawn what

Mechanical. If a new Claude session had only this table, it should pick the right surface.

| Trigger | Surface | Spawn how |
|---|---|---|
| New research task, single topic, batched output | Cowork `start_task` | Dispatch spawns a child; returns findings doc under `reach4all/docs/research/` (portfolio-level) or `lifting-tracker/docs/reference/` (project-scoped) |
| Landscape scan or parallel-to-external-system research (e.g., Gemini Deep Research) | Cowork `start_task` with anti-contamination rules | Dispatch orchestrates; child never sees competing findings |
| Code change or test change in a specific repo | Claude Code session | Open directly, or `start_code_task` from Cowork with prompt that includes repo path and current kanban link |
| Multi-system workflow requiring both research and code | Cowork orchestrates; spawns Claude Code tasks as children | Dispatch holds state; Code children do repo ops and return |
| Quick conversational question, no tool use | Current session | Answer inline |
| Large doc revision with GATE (e.g., CM brief v0.3.0) | Cowork `start_task` | Long multi-hour task; baseline snapshot before spawning |
| Screenshot analysis (Gartner, AI-productivity report, etc.) | Cowork `start_task` with attachments | Attach in spawn prompt; child paraphrases under copyright discipline |
| Share-URL fetch that plain WebFetch bounces | Cowork → Claude in Chrome | Cowork child drives Chrome navigation; returns rendered content |
| Git op that matters (tag, force-push, branch surgery) | Claude Code | Dispatch does not push; Code does |
| Mobile-only input (voice-to-text likely) | Current Dispatch session | Silent auto-correct against named vocabulary; continue autonomous work |

Ambiguous case default: if the task touches both code and research, Dispatch orchestrates and spawns Code children. If the task is purely code, open Claude Code directly.

## 4. Context movement patterns

No shared memory exists between Cowork and Claude Code. Context moves through files and explicit MCP calls, nothing else.

**The kanban as shared state.** `docs/kanban-sprint-<id>.md` is the canonical work tracker across all surfaces. Dispatch maintains it continuously — spawning a task adds a row to In Progress, completion moves it to In Review or Done, blockers move it to Blocked. Claude Code sessions read it to orient before touching anything. The `## Other Session Work` section is Eric-maintained for sessions Dispatch cannot see (Chrome, mobile, other desktop CLI). Tier: OPERATIONAL, date-based versioning.

**Research docs as accumulated findings.** Everything under `docs/reference/` is the research memory of the project. Dispatch tasks produce new files there; subsequent sessions read them as source material. Format: YAML frontmatter + copyright footer, WF-003-style ALIGNED / EXTENDS-US / CONTRADICTS / NEUTRAL alignment maps where appropriate. The `reach4all` research repo (Sprint 0b) will consolidate portfolio-level findings outside any single sub-system's tree.

**Memory files.** Dispatch's persistent memory under the session-memory directory holds preferences, project state, and cross-session corrections (`feedback_workspace_split.md`, `feedback_no_fatigue_projection.md`, `feedback_autonomous_work.md`, `project_cm_approval_model.md`, etc.). Claude Code does not share this memory. Anything in memory that a Claude Code session needs must be either in the repo or spelled out in the spawning prompt.

**MCP tools for in-flight coordination.** `send_message` pushes a follow-up into an already-spawned task (amend-in-place; use when the task is still running and the request fits the existing context). `read_transcript` inspects a task's progress without re-prompting. `start_task` spawns new children. `list_sessions` enumerates what Dispatch can see; sessions Dispatch cannot see get an Eric-maintained row in the kanban's Other Session Work table.

**File system mounts.** Cowork reaches host folders via a mount table; Claude Code runs directly against the host. A file under `/Users/ericriutort/lifting-tracker/...` is reached from Cowork through the mount (`/sessions/…/mnt/lifting-tracker/...` in the bash sandbox). File tools (Read/Write/Edit) and bash may see different paths for the same file — translate via the mount map, never assume equivalence.

## 5. Failure modes observed

Pulled from `reach4all://docs/research/concept-computing-april-10-failure-analysis.md`, `reach4all://docs/research/claude-code-internals-findings.md`, and this session's experiences. Each row is a pattern with a concrete mitigation.

| Pattern | Root cause | Mitigation |
|---|---|---|
| Content drops during long doc rewrites | Compression cascade (`micro_compact` silently replaces tool_results older than `KEEP_RECENT` with `[Previous: used Read]`; the model Edits from paraphrased memory, not from the tool_result) | Fresh-Read Discipline: re-Read the target in the same turn before every Edit. Use Edit not Write. Baseline snapshot under `.document-cm/snapshots/` at session start. Read-after-Write and diff against baseline. |
| Stream timeout on long-running research tasks | Too much parallel work in one child; unbroken generation over multi-hour horizon | Batched incremental save: child writes partial output after each research question rather than at the end. Retry with smaller batches. The April 23 Claude-Code-internals retry (`local_a596636d`) shipped exactly this pattern after `local_d32ec2e8` timed out. |
| Zombie sessions | Child hits API stream error but `list_sessions` still reports `running` | User-initiated stop from the desktop UI. Dispatch cannot kill zombies programmatically; do not pretend the session is still working. |
| Auth wall in Claude in Chrome | Target requires login Chrome does not hold | Report cleanly to Dispatch. Do not attempt to log in. Note the wall in the kanban; Eric decides whether to authenticate separately. |
| Share-URL SPA fetches failing with plain WebFetch | Client-side rendering; WebFetch returns shell HTML without conversation body | Route through Claude in Chrome navigation. Confirmed working for claude.ai share URLs (`21c654fa`, `abf45918`). `f0492d52` returned empty even from Chrome — likely expired/revoked, not a fetch failure. |
| Mobile voice-to-text artifacts | Eric dictating on mobile produces homophones and mangled technical terms (e.g., "reporter" for "Reporter agent", "tools" for "tolls") | Silent auto-correct against named vocabulary (CC-017, WF-003, ACL-004, D19, Tier 1/Tier 2, etc.). Do not interrupt Eric to confirm transcription — per `feedback_no_fatigue_projection.md`. |
| PDF paywall blocks book / analyst report access | Target resource behind Packt, Gartner, O'Reilly, etc. | Find public code bundles, preview chapters, publisher blog posts, or analyst commentary. Paraphrase under copyright discipline. Flag the gap explicitly in the findings doc so the limit is auditable. |
| Context-drop during document rewrites | Write on a long doc exceeds 25K-token read cap; Claude falls back to memory-edits | Edit, not Write, for any doc over ~20K tokens. Baseline snapshot before any mutation. Read-after-Write and diff. Refuse Write at pre-flight on oversized docs. |
| Reporter-skip / governance omission (CC-017) | Claude drops workflow steps framed as governance when they compete with content for attention | Wire the governance into the tool call, not the prose instruction. For doc-CM: one function, not six discrete steps. For this orchestration pattern: the kanban row is the governance — a task is not done until the row is moved. |
| ACL-004 (title-match) style silent success | Tool reports success while underlying state is unchanged | Read-after-Write against disk truth. Never trust a tool's return value as confirmation. |
| Cross-session memory regression | Same prompt in a later session produces shallower output than an earlier one | Canonical session-end artifact (the findings doc) is canonical session-start input. Do not rely on model-resident memory of prior sessions — load the file. |
| Scope creep inside a task | Child drifts into fixing adjacent problems instead of the stated deliverable | GATE payload names deferrals explicitly. When spawning a child, spell out in-scope and out-of-scope in the prompt; child reports scope violations rather than executing them silently. |

## 6. Recovery patterns

**Task failed — respawn vs send_message vs accept partial.** Read the transcript first. If the task errored early and produced no usable output, respawn with a fresh prompt (apply any lesson from the failure — shorter batches, incremental save, Chrome instead of WebFetch). If the task produced partial but correct work, `send_message` with a scoped amendment that does not require re-doing the good work. If the task produced a usable deliverable with known gaps, accept it, note the gaps in the kanban, and decide whether the gaps are worth a follow-up task or a deferred entry.

**Document has a suspected content drop.** Diff against the baseline snapshot. If the diff extends beyond the expected edit region, restore from snapshot and re-apply surgically. Use Edit with Fresh-Read Discipline: re-Read in the same turn, use the freshly read content to construct `old_string`, never from memory. For docs above the read cap, work in offset windows; never attempt Write.

**Tool call blocked by deferred-tool system.** Check the deferred tool list in the system reminders. Use `ToolSearch` with `select:<name>` to load the schema, then call. Do not guess parameters; if the schema is ambiguous, search for the tool by keyword first.

**User voice-to-text mangled a term.** Silent auto-correct against named vocabulary. Do not interrupt the work to confirm the transcription. If the correction is ambiguous enough to be load-bearing (e.g., different decision ID, different file path), confirm tersely and continue.

**User away on mobile or otherwise not responsive.** Continue autonomous work per `feedback_autonomous_work.md` and `feedback_no_fatigue_projection.md`. Queue decisions for Eric's return in the kanban's In Review section with the open decisions named explicitly. Do not sit idle waiting for permission on work that is clearly in-scope for the current sprint.

**Chrome session is logged out.** Report the wall. Log the target URL and the auth need in the kanban. Do not attempt to log in, even if credentials appear retrievable. Eric authenticates out-of-band.

## 7. Tripwires and escalation

**Task running > 30 minutes with no visible progress.** Read the transcript. If the child is looping, stuck on a fetch, or generating padding content, stop it and respawn with tighter scope or incremental save. Do not let a stalled task occupy the In Progress row indefinitely.

**Same failure mode recurs across two or more tasks in a sprint.** Document in this file. Add a row to the §5 table or a dedicated subsection. Failure modes that recur are architectural, not accidental — surface them explicitly so the orchestration pattern evolves.

**Research task produces fewer sources than expected.** Verify the task is pushing hard enough, not padding. Agentic AI landscape scan targets were 80–150 sources; a return of 30 with padding prose is a failure signal. Respawn with a stricter deliverable contract (source count, schema rows, explicit rejection of prose summaries).

**Kanban drift.** If Dispatch stops updating the kanban mid-sprint, the orchestration pattern has degraded. Tripwire: at every sprint-close checkpoint, verify kanban reflects reality. If it does not, reconcile before spawning any new work.

**Session count approaches memory capacity.** Cowork memory and the kanban both accumulate entries across sprints. At sprint close, consolidate (per `consolidate-memory` skill) and prune. Do not let either grow unbounded.

**Claude Code session making architectural decisions.** Per global CLAUDE.md: architectural decisions live in `docs/` and go through Dispatch or Eric, not inside a Claude Code implementation session. If Claude Code hits an architectural fork, stop and surface to Dispatch or Eric rather than pushing through.

## 8. Worktree isolation as default

Added Sprint 0c2 per the failure-modes research (`reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md`, §1.2 prevention action #2 and §5.1 blast-radius patterns). Treat this section as the operational rule that pairs with the deny list (Sprint 0c1 CC9) and the forthcoming bindfs reaper (deferred post-Sprint-0d2 per SD-004): the deny list refuses literal destructive commands; the worktree default contains blast radius when an unblocked destructive action still gets through; the reaper cleans up after sandbox failures. Three layers, three failure modes, no overlap.

### 8.1 Why

Every documented Claude Code / coding-agent destructive incident in the failure-modes catalog (rm -rf wipes, accidental file deletes, git history rewrites, multi-file refactor cascades) had a recoverable scope only when the work was in a separate worktree. Where the agent ran on the live checkout, recovery cost minutes-to-hours of restore work and sometimes lost uncommitted state. The single architectural commitment that flips this — "agent edits never touch the live tree" — is cheap enough (one alias, one spawn-template change) that not adopting it is the unusual choice.

This section establishes worktree-as-default for both code-task spawning surfaces. Override paths are explicit and named.

### 8.2 Cowork-spawned Code tasks

Cowork's `mcp__dispatch__start_code_task` (and the parent-agent `Agent` tool when called with `subagent_type` matching a code-execution role) accepts an `isolation: "worktree"` parameter. Per Anthropic's Cowork documentation as of April 2026, code-task spawns from Cowork/Dispatch should use `isolation: "worktree"` for any task that mutates the repo. The platform's behavior with this flag: a temporary git worktree is created off `origin/HEAD`, the child agent operates inside it, and on completion the worktree is auto-cleaned if no changes were made; if changes were made, the worktree path and branch name are returned for explicit promotion (merge, cherry-pick, or discard).

Operational rule:
- **Default:** every Cowork-spawned Code task that may write to the repo uses `isolation: "worktree"` in the spawn payload.
- **User-prompted approval-per-worktree.** When a Code-task child exits with changes, Eric reviews the worktree via the returned path/branch and decides whether to promote to the live tree. Dispatch does not auto-merge.
- **Read-only override:** code tasks that are pure-read (grep over the repo, scan files, summarize logs) may omit `isolation: "worktree"` since there is no blast radius. Spawn prompt must explicitly state "read-only" so the override is auditable.

The spawn-prompt template under `feedback_workspace_split.md` (and any future Dispatch task templates) carries `isolation: "worktree"` as the default keyword and lists read-only as the named exception. Any other use of the live tree from a spawn requires Eric's explicit go.

### 8.3 Interactive Mac terminal sessions

The Claude Code CLI exposes worktree isolation via the `--worktree` flag (shorthand `-w`) — verified against [Anthropic Claude Code docs](https://code.claude.com/docs) and [Boris Cherny's `--worktree` post](https://www.threads.com/@boris_cherny/post/DVAAoZ3gYut/use-claude-worktree-for-isolation-to-run-claude-code-in-its-own-git-worktree) (April 2026). With the flag, Claude Code creates a worktree at `<repo>/.claude/worktrees/<name>/` on a branch `worktree-<name>`, and scopes the session to that directory. With no name, Claude auto-generates one.

Shell alias for Eric's `~/.zshrc`:

```bash
# Default Claude Code to worktree isolation. Override with `command claude` or `\claude`.
alias claude='claude --worktree'
```

To start an interactive Claude Code session on the live tree (read-only inspection, doc-only edits, single-step git ops where the worktree round-trip is overhead), bypass the alias with one of the standard zsh escapes: `command claude`, `\claude`, or `unalias claude && claude`. The override is intentional friction — typing `command claude` is the visible decision to skip isolation.

### 8.4 Override patterns

Three named cases where running on the live tree is the right call:

| Case | Surface | Override |
|---|---|---|
| Read-only inspection (grep, log review, file enumeration, kanban update) | Cowork or terminal | Spawn payload omits `isolation: "worktree"` and states "read-only" in prompt; terminal uses `command claude` |
| Single-step git op already committed elsewhere (tag, push of an existing commit, branch surgery on a known-clean tree) | Terminal | `command claude` for the session |
| Doc-only edits where the doc is at a stable commit and the edit is small enough that the worktree-merge round-trip is overhead | Terminal or Cowork | `command claude` for terminal; Cowork keeps `isolation: "worktree"` even here, since Cowork's worktree promotion flow is fast enough that the friction is negligible |

When in doubt, default to worktree. The override path is for cases where the worktree explicitly costs more than it gains; absent that calculation, take the isolation.

### 8.5 Re-evaluation cadence

Per SD-012 Lifecycle Integrity. Review at every sprint close. Trigger an out-of-cycle re-evaluation if any of the following occurs:
- A code-task spawn destroys live-tree state despite the default (worktree was overridden incorrectly, or the override path is too easy to hit).
- Anthropic ships a Cowork or Claude Code change that alters the worktree default behavior (e.g., the platform adopts worktree as the platform default, making this section's discipline implicit; or removes the flag entirely).
- A new Claude surface (mobile, IDE plugin, etc.) enters Eric's orchestration pattern and needs its own override-pattern row in §8.4.

### 8.6 Cross-references

- `reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md` §1.2 (prevention action #2), §5.1 (blast-radius limitation patterns), §9.2 (Sprint 0c2 actions)
- `~/lifting-tracker/.claude/settings.json` — Sprint 0c1 CC9 deny list (the layer below this one; refuses literal destructive commands)
- `~/lifting-tracker/docs/lift-track-destructive-operation-policy_v0.1.0.md` — Sprint 0c2 CC2; the operational policy that classifies destructive operations into tiers and names the approval matrix
- SD-004 (bindfs bypass) — compensating-control pattern; the reaper that cleans up sandbox-mount remnants is deferred post-Sprint-0d2

## 9. Evolution policy

This is a living document. Review at each sprint close. Add new failure modes as they are observed; prune entries that no longer apply. Changes go through WF-003 Lite — `content_class: reference` with a GATE required only on structural changes (new section, revised decision tree, new tool lane). Typographical fixes and new table rows within existing sections do not require a GATE.

Attribution and footer stay current. `updated:` bumps on every material edit. Version bumps are date-based per OPERATIONAL tier conventions; no semver.

Cross-links to update when this doc changes:
- `docs/lift-track-architecture_v0.4.0.md` — if an orchestration decision becomes architectural (e.g., a new D-number), it moves there and this doc references it.
- `docs/kanban-sprint-<id>.md` — if a new spawn pattern emerges, the kanban's conventions section is updated too.
- `docs/reference/lift-track-source-document-cm_v0.3.0.md` — if a mitigation here becomes a CM skill requirement, it propagates there.

When this doc contradicts observed behavior, the observed behavior wins. Update the doc; do not paper over the divergence.

---

© 2026 Eric Riutort. All rights reserved.
