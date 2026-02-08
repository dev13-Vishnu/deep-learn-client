import { type ProfileData } from '../../../api/profile.api';

interface Props {
  profile: ProfileData;
}

export default function ProfileHeader({ profile }: Props) {
  const roleLabel = {
    0: 'Student',
    1: 'Instructor',
    2: 'Admin',
  }[profile.role] || 'User';

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Email
          </label>
          <p className="text-base">{profile.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Name
          </label>
          <p className="text-base">{profile.firstName || '—'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Bio
          </label>
          <p className="text-base whitespace-pre-wrap">{profile.bio || '—'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Role
          </label>
          <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            {roleLabel}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Member Since
          </label>
          <p className="text-base">
            {new Date(profile.createdAt).toLocaleDateString('en-US', {
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