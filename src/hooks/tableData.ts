import { ArrayOrder } from "@/lib/array";
import { Logger } from "@/utils/logger";
import { useCallback, useEffect, useMemo, useState } from "react";

export type UseTableLoadData<Data extends any, P extends string> = (offset: number, limit: number, order: ArrayOrder, orderBy: P) => Promise<{ data: Data[], total: number }>;

interface UseTableProps<Data extends any, P extends string> {
  data: Data[] | UseTableLoadData<Data, P>;
  initialPage?: number;
  pageSize?: number;
  order?: ArrayOrder;
  orderBy: P;
}

interface UseTableResult<Data extends any, P extends string> {
  data: Data[],
  total: number;
  isLoading: boolean;
  refresh: (reset?: boolean) => Promise<void>;
  order: ArrayOrder;
  orderBy: P;
  handleRequestSort: (event: React.MouseEvent<unknown>, property: P) => void;
  page: number;
  pageSize: number;
  handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handlePageSizeChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  offset: number;
  limit: number;
}

export function useTableData<Data extends any, Order extends string>({
  data: propData,
  initialPage = 0,
  pageSize: initialPageSize = 10,
  orderBy: initialOrderBy,
  order: initialOrder = 'asc',
}: UseTableProps<Data, Order>): UseTableResult<Data, Order> {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [order, setOrder] = useState<ArrayOrder>(initialOrder);
  const [orderBy, setOrderBy] = useState<Order>(initialOrderBy);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data[]>([]);
  const [total, setTotal] = useState(0);

  // Calculate offset and limit for API calls or data slicing
  const offset = useMemo(() => page * pageSize, [page, pageSize]);
  const limit = pageSize;

  const loadData = useCallback(
    async (reset = false) => {
      try {
        setIsLoading(true);
        const firstIdx = reset ? 0 : offset;
        if (typeof propData === 'function') {
          const { data: loadedData, total: totalData } = await propData(firstIdx, limit, order, orderBy);

          setData(loadedData);
          setTotal(totalData);
        } else if (Array.isArray(propData)) {
          const totalData = propData.length;
          const loadedData = propData.slice(firstIdx, firstIdx + limit);

          setData(loadedData);
          setTotal(totalData);
        } else {
          throw new Error('Data not loaded!');
        }
        if (reset) {
          setPage(0);
        }
      } catch (error: any) {
        Logger.error(error.message ?? error ?? 'unknown error', 'useTableData loadData');
      } finally {
        setIsLoading(false);
      }
    }
    ,
    [propData, limit, offset, order, orderBy, setData, setIsLoading, setTotal]
  );

  const handleRequestSort = useCallback(
    (
      _event: React.MouseEvent<unknown>,
      property: Order,
    ) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }
    ,
    [orderBy, order, setOrder, setOrderBy]
  );

  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    setPage(0); // Reset to first page when page size changes
  };

  useEffect(() => {
    loadData();
  }, [propData, page, pageSize, order, orderBy]);

  return {
    data,
    total,
    isLoading,
    refresh: loadData,
    handlePageChange,
    handlePageSizeChange,
    page,
    pageSize,
    limit,
    offset,
    handleRequestSort,
    order,
    orderBy,
  }
}