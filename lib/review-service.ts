import { getMongoDb } from "./mongo"

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
export async function markReviewHelpful(reviewId: string): Promise<boolean> {
  try {
    const db = await getMongoDb()
    const reviewsCollection = db.collection<Review>('reviews')

    await reviewsCollection.updateOne(
      { _id: reviewId },
      { $inc: { helpful: 1 } }
    )

    return true
  } catch (error) {
    console.error('Error marking review helpful:', error)
    return false
  }
}

// Report review
export async function reportReview(reviewId: string): Promise<boolean> {
  try {
    const db = await getMongoDb()
    const reviewsCollection = db.collection<Review>('reviews')

    await reviewsCollection.updateOne(
      { _id: reviewId },
      { $set: { reported: true } }
    )

    return true
  } catch (error) {
    console.error('Error reporting review:', error)
    return false
  }
}
