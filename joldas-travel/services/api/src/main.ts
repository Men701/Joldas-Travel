import bcrypt from "bcryptjs";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  chatSchema, expenseSchema, itinerarySchema, loginSchema, profileSchema,
  registerSchema, searchSchema, tripSchema,
} from "./validation";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT ?? 3000);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be set to at least 32 characters");
}

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "32kb" }));

interface AuthRequest extends Request {
  userId?: string;
}

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const [scheme, token] = (req.header("authorization") ?? "").split(" ");
  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const payload = jwt.verify(token, jwtSecret!) as jwt.JwtPayload;
    if (typeof payload.sub !== "string") throw new Error("Invalid subject");
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

async function requireTripMember(tripId: string, userId: string, res: Response) {
  const membership = await prisma.tripMember.findUnique({
    where: { tripId_userId: { tripId, userId } },
    select: { id: true },
  });
  if (membership) return true;
  const exists = await prisma.trip.findUnique({ where: { id: tripId }, select: { id: true } });
  res.status(exists ? 403 : 404).json({ error: exists ? "Trip membership required" : "Trip not found" });
  return false;
}

app.get("/api/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "ok" });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        profile: { create: { displayName: input.displayName } },
      },
      select: { id: true, email: true },
    });
    const token = jwt.sign({ sub: user.id }, jwtSecret!, { expiresIn: "2h" });
    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid registration details", issues: error.issues });
      return;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = jwt.sign({ sub: user.id }, jwtSecret!, { expiresIn: "2h" });
    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid login details" });
      return;
    }
    next(error);
  }
});

app.get("/api/profile", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId! } });
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

app.put("/api/profile", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const input = profileSchema.parse(req.body);
    const current = await prisma.profile.findUnique({ where: { userId: req.userId! } });
    const minBudget = Object.prototype.hasOwnProperty.call(input, "budgetMin") ? input.budgetMin : current?.budgetMin;
    const maxBudget = Object.prototype.hasOwnProperty.call(input, "budgetMax") ? input.budgetMax : current?.budgetMax;
    if (minBudget != null && maxBudget != null && minBudget > maxBudget) {
      res.status(400).json({ error: "Minimum budget cannot exceed maximum budget" });
      return;
    }
    const profile = await prisma.profile.upsert({
      where: { userId: req.userId! },
      create: { userId: req.userId!, displayName: input.displayName ?? "Traveler", ...input },
      update: input,
    });
    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid profile details", issues: error.issues });
      return;
    }
    next(error);
  }
});

app.get("/api/trips", async (req, res, next) => {
  try {
    const input = searchSchema.parse(req.query);
    const interests = input.interests?.split(",").map((v) => v.trim()).filter(Boolean) ?? [];
    const trips = await prisma.trip.findMany({
      where: {
        ...(input.destination ? { destination: { contains: input.destination, mode: "insensitive" } } : {}),
        ...(input.budgetMax !== undefined ? { budgetPerPerson: { lte: input.budgetMax } } : {}),
        ...(interests.length ? { interests: { hasSome: interests } } : {}),
        ...(input.dateFrom ? { endsAt: { gte: new Date(input.dateFrom) } } : {}),
        ...(input.dateTo ? { startsAt: { lte: new Date(input.dateTo) } } : {}),
      },
      include: {
        host: { select: { profile: { select: { displayName: true } } } },
        _count: { select: { members: true } },
      },
      orderBy: { startsAt: "asc" },
      take: 100,
    });
    res.json(trips.map((trip) => ({ ...trip, memberCount: trip._count.members, _count: undefined })));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid trip filters", issues: error.issues });
      return;
    }
    next(error);
  }
});

app.post("/api/trips", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const input = tripSchema.parse(req.body);
    const trip = await prisma.trip.create({
      data: {
        ...input,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        hostId: req.userId!,
        members: { create: { userId: req.userId! } },
      },
      include: { _count: { select: { members: true } } },
    });
    res.status(201).json({ ...trip, memberCount: trip._count.members, _count: undefined });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid trip details", issues: error.issues });
      return;
    }
    next(error);
  }
});

app.get("/api/trips/:tripId", async (req, res, next) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.tripId },
      include: {
        host: { select: { profile: { select: { displayName: true } } } },
        _count: { select: { members: true } },
      },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }
    res.json({ ...trip, memberCount: trip._count.members, _count: undefined });
  } catch (error) {
    next(error);
  }
});

app.post("/api/trips/:tripId/join", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const tripId = req.params.tripId;
    const result = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { _count: { select: { members: true } } },
      });
      if (!trip) return { status: 404 as const };
      const existing = await tx.tripMember.findUnique({
        where: { tripId_userId: { tripId, userId: req.userId! } },
      });
      if (existing) return { status: 200 as const, count: trip._count.members };
      if (trip._count.members >= trip.maxMembers) return { status: 409 as const };
      await tx.tripMember.create({ data: { tripId, userId: req.userId! } });
      return { status: 201 as const, count: trip._count.members + 1 };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    if (result.status === 404) res.status(404).json({ error: "Trip not found" });
    else if (result.status === 409) res.status(409).json({ error: "Trip group is full" });
    else res.status(result.status).json({ joined: true, memberCount: result.count });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      res.status(409).json({ error: "Group membership changed concurrently; please retry" });
      return;
    }
    next(error);
  }
});

app.get("/api/trips/:tripId/itinerary", authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!(await requireTripMember(req.params.tripId, req.userId!, res))) return;
    const items = await prisma.itineraryItem.findMany({
      where: { tripId: req.params.tripId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

app.post("/api/trips/:tripId/itinerary", authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!(await requireTripMember(req.params.tripId, req.userId!, res))) return;
    const input = itinerarySchema.parse(req.body);
    const item = await prisma.itineraryItem.create({
      data: {
        tripId: req.params.tripId,
        title: input.title,
        details: input.details ?? "",
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid itinerary item", issues: error.issues });
      return;
    }
    next(error);
  }
});

app.get("/api/trips/:tripId/expenses", authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!(await requireTripMember(req.params.tripId, req.userId!, res))) return;
    const expenses = await prisma.tripExpense.findMany({
      where: { tripId: req.params.tripId },
      orderBy: { createdAt: "asc" },
    });
    res.json({ items: expenses, total: expenses.reduce((sum, item) => sum + item.amount, 0) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/trips/:tripId/expenses", authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!(await requireTripMember(req.params.tripId, req.userId!, res))) return;
    const input = expenseSchema.parse(req.body);
    const expense = await prisma.tripExpense.create({
      data: { tripId: req.params.tripId, title: input.title, amount: input.amount, notes: input.notes ?? "" },
    });
    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid expense", issues: error.issues });
      return;
    }
    next(error);
  }
});

app.put("/api/trips/:tripId/expenses/:expenseId", authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!(await requireTripMember(req.params.tripId, req.userId!, res))) return;
    const input = expenseSchema.parse(req.body);
    const result = await prisma.tripExpense.updateMany({
      where: { id: req.params.expenseId, tripId: req.params.tripId },
      data: input,
    });
    if (result.count === 0) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    res.json(await prisma.tripExpense.findUnique({ where: { id: req.params.expenseId } }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid expense", issues: error.issues });
      return;
    }
    next(error);
  }
});

app.get("/api/trips/:tripId/chat", authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!(await requireTripMember(req.params.tripId, req.userId!, res))) return;
    const messages = await prisma.chatMessage.findMany({
      where: { tripId: req.params.tripId },
      include: { user: { select: { profile: { select: { displayName: true } } } } },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

app.post("/api/trips/:tripId/chat", authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!(await requireTripMember(req.params.tripId, req.userId!, res))) return;
    const input = chatSchema.parse(req.body);
    const message = await prisma.chatMessage.create({
      data: { tripId: req.params.tripId, userId: req.userId!, content: input.content },
      include: { user: { select: { profile: { select: { displayName: true } } } } },
    });
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid message", issues: error.issues });
      return;
    }
    next(error);
  }
});

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Request failed", error instanceof Error ? error.message : "unknown error");
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(port, "0.0.0.0", () => console.log(`Joldas API listening on ${port}`));
async function shutdown() {
  server.close();
  await prisma.$disconnect();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
