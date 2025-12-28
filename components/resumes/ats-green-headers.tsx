"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { ResumeData } from "@/types/resume"
import ProjectSection from '../resume-components/project-section'
import { SECTION_TYPES } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"




export const ATS_GREEN_HEADERS: any = ({
  resumeData ,
  setResumeData,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

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

  const handleNameChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    if (!setResumeData) return
    const name = e.currentTarget?.textContent ?? ""
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, name } }))
  }

  const handleSummaryChange = (e: React.FormEvent<HTMLParagraphElement>) => {
    if (!setResumeData) return
    const summary = e.currentTarget?.textContent ?? ""
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, summary } }))
  }

  const handleContactInfoChange = (e: React.FormEvent<HTMLSpanElement>, key: keyof typeof resumeData.basics) => {
    if (!setResumeData) return
    const value = e.currentTarget?.textContent ?? ""
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, [key]: value } }))
  }

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    if (!setResumeData) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const idx = updated.sections.findIndex((s) => s.id === sectionId)
      if (idx !== -1) updated.sections[idx].title = newTitle
      return updated
    })
  }

  const handleSectionItemChange = (sectionId: string, itemIndex: number, field: string, value: string) => {
    if (!setResumeData) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section) return prev

      if (section.type === SECTION_TYPES.EDUCATION) {
        ;(section.items[itemIndex] as any)[field] = value
      } else if (section.type === SECTION_TYPES.EXPERIENCE) {
        ;(section.items[itemIndex] as any)[field] = value
      }
      return updated
    })
  }

  const handleSkillsChange = (sectionId: string, value: string) => {
    if (!setResumeData) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section) return prev

      section.items = [value]
      return updated
    })
  }

  const handleHighlightChange = (sectionId: string, itemIndex: number, highlightIndex: number, newText: string) => {
    if (!setResumeData) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.EDUCATION) return prev

      const edu = section.items[itemIndex]
      if (edu.highlights && edu.highlights[highlightIndex] !== undefined) {
        edu.highlights[highlightIndex] = newText
      }
      return updated
    })
  }

  const handleAchievementChange = (sectionId: string, itemIndex: number, achievementIndex: number, newText: string) => {
    if (!setResumeData) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.EXPERIENCE) return prev

      const exp = section.items[itemIndex]
      if (exp.achievements && exp.achievements[achievementIndex] !== undefined) {
        exp.achievements[achievementIndex] = newText
      }
      return updated
    })
  }

  const handleCustomContentChange = (sectionId: string, contentIndex: number, value: string) => {
    if (!setResumeData) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || section.type !== SECTION_TYPES.CUSTOM) return prev

      if (!section.content) section.content = []
      section.content[contentIndex] = value
      return updated
    })
  }

  const handleCustomItemChange = (id: string, field: "title" | "content", value: string) => {
    if (!setResumeData) return
    setResumeData((prev) => {
      const updated = structuredClone(prev)
      if (updated.custom[id]) updated.custom[id][field] = value
      return updated
    })
  }

  const handleProjectFieldChange = (sectionId: string | undefined, projectIndex: number, field: string, value: string) => {
    if (!sectionId || !setResumeData) return
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
    if (!sectionId || !setResumeData) return
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
    <div
      className={`w-full h-full flex justify-center items-start overflow-auto ${className}`}
      style={{ minHeight: 0, minWidth: 0 }}
    >
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start" }}
      >
        <div
          className="relative"
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
                className="text-2xl font-bold leading-tight"
                style={{
                  color: "#000000",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
                contentEditable={!!setResumeData}
                suppressContentEditableWarning
                onBlur={handleNameChange}
              >
                {resumeData.basics.name}
              </h1>
            </div>

            {/* Contact Info */}
            <div className="mb-4">
              <p className="text-sm leading-tight" style={{ color: "#000000", fontSize: "12px", marginBottom: "2px" }}>
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
              </p>
              <p className="text-sm leading-tight" style={{ color: "#000000", fontSize: "12px" }}>
                <span
                  contentEditable={!!setResumeData}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContactInfoChange(e, "location")}
                >
                  {resumeData.basics.location}
                </span>
                {" • "}
                <span
                  contentEditable={!!setResumeData}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContactInfoChange(e, "linkedin")}
                >
                  {resumeData.basics.linkedin}
                </span>
              </p>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "#000000",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  textAlign: "justify",
                }}
                contentEditable={!!setResumeData}
                suppressContentEditableWarning
                onBlur={handleSummaryChange}
              >
                {resumeData.basics.summary}
              </p>
            </div>

            {/* Custom Fields - Now handled by getSectionsForRendering */}

            {getSectionsForRendering(resumeData.sections, resumeData.custom).map((section) => {
              // Handle Custom Fields Section first (it doesn't need content check)
              if (section.type === 'custom-fields') {
                const hasCustomFields = Object.entries(resumeData.custom).filter(([_, item]) => !(item as any).hidden).length > 0
                if (!hasCustomFields) return null
                
                return (
                  <div key={section.id} className="mb-6">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(resumeData.custom)
                        .filter(([_, item]) => !(item as any).hidden)
                        .map(([key, item]) => {
                          const customField = item as any
                          return (
                          <div key={key} className="text-sm" style={{ fontSize: "11px" }}>
                            <span
                              className="font-semibold"
                              style={{ color: "#000000", fontWeight: "600" }}
                              contentEditable={!!setResumeData}
                              suppressContentEditableWarning
                              onBlur={(e) => handleCustomItemChange(key, "title", e.currentTarget.textContent || "")}
                            >
                              {customField.title}:
                            </span>{" "}
                            <span
                              style={{ color: "#333333" }}
                              contentEditable={!!setResumeData}
                              suppressContentEditableWarning
                              onBlur={(e) => handleCustomItemChange(key, "content", e.currentTarget.textContent || "")}
                            >
                              {customField.link ? (
                                <a href={customField.content} target="_blank" rel="noopener noreferrer" style={{ color: "#0066cc", textDecoration: "underline" }}>
                                  {customField.content}
                                </a>
                              ) : (
                                customField.content
                              )}
                            </span>
                          </div>
                        )})}
                    </div>
                  </div>
                )
              }

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
                <div key={section.id} className="mb-6">
                  {/* Section Header with green background */}
                  <div className="mb-3">
                    <h2
                      className="font-bold text-sm leading-none mb-1"
                      style={{
                        color: "#000000",
                        fontSize: "14px",
                        backgroundColor: "#90c695",
                        padding: "4px 8px",
                        fontWeight: "bold",
                      }}
                      contentEditable={!!setResumeData}
                      suppressContentEditableWarning
                      onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
                    >
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* Education Section */}
                    {section.type === SECTION_TYPES.EDUCATION &&
                      section.items.map((edu, eduIdx) => (
                        <div key={eduIdx}>
                          <p
                            className="font-bold text-sm leading-tight mb-1"
                            style={{ color: "#000000", fontSize: "12px", fontWeight: "bold" }}
                            contentEditable={!!setResumeData}
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleSectionItemChange(
                                section.id,
                                eduIdx,
                                "institution",
                                e.currentTarget.textContent || "",
                              )
                            }
                          >
                            {edu.institution}
                          </p>
                          <p
                            className="text-sm leading-tight mb-1"
                            style={{ color: "#000000", fontSize: "12px" }}
                            contentEditable={!!setResumeData}
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleSectionItemChange(section.id, eduIdx, "degree", e.currentTarget.textContent || "")
                            }
                          >
                            {edu.degree}
                          </p>
                          <div className="space-y-1 ml-4">
                            {edu.highlights?.map((highlight, highlightIdx) => (
                              <div key={highlightIdx} className="flex items-start">
                                <span
                                  className="text-sm leading-tight mr-2 flex-shrink-0"
                                  style={{ color: "#000000", fontSize: "12px" }}
                                >
                                  •
                                </span>
                                <p
                                  className="text-sm leading-tight"
                                  style={{ color: "#000000", fontSize: "12px" }}
                                  contentEditable={!!setResumeData}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleHighlightChange(
                                      section.id,
                                      eduIdx,
                                      highlightIdx,
                                      e.currentTarget.textContent || "",
                                    )
                                  }
                                >
                                  {highlight}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                    {/* Experience Section */}
                    {section.type === SECTION_TYPES.EXPERIENCE &&
                      section.items.map((exp, expIdx) => (
                        <div key={expIdx}>
                          <div className="flex justify-between items-start mb-1">
                            <p
                              className="font-bold text-sm leading-tight"
                              style={{ color: "#000000", fontSize: "12px", fontWeight: "bold" }}
                              contentEditable={!!setResumeData}
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleSectionItemChange(
                                  section.id,
                                  expIdx,
                                  "company",
                                  e.currentTarget.textContent || "",
                                )
                              }
                            >
                              {exp.company}
                            </p>
                            <p className="text-sm leading-tight" style={{ color: "#000000", fontSize: "12px" }}>
                              <span
                                contentEditable={!!setResumeData}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleSectionItemChange(
                                    section.id,
                                    expIdx,
                                    "startDate",
                                    e.currentTarget.textContent || "",
                                  )
                                }
                              >
                                {exp.startDate}
                              </span>
                              {" - "}
                              <span
                                contentEditable={!!setResumeData}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleSectionItemChange(
                                    section.id,
                                    expIdx,
                                    "endDate",
                                    e.currentTarget.textContent || "",
                                  )
                                }
                              >
                                {exp.endDate}
                              </span>
                            </p>
                          </div>
                          <p
                            className="text-sm leading-tight mb-2"
                            style={{ color: "#000000", fontSize: "12px" }}
                            contentEditable={!!setResumeData}
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleSectionItemChange(section.id, expIdx, "role", e.currentTarget.textContent || "")
                            }
                          >
                            {exp.role}
                          </p>
                          <div className="space-y-1 ml-4">
                            {exp.achievements?.map((achievement, achievementIdx) => (
                              <div key={achievementIdx} className="flex items-start">
                                <span
                                  className="text-sm leading-tight mr-2 flex-shrink-0"
                                  style={{ color: "#000000", fontSize: "12px" }}
                                >
                                  •
                                </span>
                                <p
                                  className="text-sm leading-tight"
                                  style={{ color: "#000000", fontSize: "12px" }}
                                  contentEditable={!!setResumeData}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleAchievementChange(
                                      section.id,
                                      expIdx,
                                      achievementIdx,
                                      e.currentTarget.textContent || "",
                                    )
                                  }
                                >
                                  {achievement}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                    {/* Skills, Languages Sections */}
                    {(section.type === SECTION_TYPES.SKILLS || section.type === SECTION_TYPES.LANGUAGES) && section.items?.length > 0 && (
                      <div className="mb-3">
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "#000000", fontSize: "12px" }}
                          contentEditable={!!setResumeData}
                          suppressContentEditableWarning
                          onBlur={(e) => handleSkillsChange(section.id, e.currentTarget.textContent || "")}
                        >
                          {section.items.join("")}
                        </p>
                      </div>
                    )}

                    {/* Certifications Section */}
                    {section.type === SECTION_TYPES.CERTIFICATIONS && section.items?.length > 0 && (
                      <div className="space-y-1 ml-4">
                        {section.items.map((cert, certIdx) => (
                          <div key={certIdx} className="flex items-start">
                            <span
                              className="text-sm leading-tight mr-2 flex-shrink-0"
                              style={{ color: "#000000", fontSize: "12px" }}
                            >
                              •
                            </span>
                            <p
                              className="text-sm leading-tight"
                              style={{ color: "#000000", fontSize: "12px" }}
                              contentEditable={!!setResumeData}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                if (!setResumeData) return
                                setResumeData((prev) => {
                                  const updated = structuredClone(prev)
                                  const sec = updated.sections.find((s) => s.id === section.id)
                                  if (sec && sec.type === SECTION_TYPES.CERTIFICATIONS) {
                                    sec.items[certIdx] = e.currentTarget.textContent || ""
                                  }
                                  return updated
                                })
                              }}
                            >
                              {cert}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects Section */}
                    {section.type === SECTION_TYPES.PROJECTS && (section as any).items?.length > 0 && (
                      <ProjectSection
                        sectionId={section.id}
                        projects={(section as any).items}
                        textColor={'#000000'}
                        linkColor={'#000000'}
                        contentEditable={true}
                        onProjectFieldChange={handleProjectFieldChange}
                        onProjectDescriptionChange={handleProjectDescriptionChange}
                        titleClassName={'font-bold text-sm leading-tight mb-1'}
                        descriptionClassName={'text-sm leading-tight'}
                      />
                    )}

                    {/* Custom Section */}
                    {section.type === SECTION_TYPES.CUSTOM && section.content?.length > 0 && (
                      <div className="space-y-1 ml-4">
                        {section.content.map((item, contentIdx) => (
                          <div key={contentIdx} className="flex items-start">
                            <span
                              className="text-sm leading-tight mr-2 flex-shrink-0"
                              style={{ color: "#000000", fontSize: "12px" }}
                            >
                              •
                            </span>
                            <p
                              className="text-sm leading-tight"
                              style={{ color: "#000000", fontSize: "12px" }}
                              contentEditable={!!setResumeData}
                              suppressContentEditableWarning
                              onBlur={(e) => handleCustomContentChange(section.id, contentIdx, e.currentTarget.textContent || "")}
                            >
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
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
