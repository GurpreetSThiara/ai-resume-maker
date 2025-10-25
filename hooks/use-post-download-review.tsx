"use client"

import { useState } from "react"
import { PostDownloadReviewModal } from "@/components/post-download-review-modal"

interface UsePostDownloadReviewProps {
  actionType?: 'download' | 'save' | 'cloud_save'
}

// Hook to manage post-download review modal
export function usePostDownloadReview({ actionType = 'download' }: UsePostDownloadReviewProps = {}) {
  const [showReviewModal, setShowReviewModal] = useState(false)

  const triggerReviewModal = () => {
    // Check if user has already seen the modal
    if (typeof window !== 'undefined') {
     setShowReviewModal(true)
    }
  }

  const ReviewModalComponent = () => (
    <PostDownloadReviewModal
      open={showReviewModal}
      onOpenChange={setShowReviewModal}
      actionType={actionType}
      onReviewSubmitted={() => {
        setShowReviewModal(false)
      }}
    />
  )

  return {
    triggerReviewModal,
    ReviewModalComponent,
 
  }
}