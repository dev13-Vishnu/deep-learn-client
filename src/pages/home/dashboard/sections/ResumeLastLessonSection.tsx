interface LastLesson {
  courseTitle: string;
  lessonTitle: string;
  progress: number;
}

const MOCK_LAST_LESSON: LastLesson | null = {
  courseTitle: 'React for Beginners',
  lessonTitle: 'Understanding Components',
  progress: 45,
};

// Set to `null` later to test empty state

export default function ResumeLastLessonSection() {
  if (!MOCK_LAST_LESSON) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">
        Resume where you left off
      </h2>

      <div className="rounded-md border border-[color:var(--color-border)] bg-white p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">
            {MOCK_LAST_LESSON.courseTitle}
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            {MOCK_LAST_LESSON.lessonTitle}
          </p>

          <div className="mt-2 h-2 w-full max-w-xs rounded bg-gray-200">
            <div
              className="h-2 rounded bg-[color:var(--color-primary)]"
              style={{ width: `${MOCK_LAST_LESSON.progress}%` }}
            />
          </div>
        </div>

        <button
          className="mt-3 sm:mt-0 rounded-md bg-[color:var(--color-primary)] px-5 py-2 text-sm text-white"
        >
          Resume
        </button>
      </div>
    </section>
  );
}
