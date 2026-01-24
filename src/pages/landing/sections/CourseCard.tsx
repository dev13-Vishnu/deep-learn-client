interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: string;
}

interface CourseCardProps {
  course: CourseItem;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="rounded-md border border-[color:var(--color-border)] bg-white p-4 hover:shadow-sm transition">
      <div className="mb-3 h-36 w-full rounded bg-gray-100" />

      <h3 className="text-sm font-semibold leading-snug">
        {course.title}
      </h3>

      <p className="mt-1 text-xs text-[color:var(--color-muted)]">
        {course.instructor}
      </p>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span>⭐ {course.rating}</span>
        <span>{course.students} students</span>
      </div>

      <div className="mt-3 font-semibold">
        {course.price}
      </div>
    </div>
  );
}
