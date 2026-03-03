

export enum CourseStatus {
  Draft     = 'draft',
  Published = 'published',
  Archived  = 'archived',
}

export enum CourseLevel {
  Beginner     = 'beginner',
  Intermediate = 'intermediate',
  Advanced     = 'advanced',
}

export interface ChapterDTO {
  _id:      string;
  title:    string;
  type:     'video' | 'text';
  isFree:   boolean;
  duration: number;          
  /**
   * null when chapter is locked and the caller is not enrolled.
   * Present for free chapters and tutor-owned courses.
   */
  content:  string | null;
  /** null when locked — same gating rule as content */
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


/** Lightweight row — used in paginated list responses */
export interface CourseListItemDTO {
  _id:         string;
  title:       string;
  description: string;
  tutorId:     string;
  status:      CourseStatus;
  level:       CourseLevel;
  tags:        string[];
  price:       number;
  thumbnail:   ThumbnailDTO | null;
  createdAt:   string;
  updatedAt:   string;
}

/** Full detail — includes complete module/lesson/chapter tree */
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
  title:        string;
  description:  string;
  level:        CourseLevel;
  tags?:        string[];
  price:        number;
}

export interface UpdateCoursePayload {
  title?:       string;
  description?: string;
  level?:       CourseLevel;
  tags?:        string[];
  price?:       number;
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