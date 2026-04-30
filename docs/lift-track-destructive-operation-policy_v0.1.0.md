---
author: Eric Riutort
created: 2026-04-30
updated: 2026-04-30
tier: REFERENCE
content_class: reference
version: 0.1.0
status: accepted
---

# Lifting Tracker — Destructive-Operation Policy

## §1 Purpose

This policy governs operations that can lose data, corrupt state, or violate compliance obligations across the Lifting Tracker codebase, its supporting infrastructure (Supabase, Vercel, EAS, GitHub), and the Cowork / Claude Code agent surfaces operating against it. "Destructive" here is the broad sense from the failure-modes research (`reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md`): any operation whose effect cannot be silently undone, where "silently" means without conscious recovery work — file deletes, schema changes, force-pushes, secret rotations, deploy rollouts, or any chain of actions that is individually reversible but jointly irreversible (the multi-step compounding class in §2.13 of the research).

The policy exists because the deny list (Sprint 0c1 CC9) and the worktree default (Sprint 0c2 CC1) cover only the most easily-catchable layer of the problem. The deny list refuses literal patterns of known-destructive bash commands; the worktree default contains blast radius when an unblocked destructive action still gets through. Neither addresses the harder cases:
- Operations that are destructive only in context (a `git reset --hard` is a routine local-undo on a feature branch and a catastrophe on a production branch with unmerged work)
- Multi-step sequences where each step looks safe but the composition is not (rename file → fix imports → run tests-pass → green: but the rename was wrong and the import-fix masked it)
- Platform-mediated destructive operations that bypass the bash deny list entirely (Supabase dashboard schema changes, Vercel project deletes, GitHub repo settings edits)
- Authorization decisions where the agent is technically capable of the action but the human (Eric) needs to be the one deciding

This policy adds a tier-based framework that names operations by risk class, attaches an approval discipline to each, and defines audit-trail requirements per tier. Together with the two technical controls (deny list, worktree default) and the deferred bindfs reaper (post-Sprint-0d2 per SD-004), it forms the "governance-as-code" layer the failure-modes research §1.2 prevention action #3 calls out.

**Scope.** Applies to:
- Every Cowork-spawned Code task that writes to the Lifting Tracker repo, its dependencies, or any infrastructure account it touches
- Every interactive Claude Code session run against the Lifting Tracker repo
- Every direct-to-platform action Eric or Claude takes (Supabase dashboard, Vercel CLI/dashboard, GitHub UI, EAS dashboard) that materially changes Lifting Tracker state
- Future scope: when Fernando onboards as a second human in the loop, this policy's approval matrix expands per §3.4

**Out of scope** (covered elsewhere):
- General architectural decisions (those go through the ADR process per `docs/adrs/README.md`)
- Day-to-day code style and convention enforcement (lint, formatter, pre-commit)
- Infrastructure provisioning that does not touch existing state (creating a new Supabase project is a Tier 4 routine action; deleting one is Tier 1)

**Relationship to adjacent controls.**

| Control | Layer | What it does | What it does not do |
|---|---|---|---|
| Deny list (CC9, Sprint 0c1) | Pre-execution refusal | Blocks ~70 literal bash patterns at Claude Code's permission gate | Cannot block platform-mediated, dashboard, or non-bash destructive ops |
| Worktree default (CC1, Sprint 0c2) | Blast-radius containment | Routes agent edits to an isolated worktree; protects the live tree | Does not help on shared infrastructure (Supabase, Vercel) since worktrees are filesystem-only |
| **This policy (CC2, Sprint 0c2)** | Authorization + audit framework | Names operations by risk tier; assigns approval discipline per tier; requires audit trail | Does not enforce technically; relies on human (Eric) discipline plus Claude's CLAUDE.md adherence |
| Bindfs reaper (deferred post-0d2 per SD-004) | Post-failure cleanup | Removes stale `.git/*.lock` files left by Cowork's bindfs delete-gate | Does not prevent destructive ops; cleans up after sandbox-mediated ones |

The four controls compose. None of them replaces another. This policy specifically targets the gap that opens when literal-pattern matching is insufficient (deny list) and filesystem isolation is irrelevant (worktree).

## §2 Categories of destructive operations

Five tiers, ordered from "always blocked at the technical layer" (Tier 0) to "no restriction needed" (Tier 4). Each tier has explicit examples scoped to Lifting Tracker; the framework is intended to be portable to other XRSize4 ALL sub-systems but the example set is project-specific.

### §2.1 Tier 0 — Always-deny

Implemented entirely in `~/lifting-tracker/.claude/settings.json` (CC9, Sprint 0c1). Claude Code refuses these literal patterns at the permission gate before any human review. Any attempt logs at the deny-list layer.

| Operation class | Pattern | Why blocked |
|---|---|---|
| Recursive filesystem destruction at root or home | `rm -rf /`, `rm -rf $HOME`, `rm -rf ~`, `rm -rf .` (with bare-dot resolution risk) | Path-resolution-error class — the December 2025 Claude Code home-directory wipe pattern (failure-modes research §2.3.3) |
| Recursive filesystem destruction across portfolio repos | `rm -rf */lifting-tracker*`, `rm -rf */reach4all*`, `rm -rf */xrsize4all*`, `rm -rf */Concept*`, `rm -rf */code-cm*`, `rm -rf */document-cm*` | Cross-project blast-radius isolation |
| Git history destruction | `git push --force`, `git push -f`, `git push --force-with-lease`, `git filter-branch`, `git reset --hard origin:*`, `git reflog expire --expire-unreachable`, `git update-ref -d`, `git gc --prune=now` | The agent-force-push pattern across the failure-modes catalog §2.4 |
| Cloud platform destroy commands | `terraform destroy`, `terraform apply -destroy`, `vercel remove`, `gh repo delete`, `supabase projects delete`, `fly destroy`, `flyctl destroy` | Platform-API-mediated production destruction (PocketOS class, §2.1.2) |
| Database wipe via CLI | `supabase db reset`, `npx supabase db reset`, `*DROP DATABASE*`, `*DROP SCHEMA*CASCADE*`, `*TRUNCATE*CASCADE*` | The Replit / Cursor Composer database-wipe class (§2.1.1, §2.1.6) |
| Secret exfiltration patterns | `cat .env*`, `cat ~/.aws/credentials`, `cat ~/.ssh/id_*`, `cat ~/.gnupg/*`, `echo *AKIA*`, `echo *ghp_*`, `echo *sk-ant-*` | The credential-leak class (§2.6) |
| Permission destruction | `chmod -R 777 /`, `chmod -R 777 ~`, `chmod 000 /`, `chown -R *`, `mv $HOME /tmp*`, `mv ~ /tmp*`, `*sudo chmod -R 777*`, `*sudo rm -rf*` | OS-level destructive auth/perm changes |
| Pipe-to-shell from network | `curl * \| bash`, `curl * \| sudo`, `wget * \| sh` | Supply-chain compromise vector |

**Tier 0 properties:**
- No human approval can override; the deny list is enforced before the question reaches a human
- If Claude Code reports a Tier 0 attempt, the prompt that produced it gets reviewed (failure mode in the prompt or in upstream context)
- Adding or removing an entry requires a Sprint-bounded change with audit-trail entry per §5.1

**Add-to-list candidates (not yet in CC9; review for Sprint 0c3 hook work):**
- `rm -rf .git` (kills history without warning)
- `git branch -D *` (mass-delete branches; recovery via reflog only)
- Dropping the public schema in Postgres outside the deny pattern (e.g., schema-named ops not matching `*DROP SCHEMA*CASCADE*`)
- Direct `rm` against `~/Library/Application Support/` Cowork session directories (ties to the bindfs reaper cleanup but should not be done by an agent)

### §2.2 Tier 1 — High-risk, manual approval required

Operations that are technically reversible but operationally costly to recover from, or that have material business / data impact even when "successful." Eric's explicit go is required before invocation. Claude must surface the operation, name the impact, and wait — never execute on inferred consent.

| Operation | Why Tier 1 | Approval discipline |
|---|---|---|
| Production Supabase schema migration (CREATE/DROP/ALTER on tables holding athlete data once Sprint 0d production lands) | Schema changes are forward-only by default; rollback requires migration-down or PITR | Eric reviews migration SQL diff; approves explicitly; migration runs under PITR-protected window |
| Production Supabase row-level deletes affecting >10 athlete-data rows | Even with PITR, mass-delete is a recovery event | Eric approves the WHERE clause; staging rehearsal first |
| File mass-delete >100 files in a single operation | Path-resolution error class; bulk wrong-target risk | Eric approves the find/glob pattern; dry-run output reviewed first |
| Dependency upgrade affecting >5 files in `package.json` or breaking semver bump on a top-level dep (Expo SDK, Supabase client, React Native) | Cascade-failure profile per failure-modes research §2.13 (multi-step compounding) | Branch + worktree + full test pass + Eric reviews |
| Renaming a database table or column referenced by >3 application files | Requires coordinated schema + code change; partial state is broken state | Migration plan reviewed; staging rehearsal first |
| Modifying RBAC / RLS policies (Athlete → Coach → Gym → Super Admin per Lifting Tracker D-decisions) | Authorization regression risk; could leak athlete data across coaches | Eric approves; security review checklist (forthcoming SD-009 baseline) |
| Force-rotating production credentials (Supabase service-role, Vercel deploy hooks, EAS API tokens) | Service interruption window; downstream dependency cascade | Eric coordinates rotation window; verifies replacement before discard |
| Restoring from PITR / off-account backup to production | Active recovery operation; window of dual-state confusion | Eric initiates; not delegable to agent |
| Deleting a GitHub branch with unmerged work (anything other than a merged feature branch) | Recovery requires reflog or remote ref; not always possible | Eric explicitly names the branch and confirms the delete |
| Deleting a Supabase storage bucket containing athlete uploads | Object data is user content; MVP has no off-account backup yet | Tier 1 today; raises to Tier 0 once §2.13 adds bucket-delete to deny list |
| `git rebase -i` rewriting >10 commits or commits older than 7 days | Reflog falls off after 90 days; large rewrite has high error surface | Eric approves; baseline tag before rewrite |

**Tier 1 properties:**
- Claude proposes; Eric disposes. No agent self-authorization.
- Spawn-prompt template for any Tier 1 op explicitly states "Tier 1, awaiting Eric's approval per destructive-operation-policy" so the discipline is auditable in the kanban
- For autonomous-mode work (per `feedback_autonomous_work.md`), Tier 1 ops queue in the kanban's In Review row with named open decisions; Claude does not execute even if Eric is asleep
- Approval is per-operation, not per-class. Approving "schema migration X" does not authorize "schema migration Y."
- Approval expires when context shifts. If Eric approves a delete on Monday and the file changes by Wednesday, the approval is stale and must be re-confirmed.

**Approval log location.** The approval and the operation both land in the per-sprint kanban under In Review or Done with the Tier 1 tag, plus the `.claude/` session transcript for forensic reconstruction. Tier 1 entries in the kanban use the format:

```
| <op> | <artifact-or-target> | Tier 1 — Eric approved <date> in <session-or-channel> | <outcome> |
```

### §2.3 Tier 2 — Medium-risk, peer-review required

Operations where individual reversibility is straightforward but the cumulative pattern is risky enough that a peer-review discipline is warranted. At solo+AI scale today, "peer" means Eric reviewing Claude's proposed change before it lands; once Fernando onboards, "peer" can mean a second human reviewer per §3.4. Critically, Tier 2 ops are not gated on Eric's real-time approval the way Tier 1 are — they can land in a worktree and merge after Eric reviews the diff at his pace.

| Operation | Why Tier 2 | Review discipline |
|---|---|---|
| `git rebase` on a shared branch (anything other than a personal feature branch) | Force-push semantics; collaborator conflict surface | PR-style diff review; baseline tag before |
| Refactor touching 5-15 files | Multi-step compounding risk per §2.13; not catastrophic but easy to introduce silent breakage | Worktree + diff review + test pass before merge |
| Dependency upgrade affecting 1-5 files (minor or patch bump) | Lower cascade risk than Tier 1 but still has surface | Worktree + test pass; review changelog for breaking changes |
| Migration adding a non-nullable column with backfill | Backfill correctness must be verified; partial migration is broken state | Migration SQL reviewed; staging rehearsal first if data shape unclear |
| Adding a new RLS policy (vs modifying existing — that's Tier 1) | Authorization expansion; lower risk than modifying existing policies but still security-relevant | Eric reviews policy SQL; `pg_policies` diff captured |
| Modifying CI/CD config (`.github/workflows/`, EAS profiles, Vercel project settings via CLI) | Pipeline misconfiguration breaks deploy; can mask errors silently | Diff review; staging deploy first |
| Changing edge function deployment (Supabase Edge Functions for AI parsing) | Edge functions have no PITR; redeployment is the rollback | Test against local Supabase first; review function logs after deploy |
| Adding a deny-list entry to `.claude/settings.json` | Could over-block legitimate operations; under-blocking is the failure mode | Eric reviews the pattern + reasoning; validates with intentional test of the blocked command |
| Modifying the Cowork orchestration spawn templates (`feedback_workspace_split.md` and successors) | Pattern propagates to every future spawn; small mistake compounds | Diff reviewed against the orchestration_v0.x.0.md doc; one-spawn dry-run before adopting |

**Tier 2 properties:**
- Diff is the unit of review. PR or worktree-with-diff is the format.
- Test pass is required before merge for code-touching ops (forthcoming once Jest is wired per project CLAUDE.md "Test: not yet configured").
- Self-review (Claude reviewing its own diff before surfacing) does not satisfy peer-review discipline — Eric is the reviewer at solo+AI scale.
- For autonomous-mode work, Tier 2 ops can land in a worktree and queue for Eric's review without blocking; the worktree path appears in the kanban's In Review row with a "Tier 2, ready for diff review" tag.

### §2.4 Tier 3 — Low-risk, audit-trail required

Routine operations that are individually safe but where the audit trail itself is the control. The discipline here is not "review before doing" but "make sure the trail of what was done is reconstructable." This is the failure-modes research §6.H1 multi-step compounding mitigation: each step is fine, but if the chain goes wrong, you need to be able to walk it back and see where.

| Operation | Audit requirement |
|---|---|
| Single-file edit committed via conventional commit prefix (`feat:`, `fix:`, `refactor:`, `chore:`) | Conventional commit message; commit author identity correct (see §5.4 for agent identity discipline); commit lands in git history |
| Local-branch git operations (commit, branch create/checkout/delete on personal feature branches, local rebase of unmerged commits) | Reflog captures it; no additional audit beyond standard git |
| Test runs (Jest, RNTL once configured; manual `npx expo start` on simulator) | Test output captured if failure; pass/fail recorded in kanban for the relevant card |
| Linting / formatting passes (ESLint, Prettier once configured) | Diff is the audit; usually empty after consistent application |
| Adding a new file to the repo (component, screen, lib helper) | Conventional commit; file lands in `app/`, `components/`, `lib/`, or `data/` per project structure |
| Reading or grepping the repo (no mutations) | No audit needed; Tier 4 effectively |
| Local Supabase development operations (`supabase start`, `supabase db reset` against local) | Local-only; no production audit needed |
| Documentation edits (`docs/*.md`) where the doc is OPERATIONAL or REFERENCE tier | YAML frontmatter `updated:` bump; commit message names the edit; living-doc rules apply |
| Documentation edits where the doc is ARCHITECTURE tier | Tier 2 (peer review) — bumps because architectural docs propagate |
| Routine git pushes to non-main branches | Standard git audit; no extra discipline |

**Tier 3 properties:**
- Audit is automatic via existing tooling (git, Claude Code session transcripts, kanban cards) — no new process required for the policy to be satisfied
- The discipline is keeping these tools healthy: don't bypass commits, don't squash transcripts, don't skip kanban updates
- For autonomous-mode work, Tier 3 ops proceed without prompting; Eric reviews via the kanban / git log at his cadence

### §2.5 Tier 4 — No restriction

Operations with no destructive risk at all. Listed for completeness so the policy explicitly says "the discipline above does not apply here."

| Operation | Notes |
|---|---|
| Read-only file system operations (Read, Grep, Glob) | The Cowork worktree default §8 of orchestration_v0.2.0.md is also irrelevant here |
| Status checks (`git status`, `git log`, `git diff`, `gh pr view`, `supabase status`) | Pure observation |
| Test runs that don't touch state (read-only assertions) | Distinct from §2.4 row "Test runs" — runs that mutate test fixtures land at Tier 3 |
| Linting / formatting in dry-run mode (`eslint --no-fix`, `prettier --check`) | Output-only |
| Documentation reads | Even of OPERATIONAL/REFERENCE/ARCHITECTURE tier docs |
| Generating a plan or proposal without acting on it | Plan-mode in Claude Code; the plan itself is Tier 4 |
| WebFetch / WebSearch | Read-only; subject to platform restrictions but not destructive risk |
| Listing Cowork sessions, tasks, kanban cards | Pure read against the orchestration layer |

**Tier 4 properties:**
- No approval, no audit (beyond what naturally exists in tool-call history)
- Not a free pass: a chain of Tier 4 reads that produces a Tier 1 conclusion still triggers the Tier 1 discipline at the consequential action

### §2.6 Cross-tier movement

Operations move between tiers as context changes. The tier framework is not a static classification; it is a function of `(operation, context, target)`. The same `git reset --hard origin/main` is Tier 4 on a personal feature branch with no uncommitted work, Tier 3 on a feature branch with committed work (reflog covers it), Tier 2 on a shared branch with collaborators, and Tier 0 on `main` (already in the deny list). The operation is the same; the tier is determined by `(target, branch-state, collaboration-state)`.

| Movement direction | Trigger | Example |
|---|---|---|
| Tier raised | Target moves from local to shared | `git rebase` on personal branch (Tier 3) → `git rebase` on shared branch (Tier 2) |
| Tier raised | Target moves from staging to production | Schema migration in staging (Tier 2) → same migration in production (Tier 1) |
| Tier raised | Operation count exceeds threshold | Single dependency upgrade (Tier 2) → 6 dependency upgrades in one batch (Tier 1) |
| Tier raised | Architectural concern surfaces | Mechanical Tier 2 refactor with D19 Authority Rule implication (Tier 1, per §3.3 Example 8) |
| Tier raised | Autonomous-mode context | Tier 1 op queued for Eric's return; cannot execute autonomously regardless of how confident the agent is |
| Tier lowered | Operation runs in disposable worktree | Tier 2 refactor in exploratory worktree (Tier 3 if worktree will be discarded) |
| Tier lowered | Operation is dry-run | Any tier (preview-only) → Tier 4 |
| Tier lowered | Operation reverses an earlier mistake | Tier 1 schema-restore-from-PITR is a recovery action; runs under §4 override discipline rather than standard Tier 1 approval |

**Practical rule.** When a tier classification is ambiguous, default to the higher tier and let the §4 override mechanism (or an explicit Tier 1 approval moving it down to Tier 2 for that case) be the formal path that lowers it. Defaulting low and discovering retroactively that the op was Tier 1 is the failure mode the policy exists to prevent.

## §3 Approval matrix

The policy's enforcement mechanic is who-approves-what. At solo+AI scale today, the matrix is two-actor (Eric + Claude). Future expansion to multi-actor (Fernando, future contractors, agency users) is named below as the trigger for re-evaluation per §7.

### §3.1 Solo+AI matrix (current scope)

| Tier | Proposer | Approver | Executor | Approval format |
|---|---|---|---|---|
| Tier 0 | (refused at deny-list layer) | n/a | n/a | n/a; if surfaced, the prompt is reviewed |
| Tier 1 | Claude or Eric | Eric (only) | Eric or Claude (after explicit approval) | Synchronous in-session approval; kanban entry per §2.2 |
| Tier 2 | Claude (typically) or Eric | Eric (only) | Claude (after diff review) or Eric | Diff review; lands in worktree first; merge after approval |
| Tier 3 | Claude or Eric | Eric implicit (via post-hoc kanban / git review) | Claude or Eric | Audit trail only (commit message, kanban update) |
| Tier 4 | Claude or Eric | n/a | Claude or Eric | None |

**Key constraints at solo+AI scale:**
- Eric is the only approver for Tier 1 and Tier 2. Claude does not self-approve.
- "Eric implicit" for Tier 3 means Eric reviews the audit trail at his cadence (sprint-close, kanban scan, git log review). Tier 3 ops do not block on real-time approval.
- The asymmetry between Tier 1 (synchronous Eric approval) and Tier 2 (asynchronous Eric review) is deliberate: Tier 1 ops are unrecoverable at the cost level Eric cares about; Tier 2 ops are recoverable but expensive enough that the diff-review discipline catches mistakes before they propagate.
- Autonomous-mode work (per `feedback_autonomous_work.md`) can execute Tier 3 freely, queue Tier 2 in worktrees for diff review, and queue Tier 1 in the kanban's In Review row with named open decisions. It does not execute Tier 1 without explicit approval, even if Eric is unavailable.

### §3.2 Conditions modifying the matrix

Some operations cross tiers depending on context. The matrix above is the default; conditions below override.

| Condition | Effect |
|---|---|
| Operation runs against production-class data (athlete data once Sprint 0d production lands) | Tier raised by one (a Tier 2 refactor against production becomes Tier 1; a Tier 3 audit-trail-only op against production becomes Tier 2 review-required) |
| Operation runs in a worktree with no merge-back planned in the same session | Tier lowered by one (a Tier 2 refactor in an exploratory worktree is Tier 3 if the worktree will be discarded; the cost of error is the worktree, not the live tree) |
| Operation runs during autonomous-mode (Eric asleep or away) | Tier 1 cannot execute at all; Tier 2 lands in worktree only; Tier 3 unchanged |
| Operation is a dry-run / plan-mode preview | Drops to Tier 4 (the preview is read-only) |
| Operation reverses an earlier mistake (recovery action) | Tier 0 ops can be temporarily lifted per §4.1 emergency procedure; otherwise unchanged |
| Operation is a documented, runbook-driven recovery (per failure-modes research §6) | Tier 1 if the runbook is current and tested; Tier 0-equivalent if the runbook is stale (don't run it) |

### §3.3 Worked examples

**Example 1: Claude proposes a refactor renaming `lib/sync-queue.ts` to `lib/sync/queue.ts` and updating 7 import sites.**

Tier 2 (refactor touching 5-15 files). Discipline:
1. Spawn the refactor as a Cowork Code task with `isolation: "worktree"` (orchestration_v0.2.0.md §8.2)
2. Worktree completes; returns path/branch
3. Eric reviews the diff (7 import sites + 1 file move)
4. Eric approves; merge to main
5. Audit trail: kanban card moves from In Progress → In Review → Done; commit message names the rename; git log carries the change

**Example 2: Claude wants to add a NOT NULL column with backfill default to a table holding athlete data (post-Sprint-0d).**

Tier 1 (production schema migration). Discipline:
1. Claude drafts migration SQL; surfaces it to Eric synchronously
2. Eric reviews backfill correctness (does the default produce sensible values for existing rows?), concurrent-write safety (is the migration safe under load? — the backfill-default approach matters), and rollback path (can we run the down migration cleanly?)
3. Eric approves explicitly; staging rehearsal first
4. Migration runs under PITR-protected window
5. Audit trail: kanban entry per §2.2 format; migration file in `supabase/migrations/`; PITR window logged

**Example 3: Claude is fixing a typo in `docs/lift-track-architecture_v0.4.0.md`.**

Edge case — architectural-tier doc. Tier 2 by §2.4 row "Documentation edits where the doc is ARCHITECTURE tier." But: typo-only single-character edit is mechanically Tier 4-equivalent. Resolution: at solo+AI scale, Eric's discretion — typos in architectural docs can land at Tier 3 (commit-message audit only) if the edit is verifiably typo-only. Anything beyond a typo (rewording, re-ordering, adding/removing content) is Tier 2 per the row.

**Example 4: Claude is adding a new entry to `.claude/settings.json` deny list because a new destructive command class was identified.**

Tier 2 per §2.3 row. Discipline:
1. Claude drafts the deny pattern; explains the targeted command class and why CC9 doesn't already cover it
2. Eric reviews the pattern (does it over-block? under-block?)
3. Validation: Eric runs an intentional test invocation of the blocked command in a throwaway location to confirm the deny works
4. Lands in `.claude/settings.json`; kanban entry per the sprint
5. This policy doc updated if the new class warrants a Tier 0 row addition (per §2.1)

**Example 5: Claude is preparing to delete an old retrospective file in `docs/retrospectives/` that was superseded.**

Single-file delete; no cascade. Tier 3 by default per §2.4 row "Single-file edit committed via conventional commit prefix" — extended to deletes of equivalent scope. Discipline: conventional commit (`chore: remove superseded retrospective <slug>`); kanban update; nothing more. Edge case: if the retrospective is referenced from any active doc, the delete is Tier 2 because the cross-reference becomes a broken link — diff review confirms either the link is updated or the link target migrated.

**Example 6: Claude proposes running `npm audit fix --force` to resolve a dependency vulnerability.**

Tier 1 per §2.2 row "Dependency upgrade affecting >5 files... or breaking semver bump on a top-level dep." `--force` allows breaking changes; even a single-package fix can cascade. Discipline:
1. Claude runs `npm audit fix` (without `--force`) first; reports what landed and what's left
2. For remaining vulnerabilities, Claude proposes per-package upgrades with explicit version targets
3. Eric reviews each upgrade; for breaking-semver bumps, full test pass + worktree merge before main
4. The class operation `npm audit fix --force` itself is treated as Tier 1; Eric never runs it without explicit per-session intent

**Example 7: Claude is asked to delete a stale Cowork session directory under `~/Library/Application Support/Claude/local-agent-mode-sessions/`.**

Outside the lifting-tracker repo; touches Cowork's session storage. Refer to SD-004 — the bindfs reaper covers this class post-Sprint-0d2. Until then: Tier 1 (manual approval), with Eric running the delete from terminal himself; Claude does not delete Cowork session directories. Once the reaper lands, this drops to Tier 3 (the reaper handles it; Claude verifies the reaper ran cleanly via its log).

**Example 8: Claude's proposed change is mechanically a Tier 2 op but the AI Reasoner Duality (D19 Authority Rule) flags a Tier 1-equivalent decision concern.**

Per D19, Tier 1 deterministic governs decisions; Tier 2 LLM explains and suggests. If a Tier 2-by-mechanics op encodes a Tier 1-by-decision-class implication (e.g., the refactor changes the limb-config interpretation per D15), the architectural concern raises the operation to Tier 1 regardless of file count. Claude surfaces the architectural concern; Eric decides whether the op proceeds at Tier 1 (with approval) or whether the architectural decision needs a separate ADR pass first.

### §3.4 Future scope: multi-approver path (post-Fernando-onboarding)

When Fernando enters scope (target: post-MVP, possibly Sprint 0g or later — exact timing TBD), the approval matrix expands. Anticipated form:

| Tier | Proposer | Approver | Notes |
|---|---|---|---|
| Tier 0 | (deny-list, unchanged) | n/a | n/a |
| Tier 1 | Claude or human | Eric *or* Fernando depending on operation domain | Domain split: Eric owns architecture / data model; Fernando owns content / coach UX |
| Tier 2 | Claude or human | Eric *or* Fernando depending on review domain | Diff review can be either; for cross-domain ops, both review |
| Tier 3 | Claude or human | Implicit human review | Either human can flag a Tier 3 entry for retroactive Tier 2 promotion if the audit trail surfaces a problem |
| Tier 4 | Claude or human | n/a | n/a |

**Triggers for fully working out the multi-approver matrix:**
- Fernando's role definition lands in the kanban / role-definition doc
- Sub-system enters production scope (athlete data on Supabase)
- Coach features start shipping (multi-user scope expands)

This section is a placeholder; it crystallizes when the trigger fires. Per SD-012 Lifecycle Integrity, that crystallization is the re-evaluation event for §3 as a whole.

## §4 Override / emergency procedures

Some situations require bypassing the policy. They are rare, named explicitly, and require post-hoc documentation that turns the override into an audit-trail entry.

### §4.1 When the policy can be bypassed

Three situations only:

1. **Recovery from corruption.** Production data has been damaged by a destructive op (the failure case the policy exists to prevent did not get prevented). Recovery requires actions that themselves look destructive — restoring from PITR overwrites the current production DB; rolling back a deploy reverts user-visible state. The recovery runbooks in failure-modes research §6 are the authoritative procedure; this policy yields to them during active recovery.

2. **Urgent production hot-fix where the standard discipline is operationally intolerable.** Athlete-data integrity issue, security breach in progress, regulatory deadline (forthcoming once HIPAA / state-level fitness-data regulations become relevant in scale-up scope). Eric authorizes the bypass; the bypass duration is bounded (target: ≤4 hours; if longer, escalate to a multi-step recovery and switch to §4.1.1).

3. **Tooling failure where the standard discipline cannot run.** Claude Code is broken; Cowork's worktree spawn is failing; the deny list itself has a bug blocking a legitimate op. Eric runs the op directly from terminal; Claude is not the actor; this policy temporarily yields because no agent is involved.

**What is not a valid override:**
- "It would be slower" — speed is not the override criterion
- "Eric is asleep" — Tier 1 ops queue, they do not auto-bypass
- "We've done it before" — precedent does not override per-operation review
- "The agent is confident" — agent confidence is not authorization (failure-modes research §2.13 — multi-step compounding cases, the agent is always confident)

### §4.2 Documentation required for an override

When an override fires, the following lands in the audit trail before the recovery / urgent action is closed out:

| Element | Where it lands | Required content |
|---|---|---|
| Override declaration | Kanban (active sprint), or `docs/incidents/<date>-<slug>.md` if cross-sprint | What was the situation; which §4.1 case applied; what was bypassed |
| Operations log | Same incident doc | Each destructive op executed during the override, in time order, with command + outcome |
| Resolution | Same incident doc | What state we ended in; what monitoring confirms recovery |
| Post-mortem | New entry in `docs/retrospectives/` or appended to incident doc | What failure-mode caused the override; what control change prevents recurrence |
| Re-evaluation trigger | This policy doc, §7 | If the override revealed a gap in tier classification or approval matrix, log here and bump version |

The post-mortem step is non-optional. An override without a post-mortem is a policy failure. The blameless-postmortem template in failure-modes research §6.H.5 applies.

### §4.3 Override logging

Inline format in the kanban during an active override:

```
| INCIDENT | <date> | OVERRIDE ACTIVE | <case-§4.1.x> — <slug> | Operations log: <link> |
```

Once resolved, the entry moves to Done with the resolution and post-mortem links.

### §4.4 Worked override scenario (recovery class)

Illustrative; not a real incident. A Tier 1 production schema migration ran with an incorrect WHERE clause in the backfill, producing wrong default values for ~3,000 athlete-data rows. PITR window covers the pre-migration state. Recovery proceeds:

1. **Detect.** Athlete reports incorrect values via support; Eric verifies in dashboard
2. **Triage.** Eric opens an incident-doc (`docs/incidents/2026-XX-XX-schema-backfill-error.md`); kanban entry per §4.3
3. **Declare override.** §4.1 case 1 (recovery from corruption); the recovery action — restore-from-PITR — is itself a Tier 1 op that bypasses the standard "Eric reviews migration SQL" step because the recovery procedure is the runbook
4. **Execute recovery.** Per failure-modes research §6.A.4 (database wipe runbook, adapted for partial-corruption case): create a non-production project from PITR at pre-migration time; export affected rows; re-import to production with the correct values
5. **Verify.** Spot-check 20 rows; query for any backfill-default sentinel that should no longer appear
6. **Resolve.** Kanban entry moves from OVERRIDE ACTIVE to Done; incident doc records the operations log
7. **Post-mortem.** Within 1 week of resolution per §4.2. Attributes the failure to the missed staging-rehearsal step (Tier 1 discipline says "staging rehearsal first" for production schema migrations; rehearsal was skipped due to time pressure). Control change: update Tier 1 row in §2.2 to make staging-rehearsal non-skippable; if Anthropic ships a Cowork primitive that enforces it, adopt the primitive
8. **Re-evaluation entry.** Type 1 trigger logged in §7.4

The lesson the scenario encodes: even with the policy in place, the *discipline* requires post-mortem follow-through. The post-mortem turns the override into a control improvement rather than a one-off recovery.

### §4.5 What an override does NOT change

The override is bounded. Specifically, an active override does NOT:
- Lift Tier 0 deny-list patterns by default. The deny list is the deepest layer; bypassing it requires explicitly editing `.claude/settings.json` (which is itself a Tier 2 op per §2.3). For recovery cases that need a Tier 0 op (e.g., genuinely needing a force-push to undo a corrupted history rewrite), the deny list is edited as a Tier 2 op first, then the recovery executes
- Suspend audit-trail requirements. Even during an override, every op lands in the operations log per §4.2
- Authorize the agent to act autonomously. The override is Eric-driven; Claude executes only the steps Eric explicitly approves during the override window
- Persist beyond the bounded duration named in §4.1. If recovery exceeds the bound, the override expires; a fresh override is declared (or escalated to a multi-step recovery plan with multiple smaller overrides)
- Carry forward to similar future operations as precedent. Per §4.1: "We've done it before" is not a valid override criterion

## §5 Audit-trail requirements

Per tier. The discipline is consistent: every action has a reconstructable trail; the reconstruction does not depend on memory.

### §5.1 Tier 0

Audit captured at the deny-list layer:
- Claude Code's session transcript records the refused command and the deny pattern that matched
- Eric's `.claude/` session storage retains the transcript (per Anthropic's Cowork data-retention defaults — verify before MVP production launch)
- Pattern-match frequency informs Sprint 0c3+ hook work (if the same Tier 0 attempt recurs across sessions, the upstream prompt or context is producing it; the prompt gets reviewed)

### §5.2 Tier 1

Audit components:
1. **Approval record.** In-session text where Eric explicitly approves; captured in the session transcript
2. **Kanban entry.** Per the format in §2.2; lands in the active sprint's kanban
3. **Operations log.** What command ran, when, against what target, with what result. For Supabase ops: Supabase dashboard log + local capture. For git ops: standard git audit. For Vercel/EAS: platform audit log
4. **PITR / backup window.** For database-mutating Tier 1 ops, the PITR or backup that protects the operation is logged with timestamp; restore-from-this-window is a documented recovery path
5. **Outcome verification.** Post-op check confirming the operation produced the intended state; captured in kanban

**Retention.** Tier 1 audit-trail components live for the lifetime of the project (lifting-tracker repo and Supabase project). The kanban, git history, and platform logs are the long-term record. Session transcripts are subject to Cowork's retention policy.

### §5.3 Tier 2

Audit components:
1. **Diff.** The PR or worktree diff is the primary audit artifact. Lands in git history when merged.
2. **Test pass.** Once Jest/RNTL is configured, test output captured for the diff
3. **Kanban entry.** "Tier 2, ready for diff review" → "Tier 2, merged" tracked through the sprint
4. **Reviewer identity.** Eric's review is captured in the merge commit author or in-session approval

### §5.4 Tier 3

Audit components:
1. **Conventional commit message.** `feat: add session-detail screen`, `fix: correct rest-default cascade per D16`, etc. The message is the audit
2. **Commit author identity.** Open question per failure-modes research §10 #10 — should agent commits use a separate git config (e.g., `claude@reach4all` author with own SSH/GPG key)? Default today: single-identity. Re-evaluate per §7
3. **Kanban update.** The card the work belongs to gets an entry; nothing more elaborate

### §5.5 Tier 4

No audit required beyond what tool-call history naturally produces. Read-only operations are reconstructable from the session transcript if needed.

### §5.6 Cross-tier audit relationships

The audit trail must be queryable across tiers when a multi-step compounding incident is being investigated:
- Per failure-modes research §6.H.3 (first-wrong-step forensics), reconstruction starts at the symptom and walks back through git log + session transcripts + kanban + platform audit logs
- The discipline above ensures each layer carries its piece of the trail
- Quarterly drill (per §7 re-evaluation cadence) verifies the trail is reconstructable end-to-end on a synthetic incident

### §5.7 Retention windows

Per-source retention. Audit reconstruction depends on the shortest window in the chain — if any source ages off, that step in the timeline is permanently lost.

| Source | Retention window | Notes |
|---|---|---|
| Git history (commits, merges) | Indefinite | Repo is the long-term record; git log + tags + signed commits where applicable |
| Git reflog | Default 90 days; extended to "never" on Eric's dev workstation per Sprint 0c1 §9.1 #4 | Critical for recovering force-push / branch-delete events; the extension is the difference between recoverable and not |
| Kanban (active sprint) | Frozen at sprint close; lives in repo | `lift-track-kanban-sprint-<id>.md` per CONVENTIONS §14.2 |
| Claude Code session transcripts (`.claude/`) | Per Anthropic data-use policy; verify before MVP launch | Critical for reconstructing what Claude was asked vs what Claude did |
| Cowork Dispatch session storage | Per Anthropic Cowork retention; varies | Same; verify before MVP launch |
| Supabase project audit log | Per Supabase plan; Pro+ retains longer than free | At MVP launch (Sprint 0d), Pro is required for PITR; the audit retention follows |
| Vercel deploy log | Per Vercel plan | Deploy events are the audit; rollback uses promote-previous |
| GitHub repo audit (push, branch, PR events) | Per GitHub plan; org-level retention longer than repo-level | For Sprint 0c2, the personal account retention applies; org migration may be a future trigger |
| EAS build log | Per Expo plan | Build events; useful for "what mobile build did this user have when they hit the bug" |
| `.env` file lifecycle | Not retained — by design | The deny list refuses `cat .env*`; the audit is the absence of the secret in the trail |

Retention gaps that warrant attention before MVP production launch:
- Claude Code / Cowork transcript retention is the single point of dependency for "what did the agent actually do" reconstruction; Anthropic's retention defaults need to be verified against the audit windows the policy assumes
- Supabase free-tier retention is too short to cover quarterly drill cadence; promotion to Pro is a Sprint 0d precondition
- GitHub personal-account retention may not extend long enough for incident forensics in scale-up scope; org migration plan tracked in `docs/lift-track-risks_v0.1.0.md`

### §5.8 Forensic-query patterns

Common reconstruction patterns when a Tier 1 or Tier 2 incident is being investigated. These are runbook fragments; the full runbooks live in failure-modes research §6.

**Pattern 1: "What did the agent do in session X between time A and time B?"**
1. Open `.claude/<session-id>/transcript.json` (or equivalent Cowork session storage)
2. Filter by timestamp range
3. Cross-reference each tool-call against the kanban entries for that session

**Pattern 2: "Who deleted file Y?"**
1. `git log --all --diff-filter=D -- <path>` — finds the deleting commit
2. Commit author identity → either Eric or the agent (per §5.4 single-identity-today caveat)
3. Cross-reference commit time against active sessions in the kanban

**Pattern 3: "What was the state of table Z at time T?"**
1. Supabase PITR restore to a non-production project at time T
2. Query Z; capture state
3. Compare to current state; the diff is the change set since T

**Pattern 4: "Did a Tier 1 approval get logged?"**
1. Search active and frozen kanbans for the operation's slug
2. Search `.claude/` transcripts for Eric's approval text in the relevant session
3. Cross-reference against the platform audit log (if applicable) for the operation's commit / migration / deploy event
4. Absence in any layer is a policy gap — log a §7 Type 1 trigger

**Pattern 5: "Was a deny-list pattern bypassed?"**
1. The deny list refuses at Claude Code's permission gate; refusal lands in the session transcript
2. If a destructive op succeeded that should have been refused, either the pattern doesn't match (§2.1 row update needed) or the deny list itself is misconfigured
3. Validation: re-run the literal command in a throwaway terminal session; verify deny fires

## §6 Cross-references

### §6.1 Internal (Lifting Tracker scope)

- `~/lifting-tracker/.claude/settings.json` — Sprint 0c1 CC9 deny list; the Tier 0 implementation
- `~/lifting-tracker/docs/orchestration_v0.1.0.md` (post-CC1: v0.2.0) §8 — worktree-default discipline that pairs with this policy
- `~/lifting-tracker/docs/lift-track-architecture_v0.4.0.md` — D-decisions; D19 (Reasoner Duality Authority Rule) is the architectural backing for "agent does not auto-execute on consequential decisions"
- `~/lifting-tracker/docs/lift-track-kanban-sprint-0c2.md` — the sprint where this policy lands
- `~/lifting-tracker/docs/adrs/README.md` — ADR template and conventions; this policy's tier framework may eventually promote a row to an ADR

### §6.2 Portfolio-level (reach4all scope)

- `reach4all://docs/research/claude-code-failure-modes-and-rollback-strategy-research.md` — the foundational input. Specifically:
  - §1.2 prevention action #3 (the sprint-level recommendation that became this doc)
  - §2 incident inventory (the empirical basis for tier classification)
  - §2.13 multi-step compounding (the class this policy specifically targets at Tier 1 and Tier 2)
  - §5.2 approval gates (industry pattern survey for Tier 1 / Tier 2 discipline)
  - §6 rollback runbooks (referenced by §4 override procedures and §5.2 audit retention)
  - §9.2 Sprint 0c2 actions (the operational plan this doc implements)
- `reach4all://docs/architecture/strategic-decisions-log_v0.1.0.md` — SD-004 (bindfs bypass; compensating control), SD-009 (Security Controls Baseline; the broader controls framework this tier model fits inside), SD-012 (Lifecycle Integrity / Deprecation Discipline; per-section re-evaluation cadence comes from here)
- `reach4all://docs/architecture/security-controls-baseline_v0.1.0.md` — the SD-009 deliverable (forthcoming Sprint 0d1 micro-sprint per the strategic decisions log); this policy will be one of the row-level entries in that baseline once it lands

### §6.3 Forthcoming (placeholder cross-references)

- **Bindfs reaper install** (post-Sprint-0d2 per SD-004) — once the reaper script is hardened (Rev 2 per failure-modes research §8.1) and installed, this policy gets a §2.1 row noting the reaper as the post-failure cleanup layer; until then, the reaper is mentioned in §1's relationship-to-adjacent-controls matrix only
- **PreToolUse hook for `rm -rf` outside-worktree rejection** (Sprint 0c3 per failure-modes research §9.3) — once landed, this policy's Tier 0 list moves the path-resolution-error class from "deny-list-pattern-match-only" to "deny-list + hook double-coverage"; row added to §2.1
- **Branch protection rulesets** (Sprint 0c3 per failure-modes research §9.3) — once enabled on `main` for all three repos (reach4all, lifting-tracker, concept-computing), the Tier 0 git-history-destruction row is doubled by GitHub-side enforcement
- **document-cm skill** (Sprint 0d) — when document-cm operates against this policy doc itself, the skill's discipline interacts with §2.4 row "Documentation edits where the doc is OPERATIONAL or REFERENCE tier"; cross-reference once document-cm spec is finalized
- **Anthropic's worktree default change** — if Anthropic ships worktree-as-platform-default (currently per-flag), the orchestration_v0.x.0.md §8 discipline becomes implicit and this doc updates §6.2's failure-modes-research dependency

### §6.4 Anti-references (deliberately not cross-referenced)

- This policy does not cross-reference Sprint 0c2's retrospective until the sprint closes (forthcoming `lift-track-sprint-retro-0c2.md`)
- This policy does not duplicate the deny-list patterns themselves (those live in `.claude/settings.json`); instead, it references them by class (§2.1 column "Pattern" lists the classes, not every literal entry)
- This policy does not duplicate failure-modes research's incident inventory; instead, it cites the section that informs each tier classification

### §6.5 Framework mapping (forward-compatible with SD-009 baseline)

This policy will be one of the row-level entries in the Security Controls Baseline (SD-009 deliverable, forthcoming Sprint 0d1 micro-sprint). To make that integration cleaner, the tier framework is mapped here against the major control frameworks SD-009 will cover. The mapping is informational today; it firms up when SD-009 lands.

| Framework | Relevant control areas | Mapping to this policy |
|---|---|---|
| NIST 800-53 r5 | AC-3 (Access Enforcement), AC-6 (Least Privilege), AU-2 (Audit Events), AU-12 (Audit Generation), CM-3 (Configuration Change Control), CM-5 (Access Restrictions for Change), IR-4 (Incident Handling) | Tier 0 maps to AC-3 / AC-6 (technical refusal); Tier 1 maps to CM-3 / CM-5 (change control with approval); Tier 2 maps to CM-3 (change control without per-op approval); Tier 3 / Tier 4 map to AU-2 / AU-12 (audit-only); §4 override maps to IR-4 |
| ISO 27001:2022 | A.5.15 (Access Control), A.8.2 (Privileged Access), A.8.32 (Change Management), A.8.15 (Logging), A.5.26 (Response to Incidents) | Tier 0 → A.5.15 / A.8.2; Tier 1 → A.8.32 with approval discipline; Tier 2 → A.8.32 with review discipline; Tier 3 / Tier 4 → A.8.15; §4 → A.5.26 |
| MITRE CWE | CWE-22 (Path Traversal), CWE-77 (Command Injection), CWE-78 (OS Command Injection), CWE-200 (Information Exposure), CWE-269 (Improper Privilege Management), CWE-285 (Authorization), CWE-377 (Insecure Temporary File) | Tier 0 deny patterns specifically address CWE-22 (rm -rf path-resolution), CWE-77 / CWE-78 (curl-pipe-bash, sudo escalation), CWE-200 (cat .env*), CWE-285 (force-push, schema drop) |
| MITRE CAPEC | CAPEC-25 (Forced Deadlock), CAPEC-29 (Leveraging Time-of-Check Time-of-Use), CAPEC-66 (SQL Injection) | Per SD-004, the bindfs reaper hardening addresses CAPEC-29; Tier 1 schema-migration discipline addresses CAPEC-66 surface |
| OWASP Top 10 (2021) | A01 (Broken Access Control), A07 (Identification and Authentication Failures), A08 (Software and Data Integrity Failures), A09 (Security Logging and Monitoring Failures) | Tier 0 / Tier 1 RBAC and RLS rows → A01; commit-identity discussion (§5.4 + §10 #10 of failure-modes research) → A07; Tier 2 dependency-upgrade row → A08; §5 audit-trail requirements → A09 |
| CIS Controls v8 | CIS 3 (Data Protection), CIS 4 (Secure Configuration), CIS 6 (Access Control Management), CIS 8 (Audit Log Management), CIS 17 (Incident Response) | Tier 1 production-data rows → CIS 3; Tier 2 CI/CD rows → CIS 4; Tier 1 RBAC / credential rows → CIS 6; §5 retention windows → CIS 8; §4 override → CIS 17 |
| DISA STIG | Application Security and Development STIG (categories CAT I, II, III) | Tier 0 maps to CAT I (severity 1) controls; Tier 1 maps to CAT II; Tier 2 / Tier 3 map to CAT III; the SD-009 alignment doc (forthcoming) carries the row-level mapping |

The mapping intentionally stops at "control area" granularity. Per-control-ID mapping is SD-009's job, not this policy's. Updating this section is a Type 4 re-evaluation trigger (adjacent control lands).

## §7 Re-evaluation triggers

Per SD-012 Lifecycle Integrity. This policy is a living document; "version: 0.1.0" reflects the current crystallization, not a final form. Re-evaluation fires on any of the conditions below; quarterly review is the floor.

### §7.1 Trigger types

**Type 1 — Incident-driven.** A new failure mode surfaces in production or in a postmortem and adds a Tier 1, 2, or 3 entry. The post-mortem (per §4.2) closes by updating this policy. Examples that would fire this:
- An athlete-data row is silently corrupted by a Tier 2 operation that should have been Tier 1; promotion of the operation class to Tier 1 is a Type 1 trigger
- A Tier 3 routine operation chain produces a Tier 1 outcome; the chain is added as a Tier 2 row noting the compounding risk

**Type 2 — Scope expansion.** A sub-system enters production scope, or multi-user scope expands. Specific named events:
- Lifting Tracker MVP launch with athlete data on Supabase production (post-Sprint-0d) — fires re-evaluation of §3.1 (the production-data condition in §3.2 must be promoted from speculative to operational), §5.2 (Tier 1 audit-trail components against actual production targets), §6.3 (bindfs reaper and hook references move from forthcoming to current)
- Coach features ship (post-MVP) — fires §2 review for any Coach-scope operations not anticipated today
- Fernando onboards as second human in the loop — fires §3.4 from placeholder to operational
- Gym admin or Super Admin role gains write access in production UI — fires §2 and §3 review of the elevated-permissions path

**Type 3 — Anthropic platform change.** Cowork, Claude Code, or the underlying Agent SDK ships a change that alters the technical control surface. Specific named possibilities:
- Worktree becomes the platform default — orchestration_v0.x.0.md §8 simplifies; this policy's §1 control matrix updates
- The deny-list mechanism changes (new pattern syntax, new placement) — Tier 0 implementation row in §2.1 updates
- Cowork ships a built-in approval-gate primitive for Tier 1 ops — §3.1 matrix updates to use the primitive instead of in-session text approval
- Claude Code ships a "production-mode" flag with stronger restrictions — Tier 1 ops may be gated by the flag

**Type 4 — Adjacent control lands.** A control referenced as forthcoming becomes operational. Specific:
- PreToolUse hook for `rm -rf` outside-worktree rejection (Sprint 0c3) — §2.1 row updates
- Branch protection rulesets enabled on `main` (Sprint 0c3) — §2.1 row updates
- Bindfs reaper installed (post-Sprint-0d2) — §1 control matrix updates; §2.1 may add a row for sandbox-cleanup ops
- SD-009 Security Controls Baseline lands (Sprint 0d1) — this policy is mapped as a row in that baseline; the cross-reference in §6.2 firms up
- Pre-commit gitleaks + GitHub Push Protection (Sprint 0c2 per failure-modes research §9.2) — §2.1 row added for "secret-bearing commits" as a Tier 0-equivalent block

**Type 5 — Quarterly review (floor).** Even with no other trigger, this policy is reviewed at every sprint-close starting Sprint 0c2. The review checks:
1. Are the tier rows still accurate? (Operations move tiers as recovery becomes easier or harder)
2. Are the cross-references still valid? (Forthcoming items become current; deprecated items get pruned)
3. Has the failure-modes research updated? (Re-check trigger; the research's `re_check_by` is 2026-07-28)
4. Has Anthropic's docs changed in a way that invalidates a §3 or §4 statement?
5. Are the kanban / git / platform-audit retention windows still configured per §5?

If none of the above produces a change, the version stays; if any does, version bumps per the standard discipline (patch for typos, minor for new tier rows or matrix changes, major for structural rewrites).

### §7.2 Re-evaluation outputs

Each re-evaluation produces:
1. **Updated frontmatter.** `updated:` to today's date; `version:` per change scope
2. **Changelog entry.** Inline at the bottom of the doc (or in a separate `CHANGELOG.md` if the changelog grows beyond ~20 entries)
3. **Cross-reference propagation.** Any doc that references this one (§6.1 and §6.2 entries) gets a touch if the change affects them
4. **Kanban audit-trail entry.** The sprint where the re-evaluation lands records the trigger and the change

### §7.3 Out of scope for re-evaluation (this version)

- Re-tiering as a wholesale structural change — the 0/1/2/3/4 framework holds until evidence forces a redesign; expanding within tiers is normal, redesigning across tiers is a major version bump
- Adding tiers below 0 (always-deny-with-confirmation, etc.) — speculative; not adding without trigger
- Adding tiers above 4 — there is no "lower than no restriction"; if read-only ops need restriction, it's a §2.1 row addition not a tier change

### §7.4 Re-evaluation log

Tracks every re-evaluation event for this policy. Entries are append-only; corrections to prior entries land as new entries that supersede.

| Date | Trigger type | Trigger detail | Outcome | Version after |
|---|---|---|---|---|
| 2026-04-30 | Initial authorship | Sprint 0c2 CC2 | Policy created | 0.1.0 |
| (next entry lands at first sprint-close after 2026-04-30, or sooner per §7.1 trigger) | — | — | — | — |

---

## §8 Open questions for next re-evaluation

These questions surfaced during initial authorship and are deferred to the first re-evaluation. Each ties to a §7 trigger.

1. **Tier 1 vs Tier 2 boundary on dependency upgrades** — currently >5 files = Tier 1, 1-5 = Tier 2. Is that the right cutoff? Type 5 (quarterly review) should test the boundary against actual sprint-by-sprint dependency-upgrade volume; if the boundary is wrong, adjust.

2. **Identity hygiene for agent commits** — failure-modes research §10 #10 asks whether agent commits should use a separate git config. This policy's §5.4 currently says "single-identity today; re-evaluate per §7." The first time identity confusion produces an audit-trail gap, that's the trigger.

3. **Cowork transcript retention dependency** — §5.7 names this as a single point of dependency. Type 4 trigger: when SD-009 baseline lands, the transcript retention requirement gets a row; if Anthropic's defaults are insufficient, alternative archival is needed (export-to-Eric's-storage, etc.).

4. **Multi-approver matrix activation** — §3.4 is a placeholder. The first Tier 1 op against a domain Fernando owns is the trigger to crystallize the matrix.

5. **Override drill cadence** — §4 documents override procedures but says nothing about practicing them. Failure-modes research §5.12 (drill / chaos engineering) recommends quarterly tabletop exercises. Open question for Type 5 review: does this policy require a synthetic-incident drill on a known cadence?

6. **Tier 0 list growth governance** — currently the deny list has ~70 entries. Open question: at what point does the deny list itself become hard to reason about? Is there a meta-pattern where Tier 0 entries cluster by intent and could be expressed more compactly via custom hooks (Sprint 0c3 work)? Trigger: Type 4 when the PreToolUse hook lands.

7. **Tier classification of plan-mode operations** — §3.2 says plan-mode is Tier 4 (read-only). But: a plan that, when executed, would be Tier 1 implicitly carries Tier 1 risk in the planning step itself (the plan could persuade Eric to authorize the wrong action). Open question: should plan-mode for Tier 1 ops carry its own Tier 2 review discipline (peer review of the plan itself)?

8. **Worktree-default interaction with Tier 2** — orchestration_v0.2.0.md §8 establishes worktree as default. §3.2 condition row "Operation runs in a worktree with no merge-back planned" lowers the tier. Open question: does the worktree default mean every Tier 2 op effectively starts at Tier 3 inside the worktree, only re-tiering at merge time? Or does the tier travel with the operation regardless of where it lands? Current interpretation: tier travels with the operation; merge-back is the moment the worktree's tier-equivalent op becomes the live tree's full-tier op.

These questions are not blockers for the policy's adoption. They are surfaced now so re-evaluation has a starting agenda.

---

## Changelog

- **0.1.0 (2026-04-30):** Initial reference. Tier 0–4 framework; approval matrix at solo+AI scale with Fernando-onboarding placeholder; override procedures with §4.2 documentation requirement; per-tier audit-trail; cross-references to failure-modes research §1.2 #3, §2.13, §5.2, §6, §9.2 and to SD-004, SD-009, SD-012. Sprint 0c2 CC2 deliverable.

---

© 2026 Eric Riutort. All rights reserved.
