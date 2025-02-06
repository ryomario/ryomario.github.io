import { Link, Locale, routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  
  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations('HomePage')

  return (
    <></>
  );
}
