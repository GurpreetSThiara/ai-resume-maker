import { NextResponse } from 'next/server'
import { getDownloadStats } from '@/lib/download-tracker'

export async function GET() {
  try {
    const stats = await getDownloadStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting download stats:', error)
    return NextResponse.json(
      { error: 'Failed to get download stats' },
      { status: 500 }
    )
  }
}
