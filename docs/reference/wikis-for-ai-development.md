---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
valid_as_of: 2026-04-24
re_check_by: 2026-07-23
tier: REFERENCE
content_class: research
---

# Wikis for AI-Assisted Development — Assessment

## 1. Executive summary

- **Recommendation: REJECT.** Do not add a wiki to the portfolio architecture. `lifting-tracker/docs/`, Reach4All (when scaffolded), `~/Concept/`, and the memory folder — all plain markdown + YAML in git — already implement the pattern that 2026 agentic-AI tooling has converged on: the Karpathy LLM Wiki / Claude Code CLAUDE.md pattern. Adding a wiki tool on top is a regression, not a progression.
- **Single strongest reason:** The dominant AI-agent memory architecture in 2026 (Claude Code, Manus, OpenClaw, Karpathy's "LLM Knowledge Base") is *markdown files in git*, not a wiki. Eric's stack is already the reference implementation. Wiki tools solve problems Eric does not have (non-technical editors, browser-based rich-text, hosted search UX) while creating problems he does not have today (second source of truth, sync-with-git complexity, auth/hosting burden, weaker diffability).
- **The one defensible "conditional adopt" scenario:** If Reach4All later grows a *public*, read-only, non-technical audience (e.g. published essays, portfolio-level explainers), add a **static site generator** (MkDocs Material or Docusaurus) *on top of* git-markdown — not a database-backed wiki. This is a presentation layer, not a new source of truth.
- **If that assumption changes** and a true DB-backed wiki becomes necessary (multi-author non-technical editing, enterprise ACL, public commenting): the only tool that passes the composite principle is **Docmost** — self-hostable, AGPL, first-party MCP server, AI-native posture. BookStack, Wiki.js, and Outline follow with community MCPs. Reject MediaWiki (operational weight), Confluence/Notion/GitBook (SaaS lock-in), and especially GitHub/GitLab built-in wikis (canonical anti-pattern).
- **Composite principle verdict on plain git-markdown (status quo):** MCP-able = yes (filesystem MCP, git MCP, Claude Code native file tools). Self-hostable = yes (git). Not-SaaS = yes. AI-native friction reduction = **maximum** — this is what Claude Code, Cursor, and every 2026 coding agent are optimized to work against. No wiki tool scores as well on (d).

## 2. Methodology

### Sources consulted

- Official product docs: wiki.js.org, bookstackapp.com, getoutline.com, dokuwiki.org, mediawiki.org, docmost.com, hedgedoc.org, appflowy.io
- MCP directories: mcpservers.org, glama.ai, pulsemcp.com, lobehub.com, mcp.directory — to enumerate community and first-party MCPs as of April 2026
- Canonical critiques: Michael Heap, *"The GitHub wiki is an anti-pattern"* (michaelheap.com); duckalignment.academy, *"Choosing between wiki- and git-based documentation"*
- Pattern literature: Andrej Karpathy's LLM Wiki gist and follow-ups (Medium/Level Up Coding/VentureBeat coverage, April 2026); MindStudio write-ups on the Karpathy pattern; dev.to, *"AI Agent Memory Management — When Markdown Files Are All You Need?"*
- Production anchor: Milvus blog, *"We Extracted OpenClaw's Memory System and Open-Sourced It (memsearch)"* — describes Manus, OpenClaw, and Claude Code all using markdown as primary memory, not vector DBs
- Mobile UX: GitHub issues BookStackApp#326, #5935 (iOS PWA); Wiki.js feedback forum ("Need a mobile app support")
- Claude Code docs: code.claude.com/docs/en/mcp; code.claude.com/docs/en/overview (CLAUDE.md convention)

### What was paywalled / unverified

- Confluence DC pricing is quoted in SaaS-adjacent tiers; self-host cost not cleanly published.
- Some "best wiki 2026" listicles are SEO-farmed; I weighted direct product docs and GitHub repo activity over ranked listicles.

### Confidence level

- **High** on the pattern claim (markdown-in-git has won among coding agents; multiple independent sources converge).
- **High** on MCP availability per tool (repos exist and are listed on ≥2 MCP directories).
- **Medium** on mobile UX nuances — tested only via product docs and bug trackers, not hands-on.
- **High** on the REJECT recommendation under Eric's stated composite principle. This is not a hedged answer.

## 3. Wiki landscape 2026 — master table

| Tool | License | Self-hostable | Native markdown storage | MCP (1st-party) | MCP (community) | Mobile | AI-native posture | Composite pass? |
|---|---|---|---|---|---|---|---|---|
| **Docmost** | AGPL-3.0 | Yes (Docker) | Yes (Postgres-backed, markdown ingest) | **Yes — first-party** | Yes | PWA | Explicit: MCP server ships, AI provider pluggable (Ollama, OpenAI, Gemini) | **Yes** |
| **Wiki.js** | AGPL-3.0 | Yes (Node.js, multi-DB) | Yes (can sync to git) | No | Yes (`jaalbin24/wikijs-mcp-server`, `widjis/mcp-wikijs`) | PWA only — no native app; project states no plans | Medium — CRUD via MCP, no first-class | Marginal |
| **BookStack** | MIT | Yes (PHP/MySQL) | Markdown editor optional, stored in DB as HTML | No | Yes (`pnocera/bookstack-mcp-server` exposes 47 tools; others) | PWA (iOS zoom bug open) | Medium | Marginal |
| **Outline** | BSL-1.1 (source-available, non-compete) | Yes (complex) | Rich-text editor, not raw markdown | No | Yes (5+: Vortiago, HelicopterHelicopter, nbhansen, mmmeff, mscrivo) | PWA | Medium — strong MCP community | Marginal (BSL ≠ OSS, non-compete clause) |
| **MediaWiki** | GPL-2.0 | Yes (heavy) | Wikitext, not markdown | **Yes — Professional Wiki ships `MediaWiki-MCP-Server`** | Yes | Official iOS app (read-heavy, editor limited) | Low — wikitext is hostile to LLM codegen | Fails on AI-native friction |
| **DokuWiki** | GPL-2.0 | Yes (PHP, file-backed) | Own syntax (not markdown) | No | Limited | PWA | Low | Fails on markdown + MCP |
| **TiddlyWiki** | BSD | Yes (single HTML file) | Own syntax | No | None found | Good (HTML) | Low | Fails on MCP |
| **HedgeDoc** | AGPL-3.0 | Yes | Yes (markdown-first, CodiMD lineage) | No | None prominent | PWA | Low — built for collab editing, not agents | Fails on MCP |
| **XWiki / Foswiki** | LGPL / GPL | Yes (heavy, JVM) | Own syntax | No | None | Weak | Low | Fails |
| **AppFlowy** | AGPL-3.0 | Yes (Docker, "Vault Workspace") | Yes (block-based, markdown export) | Partial (AI features internal, MCP exposure evolving) | Limited | Native iOS/Android apps | Medium — positions as Notion alternative with local-first AI | Promising but immature |
| **GitBook** | Commercial | No (hosted only) | Git-backed markdown | Partial | — | App + web | Strong for docs-as-code hybrid | Fails on self-host / SaaS |
| **Confluence Cloud** | Commercial | No | Storage format (XHTML), not markdown | **Yes — Atlassian Remote MCP** | Yes | Native app | Strong MCP | Fails on SaaS + not-markdown |
| **Confluence DC** | Commercial | Yes (licensed) | Same storage format | Same MCP | Yes | Native app | Same | Fails on not-OSS + not-markdown |
| **Notion** | Commercial | No | Proprietary blocks | Yes (Notion MCP) | Yes | Native app | Strong | Fails on SaaS |
| **GitHub Wiki** | — | Yes (it's a git repo) | Yes (markdown) | No | None | Web-only; iffy on mobile | None — wikis are unlinked from PRs | **Anti-pattern** (Heap, 2015; still consensus 2026) |
| **GitLab Wiki** | — | Yes | Yes (markdown) | No | None | Web | Weak | Anti-pattern (same critique) |

### Reading notes

- **MCP availability is now broad**: every serious self-hosted wiki has at least a community MCP server by April 2026. This is NOT a differentiator in Eric's favor — it just means no wiki is *blocked* by MCP. Adding a wiki still adds a layer; MCP availability only lets that layer not be worse.
- **Only Docmost and MediaWiki have *first-party* MCP.** Professional Wiki (MediaWiki) and Docmost are the two vendors that have decided "AI agents reading us is a supported workflow." Everyone else: community plugins, varying maintenance.
- **"Self-hostable" hides a scaling question.** Wiki.js needs Postgres/MySQL + Node. BookStack needs PHP + MySQL. Docmost needs Postgres + Redis + Docker. MediaWiki needs PHP + MySQL + Memcached-class caching. DokuWiki needs PHP only (flat-file). Eric's status quo (a folder in a git repo) needs git.
- **Native mobile apps are rare.** Outline, Wiki.js, BookStack, Docmost, HedgeDoc, GitBook, and Docusaurus all ship PWAs or nothing. MediaWiki and Notion have native apps. For Eric's mobile story (Dispatch on iPhone → markdown → git), *no wiki tool matches the current UX* without regression.

## 4. Wiki-as-context-for-AI patterns — what teams actually do in 2026

### 4.1 The Karpathy LLM Wiki pattern (the pattern that won)

In late 2025, Andrej Karpathy published a gist formalizing a pattern he had been using informally: an LLM agent maintains a structured markdown knowledge base in three layers — `raw/` (immutable source ingest), `wiki/` (LLM-generated, hand-edited pages), and a `CLAUDE.md`-style schema/index. Three operations: **ingest** new sources, **query** for retrieval-into-context, **lint** for health checks. No embeddings. No vector DB. Plain files, git-versioned.

Why it won (per April 2026 coverage in VentureBeat, Level Up Coding, MindStudio, DAIR.AI Academy):
- **Human-readable and agent-readable at the same time.** A markdown file is a valid knowledge-base entry, a valid prompt payload, a valid git-tracked artifact, and a valid Dispatch-on-iPhone editable document, all at once.
- **Git gives free versioning, branching, rollback, audit.** Vector DBs have none of this natively.
- **The wiki *compounds* across sessions.** Each session's "what I learned" is merged into persistent files; future sessions pull from them as context.
- **Scale sweet spot: hundreds to low-thousands of documents.** Past that, layer RAG on top of markdown (e.g. memsearch, OpenClaw's approach) — still keeping markdown as source of truth.

Eric's portfolio is already this pattern, executed cleanly:
- `raw/` = `~/lifting-tracker/data/combined_workout_log.txt`, CM brief v0.3.0, source documents
- `wiki/` = `docs/`, `docs/reference/`, `docs/adr/`, Reach4All content classes
- schema/index = `CLAUDE.md` (project-level) + global `CLAUDE.md` (preference layer) + document-cm skill (when built)
- ingest = session work that produces reference docs from research
- query = Claude Code reading files as context
- lint = document-cm will automate this

Adopting a wiki *tool* on top of this architecture would add a second place where the same content lives, with weaker tooling on the agent side.

### 4.2 Claude Code / Cursor / Copilot — what they consume as context

All three major coding-agent surfaces in 2026 preferentially consume *files in the repo*:
- Claude Code: `CLAUDE.md` is magic — auto-injected. Plus Read/Glob/Grep over the repo. MCP servers for external sources exist but are a second choice.
- Cursor: `.cursor/rules/*.mdc` plus repo grep.
- Copilot: `.github/copilot-instructions.md` plus repo indexing.

None of these are built to treat a wiki URL as a first-class context source. Teams that do this usually pipe wiki content back into the repo via a sync job (GitHub Action "docs-to-wiki" and its inverse) — i.e. they maintain markdown-as-source-of-truth and *emit* a wiki as a read-only view. That is exactly the "static site generator on top of git-markdown" pattern from §1.

### 4.3 Agents reading/writing a wiki as persistence layer

Production agents in 2026 that have been publicly documented:
- **Manus** ($100M ARR, acquired by Meta): markdown-based agent memory, file-system-backed.
- **OpenClaw / memsearch**: markdown canonical, hybrid vector index layered on top.
- **Claude Code** ($2.5B run-rate revenue Feb 2026): CLAUDE.md convention, plus session memory via files.

None of these use a wiki tool as persistence. The pattern of "agent writes to Confluence as memory" does appear in enterprise case studies, but it's driven by the *human* side needing Confluence, not the agent wanting Confluence. The agent would happily take a folder.

### 4.4 RAG over wiki content — is it worth it?

RAG over a wiki is a well-established pattern (60%+ of enterprises using GenAI use some retrieval architecture per 2026 surveys). But:
- For a **personal / small-team knowledge base (Eric's scale)**, the LLM-Wiki pattern beats RAG on reliability, debuggability, and tooling simplicity (MindStudio, April 2026).
- If scale grows past ~1,000 documents, *add a vector index on top of the same markdown*; do not migrate the source of truth.

## 5. Wiki vs git-native markdown — what wikis add, what they cost

### 5.1 What a wiki gives you

| Capability | Why it matters | Does Eric need it? |
|---|---|---|
| In-browser rich-text editor for non-technical users | Marketing, PMs, ops can edit | No — Eric is the editor; Dispatch on iPhone handles mobile |
| Built-in full-text search with relevance | Casual human browsing | No — ripgrep + Claude Code Grep + MCP filesystem are faster for the agent case |
| Access control / per-page ACL | Mixed-audience orgs | No — git already handles this (private repo) |
| Page hierarchy + WYSIWYG reordering | Intuitive for non-devs | No — folder tree is fine |
| Backlink / transclusion UI | Wiki-style exploration | Partially — Obsidian-style vaults give this over the same markdown, no wiki tool needed |
| Inline comments / review threads | Collaborative editing | PR review already covers this |
| Published read-only presentation | Public-facing docs | Covered by MkDocs / Docusaurus if/when needed |

### 5.2 What a wiki costs

- **Second source of truth.** Either the wiki or the git repo is canonical. If both are, sync drift is inevitable. Michael Heap's 2015 GitHub Wiki anti-pattern post remains the canonical statement; 2026 duck-alignment and GitHub community threads echo it.
- **Operational burden.** Container + DB + backup + TLS + auth + upgrade path. `docs/` in a repo has none of that.
- **Auth layer to build and maintain.** Or SSO integration. Every wiki re-implements this; git uses the repo's permissions.
- **Weaker diffability.** DB-backed wikis (BookStack, Outline) store HTML in a DB; diffs are in the app, not git. File-backed wikis (DokuWiki, wiki.js with git sync) recover this partially at the cost of configuration.
- **Mobile UX regression.** Dispatch + git + markdown is already better than any self-hosted wiki's iOS experience. BookStack's PWA has an open iOS zoom bug (#5935); Wiki.js has no native app plan.
- **Agent friction.** Every agent read or write now needs an MCP round-trip with auth tokens, instead of a free filesystem read. This is non-zero; for Claude Code it is larger than it sounds, because CLAUDE.md auto-injection and native file tools collapse that cost to ~zero for the repo case.
- **Lock-in risk.** BSL (Outline) and commercial (GitBook, Notion, Confluence) lock the content format to some degree, even if export exists.

### 5.3 Net — for Eric's stated constraints

Git-markdown wins on 6 of 7 dimensions relevant to the stated use case (solo architect, AI-assisted, mobile-on-Dispatch, offline-tolerant, composite-principle-driven). The only dimension a wiki could plausibly win is *public presentation* — and that is solvable without a wiki by generating a static site from the same markdown.

## 6. Integration with Eric's stack

### 6.1 Where would a wiki live in the portfolio?

Three possible placements, none of them clean:
- **Parallel to `~/lifting-tracker/docs/`:** creates a second source of truth for lifting-tracker architecture. Bad.
- **On top of (superset of) Reach4All:** forces Reach4All to export into the wiki. Adds a build step. Reach4All content classes (per CM brief v0.3.0) are already markdown-shaped; a wiki is a presentation layer at best.
- **Subset of the portfolio (e.g. only public / portfolio-facing Reach4All content):** viable, but at that point it's a *publishing* tool, and a static site generator is a better fit than a database-backed wiki.

### 6.2 Railway container alongside Supabase + HyperDX

Operationally feasible. Docmost, Wiki.js, BookStack all run cleanly on Railway. Cost: ~$5–15/month per service + associated DB + storage. Backup: your problem. Upgrades: your problem. Downtime during upgrades: your problem. Compare to `git push origin main`.

### 6.3 document-cm compatibility

document-cm (Sprint 0b Day 2+) governs markdown + YAML frontmatter in files. If content is in a wiki's database, document-cm must either:
- (a) treat the wiki's export as its authority (stale by default), or
- (b) run through each wiki tool's API/MCP (per-tool integrations, fragile, one-off), or
- (c) force the wiki to back itself with git sync (Wiki.js supports this via storage modules; others don't cleanly).

All three options make document-cm's job harder and its guarantees weaker. document-cm is built for files in git. Feeding it a wiki is the tail wagging the dog.

**Conclusion:** a wiki is not drop-in compatible with document-cm. Picking a wiki would force document-cm to be redesigned around whichever wiki won — which is a design constraint Eric has not committed to and should not commit to.

## 7. Recommendation

**REJECT. Do not add a wiki to the portfolio architecture.**

**Single strongest reason:** Eric's current architecture (plain markdown + YAML in git, accessed by Claude Code via native file tools and by MCP filesystem/git servers) *is* the Karpathy LLM Wiki pattern — the pattern that Claude Code, Manus, OpenClaw, and the consensus of 2026 agentic-AI tooling have converged on. A wiki tool on top of this is not an upgrade; it is a lateral move that adds operational burden, auth surface, a second source of truth, mobile UX regression, and forces document-cm into a weaker posture, in exchange for capabilities Eric does not currently need (non-technical editor UX, hosted rich-text search).

If the underlying assumptions change — specifically, (a) non-technical collaborators need to edit, or (b) Reach4All publishes to a public read-only audience, or (c) a multi-tenant ACL need emerges — revisit §8.

## 8. Integration plan — ONLY if a scenario in §7 triggers a conditional adopt

### 8.1 Scenario: public-facing read-only docs for Reach4All

Do **not** add a DB-backed wiki. Add a **static site generator** that reads the same markdown:
- **MkDocs Material** — Python, mkdocs.yml config, reads `docs/` directly, ships via `mkdocs gh-deploy` or Vercel. Plays well with existing YAML frontmatter.
- **Docusaurus** — React/Node, heavier, stronger if site becomes app-like (auth, search service).
- **Astro Starlight** — newer, lean, good for technical docs.

Source of truth stays in git. Build step emits static HTML. document-cm still governs the source. Zero new runtime service.

### 8.2 Scenario: DB-backed wiki genuinely required (non-technical multi-author)

Pick **Docmost** and nothing else:
- Self-hostable (Docker on Railway or a small VPS).
- AGPL-3.0 (composite-principle-clean).
- **First-party MCP server** — designed for agent access.
- AI-provider pluggable (can point at local Ollama for privacy).
- Accepts markdown imports.

Host it as a *read-and-contribute surface for non-technical collaborators*, with a sync job that pulls back into git markdown. Authority still flows through git; Docmost is a UI layer. document-cm runs against the git copy.

Migration cost: low-to-medium. ~1 sprint to stand up, write the sync pipeline, and integrate with document-cm's lint pass.

**Do not** pick: Confluence/Notion/GitBook (SaaS), MediaWiki (wikitext kills LLM codegen), GitHub/GitLab wikis (anti-pattern — decoupled from repo, no PR workflow, Heap 2015 and 10 years of consensus), DokuWiki/TiddlyWiki/HedgeDoc (no serious MCP story), BookStack/Wiki.js/Outline (only community MCPs; acceptable but strictly inferior to Docmost on the AI-native axis).

### 8.3 What *not* to do under any scenario

- Do not dual-write (content in `docs/` AND in a wiki DB). Pick one canonical source, generate the other.
- Do not adopt any SaaS wiki (Confluence, Notion, GitBook, hosted Outline).
- Do not use GitHub/GitLab's built-in wiki feature.
- Do not let a wiki's auth model become the portfolio's auth model.

## 9. Open questions / tripwires

- **Q: If Reach4All onboards a non-technical co-author, does the answer change?** Revisit §8.2. Answer may become CONDITIONAL ADOPT Docmost. Until that person exists, don't pre-optimize.
- **Q: Does Claude / Anthropic ship first-party MCP for any wiki that would shift the calculus?** As of 2026-04-24, no. If Anthropic ships a first-party wiki integration akin to `claude-code-action` for a specific wiki tool, revisit.
- **Q: Does document-cm's Sprint 0b design create a wiki need retroactively?** Only if document-cm ends up governing content that must be edited by non-technical users. Current scope doesn't imply this. Watch for scope creep.
- **Q: What about llms.txt / llms-full.txt for public Reach4All?** Orthogonal to wikis. If Reach4All publishes, add an `llms.txt` generator to the static-site pipeline regardless.
- **Tripwire: the "we should centralize all docs" urge.** This is a consulting-ops instinct that does not apply to a solo-architect + agent setup. Watch for it; resist it.
- **Tripwire: picking Outline because it's well-liked.** Outline is BSL-1.1 with a non-compete; that violates "not-SaaS in spirit" even when self-hosted. It also has no native markdown editing.
- **Tripwire: picking Wiki.js because "it has git sync."** Wiki.js's git storage module is a sync layer, not source of truth — the DB is still primary. Using Wiki.js *as a git-backed editor* is building a mobile app that happens to commit; there are lighter-weight ways to achieve that (Dispatch, Working Copy).
- **Re-check date:** 2026-07-24. What would change the call: a first-party Anthropic-blessed wiki integration, or a Reach4All commitment to non-technical co-authors, or a published Claude Code pattern that treats a wiki URL as a first-class context source on par with CLAUDE.md.

---

© 2026 Eric Riutort. All rights reserved.
