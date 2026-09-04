/** A review as stored in the `reviews` collection. */
export interface Review {
  _id?: string
  userId?: string
  name: string
  rating: number
  comment: string
  jobTitle?: string
  company?: string
  location?: string
  verified: boolean
  createdAt: Date
  helpful: number
  reported: boolean
  /**
   * User ids that have already registered a vote. Without these, the counters
   * were a one-line amplifier — the endpoints took no identity and applied no
   * limit.
   */
  helpfulBy?: string[]
  reportedBy?: string[]
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

/**
 * Outcome of a vote. `alreadyVoted` is kept distinct from `notFound` so the
 * caller can answer 409 vs 404 instead of collapsing both into a bare
 * boolean, which is what let a bogus review id report success.
 */
export const REVIEW_VOTE_RESULTS = {
  OK: 'ok',
  NOT_FOUND: 'notFound',
  ALREADY_VOTED: 'alreadyVoted',
} as const

export type ReviewVoteResult = (typeof REVIEW_VOTE_RESULTS)[keyof typeof REVIEW_VOTE_RESULTS]
