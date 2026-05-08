import { PencilIcon } from '@heroicons/react/24/outline';

interface EditButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

function EditButton({ onClick, ariaLabel = 'Edit' }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-md p-1 text-gray-500 transition hover:bg-[#E6F5F1] hover:text-[#195D4B]"
      aria-label={ariaLabel}
    >
      <PencilIcon className="h-5 w-5" />
    </button>
  );
}

export default EditButton;
