import RepoEducations from "@/db/repositories/RepoEducations";
import { ViewEducationCreate } from "@/sections/admin/education/ViewEducationCreate";

export default async function Page() {
  const dataMajors = await RepoEducations.getAllMajors();

  return <ViewEducationCreate refMajors={dataMajors} />
}
