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

export const CompactATSResume: React.FC<ResumeProps> = ({
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
      <div className="max-w-3xl mx-auto bg-white shadow border rounded-lg p-6">
        {/* Header */}
        <div ref={personalInfoRef} className="pb-3 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-gray-900" contentEditable suppressContentEditableWarning onBlur={handleNameChange}>
            {resumeData.name}
          </h1>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
            {["email", "phone", "location"].map((field) => (
              <span key={field} contentEditable suppressContentEditableWarning onBlur={(e) => handleContactInfoChange(e, field)}>
                {resumeData[field as keyof ResumeData] as string}
              </span>
            ))}
            {resumeData.linkedin && (
              <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleContactInfoChange(e, "linkedin")}>
                  LinkedIn
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Custom Fields */}
        <div ref={customFieldsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
          {Object.keys(resumeData.custom).map((i) => {
            const item = resumeData.custom[i]
            return (
              <div className={`flex gap-1 ${item.hidden && "hidden"}`} key={item.id}>
                <span className="font-semibold text-gray-800" contentEditable suppressContentEditableWarning onBlur={(e) => handleCustomItemChange(i, "title", e.currentTarget.textContent || "")}>
                  {item.title}:
                </span>
                <span className="text-gray-700" contentEditable suppressContentEditableWarning onBlur={(e) => handleCustomItemChange(i, "content", e.currentTarget.textContent || "")}>
                  {item.content}
                </span>
              </div>
            )
          })}
        </div>

        {/* Sections */}
        <div className="mt-5">
          {resumeData.sections.map((section) => (
            <section
              key={section.id}
              className="mb-6"
              ref={(el) => {
                sectionRefs.current[section.id] = el
              }}
            >
              <h2 className="text-base font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide" contentEditable suppressContentEditableWarning onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}>
                {section.title}
              </h2>
              {Object.entries(section.content).map(([key, bullets]) => (
                <div key={key} className="mb-3">
                  {key && (
                    <div className="mb-1">
                      <h3 className="text-sm font-medium text-gray-900" contentEditable suppressContentEditableWarning onBlur={(e) => handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || "", 0)}>
                        {key.split(" | ")[0]}
                      </h3>
                      <span className="text-xs text-gray-500" contentEditable suppressContentEditableWarning onBlur={(e) => handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || "", 1)}>
                        {key.split(" | ")[1]}
                      </span>
                    </div>
                  )}
                  <ul className="list-disc ml-5 space-y-1 text-xs text-gray-700">
                    {bullets.map((bullet, index) => (
                      <li key={index} contentEditable suppressContentEditableWarning onBlur={(e) => handleBulletChange(section.id, key, index, e.currentTarget.textContent || "")}>
                        {bullet}
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


