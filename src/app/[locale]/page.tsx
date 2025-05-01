import { Button } from "@/components/reusable/button";
import {
  HeroSection,
  ProjectsShowcase
} from "@/components/sections/home";
import { Locale, routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProfileData } from "../db/functions/profile_data";

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
    <>
      <HeroSection/>
      <ProjectsShowcase maxItems={6}/>
      <div className="mt-8 sm:mt-10 flex justify-center">
        <Button
          href="/projects"
          text={t('btn_more_projects')}
          label={t('btn_more_projects')}
        />
			</div>
    </>
  );
}
