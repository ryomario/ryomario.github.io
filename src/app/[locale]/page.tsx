import { Button } from "@/components/reusable/button";
import {
  HeroSection,
  ProjectsShowcase
} from "@/components/sections/home";
import { ProjectsProvider } from "@/contexts/projectsContext";
import RepoProjects from "@/db/repositories/RepoProjects";
import { Locale, routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

  const projects = await RepoProjects.getAll()
  const project_tags = await RepoProjects.getAllTags()
  const project_tech = await RepoProjects.getAllTechs()

  return (
    <>
      <HeroSection/>
      <ProjectsProvider data={projects} tags={project_tags} tech={project_tech}>
        <ProjectsShowcase/>
      </ProjectsProvider>
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
