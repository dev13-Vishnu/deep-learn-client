import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { profileApi, type ProfileData } from '../../api/profile.api';
import AvatarUpload from './components/AvatarUpload';
import ProfileEditForm from './components/ProfileEditForm';
import ProfileHeader from './components/ProfileHeader';

export default function AdminProfilePage() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]" />
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
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Platform administration and account settings
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Admin Role Badge */}
      <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-100 p-2">
            <svg
              className="h-5 w-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6l7 4-7 4-7-4 7-4zm0 10v-6"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-indigo-900">Administrator Account</p>
            <p className="text-sm text-indigo-700">
              Full system access enabled
            </p>
          </div>
        </div>
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
          <>
            <ProfileHeader profile={profile} />

            {/* Admin Dashboard Overview */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Platform Overview
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="mt-1 text-2xl font-bold">—</p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Instructors</p>
                  <p className="mt-1 text-2xl font-bold">—</p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Courses</p>
                  <p className="mt-1 text-2xl font-bold">—</p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="mt-1 text-2xl font-bold">₹—</p>
                </div>
              </div>
            </div>

            {/* Admin Quick Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90">
                  Manage Users
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  Review Instructor Applications
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  Manage Courses
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  View Reports
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  Platform Settings
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
