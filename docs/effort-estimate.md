---
author: Eric Riutort
created: 2026-04-17
updated: 2026-04-17
---

# Lifting Tracker — Effort Estimate

> **Scope note:** This document estimates the calendar time required to build the **Lifting Tracker** sub-system of **XRSize4 ALL** across its planned phases (MVP, v2, v3, v4, Future). The estimate assumes Eric as the primary developer working with **Claude Code** as the primary coding partner, with Ethan providing coaching domain expertise and alpha testing. This is a working estimate, not a commitment. Reading order: `xrsize4all_concept.md` (platform), `architecture.md` (decisions D1–D24), `user-stories.md` (114 stories), `themes-epics-features.md` (work hierarchy), this document (schedule).

## Baseline Assumptions

These assumptions drive every number in this document. If they change, the estimate changes.

| Assumption | Value |
|---|---|
| Primary developer | Eric (solo) |
| Coding partner | Claude Code |
| Domain expert / first user | Ethan |
| Developer time commitment | ~10–15 hours/week (evenings and weekends) |
| Architectural discipline | High — decisions pre-made in D1–D24 |
| Stack | Expo + Supabase (D8), proven and well-trodden |
| Alpha audience | 4–6 named users (D7) |

**What Claude Code is fast at:**
React Native components, Postgres schema, API routes, unit tests, data transformations, import parsers, documentation, refactoring, schema migrations.

**What Claude Code is slow at (still needs you):**
Debugging on real devices, interpreting platform-specific Xcode/TestFlight errors, designing UX based on real user feedback, making product judgment calls, setting up external services (Supabase, Stripe, AWS).

**Rule of thumb:**
Claude Code can roughly **3–5× your output on well-specified implementation work** but doesn't reduce the fixed costs of deployment, testing, user feedback cycles, and product iteration. Implementation is roughly 50–60% of total project time; the rest is iteration, testing, and external dependencies where the multiplier is closer to 1×.

## Phase-by-Phase Estimate

Each phase lists the major work chunks with a calendar-time range for each. Ranges are realistic (not best-case) given the ~10–15 hours/week commitment.

### MVP — Lifting Tracker Alpha

**54 user stories across Themes T1 (Foundation), T2 (Core Athlete), T4 (Unstructured sessions), T5 (Basic goals and photos), T6 (Instructional text), T7 (Basic AI).**

| Work chunk | Calendar time |
|---|---|
| Expo + Supabase skeleton with auth (magic-link), offline-first sync, role scaffolding | 2–3 weeks |
| Exercise library seeding, custom exercises, alias system, limb configuration | 2 weeks |
| Session/exercise/set logging UI including rest defaulting, set grouping, per-implement weight | 3–4 weeks |
| Historical import parser for `combined_workout_log.txt` (WxR, WxRxN, parens, rest codes) | 1–2 weeks |
| Progress and analytics (dashboard, 1RM trends, volume trends, history views) | 2–3 weeks |
| Goals MVP (strength + body weight, auto-computed progress) | 1 week |
| Progress photos MVP (upload, gallery, side-by-side, encryption) | 1–2 weeks |
| AI-assisted features (NL workout entry, session summaries, anomaly detection) | 1–2 weeks |
| TestFlight distribution, alpha onboarding, instrumentation | 1 week |
| Alpha feedback iteration, bug fixing, polish | 2–4 weeks |

**MVP total: 16–24 weeks (~4–6 months)**

Realistic target: **6 months**, not 4. Alpha iteration on real user feedback consistently eats schedule margin.

### v2 — Coaching Activation

**30 user stories across Themes T1 (Coach role), T3 (Coaching platform), T4 (Programs/Routines/Classes), T5 (Goals expansion, photos enhanced), T6 (Coach content, form capture), T7 (AI coaching).**

| Work chunk | Calendar time |
|---|---|
| Coach role UI activation, client roster, client history views | 2 weeks |
| Workout assignment: templates, assign to client, prescribed-vs-actual | 2–3 weeks |
| Coach-as-athlete dual role, privacy boundaries | 1 week |
| Programs, Routines, Classes full hierarchy UI | 3–4 weeks |
| Form video capture, playback (including slow motion), coach annotation | 3–4 weeks |
| Progress photos enhanced (guided capture, coach sharing) | 1–2 weeks |
| Goals expansion (multi-category, milestones, coach-assigned) | 1–2 weeks |
| Coach-produced instructional content (hosted video, visibility controls) | 2 weeks |
| AI coaching (client summaries, program drafts) | 2 weeks |
| v2 alpha → beta transition, more users, more feedback | 3–4 weeks |

**v2 total: 20–28 weeks (~5–7 months)**

### v3 — Advanced AI and Analysis

**12 user stories across Themes T5 (AI goals, AI photo analysis), T6 (AI instructional, form measurements, form NL feedback).**

This phase is harder to estimate because Claude Code's productivity multiplier thins out on specialized AI work.

| Work chunk | Calendar time |
|---|---|
| Pose estimation pipeline (MediaPipe or similar), joint angle computation, tempo analysis | 3–4 weeks |
| Form feedback natural language generation with Reasoner Duality | 2–3 weeks |
| Cross-session form comparison | 1 week |
| AI observational summaries of progress photos with neutral-language guardrails | 2 weeks |
| AI estimates of body composition with uncertainty framing | 2 weeks |
| AI goal assistance (vague-to-specific, alignment, tension detection) | 2–3 weeks |
| AI-generated exercise demonstrations (animated figures + synthesized voice) | 6–8 weeks |
| Content role / skill personalization | 2 weeks |

**v3 total: 20–25 weeks (~5–6 months)**

In practice, v3 would likely ship in batches rather than as one release. The AI-generated exercise demos alone could be its own quarter.

### v4 — Real-Time Form Feedback

**1 user story (US-153). Deceptively small.**

Real-time on-device processing, audio cueing, low-latency feedback pipeline. May depend on Apple Watch integration (T8) being in place.

**v4 total: 8–12 weeks (~2–3 months) as a focused project.**

### Future — Extended Platforms, Admin, Data Export

**17 user stories across Themes T1 (data export, admin, gym, teams), T8 (wearables and Android).**

| Work chunk | Calendar time |
|---|---|
| Apple Watch native app (SwiftUI, not Expo) — US-080, US-081, US-082 | 6–8 weeks |
| Smart glasses / voice logging — US-083 | speculative |
| Wear OS Android app (Kotlin, not Expo) — US-084 | 6–8 weeks |
| Admin and gym management — US-200–US-212 | 4–6 weeks |
| Teams — US-220, US-221 | 2 weeks |
| Data export — US-330, US-331 | 1 week |

**Future total: 20–30+ weeks of work, spread out and triggered by user demand rather than planned.**

## Cumulative Schedule

| Phase | Calendar time | Cumulative | Target delivery |
|---|---|---|---|
| MVP | 4–6 months | 4–6 months | ~Q3 2026 |
| v2 | 5–7 months | 9–13 months | ~Q1–Q2 2027 |
| v3 | 5–6 months (or spread) | 14–19 months | ~Q3–Q4 2027 |
| v4 | 2–3 months | 16–22 months | ~Q1 2028 |
| Future | Ongoing | Demand-driven | — |

**Key milestones:**
- **MVP alpha shippable:** ~6 months from serious-start
- **Beta-ready coaching platform (MVP + v2):** ~9–13 months from serious-start
- **Full vision (MVP + v2 + v3 + v4):** ~16–22 months of solo work

For comparison, a funded team of 3–5 engineers would likely ship the same full scope in **12–18 months** rather than 16–22, but at substantially higher cost and with more coordination overhead.

## What Claude Code Actually Changes

**Fixed costs Claude Code does NOT reduce:**
- User research and feedback cycles
- Real device testing (iPhone in gym environments, cellular variability)
- Deployment and distribution (TestFlight provisioning, App Store review)
- External service setup (Supabase project, Stripe account and KYC, AWS for video hosting if v2+)
- Debugging hardware-specific issues
- Making product decisions and tradeoffs

**Variable costs Claude Code DOES compress (roughly 3–5× productivity):**
- Writing new components from clear specs
- Writing tests
- Writing data transformations and migrations
- Schema changes
- Documentation
- Refactoring

**Why the documents we've built lower ongoing cost further:**
Each sprint, you can give Claude Code a specific epic or feature (from `themes-epics-features.md`) with its linked stories (from `user-stories.md`) and architectural anchors (from `architecture.md`), and Claude Code has the complete context it needs without re-explaining. That's worth roughly **20–30% productivity boost** on top of the raw coding acceleration because context-loading is a meaningful tax on every session without good specs.

## Risks and Headwinds

**Factors that could make delivery faster:**
- Ethan is an active, engaged first user (real signal, real usage)
- Small, known alpha audience — no self-serve onboarding complexity
- Architecture already well-specified — D1–D24 remove a huge class of decisions
- Using proven stack — Expo and Supabase are well-trodden
- Pre-built work hierarchy — themes, epics, features, stories all enumerated

**Factors that could make delivery slower:**
- Real device testing surfaces issues not obvious in simulators
- Alpha feedback will generate new requirements not in the current spec
- AI feature accuracy takes iteration — first version of NL workout parsing will not be good enough
- Apple Watch and Android native apps break the single-codebase premise and multiply work
- Body-composition and photo features (D22) have real legal and ethical surface that may need lawyer review
- Form analysis (v3) technical depth may be harder than estimated — pose estimation is mature, but applying it correctly to diverse exercises with diverse bodies is active research
- Content moderation becomes a separate operational workstream once public features ship
- Solo developer with 10–15 hours/week has no slack; any life event compresses the schedule

**Factors that are uncertain either way:**
- AI model improvements between now and v3 could compress some of that phase significantly, or reveal new capabilities that reshape scope
- User demand for wearables / proximity / social might pull those capabilities forward from Future into earlier phases
- Commercial viability of coach-to-client billing (deferred in architecture) could pull Commerce sub-system forward if Ethan sees demand

## Honest Caveats

**Scope re-evaluation at each phase boundary.** What seems obvious in the plan now will be reshaped by what you learn from MVP. Don't commit to v3 timeline now; commit to MVP and v2, and re-plan from there.

**The 10–15 hours/week assumption is the biggest swing factor.** If Eric's available time drops to 5 hours/week, all numbers roughly double. If it rises to 30 hours/week (say after a career change), all numbers roughly halve.

**Full-time founder scenario.** If Eric were working on this full-time (40+ hours/week with Claude Code), the MVP alpha could be shippable in **~8–10 weeks**, and MVP + v2 in **~6–9 months**. That's a different life and business decision but worth naming as the upper bound of what's achievable with the current scope.

**Funded team scenario.** A funded team (3–5 engineers + designer + PM) working on this full-time could deliver MVP + v2 in **4–6 months** and the full current scope in **12–18 months**, but at $1–3M+ in cost. The solo-with-Claude-Code path is slower but much cheaper and preserves optionality.

## Recommendation

**Commit now to MVP with a target of 6 months.** Don't over-commit to v2 dates until MVP has real users providing real feedback. The scope in this plan is large enough that trying to commit to full-scope dates now would be fiction.

**Re-plan at MVP beta.** When MVP is in alpha testing (month 4–5), do a real re-estimation of v2 based on what you've learned about your own pace, Claude Code's real productivity on this codebase, and what alpha users actually want.

**Keep v3, v4, Future loose.** These are the roadmap vision, not commitments. They help inform architectural choices today (the schema reserves room for them per D19–D24) but their timelines should remain flexible.

## Change log

- 2026-04-17: Initial version. Estimates calendar time for solo developer (Eric) working with Claude Code, ~10–15 hours/week, to deliver the Lifting Tracker sub-system across MVP, v2, v3, v4, and Future phases as scoped in `user-stories.md` and `themes-epics-features.md`. MVP at 4–6 months, MVP+v2 at 9–13 months, full current scope at 16–22 months. Claude Code productivity multiplier estimated at 3–5× on implementation work, reducing to ~1× on fixed costs (testing, deployment, external services). Documents produced to date (architecture, user stories, themes/epics) estimated to provide additional 20–30% productivity boost through context-loading efficiency. Identifies risks, uncertainties, and recommends commitment only through MVP with re-planning at each phase boundary.

---

© 2026 Eric Riutort. All rights reserved.
