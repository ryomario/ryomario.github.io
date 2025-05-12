import { ProjectsTableAdmin } from "@/components/admin/projetcs/projectsTableAdmin";
import { ProjectsProvider } from "@/contexts/projectsContext";
import RepoProjects from "@/db/repositories/RepoProjects";
import React from "react";

export default async function Page() {
  const projects = await RepoProjects.getAll()
  const tags = await RepoProjects.getAllTags()
  const tech = await RepoProjects.getAllTechs()

  return <>
    <ProjectsProvider data={projects} tags={tags} tech={tech}>
      <ProjectsTableAdmin />
    </ProjectsProvider>
  </>
}
