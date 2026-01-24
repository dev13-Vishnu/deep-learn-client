interface InstructorItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  students: number;
}

interface InstructorCardProps {
  instructor: InstructorItem;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="rounded-md border border-[color:var(--color-border)] bg-white p-4 text-center hover:shadow-sm transition">
      <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-gray-100" />

      <h3 className="text-sm font-semibold">{instructor.name}</h3>

      <p className="mt-1 text-xs text-[color:var(--color-muted)]">
        {instructor.role}
      </p>

      <div className="mt-3 flex justify-center gap-4 text-xs">
        <span>⭐ {instructor.rating}</span>
        <span>{instructor.students} students</span>
      </div>
    </div>
  );
}
