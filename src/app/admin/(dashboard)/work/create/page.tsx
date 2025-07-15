import { ViewWorkCreate } from "@/sections/admin/work/ViewWorkCreate";
import * as RepoWorksServer from "@/db/repositories/RepoWorks.server";
import { dbWorkLocatoinsTransform, dbWorkSkillsTransform } from "@/db/utils/workTransforms";

export default async function Page() {
  const dataDbSkills = await RepoWorksServer.getAllSkills();
  const dataDbLocations = await RepoWorksServer.getAllWorkLocations();

  return (
    <ViewWorkCreate
      refLocations={dbWorkLocatoinsTransform(dataDbLocations)}
      refSkills={dbWorkSkillsTransform(dataDbSkills)}
    />
  );
}
