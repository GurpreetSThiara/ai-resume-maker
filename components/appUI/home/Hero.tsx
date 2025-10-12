import { Button } from "@/components/ui/button"
import { CREATE_RESUME } from "@/config/urls"
import { ArrowRight, Badge, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import Stats from "./stats"

export const Hero = () => {
    return (
         <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-60">
                  <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-green-100 blur-3xl" />
                  <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-green-50 blur-3xl" />
                </div>
                <div className="container mx-auto px-4 pt-20 pb-14 md:pt-28 md:pb-20 relative text-center">
                  <Badge className="mb-5 bg-white/80 text-green-700 border border-green-200">
                    <Sparkles className="w-4 h-4 mr-2" /> Free Forever. No Sign-Up Required.
                  </Badge>

                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-green-700 to-indigo-700 bg-clip-text text-transparent">
                    Free ATS Resume Builder. No Sign-Up Required.
                  </h1>
                  
                  <p className="text-lg md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
                    Build and download a professional, ATS-friendly resume instantly. We're a free resume builder with no hidden fees. Live preview, free DOCX download, no credit card needed. Optional AI assistant with a free account.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                    <Link href={CREATE_RESUME}>
                      <Button size="lg" className="h-12 px-7 text-base bg-gradient-to-r from-green-600 to-slate-600 hover:from-purple-700 hover:to-blue-700">
                        Create Free Resume
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link href={CREATE_RESUME}>
                      <Button size="lg" variant="outline" className="h-12 px-7 text-base bg-white/70 backdrop-blur border-green-200">
                        <Play className="w-5 h-5 mr-2" /> Try Interactive Demo
                      </Button>
                    </Link>
                  </div>
        
                  <Stats/>
        
                </div>
              </section>
    )
}