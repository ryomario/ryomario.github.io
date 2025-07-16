import { ArrayOrder } from "@/lib/array";
import { useState } from "react";

interface UseTableOrderProps<P extends string> {
  order?: ArrayOrder;
  orderBy: P;
}

interface UseTableOrderResult<P extends string> {
  order: ArrayOrder;
  orderBy: P;
  handleRequestSort: (event: React.MouseEvent<unknown>, property: P) => void
}

export function useTableOrder<T extends string>({ order: initialOrder = 'asc', orderBy: initialOrderBy }: UseTableOrderProps<T>): UseTableOrderResult<T> {
  const [order, setOrder] = useState<ArrayOrder>(initialOrder);
  const [orderBy, setOrderBy] = useState<T>(initialOrderBy);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return {
    order,
    orderBy,
    handleRequestSort,
  };
}