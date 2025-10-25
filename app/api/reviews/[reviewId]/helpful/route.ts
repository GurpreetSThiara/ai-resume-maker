import { NextRequest, NextResponse } from 'next/server'
import { markReviewHelpful, reportReview } from '@/lib/review-service'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    const success = await markReviewHelpful(reviewId)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to mark review as helpful' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error marking review helpful:', error)
    return NextResponse.json(
      { error: 'Failed to mark review as helpful' },
      { status: 500 }
    )
  }
}
