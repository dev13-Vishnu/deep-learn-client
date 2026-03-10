// client-only/src/pages/courses/PublicCourseDetailPage.tsx
//
// Route: /courses/:courseId  (public — no auth required)
//
// Displays full course detail:
//   • Hero: thumbnail, title, subtitle, price, level, language, category, stats
//   • Description
//   • Curriculum accordion: modules → lessons (chapter count & duration)
//   • Enroll CTA (placeholder — enrollment flow is out of scope)

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublicCourse } from '../../services/courseApi';
import type { ModuleDTO } from '../../types/course.types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmtDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${seconds}s`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Curriculum accordion ──────────────────────────────────────────────────────

function ModuleAccordion({ module }: { module: ModuleDTO }) {
  const [open, setOpen] = useState(false);

  const totalChapters = module.lessons.reduce((s, l) => s + l.chapters.length, 0);

  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <svg
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="truncate text-sm font-semibold">{module.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 ml-4 text-xs text-[color:var(--color-muted)]">
          <span>{module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}</span>
          {totalChapters > 0 && <span>{totalChapters} chapter{totalChapters !== 1 ? 's' : ''}</span>}
          {module.duration > 0 && <span>{fmtDuration(module.duration)}</span>}
        </div>
      </button>

      {open && (
        <div className="border-t border-[color:var(--color-border)] divide-y divide-[color:var(--color-border)]">
          {module.lessons.length === 0 ? (
            <p className="px-5 py-3 text-xs text-[color:var(--color-muted)]">No lessons yet.</p>
          ) : (
            module.lessons.map((lesson, idx) => {
              const freeChapters = lesson.chapters.filter(c => c.isFree).length;
              return (
                <div key={lesson.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Lesson icon */}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm">{lesson.title}</p>
                      {lesson.description && (
                        <p className="mt-0.5 truncate text-xs text-[color:var(--color-muted)]">{lesson.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 ml-4 text-xs text-[color:var(--color-muted)]">
                    {lesson.duration > 0 && <span>{fmtDuration(lesson.duration)}</span>}
                    {lesson.isPreview && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Preview
                      </span>
                    )}
                    {freeChapters > 0 && !lesson.isPreview && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {freeChapters} free
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-[color:var(--color-border)] bg-white px-5 py-3 text-center">
      <span className="text-lg font-bold">{value}</span>
      <span className="mt-0.5 text-xs text-[color:var(--color-muted)]">{label}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PublicCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate     = useNavigate();

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['public-course', courseId],
    queryFn:  () => getPublicCourse(courseId!),
    enabled:  !!courseId,
  });

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]" />
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError || !course) return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-900">Course not found</p>
        <p className="mt-2 text-sm text-red-700">This course may have been removed or is no longer available.</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 rounded-[var(--radius-md)] border px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← Back to courses
        </button>
      </div>
    </div>
  );

  // ── Computed ─────────────────────────────────────────────────────────────────
  const totalLessons  = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const totalChapters = course.modules.reduce(
    (s, m) => s + m.lessons.reduce((ls, l) => ls + l.chapters.length, 0), 0
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate('/courses')}
        className="mb-6 flex items-center gap-1 text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]"
      >
        ← All Courses
      </button>

      {/* Hero grid */}
      <div className="grid gap-8 md:grid-cols-5">

        {/* Left: info */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                {course.category}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                {course.level}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                {course.language}
              </span>
            </div>

            <h1 className="text-2xl font-bold leading-snug">{course.title}</h1>

            {course.subtitle && (
              <p className="mt-2 text-base text-[color:var(--color-muted)]">{course.subtitle}</p>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {course.enrollmentCount > 0 && (
              <StatPill label="Students" value={course.enrollmentCount.toLocaleString()} />
            )}
            {course.totalDuration > 0 && (
              <StatPill label="Duration" value={fmtDuration(course.totalDuration)} />
            )}
            {totalLessons > 0 && (
              <StatPill label="Lessons" value={totalLessons} />
            )}
            {totalChapters > 0 && (
              <StatPill label="Chapters" value={totalChapters} />
            )}
          </div>

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.tags.map(tag => (
                <span key={tag} className="rounded border border-[color:var(--color-border)] px-2.5 py-1 text-xs text-[color:var(--color-muted)]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: thumbnail + CTA */}
        <div className="md:col-span-2">
          <div className="sticky top-6 rounded-lg border border-[color:var(--color-border)] bg-white shadow-sm overflow-hidden">
            {/* Thumbnail */}
            <div className="h-48 w-full bg-gray-100">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Price + CTA */}
            <div className="p-5">
              <p className="text-2xl font-bold">
                {course.price === 0 ? 'Free' : `${course.currency ?? '₹'}${course.price}`}
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-[var(--radius-md)] bg-[color:var(--color-primary)] py-3 text-sm font-medium text-white hover:opacity-90 transition"
              >
                Enroll Now
              </button>
              <p className="mt-3 text-center text-xs text-[color:var(--color-muted)]">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {course.description && (
        <div className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">About this course</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--color-text)]">
            {course.description}
          </p>
        </div>
      )}

      {/* Curriculum */}
      {course.modules.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Curriculum</h2>
            <span className="text-xs text-[color:var(--color-muted)]">
              {course.modules.length} module{course.modules.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {course.modules.map(mod => (
              <ModuleAccordion key={mod.id} module={mod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}