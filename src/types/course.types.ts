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


export interface VideoMetadataDTO {
  s3Key:      string;
  url:        string;
  size:       number;
  mimeType:   string;
  duration:   number;
  status:     'pending' | 'processing' | 'ready' | 'failed';
  uploadedAt: string;
}

export interface ChapterDTO {
  id:       string;
  title:    string;
  order:    number;
  type:     'video' | 'text';
  isFree:   boolean;
  duration: number;
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

export interface TutorCourseListItemDTO {
  id:              string;
  title:           string;
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

export type CourseListItemDTO  = TutorCourseListItemDTO;
export type CourseDetailDTO    = CourseTutorDetailDTO;

export interface PublicCourseListItemDTO {
  id:              string;
  tutorId:         string;
  title:           string;
  subtitle:        string | null;
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

export interface PublicCourseDetailDTO extends PublicCourseListItemDTO {
  description: string;
  modules:     ModuleDTO[];
}


export interface PaginationMeta {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  courses:    T[];
  pagination: PaginationMeta;
}


export interface ListPublicCoursesParams {
  page?:     number;
  limit?:    number;
  search?:   string;
  category?: CourseCategory;
  level?:    CourseLevel | '';
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?:     'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';
}

export interface ListTutorCoursesParams {
  page?:   number;
  limit?:  number;
  status?: CourseStatus | '';
  search?: string;
}


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

export interface ReorderModulesPayload {
  orderedIds: string[];   }


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

export interface ReorderLessonsPayload {
  orderedIds: string[];   }


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

export interface ReorderChaptersPayload {
  orderedIds: string[];   }


export interface GetVideoUploadUrlRequestBody {
  filename: string;
  mimeType: string;
  size:     number;
}

export interface GetVideoUploadUrlDTO {
  uploadUrl: string;
  s3Key:     string;      expiresIn: number;
}

export interface ConfirmVideoUploadPayload {
  duration: number;     }


export interface TutorCoursesResponse {
  courses:    TutorCourseListItemDTO[];
  pagination: PaginationMeta;
}

export interface PublicCoursesResponse {
  courses:    PublicCourseListItemDTO[];
  pagination: PaginationMeta;
}

export interface ReorderPayload {
  orderedIds: string[];
}

export interface GetVideoUploadUrlPayload {
  filename: string;
  mimeType: string;
  size:     number;
}