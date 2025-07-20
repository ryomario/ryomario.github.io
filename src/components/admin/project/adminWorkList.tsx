import { IWorkExperience } from "@/types/IWorkExperience"
import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import { AdminWorkItem } from "./adminWorkItem";
import { useCallback, useState } from "react";
import { Logger } from "@/utils/logger";
import * as RepoWorksServer from "@/db/repositories/RepoWorks.server";
import { LoadingScreen } from "@/components/loadingScreen/LoadingScreen";
import { useRouter } from "next/navigation";
import { useTableData, UseTableLoadData } from "@/hooks/tableData";
import { dbWorkTransform } from "@/db/utils/workTransforms";
import { getErrorMessage } from "@/utils/errorMessage";
import Skeleton from "@mui/material/Skeleton";

type Props = {
  itemPerPage?: number;
  getRedirectPathDetails: (id: string) => string;
  getRedirectPathEdit: (id: string) => string;
}

export function AdminWorkList({
  itemPerPage = 6,
  getRedirectPathDetails,
  getRedirectPathEdit,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback<UseTableLoadData<IWorkExperience, any>>(async (offset, limit) => {
    try {
      const countData = await RepoWorksServer.getCountAll();
      const loadedData = await RepoWorksServer.getAll(offset, limit);

      return {
        data: loadedData.map(dbWorkTransform),
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
  } = useTableData<IWorkExperience, any>({
    data: loadData,
    pageSize: itemPerPage,
    orderBy: null,
  });

  const totalPage = !total ? 1 : Math.ceil(total / pageSize);

  const handleDelete = useCallback(async (id: number) => {
    try {
      setIsDeleting(true);
      const result = await RepoWorksServer.remove(id);
      if (!result) {
        throw new Error('Internal error');
      }

      refresh(true);
      Logger.debug(id, 'DELETE');
    } catch (error) {
      Logger.error(getErrorMessage(error), 'Delete work Error');
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
            <AdminWorkItem
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
          page={page+1}
          count={totalPage}
          onChange={(_, newPage) => handlePageChange(null, newPage-1)}
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