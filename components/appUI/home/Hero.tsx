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
                <div className="container mx-auto px-4 pt-20 pb-14 md:pt-20 md:pb-20 relative text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                    Free Resume Builder No Sign Up Required
                  </h1>
                  
                  <p className="text-lg md:text-xl text-slate-600 mb-6 max-w-3xl mx-auto">
                    Download a Professional, ATS-Optimized Resume in 2 Minutes—Completely Free. 
                    <span className="font-semibold">No Credit Card, No Hidden Fees, No Email Walls.</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Link href={CREATE_RESUME}>
                      <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
                        Build Your Resume Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  <div className="text-sm text-slate-500 max-w-xl mx-auto pb-10">
                      {/* <p className="mb-4">Used by job seekers at Google, Amazon, and Microsoft.</p> */}
                      <p className="font-semibold text-slate-600">CreateFreeCV is genuinely 100% free—forever.</p>
                  </div>
        
                  <Stats/>
        
                </div>
              </section>
    )
}