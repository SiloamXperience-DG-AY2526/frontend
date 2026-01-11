import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  searchPlaceholder?: string;
}

export default function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  searchPlaceholder = 'Search...',
}: SearchAndFilterBarProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      {/* Filter Button */}
      <button
        onClick={onFilterClick}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition"
      >
        <FunnelIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Filters</span>
      </button>

      {/* Search Input */}
      <div className="flex-1 relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none focus:border-[#195D4B] focus:ring-1 focus:ring-[#195D4B]"
        />
      </div>
    </div>
  );
}
