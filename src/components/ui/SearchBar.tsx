import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
}: SearchBarProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
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
