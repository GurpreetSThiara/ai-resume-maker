"use client"

import { ResumeData, SECTION_TYPES } from "@/types/resume"
import type React from "react"
import { useRef, useEffect, useState } from "react"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import ProjectSection from "../resume-components/project-section"
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"

interface ResumeProps {
    pdfRef: React.RefObject<HTMLDivElement>
    font: { className: string; name: string }
    resumeData: ResumeData
    setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
    activeSection: string
}

export const BoldProfessionalResume: React.FC<ResumeProps> = ({
    pdfRef,
    font,
    resumeData,
    setResumeData,
    activeSection,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    // Responsive scaling
    useEffect(() => {
        function updateScale() {
            if (!containerRef.current) return
            const parent = containerRef.current.parentElement
            if (!parent) return
            const parentWidth = parent.clientWidth
            const parentHeight = parent.clientHeight
            const widthScale = parentWidth / 595
            const heightScale = parentHeight / 842
            let newScale = Math.min(widthScale, heightScale, 1)
            if (window.innerWidth >= 768 && newScale > 0.9) newScale = 0.9
            setScale(newScale)
        }
        updateScale()
        window.addEventListener("resize", updateScale)
        return () => window.removeEventListener("resize", updateScale)
    }, [])

    // HANDLERS (Copied and adapted from GoogleResume for consistency)

    const handleNameChange = (e: React.FormEvent<HTMLHeadingElement>) => {
        setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, name: e.currentTarget?.textContent || "" } }))
    }

    const handleSummaryChange = (e: React.FormEvent<HTMLParagraphElement>) => {
        setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, summary: e.currentTarget?.textContent || "" } }))
    }

    const handleContactInfoChange = (e: React.FormEvent<HTMLSpanElement>, key: keyof typeof resumeData.basics) => {
        setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, [key]: e.currentTarget?.textContent || "" } }))
    }

    const handleSectionTitleChange = (sectionId: string, newTitle: string) =>
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            const idx = updated.sections.findIndex((s) => s.id === sectionId)
            if (idx !== -1) updated.sections[idx].title = newTitle
            return updated
        })

    const handleSectionItemChange = (
        sectionId: string,
        itemIndex: number,
        field: string,
        value: string
    ) => {
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            const section = updated.sections.find((s) => s.id === sectionId)
            if (!section) return prev

            if (section.type === SECTION_TYPES.EDUCATION) {
                (section.items[itemIndex] as any)[field] = value
            } else if (section.type === SECTION_TYPES.EXPERIENCE) {
                (section.items[itemIndex] as any)[field] = value
            }
            return updated
        })
    }

    const handleHighlightChange = (sectionId: string, itemIndex: number, highlightIndex: number, newText: string) =>
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

    const handleAchievementChange = (sectionId: string, itemIndex: number, achievementIndex: number, newText: string) =>
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

    const handleProjectFieldChange = (sectionId: string | undefined, projectIndex: number, field: string, value: string) => {
        if (!sectionId) return
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            const section = updated.sections.find((s) => s.id === sectionId)
            if (!section || section.type !== SECTION_TYPES.PROJECTS) return prev
            if (!section.items) section.items = [] as any
                ; (section.items[projectIndex] as any)[field] = value
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

    const handleSkillsChange = (sectionId: string, updatedGroups: any[]) => {
        setResumeData((prev) => {
            const updated = structuredClone(prev);
            const section = updated.sections.find((s) => s.id === sectionId);
            if (!section) return prev;

            // Update groups
            if ('groups' in section) {
                section.groups = updatedGroups;
            }

            // Also update flat items for backward compatibility
            const flatItems = updatedGroups.flatMap(group => group.skills);
            if ('items' in section) {
                section.items = flatItems;
            }

            return updated;
        });
    };

    const handleCustomContentChange = (sectionId: string, contentIndex: number, value: string) => {
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            const section = updated.sections.find((s) => s.id === sectionId)
            if (!section || section.type !== SECTION_TYPES.CUSTOM) return prev

            if (!section.content) section.content = []
            section.content[contentIndex] = value
            return updated
        })
    }

    const handleListChange = (sectionId: string, itemIndex: number, value: string) => {
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            const section = updated.sections.find((s) => s.id === sectionId)
            if (!section) return prev

            if (section.type === SECTION_TYPES.CERTIFICATIONS) {
                if (!section.items) section.items = []
                section.items[itemIndex] = value
            }
            return updated
        })
    }

    const handleLanguagesChange = (sectionId: string, value: string) => {
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            const section = updated.sections.find((s) => s.id === sectionId)
            if (!section) return prev

            if (section.type === SECTION_TYPES.LANGUAGES) {
                section.items = value.split(',').map(s => s.trim()).filter(Boolean)
            }
            return updated
        })
    }


    const handleCustomFieldChange = (key: string, field_key: 'title' | 'content', value: string) => {
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            if (updated.custom[key]) {
                updated.custom[key][field_key] = value
            }
            return updated
        })
    }


    // STYLES
    const theme = {
        colors: {
            headerBg: 'rgb(30, 41, 59)', // slate-800
            headerText: 'white',
            primary: 'rgb(15, 23, 42)', // slate-900
            secondary: 'rgb(71, 85, 105)', // slate-600
            accent: 'rgb(30, 41, 59)', // slate-800
            border: 'rgb(203, 213, 225)', // slate-300
        },
        fonts: {
            header: '24px',
            section: '16px',
            body: '11px',
            meta: '10px',
        }
    }

    return (
        <div className="border w-full h-full flex justify-center items-start overflow-auto bg-gray-50">
            <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div
                    ref={pdfRef}
                    className={`shadow-2xl relative flex flex-col ${font.className}`}
                    style={{
                        width: 595,
                        minHeight: 842,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        background: 'white',
                    }}
                >
                    {/* HEADER */}
                    <div
                        className="w-full p-8 flex flex-col gap-4 text-white"
                        style={{ backgroundColor: theme.colors.headerBg }}
                    >
                        <h1
                            className="font-bold tracking-wide uppercase"
                            style={{ fontSize: theme.fonts.header }}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={handleNameChange}
                        >
                            {resumeData.basics.name}
                        </h1>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/90" style={{ fontSize: theme.fonts.meta }}>
                            {resumeData.basics.email && (
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleContactInfoChange(e, 'email')}
                                >
                                    {resumeData.basics.email}
                                </span>
                            )}
                            {resumeData.basics.email && resumeData.basics.phone && <span>|</span>}
                            {resumeData.basics.phone && (
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleContactInfoChange(e, 'phone')}
                                >
                                    {resumeData.basics.phone}
                                </span>
                            )}
                            {resumeData.basics.phone && resumeData.basics.location && <span>|</span>}
                            {resumeData.basics.location && (
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleContactInfoChange(e, 'location')}
                                >
                                    {resumeData.basics.location}
                                </span>
                            )}
                            {resumeData.basics.location && resumeData.basics.linkedin && <span>|</span>}
                            {resumeData.basics.linkedin && (
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleContactInfoChange(e, 'linkedin')}
                                >
                                    {resumeData.basics.linkedin}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="w-full p-8 flex flex-col gap-6">

                        {/* Summary */}
                        {resumeData.basics.summary && (
                            <div className="flex flex-col gap-2">
                                <h2
                                    className="font-bold uppercase tracking-wider border-b-2 pb-1"
                                    style={{
                                        color: theme.colors.accent,
                                        fontSize: theme.fonts.section,
                                        borderColor: theme.colors.accent
                                    }}
                                >
                                    Professional Summary
                                </h2>
                                <p
                                    style={{ color: theme.colors.primary, fontSize: theme.fonts.body, lineHeight: 1.5 }}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={handleSummaryChange}
                                >
                                    {resumeData.basics.summary}
                                </p>
                            </div>
                        )}

                        {/* Dynamic Sections */}
                        {getSectionsForRendering(resumeData.sections, resumeData.custom).map(section => {
                            if (section.hidden) return null
                            // Basic empty check
                            if (section.type === SECTION_TYPES.EXPERIENCE && !(section as any).items?.length) return null
                            if (section.type === SECTION_TYPES.EDUCATION && !(section as any).items?.length) return null
                            if (section.type === SECTION_TYPES.PROJECTS && !(section as any).items?.length) return null
                            if (section.type === SECTION_TYPES.SKILLS && !getEffectiveSkillGroupsFromSection(section as any).some(g => g.skills.length > 0)) return null
                            if (section.type === SECTION_TYPES.CUSTOM && !(section as any).content?.length) return null
                            if ((section.type === SECTION_TYPES.CERTIFICATIONS) && !(section as any).items?.length) return null
                            if (section.type === SECTION_TYPES.LANGUAGES && !(section as any).items?.length) return null
                            if (section.type === SECTION_TYPES.CUSTOM_FIELDS && Object.keys(resumeData.custom).length === 0) return null

                            return (
                                <div key={section.id} className="flex flex-col gap-3">
                                    <h2
                                        className="font-bold uppercase tracking-wider border-b-2 pb-1"
                                        style={{
                                            color: theme.colors.accent,
                                            fontSize: theme.fonts.section,
                                            borderColor: theme.colors.accent
                                        }}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
                                    >
                                        {section.title}
                                    </h2>

                                    {/* EXPERIENCE */}
                                    {section.type === SECTION_TYPES.EXPERIENCE && (section as any).items.map((exp: any, i: number) => (
                                        <div key={i} className="mb-2">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <div
                                                    className="font-bold"
                                                    style={{ color: theme.colors.primary, fontSize: '12px' }}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => handleSectionItemChange(section.id, i, 'role', e.currentTarget.textContent || '')}
                                                >
                                                    {exp.role}
                                                </div>
                                                <div
                                                    style={{ color: theme.colors.secondary, fontSize: theme.fonts.meta }}
                                                >
                                                    <span
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleSectionItemChange(section.id, i, 'startDate', e.currentTarget.textContent || '')}
                                                    >
                                                        {exp.startDate}
                                                    </span>
                                                    {' - '}
                                                    <span
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleSectionItemChange(section.id, i, 'endDate', e.currentTarget.textContent || '')}
                                                    >
                                                        {exp.endDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <div
                                                    style={{ color: theme.colors.secondary, fontSize: '11px', fontWeight: 600 }}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => handleSectionItemChange(section.id, i, 'company', e.currentTarget.textContent || '')}
                                                >
                                                    {exp.company}
                                                </div>
                                                <div
                                                    style={{ color: theme.colors.secondary, fontSize: theme.fonts.meta }}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => handleSectionItemChange(section.id, i, 'location', e.currentTarget.textContent || '')}
                                                >
                                                    {exp.location}
                                                </div>
                                            </div>
                                            {exp.achievements && (
                                                <ul className="list-disc ml-4 space-y-1">
                                                    {exp.achievements.map((ach: string, j: number) => (
                                                        <li
                                                            key={j}
                                                            style={{ color: theme.colors.primary, fontSize: theme.fonts.body }}
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => handleAchievementChange(section.id, i, j, e.currentTarget.textContent || '')}
                                                        >
                                                            {ach}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}

                                    {/* EDUCATION */}
                                    {section.type === SECTION_TYPES.EDUCATION && (section as any).items.map((edu: any, i: number) => (
                                        <div key={i} className="mb-2">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <div
                                                    className="font-bold"
                                                    style={{ color: theme.colors.primary, fontSize: '12px' }}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => handleSectionItemChange(section.id, i, 'institution', e.currentTarget.textContent || '')}
                                                >
                                                    {edu.institution}
                                                </div>
                                                <div style={{ color: theme.colors.secondary, fontSize: theme.fonts.meta }}>
                                                    <span
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleSectionItemChange(section.id, i, 'startDate', e.currentTarget.textContent || '')}
                                                    >
                                                        {edu.startDate}
                                                    </span>
                                                    {' - '}
                                                    <span
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleSectionItemChange(section.id, i, 'endDate', e.currentTarget.textContent || '')}
                                                    >
                                                        {edu.endDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                style={{ color: theme.colors.secondary, fontSize: '11px', fontWeight: 600 }}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleSectionItemChange(section.id, i, 'degree', e.currentTarget.textContent || '')}
                                            >
                                                {edu.degree}
                                            </div>
                                            {edu.highlights && (
                                                <ul className="list-disc ml-4 mt-1 space-y-1">
                                                    {edu.highlights.map((h: string, j: number) => (
                                                        <li
                                                            key={j}
                                                            style={{ color: theme.colors.primary, fontSize: theme.fonts.body }}
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => handleHighlightChange(section.id, i, j, e.currentTarget.textContent || '')}
                                                        >
                                                            {h}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}

                                    {/* SKILLS */}
                                    {section.type === SECTION_TYPES.SKILLS && (() => {
                                        const groups = getEffectiveSkillGroupsFromSection(section)
                                        return (
                                            <div className="flex flex-col gap-2">
                                                {groups.filter(g => g.skills.length > 0).map((group) => (
                                                    <div key={group.title} className="flex flex-col">
                                                        <span
                                                            className="font-bold uppercase"
                                                            style={{ color: theme.colors.secondary, fontSize: '10px' }}
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => {
                                                                const newTitle = e.currentTarget.textContent || ''
                                                                const updatedGroups = groups.map(g =>
                                                                    g.title === group.title ? { ...g, title: newTitle } : g
                                                                )
                                                                handleSkillsChange(section.id, updatedGroups)
                                                            }}
                                                        >
                                                            {group.title}
                                                        </span>
                                                        <div
                                                            className="leading-relaxed"
                                                            style={{ color: theme.colors.primary, fontSize: theme.fonts.body }}
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => {
                                                                const newSkills = e.currentTarget.textContent || ''
                                                                const skillsArray = newSkills.split(',').map(s => s.trim()).filter(s => s.length > 0)
                                                                const updatedGroups = groups.map(g =>
                                                                    g.title === group.title ? { ...g, skills: skillsArray } : g
                                                                )
                                                                handleSkillsChange(section.id, updatedGroups)
                                                            }}
                                                        >
                                                            {group.skills.join(", ")}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })()}

                                    {/* PROJECTS */}
                                    {section.type === SECTION_TYPES.PROJECTS && Array.isArray((section as any).items) && (
                                        <ProjectSection
                                            sectionId={section.id}
                                            projects={(section as any).items}
                                            textColor={theme.colors.primary}
                                            linkColor={'#2563eb'}
                                            contentEditable={true}
                                            onProjectFieldChange={handleProjectFieldChange}
                                            onProjectDescriptionChange={handleProjectDescriptionChange}
                                            titleClassName={'font-bold text-[12px]'}
                                            descriptionClassName={'text-[11px]'}
                                        />
                                    )}

                                    {/* CERTIFICATIONS (List) */}
                                    {section.type === SECTION_TYPES.CERTIFICATIONS && (section as any).items.map((item: string, i: number) => (
                                        <ul key={i} className="list-disc ml-4 space-y-1">
                                            <li
                                                style={{ color: theme.colors.primary, fontSize: theme.fonts.body }}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleListChange(section.id, i, e.currentTarget.textContent || '')}
                                            >
                                                {item}
                                            </li>
                                        </ul>
                                    ))}

                                    {/* LANGUAGES (Comma Separated) */}
                                    {section.type === SECTION_TYPES.LANGUAGES && (
                                        <div
                                            style={{ color: theme.colors.primary, fontSize: theme.fonts.body, lineHeight: 1.5 }}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleLanguagesChange(section.id, e.currentTarget.textContent || '')}
                                        >
                                            {(section as any).items.join(", ")}
                                        </div>
                                    )}

                                    {/* CUSTOM CONTENT (List) */}
                                    {section.type === SECTION_TYPES.CUSTOM && (section as any).content.map((item: string, i: number) => (
                                        <ul key={i} className="list-disc ml-4 space-y-1">
                                            <li
                                                style={{ color: theme.colors.primary, fontSize: theme.fonts.body }}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleCustomContentChange(section.id, i, e.currentTarget.textContent || '')}
                                            >
                                                {item}
                                            </li>
                                        </ul>
                                    ))}

                                    {/* CUSTOM FIELDS (Additional Links/Data) - Coma Separated */}
                                    {section.type === SECTION_TYPES.CUSTOM_FIELDS && (
                                        <div className="flex flex-wrap gap-x-1 items-center" style={{ fontSize: theme.fonts.body, color: theme.colors.primary }}>
                                            {(() => {
                                                const visibleFields = Object.entries(resumeData.custom).filter(([_, f]) => !f.hidden);
                                                return visibleFields.map(([key, field], index) => (
                                                    <div key={key} className="flex items-center">
                                                        <span
                                                            className="font-bold mr-1"
                                                            style={{ color: theme.colors.secondary }}
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => handleCustomFieldChange(key, 'title', e.currentTarget.textContent || '')}
                                                        >
                                                            {field.title}:
                                                        </span>
                                                        <span
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => handleCustomFieldChange(key, 'content', e.currentTarget.textContent || '')}
                                                        >
                                                            {field.content}
                                                        </span>
                                                        {index < visibleFields.length - 1 && <span className="mr-1">,</span>}
                                                    </div>
                                                ))
                                            })()}
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
