import { NextRequest, NextResponse } from 'next/server'
import { getReviewStats } from '@/lib/review-service'

export async function GET() {
  try {
    const stats = await getReviewStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting review stats:', error)
    return NextResponse.json(
      { error: 'Failed to get review stats' },
      { status: 500 }
    )
  }
}
