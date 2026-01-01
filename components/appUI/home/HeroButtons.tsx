"use client"

import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import { CREATE_RESUME } from "@/config/urls"

export function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10 sm:mb-12">
      <Button
        onClick={() => window.open(CREATE_RESUME, '_blank')}
        size="lg"
        className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold rounded-xl group shadow-lg hover:shadow-xl transition-all"
      >
        Build Your Resume Now
        <Sparkles className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
      </Button>

      <div className="flex items-center gap-3 text-sm font-medium px-2">
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-2 text-foreground">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
              <Check className="w-3 h-3 text-primary" />
            </div>
            Instant Download
          </span>
          <span className="flex items-center gap-2 text-foreground">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
              <Check className="w-3 h-3 text-primary" />
            </div>
            Privacy First
          </span>
        </div>
      </div>
    </div>
  )
}

export function SecondaryCTAButton() {
  return (
    <Button
      onClick={() => window.open(CREATE_RESUME, '_blank')}
      size="lg"
      className="h-14 px-10 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
    >
      Start Building Now — It&apos;s Free
    </Button>
  )
}
