import RepoEducations from "@/db/repositories/RepoEducations";
import { dbEducationMajorsTransform, dbEducationTransform } from "@/db/utils/educationTransforms";
import { ViewEducationUpdate } from "@/sections/admin/education/ViewEducationUpdate";
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

  const dataDbMajors = await RepoEducations.getAllMajors();

  return <ViewEducationUpdate values={data} refMajors={dbEducationMajorsTransform(dataDbMajors)}/>;
}
