import { getMongoDb } from "./mongo"
import { REVIEW_VOTE_RESULTS, type Review, type ReviewStats, type ReviewVoteResult } from "@/types/review"

export type { Review, ReviewStats, ReviewVoteResult }

// Submit a new review
export async function submitReview(reviewData: Omit<Review, '_id' | 'createdAt' | 'helpful' | 'reported'>, userId: string): Promise<{ success: boolean; reviewId?: string; error?: string }> {
  try {
    const db = await getMongoDb()
    const reviewsCollection = db.collection<Review>('reviews')

    const review: Review = {
      ...reviewData,
      userId, // Add user ID to track who submitted the review
      createdAt: new Date(),
      helpful: 0,
      reported: false,
    }

    const result = await reviewsCollection.insertOne(review)
    
    return { success: true, reviewId: result.insertedId.toString() }
  } catch (error) {
    console.error('Error submitting review:', error)
    return { success: false, error: 'Failed to submit review' }
  }
}

// Get reviews with pagination
export async function getReviews(page: number = 1, limit: number = 10): Promise<{ reviews: Review[]; total: number }> {
  try {
    const db = await getMongoDb()
    const reviewsCollection = db.collection<Review>('reviews')

    const skip = (page - 1) * limit
    
    const [reviews, total] = await Promise.all([
      reviewsCollection
        .find({ reported: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      reviewsCollection.countDocuments({ reported: false })
    ])

    return { reviews, total }
  } catch (error) {
    console.error('Error getting reviews:', error)
    return { reviews: [], total: 0 }
  }
}

// Get review statistics
export async function getReviewStats(): Promise<ReviewStats> {
  try {
    const db = await getMongoDb()
    const reviewsCollection = db.collection<Review>('reviews')

    const pipeline = [
      { $match: { reported: false } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]

    const result = await reviewsCollection.aggregate(pipeline).toArray()
    
    if (result.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const data = result[0]
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    
    data.ratingDistribution.forEach((rating: number) => {
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++
      }
    })

    return {
      averageRating: Math.round(data.averageRating * 10) / 10,
      totalReviews: data.totalReviews,
      ratingDistribution: distribution
    }
  } catch (error) {
    console.error('Error getting review stats:', error)
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }
}

// Mark review as helpful
export async function markReviewHelpful(
  reviewId: string,
  userId: string,
): Promise<ReviewVoteResult> {
  return recordVote(reviewId, userId, 'helpful')
}

// Report review
export async function reportReview(
  reviewId: string,
  userId: string,
): Promise<ReviewVoteResult> {
  return recordVote(reviewId, userId, 'reported')
}

/**
 * Register one user's vote against one review, at most once.
 *
 * The guard lives in the query rather than a read-then-write, so two
 * concurrent requests cannot both pass it. A zero matchedCount means either
 * the review is gone or this user already voted, which is why existence is
 * checked separately — the previous version returned true unconditionally, so
 * a bogus review id reported success.
 */
async function recordVote(
  reviewId: string,
  userId: string,
  kind: 'helpful' | 'reported',
): Promise<ReviewVoteResult> {
  const db = await getMongoDb()
  const reviews = db.collection<Review>('reviews')

  const votersField = kind === 'helpful' ? 'helpfulBy' : 'reportedBy'

  const update =
    kind === 'helpful'
      ? { $inc: { helpful: 1 }, $addToSet: { helpfulBy: userId } }
      : { $set: { reported: true }, $addToSet: { reportedBy: userId } }

  const result = await reviews.updateOne(
    { _id: reviewId, [votersField]: { $ne: userId } } as never,
    update as never,
  )

  if (result.matchedCount > 0) return REVIEW_VOTE_RESULTS.OK

  const exists = await reviews.countDocuments({ _id: reviewId } as never, { limit: 1 })
  return exists ? REVIEW_VOTE_RESULTS.ALREADY_VOTED : REVIEW_VOTE_RESULTS.NOT_FOUND
}
