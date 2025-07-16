import * as RepoLicensesServer from "@/db/repositories/RepoLicenses.server";
import { dbWorkLocatoinsTransform, dbWorkSkillsTransform, dbWorkTransform } from "@/db/utils/workTransforms";
import { ViewLicenseUpdate } from "@/sections/admin/license/ViewLicenseUpdate";
import { ViewWorkUpdate } from "@/sections/admin/work/ViewWorkUpdate";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const licenses = await RepoLicensesServer.getAll()
  return licenses.map(({ id }) => ({
    licenseId: id.toString(),
  }));
}

export default async function Page({ params }: Readonly<{
  params: Promise<{ licenseId: string }>;
}>) {
  const { licenseId } = await params;
  const id = Number(licenseId);
  if(Number.isNaN(id)) {
    return notFound();
  }

  const data = await RepoLicensesServer.getOne(id);

  if(!data) {
    return notFound();
  }

  return (
    <ViewLicenseUpdate
      values={data}
    />
  );
}
