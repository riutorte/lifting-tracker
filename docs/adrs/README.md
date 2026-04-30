---
author: Eric Riutort
created: 2026-04-29
updated: 2026-04-29
tier: REFERENCE
content_class: reference
version: 0.1.0
---

# Lifting Tracker — Architecture Decision Records (ADRs)

Index of the Architecture Decision Records (ADRs) for Lifting Tracker. Each ADR captures one architectural decision with its alternatives, rationale, consequences, and (per the strategic-implications process amendment per Sprint 0c1 portfolio research) a Strategic Implications section addressing cost / lock-in / retention / ownership / exit posture.

ADRs are Architecture-class per CONVENTIONS_v0.2.4 §2: semver-versioned, GATE required, baseline snapshot on MAJOR/MINOR bumps. The decision-of-record set is in `../lift-track-architecture_v0.4.0.md` (D1–D27); standalone ADR files capture decisions that warrant their own document.

## ADRs in scope

| ID | Decision | Status | File |
|---|---|---|---|
| D25 | Source-Document Configuration Management | Accepted | `lift-track-D25-source-document-cm_v0.1.0.md` |
| D28 | Architectural Discipline Profile (calibrated rigor for solo+AI scale) | Accepted | `lift-track-D28-architectural-discipline-profile_v0.1.0.md` |

D1–D24 and D26–D27 live as numbered decisions inside `../lift-track-architecture_v0.4.0.md` rather than as standalone files. The D-numbering is portfolio-wide; standalone ADR files use the same number as their corresponding entry in the master architecture document.

## Naming convention

`D##-<descriptive-slug>_v<version>.md` per CONVENTIONS §6.2 prefix-conventions. The `D##` prefix is fixed; the slug is descriptive; the version is semver.

Sprint 0c1.5 rename pass prepends `lift-track-` to make system context explicit out of repo context (e.g., `lift-track-D25-source-document-cm_v0.1.0.md` → `lift-track-D25-source-document-cm_v0.1.0.md`).

## ADR template structure

Every ADR carries:

1. **Frontmatter** — `author`, `created`, `updated`, `tier: ARCHITECTURE`, `content_class: architecture`, `version`, `status` (proposed / accepted / superseded), `decision_id` (the D-number).
2. **Title and context** — what problem the decision answers; why now.
3. **Decision** — the call, stated cleanly.
4. **Alternatives considered** — at minimum 2 named alternatives with brief rationale for rejection.
5. **Rationale** — why this decision over alternatives.
6. **Consequences** — what changes downstream; what's now constrained or enabled.
7. **Strategic Implications** *(amendment landing in Sprint 0d2 per portfolio strategic-implications research §10)* — cost trajectory, lock-in posture, retention obligations, ownership stance, exit/migration plan per Lifecycle Integrity (SD-012). Without this section, decisions are local-technical-correct but strategically blind.
8. **References** — cross-links to user stories, DoDAF views, CONVENTIONS sections, related ADRs, external sources.
9. **Footer** — copyright per CONVENTIONS §12.

## Versioning

MINOR bump on additive amendments (a new alternative considered, a clarifying note); MAJOR bump on substantive revision of the decision itself; PATCH on wording clarification. Each MINOR/MAJOR bump preserves a baseline snapshot per CONVENTIONS §10. Filename version field tracks the current version; mismatch with frontmatter `version:` is a defect.

A superseded ADR keeps its file in place with `status: superseded` and a `superseded_by:` pointer in frontmatter; it does NOT get deleted (decision history is the audit record).

## Cross-references

- Master architecture set: `../lift-track-architecture_v0.4.0.md` (D1–D27 numbered decisions)
- DoDAF view set the ADRs inform: `../dodaf/` (cross-reference matrix landing as Sprint 0c1 stretch)
- Strategic-decisions log (lighter than ADRs, for chat-derived decisions): `~/reach4all/docs/architecture/strategic-decisions-log_v0.1.0.md`
- ADR-vs-SD-vs-memory routing: `feedback_decision_promotion.md` memory file

## When to write a new ADR

A new D-number ADR file (rather than an inline entry in `lift-track-architecture_v0.4.0.md`) is warranted when:

- The decision needs deep treatment with multiple alternatives, rationale chains, and consequences (more than ~150 lines)
- Downstream consumers will pin to this specific decision
- The decision has cross-program implications (XRSize4 ALL portfolio, Concept Computing, future sub-systems)
- The decision requires its own change log because it will evolve over time

If the decision fits in ~30-50 lines as one numbered entry in the master architecture file, it stays inline. The standalone ADR is for decisions that exceed master-doc-entry weight.

---

© 2026 Eric Riutort. All rights reserved.
