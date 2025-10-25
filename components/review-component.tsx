"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ThumbsUp, Flag, Loader2, LogIn } from "lucide-react"
import { SHOW_SUCCESS, SHOW_ERROR } from "@/utils/toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface Review {
  _id?: string
  userId?: string
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

interface ReviewComponentProps {
  reviews: Review[]
  onReviewSubmit?: () => void
  onMarkHelpful?: (reviewId: string) => void
  onReportReview?: (reviewId: string) => void
}

export function ReviewComponent({ 
  reviews, 
  onReviewSubmit, 
  onMarkHelpful, 
  onReportReview 
}: ReviewComponentProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    comment: "",
    jobTitle: "",
    company: "",
    location: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      SHOW_ERROR({ title: "Login Required", description: "Please sign in to submit a review" })
      return
    }

    if (!formData.name || !formData.rating || !formData.comment) {
      SHOW_ERROR({ title: "Missing information", description: "Please fill in all required fields" })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        SHOW_SUCCESS({ title: "Review submitted!", description: "Thank you for your feedback" })
        setFormData({
          name: "",
          rating: 0,
          comment: "",
          jobTitle: "",
          company: "",
          location: ""
        })
        setShowForm(false)
        onReviewSubmit?.()
      } else if (response.status === 401) {
        SHOW_ERROR({ title: "Login Required", description: "Please sign in to submit a review" })
      } else {
        const error = await response.json()
        SHOW_ERROR({ title: "Failed to submit review", description: error.error || "Unknown error" })
      }
    } catch (error) {
      SHOW_ERROR({ title: "Error", description: "Failed to submit review" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      })

      if (response.ok) {
        SHOW_SUCCESS({ title: "Thank you!", description: "Your feedback helps others" })
        onMarkHelpful?.(reviewId)
      }
    } catch (error) {
      SHOW_ERROR({ title: "Error", description: "Failed to mark review as helpful" })
    }
  }

  const handleReportReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
      })

      if (response.ok) {
        SHOW_SUCCESS({ title: "Review reported", description: "Thank you for helping maintain quality" })
        onReportReview?.(reviewId)
      }
    } catch (error) {
      SHOW_ERROR({ title: "Error", description: "Failed to report review" })
    }
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: star })) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g., Google"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <Label>Rating *</Label>
                <div className="mt-2">
                  {renderStars(formData.rating, true)}
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Review *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  {(review.jobTitle || review.company) && (
                    <p className="text-sm text-gray-600">
                      {review.jobTitle && review.company 
                        ? `${review.jobTitle} at ${review.company}`
                        : review.jobTitle || review.company
                      }
                      {review.location && ` • ${review.location}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkHelpful(review._id!)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful ({review.helpful})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReportReview(review._id!)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Flag className="w-4 h-4 mr-1" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Review Button */}
      {!showForm && (
        <div className="text-center">
          {user ? (
            <Button onClick={() => setShowForm(true)} className="w-full">
              Write a Review
            </Button>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/auth')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Write a Review
              </Button>
              <p className="text-sm text-gray-500">
                Reviews are public and help other job seekers
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
