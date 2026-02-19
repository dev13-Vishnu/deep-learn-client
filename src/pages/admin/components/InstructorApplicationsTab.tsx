import { useEffect, useState, useCallback } from 'react';
import { adminApi, type InstructorApplication } from '../../../api/admin.api';
import ApplicationCard from './ApplicationCard';
import ApproveModal from './ApproveModal';
import RejectModal from './RejectModal';
import { Toast, useToast } from './Toast';
import { useApplicationActions } from '../hooks/useApplicationActions';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function InstructorApplicationsTab() {
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { toasts, toast: addToast, dismiss } = useToast();

  const {
    approveTarget,
    rejectTarget,
    isActioning,
    openApproveModal,
    openRejectModal,
    closeModals,
    confirmApprove,
    confirmReject,
  } = useApplicationActions(addToast);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.listApplications({
        page,
        limit: 10,
        status: filter === 'all' ? undefined : filter,
      });
      setApplications(data.applications);
      setTotalPages(data.pagination.totalPages);
    } catch {
      addToast('Failed to load applications.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // ── Optimistic remove ──────────────────────────────────────────────────────
  // When filtering by "pending" we immediately pull the card once actioned.
  function optimisticRemove(id: string) {
    if (filter === 'pending') {
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } else {
      // For other filters just reload to get fresh status
      loadApplications();
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]" />
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Filter bar */}
        <div className="mb-6 flex gap-3">
          {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => {
                  setFilter(s);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition capitalize ${
                  filter === s
                    ? 'bg-[color:var(--color-primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>

        {/* List */}
        {applications.length === 0 ? (
          <div className="rounded-lg bg-gray-50 py-14 text-center">
            <p className="text-gray-500">No applications found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onApprove={openApproveModal}
                onReject={openRejectModal}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── Approve Modal ─────────────────────────────────────────────────── */}
      {approveTarget && (
        <ApproveModal
          applicationId={approveTarget.id}
          isLoading={isActioning}
          onConfirm={() => confirmApprove(optimisticRemove)}
          onCancel={closeModals}
        />
      )}

      {/* ── Reject Modal ──────────────────────────────────────────────────── */}
      {rejectTarget && (
        <RejectModal
          applicationId={rejectTarget.id}
          isLoading={isActioning}
          onConfirm={(reason) => confirmReject(reason, optimisticRemove)}
          onCancel={closeModals}
        />
      )}

      {/* ── Toast stack ───────────────────────────────────────────────────── */}
      <Toast toasts={toasts} onDismiss={dismiss} />
    </>
  );
}