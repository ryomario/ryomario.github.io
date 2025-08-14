import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import { useMemo } from "react";
import { useTableData } from "@/hooks/tableData";
import Skeleton from "@mui/material/Skeleton";
import { TemplateName, templates } from "@/templates/registered";
import { AdminPortofolioItem } from "./adminPortofolioItem";

type Props = {
  itemPerPage?: number;
}

export function AdminPortofolioList({
  itemPerPage = 6,
}: Props) {
  const alldata = useMemo<Array<TemplateName>>(() => templates.map(a => a), []);

  const {
    handlePageChange,
    page,
    pageSize,

    data,
    isLoading,
    total,
    refresh,
  } = useTableData<TemplateName, any>({
    data: alldata,
    pageSize: itemPerPage,
    orderBy: null,
  });

  const totalPage = !total ? 1 : Math.ceil(total / pageSize);

  return <>
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
      }}
    >
      {
        isLoading
          ? Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={320} />
          ))
          : data.map((name) => (
            <AdminPortofolioItem
              key={name}
              name={name}
            />
          ))
      }

      {totalPage > 1 && (
        <Pagination
          page={page + 1}
          count={totalPage}
          onChange={(_, newPage) => handlePageChange(null, newPage - 1)}
          sx={{
            mt: 4,
            gridColumn: '1 / -1',
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </Box>
  </>;
}