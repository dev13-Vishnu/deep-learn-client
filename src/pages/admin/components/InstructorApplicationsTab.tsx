import { useEffect, useState } from 'react';
import { adminApi, type InstructorApplication } from '../../../api/admin.api';
import ApplicationCard from './ApplicationCard';

export default function InstructorApplicationsTab() {
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadApplications();
  }, [filter, page]);

  async function loadApplications() {
    setLoading(true);
    try {
      const { data } = await adminApi.listApplications({
        page,
        limit: 10,
        status: filter === 'all' ? undefined : filter,
      });

      setApplications(data.applications);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(applicationId: string) {
    if (!confirm('Are you sure you want to approve this application?')) return;

    try {
      await adminApi.approveApplication(applicationId);
      loadApplications();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to approve application');
    }
  }

  async function handleReject(applicationId: string) {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      await adminApi.rejectApplication(applicationId, reason || undefined);
      loadApplications();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to reject application');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-4">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status as any);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === status
                ? 'bg-[color:var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onApprove={handleApprove}
              onReject={handleReject}
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
            className="px-4 py-2 rounded-md border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-md border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}