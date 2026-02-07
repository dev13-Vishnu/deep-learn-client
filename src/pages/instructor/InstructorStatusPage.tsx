import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstructorStatus } from '../../api/instructor.api';

type InstructorStatus = 'pending' | 'rejected' | 'approved';

export default function InstructorStatusPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<InstructorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        console.log('[Status Page] Loading status...');
        const data = await getInstructorStatus();
        console.log('[Status Page] Received data:', data);
        
        setStatus(data.status);
        setError(null);
      } catch (err: any) {
        console.error('[Status Page] Error:', err);
        setError(err?.response?.data?.message || 'Failed to load application status');
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Error</h2>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (status === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-lg border bg-white p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">No Application Found</h2>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            You haven't submitted an instructor application yet.
          </p>
          <button
            onClick={() => navigate('/instructor/apply')}
            className="mt-6 rounded-md bg-[color:var(--color-primary)] px-6 py-2 text-white hover:opacity-90"
          >
            Apply to Become an Instructor
          </button>
        </div>
      </div>
    );
  }

  function renderContent() {
    switch (status) {
      case 'pending':
        return (
          <div className="rounded-lg border bg-white p-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-center">
              Application Under Review
            </h1>
            <p className="mt-3 text-center text-[color:var(--color-muted)]">
              Thanks for applying to become an instructor. Our team is reviewing your application.
            </p>
            <p className="mt-2 text-center text-sm text-[color:var(--color-muted)]">
              This usually takes 24–48 hours. We'll notify you once a decision is made.
            </p>
          </div>
        );

      case 'rejected':
        return (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-center text-red-900">
              Application Not Approved
            </h1>
            <p className="mt-3 text-center text-red-700">
              We're unable to approve your application at this time.
            </p>
            <p className="mt-2 text-center text-sm text-red-600">
              You can reapply after improving your proposal.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate('/instructor/apply')}
                className="rounded-md border border-red-300 bg-white px-6 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Reapply
              </button>
            </div>
          </div>
        );

      case 'approved':
        return (
          <div className="rounded-lg border border-green-200 bg-green-50 p-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-center text-green-900">
              You're Approved! 🎉
            </h1>
            <p className="mt-3 text-center text-green-700">
              Welcome aboard! You can now start creating courses as an instructor.
            </p>
            <p className="mt-2 text-center text-sm text-green-600">
              To access your instructor dashboard, logout and login as "Instructor".
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => navigate('/home')}
                className="rounded-md border border-green-300 bg-white px-6 py-2 text-sm text-green-700 hover:bg-green-50"
              >
                Back to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {renderContent()}
    </div>
  );
}