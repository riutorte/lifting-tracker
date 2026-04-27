---
author: Eric Riutort
created: 2026-04-14
updated: 2026-04-24
version: 0.4.0
tier: ARCHITECTURE
content_class: architecture
status: accepted
---

# Lifting Tracker — Architecture

**Scope note:** This document describes the architecture of the Lifting Tracker sub-system of XRSize4 ALL. XRSize4 ALL is the overarching system of systems — people, process, and technology — of which the Lifting Tracker is the first sub-system to ship. Platform-level concerns (identity, coaching, commerce, content, social, biometrics, wearables, goals, intelligence, proximity, form analysis, instructional content) are addressed in `xrsize4all_concept_v0.2.0.md`. Decisions in this document are specific to the Lifting Tracker sub-system. Where a decision here references a platform capability (e.g., D19 AI reasoning, D20 wearables, D21 goals), it describes the Lifting Tracker's use of that capability, not the platform-wide design of it.

Working document. Captures architectural decisions as they're made.

## Status

**Alpha, pre-implementation.** The current repo contains an earlier PWA prototype (static HTML/CSS/JS on GitHub Pages) which is being superseded by this design. The prototype stays in git history for reference.

## Purpose

A coach-client workout tracking application with hierarchical role-based access. Four roles in the alpha, each inheriting the capabilities of the role below it:

1. **Athlete** (base) — logs own workouts, views own progress, manages own exercise library. Every user is at minimum an athlete.
2. **Coach / Instructor** (inherits Athlete) — assigns workouts to clients, views client progress, tracks client activity. When logging their own workouts, uses inherited athlete capabilities.
3. **Gym** (inherits Coach) — capabilities TBD for alpha. Placeholder in the hierarchy for future gym-level management (view all coaches and clients within the gym, manage gym-level settings).
4. **Super Admin** (inherits Gym) — full access to all users, all data, system-wide configuration.

Permission checks use hierarchy comparison: `user.role >= required_role`. No role switching needed — a coach sees both their own training and their clients in a single UI.

The app serves both data entry and analysis. Entering data without analysis is out of scope: progress tracking is a first-class feature, not a v2 nice-to-have.

## MVP approach

Athlete-first, iterative expansion within one app:

1. **MVP (ship first):** Athlete experience — log workouts, view own progress/stats, cloud sync, auth. Every user starts here.
2. **Next iteration:** Coach view unlocks inside the same app — assign workouts, view client progress. Navigation elements and role hooks exist from MVP but don't activate until this ships.
3. **Later:** Admin dashboard, gym views, expanded analytics. Same app, same URL, progressively revealed based on role.

The schema and auth support all roles from day one. The UI only exposes features as they're built.

**Schema completeness note:** The data model supports the full ontological structure (Programs, Exercise Types, Routines, Classes, Exercise Families, limb configurations, set grouping, coach relationships, goals, biometric data placeholder, progress photos, set videos, instructional content, AI interactions) from day one. MVP UI exposes only athlete-level logging and analytics; higher-level concepts exist as nullable foreign keys or empty tables ready for v2 without migration.

## Decisions

### D1. Primary purpose — entry + analysis, both roles

Workout entry and progress analysis are equally important. The app is evaluated on its progress/analytics view as much as its logging flow.

**Rationale:** "Entering data without analysis is pointless."

### D2. Granularity — per-set

Data model stores individual sets: `User → Session (date) → Exercise → Set (weight, reps, rest tag, notes)`. All stats (1RM, volume, heaviest, trends) are derived from this base, not stored as separate figures.

**Rationale:** Required for analytics at the level needed by coaches and athletes.

### D3. Multi-user with hierarchical RBAC — one app, role-aware UI

A single app with role-based UI on login. Roles use inheritance: Athlete → Coach → Gym → Super Admin. Each role inherits all capabilities of the roles below it. A user holds one role which implicitly grants everything beneath it.

**Rationale:** Simpler than separate apps or a flat permission matrix. Matches real-world structure (a coach IS an athlete who can also manage clients). Does not preclude a dedicated coach app later.

### D4. Source of truth — cloud database, always

After a one-time import of the existing `combined_workout_log.txt`, the cloud database is the single source of truth for all data. The text log becomes a read-only archive. Devices cache locally for offline use and sync when connected. Edits to imported historical data are treated as regular DB writes (no audit trail in alpha).

**Rationale:** Multi-user access requires a central authority. Offline-first design with local caching handles gym connectivity gaps.

### D5. Exercise library — seeded + user-extensible

Exercises are data, not code. A seeded catalog of canonical exercises (from the existing text log — Bench Press, Pec Fly, Squat, etc.) is available to all users. Any user can create custom exercises scoped to themselves or their team/clients. An alias system prevents name collisions between users.

**Rationale:** Coaches and athletes have different naming conventions. The alias system preserves both without collision.

### D6. Auth — real accounts from day one

Authentication is required in the alpha. Magic-link email (no passwords) for invite-only access. Apple/Google sign-in may be added later.

**Rationale:** Implied by D3 + D4. Multiple users sharing data requires identity.

### D7. Alpha audience — closed, 4–6 named users

Closed alpha: Eric (super admin), Ethan (coach), Ethan's client(s), and a small number of independent athletes. Invite-only via magic-link email — no self-serve sign-up, no onboarding flow, no public access.

**Rationale:** Real users with real workouts validate the data model and UX before expanding. Known users reduce the need for billing, admin surfaces, and support infrastructure in alpha.

### D8. Platform — Expo (React Native) + Supabase, offline-first

Real iPhone app distributed via TestFlight (Expo EAS Build, no local Xcode required). Web dashboard for laptop access from the same codebase via Expo Web. Supabase provides Postgres, auth, and real-time sync. Offline-first: AsyncStorage + sync queue for logging workouts without connectivity; reconciles on reconnect.

**Rationale:** Only single-codebase approach that satisfies all requirements — real downloadable app, web dashboard, offline writes, cloud sync. Scored 8.40/10 in weighted architectural comparison (see `docs/architecture-comparison_v0.3.0.md`). Ubiquitous internet access cannot be assumed in gym environments.

**Note on D20:** Watch and wearable apps are separate targets that do NOT fit this single-codebase model. See D20.

**Revision 2026-04-23 (Sprint 0a):** The original D8 named AsyncStorage + sync queue as the offline-first stack, and subsequent exploration named WatermelonDB as a candidate. Final Sprint 0a decision: offline-first uses `expo-sqlite` as the local data store + `Drizzle ORM` for type-safe queries + `TanStack Query` for server-state cache + a custom Supabase sync adapter (BYO, single-user-per-device pattern, last-write-wins conflict resolution). WatermelonDB considered and declined — the "most commonly used" argument lost to composite-principle alignment: SQLite + Drizzle has maximum AI-codegen fluency, zero abstraction layer between the app and SQL, and is portable to any SQL store. PowerSync Open Edition considered as an alternate sync layer and declined for MVP; revisit when multi-user coach-athlete collaboration becomes real (Sprint 2+). The AsyncStorage + sync-queue framing above is superseded by this revision; AsyncStorage remains available for small key-value state (auth tokens via SecureStore, user prefs) but is not the workout data store. See `reach4all://docs/research/lifting-tracker-stack-validation.md`, `reach4all://docs/research/electricsql-assessment.md`, and `reach4all://docs/research/mobile-app-db-landscape.md` for the analysis backing this call.

### D9. Business model — free for alpha, subscription later

No billing infrastructure in alpha. All users free. Schema includes a `tier` field on users/orgs (defaulting to "free") so subscription support can be added without migration. Stripe integration is post-alpha.

**Rationale:** 4–6 invited users don't need billing. But the hook must exist in the schema from day one so the transition to freemium/subscription isn't a rewrite.

**Note on coach-to-client billing:** D9 covers app monetization (users paying the platform). Coach-to-client billing (coaches charging clients through the platform via Stripe Connect or Square for Platforms) is a separate concern, deferred. See non-decisions.

### D10. Ethan's role — Coach (inherits Athlete)

Ethan is a Coach on one account. He logs his own workouts (inherited Athlete capability) and manages his client(s) (Coach capability). No separate accounts for different roles. Ethan is also a potential future distribution channel — he may market the app to his own clients and network.

**Rationale:** One account, one login, one experience. Role hierarchy handles the dual nature without switching.

### D11. Project trajectory — personal tool → business

Starts as a tool for Eric and Ethan. Intended to become a business product. Ethan will use it for his coaching business and may market it independently.

**Implications for alpha:**

- Build to product quality, not throwaway code.
- Multi-tenancy awareness from day one — schema should not assume a single coach or gym.
- Branding should be neutral (not "Eric's Tracker") so Ethan can present it to his clients.
- Infrastructure stays lean (Supabase free tier) but designed for clean migration to paid tier or self-hosted Postgres.

### D12. Schema shape is ontological, not taxonomic

A Session is the atomic unit of training. All higher-level relationships (Program, Routine, Class, Exercise Type) are optional. Any Session may exist without being part of a Program, Routine, or Class — including one-off workouts, drop-in classes, spontaneous hotel-gym sessions, and unstructured training. Every relationship is a nullable foreign key.

**Rationale:** A rigid taxonomy would force users to create fake Programs or Routines just to log a casual workout. An ontological shape treats each concept as independent with identity, and relationships as assertions rather than structural requirements. This matches how people actually train and enables the schema to support everything from "I went to a yoga class once" to "My coach has me on a 12-week periodized program with mixed lifting, mobility, and conditioning."

**Note:** This is the ontological shape of the schema — distinct from formal ontology integration (PACO, EXMO, KHMO), which remains deferred.

### D13. Training hierarchy above Session

The full hierarchy of training structure, from most abstract to most concrete:

```
Exercise Program (top-level plan across disciplines)
  ↓ includes
Exercise Types (Weightlifting, Kung Fu, Running, Yoga, Cycling, etc.)
  ↓ organized via
Routines (self-directed or coach-prescribed templates)
  AND/OR
Classes (instructor-led group sessions at fixed venues)
  ↓ executed as
Sessions (one block of time on a specific date)
  ↓ contain
Exercises (specific movements performed)
  ↓ contain
Sets (individual performances with weight, reps, rest, etc.)
  ↓ contain
Reps (count within a set)
```

Each layer is optional (per D12). A Session may link to any, all, or none of Program / Exercise Type / Routine / Class.

**Definitions:**

- **Exercise Program** — a multi-discipline, time-bounded or open-ended plan. Coordinates multiple Exercise Types and their schedules. May be self-created by an athlete, coach-assigned to an athlete, or a reusable template. Every user has at least one implicit "My Training" program so logging is never blocked.
- **Exercise Type** — the discipline category (Weightlifting, Kung Fu, Running, Yoga, Cycling, etc.). Each type may have its own set-metric schema (reps × weight vs. rounds × time vs. distance × pace).
- **Routine** — a template of exercises and target parameters. Self-directed or coach-prescribed. Flexible scheduling. Reusable.
- **Class** — an instructor-led group session at a specific time and venue. Athlete attends and follows the instructor. May be logged as just attendance + duration, or with full exercise detail if the athlete tracks.
- **Session** — one block of time when the athlete actually trained. The atomic unit of all logging.

**Rationale:** Real-world training spans multiple disciplines and contexts. The hierarchy enables a Program to coordinate weightlifting, martial arts, and running; distinguishes planned work (Routines) from attended instruction (Classes); and supports ad-hoc training through optional linkage.

### D14. Per-implement weight, not total

Weight on a set is recorded as the load on each implement — what the user reads on the dumbbell, bar, or kettlebell — not a computed total. If an exercise uses two dumbbells of 25 lbs each, the user enters 25, not 50.

Total load for volume calculation is computed from the exercise's limb configuration (D15) at analytics time. Each set stores `weight_entered` (what the user typed) and optionally a computed `weight_total` for volume math.

**Rationale:** Matches user intuition. Users read what's marked on the implement and enter that. The system handles the doubling (for two-implement exercises) behind the scenes, consistently, using a property defined on the exercise.

### D15. Limb configuration is a property of the exercise

Each exercise in the library carries two configuration fields: `upper_limb_config` and `lower_limb_config`. Enum values for each:

- **together** — both limbs work simultaneously on a shared implement (barbell bench press, barbell squat, single kettlebell swing with two hands)
- **apart_simultaneous** — both limbs work simultaneously, each with its own implement (dumbbell bench press, dumbbell walking lunges)
- **apart_alternating** — limbs work one at a time, trading off within the same set (alternating dumbbell curls, alternating lunges)
- **single** — unilateral; one limb at a time across separate sets (one-arm dumbbell row, pistol squats; each side is its own logged set)
- **none** — limb is not loaded in this exercise

Variations of the same movement pattern that differ in limb configuration are distinct exercises in the library (e.g., "Dumbbell Curl — Both Arms," "Dumbbell Curl — Alternating," "Dumbbell Curl — Single Arm" are three separate entries). An `exercise_family` concept groups these variations for cross-variation analytics.

**Volume math by configuration:**

- **together** → volume = weight × reps
- **apart_simultaneous** → volume = weight × 2 × reps
- **apart_alternating** → volume = weight × reps (reps counted per user convention — per-arm or total, captured at exercise or set level)
- **single** → volume = weight × reps (each side is its own set)

**Rationale:** Limb configuration is intrinsic to the movement as performed, not a per-log modifier. Making it a property of the exercise means volume math is deterministic and correct by default, without the user doing mental arithmetic.

### D16. Rest notation — integer seconds with defaulting

Rest between sets is stored as integer seconds. Three-level defaulting cascade:

1. **Session-level default** — `sessions.default_rest_seconds` — applies to all sets unless overridden
2. **Exercise-level default** — `session_exercises.default_rest_seconds` — overrides session default for that exercise
3. **Set-level value** — `sets.rest_seconds` — explicit override on an individual set

Null at any level falls through to the next level up. Most users will set a session default once and only override when a specific exercise or set warrants it.

Historical notation in `combined_workout_log.txt` (`x` ≈ <30s, `+` ≈ 60s, explicit `90s`) is converted to estimated integer seconds on import.

**Note on intra-set rest:** Short pauses between reps within a single set (5–20 seconds) are not captured as data in MVP. The set is treated as one unit regardless of micro-pauses. Deferred as a future enhancement.

**Rationale:** Integer seconds is unambiguous and usable in analytics. Three-level defaulting matches how athletes think — consistent rest per session with occasional overrides, not entering rest on every set.

### D17. Set grouping via group_id

Sets within an exercise may be performed as a group — back-to-back with no meaningful rest between them (supersets, drop sets, cluster sets, rest-pause). The `sets.group_id` column (nullable integer) captures this: sets sharing the same `group_id` within an exercise are a group. Null means a standalone set.

Historical parenthesized notation `(95x8, 95x8)` imports as two sets with a shared `group_id`. Future UI exposes this through a "superset with previous" toggle or a drag-to-link interaction — the notation is cosmetic, the `group_id` is the underlying data.

**Rationale:** The concept of grouped sets is real and analytically meaningful (training density, time under tension, recovery implications). Preserving it in schema from day one costs one nullable integer column and keeps import information-preserving.

### D18. Multi-weight notation expands on import

Historical shorthand in `combined_workout_log.txt` imports into the per-set table (D2) as follows:

- **WxR** → 1 row: weight=W, reps=R, group_id=null
- **WxRxN** → N rows: each weight=W, reps=R, group_id=null (standalone sets with meaningful rest between them per the exercise/session default)
- **(WxR, WxR, ...)** → multiple rows, all sharing the same group_id (a grouped set performed back-to-back)
- **WxR(big)** → 1 row with reps=R performed continuously without meaningful intra-set pauses (e.g., 95x100 means one continuous set of 100 reps at 95 lbs — not compressed shorthand for multiple sets)

**Rationale:** Preserves D2 (per-set granularity) for all notation. One row per actual set performed. Analytics counts rows, not parses shorthand. Parser is straightforward: three distinct patterns, three distinct behaviors.

### D19. AI/LLM reasoning follows Reasoner Duality with an Authority Rule

AI/LLM capability in the Lifting Tracker is layered on two tiers:

- **Tier 1 — Deterministic reasoning:** rule-based logic over structured data. Per-set volume calculations, 1RM estimation, progressive overload rules, limb configuration math (per D15), set grouping analytics (per D17), goal progress computation, policy enforcement (role access, privacy).
- **Tier 2 — LLM reasoning:** non-deterministic language understanding and generation. Natural-language workout entry parsing, session summaries, fuzzy exercise matching, coaching-style narrative, alias suggestion, explanation of Tier 1 findings.

**Authority Rule:** Tier 1 findings govern consequential decisions. Tier 2 explains, elaborates, and suggests, but does not override Tier 1. If the deterministic reasoner says volume exceeds an athlete's typical MRV, the LLM layer cannot recommend adding more volume, regardless of narrative framing.

**AI Agent behavior expectations** (consistent with `xrsize4all_concept_v0.2.0.md` platform norms):

- AI outputs are clearly identifiable as AI-produced.
- AI suggestions require user confirmation for any write that changes athlete data (NL-parsed workouts produce drafts for user review, not silent writes).
- Every AI interaction is logged with its input, output, referenced data, and model identifier for auditability.
- Users can provide feedback (thumbs up/down) which is retained and used to improve the system.

**Scope for MVP** (specific Lifting Tracker applications):

- Natural-language workout entry parsing (enhances US-012): "Bench 225 for 5, 225 for 5, 225 for 4 with 2 minutes rest" → structured sets for user review.
- Session summaries: a plain-language paragraph describing what the athlete did, volume totals, any notable lifts or anomalies.
- Fuzzy exercise matching and alias suggestions during exercise selection.
- Clearly-wrong-entry detection: flag entries dramatically out of line with the athlete's history ("500 lbs bench press — confirm?").

**Scope deferred to v2+:**

- Coach-facing weekly client summaries.
- AI-assisted program generation and adjustment.
- Readiness recommendations combining workout + biometric + sleep data.
- Goal synthesis from vague intent.
- Competing-goal tension detection.

**Rationale:** Health-adjacent recommendations require accuracy. Deterministic logic over clean data is where decisions happen; LLM is where they're communicated. This separation contains hallucination risk while capturing the benefits of natural-language interaction. The pattern is adopted from XRSize4 ALL's platform-level AI governance (`xrsize4all_concept_v0.2.0.md`) and applied here with specific MVP scope.

**Tier 2 concern log (added 2026-04-23):**

Tier 2 outputs are governed by the Authority Rule — user confirmation required before any write to athlete data. The concern log is a signal layer that detects when Authority Rule compliance is present in code but absent in practice (the user is mechanically accepting Tier 2 output without meaningful review). Signals tracked:

- time-from-suggestion-to-acceptance (rubber-stamp if < N seconds)
- acceptance-rate-without-modification (rubber-stamp if > X%)
- batch-accept patterns (multiple Tier 2 drafts accepted in rapid succession)
- divergence between accepted Tier 2 outputs and actual outcomes (accepted draft didn't match what the athlete actually did)

The concern log is not a gate — it does not block Tier 2 output or user acceptance. It is a monitoring surface that can later feed prompts to the user ("you've been accepting drafts without edits for two weeks — are they still accurate?") or inform model/prompt tuning. Storage: `.cm/tier2-concerns.json` in the running app's data directory. Source framing: Gartner "activation signals" pattern ported from HR-scale human-in-the-loop systems. See `docs/reference/gartner-ai-native-swe-review.md`.

### D20. Watch and wearable apps are separate targets, not MVP scope

Apple Watch (watchOS) and Wear OS (Android) are treated as separate app targets that complement the primary mobile app (D8). They require native development (SwiftUI for Apple Watch, Kotlin for Wear OS) and fall outside the Expo single-codebase premise. Meta smart glasses and other AR/XR devices are further deferred pending platform maturity.

**Scope for MVP:** None. No watch app, no glasses app, no Wear OS app.

**Priority features if a watch target is eventually built (post-MVP):**

1. Haptic rest timer — vibrates when the rest interval (per D16) completes.
2. Quick set logging — log a completed set from the watch without pulling out the phone.
3. Next-exercise display — show what exercise and target parameters come next in the current session.

These three features provide the highest practical value with the least development surface. Other watch features (independent mode without phone, voice input, real-time biometric display) are lower priority.

Voice-based logging via AirPods or similar audio-only devices depends on D19 (AI/LLM) being in place — parsing unstructured speech into structured sets requires the Tier 2 LLM layer.

**Rationale:** Wearable apps are a meaningful departure from the Expo-based architecture (D8) and require separate engineering investment per platform. Building them before the core mobile experience is validated is premature. The three prioritized watch features are a focused target that delivers most of the user value.

### D21. Goals are first-class entities, linked to relevant data sources

Goals are a first-class domain entity, not a feature of the progress view. A goal captures user intent (what they want to achieve), a measurable target (metric, value, deadline), a starting point, and a status. Goals link to the data sources that measure progress (sessions, body weights, biometrics when present, progress photos when present) so progress is computable rather than manually tracked.

**Goal categories supported in the schema from day one:**

- **Body composition** — body weight targets, body fat estimates, circumference measurements.
- **Strength** — 1RM or rep-max on specific exercises or exercise families.
- **Endurance** — distances, times, pace targets (applicable when non-lifting Exercise Types come online).
- **Skill** — qualitative milestones (e.g., "first unassisted pull-up," "clean form on barbell squat").
- **Habit** — consistency targets (sessions per week, streaks, completion rates).
- **Health** — resting heart rate, sleep duration, recovery metrics (applicable when biometrics sub-system is online).
- **Aesthetic** — qualitative body composition goals (lower priority; sensitivity considerations per D22).

**Scope for MVP** (Lifting Tracker specifically):

- Strength goals tied to specific exercises or exercise families (e.g., "Bench Press 225 × 5 by December 2026").
- Body weight goals (target value + deadline).
- Status: active / achieved / paused / abandoned.
- Current value auto-computed from linked session data and body weight entries.
- No milestones, no AI goal generation, no coach-assigned goals in MVP.

**Scope deferred to v2:**

- Multiple categories per athlete (beyond strength and body weight).
- Goal milestones and intermediate targets.
- Coach-assigned goals with tracking visibility for coaches.

**Scope deferred to v3:**

- AI-assisted goal creation from vague intent (per D19).
- AI-generated programs that align with active goals.
- Competing-goal tension detection.

**Rationale:** Training without a goal is uncommon. Surfacing goals as explicit first-class entities (rather than implicit in progress views) enables coach-client goal setting, goal-driven program selection, goal-aware AI coaching, and goal-based social/challenge features at the platform level. The data model reserves room for all of this from day one.

### D22. Progress photos — private by default, sensitivity-aware

The platform supports photo-based progress tracking as a first-class capability, distinct from content publishing. Progress photos are:

- **Private by default.** Stored encrypted at rest. Not shared with coaches, groups, or the public unless the user explicitly grants access per photo or per photo set.
- **Stripped of location metadata.** EXIF geolocation is removed on upload.
- **Easily deletable.** A single action deletes all progress photos for an account. Deletion is permanent within a reasonable backup window.
- **Linked optionally to other data.** A photo can be linked to a date, a body weight entry (per existing `body_weights` table), and a goal (per D21). Links are not required.

**Body-image and mental-health considerations (non-negotiable):**

- No gamification. No streaks on photo-taking. No leaderboards based on body composition.
- No aesthetic judgments in any UI language. Progress is described in neutral terms.
- Any future AI analysis of photos (see v3 scope below) uses observational language with explicit uncertainty, never normative or comparative language.
- Usage patterns suggesting obsessive or distressing behavior trigger supportive resources, not engagement optimization.

**Scope for MVP:**

- Upload progress photo with date.
- Gallery view ordered by date.
- Side-by-side comparison of two selected photos.
- Optional link to a body weight entry on the same date.
- Private only. No sharing controls in MVP because nothing is shared.
- No AI analysis.

**Scope for v2:**

- Guided capture flow for lighting/pose/distance consistency.
- Multiple angles per session (front, side, back).
- Optional sharing to a user's coach (granular per-photo control).
- Pose detection to help users match a reference pose across photos.

**Scope for v3:**

- AI-generated observational summaries of changes between photos (neutral language only, per D19 Reasoner Duality).
- Estimated body composition ranges with explicit uncertainty.
- Correlation with sessions, body weights, goals.

**Rationale:** Progress photos are the most sensitive data in the platform — often minimal clothing, always tied to body image. Privacy defaults and ethical framing are not optional. The feature serves the athlete's self-directed tracking, not platform engagement metrics. This is the single highest-risk feature in the platform for enabling user harm if designed poorly; responsible implementation starts with these defaults.

### D23. Form analysis from video — layered capability

Video capture of exercise performance with analysis capabilities layered progressively:

- **Layer 1 (v2):** Video storage and playback linked to specific sets. Basic playback at normal speed, slow motion, and frame-by-frame. Annotation for coach review (timestamps, freeze-frame comments).
- **Layer 2 (v3):** Pose estimation providing joint angles, range of motion, tempo, and bilateral symmetry. Exercise-specific analysis for a prioritized set of compound lifts (squat, deadlift, bench press, overhead press, row).
- **Layer 3 (v3-v4):** Natural-language form feedback combining Tier 1 measurements (deterministic) with Tier 2 LLM narration (per D19 Reasoner Duality). Feedback phrased as observations and suggestions, confidence indicated, never as medical or injury diagnosis.
- **Layer 4 (v5+):** Real-time or near-real-time feedback during sets. Likely requires on-device processing and possibly integration with wearables (per D20).

Form analysis is attached to exercise families (per D15), not individual exercises — analysis models transfer across variations of the same movement pattern (e.g., barbell squat, front squat, goblet squat all share squat-family analysis).

**Video storage strategy:**

- Raw video is stored with encryption at rest.
- Analysis outputs (joint angles over time, measurements, summaries) are stored separately in structured form.
- User may opt to retain only the analysis data and discard raw video after analysis is complete, to manage storage and privacy.
- Video retention defaults are bounded — raw video is not retained indefinitely without user action.

**Scope for MVP:** None. Video capture and analysis are v2 or later.

**Rationale:** Form feedback is one of the highest-value capabilities in fitness tech but requires significant investment. Layering lets basic video features ship earlier than full AI analysis. Reasoner Duality (D19) ensures that measurements are deterministic and AI narration explains rather than decides.

### D24. Instructional exercise content — layered, with multiple sources

Instructional content (videos, images, text) attached to exercises in the library, sourced from three layers:

- **Coach-produced** — human-recorded demonstrations by coaches on the platform. Highest trust, branded, potentially monetizable (per future commerce decisions at the platform level).
- **Platform-curated** — professionally produced content by or licensed for the platform. Fallback when coach content isn't available.
- **AI-generated** — synthetic demonstrations (animated figure with synthesized voice-over, per D19) generated from exercise metadata (limb configuration, equipment, target muscles, movement pattern). Covers long-tail exercises with consistent baseline quality. Labeled clearly as AI-generated so users can calibrate trust.

Content is attached to exercises or exercise families (per D15). Each exercise may have multiple content items in different roles (primary demo, setup, common mistakes, progression, regression, cueing).

**Complement to D23:** Instructional content shows "how the exercise should be done"; form analysis (D23) evaluates "how the user performed it." Together these form a learning loop: learn, perform, receive feedback, refine.

**Scope for MVP:**

- Exercise library entries include a written text description of form and common mistakes.
- Optional external video link (e.g., YouTube) — no hosted video content.

**Scope for v2:**

- Hosted video content produced by coaches on the platform.
- Visibility controls (clients-only, all platform users, public) per content item.

**Scope for v3:**

- AI-generated demos for exercises lacking coach or platform content.
- Multiple content roles per exercise (demo + mistakes + progressions).
- Content personalization by user skill level.
- Clearly-labeled indication of AI-generated vs. human-produced source.

**Rationale:** Instructional content scales badly with human production alone. AI generation makes comprehensive library coverage feasible for the long tail. Layering sources lets high-value exercises have premium human content while every exercise has at least a baseline demo. MVP stays lightweight (text + external link) until content infrastructure is justified.

### D26. Language — TypeScript

**TypeScript** is the primary language for the Lifting Tracker implementation: Expo (React Native) app, Supabase Edge Functions, and any MCP servers the sub-system ships. The TC39 Type Annotations proposal (stage 1 as of 2026) is noted as the open-standards escape hatch — if TypeScript's ownership posture shifts adversely, the migration path is TC39-stripped-types-style erasable annotations, which preserves most of the structural commitment without the TypeScript toolchain dependency.

**Rationale:** Type safety across the Expo app / Edge Function / MCP-server boundary, strong AI-codegen fluency, and a compatible-by-design relationship with the Drizzle ORM choice in D8. See `reach4all://docs/research/lifting-tracker-stack-validation.md` for the analysis. Confirmed 2026-04-23.

### D27. Multi-agent interop protocol — first-class concern, specific protocol deferred

Multi-agent interoperability is an XRSize4 ALL cross-cutting concern, promoted from Phase 5 future work to a first-class architectural concern per the Gartner L5 AI-native software engineering maturity framework. The specific protocol choice (A2A, AAIF, custom MCP-over-MCP patterns) is deferred pending the `code-cm` skill buildout and the `reach4all` research repo standup. Current inter-agent communication uses `send_message` between agents plus MCP tool composition — adequate for MVP, not a long-term answer.

**Rationale:** Gartner's L4→L5 progression frames multi-agent orchestration as table stakes for the next generation of agentic systems. Deferring the protocol choice is appropriate — the decision needs evidence from actually running multi-agent workflows — but pretending it's a Phase 5 problem delays the infrastructure work that has to precede the protocol choice. See `docs/reference/gartner-ai-native-swe-review.md` for the promotion rationale.

## Cross-cutting architectural principles

Principles that inform multiple decisions but do not sit as single D-numbers. Each is cited to the analysis that backed it.

### MCP-first sub-system strategy

Every XRSize4 ALL sub-system ships an MCP server before further UI investment. Lifting Tracker's next sprint after the athlete MVP ships `lifting-tracker-mcp`, exposing tools like `query_sessions`, `log_session`, `get_coach_hierarchy`, `assign_program`, and the like. Coach and admin workflows are built as MCP compositions first; UI wraps the MCP once patterns stabilize.

**Rationale:** The integration center of gravity has moved to MCP. Workato's October 2025 Enterprise MCP launch (100+ prebuilt servers) is the clearest commercial signal; Anthropic owns the protocol; Cursor and Claude Code are built on MCP consumption. Platform value is in composition, not in any single UI. Building the MCP layer first forces interface discipline and unlocks agent-driven workflows before the UI is ready to expose them. See `docs/reference/workato-findings.md` and `docs/reference/claude-code-internals-findings.md`.

### Three-layer data architecture

Three layers, used together:

(a) **Transactional** — Supabase Postgres (self-hosted on Railway). Source of truth per D4.
(b) **Vector** — pgvector extension inside the same Postgres. No separate vector DB. Activated Sprint 2+ for semantic search, RAG, and natural-language workout parsing.
(c) **Semantic** — Apache Jena Fuseki as a separate service. Sprint 3+ or Phase 2. Ontology + RDF triples + OWL reasoning. XRSize4 ALL platform-level, shared across sub-systems — not Lifting Tracker-specific.

The mobile client accesses (a) and (b) via Supabase (direct REST / ElectricSQL-style sync, or through MCP). The client accesses (c) via a dedicated MCP server (`fuseki-mcp` or `lifting-tracker-semantic-mcp`), not directly.

**Rationale:** Keeping vectors co-located with the transactional store removes a second system from the MVP (pgvector is good enough). Fuseki earns its keep when ontology reasoning is the actual workload — premature before Sprint 3. Accessing Fuseki only through an MCP server keeps the mobile client's direct dependencies minimal. See `docs/reference/electricsql-assessment.md` and Concept Computing §16 Implementation Architecture for the Fuseki commitment.

### Hosting posture

All self-hosted services run as Docker containers on Railway: self-hosted Supabase, HyperDX OSS observability, any MCP servers, Apache Jena Fuseki when it lands, any Python agent scripts. Railway is the infrastructure provider; the applications themselves stay portable Docker images.

Projected monthly cost at MVP scale: ~$20–50. Migration path: any Docker-capable host (Hetzner, Fly, self-hosted Kubernetes) if Railway's pricing or terms shift adversely. The commitment is to Docker, not to Railway specifically.

**Rationale:** Railway's developer ergonomics and pricing beat hyperscaler equivalents at this scale, and the Docker-first posture keeps portability cheap. See `docs/reference/workato-findings.md` and `docs/reference/observability-backend-assessment.md`.

### Observability

Observability: HyperDX OSS (MIT license), self-hosted on Railway, ClickHouse backend, OpenTelemetry-native ingestion. First-party React Native SDK (`@hyperdx/otel-react-native`) covers the Expo client. Fallback: SigNoz (MIT core) if ClickHouse Inc. relicenses HyperDX adversely. Grafana stack considered and declined — AGPL 3.0 since 2021 fails the composite principle's permissive-license preference.

**Rationale:** OTel-native with a permissive license, first-party RN SDK, and ClickHouse-backed query performance at a cost that's acceptable for a pre-revenue MVP. See `docs/reference/observability-backend-assessment.md` for the full analysis.

## Non-decisions (flagged for later versions, not alpha)

These are deliberately deferred. Schema leaves room for them without building them. Platform-level capabilities (biometrics, payments, content publishing, social, proximity, full AI platform, wearable OS ecosystem) are discussed in `xrsize4all_concept_v0.2.0.md`; the entries below capture specifically what is deferred for the Lifting Tracker sub-system beyond what the decisions above have decided.

### Features deferred (Lifting Tracker-scoped)

- Widgets (home screen "today's volume")
- Shortcuts / Siri integration
- Export to CSV / PDF reports
- Teams concept (coaches grouped into teams with shared client visibility, permission-gated)
- Android build (Expo supports this from the same codebase; deferred until demand exists)
- Multiple Exercise Types in MVP UI (schema supports all; MVP UI exposes Weightlifting only)

### Data model concerns deferred

- **Formal ontology integration** — mapping exercises to external ontologies like PACO, EXMO, KHMO, FoodOn, CMO for cross-system semantic interoperability. Originally flagged in the 2026-04-15 version as "Concept Computing–inspired formal modeling of exercises, aliases, categories"; scope has since broadened to include these specific external ontology candidates. The ontological shape of the schema (D12) is built in from day one; formal external ontology bindings are deferred.
- Intra-set rest (micro-pauses between reps within a single set, typically 5–20 seconds)
- Asymmetric loading (different weight in each hand/leg on the same set — e.g., offset carries, uneven loaded lunges)

### Biometrics (platform concern, referenced here)

- Biometric data integration from wearables and health stores — HealthKit (iOS), Health Connect (Android), Garmin Connect, Whoop, Oura, Fitbit, Polar, Coros. Platform-level capability documented in `xrsize4all_concept_v0.2.0.md`. Deferred for the Lifting Tracker sub-system beyond MVP. When integrated, platform-health-store access (HealthKit first) is preferred over per-vendor direct integrations for simplicity and coverage. The `biometric_samples` table in the data model is a schema placeholder; population waits on the platform biometrics sub-system.

### Commerce (platform concern, referenced here)

- **Coach-to-client billing** — coaches charging their clients through the platform using Stripe Connect, Square for Platforms, or similar marketplace-capable processors. Introduces KYC/AML compliance, tax handling (1099s, VAT), and marketplace-specific data model (payment accounts, products, subscriptions, transactions). Platform-level concern per `xrsize4all_concept_v0.2.0.md`. Deferred beyond alpha. D9 (app monetization via subscription) is distinct and handled separately.
- In-person payment hardware — Square Terminal or similar POS integration for coaches running in-person sessions. Deferred indefinitely.
- Multi-currency and international tax handling — deferred until the platform expands beyond a single market.

### Content publishing (platform concern, referenced here)

- **Creator content economy** — coaches and influencers publishing public content (demo videos, form-check videos, motivational content, before/after imagery) to build audience and monetize directly from content. Requires media infrastructure (hosting, transcoding, CDN), rights management, creator payouts, and content moderation at scale. Platform-level concern per `xrsize4all_concept_v0.2.0.md`. Distinct from D24 instructional content (which attaches to exercises and is primarily educational). Deferred.

### Social and community (platform concern, referenced here)

- **Coach-client messaging** — private text messaging between a coach and their athletes. Extends coach-client relationships. Post-alpha, likely v3.
- **Private coaching groups** — coach-owned private group for clients to share progress and check in. Post-coach-features.
- **Public discussion communities** — topic-based open discussion. Requires moderation infrastructure. Post-creator features.
- **Public social feed and following** (influencer/follower model) — algorithmic discovery, likes/comments/shares on public posts; this encompasses the original non-decision "Social features (sharing progress publicly)" where athletes or coaches share their training publicly. Full social-network scope. Post-content-publishing.
- **Challenges and gamification** — leaderboards, streaks, badges, shared challenges. Meaningful only with a user base; deferred.
- **Direct messaging between unrelated users** — general DM capability with trust/safety infrastructure. Deferred.
- **Shared workout plans / programming templates marketplace** — a marketplace where coaches and creators can share or sell Routines and Programs (per D13) as reusable templates for other users. Distinct from creator content economy (which concerns media) and from coach-to-client billing (which concerns 1:1 services). Deferred.

### Proximity and discovery (platform concern, referenced here)

- **Proximity-based athlete discovery** — location-aware matching of opted-in users wanting to train together. Privacy, safety, moderation, verification, blocking/reporting, geospatial infrastructure (PostGIS) all in scope when built. Deferred well beyond alpha.
- **Venue-based affinity discovery** — safer precursor matching on "we train at the same gym" without real-time location. Considerably lower risk than real-time proximity. Could be considered earlier than full proximity discovery.

### Form analysis advanced forms (extending D23)

- Real-time form feedback during active sets — on-device vision processing with low-latency cues. Premature before async form review (D23 Layer 1/2) is validated.
- Automatic exercise recognition from video — detecting which exercise is being performed without user input. Lower priority than analysis of user-labeled exercises.
- Video-based rep counting — counting completed reps automatically from video. Nice-to-have; manual rep entry remains primary.

### Instructional content advanced forms (extending D24)

- AI-generated realistic human video — photorealistic video of a human figure performing exercises. Deferred — animated figure demonstrations are more accurate and lower-risk.
- Interactive 3D exercise models — user-controlled rotation, zoom, playback of a 3D model. Deferred beyond v3.
- Personalized form demonstrations — AI generates a demo adapted to user's anthropometrics, equipment, or physical limitations. Deferred.
- Multi-language instructional content with cultural adaptation — true localization beyond machine translation. Deferred until international expansion.

### Progress photos advanced forms (extending D22)

- Smart mirror / dedicated capture device integration — products like Naked Labs or dedicated body scanners. Deferred beyond AI analysis.
- 3D body reconstruction from multiple angles — advanced computer vision from multiple simultaneous images or video. Speculative; deferred.

These are noted so we don't architect them away. Alpha should leave room for them without building them.

## Data model

Refined from the 2026-04-15 sketch, incorporating D12–D24. Not final; owned by this doc once we commit. All parent-child relationships above Session are optional (nullable foreign keys). Tables flagged as platform-shared are conceptual placeholders in the Lifting Tracker schema; their authoritative definition lives at the platform level per `xrsize4all_concept_v0.2.0.md`.

```
users
  id, email, name, created_at,
  role (integer: 1=athlete, 2=coach, 3=gym, 4=super_admin),
  tier (text: 'free' default, future: 'pro', 'business', etc.)

coach_relationships
  coach_user_id, athlete_user_id, started_at, ended_at, status

exercise_programs
  id, name, description,
  created_by_user_id,
  assigned_to_user_id (nullable — null means template usable by others),
  is_template (boolean),
  goal, start_date, end_date (nullable — open-ended allowed),
  notes, created_at

exercise_types
  id, name (Weightlifting, Kung Fu, Running, Cycling, Yoga, etc.),
  description,
  set_schema_type (enum: reps_weight, time_rounds, distance_pace, duration_hold, etc.)

routines
  id, exercise_type_id, name, created_by_user_id, notes, created_at

routine_exercises
  id, routine_id, exercise_id, order_index,
  target_metrics_json (shape depends on exercise_type.set_schema_type)

classes
  id, name, exercise_type_id,
  instructor_name, venue_name, venue_address,
  recurring_schedule (e.g., "Mon/Wed/Fri 6pm"),
  duration_minutes, notes, created_at

program_components
  id, program_id,
  component_type (enum: 'routine' or 'class'),
  routine_id (nullable, set when component_type='routine'),
  class_id (nullable, set when component_type='class'),
  schedule_rule, order_within_week

exercise_families
  id, name (e.g., "Dumbbell Curl", "Bench Press"),
  primary_muscle, movement_pattern, notes

exercises
  id,
  family_id (nullable — groups variations),
  name, canonical_name,
  category (chest/back/legs/etc.),
  equipment (barbell/dumbbell/smith/machine/bodyweight/kettlebell/cable/other),
  upper_limb_config (enum: together, apart_simultaneous, apart_alternating, single, none),
  lower_limb_config (enum: together, apart_simultaneous, apart_alternating, single, none),
  created_by_user_id (NULL for seeded canonical), is_public

exercise_aliases
  exercise_id, alias, user_id (scoped to user or NULL for global)

sessions
  id, user_id,
  date, start_time (nullable), end_time (nullable),
  location, notes,
  default_rest_seconds (nullable — session-level rest default),
  exercise_type_id (nullable),
  program_id (nullable),
  routine_id (nullable),
  class_id (nullable),
  assigned_by_coach_id (nullable),
  assigned_session_id (nullable — legacy column from 2026-04-15 sketch,
    superseded by routine_id per D13; retained for backward compatibility
    during migration)

session_exercises
  id, session_id, exercise_id, order_index, notes,
  default_rest_seconds (nullable — exercise-level rest override for this session),
  routine_exercise_id (nullable — link back to planned exercise if session
    came from a routine)

sets
  id, session_exercise_id, order_index,
  weight_entered, reps,
  rest_seconds (nullable — falls through to exercise default, then session default),
  rpe (nullable),
  group_id (nullable integer — sets sharing group_id are performed back-to-back),
  side (nullable — 'left' / 'right' / null; used when limb_config = single),
  is_bad_form, is_forced_rep, notes

body_weights
  id, user_id, date, weight_lbs, location, notes

assigned_sessions   (coach's workout templates — legacy naming; see routines)
  id, coach_user_id, name, notes, created_at

assigned_session_exercises
  id, assigned_session_id, exercise_id, target_sets_json

-- D21 Goals --

goals
  id, user_id,
  category (enum: body_composition / strength / endurance / skill / habit /
    health / aesthetic / other),
  title, description,
  metric_type (enum: body_weight / body_fat_pct / 1rm / rep_max / time /
    distance / session_count / streak / custom),
  metric_unit (text — lbs, kg, seconds, minutes, miles, sessions, days, etc.),
  current_value (nullable — computed or user-entered),
  target_value,
  starting_value (nullable — snapshot when goal was set),
  starting_date,
  target_date (nullable — open-ended allowed),
  linked_exercise_id (nullable — for strength goals tied to a specific exercise),
  linked_exercise_family_id (nullable — for broader strength goals),
  status (enum: active / achieved / abandoned / paused),
  achieved_at (nullable),
  assigned_by_coach_id (nullable — populated when a coach sets the goal for a client),
  notes, created_at, updated_at

goal_milestones   (v2)
  id, goal_id, milestone_name, target_value, target_date (nullable),
  achieved_at (nullable), order_index

goal_progress_snapshots
  id, goal_id, recorded_at, value,
  source (enum: manual / auto / computed),
  session_id (nullable — if tied to a specific workout),
  body_weight_id (nullable — if tied to a body weight entry),
  notes

-- D22 Progress photos --

progress_photos
  id, user_id,
  taken_on (date), captured_at (timestamp),
  media_url (encrypted storage reference),
  thumbnail_url,
  pose_tag (nullable — front / side / back / custom),
  body_weight_id (nullable — link to a body weight entry on the same date),
  goal_id (nullable — link to a body composition or aesthetic goal),
  visibility (enum: private / shared_with_coach — default private),
  notes, created_at

progress_photo_shares   (v2)
  photo_id, shared_with_user_id, granted_at, revoked_at (nullable)

-- D23 Set videos (form capture) --

set_videos   (v2)
  id, set_id (link to the specific set performed),
  exercise_id, exercise_family_id,
  media_url (encrypted storage reference),
  duration_seconds, captured_at,
  retain_raw (boolean — user preference; when false, raw video is deleted
    after analysis),
  created_at

set_video_analyses   (v3)
  id, set_video_id,
  analysis_json (joint angles over time, ROM, tempo, symmetry — Tier 1
    measurements),
  tier2_narrative (text — LLM-generated feedback per D19),
  confidence_indicators_json,
  analyzed_at, analysis_model_version

set_video_annotations   (v2 — coach async review)
  id, set_video_id, author_user_id (coach),
  timestamp_seconds, annotation_text, created_at

-- D24 Instructional content --

exercise_content
  id,
  exercise_id (nullable — may attach at family level instead),
  exercise_family_id (nullable),
  content_role (enum: primary_demo / setup / common_mistakes / progression /
    regression / variation / cueing),
  media_type (enum: video / image / text / audio / external_link),
  media_url (nullable — null for text-only content),
  external_url (nullable — for MVP "link to YouTube" pattern),
  text_body (nullable — for written descriptions),
  source (enum: coach_produced / platform_curated / ai_generated),
  creator_user_id (nullable — populated for coach_produced),
  language (text — locale code),
  is_primary (boolean — default content shown for this exercise/role),
  visibility (enum: private / clients_only / public),
  difficulty_level (enum: beginner / intermediate / advanced),
  duration_seconds (nullable — for video/audio),
  created_at

-- D19 AI interactions --

ai_interactions
  id, user_id,
  interaction_type (enum: nl_workout_parse / session_summary /
    alias_suggestion / anomaly_flag / coach_summary_v2 /
    program_generation_v2 / etc.),
  prompt_text, response_text,
  referenced_session_ids (array — what data was used),
  referenced_entity_ids_json (arbitrary structured references),
  tier1_facts_json (nullable — deterministic findings fed to Tier 2),
  model_identifier, tokens_used, cost_usd,
  created_at, user_rating (nullable — thumbs up/down feedback),
  user_feedback_text (nullable)

ai_generated_content   (supports D24 ai_generated content items and
  NL-drafted writes)
  id, creator_user_id (user who triggered generation — typically the
    athlete or coach),
  content_type (enum: exercise_demo / program_draft / workout_draft /
    summary / insight / message_draft),
  content_json (structured output awaiting review),
  source_prompt_text,
  tier1_facts_referenced_json,
  tier2_model_identifier,
  reviewed_status (enum: draft / accepted / edited / rejected),
  reviewed_at (nullable),
  created_at

-- Biometrics placeholder (platform-shared) --

biometric_samples   (platform-shared; placeholder in Lifting Tracker schema)
  id, user_id,
  metric_type (enum: heart_rate / hrv / sleep_duration / sleep_stage /
    steps / calories_active / vo2_max / spo2 / body_temp / etc.),
  value (numeric), value_unit (text),
  sample_start_at, sample_end_at (for interval metrics),
  source_device (text — Apple Watch / Garmin / Whoop / Oura /
    HealthKit-aggregated / etc.),
  source_metadata_json,
  created_at
  -- Population of this table depends on the platform biometrics sub-system
  -- per xrsize4all_concept_v0.2.0.md; deferred beyond Lifting Tracker MVP.
```

**Note on assigned_sessions vs routines:** The original sketch (2026-04-15) introduced `assigned_sessions` for coach templates. D13 introduces `routines` as the formal concept. For MVP, `routines` is the canonical table; `assigned_sessions` may be retained as a legacy alias or migrated into `routines` at implementation time.

**Open gaps** (remaining for post-MVP decision):

- Teams table structure (deferred — the Teams concept remains in non-decisions but should not conflict with current schema).
- Gym entity modeling — is a gym a user with role=3, or a separate `gyms` table that users belong to? Affects whether gyms have their own login or are just an organizational grouping. Deferred; neither pattern is blocked by current schema.

**Resolved gaps** (from 2026-04-17 drive conversation):

- ✅ Rest notation — resolved as D16 (integer seconds, three-level defaulting, historical conversion on import)
- ✅ Paren grouping — resolved as D17 (group_id column on sets)
- ✅ Multi-weight notation — resolved as D18 (expand on import per distinct patterns)

## Change log

- 2026-04-14: Initial version. Captured D1–D6 and open questions O1–O5.
- 2026-04-15: Resolved O1–O5 as D7–D11. Added hierarchical RBAC model, MVP approach, platform decision (Expo + Supabase), business trajectory. Updated data model with role hierarchy and tier field. Added Teams and exercise ontology to non-decisions.
- 2026-04-17 (morning): Added D12–D18 from drive conversation. D12 established the ontological schema shape (nullable relationships, Session as atomic unit). D13 introduced the full hierarchy above Session (Exercise Program → Exercise Type → Routine/Class → Session). D14 and D15 resolved weight-per-implement and limb configuration as a property of the exercise, with five enum values and distinct exercise entries per variation. D16 resolved rest notation (O1) as integer seconds with session/exercise/set defaulting. D17 resolved paren grouping (O2) via a group_id column. D18 resolved multi-weight shorthand (O3) with explicit per-pattern import rules. Added tables: exercise_programs, exercise_types, routines, routine_exercises, classes, program_components, exercise_families. Expanded sessions, exercises, session_exercises, and sets columns. Reclassified the ontology non-decision: split into (a) ontological schema shape — now fundamental to MVP, lifted into decisions as D12; (b) formal ontology integration (PACO, EXMO, KHMO) — remains deferred. Added non-decisions: intra-set rest, asymmetric loading, multiple Exercise Types in MVP UI.
- 2026-04-17 (evening): Added D19–D24 from platform-expansion conversation. D19 established Reasoner Duality for AI/LLM features (Tier 1 deterministic + Tier 2 LLM with Authority Rule), with specific MVP scope for the Lifting Tracker: natural-language workout entry parsing, session summaries, fuzzy exercise matching, and anomaly flagging. D20 established watch and wearable apps as separate post-MVP targets outside the Expo codebase, with three priority features if built (haptic rest timer, quick set logging, next-exercise display). D21 established Goals as first-class entities with seven supported categories; MVP scope limited to strength and body weight goals. D22 established progress photo capability with privacy-by-default, encryption at rest, and strict sensitivity defaults to protect against body-image harm; MVP scope limited to private gallery and comparison (no AI). D23 established layered form analysis from video (Layer 1 storage + coach review in v2; Layer 2 pose estimation in v3; Layer 3 NL feedback via Reasoner Duality in v3-v4; Layer 4 real-time in v5+); form analysis attaches to exercise families per D15. D24 established three-source layered instructional content (coach-produced, platform-curated, AI-generated); MVP scope limited to text descriptions and external links. Added tables: goals, goal_milestones, goal_progress_snapshots, progress_photos, progress_photo_shares, set_videos, set_video_analyses, set_video_annotations, exercise_content, ai_interactions, ai_generated_content, and biometric_samples placeholder. Restructured non-decisions into categories: Features deferred, Data model concerns deferred, Biometrics (platform concern), Commerce (platform concern), Content publishing (platform concern), Social and community (platform concern), Proximity and discovery (platform concern), Form analysis advanced forms (extending D23), Instructional content advanced forms (extending D24), Progress photos advanced forms (extending D22). Restructured (but preserved) original non-decisions: "Apple Watch companion" now covered by D20; "Video demonstrations of exercises" now covered by D24; "Body composition photos" now covered by D22; "Apple Health / HealthKit integration" now covered by Biometrics platform concern; "In-app messaging between coach and client" now covered by Social and community platform concern; "Social features (sharing progress publicly)" now explicitly referenced within Public social feed entry; "Shared workout plans / programming templates marketplace" preserved as explicit entry under Social and community (distinguishing it from creator content economy and coach-to-client billing). Updated scope note to remove "not yet integrated" language. Added note to D8 referencing D20's departure from the single-codebase model. Added note to D9 distinguishing app monetization from coach-to-client billing (deferred).
- 2026-04-17 (late evening): Critical re-check pass. Restored original phrasings that had been dropped or altered in the evening revision: "Not final; owned by this doc once we commit." disclaimer on the data model section; full "Concept Computing–inspired formal modeling of exercises, aliases, categories" attribution on the Formal ontology integration non-decision (now quoted as the original 2026-04-15 framing); "Social features (sharing progress publicly)" now explicitly referenced within the Public social feed entry; "Shared workout plans / programming templates marketplace" added as its own explicit non-decision entry distinguishing it from creator content and coach-client billing; assigned_session_id restored as a nullable legacy column on sessions with an explanatory note about its supersession by routine_id; original "should not conflict with current schema" phrasing restored verbatim on the Teams gap entry.
- 2026-04-24 (Sprint 0b Day 1): Consolidated revision landing Sprint 0a findings. (1) D8 revised — offline-first stack finalized as `expo-sqlite` + Drizzle ORM + TanStack Query + custom Supabase sync adapter; WatermelonDB considered and declined; PowerSync Open Edition considered and deferred to Sprint 2+. (2) D19 augmented with a "Tier 2 concern log" subsection — monitoring surface for Authority Rule rubber-stamping signals, storage at `.cm/tier2-concerns.json`. (3) D26 added — TypeScript as primary language, TC39 Type Annotations as open-standards escape hatch. (4) D27 added — multi-agent interop protocol promoted from Phase 5 future to first-class architectural concern per Gartner L5 framework; specific protocol choice (A2A / AAIF / custom) deferred pending `code-cm` skill and `reach4all` repo. (5) New "Cross-cutting architectural principles" section added before Non-decisions, containing four principles: MCP-first sub-system strategy (each XRSize4 ALL sub-system ships an MCP server before further UI investment); Three-layer data architecture (transactional Supabase Postgres + pgvector + Apache Jena Fuseki, with mobile client reaching Fuseki only through a dedicated MCP server); Hosting posture (Docker containers on Railway, portable to any Docker-capable host); Observability (HyperDX OSS, self-hosted, ClickHouse-backed, OTel-native, SigNoz fallback, Grafana stack declined on AGPL grounds). Updated Non-decisions intro from "beyond what D1–D24 have decided" to "beyond what the decisions above have decided" so the phrasing stays durable as D-numbers grow. No content deleted; all Sprint 0a–era content preserved. Baseline snapshot at `docs/.baseline-pre-sprint-0b-20260424.md`. Parallel work (D25 ADR, `reach4all` repo, `document-cm` skill) tracked separately; this edit does not touch those.

---

© 2026 Eric Riutort. All rights reserved.
