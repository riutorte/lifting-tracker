---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-29
tier: ARCHITECTURE
content_class: architecture
version: 0.2.0
status: accepted
---

# AV-2 — Integrated Dictionary (Lifting Tracker sub-system)

## Purpose

Authoritative term registry for the **Lifting Tracker sub-system**. AV-2 is the place every other DoDAF view in `docs/dodaf/` (and every other Lifting Tracker doc) cites when a term needs a definition. The dictionary is **living** — every sprint that adds D-numbers, capabilities, activities, components, ports, services, data entities, standards, or other named concepts adds rows here.

## Abstraction-level scope

DoDAF views in the XRSize4 ALL portfolio are layered by abstraction: reference-architecture / platform (XRSize4 ALL system-of-systems) / sub-system (Lifting Tracker, future Running, Yoga, Martial Arts, etc.). Each level produces its own AV-2.

This file is the **Lifting Tracker sub-system AV-2**. It covers terms specific to weightlifting, coaching, biometrics, and the sub-system's local vocabulary. Platform-level vocabulary (the full XRSize4 ALL sub-system catalog, portfolio-wide governance terms not used by Lifting Tracker views, the 16-agent suite as a portfolio asset) lives at the platform-level AV-2 in the xrsize4all repo when that repo stands up (Sprint 0d2). Where a row exists in both files, the platform-level entry is canonical and this file's entry is a sub-system-scoped restatement.

Some portfolio-level terms appear here because Lifting Tracker views (OV-5c Sequence 4 — WF-003 GATE; SvcV-1's MCP layer; StdV-1's internal-standards section) actively reference them. Those rows are flagged "(portfolio scope; cited here for inclusion-completeness)" and migrate to the platform-level AV-2 when it stands up.

## Authoring rules applied

Per CONVENTIONS_v0.2.4 §11.3 (calibration over completeness), the following authoring rules were applied during the v0.2.0 enrichment pass:

- **Verb-object activities.** Every Activity-typed row states the action as verb-object (e.g., "Log Workout" not "Workout Logging"; "Track Progress" not "Progress Tracking"). Capability-typed rows retain noun-phrase epic names per the canonical CV-capabilities source.
- **No-and rule.** No term contains "and"; any "X and Y" was either renamed (e.g., "Coach and Athlete Relationship" → "Coach-Athlete Assignment") or split into separate rows.
- **Synonym-collapse.** Synonyms are collapsed to one canonical term per concept; the others appear as deprecated cross-reference rows with `→ canonical-term` notation. Examples: "Workout / Training Session / Session" → **Session**; "Rep / Repetition" → **Rep**.
- **Bracketed-context-tag.** Where a term carries multiple meanings across contexts, the row name disambiguates with a bracketed context tag (e.g., **Set [exercise-instance]** vs **Set [video]**; **Group [muscle]** vs **Group [user-defined exercise grouping]**; **Class [exercise]** vs **Class [content]**; **Tier [reasoner]** vs **Tier [document]**).

## Type column legend (CARP/CARPO subset of DoDAF DM2)

The **Type** column on every row uses the CARP/CARPO subset of the DoDAF Conceptual Data Model (DM2):

- **C** — Capability. What the system must be able to do (an ability, not an action).
- **A** — Activity. A verb-object action or process.
- **R** — Resource. An information artifact, material, or value type.
- **P** — Performer. An entity that performs an activity — actor, organization, or system component.
- **(Place)** and **(Organization)** are PO-subset extensions of P. Place is used where a row is location-typed (rare here — gyms, venues); Organization where a row names a formal grouping of performers (sub-systems, gyms, vendor entities). Where a row could plausibly be P/Place or P/Organization, the more specific tag is used and noted.

Where a row's type is genuinely ambiguous (e.g., a workflow that is both a Capability and an Activity decomposition, or a sub-system that is both an Organization and a Performer), the dominant type is in the Type column and the alternate is flagged in the Notes column.

## How to read the dictionary

Three lookup conventions:

- **By term.** Alphabetic within each section.
- **By identifier.** D-numbers (D1–D28), workflow IDs (WF-001–WF-006), risk IDs (R-CI-01, etc.), and US/feature/epic/theme IDs each have their own range.
- **By type.** Filter the Type column for C / A / R / P (or P/Place, P/Organization).

The columns are deliberately narrow. Long-form definitions live in the source documents the dictionary points to; the entry below is a one-line gloss plus the citation. When the gloss and the source disagree, the source wins and the dictionary entry is wrong (flag it).

---

## Section 1 — Architectural decisions (D1–D28)

D-rows are governance information artifacts (Type R). The decision's *subject* (what the decision is about) may be a Capability, Activity, Resource, or Performer; the decision's *form* is always a Resource.

| Term | Type | Definition | References | Notes |
|---|---|---|---|---|
| D1 — Primary purpose: log entry + analysis | R | Logging and progress analysis are equally first-class; "entering data without analysis is pointless." | architecture_v0.4.0.md §D1 | Renamed from "entry + analysis" — verb-object form: log entry. |
| D2 — Per-set granularity | R | Data model stores individual sets; all stats derived from sets, not pre-computed. | architecture_v0.4.0.md §D2 | Subject is Resource (Set). |
| D3 — Hierarchical RBAC, one app | R | Single role-aware app; Athlete → Coach → Gym → Super Admin via inheritance. | architecture_v0.4.0.md §D3 | |
| D4 — Cloud DB sole source of truth | R | Supabase Postgres is canonical; devices cache locally for offline. | architecture_v0.4.0.md §D4 | |
| D5 — Seeded extensible exercise library | R | Canonical seeded catalog; user-extensible with alias system. | architecture_v0.4.0.md §D5 | Renamed from "Seeded + extensible" to remove the conjunctive plus. |
| D6 — Real auth from day one | R | Magic-link email; no anonymous use. | architecture_v0.4.0.md §D6 | |
| D7 — Closed 4–6 user alpha | R | Invite-only, named users. No self-serve signup in alpha. | architecture_v0.4.0.md §D7 | |
| D8 — Expo with Supabase, offline-first | R | Single codebase iPhone + Web; offline-first via expo-sqlite + Drizzle + TanStack Query + custom Supabase sync adapter (Sprint 0a revision). | architecture_v0.4.0.md §D8 | Renamed from "Expo + Supabase" — `+` reads as 'and'. |
| D9 — Free in alpha, subscription later | R | No billing in alpha; `tier` field on users/orgs reserves room for it. | architecture_v0.4.0.md §D9 | |
| D10 — Ethan as Coach (inherits Athlete) | R | One account per person; Ethan logs his own training and manages clients. | architecture_v0.4.0.md §D10 | |
| D11 — Personal tool to business trajectory | R | Build to product quality; multi-tenant aware; neutral branding. | architecture_v0.4.0.md §D11 | Renamed from "Personal tool → business" (arrow OK; kept). |
| D12 — Schema is ontological, not taxonomic | R | Session is atomic; all parents (Program, Routine, Class, Type) are nullable FKs. | architecture_v0.4.0.md §D12 | |
| D13 — Training hierarchy above Session | R | Exercise Program → Exercise Type → Routine/Class → Session → Exercise → Set → Reps. | architecture_v0.4.0.md §D13 | |
| D14 — Per-implement weight, not total | R | User enters per-implement load; volume math derives total from limb config. | architecture_v0.4.0.md §D14 | |
| D15 — Limb Configuration is exercise property | R | `upper_limb_config` and `lower_limb_config` enums on every exercise; variations are distinct entries grouped by family. | architecture_v0.4.0.md §D15 | |
| D16 — Rest in integer seconds, three-level cascade | R | Session → exercise → set defaulting; null falls through. | architecture_v0.4.0.md §D16 | |
| D17 — Set grouping via group_id | R | Nullable integer on `sets`; same group_id = back-to-back (supersets, drop sets, cluster). | architecture_v0.4.0.md §D17 | |
| D18 — Multi-weight notation expands on import | R | WxR → 1 row, WxRxN → N rows, paren group → shared group_id, WxR(big) → one continuous set. | architecture_v0.4.0.md §D18 | |
| D19 — Reasoner Duality with Authority Rule | R | Tier 1 deterministic reasoner governs decisions; Tier 2 LLM explains and suggests; Tier 1 wins. | architecture_v0.4.0.md §D19 | Renamed from "Reasoner Duality + Authority Rule" — the 'and' implied composition; kept as one decision because the Authority Rule is integral to the duality, not a separate decision. |
| D20 — Watch and wearable apps are separate targets | R | Apple Watch / Wear OS / glasses outside the Expo single-codebase model. Three priority watch features named. | architecture_v0.4.0.md §D20 | The "watch and wearable" phrasing is in the source decision text and preserved here verbatim; the row is one decision, not two. Ambiguity flag: read this as "watch+wearable" target-class rather than two compositional concepts. |
| D21 — Goals are first-class entities | R | Seven categories supported in schema (body comp, strength, endurance, skill, habit, health, aesthetic). MVP scope: strength + body weight. | architecture_v0.4.0.md §D21 | |
| D22 — Progress photos: private by default, sensitivity-aware | R | Encrypted at rest, EXIF stripped, no gamification, neutral language. | architecture_v0.4.0.md §D22 | |
| D23 — Form analysis from video, layered | R | L1 storage + coach review (v2); L2 pose estimation (v3); L3 NL feedback via Reasoner Duality (v3-v4); L4 real-time (v5+). | architecture_v0.4.0.md §D23 | |
| D24 — Instructional content from three sources | R | Coach-produced, platform-curated, AI-generated. MVP: text + external link. | architecture_v0.4.0.md §D24 | |
| D25 — Source-document CM | R | Document configuration management discipline for the portfolio; full design in CM brief v0.3.0. | docs/adrs/D25-source-document-cm_v0.1.0.md | Portfolio scope; cited here because OV-5c Sequence 4 walks WF-003 GATE. |
| D26 — Language: TypeScript with TC39 escape hatch | R | TypeScript primary; TC39 Type Annotations is the open-standards migration path. | architecture_v0.4.0.md §D26 | |
| D27 — Multi-agent interop is first-class | R | Promoted from Phase 5 per Gartner L5; specific protocol (A2A / AAIF / custom) deferred. | architecture_v0.4.0.md §D27 | Portfolio scope; cited here because SvcV-1 MCP layer depends on it. |
| D28 — DoDAF with SysML iconography (fit-for-purpose) | R | DoDAF view set in Mermaid; SysML stereotypes; producer authority to add/subtract content per view. | (this directory; ADR pending) | Renamed from "DoDAF + SysML" — the '+' reads as 'and'. |

---

## Section 2 — Lifting Tracker domain concepts

The substantive vocabulary of the sub-system. Each row names a concept that the data model, the activities, and the user surfaces refer to.

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| Session [training-event] | R | Atomic unit of training: an athlete trains on a date at a location. Per D2 + D12. | DIV-2 (SESSIONS), OV-5c Seq 1, SV-6 §1, CV-capabilities (E2.1) | Canonical. **Synonyms collapsed:** "Workout" → Session; "Training Session" → Session. Bracket tag distinguishes the training-event from the Session API/GoTrue session record (which is separately auth-related). |
| Workout → Session | R | Deprecated synonym. Use **Session [training-event]**. | (vernacular usage) | Synonym collapse. |
| Training Session → Session | R | Deprecated synonym. Use **Session [training-event]**. | (vernacular usage) | Synonym collapse. |
| Exercise [movement] | R | Named movement template that an athlete performs (e.g., Barbell Back Squat — Together). Distinct variations of the same movement family with different limb configurations are distinct exercises. Per D5 + D15. | DIV-2 (EXERCISES), CV-capabilities (E2.2), SV-6 (sync rows) | Bracket tag distinguishes the movement-template from Exercise as an act/practice (vernacular). |
| Exercise Family | R | Grouping of related exercises that share movement pattern and primary muscle but differ on limb configuration or implement. Per D15. | DIV-2 (EXERCISE_FAMILIES) | |
| Exercise Type | R | Top-level training-modality grouping (Weightlifting, Kung Fu, Running, etc.) that anchors set-schema selection. | DIV-2 (EXERCISE_TYPES), D13 | |
| Exercise Alias | R | Alternate label for an Exercise; user-scoped or global. Supports D5 alias system. | DIV-2 (EXERCISE_ALIASES), D5 | |
| Set [exercise-instance] | R | A single performance of an exercise: weight, reps, optional rest, optional group_id, optional side. Per-set granularity per D2. | DIV-2 (SETS), OV-5c Seq 1 + Seq 3, SV-6 §1, CV-capabilities (E2.1) | Canonical. Bracket tag distinguishes the exercise-instance from Set [video] (the captured video of a Set), Set [collection] (mathematical), and HTTP Set-Cookie. |
| Set [video] | R | Video capture of a single Set performance. Anchors form-analysis pipeline per D23. | DIV-2 (SET_VIDEOS), SV-1 (set-video flow), SV-6 §3 + §10 | Bracket-disambiguated. |
| Rep | R | One repetition within a Set. Stored as integer count (`sets.reps`). | DIV-2 (SETS.reps), D13, D18 | **Synonym collapsed:** "Repetition" → Rep. |
| Repetition → Rep | R | Deprecated synonym. Use **Rep**. | (vernacular usage) | Synonym collapse. |
| Limb Configuration | R | Property of an Exercise specifying limb engagement: together, apart_simultaneous, apart_alternating, single, none. Per D15. Two columns on EXERCISES: `upper_limb_config` and `lower_limb_config`. | DIV-2 (EXERCISES), D15, OV-5c Seq 3 (Tier 1 validates) | Synonym: "limb config" (informal). |
| Volume [computed] | R | Derived training-load metric: per-implement weight × reps × per-Set effective-implement count, where the multiplier is determined by Limb Configuration. Per D14. Computed at analytics time, not stored. | DIV-2 notes (D14 corollary), CV-capabilities (E2.3) | Bracket tag distinguishes computed training Volume from any unrelated "volume" reading. |
| Implement | R | Physical object the athlete loads or wields: barbell, dumbbell, kettlebell, machine handle, bodyweight reference. The semantic referent of `weight_entered` per D14. | DIV-2 (EXERCISES.equipment), D14 | |
| Weight Entered [per-implement] | R | The numeric weight value the athlete logs, expressed per-implement (the load on one dumbbell, not the total). Per D14. | DIV-2 (SETS.weight_entered), D14 | |
| Weight Total → derived from Volume | R | Deprecated phrase. Use **Volume [computed]** when discussing total load. The sub-system never stores `weight_total`. | (vernacular usage) | Synonym collapse + ambiguity guard. |
| Group ID | R | Nullable integer on SETS; sets sharing the same group_id within an exercise are performed back-to-back (superset, drop set, cluster, rest-pause). Per D17. | DIV-2 (SETS.group_id), D17, OV-5c Seq 1 | Schema column name: `group_id`. |
| Group [muscle] | R | A muscle grouping (chest, back, legs, etc.). Used in vernacular and informal grouping but not a first-class table. | (vernacular; not a schema entity) | Bracket-disambiguated from Group ID. |
| Group [user-defined exercise grouping] → Group ID | R | Vernacular for the back-to-back set-grouping mechanism. Use **Group ID** for the schema-level term. | (vernacular usage) | Bracket-disambiguated; redirect. |
| Rest Cascade | R | Three-level rest_seconds defaulting algorithm: session.default_rest_seconds → session_exercises.default_rest_seconds → sets.rest_seconds; nulls fall through. Per D16. | DIV-2 (rest_seconds columns), D16, CV-capabilities (E2.1) | |
| Rest Period | R | The actual elapsed time between two consecutive Sets. Either logged explicitly (sets.rest_seconds) or defaulted via Rest Cascade. | DIV-2 (SETS.rest_seconds), D16 | |
| RPE | R | Rate of Perceived Exertion, 1–10 scale. Optional per-Set field (`sets.rpe`). | DIV-2 (SETS.rpe) | |
| Side | R | Left/right designation for unilateral Sets; populated when Limb Configuration is `single`. | DIV-2 (SETS.side), D15 | |
| Goal | R | First-class entity: an athlete-owned objective with category, metric, target value, target date, optional linked exercise. Per D21. Seven categories in schema; MVP exposes strength + body weight. | DIV-2 (GOALS), D21, CV-capabilities (E5.1, E5.2, E5.3) | |
| Goal Milestone | R | A staged checkpoint within a Goal: target value, target date, achieved-at timestamp. | DIV-2 (GOAL_MILESTONES), D21 | |
| Goal Progress Snapshot | R | A timestamped value record contributing to a Goal: manual entry, auto-derived from a Session, or computed. | DIV-2 (GOAL_PROGRESS_SNAPSHOTS), D21 | |
| Body Weight | R | A timestamped weight measurement of the athlete; first-class because it underlies multiple goal categories. | DIV-2 (BODY_WEIGHTS), CV-capabilities (E2.1, E5.1) | |
| Progress Photo | R | A timestamped, optionally goal-linked photograph of the athlete's body composition. Encrypted at rest, EXIF stripped, private by default. Per D22. | DIV-2 (PROGRESS_PHOTOS), D22, CV-capabilities (E5.4) | |
| Progress Photo Share | R | Time-bounded grant of a Progress Photo to a Coach. Revocable. | DIV-2 (PROGRESS_PHOTO_SHARES), D22 | |
| Routine | R | Reusable ordered sequence of exercises with target metrics; assigned to athletes by coaches. Per D13. | DIV-2 (ROUTINES, ROUTINE_EXERCISES), CV-capabilities (E4.2) | |
| Class [exercise] | R | A scheduled instructional session at a venue led by an instructor. Distinct from Class [content]. | DIV-2 (CLASSES), CV-capabilities (E4.2) | Bracket-disambiguated. |
| Class [content] → Content Class | R | Deprecated synonym for the governance content class. Use **Content Class**. | CONVENTIONS_v0.2.4 §2 | Synonym collapse + bracket disambiguation. |
| Program | R | Multi-week training plan composing Routines and Classes per a schedule. Per D13. | DIV-2 (EXERCISE_PROGRAMS, PROGRAM_COMPONENTS), CV-capabilities (E4.2) | |
| Program Component | R | An entry in a Program's schedule that points at a Routine or a Class. | DIV-2 (PROGRAM_COMPONENTS), D13 | |
| Coach-Athlete Assignment | R | Trust relationship binding a Coach to an Athlete; coach may push routines/programs and review progress. Per D3 + D10. | DIV-2 (COACH_RELATIONSHIPS), D3, D10, OV-5c Seq 2 | Renamed from "Coach and Athlete Relationship" (no-and rule); also formalizes the link as an assignment per the schema name. |
| Routine Assignment | R | Coach action persisted as a row that targets an Athlete with a Routine; optionally parameterized (weeks, day-of-week, weight progression). | OV-5c Seq 2 | Modeled in OV-5c Seq 2; routine_assignments table is in the assigned_sessions/routines transition (D13 corollary). |
| Authority Rule | R | Governance principle: Tier 2 LLM cannot override Tier 1 deterministic findings on consequential decisions; user confirmation required for any AI write to athlete data. Per D19. | architecture_v0.4.0.md §D19, OV-5c Seq 3, SvcV-1 (Edge Functions) | |
| Reasoner Duality | R | Two-tier AI architecture: Tier 1 deterministic governs decisions; Tier 2 LLM explains and suggests. Per D19. | architecture_v0.4.0.md §D19, OV-5c Seq 3 | |
| Reasoner Tier 1 | P | Deterministic reasoner component: runs structured rules over Postgres facts (recent sessions, exercise catalog, plausibility checks per D14/D15) and emits VALID / REJECT verdicts on AI candidates. Per D19. | OV-5c Seq 3, SvcV-1 (Edge Functions composition) | **Synonyms collapsed:** "Tier 1" / "deterministic reasoner" → Reasoner Tier 1. |
| Reasoner Tier 2 | P | LLM-based reasoner component: takes Tier 1 facts pack and user input, produces a typed candidate (e.g., WorkoutEpisode), is gated by Tier 1 validation and the Authority Rule. Per D19. | OV-5c Seq 3, SvcV-1 (Claude API row) | **Synonyms collapsed:** "Tier 2" / "Tier 2 LLM" / "Frontier LLM" → Reasoner Tier 2. The vendor LLM (Claude API, OpenAI Chat Completions) is the *upstream*; Reasoner Tier 2 is the role this component plays. |
| Tier 2 Concern Log | R | Append-only monitoring surface (`.cm/tier2-concerns.json` for governance side; `ai_interactions` enrichment for app side) detecting Authority Rule rubber-stamping signals. Not a gate. Per D19. | architecture_v0.4.0.md §D19, OV-5c Seq 3 | |
| Workout Episode | R | Typed JSON shape returned by Reasoner Tier 2 when parsing NL workout input: candidate sets, exercise references, parsed semantics. Confidence-scored, gated by Tier 1, persisted as draft. | OV-5c Seq 3, DIV-2 (AI_INTERACTIONS.output_episode), SV-6 §4 | One of several `output_episode_type` values (Workout / Summary / Feedback). |
| AI Interaction | R | Audit row written by Edge Functions before any AI response returns to the client; carries `input_raw`, `output_episode`, `reasoning_trace`, `tier1_facts_json`, model identifier, tokens, cost. The mechanical anchor of the Authority Rule. | DIV-2 (AI_INTERACTIONS), SV-6 §4, OV-5c Seq 3 | Hybrid schema per source-doc-cm-design §4.9 + §6.8. |
| AI-Generated Content | R | Persisted output produced by Reasoner Tier 2 and queued for user review (draft / accepted / edited / rejected). Per D24. | DIV-2 (AI_GENERATED_CONTENT), D24, SV-6 §3 + §4 | |
| Magic-Link Auth | R | Supabase email-based passwordless authentication. MVP entrypoint. Per D6. | SV-6 §2, OV-1, SvcV-1 (SupabaseAuth), StdV-1 §2 | **Synonyms collapsed:** "magic-link" / "magic-link email" / "Magic-link auth" → Magic-Link Auth. |
| JWT [auth-token] | R | JSON Web Token (RFC 7519) issued by SupabaseAuth for the access + refresh pair; carried in `Authorization: Bearer` headers on every PostgREST call; stored in iOS Keychain via Expo SecureStore. | SV-6 §2, StdV-1 §1, OV-1 | |
| RLS | R | Row-Level Security: Postgres feature enforcing per-row access predicates server-side, the load-bearing authorization mechanism for D3 RBAC and D22 privacy. | SV-1, SV-6 (every row), DIV-2 notes, OV-5c Seq 2 | |
| PostgREST | R | Auto-generated REST API over Postgres bundled with Supabase. The wire format the mobile client uses for non-realtime data. | SV-1 (PostgrestRESTPort), SV-6 §1, StdV-1 §2, OV-5c Seq 1 | |
| Outbox | R | Local-store table holding pending mutations that the SyncAdapter pushes to Postgres when connectivity returns. Outbox pattern per D8 (Sprint 0a revision). | OV-5c Seq 1, SV-1 (SyncAdapter), SV-6 §1 | |
| Last-Write-Wins | R | Conflict-resolution rule for the offline-first sync path: when local and remote rows collide on a primary key, the latest `updated_at` wins. MVP-scoped; revisit when multi-actor write contention emerges (Sprint 2+). | OV-5c Seq 1, SV-1, SV-6 §1 | Acceptable in alpha because each row has a single owning actor; multi-actor writes (coach-edits-athlete) require revisit. |
| Optimistic Update | R | TanStackQuery pattern: write applies to local state immediately; rollback on server rejection. The mechanism that hides sync latency. | OV-5c Seq 1, SV-1, SV-6 §1 | |
| WAL | R | Postgres Write-Ahead Log; the source of SupabaseRealtime's broadcast stream. | SV-1, SV-6 §1, OV-5c Seq 1 + Seq 2 | |
| ASR [Apple on-device] | P | Apple Speech framework providing on-device automatic speech recognition. The voice-input front-end of OV-5c Sequence 3. | OV-5c Seq 3, SvcV-1 (External services), SV-1 (AppleServices) | Vendor-required; Android target uses Android SpeechRecognizer at parity. Bracket-disambiguated because "ASR" is also used in some general-AI contexts. |
| Dead-Letter Queue | R | `outbox.dead_letter` table that holds rows the server rejected with 4xx (RLS denial, schema mismatch). Manual reconciliation surface. | OV-5c Seq 1 (failure-paths note), SV-6 §1 | |
| Biometric Sample | R | A single physiological measurement (heart rate, HRV, sleep, steps, calories, VO2max, etc.) with source-device attribution. Schema reserved per D12; population is platform Biometrics sub-system concern, deferred. | DIV-2 (BIOMETRIC_SAMPLES), SV-6 §9 | |
| Set Video Annotation | R | Coach-authored timestamped comment on a Set Video. | DIV-2 (SET_VIDEO_ANNOTATIONS), SV-6 §3 | |
| Set Video Analysis | R | Form-analysis output for a Set Video: joint angles, ROM, tempo, symmetry (Tier 1) plus optional LLM-narrated feedback (Tier 2 narration, never diagnosis). Per D23. | DIV-2 (SET_VIDEO_ANALYSES), D23, SV-6 §10 | |
| Exercise Content | R | Instructional asset attached to an Exercise or Exercise Family: video / image / text / audio / external link. Source-tagged per D24 (coach_produced / platform_curated / ai_generated). | DIV-2 (EXERCISE_CONTENT), D24 | |

---

## Section 3 — Capabilities (CV-capabilities)

CV-capabilities decomposes the sub-system into 8 themes / 31 epics / 109 features. AV-2 captures themes and the MVP-relevant epics (Type C). Feature-level identifiers (F-numbers) live in `themes-epics-features_v0.2.0.md`.

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| T1 — Platform Foundation | C | Identity, access, deployment, infrastructure that every other theme depends on. Anchors: D3, D4, D6, D7, D8, D9, D11. | CV-capabilities §Theme detail, AV-1 | |
| T2 — Core Athlete Experience | C | Logging, viewing, analysis, and history import. The MVP heart. Anchors: D1, D2, D4, D5, D12, D14, D15, D16, D17, D18. | CV-capabilities §Theme detail | Renamed from "Log, view, analyze, import" — re-stated as a capability noun phrase rather than a list. |
| T3 — Coaching Platform | C | Manage clients, assign work, review progress. Targets v2. Anchors: D3, D10, D11. | CV-capabilities §Theme detail | |
| T4 — Training Structure | C | Programs, Routines, Classes, Exercise Types — the structural layer above Session. Anchors: D12, D13. | CV-capabilities §Theme detail | |
| T5 — Goals with Progress Tracking | C | Goals first-class entities; visual progress; AI-assisted goal work. Anchors: D21, D22, D19. | CV-capabilities §Theme detail | Renamed from "Goals and Progress" (no-and rule). |
| T6 — Form with Content | C | Instructional content paired with form analysis: the learning loop. Anchors: D23, D24, D15. | CV-capabilities §Theme detail | Renamed from "Form and Content" (no-and rule). |
| T7 — Intelligence | C | AI/LLM via Reasoner Duality across all themes. Anchor: D19. | CV-capabilities §Theme detail | |
| T8 — Extended Platforms | C | Wearables, glasses, voice, Android. Anchor: D20. | CV-capabilities §Theme detail | |
| E1.1 — Authenticate User | C | Authentication and identity capability: magic-link sign-in, persistent session, secure token storage. | CV-capabilities §MVP slice | Renamed from "Authentication and Identity" (no-and rule); split intent: identity-management (E1.2) is separately scoped. |
| E1.2 — Apply Role-Based Access | C | RBAC and hierarchy enforcement: Athlete → Coach → Gym → Super Admin. Renamed from "Role-Based Access and Hierarchy" (no-and rule). | CV-capabilities §Theme | |
| E1.3 — Cross-Platform Access | C | Single codebase iPhone (TestFlight) + Web (Vercel). | CV-capabilities §MVP slice | |
| E1.4 — Reliability, Performance, Security | C | Cross-cutting NFRs: load, sync durability, encryption, RLS. | CV-capabilities §Theme | Comma list — not "and"; OK as is. |
| E1.5 — Data Portability | C | Athlete-owned export and audit trail. Renamed from "Data Portability and Governance" (no-and rule); governance concerns rolled into E1.4. | CV-capabilities §Theme | |
| E2.1 — Log Workout | C | Per-set logging, offline-first, with grouping and rest cascade. Renamed from "Workout Logging" (verb-object). | CV-capabilities §MVP slice, OV-5c Seq 1 | |
| E2.2 — Manage Exercise Library | C | Seeded canonical exercises plus user-extensible custom exercises with aliases and Limb Configuration. Renamed from "Exercise Library" (verb-object form for capability action). | CV-capabilities §MVP slice | |
| E2.3 — Track Progress | C | Computed analytics from per-set data; trends, PRs, charts. Renamed from "Progress and Analytics" — split: this row is the tracking capability; analytics computation is its enabling activity. | CV-capabilities §MVP slice | |
| E2.4 — Import Workout History | C | One-shot ingestion from `data/combined_workout_log.txt` (legacy log) and CSV import paths. Renamed from "Data Import" (verb-object + scoped to workout history). | CV-capabilities §MVP slice, SV-6 §3 | |
| E3.1 — Manage Clients | C | Coach surface for adding, listing, archiving athlete relationships. Renamed from "Client Management" (verb-object). | CV-capabilities §Theme | v2 phase. |
| E3.2 — Assign Workout | C | Coach pushes a Routine or Program to an Athlete. Renamed from "Workout Assignment" (verb-object). | CV-capabilities §Theme, OV-5c Seq 2 | v2 phase. |
| E3.3 — Coach as Athlete | C | Coach inherits Athlete capabilities (logs own training while managing clients). Per D10. | CV-capabilities §Theme | |
| E4.1 — Support Unstructured Sessions | C | Athlete logs a Session without a parent Program / Routine / Class — D12 ontological-schema corollary. Renamed from "Unstructured Session Support" (verb-object). | CV-capabilities §MVP slice | |
| E4.2 — Manage Programs, Routines, Classes | C | Templates layer above Session. Comma list, no 'and'. | CV-capabilities §Theme | |
| E5.1 — Establish Goals | C | Goal creation, status, milestones, snapshots foundation. Renamed from "Goals Foundation" (verb-object). | CV-capabilities §MVP slice, D21 | |
| E5.4 — Capture Progress Photos | C | Encrypted, EXIF-stripped photo capture and storage with private-by-default visibility. Renamed from "Progress Photos Foundation" (verb-object). | CV-capabilities §MVP slice, D22 | |
| E6.1 — Provide Instructional Content | C | Foundation: text + external link per D24 MVP. Renamed from "Instructional Content Foundation" (verb-object). | CV-capabilities §MVP slice, D24 | |
| E6.4 — Capture Set Video | C | Form-analysis L1: video capture and storage. Renamed from "Form — Capture and Review" — split into E6.4 Capture and a Coach-Review activity (Activity row in §4). | CV-capabilities §Theme, D23 | v2 phase. |
| E6.5 — Measure Form | C | Form-analysis L2: pose estimation and Tier-1 measurements. Renamed from "Form — Measurements and Feedback" — split: this row is measurement; Tier-2 narration ("Provide Form Feedback") is a separate activity. | CV-capabilities §Theme, D23 | v3 phase. |
| E6.6 — Real-Time Form Coaching | C | Form-analysis L4: live feedback during set. | CV-capabilities §Theme, D23 | v5+ phase. |
| E7.1 — Parse NL Workout | C | NL-to-typed-episode parsing (E7.1a); session summary generation (E7.1b). Renamed from "NL Workout Entry and Summaries" — split: parse-input activity vs summary-generation activity (no-and rule). | CV-capabilities §MVP slice, OV-5c Seq 3 | |
| E7.2 — Coach with AI Assistance | C | AI-assisted client insight, message drafts, anomaly flags for the coach surface. Renamed from "AI-Assisted Coaching" (preposition phrasing for capability). | CV-capabilities §Theme, D19 | v2 phase. |
| E8.1 — Apple Watch Surface | C | Watch-app capability. Per D20. | CV-capabilities §Theme | |
| E8.2 — Smart Glasses Voice Surface | C | Glasses-and-voice device surface. Renamed from "Smart Glasses and Voice Devices" — single capability scoped at glasses/voice device class. Per D20. | CV-capabilities §Theme | |
| E8.3 — Android Surface | C | Android target including Wear OS. Renamed from "Android and Wear OS" — single capability "Android Surface" with Wear OS as a sub-target. Per D20. | CV-capabilities §Theme | |

---

## Section 4 — Activities (verb-object)

Activities the sub-system performs. Sourced from OV-5c sequences, SV-6 exchanges, and the workflows in Section 6. All Type A. Phrased as verb-object per the authoring rule.

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| Log Workout | A | Athlete records sets while training, online or offline. The spine activity of OV-5c Sequence 1. | OV-5c Seq 1, CV-capabilities (E2.1), SV-6 §1 | |
| Record Set | A | Persist a single Set: weight, reps, optional rest, optional group_id, optional side. Per D2. | OV-5c Seq 1, DIV-2 (SETS), SV-6 §1 | |
| Apply Rest Cascade | A | Resolve effective `rest_seconds` for a Set by walking session → exercise → set defaults. Per D16. | DIV-2 notes, D16 | Application-layer logic. |
| Group Sets | A | Mark two or more Sets within an Exercise as back-to-back via shared group_id. Per D17. | OV-5c Seq 1, D17 | |
| Sync Outbox | A | SyncAdapter pushes pending mutations from local Outbox to SupabasePostgres when connectivity returns. Per D8. | OV-5c Seq 1, SV-6 §1 | |
| Resolve Sync Conflict | A | Apply Last-Write-Wins on row collision; route 4xx rejections to Dead-Letter Queue. | OV-5c Seq 1, SV-6 §1 | |
| Authenticate User | A | Issue Magic-Link Auth, exchange one-time token for JWT, persist to SecureStore. Per D6. | OV-5c (referenced), SV-6 §2 | |
| Refresh JWT | A | Exchange refresh token for new access token via GoTrue. | SV-6 §2 | |
| Assign Routine | A | Coach selects an Athlete and pushes a Routine; row written to routine_assignments; SupabaseRealtime broadcasts. Per D10 + D12. | OV-5c Seq 2, CV-capabilities (E3.2) | |
| Acknowledge Assignment | A | Athlete views and starts a Session from the assigned Routine. | OV-5c Seq 2 | |
| Parse NL Workout | A | Edge Function builds Tier-1 facts pack, prompts Reasoner Tier 2, validates the candidate WorkoutEpisode through Reasoner Tier 1, writes ai_interactions audit, returns DRAFT to UI. Per D19 + US-070. | OV-5c Seq 3, SV-6 §4 | |
| Validate AI Candidate | A | Reasoner Tier 1 runs deterministic plausibility checks (D14 weight unit, D15 limb config, history-relative weight range, set/rep counts) against an AI candidate; emits VALID or REJECT(reasons). | OV-5c Seq 3 | |
| Confirm AI Draft | A | Athlete approves a DRAFT WorkoutEpisode; rows insert into SETS; ai_interactions.reviewed_status updates; Authority Rule mechanically satisfied. | OV-5c Seq 3, D19 | |
| Reject AI Draft | A | Athlete dismisses a DRAFT; ai_interactions.reviewed_status='rejected'; no SETS inserted. | OV-5c Seq 3 | |
| Edit AI Draft | A | Athlete modifies a DRAFT before confirming; ai_interactions.reviewed_status='accepted_edited' with edit_distance recorded for Tier 2 Concern Log. | OV-5c Seq 3 | |
| Generate Session Summary | A | Edge Function summarizes a completed Session via Reasoner Tier 2; persisted as AI-Generated Content. Per US-071. | SV-6 §4, CV-capabilities (E7.1) | |
| Capture Progress Photo | A | Athlete photographs body composition; client strips EXIF; upload to SupabaseStorage encrypted at rest. Per D22. | SV-6 §3, CV-capabilities (E5.4) | |
| Share Progress Photo | A | Athlete grants time-bounded view access of a Progress Photo to a Coach. | DIV-2 (PROGRESS_PHOTO_SHARES), D22 | |
| Capture Set Video | A | Athlete records video during a Set; uploaded to SupabaseStorage. Per D23 L1. | SV-6 §3 + §10, D23 | v2. |
| Annotate Set Video | A | Coach adds timestamped comments to a Set Video. | DIV-2 (SET_VIDEO_ANNOTATIONS), D23 | v2. |
| Measure Form | A | Pose-estimation pipeline emits joint angles, ROM, tempo, symmetry to SET_VIDEO_ANALYSES. Per D23 L2. | SV-6 §10, D23 | v3. |
| Provide Form Feedback | A | Reasoner Tier 2 narrates Tier-1 measurements; Authority Rule limits to narration, not diagnosis. Per D23 L3. | SV-6 §10, D23 | v3. |
| Compute Analytics | A | Aggregate per-Set data into trends, PRs, charts; derive Volume from Limb Configuration at query time. Per D2 + D14. | CV-capabilities (E2.3), D2, D14 | |
| Track Progress | A | Surface analytics outputs to the Athlete: charts, PR notifications, goal-progress nudges. | CV-capabilities (E2.3), D21 | The capability E2.3 has this activity as its primary expression. |
| Import Workout History | A | One-shot ingestion: upload `combined_workout_log.txt` to SupabaseStorage; Edge Function parses per D18 expansion rules; INSERTs SESSIONS / SESSION_EXERCISES / SETS; writes ai_interactions for parser run. | SV-6 §3 + §4, CV-capabilities (E2.4), D18 | |
| Establish Goal | A | Athlete creates a Goal with category, metric, target value, target date. Per D21. | CV-capabilities (E5.1), D21 | |
| Record Goal Progress Snapshot | A | Append a value to a Goal's progression — manual, auto from a Session, or computed. | DIV-2 (GOAL_PROGRESS_SNAPSHOTS), D21 | |
| Subscribe to Realtime Channel | A | Mobile client subscribes via WSS to SupabaseRealtime for row-level change events on RLS-filtered tables. | OV-5c Seq 1 + Seq 2, SV-1 | |
| Emit OTel Span | A | Any component records an OpenTelemetry trace span (UI interaction, sync event, LLM call). | SV-6 §5, SV-1 (HyperDX), StdV-1 §1 | |
| Approve Document Change | A | Eric (Super Admin) inspects a proposed architecture-class doc edit and approves or rejects via WF-003 GATE. Per D25. | OV-5c Seq 4, source-doc-cm-design §5.5 | Portfolio scope; cited because OV-5c Seq 4 walks it. |
| Verify Post-Mutation | A | Book Boss re-reads the just-written file and diffs against baseline + proposal to detect drift. Per source-doc-cm §5.7 Defense 4. | OV-5c Seq 4 | Portfolio scope. |
| Record Append-Only Ledger Entry | A | Scorekeeper appends a record to `.cm/scorekeeper.jsonl` with prev_hash chain. | OV-5c Seq 4, source-doc-cm §6.7 | Portfolio scope. |

---

## Section 5 — Sub-systems (Lifting Tracker scope; portfolio context flagged)

Lifting Tracker is one sub-system in the XRSize4 ALL portfolio. The full XRSize4 ALL sub-system catalog is platform-level vocabulary and migrates to the platform-level AV-2 when the xrsize4all repo stands up. Rows here cover (a) Lifting Tracker itself, (b) sibling sub-systems Lifting Tracker views actively reference, and (c) reserved sub-systems mentioned in OV-1 / SvcV-1 as deferred. Type P/Organization for sub-systems (they are organizational performers).

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| Lifting Tracker | P/Organization | This sub-system. Coach-client weightlifting / strength-training / bodybuilding application. Alpha in Sprint 0b. | All Lifting Tracker views; AV-1 | |
| XRSize4 ALL Portfolio | P/Organization | The umbrella system-of-systems containing Lifting Tracker and all sibling sub-systems. | AV-1, OV-1 | Portfolio scope; canonical entry lives in the platform-level AV-2 (xrsize4all repo, Sprint 0d2). |
| Reach4All | P/Organization | Portfolio-level research repository (landscape scans, vendor analyses, finding reports). Native-tools-only. | AV-1, OV-1, SvcV-1 (reach4all-research-mcp) | Portfolio scope; cited because SvcV-1 reserves the reach4all-research-mcp service. |
| Concept Computing | P/Organization | Architectural framework providing the four-tier doc hierarchy and 16-agent suite. | AV-1, OV-1 | Portfolio scope. |
| Biometrics Sub-System | P/Organization | Platform-level sub-system handling wearable-and-health-store biometric ingestion. Schema placeholder exists in Lifting Tracker (`biometric_samples`); population is this sub-system's responsibility. | SV-6 §9, OV-1 (deferred) | Portfolio scope; deferred. |
| Future Training Sub-Systems | P/Organization | Running, Martial Arts, Yoga, Cycling, Swimming, Climbing, Group Fitness. Reserved in OV-1; not in scope today. | OV-1 | Portfolio scope; deferred. |

---

## Section 6 — Workflows (WF-001 through WF-006)

Workflows are named multi-step activities with governance posture. Each workflow as a whole is a Capability (C) at the meta-level; its steps are Activities (A). Listed here at the workflow (capability-shaped) level; step decomposition lives in source-doc-cm-design.md §5.1.

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| WF-001 — Start Session | A | Load context, report state. Concept form: Python exec chain gated by Starter. Target: auto-loaded CLAUDE.md + `cm status` skill invocation. | source-doc-cm-design.md §5.1 | Portfolio scope. Renamed from "Session Start" to verb-object. |
| WF-002 — End Session | A | Save report, persist context, stop. Target: Stop hook + `cm report` skill. | source-doc-cm-design.md §5.1 | Portfolio scope. Renamed from "Session End" to verb-object. |
| WF-003 — Update Document | A | Nine-step doc update with Step-4 GATE. Pattern: chain-with-gate + embedded evaluator-optimizer-verify. Target: `cm update <doc>` skill + pre-commit hook + GitHub Action. | source-doc-cm-design.md §5.1 + §5.5, OV-5c Seq 4 | Portfolio scope. Renamed from "Document Update" to verb-object. |
| WF-003L — Update Document (Light) | A | ~5-step lightweight WF-003 variant for Research-class docs. GATE optional per finding; required for landscape syntheses. | source-doc-cm-design.md §3.7.3 | Portfolio scope. Renamed from "Light Document Update". |
| WF-004 — Reconcile Documents | A | Compare N docs, produce workbook, log gaps. Target: `cm reconcile` skill dispatching to Book Boss `reconcile.py`. | source-doc-cm-design.md §5.1 | Portfolio scope. Renamed from "Reconciliation" to verb-object. |
| WF-005 — Create Document | A | Draft → review → register. Target: `cm new <tier> <id>` skill scaffolds from template + adds manifest entry. | source-doc-cm-design.md §5.1 | Portfolio scope. Renamed from "New Document" to verb-object. |
| WF-006 — Create Skill | A | Design → skeleton → namespace → register. Target: `cm new-skill <id>` over Anthropic skill-creator + manifest entry. | source-doc-cm-design.md §5.1 | Portfolio scope. Renamed from "New Agent / New Skill" — contained 'and / slash list'; collapsed to the dominant target (skill). |

---

## Section 7 — Concept agents (16-agent suite)

All 16 agents are operational and authoritative as of v0.3.0 amendments (2026-04-23). The disposition column shows the candidate target form pending empirical equivalence evidence per the trust-but-verify posture (§6.0a). All Type P (each agent is a performer). Portfolio scope; cited here because OV-5c Sequence 4 walks Book Boss / Format Controller / Notekeeper / Scorekeeper / Historian / Reporter explicitly.

| Term | Type | Class (agent role) | Candidate disposition | References |
|---|---|---|---|---|
| Primer | P | Super Agent | Drop (CLAUDE.md auto-load replaces) | source-doc-cm-design.md §6.0a |
| Starter | P | Meta/Gov (Delegator) | Drop (Claude Code session lifecycle) | source-doc-cm-design.md §6.0a |
| Book Boss | P | Doc Mgmt | Stay as skill script (`book_boss.py`) | source-doc-cm-design.md §6.1, OV-5c Seq 4 |
| Doc Librarian | P | Doc Mgmt | Replace with `.cm/manifest.yaml` + `cm status` | source-doc-cm-design.md §6.0a |
| Notekeeper | P | Meta/Gov (Delegator) | Stay or migrate to GitHub Issues (Q3) | source-doc-cm-design.md §5.6, OV-5c Seq 4 |
| Scorekeeper | P | Meta/Gov | Stay as skill script; append-only `.cm/scorekeeper.json` | source-doc-cm-design.md §6.7, OV-5c Seq 4 |
| Historian | P | Meta/Gov | Replace with `cm history <doc>` over `git log --tags` | source-doc-cm-design.md §5.6, OV-5c Seq 4 |
| Agent Registrar | P | Meta/Gov | Drop (SKILL.md auto-discovery) | source-doc-cm-design.md §5.6 |
| Courier | P | Utility/Export | Drop (git push / releases / tar) | source-doc-cm-design.md §5.6 |
| Timekeeper | P | Meta/Obs | Drop (session report header) | source-doc-cm-design.md §5.6 |
| Reporter | P | Meta/Obs | Stay as skill script; Stop-hook invoked | source-doc-cm-design.md §6.1, OV-5c Seq 4 |
| Agent Architect | P | Meta/Gov | Drop (Anthropic SKILL.md is the open standard) | source-doc-cm-design.md §5.6 |
| Version Coordinator | P | Meta/Gov | Drop (git + semver + tag discipline) | source-doc-cm-design.md §5.6 |
| Instruction Verifier | P | Meta/Gov | Drop (CLAUDE.md is always loaded) | source-doc-cm-design.md §5.6 |
| Context Persistence | P | Meta/Gov | Replace with Claude memory + session reports | source-doc-cm-design.md §5.6 |
| Format Controller | P | Meta/Gov | Replace with pre-commit + PostToolUse hook + CI | source-doc-cm-design.md §5.6, OV-5c Seq 4 |

---

## Section 8 — Roles (XRSize4 ALL participants)

Human-actor and AI-agent roles. Type P. Athlete is the foundational role; every other role inherits or relates to it.

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| Athlete | P | Any individual who trains. Foundational role; every other role inherits from or relates to it. The base D3 RBAC role. | AV-1, OV-1, OV-5c, all Lifting Tracker views | |
| Coach | P | Provides guidance, assigns programming, reviews performance. Trust relationship with one or more Athletes. Per D3 + D10. | AV-1, OV-1, OV-5c Seq 2, CV-capabilities (T3) | **Synonym collapsed:** "Coach / Instructor" → split. **Coach** is the role with a trust-relationship to a specific Athlete; **Class Instructor** is a separate role for venue-based group sessions. |
| Class Instructor | P | Leads group Class [exercise] sessions at fixed venues. Many-to-one relationship; session-based. | xrsize4all_concept_v0.2.0.md, DIV-2 (CLASSES.instructor_name) | Split from "Coach / Instructor" per no-and rule (slash treated as 'and'). |
| Client | P | Athlete in a paid relationship with a Coach. | xrsize4all_concept_v0.2.0.md, CV-capabilities (E3.1) | |
| Training Partner | P | Athlete who trains alongside another. No commercial relationship. | xrsize4all_concept_v0.2.0.md | |
| Gym Owner | P/Organization | Organization or individual operating a training facility. Per D3 RBAC tier. | AV-1, OV-1, D3 | Renamed from "Gym / Gym Owner" — slash is 'and'; the role is the owner; the gym itself is its Place. |
| Gym | P/Place | Training facility (a Place) where Sessions occur. | DIV-2 (SESSIONS.location), OV-1 | Place-typed; a venue. |
| Gym Member | P | Athlete affiliated with a specific Gym. | xrsize4all_concept_v0.2.0.md | |
| Content Creator | P | Produces instructional, motivational, or commercial content. | xrsize4all_concept_v0.2.0.md | **Synonym collapsed:** "Content Creator / Influencer" → Content Creator (Influencer is a sub-role distinguished by reach, not by capability). |
| Community Moderator | P | Maintains norms and safety of social spaces. | xrsize4all_concept_v0.2.0.md | Portfolio scope; deferred social-features role. |
| Super Admin | P | Platform operator. Full visibility, full control. The top of the D3 RBAC hierarchy. Currently: Eric. | AV-1, OV-1, OV-5c Seq 4, D3 | |
| AI Agent | P | First-class system participant under D19 Authority Rule. Includes Reasoner Tier 1, Reasoner Tier 2, and the Concept-agent suite. | AV-1, OV-1, OV-5c Seq 3 + Seq 4, D19 + D27 | |

---

## Section 9 — Components and ports (SV-1)

Software components and the SysML ports they expose or require. Components are Type P (system performers); ports are Type R (interface descriptors).

### 9a — Components

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| MobileClient | P | Expo client running on iOS (TestFlight) and Web (Vercel). The single user-facing surface in MVP. Per D8. | SV-1, OV-1, OV-5c (every sequence), SV-6 (most rows) | |
| LocalStore | P | expo-sqlite + Drizzle ORM running inside MobileClient. The on-device durable cache. Per D8 Sprint 0a revision. | SV-1, OV-5c Seq 1, SV-6 §1 | |
| TanStackQuery | P | Server-state cache with optimistic updates and background refetch, running inside MobileClient. | SV-1, OV-5c Seq 1, SV-6 §1, StdV-1 §2 | |
| SyncAdapter | P | Custom Supabase sync adapter (BYO sync layer); single-user-per-device, Last-Write-Wins. Per D8 Sprint 0a revision. | SV-1, OV-5c Seq 1, SV-6 §1 | |
| SupabasePostgres | P | Self-hosted Supabase Postgres on Railway. The canonical source of truth per D4. With pgvector co-located (Sprint 2+) and RLS policies. | SV-1, OV-1, SvcV-1, SV-6 §1–§4, DIV-2 (every table) | |
| SupabaseAuth | P | GoTrue: magic-link MVP, OAuth (Apple / Google) post-MVP. | SV-1, SvcV-1, SV-6 §2 | |
| SupabaseStorage | P | S3-compatible REST endpoint with signed URLs; encrypted media at rest per D22. | SV-1, SvcV-1, SV-6 §3 | |
| SupabaseRealtime | P | Phoenix Channels over WSS; broadcasts Postgres WAL changes to subscribed clients. | SV-1, SvcV-1, OV-5c Seq 1 + Seq 2 | |
| EdgeFunctions | P | Supabase Edge Functions (Deno runtime) hosting AI orchestration, Tier 2 LLM proxying per D19, and import-parse endpoints. The single egress to Reasoner Tier 2. | SV-1, SvcV-1, SV-6 §3 + §4, OV-5c Seq 3 | |
| HyperDX | P | HyperDX OSS observability backend (ClickHouse-backed, OTel-native) self-hosted on Railway. | SV-1, SvcV-1, SV-6 §5, StdV-1 §2 | |
| Railway | P/Organization | Container hosting platform. Runs every self-hosted service. The portfolio's commitment is to Docker, not to Railway. | SV-1, SvcV-1 (envelope), OV-1 | |
| document-cm MCP server | P | First MCP server in the portfolio; governs source documents. Dual CLI + MCP adapter over shared `lib/`. | SV-1, SvcV-1, OV-5c Seq 4 | Portfolio scope. |
| lifting-tracker-mcp | P | Planned MCP server exposing `query_sessions`, `log_session`, `get_coach_hierarchy`, `assign_program`. Ships post athlete-MVP per MCP-first principle. | SV-1, SvcV-1, OV-1, SV-6 §6 | |
| fuseki-mcp | P | Planned MCP server proxying SPARQL 1.1 to Apache Jena Fuseki. Sprint 3+. | SV-1, SvcV-1, SV-6 §6 | |
| Apache Jena Fuseki | P | SPARQL endpoint and OWL reasoner. Self-hosted on Railway (Sprint 3+ or Phase 2). Reachable only via fuseki-mcp. | SV-1, OV-1, SvcV-1 | |
| LLMAPI | P | Frontier LLM API (Anthropic Claude API or OpenAI Chat Completions). Reasoner Tier 2 upstream. Vendor-required. | SV-1, SvcV-1, SV-6 §4, StdV-1 §2 | **Synonym collapsed:** "Frontier LLM API" / "LLM API" / "Claude API (Anthropic)" → row LLMAPI. |
| AppleServices | P | Apple platform: TestFlight (distribution), Sign in with Apple (post-MVP), HealthKit (deferred), watchOS (separate target per D20). | SV-1, OV-1, SvcV-1, SV-6 §2 + §7 | Vendor-required. |
| ExternalVideo | P | YouTube and similar external video hosts. Per D24 MVP — instructional content via embed link. | SV-1, OV-1, SV-6 §8, D24 | |

### 9b — Ports / Interfaces

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| PostgrestRESTPort | R | PostgREST over HTTPS/JSON. Mobile client's primary read/write contract with SupabasePostgres. | SV-1, SV-6 §1, StdV-1 §2 | |
| PostgresWirePort | R | Postgres wire protocol on port 5432. Used by EdgeFunctions for facts queries; by lifting-tracker-mcp for domain queries. | SV-1, SV-6 §1 + §4 + §6 | |
| RealtimeWebSocketPort | R | WebSocket frames carrying SupabaseRealtime broadcasts. | SV-1, SV-6 §1, OV-5c Seq 1 + Seq 2 | |
| GoTrueRESTPort | R | HTTPS JSON for magic-link issuance and JWT exchange. | SV-1, SV-6 §2 | |
| StorageRESTPort | R | S3-compatible REST with multipart upload and signed-URL fetch. | SV-1, SV-6 §3 | |
| EdgeRESTPort | R | HTTPS JSON contracts on Edge Functions: `/ai/parse-workout`, `/ai/summary`, `/import/historic-log`, `/admin/*`. | SV-1, SV-6 §4 | |
| LLMUpstreamPort | R | Vendor-specific HTTPS JSON to LLMAPI (Anthropic Messages API or OpenAI Chat Completions). | SV-1, SV-6 §4, StdV-1 §2 | |
| OTLPHTTPPort | R | OpenTelemetry over HTTP/protobuf. Telemetry ingest path to HyperDX. | SV-1, SV-6 §5, StdV-1 §1 | |
| OTLPGRPCPort | R | OpenTelemetry over gRPC. Server-side telemetry ingest to HyperDX. | SV-1, SV-6 §5, StdV-1 §1 | |
| MCPStdioPort | R | MCP over stdio (JSON-RPC). The agent-facing contract for every MCP server. | SV-1, SvcV-1, SV-6 §6, StdV-1 §1 | |
| CLIShellPort | R | Shell argv + stdout invocation surface for document-cm `cli/cm.py`. Dual surface with MCPStdioPort. | SV-1, SvcV-1, SV-6 §6 | Portfolio scope. |
| SPARQLHTTPPort | R | SPARQL 1.1 over HTTP. Fuseki's contract; consumed only via fuseki-mcp. | SV-1, SV-6 §6, StdV-1 §1 | |
| AppStorePort | R | Apple submission API surface for TestFlight publication. | SV-1, SV-6 §7 | |
| HealthKitPort | R | iOS HealthKit framework surface (deferred to platform Biometrics sub-system). | SV-1, SV-6 §9 | |
| VideoEmbedPort | R | WebView / oEmbed surface for ExternalVideo content per D24. | SV-1, SV-6 §8 | |

---

## Section 10 — Services (SvcV-1)

Services that cross a contract boundary independently versioned and operable. Type P (each service is a performer with a published contract). The five service categories (Data, Identity, Observability, AI/Reasoning, Governance, Distribution) anchor the view.

| Term | Type | Category | Composite-principle status | Source views |
|---|---|---|---|---|
| filesystem-mcp | P | Governance | Pass | SvcV-1 |
| git-mcp | P | Governance | Pass | SvcV-1 |
| brave-search-mcp | P | Research | Mixed (vendor-keyed upstream) | SvcV-1 |
| firecrawl-mcp | P | Research | Mixed (vendor-keyed upstream) | SvcV-1 |
| supabase-mcp | P | Data / Admin | Pass | SvcV-1 |
| concept-agent-invoker-mcp | P | Agent interop | TBD (HOLD per D27) | SvcV-1 |
| reach4all-research-mcp | P | Research | Pass (planned) | SvcV-1 |
| xrsize4all-sub-system-registry-mcp | P | Governance | Pass (planned) | SvcV-1 |
| Apple App Store | P | Distribution | Vendor-required | SvcV-1, SV-6 §7 |
| Vercel | P | Distribution | Adopted (free-tier) | OV-1, SV-6 §7 |

(Lifting-Tracker-related services already have rows in §9: SupabasePostgres, SupabaseAuth, SupabaseStorage, SupabaseRealtime, EdgeFunctions, HyperDX, lifting-tracker-mcp, document-cm MCP server, fuseki-mcp, LLMAPI, Railway. Those rows carry the component/port detail; this table extends with services that are referenced in SvcV-1 but not modeled as Lifting Tracker components in §9.)

---

## Section 11 — Data entities (DIV-2)

Tables in the Lifting Tracker logical data model. Type R for every row (data entities are information resources). Listed alphabetically. Schema-completeness from day one per D12: every table exists in MVP even if no UI exposes it yet.

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| AI_GENERATED_CONTENT | R | Persisted Reasoner-Tier-2 outputs queued for user review (draft / accepted / edited / rejected). | DIV-2, SV-6 §3 + §4, D24 | |
| AI_INTERACTIONS | R | Audit row written by EdgeFunctions before any AI response returns. Hybrid schema per source-doc-cm §4.9. The mechanical anchor of the Authority Rule. | DIV-2, SV-6 §4, OV-5c Seq 3 | |
| ASSIGNED_SESSIONS | R | Legacy table superseded by ROUTINES per D13 transition; preserved during migration. | DIV-2 | |
| ASSIGNED_SESSION_EXERCISES | R | Legacy companion to ASSIGNED_SESSIONS; preserved during migration. | DIV-2 | |
| BIOMETRIC_SAMPLES | R | Reserved table for wearable / health-store ingestion. Population deferred to platform Biometrics sub-system. | DIV-2, SV-6 §9 | |
| BODY_WEIGHTS | R | Per-date athlete body weight measurements. | DIV-2, CV-capabilities (E5.1) | |
| CLASSES | R | Group fitness Class [exercise] templates with venue, instructor, schedule. | DIV-2, CV-capabilities (E4.2) | |
| COACH_RELATIONSHIPS | R | Coach-Athlete Assignment trust relationships. Per D3 + D10. | DIV-2, OV-5c Seq 2 | |
| EXERCISE_ALIASES | R | Alternate labels for an Exercise; user-scoped or global. Per D5. | DIV-2 | |
| EXERCISE_CONTENT | R | Instructional assets attached to an Exercise or Exercise Family per D24. | DIV-2, D24 | |
| EXERCISE_FAMILIES | R | Movement-family grouping of related Exercises distinguished by Limb Configuration / Implement. Per D15. | DIV-2 | |
| EXERCISE_PROGRAMS | R | Multi-week training plans composing Routines and Classes. Per D13. | DIV-2, CV-capabilities (E4.2) | |
| EXERCISE_TYPES | R | Top-level training-modality grouping anchoring set-schema selection. | DIV-2, D13 | |
| EXERCISES | R | Movement-template entries (canonical-seeded plus user-extended). Per D5 + D15. | DIV-2 | |
| GOAL_MILESTONES | R | Staged checkpoints within a Goal. | DIV-2, D21 | |
| GOAL_PROGRESS_SNAPSHOTS | R | Timestamped value records contributing to a Goal. | DIV-2, D21 | |
| GOALS | R | First-class athlete-owned objectives with category, metric, target. Per D21. | DIV-2, D21 | |
| PROGRAM_COMPONENTS | R | Schedule entries within an Exercise Program pointing at Routines or Classes. | DIV-2, D13 | |
| PROGRESS_PHOTOS | R | Encrypted progress photographs with goal-link, body-weight-link, visibility. Per D22. | DIV-2, D22 | |
| PROGRESS_PHOTO_SHARES | R | Time-bounded grants of a Progress Photo to a Coach. Per D22. | DIV-2 | |
| ROUTINES | R | Reusable ordered exercise sequences. Per D13. | DIV-2 | |
| ROUTINE_EXERCISES | R | Per-Routine ordered exercise entries with target metrics. | DIV-2 | |
| SESSION_EXERCISES | R | Per-Session ordered exercise entries; carries default rest and routine_exercise back-link. | DIV-2 | |
| SESSIONS | R | Atomic training events. Per D2 + D12. All parents (Program, Routine, Class, Type) are nullable FKs. | DIV-2 | |
| SET_VIDEO_ANALYSES | R | Form-analysis output (Tier-1 measurements + Tier-2 narration) for a Set Video. Per D23. | DIV-2, SV-6 §10 | |
| SET_VIDEO_ANNOTATIONS | R | Coach-authored timestamped comments on a Set Video. | DIV-2 | |
| SET_VIDEOS | R | Captured video for a Set Video [video] (form analysis foundation). Per D23. | DIV-2, SV-6 §3 + §10 | |
| SETS | R | Per-Set rows: weight_entered, reps, optional rest/group_id/side/RPE/flags. Per D2 + D14 + D17. | DIV-2 | |
| USERS | R | Identity record: email, name, role, tier. Per D3 + D9. | DIV-2 | |

---

## Section 12 — Standards index (cross-reference into StdV-1)

The full standards profile lives in `StdV-1-standards_v0.1.0.md`. AV-2 indexes the standards Lifting Tracker views actively reference, so a reader can resolve "what is X" without leaving the dictionary. Type R for every row (standards are information artifacts). Sectioned to mirror StdV-1.

| Term | Type | Definition | Source views | Notes |
|---|---|---|---|---|
| MCP 1.0 — Model Context Protocol | R | Anthropic-published, JSON-RPC over stdio/HTTP, agent tool-and-resource exchange protocol. Required across all sub-system MCP servers. | StdV-1 §1, SvcV-1, SV-6 §6 | |
| PostgreSQL | R | Relational database wire protocol and SQL dialect. Required for SupabasePostgres. | StdV-1 §1, SV-1, DIV-2 | |
| SQLite | R | Embedded relational database; the LocalStore format. Required per D8. | StdV-1 §1, SV-1 | |
| OpenTelemetry | R | CNCF telemetry data model and transport (traces, metrics, logs). Required across all components emitting telemetry. | StdV-1 §1, SV-1, SV-6 §5 | |
| OpenTelemetry GenAI semantic conventions | R | LLM-call instrumentation conventions; spans for Tier-2 calls follow this shape. | StdV-1 §1, OV-5c Seq 3, SV-6 §4 | |
| OAuth 2.0 + OpenID Connect 1.0 | R | Auth flows for third-party identity providers. Adopted post-MVP. | StdV-1 §1, SV-6 §2 | Composite term retained because OAuth 2.0 + OIDC is a single authoritative bundle in practice; not split. |
| JWT (RFC 7519) | R | Session token format. Required for SupabaseAuth issuance and PostgREST authorization. | StdV-1 §1, SV-6 §2 | |
| TLS 1.3 (RFC 8446) | R | Transport encryption. Required on every network exchange. | StdV-1 §1, SV-6 (every row) | |
| JSON-RPC 2.0 | R | RPC envelope used by MCP. Required for every MCP server. | StdV-1 §1, SV-6 §6 | |
| JSON Schema (Draft 2020-12) | R | Tool-and-message schema validation. Adopted for MCP tool contracts and manifest schemas. | StdV-1 §1, SvcV-1 | Composite term retained. |
| YAML 1.2 | R | Frontmatter and manifest format. Required for all in-scope docs. | StdV-1 §1, CONVENTIONS_v0.2.4 §7 | |
| Markdown (CommonMark + GFM) | R | Document format. Required for all in-scope docs. | StdV-1 §1, CONVENTIONS_v0.2.4 §6 | |
| Mermaid | R | Diagram-as-code format. Required for all DoDAF view diagrams. | StdV-1 §1, every Lifting Tracker DoDAF view | |
| SysML 1.x notation | R | Stereotypes, cardinalities, navigability — applied within Mermaid's expressive limits. Adopted per D28. | StdV-1 §1, SV-1, DIV-2 | |
| DoDAF 2.02 viewpoints | R | Architecture-description framework. Adopted per D28. | StdV-1 §1, all DoDAF views in this directory | |
| SemVer 2.0.0 | R | Version numbering for documents and software. Required per CONVENTIONS §8. | StdV-1 §1 | |
| OWASP LLM Top 10 (2025) | R | Threat model for LLM-integrated applications. Required for EdgeFunctions and AI_INTERACTIONS design. | StdV-1 §1, OV-5c Seq 3 | |
| TypeScript | R | Programming language with structural typing. Required for Expo client, EdgeFunctions, document-cm adapters per D26. | StdV-1 §2, D26 | |
| TC39 Type Annotations (Stage 1) | R | Open-standards escape hatch from TypeScript per D26. | StdV-1 §2, D26 | |
| Apple App Store Review Guidelines | R | App-distribution policy; required for TestFlight + App Store. | StdV-1 §2, SV-6 §7 | |
| PostgREST conventions | R | Auto-generated REST API over Postgres bundled with Supabase. Required. | StdV-1 §2, SV-1, SV-6 §1 | |
| Phoenix Channels protocol | R | Real-time WebSocket channel framing for SupabaseRealtime. Adopted. | StdV-1 §2, SV-6 §1 | |
| Drizzle ORM | R | TypeScript-first SQL DSL for LocalStore queries. Required per D8. | StdV-1 §2, SV-1 | |
| TanStack Query | R | Server-state caching pattern. Required per D8. | StdV-1 §2, SV-1 | |
| NativeWind | R | Tailwind utility classes on React Native. Required. | StdV-1 §2 | |
| Expo with EAS Build | R | React Native framework + cloud build. Required per D8. | StdV-1 §2, SV-1, SV-6 §7 | Renamed from "Expo + EAS Build" (no-and rule). |
| pgvector | R | Postgres extension for vector storage. Adopted; Sprint 2+ activation. | StdV-1 §2, SV-1, OV-1 | |
| Apache Jena Fuseki | R | SPARQL endpoint and OWL reasoning engine. Adopted; Sprint 3+ or Phase 2. | StdV-1 §2, SV-1, OV-1 | Performer-typed in §9; standards-listed here for the spec it implements. |
| HyperDX OSS | R | Observability backend (MIT). Adopted. | StdV-1 §2, SV-1 | |
| ClickHouse | R | Column-oriented OLAP storage backend for HyperDX. Adopted. | StdV-1 §2, SV-1 | |
| Docker (OCI image format) | R | Container packaging. Required per Hosting posture. | StdV-1 §2, SV-1 | |
| Anthropic Messages API schema | R | Tier-2 LLM request/response shape. Adopted. | StdV-1 §2, SV-6 §4 | |
| OpenAI Chat Completions API schema | R | Alternative Tier-2 LLM provider schema. Adopted. | StdV-1 §2, SV-6 §4 | |
| Anthropic Agent Skills format (SKILL.md) | R | Skill packaging open standard. Adopted. | StdV-1 §2 | |
| GitHub Actions | R | CI/CD substrate. Adopted; migration targets Forgejo / Gitea per R-TV-01. | StdV-1 §2, SV-6 §7 | |

(StdV-1 §3 internal standards — Reasoner Duality, Composite tool-selection principle, MCP-first sub-system strategy, Three-layer data architecture, Hosting posture, Observability stance, etc. — are catalogued under §13 Architectural principles in this dictionary; the rows there carry the same authority and avoid duplication.)

---

## Section 13 — Architectural principles

Internal architectural principles authored within the portfolio. Type R (governance information artifacts).

| Term | Type | Definition | References | Notes |
|---|---|---|---|---|
| Composite tool-selection principle | R | Filter tool/library adoption for MCP-able + self-hostable + not-SaaS + AI-native friction. | architecture_v0.4.0.md (Hosting posture); StdV-1 §3 | |
| MCP-first sub-system strategy | R | Every sub-system ships an MCP server before further UI investment. Lifting Tracker ships `lifting-tracker-mcp` after athlete MVP. | architecture_v0.4.0.md (cross-cutting principles); SvcV-1 | |
| Three-layer data architecture | R | Transactional (Supabase Postgres) + Vector (pgvector) + Semantic (Apache Jena Fuseki). Mobile reaches Fuseki only via MCP. | architecture_v0.4.0.md (cross-cutting principles); OV-1 | |
| Hosting posture | R | Docker containers on Railway. Commitment is to Docker, not Railway. | architecture_v0.4.0.md (cross-cutting principles); SvcV-1 | |
| Observability stance | R | HyperDX OSS, ClickHouse-backed, OTel-native. SigNoz fallback. Grafana stack declined on AGPL grounds. | architecture_v0.4.0.md (cross-cutting principles); StdV-1 §1 + §3 | |
| Reasoner Duality | R | Tier 1 deterministic governs decisions; Tier 2 LLM explains and suggests. Per D19. | architecture_v0.4.0.md §D19; OV-5c Seq 3 | Cross-listed in §2. |
| Authority Rule | R | LLM (Tier 2) cannot override deterministic (Tier 1) findings on consequential decisions. User confirmation required for any AI write to athlete data. Per D19. | architecture_v0.4.0.md §D19; OV-5c Seq 3 | Cross-listed in §2. |
| Tier 2 Concern Log | R | Monitoring surface detecting Authority Rule rubber-stamping signals. Not a gate. | architecture_v0.4.0.md §D19; StdV-1 §3 | Cross-listed in §2. |
| Four content-drop defenses | R | Fresh-Read Discipline; Post-Mutation Verify; 20K-Token Pre-Flight Cap on Write; Baseline Snapshots. Load-bearing for any session on files >1,500 lines. | source-doc-cm-design.md §5.7 | Portfolio scope. Comma list, not 'and'. |
| Trust-but-verify (16-agent posture) | R | All 16 Concept agents remain operational; Claude Code natives run in parallel as redundant observability; deprecation requires empirical evidence. | source-doc-cm-design.md §6.0a | Portfolio scope. |
| Brain-hands separation | R | Reasoning (LLM) and execution (skill scripts, hooks, CI) are decoupled. Interfaces outlast implementations. | source-doc-cm-design.md §1.4 | Portfolio scope. |
| Generator-evaluator separation | R | Writer cannot be the verifier. Book Boss verify (Step 7 of WF-003) implements this. | source-doc-cm-design.md §1.4 + §5.1 | Portfolio scope. |
| Composition discipline (CC-017) | R | Governance steps must be composed (skill calls a script that runs the check), not listed in prose. Prose erodes; composed tools do not. | source-doc-cm-design.md §1.4 + §5.4 | Portfolio scope. |
| Fit-for-purpose view authority (D28) | R | The producer of a DoDAF view has authority to add or subtract content based on what genuinely supports the decision the view exists to inform. | (D28 ADR pending); CONVENTIONS_v0.2.4 §11.3 | |

---

## Section 14 — Content classes (CONVENTIONS_v0.2.4 §2)

Type R — content-class designations are governance information artifacts.

| Term | Type | Definition | References | Notes |
|---|---|---|---|---|
| Content Class — Architecture | R | ADRs, architecture_v0.4.0.md, concept docs, ontology plans. WF-003 full. Semver. GATE required. No staleness. | CONVENTIONS_v0.2.4 §2 | |
| Content Class — Research | R | Finding reports, landscape scans, vendor analyses. WF-003L. Date-based version. GATE optional per finding, required for syntheses. Mandatory `stale_after:`. | CONVENTIONS_v0.2.4 §2 | |
| Content Class — Operational | R | Kanban, metrics, risks, dispatch-handoff, retros, roadmap. Direct-edit or WF-003L. `updated:` is the version. GATE optional. Sprint-boundary review. | CONVENTIONS_v0.2.4 §2 | |
| Content Class — Reference | R | CLAUDE.md, README.md, CONVENTIONS_v0.2.4.md, orchestration. WF-003 full (soft GATE if no downstream pins). Semver on structural revisions. | CONVENTIONS_v0.2.4 §2 | |
| Content Class — Code (deferred) | R | Source, tests, build scripts, IaC. Governance deferred to future code-cm discipline. | source-doc-cm-design.md §3.7 | |

---

## Section 15 — Document tiers

Type R — tier assignments are governance metadata.

| Term | Type | Definition | References | Notes |
|---|---|---|---|---|
| Tier — REFERENCE [document] | R | Foundational; describes *what things are* and the vocabulary other docs use. | source-doc-cm-design.md §3.2 | Bracket-disambiguated from Reasoner Tier 1/2. |
| Tier — COMPANION [document] | R | Deep-dive; describes *how things work* in a specific dimension. | source-doc-cm-design.md §3.2 | |
| Tier — MASTER [document] | R | Integration; the single doc a newcomer reads. Authority lives in the tier it integrates from. | source-doc-cm-design.md §3.2 | |
| Tier — OPERATIONAL [document] | R | Live; describes the *current state* of the system. Shortest half-life. | source-doc-cm-design.md §3.2 | |
| Tier — ARCHITECTURE [document] | R | Used in frontmatter for architecture-class artifacts. Orthogonal to content_class. | CONVENTIONS_v0.2.4 §7 | |

---

## Section 16 — Risk identifiers (sample; full register at `risks_v0.1.0.md`)

Type R — risks are information artifacts. Only the IDs cross-referenced from sibling DoDAF views are listed here; the full register is canonical.

| Term | Type | Definition | References |
|---|---|---|---|
| R-CI-01 | R | Content drops via micro_compact during document writes. High severity. Open. | risks_v0.1.0.md §3.1, OV-5c Seq 4 |
| R-CI-02 | R | 25K-token Read ceiling throws on large docs. Medium severity. Open. | risks_v0.1.0.md §3.1 |
| R-CI-04 | R | Self-reported verification is untrustworthy. High severity. Open. | risks_v0.1.0.md §3.1 |
| R-TV-01 | R | GitHub pay-to-play migration window closes. High severity. | risks_v0.1.0.md §3.2, StdV-1 §2 |
| R-TV-03 | R | HyperDX relicense risk. Tracked; SigNoz is named fallback. | risks_v0.1.0.md, StdV-1 §2 |
| R-TV-04 | R | `@hyperdx/otel-react-native` SDK abandonment risk; raw OTel fallback path documented. | risks_v0.1.0.md, SV-1 |
| R-TV-05 | R | Railway commercial-terms shift; Hetzner / Fly / self-hosted Kubernetes are migration targets. | risks_v0.1.0.md, SvcV-1 |
| R-TV-06 | R | ClickHouse relicense risk affecting HyperDX backend. | risks_v0.1.0.md, StdV-1 §2 |
| R-PT-04 | R | MCP version churn risk. Tracked. | risks_v0.1.0.md, StdV-1 §1 |
| R-GV-04 | R | CC-017 — governance step omission under content pressure. High severity. | risks_v0.1.0.md §3.4 |
| R-SD-01 | R | Tier 2 Concern Log not yet instrumented. High severity. | risks_v0.1.0.md §3.7, StdV-1 §3 |

(Full register: `docs/risks_v0.1.0.md`. Additional rows promoted into AV-2 as risks become cross-view-referenced.)

---

## Section 17 — User-story prefixes (catalog at `user-stories_v0.2.0.md`)

Type R. Only ID-range conventions are catalogued; individual story IDs are looked up in the canonical doc.

| Term | Type | Definition | References |
|---|---|---|---|
| US-0XX | R | Athlete-facing MVP stories. | user-stories_v0.2.0.md Phase 1 |
| US-1XX | R | Coach + training-structure + goals-expansion + form-capture stories (v2). | user-stories_v0.2.0.md Phase 2 |
| US-2XX | R | Admin / Gym / Teams stories (Future). | user-stories_v0.2.0.md (Future phases) |
| US-3XX | R | NFR-class stories: performance, security, privacy, sync, data portability. | user-stories_v0.2.0.md (Cross-cutting NFRs) |

---

## Section 18 — DoDAF views (this directory)

The sibling DoDAF views in `docs/dodaf/` for the Lifting Tracker sub-system. Type R — each view file is an information artifact.

| Term | Type | Purpose | Canonical location |
|---|---|---|---|
| AV-1 — Overview | R | Charter-level orientation: portfolio + sub-system + alpha scope. | AV-1-overview_v0.1.0.md |
| AV-2 — Integrated Dictionary | R | Term registry (this file). | AV-2-dictionary_v0.2.0.md |
| CV — Capability Viewpoint | R | Capability hierarchy: themes, epics, MVP slice, anchors. | CV-capabilities_v0.1.0.md |
| OV-1 — Concept Graphic | R | Single high-level operational picture: portfolio, sub-systems, infrastructure, externals, clients. | OV-1-concept-graphic_v0.1.0.md |
| OV-5c — Activity Sequence | R | Time-ordered behavior across four load-bearing sequences (log workout offline-online; assign routine; Reasoner Duality; WF-003 GATE). | OV-5c-activity-sequence_v0.1.0.md |
| SV-1 — Interfaces | R | Component diagram, component catalog, port catalog. | SV-1-interfaces_v0.1.0.md |
| SV-6 — Data Exchanges | R | Row-by-row data exchange catalog across component boundaries. | SV-6-data-exchanges_v0.1.0.md |
| SvcV-1 — Services Context | R | Service-shaped surface: providers, consumers, contracts, composite-principle status. | SvcV-1-services-context_v0.1.0.md |
| DIV-2 — Logical Data | R | Entity-relationship picture of the data model. | DIV-2-logical-data_v0.1.0.md |
| StdV-1 — Standards | R | Standards profile: external, vendor, internal, declined, watched. | StdV-1-standards_v0.1.0.md |

---

## Maintenance protocol

This dictionary is **append-mostly**. Operations:

1. **Add a row** when a new term lands or when an existing term that should have been here was missed.
2. **Bump CARP/CARPO Type** when a row's role changes (rare).
3. **Mark deprecated** synonyms with `→ canonical-term` cross-reference rather than deleting them; cross-references stay resolvable.
4. **Promote / demote** rows between sub-system AV-2 and platform AV-2 when scope shifts.

When a row's definition contradicts its source document, the source wins and the row is wrong — open a sprint task to reconcile. The dictionary is convenience, not authority.

## Cross-references

**Architectural decisions referenced:** D1–D28 (full list).

**User stories referenced:** prefix-level only (US-0XX, US-1XX, US-2XX, US-3XX); individual story IDs catalogued in `user-stories_v0.2.0.md`.

**Other DoDAF views referenced (this directory):** AV-1, CV-capabilities, OV-1, OV-5c, SV-1, SV-6, SvcV-1, DIV-2, StdV-1.

**Cross-cutting governance references:** CONVENTIONS_v0.2.4.md §2 (content classes), §6 (markdown standard), §7 (frontmatter), §8 (semver), §10 (baseline-snapshot discipline), §11 (DoDAF view set, fit-for-purpose, SysML iconography). ADR D28 (DoDAF + SysML iconography). source-doc-cm-design.md §1.4 + §3.2 + §3.7 + §4.9 + §5.1 + §5.5 + §5.7 + §6.0a + §6.1 + §6.6 + §6.7 + §6.8 (portfolio governance terms cited in this dictionary).

**Sprint of last revision:** Sprint 0c1 CC8 (2026-04-29). Inclusion-completeness pass against all 9 sibling DoDAF views; CARP/CARPO type column added per row; four authoring rules applied; domain concepts promoted to standalone rows. Structural revision per CONVENTIONS §8 Architecture-class semver.

## Change log

| Version | Date | Summary |
|---|---|---|
| 0.1.0 | 2026-04-24 | Initial population. Twelve sections covering D-decisions, sub-systems, workflows, agents, content classes, principles, tiers, roles, infrastructure, risks, themes, story prefixes. |
| 0.2.0 | 2026-04-29 | Sprint 0c1 CC8 deliverable. Inclusion-completeness pass against all 9 sibling DoDAF views (AV-1, CV-capabilities, OV-1, OV-5c, SV-1, SV-6, SvcV-1, DIV-2, StdV-1). CARP/CARPO type column added per row. Four authoring rules applied (verb-object activities, no-and, synonym-collapse, bracketed-context-tag). Domain concepts added as standalone rows: Session, Exercise, Set, Limb Configuration, Volume, Rest Cascade, Goal, Progress Photo, Group ID, Implement, Reasoner Tier 1, Reasoner Tier 2 (and surfaced concepts: Workout Episode, AI Interaction, Magic-Link Auth, JWT, RLS, PostgREST, Outbox, Last-Write-Wins, Optimistic Update, WAL, ASR, Dead-Letter Queue, Body Weight, Routine, Class [exercise], Program, Coach-Athlete Assignment, Routine Assignment, Authority Rule, Reasoner Duality, AI-Generated Content, RPE, Side, Rep, Goal Milestone, Goal Progress Snapshot, Set Video, Set Video Annotation, Set Video Analysis, Exercise Family, Exercise Type, Exercise Alias, Exercise Content, Biometric Sample, Program Component, Weight Entered, Implement). Reframed scope as LIFTING TRACKER sub-system (vs portfolio-level XRSize4 ALL); platform-scope rows flagged. Tier corrected from OPERATIONAL to ARCHITECTURE; status promoted from draft to accepted. New sections: §2 Domain concepts, §3 Capabilities, §4 Activities, §9 Components and ports, §10 Services, §11 Data entities, §12 Standards index, §18 DoDAF views. Structural revision per CONVENTIONS §8 Architecture-class semver. Baseline of v0.1.0 captured at `.baseline-AV-2-v0.1.0-20260429.md`. |

---

© 2026 Eric Riutort. All rights reserved.
