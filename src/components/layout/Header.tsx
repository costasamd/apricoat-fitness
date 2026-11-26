import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import NavLinks from "@/components/layout/NavLinks"

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

        <Suspense fallback={null}>
          <NavLinks />
        </Suspense>
      </div>
    </header>
  )
}
