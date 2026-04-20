---
author: Eric Riutort
created: 2026-04-15
updated: 2026-04-17
---

# Lifting Tracker — User Stories

**Scope note:** These user stories cover the Lifting Tracker sub-system of XRSize4 ALL. Cross-platform capabilities (identity shared across sub-systems, shared content and social, proximity, commerce, full wearable ecosystem, full AI platform) are documented at the platform level in `xrsize4all_concept.md`. Stories here describe how the Lifting Tracker sub-system uses those platform capabilities. Stories span MVP through v3+; non-MVP stories are included to anchor the roadmap and to ensure the data model reserves room for them.

Derived from `architecture.md` (D1–D24). Organized by MVP phase and role. Each story follows: **As a [role], I want to [action] so that [benefit].**

Stories marked **(MVP)** are in scope for the first release. Stories marked **(v2)** ship in the second iteration. Stories marked **(v3)** or **(v4)** ship in later iterations. Stories marked **(Future)** are deferred with no target iteration.

**MVP scope note:** The schema supports the full ontological structure (Programs, Exercise Types, Routines, Classes, Exercise Families, limb configurations, set grouping, coach relationships, goals, progress photos, set videos, instructional content, AI interactions) from day one per D12–D24. The MVP UI exposes only athlete-level features against a single Exercise Type (Weightlifting). Stories for Programs, multiple Exercise Types, Classes, Coach features, form analysis, AI-assisted coaching, and wearable integrations are in v2, v3, v4, or Future, but their data model is already in place.

## Phase 1: MVP — Athlete Experience

### Authentication

US-001 (MVP): As an athlete, I want to receive a magic-link email invitation so that I can create my account without remembering a password.

US-002 (MVP): As an athlete, I want to stay logged in on my iPhone between sessions so that I don't have to re-authenticate every time I open the app at the gym.

US-003 (MVP): As an athlete, I want my auth token stored securely on my device so that my account is protected if my phone is lost.

### Workout Logging

US-010 (MVP): As an athlete, I want to log a workout session with a date, location, and list of exercises so that I have a record of what I did.

US-011 (MVP): As an athlete, I want to add exercises to a session and record each set with weight, reps, rest seconds (inherited or overridden per D16), optional RPE, optional group identifier (per D17), and notes so that my data captures all the dimensions that matter for analysis.

US-012 (MVP): As an athlete, I want to paste free-text workout notes from my iPhone Notes app and have the app parse them into structured sets so that I can keep using my existing capture habit.

US-013 (MVP): As an athlete, I want to log workouts while offline at the gym so that poor cell reception doesn't prevent me from recording my session.

US-014 (MVP): As an athlete, I want my offline entries to sync automatically when I regain connectivity so that I don't have to manually push data.

US-015 (MVP): As an athlete, I want to edit or delete a previously logged workout so that I can correct mistakes after the fact.

US-016 (MVP): As an athlete, I want to record my body weight with a date and location so that I can track weight trends alongside training.

US-017 (MVP): As an athlete, I want to set a default rest time at the session level, override it at the exercise level within a session, and override it again at the individual set level so that I don't have to re-enter the same value repeatedly while still being able to capture precise variations when they matter (per D16).

US-018 (MVP): As an athlete, I want to mark sets as grouped — performed back-to-back with no meaningful rest between them, such as supersets, drop sets, or cluster sets — so that the distinction between grouped and standalone sets is preserved in my data for future analytics (per D17).

US-019 (MVP): As an athlete, I want to log sets for exercises that use different limb configurations (both arms together, alternating, single arm, etc.) and have the correct volume calculation applied automatically based on the exercise definition so that I don't have to do the math myself (per D15).

### Exercise Library

US-020 (MVP): As an athlete, I want to select exercises from a pre-populated canonical library when logging a session so that I don't have to type exercise names every time.

US-021 (MVP): As an athlete, I want to create custom exercises that are scoped to my account, specifying their limb configuration (upper and lower), equipment, and optional family association so that they integrate correctly with volume analytics from the moment they're logged.

US-022 (MVP): As an athlete, I want to search and filter the exercise library by name, category, or equipment so that I can quickly find the right exercise.

US-023 (MVP): As an athlete, I want exercise aliases so that variations in my naming (e.g., "Pec Fly" vs "Pectoral Fly") map correctly without creating duplicates.

US-024 (MVP): As an athlete, I want the exercise library to distinguish between variations of the same movement that differ only in limb configuration (e.g., "Dumbbell Curl — Both Arms" vs "Dumbbell Curl — Alternating" vs "Dumbbell Curl — Single Arm") so that my volume calculations reflect what I actually did rather than assuming a default (per D15).

US-025 (MVP): As an athlete, I want exercises grouped into families (e.g., all bicep curl variations share a family) so that I can see aggregate volume and progression across all variations of a movement pattern, not just per-exercise (per D15, exercise_families).

US-026 (MVP): As an athlete, I want the system to know when "25 lbs" on a dumbbell exercise means 25 per hand (total load 50) versus 25 total, based on the exercise's configuration, so that volume calculations are correct without my having to double the number mentally (per D14).

US-027 (MVP): As an athlete, I want exercises in the library to include a written description of proper form and common mistakes so that I can look up how to perform an unfamiliar exercise (per D24).

US-028 (MVP): As an athlete, I want exercises to optionally link to an external video (YouTube, etc.) so that I can watch demonstrations without the platform hosting video content (per D24).

### Sessions and Context

US-060 (MVP): As an athlete, I want to log a Session that is not part of any Program, Routine, or Class so that I can record one-off workouts, travel workouts, and ad-hoc training without being forced into a planned structure (per D12).

US-061 (MVP): As an athlete, I want to optionally associate a Session with an Exercise Type (Weightlifting is the MVP default, others follow in v2) so that when I eventually track multiple disciplines they live in one place with consistent data models (per D13).

### Progress and Analytics

US-030 (MVP): As an athlete, I want to see an overview dashboard showing my total sessions, total volume, and current streaks so that I can gauge my overall training effort.

US-031 (MVP): As an athlete, I want to view my workout history by date so that I can see what I did on any given day.

US-032 (MVP): As an athlete, I want to view my history by exercise so that I can see every time I've done a specific movement and how it's progressed.

US-033 (MVP): As an athlete, I want to see my estimated 1RM for key lifts and how they've changed over time so that I can measure strength progress.

US-034 (MVP): As an athlete, I want to see volume trends (weekly, monthly, yearly) so that I can ensure I'm training consistently.

US-035 (MVP): As an athlete, I want to see my body weight plotted over time alongside my training data so that I can correlate weight changes with training phases.

US-036 (MVP): As an athlete, I want to track progress toward specific goals (e.g., 135 lbs × 100 reps on bench press) so that I can see how close I am to milestones.

### Goals

US-037 (MVP): As an athlete, I want to set a strength goal tied to a specific exercise (e.g., "Bench 225 for 5 reps by December") so that my progress dashboard shows how close I am to the target (per D21).

US-038 (MVP): As an athlete, I want to set a body weight goal with a target value and deadline so that my body weight tracking has an explicit target to measure against (per D21).

US-039 (MVP): As an athlete, I want current progress toward each goal calculated automatically from my logged sessions and body weight entries so that I don't have to manually update goal progress (per D21).

### Progress Photos

US-090 (MVP): As an athlete, I want to upload progress photos to my account with a date so that I have a visual record of my physical changes over time, private to me by default (per D22).

US-091 (MVP): As an athlete, I want to see my progress photos in a gallery ordered by date so that I can scroll through my history at a glance (per D22).

US-092 (MVP): As an athlete, I want to compare two progress photos side by side so that I can see change between specific dates (per D22).

US-093 (MVP): As an athlete, I want to link a progress photo to a body weight entry so that my visual progress and numeric progress are viewable together (per D22).

### AI-Assisted Logging and Analytics

US-070 (MVP): As an athlete, I want to type or dictate my workout in natural language and have the app structure it correctly (as a draft I can review and confirm) so that I can log faster than tapping through forms (per D19).

US-071 (MVP): As an athlete, I want a plain-language summary of my training week so that I can understand my progress without reading charts (per D19).

US-072 (MVP): As an athlete, I want the app to flag clearly-wrong entries (weight 10× my history, impossible rep counts) and ask me to confirm so that typos don't pollute my data (per D19).

### Data Import

US-040 (MVP): As an athlete (Eric), I want to import my existing combined_workout_log.txt into the database on first launch so that my 400+ sessions of historical data are available from day one.

US-041 (MVP): As an athlete, I want the import to handle the existing log's notation conventions, including:

- WxR as a single set with weight W and reps R (per D18)
- WxRxN as N separate sets with meaningful rest between them, group_id null (per D18)
- (WxR, WxR, ...) as multiple sets sharing a group_id, representing back-to-back performance with no meaningful rest (per D17, D18)
- Rest notation x ≈ 20 seconds, + ≈ 60 seconds, explicit values like 90s as-is, all converted to integer seconds on import (per D16)
- BF and other equipment shorthand mapped to canonical exercise entries
- Dumbbell weights interpreted as per-implement based on exercise definition, with total load computed from limb configuration (per D14, D15)

so that historical data is parsed correctly and all semantic distinctions (grouping, rest patterns, per-implement vs total weight) survive the import.

### Cross-Platform Access

US-050 (MVP): As an athlete, I want to access the app as a real downloadable iPhone app so that it sits alongside my other apps and I don't need to "Add to Home Screen."

US-051 (MVP): As an athlete, I want to access the same data from a web browser on my laptop so that I can review my training history on a bigger screen.

## Phase 2: Coach Experience

### Client Management

US-100 (v2): As a coach, I want to invite athletes to become my clients via magic-link email so that they appear in my client list when they accept.

US-101 (v2): As a coach, I want to see a list of my active clients so that I can quickly navigate to any client's data.

US-102 (v2): As a coach, I want to view a client's workout history and progress dashboards so that I can monitor their training without asking them to screenshot their app.

US-103 (v2): As a coach, I want to see when a client last logged a workout so that I can follow up if they've been inactive.

### Workout Assignment

US-110 (v2): As a coach, I want to create workout templates (exercise + target sets/reps/weight) so that I can assign structured programs to my clients.

US-111 (v2): As a coach, I want to assign a workout template to a specific client for a specific date so that they see what they should do when they open the app.

US-112 (v2): As a coach, I want to see whether a client completed an assigned workout and compare their actual performance to what I prescribed so that I can adjust programming.

US-113 (v2): As a coach, I want to reuse and modify previously assigned templates so that I don't rebuild programs from scratch each week.

### Coach as Athlete

US-120 (v2): As a coach, I want to log my own workouts using the same athlete interface so that I don't need a separate account for my own training.

US-121 (v2): As a coach, I want my personal training data to be private from my clients so that my own progress isn't visible to the people I coach.

### Programs, Routines, Classes (full hierarchy)

US-130 (v2): As an athlete, I want to create or follow an Exercise Program that spans multiple Exercise Types and time horizons so that I can plan training holistically rather than one discipline at a time (per D13).

US-131 (v2): As an athlete, I want to optionally attach a Session to a Routine (for self-directed or coach-prescribed workouts) or a Class (for instructor-led sessions at a fixed venue and time) so that I can distinguish between different training contexts and enable richer analytics on each (per D13).

US-132 (v2): As an athlete, I want to log attendance at a Class without being required to record detailed exercise data so that I can track my class-based training — yoga, martial arts, CrossFit, spin — even when I don't have time or need to capture per-exercise specifics (per D13).

US-133 (v2): As a coach, I want to create a Routine within a specific Exercise Type so that my prescription matches the discipline I'm coaching (e.g., a weightlifting Routine with sets × reps × weight targets, or a running Routine with distance × pace targets) (per D13).

US-134 (v2): As a coach, I want to design an Exercise Program that coordinates multiple Exercise Types and Routines across a time horizon so that my athlete has a coherent plan across strength work, conditioning, mobility, and skill training rather than a collection of disconnected workouts (per D13).

### Form Analysis — Video Capture and Coach Review

US-100a (v2): As an athlete, I want to record a video of a specific set and attach it to that set in my log so that I have a visual record of my performance (per D23).

US-100b (v2): As an athlete, I want to play back my set videos at normal speed, slow motion, and frame-by-frame so that I can review my own form (per D23).

US-100c (v2): As a coach, I want to review my client's form videos asynchronously with the ability to leave timestamped annotations so that I can provide coaching without being present for the session (per D23).

US-100d (v2): As a coach, I want to record a reply video with my feedback so that my client sees and hears my correction with full context (per D23).

### Progress Photos — Enhanced Capture and Coach Sharing

US-094 (v2): As an athlete, I want the app to guide me through taking consistent progress photos (lighting, pose, distance) so that my photos are actually comparable over time (per D22).

US-095 (v2): As an athlete, I want to optionally share specific progress photos with my coach so that they can review my physical changes, with me controlling which photos are shared (per D22).

### Goals — Coach-Assigned and Multi-Category

US-142 (v2): As a coach, I want to set goals for my clients and track their progress so that my programming is visibly connected to what they're trying to achieve (per D21).

US-143 (v2): As an athlete, I want multiple goals in different categories (strength, body composition, endurance) so that my training serves all my priorities (per D21).

US-144 (v2): As an athlete, I want to define milestones within a larger goal so that long-horizon goals have interim success points (per D21).

### Instructional Content — Hosted Video from Coaches

US-154 (v2): As an athlete, I want to watch a demonstration video embedded in the exercise detail so that I can see proper form without leaving the app (per D24).

US-155 (v2): As a coach, I want to produce demonstration videos for exercises and attach them to specific entries in the exercise library so that my clients see my form and cues (per D24).

US-156 (v2): As a coach, I want to control whether my demonstration content is visible to my clients only, all platform users, or the public so that I can offer some as free content and some as premium (per D24).

### AI-Assisted Coaching

US-140 (v2): As a coach, I want an AI-generated summary of each client's training week with items requiring my attention flagged so that I can efficiently review many clients (per D19).

US-141 (v2): As a coach, I want AI-assisted program generation that produces structured programs I can review, edit, and assign so that I can serve more clients without sacrificing programming quality (per D19).

## Phase 2.5: Advanced AI and Analysis (v3)

### Form Analysis — Automated Measurements and Feedback

US-150 (v3): As an athlete, I want the app to provide measurements from my form videos (squat depth, bar path, tempo, symmetry) so that I can track objective aspects of my technique (per D23 Layer 2).

US-151 (v3): As an athlete, I want natural-language feedback on my form that explains what the measurements mean and suggests specific improvements so that I can self-correct without always needing a coach (per D23 Layer 3, applying D19 Reasoner Duality).

US-152 (v3): As an athlete, I want to compare my form on the same exercise across different weights or different sessions so that I can see how my technique holds up under load or fatigue (per D23).

US-153 (v4): As an athlete, I want real-time or near-real-time form feedback during my set, either audio cues or visual indicators, so that I can correct mid-set or on my next rep (per D23 Layer 4).

### Progress Photos — AI Analysis

US-148 (v3): As an athlete, I want AI-generated observational summaries of my progress photos using neutral language so that I understand what's changed without aesthetic judgment (per D22 and D19).

US-149 (v3): As an athlete, I want estimated body composition ranges from my photos with clearly communicated uncertainty so that I have an additional data point alongside scales and measurements (per D22).

### Goals — AI-Assisted Creation and Coordination

US-145 (v3): As an athlete, I want the AI to help me turn vague goals ("build muscle," "get stronger") into specific measurable targets so that my goals are trackable (per D21 and D19).

US-146 (v3): As a coach, I want AI-generated program suggestions that align with my client's active goals so that my programming is goal-driven (per D21 and D19).

US-147 (v3): As an athlete, I want the app to warn me when two of my goals may be in tension (e.g., aggressive weight loss + strength goals) so that I can set realistic expectations or adjust (per D21 and D19).

### Instructional Content — AI-Generated Demonstrations

US-157 (v3): As an athlete, I want AI-generated demonstrations available for any exercise in the library so that I'm never without a visual reference for a movement I don't recognize (per D24).

US-158 (v3): As an athlete, I want to see multiple content options for an exercise (primary demo, common mistakes, progressions) so that I can dive deeper when I'm learning something new (per D24).

US-159 (v3): As an athlete, I want the demonstration content personalized to my skill level (beginner vs. advanced) so that I get the right depth of explanation (per D24).

US-160 (v3): As an athlete, I want clearly-labeled indication of whether a demonstration was AI-generated vs. produced by a human coach so that I can calibrate my trust in the content (per D24).

## Phase 3: Admin and Gym

### Super Admin

US-200 (Future): As a super admin, I want to view all users, their roles, and their activity so that I can monitor the health of the system.

US-201 (Future): As a super admin, I want to invite new users and assign their initial role so that I control who has access during alpha.

US-202 (Future): As a super admin, I want to change a user's role (e.g., promote an athlete to coach) so that roles can evolve without recreating accounts.

US-203 (Future): As a super admin, I want to deactivate a user's account so that former clients or coaches lose access without deleting their historical data.

US-204 (Future): As a super admin, I want to view system-wide analytics (total users, total sessions logged, active users this week) so that I can understand adoption.

### Gym

US-210 (Future): As a gym owner, I want to see all coaches operating under my gym and their client counts so that I can manage my coaching staff.

US-211 (Future): As a gym owner, I want to view aggregate training statistics across all gym members so that I can understand facility usage patterns.

US-212 (Future): As a gym owner, I want gym branding applied to the app experience for my members so that it feels like a gym-provided tool, not a third-party app.

### Teams (deferred concept)

US-220 (Future): As a coach on a team, I want to see other team members' clients (with granted permission) so that we can cover for each other and collaborate on programming.

US-221 (Future): As a team admin, I want to manage which coaches can see which clients within the team so that client privacy is respected even within a shared coaching group.

## Phase 4: Wearables and Extended Platforms

### Apple Watch

US-080 (Future): As an athlete, I want a rest timer on my Apple Watch that vibrates when my rest interval is complete so that I don't need to check my phone to start my next set (per D20).

US-081 (Future): As an athlete, I want to log a set from my Apple Watch during a workout so that I don't have to pull out my phone between sets (per D20).

US-082 (Future): As an athlete, I want my Apple Watch to show me what exercise and target parameters are next in my session so that I can focus on lifting without checking my phone (per D20).

### Smart Glasses and Voice-Only Devices

US-083 (Future): As an athlete, I want to speak my workouts to my smart glasses or earbuds and have them logged accurately (depending on D19 AI/LLM parsing) so that I can train hands-free (per D20 and D19).

### Android and Wear OS

US-084 (Future): As an Android athlete, I want a Wear OS version of the app with equivalent features so that I have the same experience on my watch as iPhone users (per D20).

## Non-Functional Stories

### Performance

US-300 (MVP): As an athlete, I want the app to load in under 3 seconds on my iPhone so that I can start logging immediately at the gym.

US-301 (MVP): As an athlete, I want offline-to-online sync to complete within 10 seconds of regaining connectivity so that I'm not waiting around after a workout.

### Security

US-310 (MVP): As a user, I want my workout data encrypted in transit and at rest so that my training information is protected.

US-311 (MVP): As a coach, I want to be certain that I can only see my own clients' data and not other coaches' clients so that user privacy is enforced by the system, not by convention.

### Reliability

US-320 (MVP): As an athlete, I want to be confident that a workout I logged offline will never be silently lost so that I trust the app with my training record.

US-321 (MVP): As a user, I want the app to handle sync conflicts (same session edited on two devices) gracefully using last-write-wins so that I don't encounter errors or data corruption.

### Import Fidelity

US-312 (MVP): As an athlete, I want my historical log with complex notation patterns (parens indicating grouped sets, WxRxN compressed notation, rest shorthand x/+, per-implement dumbbell weights) imported with all semantic distinctions preserved so that future analytics can reason correctly about supersets, rest patterns, set groupings, and total load without having to re-parse or re-interpret the original text.

### AI Transparency and Control

US-313 (MVP): As a user, I want clear disclosure of when AI is being used and what data it accesses, and the ability to opt out, so that I can control how my data is processed (per D19).

### Sensitive Data Handling

US-314 (MVP): As a user, I want my progress photos stored with stronger encryption and privacy controls than other data, and easily deletable, so that these sensitive images are handled with appropriate care (per D22).

US-315 (v2): As a user, I want videos of my training stored securely with the option to keep only the analysis data and discard the raw video so that I can manage storage and privacy (per D23).

### Data Portability

US-330 (Future): As a user, I want to export all my workout data to CSV so that I own my data and can leave at any time.

US-331 (Future): As a super admin, I want to export the full database as a Postgres dump so that the system can be migrated to self-hosted infrastructure.

## Story map summary

| Phase | Role | Stories | Key capability |
|---|---|---|---|
| MVP | Athlete | US-001 to US-093 | Log, view, analyze own workouts; offline; import history; goals; progress photos; AI-assisted logging; exercise ontology |
| v2 | Coach + Athlete | US-100 to US-160 | Manage clients, assign workouts, programs/routines/classes, form video, instructional content, AI coaching |
| v3 | Athlete + Coach | US-145 to US-160 | Automated form analysis, AI photo analysis, AI goal creation, AI-generated demos |
| v4 | Athlete | US-153 | Real-time form feedback |
| Future | Super Admin | US-200 to US-204 | User management, system analytics |
| Future | Gym | US-210 to US-212 | Gym-level views, coaching staff management |
| Future | Teams | US-220 to US-221 | Cross-coach client visibility with permissions |
| Future | Wearables | US-080 to US-084 | Apple Watch, smart glasses, Android Wear |
| All | Non-functional | US-300 to US-331 | Performance, security, reliability, import fidelity, AI transparency, data portability |

## Change log

- 2026-04-15: Initial version. Derived from architecture.md D1–D6.
- 2026-04-17: Major expansion. Added D7–D24 stories. New sections: Sessions and Context, Goals, Progress Photos, AI-Assisted Logging, Form Analysis, Programs/Routines/Classes, Instructional Content, Wearables. Expanded exercise library stories for limb configuration, families, per-implement weight. Expanded import story for full notation semantics. Added non-functional stories for import fidelity, AI transparency, sensitive data handling. Reframed as Lifting Tracker sub-system of XRSize4 ALL.

---

© 2026 Eric Riutort. All rights reserved.
