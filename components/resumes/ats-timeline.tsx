"use client"

import type React from "react"
import ProjectSection from '../resume-components/project-section'
import { useRef, useEffect, useState } from "react"
import type { ResumeData } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { sortSectionsByOrder } from "@/utils/sectionOrdering"

interface ResumeProps {
  pdfRef: React.RefObject<HTMLDivElement>
  font: { className: string; name: string }
  theme: any
  resumeData: ResumeData
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
}

export const ATS_TIMELINE: React.FC<ResumeProps> = ({
  pdfRef,
  font = {},
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
      let newScale = Math.min(widthScale, 1)
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
    const name = e.currentTarget?.textContent ?? ""
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, name } }))
  }

  const handleSummaryChange = (e: React.FormEvent<HTMLParagraphElement>) => {
    const summary = e.currentTarget?.textContent ?? ""
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, summary } }))
  }

  const handleContactInfoChange = (e: React.FormEvent<HTMLSpanElement>, key: keyof typeof resumeData.basics) => {
    const value = e.currentTarget?.textContent ?? ""
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, [key]: value } }))
  }

  const handleSectionItemChange = (sectionId: string, itemIndex: number, field: string, value: string) => {
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section) return prev

      if (section.type === "education") {
        ;(section.items[itemIndex] as any)[field] = value
      } else if (section.type === "experience") {
        ;(section.items[itemIndex] as any)[field] = value
      }
      return updated
    })
  }

  const handleSkillsChange = (sectionId: string, value: string) => {
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section) return prev

      const items = value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
      section.items = items
      return updated
    })
  }

  const handleCustomContentChange = (sectionId: string, contentIndex: number, value: string) => {
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== "custom") return prev

      if (!section.content) section.content = []
      section.content[contentIndex] = value
      return updated
    })
  }

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

  const handleHighlightChange = (sectionId: string, itemIndex: number, highlightIndex: number, newText: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== "education") return prev

      const item = section.items[itemIndex]
      if (item?.highlights) item.highlights[highlightIndex] = newText
      return updated
    })

  const handleAchievementChange = (sectionId: string, itemIndex: number, achievementIndex: number, newText: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== "experience") return prev

      const item = section.items[itemIndex]
      if (item?.achievements) item.achievements[achievementIndex] = newText
      return updated
    })

  const handleProjectFieldChange = (sectionId: string | undefined, projectIndex: number, field: string, value: string) => {
    if (!sectionId) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.PROJECTS) return prev
      if (!section.items) section.items = [] as any
      ;(section.items[projectIndex] as any)[field] = value
      return updated
    })
  }

  const handleProjectDescriptionChange = (sectionId: string | undefined, projectIndex: number, descIndex: number, value: string) => {
    if (!sectionId) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.PROJECTS) return prev
      const proj = (section.items[projectIndex] as any)
      if (!proj) return prev
      if (!Array.isArray(proj.description)) proj.description = []
      proj.description[descIndex] = value
      return updated
    })
  }

  return (
    <div ref={containerRef} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        ref={pdfRef}
        style={{
          minWidth: 595,
          maxWidth: "100%",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.2s",
          background: "white",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          borderRadius: 8,
          overflow: "hidden",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* A4 page container with exact PDF dimensions */}
        <div className="px-12 py-8" style={{ minWidth: 595, maxWidth: "100%" }}>
          {/* Header - Name */}
          <div className="mb-2">
            <h1
              className="text-3xl font-bold leading-tight"
              style={{
                color: "#1a202c",
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "8px",
                letterSpacing: "0.5px",
              }}
              contentEditable={!!setResumeData}
              suppressContentEditableWarning
              onBlur={handleNameChange}
            >
              {resumeData.basics.name}
            </h1>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <p className="text-sm leading-tight" style={{ color: "#4a5568", fontSize: "12px", marginBottom: "4px" }}>
              <span
                contentEditable={!!setResumeData}
                suppressContentEditableWarning
                onBlur={(e) => handleContactInfoChange(e, "phone")}
              >
                {resumeData.basics.phone}
              </span>
              {" • "}
              <span
                contentEditable={!!setResumeData}
                suppressContentEditableWarning
                onBlur={(e) => handleContactInfoChange(e, "email")}
              >
                {resumeData.basics.email}
              </span>
              {" • "}
              <span
                contentEditable={!!setResumeData}
                suppressContentEditableWarning
                onBlur={(e) => handleContactInfoChange(e, "location")}
              >
                {resumeData.basics.location}
              </span>
              {resumeData.basics.linkedin && (
                <>
                  {" • "}
                  <span
                    contentEditable={!!setResumeData}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContactInfoChange(e, "linkedin")}
                  >
                    {resumeData.basics.linkedin}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Summary */}
          {resumeData.basics.summary && (
            <div className="mb-6">
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "#2d3748",
                  fontSize: "12px",
                  lineHeight: "1.6",
                  textAlign: "justify",
                }}
                contentEditable={!!setResumeData}
                suppressContentEditableWarning
                onBlur={handleSummaryChange}
              >
                {resumeData.basics.summary}
              </p>
            </div>
          )}

          {/* Custom Fields */}
          {Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden).length > 0 && (
            <div className="mb-6" ref={customFieldsRef}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(resumeData.custom)
                  .filter(([_, item]) => !item.hidden)
                  .map(([key, item]) => (
                    <div key={key} className="text-sm" style={{ fontSize: "11px" }}>
                      <span
                        className="font-semibold"
                        style={{ color: "#2d3748", fontWeight: "600" }}
                        contentEditable={!!setResumeData}
                        suppressContentEditableWarning
                        onBlur={(e) => handleCustomItemChange(key, "title", e.currentTarget.textContent || "")}
                      >
                        {item.title}:
                      </span>{" "}
                      <span
                        style={{ color: "#4a5568" }}
                        contentEditable={!!setResumeData}
                        suppressContentEditableWarning
                        onBlur={(e) => handleCustomItemChange(key, "content", e.currentTarget.textContent || "")}
                      >
                        {item.content}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Sections with Timeline Design */}
          {sortSectionsByOrder(resumeData.sections).map((section) => {
            // Check if section has content
            let hasContent = false

            if (section.type === SECTION_TYPES.EDUCATION || section.type === SECTION_TYPES.EXPERIENCE) {
              hasContent = section.items && section.items.length > 0
            } else if (
              section.type === SECTION_TYPES.SKILLS ||
              section.type === SECTION_TYPES.LANGUAGES ||
              section.type === SECTION_TYPES.CERTIFICATIONS
            ) {
              hasContent = section.items && section.items.length > 0
            } else if (section.type === SECTION_TYPES.PROJECTS) {
              hasContent = Array.isArray((section as any).items) && (section as any).items.length > 0
            } else if (section.type === SECTION_TYPES.CUSTOM) {
              hasContent =
                section.content && section.content.length > 0 && section.content.some((item) => item.trim() !== "")
            }

            if (!hasContent) return null

            return (
              <div
                key={section.id}
                className="mb-6"
                ref={(el) => {
                  sectionRefs.current[section.id] = el
                }}
              >
                {/* Section Header */}
                <div className="mb-4">
                  <h2
                    className="font-bold text-base leading-none uppercase tracking-wide"
                    style={{
                      color: "#2d3748",
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderBottom: "2px solid #4299e1",
                      paddingBottom: "4px",
                      letterSpacing: "1px",
                    }}
                    contentEditable={!!setResumeData}
                    suppressContentEditableWarning
                    onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
                  >
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Education Section with Timeline */}
                  {section.type === SECTION_TYPES.EDUCATION &&
                    section.items.map((edu, eduIdx) => (
                      <div key={eduIdx} className="relative pl-8">
                        {/* Timeline dot and line */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: "#4299e1",
                              border: "2px solid white",
                              boxShadow: "0 0 0 2px #4299e1",
                              marginTop: "2px",
                              flexShrink: 0,
                            }}
                          />
                          {eduIdx < section.items.length - 1 && (
                            <div
                              style={{
                                width: "2px",
                                flexGrow: 1,
                                backgroundColor: "#cbd5e0",
                                marginTop: "4px",
                              }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <p
                              className="font-bold text-sm leading-tight"
                              style={{ color: "#2d3748", fontSize: "13px", fontWeight: "bold" }}
                              contentEditable={!!setResumeData}
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleSectionItemChange(section.id, eduIdx, "institution", e.currentTarget.textContent || "")
                              }
                            >
                              {edu.institution}
                            </p>
                            {(edu.startDate || edu.endDate) && (
                              <p
                                className="text-xs text-gray-600 ml-4 flex-shrink-0"
                                style={{ color: "#718096", fontSize: "11px" }}
                              >
                                <span
                                  contentEditable={!!setResumeData}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleSectionItemChange(section.id, eduIdx, "startDate", e.currentTarget.textContent || "")
                                  }
                                >
                                  {edu.startDate}
                                </span>
                                {" - "}
                                <span
                                  contentEditable={!!setResumeData}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleSectionItemChange(section.id, eduIdx, "endDate", e.currentTarget.textContent || "")
                                  }
                                >
                                  {edu.endDate}
                                </span>
                              </p>
                            )}
                          </div>
                          <p
                            className="text-sm leading-tight mb-1"
                            style={{ color: "#4a5568", fontSize: "12px" }}
                            contentEditable={!!setResumeData}
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, eduIdx, "degree", e.currentTarget.textContent || "")}
                          >
                            {edu.degree}
                          </p>
                          {edu.location && (
                            <p
                              className="text-xs text-gray-500 mb-2"
                              style={{ color: "#a0aec0", fontSize: "11px" }}
                              contentEditable={!!setResumeData}
                              suppressContentEditableWarning
                              onBlur={(e) => handleSectionItemChange(section.id, eduIdx, "location", e.currentTarget.textContent || "")}
                            >
                              {edu.location}
                            </p>
                          )}
                          {edu.highlights && edu.highlights.length > 0 && (
                            <div className="space-y-1 mt-2">
                              {edu.highlights.map((highlight, highlightIdx) => (
                                <div key={highlightIdx} className="flex items-start">
                                  <span
                                    className="text-sm leading-tight mr-2 flex-shrink-0"
                                    style={{ color: "#4299e1", fontSize: "12px" }}
                                  >
                                    •
                                  </span>
                                  <p
                                    className="text-sm leading-tight"
                                    style={{ color: "#4a5568", fontSize: "12px", lineHeight: "1.5" }}
                                    contentEditable={!!setResumeData}
                                    suppressContentEditableWarning
                                    onBlur={(e) =>
                                      handleHighlightChange(section.id, eduIdx, highlightIdx, e.currentTarget.textContent || "")
                                    }
                                  >
                                    {highlight}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {/* Experience Section with Timeline */}
                  {section.type === SECTION_TYPES.EXPERIENCE &&
                    section.items.map((exp, expIdx) => (
                      <div key={expIdx} className="relative pl-8">
                        {/* Timeline dot and line */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: "#4299e1",
                              border: "2px solid white",
                              boxShadow: "0 0 0 2px #4299e1",
                              marginTop: "2px",
                              flexShrink: 0,
                            }}
                          />
                          {expIdx < section.items.length - 1 && (
                            <div
                              style={{
                                width: "2px",
                                flexGrow: 1,
                                backgroundColor: "#cbd5e0",
                                marginTop: "4px",
                              }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p
                                className="font-bold text-sm leading-tight"
                                style={{ color: "#2d3748", fontSize: "13px", fontWeight: "bold" }}
                                contentEditable={!!setResumeData}
                                suppressContentEditableWarning
                                onBlur={(e) => handleSectionItemChange(section.id, expIdx, "role", e.currentTarget.textContent || "")}
                              >
                                {exp.role}
                              </p>
                              <p
                                className="text-sm leading-tight"
                                style={{ color: "#4a5568", fontSize: "12px", fontStyle: "italic" }}
                                contentEditable={!!setResumeData}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleSectionItemChange(section.id, expIdx, "company", e.currentTarget.textContent || "")
                                }
                              >
                                {exp.company}
                              </p>
                            </div>
                            <p
                              className="text-xs text-gray-600 ml-4 flex-shrink-0"
                              style={{ color: "#718096", fontSize: "11px" }}
                            >
                              <span
                                contentEditable={!!setResumeData}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleSectionItemChange(section.id, expIdx, "startDate", e.currentTarget.textContent || "")
                                }
                              >
                                {exp.startDate}
                              </span>
                              {" - "}
                              <span
                                contentEditable={!!setResumeData}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleSectionItemChange(section.id, expIdx, "endDate", e.currentTarget.textContent || "")
                                }
                              >
                                {exp.endDate}
                              </span>
                            </p>
                          </div>
                          {exp.location && (
                            <p
                              className="text-xs text-gray-500 mb-2"
                              style={{ color: "#a0aec0", fontSize: "11px" }}
                              contentEditable={!!setResumeData}
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleSectionItemChange(section.id, expIdx, "location", e.currentTarget.textContent || "")
                              }
                            >
                              {exp.location}
                            </p>
                          )}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="space-y-1 mt-2">
                              {exp.achievements.map((achievement, achIdx) => (
                                <div key={achIdx} className="flex items-start">
                                  <span
                                    className="text-sm leading-tight mr-2 flex-shrink-0"
                                    style={{ color: "#4299e1", fontSize: "12px" }}
                                  >
                                    •
                                  </span>
                                  <p
                                    className="text-sm leading-tight"
                                    style={{ color: "#4a5568", fontSize: "12px", lineHeight: "1.5" }}
                                    contentEditable={!!setResumeData}
                                    suppressContentEditableWarning
                                    onBlur={(e) =>
                                      handleAchievementChange(section.id, expIdx, achIdx, e.currentTarget.textContent || "")
                                    }
                                  >
                                    {achievement}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {/* Skills Section */}
                  {(section.type === SECTION_TYPES.SKILLS ||
                    section.type === SECTION_TYPES.LANGUAGES ||
                    section.type === SECTION_TYPES.CERTIFICATIONS) && (
                    <div className="pl-2">
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#4a5568", fontSize: "12px", lineHeight: "1.6" }}
                        contentEditable={!!setResumeData}
                        suppressContentEditableWarning
                        onBlur={(e) => handleSkillsChange(section.id, e.currentTarget.textContent || "")}
                      >
                        {section.items.join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Custom Section */}
                  {section.type === SECTION_TYPES.CUSTOM && (
                    <div className="space-y-2 pl-2">
                      {section.content.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start">
                          <span className="text-sm leading-tight mr-2 flex-shrink-0" style={{ color: "#4299e1", fontSize: "12px" }}>
                            •
                          </span>
                          <p
                            className="text-sm leading-tight"
                            style={{ color: "#4a5568", fontSize: "12px", lineHeight: "1.5" }}
                            contentEditable={!!setResumeData}
                            suppressContentEditableWarning
                            onBlur={(e) => handleCustomContentChange(section.id, itemIdx, e.currentTarget.textContent || "")}
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Projects Section */}
                  {section.type === SECTION_TYPES.PROJECTS && (section as any).items?.length > 0 && (
                    <div className="pl-2">
                      <ProjectSection
                        sectionId={section.id}
                        projects={(section as any).items}
                        textColor={'#2d3748'}
                        linkColor={'#4299e1'}
                        contentEditable={true}
                        onProjectFieldChange={handleProjectFieldChange}
                        onProjectDescriptionChange={handleProjectDescriptionChange}
                        titleClassName={'font-bold text-sm leading-tight'}
                        descriptionClassName={'text-sm leading-tight'}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
