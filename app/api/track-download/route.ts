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
    // Only persist download counts to MongoDB when running on createfreecv.com
    const hostHeader = (request.headers.get('host') || '').toLowerCase()
    const hostname = hostHeader.split(':')[0]
    const isCreateFreeCvHost = hostname === 'createfreecv.com' || hostname === 'www.createfreecv.com'

    if (isCreateFreeCvHost) {
      await trackResumeDownload(format, resumeId, template, userAgent, ipAddress)
    } else {
      // Skip persisting to the DB in non-production / other-host environments
    //  console.log(`Skipping download tracking for host: ${hostHeader}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking download:', error)
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    )
  }
}
