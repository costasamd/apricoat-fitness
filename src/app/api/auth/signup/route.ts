// Purpose: This file handles POST endpoint for /api/auth/signup to validate inputs, prevent duplicate
// emails, create a member account, and return a confirmation message.

import { NextResponse } from "next/server";
import {
  SignUpInput,
  createMemberAccount,
  sendConfirmationEmail,
  validateSignUpInput,
} from "@/lib/auth-helpers";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignUpInput;

    // 1. Validate all incoming fields
    const validation = validateSignUpInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          message: "Please fix the highlighted errors below.",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // 2. Create the member account and profile
    const newUser = await createMemberAccount(body);

    // 3. Log confirmation message (no external email service)
    const confirmation = await sendConfirmationEmail(
      newUser.email,
      newUser.first_name
    );

    return NextResponse.json(
      {
        message: confirmation,
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_IN_USE") {
      return NextResponse.json(
        {
          message: "An account with this email already exists.",
          errors: { email: "This email is already registered. Try logging in." },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Unable to create account right now. Please try again." },
      { status: 500 }
    );
  }
}