---
author: Eric Riutort
created: 2026-04-29
updated: 2026-04-29
tier: REFERENCE
content_class: reference
version: 0.1.0
---

# Lifting Tracker — DoDAF Views

Index of the DoDAF view set produced for Lifting Tracker. The full discipline (mermaid-in-markdown as canonical, eleven named views, SysML iconography, fit-for-purpose ADD/SUBTRACT authority) lives in `CONVENTIONS_v0.2.4.md` §11. This README is the directory-level index; CONVENTIONS is the rule of record.

The DoDAF framework's portfolio name is under reconsideration per SD-006 in `~/reach4all/docs/architecture/strategic-decisions-log_v0.1.0.md` (leading candidate: AAF — Agentic Architecture Framework). All current view files keep the DoDAF prefix; rename happens forward-only when the framework rename lands in Sprint 0d2.

## View files in scope

Per CONVENTIONS §11.7, every sub-system produces at minimum the load-bearing four (OV-1, SV-1, SV-6, DIV-2). Lifting Tracker has those plus the conditional and platform-level views relevant at this maturity.

| View | Purpose | File |
|---|---|---|
| AV-1 Overview & Summary | Plain-language scope, purpose, stakeholders, environment | `lift-track-dodaf-AV-1-overview_v0.1.0.md` |
| AV-2 Integrated Dictionary | Glossary of terms used across views (CARP/CARPO subset typing landed in Sprint 0c1 CC8) | `lift-track-dodaf-AV-2-dictionary_v0.2.0.md` |
| CV Capability Viewpoint | Capability hierarchy and dependencies | `lift-track-dodaf-CV-capabilities_v0.1.0.md` |
| OV-1 High-Level Operational Concept Graphic | The "one-picture concept" — actors, environment, value flow | `lift-track-dodaf-OV-1-concept-graphic_v0.1.0.md` |
| OV-5c Activity Sequence | Event-traced behavioral view (sequence diagram form of OV-5b) | `lift-track-dodaf-OV-5c-activity-sequence_v0.1.0.md` |
| SV-1 Systems Interface Description | Systems, sub-systems, interfaces between them | `lift-track-dodaf-SV-1-interfaces_v0.1.0.md` |
| SV-6 Systems Resource Flow Matrix | Data and control exchanges between systems | `lift-track-dodaf-SV-6-data-exchanges_v0.1.0.md` |
| SvcV-1 Services Context | Service contracts, MCP servers, API surfaces | `lift-track-dodaf-SvcV-1-services-context_v0.1.0.md` |
| DIV-2 Logical Data Model | Logical-tier data model | `lift-track-dodaf-DIV-2-logical-data_v0.1.0.md` |
| StdV-1 Standards Profile | Standards Lifting Tracker commits to (protocols, schemas, regulatory) | `lift-track-dodaf-StdV-1-standards_v0.1.0.md` |

## Naming convention

`<view-code>-<descriptive-slug>_v<version>.md` per CONVENTIONS §6.2 prefix-conventions. The view-code (e.g., AV-1, SV-6) is fixed; the slug is descriptive; the version is semver. Each view file's frontmatter `version:` field matches the filename suffix; mismatch is a defect.

In Sprint 0c1.5 the rename pass adds a `lift-track-dodaf-` prefix to each view file (e.g., `lift-track-dodaf-AV-1-overview_v0.1.0.md` → `lift-track-dodaf-AV-1-overview_v0.1.0.md`) so out-of-context filenames identify both system and view-class. View-codes remain anchored at the start after the prefix.

## Fit-for-purpose principle (CONVENTIONS §11.3)

Each view producer has authority to ADD to or SUBTRACT from the standard DoDAF view contents based on what the specific view actually needs to support. The framework is a checklist of available views, not a mandatory production list. State the purpose at the top of each view file. Calibration over completeness.

## Cross-references

- Methodology and conventions: `../CONVENTIONS_v0.2.4.md` §11 (Diagrams and architectural views)
- Architecture decisions the views inform: `../lift-track-architecture_v0.4.0.md` (D-decisions)
- User stories the views cover: `../lift-track-user-stories_v0.2.0.md` (US-### references)
- ADR D28 (architectural discipline profile): `../adrs/lift-track-D28-architectural-discipline-profile_v0.1.0.md`
- Forthcoming: portfolio-level cross-reference matrix at `../lift-track-dodaf-cross-reference.md` (per CONVENTIONS §11.6 promise; Sprint 0c1 stretch deliverable)

## Tool fallbacks (CONVENTIONS §11.8)

When a diagram type cannot be rendered in mermaid + markdown (rare): inline SVG, PNG export from one-shot external tool with source file checked in alongside, or descriptive markdown with explicit SysML-style notation in tables. Excalidraw is acceptable for sketches but NOT for canonical views.

---

© 2026 Eric Riutort. All rights reserved.
