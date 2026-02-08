import { useState, useRef } from 'react';
import { profileApi, type ProfileData } from '../../../api/profile.api';

interface Props {
  profile: ProfileData;
  onUpdate: () => void;
}

export default function AvatarUpload({ profile, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await profileApi.uploadAvatar(file);
      onUpdate();
      setPreview(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to upload avatar');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your avatar?')) return;

    try {
      await profileApi.deleteAvatar();
      onUpdate();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete avatar');
    }
  };

  const avatarUrl = preview || profile.avatarUrl;

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>

      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-3xl text-gray-400">
                {profile.firstName?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
              </span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>

          {profile.avatarUrl && (
            <button
              onClick={handleDelete}
              disabled={uploading}
              className="rounded-md border px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Delete Photo
            </button>
          )}

          <p className="text-xs text-gray-500">
            JPG, PNG, or GIF. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}