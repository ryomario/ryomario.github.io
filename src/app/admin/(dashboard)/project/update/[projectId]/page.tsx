import * as RepoProjectsServer from "@/db/repositories/RepoProjects.server";
import { ViewProjectUpdate } from "@/sections/admin/project/ViewProjectUpdate";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = await RepoProjectsServer.getAll()
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

  const data = await RepoProjectsServer.getOne(id);

  if (!data) {
    return notFound();
  }

  const refTags = await RepoProjectsServer.getAllTags();

  return (
    <ViewProjectUpdate
      values={data}
      refTags={refTags}
    />
  );
}
