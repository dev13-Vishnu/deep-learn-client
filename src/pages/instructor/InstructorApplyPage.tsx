import InstructorApplicationForm from './components/InstructorApplicationForm';

export default function InstructorApplyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">
        Apply to Become an Instructor
      </h1>

      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Share your experience and tell us what you’d like to teach.
      </p>

      <div className="mt-8">
        <InstructorApplicationForm />
      </div>
    </div>
  );
}
