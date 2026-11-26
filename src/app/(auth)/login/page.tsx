// Combined log in / sign up page (replaces the separate login and signup placeholders).

import { Suspense } from "react"
import AuthPanel from "@/components/features/auth/AuthPanel"

export default function LoginPage() {
  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={null}>
        <AuthPanel />
      </Suspense>
    </main>
  )
}