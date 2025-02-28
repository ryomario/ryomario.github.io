import { getProjectsData } from "@/data/projects";
import { Locale, routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
): Promise<NextResponse> {
  let { locale } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }
  
  const projects = await getProjectsData(locale)

  return NextResponse.json({
    data: projects.reduce<string[]>(
      (arr,project) => arr.concat(...project.tags),
    []).filter((str, i, self) => i === self.indexOf(str))
  },{
    status: 200
  })
}