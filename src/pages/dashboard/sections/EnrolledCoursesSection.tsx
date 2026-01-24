interface EnrolledCourse {
  id: string;
  title: string;
  progress: number; // percentage
}

const MOCK_ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: 'react',
    title: 'React for Beginners',
    progress: 45,
  },
  {
    id: 'node',
    title: 'Node.js Masterclass',
    progress: 20,
  },
];

export default function EnrolledCoursesSection() {
  const hasCourses = MOCK_ENROLLED_COURSES.length > 0;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">
        Your courses
      </h2>

      {!hasCourses && (
        <div className="rounded-md border border-[color:var(--color-border)] bg-white p-5">
          <p className="text-sm">
            You’re not enrolled in any courses yet.
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            Explore courses to start learning.
          </p>
        </div>
      )}

      {hasCourses && (
        <div className="flex flex-col gap-4">
          {MOCK_ENROLLED_COURSES.map((course) => (
            <div
              key={course.id}
              className="rounded-md border border-[color:var(--color-border)] bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {course.title}
                </p>
                <span className="text-xs text-[color:var(--color-muted)]">
                  {course.progress}%
                </span>
              </div>

              <div className="mt-2 h-2 w-full rounded bg-gray-200">
                <div
                  className="h-2 rounded bg-[color:var(--color-primary)]"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
