import {
  ProjectsShowcase
} from "@/components/sections/home";
import { ProjectsProvider } from "@/contexts/projectsContext";
import RepoProjects from "@/db/repositories/RepoProjects";

export default async function ProjectsPage() {
  const projects = await RepoProjects.getAll()
  const project_tags = await RepoProjects.getAllTags()
  const project_tech = await RepoProjects.getAllTechs()
  return (
    <ProjectsProvider data={projects} tags={project_tags} tech={project_tech}>
      <ProjectsShowcase showAll/>
    </ProjectsProvider>
  );
}
