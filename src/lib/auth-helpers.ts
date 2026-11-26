// Purpose: This file Provides validation, password security, member creation, and session
// management helpers for Issues 03 (Sign-Up) and 04 (Login/Logout).

import crypto from "crypto";
import { cookies } from "next/headers";
import {
  FitnessLevel,
  PrimaryGoal,
  UserRecord,
  mockProfiles,
  mockSessions,
  mockUsers,
} from "./mock-db";
import { connection } from "next/server";

const SESSION_COOKIE_NAME = "apricot_session";

export interface SignUpInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  primary_goal?: PrimaryGoal;
  fitness_level?: FitnessLevel;
  days_per_week?: number;
}

//This Hashes a plain-text password using a random salt and scrypt
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

// This Safely compares a plain-text password against a stored salt:hash string
function comparePassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  if (derivedKey.length !== keyBuffer.length) return false;
  return crypto.timingSafeEqual(derivedKey, keyBuffer);
}

//This Hashes a raw session token before storing it in the sessions table
function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// This Validates sign-up fields and returns specific error messages per invalid field
export function validateSignUpInput(data: SignUpInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.first_name = "First name must be at least 2 characters.";
  }

  if (!data.last_name || data.last_name.trim().length < 2) {
    errors.last_name = "Last name must be at least 2 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.password || data.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (
    data.days_per_week !== undefined &&
    (data.days_per_week < 1 || data.days_per_week > 7)
  ) {
    errors.days_per_week = "Training days per week must be between 1 and 7.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

//This Creates a new user with the "member" role and an initial member_profiles row
export async function createMemberAccount(data: SignUpInput): Promise<UserRecord> {
  const normalizedEmail = data.email.trim().toLowerCase();

  // This Check for duplicate emails
  const existingUser = mockUsers.find((u) => u.email === normalizedEmail);
  if (existingUser) {
    throw new Error("EMAIL_IN_USE");
  }

  const now = new Date().toISOString();
  const newUserId = crypto.randomUUID();

  //This work during registion and make Public sign-up to always enforces role: "member"
  const newUser: UserRecord = {
    id: newUserId,
    email: normalizedEmail,
    password_hash: hashPassword(data.password),
    role: "member",
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    phone: data.phone?.trim() || null,
    coach_id: null,
    status: "active",
    created_at: now,
    updated_at: now,
  };

  mockUsers.push(newUser);

  //This Create linked member_profiles record matching the ERD
  mockProfiles.push({
    user_id: newUserId,
    primary_goal: data.primary_goal ?? "general",
    goal_notes: null,
    fitness_level: data.fitness_level ?? "beginner",
    days_per_week: data.days_per_week ?? 3,
    session_minutes: 45,
    training_preferences: null,
    updated_at: now,
  });

  return newUser;
}

// This Logs a confirmation message to the server console (Since we are not using third-party email service)
export async function sendConfirmationEmail(
  email: string,
  firstName: string
): Promise<string> {
  const confirmationNote = `Account created for ${firstName} (${email}). Ready to sign in.`;
  console.info("[Apricot Auth Confirmation]:", confirmationNote);
  return confirmationNote;
}

//This Verifies login credentials and returns the user if valid and active
export async function verifyCredentials(
  email: string,
  password: string
): Promise<UserRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = mockUsers.find((u) => u.email === normalizedEmail);

  if (!user || user.status !== "active") {
    return null;
  }

  const passwordMatches = comparePassword(password, user.password_hash);
  if (!passwordMatches) {
    return null;
  }

  return user;
}

//This Creates a session row in browser storage and sets a secure HTTP-only cookie
export async function createSession(userId: string): Promise<void> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days after expiration required log-in

  mockSessions.push({
    id: crypto.randomUUID(),
    user_id: userId,
    token_hash: tokenHash,
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    revoked_at: null,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

// This Revokes the active session in storage and clears the browser cookie
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    const tokenHash = hashToken(rawToken);
    const session = mockSessions.find(
      (s) => s.token_hash === tokenHash && s.revoked_at === null
    );
    if (session) {
      session.revoked_at = new Date().toISOString();
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

//This Reads the session cookie and returns the currently logged-in user (or null)
export async function getSessionUser(): Promise<Omit<UserRecord, "password_hash"> | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash = hashToken(rawToken);
  const session = mockSessions.find((s) => s.token_hash === tokenHash);

  if (!session || session.revoked_at !== null) {
    return null;
  }

  //Instructing Next.js 16 to wait for a live user request before checking the current time
  await connection();
  if (new Date(session.expires_at) <= new Date()) {
    return null;
  }

  const user = mockUsers.find((u) => u.id === session.user_id);
  if (!user || user.status !== "active") {
    return null;
  }

  const { password_hash, ...safeUser } = user;
  void password_hash;
  return safeUser;
}