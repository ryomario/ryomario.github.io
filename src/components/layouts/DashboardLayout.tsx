'use client';

import { styled, SxProps, Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import React, {  } from "react";

import Box from "@mui/material/Box";
import { IDashboardNavData } from "@/types/ILayout";
import { SidebarLayout } from "./sidebar/SidebarLayout";
import { TopbarLayout } from "./header/TopbarLayout";


export type DashboardLayoutProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  slotProps?: {
    nav?: {
      data?: IDashboardNavData;
    };
  };
}

export function DashboardLayout({
  sx,
  children,
  slotProps,
  ...rest
}: DashboardLayoutProps) {
  return (
    <LayoutRoot
      id="root__layout"
      sx={sx}
      {...rest}
    >
      {/** @slot HEADER **/}
      <TopbarLayout/>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/** @slot Sidebar  */}
        <SidebarLayout data={slotProps?.nav?.data}/>

        {/** @slot Main */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </LayoutRoot>
  );
}

const LayoutRoot = styled('div')`
display: flex;
`;
