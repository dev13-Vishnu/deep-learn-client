import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstructorStatus } from '../../api/instructor.api';

interface ApplicationData {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  cooldownExpiresAt?: string | null;   // added — was missing before
  bio: string;
  experienceYears: string;
  teachingExperience: 'yes' | 'no';
  courseIntent: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface InstructorStatus {
  hasApplication: boolean;
  application?: ApplicationData;
}

export default function InstructorStatusPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<InstructorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  async function loadStatus() {
    setLoading(true);
    setError(null);
    try {
      const data = await getInstructorStatus();
      setStatus(data);
        } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load application status.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStatus(); }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)] mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading application status…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={loadStatus}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!status?.hasApplication) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold">No Application Found</h2>
          <p className="mt-2 text-sm text-gray-600">
            You haven't applied to become an instructor yet.
          </p>
          <button
            onClick={() => navigate('/instructor/apply')}
            className="mt-6 rounded-md bg-[color:var(--color-primary)] px-6 py-3 text-white hover:opacity-90"
          >
            Apply Now
          </button>
        </div>
      </div>
    );
  }

  const application = status.application!;

  // Determine whether the reapplication cooldown is still active
  const cooldownDate = application.cooldownExpiresAt
    ? new Date(application.cooldownExpiresAt)
    : null;
  const isCooldownActive = cooldownDate !== null && cooldownDate > new Date();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Application Status</h1>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">

        {/* Status badge */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
              application.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : application.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {application.status}
          </span>
        </div>

        {/* ── Pending ─────────────────────────────────────────────────────────── */}
        {application.status === 'pending' && (
          <div className="mt-4 rounded-md bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              Your application is under review. We'll notify you once a decision has been made.
            </p>
          </div>
        )}

        {/* ── Approved ────────────────────────────────────────────────────────── */}
        {application.status === 'approved' && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Congratulations! Your application has been approved.
            </p>
            <button
              onClick={() => navigate('/instructor/dashboard')}
              className="mt-3 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ── Rejected ────────────────────────────────────────────────────────── */}
        {application.status === 'rejected' && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">
              Unfortunately, your application was not approved.
            </p>

            {application.rejectionReason && (
              <p className="mt-2 text-sm text-red-700">
                <strong>Reason:</strong> {application.rejectionReason}
              </p>
            )}

            {/* Cooldown active — inform the user, hide the reapply button */}
            {isCooldownActive && cooldownDate ? (
              <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-800">
                  <strong>Reapplication cooldown:</strong> You can apply again after{' '}
                  <strong>
                    {cooldownDate.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                  .
                </p>
              </div>
            ) : (
              <button
                onClick={() => navigate('/instructor/apply')}
                className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Apply Again
              </button>
            )}
          </div>
        )}

        {/* Application details */}
        <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900">Application Details</h3>

          <div>
            <span className="text-sm font-medium text-gray-600">Bio:</span>
            <p className="mt-1 text-sm text-gray-800">{application.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Experience:</span>
              <p className="mt-1 text-sm text-gray-800">{application.experienceYears} years</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Teaching Experience:</span>
              <p className="mt-1 text-sm text-gray-800">
                {application.teachingExperience === 'yes' ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Level:</span>
              <p className="mt-1 text-sm capitalize text-gray-800">{application.level}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Language:</span>
              <p className="mt-1 text-sm text-gray-800">{application.language}</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600">Course Intent:</span>
            <p className="mt-1 text-sm text-gray-800">{application.courseIntent}</p>
          </div>

          <p className="text-xs text-gray-500">
            Submitted:{' '}
            {new Date(application.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}