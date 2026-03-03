import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import type { CourseListItemDTO } from "../../types/course.types";
import { CourseStatus } from "../../types/course.types";

interface Props {
  course: CourseListItemDTO;
  onPublish:   (id: string) => void;
  onUnpublish: (id: string) => void;
  onArchive:   (id: string) => void;
  onDelete:    (id: string) => void;
  isActioning: boolean;
}

export default function InstructorCourseCard({ course, onPublish, onUnpublish, onArchive, onDelete, isActioning }: Props) {
  const navigate        = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const { _id, title, status, level, price, thumbnail } = course;
  const canPublish   = status === CourseStatus.Draft     || status === CourseStatus.Archived;
  const canUnpublish = status === CourseStatus.Published;
  const canArchive   = status === CourseStatus.Draft     || status === CourseStatus.Published;
  const canDelete    = status === CourseStatus.Draft     || status === CourseStatus.Archived;

  function act(fn: () => void) { setOpen(false); fn(); }

  return (
    <div className="flex flex-col rounded-md border border-[color:var(--color-border)] bg-white hover:shadow-sm transition">
      <div className="relative h-40 w-full overflow-hidden rounded-t-md bg-gray-100">
        {thumbnail?.url ? (
          <img src={thumbnail.url} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute right-2 top-2" ref={menuRef}>
          <button
            onClick={() => setOpen(v => !v)}
            disabled={isActioning}
            aria-label="Course actions"
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white disabled:opacity-50"
          >
            <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5"  r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {open && (
            <div role="menu" className="absolute right-0 top-8 z-20 w-44 rounded-md border bg-white py-1 shadow-lg">
              <MenuBtn onClick={() => act(() => navigate("/instructor/courses/" + _id + "/edit"))}>Edit Info</MenuBtn>
              <MenuBtn onClick={() => act(() => navigate("/instructor/courses/" + _id + "/content"))}>Manage Content</MenuBtn>
              <div className="my-1 border-t border-gray-100" />
              {canPublish   && <MenuBtn onClick={() => act(() => onPublish(_id))}>Publish</MenuBtn>}
              {canUnpublish && <MenuBtn onClick={() => act(() => onUnpublish(_id))}>Unpublish</MenuBtn>}
              {canArchive   && <MenuBtn onClick={() => act(() => onArchive(_id))}>Archive</MenuBtn>}
              {canDelete && (
                <>
                  <div className="my-1 border-t border-gray-100" />
                  <MenuBtn onClick={() => act(() => onDelete(_id))} danger>Delete</MenuBtn>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[color:var(--color-text)]">{title}</h3>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <span className="text-xs capitalize text-[color:var(--color-muted)]">{level}</span>
        </div>
        <p className="mt-auto text-sm font-semibold">{price === 0 ? "Free" : String(price)}</p>
      </div>
    </div>
  );
}

function MenuBtn({ children, onClick, danger = false }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button role="menuitem" onClick={onClick}
      className={"block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition " + (danger ? "text-red-600" : "text-[color:var(--color-text)]")}>
      {children}
    </button>
  );
}