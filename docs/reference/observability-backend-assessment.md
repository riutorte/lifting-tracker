---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# Observability Backend Assessment — Commercial-Use & EULA Posture

*Reference brief for Lifting Tracker / XRSize4 ALL. Migrates to Reach4All when the sub-system exists.*

---

## 1. Executive Summary — COMMIT Recommendation

- **COMMIT: Self-host HyperDX OSS (MIT license) on a single VPS, with a ClickHouse + MongoDB + OTel Collector + HyperDX app Docker Compose stack.** HyperDX is the only option on the evaluation list that simultaneously carries a permissive MIT license, ships a first-party React Native SDK (`@hyperdx/otel-react-native`), natively ingests OpenTelemetry, and exposes both a REST query API and direct ClickHouse SQL for MCP integration. MIT means zero AGPL §13 friction if Eric ever embeds an observability view in the customer-facing product; ClickHouse means the same backend that runs at 1k MAU also runs at 100k MAU without rip-and-replace.
- **Named fallback: SigNoz OSS (MIT core)** if ClickHouse Inc.'s stewardship of HyperDX ever produces a license change that blocks commercial self-host. SigNoz's OSS core is MIT, the `ee/` subdirectory is cleanly separable, the community is ~2x HyperDX's by GitHub stars, and the ClickHouse storage engine matches so migration between the two is straightforward at the data layer.
- **Explicit rejection of "just use Grafana Cloud Free."** The free tier is commercially usable per its ToS, but Grafana, Loki, Tempo, Mimir, and Pyroscope are all AGPLv3 since 2021–2023. That fails Eric's composite principle on two axes: (a) AGPL embedding risk if Lifting Tracker ever exposes a dashboard to coaches/athletes, and (b) the self-host escape hatch requires running AGPL software — acceptable unmodified, but a bright line against forking to fix bugs. Grafana OSS remains a viable *dashboard* if paired with non-AGPL storage (Prometheus + a permissive trace/log store), but the canonical "LGTM" stack is not the principle-aligned answer.
- **Explicit rejection of Datadog / Honeycomb / New Relic free tiers.** All three fail condition (a) and (b) of the composite principle simultaneously: they are not self-hostable at any price. Free-tier analysis is moot because there is no migration path back to an OSS core if pricing, terms, or acquisition status changes. Detailed dismissals in §8.
- **The 7 composite conditions all pass on HyperDX:** (a) permissive OSS core — MIT; (b) self-hostable by solo+AI — Docker Compose, 5 containers; (c) metrics + logs + traces + session replay; (d) OpenTelemetry-native ingestion via embedded Collector; (e) HTTP query API + direct ClickHouse SQL for MCP; (f) ClickHouse SQL and Lucene-style search are LLM-codegen-friendly; (g) ClickHouse scales from laptop to petabyte deployments without architecture change.

---

## 2. License & EULA Master Audit

Verified by fetching LICENSE files from each canonical repo and ToS pages from each vendor, April 2026.

| Project | SPDX License | Self-Host Internal Use | SaaS Embedding (customer-facing) | Known Restrictions / Flags |
|---|---|---|---|---|
| **Grafana (dashboard)** | AGPL-3.0-only *(since 2021-04-20; was Apache-2.0)* | Permitted; §13 not triggered by unmodified internal use | §13 triggers if you modify + expose over network to customers | Trademark policy restricts "Grafana" name on forks |
| **Loki** | AGPL-3.0-only *(since 2021-04-20)* | Permitted unmodified | §13 triggers on modification + customer exposure | Same trademark policy |
| **Tempo** | AGPL-3.0-only *(since 2021-04-20)* | Permitted unmodified | §13 triggers on modification + customer exposure | Same trademark policy |
| **Mimir** | AGPL-3.0-only *(launched 2022-03-30 as AGPLv3 fork of Cortex)* | Permitted unmodified | §13 triggers on modification + customer exposure | Cortex (Apache-2.0) remains the permissive alternative |
| **Prometheus** (CNCF) | Apache-2.0 *(never relicensed; CNCF-governed)* | Fully permitted | Fully permitted | CNCF trademark usage guidelines |
| **Alloy** (Grafana OTel collector distro) | Apache-2.0 | Fully permitted | Fully permitted | Grafana trademark policy on "Alloy" name |
| **Faro** (Grafana web RUM SDK) | Apache-2.0 | Fully permitted | Fully permitted | Grafana trademark policy |
| **Pyroscope** | AGPL-3.0-only *(relicensed 2023-03-15 post-acquisition)* | Permitted unmodified | §13 triggers on modification + customer exposure | Pre-acquisition Apache-2.0 versions still exist |
| **SigNoz** | MIT *(core); separate proprietary license for `ee/` subdirectory* | Fully permitted for MIT core | Fully permitted for MIT core | Do not use `ee/` files without paid license; no CLA in main CONTRIBUTING.md |
| **OpenObserve** | AGPL-3.0 | Permitted unmodified | §13 risk on modification + customer exposure | No CLA in CONTRIBUTING.md |
| **Quickwit** | **Apache-2.0** *(relicensed Jan 2025 after Datadog acquisition — was AGPL-3.0 pre-2025)* | Fully permitted | Fully permitted | **Strategic flag: Datadog owns the direction; future neglect risk real** |
| **HyperDX** | MIT | Fully permitted | Fully permitted | ClickHouse Inc. owns direction since 2024 acquisition |
| **Uptrace** | AGPL-3.0 | Permitted unmodified | §13 risk on modification + customer exposure | Very small team; bus-factor flag |
| **Apache SkyWalking** | Apache-2.0 | Fully permitted | Fully permitted | No trademark restrictions on "SkyWalking" beyond ASF norms |
| **Elasticsearch + Kibana** | Tri-license: AGPL-3.0-only / SSPL-1.0 / Elastic License 2.0 *(AGPL option added Sept 2024; pick one at adoption)* | AGPL option: permitted unmodified. SSPL option: permitted for internal use, but §13 prohibits offering "ES-as-a-service" | AGPL option: §13 risk if modified + exposed. SSPL option: wide "service stack" clause — procurement red flag | x-pack subdirectory is ELv2-only (proprietary) |
| **Parseable** | AGPL-3.0 | Permitted unmodified | §13 risk on modification + customer exposure | Small project, S3-native, logs-primary |
| **Jaeger** | Apache-2.0 | Fully permitted | Fully permitted | v2 (Nov 2024) rebuilt on OTel Collector; v1 EOL Dec 31 2025 |

**Sources** — LICENSE files: [Grafana](https://github.com/grafana/grafana/blob/main/LICENSE), [Loki](https://github.com/grafana/loki/blob/main/LICENSE), [Tempo](https://github.com/grafana/tempo/blob/main/LICENSE), [Mimir](https://github.com/grafana/mimir/blob/main/LICENSE), [Prometheus](https://github.com/prometheus/prometheus/blob/main/LICENSE), [Alloy](https://github.com/grafana/alloy/blob/main/LICENSE), [Faro web SDK](https://github.com/grafana/faro-web-sdk/blob/main/LICENSE), [Pyroscope](https://github.com/grafana/pyroscope/blob/main/LICENSE), [SigNoz](https://github.com/SigNoz/signoz/blob/main/LICENSE), [OpenObserve](https://github.com/openobserve/openobserve/blob/main/LICENSE), [Quickwit](https://github.com/quickwit-oss/quickwit/blob/main/LICENSE), [HyperDX](https://github.com/hyperdxio/hyperdx/blob/main/LICENSE), [Uptrace](https://github.com/uptrace/uptrace/blob/master/LICENSE), [SkyWalking](https://github.com/apache/skywalking/blob/master/LICENSE), [Elasticsearch tri-license](https://github.com/elastic/elasticsearch/blob/main/LICENSE.txt), [Parseable](https://github.com/parseablehq/parseable/blob/main/LICENSE), [Jaeger](https://github.com/jaegertracing/jaeger/blob/main/LICENSE).

**AGPLv3 Section 13 reference:** [gnu.org/licenses/agpl-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The trigger requires **modification AND network interaction with users of the modified version**. Unmodified AGPL software run as backend infrastructure does not, on the text of the license, force source disclosure — but commercial counsel diverges on how aggressive "modification" interpretation gets. Grafana Enterprise exists precisely to sell an AGPL escape hatch, which is evidence that Grafana Labs itself treats AGPL as commercial-friction.

**Relicense history flags** — 2021 saw Grafana relicense core projects from Apache-2.0 to AGPLv3 ([announcement](https://grafana.com/blog/2021/04/20/grafana-loki-tempo-relicensing-to-agplv3/)); 2021 also saw Elastic relicense from Apache-2.0 to SSPL+ELv2, prompting the AWS OpenSearch fork. Elastic added AGPLv3 as a third option in Sept 2024 ([Elastic IR announcement](https://ir.elastic.co/news/news-details/2024/Elastic-Announces-Open-Source-License-for-Elasticsearch-and-Kibana-Source-Code/default.aspx)). These two events define the modern observability licensing landscape.

---

## 3. OSS Alternatives That Pass the First License Filter

Seven options pass the initial license filter (license is permissive OR AGPL with clean internal-use path). Each gets a focused treatment below. Options that fail the first filter — Quickwit (Datadog-owned, no metrics), Uptrace (bus-factor), Elastic SSPL-only, and the three SaaS vendors — are dismissed in §8 or noted in §9.

### 3.1 HyperDX *(MIT; ClickHouse-backed; RN-first)*

What it is. An open-source APM started by DeploySentinel, acquired by ClickHouse Inc. in 2024. Full observability stack — metrics, logs, traces, session replay — on top of ClickHouse. Distinctive feature: a first-party React Native SDK and native session replay integration via rrweb.

Who uses it. Primarily ClickHouse-ecosystem shops and RN-heavy teams. Notable for being the only project in this evaluation with a real first-party React Native SDK ([`@hyperdx/otel-react-native`](https://www.npmjs.com/package/@hyperdx/otel-react-native)), last published January 2025 and stable in Expo managed workflow (no config plugin required).

What it does well. MIT license means no AGPL §13 exposure even if Eric later embeds a dashboard view in the customer-facing app. OTLP ingestion via embedded Collector. ClickHouse SQL is one of the most LLM-codegen-friendly query languages in the observability space — Claude Code / Cowork can author ad-hoc queries against it with minimal friction. Lucene-style search for logs covers the "just let me grep production" use case. Session replay is a genuinely useful differentiator for a mobile product diagnosing gym-floor UX issues.

What it does poorly. The Docker Compose stack includes **MongoDB as an app-metadata store**, which is an odd operational choice and an extra moving part. Smaller community than SigNoz or the Grafana ecosystem — roughly half the GitHub stars and a narrower set of third-party integrations. No profiles in OSS (ClickHouse Inc. may integrate Pyroscope-style profiling over time but it isn't there today). ClickHouse Inc.'s ownership is a strategic risk — acquisitions historically precede license changes (cf. Grafana 2021, Elastic 2021, HashiCorp 2023, Redis 2024). MIT code already released stays MIT, so the mitigation is straightforward: fork at the last MIT tag if they ever relicense.

Self-host complexity. Docker Compose deploy — 5 containers: HyperDX app, OTel collector, ClickHouse, MongoDB, Redis. Baseline footprint ~4–8 GB RAM, 2 vCPU; ClickHouse dominates memory. Single-VPS deploy is realistic at 1k–10k MAU; horizontal scale via ClickHouse cluster mode.

### 3.2 SigNoz *(MIT core + `ee/` carve-out; ClickHouse-backed)*

What it is. Full open-source APM, YC-backed, started 2020. The most production-proven MIT-licensed OTel-native observability project of the current generation. Ships metrics, logs, traces, exceptions, alerting.

Who uses it. Mid-market SaaS companies in NA and EU as a Datadog/New Relic alternative. Largest GitHub star count and community activity of the OSS APM cohort — materially larger than HyperDX, Uptrace, or Quickwit. Monthly minor-release cadence through 2025.

What it does well. Open-core model with a clean license line: MIT for the core, separate commercial license in `ee/`. PromQL for metrics is a widely-known, LLM-friendly dialect. Backend is ClickHouse, which means SQL passthrough is available when the query builder UI isn't enough. Strong OTel-native ingestion with published OTLP endpoints. Active Expo/React Native documentation — though instrumentation is via generic OTel JS, not a first-party RN SDK.

What it does poorly. No first-party React Native SDK — you wire `@opentelemetry/sdk-trace-web` or equivalent and ship OTLP/HTTP. That path is "not officially supported" by the OTel JS project on RN and breaks periodically on minor version bumps. No session replay. No profiles. Custom query-builder JSON layer that sits between the user and PromQL/SQL is less LLM-friendly than raw SQL or PromQL. 6-container Docker Compose stack (frontend, query-service, OTel collector, ClickHouse, ZooKeeper, Alertmanager) is the heaviest deploy footprint of the shortlist candidates.

Self-host complexity. Docker Compose published; Helm chart maintained. Baseline footprint ~4–8 GB RAM, 2 vCPU on a single VPS at low scale. ZooKeeper and ClickHouse are the two operational surfaces that matter.

### 3.3 OpenObserve *(AGPL-3.0; S3-native; logs/metrics/traces/RUM)*

What it is. A Rust-implemented observability backend with logs, metrics, traces, and RUM/session replay. Defining architectural choice: object storage (S3, R2, GCS, MinIO) is the primary data store, with metadata in Postgres/MySQL/SQLite/etcd. Single binary in standalone mode.

Who uses it. Logging-heavy shops, cost-sensitive deployments where S3 economics beat ClickHouse. Active in telco and infrastructure verticals. Smaller than SigNoz but growing; third-party integrations extensive (Elasticsearch-compatible ingest, Prometheus remote-write, Loki, Fluentd, Syslog).

What it does well. **Operationally the easiest self-host on the list.** One binary. S3 for storage. SQL-primary query language — the best case for LLM codegen. Broadest feature surface of the OSS projects (logs + metrics + traces + RUM + session replay all first-class). Native OTLP ingestion.

What it does poorly. AGPL-3.0 carries §13 network-use risk if Eric ever modifies OpenObserve and exposes the modified version to customers. Unmodified use is fine; modified forks that ship to end-users aren't. Smaller mobile SDK ecosystem than HyperDX — no first-party RN SDK, so Expo instrumentation is the OTel JS path. AGPL is an increasingly common allow-list exclusion at enterprise procurement.

Self-host complexity. Single binary + SQLite + local disk at minimum viable. Or single binary + object store + Postgres at production. Helm chart for HA mode. Baseline ~500 MB RAM at rest.

### 3.4 Apache SkyWalking *(Apache-2.0; most permissive; mature)*

What it is. The most permissively-licensed observability project on the shortlist. Apache Software Foundation top-level project since 2019. Broad scope: metrics, logs, traces, profiles (async-profiler JFR integration), service topology, service-mesh observability, alerting, and browser RUM via `skywalking-client-js`.

Who uses it. Heavy Chinese enterprise adoption — Alibaba, Huawei, Tencent, Baidu, China Telecom, WeBank, China Merchants Bank, China Eastern Airlines, iFLYTEK. Western enterprise adoption driven primarily by tetrate.io around service-mesh observability. Less mindshare in the NA/EU startup-SaaS world.

What it does well. Apache-2.0 is maximally permissive — zero AGPL or SSPL ambiguity anywhere in the stack. ASF governance means neither a company acquisition nor a unilateral relicense can pull the rug (ASF's IP policy is ironclad). Native OTLP ingestion for metrics, traces, and logs. Storage backend flexibility — BanyanDB (purpose-built TSDB), Elasticsearch/OpenSearch, or relational DBs. Broadest feature set of any permissive option — profiles and RUM are first-class.

What it does poorly. **No dedicated React Native or iOS mobile agent** as of April 2026 — the agent roster is Java/.NET/PHP/Node/Go/Lua/Rust/C++/Python/browser-JS. Expo instrumentation is the OTel JS → OTLP path, same as SigNoz/OpenObserve. Custom Observability Analysis Language (OAL) for stream processing is idiosyncratic and has a smaller LLM training corpus than PromQL/SQL. Community mindshare skew toward China creates a real support-timezone and English-docs-quality issue for a solo founder in the NA timezone.

Self-host complexity. OAP server + storage backend + UI. BanyanDB simplifies storage if you want the SkyWalking-native path. Docker and Helm available. Moderate complexity — lower than the 4-box Grafana à la carte, higher than OpenObserve.

### 3.5 À la carte: Jaeger + Prometheus + Loki + Grafana *(mixed; highest ops burden)*

What it is. Not a product — a composition pattern. Four separate projects glued together: Jaeger (Apache-2.0) for traces, Prometheus (Apache-2.0) for metrics, Loki (AGPLv3) for logs, Grafana (AGPLv3) for the UI. Often marketed as "LGTM" when the `T` is Tempo (Grafana's alternative to Jaeger) and the `M` is Mimir (alternative to Prometheus).

Who uses it. Kubernetes shops that already run kube-prometheus-stack. Enterprises that want best-in-class PromQL without a reimplementation. Teams with dedicated SRE capacity.

What it does well. PromQL in its native form is the reference implementation, not a clone. Jaeger v2 (released 2024-11-12, rebuilt on the OpenTelemetry Collector) closed the last OTel-native gap. Each component is best-in-class at its narrow job. Community, docs, and tooling depth are unmatched.

What it does poorly. **Operationally this is the worst fit for a solo+AI team.** Four (or five, if you run an OTel collector out front) independent release cycles. Exemplar and trace-link correlation requires careful Prometheus + Loki + Grafana datasource configuration and breaks on upgrade. Identity / auth is Grafana-only by default; the other three sit behind nginx or oauth2-proxy, which is a fifth moving part. AGPL for Grafana and Loki means the same §13 caveats as OpenObserve — internal use fine, modification + customer exposure risky. If you want a pure-permissive variant: swap Grafana for something else (no clean equivalent in April 2026) and swap Loki for OpenObserve or Parseable.

Self-host complexity. High. ~4–6 containers plus auth proxy. Schema alignment across stores is an ongoing cost.

### 3.6 Parseable *(AGPL-3.0; S3-native; logs-primary)*

What it is. A Rust-implemented log analytics backend with Apache Parquet storage on S3-compatible object storage. Positioned as "unified observability" in 2025-2026 marketing, but the center of gravity remains high-volume structured logs. Single binary.

Who uses it. Cost-sensitive logging deployments where S3 economics matter. Less suited as a primary APM than as a specialized log store.

What it does well. Cheapest long-term retention model of the shortlist — Parquet on S3 is pennies per GB-month. Single Rust binary, minimal ops surface. SQL-only query language, very LLM-friendly. Good fit if logs are the primary signal and traces/metrics are secondary.

What it does poorly. Traces and metrics are less mature than logs. No APM UI in the SigNoz/HyperDX sense — service maps, flame graphs, and exemplar linking are absent or shallow. AGPL §13 concerns identical to OpenObserve. Smaller community and bus-factor concerns.

Self-host complexity. Single binary + object store. Lowest operational footprint of any shortlist candidate, at the cost of scope.

### 3.7 Elastic Stack *(tri-license: AGPL / SSPL / ELv2; high ops burden)*

What it is. Elasticsearch + Kibana + APM Server + Elastic Agent, tri-licensed since September 2024. Picking the AGPL option resolves the procurement problem that SSPL created in 2021.

Who uses it. Enterprises with existing Elastic expertise. Teams that need Elastic's search and ML features on logs. Less compelling as a greenfield choice for a solo+AI team.

What it does well. Mature APM, mature search, mature ML. Available under AGPLv3 since Sept 2024, which is OSI-approved and widely understood. Native OTLP ingestion via Elastic Agent.

What it does poorly. JVM heap tuning is a specialty. Shard and index management is a recurring operational task. **High ops burden relative to SigNoz/HyperDX/OpenObserve**, especially for a solo founder. The `x-pack` subdirectory remains ELv2-only (proprietary); you need to be careful about which features you use and whether you have them under AGPL vs. ELv2. OpenSearch (Apache-2.0, transferred to Linux Foundation in 2024, now at v3.0 with Lucene 10) is the permissive alternative if the Elastic brand isn't required.

Self-host complexity. Docker and Helm distributions exist but tuning Elasticsearch for sustained write throughput is a recurring job, not a one-time setup.

---

## 4. Composite-Principle Scoring and Top 3 Shortlist

### 4.1 Score Matrix

Each option scored 1 (worst) to 5 (best) on the seven composite conditions. Commercial-use posture (a) is load-bearing — options with ambiguous EULAs are penalized aggressively. Total is unweighted sum; weighted interpretation in §4.2.

| Option | (a) Permissive License | (b) Solo+AI Self-Host | (c) M+L+T Coverage | (d) OTel-Native | (e) MCP-able API | (f) AI-Friendly QL | (g) Scales 1k→100k MAU | **Total / 35** |
|---|---|---|---|---|---|---|---|---|
| **HyperDX** | 5 (MIT) | 4 (5 containers) | 5 (+session replay) | 5 (OTLP embedded) | 5 (REST + CH SQL) | 5 (CH SQL + Lucene) | 5 (ClickHouse) | **34** |
| **OpenObserve** | 3 (AGPL internal-OK) | 5 (single binary, S3) | 5 (+RUM + replay) | 5 | 5 | 5 (SQL primary) | 5 (S3) | **33** |
| **SigNoz** | 5 (MIT core) | 3 (6 containers, ZK) | 5 | 5 | 4 (REST via layer) | 4 (PromQL + CH SQL) | 5 (ClickHouse) | **31** |
| **Apache SkyWalking** | 5 (Apache-2.0) | 3 (OAP + storage + UI) | 5 (+profiles + RUM) | 5 | 4 (GraphQL + REST) | 3 (OAL custom) | 5 | **30** |
| **Parseable** | 3 (AGPL internal-OK) | 5 (single binary, S3) | 3 (L primary) | 5 | 4 | 5 (SQL) | 5 | **30** |
| **Quickwit** | 5 (Apache-2.0 since Jan 2025) | 4 (single binary, S3) | 3 (no metrics) | 5 | 4 | 3 (ES DSL + tantivy) | 5 | **29** *[Datadog-owned]* |
| **Grafana à la carte** | 3 (mixed AGPL) | 2 (4–5 services + auth proxy) | 5 | 5 | 3 (3 dialects) | 4 (PromQL + LogQL + TraceQL) | 4 | **26** |
| **Elastic (AGPL opt)** | 3 (AGPL w/ ELv2 carve-out) | 2 (JVM ops) | 5 | 4 | 4 | 3 (ES DSL) | 5 | **26** |
| **Uptrace** | 3 (AGPL internal-OK) | 3 (4 containers) | 5 | 5 | 3 (custom UQL) | 3 (UQL) | 4 | **26** *[bus-factor]* |
| **Grafana Cloud Free** | 1 (SaaS; OSS escape is AGPL) | 1 (not self-host) | 5 | 5 | 5 | 4 | 3 (tier ceilings) | **24** |
| **New Relic Free** | 1 (SaaS only) | 1 | 5 | 5 | 5 | 4 | 3 | **24** |
| **Datadog Free** | 1 (SaaS only) | 1 | 5 (paid features) | 5 | 5 | 4 | 3 | **24** |
| **Honeycomb Free** | 1 (SaaS only) | 1 | 3 (events-centric) | 5 | 5 | 3 (Honeycomb query) | 3 | **21** |

### 4.2 Top 3 Shortlist — HyperDX, SigNoz, OpenObserve

The three options above 30 points all satisfy all seven conditions. The two at 30 (SkyWalking, Parseable) are outscored on either scope (Parseable's log-primary gap) or mobile-story (SkyWalking has no RN agent). Ordering the top 3 by *weighted* composite — license permissiveness and solo+AI self-host as load-bearing axes per Eric's stated priorities:

1. **HyperDX (MIT)** — highest raw score, only option with a first-party React Native SDK. The MongoDB dependency and ClickHouse-Inc.-ownership are real costs but don't dominate.
2. **SigNoz (MIT core)** — larger community, longer track record, cleaner fallback path. Higher ops burden than OpenObserve but materially lower than Grafana à la carte. MIT license removes the AGPL ambiguity that OpenObserve carries.
3. **OpenObserve (AGPL-3.0)** — operationally the lightest self-host on the shortlist, broadest feature surface, SQL-first. AGPL is the cost — fine for Lifting Tracker's internal ops use, becomes a flag if Eric ever needs to embed observability in the customer-facing product.

### 4.3 Prioritization Evidence

| Criterion | HyperDX | SigNoz | OpenObserve |
|---|---|---|---|
| GitHub stars (approx. April 2026) | ~8k | ~20k | ~13k |
| Release cadence 2025 | Active (monthly-ish) | Active (monthly) | Active (monthly) |
| Documentation quality for solo dev | Good (ClickHouse-docs-heritage) | Excellent (largest community; many blog walkthroughs) | Good (official docs are strong; smaller blog ecosystem) |
| Operational burden (solo + AI) | Medium (5 containers incl. MongoDB) | Medium-High (6 containers incl. ZooKeeper) | **Low (single binary possible)** |
| AI-codegen quality for query language | **Very high (ClickHouse SQL is well-trained in LLMs)** | High (PromQL + CH SQL; query builder JSON is the weak link) | **Very high (SQL primary)** |
| First-party React Native SDK | **Yes (`@hyperdx/otel-react-native`)** | No (OTel JS path) | No (OTel JS path) |
| Session replay for mobile UX debugging | Yes | No | Yes (browser; RN unclear) |
| Ownership / durability risk | ClickHouse Inc. owned (2024); MIT mitigates | Independent (YC-backed) + MIT | Independent (small company) + AGPL |

**The decisive factor for Lifting Tracker: the first-party React Native SDK.** Lifting Tracker's primary client is an Expo/RN app. Every other option on the shortlist forces instrumentation through the "not officially supported on RN" OpenTelemetry JS SDK path, which breaks on minor version bumps and lacks crash capture. HyperDX's `@hyperdx/otel-react-native` package closes that gap uniquely. SigNoz's superior community matters when HyperDX can't be made to work — hence SigNoz as the named fallback.

---

## 5. Solo+AI Operational Reality — Top 3

For each shortlist candidate: actual install story, orchestration shape, storage backend, monthly infrastructure cost estimate, backup story.

### 5.1 HyperDX — COMMIT Target

**Install story.** Docker Compose on a single VPS. The `hyperdxio/hyperdx/deploy/docker-compose.yml` from the repo brings up five services: HyperDX app (UI + API), OpenTelemetry Collector, ClickHouse, MongoDB (app metadata), Redis (caching / queue). Single-command `docker compose up -d` bring-up. React Native instrumentation via `@hyperdx/otel-react-native` npm package — no Expo config plugin required, compatible with Expo managed workflow. Supabase Edge Functions instrumented via OpenTelemetry JS SDK exporting OTLP/HTTP to the same Collector endpoint.

**Orchestration shape.** Docker Compose (not Kubernetes, not systemd-per-service, not LXC). A single Hetzner CPX31 or equivalent ($8–$15/month for 4vCPU/8GB RAM/80GB disk) is the minimum viable production deploy at Lifting Tracker's expected early scale. Caddy or Traefik as a reverse proxy with automated Let's Encrypt. Optional object-storage offload for ClickHouse cold data to cut disk cost at larger retention.

**Storage backend.** ClickHouse as the columnar store for all telemetry. MongoDB as app-metadata store (dashboards, alerts, user config). Redis for ephemeral state. Retention policy tunable per signal type — default 30 days traces / 30 days logs / 90 days metrics is reasonable for MVP.

**Monthly infrastructure cost.** $10–$25 at 1k MAU on a single CPX31. $40–$80 at 10k MAU on a CPX41/51 with larger disk or ClickHouse tier split. $200–$400 at 100k MAU with a multi-node ClickHouse and S3-tiered cold storage. This is 5–20× cheaper than Grafana Cloud paid tiers at equivalent scale.

**Backup story.** ClickHouse `BACKUP` statement to S3-compatible object storage (R2, Backblaze B2, or a separate cheap S3 provider). MongoDB dump on a cron. Both can be automated with a 30-line bash script plus a systemd timer. Restore tested quarterly. No vendor backup service needed.

### 5.2 SigNoz — Named Fallback

**Install story.** Docker Compose or Helm chart from the `signoz/signoz` repo. Six services: frontend, query-service, OTel collector, ClickHouse, ZooKeeper (for ClickHouse coordination), Alertmanager. Single-command bring-up but more moving parts to understand than HyperDX.

**Orchestration shape.** Docker Compose for solo-founder scale; Helm on Kubernetes when the team grows past 3 engineers. Single VPS is viable at 1k MAU.

**Storage backend.** ClickHouse + ZooKeeper. Same underlying economics as HyperDX but with ZooKeeper as the extra coordination surface.

**Monthly infrastructure cost.** Similar to HyperDX: $15–$30 at 1k MAU, $50–$100 at 10k MAU, $250–$450 at 100k MAU. Slightly higher floor due to ZooKeeper memory overhead.

**Backup story.** ClickHouse `BACKUP` statement + periodic export of SQLite/Postgres app metadata. ZooKeeper state regeneratable from ClickHouse.

### 5.3 OpenObserve — Ops-Ease Alternative

**Install story.** Single Rust binary deploy. Can run as `systemd` unit on a VPS, no Docker required. Local SQLite for metadata + local disk for data is the trivial path. Production: add S3/R2 for cold storage, Postgres for metadata.

**Orchestration shape.** Systemd unit on a single VPS is viable at all evaluated scales. Kubernetes only matters if you split ingest from query workloads.

**Storage backend.** Object storage (S3, R2, GCS, MinIO) for data; SQLite or Postgres for metadata. R2 free tier covers most solo-founder retention needs.

**Monthly infrastructure cost.** **Lowest of the three.** $5–$15 at 1k MAU on a single small VPS with R2 object storage. $20–$50 at 10k MAU. $100–$200 at 100k MAU with query-node scaling. Cloudflare R2 egress-free pricing is a genuine cost advantage.

**Backup story.** R2 lifecycle rules handle data durability. Metadata backup is a Postgres dump or SQLite file copy.

### 5.4 Cost Comparison Summary

| Scale | HyperDX self-host | SigNoz self-host | OpenObserve self-host | Grafana Cloud Paid | Datadog |
|---|---|---|---|---|---|
| 1k MAU | $10–$25/mo | $15–$30/mo | $5–$15/mo | $29–$49/mo | $15–$45/mo (free limits) |
| 10k MAU | $40–$80/mo | $50–$100/mo | $20–$50/mo | $100–$250/mo | $200–$600/mo |
| 100k MAU | $200–$400/mo | $250–$450/mo | $100–$200/mo | $500–$1500/mo | $1500–$5000/mo |

Cost estimates assume ~10% of Lifting Tracker's compute budget goes to observability, which is industry-typical. Actual numbers will vary with log verbosity and retention; the *ratios* are what matters for the decision — self-hosted OSS is 2–10× cheaper than managed SaaS at all scales.

---

## 6. Recommendation — Named COMMIT

**COMMIT: Self-host HyperDX OSS under MIT license.** Deploy as Docker Compose on a single VPS (Hetzner CPX31 or equivalent, ~$15/month) running five containers: HyperDX app, OpenTelemetry Collector, ClickHouse, MongoDB, Redis. Instrument the Expo/React Native app with `@hyperdx/otel-react-native`. Instrument Supabase Edge Functions with `@opentelemetry/sdk-node` exporting OTLP/HTTP to the self-hosted Collector. Treat the HyperDX UI as Eric-and-team-only; do not expose it to athletes or coaches (even though MIT permits it, the operational boundary simplifies auth and RBAC).

**Why this is the principle-aligned COMMIT:**
- MIT license satisfies (a) "permissive OSS for commercial use" without any AGPL §13 asterisks.
- Docker Compose on a single VPS satisfies (b) "self-hostable by solo+AI without specialized ops burden."
- HyperDX covers metrics + logs + traces + session replay, satisfying (c) with a bonus.
- Embedded OpenTelemetry Collector + OTLP endpoints satisfy (d).
- Both REST API and direct ClickHouse SQL satisfy (e) for MCP integration — an MCP server can speak either.
- ClickHouse SQL and Lucene-style search satisfy (f) — both are high-training-data LLM languages.
- ClickHouse scales horizontally, so (g) "1k to 100k MAU without rip-and-replace" is satisfied by backend architecture, not vendor promise.

### 6.1 Three Highest-Risk Items to Watch

1. **ClickHouse Inc. relicensing HyperDX.** Acquisitions have historically preceded license changes. Mitigation: track the repo's LICENSE file quarterly; tag a known-good MIT commit and maintain a fork-readiness posture. MIT code already released stays MIT, so a future relicense is a "freeze at last good version and maintain ourselves" event, not an existential threat.
2. **React Native SDK abandonment.** `@hyperdx/otel-react-native` is a single-company-maintained package. Last published January 2025 is recent but long-tail maintenance depends on ClickHouse Inc.'s continued investment. Mitigation: the SDK is a thin wrapper around OpenTelemetry JS; falling back to raw `@opentelemetry/sdk-trace-web` + OTLP exporter is a 50-line refactor, not a migration.
3. **MongoDB as app-metadata store.** The MongoDB dependency is an operational wart and an unusual choice in a ClickHouse-centric stack. Mitigation: MongoDB is well-understood, backup is trivial, and if HyperDX ever replaces it with Postgres or embedded SQLite (plausible roadmap direction), the migration is a one-time data copy.

### 6.2 Named Fallback: SigNoz (MIT core)

If within the first 90 days of HyperDX deployment, Eric hits a blocker — SDK incompatibility with a specific Expo SDK version, ClickHouse Inc. announces a license shift, MongoDB dependency becomes unmanageable — migrate to SigNoz. Same ClickHouse storage backend means the data-layer transition is straightforward (schema translation, not re-ingest). Same MIT license posture. Instrumentation path becomes generic OpenTelemetry JS. Larger community means more Stack Overflow / GitHub-issue coverage when stuck.

### 6.3 Migration Path from Managed SaaS (Deferred Start Option)

If Eric prefers to defer the self-host operational burden during the MVP sprint, the acceptable interim is:

1. **Weeks 1–8 of MVP:** Start on **Grafana Cloud Free tier** (commercially usable per its ToS per §7 below). Instrument the app with OpenTelemetry JS → Grafana Alloy → Grafana Cloud Loki/Tempo/Mimir. Focus on establishing OTel semantic conventions and dashboard patterns, not operating the backend.
2. **When metrics approach 10k active series OR logs approach 50 GB/month OR retention past 14 days becomes necessary:** migrate to self-hosted HyperDX. The migration is single-directional — export dashboard JSON from Grafana Cloud (possible but lossy; HyperDX dashboards are different), re-point OTLP exporters from Grafana Cloud endpoints to the self-hosted Collector, maintain both in parallel for two weeks, then cut over. Budget one engineering week.
3. **Never let the Grafana Cloud Free tier become production-critical.** It will not bind Eric to an upgrade path (see §7), but *habit* will. Treat it as a time-boxed learning environment.

The deferred-start path is explicitly the second-best option. The principle-aligned answer is to self-host from day one. The deferred path exists because reasonable people trade principle for velocity during MVP.

---

## 7. Grafana Cloud Free Tier — The Specific Gap Eric Flagged

Eric's original instinct was that "free tier" commercial-use gotchas often bite in a business context. The research closes the gap: **Grafana Cloud Free is commercially usable for a solo-founder SaaS within its caps**, but the *self-host escape hatch* that makes it principle-aligned is materially softer than it appears.

### 7.1 The Commercial-Use Read

The Grafana Cloud ToS ([grafana.com/legal/grafana-cloud-tos](https://grafana.com/legal/grafana-cloud-tos/)) does not contain a non-commercial or dev/test-only restriction on the free tier. Representative clause handle: *"Customer may use the Services for its internal business purposes"* — and tier caps are the only binding constraint: *"subject to the applicable Service Tier's limits"*. A solo founder running Lifting Tracker on Grafana Cloud Free, within 10k active series / 50 GB logs / 50 GB traces / 14-day retention / 3 active Grafana users, is within the stated permissions.

### 7.2 The AUP Constraint That Matters

The Acceptable Use Policy ([grafana.com/legal/aup](https://grafana.com/legal/aup/)) prohibits reselling or white-labeling the service and using it on behalf of third parties. For Lifting Tracker this means:
- **Using Grafana Cloud to monitor the Lifting Tracker backend — permitted.**
- **Embedding Grafana dashboards in the athlete/coach-facing product as a feature — AUP violation.** (Also a tier mismatch; even if permitted, the 3-user cap would kill this immediately.)

### 7.3 Overage Behavior — Unusually Founder-Friendly

Overage on the free tier results in **ingestion being dropped**, not silent upgrade billing. Documented at [docs.grafana.com/grafana-cloud/cost-management-and-billing](https://grafana.com/docs/grafana-cloud/cost-management-and-billing/). A solo founder won't wake up to a $2,000 surprise invoice; they'll wake up to missing data after the 50 GB/month log quota is exhausted.

### 7.4 Does Free Bind Eric to an Upgrade Path?

**No — technically.** Data export via Prometheus remote-read, Loki query API, Tempo API, and Grafana dashboard JSON export is all permitted per the ToS (*"Customer retains all right, title, and interest in Customer Data"*). There is no Export Control Fee, no proprietary format lock-in, and migration to self-hosted OSS is documented.

**Yes — practically.** Migration effort is 1–3 engineering days, not a one-click operation. There is no "export everything" button. Dashboards migrate but alert rules and contact points need rewiring. The operational muscle memory built over 6 months of Grafana Cloud use does not transfer perfectly to self-hosted Grafana. More importantly: the path leads back to AGPLv3 software (Grafana, Loki, Tempo, Pyroscope are all AGPLv3 since 2021–2023). So the "self-host escape hatch" lands you on software that has the same §13 concerns as OpenObserve or Uptrace — not the cleanly permissive landing Eric's principle calls for.

### 7.5 Why This Eliminates Grafana Cloud Free as the Permanent Answer

Eric's composite principle is "open-source core, truly permissively licensed for commercial use, self-hostable without SaaS lock-in." Grafana Cloud Free satisfies the first two clauses imperfectly and the third clause only with an AGPL catch. That's why the COMMIT names HyperDX, not Grafana Cloud — not because Grafana Cloud is bad, but because the principle-aligned answer can't be a vendor whose OSS escape hatch is itself a license-flag.

Grafana Cloud Free remains the **correct interim choice** for a velocity-over-principle MVP sprint (see §6.3), because its caps are generous, its commercial-use posture is clean, and its overage behavior won't produce a surprise bill. But it is not the terminal answer.

---

## 8. Datadog / Honeycomb / New Relic — Short Dismissals

**Datadog.** 5-host free tier, 1-day retention, no APM or logs free. Commercial use permitted per MSA. Custom-metrics billing is the canonical solo-founder trap: a high-cardinality tag (user_id, request_id) silently creates thousands of billable custom metrics. No self-host path at any price. Fails condition (a) and (b) of the composite principle simultaneously — observability vendor lock-in is exactly what Eric's principle rejects.

**Honeycomb.** 20M events/month free tier, 60-day retention across all plans, commercial use permitted. The event-centric model is an excellent fit for traces but awkward for metrics and logs. No bulk raw-event export — once past retention, data is gone. No self-host path. Fails (a) and (b). If Eric's primary question were "best tracing UX for distributed systems," Honeycomb would be a serious candidate; for a full-stack observability backend under his composite principle, it isn't.

**New Relic.** 100GB/month perpetual-free tier is real, user-count limits are workable (unlimited Basic users + 1 free Full-platform user), commercial use permitted. At 100GB ingest Eric would upgrade — $0.40–$0.60/GB overage. No self-host path. Fails (a) and (b). The free tier is generous enough to consider for a 12-month MVP but principle-disqualified for long-term commitment.

**Common pattern across all three:** free tiers vary in generosity, commercial-use language is clean enough across all three for a solo founder to use in production, and none of them offer an OSS escape hatch. The dismissal isn't about pricing or EULA specifics — it's that none of them can be self-hosted if the vendor changes terms, gets acquired, or discontinues the free tier. That structural risk is exactly what Eric's composite principle was built to avoid.

---

## 9. Open Questions & Tripwires

Decisions worth revisiting if any of the following occur:

- **ClickHouse Inc. relicenses HyperDX to AGPL / BSL / any non-MIT.** Immediate trigger for fallback to SigNoz. Set a quarterly calendar reminder to check the HyperDX LICENSE file.
- **Grafana Labs relicenses any of its AGPL projects back to Apache-2.0.** Unlikely but would materially re-open the "LGTM stack" as a permissive option.
- **SigNoz pursues an open-core SSPL / BSL relicense.** The `ee/` carve-out is a precursor pattern; their CLA (if they adopt one) would be the trigger to watch. Current state: no CLA, MIT core. Track the CONTRIBUTING.md quarterly.
- **ClickHouse itself changes license.** Currently Apache-2.0, but ClickHouse Inc. has a commercial-cloud incentive structure identical to MongoDB circa 2018. A ClickHouse SSPL event would affect HyperDX, SigNoz, and Uptrace simultaneously — a systemic risk to the entire ClickHouse-backed OSS APM category.
- **A new entrant emerges with MIT/Apache + native RN SDK + S3-native storage.** This is the "perfect" composite answer that doesn't exist today. OpenObserve is close but AGPL; Parseable is close but logs-primary; HyperDX is close but ClickHouse-backed rather than S3-native. Watch the Rust+S3-native observability space — Quickwit (now Datadog's) proved the architecture; a non-Datadog-controlled successor would be compelling.
- **Expo / React Native OpenTelemetry SDK becomes first-class supported.** If `@opentelemetry/sdk-trace-web` or a new `@opentelemetry/sdk-react-native` package lands with official RN support, HyperDX's mobile-SDK moat collapses and OpenObserve (lowest ops burden) becomes more compelling.
- **Datadog does something strategic with Quickwit.** They could kill it, relicense it back to AGPL, or invest in it as an OSS counter-weight. Currently Apache-2.0, currently receiving maintenance commits. Track via repo activity.
- **New self-hosted commercial offerings.** Groundcover, Coroot, and similar newer entrants may mature into shortlist candidates in the 2026–2027 timeframe. Re-evaluate annually.

**Re-check-by date: 2026-07-23** (per frontmatter). Quarterly license-file sweep on HyperDX, SigNoz, ClickHouse, Grafana, and OpenObserve is the minimum discipline.

---

© 2026 Eric Riutort. All rights reserved.
