"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { ResumeData } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import ProjectSection from '../resume-components/project-section'
import { SECTION_TYPES } from '@/types/resume'

interface ResumeProps {
  pdfRef: React.RefObject<HTMLDivElement>
  font: { className: string; name: string }
  theme: any
  resumeData: ResumeData
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
  useBlackVariant?: boolean
}

export const ClassicATSResume: React.FC<ResumeProps> = ({
  pdfRef,
  font = {},
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
      
      if (section.type === "education") {
        (section.items[itemIndex] as any)[field] = value;
      } else if (section.type === "experience") {
        (section.items[itemIndex] as any)[field] = value;
      }
      return updated;
    });
  };

  const handleSkillsChange = (sectionId: string, value: string) => {
    setResumeData((prev) => {
      const updated = structuredClone(prev);
      const section = updated.sections.find((s) => s.id === sectionId);
      if (!section) return prev;
      
      // Split by commas and clean up
      const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
      if ('items' in section) {
        section.items = items;
      }
      return updated;
    });
  };

  const handleCustomContentChange = (sectionId: string, contentIndex: number, value: string) => {
    setResumeData((prev) => {
      const updated = structuredClone(prev);
      const section = updated.sections.find((s) => s.id === sectionId);
      if (!section || section.type !== "custom") return prev;
      
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
      if (!section || section.type !== "education") return prev;
      
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
      if (!section || section.type !== "experience") return prev;
      
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

  return (
    <div className="border w-full h-full flex justify-center items-start overflow-auto bg-gray-50" style={{ minHeight: 0, minWidth: 0 }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
      >
        <div
          ref={pdfRef}
          className={`border border-pink-950 relative ${font.className}`}
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
            fontFamily: font?.name || 'Arial, sans-serif',
          }}
        >
          {/* A4 page container with exact dimensions */}
          <div className={`${useBlackVariant ? 'px-6 py-6' : 'px-8 py-8'} border border-green-900`} style={{  minWidth: 595, maxWidth: '100%' }} >
            
            {/* Header */}
            <header ref={personalInfoRef} className={`${useBlackVariant ? 'mb-4' : 'mb-6'}`}>
              <h1
                className={`${useBlackVariant ? 'text-xl' : 'text-2xl'} font-bold ${useBlackVariant ? 'text-black' : 'text-gray-900'} tracking-tight ${useBlackVariant ? 'mb-2' : 'mb-3'}`}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleNameChange}
              >
                {resumeData?.basics?.name}
              </h1>

              {/* Contact information */}
             <div className={`${useBlackVariant ? 'text-xs' : 'text-sm'} ${useBlackVariant ? 'text-gray-700' : 'text-gray-600'} ${useBlackVariant ? 'mb-3' : 'mb-4'} flex flex-col ${useBlackVariant ? 'space-y-1' : 'space-y-2'}`}>
  {[resumeData.basics.email, resumeData.basics.phone, resumeData.basics.location, resumeData.basics.linkedin]
    .filter(Boolean)
    .map((field, index) => (
      <div key={index} className="flex items-center">
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const textContent = e.currentTarget?.textContent
            if (textContent !== null) {
              const key = index === 0 ? 'email' : 
                        index === 1 ? 'phone' : 
                        index === 2 ? 'location' : 'linkedin'
              handleContactInfoChange(e, key as keyof typeof resumeData.basics)
            }
          }}
        >
          {field}
        </span>
      </div>
    ))}
</div>

              {/* Summary */}
              {resumeData?.basics?.summary && (
                <div className={`${useBlackVariant ? 'mb-3' : 'mb-4'}`}>
                  <p 
                    className={`${useBlackVariant ? 'text-xs' : 'text-sm'} ${useBlackVariant ? 'text-gray-800' : 'text-gray-700'} leading-relaxed`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleSummaryChange}
                  >
                    {resumeData?.basics?.summary}
                  </p>
                </div>
              )}
            </header>

            {/* Main Sections */}
            <main>
              {getSectionsForRendering(resumeData.sections, resumeData.custom).map((section) => {
                // Handle Custom Fields Section first (it doesn't need content check)
                if (section.type === 'custom-fields') {
                  const hasCustomFields = Object.entries(resumeData.custom).filter(([_, item]) => !item.hidden).length > 0
                  if (!hasCustomFields) return null
                  
                  return (
                    <section
                      key={section.id}
                      className="mb-6"
                      ref={(el: HTMLDivElement | null) => {
                        if (el) {
                          customFieldsRef.current = el
                          sectionRefs.current[section.id] = el
                        }
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        {Object.entries(resumeData.custom)
                          .filter(([_, item]) => !item.hidden)
                          .map(([key, item]) => (
                            <div key={key} className="flex items-start gap-2">
                              <span
                                className="font-semibold text-gray-800 uppercase"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleCustomItemChange(key, 'title', e.currentTarget.textContent || '')}
                              >
                                {item.title}:
                              </span>
                              <span
                                className="text-gray-700 flex-1"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleCustomItemChange(key, 'content', e.currentTarget.textContent || '')}
                              >
                                {item.content}
                              </span>
                            </div>
                          ))}
                      </div>
                    </section>
                  )
                }
                
                // Check if section has content based on section type
                let hasContent = false;
                
                if (section.type === 'education' || section.type === 'experience') {
                  hasContent = section.items && section.items.length > 0;
                } else if (section.type === 'skills' || section.type === 'languages' || section.type === 'certifications') {
                  hasContent = section.items && section.items.length > 0;
                } else if (section.type === 'projects') {
                  hasContent = Array.isArray((section as any).items) && (section as any).items.length > 0
                } else if (section.type === 'custom') {
                  hasContent = section.content && section.content.length > 0 && section.content.some(item => item.trim() !== '');
                }
                
                if (!hasContent) return null
                
                return (
                  <section
                    key={section.id}
                    className="mb-6"
                    ref={(el: HTMLDivElement | null) => {
                      if (el) {
                        sectionRefs.current[section.id] = el
                      }
                    }}
                  >
                    {/* Section Title */}
                    <h2
                      className="text-lg font-semibold text-gray-800 pb-1 mb-3 uppercase tracking-wide border-b border-gray-300"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || '')}
                    >
                      {section.title}
                    </h2>

                    {/* Education Section */}
                    {section.type === 'education' && section.items.map((edu, eduIdx) => (
                      <article key={edu.institution} className="mb-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3
                            className="text-base font-semibold text-gray-900"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, eduIdx, 'institution', e.currentTarget.textContent || '')}
                          >
                            {edu.institution}
                          </h3>
                          <span className="text-sm text-gray-600 ml-4">
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
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <p
                            className="text-sm text-gray-700 italic"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, eduIdx, 'degree', e.currentTarget.textContent || '')}
                          >
                            {edu.degree}
                          </p>
                          {edu.location && (
                            <span
                              className="text-sm text-gray-600"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleSectionItemChange(section.id, eduIdx, 'location', e.currentTarget.textContent || '')}
                            >
                              {edu.location}
                            </span>
                          )}
                        </div>
                        
                        {/* Highlights */}
                        {edu.highlights && edu.highlights.length > 0 && (
                          <ul className="list-none space-y-1 text-sm text-gray-700 ml-4">
                            {edu.highlights.map((highlight, highlightIdx) => (
                              <li key={highlightIdx} className="flex items-start">
                                <span className="mr-2 text-gray-500">•</span>
                                <span
                                  className="flex-1"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleHighlightChange(section.id, eduIdx, highlightIdx, e.currentTarget.textContent || '')}
                                >
                                  {highlight}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}

                    {/* Experience Section */}
                    {section.type === 'experience' && section.items.map((exp, expIdx) => (
                      <article key={exp.company} className="mb-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3
                            className="text-base font-semibold text-gray-900"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, expIdx, 'company', e.currentTarget.textContent || '')}
                          >
                            {exp.company}
                          </h3>
                          <span className="text-sm text-gray-600 ml-4">
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
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <p
                            className="text-sm text-gray-700 italic"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, expIdx, 'role', e.currentTarget.textContent || '')}
                          >
                            {exp.role}
                          </p>
                          {exp.location && (
                            <span
                              className="text-sm text-gray-600"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleSectionItemChange(section.id, expIdx, 'location', e.currentTarget.textContent || '')}
                            >
                              {exp.location}
                            </span>
                          )}
                        </div>
                        
                        {/* Achievements */}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="list-none space-y-1 text-sm text-gray-700 ml-4">
                            {exp.achievements.map((achievement, achievementIdx) => (
                              <li key={achievementIdx} className="flex items-start">
                                <span className="mr-2 text-gray-500">•</span>
                                <span
                                  className="flex-1"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleAchievementChange(section.id, expIdx, achievementIdx, e.currentTarget.textContent || '')}
                                >
                                  {achievement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}

                    {/* Skills, Languages, Certifications Sections */}
                    {(section.type === 'skills' || section.type === 'languages' || section.type === 'certifications') && section.items?.length > 0 && (
                      <div className="mb-4">
                        <p
                          className="text-sm text-gray-700 leading-relaxed"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSkillsChange(section.id, e.currentTarget.textContent || '')}
                        >
                          {section.items.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Projects Section */}
                    {section.type === 'projects' && Array.isArray((section as any).items) && (
                      <ProjectSection
                        sectionId={section.id}
                        projects={(section as any).items}
                        textColor={'#111827'}
                        linkColor={'#2563eb'}
                        contentEditable={true}
                        onProjectFieldChange={handleProjectFieldChange}
                        onProjectDescriptionChange={handleProjectDescriptionChange}
                        titleClassName={'text-base font-semibold text-gray-900'}
                        descriptionClassName={'text-sm text-gray-600 '}
                      />
                    )}

                    {/* Custom Section */}
                    {section.type === 'custom' && section.content?.length > 0 && (
                      <ul className="list-none space-y-1 text-sm text-gray-700 ml-4">
                        {section.content.map((item, contentIdx) => (
                          <li key={contentIdx} className="flex items-start">
                            <span className="mr-2 text-gray-500">•</span>
                            <span
                              className="flex-1"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleCustomContentChange(section.id, contentIdx, e.currentTarget.textContent || '')}
                            >
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )
              })}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}