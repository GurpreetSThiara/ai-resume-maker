"use client"

import type React from "react"
import { useRef, useEffect, forwardRef, useState } from "react"
import type { ResumeData, ResumeTemplate, Section } from "@/types/resume"
import { getResumePreview } from "./resumes"

interface ResumePreviewProps {
  resumeData: ResumeData
  template: ResumeTemplate
  onDataUpdate: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
  setResumeData: any
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, template, onDataUpdate, activeSection, setResumeData }, ref) => {
    // Refs for each section to scroll to
    const personalInfoRef = useRef<HTMLDivElement>(null)
    const customFieldsRef = useRef<HTMLDivElement>(null)
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const [ResumeComponent, setResumeComponent] = useState<React.ComponentType<any> | null>(null);

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
      if (elementToScroll && ref && typeof ref !== "function") {
        const container = (ref as { current: HTMLDivElement | null }).current
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        const elementRect = elementToScroll.getBoundingClientRect()
        const scrollTop = elementRect.top - containerRect.top + container.scrollTop - 20

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        })
      }
    }, [activeSection, ref])

    useEffect(() => {
      let isMounted = true;

      getResumePreview({ template: template }).then((comp) => {
        if (isMounted) setResumeComponent(() => comp);
      });

      return () => {
        isMounted = false;
      };
    }, [template.id]);

    const handleNameChange = (e: React.FocusEvent<HTMLHeadingElement>) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        basics: {
          ...prev.basics,
          name: e.currentTarget.textContent || ""
        }
      }))
    }

    const handleContactInfoChange = (e: React.FocusEvent<HTMLSpanElement>, field: keyof ResumeData['basics']) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        basics: {
          ...prev.basics,
          [field]: e.currentTarget.textContent || ""
        }
      }))
    }

    const handleCustomItemChange = (id: string, field: 'title' | 'content', value: string) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        custom: {
          ...prev.custom,
          [id]: {
            ...prev.custom[id],
            [field]: value
          }
        }
      }))
    }

    const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        sections: prev.sections.map(section => 
          section.id === sectionId ? { ...section, title: newTitle } : section
        )
      }))
    }

    return (
      <div ref={ref} className="bg-blue-50 min-h-screen font-serif">
        {ResumeComponent && <ResumeComponent resumeData={resumeData} setResumeData={setResumeData} activeSection={activeSection} />}
        <div className={template.theme.layout.container}>
          <div ref={personalInfoRef} className={template.theme.layout.header}>
            <h1
              className={`${template.theme.fontSize.name} font-bold ${template.theme.colors.text}`}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={handleNameChange}
            >
              {resumeData.basics.name}
            </h1>
          </div>
          <div className={template.theme.layout.content}>
            <div
              className={`${template.theme.fontSize.small} ${template.theme.colors.secondary} flex flex-wrap gap-4 mb-6`}
            >
              <span
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleContactInfoChange(e, "email")}
              >
                {resumeData.basics.email}
              </span>
              <span
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleContactInfoChange(e, "phone")}
              >
                {resumeData.basics.phone}
              </span>
              <span
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleContactInfoChange(e, "location")}
              >
                {resumeData.basics.location}
              </span>
              <span>
                <a href={resumeData.basics.linkedin}>
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
              {Object.entries(resumeData.custom).map(([id, item]) => (
                <div
                  className={`flex gap-2 text-xs justify-between ${item.hidden ? "hidden" : ""}`}
                  key={id}
                >
                  <span
                    className="font-semibold"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleCustomItemChange(id, "title", e.currentTarget.textContent || "")}
                  >
                    {item.title}:
                  </span>
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleCustomItemChange(id, "content", e.currentTarget.textContent || "")}
                  >
                    {item.content}
                  </span>
                </div>
              ))}
            </div>

            {resumeData.sections.map((section) => (
              <section
                key={section.id}
                className={template.theme.spacing.section}
                ref={(el) => {
                  sectionRefs.current[section.id] = el
                }}
              >
                <h2
                  className={`${template.theme.fontSize.section} font-medium ${template.theme.colors.primary} mb-4 pb-2 border-b border-gray-200`}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
                >
                  {section.title}
                </h2>
                {section.type === "education" && (
                  <div>
                    {section.items.map((edu, index) => (
                      <div key={index} className={template.theme.spacing.item}>
                        <div className={template.theme.spacing.content}>
                          <h3 className={`${template.theme.fontSize.content} font-medium ${template.theme.colors.text}`}>
                            {edu.institution}
                          </h3>
                          <span className={`${template.theme.fontSize.small} ${template.theme.colors.secondary}`}>
                            {edu.degree}
                          </span>
                          <div className={`${template.theme.fontSize.small} ${template.theme.colors.secondary}`}>
                            {edu.startDate} - {edu.endDate}
                          </div>
                        </div>
                        {edu.highlights && (
                          <ul className="list-disc ml-5 space-y-1">
                            {edu.highlights.map((highlight, i) => (
                              <li
                                key={i}
                                className={`${template.theme.fontSize.small} ${template.theme.colors.text}`}
                              >
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {section.type === "experience" && (
                  <div>
                    {section.items.map((exp, index) => (
                      <div key={index} className={template.theme.spacing.item}>
                        <div className={template.theme.spacing.content}>
                          <h3 className={`${template.theme.fontSize.content} font-medium ${template.theme.colors.text}`}>
                            {exp.company}
                          </h3>
                          <span className={`${template.theme.fontSize.small} ${template.theme.colors.secondary}`}>
                            {exp.role}
                          </span>
                          <div className={`${template.theme.fontSize.small} ${template.theme.colors.secondary}`}>
                            {exp.startDate} - {exp.endDate}
                          </div>
                        </div>
                        {exp.achievements && (
                          <ul className="list-disc ml-5 space-y-1">
                            {exp.achievements.map((achievement, i) => (
                              <li
                                key={i}
                                className={`${template.theme.fontSize.small} ${template.theme.colors.text}`}
                              >
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {(section.type === "skills" || section.type === "languages" || section.type === "certifications") && (
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item, index) => (
                      <span
                        key={index}
                        className={`${template.theme.fontSize.small} ${template.theme.colors.text} bg-gray-100 px-2 py-1 rounded`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                {section.type === "custom" && (
                  <div className={template.theme.spacing.content}>
                    {section.content.map((item, index) => (
                      <p
                        key={index}
                        className={`${template.theme.fontSize.small} ${template.theme.colors.text} mb-2`}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    )
  },
)

ResumePreview.displayName = "ResumePreview"

export default ResumePreview
