'use client';

import { AdminProjectForm } from "@/components/admin/project/adminProjectForm";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IProject } from "@/types/IProject";
import { useRouter } from "next/navigation";

type Props = {
  refTags: IProject['tags'];
}

export function ViewProjectCreate({ refTags }: Props) {
  const router = useRouter();

  return <AdminProjectForm refTags={refTags.length ? refTags : undefined} afterSubmit={() => router.push(AdminRoute.PROJECT)} />;
}