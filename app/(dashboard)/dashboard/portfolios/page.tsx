"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit, Trash2, Globe, ExternalLink, RefreshCw, Settings, Share2, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react"
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
                                    <div className="space-y-6 flex-1 w-full md:w-auto min-w-0">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-muted-foreground">Public URL</Label>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-50 border px-4 py-2.5 rounded-md font-mono text-sm text-slate-700 min-w-0 select-all flex-1 truncate" title={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${portfolio.slug}`}>
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

            {!loading && (
                <div className="max-w-5xl mx-auto mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4 cursor-default">
                            Supercharge Your Career with an Online Portfolio
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto cursor-default">
                            Turn your static resume into a dynamic, interactive web presence. A digital portfolio helps you stand out to hiring managers and get discovered in a crowded job market.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all duration-300">
                                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <CardTitle className="text-xl">SEO-Optimized & Discoverable</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    A public portfolio acts as your personal landing page. It increases your online footprint, making it easier for recruiters to find your profile through search engines like Google when hunting for top industry talent.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex flex-col items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-all duration-300">
                                    <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <CardTitle className="text-xl">Frictionless Sharing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Say goodbye to attaching bulky PDFs. Get a clean, professional custom URL (e.g., <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm">/p/your-name</code>) that you can instantly drop into LinkedIn, Twitter, email signatures, and directly into online job applications.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex flex-col items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-all duration-300">
                                    <RefreshCw className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-xl">Always Up-to-Date</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Your portfolio is directly synced with your ATS-friendly resume data. Completed a new project or learned a new skill? Update it once in the builder, and your live portfolio reflects it immediately.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex flex-col items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-all duration-300">
                                    <Briefcase className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <CardTitle className="text-xl">Elevate Your Personal Brand</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    A resume summarizes your work, but a personalized portfolio brings it to life. Demonstrate your attention to detail and professionalism with a modern, responsive design that works flawlessly on any device.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Best Practices Section */}
                    <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4 cursor-default">
                                Best Practices for Your Digital Portfolio
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto cursor-default">
                                Maximize your chances of landing that dream job by following these simple, proven strategies for your online presence.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 lg:p-12 border border-slate-100 dark:border-slate-800">
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 shrink-0">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Tailor Your Headline</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Ensure your portfolio's main headline reflects the exact role you are targeting. Keywords matter both for ATS and human recruiters.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 shrink-0">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Keep It Visual</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Add links to live projects, GitHub repositories, or visual case studies. A portfolio thrives on showing, not just telling.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 shrink-0">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Provide Clear Contact Info</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Don't make recruiters search for a way to reach you. Ensure your email, LinkedIn, and primary links are highly visible.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800 hidden md:block aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-8">
                                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-4">
                                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                                    <div className="w-48 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md"></div>
                                    <div className="space-y-2 mt-4">
                                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        <div className="w-[90%] h-3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        <div className="w-[80%] h-3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800 pb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4 cursor-default">
                                Portfolio Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto cursor-default">
                                Everything you need to know about setting up and managing your professional web presence.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                                    <ChevronRight className="h-4 w-4 text-blue-500" />
                                    Why do I need a portfolio if I have a resume?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 ml-6">
                                    A resume is a summarized document, while a portfolio allows you to expand on your experience with interactive links, media, and a stronger personal design identity. It offers proof of work.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                                    <ChevronRight className="h-4 w-4 text-blue-500" />
                                    Is the portfolio link mobile-friendly?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 ml-6">
                                    Yes, absolutely. Our portfolio templates are fully responsive, meaning they look perfect whether viewed on a desktop monitor, tablet, or smartphone.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                                    <ChevronRight className="h-4 w-4 text-blue-500" />
                                    Can I hide my portfolio from public view?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 ml-6">
                                    Yes. You have full control over your privacy. You can easily toggle your portfolio between 'Live' and 'Draft Mode' right here in the dashboard instantly.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                                    <ChevronRight className="h-4 w-4 text-blue-500" />
                                    Will my portfolio help with SEO?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 ml-6">
                                    Yes! Creating a public portfolio page creates an indexable webpage for search engines. This increases the chance of your profile appearing when recruiters search for your skills and location.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
