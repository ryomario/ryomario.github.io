'use client';

import { AdminEducationList } from "@/components/admin/education/adminEducationList";
import { AdminEducationSearch } from "@/components/admin/education/adminEducationSearch";
import { AdminRoute } from "@/types/EnumAdminRoute";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export function ViewEducationList() {
  const redirectPath = (id: string) => `${AdminRoute.EDUCATION_VIEW}/${id}`;
  const redirectPathEdit = (id: string) => `${AdminRoute.EDUCATION_EDIT}/${id}`;

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
      <AdminEducationSearch redirectPath={redirectPath} />
    </Box>
  );

  return <>
    <Stack spacing={2} sx={{ mb: 3 }}>
      {renderFilters()}
    </Stack>

    <AdminEducationList
      getRedirectPathDetails={redirectPath}
      getRedirectPathEdit={redirectPathEdit}
    />
  </>;
}