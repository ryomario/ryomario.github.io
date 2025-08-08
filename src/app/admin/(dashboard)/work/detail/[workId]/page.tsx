import RepoWorks from "@/db/repositories/RepoWorks";
import { ViewWorkDetails } from "@/sections/admin/work/ViewWorkDetails";
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

  return <ViewWorkDetails data={data} />;
}
