'use client';

import { AdminEducationForm } from "@/components/admin/education/adminEducationForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IEducation } from "@/types/IEducation";
import { useRouter } from "next/navigation";

type Props = {
  refMajors: IEducation['majors'];
}

export function ViewEducationCreate({ refMajors }: Props) {
  const router = useRouter();
  
  return <AdminEducationForm afterSubmit={() => router.push(AdminRoute.EDUCATION)} refMajors={refMajors}/>;
}