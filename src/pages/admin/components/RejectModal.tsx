import { useState } from 'react';

interface Props {
  applicationId: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 500;

export default function RejectModal({
  applicationId,
  onConfirm,
  onCancel,
  isLoading,
}: Props) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  const error =
    touched && reason.trim().length < MIN_REASON_LENGTH
      ? `Reason must be at least ${MIN_REASON_LENGTH} characters`
      : null;

  function handleSubmit() {
    setTouched(true);
    if (reason.trim().length < MIN_REASON_LENGTH) return;
    onConfirm(reason.trim());
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Reject Application</h2>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 mb-4">
          Rejecting application{' '}
          <span className="font-mono font-medium">#{applicationId.slice(-6)}</span>.
        </p>

        {/* Cooldown notice */}
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-800">
            <strong>Cooldown:</strong> The applicant will not be able to reapply
            for <strong>30 days</strong> after rejection.
          </p>
        </div>

        {/* Reason textarea */}
        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Explain why this application is being rejected…"
            rows={4}
            maxLength={MAX_REASON_LENGTH}
            className={`w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 ${
              error
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-300'
            }`}
          />
          <div className="mt-1 flex justify-between">
            {error ? (
              <p className="text-xs text-red-600">{error}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-gray-400">
              {reason.length}/{MAX_REASON_LENGTH}
            </p>
          </div>
        </div>

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
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Rejecting…
              </>
            ) : (
              'Reject Application'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}