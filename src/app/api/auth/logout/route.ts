// Purpose: This file Handles POST endpoint /api/auth/logout to revoke the active session and
// remove the authentication cookie.

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth-helpers";

export async function POST() {
  await destroySession();
  return NextResponse.json(
    { message: "You have been logged out securely." },
    { status: 200 }
  );
}