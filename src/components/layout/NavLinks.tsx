// Purpose: Updated this component to renders the main desktop navigation links and switches between the
// "Log in / Sign up" button and the logged-in user's "Log out" button.

"use client"

import { useEffect, useState } from "react";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";

interface SessionUser {
  id: string;
  first_name: string;
  role: "member" | "coach" | "admin";
}

const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Product Catalogue" },
    { href: "/contact", label: "Contact Us" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
]

export default function NavLinks() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    // Checks the current session status whenever the route changes
    useEffect(() => {
        let isMounted = true;

        async function fetchSessionUser() {
            try {
                const res = await fetch("/api/auth/me", { cache: "no-store" });
                if (!res.ok) {
                if (isMounted) setUser(null);
                return;
                }
                const data = await res.json();
                if (isMounted) setUser(data.user ?? null);
            } catch {
                if (isMounted) setUser(null);
            }
        }

        fetchSessionUser();
        return () => {
            isMounted = false;
        };
    }, [pathname]);

  // Ends the user's authenticated session via POST /api/auth/logout
    async function handleLogout() {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/login");
            router.refresh();
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <nav
            aria-label="Main navigation"
            className="hidden items-center gap-4 md:flex lg:gap-6"
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
                );
            })}
           
            {/* Switching between "Log in / Sign up" button and the logged-in user's "Log out" button. */}
            {!user ? (
                <Link
                    href="/login"
                    aria-current={pathname.startsWith("/login") ? "page" : undefined}
                    className="inline-flex min-h-11 items-center rounded-lg bg-amber-700 px-4 py-2 font-semibold text-white hover:bg-amber-800"
                >
                    Log in / Sign up
                </Link>
            ) : (
                <div className="flex items-center gap-3">
                    <Link
                        href={user.role === "admin" ? "/admin" : "/profile"}
                        className="text-sm font-medium text-amber-300 hover:underline"
                    >
                        Hi, {user.first_name}
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="inline-flex min-h-11 items-center rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
                    >
                        {loggingOut ? "Logging out..." : "Log out"}
                    </button>
                </div>
            )}
        </nav>
    );
}
