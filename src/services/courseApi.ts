import { apiClient } from '../lib/axios';
import type {
  PaginatedResult,
  CourseDetailDTO,
  CourseListItemDTO,
  ListPublicCoursesParams,
  ListTutorCoursesParams,
  CreateCoursePayload,
  UpdateCoursePayload,
  ThumbnailUploadUrlDTO,
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


/** GET /courses/public — paginated published course listing with filters */
export async function listPublicCourses(
  params: ListPublicCoursesParams = {}
): Promise<PaginatedResult<CourseListItemDTO>> {
  const { data } = await apiClient.get('/courses/public', { params });
  return data.data;
}

/** GET /courses/public/:courseId — public course detail with chapter gating applied */
export async function getPublicCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.get(`/courses/public/${courseId}`);
  return data.data;
}


/** GET /tutor/courses — tutor's own paginated course list */
export async function getMyCourses(
  params: ListTutorCoursesParams = {}
): Promise<PaginatedResult<CourseListItemDTO>> {
  const { data } = await apiClient.get('/tutor/courses', { params });
  return data.data;
}

/** GET /tutor/courses/:id — full course detail for one tutor course */
export async function getMyCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.get(`/tutor/courses/${courseId}`);
  return data.data;
}

/** POST /tutor/courses — create a new draft course */
export async function createCourse(
  payload: CreateCoursePayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post('/tutor/courses', payload);
  return data.data;
}

/** PATCH /tutor/courses/:id — update course metadata */
export async function updateCourse(
  courseId: string,
  payload: UpdateCoursePayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(`/tutor/courses/${courseId}`, payload);
  return data.data;
}

/** DELETE /tutor/courses/:id — hard-delete a draft course */
export async function deleteCourse(courseId: string): Promise<void> {
  await apiClient.delete(`/tutor/courses/${courseId}`);
}


/** PATCH /tutor/courses/:id/publish */
export async function publishCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(`/tutor/courses/${courseId}/publish`);
  return data.data;
}

/** PATCH /tutor/courses/:id/unpublish */
export async function unpublishCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(`/tutor/courses/${courseId}/unpublish`);
  return data.data;
}

/** PATCH /tutor/courses/:id/archive */
export async function archiveCourse(courseId: string): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(`/tutor/courses/${courseId}/archive`);
  return data.data;
}


/**
 * Full thumbnail upload convenience function.
 * 1. Fetches a presigned S3 PUT URL from the server.
 * 2. Uploads the file directly to S3.
 * Returns the publicUrl so the UI can show an immediate preview.
 */
export async function uploadThumbnail(
  courseId: string,
  file: File
): Promise<string> {

  const { data: urlRes } = await apiClient.get<{ data: ThumbnailUploadUrlDTO }>(
    `/tutor/courses/${courseId}/thumbnail-upload-url`
  );
  const { uploadUrl, publicUrl } = urlRes.data;


  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  return publicUrl;
}


/** POST /tutor/courses/:courseId/modules */
export async function addModule(
  courseId: string,
  payload: AddModulePayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(`/tutor/courses/${courseId}/modules`, payload);
  return data.data;
}

/** PATCH /tutor/courses/:courseId/modules/:moduleId */
export async function updateModule(
  courseId: string,
  moduleId: string,
  payload: UpdateModulePayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(
    `/tutor/courses/${courseId}/modules/${moduleId}`,
    payload
  );
  return data.data;
}

/** DELETE /tutor/courses/:courseId/modules/:moduleId */
export async function removeModule(
  courseId: string,
  moduleId: string
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.delete(
    `/tutor/courses/${courseId}/modules/${moduleId}`
  );
  return data.data;
}

/**
 * PATCH /tutor/courses/:courseId/modules/reorder
 * Note: the server registers /reorder before /:moduleId — always safe to call.
 */
export async function reorderModules(
  courseId: string,
  payload: ReorderModulesPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(
    `/tutor/courses/${courseId}/modules/reorder`,
    payload
  );
  return data.data;
}


/** POST /tutor/courses/:courseId/modules/:moduleId/lessons */
export async function addLesson(
  courseId: string,
  moduleId: string,
  payload: AddLessonPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons`,
    payload
  );
  return data.data;
}

/** PATCH /tutor/courses/:courseId/modules/:moduleId/lessons/:lessonId */
export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: UpdateLessonPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    payload
  );
  return data.data;
}

/** DELETE /tutor/courses/:courseId/modules/:moduleId/lessons/:lessonId */
export async function removeLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.delete(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
  );
  return data.data;
}

/** PATCH /tutor/courses/:courseId/modules/:moduleId/lessons/reorder */
export async function reorderLessons(
  courseId: string,
  moduleId: string,
  payload: ReorderLessonsPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/reorder`,
    payload
  );
  return data.data;
}


/** POST /tutor/courses/:courseId/modules/:moduleId/lessons/:lessonId/chapters */
export async function addChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: AddChapterPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.post(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters`,
    payload
  );
  return data.data;
}

/** PATCH ...chapters/:chapterId */
export async function updateChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string,
  payload: UpdateChapterPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`,
    payload
  );
  return data.data;
}

/** DELETE ...chapters/:chapterId */
export async function removeChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.delete(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`
  );
  return data.data;
}

/** PATCH ...chapters/reorder */
export async function reorderChapters(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: ReorderChaptersPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/reorder`,
    payload
  );
  return data.data;
}


/** GET ...chapters/:chapterId/video-upload-url — returns presigned S3 PUT URL */
export async function getVideoUploadUrl(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string
): Promise<GetVideoUploadUrlDTO> {
  const { data } = await apiClient.get(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}/video-upload-url`
  );
  return data.data;
}

/**
 * Upload raw video to S3 via presigned URL.
 * Uses XHR so the caller can track upload progress.
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
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload  = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`S3 upload failed: ${xhr.status}`));
    xhr.onerror = () => reject(new Error('S3 upload network error'));
    xhr.send(file);
  });
}

/** PATCH ...chapters/:chapterId/confirm-video-upload — saves key + duration on chapter */
export async function confirmVideoUpload(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string,
  payload: ConfirmVideoUploadPayload
): Promise<CourseDetailDTO> {
  const { data } = await apiClient.patch(
    `/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}/confirm-video-upload`,
    payload
  );
  return data.data;
}