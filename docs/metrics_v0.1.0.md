---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-24
tier: OPERATIONAL
content_class: operational
version: 0.1.0
status: accepted
---

# Lifting Tracker — Productivity Metrics

## Purpose

Pre-AI-amplification baseline for solo+AI development throughput, captured weekly starting Sprint 0a. Future claims of "AI made me N× faster" are only real claims if they falsify against a number written in this table. Motivated by `reach4all://docs/research/ai-productivity-sdlc-dataops-review.md` §1.4 (baselining guidance as the document's most directly actionable finding) — six metrics, Monday morning cadence, minimal ceremony.

## Metrics tracked

Six metrics. Four are measurable now (Sprint 0a); two are named-but-dormant until Sprint 1 opens and CI/CD plus live data flows exist. Each metric below declares: definition, unit, source, collection method, current-week value.

### 1. Lead time

- **Definition:** Time from card created (or moved into any active lane) in `docs/kanban.md` to card moved into Done, for cards completed in the reporting week. Reported as the weekly median.
- **Unit:** Hours (rounded to nearest hour) or days (to one decimal) depending on distribution. Pick one and stay with it.
- **Source:** `docs/kanban.md` Sprint sections. Card appearance timestamp approximated from git log on kanban.md; completion timestamp from the Done-section date.
- **Collection method:** Manual. Read kanban.md, pull completed cards for the week, derive timestamps from git blame / git log on the file.
- **Current week (2026-04-27):** TBD.

### 2. Cycle time

- **Definition:** Time from first commit against a card (or first Edit against an artifact tied to a card) to Done. Excludes the backlog-waiting portion that lead time includes. Reported as the weekly median.
- **Unit:** Hours.
- **Source:** `docs/kanban.md` for card identity and Done date; `git log` for first-touch timestamp (first commit whose message or files reference the card).
- **Collection method:** Manual. Automatable once cards carry stable IDs and commits cite them consistently.
- **Current week (2026-04-27):** TBD.

### 3. WIP

- **Definition:** Count of cards sitting in the `### In Progress` section of `docs/kanban.md` at a Monday 09:00 snapshot. Raw count, no weighting.
- **Unit:** Cards (integer).
- **Source:** `docs/kanban.md` at the snapshot time.
- **Collection method:** Manual. `grep -c` on the In Progress table row count at Monday 09:00.
- **Current week (2026-04-27):** TBD.

### 4. Defect rate

- **Definition:** Cards that were marked Done during any week and subsequently returned to In Progress (or any non-Done lane) during the reporting week, divided by total cards completed in the reporting week.
- **Unit:** Percentage (0–100). If no cards completed this week, N/A.
- **Source:** `docs/kanban.md` history via `git log -p docs/kanban.md` filtered for reversion patterns (Done → In Progress moves).
- **Collection method:** Manual. Scan the week's commits on kanban.md for card movements out of Done.
- **Current week (2026-04-27):** TBD.

### 5. Pipeline velocity *(dormant until Sprint 1)*

- **Definition:** Count of successful pipeline runs per week — GitHub Actions completions, Vercel deployments, Supabase migration applies — summed.
- **Unit:** Pipelines / week (integer).
- **Source:** GitHub Actions run list, Vercel deploy log, Supabase migration history.
- **Collection method:** Automated once tooling exists. Manual stop-gap: Monday morning API pulls + tally. Meaningless until CI/CD is live; Sprint 0a rows record `N/A (pre-Sprint 1)`.
- **Current week (2026-04-27):** N/A (pre-Sprint 1).

### 6. Data freshness / latency *(dormant until Sprint 1)*

- **Definition:** Median elapsed time from Supabase source-ingest (INSERT on a production table) to analytics availability (row visible in the analytics view / dashboard).
- **Unit:** Seconds.
- **Source:** Supabase logs + analytics-view query timestamps; instrumented once dashboards exist.
- **Collection method:** Automated. No manual variant. Meaningless until live data flows exist.
- **Current week (2026-04-27):** N/A (pre-Sprint 1).

## Weekly log

Living record. One row per Monday, filled in at the Monday-morning cadence. Appended, not overwritten.

| Week (Monday) | Lead time (median) | Cycle time (median) | WIP (Mon 09:00) | Defect rate | Pipeline velocity | Data freshness |
|---|---|---|---|---|---|---|
| 2026-04-27 | TBD | TBD | TBD | TBD | N/A (pre-Sprint 1) | N/A (pre-Sprint 1) |

## Collection cadence

Every Monday morning. Manual collection for the four active metrics (lead time, cycle time, WIP, defect rate) against `docs/kanban.md` and `git log`. Pipeline velocity and data freshness are recorded as `N/A (pre-Sprint 1)` until Sprint 1 opens; at that point both promote to live collection and the collection-method entries above are revised from "dormant" to "active." The distinction between live and dormant metrics stays visible in this doc so a reader never mistakes a missing number for a zero.

## Baseline interpretation

These numbers are the pre-AI-tool-amplification baseline for Sprint 0a. Sprint 0a already runs on AI-heavy workflows (Claude Code, Cowork Dispatch, Claude in Chrome), so "pre-AI" here means *pre-Lifting-Tracker-MVP-shipped*, not *pre-AI-tools*. The comparison that matters: when Lifting Tracker MVP ships and Eric begins making productivity-lift claims — "Claude Code cut feature work by N%," "Dispatch halved research turnaround" — those claims must be falsifiable against the weekly rows recorded here between now and ship. A claim that can't be falsified against this table isn't a real claim. Separately, these numbers are not benchmarks against industry figures; the AI-productivity review doc is explicit that solo+AI throughput sits outside the Gartner 25–30%-by-2028 band in both directions.

## Metric evolution

Review the metric list at each sprint close. Add, remove, or refine based on what has proven useful. Do not churn: the six current metrics stay locked for at least Sprint 0a and Sprint 0b before any change, because short baselines carry too much noise to read a trend off of. Candidates flagged for later consideration — flow efficiency (cycle time / lead time), review latency once a PR workflow exists, Supabase migration-failure rate, AI-intervention rate (count of turns where Eric corrects Claude mid-task per completed card). None adopted yet.

---

© 2026 Eric Riutort. All rights reserved.
