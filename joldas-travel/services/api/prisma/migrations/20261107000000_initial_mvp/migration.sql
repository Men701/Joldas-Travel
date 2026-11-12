CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Profile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "homeCity" TEXT,
  "bio" TEXT,
  "interests" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "budgetMin" INTEGER,
  "budgetMax" INTEGER,
  "preferredDestinations" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Profile_budgetMin_nonnegative" CHECK ("budgetMin" IS NULL OR "budgetMin" >= 0),
  CONSTRAINT "Profile_budgetMax_nonnegative" CHECK ("budgetMax" IS NULL OR "budgetMax" >= 0)
);
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Trip" (
  "id" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "region" TEXT,
  "description" TEXT NOT NULL DEFAULT '',
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "budgetPerPerson" INTEGER NOT NULL,
  "maxMembers" INTEGER NOT NULL DEFAULT 8,
  "interests" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "hostId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Trip_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Trip_dates_ordered" CHECK ("endsAt" > "startsAt"),
  CONSTRAINT "Trip_budget_nonnegative" CHECK ("budgetPerPerson" >= 0),
  CONSTRAINT "Trip_maxMembers_valid" CHECK ("maxMembers" BETWEEN 2 AND 100)
);
CREATE INDEX "Trip_destination_startsAt_idx" ON "Trip"("destination", "startsAt");
CREATE INDEX "Trip_startsAt_endsAt_idx" ON "Trip"("startsAt", "endsAt");
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_hostId_fkey"
  FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "TripMember" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TripMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TripMember_tripId_userId_key" ON "TripMember"("tripId", "userId");
CREATE INDEX "TripMember_userId_idx" ON "TripMember"("userId");
ALTER TABLE "TripMember" ADD CONSTRAINT "TripMember_tripId_fkey"
  FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripMember" ADD CONSTRAINT "TripMember_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ItineraryItem" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "details" TEXT NOT NULL DEFAULT '',
  "scheduledAt" TIMESTAMP(3),
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ItineraryItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ItineraryItem_tripId_sortOrder_idx" ON "ItineraryItem"("tripId", "sortOrder");
ALTER TABLE "ItineraryItem" ADD CONSTRAINT "ItineraryItem_tripId_fkey"
  FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "TripExpense" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "notes" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TripExpense_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TripExpense_amount_nonnegative" CHECK ("amount" >= 0)
);
CREATE INDEX "TripExpense_tripId_idx" ON "TripExpense"("tripId");
ALTER TABLE "TripExpense" ADD CONSTRAINT "TripExpense_tripId_fkey"
  FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ChatMessage" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ChatMessage_tripId_createdAt_idx" ON "ChatMessage"("tripId", "createdAt");
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_tripId_fkey"
  FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
