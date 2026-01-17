import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

function DeleteButton({ onClick, ariaLabel = 'Delete' }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-[#195D4B] transition"
      aria-label={ariaLabel}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}

export default DeleteButton;
