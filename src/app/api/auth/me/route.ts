// Purpose:This Protected endpoint GET /api/auth/me that returns the logged-in user
// or rejects unauthenticated requests with HTTP 401 and no data.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthenticated. Please log in to access this resource." },
      { status: 401 }
    );
  }

  return NextResponse.json({ user }, { status: 200 });
}