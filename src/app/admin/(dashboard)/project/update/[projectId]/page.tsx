import RepoProjects from "@/db/repositories/RepoProjects";
import { ViewProjectUpdate } from "@/sections/admin/project/ViewProjectUpdate";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = await RepoProjects.getAll()
  return projects.map(({ id }) => ({
    projectId: id.toString(),
  }));
}

export default async function Page({ params }: Readonly<{
  params: Promise<{ projectId: string }>;
}>) {
  const { projectId } = await params;
  const id = Number(projectId);
  if (Number.isNaN(id)) {
    return notFound();
  }

  const data = await RepoProjects.getOne(id);

  if (!data) {
    return notFound();
  }

  const refTags = await RepoProjects.getAllTags();

  return (
    <ViewProjectUpdate
      values={data}
      refTags={refTags}
    />
  );
}
