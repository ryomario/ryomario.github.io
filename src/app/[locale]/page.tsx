import RepoProfileData from "@/db/repositories/RepoProfileData";
import { Locale, routing } from "@/i18n/routing";
import RenderTemplate from "@/templates";
import { ACTIVE_TEMPlATE_STORE_ID } from "@/types/templates/ITemplate";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function SPAPage({ params }: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const curentLocale = locale as Locale;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(curentLocale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // get active template
  const activeTemplateIdx = await RepoProfileData.getOne<number>(ACTIVE_TEMPlATE_STORE_ID, 0);

  return <RenderTemplate currentTemplate={activeTemplateIdx} defaultLocale={curentLocale} />;
}
