'use client';

import { AdminWorkSearch } from "@/components/admin/work/adminWorkSearch";
import { AdminRoute } from "@/types/EnumAdminRoute";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export function ViewWorkList() {
  const redirectPath = (id: string) => `${AdminRoute.WORK_VIEW}?${id}`;

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

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {renderFilters()}
    </Stack>
  );
}