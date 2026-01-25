import { useNavigate } from 'react-router-dom';

export default function BecomeInstructorCard() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="rounded-md border border-[color:var(--color-border)] bg-white p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">
            Want to teach on DeepLearn?
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            Apply as an instructor and start creating courses.
          </p>
        </div>

        <button
          onClick={() => navigate('/instructor/apply')}
          className="rounded-md bg-[color:var(--color-primary)] px-5 py-2 text-sm text-white"
        >
          Become an Instructor
        </button>
      </div>
    </section>
  );
}
