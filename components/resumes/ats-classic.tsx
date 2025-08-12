"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { ResumeData } from "@/types/resume"

interface ResumeProps {
  pdfRef: React.RefObject<HTMLDivElement>
  font: { className: string; name: string }
  theme: any
  resumeData: ResumeData
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
}

export const ClassicATSResume: React.FC<ResumeProps> = ({
  pdfRef,
  font,
  theme,
  resumeData,
  setResumeData,
  activeSection,
}) => {
  const personalInfoRef = useRef<HTMLDivElement>(null)
  const customFieldsRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    if (!activeSection) return
    let elementToScroll: HTMLElement | null = null
    if (activeSection === "personal") elementToScroll = personalInfoRef.current
    else if (activeSection === "custom") elementToScroll = customFieldsRef.current
    else if (activeSection.startsWith("section-"))
      elementToScroll = sectionRefs.current[activeSection.replace("section-", "")] || null

    if (elementToScroll && pdfRef && typeof pdfRef !== "function") {
      const container = (pdfRef as { current: HTMLDivElement | null }).current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      const elementRect = elementToScroll.getBoundingClientRect()
      const scrollTop = elementRect.top - containerRect.top + container.scrollTop - 20
      container.scrollTo({ top: scrollTop, behavior: "smooth" })
    }
  }, [activeSection, pdfRef])

  const handleNameChange = (e: React.FormEvent<HTMLHeadingElement>) =>
    setResumeData((prev) => ({ ...prev, name: e.currentTarget.textContent || "" }))

  const handleContactInfoChange = (e: React.FormEvent<HTMLSpanElement>, key: string) =>
    setResumeData((prev) => ({ ...prev, [key]: e.currentTarget.textContent || "" }))

  const handleCustomItemChange = (id: string, field: "title" | "content", value: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      if (updated.custom[id]) updated.custom[id][field] = value
      return updated
    })

  const handleSectionTitleChange = (sectionId: string, newTitle: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const idx = updated.sections.findIndex((s) => s.id === sectionId)
      if (idx !== -1) updated.sections[idx].title = newTitle
      return updated
    })

  const handleSectionHeaderChange = (
    sectionId: string,
    originalKey: string,
    newText: string,
    position: 0 | 1
  ) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const idx = updated.sections.findIndex((s) => s.id === sectionId)
      if (idx === -1) return prev
      const section = updated.sections[idx]
      const keyParts = originalKey.split(" | ")
      keyParts[position] = newText
      const newKey = keyParts.join(" | ")
      if (originalKey !== newKey) {
        const orderedContent: Record<string, string[]> = {}
        for (const k of Object.keys(section.content))
          orderedContent[k === originalKey ? newKey : k] = section.content[k]
        section.content = orderedContent
      }
      return updated
    })

  const handleBulletChange = (sectionId: string, key: string, index: number, newText: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const idx = updated.sections.findIndex((s) => s.id === sectionId)
      if (idx === -1) return prev
      if (updated.sections[idx].content[key]?.[index] !== undefined)
        updated.sections[idx].content[key][index] = newText
      return updated
    })

  return (
    <div ref={pdfRef} className={`bg-gray-50 min-h-screen p-6 ${font.className}`} style={{ fontFamily: font.name }}>
      <div className="max-w-4xl mx-auto bg-white shadow border rounded-lg p-8">
        {/* Header */}
        <div ref={personalInfoRef} className="pb-4 border-b border-gray-300">
          <h1
            className="text-3xl font-bold text-gray-900 tracking-tight mb-4"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleNameChange}
          >
            {resumeData.name}
          </h1>
          
          {/* Contact information on single line */}
          <div className="text-sm text-gray-600 mb-4">
            {[
              resumeData.email,
              resumeData.phone,
              resumeData.location,
              resumeData.linkedin
            ].filter(Boolean).map((field, index, array) => (
              <span key={index}>
                <span contentEditable suppressContentEditableWarning onBlur={(e) => {
                  const key = Object.keys(resumeData).find(k => resumeData[k as keyof ResumeData] === field) || 'email'
                  handleContactInfoChange(e, key)
                }}>
                  {field}
                </span>
                {index < array.length - 1 && <span className="mx-2">|</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Custom Fields - inline format like PDF */}
        <div ref={customFieldsRef} className="mt-4 space-y-2 text-sm">
          {Object.keys(resumeData.custom).map((i) => {
            const item = resumeData.custom[i]
            if (item.hidden) return null
            return (
              <div key={item.id} className="flex gap-2">
                <span className="font-semibold text-gray-800" contentEditable suppressContentEditableWarning onBlur={(e) => handleCustomItemChange(i, "title", e.currentTarget.textContent || "")}>
                  {item.title.toUpperCase()}:
                </span>
                <span className="text-gray-700" contentEditable suppressContentEditableWarning onBlur={(e) => handleCustomItemChange(i, "content", e.currentTarget.textContent || "")}>
                  {item.content}
                </span>
              </div>
            )
          })}
        </div>

        {/* Sections */}
        <div className="mt-6">
          {resumeData.sections.map((section) => (
            <section
              key={section.id}
              className="mb-8"
              ref={(el) => {
                sectionRefs.current[section.id] = el
              }}
            >
              <h2
                className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-4 uppercase tracking-wide"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
              >
                {section.title}
              </h2>
              
              {Object.entries(section.content).map(([key, bullets]) => (
                <div key={key} className="mb-4">
                  {key && (
                    <div className="flex justify-between items-center mb-2">
                      {/* Role on left */}
                      <h3
                        className="text-sm font-medium text-gray-900 flex-1"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || "", 0)}
                      >
                        {key.split(" | ")[0]}
                      </h3>
                      
                      {/* Date on right */}
                      {key.split(" | ")[1] && (
                        <span
                          className="text-xs text-gray-500 ml-4"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || "", 1)}
                        >
                          {key.split(" | ")[1]}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Bullet points with proper indentation */}
                  <ul className="list-none space-y-1 text-sm text-gray-700 ml-4">
                    {bullets.map((bullet, index) => (
                      <li
                        key={index}
                        className="flex items-start"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBulletChange(section.id, key, index, e.currentTarget.textContent || "")}
                      >
                        <span className="mr-2 text-gray-500">•</span>
                        <span className="flex-1">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}



