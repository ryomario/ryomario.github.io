import { LoadingScreen } from "@/components/loadingScreen/LoadingScreen";
import * as RepoEducationsServer from "@/db/repositories/RepoEducations.server";
import { useTableData, UseTableLoadData } from "@/hooks/tableData";
import { IEducation } from "@/types/IEducation";
import { Logger } from "@/utils/logger";
import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import { useCallback, useState } from "react";
import { AdminEducationItem } from "./adminEducationItem";

type Props = {
  itemPerPage?: number;
  getRedirectPathDetails: (id: string) => string;
  getRedirectPathEdit: (id: string) => string;
}

export function AdminEducationList({
  itemPerPage = 1,
  getRedirectPathDetails,
  getRedirectPathEdit,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback<UseTableLoadData<IEducation, any>>(async (offset, limit) => {
    try {
      const countData = await RepoEducationsServer.getCountAll();
      const data = await RepoEducationsServer.getAll({ offset, limit });

      return {
        data,
        total: countData,
      }
    } catch (error) {
      return {
        data: [],
        total: 0,
      }
    }
  }, []);

  const {
    handlePageChange,
    page,
    pageSize,

    data,
    isLoading,
    total,
    refresh,
  } = useTableData<IEducation, any>({
    data: loadData,
    pageSize: itemPerPage,
    orderBy: null,
  });

  const totalPage = !total ? 1 : Math.ceil(total / pageSize);

  const handleDelete = useCallback(async (id: number) => {
    try {
      setIsDeleting(true);
      const result = await RepoEducationsServer.remove(id);
      if (!result) {
        throw new Error('Internal error');
      }

      refresh(true);
    } catch (error: any) {
      Logger.error(error, 'Delete Education Error');
    } finally {
      setIsDeleting(false);
    }
  }, [refresh]);

  if (isDeleting) {
    return <LoadingScreen />;
  }

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
          : data.map((item) => (
            <AdminEducationItem
              key={item.id}
              data={item}
              detailsHref={getRedirectPathDetails(`${item.id}`)}
              editHref={getRedirectPathEdit(`${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}

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