---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# ElectricSQL Assessment for Lifting Tracker

## 1. Executive summary

- **Recommendation: HOLD.** Electric 1.0 is production-grade for its intended job, but its intended job changed in the 2024 rewrite. It is now a **read-path-only** sync engine; it does not handle writes back to Postgres. The premise that motivated considering it ("Postgres on client, Postgres on server, sync between them") is true only on web (PGlite/WASM) and is not true on React Native today.
- **Single strongest reason:** PGlite does not run in React Native as of April 2026 — [tracking issue #87](https://github.com/electric-sql/pglite/issues/87) is still open, `libpglite` native bindings are announced but not shipped. On iOS you end up with the same SQLite-on-device story as WatermelonDB or PowerSync, plus a hand-rolled write path through Supabase, plus a CVSS 9.9 SQL injection (CVE-2026-40906) that was patched only in 1.5.0 two days before this assessment.
- **What changes the call:** `libpglite` shipping for React Native with stable sync; or Electric publishing a first-class RN write-path integration with Supabase. Re-check in 90 days.
- **Meanwhile:** Stay on D8's current choice (WatermelonDB) for Sprint 0 or substitute **PowerSync** if you want bidirectional Postgres sync today. PowerSync is source-available (FSL), self-hostable, bidirectional, React Native-native, Supabase-blessed.
- **Composite principle score (Electric today):** (a) MCP: neutral — server is plain Postgres via supabase-mcp; no Electric-specific MCP. (b) Self-host: yes, Apache 2.0. (c) Not-SaaS: yes. (d) AI-codegen: partial — server SQL is great; client layer now means TanStack DB collection config, not SQL. Fails on (d) once you factor in the RN write-path glue you have to write yourself.

## 2. Production maturity

| Signal | Finding | Source |
|---|---|---|
| First 1.0 GA | 2025-03-17 | [Electric 1.0 released](https://electric-sql.com/blog/2025/03/17/electricsql-1.0-released) |
| Latest stable (as of 2026-04-23) | 1.5.x (CVE fix release), `@electric-sql/client` 1.5.15 | [releases](https://github.com/electric-sql/electric/releases) |
| Storage rewrite | 1.1 Aug 2025 — "100x faster writes" | [v1.1 blog](https://electric-sql.com/blog/2025/08/13/electricsql-v1.1-released) |
| Managed offering | Electric Cloud public beta Apr 2025; Hosted Durable Streams Jan 2026 | [blog](https://electric-sql.com/blog/2026/01/22/announcing-hosted-durable-streams) |
| License | Apache 2.0, server is Elixir | [repo](https://github.com/electric-sql/electric) |
| Company | ElectricSQL Ltd, ~$5M raised, Firestreak Ventures et al., founded 2021 | [pitchbook](https://pitchbook.com/profiles/company/491530-33) |
| Named production users | Trigger.dev (Realtime, "millions of updates/day"), Otto ETL (cell-level agent sync), IP.world | [1.0 blog](https://electric-sql.com/blog/2025/03/17/electricsql-1.0-released) |
| Community | Discord (discord.electric-sql.com), active GitHub discussions, HN presence | [community](https://electric-sql.com/about/community) |
| Security | **CVE-2026-40906** (CVSS 9.9) SQL injection via `order_by` in `/v1/shape`, affected 1.1.12–1.4.x, fixed in 1.5.0 on 2026-04-21 | [advisory](https://www.thehackerwire.com/electricsql-v1-shape-critical-sql-injection-cve-2026-40906/) |

**Read:** The core engine is production-shaped — a ~13-month-old 1.0, with real production logos, active releases, and a managed cloud. The CVE two days ago is a yellow flag, not red — it was found, fixed, disclosed cleanly. The architecture pivot in mid-2024 (abandoning the old bidirectional CRDT engine, rebuilding as read-path-only) is what matters more than any version number. The rewrite is good engineering; it also means the product is newer than its 1.0 date suggests.

## 3. Supabase + Expo fit

### Supabase
- **Integration: first-class.** [Supabase partner listing](https://supabase.com/partners/integrations/electricsql). Works against Supabase-hosted Postgres and self-hosted Supabase. Uses logical replication from WAL.
- **RLS: indirect.** Electric's recommended model is to put auth/filtering in middleware, not rely on RLS. You run Electric with a `BYPASS_RLS` role and enforce per-shape authorization in a proxy/gateway you own. RLS can be used but is described as a workaround, not the paved path. See [discussion #1587](https://github.com/electric-sql/electric/discussions/1587). For Lifting Tracker's Athlete/Coach/Gym/SuperAdmin RBAC (D-docs), this means you will not get Supabase's RLS-for-free model; you re-implement scoping in a shape-auth gateway.
- **Deployment:** [deployment guide](https://electric-sql.com/docs/integrations/supabase) is concrete and current.

### Expo / React Native iOS
- **There is an Expo integration doc** ([electric-sql.com/docs/integrations/expo](https://electric-sql.com/docs/integrations/expo)) using `expo-sqlite` as the driver.
- **But the modern story is TanStack DB + Electric collections**, not the legacy Electric TypeScript client directly. TanStack DB 0.6 (March 2026) added SQLite persistence explicitly for "React Native, Expo, Capacitor" — [blog](https://electric-sql.com/blog/2026/03/25/tanstack-db-0.6-app-ready-with-persistence-and-includes). Package: `@tanstack/react-native-db-sqlite-persistence`.
- **PGlite does NOT run in React Native.** [issue #87](https://github.com/electric-sql/pglite/issues/87). `libpglite` (native Postgres for mobile) announced, not shipped. So the "Postgres client-side too" pitch only lands on web.
- **New Architecture:** expo-sqlite works on Fabric/TurboModules; TanStack DB itself is JS with no native side, so compat is inherited from expo-sqlite. No Electric-specific native module.
- **Bundle size:** `@electric-sql/client` is small (~tens of KB). TanStack DB + SQLite persistence is the heavier piece. No red flags.
- **iOS TestFlight MVP path today:** expo-sqlite + TanStack DB + Electric collection + your own write path (REST/edge function) to Supabase. That is more pieces than D8's current WatermelonDB choice.

## 4. Data model and sync semantics

### Shapes
A **shape** is `SELECT * FROM table WHERE <predicate>`. Subset of one table, row-level filter. See [shapes guide](https://electric-sql.com/docs/guides/shapes).
- **Row-level filter:** yes — any Postgres WHERE clause.
- **Joins across tables:** no. Shapes are one-table. Hierarchical data uses TanStack DB 0.6's `includes` to stitch multiple shapes client-side. For Lifting Tracker's `User → Session → Exercise → Set`, you'd sync four shapes filtered by user_id and join in TanStack DB.
- **Shape parameters:** definition is immutable once started. To change filter, start a new shape and resync. [Discussion #1677](https://github.com/electric-sql/electric/discussions/1677).

### Conflict resolution
- **Electric 1.0 does not do CRDT-based write merging.** The old Vaxine/AntidoteDB CRDT layer was dropped in the 2024 rewrite. Writes are your backend's problem.
- **TanStack DB pattern:** optimistic state collection + onUpdate handler → your API → Postgres. Server is authoritative. Last-writer-wins unless you build otherwise.
- **For Lifting Tracker (single-user, rare concurrent multi-device):** LWW is almost always fine. The architectural cost of no-CRDT is low here.

### Schema migrations
- **Additive only, in practice.** [Blog](https://electric-sql.com/blog/2024/11/21/local-first-with-your-existing-api). Add columns/tables, relax constraints — safe. Drop columns, tighten constraints — breaks offline clients holding stale shape data.
- **Shape-on-dropped-table must be manually deleted** or it serves stale rows.
- Known rough edge: [issue #2444](https://github.com/electric-sql/electric/issues/2444) — nullability changes don't propagate to shape schema header.
- **Lifting Tracker implication:** D12 (nullable FKs, schema-complete from day one) is compatible. Just never drop columns; deprecate and ignore.

## 5. Stack integration (pgvector, Fuseki, MCP)

### pgvector
- **Server side:** works. Electric is just Postgres consumers; vector columns are just columns.
- **Client side:** vector columns sync into shapes fine as bytes/JSON, but there is **no on-device vector index** on React Native. PGlite + pgvector exists in the browser (via WASM) but PGlite is not on RN. So vector search must stay server-side — edge function → Supabase pgvector. Electric is not a factor here, neither enabling nor blocking.

### Apache Jena Fuseki
- **Electric is Postgres-only.** Fuseki is separate. Cleanest bridge: dual-write from your write-path handler (Supabase edge function) to both Postgres and Fuseki, or use Postgres as the write-of-record and an edge-function-driven projector to Fuseki. Electric doesn't interact with Fuseki at all. No architectural change from the D-decision baseline.

### MCP composability
- **Server side:** yes, Electric runs on Supabase Postgres, reachable via supabase-mcp for schema/queries. No Electric-specific constraint.
- **Electric-specific MCP:** none published. There is an `AGENTS.md` and Electric is marketing toward "data platform for multi-agent" ([electric-sql.com](https://electric-sql.com/)), but that's framing, not a dedicated MCP server for shape management.
- **Net:** neutral. You don't lose MCP by using Electric; you also don't gain an Electric MCP.

## 6. Known issues and performance

### Practitioner reports
- CVE-2026-40906 SQL injection (covered in §2) — fixed 1.5.0.
- Legacy Electric (pre-rewrite) was widely noted as "rough edges, slow progress" on HN. The rebuild addressed this, and 2025–2026 HN sentiment is materially warmer.
- Shape-per-table + no joins is the #1 complaint in discussions. TanStack DB 0.6 `includes` partially addresses it by composing shapes client-side.
- RLS story forces you to own a shape-auth gateway — not complex, but it's code you write.

### Performance at Lifting Tracker scale
- Target: single user, ~10k rows, 1–5 years of data.
- **This is trivially within range.** Electric is stress-tested into the millions-of-updates/day territory (Trigger.dev). 10k rows on device is small. Initial sync of a 10k-row shape completes quickly; ongoing WAL updates are near-instant.
- **Sweet spot fit:** scale is not the question. Fit-to-RN-today is.

### Offline duration
- Shape data persists in the client cache as long as the client keeps it. On extended offline (7–30 days), the client holds the last known shape state and reads work normally.
- On reconnect, Electric does a **catch-up from last offset** if the shape log hasn't been compacted past that point. If it has, client does a re-bootstrap of the full shape. For 10k rows that's a sub-second transfer.
- There is no hard offline-duration limit built in. Cost of long-offline resync: bounded by shape size, not offline duration.

## 7. Composite principle scorecard

| Principle | Score | Evidence |
|---|---|---|
| (a) MCP-able | **Neutral** | Server = Supabase Postgres, reachable via supabase-mcp. No Electric-specific MCP. Neither lift nor drag. |
| (b) Self-hostable | **Yes** | Apache 2.0 Elixir binary, documented deployment. Electric Cloud is optional. |
| (c) Not-SaaS | **Yes** | Runs in your infra alongside Postgres. No vendor lock unless you opt into Cloud. |
| (d) AI-codegen friction reduction | **Partial / degraded on RN** | Server-side is plain Postgres SQL — AI-native. Client-side is TanStack DB collection config + hand-rolled Supabase write path in Expo. That's more bespoke-API surface than D8's WatermelonDB choice, not less. Electric's advantage only fully lands on web (PGlite + Electric collection, SQL end-to-end). |

**Net:** Electric scores well on (b) and (c), neutral on (a), and mixed on (d) in the Expo context specifically. The composite case for Electric is strong on web and weaker on iOS-first MVP.

## 8. Comparative table

Lifting Tracker context: Expo/RN iOS-first MVP, Supabase Postgres, offline-first, solo+AI dev.

| Axis | WatermelonDB (current D8) | PowerSync | ElectricSQL 1.x |
|---|---|---|---|
| **Schema definition** | JS class models, decorators, custom DSL | Postgres schema → sync rules (YAML/SQL-ish buckets) | Postgres schema is the schema. Shapes = SQL WHERE. **Winner: Electric (tie PowerSync)** |
| **Query API** | WatermelonDB Query DSL (`Q.where(...)`) | SQLite on device — plain SQL | SQLite/TanStack DB — JS query API, underlying SQL. **Winner: PowerSync** (plain SQL end-to-end, on device, today, on RN) |
| **Sync protocol** | DIY — you build the backend sync endpoint | Bidirectional, managed via sync rules + upload queue | Read-path only; writes = your own API. **Winner: PowerSync** |
| **Conflict resolution** | You write it | Server-authoritative, hooks for custom resolution | Server-authoritative (no CRDT). **Tie PowerSync/Electric** |
| **Community / maturity** | Mature but slow (0.28, 2025; stale PRs) | Active, well-documented, Supabase-blessed, commercial backing | Rebuilt 2024; GA 2025; CVE 2026-04; active releases. **Winner: PowerSync** (least risk for Sprint 0) |
| **AI-codegen quality (Claude)** | Weakest — custom DSL + decorators | Strong — plain SQLite SQL on device + Postgres on server | Strong on server (SQL), weak on client (TanStack DB config + hand-rolled writes). **Winner: PowerSync** for Expo today. |

**Per-axis winners:** Electric ties on schema, loses everywhere else in the Expo-iOS-today frame. **PowerSync wins 4/6.** WatermelonDB is not the weakest on all axes but is the weakest on AI-codegen and community velocity.

## 9. Recommendation

**HOLD on ElectricSQL. Do not commit in Sprint 0b.**

**Strongest reason:** On Expo/React Native iOS — your actual MVP target — Electric's principal structural advantage (Postgres on both ends, sync the wire between them, SQL end-to-end) does not exist today. PGlite is not on RN ([issue #87](https://github.com/electric-sql/pglite/issues/87)). What you get instead is SQLite-on-device (same as WatermelonDB, same as PowerSync) plus TanStack DB plus a write path you build yourself against Supabase. That is more moving parts than D8's current pick, for less bidirectional guarantee than PowerSync's.

**What flips HOLD → COMMIT (the specific signal to watch):**
1. `libpglite` ships with stable React Native bindings AND a reference Expo + Supabase + Electric write-path template exists in `electric-sql/examples`. Until both, the pitch isn't landed on iOS.
2. OR: Electric ships a first-party bidirectional write-path primitive (deprecating the "writes are your problem" posture) with a Supabase-specific integration.

**Sub-recommendation for Sprint 0b:** Re-open D8.
- **If you want bidirectional Postgres sync today on RN:** switch D8 from WatermelonDB to **PowerSync Open Edition** (self-hosted, FSL-licensed server, Apache-2.0 client SDK). It hits your composite principle as well as Electric would and actually runs on iOS today. [docs](https://docs.powersync.com/intro/self-hosting).
- **If you want to defer the whole sync decision:** keep WatermelonDB per D8 for MVP, accept the AI-codegen tax, revisit at the end of Sprint 3.

**Re-check Electric by 2026-07-23.** Specifically: has `libpglite` RN support shipped? Has a first-party write-path solution landed?

## 10. Implementation plan (not COMMIT — N/A)

No implementation plan for Electric in Sprint 0b. If the HOLD flips after the 90-day re-check, draft a plan then. In the meantime, if you act on the sub-recommendation to switch D8 to PowerSync, the Sprint 0b shape is roughly:

| Step | Work | Days (solo+AI) |
|---|---|---|
| 1 | Stand up self-hosted PowerSync service alongside Supabase (Docker) | 0.5 |
| 2 | Author sync rules / buckets for Athlete-scoped tables (User, Session, Exercise, Set, and the nullable-FK parents) | 1.0 |
| 3 | Wire PowerSync client SDK into Expo app with expo-sqlite | 0.5 |
| 4 | Implement upload queue integration + auth (Supabase JWT) | 1.0 |
| 5 | Smoke test offline writes, airplane-mode reconnect, multi-device (single user, two devices) | 0.5 |
| 6 | Update `docs/architecture_v0.4.0.md` D8 with change log entry | 0.5 |

~4 days. Treat that as an estimate to price the switch against staying on WatermelonDB.

## 11. Open questions / tripwires

- **Tripwire 1:** `libpglite` RN ship date. If announced in a release, re-assess Electric immediately — this is the whole gating question.
- **Tripwire 2:** Any Electric write-path/first-party bidirectional announcement. The current "writes are your problem" posture is the architectural cost.
- **Tripwire 3:** TanStack DB stability. It's 0.6 as of March 2026 — pre-1.0. If Electric's recommended client story depends on TanStack DB, the client-side maturity clock runs on TanStack DB's calendar, not Electric's.
- **Tripwire 4:** CVE cadence. One CVSS-9.9 two days ago is acceptable; a pattern of them inside 12 months would not be.
- **Tripwire 5:** Supabase's own local-first / offline story. If Supabase ships first-party offline-first (rumored periodically), all three external sync options get reconsidered.
- **Open question:** For Fuseki bridge pattern, confirm whether edge-function projection or direct dual-write from the app's write-path handler is cleaner once the write-path owner is chosen.
- **Open question:** PowerSync's FSL vs Apache 2.0 — acceptable under your composite principle? FSL is source-available with commercial restrictions that convert to Apache 2.0 after two years. Verify alignment before committing.

---

© 2026 Eric Riutort. All rights reserved.
