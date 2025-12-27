"use client"

import { ResumeData, SECTION_TYPES } from "@/types/resume"
import type React from "react"
import { useRef, useEffect, useState } from "react"
import { sortSectionsByOrder } from "@/utils/sectionOrdering"
import ProjectSection from "../resume-components/project-section"


interface ResumeProps {
  pdfRef: React.RefObject<HTMLDivElement>
  font: { className: string; name: string }
  theme: any
  resumeData: ResumeData
  setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
}

export const ATSCompactLinesResume: React.FC<ResumeProps> = ({
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
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handlePersonalInfoChange = (field: keyof ResumeData['basics'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      basics: {
        ...prev.basics,
        [field]: value
      }
    }))
  }

  const handleCustomFieldChange = (fieldId: string, field: 'title' | 'content' | 'link' | 'hidden', value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      custom: {
        ...prev.custom,
        [fieldId]: {
          ...prev.custom?.[fieldId],
          [field]: value
        }
      }
    }))
  }

  const handleSectionChange = (sectionId: string, field: string, value: any) => {
    setResumeData(prev => {
      const updated = { ...prev }
      const section = updated.sections.find((s) => s.id === sectionId)
      if (section) {
        (section as any)[field] = value
      }
      return updated
    })
  }

  const handleSkillsChange = (sectionId: string, value: string) => {
    setResumeData(prev => {
      const updated = { ...prev }
      const section = updated.sections.find((s) => s.id === sectionId)
      if (!section || !('items' in section)) return prev;

      // Split by bullet separator and clean up
      const items = value.split('•').map(item => item.trim()).filter(item => item.length > 0);
      (section as any).items = items;
      return updated
    })
  }

  const handleItemChange = (sectionId: string, itemId: string, field: string, value: any) => {
    setResumeData(prev => {
      const updated = { ...prev }
      const section = updated.sections.find((s) => s.id === sectionId)
      if (section && 'items' in section) {
        const item = (section as any).items.find((i: any) => i.id === itemId)
        if (item) {
          item[field] = value
        }
      }
      return updated
    })
  }

  const handleAddItem = (sectionId: string) => {
    setResumeData(prev => {
      const updated = { ...prev }
      const section = updated.sections.find((s) => s.id === sectionId)
      if (section && 'items' in section) {
        const newItem = {
          id: Date.now().toString(),
          ...(section.type === SECTION_TYPES.EDUCATION
            ? { institution: '', degree: '', startDate: '', endDate: '', location: '', highlights: [] }
            : section.type === SECTION_TYPES.EXPERIENCE
            ? { company: '', role: '', startDate: '', endDate: '', location: '', achievements: [] }
            : section.type === SECTION_TYPES.PROJECTS
            ? { name: '', link: '', repo: '', description: [] }
            : {})
        }
        ;(section as any).items.push(newItem)
      }
      return updated
    })
  }

  const handleRemoveItem = (sectionId: string, itemId: string) => {
    setResumeData(prev => {
      const updated = { ...prev }
      const section = updated.sections.find((s) => s.id === sectionId)
      if (section && 'items' in section) {
        ;(section as any).items = (section as any).items.filter((i: any) => i.id !== itemId)
      }
      return updated
    })
  }

  const handleAddHighlight = (sectionId: string, itemId: string) => {
    setResumeData(prev => {
      const updated = { ...prev }
      const section = updated.sections.find((s) => s.id === sectionId)
      if (section && 'items' in section) {
        const item = (section as any).items.find((i: any) => i.id === itemId)
        if (item) {
          if (!item.highlights) item.highlights = []
          if (!item.achievements) item.achievements = []
          const array = item.highlights || item.achievements
          array.push('')
        }
      }
      return updated
    })
  }

  const handleHighlightChange = (sectionId: string, itemId: string, index: number, value: string) => {
    setResumeData(prev => {
      const updated = { ...prev }
      const section = updated.sections.find((s) => s.id === sectionId)
      if (section && 'items' in section) {
        const item = (section as any).items.find((i: any) => i.id === itemId)
        if (item) {
          const array = item.highlights || item.achievements
          if (array) array[index] = value
        }
      }
      return updated
    })
  }

  const handleRemoveHighlight = (sectionId: string, itemId: string, index: number) => {
    setResumeData(prev => {
      const updated = { ...prev }
      const section = updated.sections.find((s) => s.id === sectionId)
      if (section && 'items' in section) {
        const item = (section as any).items.find((i: any) => i.id === itemId)
        if (item) {
          const array = item.highlights || item.achievements
          if (array) array.splice(index, 1)
        }
      }
      return updated
    })
  }

  const sortedSections = sortSectionsByOrder(resumeData.sections)

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div
        ref={containerRef}
        className="bg-white shadow-lg"
        style={{
          width: `${595 * scale}px`,
          height: `${842 * scale}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div
          ref={pdfRef}
          className="w-full h-full bg-white text-black"
          style={{ width: '595px', height: '842px' }}
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* Header Section */}
            <div
              ref={personalInfoRef}
              className={`text-center mb-6 ${activeSection === 'personal' ? 'ring-2 ring-blue-500' : ''}`}
            >
              <input
                type="text"
                value={resumeData.basics.name || ''}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                className="text-2xl font-bold bg-transparent border-none text-center w-full outline-none"
                placeholder="Your Name"
              />
              <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
                <input
                  type="email"
                  value={resumeData.basics.email || ''}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="bg-transparent border-none outline-none"
                  placeholder="email@example.com"
                />
                <input
                  type="tel"
                  value={resumeData.basics.phone || ''}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="bg-transparent border-none outline-none"
                  placeholder="+1 (555) 123-4567"
                />
                <input
                  type="text"
                  value={resumeData.basics.location || ''}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                  className="bg-transparent border-none outline-none"
                  placeholder="City, State"
                />
                <input
                  type="url"
                  value={resumeData.basics.linkedin || ''}
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                  className="bg-transparent border-none outline-none"
                  placeholder="linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            {/* Summary */}
            {resumeData.basics.summary && (
              <div className="mb-6">
                <p className="text-sm leading-relaxed">{resumeData.basics.summary}</p>
              </div>
            )}

            {/* Custom Fields - compact two-column layout to mirror PDF */}
            {resumeData.custom && Object.entries(resumeData.custom).filter(([_, item]) => !item?.hidden).length > 0 && (
              <div
                ref={customFieldsRef}
                className={`mb-5 ${activeSection === 'custom' ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-800">
                  {Object.entries(resumeData.custom)
                    .filter(([_, item]) => !item?.hidden)
                    .map(([fieldId, item]) => (
                      <div key={fieldId} className="flex flex-row">
                        <span className="font-semibold mr-1 whitespace-nowrap">{item.title}:</span>
                        <span className="truncate">
                          {item.link ? (
                            <a href={String(item.link)} className="text-blue-600 underline break-all">
                              {item.content}
                            </a>
                          ) : (
                            <span className="break-all">{item.content}</span>
                          )}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Sections */}
            {sortedSections.map((section) => {
              if ((section as any).hidden) return null

              let hasContent = false
              if ('items' in section && Array.isArray((section as any).items)) {
                if ([SECTION_TYPES.EDUCATION, SECTION_TYPES.EXPERIENCE, SECTION_TYPES.PROJECTS].includes(section.type as any)) {
                  hasContent = (section as any).items.length > 0
                } else if ([SECTION_TYPES.SKILLS, SECTION_TYPES.LANGUAGES, SECTION_TYPES.CERTIFICATIONS].includes(section.type as any)) {
                  hasContent = (section as any).items.filter((s: string) => s && s.trim()).length > 0
                }
              } else if ('content' in section && Array.isArray((section as any).content)) {
                hasContent = (section as any).content.some((t: string) => t && t.trim() !== '')
              }
              if (!hasContent) return null

              return (
                <div
                  key={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el }}
                  className={`mb-6 ${activeSection === section.id ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">
                    {section.title}
                  </h2>

                  {section.type === SECTION_TYPES.EDUCATION && (
                    <div className="space-y-4">
                      {(section as any).items.map((edu: any) => (
                        <div key={edu.id} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-bold">{edu.institution}</div>
                              <div>{edu.degree}</div>
                              <div className="text-sm text-gray-600">
                                {edu.startDate} - {edu.endDate}
                                {edu.location && ` • ${edu.location}`}
                              </div>
                            </div>
                          </div>
                          {edu.highlights?.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {edu.highlights.map((highlight: string, idx: number) => (
                                <li key={idx} className="text-sm flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === SECTION_TYPES.EXPERIENCE && (
                    <div className="space-y-4">
                      {(section as any).items.map((exp: any) => (
                        <div key={exp.id} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-bold">{exp.company}</div>
                              <div>{exp.role}</div>
                              <div className="text-sm text-gray-600">
                                {exp.startDate} - {exp.endDate}
                                {exp.location && ` • ${exp.location}`}
                              </div>
                            </div>
                          </div>
                          {exp.achievements?.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {exp.achievements.map((achievement: string, idx: number) => (
                                <li key={idx} className="text-sm flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === SECTION_TYPES.PROJECTS && (
                    <div className="space-y-4">
                      {(section as any).items.map((proj: any) => (
                        <div key={proj.id} className="mb-4">
                          <div className="font-bold">{proj.name}</div>
                          {(proj.link || proj.repo) && (
                            <div className="text-sm text-blue-600">
                              {proj.link && (
                                <a href={proj.link} className="underline mr-4">
                                  Link
                                </a>
                              )}
                              {proj.repo && (
                                <a href={proj.repo} className="underline">
                                  GitHub
                                </a>
                              )}
                            </div>
                          )}
                          {Array.isArray(proj.description) && proj.description.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {proj.description.map((desc: string, idx: number) => (
                                <li key={idx} className="text-sm flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{desc}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {(section.type === SECTION_TYPES.SKILLS ||
                    section.type === SECTION_TYPES.LANGUAGES ||
                    section.type === SECTION_TYPES.CERTIFICATIONS) && (
                    <div className="text-sm">
                      {(section as any).items.filter((item: string) => item && item.trim()).join(' • ')}
                    </div>
                  )}

                  {section.type === SECTION_TYPES.CUSTOM && (
                    <div className="space-y-2">
                      {(section as any).content?.map((text: string, idx: number) => (
                        <div key={idx} className="text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
