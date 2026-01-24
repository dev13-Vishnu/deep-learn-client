export default function RecommendedCoursesSection() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">
        Recommended for you
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-md border bg-white p-4">
          <p className="text-sm font-medium">
            React for Beginners
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            Based on your interests
          </p>
        </div>

        <div className="rounded-md border bg-white p-4">
          <p className="text-sm font-medium">
            Node.js Masterclass
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            Popular among learners
          </p>
        </div>
      </div>
    </section>
  );
}
