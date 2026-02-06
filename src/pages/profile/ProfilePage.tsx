import { useEffect, useState } from 'react';
import { getMyProfile, type UserProfile } from '../../api/profile.api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await getMyProfile();
        setProfile(data);
        setError(null);
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      {!isEditing ? (
        <div className="space-y-4">
          <ProfileField label="First name" value={profile.firstName} />
          <ProfileField label="Last name" value={profile.lastName} />
          <ProfileField label="Bio" value={profile.bio} multiline />

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <ProfileEditForm
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onChange={setProfile}
        />
      )}
    </div>
  );
}

function ProfileField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string | null;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-gray-900 whitespace-pre-line">
        {value || '—'}
      </p>
    </div>
  );
}

function ProfileEditForm({
  profile,
  onCancel,
  onChange,
}: {
  profile: UserProfile;
  onCancel: () => void;
  onChange: (p: UserProfile) => void;
}) {
  return (
    <form className="space-y-4">
      <Input
        label="First name"
        value={profile.firstName ?? ''}
        onChange={(v) => onChange({ ...profile, firstName: v })}
      />

      <Input
        label="Last name"
        value={profile.lastName ?? ''}
        onChange={(v) => onChange({ ...profile, lastName: v })}
      />

      <Textarea
        label="Bio"
        value={profile.bio ?? ''}
        onChange={(v) => onChange({ ...profile, bio: v })}
      />

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled
          className="rounded-md bg-gray-400 px-4 py-2 text-white"
        >
          Save (next step)
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-1 w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}
