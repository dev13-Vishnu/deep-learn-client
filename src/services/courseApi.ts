import { apiClient } from '../lib/axios';
import type {
  TutorCoursesResponse,
  CourseTutorDetailDTO,
  CourseBasicDTO,
  PublicCoursesResponse,
  PublicCourseDetailDTO,
  ModuleDTO,
  LessonDTO,
  ChapterDTO,
  ListTutorCoursesParams,
  ListPublicCoursesParams,
  CreateCoursePayload,
  UpdateCoursePayload,
  AddModulePayload,
  UpdateModulePayload,
  ReorderPayload,
  AddLessonPayload,
  UpdateLessonPayload,
  AddChapterPayload,
  UpdateChapterPayload,
  GetVideoUploadUrlPayload,
  GetVideoUploadUrlDTO,
  ConfirmVideoUploadPayload,
} from '../types/course.types';


export async function listPublicCourses(
  params: ListPublicCoursesParams = {}
): Promise<PublicCoursesResponse> {
    const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v !== undefined && v !== null) clean[k] = v;
  }
  const { data } = await apiClient.get('/api/courses', { params: clean });
    return { courses: data.courses, pagination: data.pagination };
}

export async function getPublicCourse(courseId: string): Promise<PublicCourseDetailDTO> {
  const { data } = await apiClient.get(`/api/courses/${courseId}`);
    return data.course;
}


export async function getMyCourses(
  params: ListTutorCoursesParams = {}
): Promise<TutorCoursesResponse> {
    const clean: Record<string, unknown> = {};
  if (params.page)   clean.page  = params.page;
  if (params.limit)  clean.limit = params.limit;
  if (params.status) clean.status = params.status;

  const { data } = await apiClient.get('/api/instructor/courses', { params: clean });
    return { courses: data.courses, pagination: data.pagination };
}

export async function getMyCourse(courseId: string): Promise<CourseTutorDetailDTO> {
  const { data } = await apiClient.get(`/api/instructor/courses/${courseId}`);
    return data.course;
}

export async function createCourse(payload: CreateCoursePayload): Promise<CourseBasicDTO> {
  const { data } = await apiClient.post('/api/instructor/courses', payload);
    return data.course;
}

export async function updateCourse(
  courseId: string,
  payload: UpdateCoursePayload
): Promise<CourseBasicDTO> {
  const { data } = await apiClient.put(`/api/instructor/courses/${courseId}`, payload);
  return data.course;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await apiClient.delete(`/api/instructor/courses/${courseId}`);
}


export async function uploadThumbnail(courseId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('thumbnail', file);
  const { data } = await apiClient.post(
    `/api/instructor/courses/${courseId}/thumbnail`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
    return data.thumbnailUrl;
}


export async function publishCourse(courseId: string): Promise<CourseBasicDTO> {
  const { data } = await apiClient.post(`/api/instructor/courses/${courseId}/publish`);
  return data.course;
}

export async function unpublishCourse(courseId: string): Promise<CourseBasicDTO> {
  const { data } = await apiClient.post(`/api/instructor/courses/${courseId}/unpublish`);
  return data.course;
}

export async function archiveCourse(courseId: string): Promise<CourseBasicDTO> {
  const { data } = await apiClient.post(`/api/instructor/courses/${courseId}/archive`);
  return data.course;
}


export async function addModule(
  courseId: string,
  payload: AddModulePayload
): Promise<ModuleDTO> {
  const { data } = await apiClient.post(
    `/api/instructor/courses/${courseId}/modules`,
    payload
  );
    return data.module;
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  payload: UpdateModulePayload
): Promise<ModuleDTO> {
  const { data } = await apiClient.put(
    `/api/instructor/courses/${courseId}/modules/${moduleId}`,
    payload
  );
    return data.module;
}

export async function removeModule(courseId: string, moduleId: string): Promise<void> {
  await apiClient.delete(`/api/instructor/courses/${courseId}/modules/${moduleId}`);
}

export async function reorderModules(
  courseId: string,
  payload: ReorderPayload
): Promise<void> {
  await apiClient.put(
    `/api/instructor/courses/${courseId}/modules/reorder`,
    payload
  );
}


export async function addLesson(
  courseId: string,
  moduleId: string,
  payload: AddLessonPayload
): Promise<LessonDTO> {
  const { data } = await apiClient.post(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons`,
    payload
  );
    return data.lesson;
}

export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: UpdateLessonPayload
): Promise<LessonDTO> {
  const { data } = await apiClient.put(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    payload
  );
  return data.lesson;
}

export async function removeLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<void> {
  await apiClient.delete(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
  );
}

export async function reorderLessons(
  courseId: string,
  moduleId: string,
  payload: ReorderPayload
): Promise<void> {
  await apiClient.put(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/reorder`,
    payload
  );
}


export async function addChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: AddChapterPayload
): Promise<ChapterDTO> {
  const { data } = await apiClient.post(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters`,
    payload
  );
    return data.chapter;
}

export async function updateChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string,
  payload: UpdateChapterPayload
): Promise<ChapterDTO> {
  const { data } = await apiClient.put(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`,
    payload
  );
  return data.chapter;
}

export async function removeChapter(
  courseId: string,
  moduleId: string,
  lessonId: string,
  chapterId: string
): Promise<void> {
  await apiClient.delete(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`
  );
}

export async function reorderChapters(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: ReorderPayload
): Promise<void> {
  await apiClient.put(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/reorder`,
    payload
  );
}


export async function getVideoUploadUrl(
  courseId:  string,
  moduleId:  string,
  lessonId:  string,
  chapterId: string,
  payload:   GetVideoUploadUrlPayload
): Promise<GetVideoUploadUrlDTO> {
  const { data } = await apiClient.post(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}/video-upload-url`,
    payload     );
    return { uploadUrl: data.uploadUrl, s3Key: data.s3Key, expiresIn: data.expiresIn };
}

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
        : reject(new Error(`S3 upload failed: ${xhr.status} ${xhr.statusText}`));

    xhr.onerror = () => reject(new Error('S3 upload: network error'));
    xhr.send(file);
  });
}

export async function confirmVideoUpload(
  courseId:  string,
  moduleId:  string,
  lessonId:  string,
  chapterId: string,
  payload:   ConfirmVideoUploadPayload   ): Promise<ChapterDTO> {
  const { data } = await apiClient.post(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}/confirm-upload`,
    payload
  );
    return data.chapter;
}