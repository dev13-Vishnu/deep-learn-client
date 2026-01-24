import CourseCard from "./CourseCard";

interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: string;
}

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'react',
    title: 'React for Beginners',
    instructor: 'John Doe',
    rating: 4.8,
    students: 1200,
    price: '₹499',
  },
  {
    id: 'node',
    title: 'Node.js Masterclass',
    instructor: 'Jane Smith',
    rating: 4.7,
    students: 980,
    price: '₹599',
  },
  {
    id: 'mongo',
    title: 'MongoDB in Depth',
    instructor: 'Alex Brown',
    rating: 4.6,
    students: 760,
    price: '₹399',
  },
];

export default function TopCoursesSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Courses</h2>
          <button className="text-sm text-[color:var(--color-muted)]">
            View all
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {DEFAULT_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
