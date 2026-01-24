import InstructorCard from './InstructorCard';

interface InstructorItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  students: number;
}

const DEFAULT_INSTRUCTORS: InstructorItem[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Frontend Engineer',
    rating: 4.9,
    students: 2100,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Backend Architect',
    rating: 4.8,
    students: 1800,
  },
  {
    id: '3',
    name: 'Aisha Khan',
    role: 'Data Scientist',
    rating: 4.7,
    students: 1600,
  },
];

export default function InstructorsSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Instructors</h2>
          <button className="text-sm text-[color:var(--color-muted)]">
            View all
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {DEFAULT_INSTRUCTORS.map((instructor) => (
            <InstructorCard
              key={instructor.id}
              instructor={instructor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
