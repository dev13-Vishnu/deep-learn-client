import { type InstructorApplication } from '../../../api/admin.api';

interface Props {
  application: InstructorApplication;
  onApprove: (app: InstructorApplication) => void;  // ← passes full object now
  onReject: (app: InstructorApplication) => void;   // ← passes full object now
}

export default function ApplicationCard({ application, onApprove, onReject }: Props) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const status = application.status ?? 'pending';

  // Format cooldown for rejected applications
  const cooldownDate = application.cooldownExpiresAt
    ? new Date(application.cooldownExpiresAt)
    : null;
  const cooldownActive = cooldownDate && cooldownDate > new Date();

  return (
    <div className="rounded-lg border bg-white p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            Application #{application.id.slice(-6)}
          </h3>
          <p className="text-sm text-gray-500">
            Submitted {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Experience</p>
          <p className="text-sm">{application.experienceYears} years</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Teaching Experience</p>
          <p className="text-sm capitalize">{application.teachingExperience}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Level</p>
          <p className="text-sm capitalize">{application.level}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Language</p>
          <p className="text-sm">{application.language}</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
        <p className="text-sm whitespace-pre-wrap">{application.bio}</p>
      </div>

      {/* Course intent */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500 mb-1">Course Intent</p>
        <p className="text-sm whitespace-pre-wrap">{application.courseIntent}</p>
      </div>

      {/* Rejection reason */}
      {application.rejectionReason && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason</p>
          <p className="text-sm text-red-700">{application.rejectionReason}</p>
        </div>
      )}

      {/* Cooldown badge */}
      {cooldownActive && cooldownDate && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-800">
            <strong>Cooldown active</strong> — applicant cannot reapply until{' '}
            <strong>{cooldownDate.toLocaleDateString()}</strong>
          </p>
        </div>
      )}

      {/* Actions — only for pending */}
      {application.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(application)}
            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 transition"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(application)}
            className="flex-1 rounded-md border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}