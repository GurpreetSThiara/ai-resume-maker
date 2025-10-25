import { NextRequest, NextResponse } from 'next/server'
import { trackResumeDownload } from '@/lib/download-tracker'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, resumeId, template } = body

    if (!format || !['pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be pdf or docx' },
        { status: 400 }
      )
    }

    // Get user agent and IP address
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.ip || 
      request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      undefined

    // Track the download
    await trackResumeDownload(format, resumeId, template, userAgent, ipAddress)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking download:', error)
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    )
  }
}
