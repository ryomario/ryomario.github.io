'use client';

import { AdminProjectForm } from "@/components/admin/project/adminProjectForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IProject } from "@/types/IProject";
import { useRouter } from "next/navigation";

type Props = {
  values: IProject;
  refTags: IProject['tags'];
}

export function ViewProjectUpdate({ values, refTags }: Props) {
  const router = useRouter();

  return <AdminProjectForm values={values} refTags={refTags} afterSubmit={() => router.push(AdminRoute.PROJECT)} />;
}