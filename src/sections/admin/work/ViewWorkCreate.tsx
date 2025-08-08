'use client';

import { AdminWorkForm } from "@/components/admin/work/adminWorkForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IWorkExperience } from "@/types/IWorkExperience";
import { useRouter } from "next/navigation";

type Props = {
  refSkills: IWorkExperience['skills'];
  refLocations: IWorkExperience['location'];
}

export function ViewWorkCreate({ refLocations, refSkills }: Props) {
  const router = useRouter();
  
  return <AdminWorkForm refLocations={refLocations} refSkills={refSkills} afterSubmit={() => router.push(AdminRoute.WORK)}/>;
}