import * as RepoProjectsServer from "@/db/repositories/RepoProjects.server";
import { ViewProjectCreate } from "@/sections/admin/project/ViewProjectCreate";

export default async function Page() {
  const dataTags = await RepoProjectsServer.getAllTags();

  return (
    <ViewProjectCreate
      refTags={dataTags}
    />
  );
}
