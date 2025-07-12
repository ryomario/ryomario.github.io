'use client';

import { AdminWorkForm } from "@/components/admin/work/adminWorkForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IWorkExperience } from "@/types/IWorkExperience";
import { useRouter } from "next/navigation";

type Props = {
  values: IWorkExperience;
}

export function ViewWorkUpdate({ values }: Props) {
  const router = useRouter();
  
  return <AdminWorkForm values={values} afterSubmit={() => router.push(AdminRoute.WORK)}/>;
}