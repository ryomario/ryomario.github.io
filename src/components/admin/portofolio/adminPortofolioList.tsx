import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import { useMemo } from "react";
import { useTableData } from "@/hooks/tableData";
import Skeleton from "@mui/material/Skeleton";
import { TemplateName, templates } from "@/templates/registered";
import { AdminPortofolioItem } from "./adminPortofolioItem";
import { useProfileData, useUpdateProfileData } from "@/contexts/profileDataContext";
import * as RepoTemplates_server from "@/db/repositories/RepoTemplates.server";

type Props = {
  itemPerPage?: number;
}

export function AdminPortofolioList({
  itemPerPage = 6,
}: Props) {
  const { activeTmplId } = useProfileData();
  const updateProfileData = useUpdateProfileData();

  const alldata = useMemo<Array<{ id: number, name: TemplateName }>>(() => templates.map((name, id) => ({ id, name })), []);

  const {
    handlePageChange,
    page,
    pageSize,

    data,
    isLoading,
    total,
    refresh,
  } = useTableData({
    data: alldata,
    pageSize: itemPerPage,
    orderBy: '',
  });

  const totalPage = !total ? 1 : Math.ceil(total / pageSize);

  const setActive = async (id: number) => {
    try {
      const result = await RepoTemplates_server.setActiveTemplateId(id);
      if (!result) throw new Error('Unknown error');

      await updateProfileData();
      refresh(true);
    } catch (error) {
      console.error(error);
    }
  };

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
          : data.map(({ name, id }) => (
            <AdminPortofolioItem
              key={name}
              name={name}
              setActive={async () => {
                await setActive(id);
              }}
              isActive={id == activeTmplId}
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