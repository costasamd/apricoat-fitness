// Purpose: I defines TypeScript types matching the Apricot Fitness ERD tables
// and provides temporary in-memory storage until Vercel PostgreSQL is connected.

import crypto from "crypto";

export type UserRole = "member" | "coach" | "admin";
export type UserStatus = "active" | "inactive";
export type PrimaryGoal = "weight_loss" | "muscle_gain" | "endurance" | "general";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone: string | null;
  coach_id: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface MemberProfileRecord {
  user_id: string;
  primary_goal: PrimaryGoal | null;
  goal_notes: string | null;
  fitness_level: FitnessLevel | null;
  days_per_week: number | null;
  session_minutes: number | null;
  training_preferences: string | null;
  updated_at: string;
}

export interface SessionRecord {
  id: string;
  user_id: string;
  token_hash: string;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
}

// Helper function to hash seed passwords safely using Node's built-in crypto module
function hashSeedPassword(plainPassword: string): string {
  const salt = "apricot_seed_salt";
  const hash = crypto.scryptSync(plainPassword, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Temporary in-memory tables matching the Phase 1 ERD
const globalForDb = globalThis as unknown as {
  mockUsers?: UserRecord[];
  mockProfiles?: MemberProfileRecord[];
  mockSessions?: SessionRecord[];
};

// Pre-seeded demo accounts (Password for all three: "Apricot123!")
export const mockUsers: UserRecord[] =
  globalForDb.mockUsers ??
  [
    {
      id: "11111111-1111-1111-1111-111111111111",
      email: "member@apricotfit.com",
      password_hash: hashSeedPassword("Apricot123!"),
      role: "member",
      first_name: "Alex",
      last_name: "Morgan",
      phone: "555-0101",
      coach_id: "22222222-2222-2222-2222-222222222222",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      email: "coach@apricotfit.com",
      password_hash: hashSeedPassword("Apricot123!"),
      role: "coach",
      first_name: "Sarah",
      last_name: "Keller",
      phone: "555-0102",
      coach_id: null,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      email: "admin@apricotfit.com",
      password_hash: hashSeedPassword("Apricot123!"),
      role: "admin",
      first_name: "David",
      last_name: "Chen",
      phone: "555-0103",
      coach_id: null,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

export const mockProfiles: MemberProfileRecord[] =
  globalForDb.mockProfiles ??
  [
    {
      user_id: "11111111-1111-1111-1111-111111111111",
      primary_goal: "muscle_gain",
      goal_notes: "Build upper body strength and stamina.",
      fitness_level: "beginner",
      days_per_week: 4,
      session_minutes: 45,
      training_preferences: "Kettlebells and bodyweight workouts",
      updated_at: new Date().toISOString(),
    },
  ];

export const mockSessions: SessionRecord[] = globalForDb.mockSessions ?? [];

if (process.env.NODE_ENV !== "production") {
  globalForDb.mockUsers = mockUsers;
  globalForDb.mockProfiles = mockProfiles;
  globalForDb.mockSessions = mockSessions;
}