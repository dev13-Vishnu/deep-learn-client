export default function ContinueLearningSection() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">
        Continue learning
      </h2>

      <div className="rounded-md border border-[color:var(--color-border)] bg-white p-5">
        <p className="text-sm">
          You haven’t started any courses yet.
        </p>
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          Enroll in a course to begin tracking your progress.
        </p>
      </div>
    </section>
  );
}
