import { IWorkExperience } from "@/types/IWorkExperience"
import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import { AdminWorkItem } from "./adminWorkItem";
import { useCallback, useState } from "react";
import { Logger } from "@/utils/logger";
import * as RepoWorksServer from "@/db/repositories/RepoWorks.server";
import { LoadingScreen } from "@/components/loadingScreen/LoadingScreen";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const result = await RepoWorksServer.remove(id);
      if(!result) {
        throw new Error('Internal error');
      }

      router.refresh();
      Logger.debug(id,'DELETE');
    } catch (error: any) {
      Logger.error(error,'DELETE Error');
    } finally {
      setIsLoading(false);
    }
  },[]);

  if(isLoading) {
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