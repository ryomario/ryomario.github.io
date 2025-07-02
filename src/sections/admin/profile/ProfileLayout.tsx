'use client';

import { CustomBreadCrumbs } from "@/components/layouts/content/CustomBreadCrumbs";
import { removeTrailingSlash } from "@/lib/url";
import { AdminRoute } from "@/types/EnumAdminRoute";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ShareIcon from '@mui/icons-material/Share';

import RouterLink from "next/link";

import { usePathname } from "next/navigation";
import React from "react";

export function ProfileLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();

  return (
    <>
      <CustomBreadCrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: AdminRoute.DASHBOARD },
          { name: 'Profile', href: AdminRoute.PROFILE },
        ]}
      />

      <Tabs value={removeTrailingSlash(pathname)} sx={{ mb: { xs: 3, md: 5 }}}>
        <Tab
          LinkComponent={RouterLink}
          label="General"
          icon={<ManageAccountsIcon/>}
          value={AdminRoute.PROFILE}
          href={AdminRoute.PROFILE}
        />
        <Tab
          LinkComponent={RouterLink}
          label="Social Links"
          icon={<ShareIcon/>}
          value={AdminRoute.PROFILE_SOCIALS}
          href={AdminRoute.PROFILE_SOCIALS}
        />
      </Tabs>

      {children}
    </>
  );
}