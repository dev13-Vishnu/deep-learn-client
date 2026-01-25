import { useNavigate } from 'react-router-dom';

export default function BecomeInstructorSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-[color:var(--color-primary)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Become an Instructor
          </h2>
          <p className="mt-3 text-sm text-white/90">
            Share your knowledge, teach thousands of learners, and earn by creating high-quality courses.
          </p>
        </div>

        <div className="flex md:justify-end">
          <button
            onClick={() => navigate('/instructor/apply')}
            className="rounded-md bg-white px-6 py-3 text-sm font-medium text-[color:var(--color-primary)]"
          >
            Start Teaching
          </button>
        </div>
      </div>
    </section>
  );
}
