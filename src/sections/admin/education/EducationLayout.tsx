'use client';

import { CustomBreadCrumbs } from "@/components/layouts/content/CustomBreadCrumbs";
import { removeTrailingSlash } from "@/lib/url";
import { AdminRoute } from "@/types/EnumAdminRoute";

import { notFound, usePathname } from "next/navigation";
import React from "react";
import Button from "@mui/material/Button";

import AddIcon from '@mui/icons-material/Add';
import RouterLink from "next/link";

export function EducationLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const currPath = removeTrailingSlash(pathname);

  let currPage = '';
  if(currPath.startsWith(AdminRoute.EDUCATION_VIEW)) {
    currPage = 'Details';
  } else if(currPath.startsWith(AdminRoute.EDUCATION_EDIT)) {
    currPage = 'Update';
  } else if(currPath.startsWith(AdminRoute.EDUCATION_ADD)) {
    currPage = 'Create';
  } else if(currPath.startsWith(AdminRoute.EDUCATION)) {
    currPage = 'List';
  }

  if(!currPage) {
    return notFound();
  }

  return (
    <>
      <CustomBreadCrumbs
        backHref={currPage != 'List' ? AdminRoute.EDUCATION : undefined}
        heading={`${currPage} Education`}
        links={[
          { name: 'Dashboard', href: AdminRoute.DASHBOARD },
          { name: 'Education', href: AdminRoute.EDUCATION },
          { name: currPage },
        ]}
        action={
          currPage == 'List' && <Button
            variant="contained"
            startIcon={
              <AddIcon/>
            }
            LinkComponent={RouterLink}
            href={AdminRoute.EDUCATION_ADD}
          >
            Add Education
          </Button>
        }
      />

      {children}
    </>
  );
}