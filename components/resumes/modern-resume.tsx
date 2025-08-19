"use client"

import React, { useRef, useEffect } from "react"
import { ResumeData } from "@/types/resume"

interface ResumeProps {
  pdfRef: React.RefObject<HTMLDivElement>
  font: { className: string; name: string }
  theme: any
  resumeData: ResumeData
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
}

export const ModernResume: React.FC<ResumeProps> = ({
  pdfRef,
  font,
  theme,
  resumeData,
  setResumeData,
  activeSection,
}) => {
  const personalInfoRef = useRef<HTMLDivElement>(null)
  const customFieldsRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Scroll behavior
  useEffect(() => {
    if (!activeSection) return
    let target: HTMLElement | null = null
    if (activeSection === "personal") target = personalInfoRef.current
    else if (activeSection === "custom") target = customFieldsRef.current
    else if (activeSection.startsWith("section-")) {
      const id = activeSection.replace("section-", "")
      target = sectionRefs.current[id] || null
    }
    if (target && pdfRef && typeof pdfRef !== "function") {
      const container = pdfRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      container.scrollTo({
        top: targetRect.top - containerRect.top + container.scrollTop - 20,
        behavior: "smooth",
      })
    }
  }, [activeSection, pdfRef])

  const update = (key: string, value: string) =>
    setResumeData((prev) => ({ ...prev, [key]: value }))

  const updateCustom = (id: string, field: "title" | "content", value: string) =>
    setResumeData((prev) => {
      const data = structuredClone(prev)
      if (data.custom[id]) data.custom[id][field] = value
      return data
    })

  const updateSectionTitle = (id: string, title: string) =>
    setResumeData((prev) => {
      const data = structuredClone(prev)
      const idx = data.sections.findIndex((s) => s.id === id)
      if (idx !== -1) data.sections[idx].title = title
      return data
    })

  const updateSectionHeader = (id: string, originalKey: string, text: string, pos: 0 | 1) =>
    setResumeData((prev) => {
      const data = structuredClone(prev)
      const idx = data.sections.findIndex((s) => s.id === id)
      if (idx === -1) return prev
      const keyParts = originalKey.split(" | ")
      keyParts[pos] = text
      const newKey = keyParts.join(" | ")
      if (originalKey !== newKey) {
        const ordered: Record<string, string[]> = {}
        for (const k of Object.keys(data.sections[idx].content)) {
          ordered[k === originalKey ? newKey : k] = data.sections[idx].content[k]
        }
        data.sections[idx].content = ordered
      }
      return data
    })

  const updateBullet = (id: string, key: string, index: number, text: string) =>
    setResumeData((prev) => {
      const data = structuredClone(prev)
      const idx = data.sections.findIndex((s) => s.id === id)
      if (idx !== -1 && data.sections[idx].content[key]?.[index] !== undefined) {
        data.sections[idx].content[key][index] = text
      }
      return data
    })

  return (
    <div
      ref={pdfRef}
      className={`bg-gray-100 min-h-screen ${font.className}`}
      style={{ fontFamily: font.name }}
    >
      <div className="max-w-4xl mx-auto bg-white shadow-md border border-gray-200 p-8">
        
        {/* HEADER */}
        <div ref={personalInfoRef} className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-300 pb-4 mb-6">
          <h1
            className="text-4xl font-bold text-gray-900"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => update("name", e.currentTarget.textContent || "")}
          >
            {resumeData.name}
          </h1>
          <div className="mt-3 sm:mt-0 space-y-1 text-sm text-gray-700">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update("email", e.currentTarget.textContent || "")}
            >
              {resumeData.email}
            </span>{" "}
            |{" "}
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update("phone", e.currentTarget.textContent || "")}
            >
              {resumeData.phone}
            </span>{" "}
            |{" "}
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => update("location", e.currentTarget.textContent || "")}
            >
              {resumeData.location}
            </span>{" "}
            |{" "}
            <a href={resumeData.linkedin} className="text-blue-600 underline">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => update("linkedin", e.currentTarget.textContent || "")}
              >
                LinkedIn
              </span>
            </a>
          </div>
        </div>

        {/* CUSTOM FIELDS */}
        <div ref={customFieldsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
          {Object.keys(resumeData.custom).map((i, index) => {
            const item = resumeData.custom[i]
            return (
              <div key={index} className={`flex gap-2 ${item.hidden && "hidden"}`}>
                <span
                  className="font-semibold uppercase text-xs tracking-wide text-gray-600"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateCustom(i, "title", e.currentTarget.textContent || "")}
                >
                  {item.title}:
                </span>
                <span
                  className="text-gray-800 text-sm"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateCustom(i, "content", e.currentTarget.textContent || "")}
                >
                  {item.content}
                </span>
              </div>
            )
          })}
        </div>

        {/* SECTIONS */}
        {resumeData.sections.map((section) => (
          <section
            key={section.id}
            className="mb-6"
            ref={(el) => {
              sectionRefs.current[section.id] = el
            }}
          >
            <h2
              className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-300 pb-1 mb-4"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateSectionTitle(section.id, e.currentTarget.textContent || "")}
            >
              {section.title}
            </h2>
            {Object.entries(section?.content ?? {}).map(([key, bullets]) => (
              <div key={key} className="mb-4">
                {key && (
                  <div className="mb-1">
                    <h3
                      className="text-md font-semibold text-gray-900"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateSectionHeader(section.id, key, e.currentTarget.textContent || "", 0)}
                    >
                      {key.split(" | ")[0]}
                    </h3>
                    <span
                      className="text-sm text-gray-600"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateSectionHeader(section.id, key, e.currentTarget.textContent || "", 1)}
                    >
                      {key.split(" | ")[1]}
                    </span>
                  </div>
                )}
                <ul className="list-disc ml-5 space-y-1">
                  {bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-700"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateBullet(section.id, key, idx, e.currentTarget.textContent || "")}
                    >
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
  )
}
