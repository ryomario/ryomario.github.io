'use client';

import { AdminLicenseList } from "@/components/admin/license/adminLicenseList";
import { AdminWorkList } from "@/components/admin/work/adminWorkList";
import { AdminWorkSearch } from "@/components/admin/work/adminWorkSearch";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IWorkExperience } from "@/types/IWorkExperience";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export function ViewLicenseList() {
  const redirectPathEdit = (id: string) => `${AdminRoute.LICENSE_EDIT}/${id}`;

  return <>
    <AdminLicenseList
      getRedirectPathEdit={redirectPathEdit}
    />
  </>;
}