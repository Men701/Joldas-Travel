# History log

## 2026-11-07 — Website redesign and Docker verification

- Reworked the responsive multilingual Joldas website with travel imagery, destination discovery, trip search, companion/group entry points, onboarding, planning map, and account flows.
- Bundled local WebP photography; corrected the hero image reference to match the available WebP asset and its preload.
- Served the static production frontend through Nginx with compression, asset caching, and baseline security headers; added reproducible npm lockfiles and patched audited dependency versions.
- Verified Docker builds and service health, API tests (4/4), API production dependency audit (0 vulnerabilities), web HTTP 200, API/database health, hero image delivery, mobile and desktop viewport sizing, language switching, and OpenStreetMap embedded document availability.
- Limitations: the site remains a local MVP; no demo listings, direct messaging, real-time transport, live navigation, ISO/IEC certification, or production security certification. Map access requires internet.

## 2026-11-07 — LAN access from other devices

- Changed the web client API base to same-origin `/api`; Nginx proxies API requests to the Compose API service, so phones do not try to connect to their own `localhost`.
- Published the web port on all host interfaces and restricted the API host port to loopback. Removed API CORS middleware because browser API calls are now same-origin.
- Rebuilt and restarted the Compose stack. Verified `0.0.0.0:5173`, `127.0.0.1:3000`, API health through `http://10.25.46.39:5173/api/health`, and browser fetch success without requests to `localhost:3000`.
- Windows reports the current Wi-Fi profile as Public and this session is not Administrator. The user must classify only a trusted Wi-Fi as Private and create the documented Private-profile, LocalSubnet-only firewall rule if needed before an external device can connect.

## 2026-11-07 — Pitch content integrated into the website

- Added localized student, young-professional, and independent-traveler scenarios with an explicit note that these are illustrative, not market research or real user profiles.
- Expanded onboarding to four truthful product steps: profile, find/create trip, join and plan in a group, travel together.
- Added a single scroll-triggered SVG route-story scene (Almaty–Charyn–Kolsai–Kaindy) without a WebGL dependency; marked it as illustrative, with reduced-motion behavior and a static route fallback.
- Added practical pre-trip safety suggestions and an explicit disclosure that identity verification, payments, SOS, and emergency monitoring are not implemented.
- Deliberately did not publish unsupported traction, market-size, competitor research, team roles, pricing, budget breakdown, or investment claims as facts.
- Verified the Docker web production build, HTTP 200 and API/database health, browser language switching (RU/KK/EN), four onboarding steps, route draw animation, reduced-motion behavior, and no horizontal overflow at 320px and 390px mobile widths or desktop.
