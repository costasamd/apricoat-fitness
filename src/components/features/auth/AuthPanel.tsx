// Purpose: Updated this Unified authentication card by preserving the team's tab layout and URL mode
// switching while rendering LoginForm and SignUpForm inside each tab.

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

type Mode = "login" | "signup";

export default function AuthPanel() {
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    params.get("mode") === "signup" ? "signup" : "login"
  );
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  // This Switches between Log in and Sign up tabs and updates the browser URL cleanly
  function switchMode(next: Mode) {
    setMode(next);
    if (next === "signup") {
      setConfirmationMessage(null);
    }
    window.history.replaceState(
      null,
      "",
      next === "signup" ? "/login?mode=signup" : "/login"
    );
  }

  // This Handles successful sign-up by displaying confirmation and switching to the Log in tab
  function handleSignUpSuccess(message: string) {
    setConfirmationMessage(message);
    switchMode("login");
  }

  const isSignup = mode === "signup";

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

      {isSignup ? (
        <SignUpForm onSuccessSwitchToLogin={handleSignUpSuccess} />
      ) : (
        <LoginForm confirmationBanner={confirmationMessage} />
      )}

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
  );
}


