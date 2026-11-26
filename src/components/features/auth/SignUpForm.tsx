// Purpose: Member registration form matching the users and member_profiles ERD tables,
// displaying per-field validation errors and switching to the Login tab on success.

"use client";

import { FormEvent, useState } from "react";

interface SignUpFormProps {
  onSuccessSwitchToLogin: (confirmationText: string) => void;
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30";

const labelClass = "text-sm font-medium text-stone-700";

export default function SignUpForm({
  onSuccessSwitchToLogin,
}: SignUpFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validates matching passwords and submits member registration to POST /api/auth/signup
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const first_name = String(form.get("first_name") ?? "");
    const last_name = String(form.get("last_name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const primary_goal = String(form.get("primary_goal") ?? "general");
    const fitness_level = String(form.get("fitness_level") ?? "beginner");

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          primary_goal,
          fitness_level,
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        if (body?.errors) {
          setFieldErrors(body.errors);
        }
        setGeneralError(
          body?.message ?? "Please correct the highlighted fields."
        );
        return;
      }

      onSuccessSwitchToLogin(
        body?.message ?? "Account created! Please log in with your new credentials."
      );
    } catch {
      setGeneralError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className={labelClass}>
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            autoComplete="given-name"
            className={inputClass}
          />
          {fieldErrors.first_name && (
            <p role="alert" className="mt-1 text-xs text-red-700">
              {fieldErrors.first_name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className={labelClass}>
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            autoComplete="family-name"
            className={inputClass}
          />
          {fieldErrors.last_name && (
            <p role="alert" className="mt-1 text-xs text-red-700">
              {fieldErrors.last_name}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className={labelClass}>
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
        {fieldErrors.email && (
          <p role="alert" className="mt-1 text-xs text-red-700">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="primary_goal" className={labelClass}>
            Primary fitness goal
          </label>
          <select
            id="primary_goal"
            name="primary_goal"
            defaultValue="general"
            className={`${inputClass} bg-white`}
          >
            <option value="general">General Wellness</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="endurance">Endurance</option>
          </select>
        </div>

        <div>
          <label htmlFor="fitness_level" className={labelClass}>
            Fitness level
          </label>
          <select
            id="fitness_level"
            name="fitness_level"
            defaultValue="beginner"
            className={`${inputClass} bg-white`}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="signup-password" className={labelClass}>
          Password (minimum 8 characters)
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        {fieldErrors.password && (
          <p role="alert" className="mt-1 text-xs text-red-700">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        {fieldErrors.confirmPassword && (
          <p role="alert" className="mt-1 text-xs text-red-700">
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      {generalError && (
        <p role="alert" className="text-sm text-red-700">
          {generalError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 w-full rounded-lg bg-amber-700 px-4 py-2 font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
      >
        {loading ? "Please wait..." : "Create account"}
      </button>
    </form>
  );
}