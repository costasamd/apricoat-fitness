"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type Mode = "login" | "signup"

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"

const labelClass = "text-sm font-medium text-stone-700"

export default function AuthPanel() {
  const router = useRouter()
  const params = useSearchParams()
  const [mode, setMode] = useState<Mode>(
    params.get("mode") === "signup" ? "signup" : "login"
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    window.history.replaceState(
      null,
      "",
      next === "signup" ? "/login?mode=signup" : "/login"
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form) as Record<string, string>

    if (mode === "signup" && data.password !== data.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    delete data.confirmPassword

    setLoading(true)
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(
          body?.error ?? body?.message ?? "Something went wrong. Please try again."
        )
        return
      }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isSignup = mode === "signup"

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div
        role="tablist"
        aria-label="Account"
        className="grid grid-cols-2 gap-1 rounded-lg bg-stone-100 p-1"
      >
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              mode === m
                ? "bg-emerald-950 text-white"
                : "text-stone-600 hover:text-emerald-950"
            }`}
          >
            {m === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>

      <h1 className="mt-6 text-2xl font-bold text-emerald-950">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {isSignup && (
          <div>
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className={inputClass}
          />
        </div>

        {isSignup && (
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
          </div>
        )}

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
          {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-stone-600">
        {isSignup ? "Already have an account?" : "New to Apricot Fitness?"}{" "}
        <button
          type="button"
          onClick={() => switchMode(isSignup ? "login" : "signup")}
          className="font-semibold text-emerald-900 underline hover:text-amber-700"
        >
          {isSignup ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
  )
}
