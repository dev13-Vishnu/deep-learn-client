import type { CourseStatus } from '../../types/course.types';

const STATUS_STYLES: Record<CourseStatus, string> = {
  draft:     'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived:  'bg-amber-100 text-amber-700',
};

interface Props {
  status: CourseStatus;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}