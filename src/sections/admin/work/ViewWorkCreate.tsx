'use client';

import { AdminWorkForm } from "@/components/admin/work/adminWorkForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { useRouter } from "next/navigation";

export function ViewWorkCreate() {
  const router = useRouter();
  
  return <AdminWorkForm afterSubmit={() => router.push(AdminRoute.WORK)}/>;
}