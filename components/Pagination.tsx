// components/Pagination.tsx
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  loading?: boolean;
};

const Pagination = ({
  currentPage,
  totalPages,
  onChange,
  loading = false,
}: Props) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      onChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PageButton
            key={i}
            page={i}
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
            disabled={loading}
          />,
        );
      }
    } else {
      const leftEllipsis = currentPage > 3;
      const rightEllipsis = currentPage < totalPages - 2;

      // Always show first page
      pages.push(
        <PageButton
          key={1}
          page={1}
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
          disabled={loading}
        />,
      );

      if (leftEllipsis) {
        pages.push(
          <span key="left-ellipsis" className="px-2 text-gray-400">
            ...
          </span>,
        );
      }

      let startPage, endPage;
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PageButton
            key={i}
            page={i}
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
            disabled={loading}
          />,
        );
      }

      if (rightEllipsis) {
        pages.push(
          <span key="right-ellipsis" className="px-2 text-gray-400">
            ...
          </span>,
        );
      }

      // Always show last page
      pages.push(
        <PageButton
          key={totalPages}
          page={totalPages}
          isActive={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={loading}
        />,
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null; // Don't show pagination if only 1 page

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 select-none">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={loading || currentPage === 1}
        aria-label="Previous Page"
        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
      >
        <FiChevronLeft size={20} />
      </button>

      <div className="flex items-center">{renderPageNumbers()}</div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={loading || currentPage === totalPages}
        aria-label="Next Page"
        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

// Helper component for individual page numbers to keep render function clean
function PageButton({
  page,
  isActive,
  disabled,
  onClick,
}: {
  page: number;
  isActive: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[40px] h-10 px-2 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
        isActive
          ? "bg-primary text-white shadow-md shadow-primary/20 dark:bg-primary dark:text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      }`}
    >
      {page}
    </button>
  );
}

export default Pagination;
