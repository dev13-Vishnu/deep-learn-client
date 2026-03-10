import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createCourse } from '../../services/courseApi';
import { useNotify } from '../../notifications/useNotify';
import { FieldError } from '../../components/FieldError';
import type { CreateCoursePayload } from '../../types/course.types';

const CATEGORIES = [
  'development', 'design', 'business',
  'marketing', 'photography', 'music', 'health', 'other',
] as const;

const LEVELS = ['beginner', 'intermediate', 'advanced', 'all'] as const;

interface FormState {
  title: string; subtitle: string; description: string;
  category: string; level: string; language: string;
  price: string; tags: string;
}
type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  title: '', subtitle: '', description: '',
  category: '', level: '', language: '',
  price: '0', tags: '',
};

function parseTags(raw: string): string[] {
  return raw.split(',').map(t => t.trim()).filter(Boolean);
}

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.title.trim())                        e.title       = 'Title is required';
  else if (f.title.trim().length < 3)         e.title       = 'Title must be at least 3 characters';
  else if (f.title.length > 120)              e.title       = 'Title cannot exceed 120 characters';
  if (f.subtitle.length > 200)                e.subtitle    = 'Subtitle cannot exceed 200 characters';
  if (!f.description.trim())                  e.description = 'Description is required';
  else if (f.description.trim().length < 20)  e.description = 'Description must be at least 20 characters';
  else if (f.description.length > 5000)       e.description = 'Description cannot exceed 5000 characters';
  if (!f.category)                            e.category    = 'Category is required';
  if (!f.level)                               e.level       = 'Level is required';
  if (!f.language.trim())                     e.language    = 'Language is required';
  const price = parseFloat(f.price);
  if (isNaN(price) || price < 0)             e.price       = 'Price must be 0 or more';
  const tags = parseTags(f.tags);
  if (tags.length > 10)                       e.tags        = 'Cannot have more than 10 tags';
  else if (tags.some(t => t.length > 30))     e.tags        = 'Each tag cannot exceed 30 characters';
  return e;
}

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const notify   = useNotify();
  const [form,   setForm]   = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  const mutation = useMutation({
    mutationFn: (payload: CreateCoursePayload) => createCourse(payload),
    onSuccess: (course) => {
      notify('Course created! You can now add content.', 'success');
      // course is CourseBasicDTO — uses `id`, not `_id`
      navigate(`/instructor/courses/${course.id}/edit`);
    },
    onError: (err: any) => {
      notify(err?.response?.data?.message ?? 'Failed to create course.', 'error');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    mutation.mutate({
      title:       form.title.trim(),
      subtitle:    form.subtitle.trim() || null,
      description: form.description.trim(),
      category:    form.category as CreateCoursePayload['category'],
      level:       form.level    as CreateCoursePayload['level'],
      language:    form.language.trim(),
      price:       parseFloat(form.price) || 0,
      tags:        parseTags(form.tags),
    });
  }

  const saving = mutation.isPending;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <button type="button" onClick={() => navigate('/instructor/dashboard')}
          className="mb-4 flex items-center gap-1 text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]">
          ← Back to dashboard
        </button>
        <h1 className="text-2xl font-semibold">Create a New Course</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Fill in the details below. You can edit them anytime.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="mb-1 block text-sm font-medium">Title <span className="text-red-500">*</span></label>
          <input type="text" placeholder="e.g. Complete React Developer Course"
            value={form.title} onChange={e => set('title', e.target.value)} disabled={saving}
            className={errors.title ? 'border-[color:var(--color-danger)]' : ''} />
          <FieldError message={errors.title} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Subtitle</label>
          <input type="text" placeholder="A short tagline (optional)"
            value={form.subtitle} onChange={e => set('subtitle', e.target.value)} disabled={saving}
            className={errors.subtitle ? 'border-[color:var(--color-danger)]' : ''} />
          <FieldError message={errors.subtitle} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description <span className="text-red-500">*</span></label>
          <textarea rows={5} placeholder="Describe what students will learn (min 20 characters)"
            value={form.description} onChange={e => set('description', e.target.value)} disabled={saving}
            className={`w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm resize-y ${
              errors.description ? 'border-[color:var(--color-danger)]' : 'border-[color:var(--color-border)]'}`} />
          <FieldError message={errors.description} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Category <span className="text-red-500">*</span></label>
            <select value={form.category} onChange={e => set('category', e.target.value)} disabled={saving}
              className={`w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm bg-white ${
                errors.category ? 'border-[color:var(--color-danger)]' : 'border-[color:var(--color-border)]'}`}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
            <FieldError message={errors.category} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Level <span className="text-red-500">*</span></label>
            <select value={form.level} onChange={e => set('level', e.target.value)} disabled={saving}
              className={`w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm bg-white ${
                errors.level ? 'border-[color:var(--color-danger)]' : 'border-[color:var(--color-border)]'}`}>
              <option value="">Select level</option>
              {LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
            </select>
            <FieldError message={errors.level} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Language <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g. English"
              value={form.language} onChange={e => set('language', e.target.value)} disabled={saving}
              className={errors.language ? 'border-[color:var(--color-danger)]' : ''} />
            <FieldError message={errors.language} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Price (₹)</label>
            <input type="number" min="0" step="1" placeholder="0 for free"
              value={form.price} onChange={e => set('price', e.target.value)} disabled={saving}
              className={errors.price ? 'border-[color:var(--color-danger)]' : ''} />
            <FieldError message={errors.price} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tags</label>
          <input type="text" placeholder="react, javascript, frontend — comma-separated, max 10"
            value={form.tags} onChange={e => set('tags', e.target.value)} disabled={saving}
            className={errors.tags ? 'border-[color:var(--color-danger)]' : ''} />
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">
            Separate with commas. Each tag max 30 characters.
          </p>
          <FieldError message={errors.tags} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="rounded-md bg-[color:var(--color-primary)] px-6 py-2.5 text-sm text-white hover:opacity-90 disabled:opacity-60">
            {saving ? 'Creating…' : 'Create Course'}
          </button>
          <button type="button" onClick={() => navigate('/instructor/dashboard')} disabled={saving}
            className="rounded-md border px-6 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}