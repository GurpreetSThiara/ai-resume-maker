"use client"

import { ResumeData } from "@/types/resume"
import type React from "react"
import { useRef, useEffect, useState } from "react"


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
  const personalInfoRef = useRef<HTMLDivElement>(null)
  const customFieldsRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Responsive scaling logic
  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return
      const parent = containerRef.current.parentElement
      if (!parent) return
      const parentWidth = parent.clientWidth
      const parentHeight = parent.clientHeight
      // A4 size in px: 595x842
      const widthScale = parentWidth / 595
      const heightScale = parentHeight / 842
      // Use the smaller scale to fit both width and height
      let newScale = Math.min(widthScale, heightScale, 1)
      // On md+ screens, make it a bit smaller for aesthetics
      if (window.innerWidth >= 768 && newScale > 0.9) newScale = 0.9
      setScale(newScale)
    }
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

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

  const handleNameChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    const name = e.currentTarget?.textContent ?? "";
    setResumeData((prev) => ({ ...prev, name }));
  };

  const handleContactInfoChange = (e: React.FormEvent<HTMLSpanElement>, key: string) => {
    const value = e.currentTarget?.textContent ?? "";
    setResumeData((prev) => ({ ...prev, [key]: value }));
  };

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

  // Colors matching the PDF generator
  const accentColor = "rgb(38, 102, 166)" // rgb(0.15, 0.4, 0.65)
  const textColor = "rgb(26, 26, 26)" // rgb(0.1, 0.1, 0.1)
  const secondaryColor = "rgb(102, 102, 102)" // rgb(0.4, 0.4, 0.4)
  const linkColor = "rgb(0, 0, 255)" // rgb(0, 0, 1)

  return (
    <div className="w-full h-full flex justify-center items-start overflow-auto" style={{ minHeight: 0, minWidth: 0 }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
      >
        <div
          ref={pdfRef}
          className="relative"
          style={{
            width: 595,
            minHeight: 842,
            maxWidth: '100%',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s',
            background: 'white',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            borderRadius: 8,
            overflow: 'hidden',
            margin: '0 auto',
            fontFamily: font?.name || 'Helvetica, Arial, sans-serif',
          }}
        >
          {/* A4 page container with exact PDF dimensions */}
          <div className="px-12 py-12" style={{ minHeight: 842, width: 595, maxWidth: '100%' }}>
            {/* Header - Name */}
            <div className="mb-5" ref={personalInfoRef}>
              <h1
                className="text-xl font-bold leading-none"
                style={{ color: accentColor, fontSize: '20px' }}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleNameChange}
              >
                {resumeData.name}
              </h1>
            </div>
            {/* Contact Info */}
            <div className="mb-6">
              <p className="text-xs leading-none" style={{ color: secondaryColor, fontSize: '10px' }}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContactInfoChange(e, 'email')}
                >
                  {resumeData.email}
                </span>
                {' | '}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContactInfoChange(e, 'phone')}
                >
                  {resumeData.phone}
                </span>
                {' | '}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContactInfoChange(e, 'location')}
                >
                  {resumeData.location}
                </span>
              </p>
            </div>
            {/* Custom Details - Flex-wrap layout matching PDF */}
            <div className="mb-8" ref={customFieldsRef}>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {Object.entries(resumeData.custom)
                  .filter(([_, item]) => !item.hidden)
                  .map(([key, item]) => (
                    <div key={key} className="flex items-start gap-1">
                      <span
                        className="font-bold text-xs leading-none"
                        style={{ color: textColor, fontSize: '10px' }}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleCustomItemChange(key, 'title', e.currentTarget.textContent || '')}
                      >
                        {item.title}:
                      </span>
                      <span
                        className="text-xs leading-none"
                        style={{
                          color: item.link ? linkColor : textColor,
                          fontSize: '10px',
                        }}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleCustomItemChange(key, 'content', e.currentTarget.textContent || '')}
                      >
                        {item.content}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            {/* Sections */}
            {resumeData.sections.map((section) => {
              // Check if section has content
              const hasContent = Object.entries(section.content).some(([key, bullets]) => {
                return key && bullets && bullets.length > 0 && bullets.some((bullet) => bullet.trim() !== '')
              })
              if (!hasContent) return null
              return (
                <div
                  key={section.id}
                  className="mb-8"
                  ref={(el) => {
                    if (el) {
                      sectionRefs.current[section.id] = el
                    }
                  }}
                >
                  {/* Section Title with underline */}
                  <div className="mb-4">
                    <h2
                      className="font-bold text-sm leading-none mb-1"
                      style={{ color: accentColor, fontSize: '14px' }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || '')}
                    >
                      {section.title}
                    </h2>
                    <div className="h-px w-full" style={{ backgroundColor: accentColor }} />
                  </div>
                  {/* Section Content */}
                  <div className="space-y-4">
                    {Object.entries(section.content).map(([key, bullets]) => {
                      // Skip empty keys or empty bullet arrays
                      if (!key || !bullets || bullets.length === 0) return null
                      // Check if bullets have actual content
                      const hasBulletContent = bullets.some((bullet) => bullet.trim() !== '')
                      if (!hasBulletContent) return null
                      const [title, subtitle] = key.split(' | ')
                      return (
                        <div key={key} className="mb-4">
                          {/* Title */}
                          {title && title.trim() !== '' && (
                            <h3
                              className="font-bold text-xs leading-tight mb-1"
                              style={{ color: textColor, fontSize: '11px' }}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || '', 0)}
                            >
                              {title}
                            </h3>
                          )}
                          {/* Subtitle */}
                          {subtitle && subtitle.trim() !== '' && (
                            <p
                              className="text-xs leading-tight mb-1"
                              style={{ color: secondaryColor, fontSize: '9px' }}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || '', 1)}
                            >
                              {subtitle}
                            </p>
                          )}
                          {/* Bullets */}
                          <div className="space-y-1">
                            {bullets.map((bullet, index) => {
                              if (!bullet || bullet.trim() === '') return null
                              return (
                                <div key={index} className="flex items-start">
                                  <span
                                    className="text-xs leading-tight mr-2 flex-shrink-0"
                                    style={{ color: textColor, fontSize: '10px' }}
                                  >
                                    •
                                  </span>
                                  <p
                                    className="text-xs leading-tight"
                                    style={{ color: textColor, fontSize: '10px' }}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBulletChange(section.id, key, index, e.currentTarget.textContent || '')}
                                  >
                                    {bullet}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
