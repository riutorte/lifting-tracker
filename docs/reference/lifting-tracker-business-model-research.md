---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
valid_as_of: 2026-04-24
re_check_by: 2026-10-24
tier: REFERENCE
content_class: research
---

# Lifting Tracker — Business Model Research & Recommendation

## 1. Executive Summary

- **Recommended tier and price.** Two consumer tiers — **Free** (workout logging, history, basic analytics, manual exercise entry) and **Pro at $5.99/mo or $39.99/yr** (~44% annual discount), with a **14-day Apple-managed free trial**. A future **Coach** tier is deferred to post-MVP; do not ship coach billing in MVP.
- **Recommended billing tech.** **Apple IAP at 15% (Small Business Program)** for the iOS app at MVP launch. Defer Stripe-direct on web until the web dashboard ships and the post-Epic appellate fee structure stabilizes. Revisit hybrid IAP-plus-external-link in 12–18 months at >$100K ARR.
- **Timing.** Three phases: closed alpha (free, current state) → public launch (Free + Pro live, IAP only) → coach SKU and web Stripe billing (post-Sprint 8, after observed retention data). Markers in §8.
- **Coach economics (Ethan-specific).** Free during alpha; at GA, lifetime free founder-coach account plus **25% recurring revenue share**, capped at **24 months per referred athlete**. Default coach-channel pattern at GA is **Pattern 2 (clients pay direct, coach earns rev share)**, not per-seat.
- **Top risk.** Pricing too low against the Hevy/Strong $2.99–$5/mo anchor relative to AI cost-of-goods. NL workout parsing is real LLM token spend; the $5.99/mo Pro tier survives only if AI usage is capped or metered per §9.

D9 (free for alpha; subscription later) holds. The research does not surface evidence to challenge it. What it does do is force specificity D9 leaves open: tier shape, price points, billing rail, trial length, coach mechanism. Those are pinned below.

---

## 2. Competitive Landscape

Top comps for Lifting Tracker, ranked by relevance. Source detail and full table in `outputs/research-batch1-competitors.md`.

| App | Model | Free tier | Paid mo / yr | Channel | Closest analog to | URL accessed 2026-04-26 |
|---|---|---|---|---|---|---|
| **Hevy** | Freemium | Unlimited workouts, 4 routines, 7 custom exercises, 3-mo history | $2.99 / $23.99 (lifetime $74.99) | IAP + Paddle web | **Direct** — same archetype | hevy.com/pricing |
| **Strong** | Freemium | Unlimited workouts, 3 routines | $4.99 / $29.99 (lifetime $99.99) | IAP / Google Play | **Direct** | help.strongapp.io |
| FitBod | Trial-then-paid | 3 free workouts | $12.99–15.99 / $79.99–95.99 | IAP primary | AI-programming differentiator (FitBod's hook) | fitbod.zendesk.com |
| Boostcamp | Freemium | 100+ programs, full logging free | $14.99 / $59.99 | IAP / Google | Programming-led upmarket | boostcamp.app/premium |
| JEFIT | Freemium | Logging + ads | $12.99 / $69.99 (intro $39.99) | IAP / Google | Ads-as-paywall (not our model) | jefit.com/elite |
| StrongLifts 5x5 | Freemium / trial | Free 5x5 program | yearly-led ~$59.99 | IAP / Google | Single-program app | stronglifts.com |
| Caliber | Freemium + paid coaching | Science-based program, tracking | Pro from $19/mo; Premium 1:1 coaching $200/mo | IAP for Pro; Stripe for coaching | Bifurcated AI / human tier — instructive | caliberstrong.com |
| Trainerize | Per-client tiered | Free entry | $23/mo (5 clients) → $248/mo Studio | Stripe direct (B2B) | Coach SKU reference | trainerize.com/pricing |
| TrueCoach | Per-client tiered | 14-day trial only | $26.34 → $136.99/mo | Stripe direct | Coach SKU reference | truecoach.co/pricing |
| Hevy Coach | Per-client tiered | 30-day trial | $25 → $160/mo | Stripe direct | Most relevant coach-platform (same company as direct comp) | hevycoach.com/pricing |
| Strava Premium | Freemium | Activity logging, social | $11.99 / $79.99 | IAP + Stripe web | Hybrid/general-fitness reference | strava.com/pricing |
| MyFitnessPal Premium | Freemium | Calorie log w/ ads | $19.99 / $79.99 | IAP + Stripe web | Hybrid reference | myfitnesspal.com/premium |

**Observations.** Solo-lifter apps cluster in two price bands: a low band ($2.99–$5/mo, $24–$30/yr) anchored by Hevy and Strong, and a programming-led band ($12–$16/mo, $60–$96/yr) anchored by FitBod, JEFIT, Boostcamp. **Lifting Tracker's archetype is the low band**; AI parsing alone does not justify FitBod-tier pricing without a corresponding programming product. Annual discounts run 33–67%; 40–50% is modal. Coach-platform B2B pricing is uniformly Stripe-direct and per-client tiered with breakpoints at ~5, ~20, ~50 clients. Channel split is clean: consumer apps use Apple IAP, coach platforms use Stripe-direct web checkout.

---

## 3. SaaS Pricing Benchmarks Applied

Six patterns considered (full discussion in `outputs/research-batch2-saas-apple.md`). Verdicts for Lifting Tracker:

- **Flat subscription** — viable as the simplest MVP shape. Single Pro tier, one price. Use this.
- **Per-seat** — wrong for athletes (one user per seat). Becomes relevant only when the Coach SKU ships, and even then per-managed-athlete is the right axis, not per-seat.
- **Per-action / usage-based** — partial fit only. AI parsing is real LLM token cost; a usage cap on Pro (e.g., 50 NL parses/month) protects margin without metered billing complexity. Do not bill per-action; bill flat with a usage ceiling and overflow handling.
- **Freemium** — strong fit and category norm. Free tier must be genuinely useful (workout logging + history) or it cannibalizes brand. ~3–5% free-to-paid conversion is the Health & Fitness benchmark per RevenueCat 2024.
- **Trial-then-paid** — secondary option. 14-day trial layered onto freemium converts best for habit products; 7-day is too short for a habit app, 30-day signals premium positioning the MVP doesn't have.
- **Hybrid (freemium + flat Pro + capped usage)** — the realistic 12–18 month endpoint. Ship as Free + Pro (flat) at MVP; add usage cap on AI; introduce Coach tier later.

**Annual vs monthly:** offer both. Annual at ~44% effective discount (matching Strava and Hevy). Conversion benchmark from RevenueCat: when both are offered, 30–50% of new H&F subscribers in pick annual. Cash-flow benefit of ~6.7 months upfront is meaningful at solo-dev scale.

**Trial duration:** 14 days. Apple's "Offer Free Trial" auto-converts unless cancelled — use it. RevenueCat H&F benchmarks: 7-day ~52%, 14-day ~38%, 30-day ~28% trial-to-paid. The 14-day choice trades raw conversion percentage for habit-formation runway, which is the right trade for a lifting app where the 2nd-week return signal matters more than the 1st-week conversion.

---

## 4. Apple Ecosystem Economics (2026 reality)

Three facts to anchor the billing decision:

**Fact 1 — Small Business Program threshold.** Apple takes **15% of proceeds for developers under $1M USD annual proceeds** (account-wide, not per-app). Stable since 2020. Cross $1M mid-year and you flip to 30% for the remainder; re-qualify the next calendar year. ([Apple SBP](https://developer.apple.com/app-store/small-business-program/), accessed 2026-04-26.)

**Fact 2 — Auto-renew bonus.** Subscriptions drop to 15% in year 2+ regardless of SBP. Combined with SBP, Lifting Tracker's effective Apple cut is **15% from day one** through any plausible MVP scale.

**Fact 3 — Post-Epic external-link status is in active flux.** The April 30, 2025 contempt ruling against Apple eliminated the 27%/12% external-link fee in the US. But on **December 11, 2025**, the U.S. Court of Appeals partially reversed that injunction — Apple can again charge "a reasonable commission" on external-link purchases, exact rate to be determined ([MacRumors coverage](https://www.macrumors.com/2025/12/11/apple-app-store-fees-external-payment-links/), accessed 2026-04-26). Apple's developer documentation as of April 2026 states US apps can link to external checkout without entitlement ([Apple StoreKit External Entitlement US](https://developer.apple.com/support/storekit-external-entitlement-us/), accessed 2026-04-26), but the fee structure for those external transactions is unsettled pending further proceedings.

**Implication for Lifting Tracker.** Building external-link checkout into MVP is a bet on legal stability that doesn't exist. IAP at 15% is a known cost; external-link is currently unknown. Take the known. Revisit at >$100K ARR or after the fee structure resolves, whichever comes first.

**EU DMA:** does not apply to Lifting Tracker MVP (US-only TestFlight alpha). Track for international expansion only.

**Tax compliance:** Apple is the merchant of record for IAP — collects, remits, and files all sales tax / VAT / GST globally. Effective compliance burden is zero. This is a real $3–5K/year saving at the $100K-revenue tier vs Stripe + Stripe Tax + filings, and the savings disappear only above ~$500K (see §6).

---

## 5. Coach-as-Channel Economics

**Affiliate / referral splits:** SaaS modal is **20–30% recurring** for B2B/coaching tools (Tapfiliate, Rewardful, ReferralCandy benchmarks). Consumer fitness apps run small or no public affiliate programs — Whoop has none; Strava has none; MyFitnessPal pays $5 per annual sub one-time (CPA, not recurring). The relevant precedent for Lifting Tracker is the SaaS benchmark, not the consumer-fitness one — because the coach is functioning as a sales channel, not an influencer.

**White-label premium:** Trainerize CBA $169 setup + monthly add-ons; Kajabi Branded App +$199/mo on top of $179–249 base; Mighty Pro fully branded ~$2,500/mo. White-label adds **2–5x** to base price. **Don't promise white-label in MVP** — it requires the coach to bring their own Apple Developer account ($99/yr each) and operate as a separate App Store listing. That's a coach-tier feature, not an athlete-MVP feature.

**Three coach-bring-clients patterns:**

1. **Per-seat (Trainerize, TrueCoach).** Coach pays per active client. Platform sells B2B; clients are free. Concentrates churn risk into single coach accounts.
2. **Clients pay direct, coach earns rev share.** Coach is referrer; client owns subscription. Distributes churn; aligns coach to platform retention.
3. **Flat license, unlimited clients (TrueCoach studio tier).** Coach pays high flat fee. Highest concentration risk; coaches over-add low-engagement clients.

**Pattern 2 is the right default for Lifting Tracker GA.** It preserves the architecture's athlete-as-primary-unit posture (D2/D4: athlete is the unit; cloud is source of truth), keeps the coach as recommender not gatekeeper (consistent with D12: nullable parent relationships), and avoids requiring a coach-side billing UX in MVP. Pattern 1 becomes available later as a Coach SKU; Pattern 3 is the wrong choice for a single-founder app due to concentration risk.

**Ethan-specific:** Free during alpha (he is a design partner, not a customer). At GA: **lifetime free founder-coach account** + **25% recurring revenue share on his referred athletes, 24-month cap per athlete**. Matches SaaS modal, gives Ethan retention skin-in-the-game without perpetual margin compression, and rewards his alpha contribution.

---

## 6. Composite Principle vs Monetization — Billing Tech Ranked

Composite principle dimensions: self-hostable, low-vendor-lock, AI/MCP-friendly, data-portable. Detailed analysis in `outputs/research-batch3-channel-billing.md`.

| Option | Take-rate | MoR | Lock-in | AI/MCP | Self-host | Grade for LT |
|---|---|---|---|---|---|---|
| **Apple IAP** | 15% (SBP) | Yes (Apple) | High (no customer email/PM) | Mediocre | No | **B (iOS-only) / D (web)** — forced choice on iOS |
| **Custom Stripe wrapper** | ~3.9% all-in | No | Low at wrapper, moderate at processor | **Best-in-class** (Stripe MCP server, Agent Toolkit) | Wrapper yes, processor no | **A** for web |
| **Stripe direct (no wrapper)** | ~3.9% all-in | No | Moderate | Best-in-class | No | **A-** — wrapper preferred for portability |
| **Paddle** | ~5% + $0.50 | Yes | Moderate-high (MoR re-bill problem) | Good (own MCP server, 2026) | No | **B+** — viable if MoR is wanted |
| **Lemon Squeezy** | 5% + $0.50 | Yes | Moderate-high; acquired-orphan risk | Standard REST, no MCP | No | **B** — Stripe acquisition (2024) muddies roadmap |
| **Killbill (OSS)** | $0 software + processor cost | No | **Lowest** | Mixed; no first-party MCP | **Yes** | **C** — aligned with composite principle, misaligned with solo-dev capacity |

**Recommendation matrix:**

- **iOS-only path (MVP):** Apple IAP at 15% SBP. Forced by Apple. The 15% buys Apple-as-MoR + global tax compliance, which Stripe-direct would cost ~3.9% + tax-filing-overhead to replicate. At MVP scale, IAP wins on TCO.
- **Web-first or web+iOS (post-MVP):** Custom Stripe wrapper on web (subscription state in Supabase Postgres), Apple IAP on iOS, reconciliation via RevenueCat or custom bridge.
- **Composite principle dominates:** Custom Stripe wrapper, not Killbill. Killbill nominally satisfies self-host but adds operational debt incompatible with solo+AI scale. Custom wrapper keeps state in own DB while inheriting Stripe's MCP/agent tooling — wins on three of four composite dimensions (self-host of state, low lock-in, AI-friendly), trades only the fourth (processor self-host) which Killbill doesn't actually provide either.

**Lock-in note:** the deepest lock-in across all MoR options (Paddle, Lemon Squeezy, Apple IAP) is **the customer payment relationship** — migrating off requires re-vaulting/re-authorizing every customer because payment-method tokens are not portable between MoR and non-MoR processors. Stripe-direct keeps that relationship with you, even if Stripe-as-processor is itself replaceable only via re-vault.

---

## 7. Specific Recommendation

### 7a. Tiers and prices (consumer)

| Tier | Price | What's included | What's gated above |
|---|---|---|---|
| **Free** | $0 | Unlimited workout logging; full session/exercise/set history (no depth limit); manual exercise entry from full library; basic analytics (volume per session, PR detection); single device; 5 NL parses/month | n/a |
| **Pro** | **$5.99/mo or $39.99/yr** (44% annual discount) | Everything in Free + unlimited NL workout parses (soft cap 200/mo, see §9); AI session summaries; advanced analytics (volume trends, fatigue, plateau detection); multi-device sync; CSV export; routine library | Coach features (deferred to Coach SKU) |
| **Coach** *(deferred)* | TBD post-MVP | Coach-side dashboard, athlete management, programming tools | n/a |

**Free tier scope rationale.** Hevy/Strong both gate routine count or history depth in their free tiers. Lifting Tracker's differentiator is per-set granularity (D2) plus NL parsing — gating history depth would undercut the per-set value prop. Instead, gate the AI surface (5 parses/mo on Free is enough to evaluate, not enough to live on) and the multi-device sync. This makes the upgrade trigger clear: "I want to log workouts the natural-language way" or "I want my data on phone and laptop."

**Trial:** 14-day Apple-managed free trial on first subscription. Auto-converts to paid unless cancelled (Apple default behavior). Available on both monthly and annual SKUs.

**Annual discount:** 44% effective discount ($5.99 × 12 = $71.88 vs $39.99 = 44% saving). Matches Hevy and Strava precedent. Don't go higher than 50%; signals desperation and undercuts monthly perception.

### 7b. Billing tech

- **iOS:** Apple IAP only. SBP-qualified (under $1M proceeds). 15% Apple cut.
- **Web (when shipped):** Custom Stripe wrapper. Subscription state in Supabase Postgres. Stripe Tax for collection. Reconcile entitlements with iOS via RevenueCat or custom bridge.
- **Do not:** ship external-link checkout in MVP. The post-Epic appellate fee is unsettled (December 2025 reversal pending further proceedings); waiting costs nothing.

### 7c. Ethan + future coach economics

- **Ethan during alpha:** free, no contractual obligation. He is a design partner.
- **Ethan at GA:** lifetime free founder-coach personal account. **25% recurring revenue share** on athletes he refers (tracked by referral code or signup attribution). **24-month cap per referred athlete** — after 24 months, the athlete remains a paying user; Ethan no longer collects on that specific athlete.
- **Future coaches (post-MVP, Coach SKU):** open referral program at 20% recurring, 12-month cap. Ethan's 25%/24-month is the founder-tier bonus, not the standard.
- **Coach SKU pricing (when shipped):** Pattern 2 default — coaches don't pay; athletes pay direct; coaches earn rev share. Add a Pattern-1 option for coaches who want to pay-for-clients (gym/studio model) at TrueCoach-comparable pricing (~$25/mo for 5 clients, scaling).

---

## 8. Phased Rollout

| Phase | Marker | Pricing state | Billing rail | Tasks |
|---|---|---|---|---|
| **Phase 0 — Closed Alpha** *(current, Sprint 1–4)* | TestFlight invite-only, ~5 users | Free, no monetization code | None | Build core athlete experience; instrument retention; observe NL parse usage to size cap |
| **Phase 1 — Public Free Launch** *(Sprint 5–6)* | App Store public listing; signup limited but no invite required | Free tier only, no Pro tier yet, "Pro coming soon" placeholder | None | Validate broader user demand; harden data model under load; build IAP scaffolding |
| **Phase 2 — Pro Launch** *(Sprint 7–8)* | First Pro IAP SKU live | Free + Pro live; 14-day trial | **Apple IAP only** (15% SBP) | Submit IAP product configuration; A/B test paywall trigger placement; monitor trial-to-paid conversion against RevenueCat H&F benchmark (~38%) |
| **Phase 3 — Web + Coach** *(Post-Sprint 8, ~9–12 months post-MVP)* | Web dashboard ships; first coach SKU | Free + Pro + Coach (Pattern 2) | IAP on iOS; **custom Stripe wrapper** on web; RevenueCat for reconciliation | Build Stripe wrapper; ship Coach SKU; onboard Ethan formally as founder-coach |
| **Phase 4 — Hybrid billing review** *(Trigger: $100K ARR or appellate clarity, whichever first)* | Revenue threshold or legal milestone | Tier structure stable; revisit billing rail | Optionally add IAP-plus-external-link hybrid on iOS | Compute IAP-vs-external savings against engineering cost; decide whether to add web-checkout link inside iOS app |

**Markers are measurable.** Sprint numbers reference `docs/roadmap_v0.4.0.md`. Revenue trigger is gross collected, before Apple cut. Appellate clarity = US Supreme Court denial of cert or final 9th Circuit ruling on the December 2025 reversal.

---

## 9. Risks and Tripwires

1. **AI cost-of-goods erodes Pro margin.** NL workout parsing and AI summaries are real LLM token spend. At $5.99/mo with $0.50/mo gross cost (rough estimate at GPT-4-class quality, moderate usage), margin is thin. **Tripwire:** if median Pro user exceeds 100 NL parses/mo, raise the soft cap to a hard cap or move AI to a metered overage. Monitor before Pro launch and quarterly thereafter.

2. **Pricing too low against AI value.** $5.99/mo anchors to Hevy/Strong, which don't have AI. If the AI-parse experience is genuinely 10x better than typing sets, $5.99 leaves money on the table. **Tripwire:** post-launch survey — if >40% of paying users say they'd pay 2x current price for the AI experience alone, pilot a $9.99 tier on annual signups (avoids Apple price-change disruption to existing monthly subs).

3. **Pricing too high against established free apps.** Hevy lifetime is $74.99 and FitNotes is fully free. A $5.99 monthly recurring may not convert against those anchors. **Tripwire:** if free-to-paid conversion under 2% (vs ~3–5% benchmark) by month 3 of Phase 2, run a $3.99/mo experiment as fallback before considering a content/feature pivot.

4. **App Store rejection on coach-tier billing.** When the Coach SKU ships, if it routes athlete payments through Stripe-on-iOS (Pattern 2 implementation), Apple may reject for circumventing IAP — depending on how the appellate dust settles. **Tripwire:** before Coach SKU build-out, get an explicit Apple Review pre-determination. If unfavorable, route coach-side billing entirely through web; clients subscribe via web only, sync entitlement to iOS via RevenueCat.

5. **Free-tier cannibalization.** If the Free tier is too generous (full multi-device sync, unlimited AI), users won't upgrade. The current §7a draws the line at 5 NL parses/mo and single-device — verify this is sufficient gating. **Tripwire:** trial-start rate below 8% of new signups indicates the free tier is too sticky; tighten gating on next App Store submission.

6. **Ethan churns or under-refers, leaving rev-share infra unused.** The 25% rev-share build is wasted if no other coach onboards and Ethan doesn't actively refer. **Tripwire:** at 6 months post-Coach-SKU launch, if total referred-athlete count is under 10, defer further coach acquisition investment; revisit the channel only when athlete-side product-market fit is proven independently.

7. **Subscription chargebacks and refund policy.** Apple grants refunds liberally; chargebacks via Apple are unilateral. Build the budget assuming a 5–10% refund rate on annual subs in the first 14 days. **Tripwire:** refund rate above 15% indicates onboarding/value-delivery problem, not pricing problem; address with onboarding redesign, not price cuts.

8. **Tax exposure during web-checkout phase.** When Stripe-direct goes live (Phase 3), sales-tax economic-nexus thresholds become live obligations once revenue scales (typically $100K/state, but RI/MA/MD/VA at $600). **Tripwire:** at $50K total Stripe-direct ARR, engage Stripe Tax + a state-filing service (TaxJar/Anrok). At $250K, retain a CPA familiar with multi-state SaaS.

---

## 10. Open Questions / Follow-Up Research

1. **Cost-per-NL-parse modeling.** Sprint 1–4 instrumentation must capture LLM token spend per workout entry. Without this number, the §9 risk #1 tripwire is uncalibrated.
2. **App Store pre-determination on Pattern 2 coach billing.** Submit the question to Apple Review before Phase 3 to remove the rejection risk in §9 #4.
3. **Post-Epic appellate trajectory.** The December 11, 2025 reversal is being further litigated. Re-check by 2026-10-24; if Apple's external-link commission lands at 5% or below, reconsider Phase 4 economics.
4. **RevenueCat State of Subscription Apps 2025/2026 edition.** If published, refresh the trial-conversion and annual-conversion benchmarks in §3.
5. **Lemon Squeezy product status post-Stripe acquisition.** If LS is sunset into Stripe Managed Payments during 2026, the §6 grade should be revised.
6. **EU expansion economics.** When/if Lifting Tracker expands to EU, DMA alternative payment terms (10% or 17% commission, Core Technology Fee) materially change the math. Defer until expansion is on the roadmap.
7. **Coach SKU pricing exact points.** §7c says "TrueCoach-comparable" — this should be pinned to specific dollar amounts before Coach SKU implementation, in a follow-up doc.

---

## Sources

- Apple Small Business Program — https://developer.apple.com/app-store/small-business-program/ (accessed 2026-04-26)
- Apple StoreKit External Purchase Link Entitlement (US) — https://developer.apple.com/support/storekit-external-entitlement-us/ (accessed 2026-04-26)
- Apple App Store Review Guidelines — https://developer.apple.com/app-store/review/guidelines/ (accessed 2026-04-26)
- MacRumors, "Apple Wins Ability to Charge Fees on External Payment Links as Appeals Court Modifies Epic Injunction" — https://www.macrumors.com/2025/12/11/apple-app-store-fees-external-payment-links/ (accessed 2026-04-26)
- RevenueCat State of Subscription Apps 2024 — https://www.revenuecat.com/state-of-subscription-apps-2024/ (accessed 2026-04-26)
- Hevy pricing — https://hevy.com/pricing (accessed 2026-04-26)
- Strong Pro — https://help.strongapp.io/article/132-strong-pro (accessed 2026-04-26)
- FitBod subscriptions — https://fitbod.zendesk.com/hc/en-us/sections/1500000506081-Subscriptions (accessed 2026-04-26)
- Boostcamp Premium — https://www.boostcamp.app/premium (accessed 2026-04-26)
- JEFIT Elite — https://www.jefit.com/elite (accessed 2026-04-26)
- Trainerize pricing — https://www.trainerize.com/pricing/ (accessed 2026-04-26)
- TrueCoach pricing — https://truecoach.co/pricing/ (accessed 2026-04-26)
- Hevy Coach pricing — https://hevycoach.com/pricing/ (accessed 2026-04-26)
- Strava pricing — https://www.strava.com/pricing (accessed 2026-04-26)
- MyFitnessPal Premium — https://www.myfitnesspal.com/premium (accessed 2026-04-26)
- Stripe pricing — https://stripe.com/pricing (accessed 2026-04-26)
- Stripe Tax — https://stripe.com/tax (accessed 2026-04-26)
- Stripe Building with AI — https://docs.stripe.com/building-with-ai (accessed 2026-04-26)
- Lemon Squeezy fees — https://docs.lemonsqueezy.com/help/getting-started/fees (accessed 2026-04-26)
- Stripe acquires Lemon Squeezy — https://www.lemonsqueezy.com/blog/stripe-acquires-lemon-squeezy (accessed 2026-04-26)
- Paddle pricing — https://www.paddle.com/pricing (accessed 2026-04-26)
- Paddle Docs MCP server — https://developer.paddle.com/changelog/2026/docs-mcp (accessed 2026-04-26)
- Killbill — https://killbill.io/ (accessed 2026-04-26)
- Tapfiliate SaaS commission guide — https://tapfiliate.com/blog/a-complete-guide-for-saas-affiliate-commissions/ (accessed 2026-04-26)
- Acceleration Partners MyFitnessPal — https://www.accelerationpartners.com/affiliate-programs/myfitnesspal/ (accessed 2026-04-26)
- Avalara economic nexus state-by-state — https://www.avalara.com/us/en/learn/guides/state-by-state-guide-economic-nexus-laws.html (accessed 2026-04-26)
- Stripe 1099-K (2026 thresholds) — https://docs.stripe.com/connect/1099-K (accessed 2026-04-26)

Underlying research notes (for parent-doc verification, not user-facing):
- `outputs/research-batch1-competitors.md`
- `outputs/research-batch2-saas-apple.md`
- `outputs/research-batch3-channel-billing.md`

---

© 2026 Eric Riutort. All rights reserved.
