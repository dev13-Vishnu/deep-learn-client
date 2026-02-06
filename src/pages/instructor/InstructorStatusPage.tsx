import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstructorStatus } from '../../api/instructor.api';

type InstructorStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'blocked';
// 🔧 MOCK — change this to test states
// const MOCK_STATUS: InstructorStatus = 'pending';

export default function InstructorStatusPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<InstructorStatus | null> (null);
  const [loading, setLoading] = useState(true);
  const [ error, setError ] = useState<string | null > (null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await getInstructorStatus();
        setStatus(data.status);
        setError(null);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          'Failed to load instructor status'
        );
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, []);

  // 1️⃣ Loading state
if (loading) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[color:var(--color-primary)] mx-auto" />
        <p className="mt-4 text-sm text-[color:var(--color-muted)]">
          Loading application status…
        </p>
      </div>
    </div>
  );
}

// 2️⃣ Error state
if (error) {
  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
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

// 3️⃣ No application
if (status === null) {
  return (
    <div className="mx-auto max-w-xl px-6 py-12 text-center">
      <div className="rounded-lg border bg-white p-8">
        <h2 className="text-xl font-semibold">
          No Application Found
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          You haven’t applied to become an instructor yet.
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
      <div className="mx-auto max-w-xl px-6 py-12 text-center">
        <div className="rounded-lg border bg-white p-8">
          <h1 className="text-2xl font-semibold">
            Application Under Review
          </h1>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            Your instructor application is currently being reviewed.
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            This usually takes 24–48 hours.
          </p>
        </div>
      </div>
    );

  case 'approved':
    return (
      <div className="mx-auto max-w-xl px-6 py-12 text-center">
        <div className="rounded-lg border border-green-200 bg-green-50 p-8">
          <h1 className="text-2xl font-semibold text-green-900">
            You’re Approved 🎉
          </h1>
          <p className="mt-3 text-sm text-green-700">
            You can now access instructor features.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );

  case 'rejected':
    return (
      <div className="mx-auto max-w-xl px-6 py-12 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-semibold text-red-900">
            Application Rejected
          </h1>
          <p className="mt-3 text-sm text-red-700">
            Your application was not approved.
          </p>
          <button
            onClick={() => navigate('/instructor/apply')}
            className="mt-6 rounded-md border border-red-300 bg-white px-6 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            Reapply
          </button>
        </div>
      </div>
    );

  case 'blocked':
    return (
      <div className="mx-auto max-w-xl px-6 py-12 text-center">
        <div className="rounded-lg border border-gray-300 bg-gray-100 p-8">
          <h1 className="text-2xl font-semibold">
            Application Blocked
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Your application has been blocked by an administrator.
          </p>
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
