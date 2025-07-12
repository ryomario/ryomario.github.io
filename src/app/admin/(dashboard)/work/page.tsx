import RepoWorks from "@/db/repositories/RepoWorks";
import { dbWorkTransform } from "@/db/utils/workTransforms";
import { ViewWorkList } from "@/sections/admin/work/ViewWorkList";

export default async function Page() {
  const dataDb = await RepoWorks.getAll();
  const data = dataDb.map(dbWorkTransform);
  
  return <ViewWorkList data={data} />
}
