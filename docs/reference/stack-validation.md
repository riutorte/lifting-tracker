---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-22
---

# Stack Validation — 2026 Community Signal Audit

## Purpose and scope

`docs/architecture-comparison.md` selected A4 (Expo + Supabase) for the Lifting Tracker MVP on a weighted-criteria score of 8.40/10. That comparison evaluated seven *architectural patterns* (vanilla PWA, React SPA, Expo, SwiftUI+CloudKit, SwiftUI+Supabase, Capacitor) — not the individual tool choices that sit inside D8's "Expo + Supabase, offline-first" envelope. This document closes that gap. It audits each concrete tool pick against 2025–2026 community signal — top-starred repos, subreddit complaint threads, HN/Lobsters discussions, indie and production-team write-ups — and returns one of three verdicts per pick: **confirm** (picked well, signal is aligned), **soften** (picked well but flag a known tax), **reconsider** (signal points to a better alternative).

Explicit non-goals: Eric picks. This doc surfaces evidence and trade-offs; it does not rewrite D1–D24.

## How to read the matrix

Each tool category has (a) a one-line verdict row, (b) top-3 6+-month-in-production complaints with links and verbatim quotes where the wording is load-bearing, (c) dropout-and-migration flows, (d) who's actually shipping it at "solo + AI assistance" scale today, and (e) a 5-year-horizon risk posture. Deep-dives are reserved for picks flagged **reconsider**.

Citations: inline links. Where I pulled a verbatim quote, it is in blockquote form with the source linked.

## Table of contents

1. Mobile framework (Expo managed vs alternatives)
2. Backend-as-a-Service (Supabase vs alternatives)
3. Offline-first sync (WatermelonDB vs alternatives)
4. Auth (magic link vs alternatives)
5. State management
6. Routing
7. Styling
8. Language + open-standards analysis
9. Top 3 cross-cutting risks
10. Reconsider — alternative deep-dives
11. Access limitations

---

## 1. Mobile framework

*Research window: 2025-04 → 2026-04. Citations prefer sources ≤12 months old; older sources are flagged inline.*

### 1.1 Decision matrix

| Option | Verdict | Top evidence (link + hook) | Top risks |
|---|---|---|---|
| **Expo managed (current pick)** | **Confirm, with caveat** | [React Native docs now recommend Expo as the only community framework endorsed by Meta](https://docs.expo.dev/) — "framework-first" is the official RN-core stance in 2026, not just Expo marketing. | Lock-in to Expo release cadence; EAS iOS queue wait on free tier; SDK 55+ forces New Architecture (no opt-out). |
| **Expo bare / prebuild** | **Soften to "escape hatch, not default"** | [Expo docs: managed vs bare is now essentially "whether native folders are generated or committed"](https://docs.expo.dev/bare/overview/) — the historical chasm is gone post-CNG. | You inherit Xcode/Gradle/CocoaPods maintenance burden with no offsetting capability gain at Lifting Tracker's scope. |
| **React Native CLI (non-Expo)** | **Reconsider → reject** | [React Native core team no longer recommends starting new projects with `react-native init`](https://reactnative.dev/architecture/landing-page) — the non-Expo path is officially deprecated guidance. | Community drift; no OTA updates without CodePush (Microsoft deprecated CodePush in 2024); CI/CD is DIY. |
| **Flutter** | **Reconsider → soften** | [Flutter holds ~46% cross-platform market share vs RN's ~35% per Statista 2025/26](https://tech-insider.org/flutter-vs-react-native-2026/); [Google reaffirmed Flutter/Dart roadmap at I/O 2025](https://blog.flutter.dev/dart-flutter-momentum-at-google-i-o-2025-4863aa4f84a4) after the May 2024 layoff scare. | Dart learning curve for a JS/TS-native solo dev + AI toolchain; ~8× fewer Flutter job postings than RN in US Q1 2026 (hiring risk if project grows); Google governance single-point-of-failure. |
| **Capacitor (Ionic)** | **Reconsider → reject for primary, keep as fallback** | [Supabase publishes a first-party Capacitor + Ionic tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react); stigma has faded per 2026 comparisons. | WebView performance ceiling; no native-feel scroll/gesture for a gym-floor UI; set-logging UX is touch-heavy and will feel "webby". |
| **Tauri Mobile** | **Reject for 2026 MVP** | [Tauri 2.0 stable shipped Oct 2024 with mobile](https://v2.tauri.app/blog/tauri-20/) — but [production retrospectives are mixed](https://blog.erikhorton.com/2025/10/05/4-mobile-apps-with-tauri-a-retrospective.html); "my worst developer experience in years" on iOS per HN. | Small ecosystem, thin plugin coverage (no Widgets yet — [#9766](https://github.com/tauri-apps/tauri/issues/9766)), Rust learning cost, zero AI-coding training data volume vs RN/Expo. |
| **Pure native (SwiftUI + Kotlin/KMP)** | **Reject for MVP, keep as Phase 3 escape hatch** | [Compose Multiplatform for iOS went stable in May 2025](https://kotlinlang.org/multiplatform/); KMP is lowest-risk incremental exit. | 2-codebase cost at solo scale; kills the "iPhone + web from one codebase" MVP constraint; AI coding assistants are weakest on Swift/Kotlin compared to TS/React. |

### 1.2 Current pick deep-dive: Expo managed workflow (CNG)

**Still mainstream in 2026?** Yes — and more so than 2024. The React Native core team pivoted in late 2024 to a "framework-first" recommendation, and Expo is the only community framework Meta endorses. Per Expo's own data, [~83% of SDK 54 projects built with EAS Build run the New Architecture](https://docs.expo.dev/guides/new-architecture/) as of January 2026. Expo SDK 55 (Feb 2026) removes the legacy-architecture opt-out entirely — the managed/bare distinction has collapsed into "do you commit your `ios/` and `android/` folders or not" (per the [Expo bare overview](https://docs.expo.dev/bare/overview/)).

**Top 3 production complaints (6+ months in prod):**

1. **EAS iOS build wall-clock**. [GitHub issue #1190 "EAS builds iOS always takes longer than 45 mins"](https://github.com/expo/eas-cli/issues/1190) remains the canonical complaint thread. January 2026 reports ([issue #3356](https://github.com/expo/eas-cli/issues/3356)) confirm Xcode 26 images added startup regressions: "a 'normal' build with Xcode 16.2 taking only 2 minutes" vs multi-minute sim-startup delays post-upgrade. Typical M-series EAS build is now ~5–15 min on paid tiers, 35+ min with cold cache on free/shared workers, queues spike to 2+ hrs at peak on free tier (per [fyi/eas-build-queues.md](https://github.com/expo/fyi/blob/main/eas-build-queues.md)).
2. **App size / baseline bloat**. Persistent thread across 2019→2026. Hashrocket 2025 perspective: "The expo SDK bloats apps with 25MB+ for 'Hello World'" — still cited in [Pagepro's 2025–26 guide](https://pagepro.co/blog/what-is-expo-js/).
3. **SDK release cadence = forced upgrade treadmill**. SDK 55 (Feb 2026) removed `expo-av`, killed legacy-arch opt-out, and requires Reanimated v4 (new-arch only). Teams that can't migrate on Expo's schedule are stuck — this is the "ecosystem lock-in" complaint from [dev.to commentary](https://dev.to/wafa_bergaoui/expo-or-react-native-cli-in-2025-lets-settle-this-cl1).

**Dropout pattern.** The historical "Expo → bare RN" migration has largely reversed post-CNG (Config Plugins, April 2021). The Expo blog now runs case studies going the other way: ["How I migrated my bare React Native app to Expo"](https://expo.dev/blog/how-i-migrated-my-bare-react-native-app-to-expo). The older Giacomo Cerquone ["Why I Dropped Expo"](https://giacomocerquone.com/blog/why-i-dropped-expo-and-embraced-react-native/) post is from **2019** — it predates Config Plugins, EAS Build, Development Builds, and the entire managed/bare collapse, so should not drive a 2026 decision.

**Who's shipping solo + AI.** [Vadim's "10 production apps in 2025" strategy](https://expo.dev/blog/how-to-build-apps-fast) at ~10 hrs/week is the canonical indie case study — Expo + EAS + AI copilots. [Claude Lab's "Claude Code × Expo/React Native Complete Guide"](https://claudelab.net/en/articles/claude-code/claude-code-expo-react-native-mobile-workflow) documents the solo-dev workflow pattern that matches Eric's setup.

**5-year lifespan risk.** Low. Meta endorses Expo; New Architecture is default; VC-backed but revenue-generating (EAS paid tiers); Apple/Google policy exposure is identical to any framework since RN 0.76 runs native code anyway. The real risk is **Expo pricing changes**: EAS is the billable product that funds the OSS SDK. If EAS pricing shifts adversely, a solo dev can escape to GitHub Actions + `expo prebuild` without rewriting the app — the CNG collapse means "bare" is a config change, not a fork.

### 1.3 Credible challenger: Flutter

**Still mainstream in 2026?** Yes — arguably more mainstream by adoption than RN. [Statista 2025 places Flutter at 46% cross-platform share vs RN's 35%](https://tech-insider.org/flutter-vs-react-native-2026/). The May 2024 layoffs ([TechCrunch](https://techcrunch.com/2024/05/01/google-lays-off-staff-from-flutter-dart-python-weeks-before-its-developer-conference/)) triggered an HN panic ([item 40184763](https://news.ycombinator.com/item?id=40184763)) — representative verbatim:

> "This is a shame that they are losing their jobs. But I can not be surprised at all. Flutter (and Dart) really just never seemed to have a reason to exist, and have not caught any traction." — ecshafer, HN, Apr 28 2024

> "I recently compared the number of Jobs on Glassdoor in the beginning 2023 and 2024. Flutter had one of the largest declines among of all the tech." — vlugovsky, HN, Apr 29 2024

Google's public response was the I/O 2025 roadmap reaffirmation ([Flutter blog](https://blog.flutter.dev/dart-flutter-momentum-at-google-i-o-2025-4863aa4f84a4)) — Flutter 3.32, Dart 3.8, Impeller completing migration on Android in 2026. Canonical (Ubuntu), Alibaba, and Tencent continue as non-Google investors; post-layoff momentum has stabilized.

**Top 3 production complaints (6+ months):**

1. **Camera/video player rot**. From the [LumenDev Medium piece](https://medium.com/@lumendev/flutter-apps-look-cheap-and-untrustworthy-23a36b2755fd): camera has "flipped media, rotation freezing, capture delays, blocked camera switching," and VideoPlayer "still lacks a basic caching feature after 6+ years." These are the unsexy but persistent P2/P3 bugs in the [Flutter 2025 issue triage reports](https://github.com/flutter/flutter/wiki/2025-Issue-Triage-Reports).
2. **Binary size**. Flutter APKs start at 18–22 MB baseline, AAB 30+ MB, with a 2025 regression report that "lib files becoming massive — especially libflutter.so at over 150MB" vs older ~11MB ([GitHub #172288](https://github.com/flutter/flutter/issues/172288)).
3. **Production jank on mid-tier Android**. Flutter's reactive widget tree can trigger "hundreds of unnecessary rebuilds per second" in production that looked fine in dev — widely reported pattern across 2025 Medium/dev.to writeups.

**Dropout pattern.** [Sivaraj Ramasamy's 2026 piece "Why We Finally Deleted Our Flutter Code"](https://medium.com/@sivaraaj/kotlin-multiplatform-in-2026-why-we-finally-deleted-our-flutter-code-6c3eb9ef6144) is a public migration to Kotlin Multiplatform + SwiftUI. The dominant 2026 migration-out-of-Flutter is to KMP/Compose, not to RN. Migration-into-Flutter continues from Ionic/Cordova and small native-app shops.

**Why it loses for Lifting Tracker.** Three reasons, in order: (1) Dart kills AI-assistance leverage — TS/React has an order-of-magnitude more training-data volume than Dart; (2) web-from-same-codebase is Flutter's weakest target (the HN quote "flutter web, which is still kinda shit" remains accurate per 2025 desktop/web comparisons); (3) hiring pool is 8× smaller in US (Q1 2026 Indeed data) — matters for "5-year horizon" risk if the project ever needs a second engineer.

### 1.4 Credible challenger: Capacitor (web-in-native-shell)

**Still mainstream?** Yes, quietly. Ionic's transition to Capacitor as default runtime is complete; Supabase publishes [a first-party Ionic React + Supabase tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react) and Capacitor + Next.js + Supabase starter templates are well-maintained.

**Top 3 production complaints:**

1. **Scroll/gesture feel**. WebView-based UI ceiling remains real; "not notice any difference... for content-heavy platforms" is the 2026 consensus — which means rep-logging interactions *will* feel off.
2. **Plugin maintenance lag**. Cordova-era plugin ecosystem still casts a shadow; Capacitor's native plugin story is improving but lags Expo modules.
3. **OTA updates**. Capgo and Appflow exist but aren't free/first-class the way EAS Update is.

**Why it loses for Lifting Tracker.** Gym-floor rep logging is a sub-second tap-heavy UX — the exact use case where WebView latency registers. For a TestFlight-targeted iPhone MVP, Capacitor buys web-deploy parity Eric already gets from Expo Web. Keep in reserve as a fallback if Expo pricing becomes hostile and the project pivots to web-first.

### 1.5 Rejections (brief)

**Expo bare / prebuild.** Post-CNG, "bare" is a config toggle, not a workflow. Adopt only when a specific native integration forces it. No reason to start there.

**React Native CLI.** Officially demoted by the RN core team. [Retool's 2024 post-mortem](https://retool.com/blog/expo-cli-vs-react-native-cli) and 2025-26 Medium consensus agree: starting with plain CLI in 2026 is contrarian.

**Tauri Mobile.** Stable-labelled since Oct 2024 but production reports are mixed. [Erik Horton's Oct 2025 retrospective on shipping 4 mobile Tauri apps](https://blog.erikhorton.com/2025/10/05/4-mobile-apps-with-tauri-a-retrospective.html) documents that plugin coverage is incomplete, iOS DX is rough ("some design choices were made too quickly"), and [Widget support is still open](https://github.com/tauri-apps/tauri/issues/9766). Rust toolchain adds cognitive load without offsetting benefit for a solo + AI workflow. Revisit 2027 if ecosystem matures.

**Pure native (SwiftUI + Kotlin/KMP).** Directly violates the "iPhone + web from one codebase" MVP constraint. Compose Multiplatform for iOS went stable May 2025 but "stable does not mean identical to SwiftUI." A reasonable Phase 3 escape hatch (v4+ in Eric's roadmap) if Expo gets unworkable or if XRSize4 ALL's other sub-systems need native sensor/AR access. Not an MVP option.

### 1.6 Migration flows in 2026

| From | To | Typical trigger |
|---|---|---|
| **Expo managed** | Expo bare (prebuild) | Specific native module not in SDK (rare post-CNG); 2026 pattern is "stay managed, use config plugin" |
| **RN CLI** | Expo managed | RN core team deprecation; EAS CI/CD; OTA updates (CodePush dead) |
| **RN / Expo** | Flutter | Almost never in 2025–26. Historical flow that has reversed. |
| **Flutter** | Kotlin Multiplatform + SwiftUI/Compose | Dominant 2026 exit path — captured in multiple "we deleted our Flutter code" writeups |
| **Flutter** | React Native | Rare, but resurfacing post-2024 layoffs |
| **Ionic/Cordova** | Capacitor | Within-family migration; usually stays in Ionic stack |
| **Ionic/Capacitor** | React Native / Expo | When performance ceiling bites |
| **Native iOS+Android** | KMP (incremental) | Sharing business logic without UI rewrite; low-risk path |
| **Tauri Mobile users** | React Native / Flutter | When production bugs surface and plugin gaps can't be closed in-house |

**Net flow for Lifting Tracker's profile** (solo, TS/React-literate, AI-assisted, iPhone + web MVP, 5-year horizon): the center of gravity in 2026 is **Expo managed**, with the historical "eject to bare" exit path largely closed. Flutter's gravitational pull is real but pulls toward Dart + KMP exit, not toward a web-friendly future.

### 1.7 Recommendation

**Confirm Expo managed.** Caveats to internalize:

1. **Own the EAS-exit plan now, not later.** Document `expo prebuild` as the escape path; budget $99/mo EAS Production tier if iOS queue times on free become load-bearing.
2. **Treat SDK upgrades as roadmap commitments.** Expo ships ~2 SDKs/year and removes APIs on a schedule (expo-av → expo-audio/video, Reanimated v3→v4). Don't let the upgrade drift past two SDKs.
3. **Re-evaluate in 18 months** (late 2027): if KMP + Compose Multiplatform keeps maturing *and* XRSize4 ALL's later sub-systems need deeper native access, a Phase 3 KMP migration for the shared business-logic core is the cleanest exit.

---

## 2. Backend-as-a-Service

*Research window: April 2026. Current pick: Supabase.*

### 2.1 Decision matrix

| Option | Verdict | Top evidence | Top risks |
|---|---|---|---|
| **Supabase (current pick)** | **Confirm, with caveats** | [Supabase 2026: 99.2K stars, $5B valuation, $10B round in progress](https://www.programming-helper.com/tech/supabase-2026-open-source-firebase-alternative-postgres-backend); SOC 2 Type 2 + HIPAA; Apache-2.0 core. | India DNS block Feb 2026 (8 days); `/ee` folders closed-source; hidden compute/PITR costs; realtime-RLS silent-failure class. |
| **Firebase** | **Reconsider — narrative has shifted, not reversed** | [Google AI Studio + Firebase "vibe coding" integration launched March 18, 2026](https://firebase.blog/posts/2026/03/announcing-ai-studio-integration/); Firebase Studio sunsetted same day. | Firestore read-cost trap ($0.60/M, compounds fast); structural lock-in (NoSQL + Google auth); Google product churn (Studio sunset is a fresh example). |
| **Convex** | **Soften — credible challenger, not yet the bet** | [Convex went open-source Feb 2025, FSL → Apache after 2y](https://news.convex.dev/convex-goes-open-source/); [self-hosted supports Postgres backing store](https://docs.convex.dev/self-hosting). | No SQL escape hatch; TypeScript-function-as-backend locks business logic into Convex idiom; self-host "a lot of work" per vendor; single-machine default. |
| **PocketBase** | **Reconsider for MVP, no for 5-year** | [WAL SQLite — 120 concurrent readers, 1 writer](https://github.com/pocketbase/pocketbase/discussions/5524); single-binary deploy; [sweet spot ~10-20k concurrent users](https://pocketbase.io/docs/going-to-production/). | SQLite single-writer bottleneck; no horizontal scale; [pre-v1, backwards-compat not guaranteed](https://github.com/pocketbase/pocketbase/discussions/4032); solo-maintainer bus factor. |
| **Appwrite** | **Reconsider** | [$37M raised, Series A Tiger Global 2022, 48 employees](https://www.crunchbase.com/organization/appwrite); [self-host is one Docker command](https://appwrite.io/blog/post/appwrite-compared-to-supabase). | NoSQL-first data model (relational added later); smaller ecosystem than Supabase; funding last round 2022 — bridge-round risk on 5-yr horizon. |
| **Neon + custom backend** | **Soften** | [Databricks-owned since May 2025, storage $0.35/GB after price cut](https://neon.com/pricing); [first-class Hono integration](https://neon.com/docs/guides/hono); serverless scale-to-zero. | You own auth, storage, realtime, edge — all the pieces Supabase gives you for free; multiplies solo-dev surface area. |
| **Hasura / rolled-your-own** | **Reconsider, narrow use** | [Hasura self-hosted Community still Apache](https://hasura.io/docs/2.0/hasura-cloud/plans/); [deprecating BigQuery/Snowflake/MSSQL from OSS](https://hasura.io/blog/updates-to-hasura-pricing-and-plans). | Enterprise-DB deprecation signals commercial drift; GraphQL-only layer still leaves auth/storage/realtime unsolved; rolled-your-own = no BaaS at all. |

### 2.2 Supabase — current pick, confirm with caveats

The 2026 posture is stronger than a year ago. [Valuation ~$5B, ~99.2K stars, SOC 2 Type 2 + HIPAA, new $10B round in progress](https://www.programming-helper.com/tech/supabase-2026-open-source-firebase-alternative-postgres-backend). [RLS is now enabled by default for new tables](https://dev.to/pockit_tools/supabase-vs-firebase-in-2026-the-honest-comparison-after-using-both-in-production-3e5) — the 2025 Lovable "170+ apps with exposed databases" incident drove the change. Deno 2 upgrade brought Edge Function cold starts to ~42 ms avg, materially better than Firebase.

Real complaints from 6+-month production users, grouped:

- **Realtime-RLS silent failure.** "Standard data queries continue to work as expected, but real-time subscriptions fall silent, receiving no events… the permission gap… allows the server to securely filter and broadcast events." ([TechNetExperts](https://www.technetexperts.com/realtime-rls-solved/)). Production-at-scale RLS pain point: policies correct, data queries work, realtime silently emits nothing. Fix requires granting `supabase_realtime` SELECT on target tables.
- **Hidden-cost trap.** Pro is "$25/month + usage" but realistic production is `$25 + ~$60 Medium compute = ~$85/mo`, with PITR at a flat **$100/mo regardless of DB size**, and MAU overages at **$3.25 per 1,000 users over 100K** ([Pockit 2026 production review](https://dev.to/pockit_tools/supabase-vs-firebase-in-2026-the-honest-comparison-after-using-both-in-production-3e5); [costbench](https://costbench.com/software/database-as-service/supabase/)).
- **Self-hosted lags cloud.** [GitHub discussion #28377](https://github.com/orgs/supabase/discussions/28377): "Files are deleted immediately, and if a database backup is restored, the entries in the storage schema no longer match the buckets"; "Branching does not seem to be fully implemented… permissions are not transferred, and there's no way to promote versions." Cloud is production-ready; self-hosted is not on par.
- **Geographic fragility.** Feb 24–Mar 4 2026, Supabase was DNS-blocked by Indian ISPs under Section 69A, affecting ~120K Indian developers. ([TechCrunch](https://techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order/)). For Lifting Tracker's US-based alpha this is low-probability; for a 5-year platform plan it's a data point on single-vendor SaaS concentration risk.

**Lock-in story is the right shape for a 5-year bet.** "Supabase's lock-in is *recoverable* (weeks of work). Firebase's lock-in is *structural* (months of work)." ([Pockit](https://dev.to/pockit_tools/supabase-vs-firebase-in-2026-the-honest-comparison-after-using-both-in-production-3e5)). Data is Postgres; `pg_dump` → any other Postgres host. RLS policies and Edge Functions are the lock-in surface — translatable, not trapped.

For Lifting Tracker MVP (6 alpha users, ~400 historical sessions, offline-first via WatermelonDB/PowerSync) none of the pain points above will bite in year one. The realtime-RLS trap is the one to watch when coach views ship (Sprint 6-8). The hidden-cost math matters when you cross ~1K MAU or need PITR.

### 2.3 Firebase — the narrative changed in March 2026

The "Firebase is losing to Supabase" story was accurate through 2025. Less accurate now. On **March 18, 2026**, Google shipped [AI Studio + Firebase "vibe coding"](https://firebase.blog/posts/2026/03/announcing-ai-studio-integration/): the Antigravity coding agent auto-provisions Firestore + Auth from natural-language prompts, drafts Security Rules, and deploys real-time multiplayer state. This is Google's direct answer to the Lovable/Supabase AI-scaffolding workflow. Same day, Firebase Studio (launched April 2025) was sunsetted — migration window until March 22, 2027. Google cycling products in 12 months is itself a risk signal.

Independent of the AI story, the **Firestore read-cost trap remains intact**: $0.60 per million reads, and because Firestore has no joins, a single page load commonly triggers hundreds of reads. "A modest app with 10,000 DAU loading 10 pages each generates ~9.1 million reads/day, or ~273 million reads/month — that's ~$164/month just for reads." ([Pockit](https://dev.to/pockit_tools/supabase-vs-firebase-in-2026-the-honest-comparison-after-using-both-in-production-3e5)). On Supabase the equivalent workload lands at ~$85/mo. For a coach-client app with heavy read patterns, this gap does not close.

**Lock-in is structural.** Firestore is NoSQL; Auth is Google; Security Rules are a different language than any SQL-based RLS. Leaving Firebase is a rewrite, not a migration. For XRSize4 ALL's 5-year arc across multiple sub-systems, Firebase would force Google-ecosystem commitment across the platform.

**Verdict**: Reconsider is appropriate for a vibe-coded prototype that needs AI-Studio velocity. Not appropriate for a relational-schema-first, offline-first, multi-sub-system architecture. The D14 per-implement weight model and D12 ontological nullable-FK schema are natively Postgres shapes — Firestore would fight both.

### 2.4 Convex — credible challenger, governance improved, data model still wrong for us

The rumored "Supabase → Convex" migration flow is real but overstated. [Convex went open-source Feb 2025](https://news.convex.dev/convex-goes-open-source/) under FSL that converts to Apache-2.0 after 2 years — cleaner than Supabase's `/ee` commercial-folder pattern. [Self-hosting now supports Postgres as the backing store](https://docs.convex.dev/self-hosting), which removes the most cited lock-in complaint from 2024. Pricing is $25/mo starter tier with usage-based scaling.

Strengths for a solo-dev + AI project: TypeScript functions are the entire backend (no SQL, no ORM, no cache layer), reactivity is default, and the query/mutation boundary maps well to AI-generated code. [Val Town](https://news.ycombinator.com/item?id=31832296) and the [Ricardo Gesteves DEV migration writeup](https://dev.to/ricardogesteves/migrating-from-supabase-and-prisma-accelerate-to-convex-jdk) are the most-cited "we left Supabase for Convex" examples.

Real limitations: "The query language is JavaScript-based, not SQL… If your team has years of PostgreSQL experience, that expertise has limited value in Convex… Complex joins work differently. There's no raw SQL escape hatch." ([Nextbuild](https://nextbuild.co/blog/convex-vs-traditional-databases)). From the Gesteves migration: "The only challenge, or one of the top challenges, was to figure out how to implement RLS Policies, also with JWT Claims because Convex just supports some claims and you need to implement a workaround." Self-host is "completely okay, though operating it may end up being a lot of work… the self-hosted backend needs to run on a single machine." ([Convex self-hosting blog](https://news.convex.dev/self-hosting/)).

**For Lifting Tracker specifically**: the D12 ontological schema (nullable FKs, 24 tables, relational from day one) is a Postgres-shaped problem. Convex's document model with indexed queries can represent it, but you'd be fighting the grain. D19 Reasoner Duality (Tier 1 deterministic SQL queries govern decisions) wants a SQL surface, not a TypeScript-function API. Worth a 2-hour hands-on spike before Sprint 0 closes, but not a flip.

### 2.5 Migration flows in 2026

- **Firebase → Supabase**: dominant flow. Drivers are cost predictability (3-5x cheaper for read-heavy SaaS), SQL/relational preference, escape from Google lock-in. ([Pockit](https://dev.to/pockit_tools/supabase-vs-firebase-in-2026-the-honest-comparison-after-using-both-in-production-3e5); [Tech Insider 2026](https://tech-insider.org/supabase-vs-firebase-2026/)). Supabase publishes first-party migration guides for [Firestore data](https://supabase.com/docs/guides/platform/migrating-to-supabase/firestore-data), [Firebase Auth](https://supabase.com/docs/guides/platform/migrating-to-supabase/firebase-auth), and [Firebase Storage](https://supabase.com/docs/guides/platform/migrating-to-supabase/firebase-storage).
- **Supabase → Convex**: real but niche. "Supabase migrations usually happen due to complexity fatigue while Convex migrations usually happen due to flexibility ceilings." ([makersden 2025](https://makersden.io/blog/convex-vs-supabase-2025)).
- **Supabase → self-hosted Postgres**: also real, concentrated in teams hitting Edge-Function compute limits or wanting tighter infra control. "Teams leaving Supabase are usually trying to solve one of three problems: they want more infrastructure control, they want to reduce costs at scale, or they've hit the limits of the BaaS development model." ([Encore](https://encore.dev/articles/supabase-alternatives)). Common destination: Neon or AWS RDS + Hono/Fastify + Clerk.
- **Firebase → Convex**: growing. Natural fit for teams who liked Firebase's "no DB thinking" but hated the lock-in and read-cost math.
- **PocketBase → Supabase**: quiet but consistent at the 10K-user ceiling. Single-writer SQLite bottleneck is the forcing function.

Nothing in the sources I could reach supports a "mass exodus from Supabase" claim. Departures are individual writeups, not trend lines.

### 2.6 5-year-horizon OSS-to-commercial drift check

- **Supabase**: Hybrid Apache-2.0 + `/ee` commercial folders. "Some folders in the codebase have a commercial license, meaning some features are not open source." ([agilesoftlabs 2026](https://www.agilesoftlabs.com/blog/2026/03/supabase-vs-firebase-2026-open-source); [supabase discussion #37903](https://github.com/orgs/supabase/discussions/37903)). SSO, advanced RBAC, analytics sit behind the commercial fence. Self-hosted lags cloud by 6-12 months across many surfaces. Stable pattern, no Redis/Elastic-style relicense event. Not a 5-year killer; *is* a 5-year cost input.
- **Hasura**: Clearer drift signal. [Deprecating BigQuery/Snowflake/Athena/MSSQL support from the Community (OSS) plan](https://hasura.io/blog/updates-to-hasura-pricing-and-plans), critical bug fixes only, no new features. Paid starts at $99/mo. Read as "OSS edition is becoming the lead-gen surface, not the product." Lock-in risk increases if you build on OSS and later need a deprecated database.
- **Convex**: **Best license trajectory.** FSL → Apache-2.0 after 2 years is an explicit, dated commitment — better governance guarantee than Supabase's `/ee` arrangement. Counter-weight: the self-host story is young and single-machine.
- **Appwrite**: Apache-2.0, still-stated OSS-first posture. Last funding 2022. Series A + 4 years + 48 employees means bridge-round risk in the 5-year window.
- **PocketBase**: Pre-v1, solo maintainer. "There is no team or company behind it… there are no promises and cannot provide dedicated support." ([discussion #4032](https://github.com/pocketbase/pocketbase/discussions/4032)). Solo-maintainer-bus-factor risk.
- **Neon**: Databricks-owned since May 2025. Price *cut* in 2025 (storage $1.75 → $0.35/GB, compute −15-25%). Short-term good; long-term Databricks-roadmap dependent.
- **Firebase**: Zero OSS drift — never open-source. Drift risk is Google product-churn: Firebase Studio launched April 2025, sunsetted March 2026.

Company-health ranking for 5-year confidence (my read of the evidence): Supabase > Firebase (Google-lifecycle-risk) > Convex > Neon > Appwrite > Hasura > PocketBase.

### 2.7 Recommendation

**Confirm Supabase.** Caveats:

1. Budget for the Pro-tier realistic cost (~$85/mo once Medium compute is on) before enabling PITR — PITR is flat $100/mo regardless of DB size.
2. Pre-plan the realtime-RLS silent-failure fix before Sprint 6 coach-view work — grant `supabase_realtime` SELECT on all coach-visible tables or broadcasts will simply be empty.
3. Treat `/ee` line as a cost input, not a blocker. SSO and advanced RBAC are paid-tier even on self-hosted.
4. Keep Convex as a 2027-review alternative if multi-sub-system reactive UIs become more valuable than multi-sub-system SQL joins.

### 2.8 Access limitations (this section)

- `dev.to`, `medium.com`, and `github.com` discussion pages often returned oversized bodies; verbatim quotes above were grepped from snapshots, not full-page reads.
- No primary-source Reddit reads — `r/supabase`, `r/Firebase`, `r/selfhosted` content came through secondary summaries (DEV, Medium, Callstack).
- HN item 31832296 (Val Town → Convex) was not fetched directly; referenced via `makersden.io` summary.
- Convex funding status inferred from the open-source announcement + pricing page; Crunchbase returned an unrelated "Convex Group" insurance company.
- No hands-on timing tests. Performance claims (Edge Function 42 ms cold start, 45 concurrent users on a €30 server, etc.) are quoted from secondary reviewers.

---

## 3. Offline-first sync

*Research window: 2025-01 → 2026-04. Gym connectivity is unreliable; every workout write must queue locally and sync on reconnect. D4 requires Supabase Postgres as source of truth; D12 commits a 24-table relational schema from day one.*

### 3.1 Decision matrix

| Option | Verdict (MVP) | Top evidence | Top risks |
|---|---|---|---|
| **WatermelonDB** | **Soften from "leading" to "plausible but high-friction"** | Active in 2026, ~11.6k stars, but explicitly excluded from Expo's official [Local-first guide](https://docs.expo.dev/guides/local-first/); JSI/New-Arch support still debated in [Issue #1769](https://github.com/Nozbe/WatermelonDB/issues/1769) and [#1851](https://github.com/Nozbe/WatermelonDB/issues/1851). | Expo-managed integration depends on third-party forks ([morrowdigital](https://github.com/morrowdigital/watermelondb-expo-plugin), [skam22](https://github.com/skam22/watermelondb-expo-plugin)); large-pull UI freezes ([Discussion #1625](https://github.com/Nozbe/WatermelonDB/discussions/1625)); Android 16 KB page alignment was a 2025 fire drill ([Discussion #1951](https://github.com/Nozbe/WatermelonDB/discussions/1951)); *bring-your-own sync protocol* — you still write the server endpoint. |
| **PowerSync** | **Reconsider as primary — Expo-recommended, solves the whole sync problem** | Listed in [Expo Local-first guide](https://docs.expo.dev/guides/local-first/) alongside Automerge/ElectricSQL; official [Supabase partner page](https://supabase.com/partners/integrations/powersync); dedicated [React Native & Expo SDK](https://docs.powersync.com/client-sdks/reference/react-native-and-expo). | Vendor dependency (Journey Mobile, Inc.); requires CNG / dev build — not Expo Go; new pricing ([2025-09 blog](https://www.powersync.com/blog/simplified-cloud-pricing-based-on-data-synced)) raised concurrent-connection overage to $30/1,000; self-host available but adds ops cost. |
| **Legend-State + expo-sqlite** | **Confirm as co-finalist — "Expo's recommendation" with a real Supabase plugin and Supabase-authored blog** | Expo blog [Offline-first apps with Expo and Legend State](https://expo.dev/blog/offline-first-apps-with-expo-and-legend-state); Supabase blog [Local-first Realtime Apps with Expo and Legend-State](https://supabase.com/blog/local-first-expo-legend-state); [Supabase plugin docs](https://legendapp.com/open-source/state/v3/sync/supabase/). | Small maintainer team (essentially Jay Meistrich); Supabase plugin has open bug for realtime-after-offline ([Issue #362](https://github.com/LegendApp/legend-state/issues/362)) where *"any updates that occurred during the offline period are lost"*; auto-sync friction ([Issue #500](https://github.com/LegendApp/legend-state/issues/500)); flagship apps are Legend's own (Legend, Bravely) — limited external case studies. |
| **RxDB** | **Reject for this MVP** | [rxdb-supabase](https://github.com/marceljuenemann/rxdb-supabase) replication plugin active; supports Supabase Realtime + RLS + PostgREST. | Document/NoSQL model fights the relational D12 schema — forces a dual mental model; paid "Premium" plugins for SQLite/encryption shift this from "free lib" to vendor; RN integration requires react-native-quick-sqlite or IndexedDB shim — more moving parts for a 6-user alpha. |
| **TanStack DB** | **Reject — not production-ready in April 2026** | Release 0.6 ([blog, 2026-03-25](https://tanstack.com/blog/tanstack-db-0.6-app-ready-with-persistence-and-includes)) added SQLite persistence; core repo still labeled BETA ([github.com/TanStack/db](https://github.com/TanStack/db)); InfoQ ["TanStack DB Enters Beta"](https://www.infoq.com/news/2025/08/tanstack-db-beta/) from Aug 2025. | No stable v1.0; API churn expected; PowerSync collection exists but the whole thing is pre-1.0 — wrong risk profile for a solo dev MVP. |
| **From scratch on expo-sqlite (+ Drizzle)** | **Fallback if PowerSync/Legend both get rejected on vendor/complexity grounds** | [Expo SQLite docs](https://docs.expo.dev/versions/latest/sdk/sqlite/); 2026 Medium write-up [Building an Offline-First Production-Ready Expo App with Drizzle ORM and SQLite](https://www.detl.ca/blog/building-an-offline-first-production-ready-expo-app-with-drizzle-orm-and-sqlite); dev.to outbox-pattern series ([SQLite Sync in Expo](https://dev.to/sathish_daggula/how-to-build-offline-first-sqlite-sync-in-expo-1lli), [SQLite Queue](https://dev.to/sathish_daggula/how-to-build-a-fast-sqlite-queue-in-expo-offline-45a)). | You own all the hard parts: idempotency, cursor/checkpoint, conflict resolution, retry, dedup, schema migration. 6-user alpha → fine. 1,000-user scale → painful. |

### 3.2 WatermelonDB — confirmed mainstream, but Expo fragility is real

WatermelonDB is the legacy "right answer" for offline-first React Native and remains so in 2026: ~11.6k GitHub stars, Nozbe ships it in their flagship productivity app, and the project is actively maintained. The Supabase blog [Offline-first React Native Apps with Expo, WatermelonDB, and Supabase](https://supabase.com/blog/react-native-offline-first-watermelon-db) is still the most linked integration reference on the Supabase side.

That's the good news. The bad news for a solo-dev Expo MVP in 2026:

- **Expo config plugin is third-party.** The ecosystem has three live forks (morrowdigital, skam22, domi7891) — a clear "core team didn't ship first-party Expo support, community did, and it's fragile" signal. Expo's own [Local-first architecture](https://docs.expo.dev/guides/local-first/) guide notably does **not** list WatermelonDB; it lists Legend-State, Automerge, ElectricSQL, PowerSync.
- **New Architecture / Bridgeless drags.** [Issue #1769: "Bridgeless Mode support (New Architecture) [0.74]"](https://github.com/Nozbe/WatermelonDB/issues/1769) and [Issue #1851: "Any plans to support 0.76+"](https://github.com/Nozbe/WatermelonDB/issues/1851) — OP: *"with version 0.76 now available, it appears that there's no way to make it work with jsi enabled."*
- **Performance cliff on large pulls.** [Discussion #1625](https://github.com/Nozbe/WatermelonDB/discussions/1625): on a large backlog pull WatermelonDB writes on the JS thread, leading to UI freezes measured in *"seconds to tens of seconds."* Not catastrophic for 6 users × a few sessions/week; potentially ugly if an athlete opens the app after a month of offline backlog.
- **Conflict resolution.** [Sync implementation docs](https://watermelondb.dev/docs/Implementation/SyncImpl): per-column client-wins (server wins except for columns locally changed since last sync). Good default for workout data.
- **You still build the backend sync endpoint.** WatermelonDB gives you the client + protocol spec; you write the Supabase edge function or PostgREST handler that implements `pullChanges`/`pushChanges`.

Net: maintained-by-forks Expo story, a "works if you pin versions correctly" New Arch story, and a sync backend we write ourselves. Three flame wars to track at year 3.

### 3.3 PowerSync — Expo-recommended, pay to skip the sync-engine problem

PowerSync is the "we rent the sync engine" option. On Expo's [Local-first architecture](https://docs.expo.dev/guides/local-first/) recommended list, first-party [Supabase partner](https://supabase.com/partners/integrations/powersync), dedicated [React Native & Expo SDK](https://docs.powersync.com/client-sdks/reference/react-native-and-expo), [Supabase integration guide](https://docs.powersync.com/integration-guides/supabase-+-powersync). Ignite publishes an [official Cookbook recipe](https://ignitecookbook.com/docs/recipes/LocalFirstDataWithPowerSync/).

**What you give up.** Not compatible with Expo Go. You're on CNG or dev builds from day one. Vendor dependency on Journey Mobile, Inc. Self-host exists (OSS core) but shifts ops work back.

**What you get.** SQLite-backed client with automatic sync, upload queue, retry, reconnect. Sync Rules server-side: you declare *which rows sync to which users* in config, not app code — matters for eventual coach/gym RBAC. Conflict resolution delegates to your Supabase backend ([Custom Conflict Resolution docs](https://docs.powersync.com/usage/lifecycle-maintenance/handling-update-conflicts/custom-conflict-resolution)). CRDT (Yjs) supported if ever needed. A [WatermelonDB → PowerSync migration guide](https://docs.powersync.com/resources/migration-guides/watermelondb) exists — implicit signal about direction.

**Pricing (Sept 2025 simplification, verbatim from [blog](https://www.powersync.com/blog/simplified-cloud-pricing-based-on-data-synced)):**

- Free plan: 2 GB data synced / month, 500 MB hosted.
- Pro plan: *"Pro and Team plans now use one billing metric for data throughput: data synced."* Base fee + overages at $1.00/GB after 30 GB; peak concurrent connections $30/1,000 after first 1,000; data hosted $1/GB after 10 GB.
- *"99% of customers will be paying less under the new pricing model, assuming similar usage."*

For a 6-user alpha: free tier covers us. 100 users, ~5 sessions/week, ~50 sets/session at ~1 KB/row ≈ 100 MB/mo synced → still free. 1,000 users ≈ 1 GB/mo → still free. **Free tier is the 6-user-to-low-thousand-user answer.** Pro kicks in only when peak concurrent connections cross 1,000 or data synced crosses 30 GB/mo.

### 3.4 Legend-State + expo-sqlite — Expo's recommendation, with real Supabase support

The only option co-marketed by both Expo and Supabase: Expo blog [How to build an offline-first app using Expo & Legend State](https://expo.dev/blog/offline-first-apps-with-expo-and-legend-state), Supabase blog [Local-first Realtime Apps with Expo and Legend-State](https://supabase.com/blog/local-first-expo-legend-state). Expo's Local-first guide lists it first under State management.

The [Supabase plugin](https://legendapp.com/open-source/state/v3/sync/supabase/) is v3, supports `changesSince`, soft deletes (`fieldDeleted`), and maps to Supabase `created_at`/`updated_at` — timestamp-based incremental pull, not log replication.

**The "does anybody ship this?" flag.** The creators use Legend-State in Legend and Bravely. Community production case studies external to LegendApp are thin. This is the "Expo recommends it but the case studies are the recommender's own apps" risk.

**Open complaints on the Supabase plugin that matter for a gym app:**

- [Issue #362: Supabase realtime sync after back online](https://github.com/LegendApp/legend-state/issues/362) — *"When the app goes offline and then reconnects, it can receive realtime broadcasts after back online, but any updates that occurred during the offline period are lost, leading to inconsistent records until they are updated again and broadcast by realtime."* This is literally our use case.
- [Issue #500: Can't get observables to sync with Supabase automatically](https://github.com/LegendApp/legend-state/issues/500) — integration-friction signal.

Conflict model: timestamp-based LWW with optional soft deletes. Simple, fine for user-owned workout data, but #362 needs validation before commit.

### 3.5 Conflict-resolution comparison

| Option | Model | Opinion/Lock-in | Fit for workout data |
|---|---|---|---|
| WatermelonDB | Per-column client-wins | Opinionated but reasonable; you implement server handlers | **Good** — athlete-only writes, rare conflict |
| PowerSync | Server-authoritative event log; conflict resolution in your Supabase code; CRDT optional | Low opinion | **Best for flexibility** (probably never exercised for per-set writes) |
| Legend-State (Supabase plugin) | Timestamp LWW; soft deletes via `fieldDeleted` | Opinionated, simple | **Good with caveat** — #362 offline-reconnect gap |
| RxDB | Configurable per-collection; custom handlers | Flexible | Overkill |
| TanStack DB | Optimistic mutations + server reconciliation | Pre-1.0 | N/A — beta |
| From scratch | Whatever you write | You own all | Fine until coach edits arrive |

**Does conflict resolution matter for our data?** Mostly no. Workout data is ~99% athlete-owned, single-writer-per-row. Conflict windows: (1) athlete edits on two devices (rare), (2) coach annotates post hoc (deferred post-MVP). **Last-write-wins on `updated_at` is sufficient for MVP.**

### 3.6 Cost comparison — 6-user alpha → 1,000-user scale (PowerSync)

Synthetic sizing: ~1 KB/set, ~50 sets/session, 5 sessions/week/athlete.

| Users | Sets written/mo | Data synced/mo | PowerSync tier | Notes |
|---|---|---|---|---|
| 6 (alpha) | ~6,000 | < 50 MB | **Free** | Peak concurrent ~6 |
| 100 | ~100,000 | ~100 MB | **Free** | Peak concurrent << 1,000 |
| 1,000 | ~1,000,000 | ~1 GB | **Free** | Peak concurrent << 1,000 unless prime-time clustering |
| 10,000 | ~10,000,000 | ~10 GB | **Free → Pro edge** | Hits Pro when data synced > 2 GB/mo on Free, or > 30 GB/mo on Pro allowance |
| Pro overage | — | — | Base Pro fee + $1/GB over 30 GB + $30/1,000 concurrent over 1,000 | Peak connection cost is sharpest edge |

**Pricing source verbatim** ([2025-09-12 PowerSync blog](https://www.powersync.com/blog/simplified-cloud-pricing-based-on-data-synced)): *"Data synced (per GB) ... $1.00 per GB after the first 30 GB."* · *"Peak concurrent connections (count) ... $30 per 1,000 after the first 1,000."* · *"Data hosted (per GB) ... $1 per GB after the first 10 GB."*

WatermelonDB, Legend-State, DIY: $0 library/service cost. Cost is your time + Supabase compute/egress (already paid).

**Vendor-lock:** PowerSync OSS core ([powersync-ja](https://github.com/powersync-ja)) means theoretical self-host escape. Migration back to WatermelonDB/DIY would require rewriting sync-rule queries into push/pull handlers — weeks, not months.

### 3.7 Who's actually shipping with Supabase in 2025-26

Named case studies are thin across all six options. Most "case studies" are vendor-authored tutorials.

- **WatermelonDB + Supabase**: Supabase's own [offline-first RN blog](https://supabase.com/blog/react-native-offline-first-watermelon-db); individual 2025-26 guides on dev.to/Medium.
- **PowerSync + Supabase**: Multiple first-party integration pieces from both companies ([PowerSync: Offline-First Apps Made Simple](https://www.powersync.com/blog/offline-first-apps-made-simple-supabase-powersync); [Supabase partner](https://supabase.com/partners/integrations/powersync)). Ignite Cookbook recipe (Infinite Red productionizes for clients).
- **Legend-State + Supabase**: Flagship production usage is LegendApp's own apps (Legend, Bravely). External named deployments: not verifiable in the 2025-26 window.
- **RxDB + Supabase**: [marceljuenemann/rxdb-supabase](https://github.com/marceljuenemann/rxdb-supabase) plugin + [Supabase partner](https://supabase.com/partners/integrations/rxdb). No named large-scale app surfaced.
- **TanStack DB + Supabase**: [PowerSync Collection](https://tanstack.com/db/latest/docs/collections/powersync-collection) exists but is beta.
- **DIY expo-sqlite**: Strong 2026 blog genre ([DETL](https://www.detl.ca/blog/building-an-offline-first-production-ready-expo-app-with-drizzle-orm-and-sqlite); Sathish Daggula outbox series). No flagship apps; pattern is well-documented.

**Honest interpretation:** offline-first RN + Supabase is still an emerging segment. No household-name "Netflix uses this" anchor reference. **Choose on architecture fit and maintenance signal, not case-study prestige.**

### 3.8 Five-year risk

| Option | Governance | Ecosystem | New Arch/TurboModules | 5-yr verdict |
|---|---|---|---|---|
| WatermelonDB | Single maintainer at Nozbe; OSS | ~11.6k stars | Via issue threads; Expo via third-party forks | **Medium-high.** Bus factor is one person; Expo first-party never adopted. |
| PowerSync | Journey Mobile (for-profit); OSS core + paid cloud | Expo-recommended; multi-lang SDKs | First-party RN+Expo SDK; CNG-compatible | **Low-medium.** Commercial vendor risk vs. unmaintained-OSS risk — OSS core mitigates. |
| Legend-State | Small team (Jay Meistrich); OSS | Expo + Supabase co-marketing | RN via async-storage + expo-sqlite | **Medium.** Bus factor; Supabase plugin has open correctness bugs ([#362](https://github.com/LegendApp/legend-state/issues/362)). |
| RxDB | pubkey; OSS + Premium paid plugins | Broad adapters | RN compat documented | **Medium.** Premium-plugin model = creeping commercial surface. |
| TanStack DB | TanStack org | Huge brand; pre-1.0 | RN via op-sqlite; beta | **High for 2026 commit; low if you wait to 2027.** |
| From scratch | You | You | You | **Highest technical debt, lowest external risk.** |

### 3.9 Recommendation

**Primary: PowerSync.** The only option where (a) Expo's own guide recommends it, (b) Supabase integration is first-party on both sides, (c) Free tier covers 6-users-to-low-thousands at our data shape, (d) we skip writing the sync engine — the thing a solo dev should skip — while keeping Supabase as source of truth (D4 honored). Vendor lock is real but mitigated by OSS core and weeks-not-months migration cost.

**Backup: Legend-State + expo-sqlite**, conditional on validating [Issue #362](https://github.com/LegendApp/legend-state/issues/362) in a prototype. If the offline-reconnect gap is real and unfixed, this is a no-go for gym workout data.

**Soft-rejected: WatermelonDB.** Still credible, but the Expo-plugin-is-third-party + New-Arch-is-issue-threads + build-your-own-sync-endpoint combination adds up to more maintenance surface than PowerSync. Prior ranking of "leading candidate" was correct in 2023 and is now outdated.

**Rejected for MVP: RxDB, TanStack DB, DIY.**

### 3.10 Access limitations (this section)

GitHub issue bodies, PowerSync pricing page, Supabase blog full text exceeded context; verbatim quotes above came from grepped snapshots. Reddit r/reactnative not reached directly. Named production case studies at specific companies using any stack at 1k+ users not verifiable through public sources in this session — treat the "who's shipping" section as evidence the stacks *work*, not scale proof. GitHub star trendlines snapshot only, not trajectory.

---

## 4. Auth

| Option | Verdict | Cost (6 users) | DX | Apple Guideline 4.8 | Passkey path | 5-yr risk |
|---|---|---|---|---|---|---|
| **Supabase Magic Link (current)** | **Soften** | $0 | Medium (deep-link pain) | OK alone | Via custom WebAuthn | Medium — deep-link fragility + email deliverability |
| **Supabase + Apple/Google OAuth** | **Add** | $0 | Medium | Required if you add Google | Same as above | Low |
| **Supabase + Passkeys** | **Watch** | $0 | High once wired | OK | Native modules required | Medium — tooling still maturing |
| **Clerk** | **Reconsider as fallback** | $0 up to 50K MAU | Very high | Handles Apple rules | First-class in Expo SDK 3.1 | Low-Medium — vendor lock |
| **Auth0** | **Reject** | $0 trial, then steep | Low for Expo | Handled | Supported | High — integration friction + cost curve |

### 4.1 Supabase Magic Link + add Apple OAuth

Keep Supabase Auth. 2026 signal: magic links remain acceptable for low-friction alpha onboarding, but are increasingly "a tactical, transitional tool" rather than a permanent answer, with passkey-first the preferred long-term direction. The most cited friction isn't the pattern itself but Expo deep-link plumbing. Multiple 2025–2026 open issues: link opens the app but fails to route, or fails entirely in production when the app starts cold — a bug category Supabase's own docs revised (`Linking.useURL()` → `useLinkingURL()`).

Soften the pick by adding a second rail: **Sign in with Apple + Google OAuth** via Supabase providers. Apple's Guideline 4.8 still stands in 2026 — ship *any* third-party social login and you must also offer a privacy-preserving equivalent. Apple relaxed the rule for apps using proprietary account systems, but the moment you add Google you're back under 4.8.

Credible challenger: **Clerk.** 50K MAU free tier (raised from 10K in 2026) removes cost objection at alpha; Expo SDK 3.1 ships native SwiftUI/Compose UI and first-class passkeys; handles Apple dual-login automatically. Case against is 5-year identity lock-in — migrating identity later is painful, and you already pay Supabase for the DB.

**Passkeys**: watch, don't adopt yet. `react-native-passkeys` is Expo-module-ready but Expo Go cannot run it ("Expo Go does not natively support passkeys"), AASA/assetlinks hosting is non-trivial, and Clerk's `@clerk/expo-passkeys` is explicitly experimental.

**Top complaints:**

1. **Supabase magic link deep-link is fragile in Expo.** [Issue #31047](https://github.com/supabase/supabase/issues/31047): documented `Linking.useURL()` "does not work correctly on the latest versions for iOS magic link authentication" — URL returns null, login fails.
2. **Deep links fail from cold start on SDK 53.** [Issue #37401](https://github.com/expo/expo/issues/37401): deep links work when the app is open but "if the app is initially closed, it wrongly shows the message 'You are in the home screen'... this does not occur in development - only in production."
3. **Magic link UX is outside your control.** 2026 consensus: magic link journey is "a fragile chain of third parties including email providers, client software, and network security tools." Expiry, spam filtering, link-tracking prefetch all break auth. ([Baytech](https://www.baytechconsulting.com/blog/magic-links-ux-security-and-growth-impacts-for-saas-platforms-2025))

---

## 5. State management

| Option | Verdict | Bundle | RN fit | Role | 5-yr risk |
|---|---|---|---|---|---|
| **Zustand (candidate)** | **Confirm** | ~1 KB | Excellent | Client state | Low |
| **Jotai** | **Alternative if atom-heavy** | ~2.5 KB | Excellent | Atomic/derived state | Low |
| **Legend-State** | **Watch** | ~4 KB | Excellent + sync plugins | Client + local-first | Medium — smaller community |
| **Redux Toolkit** | **Reject** | ~15 KB | Fine | Enterprise patterns | Low technically, high cost-of-carry |
| **TanStack Query** | **Add alongside** | ~13 KB | Excellent | Server state | Low |

### 5.1 Confirm Zustand, add TanStack Query

Zustand is the 2026 indie default. Weekly downloads overtook Redux Toolkit (~14.2M vs ~9.8M), a reversal from two years prior. For a solo-dev, offline-first lifting tracker with a handful of slices (current session, timer, auth, UI toggles), the ~1 KB footprint is right.

Category error to avoid: treating Zustand as your *only* state layer. 2026 consensus — DEV, LogRocket, TanStack ecosystem guides — is explicit separation: **TanStack Query for server state** (Supabase reads, cached exercise library, session history), **Zustand for client state** (active workout draft, timer ticks, UI). Storing API responses in Zustand duplicates TanStack's cache and creates sync bugs. Use both.

**Jotai** is the credible challenger, not Legend-State or RTK. Wins when your data model is derived-value heavy (computed volume cascading from per-set per-implement weight × limb config — literally your D14/D15 model). If you find yourself writing lots of `useMemo` on top of Zustand selectors, revisit.

**Legend-State** deserves mention because its local-first + Supabase sync plugin overlaps the offline-first requirement (see §3). Performance claims are real in benchmarks, but the community is ~1/20 the size of Zustand's — risk for a 5-year solo bet.

**RTK**: "dominant in large enterprise apps but rarely chosen for new projects in 2026." Skip.

**Top complaints:**

1. **Zustand footgun: SSR/RSC misuse.** [pmndrs/zustand#2200](https://github.com/pmndrs/zustand/discussions/2200): "People are misusing Zustand on server, thinking it works, deploying it to production and later finding out what a horrible idea it was." Not relevant to Expo native; relevant if Expo Web SSRs later.
2. **Selector discipline required to avoid re-render storms.** "Make sure components only subscribe to the state they need... one of the highest-impact changes you can make." ([Addjam 2026](https://addjam.com/blog/2026-02-25/optimising-react-native-performance-real-world-lessons/))
3. **Jotai's Provider-vs-global gotcha.** [jotai#13](https://github.com/pmndrs/jotai/issues/13): without a Provider, atoms are module-global; with one, scope changes. Catches RN devs used to Zustand's single-store model.

---

## 6. Routing

| Option | Verdict | File-based | Deep-link for magic links | Web parity | 5-yr risk |
|---|---|---|---|---|---|
| **Expo Router v4 (current)** | **Confirm with caveat** | Yes | Auto but buggy on cold start | Excellent | Low |
| **React Navigation (classic)** | **Fallback only** | No | Manual, explicit, stable | Weaker web | Low |

### 6.1 Confirm Expo Router

Expo Router is a superset of React Navigation (it's built on top), so picking it is a bet on the file-based layer, not against RN. In 2026 it's the second-most-popular RN navigation solution and the default in new Expo templates. For a single-codebase iPhone + web play, universal linking is materially better than stitching React Navigation + React Router for web.

The caveat is real and matters for auth: **deep-link reliability from cold start is the open wound.** The SDK 53 regression ([#37401](https://github.com/expo/expo/issues/37401)) where deep links fail "only in production" when the app was killed is exactly the path a magic-link email takes. Workarounds exist (universal links, manual `useLinkingURL`), but you will spend a day on this. This is the single strongest argument for Clerk's managed flow if cost-indifferent — they eat this complexity.

File-based routing resentment shows up when apps need highly dynamic routes or when devs fight conventions (`unstable_settings` footguns, group-route naming). For an athlete → session → exercise → set hierarchy that maps cleanly to folders, non-issue.

Stay on Expo Router. Plan a half-day spike to validate Supabase magic-link round-trip on a cold-started TestFlight build *before* locking magic-link-only auth.

**Top complaints:**

1. **Cold-start deep link broken in production.** [Expo #37401](https://github.com/expo/expo/issues/37401): "if the app is initially closed, it wrongly shows the message 'You are in the home screen'... this does not occur in development - only in production."
2. **`unstable_settings` silently breaks linking.** [Router #818](https://github.com/expo/router/issues/818): "Using unstable_settings breaks deep linking in the app when it's in the foreground or background" — even exporting an empty object.
3. **iOS killed-state handling.** [Expo #37028](https://github.com/expo/expo/issues/37028): deep links "broken in closed / killed state" — recurring across SDK versions.

---

## 7. Styling

| Option | Verdict | Bundle/perf | New Arch | DX | 5-yr risk |
|---|---|---|---|---|---|
| **NativeWind v4 (current)** | **Soften — validate perf** | Slow in edge cases | Works | Familiar to web devs | Medium — maintainer bandwidth |
| **Tamagui** | **Reject for solo MVP** | Fast with compiler | Works | Steep, component-kit coupling | Medium — governance/complexity |
| **Unistyles v3** | **Strong challenger** | Fastest in benchmarks | Required (≥0.78) | RN-idiomatic StyleSheet API | Low-Medium — younger ecosystem |
| **StyleSheet (vanilla)** | **Escape hatch** | Fastest baseline | Native | Boring, verbose | Zero |
| **Restyle (Shopify)** | **Skip** | Fine | Works | Theme-first, TS-heavy | Medium — Shopify-internal pace |

### 7.1 Soften NativeWind, seriously consider Unistyles v3

NativeWind is the volume leader (~518K weekly downloads, roughly 6× Tamagui and 7× Unistyles). DX payoff is real for a dev who thinks in Tailwind. Concerns are specific:

**Performance under the New Architecture is not fully solved.** v4 shipped with the author's own acknowledgement that perf would regress before improving; the widely-cited benchmark thread shows NW4 rendering 1000 styled Views "400% slower than Stylesheet." Most lifting-tracker screens are small, so this rarely bites — but set-grid views and history scrolls are exactly 1000-item territory.

**Bus factor.** NativeWind is maintained primarily by one person; the v4 RFC explicitly said "I'm the only maintainer and I do not have enough time to work on both new features and performance." Fine now, risky across 5 years.

**Credible challenger: Unistyles v3.** Went stable July 2025, requires New Arch + RN ≥0.78 (you meet that on SDK 52+), uses a StyleSheet-shaped API (no framework to learn beyond theming), and benchmarks at or above Tamagui without a compiler step. Momentum in 2025–2026 is real — Expo's own blog covered the 3.0 release approvingly.

**Tamagui**: creator Nate Wienert is active and the project ships frequently, but the optimizing-compiler model is heavy for a solo MVP. Governance drama signal is low in public — complaints are ergonomic (coupling to Tamagui's component kit, compiler config surface), not existential. Reject for MVP, not forever.

**Recommendation**: keep NativeWind for alpha (what you know, 6 users won't expose the perf edge); do a one-day Unistyles spike before hitting coach/admin views. Any performance cliff on set-grid or history list, Unistyles is the exit.

**Top complaints:**

1. **NativeWind v4 perf regression vs StyleSheet.** [Discussion #642](https://github.com/nativewind/nativewind/discussions/642): "NativeWind V4 has some performance issues. The benchmark renders 1000 styled View components and NW4 is 400% slower than Stylesheet." Maintainer confirmed initial-release behavior pending improvements.
2. **Animation coupling forces "everything is animated."** Same thread + Reanimated interop: inline animated styles require `useAnimatedStyle()`; NativeWind's workaround is to animate all components until Reanimated fixes the issue — a correctness concern, not just speed.
3. **JSC incompatibility and Metro flicker.** [#1352](https://github.com/nativewind/nativewind/issues/1352): "Nativewind v4 incompatible with JSC engine" — crash on bundle load. [#924](https://github.com/nativewind/nativewind/issues/924): styles "not applied intermittently" on Metro reload.

---

## 8. Language + open-standards analysis

*This section evaluates language choice through the lens Eric named explicitly: the open-standards stance from `~/Concept/DesignPrinciples_v3.md` — "All standards open. All code open. All knowledge shared." TypeScript's Microsoft governance and Anthropic's April 7 2026 Mythos/Glasswing announcement on memory-safety vulnerabilities are both load-bearing inputs.*

### 8.1 Decision matrix

| Option | Verdict | Open-standards posture | Memory-safety posture (Glasswing lens) | AI-assist leverage | 5-yr risk |
|---|---|---|---|---|---|
| **TypeScript (implicit current pick via Expo default)** | **Confirm with a governance caveat** | Mixed — Apache-2.0, dominant open codebase, but sole-vendor governance (Microsoft); TC39 Stage-1 [Type Annotations proposal](https://github.com/tc39/proposal-type-annotations) opens path to vendor-neutral syntax | N/A — TypeScript compiles to JavaScript, which runs in V8/Hermes. Memory safety is the runtime's problem, not the language's. Hermes and V8 are both memory-safe by default. | Highest of any option — 2.63M active contributors per [GitHub Octoverse 2025](https://devnewsletter.com/p/state-of-typescript-2026/); Claude/Copilot training-data volume is orders of magnitude larger than Dart/Rust/JSDoc alternatives. | Low-medium. Microsoft single-point-of-failure on language evolution, but TypeScript codebase is Apache-2.0, compiler source open, tsc-in-Go port ([InfoWorld 2026](https://www.infoworld.com/article/4100582/microsoft-steers-native-port-of-typescript-to-early-2026-release.html)) still open-source. |
| **JavaScript + JSDoc** | **Reject for app code; accept for tiny utility scripts** | Cleanest open-standards posture — pure ECMAScript, no vendor language | Same as TypeScript (runtime-determined) | High — same training volume as TS; some AI tools lose type-inference hints | Low. You trade type enforcement for governance purity; the [Svelte compiler's 2023 JSDoc migration was framework-specific](https://devclass.com/2023/05/11/typescript-is-not-worth-it-for-developing-libraries-says-svelte-author-as-team-switches-to-javascript-and-jsdoc/) and the author himself said "if you are building an app, use TypeScript." |
| **Flutter / Dart** | **Reject** | Single-vendor (Google) governance, Apache-2.0 but no community-controlled spec body | Dart runs on its own VM — memory-safe by construction (GC). Equivalent to TS/JS from Glasswing lens. | Medium — training-data volume ~10× smaller than TS/React | Medium-high. Google single-point-of-failure; post-May-2024 layoffs underscored Google-internal-dependency risk. See §1.3. |
| **Rust (+ Tauri Mobile)** | **Reject for MVP; revisit 2028+** | Cleanest governance — Rust Foundation, multi-vendor, proper spec-body governance via Rust RFC process | **Best of any option.** Memory-safe by construction *without GC*. Glasswing's thesis ("critical software systems... built in memory-unsafe languages like C and C++") argues for Rust wherever it's feasible. For a mobile app running atop memory-safe JavaScript/Dart VMs, this advantage is moot — the runtime already provides memory safety. | Low — smallest training-data volume of these options; Rust + RN/mobile + Supabase is a triple-rare intersection. | Medium. Low governance risk, high ecosystem-maturity risk for mobile. |

### 8.2 The open-standards lens applied honestly

The DesignPrinciples v3 stance — *"All standards open. All code open. All knowledge shared."* — is a governance principle about who controls the *language specification*, not just whether the *compiler* is open-source. Under this lens:

- **JavaScript / ECMAScript** is the only option in this matrix governed by a multi-vendor standards body (TC39, under Ecma International). Language evolution requires consensus across Microsoft, Google, Apple, Mozilla, Meta, independent experts. This is as "open-standards" as a programming language gets.
- **TypeScript** is governed unilaterally by Microsoft. The Apache-2.0 license on the compiler is a separate concern from governance of the *syntax*. No community vote decides what gets added to the type system. Microsoft has been a consistently good steward (evidenced by 20+ years of TypeScript evolution without hostile forks or weaponized license changes), but the governance model *itself* fails the "all standards open" test.
- **Dart** is governed unilaterally by Google. Same structural concern as TypeScript, with the added data point of the May 2024 Flutter/Dart layoff panic and Google's product-churn reputation.
- **Rust** is governed by the Rust Foundation — multi-vendor, with Google, Microsoft, AWS, Meta, Huawei all contributing. Cleanest governance of any *typed* option. The governance model passes the open-standards test.

**The load-bearing question for Lifting Tracker:** does Microsoft-governance of TypeScript create a realistic 5-year risk? Evidence says no — but the question is now worth tracking.

- [TC39 proposal-type-annotations](https://github.com/tc39/proposal-type-annotations) ("Types as Comments") has been at Stage 1 since 2022 and is a vendor-neutral path toward TypeScript-style syntax that *does* go through TC39 governance. If this reaches Stage 3-4 during the 5-year horizon, the governance concern weakens materially — you'd be writing syntax that happens to match TypeScript, governed by TC39.
- Microsoft's April 2026 governance posture, as documented in the [Agent Governance Toolkit announcement](https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/), reaffirms a foundation-transition model for new projects — this is the opposite of a "close the garden" signal. It doesn't cover TypeScript specifically, but it is the current governance tell from Microsoft's OSS org.
- The [State of TypeScript 2026](https://devnewsletter.com/p/state-of-typescript-2026/) and [Octoverse 2025](https://github.blog/news-insights/octoverse/) data: TypeScript is now the #1 language on GitHub by contributor growth, crossing ahead of Python. Migration pressure *away* from TypeScript is essentially zero in the indie-dev market.

**Verdict on governance:** TypeScript's Microsoft governance is a live concern for a 5-year solo bet, but every structural pressure is toward (a) eventual TC39 type-annotations absorption, (b) continued Microsoft stewardship, or (c) a Fork-of-TypeScript by another foundation if Microsoft ever became hostile. None of those exit paths are disruptive to a codebase already written in TypeScript — the code keeps running.

### 8.3 The Glasswing (memory-safety) lens

Anthropic's April 7 2026 [Project Glasswing announcement](https://www.anthropic.com/glasswing) and [Mythos Preview](https://red.anthropic.com/2026/mythos-preview/) documented that Claude Mythos Preview identified "thousands of zero-day vulnerabilities in every major operating system and every major web browser... primarily memory safety vulnerabilities, as critical software systems—operating systems, web browsers, and core system utilities—are built in memory-unsafe languages like C and C++." A specific 17-year-old FreeBSD NFS remote-root was discovered and exploited autonomously.

The implication for language choice is narrower than it first appears:

- The Glasswing thesis targets **memory-unsafe systems languages** (C, C++). It does not indict TypeScript, JavaScript, Dart, Java, Kotlin, Swift, or any language that runs atop a memory-safe runtime.
- Lifting Tracker's client code runs on Hermes (Expo's default JS engine, Meta-maintained, memory-safe). Its server code runs on Deno (Supabase Edge Functions, Rust-implemented, memory-safe). Its database is Postgres, written in C — but Supabase is not a language choice Eric makes.
- **Where Rust would actually matter for Lifting Tracker**: the Hermes/V8 runtime itself (Meta/Google's problem), native modules (Expo's problem), Postgres (Supabase's problem), the kernel (Apple/Google/Linux's problem). None of these are authored in the Lifting Tracker codebase.
- **Where Rust would not matter**: every line of code Eric writes. Choosing Rust + Tauri Mobile to chase memory safety in application code would trade real AI-assistance leverage for theoretical protection against a class of vulnerability the runtime already prevents.

**Verdict on memory safety:** TypeScript on Hermes is already memory-safe for the code you'll write. Glasswing's policy implications (industry-wide migration from C/C++ to Rust for systems code) do not change the language choice for a React Native app.

The *platform-level* implication worth capturing: Lifting Tracker's 5-year dependency surface includes several memory-unsafe components (Hermes's C++ core, Postgres, iOS kernel). If any of them ship a memory-safety CVE disclosed via Glasswing's work, Eric's exposure is a patch-and-update issue, not a rewrite issue.

### 8.4 AI-assistance leverage — the unspoken but decisive input

A solo-dev-plus-AI workflow amplifies whichever language has the largest AI training-data corpus and the strongest MCP/agent tooling. 2026 snapshot:

| Language | GitHub contributor rank (Octoverse 2025) | Claude Code + MCP tooling | LLM training-data volume |
|---|---|---|---|
| TypeScript | #1 (up from #3 in 2024) | Native-level support; Expo/Supabase/Claude plugins all TS-first | Highest |
| JavaScript | #2 (behind TS for first time in history) | Native | Very high |
| Python | #3 | Native | Highest for non-web |
| Dart | ~#20 | Adequate, not native | 1/10 of TS |
| Rust | ~#10 | Good but library coverage narrower | Medium |

For Eric's specific workflow — Dispatch (Opus) for architecture + Claude Code (Sonnet) for implementation, Supabase Claude plugin, Expo + React Native tooling — TypeScript gives 3-5× more effective throughput than Dart or Rust. This is the decisive input for MVP speed, and it aligns with the 5-year horizon because that leverage compounds across every sprint.

### 8.5 Recommendation

**Confirm TypeScript.** The DesignPrinciples v3 concern about TypeScript's Microsoft governance is *real but not binding* for a 5-year bet because: (a) the language spec has no hostile-fork precedent in 20+ years, (b) TC39 Type Annotations provides a structural escape hatch to vendor-neutral governance without a codebase rewrite, (c) exit options (plain JS + JSDoc; Flow; a future TC39-governed type syntax) don't require throwing away TS code. The Glasswing memory-safety concern does not apply to Lifting Tracker's application code — the runtime provides memory safety.

**Document the governance caveat in `docs/architecture.md`** as a decision record rather than burying it here: something like "D25 draft: TypeScript chosen with explicit Microsoft-governance caveat; TC39 Type Annotations progression is the migration path if governance risk materializes." Proposing that addition is a judgment call for Eric.

**Rejections:**

- **JS + JSDoc** fails on type enforcement for a 24-table relational domain model. Svelte's author himself said it's the wrong answer for apps ([DEVClass](https://devclass.com/2023/05/11/typescript-is-not-worth-it-for-developing-libraries-says-svelte-author-as-team-switches-to-javascript-and-jsdoc/)).
- **Dart (Flutter)** loses on AI-assist leverage and governance — single-vendor concern is identical to TypeScript's but without the TC39 escape hatch.
- **Rust (Tauri Mobile)** loses on ecosystem maturity and AI-assist leverage. The Glasswing thesis doesn't indict application-level TypeScript.

### 8.6 Access limitations (this section)

- TC39 proposal-type-annotations: Stage status read from README only; no direct access to TC39 meeting minutes this session.
- Octoverse 2025 full report: referenced via secondary summary ([devnewsletter State of TypeScript 2026](https://devnewsletter.com/p/state-of-typescript-2026/)) rather than direct fetch of GitHub's Octoverse page.
- Mythos Preview / Glasswing: read Anthropic's own announcement text via search snippets; did not fetch the Scientific American / Schneier / Foreign Policy coverage in full.

---

## 9. Top 3 cross-cutting risks

Synthesizing across all seven tool categories, the three risks that span multiple picks and most deserve Eric's attention:

### Risk 1 — Vendor concentration on Supabase as single-SaaS dependency

**What it is.** Supabase underpins the database, auth, storage, edge functions, and realtime layers. The Feb 2026 India DNS block ([TechCrunch](https://techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order/)) is a reminder that a single SaaS vendor = a single geopolitical/regulatory point of failure. Over 5 years, pricing changes, commercial-drift (`/ee` features expanding), or an acquisition event could each change the economics.

**Why it crosses categories.** Auth, offline-first sync (PowerSync's raison d'être is Supabase-the-source-of-truth), routing deep-links (magic-link auth path), and BaaS are all anchored to this one vendor.

**Mitigation.**

- Pre-document the exit path: Postgres data is `pg_dump`-able to any Postgres host; RLS policies translate to any SQL DB; Edge Functions are Deno and portable to Deno Deploy / Vercel.
- Budget for the realistic Pro-tier cost (~$85/mo after Medium compute, $100/mo for PITR) before crossing 1K MAU.
- Keep Convex as a documented 2027-review alternative in case multi-sub-system reactive UIs demand a re-eval.

### Risk 2 — Bus factor on small-maintainer libraries in the "thin middle" of the stack

**What it is.** WatermelonDB (one-person Nozbe maintenance), Legend-State (essentially Jay Meistrich), NativeWind (one maintainer who explicitly flagged perf/capacity tradeoffs in the v4 RFC), PocketBase (single maintainer), Tauri Mobile (small core team) — each is a plausible choice but each has a bus factor of one or two. Over 5 years with a single developer + AI, a maintainer walking away is an undercovered risk.

**Why it crosses categories.** Offline-first sync, styling, state management, and (if we'd picked it) the BaaS itself.

**Mitigation.**

- Prefer multi-vendor / foundation-backed options where the second-best choice is close enough: **Unistyles v3** (Software Mansion, stable team) over NativeWind at any perf inflection; **PowerSync** (commercial vendor + OSS core) over WatermelonDB; **TanStack Query** (TanStack org, multi-contributor) for server state.
- For the one bus-factor dependency we keep (whichever offline-sync lib wins), pin SDK versions explicitly in CLAUDE.md and track maintainer activity quarterly.

### Risk 3 — Expo / EAS cost and cadence coupling

**What it is.** Expo's entire business model depends on EAS paid tiers. Lifting Tracker's iPhone distribution depends on EAS Build; OTA updates depend on EAS Update. If EAS pricing shifts adversely, or if SDK-cadence forced-upgrades (SDK 55's legacy-arch removal, Reanimated v4 forcing, expo-av removal) pile up faster than a solo dev can absorb, velocity drops sharply.

**Why it crosses categories.** Mobile framework, routing (deep-links are Expo Router's), auth (magic-link cold-start failure is an Expo Router bug in 2026), styling (NativeWind perf is an Expo + New Arch story), sync (PowerSync + CNG requires dev builds).

**Mitigation.**

- Document `expo prebuild` as a committed escape path now; budget a day to validate the prebuild path once before it's urgent.
- Treat SDK upgrades as scheduled roadmap commitments — Eric's per-sprint work plan should allocate ~1 sprint per year to SDK migration.
- Monitor EAS pricing page quarterly; if a hostile pricing change ships, GitHub Actions + `expo prebuild` + manual App Store upload is the bare-metal fallback.

---

## 10. Reconsider — alternative deep-dives

Only one pick in this audit earned a clean *reconsider* verdict (vs *soften* or *confirm with caveat*): **offline-first sync.** The current posture ("WatermelonDB as leading candidate") is misaligned with 2026 signal. Everything else is confirm-or-soften.

### 10.1 Offline-first sync — why PowerSync is the better 2026 bet

Full deep-dive lives in §3 above. Condensed argument:

- Expo's own Local-first guide recommends PowerSync and explicitly does not list WatermelonDB.
- First-party Supabase partnership on both sides — Supabase publishes the [PowerSync integration guide](https://docs.powersync.com/integration-guides/supabase-+-powersync); PowerSync publishes the [Supabase migration recipe](https://docs.powersync.com/integration-guides/supabase-+-powersync).
- Free tier covers 6-alpha-users through low-thousands at Lifting Tracker's data shape; Pro tier overage hits only at 30 GB/mo synced or 1,000+ peak concurrent — neither realistic for a workout tracker in year 2.
- Migration-away-from-PowerSync is weeks of work, not a rewrite. OSS core exists for ultimate escape.
- The alternative ("we write our own sync engine on expo-sqlite") is exactly the kind of thing a solo-dev + AI team should not commit to — it's the least-leveraged work in the entire stack.

**Backup pick if PowerSync gets rejected on vendor grounds:** Legend-State + expo-sqlite, *conditional on validating [Issue #362](https://github.com/LegendApp/legend-state/issues/362) in a prototype before commit.* If the offline-reconnect gap is real and unfixed, fall back to WatermelonDB (not DIY).

### 10.2 Why the rest don't rise to "reconsider"

- **Mobile framework:** Expo's position strengthened through 2026 (RN core team endorsement, CNG collapse of managed/bare). Flutter is the only credible challenger and it loses on AI-assist leverage + web-from-same-codebase.
- **BaaS:** Supabase is the right shape for a relational, offline-first, 24-table schema. Convex's data model fights D12 ontological nullability. Firebase's read-cost math is hostile to read-heavy coach views.
- **Auth:** Magic-link stays, but *add* Apple/Google OAuth rails. Not "reconsider" — augment.
- **State:** Zustand + TanStack Query is the 2026 default. No forcing signal to change.
- **Routing:** Expo Router cold-start deep-link bugs are real but workaroundable. No viable alternative with equivalent web parity.
- **Styling:** NativeWind for MVP with a scheduled Unistyles spike is the right shape. Not "reconsider" yet — *validate* before commit to coach/admin UI.
- **Language:** TypeScript's governance caveat is worth documenting but not binding for a 5-year bet.

---

## 11. Access limitations — consolidated

Categories where primary sources could not be reached or fully verified:

- **Reddit threads directly** (r/expo, r/reactnative, r/flutterdev, r/rust, r/supabase, r/Firebase, r/selfhosted): search layer returned URLs but not thread bodies; verbatim quotes throughout this document come from secondary coverage (DEV, Medium, Callstack) that quotes Reddit sentiment, not from direct thread reads. This is a systematic gap that would reward a manual subreddit sweep by Eric if belt-and-braces verification matters.
- **GitHub issue comment threads** on high-volume issues (expo/eas-cli#1190, expo/expo#20323, Legend-State #362): content was summarized from page-snippet reads rather than full comment-by-comment paging.
- **HN comment threads** beyond the Flutter layoff thread (item 40184763): summarized from search results, not direct fetches.
- **Anthropic Glasswing coverage in Scientific American, Schneier, Foreign Policy, NBC News**: read through search snippets only; Anthropic's own Glasswing page and Mythos Preview page were the primary-source basis.
- **GitHub star trendlines over time**: snapshot numbers only (WatermelonDB ~11.6k, Supabase ~99.2k, etc.); no trajectory analysis.
- **Named production case studies at specific companies** using any of these stacks at 1K+ users: largely not verifiable through public sources. The "who's shipping" sections represent evidence the stacks *work*, not scale proofs.
- **Vendor funding status** for Convex, Legend-State, PowerSync: partially inferred from open-source announcements and pricing pages rather than Crunchbase/PitchBook primary-source reads.
- **Hands-on performance benchmarking**: every performance claim in this document is quoted from secondary reviewers. No in-session tests were run.
- **Supabase Discord, Expo Discord**: search layer does not index Discord; not reached.
- **Giacomo Cerquone "Why I Dropped Expo"**: fully read but dated Nov **2019** — explicitly excluded from 2026 decision weight.
- **`~/Concept/DesignPrinciples_v3.md`**: read in full; open-standards clause is quoted verbatim in §8.2.

---

© 2026 Eric Riutort. All rights reserved.
