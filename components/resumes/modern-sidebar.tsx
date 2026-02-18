"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { ResumeData } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { SECTION_TYPES } from '@/types/resume'
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"

interface ResumeProps {
    pdfRef: React.RefObject<HTMLDivElement>
    font: { className: string; name: string }
    resumeData: ResumeData
    setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
    activeSection: string
}

export const ModernSidebarResume: React.FC<ResumeProps> = ({
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

    // Helper getters for handlers
    const handleNameChange = (e: React.FormEvent<HTMLHeadingElement>) => {
        setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, name: e.currentTarget?.textContent || "" } }))
    }

    const handleContactInfoChange = (e: React.FormEvent<HTMLSpanElement>, key: keyof typeof resumeData.basics) => {
        setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, [key]: e.currentTarget?.textContent || "" } }))
    }

    const handleSummaryChange = (e: React.FormEvent<HTMLParagraphElement>) => {
        setResumeData((prev) => ({ ...prev, basics: { ...prev.basics, summary: e.currentTarget?.textContent || "" } }))
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

    const handleSkillChange = (sectionId: string, groupIndex: number, skillIndex: number, newValue: string) => {
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            const section = updated.sections.find(s => s.id === sectionId)
            if (!section || section.type !== SECTION_TYPES.SKILLS) return prev

            // Check if we're dealing with new grouped structure or old text items
            if ('groups' in section) {
                // For now, assuming direct mapping to rendering which uses helpers. 
                // Editing skills in this template is tricky because of the `getEffectiveSkillGroupsFromSection` abstraction.
                // A simple implementation: update the raw data structure.
                if (section.items && section.items.length > 0) {
                    // Attempt to map back to linear list if possible, or just update if it's already structured?
                    // The helper `getEffectiveSkillGroupsFromSection` reads from `items` (strings) or `groups` (objects).
                    // If we are rendering from groups, we should update groups.
                    if (section.groups && section.groups[groupIndex]) {
                        section.groups[groupIndex].skills[skillIndex] = newValue
                    }
                }
            } else {
                // Fallback for simple string array if that's what's being used
                if (section.items && section.items[skillIndex]) {
                    section.items[skillIndex] = newValue;
                }
            }

            return updated
        })
    }

    const handleCustomItemChange = (id: string, field: "title" | "content", value: string) =>
        setResumeData((prev) => {
            const updated = structuredClone(prev)
            if (updated.custom[id]) updated.custom[id][field] = value
            return updated
        })

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

    // Render logic
    return (
        <div className="border w-full h-full flex justify-center items-start overflow-auto bg-gray-50">
            <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div
                    ref={pdfRef}
                    className={`shadow-2xl relative flex ${font.className}`}
                    style={{
                        width: 595,
                        minHeight: 842,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        background: 'white',
                    }}
                >
                    {/* LEFT SIDEBAR */}
                    <div className="w-[180px] bg-gray-100 p-6 flex flex-col gap-6 border-r border-gray-200">
                        {/* Name & Contact */}
                        <div className="flex flex-col gap-4">
                            <h1
                                className="text-2xl font-bold text-gray-800 leading-tight break-words"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={handleNameChange}
                            >
                                {resumeData.basics.name}
                            </h1>

                            <div className="text-xs text-gray-600 flex flex-col gap-1">
                                {['email', 'phone', 'location', 'linkedin'].map(key => {
                                    const val = resumeData.basics[key as keyof typeof resumeData.basics]
                                    if (!val) return null
                                    return (
                                        <div key={key}>
                                            <div className="font-bold text-blue-700 uppercase text-[10px] mb-0.5">{key}</div>
                                            <span
                                                className="break-all"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleContactInfoChange(e, key as any)}
                                            >
                                                {val}
                                            </span>
                                        </div>
                                    )
                                })}

                                {/* Custom links in sidebar */}
                                {Object.values(resumeData.custom).filter(f => !f.hidden).map(field => (
                                    <div key={field.id}>
                                        <div
                                            className="font-bold text-blue-700 uppercase text-[10px] mb-0.5"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleCustomItemChange(field.id, 'title', e.currentTarget.textContent || '')}
                                        >
                                            {field.title}
                                        </div>
                                        <span
                                            className="break-all"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleCustomItemChange(field.id, 'content', e.currentTarget.textContent || '')}
                                        >
                                            {field.content}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills */}
                        {resumeData.sections.find(s => s.type === 'skills' && !s.hidden) && (
                            <div className="flex flex-col gap-2">
                                <div className="font-bold text-sm text-gray-800 border-b border-gray-300 pb-1">SKILLS</div>
                                {(() => {
                                    const section = resumeData.sections.find(s => s.type === 'skills')
                                    const groups = getEffectiveSkillGroupsFromSection(section as any)
                                    return groups.filter(g => g.skills.length > 0).map((group, groupIdx) => (
                                        <div key={group.title} className="mb-2">
                                            {group.title !== 'General' && <div className="text-xs font-bold text-gray-700 break-words">{group.title}</div>}
                                            <ul className="list-disc ml-3 text-xs text-gray-600">
                                                {group.skills.map((skill, skillIdx) => (
                                                    <li
                                                        key={skillIdx}
                                                        className="break-words"
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => {
                                                            const newValue = e.currentTarget.textContent || ""
                                                            // We need to find the original index in the flat items array if possible, 
                                                            // or if it's groups, update the group. 
                                                            // Since `handleSkillChange` assumes a specific structure, let's inline a simple update 
                                                            // that works with the `getEffectiveSkillGroupsFromSection` output if possible, 
                                                            // OR just rely on the fact that `getEffectiveSkillGroupsFromSection` might return a view.
                                                            // Actually, let's try to update the main section items if it's flat.

                                                            setResumeData((prev) => {
                                                                const updated = structuredClone(prev)
                                                                const s = updated.sections.find(sec => sec.id === section?.id)
                                                                if (!s) return prev

                                                                // If we rely on groups:
                                                                if ('groups' in s && (s as any).groups) {
                                                                    // Find the group by title
                                                                    const targetGroup = (s as any).groups.find((g: any) => g.title === group.title)
                                                                    if (targetGroup && targetGroup.skills[skillIdx] !== undefined) {
                                                                        targetGroup.skills[skillIdx] = newValue
                                                                    }
                                                                } else if ('items' in s && Array.isArray(s.items)) {
                                                                    // Fallback: If it's a flat list (General), we need to correct index.
                                                                    // This is hard without exact mapping. 
                                                                    // For now, let's assume if it's flat 'General' group, it maps directly 1-to-1 if order is preserved.
                                                                    if (group.title === 'General') {
                                                                        if (s.items[skillIdx]) s.items[skillIdx] = newValue
                                                                    } else {
                                                                        // If it's not general but stored as items, we can't easily map back without more logic.
                                                                        // Let's assume standard group structure is used if title != General.
                                                                    }
                                                                }
                                                                return updated
                                                            })
                                                        }}
                                                    >
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
                                })()}
                            </div>
                        )}

                        {/* Languages */}
                        {resumeData.sections.find(s => s.type === 'languages' && !s.hidden) && (
                            <div className="flex flex-col gap-2">
                                <div className="font-bold text-sm text-gray-800 border-b border-gray-300 pb-1">LANGUAGES</div>
                                <ul className="text-xs text-gray-600 flex flex-col gap-1">
                                    {(resumeData.sections.find(s => s.type === 'languages') as any).items.map((lang: string, i: number) => (
                                        <li
                                            key={i}
                                            className="break-words"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const val = e.currentTarget.textContent || ""
                                                setResumeData(prev => {
                                                    const updated = structuredClone(prev)
                                                    const s = updated.sections.find(sec => sec.type === 'languages')
                                                    if (s && 'items' in s && Array.isArray((s as any).items)) {
                                                        (s as any).items[i] = val
                                                    }
                                                    return updated
                                                })
                                            }}
                                        >
                                            {lang}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 p-8 flex flex-col gap-6">

                        {/* Summary */}
                        {resumeData.basics.summary && (
                            <div className="flex flex-col gap-2">
                                <div className="font-bold text-sm text-gray-800 border-b border-gray-300 pb-1">PROFESSIONAL SUMMARY</div>
                                <p
                                    className="text-xs text-gray-700 leading-relaxed"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={handleSummaryChange}
                                >
                                    {resumeData.basics.summary}
                                </p>
                            </div>
                        )}

                        {/* Main Sections */}
                        {getSectionsForRendering(resumeData.sections, resumeData.custom)
                            .filter(s => ['experience', 'education', 'projects', 'custom'].includes(s.type))
                            .map(section => {
                                if (section.hidden) return null
                                // Basic empty check
                                if (section.type === 'experience' && !(section as any).items?.length) return null
                                if (section.type === 'education' && !(section as any).items?.length) return null
                                if (section.type === 'projects' && !(section as any).items?.length) return null
                                if (section.type === 'custom' && !(section as any).content?.length) return null

                                return (
                                    <div key={section.id} className="flex flex-col gap-3">
                                        <div
                                            className="font-bold text-sm text-gray-800 border-b border-gray-300 pb-1 uppercase"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
                                        >
                                            {section.title}
                                        </div>

                                        {section.type === 'experience' && (section as any).items.map((exp: any, i: number) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-baseline">
                                                    <div
                                                        className="font-bold text-sm text-gray-800"
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleSectionItemChange(section.id, i, 'role', e.currentTarget.textContent || '')}
                                                    >
                                                        {exp.role}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 whitespace-nowrap">
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
                                                        className="text-xs text-blue-700 font-semibold"
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleSectionItemChange(section.id, i, 'company', e.currentTarget.textContent || '')}
                                                    >
                                                        {exp.company}
                                                    </div>
                                                    {exp.location && (
                                                        <div
                                                            className="text-[10px] text-gray-500"
                                                            contentEditable
                                                            suppressContentEditableWarning
                                                            onBlur={(e) => handleSectionItemChange(section.id, i, 'location', e.currentTarget.textContent || '')}
                                                        >
                                                            {exp.location}
                                                        </div>
                                                    )}
                                                </div>
                                                {exp.achievements && (
                                                    <ul className="list-disc ml-4 text-xs text-gray-600 space-y-0.5">
                                                        {exp.achievements.map((ach: string, j: number) => (
                                                            <li
                                                                key={j}
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

                                        {section.type === 'education' && (section as any).items.map((edu: any, i: number) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-baseline">
                                                    <div
                                                        className="font-bold text-sm text-gray-800"
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleSectionItemChange(section.id, i, 'institution', e.currentTarget.textContent || '')}
                                                    >
                                                        {edu.institution}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 whitespace-nowrap">
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
                                                    className="text-xs text-blue-700 mb-1"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => handleSectionItemChange(section.id, i, 'degree', e.currentTarget.textContent || '')}
                                                >
                                                    {edu.degree}
                                                </div>
                                                {edu.highlights && (
                                                    <ul className="list-disc ml-4 text-xs text-gray-600 space-y-0.5">
                                                        {edu.highlights.map((h: string, j: number) => (
                                                            <li
                                                                key={j}
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

                                        {section.type === 'projects' && (section as any).items.map((proj: any, i: number) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-baseline">
                                                    <div
                                                        className="font-bold text-sm text-gray-800"
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleProjectFieldChange(section.id, i, 'name', e.currentTarget.textContent || '')}
                                                    >
                                                        {proj.name}
                                                    </div>
                                                </div>
                                                {(proj.link || proj.repo) && (
                                                    <div className="text-[10px] text-blue-600 flex flex-col gap-1 mb-1">
                                                        {proj.link && (
                                                            <span
                                                                className="break-all"
                                                                contentEditable
                                                                suppressContentEditableWarning
                                                                onBlur={(e) => handleProjectFieldChange(section.id, i, 'link', e.currentTarget.textContent || '')}
                                                            >
                                                                {proj.link}
                                                            </span>
                                                        )}
                                                        {proj.repo && (
                                                            <span
                                                                className="break-all"
                                                                contentEditable
                                                                suppressContentEditableWarning
                                                                onBlur={(e) => handleProjectFieldChange(section.id, i, 'repo', e.currentTarget.textContent || '')}
                                                            >
                                                                {proj.repo}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {proj.description && (
                                                    <ul className="list-disc ml-4 text-xs text-gray-600 space-y-0.5">
                                                        {proj.description.map((d: string, j: number) => (
                                                            <li
                                                                key={j}
                                                                contentEditable
                                                                suppressContentEditableWarning
                                                                onBlur={(e) => handleProjectDescriptionChange(section.id, i, j, e.currentTarget.textContent || '')}
                                                            >
                                                                {d}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}

                                        {section.type === 'custom' && (section as any).content.map((item: string, i: number) => (
                                            <ul key={i} className="list-disc ml-4 text-xs text-gray-600 space-y-0.5">
                                                <li
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => handleCustomContentChange(section.id, i, e.currentTarget.textContent || '')}
                                                >
                                                    {item}
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
}
