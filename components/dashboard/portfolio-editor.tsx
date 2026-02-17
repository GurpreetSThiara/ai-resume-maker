"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Save, Eye, LayoutTemplate, Briefcase, GraduationCap, Code, Globe, Award, Languages, User, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { updatePortfolio } from "@/services/portfolioService"
import { PersonalInfoSection } from "@/components/personal-info-section"
import { SummarySection } from "@/components/summary-section"
import { ExperienceSection } from "@/components/experience-section"
import { EducationSection } from "@/components/education-section"
import { SkillsSection } from "@/components/skills-section"
import { ProjectsSection } from "@/components/projects-section"
import { CertificationsSection } from "@/components/certifications-section"
import { LanguagesSection } from "@/components/languages-section"
import { CustomSection } from "@/components/custom-section"

import { SECTION_TYPES, ResumeData } from "@/types/resume"
import { cn } from "@/lib/utils"

interface PortfolioEditorProps {
    portfolio: any // Typed as Database['public']['Tables']['portfolios']['Row']
}

const SECTION_CONFIG = [
    { id: 'personal', icon: User, label: 'Personal Info', component: PersonalInfoSection },
    { id: 'summary', icon: FileText, label: 'Summary', component: SummarySection },
    { id: SECTION_TYPES.EXPERIENCE, icon: Briefcase, label: 'Experience', component: ExperienceSection },
    { id: SECTION_TYPES.EDUCATION, icon: GraduationCap, label: 'Education', component: EducationSection },
    { id: SECTION_TYPES.SKILLS, icon: Code, label: 'Skills', component: SkillsSection },
    { id: SECTION_TYPES.PROJECTS, icon: Globe, label: 'Projects', component: ProjectsSection },
    { id: SECTION_TYPES.CERTIFICATIONS, icon: Award, label: 'Certifications', component: CertificationsSection },
    { id: SECTION_TYPES.LANGUAGES, icon: Languages, label: 'Languages', component: LanguagesSection },
    // Custom sections handling might be tricky with this static list, but basic support for now
    { id: SECTION_TYPES.CUSTOM, icon: LayoutTemplate, label: 'Custom', component: CustomSection },
]

export function PortfolioEditor({ portfolio: initialPortfolio }: PortfolioEditorProps) {
    const [portfolio, setPortfolio] = useState(initialPortfolio)
    const [activeSection, setActiveSection] = useState('personal')
    const [saving, setSaving] = useState(false)

    // Ensure data object integrity
    const resumeData = (portfolio.data || { basics: {}, sections: [] }) as ResumeData

    // Fix for skills section structure (flat vs groups) is handled inside SkillsSection component usually?
    // We pass the whole data object to section components, so strictly they should modify it correctly.

    const handleUpdate = useCallback((updates: Partial<ResumeData>) => {
        setPortfolio((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                ...updates
            }
        }))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const result = await updatePortfolio(portfolio.id, {
            data: portfolio.data,
            updated_at: new Date().toISOString()
        })

        if (result.success) {
            toast.success("Portfolio saved successfully")
            setPortfolio(result.data)
        } else {
            toast.error("Failed to save portfolio")
        }
        setSaving(false)
    }

    const ActiveComponent = SECTION_CONFIG.find(s => s.id === activeSection)?.component || PersonalInfoSection

    // Some sections rely on finding their specific section in data.sections
    // PersonalInfo usually checks data.basics

    // Helper to render the component with correct props
    // Most components expect { data, onUpdate }

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b px-6 py-3 bg-white">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/portfolios">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold flex items-center gap-2">
                            {portfolio.title}
                            <Badge variant={portfolio.is_public ? "default" : "secondary"} className={portfolio.is_public ? "bg-green-600 hover:bg-green-700" : ""}>
                                {portfolio.is_public ? "Public" : "Draft"}
                            </Badge>
                        </h1>
                        <Link href={`/p/${portfolio.slug}`} target="_blank" className="text-sm text-muted-foreground hover:underline">
                            resume-builder.com/p/{portfolio.slug}
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/p/${portfolio.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View Live
                        </Link>
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r bg-muted/20 flex flex-col">
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-1">
                            {SECTION_CONFIG.map((section) => {
                                const Icon = section.icon
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                                            activeSection === section.id
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {section.label}
                                    </button>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[500px]">
                            <ActiveComponent
                                data={resumeData}
                                onUpdate={handleUpdate}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
