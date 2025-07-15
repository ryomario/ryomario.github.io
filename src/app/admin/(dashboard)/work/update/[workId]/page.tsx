import * as RepoWorksServer from "@/db/repositories/RepoWorks.server";
import { dbWorkLocatoinsTransform, dbWorkSkillsTransform, dbWorkTransform } from "@/db/utils/workTransforms";
import { ViewWorkUpdate } from "@/sections/admin/work/ViewWorkUpdate";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const works = await RepoWorksServer.getAll()
  return works.map(({ id }) => ({
    workId: id.toString(),
  }));
}

export default async function Page({ params }: Readonly<{
  params: Promise<{ workId: string }>;
}>) {
  const { workId } = await params;
  const id = Number(workId);
  if(Number.isNaN(id)) {
    return notFound();
  }

  const data = await RepoWorksServer.getOne(id);

  if(!data) {
    return notFound();
  }
  
  const dataDbSkills = await RepoWorksServer.getAllSkills();
  const dataDbLocations = await RepoWorksServer.getAllWorkLocations();
  const values = dbWorkTransform(data);

  return (
    <ViewWorkUpdate
      values={values}
      refLocations={dbWorkLocatoinsTransform(dataDbLocations)}
      refSkills={dbWorkSkillsTransform(dataDbSkills)}
    />
  );
}
