"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuthModal } from "@/contexts/auth-modal-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BuyMeCoffee } from "@/components/ui/buy-me-coffee"
import { Download, FileText, Save, Cloud, Smartphone, Check } from "lucide-react"
import { generateResumePDF } from "@/lib/pdf-generators"
import { generateResumeDOCX } from "@/lib/docx-generators"
import { getResumeDesign } from "@/lib/resume-designs"
import { getUserResumes } from "@/lib/supabase-functions"
import { useAuth } from "@/contexts/auth-context"
import { usePostDownloadReview } from "@/hooks/use-post-download-review"
import { trackResumeDownloadToSheets } from "@/lib/google-sheets-tracker"
import { SHOW_ERROR, SHOW_SUCCESS } from "@/utils/toast"

type CloudResume = { id: string; title: string; updated_at: string }

/**
 * One unified Download & Save dialog. Both the header "Download" button and the
 * "Complete resume" button open this — the single place to download (PDF/DOCX)
 * and, optionally, save a copy to keep editing later.
 */
export function SaveResumeModal({
  open,
  onOpenChange,
  data,
  onChooseLocal,
  onChooseCloudCreate,
  onChooseCloudUpdate,
  busy,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: { resumeData: any; template: any; filename: string }
  onChooseLocal: () => Promise<void> | void
  onChooseCloudCreate: () => Promise<void>
  onChooseCloudUpdate: (resumeId: string) => Promise<void>
  busy?: boolean
}) {
  const { open: openAuthModal } = useAuthModal()
  const { user } = useAuth()
  const { triggerReviewModal, ReviewModalComponent } = usePostDownloadReview()
  const [cloudResumes, setCloudResumes] = useState<CloudResume[]>([])
  const [downloading, setDownloading] = useState<null | "pdf" | "docx">(null)

  const pdfOnly = useMemo(() => !!getResumeDesign(data?.template?.id)?.pdfOnly, [data?.template?.id])
  const existing = cloudResumes[0]

  useEffect(() => {
    if (!open || !user) return
    getUserResumes().then((r) => {
      if (r.success) setCloudResumes((r.data || []).map((x: any) => ({ id: x.id, title: x.title, updated_at: x.updated_at })))
    })
  }, [open, user])

  const runDownload = async (format: "pdf" | "docx") => {
    setDownloading(format)
    // Generation is synchronous and CPU-heavy; yield a frame so the "Preparing…"
    // state paints before the main thread is blocked (avoids a frozen-looking UI).
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    try {
      const filename = `${data.filename}.${format}`
      if (format === "pdf") await generateResumePDF({ ...data, filename })
      else await generateResumeDOCX({ ...data, filename })
      SHOW_SUCCESS({ title: `Resume downloaded as ${format.toUpperCase()}!` })
      trackResumeDownloadToSheets({ ...data.resumeData, template: data.template }, !!user)
      setTimeout(() => triggerReviewModal(), 1000)
    } catch (e) {
      console.error("Download failed:", e)
      SHOW_ERROR({ title: "Failed to download resume." })
    } finally {
      setDownloading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-5 sm:p-6 max-h-[92vh] overflow-y-auto !bottom-0 !top-auto !translate-y-0 rounded-b-none rounded-t-2xl sm:!top-1/2 sm:!bottom-auto sm:!-translate-y-1/2 sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Download className="w-5 h-5 text-primary" />
            Download your resume
          </DialogTitle>
          <DialogDescription>Free, no watermark. Choose a format.</DialogDescription>
        </DialogHeader>

        {/* Primary: download */}
        <div className="space-y-2">
          <Button
            onClick={() => runDownload("pdf")}
            disabled={!!downloading}
            className="w-full h-12 text-base gap-2"
          >
            <FileText className="w-4 h-4" />
            {downloading === "pdf" ? "Preparing PDF…" : "Download PDF"}
          </Button>

          {!pdfOnly && (
            <Button
              variant="outline"
              onClick={() => runDownload("docx")}
              disabled={!!downloading}
              className="w-full h-11 gap-2"
            >
              <FileText className="w-4 h-4" />
              {downloading === "docx" ? "Preparing Word…" : "Download Word (.docx)"}
            </Button>
          )}
        </div>

        {/* Secondary: save to keep editing later */}
        <div className="mt-5 border-t pt-4">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Save className="w-4 h-4 text-gray-500" />
            Save a copy to keep editing later
          </p>
          <p className="text-xs text-gray-500 mt-1 mb-3">Optional — your resume is already downloadable above.</p>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={onChooseLocal} disabled={busy} className="gap-2 h-10">
              <Smartphone className="w-4 h-4" />
              {busy ? "Saving…" : "This device"}
            </Button>

            {!user ? (
              <Button
                variant="secondary"
                onClick={() => {
                  // Close this dialog and open the sign-in modal in place.
                  // Resume edits are autosaved to localStorage and sign-in is
                  // client-side (no reload), so nothing is lost; we return to
                  // this exact URL after signing in.
                  onOpenChange(false)
                  const here = typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined
                  openAuthModal(here)
                }}
                className="gap-2 h-10"
              >
                <Cloud className="w-4 h-4" />
                Sign in to sync
              </Button>
            ) : existing ? (
              <Button variant="secondary" onClick={() => onChooseCloudUpdate(existing.id)} disabled={busy} className="gap-2 h-10">
                <Check className="w-4 h-4" />
                {busy ? "Saving…" : "Update cloud"}
              </Button>
            ) : (
              <Button variant="secondary" onClick={onChooseCloudCreate} disabled={busy} className="gap-2 h-10">
                <Cloud className="w-4 h-4" />
                {busy ? "Saving…" : "Save to cloud"}
              </Button>
            )}
          </div>
          {user && existing && (
            <p className="text-xs text-gray-500 mt-2">You can keep 1 resume in the cloud — saving updates it.</p>
          )}
        </div>

        <div className="mt-5 flex justify-center">
          <div className="w-full max-w-xs">
            <BuyMeCoffee />
          </div>
        </div>
      </DialogContent>
      <ReviewModalComponent />
    </Dialog>
  )
}

export default SaveResumeModal
