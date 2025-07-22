import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import { AdminProjectItem } from "./adminProjectItem";
import { useCallback, useState } from "react";
import { Logger } from "@/utils/logger";
import * as RepoProjectsServer from "@/db/repositories/RepoProjects.server";
import { LoadingScreen } from "@/components/loadingScreen/LoadingScreen";
import { useTableData, UseTableLoadData } from "@/hooks/tableData";
import { getErrorMessage } from "@/utils/errorMessage";
import Skeleton from "@mui/material/Skeleton";
import { IProject } from "@/types/IProject";

type Props = {
  itemPerPage?: number;
  getRedirectPathDetails: (id: string) => string;
  getRedirectPathEdit: (id: string) => string;
}

export function AdminProjectList({
  itemPerPage = 6,
  getRedirectPathDetails,
  getRedirectPathEdit,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback<UseTableLoadData<IProject, any>>(async (offset, limit) => {
    try {
      const countData = await RepoProjectsServer.getCountAll();
      const loadedData = await RepoProjectsServer.getAll({offset, limit});

      return {
        data: loadedData,
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
  } = useTableData<IProject, any>({
    data: loadData,
    pageSize: itemPerPage,
    orderBy: null,
  });

  const totalPage = !total ? 1 : Math.ceil(total / pageSize);

  const handleDelete = useCallback(async (id: number) => {
    try {
      setIsDeleting(true);
      const result = await RepoProjectsServer.remove(id);
      if (!result) {
        throw new Error('Internal error');
      }

      refresh(true);
      Logger.debug(id, 'Delete project');
    } catch (error) {
      Logger.error(getErrorMessage(error), 'Delete project Error');
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
            <AdminProjectItem
              key={item.id}
              data={item}
              detailsHref={getRedirectPathDetails(`${item.id}`)}
              editHref={getRedirectPathEdit(`${item.id}`)}
              onDelete={() => handleDelete(item.id)}
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