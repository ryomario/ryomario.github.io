import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  pageSize?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handlePageSizeChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  offset: number;
  limit: number;
}

export const usePagination = ({
  initialPage = 0,
  pageSize: initialPageSize = 10,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    setPage(0); // Reset to first page when page size changes
  };

  // Calculate offset and limit for API calls or data slicing
  const offset = page * pageSize;
  const limit = pageSize;

  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    offset,
    limit,
  };
};