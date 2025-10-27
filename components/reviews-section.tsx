"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface Review {
  _id?: string
  name: string
  rating: number
  comment: string
  jobTitle?: string
  company?: string
  location?: string
  verified: boolean
  createdAt: string
  helpful: number
  reported: boolean
}

interface ReviewStats {
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

interface ReviewsSectionProps {
  className?: string
}

export function ReviewsSection({ className }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [reviewsResponse, statsResponse] = await Promise.all([
          fetch('/api/reviews?limit=5'),
          fetch('/api/review-stats')
        ])

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData.reviews)
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <section className={`py-16 px-4 ${className}`}>
        <div className="container mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
            <div className="h-32 bg-gray-200 rounded w-full max-w-2xl mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!stats || reviews.length === 0) {
    return null
  }

  return (
    <section className={`py-16 px-4 bg-gray-50 ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Loved by Job Seekers
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(stats.averageRating))}
              <span className="text-lg font-semibold">
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">
              Based on {stats.totalReviews} reviews
            </span>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <Card className="relative">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{reviews[currentIndex].name}</h3>
                    {(reviews[currentIndex].jobTitle || reviews[currentIndex].company) && (
                      <p className="text-gray-600">
                        {reviews[currentIndex].jobTitle && reviews[currentIndex].company 
                          ? `${reviews[currentIndex].jobTitle} at ${reviews[currentIndex].company}`
                          : reviews[currentIndex].jobTitle || reviews[currentIndex].company
                        }
                        {reviews[currentIndex].location && ` • ${reviews[currentIndex].location}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(reviews[currentIndex].rating)}
                  </div>
                </div>

                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                  "{reviews[currentIndex].comment}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {new Date(reviews[currentIndex].createdAt).toLocaleDateString()}
                  </p>
                  
                  {reviews.length > 1 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevReview}
                        disabled={reviews.length <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextReview}
                        disabled={reviews.length <= 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {reviews.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}