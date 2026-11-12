# Joldas API (local MVP)

Express + TypeScript + Prisma/PostgreSQL. Set `DATABASE_URL` and a private random `JWT_SECRET` of at least 32 characters. Do not commit `.env` or use development secrets outside a local environment.

## Database lifecycle

The Prisma schema is in `prisma/schema.prisma`; `prisma/migrations` contains schema-only migrations. There is intentionally no seed script or fixture data. In Compose, apply the schema with `docker compose exec api npm run db:deploy`. For local development, generate the client then apply migrations with `npm run db:generate` and `npm run db:migrate -- --name initial_mvp`.

## Routes

- `GET /api/health` — API and PostgreSQL readiness.
- `POST /api/auth/register` — `{ email, password, displayName }`; password is hashed with bcrypt; returns bearer token.
- `POST /api/auth/login` — `{ email, password }`.
- `GET /api/profile`, `PUT /api/profile` — bearer token; profile fields include city, interests, destination preferences and budget range.
- `GET /api/trips?destination=&dateFrom=&dateTo=&interests=a,b&budgetMax=` — public discovery filters; dates are ISO-8601.
- `GET /api/trips/:tripId` — public trip detail.
- `POST /api/trips` — authenticated trip/group creation; creator joins as host.
- `POST /api/trips/:tripId/join` — authenticated, capacity-limited, idempotent membership.
- `GET|POST /api/trips/:tripId/itinerary` — authenticated members only.
- `GET|POST /api/trips/:tripId/expenses`, `PUT /api/trips/:tripId/expenses/:expenseId` — authenticated members only.
- `GET|POST /api/trips/:tripId/chat` — authenticated members only; latest 100 persisted messages.

Inputs are validated and errors avoid returning internal details. JWTs expire after two hours. Local UI keeps the token in session storage. This API has not been designed as a publicly deployed service.
