import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listPublicCourses } from '../../services/courseApi';
import type {
  ListPublicCoursesParams,
  CourseCategory,
  CourseLevel,
  PublicCourseListItemDTO,
} from '../../types/course.types';

// Constants

const CATEGORIES: { value: CourseCategory; label: string }[] = [
  { value: 'development',  label: 'Development'  },
  { value: 'design',       label: 'Design'        },
  { value: 'business',     label: 'Business'      },
  { value: 'marketing',    label: 'Marketing'     },
  { value: 'photography',  label: 'Photography'   },
  { value: 'music',        label: 'Music'         },
  { value: 'health',       label: 'Health'        },
  { value: 'other',        label: 'Other'         },
];

const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: 'beginner',     label: 'Beginner'      },
  { value: 'intermediate', label: 'Intermediate'  },
  { value: 'advanced',     label: 'Advanced'      },
  { value: 'all',          label: 'All Levels'    },
];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest'        },
  { value: 'oldest',     label: 'Oldest'        },
  { value: 'popular',    label: 'Most Popular'  },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
] as const;

const LIMIT = 12;

// Duration formatter

function fmtDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// Course card

function PublicCourseCard({ course, onClick }: {
  course: PublicCourseListItemDTO;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col rounded-lg border border-[color:var(--color-border)] bg-white text-left hover:shadow-md transition-shadow w-full"
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-lg bg-gray-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Level badge */}
        <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs font-medium capitalize shadow-sm">
          {course.level}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[color:var(--color-text)]">
          {course.title}
        </h3>

        {course.subtitle && (
          <p className="line-clamp-1 text-xs text-[color:var(--color-muted)]">{course.subtitle}</p>
        )}

        {/* Meta row */}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-[color:var(--color-muted)]">
          <span className="capitalize">{course.category}</span>
          {course.totalDuration > 0 && <span>{fmtDuration(course.totalDuration)}</span>}
        </div>

        {/* Students */}
        {course.enrollmentCount > 0 && (
          <p className="text-xs text-[color:var(--color-muted)]">
            {course.enrollmentCount.toLocaleString()} students
          </p>
        )}

        {/* Price */}
        <p className="mt-1 text-sm font-bold">
          {course.price === 0 ? 'Free' : `${course.currency ?? '₹'}${course.price}`}
        </p>
      </div>
    </button>
  );
}

// Filter sidebar

interface Filters {
  search:   string;
  sort:     string;
  category: string;
  level:    string;
  language: string;
  minPrice: string;
  maxPrice: string;
}

function FilterSidebar({ filters, onChange, onReset }: {
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
}) {
  return (
    <aside className="w-full md:w-60 shrink-0 flex flex-col gap-6">

      {/* Search */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Search</label>
        <input
          type="text"
          placeholder="Search courses…"
          value={filters.search}
          onChange={e => onChange('search', e.target.value)}
        />
      </div>

      {/* Sort */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Sort by</label>
        <select
          value={filters.sort}
          onChange={e => onChange('sort', e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-2 py-2 text-sm bg-white"
        >
          <option value="">Relevance</option>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Category</label>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map(cat => (
            <label key={cat.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="category"
                className="w-auto border-0 p-0"
                checked={filters.category === cat.value}
                onChange={() => onChange('category', filters.category === cat.value ? '' : cat.value)}
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      {/* Level */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Level</label>
        <div className="flex flex-col gap-1">
          {LEVELS.map(lv => (
            <label key={lv.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="level"
                className="w-auto border-0 p-0"
                checked={filters.level === lv.value}
                onChange={() => onChange('level', filters.level === lv.value ? '' : lv.value)}
              />
              {lv.label}
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Language</label>
        <input
          type="text"
          placeholder="e.g. English"
          value={filters.language}
          onChange={e => onChange('language', e.target.value)}
        />
      </div>

      {/* Price range */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Price range</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={filters.minPrice}
            onChange={e => onChange('minPrice', e.target.value)}
            className="w-20"
          />
          <span className="text-xs text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={filters.maxPrice}
            onChange={e => onChange('maxPrice', e.target.value)}
            className="w-20"
          />
        </div>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        className="text-xs text-[color:var(--color-muted)] underline text-left"
      >
        Reset filters
      </button>
    </aside>
  );
}

// Empty filter defaults

const EMPTY_FILTERS: Filters = {
  search: '', sort: '', category: '', level: '', language: '', minPrice: '', maxPrice: '',
};

// Page

export default function PublicCoursesPage() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() => ({
    ...EMPTY_FILTERS,
    category: searchParams.get('category') ?? '',
    search:   searchParams.get('search')   ?? '',
  }));
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [filters]);

  function handleChange(key: keyof Filters, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
  }

  // Build query params — strip empty strings
  const params: ListPublicCoursesParams = { page, limit: LIMIT };
  if (filters.search)                    params.search   = filters.search;
  if (filters.sort)                      params.sort     = filters.sort as ListPublicCoursesParams['sort'];
  if (filters.category)                  params.category = filters.category as CourseCategory;
  if (filters.level)                     params.level    = filters.level as CourseLevel;
  if (filters.language)                  params.language = filters.language;
  if (filters.minPrice !== '')           params.minPrice = Number(filters.minPrice);
  if (filters.maxPrice !== '')           params.maxPrice = Number(filters.maxPrice);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['public-courses', params],
    queryFn:  () => listPublicCourses(params),
    placeholderData: prev => prev,   // keep previous page visible while fetching
  });

  const courses    = data?.courses    ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const total      = data?.pagination?.total ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">All Courses</h1>
        {!isLoading && (
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            {total > 0 ? `${total.toLocaleString()} course${total === 1 ? '' : 's'} found` : 'No courses found'}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">

        {/* Filters */}
        <FilterSidebar filters={filters} onChange={handleChange} onReset={handleReset} />

        {/* Results */}
        <div className="flex-1">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg border bg-white">
                  <div className="h-44 rounded-t-lg bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 rounded bg-gray-200 w-3/4" />
                    <div className="h-3 rounded bg-gray-100 w-1/2" />
                    <div className="h-4 rounded bg-gray-200 w-1/4 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <p className="font-medium text-red-900">Failed to load courses</p>
              <p className="mt-1 text-sm text-red-700">Check your connection and try again.</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && courses.length === 0 && (
            <div className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-gray-50 py-20 text-center">
              <p className="text-sm text-[color:var(--color-muted)]">No courses match your filters.</p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 text-sm underline text-[color:var(--color-muted)]"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Course grid */}
          {!isLoading && !isError && courses.length > 0 && (
            <div className={`transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map(course => (
                  <PublicCourseCard
                    key={course.id}
                    course={course}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isFetching}
                    className="rounded-[var(--radius-md)] border px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[color:var(--color-muted)]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isFetching}
                    className="rounded-[var(--radius-md)] border px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}