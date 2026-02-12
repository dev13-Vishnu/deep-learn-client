import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { profileApi, type ProfileData } from '../../api/profile.api';
import AvatarUpload from './components/AvatarUpload';
import ProfileEditForm from './components/ProfileEditForm';
import ProfileHeader from './components/ProfileHeader';

export default function InstructorProfilePage() {
  const { instructorState } = useAuth();
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
        <div>
          <h1 className="text-3xl font-bold">Instructor Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your instructor profile and settings
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Instructor Status Badge */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-blue-900">Instructor Account</p>
            <p className="text-sm text-blue-700">
              Status: {instructorState === 'approved' ? 'Approved' : instructorState}
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
            
            {/* Instructor-specific sections */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Instructor Dashboard</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="mt-1 text-2xl font-bold">0</p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="mt-1 text-2xl font-bold">0</p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="mt-1 text-2xl font-bold">-</p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="mt-1 text-2xl font-bold">₹0</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90">
                  Create New Course
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  View My Courses
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  Analytics
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  Earnings
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}