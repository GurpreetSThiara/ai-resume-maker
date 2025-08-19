"use client"

import type React from "react"
import { useRef, useEffect, forwardRef, useState } from "react"
import type { ResumeData, ResumeTemplate, Section } from "@/types/resume"
import { getResumePreview } from "./resumes"

interface ResumePreviewProps {
  resumeData: ResumeData
  template: ResumeTemplate
  onDataUpdate: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
  setResumeData: any
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, template, onDataUpdate, activeSection, setResumeData }, ref) => {
    // Refs for each section to scroll to
    const personalInfoRef = useRef<HTMLDivElement>(null)
    const customFieldsRef = useRef<HTMLDivElement>(null)
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const [ResumeComponent, setResumeComponent] = useState<React.ComponentType<any> | null>(null);

    // Effect to handle scrolling when activeSection changes
    useEffect(() => {
      if (!activeSection) return

      // Determine which element to scroll to
      let elementToScroll: HTMLElement | null = null
      if (activeSection === "personal") {
        elementToScroll = personalInfoRef.current
      } else if (activeSection === "custom") {
        elementToScroll = customFieldsRef.current
      } else if (activeSection.startsWith("section-")) {
        const sectionId = activeSection.replace("section-", "")
        elementToScroll = sectionRefs.current[sectionId] || null
      }

      // Scroll to the element if found
      if (elementToScroll && ref && typeof ref !== "function") {
        const container = (ref as { current: HTMLDivElement | null }).current
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        const elementRect = elementToScroll.getBoundingClientRect()
        const scrollTop = elementRect.top - containerRect.top + container.scrollTop - 20

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        })
      }
    }, [activeSection, ref])

    useEffect(() => {
      let isMounted = true;

      getResumePreview({ template: template }).then((comp) => {
        if (isMounted) setResumeComponent(() => comp);
      });

      return () => {
        isMounted = false;
      };
    }, [template.id]);

    const handleNameChange = (e: React.FocusEvent<HTMLHeadingElement>) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        basics: {
          ...prev.basics,
          name: e.currentTarget.textContent || ""
        }
      }))
    }

    const handleContactInfoChange = (e: React.FocusEvent<HTMLSpanElement>, field: keyof ResumeData['basics']) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        basics: {
          ...prev.basics,
          [field]: e.currentTarget.textContent || ""
        }
      }))
    }

    const handleCustomItemChange = (id: string, field: 'title' | 'content', value: string) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        custom: {
          ...prev.custom,
          [id]: {
            ...prev.custom[id],
            [field]: value
          }
        }
      }))
    }

    const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        sections: prev.sections.map(section => 
          section.id === sectionId ? { ...section, title: newTitle } : section
        )
      }))
    }

    return (
      <div ref={ref} className="bg-blue-50 min-h-screen font-serif">
        {ResumeComponent && <ResumeComponent resumeData={resumeData} setResumeData={setResumeData} activeSection={activeSection} />}
  
      </div>
    )
  },
)

ResumePreview.displayName = "ResumePreview"

export default ResumePreview
