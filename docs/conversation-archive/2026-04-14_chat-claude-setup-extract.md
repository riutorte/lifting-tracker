---
author: Eric Riutort
created: 2026-04-14
updated: 2026-04-14
---

# Chat Claude — Setup Conversation Extract (2026-04-14)

Curated extract from a chat Claude conversation that walked Eric through CLAUDE.md template selection, three-tier file structure, and the Cowork + Dispatch setup. The conversation also generated the initial steps that built the v1 lifting-tracker PWA. Most of the procedural setup steps have already been executed and are not preserved here — only the parts with lasting value.

## CLAUDE.md template guidance

Source recommended: `github.com/abhishekray07/claude-md-templates`. Three-file pattern the community converges on:

- **Global** (`~/.claude/CLAUDE.md`) — under 15 lines. Personal preferences across all projects.
- **Project** (`<repo>/CLAUDE.md`) — pick by stack, committed to git. Build/test commands, structure, conventions.
- **Local** (`<repo>/CLAUDE.local.md`) — personal, gitignored. Device-specific notes.

Anthropic's guideline: under 200 lines (system prompt already has ~50 instructions; CLAUDE.md competes within ~150–200). HumanLayer's production file: under 60 lines. Common community ceiling: 40–80 lines for project files.

Key principle: **if Claude would figure it out on its own, don't put it in CLAUDE.md.** Avoid:

- Personality instructions ("be a senior engineer")
- Formatting rules a linter could enforce
- Things already documented elsewhere in the repo

The self-improvement loop: after every correction, end with "Update CLAUDE.md so you don't make that mistake again." The file gets smarter over time.

## Cowork + Dispatch — the architectural argument

Originally a Claude.ai Project was proposed for product/strategy discussion alongside Claude Code for implementation. Then Cowork + Dispatch was raised as a better fit. The argument:

| Problem with Projects route | How Cowork + Dispatch fixes it |
|---|---|
| Re-uploading `architecture.md` every time it changes | Cowork reads the live file directly from your repo folder |
| Cross-device context switching (laptop vs phone) | Dispatch gives one persistent thread on both |
| Code lives in one place, strategy in another → drift | Cowork and Claude Code can see the same files |

What these are:

- **Cowork** — agentic mode of Claude Desktop. Reads, edits, creates files in granted folders. Same capability surface as Claude Code, but applied to knowledge work (docs, planning, research).
- **Dispatch** — persistent conversation thread synced between phone and Claude Desktop. Assign work from phone; Cowork executes on the Mac while it stays awake.

**One gotcha**: Cowork and Claude Code can both edit the same files. Treat Cowork/Dispatch as "discussion + doc drafts" and Claude Code as "implementation + code changes." Don't edit the same doc simultaneously from both.

## v1 lifting-tracker — what was built

Built and deployed in one Claude Code session:

- App at `https://github.com/riutorte/lifting-tracker`, Pages-served at `https://riutorte.github.io/lifting-tracker/`.
- Overview tab: 135×100 bench progress (15/100 — current best at 135 was 11/15/2024), 391 total sessions, 8.1M lbs total volume, latest body weight (208.5 lbs, 3/16/2026, Chuze), body weight mini chart, yearly breakdown, top 5 exercises by volume.
- History tab: toggle by-date / by-exercise; search filter; tap-to-drill on exercises. Parser extracted 312 sessions with detailed exercise data and 110 unique exercises.
- Log tab: date picker + free-text textarea (paste from Notes works), saves to localStorage, "Copy all" button formats for paste-back into `combined_workout_log.txt`.
- PWA: installable on iPhone via Safari → Share → Add to Home Screen. Works offline after first load. Custom barbell icons.

Known limits at v1:

- Parser skips chronological-log sessions without indented exercises (e.g., Wingchun crunches days). Those still appear in History via the Session Index, just without per-exercise breakdown.
- Body weight chart is 20-reading mini, not full timeline.
- No edit for saved log entries (delete + re-add).

## Misc decisions captured

- Repo and Pages site are public. Eric confirmed that's fine for workout data.
- localStorage data lives only on the device that wrote it; manual export-paste-commit is the only sync path in v1.
- Apple Developer Program ($99/yr) was discussed in the context of an Xcode pivot, then rejected when scope expanded.

---

© 2026 Eric Riutort. All rights reserved.
