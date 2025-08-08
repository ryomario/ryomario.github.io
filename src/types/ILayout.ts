import React from "react";

export interface IDashboardNavItem {
  icon: React.ReactNode;
  title: string;
  path?: string;
}

export type IDashboardNavData = {
  subheader?: Omit<IDashboardNavItem, 'path'>;
  items: IDashboardNavItem[];
}[]
