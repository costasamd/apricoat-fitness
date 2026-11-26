// ============================================================================
// File: app/(dashboard)/dashboard/page.tsx
// Purview Note: Authentication, session verification, and role-based access
// control (RBAC) for this route are implemented and maintained as part of the
// Auth & Membership assignment (Issues #03 & #04).
// UI/Content Team Note: Please feel free to build and expand the role-specific widget cards
// below while keeping the getSessionUser() security guard at the top intact.
// ============================================================================

import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-helpers";
import { mockProfiles } from "@/lib/mock-db";

// Async server component that checks the user's session and renders role-specific cards
async function DashboardContent() {
  // 1. Zero-Trust Server Guard: Block unauthenticated visitors immediately
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Load member profile preferences if the logged-in user is a member
  const memberProfile =
    user.role === "member"
      ? mockProfiles.find((profile) => profile.user_id === user.id)
      : null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      {/* Authenticated Role Banner */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-emerald-950 p-6 text-white shadow-sm md:p-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Apricot Fitness Center • Protected Workspace
          </span>
          <h1 className="mt-1 font-heading text-2xl font-extrabold md:text-3xl">
            Welcome back, {user.first_name} {user.last_name}
          </h1>
          <p className="mt-1 text-sm text-emerald-200">
            Signed in as <span className="font-medium text-white">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-amber-600 px-3.5 py-1 text-xs font-bold uppercase text-white">
            Role: {user.role}
          </span>
          <Link
            href={user.role === "member" ? "/profile" : "/members"}
            className="rounded-lg border border-emerald-700 bg-emerald-900 px-4 py-2 text-xs font-semibold text-amber-300 transition hover:bg-emerald-800"
          >
            {user.role === "member" ? "Manage Profile" : "View Member Roster"}
          </Link>
        </div>
      </section>

      {/* Role-Based Dashboard Content (This Structured for UI/Content Team to Expand the build) */}
      {user.role === "member" && (
        <section className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-emerald-950">
              My Fitness Plan
            </h2>
            <p className="text-sm text-stone-600">
              Goal:{" "}
              <span className="font-semibold capitalize text-emerald-950">
                {memberProfile?.primary_goal?.replace("_", " ") ?? "General Wellness"}
              </span>
            </p>
            <p className="text-xs text-stone-500">
              Schedule: {memberProfile?.days_per_week ?? 3} days/week •{" "}
              {memberProfile?.session_minutes ?? 45} mins/session
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-emerald-950">
              Fitness Progress
            </h2>
            <p className="text-sm text-stone-600">
              Current Level:{" "}
              <span className="font-semibold capitalize text-emerald-950">
                {memberProfile?.fitness_level ?? "Beginner"}
              </span>
            </p>
            <p className="text-xs text-stone-500">
              Workout check-ins and weekly charts will render here.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-emerald-950">
              Gear &amp; Orders
            </h2>
            <p className="text-sm text-stone-600">
              Browse authentic fitness gear or review past orders.
            </p>
            <Link
              href="/products"
              className="inline-block pt-1 text-xs font-semibold text-amber-700 hover:underline"
            >
              Visit Product Catalogue &rarr;
            </Link>
          </div>
        </section>
      )}

      {user.role === "coach" && (
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-emerald-950">
              Coach Workspace: Assigned Members
            </h2>
            <p className="text-sm text-stone-600">
              View active members assigned to your coaching roster and review their fitness goals.
            </p>
            <Link
              href="/members"
              className="inline-block text-xs font-semibold text-amber-700 hover:underline"
            >
              Open Member Roster &rarr;
            </Link>
          </div>

          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-emerald-950">
              Training Plan Builder
            </h2>
            <p className="text-sm text-stone-600">
              Create, update, and assign structured workout plans for your members.
            </p>
            <Link
              href="/plans/new"
              className="inline-block text-xs font-semibold text-amber-700 hover:underline"
            >
              + Create New Fitness Plan &rarr;
            </Link>
          </div>
        </section>
      )}

      {user.role === "admin" && (
        <section className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-heading text-lg font-bold text-emerald-950">
            Administrator Access Active
          </h2>
          <p className="text-sm text-stone-700">
            You are signed in with elevated administrative permissions. Manage member accounts, coach assignments, and training plans below.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/members"
              className="inline-flex min-h-11 items-center rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
            >
              Manage Members
            </Link>
            <Link
              href="/plans/new"
              className="inline-flex min-h-11 items-center rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
            >
              + Create Fitness Plan
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

// Outer page wrapper providing a Suspense boundary required by Next.js 16 Cache Components
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm text-stone-600">
          Loading your dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}