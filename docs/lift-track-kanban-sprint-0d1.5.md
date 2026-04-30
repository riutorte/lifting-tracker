---
author: Eric Riutort
created: 2026-04-30
updated: 2026-04-30
tier: OPERATIONAL
content_class: operational
sprint: 0d1.5
sprint_name: Hetzner Phase 1 Self-Hosted Supabase Stand-Up
sprint_dates: TBD → TBD
sprint_open_date: TBD
duration_days: TBD
status: drafted
---

# XRSize4 ALL / Lifting Tracker — Kanban (Sprint 0d1.5)

Per CONVENTIONS_v0.2.4 §8 + §14.2, this is Sprint 0d1.5's per-sprint kanban. **Drafted ahead of sprint open from three converging research streams:** the strategic-implications hosting analysis (`portfolio-strategic-implications-and-ownership-trajectory-research.md`), the layered-storage architecture research (`data-storage-and-archiving-strategy-research.md`), and the four-environment topology research (`environment-strategy-and-promotion-demotion-architecture-research.md`) — all of which converge on SD-014 (strategic hosting + storage stance) and SD-015 (four-environment topology + promotion / demotion architecture). Sprint 0d1.5 operationalizes the Phase 1 portion of SD-014 and the Phase 1 hybrid-topology portion of SD-015. Finalized at the actual sprint-open commit when Sprint 0d1 closes (or earlier if 0d1.5 opens parallel per OQ7 below). Frozen at sprint close as the immutable record.

## Sprint 0d1.5 — Hetzner Phase 1 Self-Hosted Supabase Stand-Up

**Theme:** Per SD-014 + SD-015. The hosting + storage strategy is decision-grade as of 2026-04-28 and the four-environment topology composes it into operational instances. Sprint 0d1.5 is the **stand-up sprint**: it materializes Phase 1 hosting (Hetzner Cloud Option D hybrid — CCX23 prod + CCX23 coop in different US datacenters + CX32 shared dev/test) as live infrastructure, brings up the self-hosted Supabase Docker Compose stack across the four environments, installs the off-account immutable backup runner (Tier 4 in a separate AWS account with Object Lock COMPLIANCE mode + KMS CMK + cross-region replication), establishes the monitoring + alerting baseline, lands TLS + DNS via Cloudflare routing, and exercises the first restore drill to validate the Tier 4 architecture empirically. Sprint 0d1.5 does NOT bring application code online (Lifting Tracker MVP UI is not yet built); it stands up the **substrate that the application will deploy to** when first migration scripts and seed data land in 0e or later. Per SD-014 §11.9 forward chain: Sprint 0d1.5 produces the Phase 1 stand-up that SD-014's "Sprint 0e production-launch" preconditions cite, and the Phase 1 → Phase 2 migration runbook drafted in CC-7 here is the deprecation-plan artifact SD-012 / SD-014 commit to.

**Dates:** TBD → TBD (estimated 5-7 days under solo+AI per the stand-up scope below; CC-2 Supabase Docker stack stand-up across four environments is the long pole — expect environment-specific gotchas with extension versioning, MinIO bucket policy, and Realtime container memory tuning; CC-4 backup runner is medium-risk because Object Lock COMPLIANCE mode is irreversible at write time and misconfiguration locks out future operators; CC-1 / CC-3 / CC-5 / CC-6 / CC-7 / CC-8 are well-trodden install / configure / draft work).

**Goal:** Phase 1 hosting is live across four environments per SD-015 Option D hybrid topology. Self-hosted Supabase Docker Compose stack runs in dev / test / prod / coop with environment isolation enforced (LT_ENV boot validation; per-environment Hetzner firewall rules; Tailscale mesh for ops access). Off-account immutable backup runner is operational: daily logical dumps to AWS S3 Standard (90-day retention via lifecycle policy) + monthly archival to S3 Glacier Deep Archive in a separate AWS account with Object Lock COMPLIANCE mode + KMS CMK + cross-region replication (us-east-1 → eu-west-1). wal-g continuous WAL archiving provides 30-day PITR window. Hetzner snapshots provide operational PITR. Monitoring + alerting baseline live (replication health, disk space, CPU / memory, healthcheck endpoints). TLS + DNS via Cloudflare routing for `app.lifting-tracker.example` (prod) with sub-DNS-TTL failover capability to coop. Phase 1 → Phase 2 migration runbook drafted at `~/reach4all/docs/operational/phase-1-to-phase-2-migration-runbook.md` per SD-014 + SD-012 deprecation-plan commitment. First restore drill executed and passed — Tier 4 architecture validated empirically rather than hypothetically. From sprint close forward: Lifting Tracker application code can deploy to dev / test / prod environments; the 0d1 security controls baseline applies to a real running system; the SD-014 storage architecture is no longer aspirational.

**Input substrate (decision-grade research, status: accepted via SD-014 + SD-015):**

- `reach4all://docs/research/portfolio-strategic-implications-and-ownership-trajectory-research.md` (1,593 lines) — §3 hosting alternatives matrix; §4 multi-year cost-trajectory model; §6 lock-in / exit; §7 capital-vs-recurring; §9 recommended path. The hosting research stream's primary deliverable. Source for SD-014 Option 6a (hybrid hosting trajectory) and Phase 1 Hetzner cloud-rental commitment.
- `reach4all://docs/research/data-storage-and-archiving-strategy-research.md` (1,724 lines) — §2 architectural patterns for permanent-record data; §3 storage tiering (4-tier); §4 capacity planning; §5 off-account immutable backup architecture; §6 restoration drill discipline; §7 cost trajectory; §8 deletion-request handling. The storage architecture stream's primary deliverable. Source for SD-014 Tier 4 commitment (Object Lock COMPLIANCE + KMS + cross-region replication in separate AWS account) and the monthly automated + quarterly manual + annual DR drill cadence.
- `reach4all://docs/research/environment-strategy-and-promotion-demotion-architecture-research.md` (1,851 lines) — §2 environment definitions (dev / test / prod / coop); §3 Phase 1 hosting topology options A-E; §4 COOP architecture; §5 promotion path (image promotion + expand-contract migrations); §6 demotion path (pg_anonymizer-based); §9 single concrete recommendation; §10 deprecation plan. The environment strategy stream's primary deliverable. Source for SD-015 Option D hybrid-topology recommendation, DC selection (ASH1 prod + HIL1 coop + FSN1 dev/test), and the LT_ENV boot validation pattern.
- **Authorizing strategic decisions:** SD-014 + SD-015 in `reach4all://docs/research/0d2-prep-amendments-and-sd-entries.md` (currently drafted; commit lands per Sprint 0d2 CC-7). Sprint 0d1.5 references the prep-doc form; if Sprint 0d2 closes before 0d1.5, citation rebases to `reach4all://docs/architecture/strategic-decisions-log_v0.1.0.md` (or migrated v0.2.0 path per Sprint 0d2 CC-6).

Every CC below maps to one or more sections of these inputs; stand-up is install + configure + verify, not authoring of new posture content.

---

## Close criteria (8 items)

Each CC carries effort estimate, risk class, entry condition, and exit condition.

### CC-1 — Hetzner Cloud account + DC selection + VPS provisioning (Option D hybrid topology)

**Deliverable.** Hetzner Cloud project standing for the Lifting Tracker portfolio sub-system. Three VPS instances provisioned per SD-015 Option D hybrid topology: **prod** on Hetzner CCX23 (4 dedicated vCPU / 16 GB RAM / 160 GB SSD) in **ASH1 (Ashburn, US East)**; **coop** on Hetzner CCX23 in **HIL1 (Hillsboro, US West)** for cross-coast HA against US East regional event; **dev + test** sharing a single Hetzner CX32 (4 vCPU / 8 GB RAM / 80 GB SSD) in **FSN1 (Falkenstein, Europe)** with Docker namespace isolation between dev and test on the same host. SSH key generation + rotation per host. Hetzner firewall rules per host per environment-strategy §2 access controls. Hetzner snapshot schedule live (per-host snapshot retention per SD-014 Phase 1 specifics; Hetzner managed backups disabled in favor of the wal-g + off-account chain landing in CC-4). Project-level billing alert configured per OQ4. **Estimated Phase 1 production-launch recurring cost: ~€80/mo all-in** per environment-strategy research §1.5.

**Maps to.** Environment-strategy research §3.4 (Option D verdict), §3.11 (DC selection ASH1 + HIL1 + FSN1), §2 (per-environment access controls); SD-015 (Option D commitment); SD-014 Phase 1 hosting specifics.

**D-decisions touched.** D4 (cloud DB sole source of truth) — Phase 1 stand-up materializes the cloud-DB layer; D8 (Expo + Supabase platform commitment) — Supabase Docker is the runtime substrate.

**Effort.** 0.5-1 day. Cloud rental is well-trodden; per-host setup ~30-45 min including verification; firewall configuration is the operational discipline that consumes most of the elapsed time.

**Risk.** Low. Hetzner is well-documented; rollback is "destroy VPS" which costs €0. DC selection (ASH1 / HIL1 / FSN1) is reversible — VPS migration to another DC is a destroy-and-rebuild operation that takes ~30 min including snapshot transfer.

**Entry.** None (foundational; CC-1 unblocks every other CC). Optional pre-condition: Eric ratifies DC pair at sprint open per OQ2 (default ASH1 / HIL1 / FSN1 per env-strategy §3.11; alternative is Europe-pair FSN1 / NBG1 / FSN1-shared if Eric's proximity preferences override the US-East-latency argument).

**Exit.** Three VPS instances reachable; SSH access verified; Hetzner firewall rules per host per access-control matrix; Hetzner snapshot schedule active; project-level billing alert live; Phase 1 monthly cost forecast within €100/mo soft-cap per SD-015.

### CC-2 — Self-hosted Supabase Docker Compose stack stand-up across four environments

**Deliverable.** Self-hosted Supabase Docker Compose stack running in all four environments (prod, coop, dev, test). Stack components per SD-014 Phase 1 specifics + environment-strategy research §2.5 (per-environment configuration matrix): **Postgres 15+** with required extensions (pgcrypto, uuid-ossp, pg_stat_statements, pg_trgm, vector — pgvector deferred to D11 AI ingestion implementation); **GoTrue** auth service (Supabase auth runtime); **PostgREST** API gateway; **Storage API** with **MinIO** as the S3-compatible object store backend (MinIO is the Phase 1 default per SD-014; transition to AWS S3 direct-backend is a Phase 2 / scaling-driven decision); **Realtime** server (WebSocket + Postgres logical replication); **Edge Functions** runtime (Deno-based; one example function deployed to verify the runtime); **Studio** (admin UI; localhost-tunneled-only, never publicly accessible). Per-environment `.env` files via sops-encrypted secrets per environment-strategy §5.2 (sops + age key for Eric, encrypted at rest, decrypted only in CI / on host). Container image tags follow `lifting-tracker-supabase:dev-<sha>` / `test-<sha>` / `prod-<sha>` convention per environment-strategy §2.6. Database names follow `lifting_tracker_dev` / `lifting_tracker_test` / `lifting_tracker_prod` / `lifting_tracker_coop` convention. **Schema is empty at stand-up close** — first migration application is downstream work (likely Sprint 0e or Sprint 0f).

**Maps to.** SD-014 Phase 1 hosting specifics ("Self-hosted Supabase Docker Compose stack"); environment-strategy research §2 (per-env operational characteristics), §3.9 (backups, snapshots, storage in topology), §5.1 (image promotion model); storage research §3.1 (Tier 1 operational hot definition).

**D-decisions touched.** D4 (cloud DB) — Postgres is Tier 1; D6 (magic-link auth) — GoTrue is the runtime; D8 (Expo + Supabase) — full Supabase stack is the platform commitment; D11 (AI ingestion) — pgvector deferred per implementation-not-yet-needed signal; D22 (sensitivity defaults) — MinIO bucket policy is the stand-up surface for sensitivity-aware media storage; D23 (sync / offline) — Realtime + Postgres logical replication are the substrate that the offline-first sync queue reconciles against.

**Effort.** 1.5-2.5 days. Sequence: prod first (single environment, get the configuration solid); then coop (replication-target configuration; validates replication wiring without yet activating it); then dev + test on shared CX32 (Docker namespace isolation; environment-variable hardening). Per-environment ~3-4 hours including verification + smoke tests.

**Risk.** Medium. Self-hosted Supabase Docker has known operational gotchas: Postgres extension version-pinning across the stack (Realtime is sensitive to Postgres major version); MinIO bucket policy (default-deny vs explicit-grant; misconfiguration yields silent 403s); Realtime container memory tuning at low athlete count is over-provisioned but at high concurrency hits memory pressure first per env-strategy §3.10; Edge Functions Deno runtime version compatibility with Supabase upstream. Mitigation: lock the Supabase release version (e.g., supabase/postgres:15.6.1.115) at stand-up; document the locked version in `~/reach4all/docs/operational/supabase-version-lockfile.md`; upgrade is its own micro-sprint with explicit migration testing.

**Entry.** CC-1 done (VPS instances reachable). Optional: CC-3 done first if certificate provisioning is a stand-up gate for the Studio admin UI.

**Exit.** All four environments running the locked Supabase Docker Compose stack; smoke test passes per environment (auth signup / signin via GoTrue; PostgREST returns 200 on `/`; Storage API accepts a test object PUT/GET; Realtime accepts a test WebSocket connection; Edge Functions returns expected response for hello-world function); database names + container image tags + LT_ENV environment variable per environment-strategy §2.6 convention; per-environment `.env` files committed sops-encrypted; supabase-version-lockfile.md committed.

### CC-3 — TLS + DNS setup via Cloudflare routing

**Deliverable.** Domain `lifting-tracker.example` (placeholder — actual domain per OQ3) registered or already-controlled by Eric. Cloudflare DNS zone configured per environment-strategy research §3.8 with the following records: **`app.lifting-tracker.example`** → prod CCX23 IP (ASH1) — the bare-name-equivalent production endpoint; **`coop.lifting-tracker.example`** → coop CCX23 IP (HIL1) — direct ops access only, public traffic uses `app.` regardless of which instance is active; **`test.lifting-tracker.example`** → CX32 shared host IP (test container port); **`dev.lifting-tracker.example`** → CX32 shared host IP (dev container port; localhost-via-SSH-tunnel-only enforcement at Hetzner firewall layer per env-strategy §2.1). Cloudflare DNS routing for prod ↔ coop failover (manual flip at MVP / alpha; RTO bounded by DNS TTL of 60-300s per env-strategy §3.8; automated failover via Hetzner LB deferred to Phase 1 production-maturity per env-strategy §3.8). TLS via Cloudflare-managed origin certificates (free tier; full strict mode); Let's Encrypt fallback documented for direct-to-host TLS if needed (e.g., MinIO direct access for backup runner). DDoS protection live as Cloudflare side effect.

**Maps to.** Environment-strategy research §2.6 (DNS conventions), §3.8 (load balancer / proxy decision — Cloudflare DNS routing recommended for Phase 1).

**D-decisions touched.** None directly (TLS + DNS is infrastructure scaffolding, not an architecture decision); cross-cutting Hosting Posture per SD-014.

**Effort.** 0.5 day. Domain registration / verification ~1 hour; Cloudflare zone setup + DNS records ~1 hour; TLS certificate provisioning + verification ~1 hour; documentation ~1 hour.

**Risk.** Low. Well-trodden install path; rollback is "remove DNS records." Caveat: if Eric uses an existing domain that has live DNS records, take care to add lifting-tracker subdomains rather than replace the apex zone.

**Entry.** CC-1 done (VPS IPs available for DNS records).

**Exit.** All four environment subdomains resolve to expected IPs; TLS certificate verified valid (Cloudflare full strict mode operational); HTTPS reachable on `app.lifting-tracker.example`; Cloudflare DDoS protection enabled at zone level; manual failover procedure (flip DNS A record from prod IP to coop IP) documented in `~/reach4all/docs/operational/dns-failover-runbook.md`.

### CC-4 — Backup runner installation: AWS S3 Tier 4 Object Lock + KMS + cross-region replication

**Deliverable.** Off-account immutable backup architecture per SD-014 Phase 1 + storage research §5. **Separate AWS account from primary infrastructure** (per SD-014 commitment — primary infrastructure cannot delete from Tier 4); IAM cross-account role for write-only access from the Hetzner backup runner. **Tier 4 S3 bucket** in the separate account with **Object Lock enabled in COMPLIANCE mode** (immutable; SD-014's structural commitment) with default retention period configured (10-year for compliance class objects per SD-014 retention model; consult OQ5 for the exact retention period choice). **KMS Customer Master Key (CMK)** in the Tier 4 account with key policy permitting the cross-account write role + denying delete + requiring CloudTrail audit; CMK rotation enabled per AWS default (annual). **Cross-region replication** us-east-1 (primary Tier 4) → eu-west-1 (replica Tier 4) per SD-014 geographic redundancy commitment. **Daily logical dump runner** (cron on prod CCX23 host): `pg_dump --format=custom --compress=9 lifting_tracker_prod` → S3 PUT to Standard storage class in Tier 4 bucket → 90-day retention via S3 lifecycle policy per SD-014 Phase 1 specifics. **Monthly archival runner**: monthly first-Sunday cron transitions the latest dump to Glacier Deep Archive storage class with Object Lock applied. **wal-g for continuous WAL archiving**: 30-day PITR window per SD-014 + storage research §5.5. Backup integrity verification: SHA-256 checksum manifest written alongside each dump per storage research §5.6; verification runner re-reads checksums weekly. **Restoration drill scaffolding lands here as deployable; first execution is CC-8.**

**Maps to.** SD-014 (off-account immutable backup commitment, Tier 4 commitment); storage research §5 (off-account immutable backup architecture — full detail), §5.3 (Object Lock COMPLIANCE vs governance — COMPLIANCE selected per SD-014), §5.4 (KMS CMK rotation), §5.5 (backup runner schedule), §5.6 (backup integrity verification — checksum, manifest), §5.7 (geographic redundancy).

**D-decisions touched.** D4 (cloud DB sole source of truth) — Tier 4 is the durability layer that backs the canonical store; D22 (sensitivity defaults) — media binaries get the same off-account immutable backup posture; D23 (sync / offline) — sync-queue durability has the Tier 4 backstop (offline-queue contents replay against restored Tier 4 in catastrophic-failure recovery scenarios).

**Effort.** 1.5-2 days. AWS account creation + IAM setup ~2-3 hours; S3 bucket + Object Lock + KMS setup ~2-3 hours (Object Lock COMPLIANCE configuration is the high-care surface — see Risk); cross-region replication setup ~1 hour; backup runner cron + logical dump scripts ~2-3 hours; wal-g installation + WAL archiving configuration ~2-3 hours; integrity verification runner ~1-2 hours; documentation ~1-2 hours.

**Risk.** **Medium-high. Object Lock COMPLIANCE mode is irreversible at write time** — once an object is written with a COMPLIANCE retention period, neither the bucket owner nor AWS root can delete it before retention expires. Misconfiguration (e.g., 100-year retention written by mistake) locks Tier 4 storage cost into a multi-decade commitment. Mitigation: (a) test Object Lock configuration in a separate scratch bucket first with a 1-day default retention; (b) write the first 30 days of dumps with a 1-year retention; (c) verify the COMPLIANCE-mode behavior empirically before committing to 10-year retention; (d) operator sign-off on the retention-period choice at sprint open per OQ5; (e) the IAM write-only cross-account role should NOT have `s3:PutObjectRetention` outside the bucket's default retention policy. KMS misconfiguration also creates lockout risk: if the CMK is deleted or its policy is broken, all encrypted Tier 4 objects become unrecoverable. Mitigation: enable CMK deletion-pending-7-day-window; document CMK ARN + ARNs of authorized principals in `~/reach4all/docs/operational/tier-4-kms-key-recovery-runbook.md`.

**Entry.** CC-1 done (prod CCX23 host available for backup runner installation); CC-2 done (Postgres running in prod with at least one test database to dump). AWS account creation can run in parallel.

**Exit.** Tier 4 bucket live in separate AWS account with Object Lock COMPLIANCE mode active; KMS CMK live with key policy verified; cross-region replication active and verified (test object replicates within ~15 min); first daily logical dump written to Tier 4 successfully; first monthly archival transition to Glacier Deep Archive successfully (or scheduled and verified for next first-Sunday execution); wal-g WAL archiving operational with 30-day PITR window verified; integrity verification runner scheduled; tier-4-kms-key-recovery-runbook.md committed; tier-4-bucket-recovery-runbook.md committed. **CC-8 first restore drill is the empirical validation of all CC-4 outputs.**

### CC-5 — Monitoring + alerting baseline

**Deliverable.** Per-environment monitoring + alerting baseline. **Healthcheck endpoints** per service (Postgres `pg_isready`; PostgREST `/`; GoTrue `/health`; Storage API `/status`; Realtime `/api/health`; Edge Functions `/_internal/health`). **Hetzner snapshot schedule** verified (CC-1 sets the schedule; CC-5 verifies snapshots are landing per schedule). **Disk-space alerts** at 70% / 85% / 95% per environment (Hetzner cloud monitoring or host-level cron check). **CPU + memory alerts** at sustained 60% (Phase 2 scaling-pressure trigger per env-strategy §3.10). **Replication-lag alerts** for the prod → coop replication path (Patroni / streaming replication metrics; even though COOP is cold-standby through beta per SD-015, the replication wiring is configured as warm-standby-ready and lag is monitored per env-strategy §4.8). **Backup-runner failure alerts** (CC-4 cron exit code != 0 → alert). **Restore-drill failure alerts** (CC-8 exit code != 0 → Sev-2 incident per storage research §6.6). **Initial alert delivery via email** (Cloudflare email forwarding or AWS SES; Cowork chat-alert integration is Sprint 0e listener-driven and out of scope here per OQ6). Alert thresholds documented in `~/reach4all/docs/operational/alert-runbook.md`.

**Maps to.** Environment-strategy research §3.10 (scaling pressure detection), §4.8 (replication health monitoring as own discipline); storage research §6.6 (drill failure response).

**D-decisions touched.** None directly; monitoring is operational scaffolding for D4 + D8.

**Effort.** 0.5-1 day. Healthcheck verification per service ~1 hour; alert configuration per category ~2-3 hours; alert-runbook documentation ~1 hour.

**Risk.** Low. Standard monitoring; rollback is "disable alerts." Caveat: alert fatigue is the practical risk — over-noisy alerts get muted, missing real signals. Mitigation: start with three high-signal alerts (disk space, backup-runner failure, restore-drill failure); add CPU / memory / replication-lag alerts only after baseline is calibrated.

**Entry.** CC-1 done (VPS instances available); CC-2 done (services running for healthcheck wiring); CC-4 done (backup-runner failure alert wires to the runner).

**Exit.** Healthcheck endpoints respond per service; disk-space + backup-runner-failure + restore-drill-failure alerts active; alert delivery verified (test alert fires and reaches Eric); alert-runbook.md committed; CPU / memory / replication-lag alerts deferred to post-baseline-calibration if alert-fatigue concern dominates.

### CC-6 — Environment isolation + Tailscale ops access

**Deliverable.** **LT_ENV environment-variable boot validation** per environment-strategy research §2.6: each container reads `LT_ENV={dev|test|prod|coop}` on boot; refuses to start if value doesn't match the expected database name (e.g., LT_ENV=prod must connect to lifting_tracker_prod, never lifting_tracker_test). **Per-environment Hetzner firewall rules** per environment-strategy research §2 access-control matrix: dev = localhost-via-SSH-tunnel only OR Eric's IP allowlist; test = CI CIDR + Eric's IP; prod = public HTTPS on 443 only, Postgres port firewalled to localhost only; coop = Postgres replication port open to prod-primary only, HTTPS exposed but typically not in DNS. **Tailscale mesh** for ops access per SD-014 Phase 1 specifics: install Tailscale on all three Hetzner hosts + on Eric's MacBook; enable MagicDNS; configure ACLs to restrict Tailscale-mesh traffic to Eric's identity + (later) CI runners. **Sops + age key** for environment secrets per env-strategy research §5.2: age key for Eric committed to 1Password; per-environment .env files sops-encrypted at rest in repo; CI / host scripts decrypt at use site. **No public Postgres ports anywhere** (verified by external port scan of all four environment IPs — only HTTPS / SSH / Tailscale ports respond).

**Maps to.** Environment-strategy research §2 (per-env access controls), §2.6 (DNS / config / image-tag conventions), §5.2 (sops + age key); SD-014 Phase 1 hosting specifics ("Tailscale for ops access").

**D-decisions touched.** D6 (auth) — Tailscale is the ops-plane equivalent of D6's user-plane authn / authz; D8 (Expo + Supabase) — environment isolation prevents cross-environment data leakage at the Supabase Docker layer.

**Effort.** 0.5 day. Tailscale install + ACL configuration ~1-2 hours; LT_ENV boot validation in container entrypoint ~1 hour (could be Supabase-supplied or custom shim depending on the Supabase Docker upstream behavior); firewall rule verification per environment ~1 hour; sops + age key setup ~1 hour; external port-scan verification ~30 min.

**Risk.** Low. Well-trodden patterns; rollback is "remove Tailscale + revert firewall." Caveat: Tailscale ACL misconfiguration can lock Eric out of his own infrastructure; mitigation: keep SSH-key fallback access on Hetzner public IPs for the duration of Sprint 0d1.5; remove SSH public access only after Tailscale-as-only-path is verified for ≥7 days.

**Entry.** CC-1 done (VPS instances available); CC-2 done (containers running for LT_ENV wiring).

**Exit.** LT_ENV boot validation verified per environment (containers refuse to start with wrong LT_ENV value); Hetzner firewall rules verified per environment (external port-scan shows only expected ports); Tailscale mesh operational with Eric reachable on all three hosts via Tailscale-mesh DNS names; sops + age key setup committed with .env files encrypted; no public Postgres ports anywhere (external port-scan confirmation logged in sprint commit message).

### CC-7 — Phase 1 → Phase 2 migration runbook (drafted; not exercised)

**Deliverable.** `~/reach4all/docs/operational/phase-1-to-phase-2-migration-runbook.md` drafted at v0.1.0. Documents the Phase 1 → Phase 2 cutover steps per SD-014 + SD-012 Lifecycle Integrity commitment. Runbook content per SD-014 §11.9 forward chain commitment + storage research §5.10 ("structural commitment, not feature"): (1) **Trigger conditions** — owned-hardware acquired AND Eric sprint capacity to cut over OR sub-system count crosses 3 OR Hetzner pricing increases 30%+ in a year; (2) **Pre-cutover checklist** — Phase 2 hardware staged + Tailscale ingress configured + Time Machine backup strategy live + Same Supabase Docker version installed; (3) **Cutover sequence** — coop replication moves to Phase 2 host first (low risk; coop is standby); validate replication on Phase 2 for ≥7 days; flip prod traffic via DNS cutover (RTO bounded by DNS TTL); decommission Hetzner prod VPS only after ≥30-day soak; (4) **Tier 4 explicitly does NOT re-platform** per SD-014 ("Tier 4 specifically does NOT re-platform across the Phase 1 → Phase 2 transition"); (5) **Validation steps** — restore drill on Phase 2 host before traffic cutover; full smoke test of Supabase stack on Phase 2; row-count audit; (6) **Rollback plan** — if Phase 2 cutover fails, DNS reverts to Hetzner prod IP; Hetzner VPS retained for 30 days post-cutover specifically as rollback target; (7) **Post-cutover cleanup** — Hetzner VPS decommissioning sequence; Hetzner Cloud account in standby (kept for 12 months as second-site option per env-strategy §3.5 cross-vendor diversity discussion). Runbook is **drafted, not exercised** — exercise lands when Phase 2 trigger fires per SD-014 re-evaluation triggers.

**Maps to.** SD-014 Phase 2 trigger + Phase 2 hosting specifics + Lifecycle Integrity (deprecation plan from inception, per SD-012); SD-012 (Lifecycle Integrity / Deprecation Discipline); env-strategy research §3.5 (cross-vendor diversity discussion).

**D-decisions touched.** None directly (operational runbook); cross-cutting Hosting Posture per SD-014.

**Effort.** 0.5 day. Drafting only; references SD-014 + storage research + env-strategy research without authoring new posture content.

**Risk.** Low. Drafting only; runbook gets refined when Phase 2 trigger actually fires (the future operator has more context than today's drafter; v0.1.0 captures the architectural intent and the operator at trigger time amends to v0.2.0 with current-state details).

**Entry.** CC-1 done (Phase 1 stand-up exists, so Phase 1 → Phase 2 transition is a real operation rather than a hypothetical).

**Exit.** Runbook committed at `~/reach4all/docs/operational/phase-1-to-phase-2-migration-runbook.md` v0.1.0; cross-referenced from SD-014 forward-chain block (SD-014 §11.9 entry "Consumed_by → phase-1-to-phase-2-migration-runbook.md" resolves); Lifting Tracker architecture doc Hosting Posture amendment cites the runbook as the deprecation-plan artifact per SD-012.

### CC-8 — First restore drill execution

**Deliverable.** First restore drill executed per SD-014 + storage research §6.2. Restore latest Tier 4 logical dump (CC-4 deliverable) to a transient Hetzner CCX13 staging instance (provisioned for the drill, destroyed at drill end; ~$0.50 marginal cost per drill). Verify schema match against expected (use `pg_dump --schema-only` comparison to a known-good schema file in repo); verify row counts of all tables in restored dump are non-zero (schema-empty stand-up state means row counts will be zero if no test data has been written; OQ8 covers whether to seed minimal test data into prod for the purpose of making CC-8 a non-trivial drill); run smoke queries against restored data; tear down transient instance. **Drill log written** to `~/reach4all/docs/operational/restore-drill-log.md` per storage research §6.7 (drill log as living document — date, drill type, duration, pass / fail, observations). Drill is the empirical validation of the entire CC-4 chain (off-account dump runner, KMS encryption / decryption, S3 retrieval, schema preservation, row count preservation). **First drill is manual / monitored**; subsequent monthly automated drills land in Sprint 0e or as scheduled-task per SD-014 §11 implementation block ("Sprint 0e: monthly automated drill workflow live").

**Maps to.** SD-014 ("first restore drill within 30 days of production data landing"); storage research §6.2 (monthly automated restore-to-staging drill — first execution is manual / monitored), §6.7 (drill log as living document).

**D-decisions touched.** D4 (cloud DB sole source of truth) — drill validates the durability layer that backs the canonical store.

**Effort.** 0.25-0.5 day execution. Provision transient CCX13 ~10 min; restore from S3 + Glacier (Glacier Deep Archive retrieval can take hours; first drill should target the S3 Standard retention copy for minutes-not-hours retrieval; OQ9 covers whether to test Glacier Deep Archive retrieval at first drill or defer to quarterly manual drill); schema + row-count verification ~30 min; smoke queries ~15 min; tear-down ~10 min; drill log entry ~30 min.

**Risk.** Low if CC-4 properly configured. **High if CC-4 has subtle misconfiguration that only surfaces at restore time.** This is exactly the failure mode the drill exists to expose; failed-drill response is "fix CC-4 configuration; re-execute drill; do not close Sprint 0d1.5 until drill passes." Per storage research §6.6: failed drills are Sev-2 incidents.

**Entry.** CC-4 done (Tier 4 backup runner has written ≥1 successful daily logical dump). Per SD-014 commitment, drill should occur within 30 days of production data landing — at Sprint 0d1.5 close, no production data has yet landed, so the drill validates the runner architecture against test data per OQ8.

**Exit.** Restore drill executed; restored database schema matches expected; row counts preserved; smoke queries return expected results; drill log entry written; transient CCX13 destroyed; drill outcome (PASS / FAIL) committed in sprint close kanban Done section. **If FAIL: Sprint 0d1.5 does NOT close until CC-4 + CC-8 are remediated and re-executed.**

---

## Total effort estimate

5-7 days under solo+AI. CC-2 Supabase Docker stack stand-up across four environments is the long pole (1.5-2.5 days); CC-4 backup runner is the second-longest (1.5-2 days) and the highest-risk surface; CC-1 / CC-3 / CC-5 / CC-6 / CC-7 / CC-8 are 0.25-1 day each. No authoring of new posture content — Sprint 0d1.5 is the stand-up sprint, not an authoring sprint (the architecture is in SD-014 + SD-015 + the three research deliverables; this sprint materializes it).

---

## Sequencing within sprint

Wrong order produces broken dependencies at intermediate states.

| Step | Close criterion | Why this order |
|---|---|---|
| 1 | CC-1 — Hetzner Cloud account + DC + VPS provisioning | Foundational. Every other CC needs reachable VPS instances. |
| 2 | CC-3 — TLS + DNS setup via Cloudflare routing | Independent of CC-2; can run in parallel with CC-2 once CC-1 completes. DNS / TLS provisioning has its own elapsed-time gate (DNS propagation; certificate verification). |
| 3 | CC-2 — Self-hosted Supabase Docker Compose stack stand-up | Cites VPS instances from CC-1; benefits from TLS / DNS from CC-3 for Studio admin UI access. Sequence within CC-2: prod first → coop → dev + test shared. |
| 4 | CC-4 — Backup runner installation: AWS S3 Tier 4 Object Lock + KMS + cross-region replication | Cites prod CCX23 from CC-1 and Postgres-running from CC-2. AWS account creation can run in parallel with CC-1 / CC-2 / CC-3. Object Lock COMPLIANCE configuration is high-care surface — see CC-4 Risk. |
| 5 | CC-6 — Environment isolation + Tailscale ops access | Cites VPS instances from CC-1 and containers from CC-2. Tailscale install can run in parallel with CC-4 if Eric chooses parallelization. |
| 6 | CC-5 — Monitoring + alerting baseline | Cites healthcheck endpoints from CC-2, backup runner from CC-4, replication wiring from CC-2 + CC-6. |
| 7 | CC-7 — Phase 1 → Phase 2 migration runbook (drafted; not exercised) | Documents the deprecation plan that the rest of Sprint 0d1.5 just instantiated. Drafting only; can run in parallel with CC-8 if Eric chooses parallelization. |
| 8 | CC-8 — First restore drill execution | Tail. Validates CC-4 empirically. **Sprint 0d1.5 does NOT close until drill passes.** |

**Critical-path dependencies:**

```
CC-1 ──┬──→ CC-2 ──┬──→ CC-4 ──→ CC-8
       ├──→ CC-3   │
       │           ├──→ CC-5
       │           └──→ CC-6
       └──→ CC-7 (independent of CC-2/4/5/6/8 once CC-1 done; pure drafting)
```

**Parallelization opportunities:**

- CC-3 (TLS + DNS) is independent of CC-2 once CC-1 completes; can run in parallel.
- AWS account creation for CC-4 can start as a parallel workstream from sprint open (Eric or operator handles AWS-account-creation friction independently of Hetzner stand-up).
- CC-6 (Tailscale + firewall + LT_ENV) can run in parallel with CC-4 (backup runner) once CC-2 completes.
- CC-7 (migration runbook drafting) is independent of CC-2 / CC-4 / CC-5 / CC-6 / CC-8 once CC-1 done.

**Mid-sprint reset triggers:**

If any of these surface mid-sprint, pause and re-plan:

- CC-2 Supabase Docker version-pin surfaces incompatibility with extension requirements (e.g., pgvector 0.6.x not compatible with locked Postgres 15.6.1.115) — pause CC-2; re-evaluate version-pin against extension requirements; document in supabase-version-lockfile.md why a specific version was chosen and what was rejected.
- CC-4 Object Lock COMPLIANCE configuration test in scratch bucket reveals unexpected behavior (e.g., retention period interpretation differs from expectation) — pause CC-4; re-test with adjusted configuration; do NOT proceed to live Tier 4 bucket creation until COMPLIANCE behavior is empirically understood.
- CC-4 KMS CMK key policy creates lockout (Eric cannot decrypt with the configured policy) — pause CC-4; restore key access via root account before policy change; re-author key policy with explicit operator-access sub-clause.
- CC-8 first restore drill FAILS — pause sprint close; remediate CC-4 configuration; re-execute drill; do not close Sprint 0d1.5 until drill passes per CC-8 Exit condition.
- Hetzner pricing surprise mid-sprint (April 2026 Hetzner +30% price already happened per SD-014 R-TV-05; another adjustment mid-sprint would prompt a Phase 2-trigger re-evaluation in retro) — note in retro; do NOT pause the stand-up.
- AWS account creation friction (multi-day verification delay) — Sprint 0d1.5 can close with CC-4 partially complete (Tier 4 bucket pending AWS-account-verification) IF Eric explicitly accepts the partial state; otherwise the sprint blocks at CC-4 Exit until AWS account is operational.

---

## What Sprint 0d1.5 does NOT do (scope-creep prevention)

- Does NOT deploy Lifting Tracker application code. Schema is empty at sprint close; first migration application is downstream work (likely Sprint 0e CC-9 or Sprint 0f opening). The substrate is live; the application that uses it is not.
- Does NOT exercise Phase 2 transition. CC-7 drafts the migration runbook; Phase 2 transition exercise lands when Phase 2 trigger fires per SD-014 re-evaluation triggers.
- Does NOT activate warm-streaming COOP. Per SD-015, COOP is **cold-standby through beta**. Sprint 0d1.5 brings up coop CCX23 with replication wiring configured but the replication stream is not yet activated (CC-2 verifies the topology can support replication; activation lands at production launch per SD-015 §1.2).
- Does NOT install Patroni. Per env-strategy §4.6, Patroni-managed automated failover lands at production-launch + 6 months OR 500 athletes. Manual DNS-flip failover per CC-3 is the Phase 1 posture.
- Does NOT implement the pg_anonymizer demotion pipeline. Per env-strategy §6.4, the demotion pipeline runs weekly Sunday 03:00 UTC and lands when first prod data exists to demote (likely Sprint 0e+ when test data starts informing dev). Sprint 0d1.5 sets up the topology that the demotion pipeline will operate on; the pipeline itself is downstream.
- Does NOT introduce Tier 2 (warm-Postgres / columnar warehouse) or Tier 3 (Glacier Flexible Retrieval). Per storage research §3.3 tier introduction timing, Tier 2 lands at Sprint 0f-0g when data volume warrants; Tier 3 lands at Sprint 0h+. Sprint 0d1.5 is Tier 1 (operational hot) + Tier 4 (compliance immutable) only.
- Does NOT install pgvector in CC-2 stand-up. Per SD-014 + D11 (AI ingestion), pgvector lands when first AI-ingestion code requires it; Phase 1 stand-up does not pre-install extensions that are not yet needed. Adding pgvector later is a `CREATE EXTENSION vector` operation that requires Postgres restart, scheduled during a maintenance window.
- Does NOT run scheduled monthly automated restore drill. Per SD-014 §11 ("Sprint 0e: monthly automated drill workflow live"), the GitHub-Actions-driven monthly drill workflow lands in Sprint 0e (or as scheduled-task per Sprint 0e CC-6 scheduler). Sprint 0d1.5 CC-8 is the **first drill, executed manually**; ongoing monthly automation is downstream.
- Does NOT integrate alert delivery with Cowork chat-alert. Per env-strategy + Sprint 0e listener kanban, the chat-alert ingress mechanism lands in Sprint 0e (CC-5 of 0e). Sprint 0d1.5 alert delivery is email-only (Cloudflare email forwarding or AWS SES); integration with Cowork chat-alert is downstream.
- Does NOT migrate operational documents to xrsize4all repo. Per Sprint 0d2 CC-6 (xrsize4all repo standup + migration), all portfolio-level operational docs migrate from `~/reach4all/docs/operational/` to `~/xrsize4all/docs/operational/` in Sprint 0d2. Sprint 0d1.5 docs land at `~/reach4all/...` paths and rebase in Sprint 0d2 CC-6 sweep.
- Does NOT pursue compliance certification. Per Sprint 0d1 CC-1 §10.1 resolution + SD-014 commitment, certification pursuit awaits trigger conditions; Sprint 0d1.5 stands up the substrate that will eventually be certifiable.
- Does NOT implement application-layer no-hard-delete enforcement (D-decision soft-delete). Per storage research §2 + SD-014 commitment, the five-layer soft-delete enforcement (repository-pattern API, Postgres trigger, RLS policy, credential hygiene, audit trail) lands when application code lands. Sprint 0d1.5 stands up Postgres; the no-hard-delete discipline lands in application code in Sprint 0e+.
- Does NOT implement anonymization-on-deletion-request. Per storage research §8 + SD-014 commitment, the anonymization function lands when application code that exercises it lands. Sprint 0d1.5 sets up the database that will hold the anonymization function; the function itself is downstream.

---

## Decisions required at sprint open

These are the calls Eric needs to make at Sprint 0d1.5 sprint-open. Each has a recommended default; each is reversible at low cost (CC-4 Object Lock COMPLIANCE retention period is the partial exception — see OQ5). **NOT pre-empted in this kanban.** Eric ratifies or overrides at sprint-open commit.

### OQ1 — Sprint 0d1.5 close-criteria count

This kanban proposes 8 close criteria. Sprint 0d1 has 8; Sprint 0d2 has 8.

**Default.** 8.

**Alternatives.** 6 (compress CC-3 into CC-1; compress CC-5 into CC-6 ops-baseline block); 10 (split CC-2 into per-environment sub-CCs; split CC-4 into separate AWS account / S3+Object-Lock / KMS / cross-region replication / wal-g sub-CCs).

**Eric's call.** Default OR alternative count.

### OQ2 — DC pair selection (CC-1)

CC-1 defaults to ASH1 (prod) + HIL1 (coop) + FSN1 (dev/test) per env-strategy research §3.11 (recommended for US-athlete latency + Brazilian-athlete tolerance). Alternative: Europe-pair FSN1 (prod) + NBG1 (coop) + FSN1-shared (dev/test) for proximity to Eric's location-aware preferences.

**Default.** ASH1 + HIL1 + FSN1 per env-strategy §3.11.

**Alternatives.** Europe-pair FSN1 + NBG1 + FSN1-shared (lower per-DC latency for Eric; higher Brazil-athlete latency; same Hetzner pricing); Hybrid: prod in ASH1 + coop in NBG1 (cross-Atlantic HA; protects against regional Hetzner-US event; ~120ms inter-DC latency, acceptable for streaming replication but at the upper bound).

**Eric's call.** Default OR alternative DC pair. **Affects CC-1 + CC-3 (DNS records) + CC-6 (Tailscale ACLs).**

### OQ3 — Domain selection (CC-3)

CC-3 uses placeholder `lifting-tracker.example`. Eric's actual domain choice unblocks CC-3.

**Default.** Eric supplies domain at sprint open.

**Alternatives.** Use a Hetzner-supplied subdomain temporarily (e.g., `<vps-id>.your-server.de`) for Sprint 0d1.5 close; cut over to Eric's domain in Sprint 0e or later. Argument: defers domain-registration friction; lets Phase 1 stand-up complete without the domain decision.

**Eric's call.** Domain name OR Hetzner-subdomain placeholder.

### OQ4 — Hetzner billing alert threshold (CC-1)

CC-1 configures a project-level billing alert. Threshold defaults to €100/mo (the SD-015 soft cap).

**Default.** €100/mo soft cap; €150/mo re-evaluation trigger per SD-015.

**Alternatives.** €80/mo (the production-launch all-in cost; alert fires earlier but may be noisy during stand-up); €120/mo (less noisy but later signal).

**Eric's call.** Default OR alternative threshold.

### OQ5 — Tier 4 Object Lock retention period (CC-4)

CC-4 defaults to 10-year retention period for Object Lock COMPLIANCE mode per SD-014 retention model. **Object Lock COMPLIANCE retention is irreversible at write time** — once written, the object cannot be deleted before retention expires. Mistake here is multi-decade cost commitment.

**Default.** 10-year retention per SD-014 commitment.

**Alternatives.** 7-year retention (matches longest US business-record retention requirements without exceeding); 11-year retention (matches SD-014 lifecycle-integrity §4 trigger "year 11 post-write, objects become deletion-eligible"); shorter test-period (1-year) for first 30 days of Sprint 0d1.5 stand-up to validate behavior empirically before committing to long-period retention.

**Eric's call.** Default 10-year OR alternative. **Strongly recommended:** start with 1-year retention for first 30 days (Sprint 0d1.5 + first month of Sprint 0e) to validate behavior; switch to 10-year for objects written from a confirmed-correct date forward. **Affects CC-4 risk profile + multi-decade Tier 4 cost commitment.**

### OQ6 — Alert delivery channel (CC-5)

CC-5 defaults to email-only delivery (Cloudflare email forwarding or AWS SES). Cowork chat-alert integration is Sprint 0e listener-driven and out of scope here.

**Default.** Email-only.

**Alternatives.** Add SMS for critical alerts (Twilio or AWS SNS); add Cowork chat-alert via file-write-to-shared-volume mechanism per Sprint 0e listener prep doc §6.4a (chat-alert mechanism file-write MVP path can land here as a forward-compatible move).

**Eric's call.** Default OR alternative. **If "add Cowork chat-alert," coordinate with Sprint 0e CC-5 owner to avoid double-implementation.**

### OQ7 — Sprint open ratification — sequential vs parallel with Sprint 0d2

Sprint 0d1 closes; Sprint 0d1.5 + Sprint 0d2 + Sprint 0e all have drafted kanbans. Open Sprint 0d1.5 sequentially after 0d1 (then 0d2 after 0d1.5; then 0e after 0d2), or open 0d1.5 in parallel with 0d2 (independent workstreams)?

**Default.** Sequential. 0d1.5 stands up the substrate that 0d2's xrsize4all repo and document migration will reference (some operational docs from 0d1.5 land at `~/reach4all/...` paths and rebase in 0d2 CC-6); sequential opening matches dependency graph and avoids cross-sprint coordination overhead.

**Alternatives.** Parallel. Argument: 0d2 CC-1 / CC-2 / CC-3 / CC-4 / CC-5 / CC-7 are document / framework work with no infrastructure dependencies; 0d1.5 is infrastructure stand-up with no document dependencies; the two could run in parallel. Counter-argument: solo+AI capacity may not support parallel sprint execution at this scope.

**Eric's call.** Default (sequential) OR parallel. **Coordinates with 0d2 entry-condition statement + 0e entry-condition statement.**

### OQ8 — Test data seeding for first restore drill (CC-8)

CC-8 first restore drill needs row-count > 0 to be a non-trivial drill. At Sprint 0d1.5 close, no production athlete data has yet landed.

**Default.** Seed minimal synthetic test data (~100 rows across all key tables) into prod for the purpose of making the first drill non-trivial. Synthetic data is generated via Faker per env-strategy §2.1 and clearly tagged as `test_drill_seed_2026MMDD` so it's identifiable and removable.

**Alternatives.** Skip seeding; first drill validates schema-only (smaller signal but still validates the runner); defer first drill to Sprint 0e when first real test data lands.

**Eric's call.** Default OR alternative. **Affects CC-8 effort + signal strength.**

### OQ9 — Glacier Deep Archive retrieval test at first drill (CC-8)

CC-8 first drill defaults to S3 Standard retention copy retrieval (minutes-not-hours retrieval; tests the runner architecture). Glacier Deep Archive retrieval (12-48 hours; tests the Tier 4 long-term path) is deferred to quarterly manual drill per storage research §6.3.

**Default.** S3 Standard retrieval at first drill; Glacier Deep Archive retrieval at quarterly manual drill.

**Alternatives.** Test both at first drill (validates the full Tier 4 chain end-to-end at higher elapsed-time + cost); test Glacier Deep Archive only at first drill (most-realistic worst-case retrieval; longest signal latency).

**Eric's call.** Default OR alternative. **Affects CC-8 effort + signal strength.**

### OQ10 — Sprint 0d1.5 dates + duration estimate confirmation

Estimated 5-7 days under solo+AI. Sprint open date depends on Sprint 0d1 close (or parallel-open per OQ7). Confirm 5-7 day estimate, or amend.

**Default.** 5-7 days. CC-2 (1.5-2.5 days) + CC-4 (1.5-2 days) are the long poles; CC-1 / CC-3 / CC-5 / CC-6 / CC-7 / CC-8 are 0.25-1 day each with parallelization opportunities.

**Alternatives.** Tighter estimate if OQ8 + OQ9 defaults taken (would shave ~0.5 day from CC-8); wider estimate if OQ5 1-year-then-10-year staged retention is taken (CC-4 elapsed time extends across two phases; sprint-close definition needs amendment).

**Eric's call.** Default OR alternative.

---

## Sprint 0d1.5 entry conditions

- This kanban committed and Eric has reviewed it.
- SD-014 + SD-015 are committed (Sprint 0d2 CC-7 lands these; if Sprint 0d2 hasn't closed, SD-014 + SD-015 are referenced from `reach4all://docs/research/0d2-prep-amendments-and-sd-entries.md` per Input substrate above).
- Sprint 0d1 (security controls baseline integration) is closed OR explicitly carved off; Sprint 0d1.5 inherits the security controls baseline as binding governance reference and applies it during stand-up (e.g., DEV-001 / DEV-002 compensating-control disciplines per SD-004; CC-013/14/15 Concept Computing inheritance per the baseline).
- Eric has answered OQ2 (DC pair), OQ3 (domain), OQ5 (Tier 4 retention period), OQ7 (sequential vs parallel with 0d2), OQ8 (test data seeding) — each blocks sprint commit.
- AWS account creation initiated (or already exists) — long-elapsed-time prerequisite; can run in parallel with sprint open per CC-4 entry condition.

---

## Sprint 0d1.5 exit conditions

- All 8 close criteria above marked DONE.
- Hetzner Cloud Phase 1 hybrid topology live (CCX23 prod + CCX23 coop + CX32 shared dev/test).
- Self-hosted Supabase Docker Compose stack running in all four environments with smoke tests passing per CC-2 Exit.
- TLS + DNS via Cloudflare routing live for all four environment subdomains.
- Off-account immutable backup runner operational: Tier 4 bucket in separate AWS account with Object Lock COMPLIANCE mode + KMS CMK + cross-region replication; daily logical dumps writing to S3; monthly archival to Glacier Deep Archive scheduled; wal-g WAL archiving with 30-day PITR window verified.
- Monitoring + alerting baseline live with alert delivery verified per CC-5 Exit.
- Environment isolation enforced: LT_ENV boot validation per environment; per-environment Hetzner firewall rules verified by external port scan; Tailscale mesh operational; sops + age key for environment secrets; no public Postgres ports anywhere.
- Phase 1 → Phase 2 migration runbook drafted at v0.1.0 per CC-7 Exit; cross-referenced from SD-014 forward chain.
- First restore drill executed and PASSED per CC-8 Exit; drill log entry written.
- From sprint close forward: Lifting Tracker application code can deploy to dev / test / prod environments; the 0d1 security controls baseline applies to a real running system; the SD-014 storage architecture is no longer aspirational.

---

## Open-items migration from Sprint 0d1

Per §14.2 inheritance rule. **To be populated at actual sprint open from Sprint 0d1's close kanban.** At draft time, Sprint 0d1 is drafted but not yet open. This section is a placeholder.

| Item | Source | Disposition |
|---|---|---|
| (Placeholder. Populate at 0d1.5 sprint-open commit by reviewing frozen `lift-track-kanban-sprint-0d1.md` Done / Open / Carry-forward state. Likely items: Sprint 0d1 CC-6 gitleaks pre-commit install — verify it covers the operational scripts authored in Sprint 0d1.5 CC-4 / CC-5 / CC-7; Sprint 0d1 CC-7 Security Implications mechanism — verify Sprint 0d1.5 CC-7 runbook carries the Security Implications block per the binding; Sprint 0d1 CC-2 D-decision Security Implications — verify D4 / D8 / D22 / D23 amendments cite the Phase 1 hosting + storage architecture that Sprint 0d1.5 instantiates.) | — | — |

---

## In Progress

| Card | Session | Started | Notes |
|---|---|---|---|
| (Empty at sprint open. Items added as work begins.) | — | — | — |

## In Review — awaiting Eric's decisions

| Card | Artifact | Open decisions |
|---|---|---|
| (Empty at sprint open. OQ1-OQ10 should be resolved at sprint open commit, not held in review queue.) | — | — |

## Blocked / Waiting

| Card | Blocked on | Note |
|---|---|---|
| (Empty at sprint open. AWS account creation friction is the most likely Blocked source — Eric or operator handles AWS-account-creation independently of Hetzner stand-up to keep this column empty.) | — | — |

## Done — Sprint 0d1.5

| Card | Closed | Artifact | Notes |
|---|---|---|---|
| (Empty at sprint open. Items move here as they close.) | — | — | — |

---

## Other Session Work

Eric-maintained — sessions Dispatch cannot see (Chrome, mobile, other CLI).

| Session | Started | Status | Notes |
|---|---|---|---|
| (Empty at sprint open.) | — | — | — |

---

## Cross-reference

- **Input substrates (three converging research streams; status: decision-grade per SD-014 + SD-015):**
  - `reach4all://docs/research/portfolio-strategic-implications-and-ownership-trajectory-research.md` (1,593 lines) — hosting strategy stream; SD-014 source.
  - `reach4all://docs/research/data-storage-and-archiving-strategy-research.md` (1,724 lines) — storage architecture stream; SD-014 Tier 4 + drill-cadence source.
  - `reach4all://docs/research/environment-strategy-and-promotion-demotion-architecture-research.md` (1,851 lines) — environment topology stream; SD-015 Option D + DC-selection source.
- **Authorizing strategic decisions:** SD-014 + SD-015 in `reach4all://docs/research/0d2-prep-amendments-and-sd-entries.md` (currently drafted; commit lands per Sprint 0d2 CC-7). After Sprint 0d2 closes: cited from `xrsize4all://docs/architecture/strategic-decisions-log_v0.2.0.md`.
- **Adjacent SDs:** SD-001 (work-machine hardware deferral; precedent for Phase 1 / Phase 2 owned-hardware trigger); SD-002 (LLM build cloud-rental-first; analog precedent); SD-009 (security controls baseline — Sprint 0d1 source); SD-012 (Lifecycle Integrity); SD-013 (athlete data permanent record retention principle).
- **Path note:** operational runbooks authored in Sprint 0d1.5 (CC-3 dns-failover-runbook.md, CC-4 tier-4-kms-key-recovery-runbook.md + tier-4-bucket-recovery-runbook.md, CC-5 alert-runbook.md, CC-7 phase-1-to-phase-2-migration-runbook.md, CC-8 restore-drill-log.md, CC-2 supabase-version-lockfile.md) land at `~/reach4all/docs/operational/` paths. Sprint 0d2 CC-6 sweeps these to `~/xrsize4all/docs/operational/` as part of the bulk operational-doc migration.
- **Prior sprint kanban:** `docs/lift-track-kanban-sprint-0d1.md` (security controls baseline integration).
- **Next sprint kanban:** `docs/lift-track-kanban-sprint-0d2.md` (framework rename + reference architecture + xrsize4all repo standup + D-decision amendments + new SD entries — Sprint 0d2 CC-7 lands SD-014 + SD-015 to the strategic decisions log).
- **Downstream sprint:** `docs/lift-track-kanban-sprint-0e.md` (listener daemon + scheduler + LLM-extraction validation; per SD-014 §11 implementation block, Sprint 0e adds monthly automated drill workflow + soft-delete + repository-pattern enforcement + anonymization function in DB on top of Sprint 0d1.5's Phase 1 substrate).
- **Sprint 0d1.5 retrospective at close:** `docs/retrospectives/lift-track-sprint-retro-0d1.5.md`.
- **Methodology:** `docs/CONVENTIONS_v0.2.4.md` §6.2 (frontmatter), §8 (per-sprint kanban), §14 (sprint open / close / carry-forward).
- **D-decisions touched by Sprint 0d1.5 stand-up:** `docs/lift-track-architecture_v0.4.0.md` D4 (cloud DB sole source of truth), D6 (magic-link auth via GoTrue), D8 (Expo + Supabase platform commitment), D11 (AI ingestion — pgvector deferred), D22 (sensitivity defaults — MinIO bucket policy), D23 (sync / offline — Realtime + logical replication substrate). Per Sprint 0d1 CC-2 Security Implications integration: each of these D-decisions carries a Security Implications sub-block citing baseline §3 controls; Sprint 0d1.5 stand-up materializes the substrate that those controls apply to.
- **Risk register:** `lifting-tracker://lift-track-risks_v0.1.0.md` — relevant entries: R-TV-05 (Hetzner pricing volatility — 30% adjustment April 2026 already happened); R-TV-* AWS Glacier pricing watch; R-TV-* Backblaze B2 financial health (Phase 2 secondary Tier 4 candidate per SD-014).
- **Forward chain (per SD-014 §11.9 + SD-015 §11.9):** Sprint 0d1.5 produces the Phase 1 stand-up that SD-014's "Sprint 0e production-launch" preconditions cite; Phase 1 → Phase 2 migration runbook drafted in CC-7 here is the deprecation-plan artifact SD-012 / SD-014 commit to.

---

© 2026 Eric Riutort. All rights reserved.
