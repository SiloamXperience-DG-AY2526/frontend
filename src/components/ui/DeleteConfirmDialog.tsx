'use client';

interface DeleteConfirmDialogProps {
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  title = 'Cancel Project',
  message = 'Are you sure you want to cancel this project? Its status will be set to Cancelled.',
  confirmLabel = 'Cancel Project',
  onConfirm,
  onClose,
  loading = false,
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[360px] rounded-md bg-white p-5 shadow-md">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <p className="mb-5 text-sm text-gray-600">{message}</p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={[
              'rounded-md px-5 py-2 text-sm font-medium text-white bg-red-600 hover:opacity-90 transition-colors duration-200',
              loading ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {loading ? 'Cancelling…' : confirmLabel}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 px-5 py-2 text-sm text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
