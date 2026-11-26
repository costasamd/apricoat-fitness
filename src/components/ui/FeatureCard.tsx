type FeatureCardProps = {
    title: string
    description: string
    badge?: string
}

export default function FeatureCard({
    title,
    description,
    badge,
}: FeatureCardProps) {
    return (
        <article className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 md:p-6">
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-emerald-800">
                    {title}
                </h3>
                {badge && (
                    <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900">
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-stone-700">{description}</p>
        </article>
    )
}
