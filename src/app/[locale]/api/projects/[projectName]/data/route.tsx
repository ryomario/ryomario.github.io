import { getOneProjectData, getProjects } from "@/data/projects";
import { Locale, routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const projects = await getProjects()
  return routing.locales.reduce((arr: any[], locale) => {
    projects.forEach(name => {
      arr.push({
        locale,
        projectName: name
      })
    })
    return arr
  },[]);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string, projectName: string }> }
): Promise<NextResponse> {
  let { locale } = await params
  const { projectName } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }

  try {
    const project = await getOneProjectData(projectName,locale)
  
    return NextResponse.json({
      data: project,
    },{
      status: 200
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? error ?? 'Project not found' }, { status: 404 })
  }
}