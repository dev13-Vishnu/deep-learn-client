import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { profileApi, type ProfileData } from '../../api/profile.api';
import ProfileHeader from './components/ProfileHeader';
import ProfileEditForm from './components/ProfileEditForm';
import AvatarUpload from './components/AvatarUpload';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data } = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-center text-red-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="space-y-8">
        <AvatarUpload profile={profile} onUpdate={loadProfile} />

        {isEditing ? (
          <ProfileEditForm
            profile={profile}
            onSave={() => {
              setIsEditing(false);
              loadProfile();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileHeader profile={profile} />
        )}
      </div>
    </div>
  );
}