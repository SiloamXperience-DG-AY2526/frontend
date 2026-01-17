'use client';

import { Manager } from '@/types/Managers';

interface ManagerStatusDialogProps {
  manager: Manager;
  onClose: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  updating?: boolean;
}

export default function ManagerStatusDialog({
  manager,
  onClose,
  onActivate,
  onDeactivate,
  updating = false,
}: ManagerStatusDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[320px] rounded-md bg-white p-5 shadow-md">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Update Status
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-3">
          {/* Confirm button (left) */}
          <button
            onClick={manager.status === 'Active' ? onDeactivate : onActivate}
            className={[
              'rounded-md px-5 py-2 text-sm font-medium text-white',
              'transition-colors duration-200',
              manager.status === 'Active'
                ? 'bg-[#0E5A4A] hover:opacity-90'
                : 'bg-[#0E5A4A] hover:opacity-90',
              updating ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
            disabled={updating}
          >
            {manager.status === 'Active' ? 'Deactivate user' : 'Activate user'}
          </button>

          {/* Cancel button (right) */}
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-5 py-2 text-sm text-gray-800 hover:bg-gray-50"
            disabled={updating}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
