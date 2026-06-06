"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { ResumeData } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { SECTION_TYPES } from '@/types/resume'
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react"

interface ResumeProps {
    pdfRef: React.RefObject<HTMLDivElement>
    font: { className: string; name: string }
    resumeData: ResumeData
    setResumeData: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
    activeSection: string
}

export const ModernSplitResume: React.FC<ResumeProps> = ({
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

            if (section.type === SECTION_TYPES.EDUCATION || section.type === SECTION_TYPES.EXPERIENCE) {
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

    const renderSectionContent = (section: any, isSidebar: boolean) => {
        if (section.hidden) return null

        const titleColor = isSidebar ? "text-slate-400 border-slate-700" : "text-slate-800 border-slate-200"
        const textColor = isSidebar ? "text-slate-300" : "text-slate-600"
        const subTitleColor = isSidebar ? "text-white" : "text-slate-900"
        const accentColor = isSidebar ? "text-blue-400" : "text-blue-600"

        return (
            <div key={section.id} className="flex flex-col gap-4">
                <div
                    className={`font-bold text-xs ${titleColor} border-b pb-1 uppercase tracking-wider`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleSectionTitleChange(section.id, e.currentTarget.textContent || "")}
                >
                    {section.title}
                </div>

                {section.type === 'skills' && (() => {
                    const groups = getEffectiveSkillGroupsFromSection(section as any)
                    return groups.filter(g => g.skills.length > 0).map((group, groupIdx) => (
                        <div key={groupIdx} className="mb-2">
                            {group.title !== 'General' && <div className={`text-[10px] font-bold ${isSidebar ? 'text-slate-200' : 'text-slate-700'} uppercase mb-1`}>{group.title}</div>}
                            <div className="flex flex-wrap gap-1.5">
                                {group.skills.map((skill, skillIdx) => (
                                    <span
                                        key={skillIdx}
                                        className={`px-2 py-0.5 rounded text-[10px] ${isSidebar ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const newValue = e.currentTarget.textContent || ""
                                            setResumeData((prev) => {
                                                const updated = structuredClone(prev)
                                                const s = updated.sections.find(sec => sec.id === section.id)
                                                if (!s) return prev
                                                if ('groups' in s && (s as any).groups) {
                                                    const targetGroup = (s as any).groups.find((g: any) => g.title === group.title)
                                                    if (targetGroup && targetGroup.skills[skillIdx] !== undefined) {
                                                        targetGroup.skills[skillIdx] = newValue
                                                    }
                                                } else if ('items' in s && Array.isArray(s.items)) {
                                                    if (group.title === 'General') {
                                                        if (s.items[skillIdx]) s.items[skillIdx] = newValue
                                                    }
                                                }
                                                return updated
                                            })
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                })()}

                {section.type === 'languages' && (
                    <div className="flex flex-col gap-2">
                        {(section as any).items.map((lang: string, i: number) => (
                            <div key={i} className="flex justify-between items-center text-[11px]">
                                <span
                                    className={isSidebar ? "text-slate-200" : "text-slate-700"}
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
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {section.type === 'experience' && (section as any).items.map((exp: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-baseline">
                            <div
                                className={`font-bold text-sm ${subTitleColor}`}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleSectionItemChange(section.id, i, 'role', e.currentTarget.textContent || '')}
                            >
                                {exp.role}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleSectionItemChange(section.id, i, 'startDate', e.currentTarget.textContent || '')}>{exp.startDate}</span>
                                {' - '}
                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleSectionItemChange(section.id, i, 'endDate', e.currentTarget.textContent || '')}>{exp.endDate}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <div
                                className={`text-xs ${accentColor} font-semibold`}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleSectionItemChange(section.id, i, 'company', e.currentTarget.textContent || '')}
                            >
                                {exp.company}
                            </div>
                            {exp.location && (
                                <div
                                    className="text-[10px] text-slate-500"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleSectionItemChange(section.id, i, 'location', e.currentTarget.textContent || '')}
                                >
                                    {exp.location}
                                </div>
                            )}
                        </div>
                        {exp.achievements && (
                            <ul className={`list-disc ml-4 text-[11px] ${textColor} space-y-1`}>
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
                    <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-baseline">
                            <div
                                className={`font-bold text-sm ${subTitleColor}`}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleSectionItemChange(section.id, i, 'institution', e.currentTarget.textContent || '')}
                            >
                                {edu.institution}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleSectionItemChange(section.id, i, 'startDate', e.currentTarget.textContent || '')}>{edu.startDate}</span>
                                {' - '}
                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleSectionItemChange(section.id, i, 'endDate', e.currentTarget.textContent || '')}>{edu.endDate}</span>
                            </div>
                        </div>
                        <div
                            className={`text-xs ${accentColor}`}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSectionItemChange(section.id, i, 'degree', e.currentTarget.textContent || '')}
                        >
                            {edu.degree}
                        </div>
                        {edu.highlights && (
                            <ul className={`list-disc ml-4 text-[11px] ${textColor} space-y-1`}>
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
                    <div key={i} className="flex flex-col gap-1.5">
                        <div
                            className={`font-bold text-sm ${subTitleColor}`}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleProjectFieldChange(section.id, i, 'name', e.currentTarget.textContent || '')}
                        >
                            {proj.name}
                        </div>
                        {(proj.link || proj.repo) && (
                            <div className="text-[10px] text-blue-500 flex flex-col gap-0.5">
                                {proj.link && (
                                    <span className="break-all" contentEditable suppressContentEditableWarning onBlur={(e) => handleProjectFieldChange(section.id, i, 'link', e.currentTarget.textContent || '')}>
                                        {proj.link}
                                    </span>
                                )}
                                {proj.repo && (
                                    <span className="break-all" contentEditable suppressContentEditableWarning onBlur={(e) => handleProjectFieldChange(section.id, i, 'repo', e.currentTarget.textContent || '')}>
                                        {proj.repo}
                                    </span>
                                )}
                            </div>
                        )}
                        {proj.description && (
                            <ul className={`list-disc ml-4 text-[11px] ${textColor} space-y-1`}>
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
                    <ul key={i} className={`list-disc ml-4 text-[11px] ${textColor} space-y-1`}>
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
    }

    const allSections = getSectionsForRendering(resumeData.sections, resumeData.custom)

    const leftSections = allSections.filter(s => {
        return s.column === 1 || (!s.column && ['skills', 'languages'].includes(s.type))
    })

    const rightSections = allSections.filter(s => {
        return s.column === 2 || (!s.column && !['skills', 'languages'].includes(s.type))
    })

    return (
        <div className="border w-full h-full flex justify-center items-start overflow-auto bg-gray-100 py-8">
            <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
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
                    {/* LEFT SIDEBAR - Dark */}
                    <div className="w-[200px] bg-slate-900 p-8 flex flex-col gap-8">
                        {/* Contact Info */}
                        <div className="flex flex-col gap-6">
                            <div className="text-[11px] text-slate-300 flex flex-col gap-4">
                                {[
                                    { key: 'email', icon: Mail, label: 'Email' },
                                    { key: 'phone', icon: Phone, label: 'Phone' },
                                    { key: 'location', icon: MapPin, label: 'Location' },
                                    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                                    { key: 'website', icon: Globe, label: 'Website' }
                                ].map(({ key, icon: Icon, label }) => {
                                    const val = resumeData.basics[key as keyof typeof resumeData.basics]
                                    if (!val) return null
                                    return (
                                        <div key={key} className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <Icon size={12} />
                                                <span className="font-bold uppercase text-[9px] tracking-widest">{label}</span>
                                            </div>
                                            <span
                                                className="break-all pl-5 text-slate-200"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleContactInfoChange(e, key as any)}
                                            >
                                                {val}
                                            </span>
                                        </div>
                                    )
                                })}

                                {Object.values(resumeData.custom).filter(f => !f.hidden && f.content && f.content.length < 50).map(field => (
                                    <div key={field.id} className="flex flex-col gap-1">
                                        <div className="font-bold text-blue-400 uppercase text-[9px] tracking-widest" contentEditable suppressContentEditableWarning onBlur={(e) => handleCustomItemChange(field.id, 'title', e.currentTarget.textContent || '')}>
                                            {field.title}
                                        </div>
                                        <span className="break-all text-slate-200" contentEditable suppressContentEditableWarning onBlur={(e) => handleCustomItemChange(field.id, 'content', e.currentTarget.textContent || '')}>
                                            {field.content}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {leftSections.map(s => renderSectionContent(s, true))}
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 p-10 flex flex-col gap-8">
                        {/* Header: Name */}
                        <div className="border-b-4 border-slate-900 pb-6">
                            <h1
                                className="text-4xl font-black text-slate-900 leading-tight break-words tracking-tight uppercase"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={handleNameChange}
                            >
                                {resumeData.basics.name}
                            </h1>
                        </div>

                        {/* Summary */}
                        {resumeData.basics.summary && (
                            <div className="flex flex-col gap-3">
                                <div className="font-bold text-xs text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">Professional Profile</div>
                                <p
                                    className="text-[11px] text-slate-600 leading-relaxed text-justify"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={handleSummaryChange}
                                >
                                    {resumeData.basics.summary}
                                </p>
                            </div>
                        )}

                        {rightSections.map(s => renderSectionContent(s, false))}
                    </div>
                </div>
            </div>
        </div>
    )
}
