'use client';

import { AdminProjectDetails } from "@/components/admin/project/adminProjectDetails";
import { IProject } from "@/types/IProject";

type Props = {
  data: IProject;
}

export function ViewProjectDetails({ data }: Props) {
  return <AdminProjectDetails data={data} />;
}