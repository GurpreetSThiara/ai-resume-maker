"use client"

import type React from "react"
import { useRef, useEffect, forwardRef, useState } from "react"
import type { ResumeData, ResumeTemplate } from "@/types/resume"
import { GoogleResume } from "./resumes/google-resume"
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




    return (
      <div ref={ref} className="bg-blue-50 min-h-screen font-serif">

        {ResumeComponent && <ResumeComponent resumeData={resumeData} setResumeData={setResumeData} activeSection={activeSection} />}
        {/* <div className={template.theme.layout.container}>
          <div ref={personalInfoRef} className={template.theme.layout.header}>
            <h1
              className={`${template.theme.fontSize.name} font-bold ${template.theme.colors.text}`}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={handleNameChange}
            >
              {resumeData.name}
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
                {Object.entries(section.content).map(([key, bullets]) => (
                  <div key={key} className={template.theme.spacing.item}>
                    {key && (
                      <div className={template.theme.spacing.content}>
                        <h3
                          className={`${template.theme.fontSize.content} font-medium ${template.theme.colors.text}`}
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) =>
                            handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || "", 0)
                          }
                        >
                          {key.split(" | ")[0]}
                        </h3>
                        <span
                          className={`${template.theme.fontSize.small} ${template.theme.colors.secondary}`}
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) =>
                            handleSectionHeaderChange(section.id, key, e.currentTarget.textContent || "", 1)
                          }
                        >
                          {key.split(" | ")[1]}
                        </span>
                      </div>
                    )}
                    <ul className="list-disc ml-5 space-y-1">
                      {bullets.map((bullet, index) => (
                        <li
                          key={index}
                          className={`${template.theme.fontSize.small} ${template.theme.colors.text}`}
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
        </div> */}
      </div>
    )
  },
)

ResumePreview.displayName = "ResumePreview"

export default ResumePreview
