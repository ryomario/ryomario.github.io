import { projectsData } from "@/data/projects";
import { Locale, routing } from "@/i18n/routing";
import { createTranslator } from "next-intl";
import { getMessages } from "next-intl/server";
import { fetchExternalImage } from "next/dist/server/image-optimizer";
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
  { params }: { params: Promise<{ projectId: string }> }
): Promise<NextResponse> {
  const { projectId } = await params
  const imgUrl = projectsData.find(({ id }) => String(id) == projectId)?.imgUrl

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
}