'use client'

import { Download } from "lucide-react"

export function FloatingBadge() {
  const handleClick = () => {
    window.open('/free-ats-resume-templates', '_blank')
  }

  return (
    <div 
      className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-primary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl z-20 animate-bounce border border-primary/20 cursor-pointer hover:scale-105 transition-transform"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 font-bold text-sm sm:text-base whitespace-nowrap">
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        Unlimited Downloads
      </div>
    </div>
  )
}
