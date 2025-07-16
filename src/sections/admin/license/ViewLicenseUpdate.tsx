'use client';

import { AdminLicenseForm } from "@/components/admin/license/adminLicenseForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { ILicense } from "@/types/ILicense";
import { useRouter } from "next/navigation";

type Props = {
  values: ILicense;
}

export function ViewLicenseUpdate({ values }: Props) {
  const router = useRouter();
  
  return <AdminLicenseForm values={values} afterSubmit={() => router.push(AdminRoute.LICENSE)}/>;
}