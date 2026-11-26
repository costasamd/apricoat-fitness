// Purpose: This file Handles POST endpoint /api/auth/login to verify credentials, start an
// authenticated session, and return a generic error if login fails.

import { NextResponse } from "next/server";
import { createSession, verifyCredentials } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    const user = await verifyCredentials(email, password);

    // This display generic error message so attackers cannot tell whether email or password failed
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}