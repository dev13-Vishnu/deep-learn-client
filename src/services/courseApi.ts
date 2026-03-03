// src/services/courseApi.ts
import { apiClient } from '../lib/axios';
import type {
  PaginatedResult,
  CourseDetailDTO,
  CourseListItemDTO,
  ListPublicCoursesParams,
  ListTutorCoursesParams,
  CreateCoursePayload,
  UpdateCoursePayload,
  AddModulePayload,
  UpdateModulePayload,
  ReorderModulesPayload,
  AddLessonPayload,
  UpdateLessonPayload,
  ReorderLessonsPayload,
  AddChapterPayload,
  UpdateChapterPayload,
  ReorderChaptersPayload,
  GetVideoUploadUrlDTO,
  ConfirmVideoUploadPayload,
} from '../types/course.types';

// ---------------------------------------------------------------------------
// Server response envelope: { success: boolean; data: T; message?: string }
// Every function does:  const { data } = await apiClient.xxx(...)   ← axios unwrap
//                       return data.data                             ← envelope unwrap
// ---------------------------------------------------------------------------

// =============================================================================
// PUBLIC
// Server: GET /courses/          (no /public prefix)
// Server: GET /courses/:courseId
// =============================================================================

export async function listPublicCourses(
  params: ListPublicCoursesParams = {}
): Promise<PaginatedResult<CourseListItemDTO>> {
  const { data } = await apiClient.get('/courses', { params });
  return data.data;
}

export async function getPublicCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.get(`/courses/${courseId}`);
  return data.data;
}

// =============================================================================
// TUTOR — COURSE CRUD
// Server: GET    /courses/my
// Server: GET    /courses/my/:courseId
// Server: POST   /courses           (create — no /my prefix on this one)
// Server: PUT    /courses/my/:courseId
// Server: DELETE /courses/my/:courseId
// =============================================================================

export async function getMyCourses(
  params: ListTutorCoursesParams = {}
): Promise<PaginatedResult<CourseListItemDTO>> {
  const { data } = await apiClient.get('/courses/my', { params });
  return data.data;
}

export async function getMyCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.get(`/courses/my/${courseId}`);
  return data.data;
}

export async function createCourse(
  payload: CreateCoursePayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post('/courses', payload);
  return data.data;
}

export async function updateCourse(
  courseId: string,
  payload: UpdateCoursePayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.put(`/courses/my/${courseId}`, payload);
  return data.data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await apiClient.delete(`/courses/my/${courseId}`);
}

// =============================================================================
// TUTOR — LIFECYCLE
// Server: POST /courses/my/:courseId/publish
// Server: POST /courses/my/:courseId/unpublish
// Server: POST /courses/my/:courseId/archive
// =============================================================================

export async function publishCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(`/courses/my/${courseId}/publish`);
  return data.data;
}

export async function unpublishCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(`/courses/my/${courseId}/unpublish`);
  return data.data;
}

export async function archiveCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(`/courses/my/${courseId}/archive`);
  return data.data;
}

// =============================================================================
// TUTOR — THUMBNAIL
// Server: POST /courses/my/:courseId/thumbnail  (multipart/form-data)
// No presigned URL flow — server handles S3 internally.
// =============================================================================

export async function uploadThumbnail(
  courseId: string,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append('thumbnail', file);
  await apiClient.post(`/courses/my/${courseId}/thumbnail`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// =============================================================================
// TUTOR — MODULES
// Server: POST /courses/my/:courseId/modules
// Server: PUT  /courses/my/:courseId/modules/reorder   ← before /:moduleId
// Server: PUT  /courses/my/:courseId/modules/:moduleId
// Server: DELETE /courses/my/:courseId/modules/:moduleId
// =============================================================================

export async function addModule(
  courseId: string,
  payload: AddModulePayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(`/courses/my/${courseId}/modules`, payload);
  return data.data;
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  payload: UpdateModulePayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.put(
    `/courses/my/${courseId}/modules/${moduleId}`,
    payload
  );
  return data.data;
}

export async function removeModule(
  courseId: string,
  moduleId: string
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.delete(
    `/courses/my/${courseId}/modules/${moduleId}`
  );
  return data.data;
}

export async function reorderModules(
  courseId: string,
  payload: ReorderModulesPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.put(
    `/courses/my/${courseId}/modules/reorder`,
    payload
  );
  return data.data;
}

// =============================================================================
// TUTOR — LESSONS
// Server: POST   /courses/my/:courseId/modules/:moduleId/lessons
// Server: PUT    /courses/my/:courseId/modules/:moduleId/lessons/reorder
// Server: PUT    /courses/my/:courseId/modules/:moduleId/lessons/:lessonId
// Server: DELETE /courses/my/:courseId/modules/:moduleId/lessons/:lessonId
// =============================================================================

export async function addLesson(
  courseId: string,
  moduleId: string,
  payload: AddLessonPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(
    `/courses/my/${courseId}/modules/${moduleId}/lessons`,
    payload
  );
  return data.data;
}

export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: UpdateLessonPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.put(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    payload
  );
  return data.data;
}

export async function removeLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.delete(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/${lessonId}`
  );
  return data.data;
}

export async function reorderLessons(
  courseId: string,
  moduleId: string,
  payload: ReorderLessonsPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.put(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/reorder`,
    payload
  );
  return data.data;
}

// =============================================================================
// TUTOR — CHAPTERS
// Server: POST   /courses/my/:courseId/modules/:moduleId/lessons/:lessonId/chapters
// Server: PUT    /courses/my/.../chapters/reorder   ← before /:chapterId
// Server: PUT    /courses/my/.../chapters/:chapterId
// Server: DELETE /courses/my/.../chapters/:chapterId
// =============================================================================

export async function addChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: AddChapterPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters`,
    payload
  );
  return data.data;
}

export async function updateChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string,
  payload: UpdateChapterPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.put(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`,
    payload
  );
  return data.data;
}

export async function removeChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.delete(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`
  );
  return data.data;
}

export async function reorderChapters(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: ReorderChaptersPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.put(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/reorder`,
    payload
  );
  return data.data;
}

// =============================================================================
// TUTOR — VIDEO UPLOAD FLOW
// Server: POST /courses/my/.../chapters/:chapterId/video-upload-url
// Server: POST /courses/my/.../chapters/:chapterId/confirm-upload
// =============================================================================

/**
 * Step 1 — request a presigned S3 PUT URL from the server.
 */
export async function getVideoUploadUrl(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string
): Promise<GetVideoUploadUrlDTO> {
  const { data } = await apiClient.post(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}/video-upload-url`
  );
  return data.data;
}

/**
 * Step 2 — upload the raw file directly to S3 via the presigned URL.
 * XHR-based so the caller can receive live upload progress.
 */
export function uploadVideoToS3(
  presignedUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`S3 upload failed: ${xhr.status}`));
    xhr.onerror = () => reject(new Error('S3 upload network error'));
    xhr.send(file);
  });
}

/**
 * Step 3 — notify the server that the S3 upload completed.
 * Persists the key + measured duration on the chapter document.
 * Note: server path is /confirm-upload (not /confirm-video-upload).
 */
export async function confirmVideoUpload(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string,
  payload: ConfirmVideoUploadPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(
    `/courses/my/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}/confirm-upload`,
    payload
  );
  return data.data;
}