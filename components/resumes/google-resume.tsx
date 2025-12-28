"use client"

import { ResumeData, SECTION_TYPES } from "@/types/resume"
import type React from "react"
import { useRef, useEffect, useState } from "react"
import { sortSectionsByOrder, getSectionsForRendering } from "@/utils/sectionOrdering"
import ProjectSection from "../resume-components/project-section"


interface ResumeProps {
  pdfRef: React.RefObject<HTMLDivElement>
  font: { className: string; name: string }
  theme: any
  resumeData: ResumeData
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
  useBlackVariant?: boolean
}

export const GoogleResume: React.FC<ResumeProps> = ({
  pdfRef,
  font,
  theme,
  resumeData,
  setResumeData,
  activeSection,
  useBlackVariant = false,
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
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, name } }));
  };

  const handleSummaryChange = (e: React.FormEvent<HTMLParagraphElement>) => {
    const summary = e.currentTarget?.textContent ?? "";
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, summary } }));
  };

  const handleContactInfoChange = (e: React.FormEvent<HTMLSpanElement>, key: keyof typeof resumeData.basics) => {
    const value = e.currentTarget?.textContent ?? "";
    setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, [key]: value } }));
  };

  const handleSectionItemChange = (
    sectionId: string,
    itemIndex: number,
    field: string,
    value: string
  ) => {
    setResumeData((prev) => {
      const updated = structuredClone(prev);
      const section = updated.sections.find((s) => s.id === sectionId);
      if (!section) return prev;
      
      if (section.type === SECTION_TYPES.EDUCATION) {
        (section.items[itemIndex] as any)[field] = value;
      } else if (section.type === SECTION_TYPES.EXPERIENCE) {
        (section.items[itemIndex] as any)[field] = value;
      }
      return updated;
    });
  };

  const handleSkillsChange = (sectionId: string, value: string) => {
    setResumeData((prev) => {
      const updated = structuredClone(prev);
      const section = updated.sections.find((s) => s.id === sectionId);
      if (!section || !('items' in section)) return prev;
      
      // Split by bullet separator and clean up
      const items = value.split('•').map(item => item.trim()).filter(item => item.length > 0);
      ;(section as any).items = items;
      return updated;
    });
  };

  const handleCustomContentChange = (sectionId: string, contentIndex: number, value: string) => {
    setResumeData((prev) => {
      const updated = structuredClone(prev);
      const section = updated.sections.find((s) => s.id === sectionId);
      if (!section || section.type !== SECTION_TYPES.CUSTOM) return prev;
      
      if (!section.content) section.content = [];
      section.content[contentIndex] = value;
      return updated;
    });
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

  const handleHighlightChange = (sectionId: string, itemIndex: number, highlightIndex: number, newText: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev);
      const section = updated.sections.find((s) => s.id === sectionId);
      if (!section || section.type !== SECTION_TYPES.EDUCATION) return prev;
      
      const edu = section.items[itemIndex];
      if (edu.highlights && edu.highlights[highlightIndex] !== undefined) {
        edu.highlights[highlightIndex] = newText;
      }
      return updated;
    });

  const handleAchievementChange = (sectionId: string, itemIndex: number, achievementIndex: number, newText: string) =>
    setResumeData((prev) => {
      const updated = structuredClone(prev);
      const section = updated.sections.find((s) => s.id === sectionId);
      if (!section || section.type !== SECTION_TYPES.EXPERIENCE) return prev;
      
      const exp = section.items[itemIndex];
      if (exp.achievements && exp.achievements[achievementIndex] !== undefined) {
        exp.achievements[achievementIndex] = newText;
      }
      return updated;
    });

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

  // Colors tuned to match the ATS Compact Lines PDF variant
  // Always use black titles and light black dividers so ATS Compact preview
  // (which reuses this component) matches the downloaded PDF.
  const accentColor = useBlackVariant
    ? 'rgb(0, 0, 0)'                // black titles for ATS Compact Lines
    : 'rgb(38, 102, 166)'            // blue for Google
  const textColor = 'rgb(26, 26, 26)'
  const secondaryColor = 'rgb(102, 102, 102)'
  const linkColor = useBlackVariant
    ? 'rgb(0, 0, 0)'                // black links for ATS Compact Lines
    : 'rgb(0, 0, 255)'                // blue links for Google
  const sectionLineColor = useBlackVariant
    ? 'rgba(0, 0, 0, 0.25)'          // light black line for ATS Compact Lines
    : 'rgb(38, 102, 166)'            // blue line for Google

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
            minWidth: 595,
            // minHeight: 842,
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
          <div className="px-12 py-12" style={{ minWidth: 595, maxWidth: '100%' }}>
            {/* Header - Name */}
            <div className="mb-5" ref={personalInfoRef}>
              <h1
                className="text-xl font-bold leading-none"
                style={{ color: accentColor, fontSize: '20px' }}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleNameChange}
              >
                {resumeData?.basics?.name}
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
                  {resumeData?.basics?.email}
                </span>
                {' | '}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContactInfoChange(e, 'phone')}
                >
                  {resumeData.basics.phone}
                </span>
                {' | '}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContactInfoChange(e, 'location')}
                >
                  {resumeData.basics.location}
                </span>
                {resumeData.basics.linkedin && (
                  <>
                    {' | '}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContactInfoChange(e, 'linkedin')}
                      style={{ color: linkColor }}
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
                  className="text-xs leading-relaxed" 
                  style={{ color: textColor, fontSize: '10px' }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleSummaryChange}
                >
                  {resumeData.basics.summary}
                </p>
              </div>
            )}
            
            {/* Custom Details - Now handled by getSectionsForRendering */}
            
            {/* Sections */}
            {getSectionsForRendering(resumeData.sections, resumeData.custom).map((section) => {
              // Handle Custom Fields Section first (it doesn't need content check)
              if (section.type === 'custom-fields') {
                const hasCustomFields = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden).length > 0
                if (!hasCustomFields) return null
                
                return (
                  <div key={section.id} className="mb-8" ref={customFieldsRef}>
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
                )
              }

              if (section.hidden) return null
              // Check if section has content based on section type
              let hasContent = false
              if ('items' in section && Array.isArray((section as any).items)) {
                if (section.type === SECTION_TYPES.EDUCATION || section.type === SECTION_TYPES.EXPERIENCE || section.type === SECTION_TYPES.PROJECTS) {
                  hasContent = (section as any).items.length > 0
                } else if (section.type === SECTION_TYPES.SKILLS || section.type === SECTION_TYPES.LANGUAGES || section.type === SECTION_TYPES.CERTIFICATIONS) {
                  hasContent = (section as any).items.filter((s: string) => s && s.trim()).length > 0
                }
              } else if ('content' in section && Array.isArray((section as any).content)) {
                hasContent = (section as any).content.some((item: string) => item && item.trim() !== '')
              }
              
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
                    <div className="h-px w-full" style={{ backgroundColor: sectionLineColor }} />
                  </div>
                  
                  {/* Section Content */}
                  <div className="space-y-4">
                    {/* Education Section */}
                    {section.type === SECTION_TYPES.EDUCATION && section.items.map((edu, eduIdx) => (
                      <div key={edu.institution} className="mb-4">
                        {/* Institution Name */}
                        <h3
                          className="font-bold text-xs leading-tight mb-1"
                          style={{ color: textColor, fontSize: '12px' }}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSectionItemChange(section.id, eduIdx, 'institution', e.currentTarget.textContent || '')}
                        >
                          {edu.institution}
                        </h3>
                        {/* Degree */}
                        <p
                          className="text-xs leading-tight mb-1"
                          style={{ color: textColor, fontSize: '10px' }}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSectionItemChange(section.id, eduIdx, 'degree', e.currentTarget.textContent || '')}
                        >
                          {edu.degree}
                        </p>
                        {/* Dates and Location */}
                        <p className="text-xs leading-tight mb-2" style={{ color: secondaryColor, fontSize: '10px' }}>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, eduIdx, 'startDate', e.currentTarget.textContent || '')}
                          >
                            {edu.startDate}
                          </span>
                          {' - '}
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, eduIdx, 'endDate', e.currentTarget.textContent || '')}
                          >
                            {edu.endDate}
                          </span>
                          {edu.location && (
                            <>
                              {' • '}
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleSectionItemChange(section.id, eduIdx, 'location', e.currentTarget.textContent || '')}
                              >
                                {edu.location}
                              </span>
                            </>
                          )}
                        </p>
                        {/* Highlights */}
                        <div className="space-y-1">
                          {edu.highlights?.map((highlight, highlightIdx) => (
                            <div key={highlightIdx} className="flex items-start">
                              <span
                                className="text-xs leading-tight mr-2 ml-4"
                                style={{ color: textColor, fontSize: '10px' }}
                              >
                                •
                              </span>
                              <p
                                className="text-xs leading-tight"
                                style={{ color: textColor, fontSize: '10px' }}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleHighlightChange(section.id, eduIdx, highlightIdx, e.currentTarget.textContent || '')}
                              >
                                {highlight}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Experience Section */}
                    {section.type === SECTION_TYPES.EXPERIENCE && section.items.map((exp, expIdx) => (
                      <div key={exp.company} className="mb-4">
                        {/* Company Name */}
                        <h3
                          className="font-bold text-xs leading-tight mb-1"
                          style={{ color: textColor, fontSize: '12px' }}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSectionItemChange(section.id, expIdx, 'company', e.currentTarget.textContent || '')}
                        >
                          {exp.company}
                        </h3>
                        {/* Role */}
                        <p
                          className="text-xs leading-tight mb-1"
                          style={{ color: textColor, fontSize: '10px' }}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSectionItemChange(section.id, expIdx, 'role', e.currentTarget.textContent || '')}
                        >
                          {exp.role}
                        </p>
                        {/* Dates and Location */}
                        <p className="text-xs leading-tight mb-2" style={{ color: secondaryColor, fontSize: '10px' }}>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, expIdx, 'startDate', e.currentTarget.textContent || '')}
                          >
                            {exp.startDate}
                          </span>
                          {' - '}
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, expIdx, 'endDate', e.currentTarget.textContent || '')}
                          >
                            {exp.endDate}
                          </span>
                          {exp.location && (
                            <>
                              {' • '}
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleSectionItemChange(section.id, expIdx, 'location', e.currentTarget.textContent || '')}
                              >
                                {exp.location}
                              </span>
                            </>
                          )}
                        </p>
                        {/* Achievements */}
                        <div className="space-y-1">
                          {exp.achievements?.map((achievement, achievementIdx) => (
                            <div key={achievementIdx} className="flex items-start">
                              <span
                                className="text-xs leading-tight mr-2 ml-4"
                                style={{ color: textColor, fontSize: '10px' }}
                              >
                                •
                              </span>
                              <p
                                className="text-xs leading-tight"
                                style={{ color: textColor, fontSize: '10px' }}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleAchievementChange(section.id, expIdx, achievementIdx, e.currentTarget.textContent || '')}
                              >
                                {achievement}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Skills, Languages, Certifications Sections */}
                    {(section.type === SECTION_TYPES.SKILLS || section.type === SECTION_TYPES.LANGUAGES || section.type === SECTION_TYPES.CERTIFICATIONS) && section.items?.length > 0 && (
                      <div className="mb-4">
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: textColor, fontSize: '10px' }}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSkillsChange(section.id, e.currentTarget.textContent || '')}
                        >
                          {section.items.join(' • ')}
                        </p>
                      </div>
                    )}

                    {/* Projects Section */}
                    {section.type === SECTION_TYPES.PROJECTS && Array.isArray((section as any).items) && (
                      <ProjectSection
                        sectionId={section.id}
                        projects={(section as any).items}
                        textColor={textColor}
                        linkColor={linkColor}
                        contentEditable={true}
                        onProjectFieldChange={handleProjectFieldChange}
                        onProjectDescriptionChange={handleProjectDescriptionChange}
                        titleClassName={'font-bold text-[13px]'}
                        descriptionClassName={'text-[10px]'}
                      />
                    )}

                    {/* Custom Section */}
                    {section.type === SECTION_TYPES.CUSTOM && section.content?.length > 0 && (
                      <div className="space-y-1">
                        {section.content.map((item, contentIdx) => (
                          <div key={contentIdx} className="flex items-start">
                            <span
                              className="text-xs leading-tight mr-2 shrink-0"
                              style={{ color: textColor, fontSize: '10px' }}
                            >
                              •
                            </span>
                            <p
                              className="text-xs leading-tight"
                              style={{ color: textColor, fontSize: '10px' }}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleCustomContentChange(section.id, contentIdx, e.currentTarget.textContent || '')}
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