interface StatItem {
    value: string;
    label: string;
}

interface StatsSectionProps {
    stats?: StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
    {value: '250+', label: 'Courses by best mentors' },
    { value: '1000+', label: 'Students enrolled' },
    { value: '15+', label: 'Categories' },
    { value: '2400+', label: 'Reviews' },
];

export default function StatsSection ({
    stats = DEFAULT_STATS,
}: StatsSectionProps) {
    return (
        <section className="border-y boder-[color:var(--color-border)] bg-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key = {stat.label}
                            className="flex flex-col items-center text-center"
                        >
                            <span className="text-2xl font-semibold">
                                {stat.value}
                            </span>
                            <span className="mt-1 text-sm text-[color:var(--color-muted)]">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}