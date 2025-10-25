import { NextRequest, NextResponse } from 'next/server'
import { reportReview } from '@/lib/review-service'

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

    const success = await reportReview(reviewId)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to report review' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error reporting review:', error)
    return NextResponse.json(
      { error: 'Failed to report review' },
      { status: 500 }
    )
  }
}
