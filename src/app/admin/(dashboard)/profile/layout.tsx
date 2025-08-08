import { ProfileLayout } from "@/sections/admin/profile/ProfileLayout";
import React from "react";

export default async function ProfilePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProfileLayout>{children}</ProfileLayout>
  );
}