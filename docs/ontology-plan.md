---
author: Eric Riutort
created: 2026-04-16
updated: 2026-04-16
---

# Ontology Plan — Lifting Tracker

Scrum-framed plan for building the ontological foundation that underpins the lifting tracker's data model, exercise library, and future reasoning capabilities.

## Product Vision (Ontology Scope)

A formal, reusable ontology layer that gives the lifting tracker structured knowledge about exercises, human movement, body metrics, and — critically — training programming. The first three domains have existing ontologies to adopt. The fourth is a gap: no formal ontology exists for how coaches structure programs over time. That gap is the core build.

## MVP Definition

The ontology MVP is ready when:

1. Adopted ontologies (PACO, KHMO, EXMO, CMO) are evaluated, subsetted, and mapped to the lifting tracker's domain.
2. A custom Training Programming Ontology covers the confirmed gaps (periodization, splits, set structures, progressive overload, RPE/RIR).
3. Eric's 391 sessions and 110 exercises validate the ontology — every historical record can be classified without forcing or loss.
4. The ontology maps cleanly to a relational schema (Supabase/Postgres) so implementation can consume it directly.
5. Nutrition (FoodOn) is scoped but deferred — the ontology architecture leaves room without building it now.

## Product Backlog

### Sprint 0 — Evaluation and Selection (2 weeks)

**Goal**: Confirm which existing ontologies to adopt, download and inspect them, identify what to subset.

| # | User Story | Acceptance Criteria |
|---|-----------|-------------------|
| 0.1 | As an architect, I need to download and inspect PACO, KHMO, EXMO, and CMO so I can assess actual class coverage against our domain. | All four OWL files obtained. Class hierarchies documented. Gaps vs. lifting tracker domain identified per ontology. |
| 0.2 | As an architect, I need to map Eric's 110 exercises to PACO's activity taxonomy so I can confirm coverage or identify exercises that fall outside it. | Mapping table: each of the 110 exercises → PACO class (or "unmapped" with reason). Coverage percentage calculated. |
| 0.3 | As an architect, I need to map Eric's 110 exercises to KHMO's muscle/movement classes so I can confirm the biomechanical layer covers our needs. | Mapping table: each exercise → primary muscles, movement pattern from KHMO. Gaps flagged. |
| 0.4 | As an architect, I need to evaluate EXMO's exercise prescription classes against real coaching programming to identify where prescription ends and programming begins. | Boundary document: what EXMO covers (frequency, intensity, volume, progression at prescription level) vs. what coaches need (periodization, splits, set structures, autoregulation). |
| 0.5 | As an architect, I need to assess CMO's body metric classes against the measurements already in the lifting tracker (body weight, body fat). | Mapping: tracker measurements → CMO classes. Confirm alignment or document divergence. |

**Sprint 0 Deliverables**:
- Ontology evaluation matrix (availability, format, class count, coverage %, gaps)
- Exercise mapping tables (110 exercises → PACO + KHMO)
- EXMO boundary analysis
- Go/no-go decision on each ontology
- Updated `architecture.md` with ontology decisions

### Sprint 1 — Subsetting and Alignment (2 weeks)

**Goal**: Extract usable subsets from adopted ontologies and align them into a unified namespace.

| # | User Story | Acceptance Criteria |
|---|-----------|-------------------|
| 1.1 | As an architect, I need a PACO subset containing only exercise classes relevant to gym-based and general fitness training (not clinical rehabilitation). | Subset OWL file. Class count documented. Exclusions justified. |
| 1.2 | As an architect, I need a KHMO subset covering muscles and movement patterns referenced by our 110 exercises. | Subset OWL file. Every mapped muscle/movement from Sprint 0 included. |
| 1.3 | As an architect, I need an EXMO subset covering exercise prescription constructs relevant to self-directed and coach-directed training (not clinical/therapeutic). | Subset OWL file. Prescription classes mapped to coaching equivalents. |
| 1.4 | As an architect, I need a unified namespace that cross-references PACO exercises, KHMO muscles/movements, and EXMO prescription constructs. | Alignment document or OWL import structure showing how an exercise like "Bench Press" is simultaneously a PACO activity, linked to KHMO pectoralis/deltoid/triceps, and described by EXMO intensity/volume classes. |
| 1.5 | As an architect, I need CMO body metric classes integrated into the unified namespace so body weight/composition data has formal typing. | CMO subset included in the unified namespace. Tracker's existing body weight records mappable. |

**Sprint 1 Deliverables**:
- Subset OWL files for PACO, KHMO, EXMO, CMO
- Unified namespace / alignment document
- Cross-reference examples using real exercises from the tracker

### Sprint 2 — Custom Ontology: Training Programming (2 weeks)

**Goal**: Build the ontology that doesn't exist anywhere — the coach-level programming layer.

| # | User Story | Acceptance Criteria |
|---|-----------|-------------------|
| 2.1 | As a coach, I need formal classes for periodization models (linear, undulating, block, conjugate) so training programs have structured temporal organization. | OWL classes defined. Each model's characteristics captured as properties. Real-world examples documented. |
| 2.2 | As a coach, I need formal classes for training splits (push/pull/legs, upper/lower, full body, etc.) so workout organization within a week is semantically typed. | OWL classes defined. Relationship to sessions and exercises modeled. |
| 2.3 | As a coach, I need formal classes for set structures (straight sets, supersets, dropsets, rest-pause, AMRAP, EMOM, circuits, giant sets) so the grouping and execution style of sets is captured. | OWL classes defined. Each structure's rules (rest, weight changes, rep targets) captured as properties. |
| 2.4 | As a coach, I need formal classes for intensity measures (RPE, RIR, percentage of 1RM, absolute weight) so subjective and objective intensity are both representable. | OWL classes defined. Relationships between RPE, RIR, and %1RM modeled (e.g., RPE 10 = RIR 0). |
| 2.5 | As a coach, I need formal classes for progressive overload rules (add weight, add reps, add sets, add volume, reduce rest) so progression logic is declarative, not hardcoded. | OWL classes defined. Each rule's trigger conditions and actions captured. |
| 2.6 | As a coach, I need formal classes for training volume landmarks (MV, MAV, MRV per muscle group) and deload protocols so recovery management is part of the model. | OWL classes defined. Relationship to muscle groups (via KHMO) and periodization (via 2.1) established. |

**Sprint 2 Deliverables**:
- Training Programming Ontology v0.1 (OWL file)
- Class hierarchy documentation
- Property and relationship definitions
- Integration points with PACO, KHMO, EXMO subsets

### Sprint 3 — Validation Against Real Data (2 weeks)

**Goal**: Prove the ontology works by classifying Eric's actual training history.

| # | User Story | Acceptance Criteria |
|---|-----------|-------------------|
| 3.1 | As an architect, I need to classify all 110 exercises from the tracker against the unified ontology (PACO type + KHMO muscles + EXMO prescription + Programming set structures). | Every exercise fully classified. Zero orphans. Any exercise that required ontology changes documented. |
| 3.2 | As an architect, I need to classify a sample of 20 sessions from the 391-session history against the programming ontology (what split, what periodization model, what set structures were used). | 20 sessions annotated with ontology classes. Fit and friction documented. |
| 3.3 | As an architect, I need to map the ontology to a relational schema (Postgres tables/columns) so the Supabase implementation can consume it directly. | Schema mapping document: each ontology class → table/column/enum. The architecture.md first-sketch data model updated or replaced. |
| 3.4 | As an architect, I need to validate that the rest notation from the existing log (x = <30s, + = 60s, 90s = explicit) and set grouping (parens for no-rest grouping) are representable in the ontology. | Each notation pattern mapped to ontology classes. No data loss on import. |
| 3.5 | As an architect, I need to confirm that multi-weight sets (95x10x10) and the existing parser's edge cases are ontologically sound. | Each edge case from the parser mapped. Decision documented: expand to individual set rows vs. store as repeat count with ontological justification. |

**Sprint 3 Deliverables**:
- Validated exercise classification (110/110)
- Annotated session samples (20 sessions)
- Ontology-to-relational schema mapping
- Updated `architecture.md` data model section
- Edge case resolution document

### Sprint 4 — Seeded Catalog and Schema Finalization (1 week)

**Goal**: Produce the implementation-ready artifacts.

| # | User Story | Acceptance Criteria |
|---|-----------|-------------------|
| 4.1 | As a developer, I need a seeded exercise catalog (SQL or JSON) with every exercise typed against the ontology so the app launches with a populated, ontology-backed library. | Seed file containing all 110 exercises with PACO type, KHMO muscles, category, equipment, canonical name, and known aliases. |
| 4.2 | As a developer, I need the finalized Postgres schema (DDL) reflecting the ontology-to-relational mapping so Supabase implementation can begin. | SQL DDL file. Matches the Sprint 3 mapping. Reviewed against architecture.md. |
| 4.3 | As an architect, I need architecture.md updated with all ontology decisions, the final schema, and the rationale for each adoption/build/defer choice. | Architecture.md updated. Ontology section added with: adopted ontologies, custom ontology summary, deferred items (FoodOn, SDO, SSN), schema. |

**Sprint 4 Deliverables**:
- Seeded exercise catalog (SQL/JSON)
- Postgres DDL
- Updated `architecture.md` (ontology decisions, final schema)
- Ontology OWL files in repo (`ontology/` directory)

## Backlog (Deferred — Not MVP)

These are scoped, documented, and architecturally accommodated but not built in the MVP sprints.

- **FoodOn integration** — nutrition tracking. Subset identified in Sprint 0 evaluation but not built out.
- **SDO (Sleep Domain Ontology)** — sleep tracking. Noted as Tier 2.
- **SSN (Semantic Sensor Network)** — wearable device data. Relevant when Apple Watch / Garmin integration happens.
- **OPTImAL** — adherence modeling. Relevant for coaching motivation features.
- **OWL-Time** — temporal reasoning. Useful for periodization scheduling but can be added later.
- **Concept Computing integration** — formal Concept layer on top of the ontology. Parked per dispatch-handoff.md.
- **OWL reasoning engine** — running actual OWL inference at runtime. MVP uses ontologies as schema-design guides; reasoning is a future capability.

## Definition of Done

A backlog item is done when:

1. The artifact (OWL file, mapping table, document, schema) exists in the repo.
2. It has been validated against real data from the lifting tracker (not hypothetical examples).
3. It is documented in or referenced from `architecture.md`.
4. Eric has reviewed and approved it.

## Risks

| Risk | Mitigation |
|------|-----------|
| Existing ontologies are too academic / don't map to real gym training | Sprint 0 evaluation against actual 110 exercises catches this early. Fallback: build more, adopt less. |
| Custom programming ontology scope creeps into a research project | MVP scope is fixed: periodization, splits, set structures, intensity measures, progressive overload, volume/deload. Autoregulation and exercise substitution are deferred. |
| OWL tooling complexity slows progress | Ontology can be authored as structured documentation first, formalized in OWL second. The schema mapping (Sprint 3) is the critical path, not the OWL file. |
| Relational mapping loses ontological richness | Expected and acceptable for MVP. Postgres enums and foreign keys capture the classification. Full OWL reasoning is deferred. |

## Sprint Cadence

- **Sprint length**: 2 weeks (Sprint 4 is 1 week — finalization only)
- **Total MVP timeline**: 9 weeks
- **Planning**: Start of each sprint, Dispatch session
- **Review**: End of each sprint, Eric reviews deliverables
- **Implementation**: Claude Code sessions for any file generation, data processing, OWL authoring
- **Retro**: Lightweight, folded into next sprint planning

## Change Log

- 2026-04-16: Initial version.

---

(c) 2026 Eric Riutort. All rights reserved.
