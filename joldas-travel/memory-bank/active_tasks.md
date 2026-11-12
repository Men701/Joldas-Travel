# Active tasks

- Current requested design and Docker MVP work: complete. Docker build and restart succeeded; API tests passed 4/4; API runtime dependency audit reported 0 vulnerabilities; web and API respond and the database reports healthy.
- Current user-facing website: `http://localhost:5173`; API health: `http://localhost:3000/api/health`.
- LAN access uses the laptop's current Wi-Fi IPv4 `10.25.46.39`, on `http://10.25.46.39:5173`; the address may change when the network reconnects.
- The frontend uses same-origin `/api` requests routed by Nginx to the API container. Compose publishes the web on `0.0.0.0:5173` and the API host port only on `127.0.0.1:3000`.
- Windows currently marks the Wi-Fi network Public and the session is not elevated. For phone access, the user must only mark a trusted network Private and add the documented local-subnet firewall rule as Administrator if the firewall blocks it.
- Pitch-content website enhancement: complete. Added localized target-user scenarios, four honest product steps, a scroll-triggered lightweight route illustration, and explicit practical safety guidance in Russian, Kazakh, and English. Docker web build and mobile/desktop browser checks passed.
- The previous temporary Cloudflare share URL is no longer active; this update was verified locally and on the LAN, not republished to the public internet.
- Do not add investor, traction, team, market-size, or financial claims without evidence. Keep safety capabilities (verification, payments, SOS) clearly marked as not implemented.
- Future production work, not included in this MVP: location-verified destination photos, real-time/direct messaging, live route guidance, identity verification, and deployment-specific security/privacy review.
- Do not add seed users or trips without explicit request. Preserve the PostgreSQL volume when restarting or rebuilding.
