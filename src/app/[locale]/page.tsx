import { Locale, routing } from "@/i18n/routing";
import TemplateProvider from "@/templates/provider";
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

  return <TemplateProvider defaultLocale={curentLocale} />;
}
