import { ViewProfileProfessional } from "@/sections/admin/profile/ViewProfileProfessional";
import { ViewProfileSocials } from "@/sections/admin/profile/ViewProfileSocials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Social Links Profile | Dashboard Admin - Web Portofolio",
};

export default async function Page() {
  return <ViewProfileProfessional />
}
