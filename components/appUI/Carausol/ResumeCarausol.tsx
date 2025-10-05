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

        <div className="relative">
          {/* Scroll buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background shadow"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background shadow"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Carousel */}
          <div
            ref={scrollRef}
            className="flex items-start overflow-x-auto snap-x snap-mandatory gap-6 scrollbar-hide scroll-smooth"
          >
            {/* Slide 1 */}
            <Card className=" min-w-[90%] md:min-w-[48%] lg:min-w-[32%] snap-center border shadow-lg rounded-xl overflow-hidden h-fit">
              <ClassicATSResume
                resumeData={sampleResumeData}
                pdfRef={null}
                font={{ className: "", name: "" }}
                theme={{}}
                setResumeData={() => {}}
                activeSection=""
              />
            </Card>

            {/* Slide 2 */}
            <Card className="min-w-[90%] md:min-w-[48%] lg:min-w-[32%] snap-center border shadow-lg rounded-xl overflow-hidden h-fit">
              <GoogleResume
                resumeData={sampleResumeData}
                pdfRef={null}
                font={{ className: "", name: "" }}
                theme={{}}
                setResumeData={() => {}}
                activeSection=""
              />
            </Card>

            <Card className="min-w-[90%] md:min-w-[48%] lg:min-w-[32%] snap-center border shadow-lg rounded-xl overflow-hidden h-fit">
              <ClassicATSResume
                resumeData={sampleResumeData}
                pdfRef={null}
                font={{ className: "", name: "" }}
                theme={{}}
                setResumeData={() => {}}
                activeSection=""
              />
            </Card>

            {/* Add more templates */}
          </div>
        </div>
      </div>
    </section>
  )
}
