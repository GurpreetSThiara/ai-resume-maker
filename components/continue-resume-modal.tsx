"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Clock } from "lucide-react"

/**
 * Shown once per session to a logged-in user landing on the builder, when they
 * already have a resume saved to their account — offers to continue it or start fresh.
 */
export function ContinueResumeModal({
  open,
  onOpenChange,
  resume,
  onContinue,
  onStartNew,
  busy,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  resume: { title?: string; updated_at?: string } | null
  onContinue: () => void
  onStartNew: () => void
  busy?: boolean
}) {
  const updated = resume?.updated_at
    ? new Date(resume.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome back 👋</DialogTitle>
          <DialogDescription>
            You already have a resume saved to your account. Continue where you left off, or start a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold truncate">{resume?.title || "My Resume"}</p>
            {updated && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Last updated {updated}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onStartNew} disabled={busy} className="w-full sm:w-auto">
            Start a new one
          </Button>
          <Button onClick={onContinue} disabled={busy} className="w-full sm:w-auto">
            {busy ? "Loading…" : "Continue editing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ContinueResumeModal
