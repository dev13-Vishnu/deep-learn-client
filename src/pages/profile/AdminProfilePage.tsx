// ─── AdminProfilePage ─────────────────────────────────────────────────────────
// File: src/pages/profile/AdminProfilePage.tsx

import { useEffect, useState } from 'react';
import { profileApi, type ProfileData } from '../../api/profile.api';
import AvatarUpload from './components/AvatarUpload';
import ProfileEditForm from './components/ProfileEditForm';
import ProfileHeader from './components/ProfileHeader';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    setLoading(true);
    setLoadError(null);
    try {
      const { data } = await profileApi.getProfile();
      setProfile(data);
    } catch (err: any) {
      setLoadError(err?.response?.data?.message || 'Failed to load profile.');
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

  if (loadError || !profile) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Failed to load profile</h2>
          <p className="mt-2 text-sm text-red-700">{loadError ?? 'An unexpected error occurred.'}</p>
          <button
            onClick={loadProfile}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="mt-1 text-sm text-gray-600">Platform administration and account settings</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <p className="font-medium text-indigo-900">Administrator Account</p>
        <p className="text-sm text-indigo-700">Full system access enabled</p>
      </div>

      <div className="space-y-8">
        <AvatarUpload profile={profile} onUpdate={loadProfile} />

        {isEditing ? (
          <ProfileEditForm
            profile={profile}
            onSave={() => { setIsEditing(false); loadProfile(); }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <ProfileHeader profile={profile} />

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Platform Overview</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {[
                  { label: 'Total Users',  value: '—' },
                  { label: 'Instructors', value: '—' },
                  { label: 'Courses',     value: '—' },
                  { label: 'Revenue',     value: '₹—' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-md bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Manage Users', primary: true },
                  { label: 'Review Applications', primary: false },
                  { label: 'Manage Courses', primary: false },
                  { label: 'View Reports', primary: false },
                  { label: 'Platform Settings', primary: false },
                ].map(({ label, primary }) => (
                  <button
                    key={label}
                    className={`rounded-md px-4 py-2 text-sm ${
                      primary
                        ? 'bg-[color:var(--color-primary)] text-white hover:opacity-90'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}