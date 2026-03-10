import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyCourses,
  publishCourse,
  unpublishCourse,
  archiveCourse,
  deleteCourse,
} from '../../services/courseApi';
import { CourseStatus } from '../../types/course.types';
import type { CourseStatus as CourseStatusType, TutorCourseListItemDTO } from '../../types/course.types';
import { useNotify } from '../../notifications/useNotify';
import InstructorCourseCard from '../../components/course/InstructorCourseCard';

type FilterTab = 'all' | CourseStatusType;

const TABS: { label: string; value: FilterTab }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Draft',     value: CourseStatus.Draft },
  { label: 'Published', value: CourseStatus.Published },
  { label: 'Archived',  value: CourseStatus.Archived },
];

const LIMIT = 9;

// Delete confirmation modal

interface DeleteModalProps {
  courseTitle: string;
  onConfirm: () => void;
  onCancel:  () => void;
  isLoading: boolean;
}

function DeleteModal({ courseTitle, onConfirm, onCancel, isLoading }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Delete Course</h2>
        </div>
        <p className="mb-1 text-sm text-gray-600">
          You are about to permanently delete <strong className="text-gray-900">"{courseTitle}"</strong>.
        </p>
        <p className="mb-6 text-sm text-gray-500">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={isLoading}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60">
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting…
              </>
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Page 

export default function InstructorDashboardPage() {
  const navigate    = useNavigate();
  const notify      = useNotify();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [page, setPage]           = useState(1);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  // 'all' → omit status so the server returns every status
  const statusParam = activeTab === 'all' ? undefined : activeTab;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tutor-courses', { status: statusParam ?? 'all', page }],
    queryFn:  () => getMyCourses({ status: statusParam, page, limit: LIMIT }),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['tutor-courses'] });
  }

  const publishMutation = useMutation({
    mutationFn: publishCourse,
    onSuccess: () => { notify('Course published.', 'success'); invalidate(); },
    onError:   () => notify('Failed to publish course.', 'error'),
  });

  const unpublishMutation = useMutation({
    mutationFn: unpublishCourse,
    onSuccess: () => { notify('Course unpublished.', 'success'); invalidate(); },
    onError:   () => notify('Failed to unpublish course.', 'error'),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveCourse,
    onSuccess: () => { notify('Course archived.', 'success'); invalidate(); },
    onError:   () => notify('Failed to archive course.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      notify('Course deleted.', 'success');
      setPendingDelete(null);
      invalidate();
    },
    onError: () => notify('Failed to delete course.', 'error'),
  });

  const isActioning =
    publishMutation.isPending   ||
    unpublishMutation.isPending ||
    archiveMutation.isPending   ||
    deleteMutation.isPending;

  function handleTabChange(tab: FilterTab) {
    setActiveTab(tab);
    setPage(1);
  }

  // getMyCourses now returns { courses, pagination }
  const courses    = data?.courses    ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Courses</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            Manage and publish your course library.
          </p>
        </div>
        <button
          onClick={() => navigate('/instructor/courses/new')}
          className="rounded-md bg-[color:var(--color-primary)] px-5 py-2.5 text-sm text-white hover:opacity-90"
        >
          + Create Course
        </button>
      </div>

      {/*  Tabs  */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex gap-6">
          {TABS.map(({ label, value }) => (
            <button key={value} onClick={() => handleTabChange(value)}
              className={`pb-4 text-sm font-medium border-b-2 transition capitalize ${
                activeTab === value
                  ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/*  Loading  */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]" />
        </div>
      )}

      {/*  Error  */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-900">Failed to load courses</p>
          <p className="mt-1 text-sm text-red-700">Check your connection and try again.</p>
        </div>
      )}

      {/*  Empty  */}
      {!isLoading && !isError && courses.length === 0 && (
        <div className="rounded-lg border border-[color:var(--color-border)] bg-gray-50 py-20 text-center">
          <p className="text-gray-500">
            {activeTab === 'all'
              ? "You haven't created any courses yet."
              : `No ${activeTab} courses.`}
          </p>
          {activeTab === 'all' && (
            <button onClick={() => navigate('/instructor/courses/new')}
              className="mt-4 rounded-md bg-[color:var(--color-primary)] px-5 py-2 text-sm text-white hover:opacity-90">
              Create your first course
            </button>
          )}
        </div>
      )}

      {/*  Grid  */}
      {!isLoading && !isError && courses.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: TutorCourseListItemDTO) => (
              <InstructorCourseCard
                key={course.id}
                course={course}
                isActioning={isActioning}
                onPublish={publishMutation.mutate}
                onUnpublish={unpublishMutation.mutate}
                onArchive={archiveMutation.mutate}
                onDelete={(id) => setPendingDelete({ id, title: course.title })}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-[color:var(--color-muted)]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/*  Delete modal  */}
      {pendingDelete && (
        <DeleteModal
          courseTitle={pendingDelete.title}
          isLoading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}