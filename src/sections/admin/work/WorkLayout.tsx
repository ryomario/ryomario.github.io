'use client';

import { CustomBreadCrumbs } from "@/components/layouts/content/CustomBreadCrumbs";
import { removeTrailingSlash } from "@/lib/url";
import { AdminRoute } from "@/types/EnumAdminRoute";

import { notFound, usePathname } from "next/navigation";
import React from "react";
import Button from "@mui/material/Button";

import AddIcon from '@mui/icons-material/Add';
import RouterLink from "next/link";

export function WorkLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();

  const currPage = {
    [AdminRoute.WORK]: 'List',
    [AdminRoute.WORK_ADD]: 'Create',
    [AdminRoute.WORK_EDIT]: 'Update',
    [AdminRoute.WORK_VIEW]: 'Details',
  }[removeTrailingSlash(pathname)];

  if(!currPage) {
    return notFound();
  }

  return (
    <>
      <CustomBreadCrumbs
        heading={`${currPage} Work Experience`}
        links={[
          { name: 'Dashboard', href: AdminRoute.DASHBOARD },
          { name: 'Work Experience', href: AdminRoute.WORK },
          { name: currPage },
        ]}
        action={
          currPage == 'List' && <Button
            variant="contained"
            startIcon={
              <AddIcon/>
            }
            LinkComponent={RouterLink}
            href={AdminRoute.WORK_ADD}
          >
            Add Work Experience
          </Button>
        }
      />

      {children}
    </>
  );
}