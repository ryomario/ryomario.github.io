import { EducationLayout } from "@/sections/admin/education/EducationLayout";
import React from "react";

export default async function ProfilePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EducationLayout>{children}</EducationLayout>
  );
}