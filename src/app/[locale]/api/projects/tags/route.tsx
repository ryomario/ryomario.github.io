import { projectsData } from "@/data/projects";
import { Locale, routing } from "@/i18n/routing";
import { createTranslator } from "next-intl";
import { getMessages } from "next-intl/server";
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

  const messages = await getMessages({locale})

  const t = createTranslator({
    locale,
    messages,
    namespace: "projects",
  })

  return NextResponse.json({
    data: projectsData.reduce<string[]>(
      (arr,project) => arr.concat(...(t.has(`${project.name}.tags`) ? t(`${project.name}.tags`).split('|') : project.tags)),
    []).filter((str, i, self) => i === self.indexOf(str))
  },{
    status: 200
  })
}