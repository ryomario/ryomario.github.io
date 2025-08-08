import { ViewWorkCreate } from "@/sections/admin/work/ViewWorkCreate";
import RepoWorks from "@/db/repositories/RepoWorks";

export default async function Page() {
  const dataSkills = await RepoWorks.getAllSkills();
  const dataLocations = await RepoWorks.getAllWorkLocations();

  return (
    <ViewWorkCreate
      refLocations={dataLocations}
      refSkills={dataSkills}
    />
  );
}
