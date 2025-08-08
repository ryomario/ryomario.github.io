'use client';

import { AdminWorkDetails } from "@/components/admin/work/adminWorkDetails";
import { IWorkExperience } from "@/types/IWorkExperience";

type Props = {
  data: IWorkExperience;
}

export function ViewWorkDetails({ data }: Props) {  
  return <AdminWorkDetails data={data} />;
}