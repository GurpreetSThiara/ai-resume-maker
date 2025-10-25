import { NextRequest, NextResponse } from 'next/server'
import { submitReview, getReviews, getReviewStats, markReviewHelpful, reportReview } from '@/lib/review-service'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required to submit reviews' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, rating, comment, jobTitle, company, location } = body

    if (!name || !rating || !comment) {
      return NextResponse.json(
        { error: 'Name, rating, and comment are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const result = await submitReview({
      name,
      rating,
      comment,
      jobTitle,
      company,
      location,
      verified: false, // Could implement verification logic later
    }, user.id)

    if (result.success) {
      return NextResponse.json({ success: true, reviewId: result.reviewId })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to submit review' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const { reviews, total } = await getReviews(page, limit)

    return NextResponse.json({ reviews, total, page, limit })
  } catch (error) {
    console.error('Error getting reviews:', error)
    return NextResponse.json(
      { error: 'Failed to get reviews' },
      { status: 500 }
    )
  }
}
