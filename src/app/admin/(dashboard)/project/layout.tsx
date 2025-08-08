import { ProjectLayout } from "@/sections/admin/project/ProjectLayout";
import React from "react";

export default async function ProfilePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProjectLayout>{children}</ProjectLayout>
  );
}