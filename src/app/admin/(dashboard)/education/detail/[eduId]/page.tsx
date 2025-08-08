import RepoEducations from "@/db/repositories/RepoEducations";
import { ViewEducationDetails } from "@/sections/admin/education/ViewEducationDetails";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const educations = await RepoEducations.getAll()
  return educations.map(({ id }) => ({
    eduId: id.toString(),
  }));
}

export default async function Page({ params }: Readonly<{
  params: Promise<{ eduId: string }>;
}>) {
  const { eduId } = await params;
  const id = Number(eduId);
  if(Number.isNaN(id)) {
    return notFound();
  }

  const data = await RepoEducations.getOne(id);

  if(!data) {
    return notFound();
  }

  return <ViewEducationDetails data={data}/>;
}
