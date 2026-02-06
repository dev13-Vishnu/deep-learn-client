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

  if (loading) {
    return (
      <div className="px-6 py-12 text-sm">
        Loading application status…
      </div>
    );
  }

  if (!status) {
    return (
      <div className="px-6 py-12 text-sm">
        No instructor application found.
      </div>
    );
  }



  function renderContent() {
  switch (status) {
    case 'pending':
      return (
        <>
          <h1 className="text-2xl font-semibold">
            Application under review
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            Thanks for applying to become an instructor. Our team is reviewing your application.
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            This usually takes 24–48 hours.
          </p>
        </>
      );

    case 'rejected':
      return (
        <>
          <h1 className="text-2xl font-semibold">
            Application not approved
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            We’re unable to approve your application at this time.
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            You can reapply after improving your proposal.
          </p>

          <button
            onClick={() => navigate('/instructor/apply')}
            className="mt-6 rounded-md border px-4 py-2 text-sm"
          >
            Reapply
          </button>
        </>
      );

    case 'approved':
      return (
        <>
          <h1 className="text-2xl font-semibold">
            You’re approved 🎉
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            Welcome aboard! You can now start creating courses as an instructor.
          </p>

          <button
            onClick={() => navigate('/instructor/dashboard')}
            className="mt-6 rounded-md bg-[color:var(--color-primary)] px-5 py-2 text-sm text-white"
          >
            Go to Instructor Dashboard
          </button>
        </>
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
