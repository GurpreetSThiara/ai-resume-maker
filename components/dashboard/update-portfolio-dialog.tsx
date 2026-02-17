"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { updatePortfolio } from "@/services/portfolioService"
import { getUserResumes, loadResumeData } from "@/lib/supabase-functions"
import { toast } from "sonner"
import { Loader2, FileText, Check, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface UpdatePortfolioDialogProps {
    children: React.ReactNode
    portfolioId: string
    currentResumeId?: string | null
    onUpdate?: () => void
}

export function UpdatePortfolioDialog({ children, portfolioId, currentResumeId, onUpdate }: UpdatePortfolioDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Selection state
    const [resumes, setResumes] = useState<any[]>([])
    const [loadingResumes, setLoadingResumes] = useState(false)
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(currentResumeId || null)

    const router = useRouter()

    useEffect(() => {
        if (open) {
            fetchResumes()
            setSelectedResumeId(currentResumeId || null)
        }
    }, [open, currentResumeId])

    const fetchResumes = async () => {
        setLoadingResumes(true)
        const result = await getUserResumes()
        if (result.success) {
            setResumes(result.data || [])
        }
        setLoadingResumes(false)
    }

    const handleResumeSelect = (id: string) => {
        setSelectedResumeId(id)
    }

    const handleUpdate = async () => {
        if (!selectedResumeId) return

        setLoading(true)
        try {
            // 1. Load the resume data
            const resumeResult = await loadResumeData(selectedResumeId)

            if (!resumeResult.success || !resumeResult.data) {
                toast.error("Failed to load resume data")
                setLoading(false)
                return
            }

            // 2. Update the portfolio
            const updateResult = await updatePortfolio(portfolioId, {
                data: resumeResult.data,
                resume_id: selectedResumeId,
                updated_at: new Date().toISOString()
            })

            if (updateResult.success) {
                toast.success("Portfolio updated successfully")
                setOpen(false)
                if (onUpdate) onUpdate()
                router.refresh()
            } else {
                toast.error(updateResult.error || "Failed to update portfolio")
            }
        } catch (err) {
            console.error(err)
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Update Portfolio Content</DialogTitle>
                    <DialogDescription>
                        Select a resume to overwrite your portfolio content. This will replace all current information.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-3">
                            {loadingResumes ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : resumes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No resumes found. Create a resume first.
                                </div>
                            ) : (
                                resumes.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors",
                                            selectedResumeId === resume.id ? "border-primary bg-primary/5" : "border-muted"
                                        )}
                                        onClick={() => handleResumeSelect(resume.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-medium truncate">{resume.title || "Untitled Resume"}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(resume.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedResumeId === resume.id && <Check className="h-5 w-5 text-primary" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={!selectedResumeId || loading || (currentResumeId === selectedResumeId)}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Update Content
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
