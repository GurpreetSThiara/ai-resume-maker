import { NextRequest, NextResponse } from 'next/server'
import { submitReview, getReviews } from '@/lib/review-service'
import { requireUser } from '@/lib/api/auth'
import { MESSAGES } from '@/constants/messages'

export async function POST(request: NextRequest) {
  const { user, response } = await requireUser()
  if (response) return response

  try {
    const body = await request.json()
    const { name, rating, comment, jobTitle, company, location } = body

    if (!name || !rating || !comment) {
      return NextResponse.json(
        { error: MESSAGES.REVIEW_FIELDS_REQUIRED },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: MESSAGES.REVIEW_RATING_RANGE },
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
        { error: result.error || MESSAGES.REVIEW_SUBMIT_FAILED },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json(
      { error: MESSAGES.REVIEW_SUBMIT_FAILED },
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
      { error: MESSAGES.REVIEW_LIST_FAILED },
      { status: 500 }
    )
  }
}
