---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
tier: OPERATIONAL
content_class: architecture
version: 0.1.0
status: draft
---

# SV-6 — Systems Data Exchange Matrix

## Purpose

SV-6 is the row-by-row catalog of every data exchange that crosses a component boundary in the Lifting Tracker (and into the XRSize4 ALL portfolio infrastructure). Where SV-1 names the components and ports, SV-6 names the **payload, format, direction, protocol, governing standard, and content class** of each exchange.

This is the interface catalog Eric named earlier today. It is the doc reviewers consult when asking "where does X come from, and on what wire?" — and it is the doc that keeps SV-1 honest, because every port in SV-1 must have at least one row here that justifies its existence.

The matrix is **MVP-scoped at this revision** (D8 stack, Sprint 0b configuration). Rows for v2 surfaces (coach features, set videos, hosted instructional content), v3 surfaces (form analysis pipeline, AI photo analysis), and Phase 2 (Fuseki semantic queries, biometrics ingestion when D20 sub-systems come online) are tagged in the **Phase** column so the matrix can be filtered by what is in scope today vs. reserved.

Per D28 fit-for-purpose: all rows directly named in `architecture_v0.4.0.md` Sprint 0a/0b stack are populated. Rows for surfaces that exist in the schema but have no UI in MVP (e.g., `set_videos`, `progress_photo_shares`) are listed with phase tags so the catalog completeness signal is unambiguous.

## Row format conventions

- **Source / Destination** — component names from SV-1.
- **Data** — semantic payload, not wire format. "Session record" not "JSON blob."
- **Format** — wire encoding. "JSON," "Postgres tuple," "OTLP protobuf," "SPARQL ResultSet."
- **Direction** — `→` one-way, `↔` bidirectional.
- **Protocol** — transport layer with version where it matters.
- **Standard** — formal standard or de facto standard the row pins to (cross-listed in StdV-1).
- **Content class** — application data / governance metadata / observability / system-of-record / external content.
- **Phase** — MVP / v2 / v3 / Phase 2 / Future.
- **Notes / decisions** — D-number anchors and any row-level constraints.

## 1. Mobile client ↔ Local store ↔ Sync adapter (offline-first spine, D8 revision)

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| MobileClient (UI) | TanStackQuery | UI mutation request (e.g., new set entry) | TypeScript object | → | in-process function call | TC39 + React | application data | MVP | Optimistic update path. |
| TanStackQuery | LocalStore (Drizzle) | Typed query / mutation | Drizzle query object | ↔ | in-process | TypeScript + SQLite | application data | MVP | Drizzle compiles to SQL. |
| LocalStore (Drizzle) | expo-sqlite | SQL statement | SQL text | ↔ | in-process FFI | SQLite (open standard) | application data | MVP | On-device durability. |
| LocalStore | SyncAdapter | Outbox entry (pending mutation) | JSON record | → | in-process | bespoke | application data | MVP | Outbox pattern. |
| SyncAdapter | LocalStore | Conflict resolution result, server-applied state | JSON record | → | in-process | bespoke; last-write-wins | application data | MVP | Per Sprint 0a decision. |
| SyncAdapter | SupabasePostgres (via PostgREST) | Pending mutation batch | HTTPS JSON (PostgREST request) | → | HTTPS / TLS 1.3 | PostgREST | application data | MVP | Push path. |
| SupabasePostgres → PostgREST → SyncAdapter | LocalStore | Authoritative state (full or delta) | HTTPS JSON | → | HTTPS / TLS 1.3 | PostgREST | application data | MVP | Pull path. |
| TanStackQuery | SupabasePostgres (via PostgREST) | Read query (cache miss) | HTTPS JSON | ↔ | HTTPS / TLS 1.3 | PostgREST | application data | MVP | Direct read path when online. |
| SupabaseRealtime | MobileClient | Postgres change event | WebSocket frame; JSON | → | WebSocket / WSS | Phoenix Channels protocol | application data | MVP | Server-pushed updates. |

## 2. Auth and identity

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| MobileClient | SupabaseAuth (GoTrue) | Magic-link request | HTTPS JSON | → | HTTPS / TLS 1.3 | GoTrue REST | governance metadata | MVP | D6 — magic-link only in MVP. |
| SupabaseAuth | User's email | Magic-link email with one-time token | SMTP message | → | SMTP / TLS | RFC 5321 + RFC 8314 | governance metadata | MVP | Vendor email provider; out of repo scope. |
| User (browser/app) | SupabaseAuth | Magic-link click → session exchange | HTTPS query string + JSON | → | HTTPS / TLS 1.3 | GoTrue REST | governance metadata | MVP | One-time token consumed. |
| SupabaseAuth | MobileClient | JWT (access + refresh) | HTTPS JSON | → | HTTPS / TLS 1.3 | RFC 7519 (JWT) + GoTrue | governance metadata | MVP | Refresh on near-expiry. |
| MobileClient | SecureStore (iOS Keychain / equivalent) | JWT for persistence | platform-native API | → | in-process | Apple Keychain spec | governance metadata | MVP | Per US-003; never AsyncStorage for tokens. |
| MobileClient | SupabasePostgres | JWT in `Authorization: Bearer` header on every PostgREST call | HTTPS header | → | HTTPS / TLS 1.3 | RFC 6750 | governance metadata | MVP | RLS enforced server-side. |
| SupabaseAuth | SupabasePostgres | Session record write | Postgres tuple | → | Postgres wire (5432) | Postgres protocol | governance metadata | MVP | `auth.sessions` table. |
| MobileClient | AppleServices (Sign in with Apple) | OAuth flow | HTTPS JSON | ↔ | HTTPS / TLS 1.3 | OpenID Connect 1.0 + Apple SBP extensions | governance metadata | post-MVP | Required by Apple Guideline 4.8 once any third-party sign-in is added. |
| MobileClient | Google Sign In | OAuth flow | HTTPS JSON | ↔ | HTTPS / TLS 1.3 | OpenID Connect 1.0 | governance metadata | post-MVP | Tied to D6 post-MVP expansion. |

## 3. Storage (media — progress photos, set videos)

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| MobileClient | SupabaseStorage | Progress photo upload (encrypted) | HTTPS multipart; image binary | → | HTTPS / TLS 1.3 | S3-compatible REST | application data (sensitive) | MVP | D22 — encrypted at rest, EXIF stripped pre-upload. |
| SupabaseStorage | SupabasePostgres | Object metadata write | Postgres tuple | → | Postgres wire (5432) | Postgres protocol | application data | MVP | `progress_photos.media_url` populated. |
| MobileClient | SupabaseStorage | Progress photo fetch via signed URL | HTTPS GET; image binary | → | HTTPS / TLS 1.3 | S3-compatible REST | application data (sensitive) | MVP | Signed URL TTL bounded. |
| MobileClient | SupabaseStorage | Set video upload | HTTPS multipart; video binary | → | HTTPS / TLS 1.3 | S3-compatible REST | application data (sensitive) | v2 | D23 — encrypted at rest. |
| SupabaseStorage | MobileClient | Set video fetch (playback / coach review) | HTTPS GET; video binary | → | HTTPS / TLS 1.3 | S3-compatible REST | application data (sensitive) | v2 | Coach access gated by RLS via `set_video_annotations`. |
| MobileClient | SupabaseStorage | AI-generated demo media fetch | HTTPS GET | → | HTTPS / TLS 1.3 | S3-compatible REST | external content (AI source) | v3 | D24 — AI-generated content labeled. |
| MobileClient | SupabaseStorage | Coach-produced demo media fetch | HTTPS GET | → | HTTPS / TLS 1.3 | S3-compatible REST | application data | v2 | D24 — visibility gated. |

## 4. AI / LLM exchanges (D19 Reasoner Duality)

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| MobileClient | EdgeFunctions (`/ai/parse-workout`) | NL workout entry text + Tier 1 context | HTTPS JSON | → | HTTPS / TLS 1.3 | bespoke; documented in OpenAPI | application data | MVP | Per US-070; surface user-confirmable draft. |
| EdgeFunctions | SupabasePostgres | Tier 1 facts query (recent sessions, exercise library) | Postgres query | ↔ | Postgres wire (5432) | Postgres protocol | application data | MVP | Deterministic context for the prompt. |
| EdgeFunctions | LLMAPI (Anthropic / OpenAI) | Tier 2 prompt with Tier 1 facts attached | HTTPS JSON (vendor-specific schema) | → | HTTPS / TLS 1.3 | Anthropic Messages API / OpenAI Chat Completions | external content | MVP | API key never leaves Edge Function. |
| LLMAPI | EdgeFunctions | Tier 2 LLM response (typed-episode shape per §4.9) | HTTPS JSON | → | HTTPS / TLS 1.3 | vendor schema | external content | MVP | `output_episode` populated. |
| EdgeFunctions | SupabasePostgres | `ai_interactions` row (input_raw + typed output_episode + reasoning_trace) | Postgres tuple | → | Postgres wire (5432) | Postgres protocol; hybrid schema per source-doc-cm §4.9 | governance metadata | MVP | Audit row written before response returns. |
| EdgeFunctions | MobileClient | Structured draft (workout sets, summary text) | HTTPS JSON | → | HTTPS / TLS 1.3 | bespoke | application data (draft) | MVP | User confirmation required per Authority Rule. |
| MobileClient | SupabasePostgres | User confirmation (accepted / edited / rejected) | HTTPS JSON via PostgREST | → | HTTPS / TLS 1.3 | PostgREST | governance metadata | MVP | Updates `ai_generated_content.reviewed_status`. |
| EdgeFunctions | HyperDX | OTel span: GenAI semantic conventions | OTLP-HTTP protobuf | → | HTTPS / TLS 1.3 | OpenTelemetry GenAI semantic conventions | observability | MVP | Latency / cost / token counts. |
| MobileClient | SupabasePostgres | User feedback (thumbs up/down) on AI output | HTTPS JSON via PostgREST | → | HTTPS / TLS 1.3 | PostgREST | governance metadata | MVP | Closed-vocabulary labels per source-doc-cm §6.6. |
| MobileClient | SupabasePostgres | Tier 2 concern log signal (time-to-acceptance, accept-without-modification) | HTTPS JSON via PostgREST | → | HTTPS / TLS 1.3 | PostgREST | governance metadata | MVP | Per D19 Tier 2 concern log; storage `.cm/tier2-concerns.json` for skill side, `ai_interactions` enrichment for app side. |

## 5. Observability (every component → HyperDX)

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| MobileClient | HyperDX | Trace spans (UI interactions, sync events) | OTLP-HTTP protobuf | → | HTTPS / TLS 1.3 | OpenTelemetry traces | observability | MVP | `@hyperdx/otel-react-native`; raw OTel fallback per R-TV-04. |
| MobileClient | HyperDX | Logs (errors, breadcrumbs) | OTLP-HTTP protobuf | → | HTTPS / TLS 1.3 | OpenTelemetry logs | observability | MVP | |
| MobileClient | HyperDX | Metrics (counters, gauges) | OTLP-HTTP protobuf | → | HTTPS / TLS 1.3 | OpenTelemetry metrics | observability | MVP | |
| EdgeFunctions | HyperDX | Trace spans (request lifecycle, LLM calls) | OTLP-HTTP/gRPC protobuf | → | HTTPS / TLS 1.3 | OpenTelemetry traces | observability | MVP | |
| SupabasePostgres | HyperDX | Logs (slow queries, errors) | OTLP-HTTP protobuf | → | HTTPS / TLS 1.3 | OpenTelemetry logs | observability | MVP | Sidecar exporter or pg_stat_statements forwarder. |
| SupabaseAuth / Storage / Realtime | HyperDX | Service logs and metrics | OTLP-HTTP protobuf | → | HTTPS / TLS 1.3 | OpenTelemetry | observability | MVP | Containerized services emit OTel directly. |
| document-cm MCP server | HyperDX | Tool-invocation spans, GATE artifacts | OTLP-HTTP protobuf | → | HTTPS / TLS 1.3 | OpenTelemetry | observability | Sprint 0b | Per source-doc-cm §6.8. |
| HyperDX | ClickHouse (internal) | Ingested data | ClickHouse native protocol | → | TCP | ClickHouse wire | observability | MVP | Internal to HyperDX deployment. |

## 6. MCP exchanges (Anthropic Model Context Protocol)

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Claude Code session | document-cm MCP server | Tool list request | JSON-RPC over stdio | → | MCP stdio | MCP 1.0 (Anthropic) | governance metadata | Sprint 0b | `tools/list` |
| document-cm MCP server | Claude Code session | Tool descriptors with JSON-schema | JSON-RPC over stdio | → | MCP stdio | MCP 1.0 | governance metadata | Sprint 0b | Lazy-load fits within stdio bounds. |
| Claude Code session | document-cm MCP server | `cm.update`, `cm.approve`, `cm.record`, `cm.verify`, `cm.status`, `cm.history` calls | JSON-RPC over stdio | → | MCP stdio | MCP 1.0 | governance metadata | Sprint 0b | Maps 1:1 to lib/ functions. |
| document-cm MCP server | Claude Code session | Structured tool result | JSON-RPC over stdio | → | MCP stdio | MCP 1.0 | governance metadata | Sprint 0b | `console.log → stderr` guard mandatory. |
| document-cm MCP server | local filesystem (`.cm/`) | Manifest CRUD, scorekeeper append, GATE artifact triple write | filesystem syscalls | ↔ | local fs | POSIX | governance metadata | Sprint 0b | Append-only ledger with prev_hash chain (§6.7). |
| Claude Code / Cursor / Codex CLI | lifting-tracker-mcp | `query_sessions`, `log_session`, `get_coach_hierarchy`, `assign_program` calls | JSON-RPC over stdio | → | MCP stdio | MCP 1.0 | application data | post athlete-MVP | MCP-first sub-system strategy. |
| lifting-tracker-mcp | SupabasePostgres | Domain queries / mutations | Postgres wire (5432) | ↔ | Postgres | Postgres protocol | application data | post athlete-MVP | RLS-aware. |
| Future agent host | fuseki-mcp | SPARQL query proxy call | JSON-RPC over stdio | → | MCP stdio | MCP 1.0 | application data | Sprint 3+ | Mobile client never reaches Fuseki directly. |
| fuseki-mcp | Fuseki | SPARQL 1.1 query | HTTPS form-encoded or JSON | ↔ | HTTPS | SPARQL 1.1 Protocol | application data | Sprint 3+ | Authentication via mTLS or bearer. |
| Workato MCP / external MCP servers | document-cm | Cross-portfolio governance hooks | JSON-RPC over stdio or HTTP | → | MCP | MCP 1.0 | governance metadata | future | Anchored to D27 promotion; specific protocol deferred. |

## 7. Build, distribution, platform

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Developer / EAS Build | AppleServices (App Store Connect) | iOS app binary submission | TLS binary upload | → | HTTPS / TLS 1.3 | Apple submission API | external content | MVP | EAS Build cloud-hosted; no local Xcode. |
| AppleServices (TestFlight) | Alpha testers | App distribution | Apple-controlled | → | Apple infrastructure | App Store guidelines | external content | MVP | Closed alpha distribution. |
| Vercel (Web build) | Public web | Expo Web bundle | HTTPS | → | HTTPS / TLS 1.3 | HTTP/2 | external content | MVP | Web dashboard target. |
| Railway | All hosted services | Container deploy from git | Docker over Railway control plane | → | TLS | Docker registry v2 | system-of-record | MVP | Commitment to Docker, not to Railway. |
| GitHub | Railway | Webhook on push to main | HTTPS JSON | → | HTTPS / TLS 1.3 | GitHub webhook spec | system-of-record | MVP | Per Railway integration. |

## 8. External content embeds

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| MobileClient | ExternalVideo (YouTube) | Video player embed | iframe / oEmbed | ↔ | HTTPS / TLS 1.3 | oEmbed 1.0 | external content | MVP | D24 — external link only in MVP. |
| AI-generated content pipeline | ExerciseContent table | Generated demo + label `source: ai_generated` | JSON via PostgREST | → | HTTPS / TLS 1.3 | PostgREST | external content | v3 | D24 — AI-vs-human source labeling. |

## 9. Future / Phase 2 — biometrics ingestion (when D20 sub-systems come online)

These rows are reserved in the matrix because the schema reserves the `biometric_samples` table today. Population depends on the platform Biometrics sub-system per `xrsize4all_concept_v0.2.0.md`.

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Apple Watch / Wear OS | MobileClient (HealthKit / Health Connect bridge) | Heart rate, HRV, sleep, steps, calories, VO2max | platform-native sample objects | → | iOS HealthKit / Android Health Connect | Apple HealthKit spec / Health Connect spec | application data (sensitive) | Phase 2 | Per architecture_v0.4.0.md non-decisions (Biometrics platform concern). |
| MobileClient | SupabasePostgres | `biometric_samples` insert | HTTPS JSON via PostgREST | → | HTTPS / TLS 1.3 | PostgREST | application data (sensitive) | Phase 2 | Schema placeholder is in MVP; population deferred. |
| Garmin / Whoop / Oura / Fitbit / Polar / Coros (vendor APIs) | EdgeFunctions or dedicated ingest | Vendor-specific biometric payloads | HTTPS JSON | → | HTTPS / TLS 1.3 | vendor APIs | application data (sensitive) | Future | Platform Biometrics sub-system handles, not Lifting Tracker MVP. |

## 10. Future / v3 — form analysis (when D23 layers ship)

| Source | Destination | Data | Format | Direction | Protocol | Standard | Content class | Phase | Notes |
|---|---|---|---|---|---|---|---|---|---|
| MobileClient (set video capture) | SupabaseStorage | Raw video upload | HTTPS multipart | → | HTTPS / TLS 1.3 | S3-compatible REST | application data (sensitive) | v2 | D23 Layer 1. |
| Form analysis service (TBD) | SupabasePostgres | `set_video_analyses.analysis_json` (joint angles, ROM, tempo, symmetry) | Postgres tuple | → | Postgres wire | Postgres protocol | application data | v3 | D23 Layer 2. |
| Form analysis service | EdgeFunctions | Tier 1 measurements + request for Tier 2 narration | HTTPS JSON | → | HTTPS / TLS 1.3 | bespoke | application data | v3 | D23 Layer 3 invocation. |
| EdgeFunctions | LLMAPI | Tier 2 form narration prompt with Tier 1 measurements | HTTPS JSON | → | HTTPS / TLS 1.3 | vendor schema | external content | v3 | Authority Rule: narrate, not diagnose. |

## Summary — exchanges by phase

| Phase | Exchange count (approximate) | Notes |
|---|---|---|
| MVP (in scope this sprint) | ~50 rows | Auth + sync + storage + AI parse/summary + observability + build/distribution |
| Sprint 0b incremental | +10 rows | document-cm MCP exchanges land here |
| post-athlete-MVP | +5 rows | lifting-tracker-mcp surface |
| v2 | +10 rows | Coach features, set videos, hosted instructional content |
| v3 | +10 rows | Form analysis pipeline, AI photo analysis, AI-generated content |
| Phase 2 | +10 rows | Fuseki / fuseki-mcp; biometrics ingestion |
| Future | reserved | Watch app native, glasses, voice-only logging, Stripe billing, social features |

## Maintenance protocol

This matrix is **append-only**, with two operations allowed:

1. **Add a row** when a new exchange ships or when an existing one was missed during initial population.
2. **Bump the Phase column** when an exchange transitions from reserved to active. Do not delete the reserved row when a Phase 2 surface goes live; just change the Phase tag.

Removing a row is an architectural change (an interface was retired) and bumps SV-6 to MINOR per CONVENTIONS_v0.2.0.md §8 — the prior row is preserved in the baseline snapshot.

## Cross-references

**Architectural decisions:** D2 (per-set granularity drives sync row volume), D4 (cloud source of truth dictates direction of sync rows), D6 (auth → magic-link rows), D8 (Sprint 0a sync stack revision drives sections 1 + 2), D17 (set grouping carried via group_id on sets payload), D19 (Reasoner Duality dictates AI section structure: Tier 1 facts query → LLM → audit row), D20 (biometrics rows reserved per non-decisions), D22 (encrypted storage; sensitive content class), D23 (form analysis exchanges reserved for v2/v3), D24 (instructional content — coach/platform/AI source labeling), D26 (TypeScript across boundaries — JSON contracts deserialize to TS types), D27 (MCP exchanges anchored to multi-agent interop promotion). Cross-cutting principles: MCP-first (sections 6 + 7 wouldn't exist without it), Three-layer data (sections 1 + 6 wouldn't make sense without it), Observability (section 5).

**User stories:** US-001 (magic-link rows), US-013 (offline path → sync push when online), US-014 (auto-sync rows in section 1), US-040–US-041 (history import → SupabaseStorage upload + multiple PostgREST inserts), US-070 (NL workout entry — entire AI section), US-071 (session summary — same path), US-072 (anomaly flagging — Tier 1 facts query), US-090–US-093 (progress photo rows in section 3), US-300 (sync performance — instrumented in section 5), US-310 (TLS on every row), US-311 (RLS on every PostgREST row), US-313 (AI transparency → ai_interactions audit row), US-320 (offline durability — outbox pattern), US-321 (sync conflict — last-write-wins).

**Sprint of last revision:** Sprint 0b Day 1 (2026-04-24). Initial population.

**Other DoDAF views referenced:** SV-1 (component + port catalog this matrix populates), DIV-2 (the table-level data model these exchanges read and write), StdV-1 (every Standard column entry corresponds to a row in StdV-1), AV-2 §9 (component definitions), AV-2 §10 (risk IDs that bind to interface choices: R-TV-03 + R-TV-04 affect HyperDX rows; R-TV-05 affects Railway hosting; R-CI-01 + R-CI-02 affect document-cm rows in section 6).

---

© 2026 Eric Riutort. All rights reserved.
