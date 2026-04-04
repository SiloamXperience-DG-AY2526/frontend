import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

function DeleteButton({ onClick, ariaLabel = 'Delete' }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-md p-1 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
      aria-label={ariaLabel}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}

export default DeleteButton;
