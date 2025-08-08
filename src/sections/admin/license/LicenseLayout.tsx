'use client';

import { CustomBreadCrumbs } from "@/components/layouts/content/CustomBreadCrumbs";
import { removeTrailingSlash } from "@/lib/url";
import { AdminRoute } from "@/types/EnumAdminRoute";

import { notFound, usePathname } from "next/navigation";
import React from "react";
import Button from "@mui/material/Button";

import AddIcon from '@mui/icons-material/Add';
import RouterLink from "next/link";

export function LicenseLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const currPath = removeTrailingSlash(pathname);

  let currPage = '';
  if(currPath.startsWith(AdminRoute.LICENSE_EDIT)) {
    currPage = 'Update';
  } else if(currPath.startsWith(AdminRoute.LICENSE_ADD)) {
    currPage = 'Create';
  } else if(currPath.startsWith(AdminRoute.LICENSE)) {
    currPage = 'List';
  }

  if(!currPage) {
    return notFound();
  }

  return (
    <>
      <CustomBreadCrumbs
        backHref={currPage != 'List' ? AdminRoute.LICENSE : undefined}
        heading={`${currPage} License`}
        links={[
          { name: 'Dashboard', href: AdminRoute.DASHBOARD },
          { name: 'License', href: AdminRoute.LICENSE },
          { name: currPage },
        ]}
        action={
          currPage == 'List' && <Button
            variant="contained"
            startIcon={
              <AddIcon/>
            }
            LinkComponent={RouterLink}
            href={AdminRoute.LICENSE_ADD}
          >
            Add License
          </Button>
        }
      />

      {children}
    </>
  );
}