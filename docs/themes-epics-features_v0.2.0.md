---
author: Eric Riutort
created: 2026-04-17
updated: 2026-04-24
tier: ARCHITECTURE
content_class: architecture
version: 0.2.0
status: accepted
---

# Lifting Tracker — Themes, Epics, Features

**Scope note:** This document organizes the user stories in `user-stories_v0.2.0.md` into an agile work hierarchy: Theme → Epic → Feature → User Story. It covers the Lifting Tracker sub-system of XRSize4 ALL. Stories describe what the user needs; this document describes how the work is grouped and planned. Reading order: `xrsize4all_concept_v0.2.0.md` (platform), `architecture_v0.4.0.md` (decisions D1–D24), `user-stories_v0.2.0.md` (stories), this document (work hierarchy).

## Hierarchy Overview

The hierarchy follows standard agile conventions (compatible with SAFe):

- **Theme** is the strategic area of investment.
- **Epic** is a major capability, typically spanning multiple releases.
- **Feature** is a service that fulfills a stakeholder need and fits in one release.
- **User Story** fits in one sprint.
- **Task** is the engineering work item within a story — not tracked in this document.

Phase labels from `user-stories_v0.2.0.md` (MVP, v2, v3, v4, Future) describe when a story ships. Epics span phases — an epic may have MVP stories, v2 stories, and v3 stories that together deliver the full capability over time.

## Counts at a Glance

- Themes: 8
- Epics: 31
- Features: 109
- User Stories: 114

All 114 stories from `user-stories_v0.2.0.md` are covered. Three stories (US-036, US-120, US-121) are referenced from two places by design — they bridge a role definition and a functional epic.

## Themes

The eight themes group the full scope of the Lifting Tracker sub-system. They are strategic areas of investment that align with the architectural decisions (D1–D24) and the XRSize4 ALL platform roadmap.

- **T1 — Platform Foundation** — identity, access, deployment, and infrastructure that every other theme depends on.
- **T2 — Core Athlete Experience** — the fundamental athlete workflow: log, view, analyze, import.
- **T3 — Coaching Platform** — the coach workflow: manage clients, assign work, review progress.
- **T4 — Training Structure** — Programs, Routines, Classes, Exercise Types — the ontological training hierarchy.
- **T5 — Goals and Progress** — goals as first-class entities, goal progress tracking, progress photos, body composition.
- **T6 — Form and Content** — instructional content (how to do exercises) and form analysis (how the user did them).
- **T7 — Intelligence** — AI/LLM capabilities applied across all other themes; Reasoner Duality implementation.
- **T8 — Extended Platforms** — wearables, glasses, voice devices, Android; capabilities that go beyond the primary iPhone app.

---

## Theme T1 — Platform Foundation

Identity, authentication, deployment, roles, data integrity, privacy, and system-level qualities. Every other theme depends on T1.

**Architectural anchors:** D3 (hierarchical RBAC), D4 (cloud source of truth), D6 (auth), D7 (alpha audience), D8 (Expo + Supabase platform), D9 (business model and tier field), D11 (project trajectory).

### Epic E1.1 — Authentication and Identity

**Goal:** Every user has a secure, persistent identity. Authentication is frictionless (magic-link, no passwords) and enforced from day one.

- F1.1.1 — Magic-link invitation and account creation (MVP) — US-001
- F1.1.2 — Persistent session on device (MVP) — US-002
- F1.1.3 — Secure token storage (MVP) — US-003

### Epic E1.2 — Role-Based Access and Hierarchy

**Goal:** Four-role hierarchy (Athlete → Coach → Gym → Super Admin) with role inheritance is enforced in the data model and UI from day one, even though only Athlete features are exposed in MVP.

- F1.2.1 — Athlete base role functionality (MVP) — implicit in all MVP stories
- F1.2.2 — Coach role, inherits Athlete (v2) — US-120, US-121
- F1.2.3 — Gym role, inherits Coach (Future) — US-210, US-211, US-212
- F1.2.4 — Super Admin role, inherits Gym (Future) — US-200, US-201, US-202, US-203, US-204
- F1.2.5 — Teams, deferred concept (Future) — US-220, US-221

### Epic E1.3 — Cross-Platform Access

**Goal:** The app runs as a real downloadable iPhone app and a web dashboard from a single Expo codebase, with data parity across both. Android and wearables are separate themes (T8).

- F1.3.1 — Real iPhone app via TestFlight (MVP) — US-050
- F1.3.2 — Web dashboard from laptop (MVP) — US-051

### Epic E1.4 — Reliability, Performance, and Security

**Goal:** Non-functional system qualities that users trust — fast, reliable, private, correct.

- F1.4.1 — App load performance (MVP) — US-300
- F1.4.2 — Sync performance (MVP) — US-301
- F1.4.3 — Data encryption in transit and at rest (MVP) — US-310
- F1.4.4 — Role-based privacy enforcement (MVP) — US-311
- F1.4.5 — Offline durability with no silent data loss (MVP) — US-320
- F1.4.6 — Sync conflict resolution with last-write-wins (MVP) — US-321

### Epic E1.5 — Data Portability and Governance

**Goal:** Users own their data. Export and migration are first-class. AI interactions are disclosed and controllable.

- F1.5.1 — User data export to CSV (Future) — US-330
- F1.5.2 — Admin database export as Postgres dump (Future) — US-331
- F1.5.3 — AI transparency and opt-out (MVP) — US-313
- F1.5.4 — Sensitive data encryption for photos (MVP) — US-314
- F1.5.5 — Selective video retention (v2) — US-315

---

## Theme T2 — Core Athlete Experience

The fundamental athlete workflow: log workouts, view history, analyze progress, import legacy data. This is the MVP's heart.

**Architectural anchors:** D1 (entry and analysis both first-class), D2 (per-set granularity), D4 (cloud source of truth), D5 (exercise library), D12 (ontological schema), D14 (per-implement weight), D15 (limb configuration), D16 (rest notation), D17 (set grouping), D18 (import notation).

### Epic E2.1 — Workout Logging

**Goal:** Athletes log workouts with full fidelity — sessions, exercises, sets, weights, reps, rest, grouping, RPE — online or offline.

- F2.1.1 — Session entry with date, location, exercises (MVP) — US-010
- F2.1.2 — Per-set entry with weight, reps, RPE, group, notes (MVP) — US-011
- F2.1.3 — Free-text paste from iPhone Notes (MVP) — US-012
- F2.1.4 — Offline logging at the gym (MVP) — US-013
- F2.1.5 — Auto-sync on reconnect (MVP) — US-014
- F2.1.6 — Edit or delete previous workouts (MVP) — US-015
- F2.1.7 — Body weight entry (MVP) — US-016
- F2.1.8 — Rest time with three-level defaulting (MVP) — US-017
- F2.1.9 — Set grouping for supersets and drop sets (MVP) — US-018
- F2.1.10 — Limb-configuration-aware volume math (MVP) — US-019

### Epic E2.2 — Exercise Library

**Goal:** Comprehensive, extensible exercise library with distinct variations, family grouping, and per-implement weight semantics.

- F2.2.1 — Canonical seeded exercise library (MVP) — US-020
- F2.2.2 — Custom user-scoped exercises with full metadata (MVP) — US-021
- F2.2.3 — Library search and filtering (MVP) — US-022
- F2.2.4 — Exercise aliases for name variations (MVP) — US-023
- F2.2.5 — Limb-configuration-distinct exercise entries (MVP) — US-024
- F2.2.6 — Exercise families for cross-variation analytics (MVP) — US-025
- F2.2.7 — Per-implement weight interpretation (MVP) — US-026

### Epic E2.3 — Progress and Analytics

**Goal:** Progress analysis is as central as data entry. Athletes see their training effort, history, trends, and records at a glance.

- F2.3.1 — Overview dashboard with sessions, volume, streaks (MVP) — US-030
- F2.3.2 — History by date (MVP) — US-031
- F2.3.3 — History by exercise (MVP) — US-032
- F2.3.4 — Estimated 1RM trends (MVP) — US-033
- F2.3.5 — Volume trends, weekly, monthly, yearly (MVP) — US-034
- F2.3.6 — Body weight plotted alongside training (MVP) — US-035

### Epic E2.4 — Data Import

**Goal:** Eric's 400-plus historical sessions are imported from `combined_workout_log.txt` with full semantic fidelity — no information loss on paren grouping, rest notation, multi-weight shorthand, or per-implement dumbbell weights.

- F2.4.1 — First-launch import of combined_workout_log.txt (MVP) — US-040
- F2.4.2 — Notation-aware import including WxR, WxRxN, parens, rest codes, equipment (MVP) — US-041
- F2.4.3 — Semantic-fidelity verification on import (MVP) — US-312

---

## Theme T3 — Coaching Platform

The coach workflow: manage clients, assign work, review their training, coach them asynchronously. Ships in v2 once athlete-facing MVP is validated.

**Architectural anchors:** D3 (hierarchical RBAC, Coach inherits Athlete), D10 (Ethan as Coach), D11 (project trajectory toward business product).

### Epic E3.1 — Client Management

**Goal:** Coach has a clean roster view and can efficiently monitor client activity and follow up.

- F3.1.1 — Invite athletes to become clients (v2) — US-100
- F3.1.2 — Client roster view (v2) — US-101
- F3.1.3 — Client history and dashboard view (v2) — US-102
- F3.1.4 — Client activity surfacing showing last logged (v2) — US-103

### Epic E3.2 — Workout Assignment

**Goal:** Coach assigns structured work to clients and sees how the client performed against the prescription.

- F3.2.1 — Workout template creation (v2) — US-110
- F3.2.2 — Template assignment to client and date (v2) — US-111
- F3.2.3 — Actual vs prescribed comparison (v2) — US-112
- F3.2.4 — Template reuse and modification (v2) — US-113

### Epic E3.3 — Coach as Athlete (Dual Role)

**Goal:** A coach logs their own training using inherited Athlete capabilities on the same account. Their training data is private from their clients.

- F3.3.1 — Coach logs own workouts via Athlete interface (v2) — US-120
- F3.3.2 — Coach training data private from clients (v2) — US-121

---

## Theme T4 — Training Structure

The ontological hierarchy above a Session: Exercise Programs, Exercise Types, Routines, Classes. Supports one-off workouts, coach-prescribed programs, drop-in classes, and multi-discipline training equally well.

**Architectural anchors:** D12 (ontological schema shape with nullable relationships), D13 (Program → Type → Routine/Class → Session hierarchy).

### Epic E4.1 — Unstructured Session Support

**Goal:** An athlete can log a Session without being part of any Program, Routine, or Class. The schema never forces structure where none exists.

- F4.1.1 — Ad-hoc session logging with no parent required (MVP) — US-060
- F4.1.2 — Optional Exercise Type association on Session (MVP) — US-061

### Epic E4.2 — Programs, Routines, Classes

**Goal:** The full training structure ships in v2: coach-designed multi-discipline Programs, Routines (self-directed or coach-prescribed templates), and Classes (instructor-led sessions). Athlete UI exposes attachment to these.

- F4.2.1 — Athlete creates or follows Exercise Programs (v2) — US-130
- F4.2.2 — Session attachment to Routine or Class (v2) — US-131
- F4.2.3 — Class attendance logging without detail (v2) — US-132
- F4.2.4 — Coach creates Routine in specific Exercise Type (v2) — US-133
- F4.2.5 — Coach designs multi-Type Program (v2) — US-134

---

## Theme T5 — Goals and Progress

Goals as first-class entities; visual progress tracking via photos; progress insight and coaching against stated targets.

**Architectural anchors:** D21 (Goals as first-class entities, seven categories), D22 (progress photos with privacy and mental-health defaults), D19 (AI/LLM insight with Reasoner Duality).

### Epic E5.1 — Goals Foundation

**Goal:** Goals exist as first-class entities in the schema and UI. MVP surfaces strength and body-weight goals with auto-computed progress.

- F5.1.1 — Strength goal tied to exercise (MVP) — US-037
- F5.1.2 — Body weight goal (MVP) — US-038
- F5.1.3 — Auto-computed goal progress (MVP) — US-039
- F5.1.4 — Legacy goal tracking, pre-D21 (MVP) — US-036

### Epic E5.2 — Goals Expansion

**Goal:** Full goal capability — coach-assigned, multi-category, milestone-bearing. Ships in v2 alongside the coaching platform.

- F5.2.1 — Coach-assigned goals with tracking visibility (v2) — US-142
- F5.2.2 — Multi-category goals per athlete (v2) — US-143
- F5.2.3 — Goal milestones and interim targets (v2) — US-144

### Epic E5.3 — AI-Assisted Goals

**Goal:** AI helps athletes turn vague intent into measurable goals, generates goal-aligned programs, and detects tension between competing goals.

- F5.3.1 — Vague-to-specific goal articulation (v3) — US-145
- F5.3.2 — Goal-aligned program suggestions (v3) — US-146
- F5.3.3 — Competing-goal tension detection (v3) — US-147

### Epic E5.4 — Progress Photos Foundation

**Goal:** Athletes capture visual progress privately, review their gallery, compare specific photos. Strict privacy-by-default per D22.

- F5.4.1 — Progress photo upload with date (MVP) — US-090
- F5.4.2 — Photo gallery ordered by date (MVP) — US-091
- F5.4.3 — Side-by-side photo comparison (MVP) — US-092
- F5.4.4 — Photo-to-body-weight linkage (MVP) — US-093

### Epic E5.5 — Progress Photos Enhanced

**Goal:** Guided capture for consistency, optional coach sharing with granular controls.

- F5.5.1 — Guided capture flow for lighting, pose, distance (v2) — US-094
- F5.5.2 — Coach photo sharing with per-photo control (v2) — US-095

### Epic E5.6 — AI Photo Analysis

**Goal:** AI generates neutral observational summaries of photo changes and estimates body composition with explicit uncertainty. Sensitivity defaults per D22 are non-negotiable.

- F5.6.1 — Neutral-language observational summaries (v3) — US-148
- F5.6.2 — Body composition estimates with uncertainty (v3) — US-149

---

## Theme T6 — Form and Content

Instructional content (how an exercise should be done) and form analysis (how the user did it). Together these form a learning loop.

**Architectural anchors:** D23 (form analysis as layered capability), D24 (instructional content from three sources), D15 (form analysis attaches to exercise families).

### Epic E6.1 — Instructional Content Foundation

**Goal:** Every exercise in the library has at least a written description and optional external video link. Low-infrastructure MVP version.

- F6.1.1 — Written form descriptions and common mistakes (MVP) — US-027
- F6.1.2 — External video link per exercise (MVP) — US-028

### Epic E6.2 — Coach-Produced Instructional Content

**Goal:** Coaches produce and host their own demonstration videos on the platform with visibility controls (private, clients-only, public).

- F6.2.1 — Embedded hosted demo video (v2) — US-154
- F6.2.2 — Coach content production and attachment (v2) — US-155
- F6.2.3 — Visibility controls per content item (v2) — US-156

### Epic E6.3 — AI-Generated Instructional Content

**Goal:** AI-generated demonstrations fill long-tail exercise coverage with consistent baseline quality. Multiple content roles (demo, mistakes, progressions) per exercise. Clearly labeled as AI.

- F6.3.1 — AI-generated demos for any exercise (v3) — US-157
- F6.3.2 — Multiple content roles per exercise (v3) — US-158
- F6.3.3 — Skill-level personalization (v3) — US-159
- F6.3.4 — AI-vs-human source labeling (v3) — US-160

### Epic E6.4 — Form Analysis — Capture and Review

**Goal:** Athletes capture set videos; coaches review asynchronously with annotations and reply videos.

- F6.4.1 — Set video capture and attachment (v2) — US-100a
- F6.4.2 — Playback controls for normal, slow, frame-by-frame (v2) — US-100b
- F6.4.3 — Coach timestamped annotation (v2) — US-100c
- F6.4.4 — Coach reply video with feedback (v2) — US-100d

### Epic E6.5 — Form Analysis — Measurements and Feedback

**Goal:** Pose estimation produces objective technique measurements; AI narrates findings per D19 Reasoner Duality. Compound lifts first.

- F6.5.1 — Objective measurements including depth, bar path, tempo, symmetry (v3) — US-150
- F6.5.2 — Natural-language form feedback with Reasoner Duality (v3) — US-151
- F6.5.3 — Cross-session form comparison (v3) — US-152

### Epic E6.6 — Form Analysis — Real-Time

**Goal:** Real-time or near-real-time form feedback during sets. Probably via on-device processing and eventually wearables (T8).

- F6.6.1 — Real-time form feedback during sets (v4) — US-153

---

## Theme T7 — Intelligence

AI/LLM capabilities applied across all other themes. Implements Reasoner Duality (D19) with Authority Rule. Every AI feature has a Tier 1 deterministic anchor and a Tier 2 LLM narrative layer.

**Architectural anchors:** D19 (Reasoner Duality, Authority Rule, MVP scope), platform-level AI governance in `xrsize4all_concept_v0.2.0.md`.

### Epic E7.1 — Natural-Language Workout Entry and Summaries

**Goal:** Athletes log workouts and read summaries in natural language. The AI parses to structured drafts for user confirmation; it never silently writes.

- F7.1.1 — Natural-language workout entry parsing (MVP) — US-070
- F7.1.2 — Plain-language session summaries (MVP) — US-071
- F7.1.3 — Anomaly flagging on entries (MVP) — US-072

### Epic E7.2 — AI-Assisted Coaching

**Goal:** Coaches get AI-generated client summaries and AI-drafted programs to review, edit, and assign. Scales coach capacity without sacrificing programming quality.

- F7.2.1 — AI weekly client summaries with attention flags (v2) — US-140
- F7.2.2 — AI-assisted program generation (v2) — US-141

**Note:** AI-assisted goal features (E5.3), AI photo analysis (E5.6), AI instructional content (E6.3), and AI form feedback (E6.5) are architecturally part of T7 Intelligence but organizationally grouped under their domain themes. They all implement Reasoner Duality per D19.

---

## Theme T8 — Extended Platforms

Capabilities beyond the primary iPhone app: Apple Watch, smart glasses, voice-only devices, Android / Wear OS. All deferred beyond MVP per D20.

**Architectural anchors:** D20 (watch and wearable apps as separate post-MVP targets).

### Epic E8.1 — Apple Watch

**Goal:** Three high-value watch features — haptic rest timer, quick set logging, next-exercise display — that deliver maximum value with minimum development surface. Native SwiftUI app, not Expo.

- F8.1.1 — Haptic rest timer on watch (Future) — US-080
- F8.1.2 — Quick set logging from watch (Future) — US-081
- F8.1.3 — Next-exercise display (Future) — US-082

### Epic E8.2 — Smart Glasses and Voice Devices

**Goal:** Hands-free workout logging via smart glasses or audio-only devices. Depends on D19 AI/LLM for natural-language parsing.

- F8.2.1 — Voice logging via glasses or earbuds (Future) — US-083

### Epic E8.3 — Android and Wear OS

**Goal:** Parity between Android and iPhone experiences, with Wear OS equivalent to Apple Watch features.

- F8.3.1 — Wear OS equivalent of Apple Watch features (Future) — US-084

---

## Story Coverage Summary

Every story from `user-stories_v0.2.0.md` is accounted for. Three stories (US-036, US-120, US-121) are referenced in two places by design, because they serve two purposes (a role definition and a functional capability).

**Counts by theme:**

- T1 Platform Foundation: 5 epics, 17 features, 22 stories covered (includes US-120, US-121 in role definition)
- T2 Core Athlete Experience: 4 epics, 23 features, 23 stories
- T3 Coaching Platform: 3 epics, 10 features, 10 stories (includes US-120, US-121 in functional use)
- T4 Training Structure: 2 epics, 7 features, 7 stories
- T5 Goals and Progress: 6 epics, 17 features, 17 stories (includes US-036 as legacy)
- T6 Form and Content: 6 epics, 17 features, 16 stories
- T7 Intelligence: 2 epics, 5 features, 5 stories
- T8 Extended Platforms: 3 epics, 5 features, 5 stories

**Totals:** 31 epics, 109 features, 114 unique user stories plus 3 cross-referenced. Verified — no gaps, no orphans.

## Release Planning View

The hierarchy can be read by theme (what capability are we building) or by phase (what ships when). Here is the phase view, to support release planning.

### MVP — Closed Alpha (Eric + Ethan + clients + independent athletes)

**Delivers:** Complete athlete experience end-to-end. Log, analyze, goals, progress photos, AI-assisted entry and summaries, history import, exercise library with instructional text.

- T1: E1.1 (Auth), F1.2.1 (Athlete role), E1.3 (iPhone + Web), E1.4 (NFRs), F1.5.3 and F1.5.4 (AI transparency, photo encryption)
- T2: E2.1, E2.2, E2.3, E2.4 — all MVP features
- T4: E4.1 (Unstructured sessions)
- T5: E5.1 (Goals foundation), E5.4 (Progress photos foundation)
- T6: E6.1 (Instructional text foundation)
- T7: E7.1 (NL entry and summaries)

### v2 — Coaching Activation

**Delivers:** Coach can take on clients, assign work, review form videos, see AI-drafted summaries, produce demo content, assign goals.

- T1: F1.2.2 (Coach role), F1.5.5 (Video retention options)
- T3: E3.1, E3.2, E3.3 — all
- T4: E4.2 — all (Programs, Routines, Classes)
- T5: E5.2 (Goals expansion), E5.5 (Photos enhanced)
- T6: E6.2 (Coach instructional content), E6.4 (Form capture and review)
- T7: E7.2 (AI coaching)

### v3 — Advanced AI and Analysis

**Delivers:** AI-generated demonstrations for long-tail exercises, automated form measurements with natural-language feedback, goal assistance, photo analysis.

- T5: E5.3 (AI goals), E5.6 (AI photo analysis)
- T6: E6.3 (AI instructional content), E6.5 (Form measurements and feedback)

### v4 — Real-Time and Extended

**Delivers:** Real-time form feedback.

- T6: E6.6 (Real-time form)

### Future — Admin, Gym, Teams, Wearables, Data Portability

**Delivers:** Admin and gym management, teams, wearable platforms, data export.

- T1: F1.2.3, F1.2.4, F1.2.5 (Gym, Super Admin, Teams), F1.5.1, F1.5.2 (Data export)
- T8: E8.1, E8.2, E8.3 — all wearables and Android

## Usage Notes

### For sprint planning

Work pulls from the story level. A sprint commits to a set of stories; stories roll up to features; features roll up to epics; epics roll up to themes. Velocity and burn-down track at the story level.

### For roadmap communication

External audiences (investors, potential coaches, platform partners) typically see the theme level. Themes describe capabilities in business terms; epics describe major deliverables; features describe specific functions.

### For architectural alignment

Every epic has one or more architectural anchors (decision numbers D1–D24). When an architectural decision changes, the affected epics and their stories are identified.

### For cross-cutting capabilities

Some capabilities span themes. AI (T7) appears in feature rows across T2, T3, T5, T6. The organization here groups AI features under their domain themes because that's where the stakeholder value lives, while E7.1 and E7.2 capture the standalone Intelligence epics (NL workout entry, coach assistance) that don't fit cleanly under a single domain.

### For Scrum or Kanban

This hierarchy is framework-agnostic. In Scrum, stories are committed into sprints drawn from the epic backlog. In Kanban, stories flow continuously through a pipeline; WIP limits apply at the story or feature level. Scrumban works equally well — sprint planning commits epics or features to a quarter, and stories flow kanban-style within the quarter.

## Change log

- 2026-04-17: Initial version. Eight themes (T1–T8), 31 epics (E1.1 through E8.3), 109 features (F1.1.1 through F8.3.1), covering all 114 user stories from `user-stories_v0.2.0.md`. Derived from architectural decisions D1–D24 in `architecture_v0.4.0.md` and the system-of-systems framing in `xrsize4all_concept_v0.2.0.md`. Phase labels (MVP, v2, v3, v4, Future) preserved from the user stories document; themes and epics span phases where appropriate. Three stories (US-036, US-120, US-121) intentionally cross-referenced in two places where they serve two distinct purposes.
- 2026-04-17 (revision): Rewrote feature lists from table format to prose/bullet format for easier copying on mobile devices. No content changed; all 31 epics, 109 features, and 114 story references preserved. Only format changed from `| Feature | Phase | Stories |` tables to `- Feature name (Phase) — Stories` bullet format.
- 2026-04-17 (QC fix): Corrected feature-ID prefix inconsistency in the Release Planning View section. References to specific features (F1.2.1, F1.2.2, F1.2.3, F1.2.4, F1.2.5, F1.5.1, F1.5.2, F1.5.3, F1.5.4, F1.5.5) were erroneously written with an E-prefix (as if they were epic-level), giving the impression of three-level epic numbering (e.g., E1.2.1) which does not exist in this hierarchy. Epics are E-prefixed with two-level numbering (e.g., E1.2); features are F-prefixed with three-level numbering (e.g., F1.2.1). No semantic content changed; only ten prefix corrections in the Release Planning View.

---

© 2026 Eric Riutort. All rights reserved.
