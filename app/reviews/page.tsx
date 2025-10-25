"use client"

import { useState, useEffect } from "react"
import { ReviewComponent } from "@/components/review-component"
import { useAuth } from "@/contexts/auth-context"
import { ReviewsSection } from "@/components/reviews-section"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Loader2 } from "lucide-react"
import type { Metadata } from 'next'

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

// export const metadata: Metadata = {
//   title: 'User Reviews - CreateFreeCV Resume Builder',
//   description: 'Read honest reviews from job seekers who used our free resume builder. See how our ATS-friendly templates helped them land interviews and get hired.',
//   keywords: ['resume builder reviews', 'free resume builder feedback', 'job seeker testimonials', 'resume builder ratings'],
//   openGraph: {
//     title: 'User Reviews - CreateFreeCV Resume Builder',
//     description: 'Read honest reviews from job seekers who used our free resume builder. See how our ATS-friendly templates helped them land interviews and get hired.',
//     type: 'website',
//   },
// }

export default function ReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [page])

  const fetchReviews = async () => {
    if (page === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const response = await fetch(`/api/reviews?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        if (page === 1) {
          setReviews(data.reviews)
        } else {
          setReviews(prev => [...prev, ...data.reviews])
        }
        setHasMore(data.reviews.length === 10)
        setTotalPages(Math.ceil(data.total / 10))
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/review-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch review stats:', error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleReviewSubmit = () => {
    // Refresh reviews and stats after new review submission
    setPage(1)
    setReviews([])
    fetchReviews()
    fetchStats()
  }

  const handleMarkHelpful = (reviewId: string) => {
    // Update local state to reflect helpful count change
    setReviews(prev => prev.map(review => 
      review._id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ))
  }

  const handleReportReview = (reviewId: string) => {
    // Remove reported review from local state
    setReviews(prev => prev.filter(review => review._id !== reviewId))
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  const goToPage = (newPage: number) => {
    setPage(newPage)
    setReviews([])
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

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const startPage = Math.max(1, page - 2)
    const endPage = Math.min(totalPages, page + 2)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === page ? "default" : "outline"}
          onClick={() => goToPage(i)}
          className="w-10 h-10 p-0"
        >
          {i}
        </Button>
      )
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="h-10"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {pages}
        <Button
          variant="outline"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="h-10"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
              <div className="h-32 bg-gray-200 rounded w-full mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Content */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              User Reviews & Testimonials
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover how our free resume builder has helped thousands of job seekers land their dream jobs. 
              Read real experiences from professionals who found success with our ATS-friendly templates.
            </p>
            
            {stats && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {stats.totalReviews}
                    </div>
                    <div className="text-gray-600">Total Reviews</div>
                  </div>
                </div>
                
                <div className="flex justify-center mb-4">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                
                <div className="text-sm text-gray-600">
                  Based on {stats.totalReviews} verified reviews from real users
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <ReviewComponent
            reviews={reviews}
            onReviewSubmit={handleReviewSubmit}
            onMarkHelpful={handleMarkHelpful}
            onReportReview={handleReportReview}
          />

          {loadingMore && (
            <div className="text-center mt-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          )}

          {hasMore && !loadingMore && (
            <div className="text-center mt-8">
              <Button
                onClick={loadMore}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Load More Reviews
              </Button>
            </div>
          )}

          {renderPagination()}
        </div>
      </div>

      {/* Additional SEO Content */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Users Love Our Resume Builder
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🚀 Free & No Sign-Up Required
                </h3>
                <p className="text-gray-600">
                  Our users appreciate that they can create professional resumes without any cost or registration. 
                  Just build, preview, and download instantly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📄 ATS-Friendly Templates
                </h3>
                <p className="text-gray-600">
                  Job seekers consistently praise our templates for passing ATS systems and helping them 
                  get noticed by recruiters and hiring managers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ⚡ Live Preview & Easy Editing
                </h3>
                <p className="text-gray-600">
                  Users love the real-time preview feature that lets them see changes instantly as they type, 
                  making the resume creation process smooth and intuitive.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💼 Professional Results
                </h3>
                <p className="text-gray-600">
                  Many users report getting more interview calls and job offers after using our resume builder, 
                  thanks to the professional formatting and ATS optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}