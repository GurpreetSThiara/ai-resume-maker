"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getUserResumes } from "@/lib/supabase-functions"

interface ResumeItem {
  id: string
  title: string
  updated_at: string
}

export function ManageCloudModal({
  open,
  onOpenChange,
  onConfirmDeleteAndRetry,
  onSaveLocally,
  loading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDeleteAndRetry: (resumeIdsToDelete: string[]) => Promise<void>
  onSaveLocally: () => void
  loading?: boolean
}) {
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setIsLoading(true)
    getUserResumes()
      .then((r) => {
        if (r.success) {
          const list = (r.data || []).map((x: any) => ({ id: x.id, title: x.title, updated_at: x.updated_at }))
          setResumes(list)
        }
      })
      .finally(() => setIsLoading(false))
  }, [open])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDeleteAndRetry = async () => {
    await onConfirmDeleteAndRetry(Array.from(selected))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cloud limit reached</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-gray-700">
          <p>You can store up to 3 resumes in the cloud. Choose resumes to delete and retry saving, or save this one locally instead.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {isLoading ? (
            <div className="col-span-3 text-center text-gray-500">Loading your resumes…</div>
          ) : resumes.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">No cloud resumes found.</div>
          ) : (
            resumes.map((r) => (
              <Card
                key={r.id}
                className={`cursor-pointer border-2 ${selected.has(r.id) ? "border-red-500" : "border-transparent"}`}
                onClick={() => toggle(r.id)}
              >
                <CardHeader>
                  <CardTitle className="text-base truncate">{r.title}</CardTitle>
                  <CardDescription>Updated {new Date(r.updated_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-500">Click to {selected.has(r.id) ? "unselect" : "select"} for deletion</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onSaveLocally} disabled={loading}>Save locally instead</Button>
          <Button onClick={handleDeleteAndRetry} disabled={selected.size === 0 || loading} className="bg-red-600 text-white hover:bg-red-700">
            {loading ? "Processing…" : "Delete selected and retry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ManageCloudModal


