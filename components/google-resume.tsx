"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import type { ResumeData } from "@/app/create/page"

interface ResumeProps {
  pdfRef: React.RefObject<HTMLDivElement>
  font: { className: string; name: string }
  theme: any
  resumeData: ResumeData
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
}

export const GoogleResume: React.FC<ResumeProps> = ({
  pdfRef,
  font,
  theme,
  resumeData,
  setResumeData,
  activeSection,
}) => {
  // Refs for each section to scroll to
  const personalInfoRef = useRef<HTMLDivElement>(null)
  const customFieldsRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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
    if (elementToScroll && pdfRef && typeof pdfRef !== "function") {
      const container = (pdfRef as { current: HTMLDivElement | null }).current
      if (!container) return // extra safety

      const containerRect = container.getBoundingClientRect()
      const elementRect = elementToScroll.getBoundingClientRect()
      const scrollTop = elementRect.top - containerRect.top + container.scrollTop - 20

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      })
    }
  }, [activeSection, pdfRef])

  const handleNameChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    const newValue = e.currentTarget.textContent || ""
    setResumeData((prev) => ({ ...prev, name: newValue }))
  }

  const handleContactInfoChange = (e: React.FormEvent<HTMLSpanElement>, key: string) => {
    const content = e.currentTarget.textContent || ""
    setResumeData((prev) => ({
      ...prev,
      [key]: content,
    }))
  }

  const handleCustomItemChange = (id: string, field: "title" | "content", value: string) => {
    setResumeData((prev) => {
      // Create a deep copy to preserve order
      const updatedResumeData = JSON.parse(JSON.stringify(prev))
      if (updatedResumeData.custom[id]) {
        // Update the specific field while preserving the object structure
        updatedResumeData.custom[id][field] = value
      }
      return updatedResumeData
    })
  }

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    setResumeData((prev) => {
      // Create a deep copy to preserve order
      const updatedResumeData = JSON.parse(JSON.stringify(prev))
      const sectionIndex = updatedResumeData.sections.findIndex((s) => s.id === sectionId)
      if (sectionIndex !== -1) {
        updatedResumeData.sections[sectionIndex].title = newTitle
      }
      return updatedResumeData
    })
  }

  const handleSectionHeaderChange = (sectionId: string, originalKey: string, newText: string, position: 0 | 1) => {
    setResumeData((prev) => {
      // Create a deep copy to preserve order
      const updatedResumeData = JSON.parse(JSON.stringify(prev))
      const sectionIndex = updatedResumeData.sections.findIndex((s) => s.id === sectionId)
      if (sectionIndex === -1) return prev

      const section = updatedResumeData.sections[sectionIndex]
      const keyParts = originalKey.split(" | ")
      keyParts[position] = newText
      const newKey = keyParts.join(" | ")

      // Preserve the order of entries by creating a new ordered object
      if (originalKey !== newKey) {
        const orderedContent = {}
        // Get original keys to maintain order
        const originalKeys = Object.keys(section.content)
        originalKeys.forEach((k) => {
          if (k === originalKey) {
            orderedContent[newKey] = section.content[originalKey]
          } else {
            orderedContent[k] = section.content[k]
          }
        })
        section.content = orderedContent
      }

      return updatedResumeData
    })
  }

  const handleBulletChange = (sectionId: string, key: string, index: number, newText: string) => {
    setResumeData((prev) => {
      // Create a deep copy to preserve order
      const updatedResumeData = JSON.parse(JSON.stringify(prev))
      const sectionIndex = updatedResumeData.sections.findIndex((s) => s.id === sectionId)
      if (sectionIndex === -1) return prev

      const section = updatedResumeData.sections[sectionIndex]
      // Directly update the bullet at the specific index
      if (section.content[key] && section.content[key][index] !== undefined) {
        section.content[key][index] = newText
      }

      return updatedResumeData
    })
  }

  return (
    <div ref={pdfRef} className={`bg-blue-50 min-h-screen ${font.className}`} style={{ fontFamily: font.name }}>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div ref={personalInfoRef} className="border-b border-gray-200 p-4">
          <h1
            className={`${theme.fontSize.name} font-bold text-3xl text-gray-800`}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={handleNameChange}
          >
            {resumeData.name}
          </h1>
        </div>
        <div className="p-6">
          <div className={`${theme.fontSize.small} text-gray-600 flex flex-wrap gap-4 mb-6`}>
            <span
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContactInfoChange(e, "email")}
            >
              {resumeData.email}
            </span>
            <span
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContactInfoChange(e, "phone")}
            >
              {resumeData.phone}
            </span>
            <span
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContactInfoChange(e, "location")}
            >
              {resumeData.location}
            </span>
            <span>
              <a href={resumeData.linkedin}>
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleContactInfoChange(e, "linkedin")}
                >
                  LinkedIn
                </span>
              </a>
            </span>
          </div>

          <div ref={customFieldsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-1 gap-x-8 pb-6">
            {Object.keys(resumeData.custom).map((i, index) => {
              const item = resumeData.custom[i]
              return (
                <div
                  className={`flex gap-2 text-xs justify-between ${item.hidden && "hidden"}`}
                  key={`${index} ${item.id}`}
                >
                  <span
                    className="font-semibold"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleCustomItemChange(i, "title", e.currentTarget.textContent || "")}
                  >
                    {item.title}:
                  </span>
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleCustomItemChange(i, "content", e.currentTarget.textContent || "")}
                  >
                    {item.content}
                  </span>
                </div>
              )
            })}
          </div>

          {resumeData.sections.map((section) => (
            <section
              key={section.id}
              className="mb-8"
              ref={(el) => {
                sectionRefs.current[section.id] = el
              }}
            >
              <h2
                className={`${theme.fontSize.section} font-medium text-blue-700 mb-4 pb-2 border-b border-gray-200`}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
              >
                {section.title}
              </h2>
              {Object.entries(section.content).map(([key, bullets]) => (
                <div key={key} className="mb-4">
                  {key && (
                    <div className="mb-2">
                      <h3
                        className={`${theme.fontSize.content} font-medium text-gray-800`}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || "", 0)}
                      >
                        {key.split(" | ")[0]}
                      </h3>
                      <span
                        className={`${theme.fontSize.small} text-gray-600`}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || "", 1)}
                      >
                        {key.split(" | ")[1]}
                      </span>
                    </div>
                  )}
                  <ul className="list-disc ml-5 space-y-1">
                    {bullets.map((bullet, index) => (
                      <li
                        key={index}
                        className={`${theme.fontSize.small} text-gray-700`}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleBulletChange(section.id, key, index, e.currentTarget.textContent || "")}
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
    </div>
  )
}
