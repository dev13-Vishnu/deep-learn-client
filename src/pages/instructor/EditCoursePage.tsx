import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyCourse, updateCourse, uploadThumbnail } from '../../services/courseApi';
import { useNotify } from '../../notifications/useNotify';
import { FieldError } from '../../components/FieldError';
import type { UpdateCoursePayload } from '../../types/course.types';

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

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate     = useNavigate();
  const notify       = useNotify();
  const queryClient  = useQueryClient();

  const [form,   setForm]   = useState<FormState | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  // Thumbnail state
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const [thumbFile,    setThumbFile]    = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [thumbLoading, setThumbLoading] = useState(false);

  // Load course
  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['tutor-course', courseId],
    queryFn:  () => getMyCourse(courseId!),
    enabled:  !!courseId,
  });

  useEffect(() => {
    if (!course) return;
    setForm({
      title:       course.title,
      subtitle:    course.subtitle ?? '',
      description: course.description,
      category:    course.category,
      level:       course.level,
      language:    course.language,
      price:       String(course.price),
      tags:        course.tags.join(', '),
    });
  }, [course]);

  function set(field: keyof FormState, value: string) {
    setForm(prev => prev ? { ...prev, [field]: value } : prev);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateCoursePayload) => updateCourse(courseId!, payload),
    onSuccess: () => {
      notify('Course updated.', 'success');
      queryClient.invalidateQueries({ queryKey: ['tutor-courses'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-course', courseId] });
    },
    onError: (err: any) => {
      notify(err?.response?.data?.message ?? 'Failed to update course.', 'error');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    updateMutation.mutate({
      title:       form.title.trim(),
      subtitle:    form.subtitle.trim() || null,
      description: form.description.trim(),
      category:    form.category as UpdateCoursePayload['category'],
      level:       form.level    as UpdateCoursePayload['level'],
      language:    form.language.trim(),
      price:       parseFloat(form.price) || 0,
      tags:        parseTags(form.tags),
    });
  }

  // Thumbnail handlers
  function handleThumbSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  }

  async function handleThumbUpload() {
    if (!thumbFile || !courseId) return;
    setThumbLoading(true);
    try {
      // uploadThumbnail now returns the new URL string
      const newUrl = await uploadThumbnail(courseId, thumbFile);
      notify('Thumbnail uploaded.', 'success');
      setThumbFile(null);
      setThumbPreview(newUrl);  // show the confirmed URL immediately
      queryClient.invalidateQueries({ queryKey: ['tutor-course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['tutor-courses'] });
    } catch (err: any) {
      notify(err?.response?.data?.message ?? 'Thumbnail upload failed.', 'error');
    } finally {
      setThumbLoading(false);
    }
  }

  // Render states
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Failed to load course</h2>
          <p className="mt-2 text-sm text-red-700">Check your connection and try again.</p>
          <button onClick={() => navigate('/instructor/dashboard')}
            className="mt-4 rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const saving = updateMutation.isPending;

  const displayThumb = thumbPreview ?? course.thumbnail ?? null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <button type="button" onClick={() => navigate('/instructor/dashboard')}
          className="mb-4 flex items-center gap-1 text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]">
          ← Back to dashboard
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Edit Course</h1>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">{course.title}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
            course.status === 'published' ? 'bg-green-100 text-green-700' :
            course.status === 'archived'  ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-600'
          }`}>{course.status}</span>
        </div>
      </div>

      {/* Thumbnail─ */}
      <div className="mb-8 rounded-lg border border-[color:var(--color-border)] bg-white p-6">
        <h2 className="mb-4 text-base font-semibold">Thumbnail</h2>
        <div className="flex items-start gap-6">
          <div className="h-32 w-52 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
            {displayThumb ? (
              <img src={displayThumb} alt="Thumbnail" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300 text-sm">
                No thumbnail
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[color:var(--color-muted)]">
              Recommended: 1280×720px, JPG or PNG, under 2 MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleThumbSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 w-fit"
            >
              {thumbFile ? 'Change image' : 'Choose image'}
            </button>
            {thumbFile && (
              <button
                type="button"
                onClick={handleThumbUpload}
                disabled={thumbLoading}
                className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60 w-fit"
              >
                {thumbLoading ? 'Uploading…' : 'Upload thumbnail'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Course details form */}
      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
        <h2 className="mb-6 text-base font-semibold">Course Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="mb-1 block text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" value={form.title} onChange={e => set('title', e.target.value)} disabled={saving}
              className={errors.title ? 'border-[color:var(--color-danger)]' : ''} />
            <FieldError message={errors.title} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Subtitle</label>
            <input type="text" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} disabled={saving}
              className={errors.subtitle ? 'border-[color:var(--color-danger)]' : ''} />
            <FieldError message={errors.subtitle} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} disabled={saving}
              className={`w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm resize-y ${
                errors.description ? 'border-[color:var(--color-danger)]' : 'border-[color:var(--color-border)]'}`} />
            <FieldError message={errors.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select value={form.category} onChange={e => set('category', e.target.value)} disabled={saving}
                className={`w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm bg-white ${
                  errors.category ? 'border-[color:var(--color-danger)]' : 'border-[color:var(--color-border)]'}`}>
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
              <FieldError message={errors.category} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Level <span className="text-red-500">*</span>
              </label>
              <select value={form.level} onChange={e => set('level', e.target.value)} disabled={saving}
                className={`w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm bg-white ${
                  errors.level ? 'border-[color:var(--color-danger)]' : 'border-[color:var(--color-border)]'}`}>
                {LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
              </select>
              <FieldError message={errors.level} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Language <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.language} onChange={e => set('language', e.target.value)} disabled={saving}
                className={errors.language ? 'border-[color:var(--color-danger)]' : ''} />
              <FieldError message={errors.language} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Price (₹)</label>
              <input type="number" min="0" step="1" value={form.price}
                onChange={e => set('price', e.target.value)} disabled={saving}
                className={errors.price ? 'border-[color:var(--color-danger)]' : ''} />
              <FieldError message={errors.price} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Tags</label>
            <input type="text" placeholder="react, javascript — comma-separated, max 10"
              value={form.tags} onChange={e => set('tags', e.target.value)} disabled={saving}
              className={errors.tags ? 'border-[color:var(--color-danger)]' : ''} />
            <FieldError message={errors.tags} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="rounded-md bg-[color:var(--color-primary)] px-6 py-2.5 text-sm text-white hover:opacity-90 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/instructor/dashboard')} disabled={saving}
              className="rounded-md border px-6 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}