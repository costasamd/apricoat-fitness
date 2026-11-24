import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import NavLinks from "@/components/layout/NavLinks"

<<<<<<< HEAD
=======
// Placeholder logo: replace the circle with Damilola's logo later.
>>>>>>> 7b45bc619410f51d61eeadcd72886ec1b4f3a3f8
export default function Header() {
  return (
    <header className="bg-emerald-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading font-bold"
        >
          <span className="flex items-center rounded-lg bg-white px-2 py-1">
            <Image
              src="/logo-mark.svg"
              alt=""
              width={56}
              height={44}
              priority
            />
          </span>
          <span>Apricot Fitness</span>
        </Link>

<<<<<<< HEAD
    <nav
  aria-label="Main navigation"
  className="hidden items-center gap-4 md:flex lg:gap-6"
>
  <Link href="/" className="hover:text-amber-300">
    Home
  </Link>
  <Link href="/about" className="hover:text-amber-300">
    About Us
  </Link>
  <Link href="/products" className="hover:text-amber-300">
    Product Catalogue
  </Link>
  <Link href="/dashboard" className="hover:text-amber-300">
    Dashboard
  </Link>
  <Link href="/profile" className="hover:text-amber-300">
    Profile
  </Link>
  <Link href="/contact" className="hover:text-amber-300">
    Contact Us
  </Link>
  <Link
    href="/login"
    className="inline-flex min-h-11 items-center rounded-lg bg-amber-700 px-4 py-2 font-semibold hover:bg-amber-800"
  >
    Log in / Sign up
  </Link>
   
</nav>
      </div>
    </header>
  )
}
=======
                {/* usePathname() waits on pages with an unknown [id], so it needs a Suspense boundary */}
                <Suspense>
                    <NavLinks />
                </Suspense>
            </div>
        </header>
    )
}
>>>>>>> 7b45bc619410f51d61eeadcd72886ec1b4f3a3f8
