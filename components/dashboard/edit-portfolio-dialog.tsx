"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePortfolio, checkSlugAvailability } from "@/services/portfolioService"
import { toast } from "sonner"
import { Loader2, Settings } from "lucide-react"

interface EditPortfolioDialogProps {
    children: React.ReactNode
    portfolio: {
        id: string
        title: string
        slug: string
    }
    onUpdate?: () => void
}

export function EditPortfolioDialog({ children, portfolio, onUpdate }: EditPortfolioDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState(portfolio.title)
    const [slug, setSlug] = useState(portfolio.slug)
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(false)
    const [slugError, setSlugError] = useState("")

    const router = useRouter()

    // Reset state when opening
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen) {
            setTitle(portfolio.title)
            setSlug(portfolio.slug)
            setSlugError("")
        }
    }

    const handleSlugChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
        setSlug(value)
        setSlugError("")

        // Only check if it's different from original and long enough
        if (value !== portfolio.slug && value.length > 2) {
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

        setLoading(true)

        try {
            const result = await updatePortfolio(portfolio.id, {
                title,
                slug,
                updated_at: new Date().toISOString()
            })

            if (result.success) {
                toast.success("Portfolio updated successfully")
                setOpen(false)
                if (onUpdate) onUpdate()
                router.refresh()
            } else {
                toast.error(result.error || "Failed to update portfolio")
            }
        } catch (err) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const isDirty = title !== portfolio.title || slug !== portfolio.slug

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Portfolio Details</DialogTitle>
                    <DialogDescription>
                        Update your portfolio title and public URL.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Portfolio Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My Portfolio"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Portfolio URL</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">.../p/</span>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={handleSlugChange}
                                placeholder="john-doe"
                                className="flex-1"
                                autoComplete="off"
                            />
                        </div>
                        {slugError && <p className="text-sm text-destructive">{slugError}</p>}
                        {checking && <p className="text-sm text-muted-foreground">Checking availability...</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || checking || !!slugError || !slug || !isDirty}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
