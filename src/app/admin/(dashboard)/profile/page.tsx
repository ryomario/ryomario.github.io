import { ViewProfile } from "@/components/admin/profile/ViewProfile";
import { CustomBreadCrumbs } from "@/components/layouts/content/CustomBreadCrumbs";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IProfileForm } from "@/types/IProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Profile | Dashboard Admin - Web Portofolio",
};

export default async function Page() {
  return <>
    <CustomBreadCrumbs
      heading="Profile"
      links={[
        { name: 'Dashboard', href: AdminRoute.DASHBOARD },
        { name: 'Profile', href: AdminRoute.PROFILE },
      ]}
    />
    <ViewProfile />
  </>
}
