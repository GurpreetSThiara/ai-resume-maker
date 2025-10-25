"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, X, Heart, MessageCircle, LogIn, User } from "lucide-react"
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

interface PostDownloadReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReviewSubmitted?: () => void
  actionType?: 'download' | 'save' | 'cloud_save'
}

export function PostDownloadReviewModal({ 
  open, 
  onOpenChange, 
  onReviewSubmitted,
  actionType = 'download'
}: PostDownloadReviewModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFullForm, setShowFullForm] = useState(false)

  // Check if user has already been shown this modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenModal = localStorage.getItem('hasSeenReviewModal')
      if (hasSeenModal === 'true') {
        onOpenChange(false)
      }
    }
  }, [onOpenChange])

  const getActionMessage = () => {
    switch (actionType) {
      case 'download':
        return 'Resume downloaded successfully!'
      case 'save':
        return 'Resume saved successfully!'
      case 'cloud_save':
        return 'Resume saved to cloud successfully!'
      default:
        return 'Action completed successfully!'
    }
  }

  const handleQuickRating = async (selectedRating: number) => {
    if (!user) {
      SHOW_ERROR({ title: "Login Required", description: "Please sign in to submit a review" })
      return
    }

    setRating(selectedRating)
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
          rating: selectedRating,
          comment: selectedRating >= 4 ? "Great experience!" : "Thanks for the feedback",
        }),
      })

      if (response.ok) {
        SHOW_SUCCESS({ title: "Thank you!", description: "Your rating helps others" })
        handleClose()
        onReviewSubmitted?.()
      } else if (response.status === 401) {
        SHOW_ERROR({ title: "Login Required", description: "Please sign in to submit a review" })
      } else {
        const error = await response.json()
        SHOW_ERROR({ title: "Error", description: error.error || "Failed to submit rating" })
      }
    } catch (error) {
      SHOW_ERROR({ title: "Error", description: "Failed to submit rating" })
    }
  }

  const handleFullReview = async () => {
    if (!user) {
      SHOW_ERROR({ title: "Login Required", description: "Please sign in to submit a review" })
      return
    }

    if (!name || !comment) {
      SHOW_ERROR({ title: "Missing information", description: "Please fill in your name and review" })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          rating,
          comment,
        }),
      })

      if (response.ok) {
        SHOW_SUCCESS({ title: "Review submitted!", description: "Thank you for your detailed feedback" })
        handleClose()
        onReviewSubmitted?.()
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

  const handleClose = () => {
    // Mark that user has seen the modal
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenReviewModal', 'true')
    }
    onOpenChange(false)
  }

  const handleSkip = () => {
    // Mark that user has seen the modal but chose to skip
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenReviewModal', 'true')
    }
    onOpenChange(false)
  }

  const handleSignIn = () => {
    router.push('/auth')
    handleClose()
  }

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 ${
              star <= currentRating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300 transition-colors' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg mx-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {getActionMessage()}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Help others by sharing your experience with our resume builder
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!user ? (
            /* Not logged in - show login prompt */
            <div className="text-center space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sign in to leave a review
                </h3>
                <p className="text-gray-600 mb-4">
                  Create a free account to share your experience and help other job seekers
                </p>
                <Button
                  onClick={handleSignIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In to Review
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Or view reviews from other users:</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push('/reviews')
                    handleClose()
                  }}
                  className="w-full h-12 text-base border-gray-300 hover:bg-gray-50"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  View Reviews
                </Button>
              </div>
            </div>
          ) : !showFullForm ? (
            <>
              {/* Quick Rating */}
              <div className="text-center space-y-6">
                <div className="text-lg font-medium text-gray-700">Rate your experience</div>
                <div className="flex justify-center">
                  {renderStars(rating, true)}
                </div>
                
                {rating > 0 && (
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleQuickRating(rating)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-medium"
                      size="lg"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Submit Rating
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowFullForm(true)}
                      className="w-full h-12 text-base border-gray-300 hover:bg-gray-50"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Write a detailed review
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Rating Buttons */}
              {rating === 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="outline"
                      onClick={() => handleQuickRating(star)}
                      className="aspect-square p-0 flex flex-col items-center justify-center h-16 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 transition-all"
                    >
                      <Star className="w-6 h-6 mb-1" />
                      <span className="text-sm font-medium">{star}</span>
                    </Button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Full Review Form */
            <Card className="border-0 shadow-none">
              <CardContent className="p-0 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Your Rating</label>
                  <div className="flex justify-center">
                    {renderStars(rating, true)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={user.user_metadata?.full_name || user.email?.split('@')[0] || "Enter your name"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleFullReview}
                    disabled={isSubmitting || !name || !comment}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowFullForm(false)}
                    className="px-6 h-12 border-gray-300 hover:bg-gray-50"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skip Button */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}