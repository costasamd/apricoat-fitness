import Link from "next/link"
import { Suspense } from "react"
import NavLinks from "@/components/layout/NavLinks"

// Placeholder logo: replace the circle with Damilola's logo later.
export default function Header() {
    return (
        <header className="bg-emerald-950 text-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-heading font-bold"
                >
                    <span
                        aria-hidden="true"
                        className="h-8 w-8 rounded-full bg-amber-600"
                    />
                    <span>Apricot Fitness</span>
                </Link>

                {/* usePathname() waits on pages with an unknown [id], so it needs a Suspense boundary */}
                <Suspense>
                    <NavLinks />
                </Suspense>
            </div>
        </header>
    )
}
