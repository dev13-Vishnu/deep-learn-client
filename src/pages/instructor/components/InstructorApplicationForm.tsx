import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyForInstructor } from '../../../api/instructor.api';

export default function InstructorApplicationForm() {
  const navigate = useNavigate();

  type FormState = {
  bio: string;
  experienceYears: string;
  teachingExperience: 'yes' | 'no';
  courseIntent: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  agreed: boolean;
};


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    bio: '',
    experienceYears: '',
    teachingExperience: 'yes',
    courseIntent: '',
    level: 'beginner',
    language: '',
    agreed: false,
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: typeof form[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
        await applyForInstructor(form);
        // UI-only submit
        navigate('/instructor/status');
        
    } catch (error: any) {
        setError(
            error?.response?.data?.message?? 'Something went wrong. Please try again.'
        );
    } finally {
        setIsSubmitting(false);
    }

  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* ABOUT */}
      <section>
        <h2 className="text-lg font-semibold">About you</h2>
        <textarea
          className="mt-3 w-full rounded-md border p-3 text-sm"
          placeholder="Brief background (max 300 characters)"
          maxLength={300}
          value={form.bio}
          onChange={(e) => update('bio', e.target.value)}
          required
        />
      </section>

      {/* EXPERIENCE */}
      <section>
        <h2 className="text-lg font-semibold">Teaching background</h2>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <select
            className="rounded-md border p-2 text-sm"
            value={form.experienceYears}
            onChange={(e) => update('experienceYears', e.target.value)}
            required
          >
            <option value="">Years of experience</option>
            <option value="0-1">0–1</option>
            <option value="2-4">2–4</option>
            <option value="5-9">5–9</option>
            <option value="10+">10+</option>
          </select>

          <select
            className="rounded-md border p-2 text-sm"
            value={form.teachingExperience}
            onChange={(e) =>
            update(
              'teachingExperience',
              e.target.value as 'yes' | 'no'
            )
          }
            required
          >
            <option value="">Have you taught before?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </section>

      {/* COURSE INTENT */}
      <section>
        <h2 className="text-lg font-semibold">Course intent</h2>

        <textarea
          className="mt-3 w-full rounded-md border p-3 text-sm"
          placeholder="What do you want to teach?"
          value={form.courseIntent}
          onChange={(e) => update('courseIntent', e.target.value)}
          required
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <select
            className="rounded-md border p-2 text-sm"
            value={form.level}
            onChange={(e) =>
            update(
              'level',
              e.target.value as
                | 'beginner'
                | 'intermediate'
                | 'advanced'
            )
          }
            required
          >
            <option value="">Course level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <input
            className="rounded-md border p-2 text-sm"
            placeholder="Language of instruction"
            value={form.language}
            onChange={(e) => update('language', e.target.value)}
            required
          />
        </div>
      </section>

      {/* AGREEMENT */}
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => update('agreed', e.target.checked)}
          required
        />
        I agree to maintain course quality and follow platform guidelines.
      </label>

      {error && (
  <p className="text-sm text-red-600">
    {error}
  </p>
)}


     <button
  type="submit"
  disabled={isSubmitting}
  className="self-start rounded-md bg-[color:var(--color-primary)] px-6 py-2 text-sm text-white disabled:opacity-60"
>
  {isSubmitting ? 'Submitting…' : 'Submit application'}
</button>

    </form>
  );
}
