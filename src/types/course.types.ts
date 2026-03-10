export const CourseStatus = {
  Draft:     'draft',
  Published: 'published',
  Archived:  'archived',
} as const;
export type CourseStatus = (typeof CourseStatus)[keyof typeof CourseStatus];

export const CourseLevel = {
  Beginner:     'beginner',
  Intermediate: 'intermediate',
  Advanced:     'advanced',
  All:          'all',
} as const;
export type CourseLevel = (typeof CourseLevel)[keyof typeof CourseLevel];

export type CourseCategory =
  | 'development' | 'design'    | 'business' | 'marketing'
  | 'photography' | 'music'     | 'health'   | 'other';

// Shared nested DTOs (used by both tutor and public views)

export interface VideoMetadataDTO {
  s3Key:      string;
  url:        string;
  size:       number;
  mimeType:   string;
  duration:   number;
  status:     'uploading' | 'ready' | 'failed';
  uploadedAt: string;
}

export interface ChapterDTO {
  id:       string;
  title:    string;
  order:    number;
  type:     'video' | 'text';
  duration: number;
  isFree:   boolean;
  content:  string | null;
  video:    VideoMetadataDTO | null;
}

export interface LessonDTO {
  id:          string;
  title:       string;
  description: string | null;
  order:       number;
  isPreview:   boolean;
  duration:    number;
  chapters:    ChapterDTO[];
}

export interface ModuleDTO {
  id:          string;
  title:       string;
  description: string | null;
  order:       number;
  duration:    number;
  lessons:     LessonDTO[];
}

// Tutor / Instructor DTOs
export interface TutorCourseListItemDTO {
  id:              string;
  title:           string;
  /** URL string (or null). NOT a { url, key } object. */
  thumbnail:       string | null;
  status:          CourseStatus;
  level:           CourseLevel;
  category:        CourseCategory;
  totalDuration:   number;
  enrollmentCount: number;
  updatedAt:       string;
  publishedAt:     string | null;
}


export interface CourseBasicDTO {
  id:              string;
  tutorId:         string;
  title:           string;
  subtitle:        string | null;
  description:     string;
  /** URL string (or null). */
  thumbnail:       string | null;
  category:        CourseCategory;
  level:           CourseLevel;
  language:        string;
  price:           number;
  currency:        string;
  tags:            string[];
  status:          CourseStatus;
  totalDuration:   number;
  enrollmentCount: number;
  publishedAt:     string | null;
  createdAt:       string;
  updatedAt:       string;
}


export interface CourseTutorDetailDTO extends CourseBasicDTO {
  modules: ModuleDTO[];
}

/** Shape of GET /api/instructor/courses response */
export interface TutorCoursesResponse {
  courses: TutorCourseListItemDTO[];
  pagination: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}

// Public DTOs

export interface PublicCourseListItemDTO {
  id:              string;
  tutorId:         string;
  title:           string;
  subtitle:        string | null;
  /** URL string (or null). */
  thumbnail:       string | null;
  category:        CourseCategory;
  level:           CourseLevel;
  language:        string;
  price:           number;
  currency:        string;
  tags:            string[];
  totalDuration:   number;
  enrollmentCount: number;
  publishedAt:     string | null;
}

export interface PublicChapterDTO {
  id:       string;
  title:    string;
  order:    number;
  type:     'video' | 'text';
  duration: number;
  isFree:   boolean;
  /** Only populated for free chapters */
  content:  string | null;
  /** Only populated for free video chapters */
  video:    VideoMetadataDTO | null;
}

export interface PublicLessonDTO {
  id:          string;
  title:       string;
  description: string | null;
  order:       number;
  isPreview:   boolean;
  duration:    number;
  chapters:    PublicChapterDTO[];
}

export interface PublicModuleDTO {
  id:          string;
  title:       string;
  description: string | null;
  order:       number;
  duration:    number;
  lessons:     PublicLessonDTO[];
}

/** Returned by GET /api/courses/:courseId */
export interface PublicCourseDetailDTO extends PublicCourseListItemDTO {
  description: string;
  modules:     PublicModuleDTO[];
}

/** Shape of GET /api/courses response */
export interface PublicCoursesResponse {
  courses: PublicCourseListItemDTO[];
  pagination: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}

// Query params

export interface ListTutorCoursesParams {
  page?:   number;
  limit?:  number;
  /** Pass empty string or omit to fetch all statuses */
  status?: CourseStatus | '';
}

export interface ListPublicCoursesParams {
  page?:     number;
  limit?:    number;
  search?:   string;
  category?: CourseCategory | '';
  level?:    CourseLevel | '';
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?:     'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | '';
}

// Request payloads

export interface CreateCoursePayload {
  title:       string;
  subtitle?:   string | null;
  description: string;
  category:    CourseCategory;
  level:       CourseLevel;
  language:    string;
  price?:      number;
  currency?:   string;
  tags?:       string[];
}

export interface UpdateCoursePayload {
  title?:       string;
  subtitle?:    string | null;
  description?: string;
  category?:    CourseCategory;
  level?:       CourseLevel;
  language?:    string;
  price?:       number;
  tags?:        string[];
}

export interface AddModulePayload {
  title:        string;
  description?: string | null;
}

export interface UpdateModulePayload {
  title?:       string;
  description?: string | null;
}

export interface ReorderPayload {
  orderedIds: string[];
}

export interface AddLessonPayload {
  title:        string;
  description?: string | null;
  isPreview?:   boolean;
}

export interface UpdateLessonPayload {
  title?:       string;
  description?: string | null;
  isPreview?:   boolean;
}

export interface AddChapterPayload {
  title:     string;
  type:      'video' | 'text';
  isFree?:   boolean;
  content?:  string;
  duration?: number;
}

export interface UpdateChapterPayload {
  title?:    string;
  type?:     'video' | 'text';
  isFree?:   boolean;
  content?:  string;
  duration?: number;
}

// Video upload (presigned S3 flow)

export interface GetVideoUploadUrlPayload {
  filename: string;
  mimeType: string;
  size:     number;
}

export interface GetVideoUploadUrlDTO {
  uploadUrl: string;
  s3Key:     string;
  expiresIn: number;
}

export interface ConfirmVideoUploadPayload {
  duration: number;
}