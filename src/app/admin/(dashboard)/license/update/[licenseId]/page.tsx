import RepoLicenses from "@/db/repositories/RepoLicenses";
import { ViewLicenseUpdate } from "@/sections/admin/license/ViewLicenseUpdate";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const licenses = await RepoLicenses.getAll()
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

  const data = await RepoLicenses.getOne(id);

  if(!data) {
    return notFound();
  }

  return (
    <ViewLicenseUpdate
      values={data}
    />
  );
}
