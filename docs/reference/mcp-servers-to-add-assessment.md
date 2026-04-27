---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
valid_as_of: 2026-04-24
re_check_by: 2026-07-24
tier: REFERENCE
content_class: research
---

# MCP Server Adoption Assessment — XRSize4 ALL Portfolio

Decision-grade assessment of which Model Context Protocol (MCP) servers to adopt, build, hold, or skip across Lifting Tracker, Concept Computing, and Reach4All. Anchored to the MCP-first principle (architecture_v0.4.0.md §2.1) and the composite filter: **MCP-able OR trivially MCP-able + self-hostable + not-SaaS-locked + AI-native friction reduction**.

Cross-references (do not duplicate):
- `docs/reference/context-hub-findings.md` — dual CLI+MCP adapter pattern
- `docs/reference/workato-findings.md` — Enterprise MCP buffet (Oct 2025)
- `docs/reference/claude-code-internals-findings.md` — skill resolution layer
- `docs/architecture_v0.4.0.md §2.1` — MCP-first principle; D27 — protocol deferred

## 1. Executive Summary

- **COMMIT now (Sprint 0b–0c):** `filesystem` (official Anthropic), `git` (official Anthropic; local-repo safe through Gitea migration), `supabase` (first-party, OAuth, 20+ tools — direct match to stack).
- **BUILD now (Sprint 0b–0c):** `document-cm MCP adapter` (dual-adapter pattern; CM skill ships with MCP sibling), `lifting-tracker-domain-mcp` (athlete/session/coach tools; the MCP-first principle applies to this sub-system itself).
- **SKIP explicitly:** GitHub MCP at portfolio-wide commitment level — install tactically for the 9–15 month residency, but do not build workflows that depend on it; migrate to `gitea-mcp` Sprint 1.5–2.
- **Must-exist-by-Sprint-0c shortlist:** `filesystem`, `git`, `supabase`, `document-cm MCP`, `postgres` (crystaldba variant for RLS/migration inspection), plus `lifting-tracker-domain-mcp` scaffolded (even if empty).
- **D27 tension:** MCP-for-tools is orthogonal to multi-agent interop protocol choice. Adopting MCP servers for tool-calling does NOT pre-commit D27. But building custom MCP servers (`concept-agent-invoker-mcp`) for agent-to-agent calls does. Defer the latter class until D27 resolves.

## 2. Current Inventory (Baseline)

Current Cowork session carries ONLY Anthropic infrastructure MCPs — no user-configured servers:

| Category | MCPs |
| --- | --- |
| Session infra | `dispatch`, `session_info`, `workspace`, `scheduled-tasks` |
| Browser/notes | `Claude in Chrome`, `Read and Write Apple Notes` |
| Artifacts | `visualize`, `cowork`, `plugins`, `mcp-registry`, `skills` |

User-configured count: **0**. This is a green field — every entry below is net-new.

## 3. MCP Ecosystem — April 2026

Directory scale (synthesized from multiple sources, variance is real, not noise):

| Registry | Server count | Curation stance |
| --- | --- | --- |
| PulseMCP | ~11,840+ | Curated — excludes vanity servers |
| Glama.ai | ~21,000+ | Permissive |
| Official MCP Registry (registry.modelcontextprotocol.io) | ~1,000+ "official/verified" | Strict |
| Smithery.ai | 100K+ "skills/tools" claim | Aggregated — includes non-server skills |
| Docker MCP Catalog | Growing; launched 2025, includes official GitHub/Supabase | Curated (Docker-verified) |

Sources: PulseMCP statistics, Stacklok ToolHive registry updates, SkillsIndex 2026 guide, Docker Hub MCP Catalog. License diversity: MIT dominant for reference/community servers; vendor servers (Supabase, Sentry, Linear, Notion, GitHub) are Apache-2.0 or vendor-specific OSS. Maturity signal: Red Hat, Stripe, Supabase, Vercel, GitHub, Sentry, Linear, Notion, Docker, Railway have shipped first-party servers as of 2026 — MCP is past "emerging" and into "table-stakes integration surface" for dev-tool vendors.

Protocol caveat (relevant to D27): OpenAI and Google publicly back MCP as of 2026; this does NOT dissolve the A2A vs AAIF vs MCP-for-interop question — those are agent-to-agent orchestration protocols, distinct from MCP's tool-calling lane.

## 4. Adoption Candidates (Q4–Q13)

Per-candidate: author / license / maturity / operations / composite-fit / use case.

### Q4. `filesystem` (modelcontextprotocol official)
- **Author/License:** Anthropic, MIT. npm `@modelcontextprotocol/server-filesystem`, latest Jan 2026.
- **Maturity:** Reference server. Stable. Access-controlled by command-line allow-list.
- **Operations:** Read/write files, directory tree, search/replace, Roots-dynamic directory grants.
- **Fit:** All boxes — MCP-able, self-hosted, non-SaaS, directly reduces "re-read the same file" friction.
- **Use case:** Session-level access to `docs/`, `data/combined_workout_log.txt` (400+ historical sessions), and `lib/` without Read-tool overhead.

### Q5. `git` (modelcontextprotocol official)
- **Author/License:** Anthropic, MIT. Python, ~256K weekly PyPI downloads.
- **Maturity:** 12 tools for local git ops. Jan 2026 security patch (pre-2025.12.18 vulnerable to chained prompt-injection — patched).
- **Operations:** status, diff, log, show, commit, branch, checkout — local only, no push.
- **Fit:** Clean. Survives Gitea migration (operates on local `.git`, not remote).
- **Use case:** Architecture docs diff review, D-decision audit trails, pre-commit schema-change inspection.

### Q6. `supabase` (supabase-community, blessed by Supabase)
- **Author/License:** supabase-community org, official. Apache-2.0.
- **Maturity:** 20+ tools. OAuth-by-default as of 2026 (was PAT-only; dynamic client registration now).
- **Operations:** SQL queries, schema inspection, migrations, RLS policy review, Edge Functions, branch management, log retrieval, TypeScript type generation.
- **Fit:** Perfect — our Railway-hosted self-hosted Supabase is the sole source of truth (D4).
- **Use case:** Inspect RLS for coach→athlete hierarchy, generate TypeScript types for Drizzle schema, run volume-analytics queries.
- **Caveat:** Verify self-hosted compatibility — the OAuth-by-default flow assumes supabase.com. Self-hosted may require manual JWT config.

### Q7. `postgres` — two choices
- **Option A (reference):** `modelcontextprotocol/postgres` — Anthropic, read-only, simple schema+query.
- **Option B (crystaldba/postgres-mcp Pro):** MIT. 2K+ stars, last commit Jan 2026, 25 open issues. Index tuning, EXPLAIN plan analysis, DB health checks, buffer cache + vacuum monitoring.
- **Fit:** Crystal DBA variant is better for ongoing work; reference variant is fine for MVP.
- **Use case:** Index tuning on `sessions(athlete_id, started_at)` and `sets(session_id)` under real volume; RLS policy test harness.
- **Recommendation:** Start with Anthropic reference (Sprint 0c); migrate to Crystal DBA variant when query performance becomes visible concern (Sprint 3+).

### Q8. `github` (GitHub first-party)
- **Author/License:** GitHub (ex-Anthropic — the modelcontextprotocol/servers GitHub server was deprecated in favor of GitHub's own).
- **Maturity:** Docker MCP Catalog verified. Most-used MCP per multiple 2026 surveys.
- **Operations:** PRs, issues, code search, Actions, repo metadata.
- **Fit:** SaaS-dependent. Gitea migration (Sprint 1.5–2, 9–15 month window) will obsolete this.
- **Use case:** Tactical — issue/PR ops during GitHub residency. HOLD-level commitment; do not build workflows.

### Q9. `gitea-mcp` (gitea/gitea-mcp, official)
- **Author/License:** Gitea org, official. Go binary releases.
- **Maturity:** Official release 2025, Docker image at `gitea/gitea-mcp-server`. Actively maintained 2026.
- **Operations:** Repo management, issues, PRs — MCP-equivalent to GitHub MCP for Gitea/Forgejo instances.
- **Fit:** Strong — self-hostable, OSS, survives the Gitea migration as the forever-home.
- **Use case:** Post-migration replacement for github MCP. Install simultaneously with Gitea standup.

### Q10. `docker` / Docker Hub MCP + Docker MCP Catalog
- **Author/License:** Docker Inc., official. `docker/hub-mcp` on GitHub, `mcp/dockerhub` image.
- **Maturity:** Official, launched 2025, catalog ships verified MCPs for one-command install.
- **Operations:** Hub image discovery, repo management, container metadata queries.
- **Fit:** Marginal for Lifting Tracker today (Railway abstracts Docker). More useful once Concept Computing / Fuseki containers are in play.
- **Use case:** Sprint 3+ — inspect ClickHouse (HyperDX) and Fuseki container manifests, registry auditing.

### Q11. `playwright` (microsoft/playwright-mcp)
- **Author/License:** Microsoft, official, MIT.
- **Maturity:** Production-grade. BUT: as of 2026 Microsoft now recommends Playwright CLI over MCP for agentic E2E (CLI = 4x fewer tokens: 27K vs 114K per session).
- **Operations:** Accessibility-tree-based browser automation, resilient to CSS/DOM refactor.
- **Fit:** Good for exploratory/smoke tests; not for full E2E suite.
- **Use case:** Smoke-test the Expo Web dashboard post-deploy. Use Playwright CLI via Bash tool for the regression suite.

### Q12. `sentry` (getsentry/sentry-mcp)
- **Author/License:** Sentry, official.
- **Maturity:** 27 tools, device-code auth for sentry.io, npx fallback for self-hosted. Streamable HTTP + SSE.
- **Operations:** Issues, errors, Seer AI analysis, projects, releases.
- **Fit:** Redundant with HyperDX commitment (Sprint 0c decision). HOLD unless errors-only is added alongside HyperDX.
- **Use case:** Only if Sentry is added for stack-trace-centric error triage (HyperDX covers logs/traces/metrics but Sentry's error grouping is superior).

### Q13. `brave-search` (brave/brave-search-mcp-server, ex-Anthropic reference)
- **Author/License:** Brave, MIT. Also shipped as Anthropic reference.
- **Maturity:** Six tools — web, local, image, video, news, AI summarization. Independent 30B+ page index.
- **Operations:** Search across modalities. 10–20x better free tier than Google Search API per 2026 reviews.
- **Fit:** Fills a gap the Cowork session's WebSearch tool doesn't always fill (research agents, Reach4All staleness checks).
- **Use case:** Reach4All research refresh runs — staleness checks, citation verification without leaving the agent loop.

### Also-Considered, Lower Priority
- **`sqlite` (Anthropic reference):** Archived/servers-archived path as of 2026. Functional for `data/*.txt` analysis but Drizzle-based SQLite inspection goes through Drizzle MCP or direct file read. HOLD.
- **`drizzle-mcp` (defrex/drizzle-mcp):** Provides schema introspection + query execution for SQLite/Postgres via Drizzle. Small but directly relevant. HOLD-to-COMMIT Sprint 1+.
- **`fuseki`/`mcp-jena` (ramuzes/mcp-jena):** SPARQL query + update, API-key auth. Single-maintainer, small. HOLD until Concept Computing Sprint 3+.
- **`notion` / `linear` / `slack`:** Official servers exist; all SaaS-locked. SKIP unless one becomes core tooling.
- **`railway-mcp-server` (official, railwayapp/railway-mcp-server):** Project/deploy ops. Useful once multi-service deploy coordination matters. HOLD Sprint 2+.
- **`hyperdx` (no dedicated MCP exists as of April 2026):** HyperDX acquired by ClickHouse; there's a ClickHouse MCP that works against the same store. BUILD-lite: thin ClickHouse-MCP config against HyperDX's ClickHouse. Not a first-party HyperDX MCP.

## 5. Build Candidates (Q14–Q18)

### Q14. `lifting-tracker-domain-mcp` — the MCP-first sub-system
- **Rationale:** architecture_v0.4.0.md §2.1 mandates every sub-system ships an MCP server before further UI investment. Lifting Tracker is the first sub-system. This is not optional by the stated principle.
- **Effort (solo + AI):** 3–5 days initial scaffold; 1 day per tool thereafter.
- **Deps:** Supabase client, Drizzle schema, RLS-aware service layer (same `lib/` the UI calls — per context-hub dual-adapter pattern).
- **Exposes:** `log_session`, `query_athlete_history(athlete_id, range)`, `assign_program(athlete_id, program_id)`, `get_coach_hierarchy(coach_id)`, `list_exercises(family_id?)`, `compute_volume(session_id)`.
- **Target sprint:** Scaffold Sprint 0c; first two tools by end of Sprint 1.

### Q15. `document-cm` MCP adapter (dual CLI+MCP)
- **Rationale:** context-hub pattern — CLI and MCP server are siblings calling the same `lib/`, not a stack. CM skill already planned Sprint 0b.
- **Effort:** 1–2 days if skill's `lib/` is already structured; more if skill is CLI-only.
- **Deps:** document-cm skill's core functions.
- **Exposes:** `cm_status(path)`, `cm_promote(path, tier)`, `cm_audit(scope)`, `cm_find_stale(before_date)`.
- **Target sprint:** 0b (same sprint as the skill).

### Q16. `code-cm` MCP adapter (sibling to document-cm)
- **Rationale:** Same pattern, different domain — codebase configuration management. Build when code-cm skill lands.
- **Effort:** 1–2 days post-skill.
- **Deps:** code-cm skill's core functions.
- **Exposes:** TBD — depends on code-cm's final surface.
- **Target sprint:** Follow-on to code-cm skill (no dated sprint yet).

### Q17. `concept-agent-invoker-mcp`
- **Rationale:** Expose the 16 Concept Computing agents (Book Boss, Notekeeper, Scorekeeper, etc.) as MCP tools so any MCP client can orchestrate them.
- **Effort:** 2–3 days scaffold once agents are Python-stable.
- **Deps:** Concept Computing Python modules; agent invocation contract.
- **Exposes:** One tool per agent + `list_agents`, `describe_agent(name)`.
- **Target sprint:** Concept Sprint 3+.
- **D27 flag:** This is agent-to-agent territory. If D27 picks A2A or AAIF as the interop protocol, this MCP server becomes a compatibility shim, not the primary invocation path. Build with a thin adapter layer so the invocation contract can migrate.

### Q18. `reach4all-research-mcp`
- **Rationale:** Reach4All is a research repo. The natural AI-native surface is "query research by topic, staleness, content_class." Every research doc already has YAML frontmatter — this is trivial to expose.
- **Effort:** 1–2 days.
- **Deps:** Reach4All repo standup; consistent YAML frontmatter (already a convention).
- **Exposes:** `find_by_topic(query)`, `find_stale(before=re_check_by)`, `list_by_class(content_class)`, `get_doc(path)`.
- **Target sprint:** Reach4All repo standup + 1 sprint.

### Q18.5. `xrsize4all-sub-system-registry-mcp` (Phase 2+)
- **Rationale:** Platform-level index of all sub-systems and their MCP endpoints. The meta-MCP that makes "every sub-system ships an MCP server" discoverable.
- **Effort:** 1 day when first 2–3 sub-systems exist.
- **Deps:** At least two sub-system MCPs already operational.
- **Exposes:** `list_subsystems`, `get_subsystem_mcp(name)`, `health_check(name)`.
- **Target sprint:** Phase 2+ (post-MVP).

## 6. Top-10 Prioritized

| Rank | MCP | Flag | Use case | Sprint |
| --- | --- | --- | --- | --- |
| 1 | `filesystem` (Anthropic) | COMMIT | Session-level access to docs/, data/, lib/ without repeated Read calls | 0b |
| 2 | `git` (Anthropic) | COMMIT | Local-repo diff/log/commit ops for architecture doc reviews | 0b |
| 3 | `supabase` (supabase-community) | COMMIT | RLS inspection, migrations, TypeScript type generation against self-hosted Supabase | 0c |
| 4 | `document-cm MCP adapter` | BUILD | Expose CM skill operations (status/promote/audit) as MCP tools for any client | 0b |
| 5 | `lifting-tracker-domain-mcp` | BUILD | log_session / query_athlete_history / assign_program — the MCP-first principle applied | 0c (scaffold) / 1 (tools) |
| 6 | `postgres` (Anthropic ref → Crystal DBA Pro) | COMMIT | Index tuning + EXPLAIN analysis on sessions/sets under volume | 0c / 3 |
| 7 | `brave-search` | COMMIT | Research-refresh staleness checks for Reach4All; independent index | 1 |
| 8 | `playwright` (Microsoft) | HOLD | Smoke tests for Expo Web; use Playwright CLI for regression suite (token cost) | 2 |
| 9 | `github` (GitHub first-party) | HOLD | Tactical PR/issue ops until Gitea migration; do not build dependent workflows | now → obsolete at 1.5 |
| 10 | `gitea-mcp` (official) | COMMIT (conditional) | Post-migration replacement for GitHub MCP; self-hostable forever-home | 1.5–2 |

Tie-breakers (Rank 11+): `drizzle-mcp` (HOLD, Sprint 1+), `concept-agent-invoker-mcp` (BUILD, Concept Sprint 3+), `reach4all-research-mcp` (BUILD, Reach4All standup +1), `fuseki/mcp-jena` (HOLD, Sprint 3+), `sentry` (SKIP-unless-added-alongside-HyperDX).

## 7. Anti-List — Do Not Install

| MCP | Reason |
| --- | --- |
| `notion` MCP (official) | SaaS-locked. Eric's doc stack is repo-based (`docs/` + YAML frontmatter) not Notion. No ingress path. |
| `linear` MCP (official) | SaaS-locked, work-tracking only. No current Linear workspace. Sprint planning lives in `docs/roadmap_v0.4.0.md`. |
| `slack` MCP | SaaS-locked. No Slack workspace in portfolio. Communication is email / direct. |
| `confluence` MCP | SaaS-locked. Enterprise doc platform not in stack. |
| `google-drive` MCP (Anthropic reference) | SaaS-locked; violates "self-hostable" leg of composite filter for primary storage. |
| `puppeteer` MCP (Anthropic reference) | Superseded by Playwright MCP; no reason to run both. |
| Random SQLite wrappers for expo-sqlite | Expo-SQLite is a client-side cache (D4: cloud is truth). No value in exposing ephemeral local state via MCP. |
| `everything` / `sequentialthinking` reference servers | Demo servers, not production tooling. |
| Vanity/single-maintainer wrappers from Smithery's long tail | Survivability risk; prefer first-party or 2K+ star community servers. |

## 8. Roadmap

| Sprint | MCP | Action | Blocker-if-missing |
| --- | --- | --- | --- |
| 0b | `filesystem` | Adopt | Low — but Read tool overhead accumulates session-over-session |
| 0b | `git` | Adopt | Low — but doc-diff workflows slower without it |
| 0b | `document-cm MCP` | Build (w/ CM skill) | Medium — dual-adapter pattern ratifies the architecture principle |
| 0c | `supabase` | Adopt | High — migrations, RLS, and type-gen are central to Sprint 0c schema work |
| 0c | `postgres` (Anthropic ref) | Adopt | Medium — backup path if supabase MCP self-hosted auth is rocky |
| 0c | `lifting-tracker-domain-mcp` | Build (scaffold) | High — §2.1 principle violation if skipped |
| 1 | `lifting-tracker-domain-mcp` | Build (first tools) | High — MCP-first principle demands tools before UI investment |
| 1 | `brave-search` | Adopt | Low — nice-to-have for research refresh |
| 1.5–2 | `gitea-mcp` | Adopt (with Gitea standup) | High — Git ops continuity post-migration |
| 1.5–2 | `github` MCP | Retire | N/A — replaced by gitea-mcp |
| 2 | `playwright` | Evaluate (HOLD) | Low — CLI alternative is preferred per Microsoft 2026 guidance |
| 2+ | `railway-mcp-server` | Evaluate | Low — useful for multi-service deploy ops |
| 3+ | `postgres` Crystal DBA Pro | Upgrade | Medium — query perf will bite under real athlete volume |
| 3+ | `fuseki` / `mcp-jena` | Evaluate | Medium — gates Concept Computing RDF workflows |
| 3+ | `concept-agent-invoker-mcp` | Build (post-D27) | High — but ONLY after D27 protocol pick; otherwise throwaway |
| TBD | `reach4all-research-mcp` | Build (with Reach4All standup) | Low — repo has to exist first |
| Phase 2+ | `xrsize4all-sub-system-registry-mcp` | Build | Low — requires ≥2 sub-systems live |

## 9. Open Questions and Tripwires

- **D27 not ratified — tension with MCP volume adoption.** MCP-for-tools (Q4–Q13 adoption) is orthogonal to multi-agent interop and does NOT pre-commit D27. But BUILD candidates that expose agent-to-agent invocation (Q17 `concept-agent-invoker-mcp`) are D27-bound. Recommendation: defer Q17 until D27 resolves; build with an invocation-contract adapter layer so the protocol is swappable if A2A or AAIF wins.
- **Gitea migration switching cost.** GitHub MCP is in use for 9–15 months (outside-edge Q4 2027). Do not build automations that hard-depend on github MCP tool names — wrap calls in an abstraction that can redirect to gitea-mcp. Treat GitHub MCP as tactical infrastructure, not committed infrastructure.
- **Supabase MCP + self-hosted.** The OAuth-by-default 2026 rollout assumes supabase.com. Self-hosted on Railway needs verification — may require PAT fallback or manual OAuth app registration against the self-hosted instance. Verify before Sprint 0c commitment.
- **HyperDX has no dedicated MCP.** ClickHouse MCP against HyperDX's ClickHouse store is the workaround. If that's insufficient, a thin `hyperdx-mcp` (one more BUILD item) may emerge. Flag at Sprint 0c review.
- **Playwright MCP vs CLI.** Microsoft's 2026 guidance (CLI = 4x fewer tokens) changes the ROI. Default to CLI for regression; MCP only for smoke/exploratory.
- **Sentry vs HyperDX overlap.** Sprint 0c decision committed HyperDX. Sentry MCP is only relevant if error-grouping workflows are added on top (HyperDX is weaker on stack-trace grouping). Not a blocker; flag for future review.
- **Crystal DBA `postgres-mcp` staleness.** 25 open issues, some ~12 months old. If adopted and maintenance stalls further, fallback is reference `modelcontextprotocol/postgres` or a fork.
- **Synthesis caveat.** Directory counts in §3 were pulled from 2026 guides and PulseMCP; numbers move week-over-week. The ratio between registries (Glama permissive > PulseMCP curated > Official Registry strict) is stable.

Sources:
- [Supabase MCP Server](https://github.com/supabase-community/supabase-mcp)
- [Supabase MCP Docs](https://supabase.com/docs/guides/getting-started/mcp)
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- [crystaldba/postgres-mcp](https://github.com/crystaldba/postgres-mcp)
- [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- [getsentry/sentry-mcp](https://github.com/getsentry/sentry-mcp)
- [gitea/gitea-mcp](https://gitea.com/gitea/gitea-mcp)
- [brave/brave-search-mcp-server](https://github.com/brave/brave-search-mcp-server)
- [ramuzes/mcp-jena](https://github.com/ramuzes/mcp-jena)
- [railwayapp/railway-mcp-server](https://github.com/railwayapp/railway-mcp-server)
- [defrex/drizzle-mcp](https://github.com/defrex/drizzle-mcp)
- [docker/hub-mcp](https://github.com/docker/hub-mcp)
- [Expo MCP Docs](https://docs.expo.dev/eas/ai/mcp/)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/)
- [PulseMCP Statistics](https://www.pulsemcp.com/statistics)
- [ClickHouse LLM observability with MCP](https://clickhouse.com/blog/llm-observability-clickstack-mcp)

© 2026 Eric Riutort. All rights reserved.
