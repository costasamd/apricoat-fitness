import Link from "next/link"

// Placeholder logo: replace the logo later.
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

                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-6 md:flex"
                >
                    <Link href="/" className="hover:text-amber-300">
                        Home
                    </Link>
                    <Link href="/dashboard" className="hover:text-amber-300">
                        Dashboard
                    </Link>
                    <Link href="/profile" className="hover:text-amber-300">
                        Profile
                    </Link>
                    <Link href="/login" className="hover:text-amber-300">
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="inline-flex min-h-11 items-center rounded-lg bg-amber-700 px-4 py-2 font-semibold hover:bg-amber-800"
                    >
                        Sign up
                    </Link>
                </nav>
            </div>
        </header>
    )
}
