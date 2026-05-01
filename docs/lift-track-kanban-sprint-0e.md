---
author: Eric Riutort
created: 2026-04-28
updated: 2026-04-30
tier: OPERATIONAL
content_class: operational
sprint: 0e
sprint_name: Listener Daemon + Scheduler + LLM-Extraction Validation
sprint_dates: TBD → TBD
sprint_open_date: TBD
status: drafted
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0e)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0e's per-sprint kanban. **Drafted ahead of sprint open** during Sprint 0c; rescoped 2026-04-30 from the listener/sniffer prep deliverable (`reach4all://docs/research/listener-sniffer-architecture-design.md`, 1,511 lines, decision-grade). Finalized at the actual sprint-open commit when Sprint 0d closes. Frozen at sprint close as the immutable record.

## Sprint 0e — Listener Daemon + Scheduler + LLM-Extraction Validation

**Theme:** Stand up portfolio sensing capability across three parallel workstreams. (1) **Listener** — event-driven daemon (work mode 8) per the §3 design in the prep doc: single-host Python asyncio under macOS LaunchAgent, five-component architecture (Registry → Fetcher → Normalizer → Deduplicator → Router), two-tier persistence (SQLite WAL hot + monthly Parquet cold), five initial listeners watching the highest-signal external feeds, four-tier alert routing (archive / memory-file / chat / research-task spawn). (2) **Scheduler** — pull-based, cron-driven research-task framework (work mode 6) running ~17 cadence-tiered tasks. (3) **LLM-extraction validation** — Sprint 0e LLM hosting decision finalized + 60-day Lambda Labs validation kicked off, per `llm-unrestricted-research-extraction-strategy-research.md`. The listener's LLM-summarize tier (§3.7 of prep doc) consumes whatever the LLM workstream lands on; degrades gracefully if it slips.

**Dates:** TBD → TBD (estimated 10–14 calendar days for listener build per prep doc §11.1, plus 3-5 days each for scheduler and LLM-extraction validation; significant parallelization possible across the three workstreams)

**Goal:** Operational sensing layer in production. Listener daemon running continuously under LaunchAgent for ≥7 consecutive days with five §5 listeners producing routed events. Scheduler running ~17 cron-driven research tasks landing findings on schedule. LLM-extraction validation underway with Sprint 0e+1 build/buy decision criteria established. The DeepSeek-V4-class miss case (Sprint 0c retro) is structurally addressed: portfolio has hours-not-days latency on Anthropic / GitHub / NVD / Apple / vendor-terms events.

**Cost envelope (per prep doc §11.1):** ~$25–165/year hard-dollar (NVD API free, GitHub authenticated free at this volume, RSS/Atom/git-commit feeds free, Cloudflare Tunnel optional ~$0–10/mo if elected) + ~40 hours/year operator time (per §8 cadence: real-time chat alert + daily memory-file scan + weekly digest, ~45 min/week steady-state). LLM-tier inference cost inherits whatever the LLM hosting decision lands on (~$200 60-day validation, then ~$300–700/year cloud-rental or sunk owned-hardware).

**Close criteria (8 items):**

### Workstream A — Listener (5 CCs)

1. **NEW — Listener daemon stand-up.** Python asyncio daemon `reach4all-listener` in new repo (location per Q4 — defer to sprint open). Runs continuously under macOS LaunchAgent (`com.reach4all.listener.plist`). SIGHUP/SIGTERM/SIGUSR1 handlers per §3.10 of prep doc. Watchdog LaunchAgent + healthz endpoint (§9.2). Nightly integrity check (`PRAGMA integrity_check`, row-count audit, cold-tier rotation, disk-space check) per §9.3. Survives Mac sleep/wake gracefully. Definition of done per prep doc §11.4: 7 consecutive days continuous operation, no manual restart; watchdog uninterrupted 7 days with at least one synthetic listener-down test confirming alerting; nightly integrity check 7 days no failures.

2. **NEW — Five-component architecture.** Registry → Fetcher → Normalizer → Deduplicator → Router pattern per prep doc §3. Registry reads `sources.yaml` (schema validated at load). Fetcher pool covers RSS/Atom (`feedparser` + `httpx` ETag/If-Modified-Since), GitHub Releases API (REST + conditional ETag), NVD 2.0 JSON API (with API key, `lastModStartDate` polling), HTML diff (`lxml` selector + `difflib`), git-commit watch (`git log --since` wrapper). Normalizer converts each fetcher's output to the Common Event schema (§3.4). Deduplicator: SHA-256 content hash + source primary key in `seen_events` SQLite table (§3.5). Router: rules-driven dispatch per `router-rules.yaml` (§3.6 / §3.6a grammar) to the four action sinks below. LLM-summarize tier (§3.7) integrated as `to_summarize` queue with batched async drainer; degrades gracefully via `llm_summarize: false` if Sprint 0e LLM hosting slips (R-L1 mitigation).

3. **NEW — Two-tier storage (SQLite WAL hot + monthly Parquet cold).** Per prep doc §7. Hot tier `event_hot` SQLite WAL at `~/.local/share/reach4all-listener/state.db`, indexed by `source_id` / `time` / `severity`, 90-day retention (matches CIS Controls v8 Control 8 audit-log floor). Cold tier monthly Parquet at `~/.local/share/reach4all-listener/archive/<YYYY-MM>.parquet`, 7-year retention (matches longest portfolio archival horizon, revisit at year 5). Hot/cold transition runs nightly in 03:00 quiet window. Dedup index `seen_events` independent retention: 365-day hot row + indefinite event_id-only cold row (§7.4). Backup posture per §7.5: Time Machine + nightly `litestream`-style replication (7 daily / 4 weekly / 12 monthly rotation).

4. **NEW — Five initial listeners configured (§5 short list).** All five from prep doc §5, in the §5.6a sequencing order:
   - **L1 — Anthropic news + API changelog** (RSS + JSON poll). Sources: `anthropic.com/news/feed.xml`, `docs.anthropic.com/en/api/changelog`, `anthropic.com/research/feed.xml`. Severity defaults: `high` for news/research; `critical` for API changelog containing breaking/deprecated/removed/rate-limit/policy keywords. LLM-summarize: yes. Highest portfolio-relevance — the API changelog miss case is the costliest.
   - **L2 — GitHub releases for direct dependencies** (GitHub Releases API, conditional ETag). Initial repos: `expo/expo`, `expo/eas-cli`, `supabase/supabase`, `supabase/supabase-js`, `anthropics/anthropic-sdk-python`, `anthropics/anthropic-sdk-typescript`, `anthropics/claude-code` (when public release tags publish), `vllm-project/vllm`, `ggerganov/llama.cpp`. Semver-detected severity: `critical` major / `high` minor-breaking / `medium` minor / `low` patch. LLM-summarize: yes for majors.
   - **L3 — NVD CVE feed, filtered to stack components** (NVD 2.0 API with key). CPE allowlist at `~/.config/reach4all-listener/cve-allowlist.yaml` covers Python, Node.js, Postgres, Expo, Supabase, macOS, iOS, Cloudflare, Hashicorp. CVSS v3.1 mapping: ≥9.0 critical / 7.0–8.9 high / 4.0–6.9 medium / <4.0 low. Initial chat-alert threshold: ≥ high. CPE allowlist tuning is the long pole (3 days estimated).
   - **L4 — Apple App Store guideline changes** (HTML diff + Apple Developer News RSS). Sources: `developer.apple.com/app-store/review/guidelines/` and `developer.apple.com/news/rss/news.rss`. Severity: `critical` for any guidelines-document HTML diff; `high` for News entries containing policy/guideline/review/agreement/privacy/tracking/IDFA keywords. Lifting Tracker production-readiness depends on this.
   - **L5 — Vendor commercial-terms watch** (HTML diff + git-commit). Sources: Anthropic ToS (consumer + API), Supabase Terms + LICENSE-file commit watch, Hetzner AGB (German + English), OpenAI Usage Policies, Cloudflare ToS. Apple Paid Apps Agreement: manual-flag-only initial path (per §12.3 / Q3 — confirm at sprint open). All four routing tiers fire on every event (low volume <1/wk, high per-event business value).

5. **NEW — Tier-2 chat-alert ingress mechanism.** MVP path per prep doc §11.3 pre-condition 5: file-write to `~/reach4all-alerts/<YYYY-MM-DD>.md` that Cowork reads on startup. Memory-file append schema (tier 1) per §6.4a: per-entry markdown with severity in header line for `grep "(critical)"` filtering. Research-task spawn (tier 3) writes to `~/reach4all/research/_inbox/`. Archive (tier 0) writes to hot tier. **Specifics deferred to Q1 at sprint open** — Cowork plugin push integration is Sprint 0e+N, file-write MVP is the build-phase target; per-source routing-tier defaults per §6.5 table apply. Definition of done per prep doc §11.4: ≥1 tier-2 chat alert fired and Eric has read it (validates chat-alert path end-to-end); ≥1 tier-3 research-task spawn fired and Eric has reviewed the inbox (validates spawn path end-to-end).

### Workstream B — Scheduler (1 CC)

6. **NEW — Scheduler implementation.** ~17 cron-driven research tasks set up via `mcp__scheduled-tasks__create_scheduled_task`. Tasks run on Eric's host on cron schedules; findings land in `~/reach4all/docs/research/`. Five cadence tiers:
   - **Daily:** Anthropic news, frontier-model releases, AI coding-agent failure incidents, Claude Code release notes
   - **Weekly:** skill/MCP ecosystem, open-source AI tooling, Lifting Tracker tech stack, Anthropic Cowork/Dispatch product changes
   - **Bi-weekly:** vendor commercial-terms watch, GitHub pay-to-play indicators
   - **Monthly:** mobile DB landscape, observability backend ecosystem, Apple platform changes
   - **Quarterly:** DoDAF/UAF/OMG, IEEE/ISO/SEI standards, OWASP releases, DISA STIG updates

   Each task: prompt template, output destination, idempotency rule (don't re-land identical findings), failure-handling. Scheduler and listener share state through `~/reach4all/` git-tracked repo (§6.3 of prep doc) — the scheduler's weekly-digest pass reads the listener's archive; the integration handshake can land in Sprint 0e+1 without holding either build. The two are independently buildable in parallel.

### Workstream C — LLM-Extraction Validation (1 CC)

7. **NEW — LLM-extraction validation deliverable.** Per `~/reach4all/docs/research/llm-unrestricted-research-extraction-strategy-research.md` §1: kick off the 60-day Lambda Labs validation (~$200 spend) for Qwen 3.5-122B-A10B + Llama 3.3 70B as the listener's LLM-summarize tier endpoint and the broader portfolio's research-extraction substrate. Decision-trigger criteria established for the eventual build/buy call: what observable conditions tip toward "build owned-hardware (M3 Ultra 192GB or post-WWDC successor)" vs "keep renting cloud" — write up in `~/reach4all/docs/research/llm-build-buy-decision-criteria.md`. Sprint 0e LLM hosting decision documented and finalized as the listener's Q8 input (per §12.8 of prep doc). Per Eric's prior call: a self-hosted LLM that Eric configures should not impose external translation/quote constraints; Anthropic's <15-word translated-quote rule applies to Claude outputs, NOT to a local LLM Eric runs.

   **Sub-criteria for CC-7** (per `llm-unrestricted-research-extraction-strategy-research.md` §10.7 sprint-aligned implementation roadmap; sequenced over the 60-day validation window):

   - **CC-7.1 — Lambda Labs validation rig setup (Day 0–2, ~4–8h).** H100 PCIe 80GB at $2.86/hr selected per §6.1; vLLM v0.17+ as primary inference engine (Ollama for first 1–3 days of system-prompt iteration loop, then promote to vLLM). Pull Qwen 3.5-122B-A10B-Instruct (Apache 2.0, primary) and Llama 3.3 70B Instruct (Llama Community License, fallback) per §3.12.1 / §3.12.3 deployment recipes. Quantization default Q4_K_M. `~/reach4all/llm-build-tooling/` directory created at sprint open and hosts validation logs, system-prompt versions, eval-harness scripts, eventual MCP-server skeleton. Operational discipline per §6.4 runbook: provisioning script + spend-cap alerting at $150 (75% of $200 cap).

   - **CC-7.2 — Eval harness + test corpus design (Day 3–14, ~8–15h, Code-agent-authored with Eric review per §11.7).** Implements §5.8 validation eval harness measuring four dimensions: refusal rate per extraction-pattern class, extraction-quality distribution (verbatim accuracy, completeness, format-fidelity), multilingual coverage gaps, output-format consistency. Seed corpus per §5.8 covers six extraction-pattern classes from §2.1: STIG control text (20–80 words), NIST 800-53 control statements (30–150 words), RFC normative excerpts (50–200 words), academic-paper conclusions (50–300 words), vendor documentation extracts (40–200 words), Concept Computing source quotes (CC-013/014/015/016/017 inheritance language). Plus multilingual seed cases for CJK + Eurolang priorities per §11.6. Eric reviews + accepts/revises seed corpus before validation begins.

   - **CC-7.3 — Refusal-pattern baseline + system-prompt iteration (Day 3–45 concurrent, then Day 15–45 focused).** Establish baseline refusal rates by running seed corpus through both models with the §5.2 draft system prompt (zero iteration). Then iterate per §5.6 patterns: identify residual refusal patterns, tune prompt phrasing per model family (Qwen and Llama tokenize differently), re-measure. Quality bar / accuracy thresholds per §11.8 (Eric to accept or revise at sprint open): refusal-clean ≥90% closes the loop on system-prompt-only path; 70–90% clean warrants residual-case LoRA per §4.1; <70% warrants model swap before fine-tuning. Multilingual translation quality variance per §5.4 captured separately (parallel-translation review against second model is the §5.4 good-practice control for high-stakes translations).

   - **CC-7.4 — Production-volume simulation (Day 46–60, late-sprint load test).** Drive the validation rig at projected daily-volume per §7.6 scenarios (low: 25/day, medium: 100/day, high: 300+/day with agentic-workflow integration). Capture observed GPU-hours, monthly-cost projection, output-quality stability under load. Validates §6.2 production-validation phase cost projection ($300–700 over 90 days) before committing to the spend. Output: workload sensitivity table per §7.6.4 calibrated to Eric's actual draft workload.

   - **CC-7.5 — Build vs buy decision matrix and criteria.** Crystallizes the §1 / §10.6 recommendation dependencies into an explicit matrix landing in `~/reach4all/docs/research/llm-build-buy-decision-criteria.md`. Inputs: SD-001 trigger status (WWDC June 2026 announcement + sprint capacity), refusal-clean rate from CC-7.3, volume from CC-7.4, source-language distribution per §11.1, fine-tune budget posture per §11.2, NVIDIA-vs-Apple posture per §11.4. Decision triggers per §10.8 documented as binary readable: Anthropic research-tier API announcement (defer build entirely); DeepSeek V4-Flash inference-engine maturity + workload-beats-Qwen evidence (promote V4-Flash to primary); Lifting Tracker athlete-medical workload landing (owned-hardware acquisition urgency increases regardless). Hybrid-routing posture per §8.7 use-case-by-use-case routing table is the realistic exit posture, not pure build-or-buy.

   - **CC-7.6 — Migration path if build wins (post-SD-001 trigger, target Sprint 0f+).** Owned-hardware deployment runbook per §6.5: M3 Ultra 192GB ($4,930 refurb / $5,800 list) at validation-phase-end if M5 Ultra has not yet shipped, M5 Ultra 192GB+ if it has shipped by then. Capacity-fit Qwen 3.5-122B-A10B Q4 (~70GB) + Llama 3.3 70B Q4 (~40GB) with multi-model concurrency headroom on 192GB. Migration tasks: hardware purchase, deployment, model-state replication from Lambda Labs, MCP-server integration with Cowork per §11.5 (1–2 days, post-validation). Cost trajectory: ~$60–180 electricity Year 1 + ~$0 inference (sunk cost).

   - **CC-7.7 — Migration path if buy wins (continued cloud-rental, hybrid-routing).** §6.2 production-validation phase extends as the steady-state posture: ~$300–700/year Lambda Labs at projected daily volume. Hybrid cost model per §8.5: commercial APIs (Anthropic Claude / GPT-5.5) handle quote-cap-tolerant workload; Lambda-hosted Qwen/Llama handles unrestricted-extraction workload. LiteLLM proxy per §3.12.4 provides the unified routing layer. Lambda dependency risk (R-L1-equivalent per §9.7) tracked: alternate provider runbook (RunPod / CoreWeave) for provider-failure recovery.

   - **CC-7.8 — Validation-phase close memo (Day 60).** Output deliverable: `~/reach4all/docs/research/llm-validation-phase-close-memo_v0.1.0.md`. Contents: go / no-go recommendation on owned-hardware acquisition; refusal-clean / quality / volume metrics from CC-7.3 and CC-7.4 against §11.8 thresholds; build/buy decision per CC-7.5 matrix; deprecation plan per SD-012 / §11.10 (deprecation triggers: Anthropic research-tier API ships, open-weight ecosystem produces clearly-better-than-Qwen-3.5 model, portfolio scope changes such that unrestricted-extraction is no longer load-bearing); LLM-build supply-chain-integrity posture cross-reference into `security-controls-baseline_v0.1.0.md` as a control-item entry per §9.4. Memo seeds the standing reference doc that documents the LLM-build's permanent operational discipline (downstream-copyright-handling-by-Eric framing per §9.1).

### Operational handoff

8. **NEW — Operational artifacts committed.** Per prep doc §11.4a handoff checklist:
   - Listener repo: complete `src/`, `tests/`, `examples/`, `deploy/` per §4.6 layout. README documents install, configure, operate, troubleshoot.
   - `examples/sources.yaml` — the §5 five listeners' source-register entries.
   - `examples/router-rules.yaml` — the §3.6 / §3.6a initial rule set, calibrated through days 11-12.
   - `deploy/com.reach4all.listener.plist` + `deploy/com.reach4all.listener-watchdog.plist` — LaunchAgent templates with install instructions.
   - `~/.config/reach4all-listener/secrets.env.example` — documents required secrets (`NVD_API_KEY`, `GITHUB_TOKEN`); `.gitignore` excludes live `secrets.env`.
   - `~/reach4all/docs/architecture/listener-source-register.md` — cross-link from architecture docs to live `sources.yaml`; documents source-register CM cadence per §8.6.
   - `~/reach4all/docs/architecture/listener-router-rules.md` — same for router-rules.
   - `~/reach4all/docs/operational/listener-runbook.md` — operational runbook covering §9 failure modes and recovery actions.
   - Prep research doc updated with `updated: <ship date>` per attribution rule.

   CM doctrine: live config (`sources.yaml`, `router-rules.yaml`) lives in the listener repo; portfolio-architectural cross-references live in `~/reach4all/docs/architecture/`. The two are versioned independently; architecture cross-references include the listener-repo SHA at time of writing for traceability.

**Plus retro at close** — `sprint-retro-0e.md` (or `lift-track-sprint-retro-0e.md` per naming convention).

**Stretch (only if 1-8 land cleanly with capacity remaining):**

- **Frontier-model channel listener** (Hugging Face top-trending RSS + per-lab announcement feeds — Anthropic, OpenAI, DeepSeek, Mistral, Meta, Google DeepMind, Cohere, AI21, xAI, Latent Space podcast). Highest-value Sprint 0e+1 addition; covers DeepSeek-V4-class miss case directly. Adds 5–8 sources whose noise-to-signal calibration takes 2-3 days. Per Q9 — defer unless Eric promotes to day-1 at sprint open.
- **Conference-aware polling cadence** ahead of WWDC June 2026 (calendar-aware override that elevates polling cadence during specified conference weeks).
- **First scheduled-task validation pass:** confirm at least one daily and one weekly task has landed two cycles' worth of findings.
- **Cross-link the scheduler's research findings into the relevant listener feeds** (close the loop between pull and push).
- **Listener calibration extension:** if calibration phase finds noise floor higher than ~15 alerts/week target (R-L4), extend recalibration per §9.6.

---

## Decisions required at sprint open (10 open questions from prep doc §12 — verbatim)

These are bounded design-confirmation questions. None require additional research — only Eric's preference. Most settle in a single message; a few may warrant Sprint 0e build-phase day-1 discussion. **Do not pre-empt at sprint draft time** — the prep doc landed these as open and the sprint-open commit is the right place to resolve them.

**Q1 — Cowork chat-alert ingress mechanism (§12.1).** MVP path is file-write to `~/reach4all-alerts/<YYYY-MM-DD>.md` that Cowork reads on startup. Is that the right MVP path for this build, or defer the listener until the Cowork plugin SDK supports a richer push integration? Trade-off: file-write MVP ships Sprint 0e and works (Eric reads alerts when he opens Cowork); richer integration ships Sprint 0e+N but interrupts the desktop more aggressively, which may or may not be desirable per the §6.4 "no interrupt tier" stance.

**Q2 — Severity threshold for tier-2 chat alerts (§12.2).** Initial proposal: severity ≥ high routes to tier 2 (chat alert). At ~15 alerts/week steady-state, this is calibrated for "Eric reads every alert" within ~1 minute each. If Eric's tolerance is lower (5 alerts/week target), the threshold should be `severity = critical` only, with tier 1 (memory file) as the default for everything else. Confirm initial threshold; recalibrate per §9.6 after 4 weeks.

**Q3 — Vendor commercial-terms watch — Apple Paid Apps Agreement (§12.3).** Three options: (a) manual-flag-only — listener fires a weekly reminder to check the portal manually (safe; misses events between weekly checks); (b) authenticated-fetch path — listener stores Apple Developer credentials, fetches via authenticated endpoints (higher operational risk, low-volume, needs explicit credential-storage decision); (c) defer entirely — drop from listener scope, rely on annual review during App Store submission preparation. Manual-flag-only is the safe Sprint 0e default.

**Q4 — Listener repo location (§12.4).** Proposed: `~/code/reach4all-listener/` as a separate operational-tools repo. Alternative: include the listener under `~/reach4all/` as a sub-directory (e.g., `~/reach4all/listener/`), keeping all portfolio-adjacent operational tools in one repo. Argument for separation: `~/reach4all/` is the research repo per CLAUDE.md repo identity; mixing operational code muddies the content-class discipline. Argument for inclusion: one less repo to keep current; cross-references from `docs/architecture/` to listener config are simpler.

**Q5 — Should listener events be considered a research-class artifact (§12.5).** `~/reach4all/research/listener-events.md` is the memory-file the listener appends to. If treated as research-class artifact under WF-003L, it carries standard frontmatter and footer per CLAUDE.md attribution rule. If operational-only (accumulates without curation; queried but not read straight-through), the attribution overhead is friction without benefit. Initial proposal: treat as operational only (not WF-003L); periodically distill to a research-class summary if patterns emerge worth elevating.

**Q6 — Off-hours alert behavior (§12.6).** Initial proposal (§2.3): off-hours (00:00–06:00 local) doubles all poll intervals. Tier-2 chat alerts continue uninterrupted; Eric reads them in the morning. Alternative: tier-2 alerts during off-hours are batched into a single morning-digest write rather than per-event, reducing morning-startup notification noise. Confirm preferred behavior; batched-morning is the more considerate default if Cowork's chat surface displays alerts persistently.

**Q7 — Vacation-mode trigger (§12.7).** §8.4 specifies an explicit `reach4all-listener pause-alerts` CLI command. Should this also auto-trigger on Mac sleep duration thresholds (e.g., Mac asleep >24h auto-pauses tier-2 alerts)? Auto-trigger is more convenient but introduces a behavioral surprise on the next manual session if Eric forgets the auto-trigger fired. Initial proposal: explicit-only, no auto-trigger.

**Q8 — LLM-summarize on day-1 vs deferred (§12.8).** LLM-summarize tier (§3.7) is part of the §3 design but inherits Sprint 0e LLM hosting decision. Options: (a) day-1 ship with LLM-summarize live — assumes Sprint 0e LLM hosting ready by build day 8; if hosting slips, listener ships with un-summarized bodies and `llm_summarize: false` per source; (b) deferred to Sprint 0e+1 — listener ships without LLM-summarize, enabling it explicitly once LLM hosting stable. Cleaner schedule decoupling. Per R-L1 graceful-degradation handles slip case. Both options work; preference question.

**Q9 — Initial source-register breadth (5 vs 6 listeners) (§12.9).** The §5 five listeners are the recommendation. Eric has flagged frontier-model channel listening (DeepSeek-V4-class miss case) as the most-painful-recent miss; this is currently in §5.7 as deferred to Sprint 0e+1. Is the frontier-model channel listener urgent enough to add as a sixth listener at Sprint 0e build, accepting the additional 2–3 calendar days for source-register tuning and noise-floor calibration? **Default for this draft: 5 listeners; frontier-model channel deferred to 0e+1 unless Eric promotes to day-1 at sprint open.**

**Q10 — Ownership of listener repo (§12.10).** Document treats the listener repo as Eric's individual operational tool. If the listener becomes valuable enough to other practitioners (per `anthropic-power-user-architect-community-research.md` discussion), is open-sourcing the listener (modulo the source-register, which stays private) a path Eric wants to keep open? Affects license-file choice at repo creation. Per CLAUDE.md "proprietary by default — all rights reserved — until Eric explicitly decides otherwise," the listener stays proprietary unless Eric flips this. The open question is whether to tag the listener as a candidate for eventual open-sourcing, which would influence small choices (clean config-vs-secrets separation, contribution-friendly README posture) made during build.

---

## Additional decisions required at sprint open — LLM-extraction (10 from `llm-unrestricted-research-extraction-strategy-research.md` §11)

Parallel to the listener's 10 above; settle CC-7's sub-criteria parameters before validation begins.

**Q-LLM-1 — Source-language distribution in actual portfolio research (§11.1).** Recommendation pivots on multilingual coverage. <10% non-English over next 12 months → Qwen's multilingual differentiator is moot, Llama 3.3 70B becomes simpler primary. ≥25% → Qwen clearly primary. Eric to estimate based on actual research-doc backlog and CJK-source plausibility.

**Q-LLM-2 — Acceptable fine-tune budget posture (§11.2).** If validation shows system-prompt approach hits walls, what is Eric's appetite for the LoRA path? Range: $0 (system-prompt-only forever; revert to manual transcription if it doesn't work) → $500–$1,000 (LoRA + synthetic-data + eval-harness investment) → $5,000+ (full QLoRA on 70B). Eric to set the cap.

**Q-LLM-3 — Owned-hardware target: M3 Ultra now vs M5 Ultra later (§11.3).** WWDC June 2026 ships M5 Ultra at announcement → wait (better hardware, ~$500–$1,500 more capex). WWDC slips to October per macworld speculation → M3 Ultra refurb in summer is the call. Eric's preference for "best hardware" vs "ship the build faster" determines.

**Q-LLM-4 — NVIDIA path under what condition (§11.4).** Default is Apple Silicon. Eric leans Apple → M3/M5 Ultra. Eric leans CUDA → RTX 6000 Pro Blackwell at $10–13K (adds fine-tuning capability at 2–3× capex). Make the call explicitly rather than ambiently.

**Q-LLM-5 — Cowork / Claude Code MCP integration timing (§11.5).** Local LLM as MCP server callable from Cowork agentic workflows: integration is light (1–2 days) but adds operational surface area. Recommend yes, post-validation, once owned-hardware deployment lands. Sprint 0e or 0f scope.

**Q-LLM-6 — Sources-language priority list (§11.6).** If Qwen selected, which non-English languages does Eric most-want robust support for? Default: Mandarin, Japanese, Korean (East Asian Studies background). Add: Spanish, French, German, Italian, Portuguese (commercial-portfolio Eurolang). Add: any specific languages the research roadmap actually anticipates.

**Q-LLM-7 — Eval-harness ownership (§11.7).** §5.8 eval harness is Sprint 0e CC-7.2 scope. Who authors? Eric → 8–15 hours of work. Code agent → similar but with Eric review. Recommend Code agent with Eric review pattern.

**Q-LLM-8 — Trigger-to-go-decision metric thresholds (§11.8).** Per §10.6, recommendation depends on certain thresholds (refusal-clean ≥90%; volume ≥25/day; etc.). Eric should accept or revise these thresholds before validation begins so the validation outcome is binarily readable (drives CC-7.3 quality bar and CC-7.5 build/buy matrix).

**Q-LLM-9 — Anthropic relationship management posture (§11.9).** Portfolio uses Claude / Claude Code / Cowork heavily. Unrestricted-extraction LLM doesn't replace Anthropic — but it signals that Anthropic's current commercial-terms restrictions are leakage at the use-case level. Worth tracking whether the open-weight approach matures into a public research narrative (per SD-006 publication path) and what that might mean for Anthropic relationship signaling.

**Q-LLM-10 — Documentation deprecation plan per SD-012 (§11.10).** LLM build is a portfolio-level research-tooling component. Per SD-012's Lifecycle Integrity discipline, ships with deprecation plan from inception. Recommended deprecation triggers: (a) Anthropic ships research-tier API; (b) open-weight ecosystem produces a clearly-better-than-Qwen-3.5 model that lifts deployment to a different tier; (c) portfolio scope changes such that unrestricted-extraction is no longer load-bearing. Deprecation plan lands as small section in the LLM build's standing reference doc (CC-7.8 close memo seeds it), not as a separate research output.

---

## Pre-conditions for Sprint 0e build (per prep doc §11.3)

Verify before sprint-open commit:

1. **Sprint 0e LLM hosting decision finalized.** The LLM-summarize tier (§3.7) needs a target endpoint. Lambda Labs validation path per `llm-unrestricted-research-extraction-strategy-research.md` §1 is the expected default; if owned-hardware (M3 Ultra 192GB) lands first, that's the target. Either way, the listener calls into a documented endpoint. Tracked as Workstream C / CC7.
2. **macOS workstation chosen and stable.** Listener lives on Eric's primary workstation; if a workstation migration is in flight (e.g., from current Mac to a new M5 Ultra post-WWDC June 2026), defer Sprint 0e listener build until post-migration to avoid building twice. Risk R-L5 in §11.7.
3. **NVD API key obtained.** Free; takes <5 minutes; do this in Sprint 0d2 prep so it's ready.
4. **GitHub PAT (read-only, public-repo) generated and stored.** Same — do in Sprint 0d2 prep.
5. **Cowork chat-alert ingress mechanism agreed** (Q1 above). MVP file-write path is the build-phase target.

---

## Risk register (carried from prep doc §11.7)

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R-L1 | Sprint 0e LLM hosting slips, listener ships without LLM-summarize tier | Medium | Low — listener works without it; bodies un-summarized but events still route | Build with graceful degradation per §3.7; ship with `llm_summarize: false` if hosting not ready, enable later via SIGHUP reload |
| R-L2 | RSS feed for one of the §5 sources has a schema quirk feedparser doesn't handle | Medium | Low — affects one source; per-source fallback is HTML-diff or git-commit equivalent | Per-source verification day 2 of build; switch fetcher type if needed |
| R-L3 | Apple App Store guidelines page restructures during Sprint 0e build | Low | Medium — Apple guidelines listener is the most fragile of the five | Use both HTML diff (for the canonical doc) and Apple Developer News RSS (for the announcement signal); either path covers if the other breaks |
| R-L4 | Calibration phase finds noise floor higher than ~15 alerts/week target | Medium-high | Low — recalibration in scope (§9.6); just extends Sprint 0e by a few days | Build Sprint 0e schedule with 2-day buffer in days 11–12 explicitly for recalibration |
| R-L5 | Workstation migration (M5 Ultra post-WWDC) interferes with build window | Low | High — would force re-build on new host | Lock Sprint 0e build to current workstation; defer migration until post-listener-stable if migration becomes likely |

Copy to active sprint risk register at Sprint 0e kickoff.

---

## Minimal viable listener fallback (per prep doc §11.8)

If Sprint 0e calendar compresses (other portfolio work takes priority, illness, hardware delay), a minimal-viable listener can ship in 3 days using the §4.1 option 10 approach (bash + LaunchAgent) for two sources only:

- Anthropic news RSS via `curl` + `sha256sum` + `osascript display notification`.
- GitHub Releases for `anthropics/anthropic-sdk-python` via the Atom feed at `releases.atom`, same pattern.

This is *not* the §3 design. It is a placeholder that captures the highest-value 20% of the listener with 5% of the build effort. The full §3 design supersedes when ready. Fallback is not the recommendation — it is the explicit de-scope option for an explicit kind of risk-realization.

---

## Open-items migration from Sprint 0d

Per §14.2 inheritance rule. **To be populated at actual sprint open from Sprint 0d's close kanban per CONVENTIONS §14.2.** At draft time (Sprint 0d still open as of 2026-04-30), the expected pattern is:

- Bring-forward items: any Sprint 0d close criteria that didn't fully close, plus the eight items pre-staged for 0e (listener daemon, 5-component architecture, two-tier storage, 5 initial listeners, tier-2 chat-alert ingress, scheduler, LLM-extraction validation, operational handoff)
- Carry-forward backlog: any deferred items from 0c2 / 0d — likely the second/third rollback playbooks if they didn't land as 0d stretch, Concept-side manifest, trust-but-verify instrumentation framework, MCP installs, DoDAF cross-reference matrix, Cowork bypass STIG-format compensating-control doc (CC3b moved out of 0d at 0c0.5 close)
- Out-of-band: hardware purchase decision (may resolve post-WWDC June 2026), `f0492d52` URL re-share

| Item | Source | Disposition |
|---|---|---|
| (Placeholder. Populate at 0e sprint-open commit by reviewing frozen `lift-track-kanban-sprint-0d.md` Done / Open / Carry-forward state.) | — | — |

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| (Empty at sprint open. Items added as work begins.) | — | — | — |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| (Empty at sprint open. The 10 §12 open questions above resolve at sprint-open commit, not sprint-execution.) | — | — |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint open.) | — | — |

## Done — Sprint 0e

| Card | Closed | Artifact | Notes |
|---|---|---|---|
| (Empty at sprint open. Items move here as they close.) | — | — | — |

---

## Other Session Work

Eric-maintained — sessions Dispatch cannot see (Chrome, mobile, other CLI).

| Session | Started | Status | Notes |
|---|---|---|---|
| (Empty at sprint open.) | — | — | — |

---

## Post-Sprint-0e watch items (per prep doc §11.5)

Recorded so the next sprint planning has the carry-forward list:

- **Frontier-model channel listener** (Hugging Face top-trending + per-lab announcement RSS). Target: Sprint 0e+1 (unless promoted day-1 per Q9). Highest-value addition; covers the DeepSeek-V4 miss-case category directly.
- **Conference-aware polling cadence.** Target: Sprint 0e+1 (before WWDC June 2026 if Sprint 0e build lands April–May 2026; otherwise Sprint 0e+2). Adds calendar-aware override that elevates polling cadence during specified conference weeks.
- **FTS5 search on `event_hot`.** Target: Sprint 0e+N when ad-hoc search frequency justifies it. MVP `LIKE`-based search is sufficient initially.
- **Cowork plugin chat-alert integration.** Target: Sprint 0e+N gated on Cowork plugin SDK maturity.
- **Webhook ingress with Cloudflare Tunnel.** Target: Sprint 0e+N when first webhook-supported source is identified that justifies the public ingress.
- **Listener move to dedicated host.** Target: Sprint 0f+N if/when workstation availability becomes a constraint.
- **SBOM-aware CVE filtering.** Once the portfolio's SBOM generation work (per `security-controls-baseline_v0.1.0.md` SR family + CC-015 inheritance) lands, the CVE listener's allowlist can be auto-derived from the SBOM rather than hand-maintained. Significant maintenance reduction.

---

## Cross-reference

- **Prep deliverable (input to this sprint):** `reach4all://docs/research/listener-sniffer-architecture-design.md` (1,511 lines, decision-grade architecture, valid_as_of 2026-04-30, re_check_by 2026-07-30). §11.1 is the one-paragraph recommendation; §3 is the architecture pattern; §5 is the five initial listeners; §6 is scheduler integration; §7 is storage and retention; §11 is the build-phase plan; §12 is the 10 open questions reproduced above.
- **LLM-extraction prep:** `reach4all://docs/research/llm-unrestricted-research-extraction-strategy-research.md` (2026-04-29; 1,817 lines; valid_as_of 2026-04-29, re_check_by 2026-07-29). Sprint 0e LLM hosting decision input; pre-condition 1 above. §1 one-paragraph recommendation (Qwen 3.5-122B-A10B + Llama 3.3 70B, system-prompt-only, vLLM on Lambda Labs H100 for 60-day validation at ~$200, then promote to M3/M5 Ultra owned-hardware when SD-001 fires); §3 open-weight model survey; §4 fine-tuning approach (verdict: none at validation); §5 system-prompt strategy + §5.8 eval harness; §6 hosting strategy with §6.4 validation runbook + §6.5 owned-hardware deployment runbook; §7 cost trajectory + §7.6 workload sensitivity; §8 commercial-API comparison + §8.5 hybrid cost model + §8.7 use-case routing; §9 risks (§9.1 downstream copyright, §9.4 supply-chain integrity, §9.7 Lambda dependency); §10.7 Sprint-0e implementation roadmap (sourced into CC-7.1–CC-7.8 sub-criteria); §10.8 what changes the recommendation; §11 ten open questions (sourced into Q-LLM-1 through Q-LLM-10 above); §11.10 / SD-012 deprecation plan.
- **LLM scoping prior research:** `reach4all://docs/research/frontier-adjacent-local-llm-build-scoping-research.md` (Sprint 0c).
- **Hardware research:** `reach4all://docs/research/hardware-selection-research.md` (Sprint 0c).
- **DeepSeek-V4 miss-case origin:** Sprint 0c retro — canonical use case for event-driven sensing; cited in prep doc §1.2.
- **Prior sprint's kanban (frozen at 0d2 close):** `docs/lift-track-kanban-sprint-0d2.md`.
- **Sprint 0d2 retrospective:** `docs/retrospectives/lift-track-sprint-retro-0d2.md`.
- **Sprint 0e retrospective at close:** `docs/retrospectives/lift-track-sprint-retro-0e.md`.
- **Upstream sprint chain:** 0d → 0d1 → 0d1.5 → 0d2 → 0e per the 2026-04-30 sprint sequencing call. See `docs/lift-track-kanban-sprint-0d.md`, `docs/lift-track-kanban-sprint-0d1.md`, `docs/lift-track-kanban-sprint-0d1.5.md`.
- **Methodology:** `docs/CONVENTIONS_v0.2.4.md` §14, §14.5 work modes 6 (scheduled cadence) + 8 (event-driven listener).
- **Anthropic translated-quote rule:** applies to Claude outputs, not to Eric's self-hosted LLM (per Eric's call documented in Workstream C / CC7).

---

© 2026 Eric Riutort. All rights reserved.
