import { useRef, useState } from 'react';
import {
  getVideoUploadUrl,
  uploadVideoToS3,
  confirmVideoUpload,
} from '../../services/courseApi';
import { useNotify } from '../../notifications/useNotify';
import type { VideoMetadataDTO } from '../../types/course.types';

interface Props {
  courseId:  string;
  moduleId:  string;
  lessonId:  string;
  chapterId: string;
  existingVideo: VideoMetadataDTO | null;
  onSuccess: () => void;
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url   = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload   = 'metadata';
    video.onloadedmetadata = () => {
      const dur = Math.round(video.duration) || 0;
      URL.revokeObjectURL(url);
      resolve(dur);
    };
    video.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read video metadata.')); };
    video.src = url;
  });
}

const ACCEPTED = 'video/mp4,video/webm,video/ogg,video/quicktime';
const MAX_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

export default function VideoUploader({
  courseId, moduleId, lessonId, chapterId,
  existingVideo, onSuccess,
}: Props) {
  const notify      = useNotify();
  const inputRef    = useRef<HTMLInputElement>(null);

  const [phase,    setPhase]    = useState<'idle' | 'measuring' | 'requesting' | 'uploading' | 'confirming'>('idle');
  const [progress, setProgress] = useState(0);

  const busy = phase !== 'idle';

  async function handleFile(file: File) {
    if (!file.type.startsWith('video/')) {
      notify('Please select a video file (MP4, WebM, MOV…).', 'error');
      return;
    }
    if (file.size > MAX_BYTES) {
      notify('Video must be under 2 GB.', 'error');
      return;
    }

    try {
      setPhase('measuring');
      const duration = await getVideoDuration(file);

      setPhase('requesting');
      const { uploadUrl } = await getVideoUploadUrl(
        courseId, moduleId, lessonId, chapterId,
        { filename: file.name, mimeType: file.type, size: file.size }
      );

      setPhase('uploading');
      setProgress(0);
      await uploadVideoToS3(uploadUrl, file, setProgress);

      setPhase('confirming');
      await confirmVideoUpload(courseId, moduleId, lessonId, chapterId, { duration });

      notify('Video uploaded successfully.', 'success');
      onSuccess();
    } catch (err: any) {
      notify(err?.response?.data?.message ?? err?.message ?? 'Video upload failed.', 'error');
    } finally {
      setPhase('idle');
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const label = (() => {
    if (phase === 'measuring')  return 'Reading…';
    if (phase === 'requesting') return 'Preparing…';
    if (phase === 'uploading')  return `Uploading ${progress}%`;
    if (phase === 'confirming') return 'Saving…';
    return existingVideo ? 'Replace Video' : 'Upload Video';
  })();

  return (
    <div className="flex items-center gap-2">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Trigger button */}
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition"
      >
        {/* Upload icon */}
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
        </svg>
        {label}
      </button>

      {/* Upload progress bar */}
      {phase === 'uploading' && (
        <div className="w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[color:var(--color-primary)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Existing video status */}
      {existingVideo && phase === 'idle' && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          existingVideo.status === 'ready'    ? 'bg-green-100 text-green-700' :
          existingVideo.status === 'failed'   ? 'bg-red-100 text-red-700'    :
                                                'bg-yellow-100 text-yellow-700'
        }`}>
          {existingVideo.status}
        </span>
      )}
    </div>
  );
}