"use client"

import React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Section, SectionHeading } from "./shared"

const FAQS = [
  { q: "Is it really free?", a: "Yes — build, customize and download unlimited resumes and DOCX files for free. No credit card, no trial, no watermark." },
  { q: "Do I need to create an account?", a: "No. You can build and download a resume without signing up. Sign in only if you want to save to the cloud or publish a portfolio." },
  { q: "Are the templates ATS-friendly?", a: "Every template is structured for clean parsing by applicant tracking systems, and each one shows a real ATS score so you can pick a high-scorer." },
  { q: "Can I download as Word (DOCX)?", a: "Yes — export a pixel-perfect PDF or a fully editable DOCX. You also get a live PDF and DOCX preview while you edit." },
  { q: "Can I change colors and fonts?", a: "Yes. The live theme customizer lets you change the accent color, switch serif/sans, adjust density, and fit to one page — all with instant preview." },
  { q: "What's the portfolio feature?", a: "From the same resume content you can publish a shareable personal website. Choose from 5 designs and share your own /p/your-name link." },
]

export function FaqV2() {
  return (
    <Section tint="muted">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" subtitle="Everything you might want to know before you start." />
      <div className="mx-auto mt-12 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-border bg-white px-5 shadow-sm">
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
}
