import React from 'react'

type Props = {
    currentPage: number,
    totalPages: number,
    onChange: (page: number) => void,
    loading?: boolean
}

const Pagination = ({ currentPage, totalPages, onChange, loading = false }: Props) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5; // Always show 5 pages if totalPages > 5

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total pages are less than or equal to maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        disabled={loading}
                        className={`mx-1 px-3 py-1 border-2 min-w-10 dark:border-gray-400 dark:text-gray-200 rounded ${currentPage === i ? 'bg-gray-200 dark:bg-gray-500 text-black' : 'bg-white dark:bg-transparent text-black hover:bg-gray-100 hover:dark:bg-gray-400'}`}
                    >{i}</button>
                );
            }
        } else {
            // Show ellipsis in the middle for more than maxPagesToShow pages
            const leftEllipsis = currentPage > 3;
            const rightEllipsis = currentPage < totalPages - 2;

            // Always show the first page
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    disabled={loading}
                    className={`mx-1 px-3 py-1 border-2 min-w-10 dark:border-gray-400 dark:text-gray-200 rounded ${currentPage === 1 ? 'bg-gray-200 dark:bg-gray-500 text-black' : 'bg-white dark:bg-transparent text-black hover:bg-gray-100 hover:dark:bg-gray-400'}`}
                >1</button>
            );

            // Show left ellipsis if needed
            if (leftEllipsis) {
                pages.push(
                    <span key="left-ellipsis" className="mx-1 px-0 py-1">
                        ...
                    </span>
                );
            }

            // Show current page and its neighbors
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
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        disabled={loading}
                        className={`mx-1 px-3 py-1 border-2 min-w-10 dark:border-gray-400 dark:text-gray-200 rounded ${currentPage === i ? 'bg-gray-200 dark:bg-gray-500 text-black' : 'bg-white dark:bg-transparent text-black hover:bg-gray-100 hover:dark:bg-gray-400'}`}
                    >{i}</button>
                );
            }

            // Show right ellipsis if needed
            if (rightEllipsis) {
                pages.push(
                    <span key="right-ellipsis" className="mx-1 px-0 py-1">
                        ...
                    </span>
                );
            }

            // Always show the last page
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={loading}
                    className={`mx-1 px-3 py-1 border-2 min-w-10 dark:border-gray-400 dark:text-gray-200 rounded ${currentPage === totalPages ? 'bg-gray-200 dark:bg-gray-500 text-black' : 'bg-white dark:bg-transparent text-black hover:bg-gray-100 hover:dark:bg-gray-400'}`}
                >{totalPages}</button>
            );
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={loading || (currentPage === 1)}
                className={`mx-1 px-3 py-1 min-w-10 rounded text-sm text-gray-600 dark:text-gray-400 transition ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'bg-white dark:bg-transparent hover:text-gray-800 hover:dark:text-gray-200'}`}
            >Prev</button>
            {renderPageNumbers()}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={loading || (currentPage === totalPages)}
                className={`mx-1 px-3 py-1 min-w-10 rounded text-sm text-gray-600 dark:text-gray-400 transition ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'bg-white dark:bg-transparent hover:text-gray-800 hover:dark:text-gray-200'}`}
            >Next</button>
        </div>
    );
};

export default Pagination;