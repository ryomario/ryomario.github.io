import RepoEducations from "@/db/repositories/RepoEducations";
import { dbEducationTransform } from "@/db/utils/educationTransforms";
import { ViewEducationList } from "@/sections/admin/education/ViewEducationList";

export default async function Page() {
  const dataDb = await RepoEducations.getAll();
  const data = dataDb.map(dbEducationTransform);
  
  return <ViewEducationList data={data} />;
}
