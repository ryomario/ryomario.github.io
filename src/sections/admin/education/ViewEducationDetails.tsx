'use client';

import { AdminEducationDetails } from "@/components/admin/education/adminEducationDetails";
import { IEducation } from "@/types/IEducation";

type Props = {
  data: IEducation;
}

export function ViewEducationDetails({ data }: Props) {  
  return <AdminEducationDetails data={data} />;
}