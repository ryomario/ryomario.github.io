interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust if we're at the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <ul className="inline-flex items-stretch -space-x-px">
      {/* Previous button */}
      <li>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center justify-center h-full py-1.5 px-3 ml-0
            text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
            ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </li>

      {/* First page */}
      {!visiblePages.includes(1) && (
        <>
          <li>
            <button
              onClick={() => onPageChange(1)}
              className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 ${
                1 === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              1
            </button>
          </li>
          {visiblePages[0] > 2 && (
            <li>
              <span className="cursor-default flex items-center justify-center text-sm py-2 px-3 leading-tight bg-white text-gray-500 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">...</span>
            </li>
          )}
        </>
      )}

      {/* Visible pages */}
      {visiblePages.map((page) => (
        <li>
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
            }`}
          >
            {page}
          </button>
        </li>
      ))}

      {/* Last page */}
      {!visiblePages.includes(totalPages) && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <li>
              <span className="cursor-default flex items-center justify-center text-sm py-2 px-3 leading-tight bg-white text-gray-500 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">...</span>
            </li>
          )}
          <li>
            <button
              onClick={() => onPageChange(totalPages)}
              className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 ${
                totalPages === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              {totalPages}
            </button>
          </li>
        </>
      )}

      {/* Next button */}
      <li>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </li>
    </ul>
  );
};