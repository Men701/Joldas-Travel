import { z } from "zod";

const interestsSchema = z.array(z.string().trim().min(1).max(40)).max(20);
export const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(128),
  displayName: z.string().trim().min(1).max(80),
});
export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});
export const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(80).optional(),
  homeCity: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(500).optional(),
  interests: interestsSchema.optional(),
  preferredDestinations: z.array(z.string().trim().min(1).max(100)).max(20).optional(),
  budgetMin: z.number().int().min(0).max(100_000_000).nullable().optional(),
  budgetMax: z.number().int().min(0).max(100_000_000).nullable().optional(),
}).refine((value) => Object.keys(value).length > 0, "Provide at least one profile field")
  .refine((value) => value.budgetMin == null || value.budgetMax == null || value.budgetMin <= value.budgetMax, {
    message: "Minimum budget cannot exceed maximum budget",
    path: ["budgetMin"],
  });
export const tripSchema = z.object({
  destination: z.string().trim().min(1).max(100),
  region: z.string().trim().max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  budgetPerPerson: z.number().int().min(0).max(100_000_000),
  maxMembers: z.number().int().min(2).max(100).default(8),
  interests: interestsSchema.default([]),
}).refine((value) => new Date(value.endsAt) > new Date(value.startsAt), {
  message: "Trip end must be after its start",
  path: ["endsAt"],
});
export const searchSchema = z.object({
  destination: z.string().trim().max(100).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  interests: z.string().max(500).optional(),
  budgetMax: z.coerce.number().int().min(0).max(100_000_000).optional(),
}).refine((value) => !value.dateFrom || !value.dateTo || new Date(value.dateFrom) <= new Date(value.dateTo), {
  message: "Search start must be on or before search end",
  path: ["dateTo"],
});
export const itinerarySchema = z.object({
  title: z.string().trim().min(1).max(160),
  details: z.string().trim().max(1000).optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
});
export const expenseSchema = z.object({
  title: z.string().trim().min(1).max(120),
  amount: z.number().int().min(0).max(100_000_000),
  notes: z.string().trim().max(500).optional(),
});
export const chatSchema = z.object({ content: z.string().trim().min(1).max(2000) });
