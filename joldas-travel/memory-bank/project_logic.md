# Joldas project logic

- Local Docker Compose MVP: React/Vite frontend served as static assets by Nginx, Express/Prisma API, and PostgreSQL.
- The frontend supports Russian, Kazakh, and English. Trip listings, group membership, itinerary, shared expense estimates, and member-only group chat use the API.
- PostgreSQL migrations create schema only; the database intentionally has no demo accounts or trips.
- OpenStreetMap is an online planning reference, not live navigation or a guaranteed route. The app does not claim ISO/IEC certification or production readiness.
- The landing page uses a lightweight scroll-triggered SVG route illustration rather than a WebGL scene; honor reduced-motion preferences and do not imply illustrative routes are verified navigation.
- Audience examples are scenarios, not measured market data. The MVP does not provide identity verification, payments, SOS, or emergency monitoring; communicate those limits plainly.
- Keep secrets in the ignored local `.env`; do not store credentials in project files or memory notes.
