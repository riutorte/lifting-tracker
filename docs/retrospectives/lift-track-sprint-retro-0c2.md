---
author: Eric Riutort
created: 2026-04-30
updated: 2026-04-30
tier: OPERATIONAL
content_class: operational
sprint: 0c2
sprint_name: Sandboxing Discipline + Destructive-Op Policy
sprint_dates: 2026-04-30 → 2026-04-30
duration_days: 1
---

# Sprint 0c2 Retrospective — Sandboxing Discipline + Destructive-Op Policy

**Dates:** 2026-04-30 → 2026-04-30 (1 day, intra-day micro-sprint)
**Goal:** Convert failure-modes research §7-D and §7-G into operational artifacts — worktree isolation as the default for spawned Code tasks, plus a written destructive-operation policy that classifies operations by tier and names the approval discipline.
**Close criteria (planned, 2 items):** Worktree-default amendment to the orchestration doc; standalone destructive-operation policy.

## Outcome

**Closed clean. All 2 CCs DONE.** Both artifacts landed in the same atomic commit on main; the sprint opened and closed inside a single calendar day.

The work paired naturally: CC1 amends `orchestration_v0.1.0.md` with a §8 that establishes worktree-isolation-as-default across both Cowork-spawned Code tasks and interactive Mac terminal sessions; CC2 stands up `lift-track-destructive-operation-policy_v0.1.0.md` as the governance-as-code layer that pairs with the deny list (Sprint 0c1 CC9), the worktree default itself, and the deferred bindfs reaper. Each artifact cross-references the others — the four-control composition is named explicitly in the policy's §1 relationship table.

## Stats

- Duration: 1 day (2026-04-30 → 2026-04-30) — intra-day open-and-close
- Close criteria: 2 planned, 2 DONE; 0 stretch attempted
- Lines added (commit `7691119`): +669 / −3 across 2 files
- `orchestration_v0.1.0.md`: version bumped 0.1.0 → 0.2.0; new §8 (six subsections, 8.1–8.6) covering Why / Cowork-spawned tasks / interactive Mac terminal / override patterns / re-evaluation cadence / cross-references; ~59 net lines added
- `lift-track-destructive-operation-policy_v0.1.0.md`: 606 lines, 8 sections plus Changelog; 5-tier framing (Tier 0 always-deny → Tier 4 routine); approval matrix at solo+AI scale with Fernando-onboarding placeholder; override procedures; per-tier audit-trail requirements
- Tier-0 deny patterns enumerated against Sprint 0c1 CC9's `.claude/settings.json` for traceability
- Cross-references consumed: failure-modes research §1.2 #3, §2.13, §5.2, §6, §9.2; orchestration §8; deny list (CC9); SD-004, SD-009, SD-012
- Commits on main: 1 deliverables commit (this retro + kanban updates land as commit 2 at sprint close)

## Artifacts delivered

CC1 — `docs/orchestration_v0.1.0.md` v0.2.0 amendment:

- §8 "Worktree isolation as default" added between §7 (Failure modes) and §9 (Evolution policy)
- §8.1 Why — names the single architectural commitment ("agent edits never touch the live tree") and the cost-benefit calculation against documented incidents
- §8.2 Cowork-spawned Code tasks — operational rule: every code-task spawn that may write uses `isolation: "worktree"`; user-prompted approval-per-worktree on exit-with-changes; read-only override is named and auditable
- §8.3 Interactive Mac terminal sessions — `alias claude='claude --worktree'` for Eric's `~/.zshrc`; intentional-friction override via `command claude` / `\claude`
- §8.4 Override patterns — three named cases (read-only inspection, single-step git ops, doc-only edits) tabulated with the recommended override per surface
- §8.5 Re-evaluation cadence — sprint-close review per SD-012 plus three out-of-cycle triggers
- §8.6 Cross-references — failure-modes research, deny-list settings, the policy doc (CC2), SD-004
- Frontmatter: `version: 0.2.0`, `updated: 2026-04-30`, `status: accepted`

CC2 — `docs/lift-track-destructive-operation-policy_v0.1.0.md`:

- §1 Purpose — establishes scope (every Cowork-spawned Code task, every interactive Claude Code session, every direct-to-platform action against Lifting Tracker state), the four-control composition table (deny list / worktree default / this policy / bindfs reaper), and the gaps this policy specifically targets
- §2 Categories of destructive operations — five tiers (Tier 0 always-deny / Tier 1 production destructive / Tier 2 sandboxed-only / Tier 3 approval-required / Tier 4 routine) with Lifting-Tracker-specific examples
- §3 Approval matrix — solo+AI scale today (Eric is the sole approver); Fernando-onboarding placeholder anticipates expansion to second-human-in-the-loop
- §4 Override / emergency procedures — §4.2 documentation requirement codified: any override must record what was overridden, why, and what compensating discipline was in place
- §5 Audit-trail requirements — per-tier; lighter for Tier 4, heavier for Tier 0–1
- §6 Cross-references — failure-modes research, SD-004 / SD-009 / SD-012, deny-list precedent, orchestration §8
- §7 Re-evaluation triggers — sprint-close review; observed-bypass trigger; new-platform-surface trigger
- §8 Open questions for next re-evaluation — known gaps the policy intentionally defers (e.g., Supabase-dashboard ops auditability, multi-step compounding-class detection)
- Changelog with 0.1.0 entry citing Sprint 0c2 CC2

## What worked

- **Layered-control framing.** Naming the four controls explicitly (deny list / worktree default / policy / reaper) and showing what each does and does not do made the policy's role precise rather than vaguely-additive. The §1 relationship table is the artifact future-Eric (or Fernando, or any reader) can use to decide which control catches a given concern.

- **Tier-based classification produced a portable framework.** The five-tier structure is project-specific in its examples but framework-portable across XRSize4 ALL sub-systems. When Concept or other sub-systems stand up their own destructive-op policies, the tier definitions, approval-matrix shape, and override-procedure pattern can be reused with sub-system-specific examples swapped in.

- **Two-artifact composition with explicit cross-referencing.** Orchestration §8 cites the policy doc by full path; the policy doc's §6 cites orchestration §8. No floating references; every cross-link verifiable by grep. The composition mirrors the methodology Eric has been building since Sprint 0c0 — artifacts that name their dependencies survive the next reorganization.

- **Micro-sprint cadence held.** Sprint 0c2 opened and closed in a single calendar day with two distinct artifacts plus retrospective. Per CONVENTIONS_v0.2.4 §14.3, intra-day micro-sprints are valid; this is now the second clean instance (0c0.5 was the first). The pattern works for tightly-scoped work where the deliverables are pre-staged in the prior sprint's kanban.

- **Solo+AI scale with named expansion path.** The approval matrix accepts that Eric is the sole human approver today and explicitly placeholders the Fernando-onboarding case. This avoids both extremes — pretending solo discipline is permanent (locks Fernando out later) and over-engineering for a team that doesn't exist yet (cost without benefit). Right-sized governance per global CLAUDE.md "enterprise rigor is selective."

- **Failure-modes research consumption discipline.** Both artifacts cite specific sections of the research (§1.2 prevention actions, §2.13 multi-step compounding class, §5.1 blast-radius patterns, §6 recovery scenarios, §9.2 Sprint-0c2-aligned actions). The research delivered Sprint 0c1 CC10 is now load-bearing for two follow-on sprints (0c1 CC9 deny list + 0c2 CC1+CC2). Investment in research deliverables compounds.

## What didn't work

- **Stretch items not attempted.** Sprint 0c2's stretch list (worktree-default smoke test; CONVENTIONS reference to the policy) did not land. Capacity decision rather than failure — both CCs took the available capacity cleanly, and the smoke-test in particular benefits from being its own observable in Sprint 0d when the worktree default is exercised against a real spawn. Documenting this so the smoke-test doesn't slip silently.

- **Policy is reference-tier — no technical enforcement yet.** Per the policy's §1 relationship table, "this policy does not enforce technically; relies on human (Eric) discipline plus Claude's CLAUDE.md adherence." The first failure mode where the policy is actually consulted will reveal whether the tier classifications are usable in the moment or too abstract. No way to test without an exercise.

- **Open questions in policy §8 surface known gaps.** The policy intentionally defers Supabase-dashboard auditability, multi-step compounding-class detection, and several other concerns. Honest framing — but the deferral list is now its own backlog item that needs a re-evaluation owner.

- **Q4 placement question resolved silently.** The 0c2 kanban draft (`docs/lift-track-kanban-sprint-0c2.md`) flagged the policy's home as "lifting-tracker `docs/` or reach4all `docs/architecture/` — placement decision at sprint open." Final placement: lifting-tracker `docs/` with `lift-track-` prefix per Sprint 0c1.5 naming convention. The decision is visible from the filename but the rationale wasn't recorded mid-sprint. For future sprints with a similar placement question, document the call inline before commit so the rationale survives in retro and history.

- **No INHERITED-DONE table populated at sprint open.** The 0c1 retro's improvement #2 ("first action at 0c2 sprint-open: review what's INHERITED-DONE from prior sprints") didn't get a visible execution. Items inherited from 0c1 + 0c1.5 (CONVENTIONS amendments, DoDAF cross-reference matrix, naming convention) are real but uncodified in the 0c2 kanban. Lesson: bake the INHERITED-DONE review into the sprint-open commit checklist for 0d.

## What to improve in Sprint 0d

1. **Smoke-test the worktree default.** First low-risk Code-task spawn in 0d should intentionally exercise the worktree-default behavior — confirm `isolation: "worktree"` in the spawn payload, observe child-agent behavior on completion, validate the override path. Per the 0c2 stretch item that didn't land. Record outcome in 0d retro.

2. **Cite the policy from the first 0d destructive operation.** Sprint 0d's CCs include schema/database actions (CC4 PITR, CC6 rollback playbook), git-history actions (CC7 reflogExpire), and skill-build actions that touch hooks. Each touches a different tier of the policy. Cite the policy by section when planning each CC; observe whether the tier classifications hold or need adjustment.

3. **Execute the INHERITED-DONE review at 0d sprint-open.** Per 0c1 retro improvement #2 that 0c2 missed. The 0d kanban already has a placeholder section; populate it with explicit rows from the frozen 0c1 + 0c1.5 + 0c2 close-states.

4. **Close the policy's §8 open questions iteratively.** The destructive-op policy has explicit open-question backlog. Treat one as a 0d stretch item if capacity permits; otherwise carry forward to 0d2 / 0e.

5. **CONVENTIONS reference to the policy.** Sprint 0c2 stretch that didn't land. Add a line to CONVENTIONS_v0.2.4 §14 (or wherever methodology-aware operational policies are referenced) so the policy is discoverable from the methodology spine. Trivial edit; defer-cost is low but discoverability is non-zero.

## Key takeaways

1. **Layered-control composition is the right framing for governance work.** Naming what each control catches and what it doesn't catch produces a relationship table that survives the next reorganization. The four-control composition (deny list / worktree default / policy / reaper) is now the canonical pattern for any Lifting-Tracker-scope destructive-op question. Any new control candidate must answer "what does this catch that the existing four don't" before adopting it.

2. **Tier classification is portable.** The five-tier framework can be reused across XRSize4 ALL sub-systems. When Concept or other sub-systems author their own destructive-op policy, copy the tier definitions, swap the sub-system-specific examples, and adjust the approval matrix. Saves the framework re-derivation.

3. **Micro-sprints work for paired-deliverable scopes.** Sprint 0c0.5 (1 day, 1 CC + 1 MOVED CC) and Sprint 0c2 (1 day, 2 CCs) both validated the intra-day micro-sprint cadence. The criterion: scope is pre-staged in the prior sprint's kanban, deliverables are tightly-coupled, and one calendar day is realistic with no unknowns.

4. **Reference-tier governance documents need named first-use validation.** The policy is well-formed but untested in anger. Sprint 0d will be its first real exercise. Plan that exercise explicitly rather than waiting for an incident to reveal whether the tiers work.

5. **Cross-reference discipline pays compounding interest.** Both 0c2 artifacts cite the failure-modes research deliverable from 0c1 CC10. Research artifacts that survive past their generating sprint become load-bearing for downstream sprints. Continue investing in cross-referenceable research output.

## Memory updates from this sprint

No new memory files added during 0c2. The patterns surfaced (layered-control framing, tier classification, micro-sprint cadence) belong as CONVENTIONS amendments and methodology takeaways rather than per-conversation feedback.

`MEMORY.md` index unchanged.

Likely candidates for memory writes during Sprint 0d open:

- `feedback_layered_control_framing.md` — codify the "what each control catches and doesn't catch" relationship-table pattern for future governance work
- `feedback_tier_based_classification_for_governance.md` — note that tier-based classification with named override paths is the preferred shape for risk-class governance docs
- The "scientific experiment" framing memory (carried forward from 0c1.5 candidate list) still hasn't been written; defer again until a natural opening

## Sprint 0d — already scoped

**Theme:** document-cm Skill Build + STIG + Rollback Readiness

**Dates:** 2026-04-30 → TBD

**Goal:** Operational `document-cm` skill installable via `/skills install`, validating Lifting Tracker's `.cm/manifest.yaml`, with STIG alignment documented in the skill repo. Production-data prerequisites met: PITR enabled, off-account backup runner running, top-3 rollback playbook operationalized (database wipe), git reflog-expiration disabled on dev workstation.

**Close criteria (7 items + 1 sub-item per CC3a; CC3b moved out at 0c0.5 close):** per existing `lift-track-kanban-sprint-0d.md` draft. CC1 skill scaffold; CC2 manifest; CC3 STIG alignment; CC3a Cowork bypass attack-vector mapping; CC4 Supabase PITR; CC5 off-account S3 backup; CC6 first rollback playbook (database); CC7 `git config --global gc.reflogExpire never`.

Sprint 0d will inherit these as INHERITED-DONE:
- All CONVENTIONS amendments from 0c1
- DoDAF cross-reference matrix from 0c1
- Naming-convention rename from 0c1.5
- Worktree-default amendment + destructive-op policy from 0c2
- Various memory feedback files

## Open externally / on Eric's plate (carried from 0c2)

- Layer 1 env var (`GIT_OPTIONAL_LOCKS=0`) — DEFERRED-TO-POST-SPRINT-0D1 per compensating-control discipline. No action until 0d1 controls baseline lands.
- `Untitled.canvas` at lifting-tracker repo root — separate handling; delete OR move OR add `*.canvas` to `.gitignore`. Untouched in 0c2.
- 12 defects in DoDAF cross-reference matrix §6 — assigned to Sprint 0d cleanup.
- Worktree-default smoke-test (0c2 stretch) — carried as Sprint 0d improvement #1.
- CONVENTIONS reference to destructive-op policy (0c2 stretch) — carried as Sprint 0d improvement #5.
- Open questions in destructive-op-policy §8 — backlog for 0d/0d2 re-evaluation.
- Other-worktrees naming-convention sync — 22 active worktrees still on pre-rename state; sync at next merge to main.
- f0492d52 Claude.ai URL re-share — pushed to Sprint 0e backlog.
- WWDC 2026 hardware-purchase reminder will surface in May/June.

---

© 2026 Eric Riutort. All rights reserved.
