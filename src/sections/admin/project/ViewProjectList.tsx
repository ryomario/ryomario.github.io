'use client';

import { AdminProjectList } from "@/components/admin/project/adminProjectList";
import { AdminWorkSearch } from "@/components/admin/work/adminWorkSearch";
import { AdminRoute } from "@/types/EnumAdminRoute";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export function ViewProjectList() {
  const redirectPath = (id: string) => `${AdminRoute.PROJECT_VIEW}/${id}`;
  const redirectPathEdit = (id: string) => `${AdminRoute.PROJECT_EDIT}/${id}`;

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
      <AdminWorkSearch redirectPath={redirectPath} />
    </Box>
  );

  return <>
    <Stack spacing={2} sx={{ mb: 3 }}>
      {renderFilters()}
    </Stack>

    <AdminProjectList
      getRedirectPathDetails={redirectPath}
      getRedirectPathEdit={redirectPathEdit}
    />
  </>;
}