'use client';

import { AdminWorkList } from "@/components/admin/work/adminWorkList";
import { AdminWorkSearch } from "@/components/admin/work/adminWorkSearch";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IWorkExperience } from "@/types/IWorkExperience";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

type Props = {
  data: IWorkExperience[];
}

export function ViewWorkList({ data }: Props) {
  const redirectPath = (id: string) => `${AdminRoute.WORK_VIEW}/${id}`;
  const redirectPathEdit = (id: string) => `${AdminRoute.WORK_EDIT}/${id}`;

  const renderFilters = () => (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-end', sm: 'center' },
      }}
    >
      <AdminWorkSearch redirectPath={redirectPath}/>
    </Box>
  );

  return <>
    <Stack spacing={2} sx={{ mb: 3 }}>
      {renderFilters()}
    </Stack>

    <AdminWorkList
      data={data}
      getRedirectPathDetails={redirectPath}
      getRedirectPathEdit={redirectPathEdit}
    />
  </>;
}