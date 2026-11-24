export default async function Footer() {
    "use cache"
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-auto bg-emerald-950 text-stone-300">
            <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6 lg:px-8">
                <p className="text-sm">
                    © {currentYear} Apricot Fitness Center
                </p>
            </div>
        </footer>
    )
}
