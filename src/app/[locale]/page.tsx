import { Locale, routing } from "@/i18n/routing";
import RenderTemplate from "@/templates";
import { getActiveTemplate } from "@/templates/registered";
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
  const templateName = await getActiveTemplate();

  return <RenderTemplate templateName={templateName} defaultLocale={curentLocale} />;
}
