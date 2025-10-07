"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { sampleResumeData } from "@/lib/examples/resume-example"
import { GoogleResume } from "@/components/resumes/google-resume"
import { ClassicATSResume } from "@/components/resumes/ats-classic"



export default function ResumeCarousel() {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-10">
          Explore Our Resume Templates
        </h2>

     
      </div>
    </section>
  )
}
