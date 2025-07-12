import * as RepoWorksServer from "@/db/repositories/RepoWorks.server";
import { dbWorkTransform } from "@/db/utils/workTransforms";
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

  const values = dbWorkTransform(data);

  /* TODO - view details */
  return <ViewWorkUpdate values={values}/>;
}
