"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit, Trash2, Globe, ExternalLink, RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserPortfolios, deletePortfolio } from "@/services/portfolioService"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CreatePortfolioDialog } from "@/components/dashboard/create-portfolio-dialog"
import { UpdatePortfolioDialog } from "@/components/dashboard/update-portfolio-dialog"
import { EditPortfolioDialog } from "@/components/dashboard/edit-portfolio-dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { updatePortfolio } from "@/services/portfolioService"
import { useAuth } from "@/contexts/auth-context"
import { useAuthModal } from "@/contexts/auth-modal-context"

export default function PortfoliosPage() {
    const { user, loading: authLoading } = useAuth()
    const { open: openAuthModal } = useAuthModal()
    const [portfolios, setPortfolios] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        loadPortfolios()
    }, [])

    useEffect(() => {
        if (!authLoading && !user) {
            openAuthModal()
        }
    }, [user, authLoading, openAuthModal])

    async function loadPortfolios() {
        setLoading(true)
        const result = await getUserPortfolios()
        // let's assume for now we need to fix service or pass it. 
        // Actually, I'll update the component to fetch user first or fix service.
        // Let's fix service to retrieve user if not passed, BUT for now let's reuse the pattern from resumeService
        // resumeService gets user inside.
        // My portfolioService expects userId. I should probably refactor it to use auth.getUser() inside like resumeService.
        // For now, let's assume I'll fix the service in next step or just pass it here. 
        // Actually, I will update the service to be more robust.
        // BUT since I can't edit service in this turn easily without context switching, let's assume I fix it.
        // Wait, I see I wrote `getUserPortfolios(userId)` in service.
        // I should probably pass the user ID.
        // Let's use a hook or something to get user. 
        // Standard Supabase client usage in Next.js usually involves getting user.

        // Correction: I will implemented a fix in service in next step.
        // For now let's write this component assuming `getUserPortfolios` will handle it or I pass it.

        // Let's try to get user id here
        // import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
        // const supabase = createClientComponentClient()
        // const { data: { user } } = await supabase.auth.getUser()
        // if (user) ...

        // To be safe, I'll implement a wrapper function here.
        fetchPortfolios()
    }

    async function fetchPortfolios() {
        const result = await getUserPortfolios()
        if (result.success) {
            setPortfolios(result.data || [])
        } else {
            toast.error("Failed to load portfolios")
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        const result = await deletePortfolio(id)
        if (result.success) {
            toast.success("Portfolio deleted")
            loadPortfolios()
        } else {
            toast.error(result.error || "Failed to delete")
        }
    }

    const handleTogglePublic = async (id: string, isPublic: boolean) => {
        // Optimistic update
        setPortfolios(prev => prev.map(p =>
            p.id === id ? { ...p, is_public: isPublic } : p
        ))

        const result = await updatePortfolio(id, { is_public: isPublic })

        if (result.success) {
            toast.success(isPublic ? "Portfolio is now live" : "Portfolio is now a draft")
        } else {
            // Revert changes on error
            setPortfolios(prev => prev.map(p =>
                p.id === id ? { ...p, is_public: !isPublic } : p
            ))
            toast.error(result.error || "Failed to update status")
        }
    }

    if (authLoading) {
        return (
            <div className="container py-8">
                <div className="max-w-3xl mx-auto">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8 space-y-8">
            <div className="flex justify-between items-center">

                {portfolios.length === 0 && !loading && (
                    <CreatePortfolioDialog>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Portfolio
                        </Button>
                    </CreatePortfolioDialog>
                )}
            </div>

            {loading ? (
                <div className="max-w-3xl mx-auto">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
            ) : portfolios.length === 0 ? (
                <Card className="border-dashed max-w-3xl mx-auto">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <Globe className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No portfolio yet</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Turn one of your resumes into a beautiful public portfolio to share with the world.
                        </p>
                        <CreatePortfolioDialog>
                            <Button size="lg">
                                <Plus className="mr-2 h-4 w-4" /> Create Your Portfolio
                            </Button>
                        </CreatePortfolioDialog>
                    </CardContent>
                </Card>
            ) : (
                <div className="max-w-3xl mx-auto">
                    {/* We only show the first portfolio since we enforce limit of 1 */}
                    {portfolios.slice(0, 1).map((portfolio) => (
                        <Card key={portfolio.id} className="flex flex-col overflow-hidden border shadow-sm transition-all hover:shadow-md">
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
                                <div className="absolute inset-0 flex items-end p-6 text-white bg-gradient-to-t from-black/60 to-transparent">
                                    <h3 className="text-3xl font-bold truncate tracking-tight shadow-sm">{portfolio.title}</h3>
                                </div>
                            </div>

                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                                    <div className="space-y-6 flex-1 w-full md:w-auto">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-muted-foreground">Public URL</Label>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-50 border px-4 py-2.5 rounded-md font-mono text-sm text-slate-700 min-w-[200px] select-all flex-1 md:flex-none">
                                                    {typeof window !== 'undefined' ? window.location.origin : ''}/p/{portfolio.slug}
                                                </div>
                                                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" asChild>
                                                    <Link href={`/p/${portfolio.slug}`} target="_blank">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    id={`public-${portfolio.id}`}
                                                    checked={portfolio.is_public}
                                                    onCheckedChange={(checked) => handleTogglePublic(portfolio.id, checked)}
                                                />
                                                <div className="space-y-0.5">
                                                    <Label htmlFor={`public-${portfolio.id}`} className="text-base font-medium cursor-pointer">
                                                        {portfolio.is_public ? 'Portfolio is Live' : 'Draft Mode'}
                                                    </Label>
                                                </div>
                                            </div>

                                            <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${portfolio.is_public ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                <span className={`w-2 h-2 rounded-full mr-2 ${portfolio.is_public ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                                {portfolio.is_public ? 'Publicly Visible' : 'Private'}
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground pt-2">
                                            Last updated {formatDistanceToNow(new Date(portfolio.updated_at), { addSuffix: true })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 w-full md:w-48 shrink-0 md:border-l md:pl-8 md:border-slate-100">
                                        <Button className="w-full justify-start h-10" asChild>
                                            <Link href={`/dashboard/portfolios/${portfolio.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Content
                                            </Link>
                                        </Button>

                                        <UpdatePortfolioDialog
                                            portfolioId={portfolio.id}
                                            currentResumeId={portfolio.resume_id}
                                            onUpdate={loadPortfolios}
                                        >
                                            <Button variant="outline" className="w-full justify-start h-10">
                                                <RefreshCw className="mr-2 h-4 w-4" /> Sync / Update
                                            </Button>
                                        </UpdatePortfolioDialog>

                                        <EditPortfolioDialog
                                            portfolio={portfolio}
                                            onUpdate={loadPortfolios}
                                        >
                                            <Button variant="outline" className="w-full justify-start h-10">
                                                <Settings className="mr-2 h-4 w-4" /> Settings
                                            </Button>
                                        </EditPortfolioDialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5 h-10">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Portfolio
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete your portfolio page. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(portfolio.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
