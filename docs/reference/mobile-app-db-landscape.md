---
author: Eric Riutort
created: 2026-04-23
updated: 2026-04-23
valid_as_of: 2026-04-23
re_check_by: 2026-07-22
tier: REFERENCE
content_class: research
---

# Mobile App Database Landscape — April 2026

A map of what mobile app developers actually use for data persistence, backend, and sync, with adoption evidence. This is a landscape document, not a recommendation. It is scored against the Lifting Tracker stack constraints (Expo React Native, Supabase, iOS-first, offline-first, solo developer using Claude Code and AI agents) only in §9.

## 1. Executive summary

- **Dominant BaaS (Layer 1):** Supabase (SQL default for new Expo projects, MCP-native), Firebase (still the most-shipped for mobile-first B2C), Convex (fastest-growing for reactive web + RN). Appwrite and PocketBase own the self-host corner.
- **Dominant local stores (Layer 2):** expo-sqlite (~420k weekly npm), MMKV (key-value default, synchronous), WatermelonDB (~39k weekly npm; the reactive-ORM heavyweight). AsyncStorage is still the tutorial default; expo-secure-store is mandatory for auth tokens.
- **Dominant sync strategies (Layer 3):** (a) Firebase's built-in offline persistence for teams in the Firebase bundle; (b) PowerSync for serious offline-first on Supabase/Postgres; (c) WatermelonDB with a BYO Supabase adapter (the Morrow/Supabase canonical tutorial). Newer entrants gaining ground: Legend-State, RxDB's official Supabase plugin (mid-2025), TanStack DB Query-Driven Sync.
- **Consensus "just ship it" bundle for an Expo + Supabase team in 2026:** Expo + Supabase + expo-sqlite + Drizzle + MMKV + SecureStore, with sync choice deferred until the data model tells you whether you need PowerSync, WatermelonDB, RxDB, or a hand-rolled queue.
- **Major market events since early 2025:** MongoDB Atlas Device Sync / Realm Sync EOL'd 2025-09-30 (a big chunk of the historical mobile sync market went dark); AWS Amplify v4 retired 2026-04-13; Supabase acquired Triplit in 2025; ElectricSQL shipped a ground-up rewrite (v1.1 Aug 2025) and now positions itself as a "data platform for multi-agent"; Zero (Rocicorp) moving from alpha toward beta late 2025 / early 2026.
- **Offline-first vs cloud-primary split:** no clean survey number. Directional signal: offline-first is the default recommendation for logistics/field/healthcare, still the minority for consumer apps. Expo's own docs explicitly name it a category worth supporting.
- **Eric's composite principle yields 4 passing Layer-3 options:** PowerSync (self-host Open Edition), ElectricSQL, WatermelonDB with a BYO Supabase adapter, and RxDB with the official Supabase plugin. Detailed filter pass table in §9.

## 2. Methodology

**Sources used:**
- React Native Directory (reactnative.directory) — package metadata, scores.
- npmtrends.com — weekly download counts.
- GitHub — stars and release history for named repositories.
- Expo docs: `docs.expo.dev/guides/local-first/`, `/develop/user-interface/store-data/`, `/versions/latest/sdk/securestore/`, `/guides/using-supabase/`.
- Expo blog posts (TinyBase walkthrough).
- Supabase blog and partner integrations (WatermelonDB, PowerSync, RxDB, Legend-State).
- Vendor docs and changelogs: PowerSync, ElectricSQL, Convex, Zero, Triplit, InstantDB, TanStack DB, Couchbase, RxDB, Drizzle, Prisma.
- Community signal: r/reactnative, Expo forum, Hacker News offline-first landscape threads (2024, 2025, Jan 2026), Dev.to articles.
- State of React Native 2025 (results site) — cited for New Architecture adoption (~80%); DB/persistence questions were not detailed in the surfaced results.

**Paywalled / inaccessible:**
- Gartner/IDC mobile-architecture reports.
- Some proprietary benchmarks behind vendor gates.
- Convex and Firebase internal revenue/MAU numbers.

**"Dominant" definition:**
- For Layer 1: named in ≥3 independent 2025–2026 comparison articles AND present in Expo quickstarts OR Supabase partner page OR both.
- For Layer 2: top npm download counts + Expo docs endorsement + named in more than one tutorial series.
- For Layer 3: at least one public production case study + one official or Supabase-blog integration + active release cadence.

**Dates:** all download counts, free-tier figures, and status claims are as of **April 2026**. Re-verify before making an architectural commitment.

## 3. Layer 1 — BaaS / Cloud Data

Layer 1 is the cloud-side system of record: where writes land and where other devices read from. Mobile apps rarely use it alone — they sit in front of it with local caches and sync queues. The 2025–2026 landscape has three commercial centers of gravity (Firebase, Supabase, Convex), a long tail of self-hostable Postgres/NoSQL options, and a newer generation of "sync engine with embedded backend" platforms (PowerSync, ElectricSQL, InstantDB, Triplit) that blur the line between Layer 1 and Layer 3. Notable casualty: MongoDB Atlas Device Sync / Realm sync was end-of-lifed on 2025-09-30, removing one of the largest historical mobile-first BaaS options.

### 3.1 Master table — 23 services

| # | Service | Primary model | Managed / Self-host | Free tier (April 2026) | Typical MVP cost (100–1000 MAU) | iOS / RN SDK | Offline-first story | Realtime | Auth included |
|---|---------|--------------|---------------------|-----------------------|--------------------------------|--------------|---------------------|----------|---------------|
| L1-01 | **Supabase** | Postgres (SQL) | Both (open source) | Free tier; 500 MB DB, 50k MAU, 5 GB egress | $0–$25/mo (Pro) | Official `@supabase/supabase-js`, RN examples, Expo-friendly | BYO (AsyncStorage + sync queue, WatermelonDB, PowerSync, RxDB, Legend-State) | Yes (Postgres logical replication over WebSocket) | Yes (magic link, OAuth, phone) |
| L1-02 | **Firebase Firestore** | Document NoSQL | Managed only | Spark: 50k reads/day, 20k writes/day, 1 GB storage | $0–$25/mo Blaze for small apps | `@react-native-firebase/firestore` (native), `firebase` JS (Expo Go path limited) | Built-in offline persistence; SDK handles queue + reconciliation | Yes (real-time listeners) | Yes (Firebase Auth) |
| L1-03 | **Firebase Realtime Database** | Tree JSON NoSQL | Managed only | Spark: 1 GB, 10 GB/mo bandwidth | $0–$25/mo | `@react-native-firebase/database` | Built-in offline; older than Firestore, still used | Yes (low-latency tree sync) | Yes (Firebase Auth) |
| L1-04 | **AWS Amplify (AppSync + DynamoDB)** | GraphQL over DynamoDB | Managed (AWS) | AWS free tier ~1 yr, then pay-per-use | Highly variable; $20–$100+/mo at MVP | `aws-amplify` v6 required by 2026-04-13 | DataStore offered local SQLite + conflict resolution; adoption has cooled | Yes (AppSync subscriptions) | Yes (Cognito) |
| L1-05 | **Appwrite** | Document NoSQL + file + auth | Both (open source, Docker) | Self-host free; cloud Pro $15/mo | $0 self-host / $15/mo managed | Web + RN via `appwrite` JS; Flutter/Swift native | BYO; no built-in sync queue | Yes (WebSocket) | Yes |
| L1-06 | **Back4App** | Parse Server (MongoDB) | Both (open source core) | Shared free tier; 25k requests | $5–$25/mo Shared | Parse RN SDK | Parse has local datastore + background sync | Yes (Live Queries) | Yes |
| L1-07 | **NHost** | Postgres + Hasura GraphQL | Both | Free: 1 project, 500 MB DB | $25/mo Pro | `@nhost/react` works in RN | BYO (Hasura subscriptions + Apollo cache) | Yes (Hasura) | Yes |
| L1-08 | **PocketBase** | SQLite (single binary) | Self-host primarily | Free (it's a Go binary) | $5–$10/mo VPS | JS SDK RN-compatible | BYO; small scale | Yes (realtime subscriptions) | Yes |
| L1-09 | **Surreal Cloud** | Multi-model (SQL/graph/document) | Both (SurrealDB OSS) | Cloud: limited free | $10+/mo cloud | JS SDK, no official RN native module | BYO | Yes (live queries) | Yes |
| L1-10 | **Neon** | Serverless Postgres | Managed | Free: 0.5 GB, auto-suspend | $0–$19/mo Launch | No mobile SDK; use PostgREST/Supabase/your own API | None built-in | No (Postgres LISTEN via proxy) | No |
| L1-11 | **PlanetScale** | MySQL / Vitess | Managed | No free tier since 2024; Scaler $39/mo | $39+/mo | No mobile SDK | None | No | No |
| L1-12 | **CockroachDB Serverless** | Distributed Postgres-wire | Both | Free: 10 GiB, 50M RUs/mo | $0–$50/mo | No mobile SDK | None | Changefeeds (enterprise) | No |
| L1-13 | **MongoDB Atlas App Services (Realm)** | Document + Realm sync | **EOL 2025-09-30** | — | Migration required | Atlas Device SDKs frozen | Was best-in-class; now dead for new projects | Yes (until EOL) | Yes (until EOL) |
| L1-14 | **Convex** | Reactive document store + server functions | Managed only (OSS self-host beta) | Free: 1M function calls/mo, 0.5 GB | $0–$25/mo | `convex/react-native` official | Limited built-in; third-party `replicate` adds op-sqlite+CRDT | Yes (by default, reactive queries) | Yes (Convex Auth, Clerk adapter) |
| L1-15 | **InstantDB** | Triple store / graph | Managed (some OSS components) | Free: 1 app, generous | $0–$50/mo paid | Works in RN via JS SDK | Local-first by design; offline writes queued | Yes (native) | Yes |
| L1-16 | **Deno KV + Deno Deploy** | KV store on FoundationDB | Managed | Free: 150k reads/day | $0–$10/mo | No RN SDK; REST/HTTP only | BYO | No (polling or BroadcastChannel) | No |
| L1-17 | **Cloudflare D1 + Workers** | SQLite-at-edge | Managed | Free: 5 GB, 5M reads/day | $0–$5/mo Workers | REST only from mobile | BYO | No | No |
| L1-18 | **Directus** | Postgres + CMS layer | Both | Cloud free tier; self-host OSS | $15/mo Starter cloud | JS SDK, RN-compatible | BYO | WebSocket subscriptions | Yes |
| L1-19 | **Strapi** | Any SQL + headless CMS | Both | Community OSS free | $99/mo Cloud | REST/GraphQL only | BYO | Limited | Yes (admin + users-permissions) |
| L1-20 | **Xano** | No-code Postgres | Managed | Free build; $85/mo Launch | $85+/mo | REST only | BYO | Limited | Yes |
| L1-21 | **Backendless** | Visual backend | Both | Free: 50k API calls/mo | $15+/mo | JS + RN SDK | "Offline database" option | Yes | Yes |
| L1-22 | **Couchbase Capella (+ Lite)** | Document NoSQL + Mobile Lite | Managed + embedded | Free: 50 MB managed | $50+/mo | Capella App Services + Couchbase Lite RN | First-class Sync Gateway (peer of Realm Sync) | Yes | Yes |
| L1-23 | **Upstash Redis / Redis Stack** | KV / streams | Managed + OSS | Free: 10k commands/day | $0–$10/mo | REST SDK works in RN | Not a primary store | Pub/Sub | No |

### 3.2 Dominant picks (adoption evidence)

- **Supabase** — widely cited as the default for new 2025–2026 React Native projects wanting SQL. Official blog has end-to-end offline-first guides (WatermelonDB, Legend-State, PowerSync). `@supabase/supabase-js` weekly downloads over 3M as of April 2026 (npmtrends). Triplit acquisition in 2025 signals roadmap convergence with local-first.
- **Firebase** — still dominant for mobile-first apps. `@react-native-firebase/firestore` remains a top-20 React Native Directory package. Best-in-class built-in offline persistence, FCM, Crashlytics, Analytics. Losing share on the web/TS-heavy side to Supabase.
- **Convex** — fastest-growing new BaaS in 2025. Reactive queries are the headline feature. Mobile/offline is a gap the community fills with third-party projects (trestleinc/replicate using op-sqlite + Yjs). Good for real-time collaborative apps; weaker for offline-heavy workouts/logs.
- **Appwrite** — leading self-hostable BaaS, strong Flutter/RN support, consistent GitHub star growth. Picked when "self-hostable" is a hard requirement.
- **PocketBase** — solo-dev / side-project favorite. Single Go binary, SQLite inside, free. Not a fit for apps that will cross the "need horizontal scale" threshold.

### 3.3 Dead / deprecated call-outs

- **MongoDB Atlas Device Sync / Realm Sync** — end-of-life 2025-09-30. Do not pick for new work. Migration paths: Couchbase Mobile, PowerSync + Postgres, custom.
- **AWS Amplify v4 (DataStore legacy API)** — must migrate to v6 by 2026-04-13. Adoption has cooled relative to Supabase/Firebase.
- **PlanetScale free tier** — removed in 2024. No longer a viable hobbyist option.



## 4. Layer 2 — On-device local stores

Layer 2 is what's actually on the phone when the plane door closes. The picture is unusually well-consolidated: SQLite under various wrappers, plus MMKV for key-value, is the overwhelming majority of what new Expo apps ship in 2026. Realm was historically a peer; with MongoDB Device Sync EOL, Realm survives as the open-source embedded library but has lost its premium sync path. WatermelonDB remains the heavyweight reactive ORM-over-SQLite option.

### 4.1 Master table — 16 entries

| # | Library | Primary model | Underlying engine | Expo Go? | Expo Dev Client / bare? | TypeScript | Reactive queries | Typical use | Notes |
|---|---------|---------------|-------------------|----------|-------------------------|------------|------------------|-------------|-------|
| L2-01 | **expo-sqlite** | Relational (SQL) | SQLite (native) | Yes (SDK 51+) | Yes | Good | `useLiveQuery` via Drizzle | Default Expo choice | `npx expo install expo-sqlite`. ~420k weekly npm downloads. |
| L2-02 | **op-sqlite** | Relational (SQL) | SQLite via JSI, HostObject | No | Yes (native module) | Good | Hooks available | Perf-critical, on-device AI, Turso/libSQL embed | Successor to react-native-quick-sqlite. |
| L2-03 | **react-native-nitro-sqlite** | Relational (SQL) | SQLite via Nitro Modules | No | Yes | Good | No built-in | Same niche as op-sqlite | Margelo's NitroSQLite replaces their quick-sqlite v8 line. |
| L2-04 | **react-native-sqlite-storage** | Relational (SQL) | SQLite (Objective-C/Java bridge) | No | Yes | Types exist | No | Legacy bare-RN projects | Older bridge-based; slower than JSI alternatives. |
| L2-05 | **react-native-quick-sqlite** | Relational (SQL) | SQLite via JSI | No | Yes | Good | No | **Deprecated** — forks into op-sqlite / nitro-sqlite | Two separate successors from the two original authors. |
| L2-06 | **WatermelonDB** | Reactive ORM over SQLite | SQLite (native) + LokiJS (web) | No | Yes (plugin: `@morrowdigital/watermelondb-expo-plugin`) | Decorators-first; typing OK | **Yes (observables)** | Offline-first apps with lots of data + known sync protocol | ~39k weekly npm downloads. Expo plugin supported through SDK 51/52 as of April 2026. |
| L2-07 | **Realm (Atlas Device SDK)** | Object DB (NoSQL) | Native C++ engine | No | Yes (config plugin) | Good | **Yes (change listeners)** | Historical heavyweight; Atlas Device Sync EOL'd 2025-09-30 | Open source continues; no commercial sync. Use standalone only. |
| L2-08 | **MMKV (`react-native-mmkv`)** | Key-value | Tencent MMKV (memory-mapped) | No | Yes | Good | Hooks (useMMKV*) | Settings, auth tokens, Zustand/Redux persist | ~30× faster than AsyncStorage per maintainer benchmarks. Synchronous. |
| L2-09 | **AsyncStorage** | Key-value | SQLite (iOS), RocksDB-ish (Android) | Yes | Yes | OK | No | Small, simple persistence; default in every tutorial | Async-only. Expo docs still suggest starting here. |
| L2-10 | **expo-secure-store** | Key-value (secure) | iOS Keychain / Android Keystore | Yes | Yes | Good | No | Auth tokens, secrets (MUST use for session) | Expo's and the project's required store for auth per CLAUDE.md. |
| L2-11 | **RxDB** | Reactive NoSQL | Multiple storage adapters (expo-sqlite, LokiJS, Dexie, IndexedDB) | Yes (with SQLite adapter) | Yes | Excellent | **Yes** | Cross-platform web + mobile with shared schema | Paid premium tier for some adapters; community tier is generous. |
| L2-12 | **PouchDB / CouchDB client** | Document NoSQL | LevelDB / SQLite adapter | Partial | Yes | OK | Replication events | Couch-style offline-first apps | Less popular in RN in 2026; replaced by RxDB / WatermelonDB. |
| L2-13 | **Turso libSQL embedded (`@tursodatabase/sync-react-native`)** | Relational (SQL) | libSQL (SQLite fork) | No | Yes | Good | No | Embedded replica of Turso Cloud | Adds bidirectional replica to Turso. Newer than op-sqlite-libsql combo. |
| L2-14 | **TinyBase** | Reactive in-memory store + optional persisters | JS in-memory + expo-sqlite/IndexedDB | Yes | Yes | Excellent | **Yes** | Local-first reactive store; pairs with Yjs, SQLite | Featured on Expo blog. Small footprint. |
| L2-15 | **Legend-State v3** | Observable signals + persistence | Plugs into AsyncStorage, MMKV, expo-sqlite, Supabase | Yes | Yes | Excellent | **Yes (fine-grained)** | Local-first Supabase apps | Featured in official Supabase blog with Expo. |
| L2-16 | **Quick SQLite (ospfranco original)** | Relational (SQL) | SQLite via JSI | No | Yes | Good | No | Historical | Now op-sqlite. |

Plus state-layer libraries commonly mistaken for persistence (included for completeness, NOT persistence by themselves):

- **Zustand (+ persist middleware)** — wraps AsyncStorage or MMKV. State library, not a DB.
- **Jotai** — atom-based state; persistence via plugins.
- **Recoil** — Meta project, effectively unmaintained as of 2024; avoid for new work.

### 4.2 Dominant picks

- **expo-sqlite** — de facto default for structured local data in Expo. Cited in Expo's own local-first and "Store data" docs. ~420k weekly npm downloads.
- **MMKV** — de facto default for key-value. Synchronous, fast, encrypted option, works with `react-native-nitro-modules`.
- **expo-secure-store** — mandatory for auth tokens (CLAUDE.md Don't #6).
- **AsyncStorage** — still the Day 1 tutorial default and fine for small state. Expo recommends starting here and graduating to SQLite when there's a concrete reason.
- **WatermelonDB** — top pick when the data model is large and you need reactive queries + ORM without hand-rolling. Strong Expo community plugin.

### 4.3 Expo-specific considerations

- Anything with a native module (op-sqlite, WatermelonDB, Realm, MMKV, Nitro) requires a **development build** — Expo Go won't load it.
- expo-sqlite, AsyncStorage, expo-secure-store, and filesystem APIs work in Expo Go without config.
- JSI-based libraries (op-sqlite, MMKV, Nitro) require **New Architecture**; as of SoRN 2025, New Arch adoption is ~80%, which effectively makes JSI the default assumption.
- Universal web support (Expo Web) is strongest with expo-sqlite (WASM path in SDK 51+), RxDB, TinyBase, and Legend-State. WatermelonDB has a LokiJS web adapter but it is a different storage path.



## 5. Layer 3 — Sync layers

Layer 3 is where the offline-first story actually lives. Most apps still hand-roll this as "SDK + queue + reconcile on reconnect" (Firebase and Realm hid this from you; Supabase does not). The commercial market for managed sync has split into two camps: **server-authority systems** (PowerSync, ElectricSQL, Zero, Replicache, Convex, Instant, Triplit, Firebase) where the server is the source of truth and conflicts are resolved server-side; and **decentralized / CRDT systems** (Yjs, Automerge) where merge is math, not policy. Aaron Boodman's 2024 taxonomy (cited in the landscape) holds in 2026.

### 5.1 Master table — 15 entries

| # | Sync layer | Category | License / model | Backend compat | Local-store compat | Conflict resolution | RN support | Production maturity | Known issues |
|---|-----------|----------|-----------------|----------------|--------------------|---------------------|------------|---------------------|--------------|
| L3-01 | **PowerSync** | Server-authority, bidirectional | Open Edition (self-host) + Cloud (commercial) | Postgres (Supabase, Neon, RDS), MongoDB, MySQL | SQLite (built-in), op-sqlite path, kotlin/swift | Server-side CRDT-ish; bucket-based partitioning; persistent upload queue | First-class RN SDK (`@powersync/react-native`) | Battle-tested (logistics, field ops) | Larger dep footprint; bucket model takes thought |
| L3-02 | **ElectricSQL (post-rewrite)** | Server-authority, read-path | Apache 2.0 OSS | Postgres (only) | Any local DB via Shape ingestion | Read-only for mobile by default (v1.x); writes via Phoenix.Sync or BYO | Community RN examples; not first-class | v1.1 (Aug 2025) rewrite stable; write-path story still maturing | Was a write-path sync pre-2024; rewrite dropped write sync and is still rebuilding it |
| L3-03 | **Replicache (Rocicorp)** | Server-authority, bidirectional | Now free / source-available | Any (BYO server) | IndexedDB (web); mobile path weak | Server is authoritative; deterministic mutators | Web-primary; RN possible but unusual | Mature, now in maintenance mode | Not optimized for RN; Zero is the successor |
| L3-04 | **Zero (Rocicorp)** | Server-authority, bidirectional | Source-available | Postgres | SQLite (via zqlite, IndexedDB on web) | Server-authoritative mutators | Not yet first-class for RN | Alpha → beta late 2025 / early 2026 | Not production-ready for RN as of April 2026; targeted at rich web apps |
| L3-05 | **InstantDB** | Server-authority, bidirectional | Source-available | Bundled (InstantDB backend) | Browser IndexedDB; RN via its SDK | Triple-store with rules | RN SDK available | Production at their scale; third-party RN cases smaller | Lock-in to Instant's backend |
| L3-06 | **Triplit** | Server-authority, bidirectional | OSS core + managed | Bundled (own Postgres) | SQLite (Tauri, RN via emerging SDK) | Delta-merge with rules | RN examples growing | Acquired by Supabase 2025; future direction is convergence with Supabase | Future governance fused with Supabase |
| L3-07 | **Convex client sync** | Server-authority, reactive | Managed; OSS self-host beta | Convex only | Convex in-memory cache | Server is authoritative; mutations are transactions | RN supported (`convex/react-native`) | Strong for reactive web; mobile offline immature | Third-party `replicate` (op-sqlite + Yjs) is the community offline path |
| L3-08 | **Couchbase Lite / Sync Gateway** | Server-authority, bidirectional | Community Edition free, Enterprise paid | Couchbase Server / Capella App Services | Couchbase Lite (embedded) | Revision-based, with conflict resolvers | Official RN Native Module | Enterprise-mature | Heavier ops footprint; Couchbase-specific |
| L3-09 | **Realm Sync** | Server-authority, bidirectional | **EOL 2025-09-30** | Atlas only | Realm | Object-level with conflict resolution | Was first-class | Dead for new projects | Do not pick |
| L3-10 | **Yjs + y-websocket / y-webrtc** | Decentralized CRDT | MIT | BYO server (`y-websocket`, Liveblocks, etc.) | Yjs Doc in memory; persist via y-indexeddb, y-expo-sqlite | CRDT (automatic merge) | RN works (JS-only); no WASM needed | Mature for collaborative editing | Best fit for text/collab, overkill for logs |
| L3-11 | **Automerge** | Decentralized CRDT | MIT | BYO | Automerge doc store | CRDT | RN: requires C bindings (no WASM on RN yet) per community reports | Automerge 2.0 production-ready | RN integration is gnarlier than Yjs |
| L3-12 | **WatermelonDB Sync (BYO adapter)** | Server-authority | MIT | Any HTTP backend (Supabase tutorial exists) | WatermelonDB | `pullChanges`/`pushChanges` protocol; you supply reconciliation | First-class | Mature; shipped in many apps | You write the backend endpoints; timestamps not trivial |
| L3-13 | **Firebase Offline Persistence** | Server-authority, bidirectional | Managed | Firestore / Realtime DB only | Built-in (SQLite on iOS/Android) | Last-write-wins with timestamps | Mature | De facto in millions of apps | Firestore-specific |
| L3-14 | **Amplify DataStore conflict resolution** | Server-authority, bidirectional | Managed | AppSync (DynamoDB) | SQLite or AsyncStorage | Auto-merge, optimistic concurrency, or custom Lambda | Supported but cooling | Mature but less loved | Amplify v4 deprecation pressure |
| L3-15 | **TanStack DB (Query-Driven Sync)** | Query-as-sync-primitive | MIT OSS | PowerSync, ElectricSQL, Trailbase, BYO | expo-sqlite, op-sqlite (0.6 adds persistence) | Delegated to the sync backend | RN first-class as of v0.6 (March 2026) | New but moving fast; rides on top of other sync engines | Not a sync engine itself; a query / reactivity layer that plugs into one |
| L3-16 | **RxDB replication plugins** | Server-authority, bidirectional | OSS + premium | Supabase (official mid-2025 plugin), GraphQL, HTTP, CouchDB, WebRTC | RxDB with SQLite adapter | Checkpointed pulls; configurable handlers | RN works via expo-sqlite adapter | Production-mature for Supabase and GraphQL | Some adapters are paid; RxDB's own model has a learning curve |

### 5.2 Dominant picks

- **Firebase offline persistence** — still the most-shipped sync layer in absolute terms because Firestore is a huge install base. Zero config, "just works" for small apps.
- **PowerSync** — clear leader for "serious offline-first on Supabase/Postgres." First-class RN, proven at scale, Supabase partner integration page, battle-tested at logistics/retail. Open Edition self-hostable.
- **WatermelonDB with a BYO Supabase adapter** — the community-favorite DIY bundle. Supabase's own blog hosts the canonical tutorial.
- **Legend-State + Supabase** — newer lightweight option that Supabase actively blogs about; great for smaller apps that don't need WatermelonDB's reactivity machinery.
- **RxDB + Supabase replication plugin** — officially supported as of mid-2025; the clearest "already-integrated" path.

### 5.3 Named production apps (partial, best-effort)

- **Nozbe** (task manager) — WatermelonDB authors, use it in production.
- **Linear, Figma, Superhuman, Dropbox** — cited by Rocicorp as proof of the sync-engine pattern (Linear famously uses their own; others are reference architectures).
- **Cinapse** — moved from CRDT-based sync to PowerSync (per PowerSync blog, 2025).
- **Ignite Cookbook recipe** (Infinite Red) — PowerSync + Supabase + Expo, public reference stack.



## 6. Layer 4 — ORM / query layers

This layer sits **over** Layer 2 on-device, and optionally over Layer 1 in your Edge Functions / backend. For React Native specifically, the effective shortlist is narrow: Drizzle dominates. Prisma exists but is Early Access for Expo. Kysely works but is server-side in practice.

| # | Tool | Paradigm | RN / Expo support | Typical use |
|---|------|----------|-------------------|-------------|
| L4-01 | **Drizzle ORM** | Code-first, type-inferred, thin SQL wrapper | First-class with expo-sqlite and op-sqlite; `useLiveQuery` hook; expo-drizzle-plugin for migrations | Top pick in 2026 for Expo apps wanting types + migrations |
| L4-02 | **Prisma ORM** | Schema-first (PSL), generated client | **Early Access** on RN via `@prisma/react-native` + expo plugin; reactive queries; not GA | Pick only if you already use Prisma on the server and want schema parity |
| L4-03 | **Kysely** | Type-safe query builder | Works in RN (pure TS) but minimal RN-specific tooling; no migrations | SQL-purist server code; uncommon on-device |
| L4-04 | **TypeORM** | Classic decorator-heavy ORM | Historical RN support; active but eclipsed by Drizzle; `react-native` driver exists | Legacy RN projects migrated from back-end TypeORM |
| L4-05 | **Knex** | Classical query builder | RN support is weak; Kysely is the modern successor in TS land | Legacy Node back-ends |

Notes:
- On-device ORMs are only useful if you pick an SQL local store (expo-sqlite / op-sqlite / Turso libSQL). If you pick WatermelonDB, Realm, or MMKV, you use their own API — no ORM layer applies.
- Drizzle's April 2026 advantage over Prisma is GA status on RN, ~5 MB vs Prisma's ~15 MB install footprint, and no code-gen step.



## 7. Stack bundles

Real teams do not pick one row from each layer and integrate from scratch; they ship one of roughly seven "bundles" that are known to work together.

### 7.1 The seven bundles

**B1. Firebase everything**
- Layer 1: Firestore; Layer 2: Firestore's on-device cache (SQLite under the hood); Layer 3: Firestore offline persistence; Layer 4: none.
- Who: B2C mobile apps, especially Google-tied teams, anything needing FCM + Crashlytics + Analytics bundled.
- When to choose: mobile-first, small-to-medium scale, strict NoSQL is fine, want zero sync code.
- Trade-off: vendor lock-in; no SQL; pricing gets spiky at scale; no self-host.

**B2. Supabase + lightweight offline (AsyncStorage / MMKV + sync queue)**
- Layer 1: Supabase (Postgres); Layer 2: MMKV + AsyncStorage (+ expo-sqlite for any structured cache); Layer 3: hand-rolled sync queue; Layer 4: optional Drizzle.
- Who: Lots of new 2025–2026 Expo apps. Supabase's own docs and Expo's quickstart point here.
- When: small app, limited offline needs, you want SQL and can accept writing your own queue.
- Trade-off: you own reconciliation bugs.

**B3. Supabase + WatermelonDB (BYO adapter)**
- Layer 1: Supabase; Layer 2: WatermelonDB (SQLite underneath); Layer 3: WatermelonDB sync protocol pointed at Supabase RPCs + Realtime; Layer 4: none (WatermelonDB is an ORM).
- Who: Offline-heavy Expo apps with large local datasets (Morrow's tutorial series, Nozbe-style apps).
- When: the dominant "serious offline-first on Supabase" DIY bundle.
- Trade-off: write your own push/pull endpoints; schema duplication between Postgres and WatermelonDB.

**B4. Supabase + PowerSync**
- Layer 1: Supabase; Layer 2: SQLite in `@powersync/react-native`; Layer 3: PowerSync (Cloud or Open Edition self-host); Layer 4: optional Drizzle or TanStack DB.
- Who: Production offline-first apps unwilling to hand-roll sync. Ignite Cookbook recipe, PowerSync case studies.
- When: you need bidirectional sync with conflict handling and SLA-grade production behavior.
- Trade-off: additional service to run/pay for; bucket modeling.

**B5. Supabase + Legend-State** (or Supabase + RxDB)
- Layer 1: Supabase; Layer 2: MMKV / expo-sqlite (via Legend-State persist); Layer 3: Legend-State supabase plugin or RxDB Supabase replication plugin; Layer 4: none.
- Who: newer Expo apps that want reactive signals + Supabase sync without WatermelonDB overhead.
- When: medium offline needs, prefer fine-grained reactivity and minimal ORM ceremony.
- Trade-off: younger than WatermelonDB; fewer war stories.

**B6. Convex end-to-end**
- Layer 1: Convex; Layer 2: Convex client cache (optionally op-sqlite via third-party `replicate` project); Layer 3: Convex reactive sync (+ Yjs via `replicate` for offline); Layer 4: none.
- Who: Real-time collaborative apps, especially web-first teams extending to RN.
- When: reactivity is the headline feature and offline is acceptable as "degraded until reconnect."
- Trade-off: vendor lock-in; true offline is a third-party project.

**B7. Self-host everything (Appwrite / PocketBase + local SQLite)**
- Layer 1: Appwrite or PocketBase; Layer 2: expo-sqlite or MMKV; Layer 3: hand-rolled or Appwrite realtime; Layer 4: Drizzle.
- Who: Data-sovereignty-conscious solo devs, open-source purists.
- When: SaaS is not acceptable.
- Trade-off: you run servers; smaller ecosystem of sync integrations.

**B8. Couchbase Mobile (Capella + Couchbase Lite)**
- Layer 1+3: Couchbase Capella App Services; Layer 2: Couchbase Lite; Layer 4: N/A.
- Who: Ex-Realm shops after MongoDB Device Sync EOL, enterprises.
- When: NoSQL + offline sync + enterprise SLAs.
- Trade-off: Couchbase-specific; heavier ops.



## 8. Expo's official position

Expo maintains three first-party surfaces that reveal the official stance:

- **`docs.expo.dev/guides/local-first/`** — the "Local-first architecture with Expo" guide. Frames local-first as a category, groups tools into persistence / state / sync. Explicitly lists and endorses (with integration links): **Legend-State** (highlights Supabase support built-in), **TinyBase** (pluggable into Yjs and SQLite, uses expo-sqlite under the hood on mobile), **RxDB** (SQLite adapter wraps expo-sqlite, rich replication plugins), **WatermelonDB**, **PowerSync**, **Yjs**. This is the single most authoritative snapshot of Expo's official view in April 2026.
- **`docs.expo.dev/develop/user-interface/store-data/`** — the "Store data" guide. Recommends AsyncStorage as the starting point; SQLite (`expo-sqlite`) for structured / fully offline needs; SecureStore for auth tokens. Rough paraphrase: start with AsyncStorage and switch when you have a concrete reason, not because the architecture looks more serious.
- **`docs.expo.dev/versions/latest/sdk/securestore/`** — SecureStore is mandatory for auth tokens; localStorage/AsyncStorage is explicitly not recommended for secrets.
- **`docs.expo.dev/guides/using-supabase/`** — Supabase is the named "bring your own backend" default. Expo's quickstart for React Native uses Supabase.
- **Expo blog**, `expo.dev/blog/how-to-synchronize-reactive-local-first-apps-with-tinybase` — TinyBase has a featured walkthrough, which is a strong signal for what Expo sees as pointing up.

Summary of what Expo is telling you in 2026: **SQL on-device via expo-sqlite (or op-sqlite for perf), MMKV or AsyncStorage for key-value, SecureStore for secrets, and for sync pick one of Legend-State, TinyBase, RxDB, WatermelonDB, or PowerSync depending on requirements**. Supabase is the default Layer 1.



## 9. Against Eric's composite principle

Composite filter: **(MCP-able OR trivially MCP-able) AND self-hostable AND not SaaS-locked AND AI-native friction**. Applied to Layer 3 sync options from §5 (filtering from the full 16-row table):

### 9.1 Filter pass/fail

| Candidate | MCP-able? | Self-hostable? | Not SaaS-locked? | AI-native friction? | Verdict |
|-----------|-----------|---------------|------------------|---------------------|---------|
| PowerSync | Yes — backend is Supabase/Postgres, Supabase MCP server exposes >20 tools; PowerSync also has an MCP server on its public roadmap (roadmap.powersync.com/c/126-mcp-server) | **Yes** — Open Edition, Docker, self-host-demo repo | **Yes** — backend stays your Postgres; PowerSync is a replaceable component | Low — uses standard SQLite + JSON buckets; Claude Code can operate on the Postgres via Supabase MCP | **PASS** |
| ElectricSQL (post-rewrite) | Yes — Postgres backend is MCP-native; Electric publishes `AGENTS.md` explicitly for AI coding agents | **Yes** — Apache 2.0 | **Yes** — Postgres-native | **Very low** — Electric now positions itself as "data platform for multi-agent" | **PASS** |
| WatermelonDB sync (BYO adapter) | Yes — you write the adapter against Supabase, which is MCP-native | **Yes** — MIT, no vendor | **Yes** — pure library | Low — schema duplication is annoying for AI (must read two schemas) | **PASS** |
| RxDB replication (Supabase plugin) | Yes — backend is Supabase; official plugin since mid-2025 | **Yes** — MIT core; some premium adapters but Supabase plugin is free | **Yes** | Low — well-documented replication model | **PASS** |
| Yjs + y-websocket | MCP-ish — nothing stops an MCP wrapper, but data is opaque binary CRDT ops to SQL-oriented tools | **Yes** | **Yes** | Medium — AI cannot trivially introspect a Yjs doc via SQL | partial |
| Firebase offline | No — Firestore is Google-only; no self-host; MCP servers exist but lock you in | No | No | Low | **FAIL** |
| Convex sync | No — Convex is managed (OSS self-host beta); backend has its own model | Partially (beta) | Locks to Convex | Medium | **FAIL** (self-host not production) |
| Realm Sync | Dead | — | — | — | **FAIL** (EOL) |
| Replicache | No — source-available, web-primary | Can be self-hosted but not the intended path | Locks to Rocicorp's patterns | Medium | **FAIL** |
| Zero (Rocicorp) | Alpha; Postgres backend helps but RN is not ready | Can self-host | Partially | Medium | **FAIL** (not production for RN) |
| InstantDB | No — Instant backend | Partially (OSS components) | Locks to Instant | Low | **FAIL** |
| Triplit | Newly Supabase-acquired; direction uncertain | Yes today | Uncertain | Low | **FAIL** (governance risk; wait) |
| Couchbase Lite / Sync Gateway | Yes with effort | Community Edition yes | Yes | Medium | partial — passes but carries enterprise weight inappropriate for solo dev |
| Amplify DataStore | No — AWS-locked, v4 deprecated | No | No | Medium | **FAIL** |
| TanStack DB Query-Driven Sync | It's not a sync engine itself; inherits from chosen backend | depends on backend | depends | **Very low** — designed for reactive queries, AI-friendly | pass-through (rides on PowerSync/Electric) |
| Automerge | Partially | Yes | Yes | High friction on RN (needs C bindings, no WASM on RN yet) | **FAIL** on AI-native friction + RN integration |

### 9.2 Short list — 4 options that pass

1. **PowerSync (Open Edition, self-hosted) + Supabase.** Backend is Postgres (fully MCP-able via the Supabase MCP server). PowerSync itself has an MCP server on its public roadmap. First-class RN SDK, proven in production, bidirectional sync included. The "no-excuses production" option.
2. **ElectricSQL + Supabase (+ TanStack DB).** Postgres-native. Explicit AI-agent positioning (AGENTS.md, "data platform for multi-agent"). Fully open source (Apache 2.0). Caveat: RN support is community-level, and the post-2024 rewrite is read-path-first with write-sync still maturing — acceptable for read-heavy apps, risky for write-heavy.
3. **WatermelonDB + Supabase (BYO adapter).** The most shipped combination in the Supabase-Expo ecosystem. MIT library, all code on your machine, Supabase is MCP-able so the whole stack is inspectable by Claude Code. The one friction point is schema duplication (Postgres DDL plus WatermelonDB schema.js), which an AI agent can keep in sync but not eliminate.
4. **RxDB + Supabase (official replication plugin).** Official Supabase plugin since mid-2025. MIT core. RN works via expo-sqlite adapter. Strong reactive-query story. More JS-idiomatic than WatermelonDB's decorator model. Some advanced adapters are paid but the Supabase path is free.

All four pass because they **keep the system of record on your Postgres**, which is what makes the stack MCP-able and AI-operable end-to-end. The filter rejects every sync layer whose backend you don't control — Firebase, Realm, Convex (native mode), Instant, Replicache — because "MCP-able" cannot be retrofitted onto someone else's opaque backend.

### 9.3 Note on RN-only stores (Layer 2) under the same principle

expo-sqlite, op-sqlite, MMKV, WatermelonDB, and RxDB all pass the principle (open source, local, inspectable). Realm is open source but strategically orphaned. AsyncStorage and SecureStore are inspectable but not directly MCP-relevant (they store config/secrets, not structured domain data).



## 10. Compatibility matrix

**Backend fixed: Supabase (Postgres).** Rows are Layer-2 local stores. Columns are Layer-3 sync engines that point at Supabase. Cells indicate whether the combination ships in production.

| Local store ↓ / Sync → | WatermelonDB BYO adapter | PowerSync (Open Edition + Cloud) | RxDB Supabase plugin | Legend-State + Supabase | ElectricSQL (read-path) | Hand-rolled queue | Yjs + BYO server |
|------------------------|--------------------------|----------------------------------|-----------------------|--------------------------|--------------------------|-------------------|--------------------|
| expo-sqlite | N/A (WDB uses its own) | YES (PowerSync can use expo-sqlite path in some configs) | YES (official adapter) | YES | YES (Shape materialization) | YES | YES (y-expo-sqlite persister) |
| op-sqlite | N/A | YES (recommended for perf) | YES | YES | YES | YES | YES |
| WatermelonDB (SQLite) | YES — the canonical combo (Supabase + Morrow tutorials) | No (WDB has its own sync) | No | No | No | YES (built-in sync callbacks) | No |
| Realm | No (Realm has its own) | No | No | No | No | Possible but uncommon | Possible |
| MMKV | Config/state only — not a structured store | Not a structured store | Not a structured store | Used as persister for Legend-State | Not a structured store | YES | No |
| AsyncStorage | Not structured | Not structured | Not structured | Used as persister | Not structured | YES (tutorials start here) | No |
| expo-secure-store | Auth tokens only | Auth tokens only | Auth tokens only | Auth tokens only | Auth tokens only | Auth tokens only | Auth tokens only |
| TinyBase (with persister) | No | No | No | No | No | YES | YES (canonical combo) |
| Turso libSQL embedded | Different backend (Turso, not Supabase) | (PowerSync supports Postgres, not libSQL) | RxDB SQLite adapter could work but backend is Turso | No | No | Yes if you run libSQL as your backend | Possible |

Evidence sources: Supabase integrations page, PowerSync docs, RxDB Supabase plugin page, Morrow tutorials for the WatermelonDB path, Expo local-first docs for Legend-State and TinyBase, Electric docs for read-path sync.

Headline: **the production-proven combinations against Supabase are (op-sqlite/expo-sqlite + PowerSync), (WatermelonDB + BYO adapter), (op-sqlite + RxDB), and (MMKV or AsyncStorage + Legend-State)**. Every other combination either requires you to swap the backend or is not a fit.



## 11. Staleness and tripwires

Re-check by **2026-07-23** (90 days). Named signals to watch:

- **Zero (Rocicorp) leaves alpha.** If RN becomes first-class and Zero ships a stable Postgres backend, it would enter the §9 short list.
- **Triplit direction post-Supabase acquisition.** If Supabase rolls Triplit's sync primitives into core Supabase, the BYO-sync bundles get weaker and PowerSync may face internal competition.
- **ElectricSQL write-path sync maturity.** The v1.x line was read-path-first. Watch for a production-grade write sync or an officially blessed mobile SDK.
- **PowerSync MCP server.** On public roadmap as of 2026 (roadmap.powersync.com/c/126-mcp-server). When released, PowerSync's fit against the composite principle tightens further.
- **Convex offline story.** If Convex ships first-party offline instead of relying on third-party `replicate`, B6 becomes a serious competitor to B4.
- **Firebase vs Supabase share in new Expo projects.** Survey data (State of React Native 2026) will be the primary instrument.
- **Realm OSS continuity.** Now that MongoDB has walked away, watch whether the community fork (if any) keeps up with RN new-architecture changes.
- **Amplify DataStore.** Any new guidance from AWS on RN after the v6 migration deadline (2026-04-13).
- **Drizzle vs Prisma on RN.** Prisma's RN support may go GA in 2026; that would reopen the ORM decision.

### Layers that move fastest
1. **Sync (Layer 3)** — the frontier. Expect 1–2 major releases per quarter across PowerSync, Electric, Zero, Convex, TanStack DB.
2. **BaaS pricing (Layer 1)** — Supabase, Firebase, Convex adjust free tiers annually. Check prices before committing.
3. **SQLite wrappers on RN (Layer 2)** — op-sqlite and nitro-sqlite both claim "successor to quick-sqlite." Consolidation is likely within a year.

### Layers that are stable
- Core local-store choices (expo-sqlite, MMKV, AsyncStorage, SecureStore) — mature, slow-moving, unlikely to churn.
- Drizzle as the Expo ORM default — momentum is firmly with it.



---

© 2026 Eric Riutort. All rights reserved.
