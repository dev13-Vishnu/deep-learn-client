import { useState, useRef } from 'react';
import { profileApi, type ProfileData } from '../../../api/profile.api';
import { useNotify } from '../../../notifications/useNotify';

interface Props {
  profile: ProfileData;
  onUpdate: () => void;
}

export default function AvatarUpload({ profile, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notify = useNotify();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation — no alert(), show toast
    if (!file.type.startsWith('image/')) {
      notify('Please select an image file (JPG, PNG, GIF, or WebP).', 'error');
      return;
    }

    // File size validation — no alert()
    if (file.size > 5 * 1024 * 1024) {
      notify('File size must be less than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await profileApi.uploadAvatar(file);
      onUpdate();
      setPreview(null);
      notify('Profile picture updated.', 'success');
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Failed to upload photo.', 'error');
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await profileApi.deleteAvatar();
      onUpdate();
      setShowDeleteConfirm(false);
      notify('Profile picture removed.', 'success');
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Failed to remove photo.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const avatarUrl = preview || profile.avatarUrl;
  const isDisabled = uploading || deleting;

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>

      <div className="flex items-start gap-6">
        {/* Avatar preview */}
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile picture"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-3xl text-gray-400">
                {profile.firstName?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
              </span>
            </div>
          )}

          {/* Upload overlay spinner */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Upload Photo'}
          </button>

          {/* Remove button — only shown if there's an avatar and not already confirming */}
          {profile.avatarUrl && !showDeleteConfirm && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDisabled}
              className="rounded-md border px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Remove Photo
            </button>
          )}

          {/* Inline confirmation — replaces native confirm() */}
          {showDeleteConfirm && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-xs text-red-800 mb-2 font-medium">
                Remove your profile picture?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Removing…' : 'Yes, remove'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="rounded border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">JPG, PNG, GIF, or WebP. Max 5MB.</p>
        </div>
      </div>
    </div>
  );
}