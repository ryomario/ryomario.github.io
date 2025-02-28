import { getOneProjectData, getProjects } from "@/data/projects";
import { Locale, routing } from "@/i18n/routing";
import { fetchExternalImage } from "next/dist/server/image-optimizer";
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
  { params }: { params: Promise<{ projectName: string, locale: string }> }
): Promise<NextResponse> {
  const { projectName } = await params
  let { locale } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }

  try {
    const { imgUrl } = await getOneProjectData(projectName,locale)
    
    if(!imgUrl) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const imgUpstream = await fetchExternalImage(imgUrl)

    const headers = new Headers()
    headers.set('Content-Type', imgUpstream.contentType ?? 'image/png')
    headers.set('Content-Length', imgUpstream.buffer.length.toString())
  
    return new NextResponse(imgUpstream.buffer,{
      headers,
      status: 200
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? error ?? 'Project not found' }, { status: 404 })
  }
}