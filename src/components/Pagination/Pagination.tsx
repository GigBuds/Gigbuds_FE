import React from 'react';

interface PaginationProps {
  currentPage: number;
  hasItems: boolean;
  itemsCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  hasItems,
  itemsCount,
  pageSize,
  onPageChange
}) => {
  const isLastPage = itemsCount < pageSize;

  return (
    <div className="flex justify-center items-center mt-8 gap-4">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        }`}
      >
        <span>&lt;</span>
        Previous
      </button>

      {/* Current page indicator */}
      <div className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
        {currentPage}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasItems || isLastPage}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
          !hasItems || isLastPage
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        }`}
      >
        Next
        <span>&gt;</span>
      </button>
    </div>
  );
};

export default Pagination;