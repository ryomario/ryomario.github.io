import RepoProjects from "@/db/repositories/RepoProjects";
import { ViewProjectCreate } from "@/sections/admin/project/ViewProjectCreate";

export default async function Page() {
  const dataTags = await RepoProjects.getAllTags();

  return (
    <ViewProjectCreate
      refTags={dataTags}
    />
  );
}
