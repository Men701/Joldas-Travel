# Joldas Travel — local MVP

Joldas helps travelers in Kazakhstan find trip groups and coordinate their itinerary, shared cost estimate, and trip-scoped chat. The interface supports Russian, Kazakh, and English. The app is for local development only: no Azure resources, public deployment, real payments, commercial bookings, or identity verification.

## Run with Docker Compose

1. Copy `.env.example` to `.env` (`Copy-Item .env.example .env` in PowerShell, or `cp .env.example .env` in bash).
2. Replace both example passwords/secrets with random local-only values. Keep `.env` private; it is ignored by Git.
3. Run `docker compose up --build`.
4. In another terminal, apply the schema migration once: `docker compose exec api npm run db:deploy`.
5. Open <http://localhost:5173>. API health, including PostgreSQL connectivity: <http://localhost:3000/api/health>.
6. Stop with `Ctrl+C`; `docker compose down` preserves the local database volume. Do not add `-v` unless you intend to delete local data.

The database starts empty. Migrations create schema only; there are no seed users, trips, fixtures, demo records, or real listings. Register an account and create a trip to try the flows. Compose and these settings are intended for local use only.

## Open on a phone or another computer on your Wi-Fi

1. Start Docker Compose on the laptop: `docker compose up --build -d`.
2. Connect the phone and laptop to the same Wi-Fi network. Do not use the phone's mobile data for this local address.
3. Find the laptop's Wi-Fi IPv4 address with `ipconfig` in PowerShell; use the address under the active Wi-Fi adapter (for example `192.168.1.45`).
4. On the other device, open `http://<laptop-wifi-ip>:5173` (for example `http://192.168.1.45:5173`).
5. The frontend calls `/api` on the same origin; Nginx forwards those requests to the API inside Docker. PostgreSQL and the API's host port remain loopback-only.

The web port is published on all host interfaces, but Windows Firewall or Wi-Fi client isolation may still prevent access. This laptop currently classifies its Wi-Fi network as **Public**, so the private-profile firewall rule below will not apply until you mark that Wi-Fi network **Private**. Only change it when this is a trusted home or other private network; in Windows, open **Settings → Network & internet → Wi-Fi → the connected network → Network profile type → Private**. Then run PowerShell as Administrator and add a rule restricted to the private profile and local subnet:

```powershell
New-NetFirewallRule -DisplayName "Joldas local Wi-Fi" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5173 -Profile Private -RemoteAddress LocalSubnet
```

Only use a trusted private network. Do not expose this development MVP to the public internet or set up an internet tunnel; its local HTTP and application controls are not production deployment protections.

## MVP flows

- Register/sign in and edit a persistent profile.
- Search trips by destination, overlapping date range, interests, and maximum per-person budget.
- Create a group trip and join an available group.
- As a group member, add itinerary items, shared-cost estimate entries, and trip chat messages.
- Group capacity is checked server-side; itinerary, expenses, and chat require authenticated membership.
- Discover curated destination ideas, see trip hosts and groups, and open a trip to join its member-only chat.
- Explore the Almaty–Kolsai–Kaindy planning reference on an OpenStreetMap embed; open the external route link for directions.

Chat uses persisted messages with client refresh polling, not a real-time transport. The cost estimator is informational and does not process payments.

## Interface, maps, and media

- The web client is a responsive, multilingual travel website rather than a phone mock-up. It includes a photographic landing page, destination discovery cards, trip search, companion/group entry points, traveler use cases, a four-step onboarding explanation, an animated illustrative route, route planning reference, profile, and account flows.
- The audience section describes student, young-professional, and independent-traveler use cases; it is illustrative, not market research. No unsupported market-size, traction, team-role, pricing, or investment claims are presented as verified facts.
- A safety section offers practical pre-trip guidance and explicitly states that this MVP does not verify identities, process payments, provide an SOS feature, or monitor emergencies. It does not claim that these suggestions guarantee safety.
- The route illustration animates a lightweight SVG when it enters view; it uses no WebGL/3D dependency, respects reduced-motion settings, and has a static underlying route for unsupported browsers. The real map remains a separate online OpenStreetMap planning reference.
- Images are bundled locally from the Unsplash CDN so the landing page does not need a third-party image request at runtime. They are illustrative travel photography, not a claim that each photo depicts the named Kazakhstan destination. Image IDs/source links: [1464822759023-fed622ff2c3b](https://unsplash.com/photos/mountain-range-under-blue-sky-during-daytime-1464822759023-fed622ff2c3b), [1501785888041-af3ef285b470](https://unsplash.com/photos/body-of-water-near-mountain-under-cloudy-sky-1501785888041-af3ef285b470), [1470770841072-f978cf4d019e](https://unsplash.com/photos/aerial-photography-of-mountains-surrounded-by-trees-1470770841072-f978cf4d019e), [1500534623283-312aade485b7](https://unsplash.com/s/photos/mountain-landscape), and [1519681393784-d120267933ba](https://unsplash.com/photos/mountain-covered-with-snow-under-star-1519681393784-d120267933ba). Replace them with location-verified images before presenting the cards as documentary photos.
- The map is a no-API-key OpenStreetMap embed and external directions link. It needs an internet connection and follows OpenStreetMap's attribution and tile-use policies; it is a planning reference, not live navigation or a generated route guarantee.
- The web image is built as static production assets and served by Nginx in Docker, with gzip, explicit asset caching, and baseline browser security headers. `package-lock.json` files make npm builds reproducible. Reduced-motion preferences, keyboard focus visibility, semantic landmarks, and a compact mobile navigation are included.
- These are baseline engineering practices, not a claim of ISO/IEC certification or a production security audit. Review the dependency audit and complete deployment-specific controls before any public launch.

## Development and verification

- API: `npm --prefix services/api install`, `npm --prefix services/api run db:generate`, `npm --prefix services/api run build`, `npm --prefix services/api test`
- Web: `npm --prefix services/web install`, `npm --prefix services/web run build`
- Apply a local development migration: `npm --prefix services/api run db:migrate -- --name initial_mvp` (with `DATABASE_URL` set).
- Compose: `docker compose up --build`; apply pending migrations using the command above.

See `services/api/README.md` for the HTTP routes and authorization behavior. Never use example secrets outside local development.
