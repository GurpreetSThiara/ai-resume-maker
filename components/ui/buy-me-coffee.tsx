"use client"

import { Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BuyMeCoffee() {
  return (
    <div className="flex flex-col items-center gap-2 text-sm w-full">
      <p className="text-muted-foreground text-center">
        Enjoying CreateFreeCV?
      </p>
      <Button
        asChild
        className="h-9 px-4 gap-2 rounded-full bg-primary w-full hover:bg-primary/90 text-primary-foreground shadow-sm text-xs font-medium"
      >
        <a
          href="https://www.buymeacoffee.com/gs2004"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full"
        >
          <Coffee className="h-3.5 w-3.5" />
          <span>Buy me a coffee</span>
        </a>
      </Button>
    </div>
  )
}
