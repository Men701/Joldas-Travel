import assert from "node:assert/strict";
import test from "node:test";
import { chatSchema, profileSchema, registerSchema, searchSchema, tripSchema } from "./validation";

test("registration validates email, password length, and display name", () => {
  assert.equal(registerSchema.safeParse({
    email: "traveler@example.test", password: "correct-horse-42", displayName: "Traveler",
  }).success, true);
  assert.equal(registerSchema.safeParse({
    email: "bad-email", password: "short", displayName: " ",
  }).success, false);
});

test("trip input rejects invalid dates, negative budgets, and oversized groups", () => {
  const valid = {
    destination: "Almaty", startsAt: "2027-06-01T10:00:00.000Z",
    endsAt: "2027-06-03T10:00:00.000Z", budgetPerPerson: 25000,
  };
  assert.equal(tripSchema.safeParse(valid).success, true);
  assert.equal(tripSchema.safeParse({ ...valid, endsAt: "2027-05-01T10:00:00.000Z" }).success, false);
  assert.equal(tripSchema.safeParse({ ...valid, budgetPerPerson: -1 }).success, false);
  assert.equal(tripSchema.safeParse({ ...valid, maxMembers: 101 }).success, false);
});

test("search validates budget and accepts date-range and interest filters", () => {
  assert.equal(searchSchema.safeParse({
    destination: "Almaty", dateFrom: "2027-06-01T00:00:00.000Z",
    interests: "hiking,nature", budgetMax: "50000",
  }).success, true);
  assert.equal(searchSchema.safeParse({ budgetMax: "-1" }).success, false);
  assert.equal(searchSchema.safeParse({
    dateFrom: "2027-06-05T00:00:00.000Z",
    dateTo: "2027-06-01T00:00:00.000Z",
  }).success, false);
});

test("profile and chat reject empty and excessive content", () => {
  assert.equal(profileSchema.safeParse({ interests: ["hiking"] }).success, true);
  assert.equal(profileSchema.safeParse({}).success, false);
  assert.equal(profileSchema.safeParse({ budgetMin: 70000, budgetMax: 50000 }).success, false);
  assert.equal(chatSchema.safeParse({ content: "  " }).success, false);
  assert.equal(chatSchema.safeParse({ content: "x".repeat(2001) }).success, false);
});
