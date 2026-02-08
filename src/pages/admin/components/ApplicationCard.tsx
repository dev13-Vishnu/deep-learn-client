import { type InstructorApplication } from '../../../api/admin.api';

interface Props {
  application: InstructorApplication;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ApplicationCard({ application, onApprove, onReject }: Props) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Application #{application.id.slice(-6)}</h3>
          <p className="text-sm text-gray-500">
            Submitted {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Experience</p>
          <p className="text-sm">{application.experienceYears} years</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Teaching Experience</p>
          <p className="text-sm">{application.teachingExperience === 'yes' ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Level</p>
          <p className="text-sm">{application.level}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Language</p>
          <p className="text-sm">{application.language}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
        <p className="text-sm whitespace-pre-wrap">{application.bio}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500 mb-1">Course Intent</p>
        <p className="text-sm whitespace-pre-wrap">{application.courseIntent}</p>
      </div>

      {application.rejectionReason && (
        <div className="mb-4 p-3 bg-red-50 rounded-md">
          <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason</p>
          <p className="text-sm text-red-700">{application.rejectionReason}</p>
        </div>
      )}

      {application.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(application.id)}
            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(application.id)}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}