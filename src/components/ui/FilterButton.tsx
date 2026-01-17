import { FunnelIcon } from '@heroicons/react/24/outline';

interface FilterButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export default function FilterButton({
  onClick,
  label = 'Filters',
  className = '',
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition ${className}`}
    >
      <span className="text-sm font-medium">{label}</span>
      <FunnelIcon className="h-5 w-5" />
    </button>
  );
}
