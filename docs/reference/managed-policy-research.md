---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# Managed-Policy CLAUDE.md Research (for two-person architect team)

Research findings to inform (a) the content of the Tier-1 managed-policy `CLAUDE.md` that will live at the Anthropic-documented managed path on each collaborator's Mac, and (b) the git-distributed installer repo that places or symlinks that file and keeps it in sync across machines.

**Key correction up front.** The task brief assumed the managed path on macOS is `/etc/claude-code/CLAUDE.md`. Per Anthropic's own documentation (§1.1), the macOS path is `/Library/Application Support/ClaudeCode/CLAUDE.md`; `/etc/claude-code/CLAUDE.md` is the Linux/WSL path. Every reference downstream in this research uses the correct Mac path. The brief's other assumptions survive; only the path was wrong.

**Scope.** Eric Riutort (primary architect) and Fernando (secondary architect) collaborate across 4–6 repos using individual Max plans — no Anthropic Team or Enterprise tenant, so admin-enforced policy cannot be pushed via a managed console. The managed-policy file is one of two machine-wide surfaces available to them until they move to a team plan; the other is `managed-settings.json`, which is the *enforcement* sibling to the advisory CLAUDE.md (§1.7).

**Out of scope.** Revisions to the `xrsize4all` meta-repo, the `document-cm` skill, or any existing architecture document. This research feeds two *new* artifacts: the managed-policy content, and the onboarding/distribution repo.

**Status.** Draft — research compiled 2026-04-23. To be reviewed before a managed-policy commit lands on any machine.

---

## §1 Anthropic's official guidance on managed-policy CLAUDE.md

### 1.1 The full CLAUDE.md hierarchy as Anthropic documents it

The primary source is Anthropic's own `code.claude.com` memory documentation (fetched 2026-04-22). Note that `docs.claude.com/en/docs/claude-code/memory` now redirects; the canonical URL is `https://code.claude.com/docs/en/memory`. The doc defines four tiers of CLAUDE.md, ordered broadest-to-most-specific:

| Scope | Location | Purpose | Shared with |
|---|---|---|---|
| **Managed policy** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux/WSL: `/etc/claude-code/CLAUDE.md`; Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | Organization-wide instructions managed by IT/DevOps | All users in organization |
| **Project instructions** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared instructions for the project | Team via source control |
| **User instructions** | `~/.claude/CLAUDE.md` | Personal preferences across all projects | Just you |
| **Local instructions** | `./CLAUDE.local.md` (gitignored) | Personal project-specific preferences | Just you |

Source: `https://code.claude.com/docs/en/memory` under the "Choose where to put CLAUDE.md files" section (fetched 2026-04-22).

**Correction to the brief.** The task brief assumed the managed-policy path on macOS is `/etc/claude-code/CLAUDE.md`. That is **wrong**. Anthropic documents `/Library/Application Support/ClaudeCode/CLAUDE.md` on macOS and reserves `/etc/claude-code/CLAUDE.md` for Linux and WSL only. macOS has no `/etc/claude-code/` path in Anthropic's documentation. Eric and Fernando on Macs need the `/Library/Application Support/ClaudeCode/` path. This finding changes §8 (installer design): the installer must write to `/Library/Application Support/ClaudeCode/`, which is also root-owned on macOS and requires `sudo`, but is a different directory than what the brief anticipated.

### 1.2 Precedence rules when files conflict

The memory doc is explicit about two distinct kinds of "precedence" and here is where the docs are thin:

1. **Directory-walk precedence (within the user's file tree).** Quote: *"All discovered files are concatenated into context rather than overriding each other. Within each directory, CLAUDE.local.md is appended after CLAUDE.md, so when instructions conflict, your personal notes are the last thing Claude reads at that level."* (`https://code.claude.com/docs/en/memory`, "How CLAUDE.md files load", fetched 2026-04-22)

2. **Tier precedence (across managed / project / user / local).** The doc says *"More specific locations take precedence over broader ones"* but never publishes an explicit load-order list for the four tiers the way it does for settings files. The doc only states that managed CLAUDE.md *"cannot be excluded by individual settings"* (via `claudeMdExcludes`). Whether the managed CLAUDE.md is injected first, last, or in a fixed slot in the context window is **not documented**.

This is a real gap. For `managed-settings.json` the doc publishes a clear list ("server-managed > MDM/OS-level policies > file-based > HKCU registry" — `https://code.claude.com/docs/en/settings` fetched 2026-04-22) but the equivalent list for CLAUDE.md is absent. The practical implication — consistent with Anthropic's guidance that *"files loaded later take precedence because the model pays more attention to instructions that appear later in the context window"* — is that managed CLAUDE.md is probably injected *early*, which makes it *less* authoritative than more specific files by position. Eric's mental model should be: managed CLAUDE.md is the floor, not the ceiling. A conflicting project CLAUDE.md instruction will usually win in practice because the model weighs later context more heavily. This is the opposite of how `managed-settings.json` works.

### 1.3 Exact file paths per OS (verbatim from Anthropic)

From the same page, under "Create the file at the managed policy location":

- macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`
- Linux and WSL: `/etc/claude-code/CLAUDE.md`
- Windows: `C:\Program Files\ClaudeCode\CLAUDE.md`

The parallel paths for `managed-settings.json` are the same directories. macOS additionally supports the `com.anthropic.claudecode` managed-preferences domain (plist deployed via MDM — Jamf, Kandji, etc.) for settings, but **not** for CLAUDE.md. CLAUDE.md is file-only at the managed tier.

### 1.4 Size / token / structure limits

Anthropic's documented guidance, verbatim where quoted:

- **Size.** *"target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence."* (`https://code.claude.com/docs/en/memory`, "Write effective instructions")
- **Structure.** *"use markdown headers and bullets to group related instructions."*
- **Specificity.** *"write instructions that are concrete enough to verify."*
- **Comments.** Block-level HTML comments (`<!-- notes -->`) are *"stripped before the content is injected into Claude's context"* — usable for maintainer notes. Comments inside fenced code blocks are preserved.
- **Hard cap.** None documented for CLAUDE.md files specifically. The 200-line number is a soft recommendation.
- **Token count.** Not published. Anthropic only says CLAUDE.md files *"consume tokens alongside your conversation."*

### 1.5 What managed policy CLAUDE.md can actually enforce

This is the single most important thing in Anthropic's doc, and it directly confirms the task brief's suspicion. Verbatim:

> *"A managed CLAUDE.md and managed settings serve different purposes. Use settings for technical enforcement and CLAUDE.md for behavioral guidance... Settings rules are enforced by the client regardless of what Claude decides to do. CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer."*
> (`https://code.claude.com/docs/en/memory`, "Manage CLAUDE.md for large teams", fetched 2026-04-22)

And in the troubleshooting section:

> *"CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself. Claude reads it and tries to follow it, but there's no guarantee of strict compliance, especially for vague or conflicting instructions."*

Anthropic further publishes a table mapping concerns to the right mechanism (same page):

| Concern | Configure in |
|---|---|
| Block specific tools, commands, or file paths | Managed settings: `permissions.deny` |
| Enforce sandbox isolation | Managed settings: `sandbox.enabled` |
| Environment variables and API provider routing | Managed settings: `env` |
| Auth method and organization lock | Managed settings: `forceLoginMethod`, `forceLoginOrgUUID` |
| Code style and quality guidelines | Managed CLAUDE.md |
| Data handling and compliance reminders | Managed CLAUDE.md |
| Behavioral instructions for Claude | Managed CLAUDE.md |

**Implication for Eric's setup.** Managed CLAUDE.md is advisory only. Any control that must hold under adversarial-prompt conditions (a compromised MCP, a malicious webpage injection, Claude deciding to "help") has to live in `managed-settings.json` — specifically in `permissions.deny`, `sandbox.enabled`, and the hooks URL allowlist. CLAUDE.md is the right surface for "how we work" and "how to talk about commits." It is the wrong surface for "never run `rm -rf`" or "never push to main."

### 1.6 Signing or integrity on managed policy

**Not documented.** Anthropic describes no signature, checksum, version-pinning, or tamper-evidence mechanism for managed CLAUDE.md or managed-settings.json. The integrity model is POSIX file permissions on the managed directory. For Eric's two-person setup, this means:

- The machine-wide file should be owned by root (or at minimum not group- or world-writable).
- Any compromise that gives a user write access to `/Library/Application Support/ClaudeCode/` silently neutralises the managed CLAUDE.md with no alert to the other architect.
- There is no built-in way to verify that the file on disk matches the blessed version in the distribution repo. If Eric and Fernando want detection, they need to build it — a launchd job that diffs the installed file against a known-good SHA and reports drift.

This is a clear gap versus how enterprise MDM tooling normally works. Jamf / Kandji / Intune push a configuration profile that is signed and tamper-evident at the OS level. The file-based managed policy path has none of that. macOS managed-settings can use the `com.anthropic.claudecode` preference domain via configuration profile — which *would* be signed/MDM-protected — but CLAUDE.md has no equivalent profile mechanism per Anthropic's current docs.

### 1.7 Interaction between managed CLAUDE.md and managed-settings.json

These are two separate files in the same directory. They are **not** merged and do **not** substitute for each other.

- **managed-settings.json** is hard, deterministic, client-enforced configuration: permission rules, sandbox flags, env vars, forced login provider/org, hook URL allowlists, plugin marketplace restrictions (`strictKnownMarketplaces`), `allowManagedHooksOnly`, `enabledPlugins`. Its precedence chain (highest-to-lowest) is: server-managed → MDM/OS-level → file-based (`managed-settings.d/*.json` plus `managed-settings.json`) → Windows HKCU registry. Sources do not merge across tiers — only one managed source is used, and within the file-based tier the drop-in directory files are merged alphabetically with the base file (systemd convention). Source: `https://code.claude.com/docs/en/settings` (fetched 2026-04-22).
- **Managed CLAUDE.md** is soft, probabilistic, model-side guidance. It has no drop-in directory documented (unlike managed-settings). Whether multiple files can live at the managed tier is not addressed.

The doc reinforces the split: *"Settings rules are enforced by the client regardless of what Claude decides to do. CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer."* For Eric's two-person team, this suggests a **paired deployment**: managed-settings.json to enforce the hard rules (deny patterns, sandbox, auth lock, hook URL allowlist) and a small managed CLAUDE.md for the soft behavioral rules (tone, attribution, commit conventions, architectural reminders).

### 1.8 Documentation gaps and ambiguities

Flagged explicitly for Eric:

1. **No load-order list for CLAUDE.md tiers.** The doc describes directory-walk concatenation and says "more specific wins," but never shows where managed CLAUDE.md sits in the final context string relative to project, user, and local files. Inferable but not stated.
2. **No drop-in directory for managed CLAUDE.md.** managed-settings.json gets `managed-settings.d/` for multi-team fragmenting. CLAUDE.md has no such mechanism documented. If two organizations' CLAUDE.md content needs to coexist on one machine, the doc is silent.
3. **No size ceiling for CLAUDE.md.** 200 lines is a soft recommendation only; nothing documents the point at which Claude will truncate or ignore.
4. **No signing / integrity story.** Addressed in §1.6.
5. **Silent-fail behaviour is documented.** The `/memory` command lists loaded files — useful for debugging — but there is no documented way for the machine to fail a session if the managed CLAUDE.md is missing, truncated, or mutated. Eric should assume silent failure is the default.
6. **Enterprise IAM page is not directly relevant.** `/docs/en/iam` primarily covers SSO/SAML, RBAC in the Claude.ai console, and audit logs for Team/Enterprise tenants — none of which Eric has on individual Max plans. Managed CLAUDE.md is the only machine-wide surface he can reach without a tenant.
7. **"Server-managed" settings exist but are tenant-gated.** Anthropic publishes a `server-managed settings` concept (`/docs/en/server-managed-settings`) delivered from the Claude.ai admin console. Not usable on individual Max plans.
8. **Release-note provenance of the managed-policy feature.** The exact Claude Code release that introduced managed CLAUDE.md was not verifiable from the docs index — the feature is present-tense with no deprecation or experimental flag, so it's a stable surface, but the introduction version is absent from the memory and settings pages.

### 1.9 Sources for §1

All Anthropic-primary, fetched 2026-04-22:

- `https://code.claude.com/docs/en/memory` — memory / CLAUDE.md hierarchy, managed-policy paths, load order, size guidance, enforcement-vs-guidance distinction.
- `https://code.claude.com/docs/en/settings` — managed-settings.json paths, tier precedence, drop-in directory, `com.anthropic.claudecode` plist, plugin marketplace restrictions.
- `https://www.anthropic.com/news/claude-code-on-team-and-enterprise` — team/enterprise admin-control announcement (context only).

Practitioner/secondary sources checked for corroboration (non-authoritative):

- Rushi Shah, "The Full CLAUDE.md Hierarchy" (`rushis.com`)
- HumanLayer, "Writing a good CLAUDE.md"
- Joseparreogarcia, "You (probably) don't understand Claude Code memory"
- systemprompt.io, "Claude Code Enterprise Rollout Playbook"

---

## §2 Industry practice for admin-enforced dev-tool configuration (small-team scale)

*Caveat: the research agent for this section could not reach live documentation at the time of writing; content is synthesized from training knowledge. Verify item-level claims (especially Cursor rule schemas and Windsurf paths) against current vendor docs before committing to any reference in the managed-policy file itself. Flagged also in §11.*

### 2.1 Cursor / Codeium (Windsurf) / Continue

**Cursor.** Cursor's admin surface is split between per-user settings (UI-driven, stored in the Electron app's user data directory) and repo-level rules. The team-shareable surface is `.cursorrules` at repo root — a plain-text file of natural-language instructions the AI is told to follow. In late 2024 Cursor introduced `.cursor/rules/*.mdc`, a directory of scoped rule files with frontmatter (`globs`, `alwaysApply`, `description`) that lets teams target rules to specific paths. Enterprise Cursor adds SSO, audit logs, and an admin console, but none of that is available to a 2-person team on the Pro tier. For small teams the de facto pattern is: commit `.cursorrules` or `.cursor/rules/` to the repo, review it in PRs, and trust Cursor to load it. There is no supported mechanism to enforce a system prompt machine-wide outside the repo, and no `/etc/cursor/` equivalent. Model choice, data-sharing (Privacy Mode), and tool allowlists are per-user settings; a team can document the expected settings in a README but cannot enforce them without the Business tier.

**Codeium / Windsurf.** Codeium (rebranded to Windsurf for the IDE) exposes repo-level context via `.codeiumignore` (gitignore-style) and, in Windsurf, `.windsurfrules` plus global rules at `~/.codeium/windsurf/memories/global_rules.md`. The global rules file is the closest analogue to a machine-wide CLAUDE.md — but it lives in the user's home directory, not `/etc/`, and there is no documented precedence mechanism for an admin file that supersedes user edits. Enterprise Codeium offers self-hosting and team admin controls; the free/Pro tiers do not.

**Continue.dev.** Continue's config is `~/.continue/config.json` (or `config.ts` for programmatic configs), user-scoped. Continue added `.continuerc.json` for repo-level overrides and a `config.yaml` rewrite in 2024–2025. There is no admin-enforced system-wide path. Small teams check a `.continue/` directory or a documented `config.json` fragment into the repo and ask each dev to merge it — effectively manual distribution.

**Lessons that transfer to managed-CLAUDE.md.**
- Every comparable tool uses **file-based, repo-checked config** as the team-sharing mechanism. None of them solve enforcement without an enterprise tier.
- The **repo-root rules file** pattern (`.cursorrules`, `.windsurfrules`) is universal and lightweight. Claude Code's project `CLAUDE.md` already matches this.
- The **scoped rules directory** (`.cursor/rules/*.mdc` with glob frontmatter) is where the ecosystem is heading — worth watching as a pattern for Claude Code if per-path policy emerges.
- **No competitor ships a machine-wide admin file** outside enterprise tiers. A git-distributed managed-CLAUDE.md is therefore filling a real gap, not re-inventing a solved problem.

### 2.2 GitHub CODEOWNERS + branch protection

**Surface.** `CODEOWNERS` is a plaintext file at `.github/CODEOWNERS`, `docs/CODEOWNERS`, or repo root. Syntax is glob-like: `path-pattern  @user @team`. Branch protection rules are configured in the GitHub UI (or via API / Terraform) and are stored server-side, not in the repo.

**The split is the lesson.** The **policy content** — who owns which paths — lives in the repo, is versioned, is reviewed like any other change, and travels with forks. The **enforcement mechanism** — "require code owner review before merge", "require status checks", "restrict who can push" — lives at the platform layer (GitHub's branch protection config) and cannot be bypassed by editing a file in the repo. This separation is deliberate and well-designed: if enforcement lived in the file, anyone with commit access could disable it.

**Transfers to managed-CLAUDE.md.** A git-distributed managed CLAUDE.md is the policy content layer. The enforcement layer is weaker — it depends on Claude Code actually reading the managed path with higher precedence than user files, and on the user not editing the local file after install. Unlike GitHub, there is no platform-level enforcement a 2-person team can lean on. Flag this gap explicitly in the design: the managed file is **advisory enforcement** and good-faith policy, not a technical control.

### 2.3 VS Code settings.json hierarchy

**Paths and precedence.** User settings at `~/Library/Application Support/Code/User/settings.json` (macOS) → Remote settings (SSH/WSL/container) → Workspace settings at `.vscode/settings.json` in the repo → Folder settings (in multi-root workspaces). Later layers override earlier ones for most keys. A small set of "security-sensitive" settings (e.g., `terminal.integrated.env.*`, task commands) are gated by **Workspace Trust**: opening an untrusted folder shows a prompt before VS Code applies workspace-level overrides of those keys.

**What small teams do.** Commit `.vscode/settings.json` with formatter config, `editor.formatOnSave`, language-server options, and file-nesting patterns. Commit `.vscode/extensions.json` with a `recommendations` array; VS Code shows a "install recommended extensions" toast on first open. These are **suggestions**, not enforcement — a dev can ignore them.

**Gotchas.** The Workspace Trust prompt bites the first time a dev clones a new repo; some teams write onboarding docs for it. Settings that aren't workspace-scoped (shell path, update channel) can't be shared this way at all. There is no `/etc/code/settings.json` layer in stock VS Code, though Microsoft's enterprise docs describe registry-based policies on Windows and a `com.microsoft.VSCode` plist via MDM on macOS — not accessible to a 2-person team.

**Transfers.** The **user > workspace > folder** precedence is a near-universal pattern, and it's almost always **user wins** for anything personal (keybindings, themes) while **workspace wins** for anything project-shaped. A machine-wide layer, where it exists at all, is always the lowest precedence (a default) or is the highest (a policy) depending on intent. For managed-CLAUDE.md the design question is explicit: is the managed file a **default** (user can override) or a **policy** (user should not override)? Per §1.2, the answer per Anthropic's own design is ambiguous. Assume "floor, not ceiling" in practice.

### 2.4 JetBrains shared code-style and inspection profiles

**Surface.** `.idea/codeStyles/Project.xml` + `.idea/codeStyles/codeStyleConfig.xml` for formatter rules; `.idea/inspectionProfiles/Project_Default.xml` for linter/inspection severity. All XML, all committed to the repo. JetBrains has an explicit UI toggle — "Code Style → Scheme → Project" vs "IDE" — that controls whether the shared project profile or the user's IDE-wide profile is active. Teams opt-in by selecting "Project" and committing the files.

**Difference from VS Code.** JetBrains is **explicit** about share-with-team (you pick Project scheme) where VS Code is **implicit** (dropping a file in `.vscode/` just works, modulo Workspace Trust). The XML-vs-JSON format is less interesting than the explicit scheme selection: JetBrains users know they're on the team scheme because they picked it, which reduces "why is my formatter doing X" confusion.

**Transfers.** The explicit opt-in pattern is worth considering for managed-CLAUDE.md: the installer should make it visible that the user is now bound to a managed config, not silently drop a file that changes Claude Code's behavior.

### 2.5 EditorConfig

**Surface.** `.editorconfig` at repo root (or any ancestor). INI-ish syntax: `[*.py]` section headers with key-value pairs for `indent_style`, `indent_size`, `end_of_line`, `charset`, `trim_trailing_whitespace`, `insert_final_newline`, `max_line_length`. That's effectively the entire spec.

**Narrowness is the feature.** EditorConfig deliberately doesn't cover linter config, formatter config, or editor behavior beyond the minimum cross-editor common denominator. Because the scope is small and the format is trivial, every major editor either ships support or has a one-line plugin. Zero-install on JetBrains, Visual Studio, and recent VS Code.

**Transfers.** This is the **best-designed pattern in the list** for what it covers. The lesson: if you can scope your managed file tightly and keep the format boring, you get near-universal adoption for free. Managed-CLAUDE.md is inherently broader-scope (natural language instructions, not key-value pairs), but the principle holds: keep the managed file small, keep it reviewed, and don't try to put everything in it.

### 2.6 Pre-commit framework (pre-commit.com)

**Surface.** `.pre-commit-config.yaml` at repo root lists hooks (by git repo URL + rev + hook id). Each dev runs `pre-commit install` once per clone to install a git hook at `.git/hooks/pre-commit` that dispatches to the framework. `pre-commit autoupdate` bumps pinned revs.

**What it can enforce.** Client-side only. `pre-commit` cannot enforce anything at the server: a dev can `git commit --no-verify` and bypass it, or skip `pre-commit install` entirely. Server-side enforcement requires CI (running `pre-commit run --all-files` on every PR) or a git server with custom hooks (GitHub doesn't support custom server hooks without Enterprise).

**Small-team usage.** Commit `.pre-commit-config.yaml`, add `pre-commit run --all-files` as a CI step, document `pre-commit install` in the README. Bypass is social, not technical.

**Transfers.** The **install-once, hook-dispatch** pattern is directly applicable to managed-CLAUDE.md: an `install.sh` that sets up a symlink or a hook is a well-trodden path. The enforcement asymmetry — client-side is advisory, CI is authoritative — is a useful frame. For Claude Code there's no CI equivalent; managed-CLAUDE.md is purely client-side and thus purely advisory. That's acceptable for a 2-person team operating in good faith; it would not be acceptable at enterprise scale.

### 2.7 Git hooks via `core.hooksPath`

**Surface.** Git 2.9+ supports `git config core.hooksPath <path>`. Point it at a checked-in directory (e.g., `.githooks/`) and every hook in that directory is used instead of `.git/hooks/`. One `git config` command per clone (or set it globally in a dotfiles install).

**Relationship to pre-commit.** Pre-commit writes into `.git/hooks/pre-commit` directly and ignores `core.hooksPath` unless you configure it. `core.hooksPath` is the raw mechanism; pre-commit is a framework built on top of the raw hook system.

**Transfers.** `core.hooksPath` is the cleanest "config-as-code for the local git client" pattern. It confirms the ecosystem direction: **check policy into the repo, point the tool at the repo directory, let `git pull` handle updates**. That's exactly the managed-CLAUDE.md plan.

### 2.8 OS-level managed config (macOS MDM)

**How the real enterprise version works.** An MDM server (Jamf, Kandji, Mosyle, Intune) pushes a signed configuration profile (`.mobileconfig`, a plist) to the Mac. The OS enforces it: the user cannot edit managed keys without admin credentials, and the profile can be removed only by the MDM or a local admin. Apps read their managed settings via `CFPreferences` with the managed domain taking precedence over user defaults. For VS Code specifically, Microsoft publishes a `com.microsoft.VSCode` managed schema. For Claude Code, Anthropic publishes `com.anthropic.claudecode` for managed-settings (not CLAUDE.md).

**What a 2-person team is missing by not having this.** Cryptographically signed policy, OS-level enforcement, remote revocation, per-device targeting, compliance reporting. A git-distributed managed CLAUDE.md has **none of those**. It is a good-faith convention, not a technical control. Name that clearly in the design doc: the managed file is a policy artifact, not an enforcement mechanism, and the team is operating on trust plus code review plus the fact that there are only two people.

### 2.9 Patterns that recur across all eight

| Pattern | Where it shows up |
|---|---|
| Config-as-code in a reviewed repo | CODEOWNERS, `.vscode/`, `.idea/`, `.editorconfig`, `.pre-commit-config.yaml`, `core.hooksPath` — all of them |
| Precedence: user > workspace > machine (personal beats team beats default) | VS Code, JetBrains, most tools; exception is managed policy (machine > user, sometimes) |
| Client-side enforcement is advisory; authoritative enforcement lives at the platform (CI, branch protection, MDM) | Pre-commit vs CI, CODEOWNERS-as-text vs branch protection, managed profile vs user file |
| Small scope beats large scope for adoption | EditorConfig is the poster child |
| Explicit opt-in beats silent application | JetBrains scheme toggle, VS Code Workspace Trust |
| Below the enterprise tier, everyone ships a repo-rooted dotfile and hopes | Cursor, Codeium, Continue, pre-commit, editorconfig |

For managed-CLAUDE.md the honest summary is: the ecosystem precedent is **repo-rooted, reviewed, advisory**. Going a step further (machine-wide root-owned file, installer, sudo) is a modest escalation beyond typical small-team practice but not extreme. The escalation is justified if — and only if — Claude Code's precedence rules actually treat the managed path as higher-priority than user files in a stable, reliable way. §1.2 documents the ambiguity; plan accordingly.

---

## §3 Actual content in managed-policy-equivalent files (sampled)

Caveat up front: I found **zero** publicly accessible managed-policy CLAUDE.md files. That is expected — machines that have managed policy installed belong to enterprises, and the file is on disk, not in git. The public GitHub search path `path:/etc/claude-code filename:CLAUDE.md` returns nothing useful. Every sample below is therefore a **project-root CLAUDE.md**, not a true managed-policy file, except the last entry which is a template targeted at user-global scope (`~/.claude/CLAUDE.md`). That distinction matters for interpretation: project-root files mix project-specific context (commands, architecture, file layout) with cross-cutting rules (security, commits, style). A well-designed managed-policy CLAUDE.md would strip out the project-specific parts and keep only the cross-cutting rules. Read the survey with that filter in mind.

### 3.1 Sample survey

| # | Source | Project | Date fetched | Lines | Tier | Structural sections | Notable directives |
|---|---|---|---|---|---|---|---|
| 1 | `anthropics/claude-code-action` root | Anthropic Claude Code GitHub Action | 2026-04-22 | ~40 | Project-root | Commands; What This Is; How It Runs; Key Concepts; Things That Will Bite You; Code Conventions | Concise. No security/commit directives. Runtime pinning (Bun, not Node). Token lifecycle as a "will bite you" item. |
| 2 | `anthropics/claude-cookbooks/skills/` | Anthropic Skills Cookbook | 2026-04-22 | ~200 | Project-root | Project Overview; Quick Start Commands; Architecture Overview; Development Gotchas; Common Tasks; Testing Checklist; Resources; Project-Specific Notes; Environment Variables | Setup-heavy. No security directives, no commit rules, no attribution. Environment variable table. |
| 3 | `shanraisshan/claude-code-best-practice` | Community best-practice reference | 2026-04-22 | ~95 | Project-root | Repository Overview; Key Components; Critical Patterns; Answering Best-Practice Questions; Workflow Best Practices; Debugging Tips; **Git Commit Rules**; Documentation | Explicit "separate commits per file" rule. Documents its own managed-tier precedence (steps 1–6). "Keep CLAUDE.md under 200 lines." |
| 4 | `vercel/next-devtools-mcp` | Vercel Next DevTools MCP server | 2026-04-22 | ~120 | Project-root | Project Overview; Build/Dev Commands; Testing; Architecture; TypeScript Config; Build Process; MCP Protocol Integration; Common Dev Patterns; Package Publishing | Architecture-heavy. No security/commit rules. Build-order warning ("IMPORTANT: must run pnpm build first"). |
| 5 | `humanlayer/humanlayer` | HumanLayer monorepo (YC) | 2026-04-22 | ~75 | Project-root | Repository Overview; Project 1/2 decomposition; Development Commands; TypeScript/Go sections; Technical Guidelines; Development Conventions (TODO priority); Resources | Custom TODO taxonomy (`TODO(0)`–`TODO(4)`, `PERF`). No commit rules, no security directives. Very short per HumanLayer's own "keep under 60 lines" advice. |
| 6 | `langchain-ai/langchain` | LangChain (Python) — high-traffic OSS monorepo | 2026-04-22 | ~220 | Project-root | Project Architecture; Monorepo Structure; Dev Tools; Key Config Files; **PR/Commit Titles (Conventional Commits)**; **PR Descriptions**; **Core Dev Principles** (Stable Public Interfaces, Code Quality, Testing Requirements, Security, Documentation); Model Profiles; CI/CD; GitHub Actions | The richest sample. Hard rules: "No `eval()`/`exec()`/`pickle` on user input"; "Proper exception handling (no bare `except:`)"; "SHA-pin GitHub Actions"; stable-public-API constraints. Conventional Commits scope list. Explicit "AI-agent involvement disclaimer" in PRs. |
| 7 | `cloudflare/workers-sdk` | Cloudflare Workers SDK | 2026-04-22 | 2 | Project-root | *(pointer)* | Entire content: `See @AGENTS.md`. Delegation pattern. |
| 8 | `vercel/ai` | Vercel AI SDK | 2026-04-22 | 1 | Project-root | *(pointer)* | Entire content: `AGENTS.md`. |
| 9 | `vercel/next.js` | Next.js | 2026-04-22 | 1 | Project-root | *(pointer)* | Entire content: `AGENTS.md`. |
| 10 | `ucsandman/CLAUDE.md` user-global template | Community template | 2026-04-22 | ~220 | User-global (`~/.claude/CLAUDE.md`) template | GitHub Account; Context Management; Look First Rule; **Absolute Prohibitions** (Sensitive Data, Env Files); New Project Setup; Node Runtime Requirements; Pinned Toolchain; Must Work Commands; Definition of Done; Documentation Contract; Progress Tracking; **Security & Safety Guardrails**; Change Management; Error Handling; Architecture Snapshot; Golden Paths; **Hard No List**; Subagent Policy | The closest-in-spirit sample to a managed-policy file. Heavy "never" / "do not" language. Named GitHub account lock. Commit-checks-before-commit rule. Pre-commit secrets check. Change-scope minimalism. |

### 3.2 Near-universal (≥8/10) content patterns

Across these 10 samples the genuinely near-universal elements are only two:

1. **Header comment identifying the file as Claude Code guidance.** All 10 start with `# CLAUDE.md` or an equivalent heading. The canonical opener *"This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository"* appears verbatim in 5 of 10 (and is the boilerplate `/init` produces). Low informational value but near-universal.
2. **Build/run/test commands fenced in bash.** 8 of 10 samples. Files 7–9 inherit this from `AGENTS.md`. Only the user-global template (10) omits commands, which is correct — commands belong at the project tier.

Everything else I'd expect to be "universal" is not. This is the most useful finding for Eric.

### 3.3 Common-but-optional (3–7/10) content patterns

- **Architecture / project structure paragraph or tree.** 6/10. Always project-specific — absent from the pointer files (7–9) and the user-global template (10), which is where a managed-policy file would also land.
- **"Gotchas" / "Things that will bite you" section.** 4/10. Notable because the wording is imperative and strongly phrased — these are the parts models actually notice. Pattern worth borrowing for managed policy.
- **Coding conventions (style, naming, imports, runtime).** 6/10. Almost always project-specific in these samples, but the form ("NEVER assume a library is available") generalises.
- **Security / secrets rules.** 3/10 explicitly (LangChain, user-global template, and partially the community reference). Rarer than you'd expect in project-root files. Much more prominent in the user-global template.
- **Commit discipline rules.** 3/10. Surprisingly uncommon given how often Claude gets commits wrong in practice.
- **PR-body or PR-title conventions.** 2/10, both from larger OSS projects.
- **Testing requirements.** 4/10.
- **Pointer to AGENTS.md / delegation.** 3/10 (Cloudflare, Vercel x2). Fast-growing pattern for organizations hedging across multiple AI tools.

### 3.4 Interesting but rare (≤2/10)

- **Explicit context/compaction management directives.** 1/10. Unusual; shows the file is being used as an operational instrument, not just a reference.
- **Custom TODO taxonomy.** 1/10 (HumanLayer's `TODO(0)`–`TODO(4)` with severity semantics). Smart pattern — turns a convention into a signal Claude can act on.
- **Subagent routing policy** ("use Opus subagents for code review, Haiku for file search"). 1/10. Assumes a specific version/plan and ages fast.
- **"AI-agent involvement" disclaimer in PR description.** 1/10 (LangChain). Interesting attribution/governance signal; worth studying for Eric's `author: Eric Riutort` convention.
- **"Look First" / "modify over create" rule.** 1/10. Directly counters a known model failure mode.
- **GitHub account / repo-owner lock.** 1/10. Closest analogue Eric has to enterprise account enforcement without a tenant.

### 3.5 Notably absent — things outsiders would expect but that are rare or missing

- **Test commands beyond one-liners.** Anything like a real test matrix, CI command list, or coverage threshold is absent from 9/10. Managed CLAUDE.md should not try to carry test commands for multiple projects; commands belong at the project tier.
- **Brand / marketing guidelines, voice, tone rules.** 0/10. Not a developer-CLAUDE.md concern.
- **Data-handling / privacy / compliance reminders** (GDPR, HIPAA, PII). 0/10 in this sample. Anthropic's own managed-CLAUDE-vs-settings table explicitly names this as the right CLAUDE.md use case, so you'd *expect* to see it — but none of the OSS samples handle regulated data. Eric will have to invent this part.
- **File attribution / copyright / authorship rules.** 0/10. Eric's own global instructions mandate YAML frontmatter (`author: Eric Riutort`) and a copyright footer on every generated doc. No public CLAUDE.md I found mandates this. Genuinely novel and worth putting in the managed tier.
- **Dependency / vendor allowlists** ("don't add a new framework without approval"). Only the user-global template has this as "Hard No List" wording. Surprisingly absent from the rest.
- **Explicit appeal-to-architecture-docs** ("always check `docs/architecture_v0.4.0.md` before deciding X"). 0/10 in the public samples. Worth preserving when the managed-policy file is added.
- **Integrity / self-checks.** 0/10. No one builds this into the file itself.

### 3.6 Scope distinction: what changes for a managed-policy file

None of these 10 samples is a true managed-policy CLAUDE.md. Reading them as proxies, the content a managed-policy CLAUDE.md should **keep** is the cross-cutting, policy-flavoured material: the security "nevers," the commit/PR discipline, the attribution rule, the "don't add frameworks without justification" kind of constraint, and the "look first, modify over create" failure-mode counters. The content it should **drop** is everything tied to one repo: file layouts, build commands, architecture paragraphs, framework version pins, module names.

Practically, for Eric's setup that means the managed-policy file should look much more like the user-global template (#10) than like the project roots (#1–6). And it should stay short — the repeated 200-line / "HumanLayer keeps theirs under 60" benchmark is real; long files reduce adherence the same way long system prompts do.

---

## §4 Distribution / installer patterns for dev-environment bootstrapping

### 4.1 Dotfiles repos

**Mathias Bynens.** `github.com/mathiasbynens/dotfiles` is the archetype. Structure: flat repo with top-level dotfiles, a `.macos` script of `defaults write` commands, a `Brewfile`, and a `bootstrap.sh`. `bootstrap.sh` uses `rsync` to copy files from the repo to `$HOME`, excluding git metadata. Updates: `git pull` then `./bootstrap.sh`. The `.macos` script is the most-copied artifact.

**Paul Irish.** Paul's dotfiles predate Mathias's and focus on shell prompts and git config. Less elaborate install machinery.

**Zach Holman.** Holman's dotfiles introduced the `*.symlink` convention: any file named `foo.symlink` in the repo gets symlinked to `~/.foo` by the install script. Topic-per-directory structure (`git/`, `ruby/`, `zsh/`) with optional `install.sh` per topic. This convention is widely copied.

**Modern (2024–2026) pattern.** The contemporary defaults are:
- **chezmoi** for dotfile management (templating, secrets, per-host variation)
- **Homebrew Bundle** (`Brewfile`) for Mac packages
- **mise** or **asdf** for language-version management, per-project
- A short `install.sh` or `Makefile` that chains these together
- A `README.md` with prereqs

Trend over 15 years: less custom shell in the installer, more delegating to purpose-built tools.

**The `install.sh → symlink from repo into $HOME` pattern distilled.**
1. Clone repo to a stable location (`~/.dotfiles` or `~/code/dotfiles`).
2. Installer iterates over files in the repo and symlinks each to `$HOME/.filename`.
3. Existing files at the target are backed up (e.g., to `~/.dotfiles-backup/`) or the installer refuses.
4. Non-symlink setup (Homebrew, defaults writes, package installs) runs after symlinking.
5. Updates: `cd ~/.dotfiles && git pull && ./install.sh`. Because targets are symlinks to the repo, most files update automatically on `git pull` with no re-install needed; `./install.sh` is only needed when new files are added.

That last point matters for managed-CLAUDE.md: if the installer **symlinks** the managed file to the repo, `git pull` alone updates the live policy. If it **copies**, `./install.sh` must re-run. Symlinks are more elegant but fragile: move the repo and the symlink dangles.

### 4.2 Chezmoi

**Core idea.** Dotfiles manager written in Go. Single binary, no runtime deps. Source state (your repo) is transformed into target state (files in `$HOME`) via templates, with per-host and per-OS variation handled by template conditions. Secrets come from a password manager at apply time — never committed.

**What it solves that vanilla dotfiles don't.**
- **Templating.** A single `.gitconfig.tmpl` renders differently on work vs. personal machines.
- **Secrets.** Commit a template, resolve secrets at apply time, never commit plaintext.
- **Encrypted files.** Full-file encryption via age or gpg.
- **Dry-run and diff.** `chezmoi diff` shows what would change before applying.
- **Cross-platform.** Same repo works on macOS, Linux, Windows.

**Update flow.** `chezmoi update` = `git pull` in the source + `chezmoi apply`.

**Fit for 2-person Mac-only team.** Plausible but possibly over-engineered. The templating and secrets story is valuable if there's any per-host variation or any secret material. If the managed-CLAUDE.md is genuinely identical for both users and has no secrets, vanilla symlinks + `install.sh` is simpler.

### 4.3 GNU Stow

Symlink farm manager. `stow vim` reads `vim/.vimrc` and creates `~/.vimrc → vim/.vimrc`. Good for pure dotfile symlinking with no templating, no secrets, no conditional logic. Won't help with `/Library/Application Support/ClaudeCode/` because it's designed for `$HOME`.

### 4.4 Nix / home-manager / nix-darwin

Fully declarative system configuration. `nix-darwin` declares system-level Mac state (system packages, launchd daemons, defaults writes, files under `/etc/` or `/Library/`) declaratively, with atomic apply and rollback.

For a 2-person team where neither person is already a Nix user, adopting Nix to distribute one managed file is classic over-engineering. If either Eric or Fernando were already Nix users, this would flip — nix-darwin's `environment.etc."claude-code/CLAUDE.md".source = ./CLAUDE.md;` would be a one-liner. **Probably overkill**, noted.

### 4.5 Ansible / Chef / Puppet for developer machines

Config-management tools built for fleets of servers, repurposed for dev laptops. YAML playbooks. Power without the Nix learning curve, but with a heavyweight process feel. Good fit for teams of 50+; substantial overhead for 2.

### 4.6 Homebrew Bundle (`Brewfile`) + post-install scripts

`Brewfile` lists `brew`, `cask`, `mas`, and `tap` entries. Check into repo. Pair with a short post-install shell script for everything else (symlinks, `defaults write`, `git config --global`). Handles 80% of "new Mac setup" in a reviewed file. Combines cleanly with a dotfiles repo.

### 4.7 Devcontainers / VS Code Remote Containers / Docker / Nix flakes / devenv / mise / asdf

All project-scoped. None relevant to a **cross-project** managed Claude Code policy. Worth flagging only so the design doesn't reach for the wrong tool.

### 4.8 Common onboarding pattern (synthesized)

Across almost every pattern above that fits a 2-person Mac team, the onboarding flow converges on:

1. **README with prerequisites.** `xcode-select --install`, install Homebrew, have git, clone the repo to a known path.
2. **`install.sh` (or `make install`).** One command that does the work. Idempotent — safe to re-run.
3. **Post-install verification.** Either an explicit `./install.sh --check` flag, or a separate `./doctor.sh`. Confirms the expected files are in place and have expected content.
4. **Update mechanism.** `git pull && ./install.sh`. For symlink-based installers, `git pull` alone often suffices for content updates.

This is the pattern to match for managed-CLAUDE.md. Nothing exotic.

### 4.9 Mac-specific gotchas for the managed-CLAUDE.md installer

**`/Library/Application Support/` ownership.** This directory is root-owned (`root:admin`) on macOS, and `/Library/Application Support/ClaudeCode/` specifically is created by the Claude Code installer and owned by root. Any write requires `sudo`. Same pattern as `/etc/` on Linux.

**System Integrity Protection (SIP).** SIP protects `/System`, `/usr` (except `/usr/local`), `/bin`, `/sbin`. It does **not** protect `/Library/Application Support/`. Writing there with `sudo` is allowed. No SIP workarounds needed.

**The sudo prompt.** `install.sh` will need root for the managed-file write. Options:
- **Prompt once at the top.** `sudo -v` early to cache credentials. Cleanest UX. Credential cache lasts ~5 minutes by default.
- **Prompt per-command.** `sudo mkdir`, `sudo ln -s`, etc. Noisier but more auditable.
- **Re-exec as root.** Heavy-handed; the whole script runs as root, including git operations, which is risky and non-standard.

Standard pattern: `sudo -v` up front, targeted `sudo` on the privileged operations only. That keeps git operations in the user's identity.

**Symlink vs. copy at the managed path.**

| | Symlink to repo | Copy from repo |
|---|---|---|
| Update propagation | `git pull` is sufficient | Requires re-running `install.sh` |
| Dangling on repo move | Breaks | Unaffected |
| Dangling on repo delete | Breaks; Claude Code sees "file not found" | Unaffected |
| Visibility of source | `ls -la` reveals the repo path | Clean |
| Edit-in-place by user | Would edit the repo, obvious on next `git status` | Creates divergence that `./install.sh` would silently overwrite |
| Conceptual match | Reflects truth: the file **is** a repo artifact | Snapshot semantics |

For the 2-person good-faith case, **symlink is cleaner** — updates are automatic on `git pull`, and if a user edits the local file they're really editing the repo, which is the right mental model. Pick a stable repo location (e.g., `~/.claude-code-policy/` or `/opt/claude-code-policy/`) and document that moving it requires re-running the installer.

**Repo moves break symlinks silently.** Mitigate by having `./install.sh --check` verify the symlink target exists and the file is readable. Add it as a step in the weekly-ish workflow or run it at the top of every `install.sh` invocation.

**Gatekeeper on the shell script.** An unsigned shell script downloaded from the internet will, on a clean Mac, trigger Gatekeeper the first time it runs. Cloning from git bypasses this (git-cloned files don't get the quarantine xattr). Document the clone-then-run sequence and avoid instructions that tell the user to `curl | bash`.

---

## §5 Security best-practice validation of Eric's seven candidate controls

Methodological note: every subsection cites primary sources (tool docs, standards bodies, or named-author practitioner material) pulled during this research pass. For each candidate the section keeps a clean separation between what is a *norm* (belongs in CLAUDE.md as guidance the model tries to follow) and what is an *enforced control* (belongs in `managed-settings.json`, a git hook, or CI). Only the latter category gives mechanical guarantees; everything else is culture.

### §5.1 Attribution / copyright footers on generated docs

**Candidate as Eric drafted it.** Every doc Claude produces or substantially edits must carry `author: Eric Riutort`, `created: YYYY-MM-DD`, `updated: YYYY-MM-DD` in YAML frontmatter, plus a `© YYYY Eric Riutort. All rights reserved.` footer.

**What the best practice actually is.** The industry reference is the **REUSE Specification (FSFE), currently v3.3 (2024-11-14)**, built on SPDX short-form license identifiers. REUSE requires every Covered File to carry Licensing Information via one of three methods: (a) a comment header containing at least one `SPDX-FileCopyrightText:` and one `SPDX-License-Identifier:` tag, (b) a sibling `.license` file for uncommentable formats, or (c) an aggregating `REUSE.toml` that associates licensing with path globs. The canonical header:

```
# SPDX-FileCopyrightText: 2026 Eric Riutort <ericriutort@gmail.com>
# SPDX-License-Identifier: LicenseRef-Proprietary
```

Source: [REUSE Specification v3.3](https://reuse.software/spec-3.3/). The spec permits `LicenseRef-[idstring]` for non-SPDX-listed licenses, which is the hook for proprietary work — define `LICENSES/LicenseRef-Proprietary.txt` in the root and reference it. SPDX itself is maintained by the Linux Foundation; identifiers at [spdx.org/licenses](https://spdx.org/licenses/). The Linux Foundation endorses SPDX-License-Identifier headers as the low-friction way to solve license compliance at the source.

Enforcement tools, primary sources:

- **`reuse lint`** — FSFE REUSE Tool ([github.com/fsfe/reuse-tool](https://github.com/fsfe/reuse-tool)). Installable as `pipx install reuse`. Exits non-zero if any Covered File is missing licensing info. FSFE publishes a pre-commit hook.
- **`google/addlicense`** — Go binary that scans directory patterns recursively for copyright headers; supports `-check` mode for CI and `-s` for SPDX identifier injection ([github.com/google/addlicense](https://github.com/google/addlicense)).
- `licenseheaders` (Python) and `license-check` (Node/Go variants) exist but are less maintained; the two above are the current practitioner defaults.

Eric's YAML frontmatter format is **not** a REUSE/SPDX convention — it's a Jekyll/Hugo/Obsidian-style document header. There's no standardized machine-readable field for "updated" in SPDX; the closest is `SPDX-FileContributor:` combined with VCS log. For a private repo where the goal is authorship traceability rather than license compliance, YAML frontmatter is acceptable — but it is a parallel system to SPDX, not a replacement. If Eric ever open-sources a file, downstream tools (license scanners, SBOM generators, REUSE compliance CI) will not look at `author:`; they look at `SPDX-FileCopyrightText:`.

**Gotchas / failure modes.**
- The model silently omits the footer — dominant failure mode. No enforcement at the model layer.
- The `updated:` date goes stale. A pre-commit hook that rewrites `updated:` to today's date on any staged `.md` in `docs/` is the mechanical fix.
- Two systems of record diverge: YAML `author:` + copyright footer + git `author` + (hypothetical) SPDX `FileCopyrightText` can drift.
- "All rights reserved" does nothing under Berne (see §5.2) — signaling only.
- `addlicense` and `reuse lint` don't speak YAML frontmatter; they look for SPDX tags in comment blocks. Mechanical enforcement needs a custom regex hook.

**Where it should live.**
- **Managed CLAUDE.md (norm):** "When producing or substantially editing a doc in `docs/`, include YAML frontmatter with `author`, `created`, `updated` and a copyright footer." Advisory only.
- **Pre-commit hook (client-side enforcement):** small shell/Python hook that (a) fails if a staged `.md` in `docs/` lacks frontmatter keys `author` and `created`, (b) rewrites `updated:` to today's date with `sed -i`, then re-stages.
- **CI (server-authoritative):** same check in a GitHub Action on PRs touching `docs/**`. Survives `--no-verify`.
- **managed-settings.json:** not applicable — no permission lever enforces frontmatter.

**Minimum viable version for a 2-person team.** Skip REUSE/SPDX. Ship a 30-line pre-commit hook scoped to `docs/**/*.md` that checks for `^---\n` at top, `author:` and `created:` keys, and rewrites `updated: .*` to today's date. Mirror the check (without the rewrite) as a GitHub Action. Afternoon of work.

**Defer or skip at 2-person scale.** Full REUSE compliance; `addlicense` / `reuse lint` in CI; SPDX identifiers in `.py`/`.ts` files; `SPDX-FileContributor:` tracking (git already does this).

### §5.2 Confidentiality / proprietary notices

**Candidate as Eric drafted it.** All work is proprietary unless explicitly open-sourced. Every doc carries a `© YYYY Eric Riutort. All rights reserved.` footer as the confidentiality signal.

**What the best practice actually is.** Legal reality under U.S. law:

- **Copyright is automatic and attaches the moment a work is "fixed in a tangible medium"** — you get it whether you mark the file or not, a direct consequence of the U.S. joining the Berne Convention via the Berne Convention Implementation Act of 1988 ([17 U.S.C. chapter 4](https://uscode.house.gov/view.xhtml?path=/prelim@title17/chapter4&edition=prelim); [Cornell LII, "Berne Convention"](https://www.law.cornell.edu/wex/berne_convention)).
- **"All Rights Reserved"** is a vestige of the Buenos Aires Convention of 1910 and is legally unnecessary in any Berne signatory country today. It remains useful signaling: it tells downstream readers "do not assume an implied license," and under 17 U.S.C. § 401(d) a proper copyright notice (©, year, owner name) defeats an "innocent infringement" defense and preserves the full statutory damages range.
- **A properly formatted U.S. copyright notice has three elements**: the symbol © (or "Copyright" / "Copr."), the year of first publication, and the name of the copyright owner. Source: [SGR Law, "Protecting Proprietary Software with Copyright"](https://www.sgrlaw.com/ttl-articles/protecting-proprietary-software-with-copyright/); consistent with Copyright Office Circular 3.
- **The Software Freedom Law Center's guidance** ([Managing Copyright Information within a Free Software Project](https://softwarefreedom.org/resources/2012/ManagingCopyrightInformation.html)) is oriented at FOSS but establishes the same three-element notice and emphasizes that manually maintained notices are "prone to human error" — it recommends automated tooling (REUSE, SPDX) for this reason.
- **A confidentiality / proprietary notice is a separate thing from a copyright notice.** A copyright notice asserts ownership; a confidentiality notice asserts that the recipient is bound not to disclose. Confidentiality binds only people with whom you have a contract, NDA, or other legal relationship. Pasting "CONFIDENTIAL" on a file in a public GitHub repo binds no one. For actual confidentiality, the file needs to live somewhere access-controlled, and access needs to be gated by an NDA or employment agreement.
- **"Work for hire" is a U.S. doctrine (17 U.S.C. § 101)** under which, if a work was created by an employee within scope of employment OR is one of nine statutory categories commissioned under a written work-for-hire agreement, the employer — not the creator — owns the copyright. **Software is not in the nine statutory categories**, so a work-for-hire agreement alone is insufficient for software; an IP-assignment agreement is needed. If Fernando is a contractor (not W-2), the default is that **Fernando owns his contributions** unless there's a signed IP assignment. A notice saying `© Eric Riutort. All rights reserved.` on a file Fernando wrote is legally incorrect absent that agreement.

**Gotchas / failure modes.**
- False sense of security from a footer. "All rights reserved" is not a substitute for an LLC, a signed contributor agreement, or an NDA.
- "Implied license" risk if code is shared without a header. Headers reduce ambiguity.
- Fernando's IP. Without a signed IP-assignment, his commits carry his copyright and the `© Eric Riutort` footer is misleading.
- Year ranges drift. `© 2026 Eric Riutort` stays stamped forever unless rewritten. REUSE allows year ranges.
- The LLM will cheerfully insert `© Your Name` placeholders or leave the other party's notice in place when summarizing someone else's doc.

**Where it should live.**
- **Managed CLAUDE.md (norm):** "Every doc in `docs/` carries `© YYYY Eric Riutort. All rights reserved.` as the final line. Use the current year."
- **Top-level `LICENSE` or `NOTICE` file (legal canon):** single source of truth for license terms. Short, plain language: `Copyright (c) 2026 Eric Riutort. All rights reserved. This software is proprietary and confidential. No license, express or implied, is granted except as agreed in writing with the copyright holder.` This file is what matters if anyone argues about rights.
- **Contributor agreement (out-of-band):** signed IP assignment with Fernando, executed once, covering all contributions to the relevant repos. Without this, the copyright footer is cosmetic.
- **Pre-commit / CI (mechanical):** the frontmatter hook from §5.1 checks for the footer line. Don't ask the LLM to police it.
- **managed-settings.json:** not applicable — this is legal/policy, not permission.

**Minimum viable version for a 2-person team.** One `LICENSE` file at repo root (template above). One signed IP-assignment PDF between Eric and Fernando, stored in `docs/legal/`, covering all contributions to the current repo set. Footer-as-norm in CLAUDE.md; footer-as-check in the pre-commit hook from §5.1.

**Defer or skip at 2-person scale.** Bespoke proprietary license drafted by a lawyer; NDA language in every file; SPDX `LicenseRef-Proprietary`; dual-track "confidentiality footer" and "copyright footer."

### §5.3 Commit signing

**Candidate as Eric drafted it.** Commits on main must be signed.

**What the best practice actually is.** Three supported commit-signing systems on GitHub plus a fourth (gitsign) that layers on top:

- **GPG** — Git's original signing format; OpenPGP ([RFC 4880](https://www.ietf.org/rfc/rfc4880.txt)). Long-lived private keys, decentralized web of trust, no expiration unless set. GitHub supports GPG verification since 2016.
- **SSH** — added in git 2.34 (late 2021); GitHub verification in 2022. `git config --global gpg.format ssh; git config --global user.signingkey ~/.ssh/id_ed25519.pub`. Most devs already have SSH keys; integrates with 1Password and YubiKeys. No expiration on plain SSH keys. Source: [Ken Muse, "Comparing GitHub Commit Signing Options"](https://www.kenmuse.com/blog/comparing-github-commit-signing-options/).
- **S/MIME (X.509)** — certificates from a trusted CA; tooling `smimesign`. Useful for large orgs with a CA; overkill for two people.
- **gitsign (sigstore)** — keyless signing using short-lived Fulcio-issued x509 certs bound to an OIDC identity. Signatures stored alongside a Rekor transparency-log entry. Source: [github.com/sigstore/gitsign](https://github.com/sigstore/gitsign). Eliminates long-lived private keys. Trade-off: network dependency at commit time, OIDC ceremony. GitHub displays gitsign-signed commits as Verified.

**GitHub's "Verified" badge** means GitHub (a) found a cryptographic signature, (b) verified it against a key/cert the committer previously registered, and (c) the content hasn't been altered since signing. It does **not** prove identity in any absolute sense — only that they hold the private key GitHub associated with that account. If the private key was exfiltrated, "Verified" still shows. Source: [GitHub Docs, "About commit signature verification"](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification). GitHub shipped **persistent verification** 2024-11-12 in public preview — once verified at push time, Verified status is frozen against later key expiration/revocation.

**Anthropic's own practice on agent/skill signing.** Searched for public Anthropic statements on commit- or skill-signing; none found in the public docs or Claude Code GitHub pages as of 2026-04-22. Flagging as a gap.

**For a 2-person team: SSH signing is the pragmatic default.** Uses infrastructure already present, pairs with 1Password / hardware keys, no extra install. GPG is portable but has notoriously rough UX. Gitsign is the most secure model (no long-lived keys, audit log) but adds OIDC dependency per commit.

**Gotchas / failure modes.**
- "Must be signed" enforced only client-side is a suggestion. GitHub's branch protection "Require signed commits" is how you actually enforce it.
- Fernando's first commit breaks everything until signing is set up. Plan the onboarding.
- GitHub-UI merge commits are signed by the web UI key, not the authoring developer.
- Amending signed commits requires re-signing; rebase rewrites signatures.
- Lost keys = lost verified history (without persistent verification).
- "Verified" doesn't mean "safe" — malware on the dev laptop signs just fine.

**Where it should live.**
- **Managed CLAUDE.md (norm):** "Commits are signed. Use SSH signing per [internal setup doc link]." Advisory.
- **GitHub branch protection (server-authoritative):** "Require signed commits" on `main`. This is where enforcement actually lives. It's *not* in `managed-settings.json` — that file controls Claude Code's local permissions, not git-server policy.
- **Repo docs / onboarding:** document signing setup so adding a new dev is mechanical.
- **Pre-commit hook:** not needed — git + GitHub handles this natively.

**Minimum viable version for a 2-person team.** Both Eric and Fernando generate (or reuse) an SSH key. `git config --global gpg.format ssh; git config --global user.signingkey ~/.ssh/id_ed25519.pub; git config --global commit.gpgsign true`. Register the pubkey in GitHub Settings → SSH and GPG keys → *Signing keys* (separate slot from auth keys). Turn on Branch protection → main → Require signed commits. 15 minutes per person.

**Defer or skip at 2-person scale.** gitsign (revisit if stolen-laptop threat model becomes material); S/MIME; custom commit-verification CI; requiring signed tags until first release.

### §5.4 Pre-commit enforcement

**Candidate as Eric drafted it.** Never bypass pre-commit hooks with `--no-verify` on architecture docs.

**What the best practice actually is.** The canonical framework is **pre-commit** ([pre-commit.com](https://pre-commit.com/)). Its sibling repo [pre-commit/pre-commit-hooks](https://github.com/pre-commit/pre-commit-hooks) publishes the baseline hooks practitioners treat as table stakes:

- `check-yaml`, `check-json`, `check-added-large-files` (default 500 KB)
- `check-merge-conflict`, `end-of-file-fixer`, `trailing-whitespace`, `mixed-line-ending`
- `detect-private-key` — catches `-----BEGIN RSA PRIVATE KEY-----`
- `forbid-new-submodules` — useful if you don't use submodules

For an architecture-doc-heavy repo, add **markdownlint-cli2**, **yamllint**, **codespell**, and **detect-secrets** or **gitleaks** (§5.6). Example configs: FastAPI's and pandas's `.pre-commit-config.yaml` are representative.

**The `--no-verify` problem.** This flag tells git to skip client-side hooks. It exists on purpose as an emergency escape hatch ([git-scm.com/book/en/v2/Customizing-Git-Git-Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)). Consensus practitioner view:

> Client hooks can be bypassed. Organizations must rely on CI and server-side protections to make the block enforceable.

Practically, layered enforcement: editor integration (format-on-save) → pre-commit hook → CI re-runs the same hooks via [pre-commit.ci](https://pre-commit.ci/) or a GitHub Action doing `pre-commit run --all-files` → branch protection requires the CI check. pre-commit accepts `files:` and `exclude:` regex patterns to scope hooks to specific paths, but there is no per-path `--no-verify` distinction — if a dev uses `--no-verify`, all hooks are skipped. The only way to prevent a `--no-verify` bypass on a specific path is CI.

**Legitimate `--no-verify` cases.** Emergency hotfix when a hook is itself broken; WIP branches where lint failures are intentional; files that document lint failures deliberately.

**Gotchas / failure modes.**
- Hook slowness destroys adoption. Keep pre-commit under ~5 s. Skip type-checkers and test-runners on pre-commit.
- Out-of-date `rev:` pins. Have Renovate/Dependabot update `.pre-commit-config.yaml`.
- Hooks that auto-modify files fight the author. Warn about it.
- Version skew between local pre-commit and CI → "works on my machine."
- `.gitignore` + hook interaction; always scope with `files:` regex.

**Where it should live.**
- **Managed CLAUDE.md (norm):** "Never bypass pre-commit with `--no-verify` on `docs/architecture/**` or any commit to `main`." This shapes Claude Code's behavior when it's driving commits.
- **`.pre-commit-config.yaml` (client-side):** the actual hooks. Checked in, reviewed, versioned.
- **CI (server-authoritative):** a GitHub Action running `pre-commit run --from-ref origin/main --to-ref HEAD` on every PR. Block merge on failure via branch protection.
- **managed-settings.json hooks:** you *could* set a `hooks` entry that runs gitleaks / pre-commit on `Bash(git commit)` — survives `--no-verify` *for Claude Code's own commits* because the hook runs before the git operation. For Eric's and Fernando's manual commits, doesn't apply.

**Minimum viable version for a 2-person team.**

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: check-yaml
      - id: check-json
      - id: check-merge-conflict
      - id: check-added-large-files
      - id: end-of-file-fixer
      - id: trailing-whitespace
      - id: detect-private-key
  - repo: https://github.com/DavidAnson/markdownlint-cli2
    rev: v0.13.0
    hooks:
      - id: markdownlint-cli2
        files: \.(md|markdown)$
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks
```

Plus one GitHub Action running `pre-commit run --all-files`. Afternoon to set up, ~5 s per commit ongoing.

**Defer or skip at 2-person scale.** Policing `--no-verify` usage; server-side pre-receive hooks (GitHub.com doesn't offer them); commit-msg hooks (commitlint — see §5.5); heavy hooks on pre-commit (mypy, pytest, eslint-full) — keep those in CI.

### §5.5 Workflow compliance

**Candidate as Eric drafted it.** Architecture-doc changes must go through the `document-cm` skill and the WF-003 workflow.

**What the best practice actually is.** The meta-question: how do you enforce a human-followed process when the process is client-side? Honest answer from decades of practice: you can't entirely, but you can gate merge on artifacts the process produces.

Parallels:

- **Conventional Commits** ([conventionalcommits.org v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)) — client-side convention for commit messages. Enforcement via **commitlint** ([commitlint.js.org](https://commitlint.js.org/)) in a GitHub Action on the PR's commits. If a commit doesn't match the pattern, the check fails.
- **commitizen** — interactive prompt helping devs write conventional commits. Nudge, not gate.
- **release-please** (Google) — parses Conventional Commit messages on merged PRs to auto-generate release PRs. Downstream consumption of a convention, not enforcement.
- **changesets** — requires a human to add a `.changeset/` file in any PR that merits a release. CI check (`changeset status`) fails if a PR doesn't have one. Closest parallel to Eric's requirement: client-side workflow produces a machine-detectable artifact, CI gates on the artifact's presence.
- **semantic-release** — same family, fully automated.

All share the pattern: workflow is client-side and unenforceable directly, but it produces a detectable artifact CI can require.

Applied to Eric's `document-cm` / WF-003:

- **Trailer line in commit message.** E.g., `Workflow: WF-003` or `Document-Skill: document-cm@v1`. CI greps commits in the PR when it touches `docs/architecture/**`. Conventional-Commits model.
- **Specific file must be touched.** Any PR touching `docs/architecture/*.md` must also update `docs/architecture/CHANGELOG.md`. CI fails otherwise. Changesets model.
- **Signed attestation file.** Skill writes `.attestation/<sha>.json` with `{skill, version, timestamp}`, optionally sigstore-signed. CI verifies.
- **PR template filled by the skill.** CI checks the PR body for required sections.

See [DeployHQ, "Conventional Commits Guide"](https://www.deployhq.com/blog/conventional-commits-a-standardized-approach-to-commit-messages) for the "gentle guidance (editor) → assertive help (hook) → definitive enforcement (CI)" layering.

**Gotchas / failure modes.**
- The skill is a suggestion; a disciplined human can do the work by hand and claim they used the skill. Trailer-line checks are spoofable.
- Skill drifts from gate — if `document-cm` changes artifact format but CI still looks for the old one, commits pass that shouldn't.
- Claude Code can't always run the skill (e.g., vanilla session without the plugin); constraint silently violated.
- "Must go through workflow X" is a culture statement, not a control. At 2 people with mutual trust, the norm suffices; a third person changes the calculus.

**Where it should live.**
- **Managed CLAUDE.md (norm):** "Architecture-doc changes (any file under `docs/architecture/`) go through the `document-cm` skill and follow WF-003."
- **Skill definition (executable):** the skill is where the workflow actually lives. Drops a trailer or writes an attestation file.
- **CI (authoritative gate):** GitHub Action with path filter on `docs/architecture/**` checking for the required trailer or artifact.
- **managed-settings.json hook:** could refuse `Write`/`Edit` to `docs/architecture/**` if the session isn't carrying `document-cm` context. Strongest Claude-Code-side enforcement but requires custom hook code.

**Minimum viable version for a 2-person team.** Keep the norm in CLAUDE.md. **Skip the CI gate until you have a third contributor.** At 2 people, the friction of building and maintaining the gate exceeds the cost of occasional forgetting — review each other's PRs and call it out. When you do add the gate: a 20-line GitHub Action that greps `git log -1 --format=%B` for `Workflow: WF-003` on the HEAD commit of any PR touching `docs/architecture/**`.

**Defer or skip at 2-person scale.** Signed attestations (sigstore/gitsign for workflow attestation is interesting at scale); PR-template gates; a full workflow engine; gating on "the skill was invoked in this session" (signal isn't portable).

### §5.6 Secret scanning

**Candidate as Eric drafted it.** gitleaks must pass before any push.

**What the best practice actually is.** Four tools worth naming:

- **gitleaks** ([github.com/gitleaks/gitleaks](https://github.com/gitleaks/gitleaks)) — single Go binary, 150+ built-in patterns, fast. Published pre-commit hook. Best-in-class for fast local blocking. MIT licensed.
- **trufflehog** ([github.com/trufflesecurity/trufflehog](https://github.com/trufflesecurity/trufflehog)) — 800+ detectors and, crucially, credential verification (calls the service's API to confirm whether a detected key is live). Heavier, slower, more false-positive-resistant. Best for periodic deep scans.
- **detect-secrets** (Yelp, [github.com/Yelp/detect-secrets](https://github.com/Yelp/detect-secrets)) — baseline-based: run once to produce `.secrets.baseline` of existing false-positives, then CI fails only on *new* secrets. Best for legacy/brownfield codebases.
- **GitHub Secret Scanning** (free for public repos; Advanced Security for private) — catches secrets *after* push, alerts GitHub and often the secret's issuer directly. Last line of defense.

Consensus 2024–2026 practitioner recommendation: **gitleaks in pre-commit + gitleaks in CI + GitHub native secret scanning, with occasional trufflehog sweeps.** Sources: [Rafter](https://rafter.so/blog/secrets/secret-scanning-tools-comparison), [Jit](https://www.jit.io/resources/appsec-tools/trufflehog-vs-gitleaks-a-detailed-comparison-of-secret-scanning-tools), [GitGuardian](https://blog.gitguardian.com/secret-scanning-tools/).

**Rollout order:** CI first (catches everything on trunk, can't be bypassed with `--no-verify`); pre-commit second (catches before push); GitHub native third (belt-and-suspenders).

**False-positive management:** gitleaks `.gitleaks.toml` with `[allowlist]`; detect-secrets `.secrets.baseline`; trufflehog `--exclude-paths`. False positives kill adoption when devs get blocked more than once or twice a week. Fix by curating the allowlist, not disabling the scan.

**Gotchas / failure modes.**
- Staged-only scanning misses history. gitleaks `protect` scans staged; `detect` scans history. Pre-commit → `protect`; CI → `detect` on PR range.
- Binary files and LLM-generated example tokens (`sk-ant-api03-...` in a doc) will fail the scanner. Use obvious placeholders like `XXX-EXAMPLE-KEY-XXX` or allowlist.
- Baseline drift on detect-secrets. Regenerate on cadence with review.
- `.env` committed by accident. Always `.gitignore`; always scan.
- Rotating after a leak is the hard part; the scanner catches it, the response is a runbook.

**Where it should live.**
- **Managed CLAUDE.md (norm):** "No secrets in commits. `.env` files in `.gitignore`, reference via environment variables. Run `gitleaks detect` if you suspect accidental commit."
- **Pre-commit hook (client-side):** gitleaks.
- **CI (server-authoritative):** gitleaks runs on the PR.
- **GitHub Secret Scanning (safety net):** toggle on.
- **managed-settings.json hooks:** PostToolUse hook runs gitleaks on Claude-Code-originated `Write`/`Edit` to catch model-generated secrets.

**Minimum viable version for a 2-person team.** Add gitleaks to `.pre-commit-config.yaml`. Add `gitleaks/gitleaks-action@v2` to GitHub Actions. Turn on GitHub's free native secret scanning (Settings → Code security). Write a 1-page incident runbook at `docs/security/secret-leak-runbook.md` (revoke → rotate → audit → document).

**Defer or skip at 2-person scale.** GitHub Advanced Security; trufflehog in CI on every PR (run manually monthly on full history); custom allowlist entropy tuning (defaults are fine until pain); detect-secrets unless you have a legacy codebase to grandfather; SIEM integration.

### §5.7 File format rules

**Candidate as Eric drafted it.** Only `.md`, `.py`, `.json`, `.yaml`, `.yml` in `docs/` and `skills/`.

**What the best practice actually is.** No off-the-shelf "file-type allowlist" tool fits this narrow case. Practitioner-standard techniques:

- **`.gitignore`** stops accidental binary commits. Necessary but not sufficient.
- **`check-added-large-files`** catches binary-blob-as-a-file by size.
- **`forbid-new-submodules`** catches accidental submodule introduction.
- **`check-executables-have-shebangs`** / **`check-shebang-scripts-are-executable`** — catch wrong-mode scripts.
- **Custom file-type gate** via a pre-commit `local` hook:
  ```yaml
  - repo: local
    hooks:
      - id: docs-file-types
        name: Allow only approved extensions in docs/ and skills/
        entry: ./scripts/check-file-types.sh
        language: script
        files: ^(docs|skills)/.*$
  ```
- **editorconfig-checker** ([github.com/editorconfig-checker/editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker)) checks `.editorconfig` compliance (indent, line endings, EOF, max line length, trailing whitespace). It does **not** enforce file-type allowlists — practitioners frequently misread this.
- **`.gitattributes` tricks** — `* binary` plus per-pattern text overrides changes diff/merge behavior, not content filtering.
- **CODEOWNERS on `docs/*`** forces PR review on changes, giving a human gate.

**Glob-pattern sharp edges (relevant to Eric's 5-extension list):**

- `*.yml` does not match `*.yaml`. Kubernetes/Ansible skew `.yaml`, GitHub Actions skews `.yml`. Eric's list correctly includes both.
- Case sensitivity. `*.MD` is a different glob from `*.md` on case-sensitive filesystems (Linux CI). Normalize to lowercase and reject others.
- Hidden files. `*` in bash doesn't match dotfiles by default; `**/.*` is needed. A hook using `find docs -type f` without `! -name '.*'` will include `.DS_Store`.
- Extension-less files (`README`, `LICENSE`, `Makefile`, `Dockerfile`). Allowlist either blesses specific filenames or rejects them.
- Binary-file accidents. Pasted images save as `.png` next to markdown. Extension-based allowlists catch this.

**Gotchas / failure modes.**
- Extension is not content. A `.md` file that's actually mislabeled binary passes. Pair with `check-added-large-files`.
- Overbroad allowlists = no enforcement. Adding `.txt` "just this once" creates a hole.
- CI vs pre-commit scope drift — different `files:` regex behavior between tools.
- Generated artifacts in `docs/_build/` fire the rule. Don't commit generated output or scope to exclude.
- Skills that need other formats (`skills/my-skill/assets/logo.png`). Expand allowlist with scope (`*.png` only under `skills/*/assets/`) or move assets.

**Where it should live.**
- **Managed CLAUDE.md (norm):** "Files under `docs/` and `skills/` must be one of: `.md`, `.py`, `.json`, `.yaml`, `.yml`. Binary assets go in `docs/assets/` or `skills/<skill>/assets/` and must be approved."
- **Pre-commit hook (client-side):** `local` hook scoped to `files: ^(docs|skills)/` rejecting non-allowlisted extensions.
- **CI (server-authoritative):** same check in a GitHub Action.
- **`.gitattributes`:** `* text=auto eol=lf` for line-ending hygiene.
- **`.editorconfig` + `editorconfig-checker`:** orthogonal to the type gate, a cheap complement.

**Minimum viable version for a 2-person team.** One local pre-commit hook, ~15 lines of bash:

```bash
#!/usr/bin/env bash
set -euo pipefail
FAILED=0
while IFS= read -r f; do
  case "$f" in
    *.md|*.py|*.json|*.yaml|*.yml) ;;
    *) echo "Disallowed file type in docs/ or skills/: $f"; FAILED=1 ;;
  esac
done < <(git diff --cached --name-only --diff-filter=ACM | grep -E '^(docs|skills)/')
exit $FAILED
```

Wire into `.pre-commit-config.yaml` as a `local` hook. Mirror as a GitHub Action using `git diff --name-only origin/main...HEAD`.

**Defer or skip at 2-person scale.** editorconfig-checker until format drift appears; `.gitattributes` per-file rules; full MIME sniffing; enforcement on `assets/` unless pain appears; "find & reject legacy" sweep — fix forward.

### §5.8 Summary table: where each candidate should live

| # | Candidate | Managed CLAUDE.md | managed-settings.json | Pre-commit | CI | Other |
|---|---|---|---|---|---|---|
| §5.1 | Attribution / copyright footers | **Yes** (norm: frontmatter & footer) | No | **Yes** (frontmatter check + auto-bump `updated:`) | **Yes** (mirror) | Optional: REUSE/SPDX later |
| §5.2 | Confidentiality / proprietary notices | **Yes** (norm: footer text) | No | **Yes** (footer presence check, reuses §5.1 hook) | **Yes** (mirror) | **Required:** `LICENSE` file + signed IP assignment |
| §5.3 | Commit signing | **Yes** (norm: "commits are signed") | No | No (git-native) | No (git-native) | **Required:** GitHub branch protection "Require signed commits" on `main`; SSH signing config per dev |
| §5.4 | Pre-commit enforcement | **Yes** (norm: no `--no-verify` on main) | Optional: Claude-Code hook runs pre-commit before its own commits | **Yes** (baseline hooks) | **Yes** (`pre-commit run --all-files` on PR) | Branch protection requires CI pass |
| §5.5 | Workflow compliance (`document-cm` / WF-003) | **Yes** (norm: "use the skill") | Optional: hook refuses `Write`/`Edit` to `docs/architecture/**` without skill context | No | **Defer** until 3rd contributor; then trailer-line check | Skill itself is the workflow |
| §5.6 | Secret scanning (gitleaks) | **Yes** (norm: no secrets in commits) | Optional: PostToolUse hook runs gitleaks on Claude-written files | **Yes** (gitleaks) | **Yes** (gitleaks-action) | GitHub native scanning on; 1-page leak runbook |
| §5.7 | File format allowlist | **Yes** (norm: extension list) | No | **Yes** (local hook, 15-line bash) | **Yes** (mirror) | `.gitignore` for common junk |

**Key takeaway.** Four of the seven candidates (attribution, confidentiality, pre-commit, secrets, file types) follow the same three-layer pattern: **norm in CLAUDE.md → hook client-side → check in CI**. Commit signing is the odd one — lives entirely in git/GitHub infrastructure. Workflow compliance is the one where at 2-person scale **you should not build the gate yet** — norm suffices.

---

## §6 What to avoid in managed policy (anti-patterns)

This section catalogs the failure modes a machine-wide Tier-1 `CLAUDE.md` is prone to. Each item is sourced from Anthropic's own documentation, OWASP guidance, or practitioner reports. The governing frame, stated by Anthropic's memory documentation, is this: *"CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself. Claude reads it and tries to follow it, but there's no guarantee of strict compliance, especially for vague or conflicting instructions."* Everything below follows from that single property: **advisory, not enforcement**.

### §6.1 Length creep past the adherence threshold

Anthropic's `code.claude.com/docs/en/memory` documentation is explicit that file length trades directly against adherence. Two quotes from that page matter:

- *"Files over 200 lines consume more context and may reduce adherence."*
- *"CLAUDE.md files are loaded in full regardless of length, though shorter files produce better adherence."*

HumanLayer's practitioner guide sharpens this to an operational rule: frontier models reliably follow ~150–200 total instructions — beyond that, adherence drops uniformly. Anthropic's "Effective context engineering for AI agents" post frames the same phenomenon as an "attention budget" drawn down by every token in context. In Claude Code terms, the harness itself consumes on the order of 50 instructions before the user adds anything, so a Tier-1 file is spending adherence that every skill, subagent, and project-level `CLAUDE.md` will need later. The anti-pattern: writing the machine-wide file as an aspirational coding standard. The managed file should contain only rules that (a) cannot be set at the project level and (b) actually change Claude's behavior in measurable ways. Everything else — tone, formatting, commit style — belongs in project files or skills.

### §6.2 Instruction contradictions across the CLAUDE.md stack

Claude Code concatenates memory files: managed → user (`~/.claude/CLAUDE.md`) → enterprise project → project `CLAUDE.md` → directory-level → `CLAUDE.local.md`. The memory doc is explicit that *"All discovered files are concatenated into context rather than overriding each other,"* and warns maintainers to *"Look for conflicting instructions across CLAUDE.md files. If two files give different guidance for the same behavior, Claude may pick one arbitrarily."*

Two practical consequences for a Tier-1 file:

1. **Any rule Eric writes machine-wide becomes the default for every future project**, including ones not yet scaffolded. If a future client has a contradicting `CLAUDE.md`, Claude's behavior becomes position- and recency-dependent. Practitioner reports (Claude Code issue on plan mode ignoring `CLAUDE.md` fail-fast policies; Augusteo's "The CLAUDE.md Said 'Never Use npm.' Claude Used npm Anyway") show salient in-session errors routinely overwhelm standing rules, especially rules phrased in absolutes.
2. **Contradictions emerge silently over months** as project CLAUDE.md files evolve. The Tier-1 file is frozen in Eric's mental model; project files aren't. An audit cadence is required.

Mitigation: make the managed file narrowly non-overlapping with anything a project file would naturally say. If it can belong in a project file, it belongs in a project file.

### §6.3 Embedding code snippets or runtime handlers

The widely-circulated `ucsandman/CLAUDE.md` global template embeds Node-level directives — a copy-paste `process.on('unhandledRejection', ...)` handler, a "fail fast, never swallow errors" philosophy. On a machine-wide file, this is actively harmful:

1. An `unhandledRejection` handler calling `process.exit(1)` is legitimate for some services and terrible for others (long-running dev servers, test harnesses that need to finalize reports, Electron mains). Baking it into Tier-1 means Claude will try to inject it into every Node codebase on this machine, violating existing error-propagation contracts.
2. Code in policy files competes for the same attention budget as policy. Anthropic's guidance that *"Specific, concise, well-structured instructions work best"* is incompatible with 30-line code blocks that are implementation opinions dressed as governance. If a pattern is genuinely universal, it belongs in a skill or hook (which activates only when relevant), not a file that loads on every session regardless of stack.

Principle: a managed policy file should state *what* behavior is required, not demonstrate *how* to write it. Runtime handlers are *how*, and they date quickly.

### §6.4 Pinning tool or runtime versions machine-wide

A Tier-1 line like "Use Node 22" applies to every repo on the machine — including a legacy client project pinned to Node 18, or a serverless project locked to Node 20 by its Lambda runtime. Node version assertions belong at the project level, and the ecosystem has four overlapping mechanisms:

- `.nvmrc` / `.node-version` — per-directory, read by nvm, fnm, asdf, mise, Volta.
- `.tool-versions` — asdf's native format, also read by mise.
- `mise.toml` — mise's native format, supports multi-language pins.
- `package.json` `engines` field — advisory by default; enforcing when `engine-strict=true`.

Published guidance across these tools is consistent: the version pin lives next to the code, not in a user's global config. A Tier-1 `CLAUDE.md` has no way to know which of these files is authoritative for the current repo, so it shouldn't assert a version at all. The correct Tier-1 rule, if any, is meta: "respect the project's `.tool-versions` / `.nvmrc` / `engines`; do not introduce a different version without the user's go-ahead." Portable. "Use Node 22" is not.

Python, Ruby, and Go have the same structure (`.python-version` + `pyproject.toml`, `.ruby-version` + `Gemfile`, `go.mod`'s `go` directive). Same answer: pin at the repo, not the machine.

### §6.5 Commands in managed policy

"Run `pnpm test`" is a machine-wide hazard for the same reason: a project-scoped fact asserted at the wrong tier. The community has documented this failure mode at length — Augusteo's "The CLAUDE.md Said 'Never Use npm.' Claude Used npm Anyway," Chase Adams's "Why Claude Code Defaults to pnpm." The recurring pattern: Claude Code's built-in priors lean toward `npm`, so when the session context fills with errors, the standing "use pnpm" rule gets overridden by the more salient immediate signal. Direct consequence of CLAUDE.md being advisory.

Right separation:

- **Project-level** (repo `CLAUDE.md`): "Package manager is pnpm. Test command is `pnpm test`. Lockfile is `pnpm-lock.yaml`."
- **Machine-level** (Tier-1 managed): at most a meta-rule: "Detect the project's package manager from its lockfile before running install or test commands; never introduce a different lockfile."
- **Better than either**: a hook or a lockfile-detecting wrapper (`ni`) that removes the judgment from the model entirely.

A managed file should not name any specific `test`, `build`, `lint`, `install`, `fmt`, or `run` command.

### §6.6 Subagent and model-selection rules

"Use Opus for architecture, Sonnet for implementation, Haiku for edits" sounds disciplined and ages terribly. Three specific decay vectors:

1. **Model names churn quarterly-to-semiannually.** As of April 2026, Anthropic's API aliases resolve `opus` to Opus 4.7 and `sonnet` to Sonnet 4.6; Bedrock/Vertex/Foundry resolve the same aliases to different underlying versions. A file saying `claude-opus-4-5` is wrong within months. A file saying `opus` is ambiguous across clouds.
2. **Plan availability varies by account.** Users whose accounts don't have the latest model enabled will silently hit fallbacks.
3. **Workload-optimal model selection is workload-specific**, and Claude Code already exposes primitives for the pattern the rule is trying to encode — `opusplan` alias, per-subagent model configuration. The Tier-1 file shouldn't duplicate.

Anthropic's model-configuration docs direct users to set preferences through settings and env vars (`ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_DEFAULT_SONNET_MODEL`) and the `/model` command — not memory files. That's the right layer: structured data the harness reads deterministically, not natural-language guidance the model may or may not follow. The Tier-1 rule: don't put model names in prose.

### §6.7 Attribution rules and the open-source contribution conflict

Eric's project-level CLAUDE.md says "every doc carries `© [year] Eric Riutort`." Correct for this repo. Hoisted to Tier-1, it becomes policy that will try to stamp his copyright header on every file edited on the machine — including PRs to Django, a bugfix to a coworker's repo, or a patch to Fernando's own OSS project.

The Claude Code issue tracker already contains one filed case of this class: issue #30148 reports Claude Code autonomously creating a `LICENSE` file even though the project's own CLAUDE.md said the repo was private. The broader pattern — AI agent assigning authorship or licensing terms that violate the target project's CLA or DCO — is something open-source maintainers are starting to flag.

Attribution rules should therefore:

- **Live at project level, not Tier-1.**
- **Be guarded by detection** if any machine-wide rule is wanted: "Before adding any copyright, license, or author metadata, check whether the current repo is one I own (via `git remote -v` or the presence of my name in existing headers). If it is not mine, do not add attribution without explicit confirmation." Degrades correctly in unknown repos.
- **Never hardcode a single human name.** "Eric Riutort" is wrong for every file Fernando touches on his own machine if the Tier-1 policy is shared.

Practitioner discussion on this is thin — the conflict is new enough that the ecosystem hasn't converged on a convention. General principle from CLA-aware tooling (Renovate, DCO bots): authorship assertions need per-repo context, not a global default.

### §6.8 Secrets, internal URLs, and project codenames in policy

OWASP's LLM Top 10 2025 reorganized disclosure risk: "Sensitive Information Disclosure" (old LLM06) moved to LLM02, and a new LLM07 was added specifically for "System Prompt Leakage." The OWASP LLM07 entry is blunt:

> *"The system prompt should not be considered a secret, nor should it be used as a security control. Accordingly, sensitive data such as credentials, connection strings, etc. should not be contained within the system prompt language."*

The same logic applies to CLAUDE.md, which loads into model context on every session. Concrete things people mistakenly put in CLAUDE.md that OWASP's guidance calls out:

- **API endpoints and internal URLs.** "The staging environment is `https://internal-staging.acme.corp`" telegraphs topology to anything that later compromises the context (prompt injection via a PR title, logs, third-party MCP servers).
- **Project codenames.** If confidential, it leaks. If not, doesn't need to be there.
- **"Don't commit the key in `/var/secrets/prod.env`."** Self-defeating — the instruction reveals the path it's trying to protect.

Recent incidents make the threat concrete. VentureBeat reported in 2026 that a malicious PR title caused Anthropic's Claude Code Security Review action to post its own API key as a comment; the same injection worked against Gemini CLI Action and GitHub's Copilot Agent. Common factor: treating prompt surfaces as private when they're not. The LangChain "lc" leak (CVE-level, 9.3 CVSS) demonstrated that anything reachable from the prompt is extractable.

Operational rule: **assume every byte of the managed `CLAUDE.md` is eventually public.**

### §6.9 Contradicting Claude Code's own system prompt

Anthropic's memory documentation notes CLAUDE.md *"is delivered as a user message after the system prompt, not as part of the system prompt itself."* Claude Code's system prompt already encodes rules about tone, safety, tool-use conventions, honesty, and output format. Specific contradictions that emerge when users fight these:

- **Emoji rules.** A managed file saying "use emoji for status markers" conflicts with Claude Code's subagent launch prompt, which explicitly says the assistant must avoid emojis. Sub-agent issue #30730 documents this collision; the injected notes' "MUST" language, positioned late in the prompt, often wins.
- **Brevity vs. reasoning.** Claude Code's system prompt enforces brevity ("Try the simplest approach first"); a Tier-1 rule demanding exhaustive chain-of-thought fights this.
- **Safety/honesty rules.** Any Tier-1 instruction asking Claude to soften, omit, or flatter will lose to the system prompt's honesty rules, but partial and session-dependent.

Guidance: the Tier-1 file should **not** attempt to override anything the Claude Code system prompt already handles. Layer orthogonal guidance — things the system prompt says nothing about ("architectural decisions live in `docs/`") — rather than compete with it.

### §6.10 Enforcement theater

Single most common category error. Writing "NEVER push to main" in CLAUDE.md is not a control. Claude will *try* to follow it; one plausible in-session error, one explicit user override, one sub-agent with different instructions, and the rule is broken. Anthropic's memory doc is careful: *"Claude reads it and tries to follow it, but there's no guarantee of strict compliance."*

Actual enforcement lives elsewhere:

- **`permissions.deny` in `managed-settings.json`**: *"Deny rules prevent Claude Code from using the specified tool. The first matching rule wins, so deny rules always take precedence."*
- **`permissions.disableBypassPermissionsMode: "disable"`**: prevents bypass mode.
- **Server-managed settings and MDM delivery**: cannot be overridden by user or project settings.
- **GitHub branch-protection rules**: only thing that actually stops a push to `main`.
- **Pre-commit / pre-push hooks**: catch local violations deterministically.
- **CI required checks**: block the merge regardless of what the agent did.

Anti-pattern: treating CLAUDE.md as a substitute for any of these. Useful discipline: for every "NEVER" or "ALWAYS" rule tempted into the managed file, ask "what actually stops this if Claude ignores it?" If the honest answer is "nothing," the rule is enforcement theater and either (a) belongs in `managed-settings.json` / server config, or (b) should be phrased as guidance, not prohibition. A file full of "NEVER" clauses not backed by real controls trains the reader (Eric, Fernando, Claude) to stop taking "never" literally — worse than not having the rule.

### §6.11 Stale-by-design content

Anything with a short half-life poisons a file loaded on every session for years. Categories that decay within 3–6 months:

- **Model names and aliases.** `claude-opus-4-5`, `claude-sonnet-4-6`, `opusplan` (renamed/added in point releases).
- **Skill and plugin names.** The Claude Code changelog shows skills getting renamed, deprecated, collided-with ("Unknown skill: commit" for users without a custom `/commit`; plugin-name collisions in sub-agent frontmatter).
- **Pricing and plan-tier language.** "Opus is for Pro users" dates within one plan change.
- **"As of 2025" phrasing.** Self-timestamping makes the file look stale even when content is correct.
- **URL paths.** `docs.anthropic.com/...` redirected to `platform.claude.com/docs/...` and `code.claude.com/docs/...` within the last release cycle.
- **Feature flags and beta names.** "beta," "preview," or "experimental" — all going to be renamed or promoted.

Durable rule: **reference mechanisms, not names.** "Use the project's configured subagent" is durable. "Use the `planner` subagent" is not. "Consult `managed-settings.json` for permission policy" is durable. "Run `/permissions`" may not be.

### §6.12 Platform-specific assumptions and dead branches

Eric and Fernando are a Mac-only team. Tier-1 content should not:

- **Describe Windows-specific paths or commands** (`cmd`, `PowerShell`, `%APPDATA%`, drive letters).
- **Assume Linux paths that don't exist on macOS** (`/etc/os-release`, `systemctl`, `apt`).
- **Assume specific shell features** (zsh is the macOS default; a rule saying "source `~/.bashrc`" is wrong on fish or pure zsh).

Reverse failure mode is also real: *removing* all platform detail in the name of portability leaves Claude guessing. Right posture: keep the managed file platform-neutral where possible, push platform-specific guidance down into project-level or machine-local (`~/.claude/CLAUDE.md`) files that Fernando can maintain independently. The Tier-1 file should be safe to share verbatim with any future team member on any OS.

### Forbidden-content checklist

Use this when reviewing drafts of the managed `CLAUDE.md`. If any item appears, move it, delete it, or convert it to a managed-settings / hook / skill surface.

- No rule longer than ~200 lines total (trim aggressively; move to project files or skills).
- No specific model name (`claude-opus-4-5`, `claude-sonnet-4-6`) or Claude-Code-era alias.
- No specific skill, plugin, subagent, or slash-command name.
- No tool/runtime version pin (Node/Python/Ruby/Go) — delegate to `.tool-versions`, `.nvmrc`, `engines`.
- No package manager assertion (`pnpm`, `npm`, `yarn`, `bun`) or build/test/lint command.
- No executable code snippets, Node handlers, error-handling boilerplate.
- No API endpoints, internal URLs, environment names, or project codenames.
- No secret paths, vault locations, or "don't commit the key in X" self-defeating hints.
- No hardcoded single-person attribution (copyright, author name) — scope per-repo.
- No absolute "NEVER / ALWAYS" prohibition whose only enforcement is the CLAUDE.md line itself.
- No rule duplicating or contradicting Claude Code's own system prompt (emoji, tone, brevity, safety).
- No rule that will collide with likely future project-level `CLAUDE.md` content (indent, quote style, commit format — all project-scoped).
- No Windows-only or Linux-only paths/commands; no deep shell assumptions.
- No deep links into Anthropic docs that will rot on the next IA change.
- No "as of 2025/2026" phrasing or plan-tier references.
- No instructions about the managed file itself ("always check this file before X") — circular.

If a candidate line fails the checklist, the right question is "what layer *does* this belong in?" — project `CLAUDE.md`, `~/.claude/CLAUDE.md` (personal user-scope), `managed-settings.json` (enforced), a skill (on-demand), a hook (deterministic), or outside Claude Code entirely (branch protection, CI, git hooks).

---

## §7 Proposed managed-policy content (revised, copy-ready)

The draft below reflects every finding from §1–§6. It is approximately 60 lines of substantive content (well under Anthropic's 200-line soft cap). It is platform-neutral, contains no model names, no version pins, no specific commands, no internal URLs or codenames, and no "NEVER" clauses whose enforcement depends on the file itself. Attribution is scope-guarded (§6.7). Workflow compliance is phrased as a norm, not a gate (§5.5). Enforcement surfaces are explicitly named so readers know where real controls live (§1.7, §6.10).

Paste as-is into the installer repo's `CLAUDE.md` file. Review quarterly against the Forbidden-content checklist in §6.

```markdown
# Claude Code — shared architect policy

Advisory guidance loaded on every Claude Code session. This file states how the
architect team works; it does not enforce it. Hard controls (tool permissions,
sandbox, deny rules) live in `managed-settings.json` in the same directory.
Legal controls (license, IP assignment) live in repo `LICENSE` files and signed
agreements outside this file.

## Authoring and attribution

For documents produced in repos the architect team owns, begin with YAML
frontmatter (`author`, `created`, `updated` — ISO dates) and end with a
copyright footer of the form `© <year> <owner>. All rights reserved.` Use the
current year. Use the repo's declared owner (named in the repo's `LICENSE` or
top-level `README`); do not assume a single person's name applies to every
repo.

Before adding copyright, license, or author metadata, check whether the current
repo is one the team owns — detect via `git remote -v` and existing headers.
If the repo is not owned by the team, do not add attribution without explicit
confirmation from the user.

## Confidentiality

Unless a repo carries an explicit open-source `LICENSE` at its root, treat its
content as proprietary. Do not quote, summarize, or paste repo content into
external surfaces (public web tools, gists) without confirmation. Do not write
internal URLs, environment names, credential paths, or project codenames into
this file, into any project `CLAUDE.md`, or into commit messages.

## Commits

Sign commits. Use the signing method configured in each user's `~/.gitconfig`.
Commits should be small and single-purpose; separate commits for code changes,
formatting changes, and dependency updates. Do not commit secrets. `.env*`
files are gitignored by default; if a secret is needed, reference it by name
via environment variables, never by value.

Do not force-push to a branch named `main`, `master`, or matching `release/*`.
When history needs rewriting, rebase and open a PR.

## Workflow for architecture docs

Architecture-doc changes (any file under `docs/architecture/`) go through the
team's documented architecture-doc workflow. Do not edit architecture docs
in-place without the workflow's review steps.

## Respect for project-declared tooling

Before running an `install`, `test`, `build`, or `lint` command, detect the
project's package manager from its lockfile and use the matching tool. Never
introduce a different lockfile.

Respect the project's declared runtime version, discoverable from files like
`.tool-versions`, `.nvmrc`, `.node-version`, `.python-version`, `Gemfile`, or
`go.mod`. Do not suggest an upgrade unless the user asks.

## File discipline

In `docs/` and `skills/` directories, only write `.md`, `.py`, `.json`,
`.yaml`, or `.yml` files. Binary assets (images, PDFs, archives) go in an
`assets/` subdirectory and require user approval before adding.

Do not bypass pre-commit or pre-push hooks with `--no-verify` on commits to
`main` or on any change under `docs/architecture/`. If a hook is blocking
legitimate work because the hook itself is broken, fix the hook in the same
commit rather than bypassing.

## Scope of this file

This file states *norms* the model should try to follow. Real enforcement lives
in:

- The sibling `managed-settings.json` for Claude Code's permission deny rules,
  sandbox configuration, and forced authentication.
- Each repo's `.pre-commit-config.yaml` and `.github/workflows/` for
  client-side and CI checks.
- Branch-protection rules on the git server for merge gates.

When guidance in this file conflicts with a more specific project `CLAUDE.md`,
the project file wins — this file is the floor, not the ceiling.

<!-- Maintainer notes (stripped before injection into context):
- Target: keep under 120 lines of substantive content. Adherence drops on long files.
- Review quarterly against managed-policy-research.md §6 Forbidden-content checklist.
- No model names, plan names, rotating URLs, or codenames.
- No commands specific to one project.
- If a rule feels like it needs enforcement, move it to managed-settings.json
  or a repo-level check.
-->
```

### §7.1 What changed from Eric's original seven candidates

| Candidate (original) | Status in the revised draft | Why |
|---|---|---|
| 1. Attribution footers | Kept, scope-guarded | §6.7 conflict with OSS contribution; reformulated to detect ownership first |
| 2. Confidentiality | Kept, reframed | Footer moved to §7 paragraph on authoring; real force moved to `LICENSE` + IP-assignment (§5.2) |
| 3. Commit signing | Kept as norm | Real enforcement is GitHub branch protection, not CLAUDE.md (§5.3) |
| 4. Pre-commit `--no-verify` rule | Kept, narrowed | Scoped to `main` and `docs/architecture/` — not all-or-nothing (§5.4) |
| 5. Workflow compliance (`document-cm` / WF-003) | Kept as norm, skill name dropped | §6.11 says don't hardcode skill names; §5.5 says don't build the gate at 2 people |
| 6. gitleaks before push | Reduced to "no secrets in commits" | Specific tool name is stale-prone; the norm is the rule, the hook is the enforcement (§5.6) |
| 7. File format allowlist | Kept, with asset carve-out | Scoped to `docs/` and `skills/` explicitly (§5.7) |

Every candidate survives, but each moved from "rule that sounds enforceable" to "norm that sits alongside a real enforcement surface."

### §7.2 What to add to `managed-settings.json` (sibling file)

Managed CLAUDE.md cannot enforce. `managed-settings.json` can. Recommended minimum content for the 2-person team, drawn from §1.7 and §6.10:

```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(git push --force:*)",
      "Bash(git push --force-with-lease origin main:*)",
      "Bash(curl:* | bash)",
      "Bash(curl:* | sh)"
    ],
    "disableBypassPermissionsMode": "disable"
  },
  "sandbox": {
    "enabled": true
  },
  "hooks": [
    {
      "matcher": "PostToolUse",
      "tool": "Write|Edit",
      "command": "gitleaks protect --staged --no-banner --redact"
    }
  ]
}
```

This is the *real* enforcement layer. It deserves its own review pass (§10 open question) but should ship in the distribution repo alongside `CLAUDE.md` so the installer places both.

---

## §8 Proposed distribution-repo structure

A small, boring, reviewable repo. Mac-only installer; no cross-platform complications until a third contributor joins on another OS.

### §8.1 Directory layout

```
claude-code-policy/                       # git repo root
├── CLAUDE.md                             # the Tier-1 managed-policy file (§7)
├── managed-settings.json                 # enforcement sibling (§7.2)
├── install.sh                            # main installer (idempotent)
├── uninstall.sh                          # rollback
├── doctor.sh                             # verify installation integrity
├── README.md                             # onboarding + quickstart
├── LICENSE                               # proprietary notice (see §5.2)
├── CHANGELOG.md                          # human-readable changelog
├── .pre-commit-config.yaml               # scanning baseline for the repo itself
├── .gitignore
└── docs/
    ├── onboarding.md                     # step-by-step for a new collaborator
    ├── update-procedure.md               # how to roll out policy changes
    ├── rollback.md                       # what to do when a policy change breaks work
    └── design-notes.md                   # links to this research doc + rationale
```

Keep the repo minimal. Resist adding scripts, helpers, or CI workflows until they're needed.

### §8.2 Installer script skeleton

`install.sh` must be idempotent, sudo-aware, Mac-only for now, and safe to re-run. It should detect OS, verify prerequisites, create the managed directory if absent, back up any existing file at the target, and install via symlink so `git pull` propagates updates automatically (§4.9).

Skeleton (~80 lines; fill in hash checks and error messages):

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANAGED_DIR=""
case "$(uname -s)" in
  Darwin) MANAGED_DIR="/Library/Application Support/ClaudeCode" ;;
  Linux)  MANAGED_DIR="/etc/claude-code" ;;
  *) echo "Unsupported OS: $(uname -s). Mac and Linux only." >&2; exit 1 ;;
esac

CLAUDE_MD_TARGET="$MANAGED_DIR/CLAUDE.md"
SETTINGS_TARGET="$MANAGED_DIR/managed-settings.json"
CLAUDE_MD_SOURCE="$REPO_DIR/CLAUDE.md"
SETTINGS_SOURCE="$REPO_DIR/managed-settings.json"

# --- pre-flight checks ---
[[ -f "$CLAUDE_MD_SOURCE" ]] || { echo "Missing source: $CLAUDE_MD_SOURCE" >&2; exit 1; }
[[ -f "$SETTINGS_SOURCE" ]]  || { echo "Missing source: $SETTINGS_SOURCE"  >&2; exit 1; }

# Prompt for sudo once; credentials cache ~5 minutes.
echo "Installing Claude Code managed policy to $MANAGED_DIR"
echo "This requires sudo."
sudo -v

# --- ensure managed directory exists ---
if [[ ! -d "$MANAGED_DIR" ]]; then
  sudo mkdir -p "$MANAGED_DIR"
  sudo chown root:admin "$MANAGED_DIR"  # macOS convention
  sudo chmod 755 "$MANAGED_DIR"
fi

# --- back up any existing non-symlink files ---
backup_if_present() {
  local target="$1"
  if [[ -e "$target" && ! -L "$target" ]]; then
    local backup="${target}.backup-$(date +%Y%m%d-%H%M%S)"
    echo "Backing up existing $target -> $backup"
    sudo mv "$target" "$backup"
  elif [[ -L "$target" ]]; then
    # already a symlink; replace only if it points somewhere else
    if [[ "$(readlink "$target")" != "$2" ]]; then
      sudo rm "$target"
    fi
  fi
}
backup_if_present "$CLAUDE_MD_TARGET" "$CLAUDE_MD_SOURCE"
backup_if_present "$SETTINGS_TARGET" "$SETTINGS_SOURCE"

# --- symlink from repo into managed directory ---
if [[ ! -L "$CLAUDE_MD_TARGET" ]]; then
  sudo ln -s "$CLAUDE_MD_SOURCE" "$CLAUDE_MD_TARGET"
fi
if [[ ! -L "$SETTINGS_TARGET" ]]; then
  sudo ln -s "$SETTINGS_SOURCE" "$SETTINGS_TARGET"
fi

# --- verify ---
"$REPO_DIR/doctor.sh"
echo "Installation complete."
```

`doctor.sh` (~20 lines): resolves the symlinks, checks file readability, greps for required anchors in `CLAUDE.md` (e.g., the `## Scope of this file` section), validates `managed-settings.json` with `jq` or `python3 -c 'import json; json.load(open(...))'`, and confirms SHA-256 of the installed file against the repo file. Exits non-zero on any mismatch.

`uninstall.sh` (~15 lines): removes the two symlinks. Does not remove `$MANAGED_DIR` itself — other software may share the directory.

### §8.3 Update mechanism

Chosen pattern: `git pull` + symlinks → automatic content update (§4.1 distilled pattern). Re-run `./install.sh` only when install.sh itself changes or a new file is added to the managed directory. Document the two-step pattern in the onboarding doc:

- **Daily / normal:** `cd ~/.claude-code-policy && git pull`. Because the managed files are symlinks to files in the repo, they update the moment `git pull` writes new content. No sudo needed.
- **After install.sh changes:** `cd ~/.claude-code-policy && git pull && ./install.sh`. sudo once.
- **After a botched update:** `./uninstall.sh`, then `git reset --hard <known-good-sha>`, then `./install.sh`.

Add a git post-merge hook (`.githooks/post-merge`, activated via `core.hooksPath`) that prints a message if `install.sh` changed in the pull: `"install.sh changed since last install — re-run ./install.sh"`. Noisy but catches the easy mistake.

### §8.4 Onboarding README skeleton

The `README.md` at repo root is the face of the repo and should be <50 lines. Structure:

1. **What this is.** One paragraph: "managed-policy file and install scripts for the architect team's Claude Code."
2. **Prerequisites.** `xcode-select --install`, Homebrew installed, git installed.
3. **Install.** Three commands:
   ```
   git clone git@github.com:<owner>/claude-code-policy.git ~/.claude-code-policy
   cd ~/.claude-code-policy
   ./install.sh
   ```
4. **Verify.** `./doctor.sh` — expected output is a single "OK" line per file.
5. **Update.** `git pull` inside the repo. Re-run `./install.sh` only if `install.sh` changed (post-merge hook will warn).
6. **Uninstall.** `./uninstall.sh`.
7. **Where this lives.** Links to the current research doc (`docs/reference/managed-policy-research.md`) and `docs/onboarding.md` for detail.
8. **Who to ping.** Eric + Fernando contact info.

Keep the README boring. Detail goes in `docs/onboarding.md`.

### §8.5 What the installer should NOT do

- **Should not write to `~/.claude/`.** That's the user tier; the user controls it (§1.1).
- **Should not clone itself to a specific path.** The user picks where the repo lives; `install.sh` reads `$REPO_DIR` from its own location. `~/.claude-code-policy/` is the suggested default but not required.
- **Should not configure git globally** (e.g., setting `core.hooksPath`). That's a separate, user-opt-in concern.
- **Should not install tools** like gitleaks or pre-commit. Those belong in each repo's `.pre-commit-config.yaml` or a separate dev-machine bootstrap repo.
- **Should not run on Windows** in the initial version. Error out cleanly with a note that Windows support is unbuilt.
- **Should not curl-to-bash.** Gatekeeper flags it and it's bad practice (§4.9). Always clone-then-run.
- **Should not touch the user's shell profile.** Let the user source any wrappers they want.

### §8.6 What the repo itself needs

Applying the `§5` controls *to this very repo* (it's about managed policy, so it should model good managed-policy practice):

- `LICENSE` at root (proprietary statement from §5.2).
- `.pre-commit-config.yaml` with the baseline hooks from §5.4 (check-yaml, check-json, gitleaks, markdownlint, the file-type allowlist hook for `CLAUDE.md` and `managed-settings.json` integrity).
- GitHub branch protection on `main`: require PR, require signed commits, require CI (`pre-commit run --all-files`) to pass, disallow force-push.
- GitHub Action: `pre-commit run --all-files` on every PR.
- `CODEOWNERS` set to Eric + Fernando on everything.
- No `CHANGELOG.md` bot / release-please yet — write the changelog by hand until the cadence demands automation.

---

## §9 Recommendations ordered by priority

**Do NOW (week 1).** These are cheap, high-value, and unblock everything else.

1. **Fix the target path in the brief.** Mac path is `/Library/Application Support/ClaudeCode/CLAUDE.md`, not `/etc/claude-code/CLAUDE.md`. Update the brief, the installer design, and any mental models (§1.1).
2. **Sign IP-assignment with Fernando.** Plain-language PDF covering all contributions to the current repo set. Store in `docs/legal/` of a private archive. Without this, the copyright footer is cosmetic (§5.2).
3. **Write one `LICENSE` file at the root of every active repo.** Plain-language proprietary statement. Takes 10 minutes (§5.2).
4. **Stand up the `claude-code-policy` repo** with `CLAUDE.md`, `managed-settings.json`, `install.sh`, `doctor.sh`, `uninstall.sh`, `README.md`. Don't try to be fancy. Symlink pattern; Mac-only first (§8.1, §8.2).
5. **Install on both Eric's and Fernando's machines.** Verify via `./doctor.sh`. Run `/memory` in Claude Code to confirm the managed file is being loaded (§1.8).
6. **Turn on GitHub branch protection** for `main` on every active repo: require PR, require signed commits, require CI pass, disallow force-push (§5.3, §5.4).
7. **Set up SSH commit signing** on both machines. 15 minutes per person (§5.3).

**Do NEXT (weeks 2–4).** Higher-friction, still worth doing early.

8. **Ship `.pre-commit-config.yaml`** with the baseline (check-yaml, check-json, merge-conflict, EOF, whitespace, detect-private-key, markdownlint, gitleaks) in each active repo (§5.4).
9. **Add the file-type allowlist hook** to each active repo's `.pre-commit-config.yaml` (§5.7).
10. **Add the frontmatter / footer hook** to repos that use `docs/` for architecture (§5.1).
11. **Mirror every pre-commit hook in CI.** GitHub Action `pre-commit run --all-files` on every PR; require the check in branch protection (§5.4).
12. **Turn on GitHub native secret scanning** (free) for every repo (§5.6).
13. **Write the secret-leak runbook** — 1-page checklist in `docs/security/secret-leak-runbook.md` (§5.6).

**Do LATER (quarter 1–2).** Real but not urgent.

14. **Review the managed policy quarterly** against the Forbidden-content checklist in §6. Update `CHANGELOG.md` when changes ship.
15. **Add the `document-cm` workflow artifact check to CI** only when a 3rd contributor is imminent (§5.5).
16. **Consider Renovate/Dependabot** for `.pre-commit-config.yaml` `rev:` pins (§5.4 gotcha).

**NEVER do** (at 2-person scale; revisit if team grows past 5 or takes external funding).

17. **Don't build full REUSE/SPDX compliance** until open-sourcing a file (§5.1).
18. **Don't adopt Nix / nix-darwin** to distribute the managed file unless someone is already a Nix user (§4.4).
19. **Don't pay for GitHub Advanced Security** — native free scanning + gitleaks is enough (§5.6).
20. **Don't write a custom workflow-gate engine for `document-cm`** — keep it a skill, let review be human-driven (§5.5).
21. **Don't put model names, runtime pins, package-manager names, or specific commands in the managed file** (§6.4, §6.5, §6.6, §6.11).
22. **Don't treat CLAUDE.md as enforcement.** Every "NEVER" or "MUST" in the managed file should be paired with either a `managed-settings.json` deny rule, a pre-commit hook, a CI check, or a server-side gate. Otherwise it's enforcement theater (§6.10).

---

## §10 Open questions for Eric

Decisions the research surfaced but did not make. Each is a named choice with a suggested default; Eric should confirm or override.

1. **Ship `managed-settings.json` alongside `CLAUDE.md`?** Research strongly suggests yes — the real enforcement lives there, and the advisory CLAUDE.md is much weaker without it (§1.7, §7.2). Default recommendation: **yes, ship both from day one.**
2. **Symlink or copy at the managed path?** §4.9 compared; symlink wins on the grounds of automatic update propagation via `git pull`. Default recommendation: **symlink.**
3. **Where should the repo be cloned to?** `~/.claude-code-policy/` (user's home, convention-matches dotfiles) or `/opt/claude-code-policy/` (system-wide, shared across users on a multi-user Mac). Default recommendation: **`~/.claude-code-policy/`** — simpler, per-user, no sudo to clone.
4. **Joint IP with Fernando, or assignment to Eric?** Legal consequence if the project is ever sold, dissolved, or disputed. Default recommendation: **written IP assignment from Fernando to Eric (or to a jointly-owned LLC if one exists)** — simplest chain-of-title. If joint ownership is the intent, say so explicitly in the agreement.
5. **Is "WF-003" a public, named workflow, or internal to Eric?** The draft managed-policy avoided naming it to sidestep the stale-name risk (§6.11). If it's an externally-stable reference (e.g., an ISO standard or an Anthropic-published workflow), hardcoding the name is safer. Default recommendation: **do not name WF-003 in the managed file**; refer to "the team's documented architecture-doc workflow" and let project-level CLAUDE.md or the skill itself carry the specific workflow identifier.
6. **Does the managed policy apply only to `xrsize4all`-adjacent work, or to all Claude Code usage on the machine?** Semantically, managed policy applies to every session. If Eric or Fernando do consulting on other codebases, the managed rules apply there too. Default recommendation: **design the content to be safe for any repo** — the scope-guarded attribution rule (§6.7) already does this. Confirm by reviewing the §7 draft from the perspective of "editing a stranger's repo."
7. **Distribute to only Eric+Fernando or broader?** If the repo will ever onboard a third contributor, the design must survive multi-identity from day one (no hardcoded `Eric Riutort`). Default recommendation: **design for N≥3 from day one** — cost is near zero, cost of refactoring later is high.
8. **What update cadence for the managed policy itself?** Quarterly review suggested in §9. Default recommendation: **quarterly review + CHANGELOG entry on every change.** Add a calendar reminder.
9. **Should the installer configure anything in `~/.claude/` (user tier) for either Eric or Fernando?** Research advice is no — user tier is the user's (§8.5). Default recommendation: **no.**
10. **Does Fernando need a different managed policy than Eric?** If roles diverge (Eric architecture, Fernando implementation), per-user variation via chezmoi-style templating is possible (§4.2). Default recommendation: **single shared policy to start**; split only when the pain appears.
11. **What's the rollback plan if a managed policy change breaks a session?** §8.3 documents one. Default recommendation: **`./uninstall.sh && git reset --hard <last-known-good>` in the repo, then `./install.sh`.** Write it into the README.
12. **Is the macOS `/Library/Application Support/ClaudeCode/CLAUDE.md` path stable across Claude Code releases?** Not verified in §1. Default recommendation: **pin the Claude Code version in the onboarding doc** and document the check: "`/memory` command should list this file as loaded. If it doesn't, the path has changed."
13. **Do any current repos have existing `CLAUDE.md` content that would conflict with the managed policy?** §6.2 warned about silent conflicts. Default recommendation: **audit the project `CLAUDE.md` of every active repo against the managed draft before shipping the managed policy.** Fix the conflicts or explicitly accept them.

---

## §11 Access limitations

Consolidated from all research passes. Items to verify or revisit before publishing the final managed-policy content.

### Anthropic-primary documentation

- **`docs.claude.com/en/docs/claude-code/*` URLs all returned "Redirect was cancelled."** The current canonical Anthropic docs host is `code.claude.com/docs/en/*` (fetched 2026-04-22). Every brief reference to `docs.claude.com` in the original task was stale. Replace with `code.claude.com` everywhere.
- **`docs.claude.com/en/docs/claude-code/iam` / IAM page.** Not fetchable during the research pass. Content is tenant-scoped (SSO/SAML/RBAC) and not directly relevant to Eric's individual-Max-plan setup, so the loss is small, but the page should be revisited once he or Fernando move to a Team plan.
- **`anthropic.com/news/claude-code-on-team-and-enterprise`.** Body too large for a single fetch. Marketing framing, not load-bearing.
- **`anthropic.com/engineering/claude-code-best-practices`** returned a redirect-cancelled error on direct fetch. Its guidance was pulled via WebSearch summaries; any specific quotes attributed to that page should be re-verified against the live page before publication.
- **`code.claude.com/docs/en/memory`** returned ~951 KB — full response was truncated for in-context reading; quotes were verified by grep of the cached body.
- **No Anthropic public statement on agent/skill signing practice** was found (§5.3). That citation in the research is explicitly a gap, not a retrieved source. If an Anthropic statement exists, it is not in the public docs or Claude Code GitHub pages as of 2026-04-22.
- **No Claude Code release notes** indexed in a way the fetch tools could walk within size limits document exactly which release introduced the managed-policy feature. The feature is present-tense and stable, but the introduction version is unverified.

### Public examples of `/Library/Application Support/ClaudeCode/CLAUDE.md` or `/etc/claude-code/CLAUDE.md`

- **Zero found.** GitHub code search for `path:/etc/claude-code filename:CLAUDE.md` and equivalent queries returned nothing. Expected — the file lives on installed machines, not in public repos. Every sample in §3 is a project-root `CLAUDE.md` proxy.

### Research agent limitations

- **The §2+§4 research agent did not have WebFetch/WebSearch** available during its research pass. Content is synthesized from training-data knowledge of the tools involved (Cursor, Codeium/Windsurf, Continue, VS Code, JetBrains, EditorConfig, pre-commit, git, MDM, dotfiles, chezmoi, Stow, Nix, Ansible, Homebrew Bundle, devcontainers, Nix flakes, devenv, mise, asdf). Specific items the agent flagged for verification before commit:
  - Cursor's `.cursor/rules/*.mdc` frontmatter schema and precedence with `.cursorrules` (evolving through 2024–2025).
  - Codeium/Windsurf's global rules path (`~/.codeium/windsurf/memories/global_rules.md`) — confirm current path post-rebrand.
  - Continue.dev's `config.yaml` vs `config.json` migration status.
  - Claude Code's actual precedence for managed-tier CLAUDE.md vs. user `~/.claude/CLAUDE.md` — load-bearing assumption; if Claude Code does not read the managed path at higher precedence, the entire distribution design needs to change.
  - Mathias Bynens / Holman dotfiles current shape — patterns are stable, repos have evolved.
- **The §5 research agent's full HTML dumps of `github.com/sigstore/gitsign` README and `github.com/pre-commit/pre-commit-hooks` README exceeded the `web_fetch` token budget.** Cited content drawn from WebSearch result snippets (which quote the current README text). No paywalls or 403s.
- **The §6 research agent worked through a large `code.claude.com/docs/en/memory` body via grep rather than full-page reading.** All direct quotes were verified via grep of the cached response.
- **WebSearch returns summaries, not page bodies.** Practitioner sources (HumanLayer, ucsandman/CLAUDE.md, Augusteo, Zenn, Chase Adams, Simon Willison, Piebald-AI) were cited from search-result synopses. Any load-bearing practitioner quote in the final published managed-policy should be fetched directly before shipping.

### Legal / compliance

- **Copyright notice conventions** cited from SGR Law and the Software Freedom Law Center are general U.S. guidance. If Eric or Fernando incorporates, moves to a regulated industry, or accepts outside investment, the IP-assignment and license terms should be reviewed by a lawyer.
- **Work-for-hire specifics** (17 U.S.C. § 101 nine categories) were paraphrased; the Circular 3 link is canonical but was not fetched for this research pass.

### Items to verify before the first managed-policy commit lands

A short checklist distilled from the above for Eric to run through:

1. Confirm Claude Code's precedence order for managed-tier CLAUDE.md (run a quick experiment: write a managed-tier rule that conflicts with a project-tier rule, see which wins in a fresh session).
2. Confirm the macOS managed path (`/Library/Application Support/ClaudeCode/CLAUDE.md`) on a live Claude Code install — verify `/memory` lists it.
3. Confirm the current canonical docs host (`code.claude.com/docs/en/*` vs whatever it has rotated to by the time of the commit).
4. Re-verify any practitioner citations that are load-bearing for the managed-policy text before they appear in `CHANGELOG.md` or public-facing docs.

---

© 2026 Eric Riutort. All rights reserved.
