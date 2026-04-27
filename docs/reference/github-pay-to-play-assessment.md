---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# GitHub Pay-to-Play Assessment — Migration Urgency for a Solo Developer

## 1. Executive summary

**Recommendation: Begin passive migration preparation now; complete active migration within 12–18 months (by late 2027). Target decisive move in the 9–15 month window.**

- Microsoft has crossed from price-adjustment into structural repricing. The 2025 GHAS unbundling, the 2026-01-01 Actions hosted-runner re-pricing, the attempted (and paused) 2026-03-01 charge on self-hosted runner minutes, and the 2026-04-20 pause on new Copilot Pro/Pro+/Student sign-ups are four separate pricing-surface moves inside 18 months. Direction is clear even when individual moves are walked back.
- The governance signal is stronger than any single price change. Dohmke exited August 2025; Microsoft explicitly will not replace him; GitHub folds into the CoreAI division under Jay Parikh (ex-Meta), with ~10% headcount reduction and all physical offices closing. GitHub is no longer managed as a developer platform — it is now a distribution channel for CoreAI products.
- For a solo dev on public + some private repos with light Actions use, the direct bill impact in the next 12 months is near-zero. Urgency is governance and optionality, not cost.
- The sticky migration risk is Actions workflow syntax drift and third-party action references (not data portability — Git is Git, and Gitea/Forgejo import GitHub issues/PRs/wiki cleanly).
- Start today: Codeberg (Forgejo) passive mirror, portable secrets, Actions workflows written against the common subset. These cost zero and preserve the option to move under pressure rather than under compulsion.

## 2. Concrete pricing changes timeline (2023 — April 2026)

| Date | Change | Tier affected | Source |
|---|---|---|---|
| 2023-01 | Copilot for Business launched at $19/user/mo alongside existing $10/mo Individual | Copilot | docs.github.com/en/copilot |
| 2024-08-01 | Metered billing introduced for GitHub Enterprise and GHAS (consumption model) | Enterprise / GHAS | github.blog/changelog/2024-08-01 |
| 2024-11-15 | LFS free allowance raised to 250 GiB storage / 250 GiB bandwidth on all plans | Free/Pro/Team | docs.github.com/packages |
| 2025-03-04 | GHAS unbundled into Secret Protection ($19/committer/mo) and Code Security ($30/committer/mo); now purchasable on Team plan, previously Enterprise-only | Team / Enterprise | github.blog/changelog/2025-03-04 |
| 2025-04-18 | Copilot Pro+ tier launched at $39/mo (sits above $10 Pro); premium-request model introduced | Copilot Individual | github.com/features/copilot/plans |
| 2025-06-18 | Premium-request billing becomes active on github.com; $0.04/request overage | Copilot paid plans | docs.github.com/en/billing |
| 2025-08-01 | Premium-request billing active on GHE.com | Copilot Enterprise | github.blog/changelog |
| 2025-08 | Dohmke announces departure; GitHub to fold into Microsoft CoreAI | Governance | geekwire.com/2025 |
| 2025-08 | ~10% layoffs, global office closures announced | Governance | channelfutures.com |
| 2025-12-16 | Announcement: Actions pricing restructure for 2026 — hosted-runner price cuts + new $0.002/min control-plane charge for self-hosted runners | Actions | github.blog/changelog/2025-12-16 |
| 2026-01-01 | Hosted-runner prices reduced up to 39%; free minute quotas preserved | Actions paid overage | github.com/resources/insights |
| 2026-03-01 | Self-hosted runner $0.002/min charge **postponed indefinitely** after backlash | Actions (all) | devclass.com; samexpert.com |
| 2026-04-20 | New sign-ups to Copilot Pro, Pro+, and Student **paused**; Opus models removed from Pro; Opus 4.5/4.6 removed from Pro+ | Copilot Individual | github.blog/news-insights |

Primary direction of travel: from flat-rate pricing toward metered / consumption / token-based billing across both Copilot and Actions. The self-hosted-runner retreat shows GitHub will walk back the most egregious charges under pressure; it does not show they have abandoned the direction.

## 3. Copilot pricing evolution

| Era | Model | Individual price | Included usage | Overage |
|---|---|---|---|---|
| 2022–2024 | Flat-rate | $10/mo | Unlimited completions + chat | None |
| 2024 | Free tier added | $0 / $10 | Free: 2,000 completions + 50 chat messages/mo | N/A |
| 2025-04 | Tiered + premium requests | $10 / $39 | Pro: 300 premium requests; Pro+: 1,500 | $0.04 per premium request |
| 2025-06 | Premium-request billing live | same | same | billing active on .com |
| 2026-04 | Sign-ups paused; model gating | same | Opus removed from Pro; Opus 4.7 only in Pro+ at 7.5× multiplier | same |

Forward signal: Microsoft internal docs (reported by Ed Zitron, wheresyoured.at) indicate a planned shift from request-metered to **token-metered** billing, citing weekly Copilot operating costs roughly doubling across 2025. The April 2026 sign-up pause was framed officially as "capacity management" but functionally freezes the cohort Microsoft is losing money on while it re-prices.

Relevance to Eric: none directly (uses Claude Code, not Copilot). But the Copilot economics drive the broader Actions + platform repricing, because Copilot Cloud Agent runs inside Actions-hosted sandboxes.

## 4. Free-tier restrictions (status as of April 2026)

| Resource | Free tier allowance | Overage |
|---|---|---|
| Private repos | Unlimited | — |
| Collaborators | Unlimited | — |
| Actions minutes (private repos) | 2,000/mo (Linux equivalent) | Per-minute, paid |
| Actions on public repos | Free, unchanged | — |
| Packages storage | 500 MB | $0.25/GB/mo |
| LFS storage/bandwidth | 250 GiB / 250 GiB (raised Nov 2024) | $5/mo per extra 50 GB combined |
| Codespaces | 60 core-hours + 15 GB storage | Paid (not used by Eric) |
| Dependabot alerts | All repos, public + private | Free |
| Secret scanning (push protection) | Public repos free; private = paid | GHAS Secret Protection $19/committer/mo |
| Code scanning (CodeQL) | Public repos free; private = paid | GHAS Code Security $30/committer/mo |
| Pages | Free for public repos; private requires Pro/Team | — |
| Copilot (non-agentic) | 2,000 completions + 50 chat/mo | Paid plans paused for new signups |

For Eric's profile (code hosting + Issues + light Actions + Packages + occasional Pages, mix of public/private), the free tier in April 2026 is still functional. The only directly-felt pinch point over the next 12 months is Actions minutes on private repos if Actions usage grows.

## 5. Enterprise and GHAS dynamics

GHAS was the clearest signal of the repricing pattern before Actions. Timeline:

- Pre-2025: GHAS was a single add-on, Enterprise-only, priced per committer.
- 2025-04-01: Unbundled into two SKUs. Made purchasable on the Team plan. Moved to metered billing. Packaging change (Copilot Autofix bundled into Code Security) anchored the $30 price point against competitive alternatives.

Mechanism: Take a single bundled product, split it, raise the combined price, expand the addressable market by exposing it below Enterprise. Then pull selected features (e.g., push protection) into the paid SKU while leaving the "alerts" shell free. Dependabot alerts remain free; advanced Dependabot features (auto-triage rules, private-registry support) are now Code Security. Secret scanning on public repos remains free; private-repo secret scanning requires Secret Protection.

For a solo dev, none of this is billable today. The signal is that the same template will be applied elsewhere. The Actions pricing announcement of December 2025 follows the same playbook: reshape the pricing surface, add a new meter, reduce a headline number, net-expand the billable surface.

## 6. Microsoft's public signaling (April 2023 — April 2026)

**Dohmke (then-CEO, August 2024, TechCrunch interview)**: "In 2026, any leader needs to think about head count no longer just as salaries and benefits and travel and expenses, but tokens." — Frames the strategic shift: compute cost is the unit of account, not seats.

**Dohmke (August 2025 exit statement, paraphrase)**: GitHub should become a "developer-first engineering system for the world of tomorrow with a strong focus on AI." Notable for what it omits: no commitment to a free-tier floor, no commitment to the flat-rate Copilot plan, no mention of non-AI developers.

**Microsoft (August 2025, per GeekWire)**: GitHub's leadership will report into the CoreAI division led by Jay Parikh; Dohmke will not be replaced. Paraphrased structural signal: GitHub is being operated as an AI distribution surface, not a standalone developer product.

**GitHub changelog (2025-12-16, paraphrase)**: Framed the 2026 Actions changes as "simpler pricing and a better experience," while introducing a new per-minute charge that applied even when customers ran compute on their own hardware. The backlash forced a walk-back of the self-hosted charge, but not of the direction.

**GitHub blog (2026-04-20, paraphrase)**: The Copilot individual plan changes cite "a handful of requests" regularly exceeding monthly plan cost. Translated: flat-rate pricing is dead at the top of the usage curve, and the pause is how Microsoft stops accepting the losses while re-pricing.

Unverified but credible reporting (Ed Zitron, *Where's Your Ed At*, 2025): Microsoft internal decks target token-metered billing as the end state. Treat as directional signal, not confirmed policy.

## 7. Community sentiment — signal-to-noise

**Signal (high weight):**
- The Actions self-hosted-runner retreat (HN threads on news.ycombinator.com/item?id=46291156, December 2025): GitHub acknowledged in the thread that they "missed the mark" on stakeholder consultation before announcing the charge. This is the most useful single data point — it shows both the intent and the ceiling of what the market will tolerate.
- Community discussion #164026: users hitting premium-request limits in 6 days and calling the $0.04 overage "exorbitant." Verified via the forum thread.
- HN thread on Copilot individual-plan changes (item=47838508, April 2026): tone moved from "annoyed" to "when do we leave."

**Noise (low weight):**
- Generic "Microsoft is enshittifying GitHub" takes. The pattern exists; the prose doesn't add evidence.
- GitLab/Gitea marketing pages framing every GitHub move as validation. Cite their facts, discard their framing.
- Mastodon threads: directionally aligned with HN but smaller n; useful only as tone confirmation.

Net: community sentiment has moved from "grumbling" in 2023 to "actively evaluating alternatives" in April 2026. This is reactive, not predictive — it tracks the pricing moves, it doesn't lead them.

## 8. Microsoft acquisition pattern (kept short)

| Acquisition | Year | Pattern observed |
|---|---|---|
| LinkedIn | 2016 | Premium tier grew from ~$29.99 to $39.99/mo; continuous feature reshuffling into paid; $2B premium revenue run-rate by Jan 2025 |
| Skype | 2011 | Feature erosion over a decade; consumer Skype shut May 2025; users pushed to Teams |
| Nuance | 2022 | Folded into Azure AI; Dragon consumer line deprioritized |
| Activision | 2023 | Game Pass bundling; price increases on Game Pass Ultimate in 2024 and 2025 |

Pattern (not prediction): Microsoft acquisitions tend to preserve the free/entry tier long enough to maintain network effect, then reshape the paid surface once the platform is load-bearing for a Microsoft strategic priority. GitHub is now load-bearing for CoreAI. The LinkedIn template — keep the free tier functional, monetize heavily on top — is the closest analog and is consistent with the 2025–2026 GitHub moves.

This section is a tiebreaker, not primary evidence. The primary evidence is §2 and §6.

## 9. Migration-relevant facts — stickiness, tooling, what breaks

| Capability | Portability | What breaks in migration |
|---|---|---|
| Git repository (code + history) | Fully portable | Nothing |
| Issues / PRs / labels / milestones | Portable via Forgejo and GitLab importers | PR review threads and cross-references preserved best-effort |
| Wiki | Portable | Link rewrites needed |
| Releases / tags | Portable | Release asset binaries must be re-uploaded |
| Discussions | **Not portable** — no official exporter | Full loss; Eric does not use this |
| Actions workflows (syntax) | ~80% portable to Forgejo/Gitea Actions | See below |
| Third-party Action references | Requires rewrite | `uses: owner/action@v1` → full URL `https://github.com/owner/action@v1` on Forgejo |
| Actions marketplace | Not mirrored | Most actions work via URL reference; some proprietary ones won't |
| Secrets | Re-enter manually on target | Not exportable, by design |
| Packages (npm/container/Maven) | Requires re-publish to new registry | CI config updates |
| Pages | Portable to Codeberg Pages / GitLab Pages / Cloudflare Pages | DNS + CNAME updates |
| OAuth apps / GitHub App integrations | Not portable | Rebuild against new platform |
| Dependabot | No direct equivalent; Forgejo has `renovate` compatibility | Switch to Renovate Bot |
| Social graph (stars, followers) | Not portable | Lost; low value for Eric's profile |

Migration tooling, April 2026:
- **Forgejo**: built-in "migrate from Gitea" + GitHub importer (repos, issues, PRs, wiki, releases, milestones, labels). Mature.
- **GitLab**: GitHub importer mature, well-documented. Handles Actions → GitLab CI conversion poorly (manual rewrite required).
- **Codeberg**: Forgejo-based public instance; free for FLOSS projects. Good passive-mirror target.
- **Community tooling**: `gh-migrate`, `github-to-gitea-migrator`, `visteras/gitea-to-forgejo-migrator` — functional, solo-maintained.

Biggest sticky features for Eric specifically: Actions workflow compatibility (manageable), Packages re-publishing (one-time), and loss of GitHub's network effect for any OSS release (minor for private project like Lifting Tracker).

## 10. Timeline recommendation

**Active migration window: 9–15 months from today (Jan 2027 – July 2027). Final cutover no later than end of Q4 2027.**

Reasoning:

- **0–3 months (now through July 2026):** No bill impact. Governance signals are strong but the platform itself is still functional and free for Eric's usage. Use this window for zero-cost optionality work (§11), not migration itself.
- **3–9 months (Aug 2026 – Jan 2027):** Watch for three tripwires — (1) Copilot sign-up pause either lifts with a new pricing model or extends; (2) the postponed self-hosted Actions charge returns in a different form; (3) further GHAS-style unbundling of currently-free features (e.g., push-protection defaults, Dependabot auto-triage). Any two firing = move up the timeline.
- **9–15 months (Feb 2027 – July 2027):** Execute migration if tripwires fire or if Lifting Tracker is pre-launch (lower data cost to move). If nothing has fired and MVP has shipped, execute anyway — moving post-launch is harder than moving pre-launch, and the governance trajectory is unchanged.
- **Beyond 15 months:** Platform risk compounds. Every additional month increases dependency on GitHub-specific features (Actions, Packages, Pages) that make migration more expensive.

Why not sooner (0–9 months): Migration cost is real. Eric is solo and pre-MVP. Burning a sprint on tooling migration before first product value ships is the wrong trade.

Why not later (>18 months): Microsoft's acquisition pattern (§8) and the AI-economics pressure (§6) both point toward the next pricing surface change landing inside 2027. Moving under a deadline costs more than moving on a schedule.

Confidence: moderate-high on the direction of travel; lower on exact timing. The 9–15 month recommendation has ±3 months of uncertainty that tripwires will resolve.

## 11. Minimum viable preparation to start NOW — zero-cost concrete actions

Do these this week. All free. All preserve optionality without committing to migration.

1. **Create a Codeberg account** (Forgejo-based, free for FLOSS, no credit card). Create an empty `lifting-tracker` repo there as migration target.
2. **Set up a passive mirror**: On Codeberg, configure the new repo as a *pull mirror* from the GitHub origin. Runs every 8 hours. Zero GitHub-side config required, no webhook, no token from GitHub side needed beyond a read-scope PAT.
3. **Write Actions workflows against the common subset**: Avoid GitHub-proprietary actions where a simple `run: bash` step works. For third-party actions, pin to specific SHAs — makes rewrite to `https://github.com/owner/action@sha` on Forgejo trivial.
4. **Portable secrets pattern**: Keep all secrets in 1Password/Bitwarden (source of truth), inject into GitHub Secrets as a derivative. Re-injecting into a new platform is a 15-minute task, not a discovery exercise.
5. **Don't use GitHub Discussions.** If community Q&A is needed later, use GitHub Issues with a `discussion` label — portable. Discussions are the one feature with no migration path.
6. **Don't use GitHub Packages for anything load-bearing.** For Lifting Tracker, package distribution runs through Expo/EAS (iOS) and Vercel (web) — neither touches GitHub Packages. Keep it that way.
7. **Document the Supabase/Vercel/EAS coupling.** These are the real platform dependencies. GitHub is, structurally, only the Git host + CI runner for this project. Keeping that boundary clean keeps migration cost linear.
8. **Calendar a 3-month re-evaluation** (July 2026). Re-read §2, §6, §12. Update this doc's `updated:` field.

None of these actions require deciding to migrate. They only make migration cheap if decided later.

## 12. Open questions / signals to watch — recheck in 3 months

Tripwires, ordered by diagnostic value:

1. **Does the self-hosted Actions control-plane charge return?** Any form — rebadged, reduced, bundled. If yes: direction is confirmed, accelerate timeline.
2. **What replaces the Copilot sign-up pause?** Token-metered billing → strongest signal of end-state direction per §6. Flat-rate return → weakens urgency. Hybrid with low free cap → neutral.
3. **GHAS-pattern on a currently-free feature.** Watch for any "X is now part of [new paid SKU]" where X was previously free. Candidates: Dependabot auto-triage, push protection defaults, code scanning baseline, Pages custom domains.
4. **CoreAI integration depth.** Does GitHub's UI start requiring or defaulting to Microsoft identity / Azure auth? That would indicate GitHub losing independent product surface.
5. **Codeberg / Forgejo capacity.** If migrations accelerate industry-wide, Codeberg may tighten free-tier limits for non-FLOSS projects. Monitor Codeberg's blog and Forgejo release notes.
6. **Second-order: does Gitea (Xcellerate-backed commercial) diverge further from Forgejo (community)?** This affects the self-host vs. Codeberg decision downstream.
7. **Unresolved:** Is there any public Microsoft commitment to preserving a free tier of Git hosting for private repos? Answer from primary sources: no explicit floor commitment since 2020. Inferred: LinkedIn pattern suggests the free tier survives, but features erode.

**Next review: 2026-07-23.**

---

© 2026 Eric Riutort. All rights reserved.
