import { PencilIcon } from '@heroicons/react/24/outline';

interface EditButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

function EditButton({ onClick, ariaLabel = 'Edit' }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-[#195D4B] transition"
      aria-label={ariaLabel}
    >
      <PencilIcon className="h-5 w-5" />
    </button>
  );
}

export default EditButton;
