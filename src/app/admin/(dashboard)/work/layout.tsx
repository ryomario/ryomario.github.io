import { WorkLayout } from "@/sections/admin/work/WorkLayout";
import React from "react";

export default async function ProfilePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WorkLayout>{children}</WorkLayout>
  );
}