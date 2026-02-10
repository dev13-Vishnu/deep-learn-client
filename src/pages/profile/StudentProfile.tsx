import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { profileApi, type ProfileData } from '../../api/profile.api';
import { useNavigate } from 'react-router-dom';
import AvatarUpload from './components/AvatarUpload';
import ProfileEditForm from './components/ProfileEditForm';
import ProfileHeader from './components/ProfileHeader';

export default function StudentProfilePage() {
//   const { user, instructorState } = useAuth();
//   const navigate = useNavigate();
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
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account and preferences
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Become Instructor CTA */}
      {/* {(!instructorState || instructorState === 'not_applied') && (
        <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900">
                Become an Instructor
              </h3>
              <p className="mt-1 text-sm text-purple-700">
                Share your knowledge and earn by teaching thousands of students worldwide.
              </p>
              <button
                onClick={() => navigate('/instructor/apply')}
                className="mt-3 rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Application Status for students who applied */}
      {/* {instructorState === 'pending' && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2">
              <svg
                className="h-5 w-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-yellow-900">
                Instructor Application Pending
              </p>
              <p className="text-sm text-yellow-700">
                Your application is being reviewed.
              </p>
            </div>
            <button
              onClick={() => navigate('/instructor/status')}
              className="rounded-md border border-yellow-300 bg-yellow-100 px-3 py-1 text-sm text-yellow-800 hover:bg-yellow-200"
            >
              View Status
            </button>
          </div>
        </div>
      )} */}

      {/* {instructorState === 'rejected' && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-red-900">
                Instructor Application Not Approved
              </p>
              <p className="text-sm text-red-700">
                You can apply again with updated information.
              </p>
            </div>
            <button
              onClick={() => navigate('/instructor/status')}
              className="rounded-md border border-red-300 bg-red-100 px-3 py-1 text-sm text-red-800 hover:bg-red-200"
            >
              View Details
            </button>
          </div>
        </div>
      )} */}

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
            
            {/* Student-specific sections */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">My Learning</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                  <p className="mt-1 text-2xl font-bold">0</p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="mt-1 text-2xl font-bold">0</p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Certificates</p>
                  <p className="mt-1 text-2xl font-bold">0</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90">
                  Browse Courses
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  My Courses
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  Wishlist
                </button>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  Purchase History
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}