import { NextResponse } from 'next/server'
import { reportReview } from '@/lib/review-service'
import { requireUser } from '@/lib/api/auth'
import { MESSAGES } from '@/constants/messages'
import { REVIEW_VOTE_RESULTS } from '@/types/review'

type RouteContext = { params: Promise<{ reviewId: string }> }

export async function POST(_request: Request, { params }: RouteContext) {
  const { reviewId } = await params

  const { user, response } = await requireUser()
  if (response) return response

  try {
    switch (await reportReview(reviewId, user.id)) {
      case REVIEW_VOTE_RESULTS.OK:
        return NextResponse.json({ success: true })
      case REVIEW_VOTE_RESULTS.ALREADY_VOTED:
        return NextResponse.json({ error: MESSAGES.REVIEW_ALREADY_VOTED }, { status: 409 })
      case REVIEW_VOTE_RESULTS.NOT_FOUND:
        return NextResponse.json({ error: MESSAGES.REVIEW_NOT_FOUND }, { status: 404 })
    }
  } catch (error) {
    console.error('Error reporting review:', error)
    return NextResponse.json({ error: MESSAGES.REVIEW_REPORT_FAILED }, { status: 500 })
  }
}
