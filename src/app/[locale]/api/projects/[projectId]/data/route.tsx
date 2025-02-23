import { projectsData } from "@/data/projects";
import { Locale, routing } from "@/i18n/routing";
import { createTranslator } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return routing.locales.reduce((arr: any[], locale) => {
    projectsData.forEach(({ id }) => {
      arr.push({
        locale,
        projectId: String(id)
      })
    })
    return arr
  },[]);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string, projectId: string }> }
): Promise<NextResponse> {
  let { locale } = await params
  const { projectId } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }

  const messages = await getMessages({locale})

  const t = createTranslator({
    locale,
    messages,
    namespace: "projects",
  })

  return NextResponse.json({
    data: projectsData.map(project => ({
      id: project.id,
      title: t.has(`${project.name}.title`) ? t(`${project.name}.title`) : project.title,
      desc: t.has(`${project.name}.desc`) ? t(`${project.name}.desc`) : project.desc,
      imgUrl: `/${locale}/api/projects/${project.id}/previewImg`,
      tags: t.has(`${project.name}.tags`) ? t(`${project.name}.tags`).split('|') : project.tags,
      dateCreated: project.dateCreated,
    })).find(({ id }) => String(id) == projectId)
  },{
    status: 200
  })
}