import { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { profileApi, type ProfileData } from '../../../api/profile.api';
import { useNotify } from '../../../notifications/useNotify';

interface Props {
  profile: ProfileData;
  onUpdate: () => void;
}

// ─── Canvas helper ────────────────────────────────────────────────────────────
// Takes the original image dataURL + the pixel crop from react-easy-crop
// and returns a cropped File ready to hand to profileApi.uploadAvatar()
async function getCroppedFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string
): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('Canvas is empty')); return; }
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.92);
  });
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AvatarUpload({ profile, onUpdate }: Props) {
  const notify = useNotify();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload / delete state
  const [uploading, setUploading]           = useState(false);
  const [deleting, setDeleting]             = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Crop modal state
  const [cropSrc, setCropSrc]               = useState<string | null>(null);
  const [crop, setCrop]                     = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                     = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // ── File selected → validate → open crop modal ────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Please select an image file (JPG, PNG, GIF, or WebP).', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify('File size must be less than 5MB.', 'error');
      return;
    }

    // Read into dataURL for the cropper
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      // Reset crop position each time a new file is chosen
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected later
    e.target.value = '';
  };

  // ── Cancel crop ───────────────────────────────────────────────────────────
  const handleCropCancel = () => {
    setCropSrc(null);
    setCroppedAreaPixels(null);
  };

  // ── Confirm crop → generate File → upload ─────────────────────────────────
  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels) return;

    setUploading(true);
    try {
      const croppedFile = await getCroppedFile(cropSrc, croppedAreaPixels, 'avatar.jpg');
      setCropSrc(null);
      await profileApi.uploadAvatar(croppedFile);
      onUpdate();
      notify('Profile picture updated.', 'success');
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Failed to upload photo.', 'error');
    } finally {
      setUploading(false);
      setCroppedAreaPixels(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
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

  const isDisabled = uploading || deleting;

  return (
    <>
      {/* ── Crop modal ──────────────────────────────────────────────────── */}
      {cropSrc && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="text-sm font-medium text-white">Crop your photo</h3>
            <button
              onClick={handleCropCancel}
              className="text-gray-400 hover:text-white text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Cropper area */}
          <div className="relative flex-1">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="text-xs text-gray-400 w-10 shrink-0">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-white"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 px-6 pb-6">
            <button
              onClick={handleCropCancel}
              disabled={uploading}
              className="rounded-md border border-gray-600 px-5 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCropConfirm}
              disabled={uploading}
              className="rounded-md bg-white px-5 py-2 text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Apply & Upload'}
            </button>
          </div>
        </div>
      )}

      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>

        <div className="flex items-start gap-6">
          {/* Current avatar */}
          <div className="relative shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Profile picture"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl text-gray-400">
                  {profile.firstName?.[0]?.toUpperCase() ?? profile.email[0].toUpperCase()}
                </span>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
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
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDisabled}
              className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload Photo'}
            </button>

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
    </>
  );
}