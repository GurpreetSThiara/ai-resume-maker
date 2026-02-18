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
                                        <div className="font-bold text-blue-700 uppercase text-[10px] mb-0.5">{field.title}</div>
                                        <span className="break-all">{field.content}</span>
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
                                    return groups.filter(g => g.skills.length > 0).map(group => (
                                        <div key={group.title} className="mb-2">
                                            {group.title !== 'General' && <div className="text-xs font-bold text-gray-700 break-words">{group.title}</div>}
                                            <ul className="list-disc ml-3 text-xs text-gray-600">
                                                {group.skills.map(skill => <li key={skill} className="break-words">{skill}</li>)}
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
                                    {(resumeData.sections.find(s => s.type === 'languages') as any).items.map((lang: string) => (
                                        <li key={lang} className="break-words">{lang}</li>
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
                                        <div className="font-bold text-sm text-gray-800 border-b border-gray-300 pb-1 uppercase">{section.title}</div>

                                        {section.type === 'experience' && (section as any).items.map((exp: any, i: number) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-baseline">
                                                    <div className="font-bold text-sm text-gray-800">{exp.role}</div>
                                                    <div className="text-[10px] text-gray-500 whitespace-nowrap">{exp.startDate} - {exp.endDate}</div>
                                                </div>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <div className="text-xs text-blue-700 font-semibold">{exp.company}</div>
                                                    {exp.location && <div className="text-[10px] text-gray-500">{exp.location}</div>}
                                                </div>
                                                {exp.achievements && (
                                                    <ul className="list-disc ml-4 text-xs text-gray-600 space-y-0.5">
                                                        {exp.achievements.map((ach: string, j: number) => (
                                                            <li key={j}>{ach}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}

                                        {section.type === 'education' && (section as any).items.map((edu: any, i: number) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-baseline">
                                                    <div className="font-bold text-sm text-gray-800">{edu.institution}</div>
                                                    <div className="text-[10px] text-gray-500 whitespace-nowrap">{edu.startDate} - {edu.endDate}</div>
                                                </div>
                                                <div className="text-xs text-blue-700 mb-1">{edu.degree}</div>
                                                {edu.highlights && (
                                                    <ul className="list-disc ml-4 text-xs text-gray-600 space-y-0.5">
                                                        {edu.highlights.map((h: string, j: number) => (
                                                            <li key={j}>{h}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}

                                        {section.type === 'projects' && (section as any).items.map((proj: any, i: number) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-baseline">
                                                    <div className="font-bold text-sm text-gray-800">{proj.name}</div>
                                                </div>
                                                {(proj.link || proj.repo) && (
                                                    <div className="text-[10px] text-blue-600 flex flex-col gap-1 mb-1">
                                                        {proj.link && <span className="break-all">{proj.link}</span>}
                                                        {proj.repo && <span className="break-all">{proj.repo}</span>}
                                                    </div>
                                                )}
                                                {proj.description && (
                                                    <ul className="list-disc ml-4 text-xs text-gray-600 space-y-0.5">
                                                        {proj.description.map((d: string, j: number) => (
                                                            <li key={j}>{d}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}

                                        {section.type === 'custom' && (section as any).content.map((item: string, i: number) => (
                                            <ul key={i} className="list-disc ml-4 text-xs text-gray-600 space-y-0.5">
                                                <li>{item}</li>
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
