import Link from "next/link"
import FeatureCard from "@/components/ui/FeatureCard"
import Image from "next/image"

export default function HomePage() {
    return (
        <main className="flex-1 bg-stone-50">
            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                <div className="grid items-center gap-8 md:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <p className="text-sm font-semibold tracking-wide text-amber-900 uppercase">
                            All-in-one fitness platform
                        </p>
                        <h1 className="text-4xl font-extrabold text-emerald-950 md:text-5xl">
                            Coaching, Personalized Plans, and Trusted Fitness
                            Gear.
                        </h1>
                        <p className="text-lg text-stone-700">
                            Get a fitness plan built for your goals, follow it
                            with help from a certified coach, and track your
                            progress in one account.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/login"
                                className="inline-flex min-h-11 items-center rounded-lg bg-amber-800 px-6 py-2 font-semibold text-white hover:bg-amber-900"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex min-h-11 items-center rounded-lg border-2 border-emerald-950 px-6 py-2 font-semibold text-emerald-950 hover:bg-emerald-50"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-64 overflow-hidden rounded-xl md:h-96">
                        <Image
                            src="/images/hero-gym.jpg"
                            alt="Dumbbells, running shoes, and an exercise ball on a wooden bench"
                            fill
                            preload
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
            <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
                <h2 className="text-2xl font-bold text-emerald-950 md:text-3xl">
                    What we offer
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <FeatureCard
                        title="Professional Coaching"
                        description="Certified coaches build routines around your goals and leave feedback on your progress."
                    />
                    <FeatureCard
                        title="Structured Fitness Plans"
                        description="Follow a clear weekly schedule with workouts, sets, and reps laid out step by step."
                    />
                    <FeatureCard
                        title="Fitness Gear Store"
                        description="Shop equipment our coaches trust, right from your account."
                        badge="Coming soon"
                    />
                </div>
            </section>
        </main>
    )
}
