import { EditProjectSection } from "@/components/admin/projetcs/sections/editProjectSection";
import RepoProjects from "@/db/repositories/RepoProjects";
import { notFound } from "next/navigation";
import React from "react";

export async function generateStaticParams() {
  const projects = await RepoProjects.getAll()
  return projects.map(({project_id}) => ({
    id: project_id.toString(),
  }));
}

export default async function EditProjectPage({ params }: Readonly<{
  params: Promise<{ locale: string, id: string }>;
}>) {
  const { locale, id } = await params

  const project_id = Number(id)

  if(isNaN(project_id)) {
    return notFound()
  }

  const project = await RepoProjects.getOne(project_id)

  if(!project) {
    return null
  }

  return (
    <EditProjectSection project={project}/>
  )
}
