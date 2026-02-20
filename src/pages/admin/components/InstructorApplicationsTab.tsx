import { useEffect, useState, useCallback } from 'react';
import { adminApi, type InstructorApplication } from '../../../api/admin.api';
import { useApplicationActions } from '../hooks/useApplicationActions';
import ApproveModal from './ApproveModal';
import RejectModal from './RejectModal';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function InstructorApplicationsTab() {
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Global notifications — no local Toast needed
  const {
    approveTarget,
    rejectTarget,
    isActioning,
    openApproveModal,
    openRejectModal,
    closeModals,
    confirmApprove,
    confirmReject,
  } = useApplicationActions();   // ← no argument

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
      // Error is surfaced via the global toast from the API layer
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  // Optimistic removal — removes the card immediately when filter is 'pending'
  function optimisticRemove(id: string) {
    if (filter === 'pending') {
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } else {
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
          {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition capitalize ${
                filter === s
                  ? 'bg-[color:var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Application list */}
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
            <span className="px-4 py-2 text-sm">Page {page} of {totalPages}</span>
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

      {approveTarget && (
        <ApproveModal
          applicationId={approveTarget.id}
          isLoading={isActioning}
          onConfirm={() => confirmApprove(optimisticRemove)}
          onCancel={closeModals}
        />
      )}

      {rejectTarget && (
        <RejectModal
          applicationId={rejectTarget.id}
          isLoading={isActioning}
          onConfirm={(reason) => confirmReject(reason, optimisticRemove)}
          onCancel={closeModals}
        />
      )}

      {/* No local <Toast> here — global NotificationProvider handles it */}
    </>
  );
}

// ── ApplicationCard (inlined — avoids a separate file change) ─────────────────
interface CardProps {
  application: InstructorApplication;
  onApprove: (app: InstructorApplication) => void;
  onReject: (app: InstructorApplication) => void;
}

function ApplicationCard({ application, onApprove, onReject }: CardProps) {
  const cooldownDate = application.cooldownExpiresAt
    ? new Date(application.cooldownExpiresAt)
    : null;
  const isCooldownActive = cooldownDate !== null && cooldownDate > new Date();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                application.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : application.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {application.status}
            </span>

            {isCooldownActive && cooldownDate && (
              <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                Cooldown until {cooldownDate.toLocaleDateString()}
              </span>
            )}

            <span className="text-xs text-gray-400">
              #{application.id.slice(-6)}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{application.bio}</p>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
            <span>Experience: {application.experienceYears} yrs</span>
            <span>Level: {application.level}</span>
            <span>Language: {application.language}</span>
          </div>
        </div>

        {/* Action buttons — only shown for pending applications */}
        {application.status === 'pending' && (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => onApprove(application)}
              className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(application)}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {application.rejectionReason && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2">
          <p className="text-xs text-red-700">
            <strong>Rejection reason:</strong> {application.rejectionReason}
          </p>
        </div>
      )}
    </div>
  );
}