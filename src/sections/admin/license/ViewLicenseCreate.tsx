'use client';

import { AdminLicenseForm } from "@/components/admin/license/adminLicenseForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { useRouter } from "next/navigation";

export function ViewLicenseCreate() {
  const router = useRouter();

  return <AdminLicenseForm afterSubmit={() => router.push(AdminRoute.LICENSE)} />;
}