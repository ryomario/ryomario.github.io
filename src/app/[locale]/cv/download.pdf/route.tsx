import { getCVData } from "@/data/cv"
import { NextRequest, NextResponse } from "next/server"
import { Locale, routing } from "@/i18n/routing"
import { CV } from "@/components/pdf/cv"
import { getMessages } from "next-intl/server"
import { renderToBuffer } from "@react-pdf/renderer"

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

  try {
    const cvData = await getCVData(locale)

    const pdfBuffer = await renderToBuffer(
      <CV locale={locale} messages={messages} data={cvData}/>
    )

    // Set headers for PDF download
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', 'attachment; filename=cv_mario.pdf')
    headers.set('Content-Length', pdfBuffer.length.toString())

    // Return the PDF file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: headers
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? error ?? 'Internal server error' }, 
      { status: 500 }
    )
  }
}
