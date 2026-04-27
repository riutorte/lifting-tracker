---
author: Eric Riutort
created: 2026-04-15
updated: 2026-04-24
tier: ARCHITECTURE
content_class: architecture
version: 0.3.0
status: accepted
---

# Lifting Tracker — Architectural Approach Comparison

A systems-engineering-level comparison of all platform approaches discussed for the coach-client workout tracking application. This document evaluates each approach across consistent dimensions to support an informed architectural decision.

**Scope note (2026-04-19):** The original comparison (sections 1–7 and the decision matrix below) was scoped to the Lifting Tracker sub-system MVP when the project was "a workout tracker with a coach view." The project has since expanded into **XRSize4 ALL** — a system of systems spanning 8 discipline-specific training sub-systems and 12 cross-cutting services (see `xrsize4all_concept_v0.2.0.md`). The MVP comparison remains valid for the Lifting Tracker's first release. A new section, **"Platform Evolution — Technical Direction Beyond MVP,"** maps the chosen stack (A4: Expo + Supabase) forward through all five XRSize4 ALL phases, identifying where the foundation holds, where it needs augmentation, and where new infrastructure enters.

## Approaches evaluated

Seven approaches are compared, grouped by architectural pattern:

| ID | Approach | Pattern |
|---|---|---|
| A1 | Vanilla PWA (current v1) — GitHub Pages, localStorage | Static client, no server |
| A2 | Vanilla PWA + Supabase | Thin client, cloud backend |
| A3 | React SPA + Supabase (Vercel) | Thin client, cloud backend |
| A4 | Expo (React Native) + Supabase | Cross-platform client, cloud backend |
| A5 | SwiftUI + CloudKit (iCloud sync) | Native client, platform-managed sync |
| A6 | SwiftUI + Supabase | Native client, cloud backend |
| A7 | Capacitor (web in native shell) + Supabase | Wrapped web client, cloud backend |

## Requirements baseline

Before comparing, the requirements that any approach must satisfy for MVP:

- R1: Multi-user with roles (super admin, coach, athlete, gym placeholder)
- R2: Cloud-synced data — one source of truth accessible from any device
- R3: iPhone as primary device for all roles
- R4: Laptop/web access for coach and admin views
- R5: Per-set data granularity with derived analytics
- R6: Auth with invite-only access (magic-link or equivalent)
- R7: Exercise library with canonical + user-scoped custom exercises
- R8: MVP-first — ship athlete experience, expand to coach/admin iteratively
- R9: Downloadable iPhone app (user expectation, not just "Add to Home Screen")
- R10: Maintainable by a non-professional developer with AI-assisted tooling

## Requirements coverage matrix

| Req | A1 | A2 | A3 | A4 | A5 | A6 | A7 |
|---|---|---|---|---|---|---|---|
| R1 Multi-user | NO | YES | YES | YES | NO | YES | YES |
| R2 Cloud sync | NO | YES | YES | YES | PARTIAL | YES | YES |
| R3 iPhone primary | YES | YES | YES | YES | YES | YES | YES |
| R4 Laptop access | YES | YES | YES | YES | NO | PARTIAL | YES |
| R5 Per-set data | YES | YES | YES | YES | YES | YES | YES |
| R6 Auth | NO | YES | YES | YES | IMPLICIT | YES | YES |
| R7 Exercise library | YES | YES | YES | YES | YES | YES | YES |
| R8 MVP-first | YES | YES | YES | YES | YES | YES | YES |
| R9 Real app (downloadable) | NO | NO | NO | YES | YES | YES | YES |
| R10 AI-maintainable | YES | YES | YES | YES | PARTIAL | PARTIAL | YES |

**Immediately eliminated:**

- **A1 (current v1)**: Fails R1, R2, R6, R9. Useful as a prototype; not a viable path forward.
- **A5 (SwiftUI + CloudKit)**: Fails R1 (iCloud sync is per-Apple-ID — coach and client can't share data across accounts without CloudKit Sharing, which adds significant complexity). Fails R4 (no web/laptop view without building a separate app). Was already rejected in the prior architectural discussion.

**Remaining candidates: A2, A3, A4, A6, A7.**

## Comparative analysis — remaining candidates

### 1. Architecture pattern

**A2 (Vanilla PWA + Supabase):**
Browser → Supabase JS SDK → Postgres. No framework layer. DOM manipulation via vanilla JS. Service worker for offline caching of static assets. Data fetched on each view from Supabase; no local persistence layer beyond localStorage for session tokens.

**A3 (React SPA + Supabase):**
Browser → React component tree → Supabase JS SDK → Postgres. Virtual DOM, component-based UI. Vercel hosts the SPA and optional serverless functions (edge functions for any server-side logic like invite emails). Same data flow as A2 but with React's state management mediating between network and UI.

**A4 (Expo + Supabase):**
React Native runtime → native iOS UI components (on iPhone) OR browser DOM (on web via Expo Web) → Supabase JS SDK → Postgres. Single codebase, two render targets. Navigation via React Navigation (native stack navigator on iOS, browser router on web). Expo manages the build toolchain, TestFlight distribution, and OTA updates.

**A6 (SwiftUI + Supabase):**
Native iOS app → Supabase Swift SDK → Postgres. Separate lightweight web app (React or vanilla) for laptop/coach views, sharing the same Supabase backend. Two codebases, one data layer.

**A7 (Capacitor + Supabase):**
Web app (React or vanilla) running inside a WKWebView wrapped by Capacitor. Capacitor provides a bridge to native APIs (push notifications, camera, file system). Distributed via TestFlight/App Store. Same web codebase serves the laptop view directly.

### 2. Data flow and sync model

All remaining candidates use Supabase (Postgres) as the single source of truth. The differences are in the client-side data flow:

| Dimension | A2 | A3 | A4 | A6 | A7 |
|---|---|---|---|---|---|
| Client data layer | Raw fetch/localStorage | React state + optional cache (React Query, SWR) | React state + optional cache | SwiftData or in-memory | React state + optional cache |
| Offline capability | Service worker caches static assets; data requires network | Same as A2 unless offline-first library added | Expo offline: AsyncStorage + queue; sync on reconnect | SwiftData persists locally; sync on reconnect | Same as A3 |
| Real-time updates | Supabase Realtime (WebSocket) | Same | Same | Same | Same |
| Conflict resolution | Last-write-wins (Supabase default) | Same | Same | Same | Same |

**Architectural note on offline:** For a gym environment (concrete buildings, basement gyms, spotty reception), offline write capability matters. A4 and A6 have the strongest offline stories because they have local persistence layers (AsyncStorage / SwiftData) that queue writes for later sync. A2, A3, and A7 require network or fall back to localStorage hacks.

### 3. Auth model

All use Supabase Auth. Implementation varies by client:

| Dimension | A2 | A3 | A4 | A6 | A7 |
|---|---|---|---|---|---|
| Auth flow | Supabase JS `signInWithOtp()` → magic-link email → browser redirect | Same | Same, but deep-link back into app (Expo AuthSession handles this) | Supabase Swift SDK → magic-link → universal link back into app | Same as A3 |
| Session persistence | localStorage (browser) | Same | SecureStore (Expo) — encrypted on device | Keychain (iOS) — encrypted on device | localStorage (WKWebView) |
| Token security | Moderate (localStorage readable by JS) | Same | Strong (SecureStore) | Strong (Keychain) | Moderate (same as browser) |

**Architectural note:** A4 and A6 store auth tokens in platform-secure storage (Keychain / SecureStore). A2, A3, and A7 store tokens in browser localStorage, which is readable by any JS running on the page. For a closed alpha with no third-party scripts, this is acceptable risk. For production, A4 or A6 is materially more secure.

### 4. Development and maintenance cost

Evaluated relative to each other, not in absolute hours. Assumes AI-assisted development (Claude Code).

| Dimension | A2 | A3 | A4 | A6 | A7 |
|---|---|---|---|---|---|
| Initial build effort | LOW | MEDIUM | MEDIUM-HIGH | HIGH | MEDIUM |
| Codebases to maintain | 1 | 1 | 1 | 2 (Swift + web) | 1 |
| Framework learning curve | None (vanilla JS) | React | React + React Native + Expo toolchain | SwiftUI + Swift + Xcode + separate web framework | React + Capacitor bridge |
| Iteration speed | Fast (edit file, reload) | Fast (HMR) | Medium (Expo dev server + simulator) | Slow (Xcode build cycle + separate web deploys) | Fast (HMR, same as web) |
| TestFlight/App Store distribution | N/A (PWA) | N/A (PWA) | YES (Expo EAS Build) | YES (Xcode) | YES (Capacitor + Xcode) |
| OTA updates (skip App Store review) | N/A | N/A | YES (Expo Updates) | NO (Apple review required) | PARTIAL (web content updates; native bridge changes need review) |
| AI tooling support | Excellent (Claude knows vanilla JS deeply) | Excellent (Claude knows React deeply) | Good (Claude knows Expo; toolchain has more moving parts) | Good for Swift; two codebases means two contexts | Good (same as React + Capacitor bridge knowledge) |

### 5. Migration and portability

| Dimension | A2 | A3 | A4 | A6 | A7 |
|---|---|---|---|---|---|
| Path to native iOS app | REWRITE | Port to React Native (~40% effort) | Already native (flip build target) | Already native | Already has App Store presence; native features via Capacitor plugins |
| Path to Android (future) | N/A (PWA works on Android already) | Same | Build for Android from same codebase (Expo) | REWRITE in Kotlin or add React Native | Same as A3 (PWA already works on Android) |
| Path away from Supabase | Swap SDK calls to another Postgres-compatible API | Same | Same | Same | Same |
| Data portability | Postgres → standard pg_dump | Same | Same | Same | Same |
| Vendor lock-in risk | LOW (standard web + Postgres) | LOW | MEDIUM (Expo toolchain dependency) | MEDIUM (Apple ecosystem + Supabase) | LOW-MEDIUM (Capacitor is open-source) |

### 6. Cost structure (alpha, ~6 users)

| Component | A2 | A3 | A4 | A6 | A7 |
|---|---|---|---|---|---|
| Hosting | Vercel free | Vercel free | Vercel free (web) + Expo EAS free tier (builds) | Vercel free (web dashboard) | Vercel free |
| Database | Supabase free (500 MB, unlimited API) | Same | Same | Same | Same |
| Apple Developer | $0 | $0 | $99/yr | $99/yr | $99/yr |
| Domain (optional) | ~$12/yr | Same | Same | Same | Same |
| Total annual | ~$12 | ~$12 | ~$111 | ~$111 | ~$111 |

### 7. Risk assessment

| Risk | A2 | A3 | A4 | A6 | A7 |
|---|---|---|---|---|---|
| Scope creep from framework complexity | LOW | MEDIUM | HIGH | HIGH | MEDIUM |
| iOS PWA limitations (no push notifications pre-iOS 16.4, Add-to-Home-Screen friction) | HIGH | HIGH | N/A (real app) | N/A (real app) | N/A (real app) |
| Offline data loss in gym environments | HIGH | HIGH | LOW | LOW | HIGH |
| Two-codebase drift | N/A | N/A | N/A | HIGH | N/A |
| Build toolchain fragility | LOW | LOW | MEDIUM (Expo EAS, React Native versioning) | LOW (Xcode is stable) | MEDIUM (Capacitor + web toolchain) |
| App Store review rejection | N/A | N/A | LOW (workout apps are routine) | LOW | LOW |
| User adoption friction ("Add to Home Screen" vs App Store) | HIGH | HIGH | LOW | LOW | LOW |

## Decision matrix — weighted scoring

Weights reflect the stated priorities: MVP speed, real iPhone app, maintainability by non-pro developer with AI, expandability to coach/admin views, offline resilience.

| Criterion | Weight | A2 | A3 | A4 | A6 | A7 |
|---|---|---|---|---|---|---|
| Meets all requirements (R1–R10) | 25% | 7 | 7 | 10 | 7 | 9 |
| MVP development speed | 20% | 9 | 8 | 6 | 4 | 7 |
| Real iPhone app experience | 15% | 2 | 2 | 9 | 10 | 6 |
| Single codebase / maintainability | 15% | 10 | 10 | 9 | 4 | 8 |
| Offline resilience | 10% | 3 | 3 | 8 | 9 | 3 |
| Migration / future flexibility | 10% | 5 | 7 | 9 | 5 | 7 |
| AI tooling support | 5% | 10 | 9 | 7 | 6 | 8 |
| **Weighted score** | | **6.45** | **6.30** | **8.40** | **5.95** | **7.00** |

## Recommendation

**A4 (Expo + Supabase) scores highest** and is the only approach that satisfies all ten requirements from a single codebase. It provides a real downloadable iPhone app, a web dashboard for laptop, offline write capability, and a clear migration path to Android if needed.

**Trade-off to accept:** Expo's toolchain is more complex than vanilla web development. The learning curve is real but mitigated by AI-assisted development (Claude Code has strong Expo/React Native knowledge). The initial build takes longer than a vanilla PWA, but subsequent iterations are faster because the component model is more structured.

**If MVP speed is paramount and R9 (downloadable app) can be deferred:** A3 (React SPA + Supabase) is the fastest path that still supports all roles and cloud sync. It can be ported to A4 later at ~40% additional effort because React → React Native is a well-trodden migration.

**Staged approach (recommended):**

1. **Phase 1 (MVP):** Build with Expo. Ship the athlete experience as an Expo Web app (browser, works today). Validate data model, auth, and basic flows with 4–6 users.
2. **Phase 2:** Build the iOS binary from the same codebase. Distribute via TestFlight. Users switch from browser to real app. No backend changes.
3. **Phase 3:** Add coach views, admin dashboard, expanded analytics. Same codebase, role-gated UI.

This sequence gives you the fastest initial validation (web deploy, no App Store review), followed by a native upgrade that doesn't require a rewrite.

## Appendix: glossary of components

| Component | What it is | Role in this system |
|---|---|---|
| Supabase | Open-source Firebase alternative: hosted Postgres + auth + realtime + storage + edge functions | Cloud backend, auth provider, source of truth |
| Vercel | Hosting platform for web apps and serverless functions | Hosts the web app / dashboard |
| Expo | Toolchain and runtime for React Native apps; manages builds, OTA updates, native API access | Build system, distribution, native bridge |
| React Native | Framework for building native mobile apps using React | UI layer on iPhone |
| Expo Web | Expo's web target — renders React Native components to browser DOM | Web/laptop view from same codebase |
| TestFlight | Apple's beta testing platform for iOS apps | Alpha distribution to 4–6 users |
| EAS Build | Expo Application Services — cloud build service for iOS/Android binaries | Produces the .ipa for TestFlight without local Xcode |
| Capacitor | Bridge that wraps a web app in a native iOS/Android shell | Alternative to Expo for getting a web app into the App Store |
| SwiftUI | Apple's declarative UI framework for iOS/macOS | Native UI layer (A6 only) |
| SwiftData | Apple's persistence framework (Core Data successor) | Local data layer with iCloud sync (A5/A6) |
| CloudKit | Apple's cloud database service tied to iCloud | Sync layer for Apple-only approach (A5) |

## Platform Evolution — Technical Direction Beyond MVP

The MVP decision (A4: Expo + Supabase) is confirmed. This section maps that foundation forward through XRSize4 ALL's five phases, evaluating what stays, what gets augmented, and what requires new infrastructure.

### Phase 1 — Lifting Tracker MVP

**What Expo + Supabase covers completely:**

| Concern | How it's handled | Notes |
|---|---|---|
| Mobile app (iPhone) | Expo → TestFlight via EAS Build | Single codebase |
| Web dashboard (laptop) | Expo Web → Vercel | Same codebase |
| Database | Supabase Postgres | Full D1–D24 schema deployed from day one |
| Auth | Supabase Auth (magic-link) | Invite-only, SecureStore on device |
| Offline sync | AsyncStorage + custom sync queue | Reconnect reconciliation |
| Real-time | Supabase Realtime (WebSocket) | Not needed in MVP but available |
| File storage (photos) | Supabase Storage | Encrypted at rest, RLS-gated |
| AI/LLM (NL parsing, summaries) | Supabase Edge Functions → external LLM API (Anthropic/OpenAI) | Edge Function calls the model; results stored in ai_interactions table |
| Row Level Security | Supabase RLS policies | Athlete sees own data only |
| Exercise library seed | Supabase SQL migration | Canonical exercises from combined_workout_log.txt |

**New infrastructure: None.** Expo + Supabase handles everything in Phase 1.

**Technical debt created: None.** The schema is ontological (D12) with nullable FKs for all future entities. No shortcuts that block later phases.

### Phase 2 — Coaching Activation

**What stays as-is:**

| Concern | Status |
|---|---|
| Mobile app + web | Same Expo codebase; coach UI added as role-gated screens |
| Database | Same Supabase Postgres instance; coach_relationships, routines, assigned_sessions already in schema |
| Auth | Same; coach accounts get role=2 |
| Offline sync | Same mechanism; coach actions (assignments, reviews) don't require offline — they're laptop-primary |

**What gets augmented (new Supabase features):**

| Concern | Augmentation | Why |
|---|---|---|
| Video storage (form capture, D23 Layer 1) | Supabase Storage with larger bucket policies | Set videos are larger than photos; may need paid tier for storage quota |
| RLS complexity | Additional policies for coach-sees-client-data | Coach can read their clients' sessions but not other coaches' clients |
| Edge Functions (AI coaching) | More Edge Functions for coach summaries, program generation (D19) | Higher AI API call volume; cost monitoring becomes relevant |
| Supabase Realtime | Enable for coach-client data (coach sees client log in near-real-time) | Low additional cost; existing Supabase capability |

**New infrastructure outside Supabase:**

| Concern | Infrastructure | Why |
|---|---|---|
| Video transcoding | Likely not needed yet — raw video stored and played back as-is. If quality/size becomes an issue: Mux, Cloudflare Stream, or AWS MediaConvert | D23 Layer 1 is storage + playback only; transcoding is a Phase 3+ concern |
| Push notifications | Expo Notifications service (free tier) | Coach notified when client logs; client notified when coach assigns |

**Technical debt risk: LOW.** Coach features extend the existing model cleanly. The main cost driver is Supabase storage for videos — monitor and upgrade tier as needed.

### Phase 3 — Commerce and Content

**What stays as-is:**

| Concern | Status |
|---|---|
| Mobile app + web | Same Expo codebase |
| Core database | Same Supabase Postgres; new tables for commerce and content added via migration |
| Auth | Same Supabase Auth; no new auth patterns needed |
| Offline sync | Same for athlete logging; commerce actions are online-only |

**What gets augmented:**

| Concern | Augmentation | Why |
|---|---|---|
| Supabase Storage | Paid tier almost certainly required; hosted coach video content (D24) adds significant storage | Instructional videos are larger than set videos |
| Edge Functions | Payment webhooks from Stripe, content processing triggers | Higher function invocation count |
| Database | Commerce tables (payment_accounts, subscriptions, transactions, payouts) added to schema | New domain; same Postgres instance unless performance dictates separation |

**New infrastructure outside Supabase:**

| Concern | Infrastructure | Why |
|---|---|---|
| Payment processing | **Stripe Connect** (or Square for Platforms) | Coach-to-client billing (D9 note). Marketplace model with KYC/AML, 1099s. Supabase doesn't handle payments. |
| Media CDN | **Cloudflare Stream**, **Mux**, or **AWS CloudFront + S3** | Hosted coach demonstration videos need a CDN for playback performance. Supabase Storage alone won't scale for video streaming to many users. |
| Video transcoding | **Mux** or **AWS MediaConvert** | Multiple resolutions, adaptive bitrate for coach content. Not needed for private set videos (Phase 2) but needed for published content. |
| Backend-for-frontend (BFF) | **Consider but defer.** If Edge Functions become unwieldy (too many, too complex), introduce a thin API layer (Node.js on Railway/Render/Fly.io) that sits between Expo and Supabase. | This is a "watch and decide" item. Many projects stay on Edge Functions indefinitely; some outgrow them. |

**Technical debt risk: MEDIUM.** This is the phase where Supabase stops being "the entire backend" and becomes "the database + auth + realtime layer" within a broader infrastructure. The Expo client doesn't care — it talks to APIs regardless of what's behind them. The risk is operational complexity: more services to monitor, more credentials to manage, more failure points.

### Phase 4 — Community and Discovery

**What stays as-is:**

| Concern | Status |
|---|---|
| Mobile app + web | Same Expo codebase; social UI added |
| Core database | Same Supabase Postgres; social and proximity tables added |
| Auth | Same |

**What gets augmented:**

| Concern | Augmentation | Why |
|---|---|---|
| Supabase Realtime | Heavier use for messaging, activity feeds, live updates | Monitor connection limits on Supabase plan |
| Supabase Postgres | **PostGIS extension** for geospatial queries (proximity, venue matching) | Supabase supports PostGIS natively; enable the extension |
| RLS | Significantly more complex policies for social visibility, group membership, blocking | RLS policy count grows; test thoroughly |

**New infrastructure outside Supabase:**

| Concern | Infrastructure | Why |
|---|---|---|
| Messaging | Evaluate: Supabase Realtime channels vs. dedicated messaging service (e.g., Stream Chat, Ably) | Supabase Realtime can handle basic messaging. At scale (thousands of concurrent connections), a dedicated service is more reliable. |
| Content moderation | **AI-based screening** (image + text) via external API (OpenAI moderation, Anthropic, or dedicated service like Hive) | User-generated social content requires automated screening + human review queue. |
| Search | **Consider Supabase full-text search** (built-in) or **Typesense/Meilisearch** for exercise library, content, and user search at scale | Built-in Postgres full-text search works initially; dedicated search improves relevance and speed as content grows. |
| Activity feed | Evaluate: Postgres-based fan-out vs. dedicated feed service (e.g., Stream Feeds, custom Redis-based) | Simple feeds work in Postgres. Algorithmic feeds with hundreds of thousands of users need specialized infrastructure. |

**Technical debt risk: MEDIUM-HIGH.** Social features introduce the highest operational complexity. The core Expo + Supabase foundation still holds for the app itself, but the backend becomes a multi-service architecture. Key decision point: hire or outsource DevOps capacity before this phase.

### Phase 5 — Extended Reality and Advanced AI

**What stays as-is:**

| Concern | Status |
|---|---|
| Core mobile app + web | Same Expo codebase for phone and web |
| Database | Same Supabase Postgres as source of truth |
| Auth | Same Supabase Auth; wearable apps authenticate via companion-phone handoff |

**What requires new, separate infrastructure:**

| Concern | Infrastructure | Why |
|---|---|---|
| Apple Watch app | **Native SwiftUI** (watchOS) — completely separate codebase | Per D20. Expo cannot target watchOS. The watch app communicates with the phone app via WatchConnectivity framework and syncs to Supabase indirectly through the phone. |
| Wear OS app | **Native Kotlin** (Wear OS) — separate codebase | Same rationale as Watch. |
| Smart glasses / AR | **Platform-specific SDK** (Meta, Apple Vision, etc.) — separate codebase per device | Immature ecosystem; target only when platform SDKs stabilize. |
| On-device ML (form analysis) | **Core ML** (iOS) or **TensorFlow Lite** (cross-platform) | D23 Layer 4 (real-time form feedback) requires on-device inference. Models trained offline, deployed to device. Expo can access Core ML via native modules. |
| AI pipeline (advanced) | **Dedicated ML infrastructure** — model fine-tuning, evaluation, deployment pipeline | Advanced AI features (D19 v3+ scope: goal synthesis, program generation, tension detection) may require fine-tuned models, not just API calls. Infrastructure: AWS SageMaker, GCP Vertex, or self-hosted. |
| Voice processing | **Speech-to-text API** (Whisper, Deepgram, Apple Speech) → D19 NL parser | Voice-based logging (D20 via AirPods/glasses) requires real-time speech transcription piped into the NL workout parser. |

**Technical debt risk: LOW from MVP choices.** The Expo + Supabase MVP creates no debt for this phase. Watch and glasses apps were always going to be separate native targets regardless of the MVP stack choice. The Supabase data layer is accessed by all targets through the same API. The main risk is organizational, not technical: multiple codebases, multiple platform expertises, multiple deployment pipelines.

### Platform Evolution Summary

| Phase | Expo | Supabase | New Infrastructure | Debt from MVP |
|---|---|---|---|---|
| 1 (MVP) | Primary app (iPhone + web) | Entire backend | None | None |
| 2 (Coaching) | Same + coach screens | + Storage for video, + RLS policies, + Edge Functions | Push notifications (Expo service) | None |
| 3 (Commerce) | Same + commerce UI | + Paid tier, + commerce tables | Stripe Connect, media CDN, video transcoding. Possibly BFF API layer. | None — but operational complexity increases |
| 4 (Community) | Same + social UI | + PostGIS, + heavier Realtime, + complex RLS | Messaging service (maybe), content moderation, search, activity feed | None — but multi-service architecture requires DevOps |
| 5 (XR + AI) | Same for phone/web | Same as source of truth | Watch (SwiftUI), Wear OS (Kotlin), on-device ML, AI pipeline, voice processing | None from MVP. New codebases are additive, not replacements. |

**Key finding:** The Expo + Supabase MVP choice creates zero technical debt for any future phase. Supabase evolves from "the entire backend" to "the database + auth + realtime core" of a broader infrastructure, but it's never replaced — only augmented. Expo remains the primary mobile + web codebase through all five phases; wearable and AR targets are always separate native apps regardless of what the MVP stack was.

### Extended Requirements Coverage (Platform-Level)

The original comparison evaluated 10 requirements (R1–R10) scoped to the MVP. The platform vision introduces additional requirements. Here is how A4 (Expo + Supabase) covers them, with the infrastructure augmentation identified per phase:

| Requirement | Phase | How A4 + Supabase handles it |
|---|---|---|
| R1–R10 (original MVP) | 1 | Fully covered (scored 8.40/10) |
| R11: Video hosting + streaming | 2–3 | Supabase Storage (Phase 2 for private); CDN + transcoding (Phase 3 for public) |
| R12: Payment marketplace | 3 | Stripe Connect — external to Supabase; Expo client integrates via SDK |
| R13: AI/ML pipeline (beyond API calls) | 3–5 | Edge Functions (Phase 1–3); dedicated ML infra (Phase 5) |
| R14: Real-time messaging | 4 | Supabase Realtime (basic); dedicated service at scale |
| R15: Geospatial queries | 4 | PostGIS extension on Supabase Postgres |
| R16: Content moderation | 4 | External AI moderation API + human review queue |
| R17: Wearable native apps | 5 | Separate SwiftUI / Kotlin codebases — outside Expo |
| R18: On-device ML | 5 | Core ML / TF Lite via Expo native modules |
| R19: Voice interaction | 5 | Speech-to-text API → NL parser (D19) |
| R20: Multi-discipline training | 2+ | Schema already supports via exercise_types table (D13) |

---

© 2026 Eric Riutort. All rights reserved.
