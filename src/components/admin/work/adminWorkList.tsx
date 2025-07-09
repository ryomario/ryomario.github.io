import { IWorkExperience } from "@/types/IWorkExperience"
import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import { AdminWorkItem } from "./adminWorkItem";
import { useCallback } from "react";
import { Logger } from "@/utils/logger";

type Props = {
  data: IWorkExperience[];
  itemPerPage?: number;
  getRedirectPathDetails: (id: string) => string;
  getRedirectPathEdit: (id: string) => string;
}

export function AdminWorkList({
  data,
  itemPerPage = 8,
  getRedirectPathDetails,
  getRedirectPathEdit,
}: Props) {
  const handleDelete = useCallback((id: number) => {
    Logger.debug(id,'DELETE');
  },[]);

  return <>
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
      }}
    >
      {data.map((item) => (
        <AdminWorkItem
          key={item.id}
          data={item}
          detailsHref={getRedirectPathDetails(`${item.id}`)}
          editHref={getRedirectPathEdit(`${item.id}`)}
          onDelete={() => handleDelete(item.id)}
        />
      ))}

      {data.length > itemPerPage && (
        <Pagination
          count={10}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </Box>
  </>;
}