interface Props {
  applicationId: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ApproveModal({
  applicationId,
  onConfirm,
  onCancel,
  isLoading,
}: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Approve Application</h2>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 mb-1">
          You are about to approve application{' '}
          <span className="font-mono font-medium">#{applicationId.slice(-6)}</span>.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          The applicant's role will be upgraded to <strong>Instructor</strong> and they
          will be able to create courses immediately.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Approving…
              </>
            ) : (
              'Approve'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}