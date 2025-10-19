import { Button } from "@/components/ui/button"
import { CREATE_RESUME } from "@/config/urls"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export const CTA = () => {
    return (
        <section className="relative overflow-hidden py-24 px-6 bg-card">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/10 animate-gradient-x"></div>
      
        <div className="container relative z-10 mx-auto text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Build Your <span className="text-primary">Perfect Resume</span> in Minutes
          </h2>
      
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            Join thousands of successful job seekers who created their professional resume — 
            <span className="font-semibold text-primary"> free, fast, and easy</span>.
          </p>
      
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={CREATE_RESUME}>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
              >
                Create Free Resume
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
      
            <Link href={`${CREATE_RESUME}/templates`}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-4 font-semibold rounded-xl transition-all duration-300"
              >
                Browse Templates
              </Button>
            </Link>
          </div>
      
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-7 h-7 text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">100% Free</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-7 h-7 text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">No Signup Required</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-7 h-7 text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">Instant Download</p>
            </div>
          </div>
        </div>
      </section>
    )
}