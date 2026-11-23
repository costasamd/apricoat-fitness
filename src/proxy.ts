// Placeholder: add login and role checks here (Issue 5: role-based access control).
import { NextResponse } from "next/server"

export function proxy() {
    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/members/:path*",
        "/plans/:path*",
    ],
}
