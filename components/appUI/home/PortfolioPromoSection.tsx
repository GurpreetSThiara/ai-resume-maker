"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, Layout, Share2, Sparkles, LogIn } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useAuthModal } from "@/contexts/auth-modal-context"

export function PortfolioPromoSection() {
    const { user } = useAuth()
    const { open } = useAuthModal()

    return (
        <section className="relative py-24 px-4 overflow-hidden bg-slate-900 text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out fill-mode-both">
                        <Badge className="mb-6 px-4 py-1.5 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30">
                            <Sparkles className="w-4 h-4 mr-2 inline" />
                            Free Online Portfolio
                        </Badge>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Your Personal Website, <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Ready in Seconds</span>
                        </h2>

                        <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                            Don't just apply. Stand out. Easily turn your resume into a stunning, interactive portfolio website.
                            {!user ? (
                                <strong className="text-white block mt-2">Log in to create your free online portfolio and share it with anyone, anywhere.</strong>
                            ) : (
                                <strong className="text-white block mt-2">Create your free online portfolio and share it with anyone, anywhere.</strong>
                            )}
                        </p>

                        <div className="space-y-6 mb-10">
                            {[
                                { icon: Layout, title: "Auto-Generated", desc: "Instantly create a site from your resume details." },
                                { icon: Share2, title: "Easy Sharing", desc: "Share your unique, professional link instantly." },
                                { icon: Globe, title: "Get Discovered", desc: "Showcase your work to recruiters online." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                                        <item.icon className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                        <p className="text-slate-400 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {!user ? (
                                <Button
                                    size="lg"
                                    onClick={() => open("/dashboard/portfolios")}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-900/20 w-full sm:w-auto h-12 text-base font-medium group transition-all"
                                >
                                    <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Log In to Create
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <Link href="/dashboard/portfolios">
                                    <Button
                                        size="lg"
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-900/20 w-full sm:w-auto h-12 text-base font-medium group transition-all"
                                    >
                                        Create Your Portfolio
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Visual/Preview */}
                    <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-700 delay-200 ease-in-out fill-mode-both">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-2xl blur-3xl transform rotate-3 scale-95" />
                        <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl transform rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-500 ease-out">
                            {/* Browser Frame */}
                            <div className="h-8 bg-slate-900 rounded-t-xl flex items-center px-4 gap-2 border-b border-slate-700">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="ml-4 flex-1 bg-slate-800 h-5 rounded-full mx-auto max-w-sm flex items-center justify-center text-[10px] text-slate-400 font-mono tracking-wider overflow-hidden px-2 whitespace-nowrap">
                                    <span className="opacity-50">https://</span>createfreecv.com/p/your-name
                                </div>
                            </div>

                            {/* Portfolio Preview Mockup */}
                            <div className="bg-slate-900 rounded-b-xl overflow-hidden aspect-[4/3] relative group">
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-900 text-center pattern-isometric pattern-slate-800 pattern-bg-transparent pattern-size-4 pattern-opacity-100">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-30 animate-pulse-slow" />
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 mx-auto relative z-10 ring-4 ring-slate-800 shadow-xl" />
                                    </div>
                                    <div className="h-6 w-40 bg-slate-700 rounded-full mb-3 mx-auto" />
                                    <div className="h-3 w-56 bg-slate-800 rounded-full mb-6 mx-auto" />

                                    <div className="flex gap-3 mt-2">
                                        <div className="h-8 w-24 bg-indigo-600/30 rounded border border-indigo-500/50" />
                                        <div className="h-8 w-8 bg-slate-800 rounded border border-slate-700" />
                                    </div>

                                    {/* Overlay Badge */}
                                    <div className="absolute top-6 right-6 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-500/20 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Live Now
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
