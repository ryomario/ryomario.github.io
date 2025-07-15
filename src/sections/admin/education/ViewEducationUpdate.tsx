'use client';

import { AdminEducationForm } from "@/components/admin/education/adminEducationForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IEducation } from "@/types/IEducation";
import { useRouter } from "next/navigation";

type Props = {
  values: IEducation;
  refMajors: IEducation['majors'];
}

export function ViewEducationUpdate({ values, refMajors }: Props) {
  const router = useRouter();
  
  return <AdminEducationForm values={values} refMajors={refMajors} afterSubmit={() => router.push(AdminRoute.EDUCATION)}/>;
}