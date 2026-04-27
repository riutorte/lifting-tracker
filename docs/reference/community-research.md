---
author: Eric Riutort
created: 2026-04-21
updated: 2026-04-21
valid_as_of: 2026-04-21
re_check_by: 2026-07-20
tier: REFERENCE
content_class: research
---

# Community Research — Lifting Tracker Stack

Compiled findings on the seven open questions flagged for pre-Sprint-0 research. Sources are primary docs, Supabase and Expo GitHub discussions/issues, and practitioner write-ups. Links inline; verbatim quotes where the exact wording matters. A closing "Decisions this informs" section surfaces trade-offs for Eric — it does not pick.

All searches performed 2026-04-21 unless otherwise noted.

---

## 1. Offline-first libraries — WatermelonDB vs PowerSync vs AsyncStorage

### Summary

WatermelonDB, PowerSync, and AsyncStorage sit at three distinct altitudes. AsyncStorage is a key-value cache (string only, 6 MB total / 2 MB per entry on Android), not a database. WatermelonDB is a reactive SQLite-backed ORM with its own opinionated sync protocol and per-column client-wins conflict resolution — the developer still writes the backend endpoints. PowerSync is a managed sync service that streams Postgres rows to an on-device SQLite via a non-invasive connector (no schema changes, no write permissions needed on Postgres). For a Supabase-first stack, the choice is less "which is best" than "do we want to own the sync layer or rent it." Expo's own local-first guide ([docs.expo.dev/guides/local-first/](https://docs.expo.dev/guides/local-first/)) notably does not feature WatermelonDB at all and lists PowerSync only as a one-line bullet — its first-party recommendations are Legend-State, TinyBase, RxDB, and expo-sqlite.

### Key findings

- **AsyncStorage is unsuitable as a source of truth.** "The default limit is 6 MB total and 2 MB per individual entry. Data can only be retrieved by its exact key, with no way to search, filter, or run queries across stored data… Data is stored in plaintext on the device's file system." ([Monterail summary](https://www.monterail.com/blog/what-is-react-native-async-storage)). Useful for session tokens (use SecureStore instead, per our own CLAUDE.md), the last-sync cursor, and UI preferences. Not for 400+ workout sessions.
- **WatermelonDB requires a custom dev client — not Expo Go.** "Because WatermelonDB is a native module, it can't be used directly in Expo projects as is… you'll need to disable the New Architecture and perform a prebuild to access the native folders." ([Morrow tutorial](https://www.themorrow.digital/blog/how-to-use-watermelondb-with-react-native-expo)). Two Expo config plugins exist — [morrowdigital/watermelondb-expo-plugin](https://github.com/morrowdigital/watermelondb-expo-plugin) and [skam22/watermelondb-expo-plugin](https://github.com/skam22/watermelondb-expo-plugin) (JSI fork). Plugin brittleness is a known risk: "If the structure/contents/spelling of default files change in future versions of React Native or Expo, these plugin modifications will fail."
- **WatermelonDB conflict model is per-column client-wins.** "In conflict, the server version is taken except for any column that was changed locally since the last sync." ([WatermelonDB sync impl](https://watermelondb.dev/docs/Implementation/SyncImpl)). Known sharp edges include failed pushes on mid-sync remote writes (bare failure, no conflict list returned) and pull/push timestamp skew errors. Standard mitigation: "wrap synchronize() in a 'retry once' block." ([WatermelonDB FAQ](https://watermelondb.dev/docs/Sync/FAQ)).
- **PowerSync has an official Supabase integration.** "PowerSync connects to Supabase in a non-invasive way (no schema changes or write permissions required)." ([PowerSync + Supabase guide](https://docs.powersync.com/integration-guides/supabase-+-powersync)). Default conflict is last-write-wins, customizable. The React Native native adapter is incompatible with Expo Go; a JS adapter (`@powersync/adapter-sql-js`) exists for Expo Go but is slower due to WASM-SQLite indirection.
- **PowerSync is a hosted service.** Pricing and lock-in matter — you are renting a server-side sync engine. Scales to "hundreds of thousands of concurrently connected users" per vendor claim. RxDB's comparison ([rxdb.info/alternatives.html](https://rxdb.info/alternatives.html)) flags PowerSync as having front-end SQLite latency overhead.
- **Supabase's own local-first tutorial uses WatermelonDB.** [Offline-first React Native Apps with Expo, WatermelonDB, and Supabase](https://supabase.com/blog/react-native-offline-first-watermelon-db). This is the most directly applicable reference for our stack, but it's three years old now — verify SDK compatibility before copying.
- **Expo's endorsed SQLite path is expo-sqlite + a higher-level library.** [Expo local-first guide](https://docs.expo.dev/guides/local-first/) names Legend-State (with built-in Supabase support), TinyBase, RxDB, and Prisma (early access). These sidestep the WatermelonDB plugin fragility.

### Quotes worth remembering

> "The tools available today are still in their early stages, and so you may find yourself solving problems that you would expect to be solved by the tools you are using today. For example, you may need to implement a custom sync layer, or you may have to figure out how to handle permissions for multiple users operating on the same data." — [Expo local-first guide](https://docs.expo.dev/guides/local-first/)

> "Implementing sync that works reliably is a hard problem" — [WatermelonDB FAQ](https://watermelondb.dev/docs/Sync/FAQ) (recommending developers stick to Watermelon Sync rather than rolling their own).

> "If a record being pushed changes remotely between pull and push, push will just fail. It would be better if it failed with a list of conflicts, so that synchronize() can automatically respond." — [Nozbe/WatermelonDB#206](https://github.com/Nozbe/WatermelonDB/issues/206)

### Sources

- [PowerSync blog: React Native local database options](https://www.powersync.com/blog/react-native-local-database-options)
- [Supabase blog: Offline-first React Native with WatermelonDB](https://supabase.com/blog/react-native-offline-first-watermelon-db)
- [PowerSync React Native & Expo SDK docs](https://docs.powersync.com/client-sdks/reference/react-native-and-expo)
- [Morrow: WatermelonDB with React Native Expo tutorial](https://www.themorrow.digital/blog/how-to-use-watermelondb-with-react-native-expo)
- [Morrow: Offline-first app with Expo, Supabase, WatermelonDB](https://www.themorrow.digital/blog/building-an-offline-first-app-with-expo-supabase-and-watermelondb)
- [Expo: Local-first architecture guide](https://docs.expo.dev/guides/local-first/)
- [WatermelonDB sync implementation](https://watermelondb.dev/docs/Implementation/SyncImpl)
- [WatermelonDB sync limitations](https://watermelondb.dev/docs/Sync/Limitations)
- [RxDB alternatives comparison](https://rxdb.info/alternatives.html)
- [AsyncStorage React Native docs](https://reactnative.dev/docs/asyncstorage)

---

## 2. Supabase RLS pitfalls

### Summary

Two distinct failure classes: correctness (policies that don't protect what they should) and performance (policies that correctly protect but kill query time). The correctness side has one dominant footgun: RLS is off by default. "In January 2025, 170+ apps built with Lovable were found to have exposed databases because developers didn't enable RLS." The performance side is well-documented by Supabase itself in [RLS Performance and Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv), which is the single most load-bearing doc for our Sprint 2 RLS work — the same query can range from <0.1 ms to 171 ms to >3 min depending on policy structure and indexing.

### Key findings

- **RLS is disabled by default.** Enabling RLS with no policies denies all access. "You must create at least one policy to allow access." ([Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security))
- **Test policies from the client SDK, not the SQL Editor.** "The SQL Editor bypasses RLS." ([vibeappscanner](https://vibeappscanner.com/supabase-row-level-security)). This is the single most common testing mistake — an RLS policy that "works in the SQL Editor" has not been tested.
- **Wrap `auth.uid()` and `auth.jwt()` in a SELECT.** Without the wrap, the function is called per row. With `(select auth.uid())`, Postgres runs an initPlan once and caches. Real measured delta: `auth.uid() = user_id` → 171 ms; `(select auth.uid()) = user_id` → 9 ms on 100k rows. ([Supabase RLS perf docs](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv))
- **Index every column referenced in an RLS predicate.** Missing index on `user_id` with a `user_id = auth.uid()` policy: 50 ms on 10k rows, timeout on 1M rows. ([supaexplorer](https://supaexplorer.com/best-practices/supabase-postgres/security-rls-performance/))
- **Subquery direction matters.** `auth.uid() in (select user_id from team_user where team_user.team_id = table.team_id)` is "much slower" than `team_id in (select team_id from team_user where user_id = auth.uid())`. Same semantics, different planner behavior.
- **Joined tables trigger their own RLS.** Wrap the join in a `security definer function` to bypass. Real measured delta: 178s → 12 ms on a policy using `exists (select 1 from roles_table …)`. ([makerkit](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices))
- **Add `TO authenticated` on policies.** Without it, the predicate evaluates for the `anon` role too. Measured: 170 ms → <0.1 ms when `anon` is short-circuited.
- **`FOR ALL` is an anti-pattern.** Split into separate SELECT/INSERT/UPDATE/DELETE policies. Each operation may need different predicates, and the combined form obscures intent.
- **Don't rely on RLS for filtering.** Add an explicit `.eq()` client-side filter in addition to the RLS policy. RLS is security, not query optimization.
- **pgTAP is the recommended RLS test framework.** Supabase ships native support via the CLI (min v1.11.4). Supabase's [Testing Your Database](https://supabase.com/docs/guides/database/testing) and the [basejump supabase-test-helpers](https://github.com/usebasejump/supabase-test-helpers) extension give `tests.rls_enabled()` and JWT-simulation helpers. Naming convention: `000-setup-tests-hooks.sql` runs first; test files run alphabetically.

### Quotes worth remembering

> "Wrapping the function in some SQL causes an initPlan to be run by the optimizer which allows it to 'cache' the results versus calling the function on each row. WARNING: You can only do this if the results of the query or function do not change based on the row data." — [Supabase RLS perf docs](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)

> "Do not rely on RLS for filtering but only for security." — same doc.

> "RLS policies often fail silently — they don't throw errors but just filter out data or prevent operations, making testing RLS policies tricky because you need to verify what didn't happen, not just what did." — [Blair Jordan, pgTAP RLS testing](https://blair-devmode.medium.com/testing-row-level-security-rls-policies-in-postgresql-with-pgtap-a-supabase-example-b435c1852602)

### Sources

- [Supabase RLS Performance and Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- [Supabase Row Level Security docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Testing Your Database](https://supabase.com/docs/guides/database/testing)
- [Supabase pgTAP unit testing](https://supabase.com/docs/guides/database/extensions/pgtap)
- [basejump supabase-test-helpers](https://github.com/usebasejump/supabase-test-helpers)
- [Makerkit: Supabase RLS Best Practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)
- [SupaExplorer: Optimize RLS Policies for Performance](https://supaexplorer.com/best-practices/supabase-postgres/security-rls-performance/)
- [DEV: Supabase RLS in Production: Patterns That Actually Work](https://dev.to/whoffagents/supabase-row-level-security-in-production-patterns-that-actually-work-2l78)
- [vibeappscanner: RLS Test & Fix Your Policies](https://vibeappscanner.com/supabase-row-level-security)

---

## 3. Expo EAS Build gotchas

### Summary

Three categories of pain: credentials (Apple auth flakes, Android signing masquerading), native-module fallout (config plugins diverging from current RN/Expo internals), and build times (45+ min iOS, multi-hour production AAB builds with extended timeouts). Expo's guidance is unambiguous: stay in the managed workflow with dev client and EAS Build as long as possible. "Prebuild changes your project from Managed Workflow to Bare Workflow. You almost certainly do not want to be in Bare Workflow." Our stack (Expo + Supabase + likely WatermelonDB or PowerSync) will need a custom dev client, but that's not the same as ejecting.

### Key findings

- **Dev client is the right dev-loop tool when any native module enters the project.** "If you include expo-dev-client, you get the same developer experience (e.g. hot module reload, integration with expo start) that you get with Expo Go." ([Expo managed + EAS writeup](https://medium.com/@lucksp_22012/no-need-to-eject-when-youve-got-eas-managed-workflow-6df148b888ce)). For us: the moment we add WatermelonDB or PowerSync, Expo Go stops working — we need a dev client build.
- **Don't eject unless forced.** [Expo docs](https://docs.expo.dev/build/introduction/) and multiple practitioner guides agree: prebuild converts to bare and you lose managed benefits. Defer.
- **iOS credentials are a recurring pain point.** Apple session invalidations trigger GraphQL errors from EAS CLI. [eas-cli#2458](https://github.com/expo/eas-cli/issues/2458). Mitigation: plan for Apple Developer Portal 2FA friction during your first iOS build.
- **Android signing has a known trap.** EAS Build has "claimed to use the correct keystore in logs but produced incorrectly signed builds, causing Google Play Store submission failures." Root cause: prebuild-generated gradle config hardcodes debug signing for release, overriding keystore injection. [eas-cli#3127](https://github.com/expo/eas-cli/issues/3127). Always verify the submitted APK/AAB with `jarsigner -verify` before pushing to Play.
- **Build times: expect slow.** Reports of 45+ min iOS builds ([eas-cli#1190](https://github.com/expo/eas-cli/issues/1190)) and 2+ hour AAB builds that timeout ([expo/expo#24919](https://github.com/expo/expo/issues/24919)). Dev client builds for development profile are usually under 11 min.
- **Local reproduction discipline.** "You can verify that your project builds on your local machine with `npx expo run:android` and `npx expo run:ios` commands with release configuration to most faithfully reproduce what executes on EAS Build." ([Expo troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)). Valuable before burning a 45-min iOS build on a broken native dep.
- **Dev client + Expo Go can coexist.** Use Expo Go for quick UI-only experiments and dev client for the full app. But once a native module is added, Expo Go will crash on launch for that module's screens.
- **Config plugin failure modes.** "Modifications are accomplished by reading existing contents, searching for an existing line to anchor around, inserting the modification, and then saving." ([Morrow WatermelonDB plugin README](https://github.com/morrowdigital/watermelondb-expo-plugin)). When RN or Expo template files change shape, plugins silently miss their anchor and produce a broken native project. Pin your Expo SDK and plugin versions together.

### Sources

- [Expo EAS Build introduction](https://docs.expo.dev/build/introduction/)
- [Expo Build troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)
- [Expo dev client managed workflow](https://medium.com/@lucksp_22012/no-need-to-eject-when-youve-got-eas-managed-workflow-6df148b888ce)
- [expo/eas-cli#1613 — credentials setup GraphQL error](https://github.com/expo/eas-cli/issues/1613)
- [expo/eas-cli#2458 — Apple invalid session](https://github.com/expo/eas-cli/issues/2458)
- [expo/eas-cli#3127 — Android keystore masquerade](https://github.com/expo/eas-cli/issues/3127)
- [expo/eas-cli#1190 — iOS builds >45 min](https://github.com/expo/eas-cli/issues/1190)
- [expo/expo#24919 — 2hr+ AAB build timeouts](https://github.com/expo/expo/issues/24919)
- [expo/expo#33263 — run:ios works, EAS build fails](https://github.com/expo/expo/issues/33263)
- [Expo: Adopt Prebuild guide](https://docs.expo.dev/guides/adopting-prebuild/)

---

## 4. Magic-link auth deep-linking on Expo/React Native

### Summary

The Supabase+Expo magic-link path works, but the default Supabase examples have historically been wrong or stale — enough to produce a string of GitHub discussions going back three years. The current canonical pattern is documented in [Supabase: Native Mobile Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking) and uses `makeRedirectUri()` (expo-auth-session), `Linking.useLinkingURL()` (expo-linking), `QueryParams.getQueryParams()` to parse, and `supabase.auth.setSession({access_token, refresh_token})` to hydrate. Known pitfalls: `Linking.useURL()` returns null on iOS for magic links; URL fragments (`#access_token=...`) can break older parsers; custom URL schemes must be registered in both `app.json` scheme field and the Supabase auth redirect allowlist.

### Key findings

- **Canonical pattern uses `useLinkingURL`, not `useURL`.** "Using the Linking.useURL() method from expo-linking in iOS with magic links does not work correctly on the latest versions, with the URL being null and preventing users from logging in." ([supabase/auth-js#657](https://github.com/supabase/auth-js/issues/657)). Workaround: `Linking.useLinkingURL()`.
- **Fragment vs query.** Magic-link URLs historically delivered tokens in a `#` fragment; React Navigation and older parsers expected `?`. The `#` issue has shown up in [supabase-js#188](https://github.com/supabase/supabase-js/issues/188) and [supabase#31047](https://github.com/supabase/supabase/issues/31047). `QueryParams.getQueryParams` in the current expo-auth-session handles both, but if you roll your own parser, do `url.replace('#', '?')` before parsing.
- **Two config points must match.** The `scheme` in `app.json` (e.g. `liftingtracker`) and the Supabase project's auth Additional Redirect URLs (e.g. `liftingtracker://**`). A mismatch produces a silent failure — the email arrives, the link opens nothing.
- **Documentation gap, historically.** "The Expo example in the Supabase documentation says it uses magic links, but the actual code appears to use password login instead." ([supabase#6698](https://github.com/orgs/supabase/discussions/6698)). Been corrected in the current doc, but warrants verification — check the doc revision date against your integration day.
- **Universal/app links are the production recommendation.** [Supabase docs](https://supabase.com/docs/guides/auth/native-mobile-deep-linking): "For the best user experience it is recommended to use universal links which require a more elaborate setup." Universal links require `apple-app-site-association` and `assetlinks.json` hosted on a verified domain — not blocked for MVP, but extra ops work.
- **The handoff mechanics.** `signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })` sends the email. The email link opens the scheme. `Linking.useLinkingURL()` in the `Auth` component captures the inbound URL (warm or cold launch). `createSessionFromUrl` pulls `access_token`/`refresh_token` and calls `supabase.auth.setSession`. This must run before any gated navigation — a race between auth hydration and route guards produces "logged in in memory, logged out in URL bar" bugs.
- **WebBrowser.maybeCompleteAuthSession().** Required for web, no-op on native. Include it unconditionally if the app supports web.

### Quotes worth remembering

> "Handle linking into app from email app. `const url = Linking.useLinkingURL(); if (url) createSessionFromUrl(url);`" — [Supabase: Native Mobile Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)

> "The problem is the '#' fragment in URLs, because react-native navigation doesn't work with '#', but only with '?'" — [supabase-js#188](https://github.com/supabase/supabase-js/issues/188)

### Canonical code pattern (from Supabase docs)

```ts
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();
const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  if (!access_token) return;
  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
  return data.session;
};

const sendMagicLink = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
};

// In the Auth screen:
const url = Linking.useLinkingURL();
if (url) createSessionFromUrl(url);
```

### Sources

- [Supabase: Native Mobile Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)
- [Expo: Using Supabase](https://docs.expo.dev/guides/using-supabase/)
- [Expo: Linking overview (deep links, universal links, app links)](https://docs.expo.dev/linking/overview/)
- [supabase/auth-js#657 — Magic Link flow broken on React Native](https://github.com/supabase/auth-js/issues/657)
- [supabase/supabase-js#188 — Magic link on RN/Expo does not work](https://github.com/supabase/supabase-js/issues/188)
- [supabase#31047 — Wrong expo-linking method in docs](https://github.com/supabase/supabase/issues/31047)
- [supabase discussions#10754 — Deep linking with Expo and Supabase](https://github.com/orgs/supabase/discussions/10754)
- [supabase discussions#6698 — Magic Link with Expo React Native](https://github.com/orgs/supabase/discussions/6698)
- [supabase discussions#9435 — No way to use Magic Link with Expo/RN?](https://github.com/orgs/supabase/discussions/9435)
- [expo/expo#19708 — Universal Links not working in WebBrowser.openAuthSessionAsync](https://github.com/expo/expo/issues/19708)

---

## 5. Database migration best practices with Supabase

### Summary

Supabase's CLI uses PostgreSQL migration files (timestamped SQL) tracked in `supabase_migrations.schema_migrations`. Forward-only by design — there is no built-in down migration. Branching (ephemeral preview branches per PR, persistent branches for staging/QA) provides the review and rollback story. Declarative schema support is recent and still shaping up. For CI, the accepted pattern is GitHub Actions running `supabase db push` on merge to main, with secrets injected for `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, and `SUPABASE_PROJECT_ID`.

### Key findings

- **Forward-only migrations.** "Supabase tracks which migrations have been applied on each database in a table called `supabase_migrations.schema_migrations`. When you run `supabase db push`, it compares your local `supabase/migrations` folder against that table and runs only the ones not yet applied, in order." ([Supabase Database Migrations docs](https://supabase.com/docs/guides/deployment/database-migrations))
- **No automatic rollback.** Two workarounds. (1) Write a new migration that reverses the change. (2) Manually reverse the SQL on the target DB and run `supabase migration repair` to mark the bad migration as reverted. ([supabase discussions#11263](https://github.com/orgs/supabase/discussions/11263)). Both require discipline; neither is automatic.
- **Branching is the recommended rollback story.** "If you want to roll back changes you've made in an earlier migration… push the latest changes, then delete the preview branch in Supabase and reopen it." ([Supabase Branching docs](https://supabase.com/docs/guides/deployment/branching)).
- **Preview branches are ephemeral; persistent branches for staging.** "Preview branches are automatically paused after inactivity or deleted when a PR is merged or closed. Persistent branches are long-lived and recommended for environments like staging, QA, or development."
- **CI pattern.** "In a production environment, we recommend using a CI/CD pipeline to deploy new migrations with GitHub Actions rather than deploying from your local machine." ([Supabase Managing Environments](https://supabase.com/docs/guides/deployment/managing-environments))
- **Include reverse SQL as comments for critical migrations.** Practitioner convention — the SQL to undo the change lives in the forward file as a comment block, so a future revert PR has a template to copy from.
- **Seed data strategy for pgTAP.** Use an alphabetically-first setup file (e.g. `000-setup-tests-hooks.sql`) to load fixtures before policy tests run. ([Supabase pgTAP extended](https://supabase.com/docs/guides/local-development/testing/pgtap-extended))
- **Declarative schemas are emerging.** Supabase's [declarative database schemas guide](https://supabase.com/docs/guides/local-development/declarative-database-schemas) shows a path where the migration tool generates diffs from a source-of-truth schema file. Down migration generation "is planned to build on top of declarative schema." Not yet production-ready for MVP.

### Quotes worth remembering

> "Preview branches are ephemeral and best suited for focused testing. They are automatically paused after inactivity or deleted when a PR is merged or closed." — [Supabase Branching docs](https://supabase.com/docs/guides/deployment/branching)

> "The current workaround is to add a new migration file to the revert PR with manually written statements to 'undo' anything you wanted to revert." — [supabase discussions#11263](https://github.com/orgs/supabase/discussions/11263)

### Sources

- [Supabase Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase Branching](https://supabase.com/docs/guides/deployment/branching)
- [Supabase Working with branches](https://supabase.com/docs/guides/deployment/branching/working-with-branches)
- [Supabase Managing Environments](https://supabase.com/docs/guides/deployment/managing-environments)
- [Supabase Local Dev blog](https://supabase.com/blog/supabase-local-dev)
- [Supabase Declarative database schemas](https://supabase.com/docs/guides/local-development/declarative-database-schemas)
- [Supabase CLI migration repair](https://supabase.com/docs/reference/cli/supabase-migration-repair)
- [supabase discussions#11263 — Rollback ("down") Migrations](https://github.com/orgs/supabase/discussions/11263)
- [supabase discussions#542 — Multiple environments and migrations](https://github.com/orgs/supabase/discussions/542)

---

## 6. Starter templates for Expo + Supabase

### Summary

Four candidates stand out. Supabase's own [Expo quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native) is minimal and authoritative but not a full app skeleton. [FlemingVincent/expo-supabase-starter](https://github.com/FlemingVincent/expo-supabase-starter) is the most-cited community template; repo health and last-commit date should be verified before copy. [onesamket/expo-supabase](https://github.com/onesamket/expo-supabase) bundles Expo Router, Tailwind, React-Hook-Form, Zod, TypeScript. [aaronksaunders/expo-supabase-ai-template](https://github.com/aaronksaunders/expo-supabase-ai-template) adds OpenAI integration out of the box — probably overkill for our MVP where we'll roll our own Edge Function wrapper per D19. For us, the starter's value is auth plumbing (magic link + session restore + route guards) and testing/lint config. Our ontological schema and offline-first sync will be bespoke.

### Key findings

- **Supabase's own quickstart is the correct first stop.** Uses `npx create-expo-app` with TypeScript template, wires up `@supabase/supabase-js` and AsyncStorage for token persistence. No UI opinions.
- **FlemingVincent/expo-supabase-starter is the widely-referenced full-stack template.** Ships Expo Router, auth flow, route protection. The GitHub search result labeled it "flemingvincent/expo-clerk-convex" in one listing — suggests the author also maintains a Clerk+Convex variant. Verify which repo has the Supabase wiring and its recent commit activity before cloning.
- **onesamket/expo-supabase is the stack-opinionated template.** Expo Router + NativeWind/Tailwind + React-Hook-Form + Zod + TypeScript. Matches a lot of our inclinations but locks you into that stack. Useful as a reference implementation even if not adopted wholesale.
- **NativeLaunch** is a commercial template claiming "typed database schema, authentication, API layer, and mobile UI all wired together." Paid; evaluate only if time pressure justifies the cost.
- **expostarter.com** positions itself as a "template + course" bundle. Unclear maintenance; treat as secondary.
- **Anti-pattern: starter as foundation for production.** Extract the patterns (auth plumbing, env config, directory layout) rather than forking the whole repo. Starter templates accumulate "features" that become dead weight; forking them commits you to their assumptions.

### Sources

- [Supabase: Use Supabase with Expo React Native](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native)
- [Supabase: Build a User Management App with Expo](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [FlemingVincent/expo-supabase-starter](https://github.com/FlemingVincent/expo-supabase-starter)
- [onesamket/expo-supabase](https://github.com/onesamket/expo-supabase)
- [aaronksaunders/expo-supabase-ai-template](https://github.com/aaronksaunders/expo-supabase-ai-template)
- [NativeLaunch Expo + Supabase template](https://nativelaunch.dev/expo-supabase-template)
- [StarterIndex: Expo + Supabase boilerplates](https://starterindex.com/expo+supabase-boilerplates)

---

## 7. Claude Code real-world lessons on Expo/Supabase projects

### Summary

Four signals repeat across practitioners who have used Claude Code on Expo/React Native or Supabase projects. First, CLAUDE.md is load-bearing — it's the single highest-leverage setup step, and pruning it matters more than filling it. Second, sub-agents are the correct tool for cross-file investigation; they protect main context. Third, Plan mode beats jumping straight into implementation, especially for anything multi-file. Fourth, Supabase-specific work benefits from MCP integration — Claude Code can inspect the project, run SQL, and close its own feedback loop. The Expo web team's month-long experiment ([blog](https://expo.dev/blog/what-our-web-team-learned-using-claude-code-for-a-month)) is the most credible practitioner write-up we have on this exact stack.

### Key findings

- **CLAUDE.md is the highest-leverage setup artifact — but must be pruned.** "The single highest-impact practice is creating a CLAUDE.md file, which takes 10 minutes and makes every subsequent session dramatically more productive." ([aiorg.dev](https://aiorg.dev/blog/claude-code-best-practices)). Counter: "If your CLAUDE.md is too long, Claude ignores half of it because important rules get lost in the noise. Fix: Ruthlessly prune." ([claudelab.net Expo guide](https://claudelab.net/en/articles/claude-code/claude-code-expo-react-native-mobile-workflow)). Our ~90-line CLAUDE.md is in range.
- **Mobile-specific questions CLAUDE.md must answer.** "What version of Expo SDK are you targeting? Are you using NativeWind or raw StyleSheets? Expo Router or React Navigation? Which state management library?" ([claudelab.net](https://claudelab.net/en/articles/claude-code/claude-code-expo-react-native-mobile-workflow)). Our current CLAUDE.md names Expo + Supabase + offline-first but doesn't pin SDK version or name the router/state libs — these pins should be added when we scaffold.
- **Sub-agents for cross-file investigation.** "When Claude researches a codebase it reads lots of files, all of which consume your context. Subagents run in separate context windows and report back summaries. A subagent does the same work in its own context and returns a 5K-token summary." ([claudelab.net](https://claudelab.net/en/articles/claude-code/claude-code-expo-react-native-mobile-workflow)). Directly applicable to Sprint-boundary investigations ("how do we touch the sync queue?").
- **Plan mode for ambiguous/multi-file work.** "For more ambiguous or complex features, use Plan mode. It asks clarifying questions, preserves context across iterations, and consistently produces higher-quality results than jumping straight into implementation." ([Expo blog](https://expo.dev/blog/what-our-web-team-learned-using-claude-code-for-a-month))
- **Skills get ignored silently.** "Skills (pre-packaged recipes or context bundles) provide useful shortcuts, but Claude often forgets to apply them without explicit reminders. We've worked around this by manually invoking skill slash commands when we want specific recipes followed." ([Expo blog](https://expo.dev/blog/what-our-web-team-learned-using-claude-code-for-a-month)). If we build a skills library, plan on explicit `/skill-name` invocation rather than hoping it triggers.
- **Context decay is real.** Expo team's workaround: "Use /clear after completing each discrete task, or ask Claude to export current progress to a markdown file, clear the session, then have it read the file to continue." ([Expo blog](https://expo.dev/blog/what-our-web-team-learned-using-claude-code-for-a-month)). This is exactly our dispatch-handoff.md pattern, at the Claude Code session level.
- **MCPs close the feedback loop.** "We've found Linear, Sentry, Figma, and Graphite MCPs particularly useful for enriching Claude's understanding of our work." ([Expo blog](https://expo.dev/blog/what-our-web-team-learned-using-claude-code-for-a-month)). Supabase has an official Claude plugin ([claude.com/plugins/supabase](https://claude.com/plugins/supabase)) that lets Claude Code inspect schema and run SQL directly.
- **Don't trust architecture judgment to the model.** "LLMs still produce poorly architected solutions with surprising frequency — and the solutions are presented with confidence. You still need to actively guide the model toward solutions you'd be comfortable shipping to your users." ([Expo blog](https://expo.dev/blog/what-our-web-team-learned-using-claude-code-for-a-month)). Aligns with our established Dispatch (architecture) / Claude Code (implementation) split.
- **Write outputs to Supabase, not context.** Scaling lesson from data-pipeline work: "Write outputs to Supabase instead of keeping everything in context (which avoids bloat)." ([GTM Engineer Pulse](https://gtmengineerschool.substack.com/p/the-gtm-engineer-pulse-22)). For any AI-generated-output work in Sprint 6+, pipe to a Postgres table, not the conversation.
- **Never ship AI-generated DB schema without review.** "Tables without RLS enabled are accessible to any client holding the anon key with no restrictions." ([codiflysoftware](https://codiflysoftware.com/blog/ai-should-assist-not-replace-claude-in-vs-code-vs-no-code-supabase-workflows)). Every schema migration Claude Code produces needs a human RLS audit before merge.

### Quotes worth remembering

> "Claude starts fresh every session. Think of it as a new hire who needs onboarding each time... Keep system prompts concise, though. Verbose instructions consume context window space you'll need for actual work." — [Expo blog](https://expo.dev/blog/what-our-web-team-learned-using-claude-code-for-a-month)

> "The key is giving the agent tools to close its own feedback loop. This includes enabling MCPs that provide context about your systems and workflows." — same.

> "AI-generated output without human review often contains subtle inefficiencies, security gaps, and antipatterns that compound silently until they become expensive problems." — [codiflysoftware](https://codiflysoftware.com/blog/ai-should-assist-not-replace-claude-in-vs-code-vs-no-code-supabase-workflows)

### Sources

- [Expo blog: What our web team learned using Claude Code for a month](https://expo.dev/blog/what-our-web-team-learned-using-claude-code-for-a-month)
- [Claude Code Best Practices (Anthropic)](https://code.claude.com/docs/en/best-practices)
- [Claude Lab: Claude Code × Expo/React Native Complete Guide](https://claudelab.net/en/articles/claude-code/claude-code-expo-react-native-mobile-workflow)
- [Claude Lab: Build Full-Stack Apps Fast with Claude Code and Supabase](https://claudelab.net/en/articles/claude-code/claude-code-supabase-fullstack-guide)
- [Callstack: React Native Best Practices for AI Agents](https://www.callstack.com/blog/announcing-react-native-best-practices-for-ai-agents)
- [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills)
- [Medium: Claude Code for React & React Native Workflows (Cars24)](https://medium.com/cars24/claude-code-for-react-react-native-workflows-that-actually-move-the-needle-33b8bb410b14)
- [AIOrg.dev: Claude Code Best Practices — 15 Tips from 6 Projects](https://aiorg.dev/blog/claude-code-best-practices)
- [Anthropic: Supabase Claude Plugin](https://claude.com/plugins/supabase)
- [Codifly: AI Should Assist, Not Replace — Claude in VS Code vs No-Code Supabase](https://codiflysoftware.com/blog/ai-should-assist-not-replace-claude-in-vs-code-vs-no-code-supabase-workflows)
- [GTM Engineer Pulse #22](https://gtmengineerschool.substack.com/p/the-gtm-engineer-pulse-22)

---

## Decisions this informs

Not picking — surfacing trade-offs for Eric.

**Offline-first library (D8/D18).** Three paths. (1) WatermelonDB + write our own backend sync endpoints against Supabase. Matches D18 intent; well-documented for our stack via Supabase's own tutorial; requires a custom dev client and accepting config-plugin fragility. Conflict model (per-column client-wins) fits workout data where coach and athlete rarely edit the same column. (2) PowerSync hosted service. Rents the sync engine; non-invasive on Postgres; last-write-wins default but customizable. Adds a vendor and a recurring cost; removes the largest hand-rolled piece of Sprint 5. (3) expo-sqlite + Legend-State or TinyBase, write our own minimal sync. Expo-blessed; least native-module fragility; most code to write. Our roadmap treats Sprint 5 as the offline-sync sprint — PowerSync compresses that, WatermelonDB is a known-good fit, the third path is the highest-control / highest-effort option. A decision record belongs in `docs/architecture.md` when we pick.

**RLS testing approach.** The pgTAP-first path ([Supabase docs](https://supabase.com/docs/guides/database/testing)) gives a full test harness at the database layer with JWT simulation — the writer/reviewer pattern (Gap 5 in our best-practices review) can run the review session against pgTAP output. Alternative: client-side integration tests using the Supabase JS SDK under each role. pgTAP catches policy correctness more precisely; SDK tests catch integration surface (what does the app actually do when RLS blocks a read). Recommend both; pgTAP as the gate, SDK tests as coverage.

**RLS performance posture.** Start every policy with the wrapped-function pattern (`(select auth.uid())`), `TO authenticated`, and an index on every referenced column. Our schema has nullable FKs everywhere above Session (D12) — that nullability multiplies the index surface, and we should budget for it. A `docs/reference/rls-patterns.md` (one page, copy-paste templates for common policy shapes) would save per-table thought in Sprint 2.

**EAS workflow.** Stay in Expo managed with EAS Build + dev client. The moment we add WatermelonDB, PowerSync, or any other native module, we're committed to a custom dev client — not ejecting. Pin Expo SDK version in CLAUDE.md. Plan for 45+ min iOS build turnaround for non-dev-client builds.

**Deep-link scheme.** Register a custom scheme (e.g. `liftingtracker://`) in `app.json` and Supabase auth redirect allowlist on day one. Use the canonical `makeRedirectUri` + `Linking.useLinkingURL` + `createSessionFromUrl` pattern verbatim from Supabase docs. Defer universal links to post-MVP.

**Migration discipline.** Adopt forward-only migrations with reverse-SQL comments in every migration file. Use Supabase preview branches per PR for review; persistent branch for staging when it exists. Deploy via GitHub Actions on merge to main. Accept that rollback is manual and rare — if we need it often, we're writing migrations wrong.

**Starter template.** Don't fork wholesale. Use [Supabase's Expo quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native) as the foundation, then import the auth-flow pattern from FlemingVincent or onesamket as reference. Our schema and offline-first architecture will be bespoke regardless.

**Claude Code discipline.** Add SDK/router/state-lib pins to CLAUDE.md at scaffolding time. Use Plan mode for anything crossing two or more files. Use sub-agents for cross-cutting investigation. Clear between discrete tasks. Install the Supabase Claude plugin for schema-aware SQL sessions. Keep the Dispatch/Claude Code split we already have.

---

© 2026 Eric Riutort. All rights reserved.
