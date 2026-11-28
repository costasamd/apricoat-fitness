import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if(!databaseUrl) {
    throw new Error('DATABASE_URL not set. Run `vercel env pull .env.local` and restart the dev server');
}

export const sql = neon(databaseUrl);


export type Role = 'member' | 'coach' | 'admin';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  status: 'active' | 'inactive';
  coachId: string | null;
};

export type UserWithPassword = User & { passwordHash: string };

export type MemberGoals = {
  userId: string;
  primaryGoal: string | null;
  fitnessLevel: FitnessLevel | null;
  daysAvailablePerWeek: number | null;
  preferredTrainingTypes: string[];
  limitations: string | null;
};

export type FitnessPlan = {
  id: string;
  memberId: string;
  createdBy: string;
  title: string;
  description: string | null;
  objectives: string;
  startDate: string | null;
  endDate: string | null;
  status: 'active' | 'archived';
};

export type Exercise = {
  position: number;
  name: string;
  sets: number | null;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number | null;
  notes: string | null;
};

export type Workout = {
  id: string;
  name: string;
  weekNumber: number;
  dayOfWeek: number | null;
  position: number;
  durationMinutes: number | null;
  instructions: string | null;
  exercises: Exercise[];
};

// ---------------------------------------------------------------------------
// Users  (Issues 3, 4, 6, 7, 8)
// ---------------------------------------------------------------------------

/** Login lookup. Case-insensitive. The only query that returns passwordHash. */
export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  const rows = (await sql`
    SELECT id, email, password_hash AS "passwordHash",
           first_name AS "firstName", last_name AS "lastName", phone,
           role, status, coach_id AS "coachId"
    FROM users
    WHERE lower(email) = lower(${email})
  `) as UserWithPassword[];
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = (await sql`
    SELECT id, email, first_name AS "firstName", last_name AS "lastName", phone,
           role, status, coach_id AS "coachId"
    FROM users
    WHERE id = ${id}
  `) as User[];
  return rows[0] ?? null;
}

/**
 * Sign-up. Always creates a member. Returns null when the email is already
 * taken (in any capitalisation), so the route can show "email already in use".
 * Hash the password BEFORE calling this.
 */
export async function createMemberAccount(input: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}): Promise<User | null> {
  const rows = (await sql`
    INSERT INTO users (email, password_hash, first_name, last_name, phone)
    VALUES (${input.email}, ${input.passwordHash}, ${input.firstName},
            ${input.lastName}, ${input.phone ?? null})
    ON CONFLICT DO NOTHING
    RETURNING id, email, first_name AS "firstName", last_name AS "lastName", phone,
              role, status, coach_id AS "coachId"
  `) as User[];
  return rows[0] ?? null;
}

/** Admin sees every member, a coach sees only their own, anyone else sees none. */
export async function listVisibleMembers(viewer: { id: string; role: Role }): Promise<User[]> {
  if (viewer.role === 'admin') {
    return (await sql`
      SELECT id, email, first_name AS "firstName", last_name AS "lastName", phone,
             role, status, coach_id AS "coachId"
      FROM users
      WHERE role = 'member'
      ORDER BY last_name, first_name
    `) as User[];
  }
  if (viewer.role === 'coach') {
    return (await sql`
      SELECT id, email, first_name AS "firstName", last_name AS "lastName", phone,
             role, status, coach_id AS "coachId"
      FROM users
      WHERE role = 'member' AND coach_id = ${viewer.id}
      ORDER BY last_name, first_name
    `) as User[];
  }
  return [];
}

/**
 * Link a member to a coach (admin only: check in the route).
 * Pass null to remove the link. The database rejects a coachId that is not a
 * coach, and this throws in that case.
 * Returns null when memberId is not a member.
 */
export async function assignCoachToMember(
  memberId: string,
  coachId: string | null,
): Promise<User | null> {
  const rows = (await sql`
    UPDATE users
    SET coach_id = ${coachId}
    WHERE id = ${memberId} AND role = 'member'
    RETURNING id, email, first_name AS "firstName", last_name AS "lastName", phone,
              role, status, coach_id AS "coachId"
  `) as User[];
  return rows[0] ?? null;
}

/**
 * Update contact details. Only the fields you pass change.
 * Limitation: a field left out or set to null is kept as it is, so this cannot
 * clear a phone number. Add a separate function if you need that.
 */
export async function updateUserProfile(
  id: string,
  changes: { firstName?: string; lastName?: string; phone?: string },
): Promise<User | null> {
  const rows = (await sql`
    UPDATE users
    SET first_name = COALESCE(${changes.firstName ?? null}, first_name),
        last_name  = COALESCE(${changes.lastName ?? null}, last_name),
        phone      = COALESCE(${changes.phone ?? null}, phone)
    WHERE id = ${id}
    RETURNING id, email, first_name AS "firstName", last_name AS "lastName", phone,
              role, status, coach_id AS "coachId"
  `) as User[];
  return rows[0] ?? null;
}

// ---------------------------------------------------------------------------
// Member goals  (Issue 9)
// ---------------------------------------------------------------------------

/** Null when the member has no profile row yet (sign-up does not create one). */
export async function getMemberGoals(userId: string): Promise<MemberGoals | null> {
  const rows = (await sql`
    SELECT user_id AS "userId", primary_goal AS "primaryGoal",
           fitness_level AS "fitnessLevel",
           days_available_per_week AS "daysAvailablePerWeek",
           preferred_training_type AS "preferredTrainingTypes",
           limitations
    FROM member_profiles
    WHERE user_id = ${userId}
  `) as MemberGoals[];
  return rows[0] ?? null;
}

/**
 * Create or replace the member's goals (the first save creates the row).
 * Every field is replaced with what you pass, so send the whole form.
 * The training types travel as JSON text, which works whatever the driver
 * does with JavaScript arrays.
 */
export async function saveMemberGoals(
  userId: string,
  goals: {
    primaryGoal?: string | null;
    fitnessLevel?: FitnessLevel | null;
    daysAvailablePerWeek?: number | null;
    preferredTrainingTypes?: string[];
    limitations?: string | null;
  },
): Promise<MemberGoals> {
  const typesJson = JSON.stringify(goals.preferredTrainingTypes ?? []);
  const rows = (await sql`
    INSERT INTO member_profiles
      (user_id, primary_goal, fitness_level, days_available_per_week,
       preferred_training_type, limitations)
    VALUES (${userId}, ${goals.primaryGoal ?? null}, ${goals.fitnessLevel ?? null},
            ${goals.daysAvailablePerWeek ?? null},
            ARRAY(SELECT jsonb_array_elements_text(${typesJson}::jsonb)),
            ${goals.limitations ?? null})
    ON CONFLICT (user_id) DO UPDATE SET
      primary_goal = EXCLUDED.primary_goal,
      fitness_level = EXCLUDED.fitness_level,
      days_available_per_week = EXCLUDED.days_available_per_week,
      preferred_training_type = EXCLUDED.preferred_training_type,
      limitations = EXCLUDED.limitations
    RETURNING user_id AS "userId", primary_goal AS "primaryGoal",
              fitness_level AS "fitnessLevel",
              days_available_per_week AS "daysAvailablePerWeek",
              preferred_training_type AS "preferredTrainingTypes",
              limitations
  `) as MemberGoals[];
  return rows[0] as MemberGoals;
}

// ---------------------------------------------------------------------------
// Fitness plans  (Issues 10, 11)
// ---------------------------------------------------------------------------

/**
 * Creates the plan row only. Workouts and exercises are added by a separate
 * function when you build the plan form.
 * Throws if memberId is not an active member or createdBy is not a coach or
 * admin (the database enforces both).
 */
export async function createFitnessPlan(input: {
  memberId: string;
  createdBy: string;
  title: string;
  objectives: string;
  description?: string | null;
  startDate?: string | null; // 'YYYY-MM-DD'
  endDate?: string | null; // 'YYYY-MM-DD'
}): Promise<FitnessPlan> {
  const rows = (await sql`
    INSERT INTO fitness_plans
      (member_id, created_by, title, description, objectives, start_date, end_date)
    VALUES (${input.memberId}, ${input.createdBy}, ${input.title},
            ${input.description ?? null}, ${input.objectives},
            ${input.startDate ?? null}, ${input.endDate ?? null})
    RETURNING id, member_id AS "memberId", created_by AS "createdBy", title,
              description, objectives, start_date::text AS "startDate",
              end_date::text AS "endDate", status
  `) as FitnessPlan[];
  return rows[0] as FitnessPlan;
}

export async function getPlanById(id: string): Promise<FitnessPlan | null> {
  const rows = (await sql`
    SELECT id, member_id AS "memberId", created_by AS "createdBy", title,
           description, objectives, start_date::text AS "startDate",
           end_date::text AS "endDate", status
    FROM fitness_plans
    WHERE id = ${id}
  `) as FitnessPlan[];
  return rows[0] ?? null;
}

/** Newest first. Archived plans are included; filter in the caller if needed. */
export async function listPlansByMemberId(memberId: string): Promise<FitnessPlan[]> {
  return (await sql`
    SELECT id, member_id AS "memberId", created_by AS "createdBy", title,
           description, objectives, start_date::text AS "startDate",
           end_date::text AS "endDate", status
    FROM fitness_plans
    WHERE member_id = ${memberId}
    ORDER BY created_at DESC
  `) as FitnessPlan[];
}

/** A plan's workouts in training order, each with its exercises. */
export async function listWorkoutsByPlanId(planId: string): Promise<Workout[]> {
  return (await sql`
    SELECT w.id, w.name,
           w.week_number AS "weekNumber", w.day_of_week AS "dayOfWeek",
           w.position, w.duration_minutes AS "durationMinutes", w.instructions,
           COALESCE(
             json_agg(
               json_build_object(
                 'position', e.position, 'name', e.name,
                 'sets', e.sets, 'reps', e.reps,
                 'durationSeconds', e.duration_seconds,
                 'restSeconds', e.rest_seconds, 'notes', e.notes
               ) ORDER BY e.position
             ) FILTER (WHERE e.id IS NOT NULL),
             '[]'::json
           ) AS exercises
    FROM workouts w
    LEFT JOIN workout_exercises e ON e.workout_id = w.id
    WHERE w.plan_id = ${planId}
    GROUP BY w.id
    ORDER BY w.week_number, w.day_of_week, w.position
  `) as Workout[];
}

