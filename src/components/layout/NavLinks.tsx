"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/login", label: "Log in" },
]

export default function NavLinks() {
    const pathname = usePathname()

    return (
        <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 md:flex"
        >
            {links.map((link) => {
                const isActive =
                    link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href)

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`hover:text-amber-300 ${isActive ? "font-semibold text-amber-300 underline underline-offset-4" : ""}`}
                    >
                        {link.label}
                    </Link>
                )
            })}
            <Link
                href="/signup"
                className="inline-flex min-h-11 items-center rounded-lg bg-amber-700 px-4 py-2 font-semibold hover:bg-amber-800"
            >
                Sign up
            </Link>
        </nav>
    )
}
