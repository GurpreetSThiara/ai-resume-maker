"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, ArrowRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface PostDownloadReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionType?: "download" | "save" | "cloud_save"
}

export function PostDownloadReviewModal({ open, onOpenChange, actionType = "download" }: PostDownloadReviewModalProps) {
  const router = useRouter()

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const hasSeenModal = localStorage.getItem("hasSeenReviewModal")
  //     if (hasSeenModal === "true") {
  //       onOpenChange(false)
  //     }
  //   }
  // }, [onOpenChange])

  const getActionMessage = () => {
    switch (actionType) {
      case "download":
        return "Resume downloaded successfully!"
      case "save":
        return "Resume saved successfully!"
      case "cloud_save":
        return "Resume saved to cloud successfully!"
      default:
        return "Action completed successfully!"
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleViewReviews = () => {
    router.push("/reviews")
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-auto p-0 border-0 shadow-2xl overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950 dark:via-slate-900 dark:to-blue-950" />

        {/* Content wrapper */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Success icon with animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-primary rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 rounded-full flex items-center justify-center border-2 border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Header text */}
          <DialogHeader className="text-center mb-6 space-y-3">
            <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-secondary dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              {getActionMessage()}
            </DialogTitle>

            <DialogDescription className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              We'd love to hear your thoughts! Share your review to help others discover this app and help us improve.
            </DialogDescription>
          </DialogHeader>

          {/* CTA Section */}
          <div className="space-y-3 mb-6">
            {/* Primary button */}
            <Button
              onClick={handleViewReviews}
              className="cursor-pointer w-full bg-gradient-to-r from-emerald-600 to-primary hover:from-emerald-700 hover:to-primary text-white h-12 sm:h-13 text-base font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Share Your Review
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Secondary button */}
            <Button
              variant="outline"
              onClick={handleClose}
              className="cursor-pointer w-full h-11 sm:h-12 text-base border-primary dark:border-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium bg-transparent"
            >
              Maybe Later
            </Button>
          </div>

          {/* Footer message */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center">
              ✨ Your feedback helps our community grow and makes this app better for everyone
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
