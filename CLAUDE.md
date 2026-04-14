## Project
Lifting Tracker — a mobile-first PWA for logging weightlifting workouts, sets, and progress over time.

## Stack
- HTML5, CSS3, vanilla JavaScript (ES modules)
- No framework — keep it dependency-light
- Storage: browser `localStorage` (IndexedDB later if data grows)
- Service Worker + Web App Manifest for PWA/offline support
- Deployed on GitHub Pages

## Structure
- `index.html` — app shell entry point
- `css/` — stylesheets (mobile-first, one file per concern)
- `js/` — ES modules (one file per concern: storage, ui, workouts, etc.)
- `assets/` — icons, images, manifest
- `sw.js` — service worker (at repo root so it can control the whole scope)
- `manifest.webmanifest` — PWA manifest

## Commands
- Dev: `python3 -m http.server 8000` (or any static server — service workers need http, not `file://`)
- Build: none — static files are deployed as-is
- Test: none yet — add later if logic grows
- Lint: none yet — add Prettier/ESLint later if desired

## Verification
After every change:
1. Reload the page in a mobile viewport (Chrome DevTools device mode) — check layout and interactions
2. Check the DevTools Console for errors
3. If the service worker or manifest changed, unregister the old SW and hard reload
4. Test offline: DevTools → Network → Offline, confirm the app still loads

## Conventions
- Mobile-first CSS: write base styles for small screens, use `min-width` media queries to scale up
- Vanilla JS only — no frameworks or build tools unless there's a clear reason
- ES modules with `<script type="module">` — no bundler
- Small, focused functions; early returns over nested conditionals
- Bump the service worker cache version string whenever cached assets change, or users will get stale files
- All paths must work from a GitHub Pages subpath (e.g. `/lifting-tracker/`) — use relative paths, not leading `/`

## Don't
- Don't add a framework or build step without discussing first — the point is simplicity
- Don't use absolute paths like `/css/app.css` — they break on GitHub Pages project sites. Use `./css/app.css`
- Don't cache `index.html` aggressively in the service worker — users will get stuck on old versions. Use network-first for HTML, cache-first for assets
- Don't store sensitive data in `localStorage` — it's plaintext and readable by any script on the page
