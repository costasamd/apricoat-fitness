// Purpose: The User login form that authenticates credentials via POST /api/auth/login,
// shows one generic error on failure, and redirects logged-in users to /dashboard.

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  confirmationBanner?: string | null;
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30";

const labelClass = "text-sm font-medium text-stone-700";

export default function LoginForm({ confirmationBanner }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Submits login credentials and routes authenticated users to /dashboard
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form) as Record<string, string>;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          body?.message ?? "Invalid email or password. Please try again."
        );
        return;
      }

      // Redirect all roles to /dashboard where role-based content renders
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {confirmationBanner && (
        <div
          role="status"
          className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900"
        >
          {confirmationBanner}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className={labelClass}>
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="login-password" className={labelClass}>
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 w-full rounded-lg bg-amber-700 px-4 py-2 font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
      >
        {loading ? "Please wait..." : "Log in"}
      </button>
    </form>
  );
}