import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
          currentPage === 1
            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-[#195D4B] text-[#195D4B] hover:bg-[#195D4B] hover:text-white'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span>Previous</span>
      </button>

      <span className="text-sm text-gray-700">
        Page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
          currentPage === totalPages
            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-[#195D4B] text-[#195D4B] hover:bg-[#195D4B] hover:text-white'
        }`}
        aria-label="Next page"
      >
        <span>Next</span>
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Pagination;
