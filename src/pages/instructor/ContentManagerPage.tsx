import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  getMyCourse,
  addModule,    updateModule,    removeModule,    reorderModules,
  addLesson,    updateLesson,    removeLesson,    reorderLessons,
  addChapter,   updateChapter,   removeChapter,   reorderChapters,
} from '../../services/courseApi';
import { useNotify } from '../../notifications/useNotify';
import VideoUploader from '../../components/course/VideoUploader';
import type {
  ModuleDTO, LessonDTO, ChapterDTO,
  AddModulePayload, UpdateModulePayload,
  AddLessonPayload, UpdateLessonPayload,
  AddChapterPayload, UpdateChapterPayload,
} from '../../types/course.types';

// Modal state

type ModalState =
  | { kind: 'add-module' }
  | { kind: 'edit-module';   module:  ModuleDTO }
  | { kind: 'del-module';    module:  ModuleDTO }
  | { kind: 'add-lesson';    moduleId: string }
  | { kind: 'edit-lesson';   moduleId: string; lesson: LessonDTO }
  | { kind: 'del-lesson';    moduleId: string; lesson: LessonDTO }
  | { kind: 'add-chapter';   moduleId: string; lessonId: string }
  | { kind: 'edit-chapter';  moduleId: string; lessonId: string; chapter: ChapterDTO }
  | { kind: 'del-chapter';   moduleId: string; lessonId: string; chapter: ChapterDTO }
  | null;

// Generic modal shell

function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// Shared field components

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-[color:var(--color-danger)]">{error}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      type="text" value={value} placeholder={placeholder} disabled={disabled}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; disabled?: boolean;
}) {
  return (
    <textarea
      rows={rows} value={value} placeholder={placeholder} disabled={disabled}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-2 py-2 text-sm resize-none"
    />
  );
}

function ModalActions({ onCancel, submitLabel, disabled }: {
  onCancel: () => void; submitLabel: string; disabled?: boolean;
}) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button type="button" onClick={onCancel} disabled={disabled}
        className="rounded-[var(--radius-md)] border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
        Cancel
      </button>
      <button type="submit" disabled={disabled}
        className="rounded-[var(--radius-md)] bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60">
        {disabled ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}

// Drag handle

function DragHandle({ listeners, attributes }: { listeners?: object; attributes?: object }) {
  return (
    <span
      {...(listeners ?? {})} {...(attributes ?? {})}
      className="cursor-grab touch-none select-none text-gray-300 hover:text-gray-500 px-1"
      title="Drag to reorder"
    >
      ⠿
    </span>
  );
}

// Sortable wrapper

function SortableRow({ id, children }: {
  id: string;
  children: (props: { dragHandleListeners?: object; dragHandleAttributes?: object; isDragging: boolean }) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
    >
      {children({ dragHandleListeners: listeners, dragHandleAttributes: attributes, isDragging })}
    </div>
  );
}

// Icon buttons

function IconBtn({ onClick, title, disabled, children, danger }: {
  onClick: () => void; title: string; disabled?: boolean; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} title={title} disabled={disabled}
      className={`rounded p-1 text-xs transition disabled:opacity-40 ${
        danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      }`}>
      {children}
    </button>
  );
}

const EditIcon = () => <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const DeleteIcon = () => <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PlusIcon = () => <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Duration formatter

function fmtDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// Chapter row

function ChapterRow({ chapter, courseId, moduleId, lessonId, onEdit, onDelete, onVideoSuccess, disabled }: {
  chapter: ChapterDTO;
  courseId: string; moduleId: string; lessonId: string;
  onEdit: (c: ChapterDTO) => void;
  onDelete: (c: ChapterDTO) => void;
  onVideoSuccess: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm">
      <span className="w-4 text-center text-xs text-gray-400">{chapter.order}</span>
      <span className="flex-1 truncate text-xs font-medium">{chapter.title}</span>

      {/* Badges */}
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        chapter.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
      }`}>{chapter.type}</span>
      {chapter.isFree && (
        <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">free</span>
      )}
      {chapter.duration > 0 && (
        <span className="shrink-0 text-xs text-gray-400">{fmtDuration(chapter.duration)}</span>
      )}

      {/* Video upload (only for video chapters) */}
      {chapter.type === 'video' && (
        <VideoUploader
          courseId={courseId} moduleId={moduleId} lessonId={lessonId} chapterId={chapter.id}
          existingVideo={chapter.video}
          onSuccess={onVideoSuccess}
        />
      )}

      <IconBtn onClick={() => onEdit(chapter)} title="Edit chapter" disabled={disabled}><EditIcon /></IconBtn>
      <IconBtn onClick={() => onDelete(chapter)} title="Delete chapter" disabled={disabled} danger><DeleteIcon /></IconBtn>
    </div>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function ContentManagerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate     = useNavigate();
  const notify       = useNotify();
  const qc           = useQueryClient();
  const sensors      = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalState>(null);

  const queryKey = ['tutor-course', courseId];
  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey }), [qc, courseId]);

  const { data: course, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => getMyCourse(courseId!),
    enabled: !!courseId,
  });

  // Mutations

  function useMut<TArgs>(fn: (args: TArgs) => Promise<any>, successMsg: string, errorMsg: string) {
    return useMutation({
      mutationFn: fn,
      onSuccess: () => { notify(successMsg, 'success'); invalidate(); setModal(null); },
      onError: (e: any) => notify(e?.response?.data?.message ?? errorMsg, 'error'),
    });
  }

  const addModuleMut     = useMut((p: AddModulePayload)                               => addModule(courseId!, p),            'Module added.',   'Failed to add module.');
  const editModuleMut    = useMut((p: { id: string } & UpdateModulePayload)            => updateModule(courseId!, p.id, p),   'Module updated.', 'Failed to update module.');
  const delModuleMut     = useMut((id: string)                                         => removeModule(courseId!, id),        'Module deleted.', 'Failed to delete module.');
  const reorderModMut    = useMutation({ mutationFn: (ids: string[]) => reorderModules(courseId!, { orderedIds: ids }), onError: () => { notify('Reorder failed.', 'error'); invalidate(); } });

  const addLessonMut     = useMut((p: { moduleId: string } & AddLessonPayload)         => addLesson(courseId!, p.moduleId, p),                'Lesson added.',   'Failed to add lesson.');
  const editLessonMut    = useMut((p: { moduleId: string; id: string } & UpdateLessonPayload) => updateLesson(courseId!, p.moduleId, p.id, p), 'Lesson updated.', 'Failed to update lesson.');
  const delLessonMut     = useMut((p: { moduleId: string; id: string })                => removeLesson(courseId!, p.moduleId, p.id),          'Lesson deleted.', 'Failed to delete lesson.');
  const reorderLessMut   = useMutation({ mutationFn: (p: { moduleId: string; ids: string[] }) => reorderLessons(courseId!, p.moduleId, { orderedIds: p.ids }), onError: () => { notify('Reorder failed.', 'error'); invalidate(); } });

  const addChapterMut    = useMut((p: { moduleId: string; lessonId: string } & AddChapterPayload)                    => addChapter(courseId!, p.moduleId, p.lessonId, p),           'Chapter added.',   'Failed to add chapter.');
  const editChapterMut   = useMut((p: { moduleId: string; lessonId: string; id: string } & UpdateChapterPayload)    => updateChapter(courseId!, p.moduleId, p.lessonId, p.id, p), 'Chapter updated.', 'Failed to update chapter.');
  const delChapterMut    = useMut((p: { moduleId: string; lessonId: string; id: string })                           => removeChapter(courseId!, p.moduleId, p.lessonId, p.id),    'Chapter deleted.', 'Failed to delete chapter.');
  const reorderChapMut   = useMutation({ mutationFn: (p: { moduleId: string; lessonId: string; ids: string[] }) => reorderChapters(courseId!, p.moduleId, p.lessonId, { orderedIds: p.ids }), onError: () => { notify('Reorder failed.', 'error'); invalidate(); } });

  // DnD handlers

  function handleModuleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !course) return;
    const ids  = course.modules.map(m => m.id);
    const from = ids.indexOf(active.id as string);
    const to   = ids.indexOf(over.id as string);
    const next = arrayMove(ids, from, to);
    // Optimistic: update cache directly
    qc.setQueryData(queryKey, { ...course, modules: arrayMove(course.modules, from, to) });
    reorderModMut.mutate(next);
  }

  function handleLessonDragEnd(moduleId: string, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !course) return;
    const mod  = course.modules.find(m => m.id === moduleId);
    if (!mod) return;
    const ids  = mod.lessons.map(l => l.id);
    const from = ids.indexOf(active.id as string);
    const to   = ids.indexOf(over.id as string);
    const next = arrayMove(ids, from, to);
    const newModules = course.modules.map(m => m.id === moduleId ? { ...m, lessons: arrayMove(m.lessons, from, to) } : m);
    qc.setQueryData(queryKey, { ...course, modules: newModules });
    reorderLessMut.mutate({ moduleId, ids: next });
  }

  function handleChapterDragEnd(moduleId: string, lessonId: string, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !course) return;
    const mod = course.modules.find(m => m.id === moduleId);
    const les = mod?.lessons.find(l => l.id === lessonId);
    if (!les) return;
    const ids  = les.chapters.map(c => c.id);
    const from = ids.indexOf(active.id as string);
    const to   = ids.indexOf(over.id as string);
    const next = arrayMove(ids, from, to);
    const newModules = course.modules.map(m => m.id === moduleId
      ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, chapters: arrayMove(l.chapters, from, to) } : l) }
      : m
    );
    qc.setQueryData(queryKey, { ...course, modules: newModules });
    reorderChapMut.mutate({ moduleId, lessonId, ids: next });
  }

  // Expand/collapse helpers

  const toggleModule = (id: string) => setExpandedModules(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleLesson = (id: string) => setExpandedLessons(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // Early returns

  if (isLoading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]" />
    </div>
  );

  if (isError || !course) return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-900">Failed to load course</p>
        <button onClick={() => navigate('/instructor/dashboard')} className="mt-4 rounded border px-4 py-2 text-sm hover:bg-gray-50">Back to dashboard</button>
      </div>
    </div>
  );

  const anyPending =
    addModuleMut.isPending   || editModuleMut.isPending  || delModuleMut.isPending  ||
    addLessonMut.isPending   || editLessonMut.isPending  || delLessonMut.isPending  ||
    addChapterMut.isPending  || editChapterMut.isPending || delChapterMut.isPending;

  // Render─

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/instructor/dashboard')}
          className="mb-3 flex items-center gap-1 text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]">
          ← Dashboard
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{course.title}</h1>
            <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">Content Manager</p>
          </div>
          <button onClick={() => setModal({ kind: 'add-module' })}
            className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-md)] bg-[color:var(--color-primary)] px-4 py-2 text-sm text-white hover:opacity-90">
            <PlusIcon /> Add Module
          </button>
        </div>
      </div>

      {/* Empty state */}
      {course.modules.length === 0 && (
        <div className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-gray-50 py-20 text-center">
          <p className="text-sm text-[color:var(--color-muted)]">No modules yet. Add your first module to get started.</p>
          <button onClick={() => setModal({ kind: 'add-module' })}
            className="mt-4 rounded-[var(--radius-md)] bg-[color:var(--color-primary)] px-5 py-2 text-sm text-white hover:opacity-90">
            Add Module
          </button>
        </div>
      )}

      {/* Module list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
        <SortableContext items={course.modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {course.modules.map((mod) => {
              const modExpanded = expandedModules.has(mod.id);
              return (
                <SortableRow key={mod.id} id={mod.id}>
                  {({ dragHandleListeners, dragHandleAttributes, isDragging }) => (
                    <div className={`rounded-lg border bg-white ${isDragging ? 'shadow-lg' : 'border-[color:var(--color-border)]'}`}>

                      {/* Module header */}
                      <div className="flex items-center gap-2 px-3 py-3">
                        <DragHandle listeners={dragHandleListeners} attributes={dragHandleAttributes} />
                        <button type="button" onClick={() => toggleModule(mod.id)} className="text-gray-400">
                          <ChevronIcon open={modExpanded} />
                        </button>
                        <span className="flex-1 text-sm font-semibold truncate">{mod.title}</span>
                        {mod.duration > 0 && <span className="text-xs text-[color:var(--color-muted)]">{fmtDuration(mod.duration)}</span>}
                        <IconBtn onClick={() => setModal({ kind: 'add-lesson', moduleId: mod.id })} title="Add lesson" disabled={anyPending}><PlusIcon /></IconBtn>
                        <IconBtn onClick={() => setModal({ kind: 'edit-module', module: mod })} title="Edit module" disabled={anyPending}><EditIcon /></IconBtn>
                        <IconBtn onClick={() => setModal({ kind: 'del-module', module: mod })} title="Delete module" disabled={anyPending} danger><DeleteIcon /></IconBtn>
                      </div>

                      {/* Lessons */}
                      {modExpanded && (
                        <div className="border-t border-[color:var(--color-border)] bg-gray-50 px-4 py-3">
                          {mod.lessons.length === 0 ? (
                            <p className="py-4 text-center text-xs text-[color:var(--color-muted)]">No lessons. Add one above.</p>
                          ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleLessonDragEnd(mod.id, e)}>
                              <SortableContext items={mod.lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
                                <div className="flex flex-col gap-2">
                                  {mod.lessons.map((les) => {
                                    const lesExpanded = expandedLessons.has(les.id);
                                    return (
                                      <SortableRow key={les.id} id={les.id}>
                                        {({ dragHandleListeners: lDL, dragHandleAttributes: lDA, isDragging: lDrag }) => (
                                          <div className={`rounded-md border bg-white ${lDrag ? 'shadow-md' : 'border-[color:var(--color-border)]'}`}>

                                            {/* Lesson header */}
                                            <div className="flex items-center gap-2 px-3 py-2.5">
                                              <DragHandle listeners={lDL} attributes={lDA} />
                                              <button type="button" onClick={() => toggleLesson(les.id)} className="text-gray-400">
                                                <ChevronIcon open={lesExpanded} />
                                              </button>
                                              <span className="flex-1 truncate text-xs font-medium">{les.title}</span>
                                              {les.isPreview && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">preview</span>}
                                              {les.duration > 0 && <span className="text-xs text-[color:var(--color-muted)]">{fmtDuration(les.duration)}</span>}
                                              <IconBtn onClick={() => setModal({ kind: 'add-chapter', moduleId: mod.id, lessonId: les.id })} title="Add chapter" disabled={anyPending}><PlusIcon /></IconBtn>
                                              <IconBtn onClick={() => setModal({ kind: 'edit-lesson', moduleId: mod.id, lesson: les })} title="Edit lesson" disabled={anyPending}><EditIcon /></IconBtn>
                                              <IconBtn onClick={() => setModal({ kind: 'del-lesson', moduleId: mod.id, lesson: les })} title="Delete lesson" disabled={anyPending} danger><DeleteIcon /></IconBtn>
                                            </div>

                                            {/* Chapters */}
                                            {lesExpanded && (
                                              <div className="border-t border-[color:var(--color-border)] bg-gray-50 px-3 py-2">
                                                {les.chapters.length === 0 ? (
                                                  <p className="py-3 text-center text-xs text-[color:var(--color-muted)]">No chapters. Add one above.</p>
                                                ) : (
                                                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleChapterDragEnd(mod.id, les.id, e)}>
                                                    <SortableContext items={les.chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                                      <div className="flex flex-col gap-1.5">
                                                        {les.chapters.map((chap) => (
                                                          <SortableRow key={chap.id} id={chap.id}>
                                                            {({ dragHandleListeners: cDL, dragHandleAttributes: cDA }) => (
                                                              <div className="flex items-center gap-1.5">
                                                                <DragHandle listeners={cDL} attributes={cDA} />
                                                                <div className="flex-1">
                                                                  <ChapterRow
                                                                    chapter={chap}
                                                                    courseId={courseId!}
                                                                    moduleId={mod.id}
                                                                    lessonId={les.id}
                                                                    onEdit={c => setModal({ kind: 'edit-chapter', moduleId: mod.id, lessonId: les.id, chapter: c })}
                                                                    onDelete={c => setModal({ kind: 'del-chapter', moduleId: mod.id, lessonId: les.id, chapter: c })}
                                                                    onVideoSuccess={invalidate}
                                                                    disabled={anyPending}
                                                                  />
                                                                </div>
                                                              </div>
                                                            )}
                                                          </SortableRow>
                                                        ))}
                                                      </div>
                                                    </SortableContext>
                                                  </DndContext>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </SortableRow>
                                    );
                                  })}
                                </div>
                              </SortableContext>
                            </DndContext>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </SortableRow>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Modals */}
      {modal && <Modals modal={modal} onClose={() => setModal(null)}
        addModule={p => addModuleMut.mutate(p)}
        editModule={p => editModuleMut.mutate(p)}
        delModule={id => delModuleMut.mutate(id)}
        addLesson={p => addLessonMut.mutate(p)}
        editLesson={p => editLessonMut.mutate(p)}
        delLesson={p => delLessonMut.mutate(p)}
        addChapter={p => addChapterMut.mutate(p)}
        editChapter={p => editChapterMut.mutate(p)}
        delChapter={p => delChapterMut.mutate(p)}
        saving={anyPending}
      />}
    </div>
  );
}

// =============================================================================
// Modals component — all modal variants in one place
// =============================================================================

interface ModalsProps {
  modal: Exclude<ModalState, null>;
  onClose: () => void;
  saving: boolean;
  addModule:   (p: AddModulePayload) => void;
  editModule:  (p: { id: string } & UpdateModulePayload) => void;
  delModule:   (id: string) => void;
  addLesson:   (p: { moduleId: string } & AddLessonPayload) => void;
  editLesson:  (p: { moduleId: string; id: string } & UpdateLessonPayload) => void;
  delLesson:   (p: { moduleId: string; id: string }) => void;
  addChapter:  (p: { moduleId: string; lessonId: string } & AddChapterPayload) => void;
  editChapter: (p: { moduleId: string; lessonId: string; id: string } & UpdateChapterPayload) => void;
  delChapter:  (p: { moduleId: string; lessonId: string; id: string }) => void;
}

function Modals({ modal, onClose, saving, addModule, editModule, delModule, addLesson, editLesson, delLesson, addChapter, editChapter, delChapter }: ModalsProps) {

  // Add / Edit Module
  if (modal.kind === 'add-module' || modal.kind === 'edit-module') {
    const editing = modal.kind === 'edit-module';
    const init = editing ? modal.module : null;
    return (
      <ModuleForm
        title={editing ? 'Edit Module' : 'Add Module'}
        init={init}
        onClose={onClose}
        saving={saving}
        onSubmit={(title, description) => editing
          ? editModule({ id: init!.id, title, description })
          : addModule({ title, description })
        }
      />
    );
  }

  // Delete Module
  if (modal.kind === 'del-module') return (
    <ConfirmDelete
      title="Delete Module"
      message={`Delete "${modal.module.title}"? All lessons and chapters inside will also be deleted.`}
      saving={saving}
      onClose={onClose}
      onConfirm={() => delModule(modal.module.id)}
    />
  );

  // Add / Edit Lesson
  if (modal.kind === 'add-lesson' || modal.kind === 'edit-lesson') {
    const editing = modal.kind === 'edit-lesson';
    const init = editing ? modal.lesson : null;
    return (
      <LessonForm
        title={editing ? 'Edit Lesson' : 'Add Lesson'}
        init={init}
        onClose={onClose}
        saving={saving}
        onSubmit={(title, description, isPreview) => editing
          ? editLesson({ moduleId: modal.moduleId, id: init!.id, title, description, isPreview })
          : addLesson({ moduleId: modal.moduleId, title, description, isPreview })
        }
      />
    );
  }

  // Delete Lesson
  if (modal.kind === 'del-lesson') return (
    <ConfirmDelete
      title="Delete Lesson"
      message={`Delete "${modal.lesson.title}"? All chapters inside will also be deleted.`}
      saving={saving}
      onClose={onClose}
      onConfirm={() => delLesson({ moduleId: modal.moduleId, id: modal.lesson.id })}
    />
  );

  // Add / Edit Chapter─
  if (modal.kind === 'add-chapter' || modal.kind === 'edit-chapter') {
    const editing = modal.kind === 'edit-chapter';
    const init = editing ? modal.chapter : null;
    return (
      <ChapterForm
        title={editing ? 'Edit Chapter' : 'Add Chapter'}
        init={init}
        onClose={onClose}
        saving={saving}
        onSubmit={(fields) => editing
          ? editChapter({ moduleId: modal.moduleId, lessonId: modal.lessonId, id: init!.id, ...fields })
          : addChapter({ moduleId: modal.moduleId, lessonId: modal.lessonId, ...fields })
        }
      />
    );
  }

  // Delete Chapter─
  if (modal.kind === 'del-chapter') return (
    <ConfirmDelete
      title="Delete Chapter"
      message={`Delete "${modal.chapter.title}"?`}
      saving={saving}
      onClose={onClose}
      onConfirm={() => delChapter({ moduleId: modal.moduleId, lessonId: modal.lessonId, id: modal.chapter.id })}
    />
  );

  return null;
}

// Module form

function ModuleForm({ title, init, onClose, saving, onSubmit }: {
  title: string; init: ModuleDTO | null; onClose: () => void; saving: boolean;
  onSubmit: (title: string, description?: string | null) => void;
}) {
  const [t, setT] = useState(init?.title ?? '');
  const [d, setD] = useState(init?.description ?? '');
  const [err, setErr] = useState('');

  function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!t.trim()) { setErr('Title is required'); return; }
    onSubmit(t.trim(), d.trim() || null);
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handle}>
        <Field label="Title *" error={err}>
          <TextInput value={t} onChange={v => { setT(v); setErr(''); }} placeholder="e.g. Introduction" disabled={saving} />
        </Field>
        <Field label="Description">
          <TextArea value={d} onChange={setD} placeholder="Optional overview" disabled={saving} />
        </Field>
        <ModalActions onCancel={onClose} submitLabel={init ? 'Save Changes' : 'Add Module'} disabled={saving} />
      </form>
    </Modal>
  );
}

// Lesson form

function LessonForm({ title, init, onClose, saving, onSubmit }: {
  title: string; init: LessonDTO | null; onClose: () => void; saving: boolean;
  onSubmit: (title: string, description?: string | null, isPreview?: boolean) => void;
}) {
  const [t, setT]   = useState(init?.title ?? '');
  const [d, setD]   = useState(init?.description ?? '');
  const [p, setP]   = useState(init?.isPreview ?? false);
  const [err, setErr] = useState('');

  function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!t.trim()) { setErr('Title is required'); return; }
    onSubmit(t.trim(), d.trim() || null, p);
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handle}>
        <Field label="Title *" error={err}>
          <TextInput value={t} onChange={v => { setT(v); setErr(''); }} placeholder="e.g. Welcome to the course" disabled={saving} />
        </Field>
        <Field label="Description">
          <TextArea value={d} onChange={setD} placeholder="Optional" disabled={saving} />
        </Field>
        <label className="mb-4 flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={p} onChange={e => setP(e.target.checked)} disabled={saving} />
          Make this lesson a free preview
        </label>
        <ModalActions onCancel={onClose} submitLabel={init ? 'Save Changes' : 'Add Lesson'} disabled={saving} />
      </form>
    </Modal>
  );
}

// Chapter form─

type ChapterFields = { title: string; type: 'video' | 'text'; isFree?: boolean; content?: string };

function ChapterForm({ title, init, onClose, saving, onSubmit }: {
  title: string; init: ChapterDTO | null; onClose: () => void; saving: boolean;
  onSubmit: (f: ChapterFields) => void;
}) {
  const [t, setT]       = useState(init?.title ?? '');
  const [type, setType] = useState<'video' | 'text'>(init?.type ?? 'video');
  const [free, setFree] = useState(init?.isFree ?? false);
  const [content, setContent] = useState(init?.content ?? '');
  const [err, setErr]   = useState('');

  function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!t.trim()) { setErr('Title is required'); return; }
    if (type === 'text' && !content.trim()) { setErr('Content is required for text chapters'); return; }
    onSubmit({ title: t.trim(), type, isFree: free, content: type === 'text' ? content : undefined });
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handle}>
        <Field label="Title *" error={err}>
          <TextInput value={t} onChange={v => { setT(v); setErr(''); }} placeholder="e.g. Introduction Video" disabled={saving} />
        </Field>
        <Field label="Type">
          <select value={type} onChange={e => setType(e.target.value as 'video' | 'text')} disabled={saving}
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] px-2 py-2 text-sm bg-white">
            <option value="video">Video</option>
            <option value="text">Text</option>
          </select>
        </Field>
        {type === 'text' && (
          <Field label="Content *">
            <TextArea value={content} onChange={setContent} rows={5} placeholder="Markdown or plain text content" disabled={saving} />
          </Field>
        )}
        <label className="mb-4 flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={free} onChange={e => setFree(e.target.checked)} disabled={saving} />
          Free chapter (visible without enrollment)
        </label>
        <ModalActions onCancel={onClose} submitLabel={init ? 'Save Changes' : 'Add Chapter'} disabled={saving} />
      </form>
    </Modal>
  );
}

// Confirm delete─

function ConfirmDelete({ title, message, saving, onClose, onConfirm }: {
  title: string; message: string; saving: boolean; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm text-gray-700">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} disabled={saving}
          className="rounded-[var(--radius-md)] border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={saving}
          className="rounded-[var(--radius-md)] bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60">
          {saving ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}