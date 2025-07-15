import RepoEducations from "@/db/repositories/RepoEducations";
import { dbEducationMajorsTransform } from "@/db/utils/educationTransforms";
import { ViewEducationCreate } from "@/sections/admin/education/ViewEducationCreate";

export default async function Page() {
  const dataDb = await RepoEducations.getAllMajors();

  return <ViewEducationCreate refMajors={dbEducationMajorsTransform(dataDb)}/>
}
