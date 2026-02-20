import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyForInstructor } from '../../../api/instructor.api';
import { useNotify } from '../../../notifications/useNotify';
import { FieldError } from '../../../components/FieldError';
import {
  validateBio,
  validateCourseIntent,
  validateLanguage,
  validateExperienceYears,
  BIO_MIN,
  BIO_MAX,
  COURSE_INTENT_MIN,
  COURSE_INTENT_MAX,
} from '../../../utils/validation';

type FormState = {
  bio: string;
  experienceYears: string;
  teachingExperience: 'yes' | 'no';
  courseIntent: string;
  level: 'beginner' | 'intermediate' | 'advanced' | '';
  language: string;
  agreed: boolean;
};

type FormErrors = Partial<Record<keyof Omit<FormState, 'teachingExperience' | 'agreed'>, string | null>>;

export default function InstructorApplicationForm() {
  const navigate = useNavigate();
  const notify = useNotify();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    bio: '',
    experienceYears: '',
    teachingExperience: 'yes',
    courseIntent: '',
    level: '',
    language: '',
    agreed: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error immediately on change so user gets positive feedback as they type
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  }

  function touchField(field: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [field]: getFieldError(field) }));
  }

  function getFieldError(field: keyof FormErrors): string | null {
    switch (field) {
      case 'bio':             return validateBio(form.bio);
      case 'experienceYears': return validateExperienceYears(form.experienceYears);
      case 'courseIntent':    return validateCourseIntent(form.courseIntent);
      case 'level':           return !form.level ? 'Please select a course level' : null;
      case 'language':        return validateLanguage(form.language);
      default:                return null;
    }
  }

  function validateAll(): boolean {
    const next: FormErrors = {
      bio:             validateBio(form.bio),
      experienceYears: validateExperienceYears(form.experienceYears),
      courseIntent:    validateCourseIntent(form.courseIntent),
      level:           !form.level ? 'Please select a course level' : null,
      language:        validateLanguage(form.language),
    };
    setErrors(next);
    return Object.values(next).every((e) => e === null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) {
      notify('Please fix the errors below before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await applyForInstructor({
        ...form,
        level: form.level as 'beginner' | 'intermediate' | 'advanced',
      });
      notify('Application submitted successfully!', 'success');
      navigate('/instructor/status');
    } catch (err: any) {
      notify(
        err?.response?.data?.message ?? 'Something went wrong. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Character counter colour: red if below minimum, grey otherwise
  const bioCountColor =
    form.bio.length < BIO_MIN ? 'text-[color:var(--color-danger)]' : 'text-gray-400';
  const intentCountColor =
    form.courseIntent.length < COURSE_INTENT_MIN
      ? 'text-[color:var(--color-danger)]'
      : 'text-gray-400';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* ── ABOUT ─────────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold">About you</h2>
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          Tell us about your background. Minimum {BIO_MIN} characters.
        </p>
        <div className="mt-3">
          <textarea
            rows={5}
            maxLength={BIO_MAX}
            placeholder={`Brief background (minimum ${BIO_MIN} characters)`}
            value={form.bio}
            onChange={(e) => update('bio', e.target.value)}
            onBlur={() => touchField('bio')}
            className={`w-full rounded-md border p-3 text-sm resize-none ${
              errors.bio ? 'border-[color:var(--color-danger)]' : ''
            }`}
          />
          <div className="mt-1 flex items-start justify-between gap-2">
            <FieldError message={errors.bio} />
            <span className={`shrink-0 text-xs ${bioCountColor}`}>
              {form.bio.length}/{BIO_MAX}
            </span>
          </div>
        </div>
      </section>

      {/* ── TEACHING BACKGROUND ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold">Teaching background</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <select
              value={form.experienceYears}
              onChange={(e) => update('experienceYears', e.target.value)}
              onBlur={() => touchField('experienceYears')}
              className={`w-full rounded-md border p-2 text-sm ${
                errors.experienceYears ? 'border-[color:var(--color-danger)]' : ''
              }`}
            >
              <option value="">Years of experience</option>
              <option value="0-1">0–1</option>
              <option value="2-4">2–4</option>
              <option value="5-9">5–9</option>
              <option value="10+">10+</option>
            </select>
            <FieldError message={errors.experienceYears} />
          </div>

          <div>
            <select
              value={form.teachingExperience}
              onChange={(e) =>
                update('teachingExperience', e.target.value as 'yes' | 'no')
              }
              className="w-full rounded-md border p-2 text-sm"
            >
              <option value="yes">Taught before: Yes</option>
              <option value="no">Taught before: No</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── COURSE INTENT ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold">Course intent</h2>
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          Describe what you want to teach. Minimum {COURSE_INTENT_MIN} characters.
        </p>
        <div className="mt-3">
          <textarea
            rows={4}
            maxLength={COURSE_INTENT_MAX}
            placeholder="What topics do you plan to teach and who is your target audience?"
            value={form.courseIntent}
            onChange={(e) => update('courseIntent', e.target.value)}
            onBlur={() => touchField('courseIntent')}
            className={`w-full rounded-md border p-3 text-sm resize-none ${
              errors.courseIntent ? 'border-[color:var(--color-danger)]' : ''
            }`}
          />
          <div className="mt-1 flex items-start justify-between gap-2">
            <FieldError message={errors.courseIntent} />
            <span className={`shrink-0 text-xs ${intentCountColor}`}>
              {form.courseIntent.length}/{COURSE_INTENT_MAX}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <select
              value={form.level}
              onChange={(e) =>
                update('level', e.target.value as FormState['level'])
              }
              onBlur={() => touchField('level')}
              className={`w-full rounded-md border p-2 text-sm ${
                errors.level ? 'border-[color:var(--color-danger)]' : ''
              }`}
            >
              <option value="">Course level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <FieldError message={errors.level} />
          </div>

          <div>
            <input
              type="text"
              placeholder="Language of instruction"
              value={form.language}
              onChange={(e) => update('language', e.target.value)}
              onBlur={() => touchField('language')}
              className={`w-full rounded-md border p-2 text-sm ${
                errors.language ? 'border-[color:var(--color-danger)]' : ''
              }`}
            />
            <FieldError message={errors.language} />
          </div>
        </div>
      </section>

      {/* ── AGREEMENT ─────────────────────────────────────────────────────────── */}
      <label className="flex items-start gap-3 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => update('agreed', e.target.checked)}
          required
          className="mt-0.5"
        />
        I agree to maintain course quality and follow platform guidelines.
      </label>

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