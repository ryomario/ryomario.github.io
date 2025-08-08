import RepoWorks from "@/db/repositories/RepoWorks";
import { ViewWorkUpdate } from "@/sections/admin/work/ViewWorkUpdate";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const works = await RepoWorks.getAll()
  return works.map(({ id }) => ({
    workId: id.toString(),
  }));
}

export default async function Page({ params }: Readonly<{
  params: Promise<{ workId: string }>;
}>) {
  const { workId } = await params;
  const id = Number(workId);
  if (Number.isNaN(id)) {
    return notFound();
  }

  const data = await RepoWorks.getOne(id);

  if (!data) {
    return notFound();
  }

  const dataSkills = await RepoWorks.getAllSkills();
  const dataLocations = await RepoWorks.getAllWorkLocations();

  return (
    <ViewWorkUpdate
      values={data}
      refLocations={dataLocations}
      refSkills={dataSkills}
    />
  );
}
