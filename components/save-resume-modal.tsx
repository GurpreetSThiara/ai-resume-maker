"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserResumes } from "@/lib/supabase-functions"

type CloudResume = { id: string; title: string; updated_at: string }

export function SaveResumeModal({
  open,
  onOpenChange,
  onChooseLocal,
  onChooseCloudCreate,
  onChooseCloudUpdate,
  busy,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChooseLocal: () => Promise<void> | void
  onChooseCloudCreate: () => Promise<void>
  onChooseCloudUpdate: (resumeId: string) => Promise<void>
  busy?: boolean
}) {
  const [cloudResumes, setCloudResumes] = useState<CloudResume[]>([])
  const [selectedForUpdate, setSelectedForUpdate] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    getUserResumes().then((r) => {
      if (r.success) {
        setCloudResumes((r.data || []).map((x: any) => ({ id: x.id, title: x.title, updated_at: x.updated_at })))
      }
    })
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full sm:max-w-3xl p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle>Where do you want to save this resume?</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle>Save Locally</CardTitle>
              <CardDescription>Unlimited saves on this device. You can sync later.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onChooseLocal} disabled={busy} className="w-full">Save to Browser</Button>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>Save to Cloud</CardTitle>
              <CardDescription>Keep up to 3 resumes. Choose create or update an existing one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={onChooseCloudCreate} disabled={busy} className="w-full">Create New (counts toward 3)</Button>
              <div className="text-xs text-gray-600">Or update one of your cloud resumes:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-auto">
                {cloudResumes.length === 0 ? (
                  <div className="text-xs text-gray-500">No cloud resumes yet.</div>
                ) : (
                  cloudResumes.map((r) => (
                    <Card
                      key={r.id}
                      className={`cursor-pointer border ${selectedForUpdate === r.id ? 'border-green-600' : 'border-gray-200'}`}
                      onClick={() => setSelectedForUpdate(r.id)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm truncate">{r.title}</CardTitle>
                        <CardDescription>Updated {new Date(r.updated_at).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
              <Button onClick={() => selectedForUpdate && onChooseCloudUpdate(selectedForUpdate)} disabled={!selectedForUpdate || busy} className="w-full">
                {busy ? 'Saving…' : 'Update Selected'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SaveResumeModal


