"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPortfolio, checkSlugAvailability } from "@/services/portfolioService"
import { getUserResumes, loadResumeData } from "@/lib/supabase-functions" // Import server actions/functions
import { toast } from "sonner"
import { Loader2, FileText, Check, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CreatePortfolioDialogProps {
    children: React.ReactNode
    resumeId?: string
    resumeTitle?: string
    resumeData?: any // Full resume data to clone
}

const emptyResumeData = {
    basics: {
        name: "Your Name",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        summary: "Welcome to my professional portfolio.",
    },
    sections: [],
    custom: {}
}

export function CreatePortfolioDialog({ children, resumeId: initialResumeId, resumeTitle: initialResumeTitle, resumeData: initialResumeData }: CreatePortfolioDialogProps) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(initialResumeData ? 2 : 1) // 1: Select Resume, 2: Enter Slug
    const [slug, setSlug] = useState("")
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(false)
    const [slugError, setSlugError] = useState("")

    // Selection state
    const [resumes, setResumes] = useState<any[]>([])
    const [loadingResumes, setLoadingResumes] = useState(false)
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(initialResumeId || null)
    // If we start from scratch, we use this flag or just selectedResumeId === 'scratch'
    const [isScratch, setIsScratch] = useState(false)

    // Data to be used for creation
    const [finalResumeData, setFinalResumeData] = useState<any>(initialResumeData)
    const [finalResumeTitle, setFinalResumeTitle] = useState(initialResumeTitle)

    const router = useRouter()

    useEffect(() => {
        if (open && !initialResumeData && step === 1) {
            fetchResumes()
        }
    }, [open, initialResumeData, step])

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
        setIsScratch(false)
    }

    const handleScratchSelect = () => {
        setSelectedResumeId(null)
        setIsScratch(true)
    }

    const handleNext = async () => {
        if (isScratch) {
            setFinalResumeData(emptyResumeData)
            setFinalResumeTitle("My Portfolio")
            setStep(2)
        } else if (selectedResumeId) {
            // Fetch the selected resume's data
            setLoading(true)
            const result = await loadResumeData(selectedResumeId)
            const selectedResume = resumes.find(r => r.id === selectedResumeId)
            setLoading(false)

            if (result.success && result.data) {
                setFinalResumeData(result.data)
                setFinalResumeTitle(selectedResume?.title)
                setStep(2)
            } else {
                toast.error("Failed to load resume data")
            }
        }
    }

    const handleSlugChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
        setSlug(value)
        setSlugError("")

        if (value.length > 2) {
            setChecking(true)
            const { available } = await checkSlugAvailability(value)
            setChecking(false)
            if (!available) {
                setSlugError("This URL is already taken.")
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!slug || slugError) return

        if (!finalResumeData) {
            toast.error("Resume data is missing")
            return
        }

        setLoading(true)

        try {
            const result = await createPortfolio({
                slug,
                title: (finalResumeTitle || 'My').endsWith('Portfolio')
                    ? (finalResumeTitle || 'My Portfolio')
                    : `${finalResumeTitle || 'My'} Portfolio`,
                data: finalResumeData,
                resume_id: isScratch ? null : selectedResumeId,
                is_public: true,
            })

            if (result.success && result.data) {
                toast.success("Portfolio created!")
                setOpen(false)
                router.push(`/dashboard/portfolios/${result.data.id}/edit`)
            } else {
                toast.error(result.error || "Failed to create portfolio")
            }
        } catch (err) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) {
                // Reset state on close
                setTimeout(() => {
                    setStep(initialResumeData ? 2 : 1)
                    setSlug("")
                    setSelectedResumeId(initialResumeId || null)
                    setIsScratch(false)
                }, 300)
            }
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                {step === 1 ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Select Base Resume</DialogTitle>
                            <DialogDescription>
                                Choose a resume to use as a starting point for your portfolio, or start from scratch.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-3">
                                    {/* Start from Scratch Option */}
                                    <div
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors",
                                            isScratch ? "border-primary bg-primary/5" : "border-muted"
                                        )}
                                        onClick={handleScratchSelect}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Plus className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">Start from Scratch</h3>
                                                <p className="text-sm text-muted-foreground">Create an empty portfolio</p>
                                            </div>
                                        </div>
                                        {isScratch && <Check className="h-5 w-5 text-primary" />}
                                    </div>

                                    {/* Resume List */}
                                    {loadingResumes ? (
                                        <div className="flex justify-center p-4">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
                            <Button
                                onClick={handleNext}
                                disabled={!selectedResumeId && !isScratch}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Next
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Portfolio Details</DialogTitle>
                            <DialogDescription>
                                Choose a unique link for your public portfolio.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Portfolio URL</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm">resume-builder.com/p/</span>
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={handleSlugChange}
                                        placeholder="john-doe"
                                        className="col-span-3"
                                        autoComplete="off"
                                    />
                                </div>
                                {slugError && <p className="text-sm text-destructive">{slugError}</p>}
                                {checking && <p className="text-sm text-muted-foreground">Checking availability...</p>}
                            </div>
                            <DialogFooter>
                                {initialResumeData ? null : (
                                    <Button variant="ghost" onClick={() => setStep(1)} className="mr-auto">
                                        Back
                                    </Button>
                                )}
                                <Button type="submit" disabled={loading || checking || !!slugError || !slug}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Portfolio
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
