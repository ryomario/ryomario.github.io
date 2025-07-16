import { LicenseLayout } from "@/sections/admin/license/LicenseLayout";
import React from "react";

export default async function ProfilePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LicenseLayout>{children}</LicenseLayout>
  );
}