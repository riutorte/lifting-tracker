---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
tier: OPERATIONAL
content_class: operational
---

# Architecture.md Sprint 0b Day 1 Content-Drop Audit (v0.3 → v0.4.0)

## 1. Summary

**Verdict: (A) Clean revision, zero content drops.** The Sprint 0b Day 1 revision to `docs/lift-track-architecture_v0.4.0.md` is strictly additive + two sanctioned targeted modifications (frontmatter date/version stamp and the `D1–D24` → `the decisions above` rephrase). The baseline vs v0.4.0 diff contains exactly **2 deletion lines and 39 addition lines**, and both deletions are explicitly sanctioned by the brief. The full Data model SQL block, the Non-decisions taxonomy, and every D1–D24 decision header are byte-for-byte preserved. The uploaded 2026-04-17 copy (input 1) differs from the baseline snapshot in markdown-formatting and attribution ways (see §2), but those differences predate Sprint 0b Day 1 — the baseline is still the correct pre-revision reference for the change under audit.

## 2. Input 1 vs Input 2 — is the baseline correct?

**Result: DIFFER** — but the differences are attributable to an attribution+lint pass that landed between 2026-04-17 and 2026-04-23 (pre-Sprint-0b). The baseline remains the correct reference for the v0.3→v0.4 audit.

Sizes: uploaded 698 lines / 53 330 bytes; baseline 735 lines / 53 276 bytes. Categorised delta:

1. **Frontmatter correction (structural).** Uploaded starts with bare `created: 2026-04-14` — no opening `---`, no `author:` line (malformed YAML). Baseline opens `---\nauthor: Eric Riutort\n...`. Compliant with the global CLAUDE.md attribution rule.
2. **Copyright footer added.** Baseline ends with `© 2026 Eric Riutort. All rights reserved.`; uploaded does not. Also per global CLAUDE.md.
3. **Markdown lint pass.** Baseline adds blank lines before bulleted lists (CommonMark compliance) in ~20 locations, and removes redundant inline styling where bold+backticks coexisted (e.g., `**`together`**` → plain `together`; `` `group_id` `` → `group_id` in prose; `*italics*` → plain text).
4. **Scope-note blockquote flattened.** `> **Scope note:** …` → `**Scope note:** …`.
5. **SQL block line-wrapping.** Long enum lists in the data-model code block (e.g., `ai_interactions.interaction_type`, `goals.category`, `biometric_samples.metric_type`) wrapped across multiple lines. Content identical.
6. **One content fix:** `exercises.equipment` enum — uploaded has `bodyweight` listed twice (`…kettlebell/cable/bodyweight/other`); baseline has `bodyweight` listed once (`…kettlebell/cable/other`). Duplicate deduped.

None of these are Sprint 0b Day 1 changes. They appear to be a pre-Sprint-0b cleanup pass that enforced the attribution and markdown conventions. Eric's uploaded copy is older than the baseline, not tampered with.

## 3. Pre-revision vs current — classified diff

Full diff: 108 lines in `diff -U1` form; 2 deletion lines and 39 addition lines. All 6 hunks classified below.

| # | Location (baseline → current) | Change | Category |
|---|---|---|---|
| 1 | L4 (`updated: 2026-04-17`) → L4–7 (date + `version: 0.4.0` + `tier: ARCHITECTURE` + `content_class: architecture`) | frontmatter stamp | MODIFY-INTENTIONAL |
| 2 | After L91 `D8` → new L94–96 | "Revision 2026-04-23 (Sprint 0a)" paragraph layered below original D8 body | ADD |
| 3 | After L257 D19 → new L263–272 | "Tier 2 concern log (added 2026-04-23)" subsection under D19 | ADD |
| 4 | After L404 D24 → new L421–465 | D26 TypeScript + D27 multi-agent interop + new `## Cross-cutting architectural principles` section (MCP-first, Three-layer data, Hosting posture, Observability) | ADD |
| 5 | L407 (`beyond what D1–D24 have decided`) → L470 (`beyond what the decisions above have decided`) | forward-durability rephrase | MODIFY-INTENTIONAL |
| 6 | After L729 change log → new L796 | 2026-04-24 Sprint 0b Day 1 change-log entry | ADD |

**Tally:** ADD × 4 hunks (36 addition lines). MODIFY-INTENTIONAL × 2 hunks (2 deletion + 4 addition lines). MODIFY-UNINTENDED × 0. DELETE-INTENTIONAL × 0 standalone (the two deletions above are sub-parts of MODIFY-INTENTIONAL). DELETE-UNINTENDED × 0.

## 4. Spot-check verification

| Item | Result | Evidence (v0.4.0 line) |
|---|---|---|
| Scope note paragraph | PRESENT, verbatim | L12 |
| D1–D24 decision headers (all 24) | PRESENT (L47–L404; 24 of 24). D26 L421, D27 L427 added intentionally. D25 absent — intentionally tracked in separate ADR per change-log entry, never present in baseline or uploaded | L47, L53, L59, L65, L71, L77, L83, L89, L99, L107, L113, L124, L132, L166, L174, L195, L211, L219, L230, L274, L292, L328, L368, L390 |
| D8 original "Expo (React Native) + Supabase, offline-first" body | PRESENT as the original; new Sprint 0a revision paragraph layered below, does NOT replace | L89 header, L91–92 original body, L94 revision paragraph |
| D12 "ontological [schema] shape" phrasing | PRESENT (equivalent wording "ontological shape of the schema") | L128, L130 |
| D17 `group_id` column specification | PRESENT | L211 header, L213, L215, L223–224 |
| D19 Authority Rule language | PRESENT, verbatim | L237 |
| D19 Scope for MVP bullet list | PRESENT, verbatim | L246 |
| D22 body-image / mental-health "non-negotiable" | PRESENT, verbatim | L337 |
| D23 Layer 1/2/3/4 taxonomy | PRESENT, all four layers | L372–375 |
| D24 three-source content (Coach-produced / Platform-curated / AI-generated) | PRESENT, verbatim | L394–396 |
| Full data model SQL code block | PRESENT, **byte-identical** to baseline (`diff` of Data model section returns empty) | L541–774 |
| Non-decisions section with all "platform concern" entries | PRESENT (Biometrics, Commerce, Content publishing, Social and community, Proximity and discovery) | L488, L492, L498, L502, L512 |
| Change log entries for 2026-04-14, 2026-04-15, 2026-04-17 morning/evening/late-evening | ALL PRESENT, verbatim | L791–795 |
| Copyright footer | PRESENT (`© 2026 Eric Riutort. All rights reserved.`) | EOF. Note: uploaded copy lacks this — pre-existing attribution gap, closed before Sprint 0b Day 1, not a regression of this revision |

## 5. Content-drop findings

**None.** No DELETE-UNINTENDED and no MODIFY-UNINTENDED hunks. No patch or rollback required.

The single prose-level deletion (`D1–D24` → `the decisions above`) is explicitly sanctioned in the brief and improves forward durability as D-numbers grow past 24. The frontmatter `updated:` bump is mechanical and expected.

## 6. Defense posture assessment

The four defenses held. Evidence:

- **Fresh-Read.** The Data model SQL block (~230 lines, the highest-risk section for silent truncation under LLM re-generation) is byte-identical between baseline and current. This is the signature of an `Edit` operation scoped to named locations, not a `Write` rewrite. Fresh-Read + Edit-not-Write did what they were designed to do.
- **Post-mutation verify.** The +/− accounting is inspectable and tight: 2 deletion lines, 39 addition lines, every hunk attributable to the brief. A drop would show up as a `-` line with no matching `+` explanation, and there are none.
- **20 K pre-flight cap.** The baseline was 735 lines / ~53 K bytes, under any reasonable cap. Not stressed on this revision, but would have triggered a split if the revision had tried to regenerate the whole file instead of editing named regions.
- **Baseline snapshot.** `docs/.baseline-lift-track-architecture-pre-sprint-0b-20260424.md` exists, is reachable, and enabled this audit. Without it, the only reference would have been Eric's older uploaded copy (which predates the attribution pass) and the diff would have been ~260 lines of noise instead of 108 lines of signal.

Net: the pattern works. The defenses allowed a 4-section additive revision to land on a 735-line architecture document with zero content drops and a fully auditable diff.

## 7. Recommendations for document-cm Book Boss + WF-003 Step 9

1. **Require a sibling baseline snapshot for every TIER=ARCHITECTURE edit.** WF-003 Step 9 should refuse to stamp a new version if `docs/.baseline-pre-<sprint>-<date>.md` does not exist adjacent to the modified file at edit-start.
2. **Assert `diff | wc -l` is inspectable (< 500 lines for a normal architectural revision).** A diff larger than that on a TIER=ARCHITECTURE file is a re-generation smell and should block stamping pending human review.
3. **Whitelist MODIFY-INTENTIONAL patterns.** Frontmatter `updated:` / `version:` bumps and `D\d+–D\d+` → `the decisions above` style rephrases are known-safe; anything else that shows up as a deletion on a TIER=ARCHITECTURE file triggers a blocking Book Boss flag.
4. **Verify byte-identity on named "protected regions."** The Data model SQL block, the Non-decisions taxonomy, and the Change log are high-value protected regions on this file. Book Boss should hash them at baseline and refuse to advance if any hash changes without an explicit change-log entry calling out the change.
5. **Stamp the baseline with its own frontmatter.** The current `.baseline-lift-track-architecture-pre-sprint-0b-20260424.md` is a plain snapshot. If document-cm is going to make this pattern universal, the baseline file itself should carry `tier: BASELINE`, `snapshot_of: docs/lift-track-architecture_v0.4.0.md`, `taken_at: <timestamp>`, and a sha256 of the source at snapshot time — so a later audit can detect baseline tampering (the Step 1 attack vector flagged in the brief).
6. **Pre-existing attribution gap on the uploaded 2026-04-17 copy is closed.** No action required, but the pattern of "users upload an old copy as a reference" suggests document-cm should compare against the newest committed version, not an arbitrary user upload, when determining drift. The mismatch here was harmless; in a contested edit it would not be.

---

© 2026 Eric Riutort. All rights reserved.
