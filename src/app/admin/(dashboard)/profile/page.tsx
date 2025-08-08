import { ViewProfile } from "@/sections/admin/profile/ViewProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Profile | Dashboard Admin - Web Portofolio",
};

export default async function Page() {
  return <ViewProfile />
}
