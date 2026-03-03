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

export interface ChapterDTO {
  _id:      string;
  title:    string;
  type:     'video' | 'text';
  isFree:   boolean;
  duration: number;
  content:  string | null;
  video:    string | null;
  order:    number;
}

export interface LessonDTO {
  _id:      string;
  title:    string;
  order:    number;
  chapters: ChapterDTO[];
}

export interface ModuleDTO {
  _id:     string;
  title:   string;
  order:   number;
  lessons: LessonDTO[];
}

export interface ThumbnailDTO {
  url: string;
  key: string;
}

export interface CourseListItemDTO {
  _id:         string;
  title:       string;
  subtitle:    string | null;
  description: string;
  tutorId:     string;
  status:      CourseStatus;
  level:       CourseLevel;
  category:    CourseCategory;
  language:    string;
  tags:        string[];
  price:       number;
  currency:    string;
  thumbnail:   ThumbnailDTO | null;
  createdAt:   string;
  updatedAt:   string;
}

export interface CourseDetailDTO extends CourseListItemDTO {
  modules: ModuleDTO[];
}

export interface PaginatedResult<T> {
  data:        T[];
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
}

export interface ListPublicCoursesParams {
  page?:      number;
  limit?:     number;
  search?:    string;
  level?:     CourseLevel | '';
  minPrice?:  number;
  maxPrice?:  number;
  tags?:      string[];
  sortBy?:    'price' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
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

export interface ThumbnailUploadUrlDTO {
  uploadUrl:  string;  
  key:        string;
  publicUrl:  string;
}

export interface AddModulePayload {
  title: string;
}

export interface UpdateModulePayload {
  title: string;
}

export interface ReorderModulesPayload {
  /** Ordered array of module IDs representing the new sequence */
  moduleIds: string[];
}

export interface AddLessonPayload {
  title: string;
}

export interface UpdateLessonPayload {
  title: string;
}

export interface ReorderLessonsPayload {
  lessonIds: string[];
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

export interface ReorderChaptersPayload {
  chapterIds: string[];
}

export interface GetVideoUploadUrlDTO {
  uploadUrl: string;   
  key:       string;
  expiresIn: number;   
}

export interface ConfirmVideoUploadPayload {
  key:      string;
  duration: number;    
}