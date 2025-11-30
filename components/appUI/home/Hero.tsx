import { Button } from "@/components/ui/button"
import { CREATE_RESUME } from "@/config/urls"
import { ArrowRight, Badge, Play, Sparkles, Zap, Shield, Download } from "lucide-react"
import Link from "next/link"
import Stats from "./stats"
import { Logo } from "@/components/ui/logo"

export const Hero = () => {
    return (
         <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-60">
                  <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-linear-to-r from-green-100 to-emerald-100 blur-3xl animate-pulse" />
                  <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-linear-to-r from-blue-100 to-indigo-100 blur-3xl animate-pulse delay-1000" />
                  <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-linear-to-r from-purple-100 to-pink-100 blur-3xl animate-pulse delay-500" />
                </div>
                <div className="container mx-auto px-4 pt-20 pb-14 md:pt-20 md:pb-20 relative text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full mb-6 shadow-sm">
                    <Badge className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-700">100% Free Forever</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-slate-900 via-green-800 to-slate-900 bg-clip-text text-transparent animate-gradient">
                    Free Resume Builder
                    <br />
                    <span className="text-3xl md:text-5xl lg:text-6xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      No Sign Up Required
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                    Download a Professional, ATS-Optimized Resume in 2 Minutes—Completely Free. 
                    <span className="font-semibold text-slate-800 block mt-2">No Credit Card, No Hidden Fees, No Email Walls.</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Link href={CREATE_RESUME}>
                      <Button size="lg" className="h-14 px-8 text-lg bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-0">
                        <Zap className="w-5 h-5 mr-2" />
                        Build Your Resume Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 max-w-2xl mx-auto pb-10">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-slate-600">Privacy First</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-slate-600">Instant Download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-slate-600">ATS-Friendly</span>
                    </div>
                  </div>
        
                  <Stats/>
        
                </div>
              </section>
    )
}