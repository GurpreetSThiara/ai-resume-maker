import { NextResponse } from 'next/server'
import { markReviewHelpful } from '@/lib/review-service'
import { requireUser } from '@/lib/api/auth'
import { MESSAGES } from '@/constants/messages'
import { REVIEW_VOTE_RESULTS } from '@/types/review'

type RouteContext = { params: Promise<{ reviewId: string }> }

export async function POST(_request: Request, { params }: RouteContext) {
  // Previously read searchParams.get('reviewId') inside this [reviewId] route,
  // so the id was always null and every request 400'd — see QA_AUDIT.md H3.
  const { reviewId } = await params

  const { user, response } = await requireUser()
  if (response) return response

  try {
    switch (await markReviewHelpful(reviewId, user.id)) {
      case REVIEW_VOTE_RESULTS.OK:
        return NextResponse.json({ success: true })
      case REVIEW_VOTE_RESULTS.ALREADY_VOTED:
        return NextResponse.json({ error: MESSAGES.REVIEW_ALREADY_VOTED }, { status: 409 })
      case REVIEW_VOTE_RESULTS.NOT_FOUND:
        return NextResponse.json({ error: MESSAGES.REVIEW_NOT_FOUND }, { status: 404 })
    }
  } catch (error) {
    console.error('Error marking review helpful:', error)
    return NextResponse.json({ error: MESSAGES.REVIEW_HELPFUL_FAILED }, { status: 500 })
  }
}
