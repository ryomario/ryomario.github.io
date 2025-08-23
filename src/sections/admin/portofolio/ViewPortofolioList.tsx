'use client';

import { AdminPortofolioList } from "@/components/admin/portofolio/adminPortofolioList";
import { UpdateOGImageButton } from "@/components/admin/portofolio/updateOGImageButton";
import { CustomBreadCrumbs } from "@/components/layouts/content/CustomBreadCrumbs";
import { AdminRoute } from "@/types/EnumAdminRoute";

export function ViewPotofolioList() {
  return (
    <>
      <CustomBreadCrumbs
        heading="List of Available Portofolio"
        links={[
          { name: 'Dashboard', href: AdminRoute.DASHBOARD },
          { name: 'Portofolio' },
        ]}
        action={
          <UpdateOGImageButton />
        }
      />

      <AdminPortofolioList />
    </>
  );
}