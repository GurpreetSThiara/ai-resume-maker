"use client"

import { ResumeData, SECTION_TYPES, ExperienceSection, ProjectsSection, SkillsSection, EducationSection, LanguagesSection, CertificationsSection, CustomSection } from "@/types/resume"
import { Github, Linkedin, Mail, MapPin, Phone, Download, ExternalLink, Calendar, Building2, Briefcase, Globe, GraduationCap, Award, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { availableTemplates } from "@/lib/templates"

interface ModernPortfolioProps {
    data: ResumeData
    onDownload: (templateId?: string) => void
    isDownloading?: boolean
}

export function ModernPortfolio({ data, onDownload, isDownloading }: ModernPortfolioProps) {
    const { basics, sections } = data

    // Helper to get specific sections
    const getSection = (type: string) => sections.find(s => s.type === type)
    const experienceSection = getSection(SECTION_TYPES.EXPERIENCE) as ExperienceSection | undefined
    const projectsSection = getSection(SECTION_TYPES.PROJECTS) as ProjectsSection | undefined
    const skillsSection = getSection(SECTION_TYPES.SKILLS) as SkillsSection | undefined
    const educationSection = getSection(SECTION_TYPES.EDUCATION) as EducationSection | undefined
    const languagesSection = getSection(SECTION_TYPES.LANGUAGES) as LanguagesSection | undefined
    const certificationsSection = getSection(SECTION_TYPES.CERTIFICATIONS) as CertificationsSection | undefined
    const customSections = sections.filter(s => s.type === SECTION_TYPES.CUSTOM) as CustomSection[]

    // Helper to get initials
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="min-h-screen bg-[#F3F2EF] font-sans pb-12">
            {/* Header / Nav - Minimal */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <span className="font-bold text-lg text-primary tracking-tight"></span>

                    <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                        <span className="font-bold text-lg text-primary tracking-tight">Portfolio</span>

                        <div className="flex items-center rounded-full border shadow-sm">
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isDownloading}
                                className="rounded-l-full rounded-r-none border-r px-4 "
                                onClick={() => onDownload('ats-classic-compact')}
                            >
                                {isDownloading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                Download Resume
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={isDownloading}
                                        className="rounded-l-none rounded-r-full px-2"
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Select Format</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {availableTemplates.map((template) => (
                                        <DropdownMenuItem key={template.id} onClick={() => onDownload(template.id)}>
                                            {template.name}
                                            {template.id === 'ats-classic-compact' && <Badge variant="secondary" className="ml-auto text-xs py-0 h-5">Default</Badge>}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left Column (Main Profile Info) - Spans full width on mobile, 8 cols on desktop */}
                <div className="md:col-span-8 space-y-4">

                    {/* Profile Header Card */}
                    <Card className="overflow-hidden border-none shadow-sm relative">
                        {/* Cover Image Background */}
                        <div className="h-32 md:h-48 bg-gradient-to-r from-blue-700 to-cyan-600 relative">
                            {/* You could add an actual cover image here if available */}
                        </div>

                        <div className="px-6 pb-6 relative">
                            {/* Profile Picture */}
                            <div className="-mt-16 mb-4 inline-block relative">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-md bg-white">
                                    <AvatarImage src="" alt={basics.name} /> {/* Add image source if available */}
                                    <AvatarFallback className="text-4xl bg-slate-200 text-slate-600">{getInitials(basics.name)}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{basics.name}</h1>
                                    <p className="text-md md:text-lg text-slate-600 font-medium mt-1">{basics.summary?.split('.')[0] || "Professional"}</p>

                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-slate-500 mt-2">
                                        {basics.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {basics.location}
                                            </span>
                                        )}
                                        {basics.email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3.5 w-3.5" />
                                                {basics.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2 md:mt-0">
                                    {basics.linkedin && (
                                        <Button size="sm" variant="outline" className="rounded-full text-blue-700 border-blue-700 hover:bg-blue-50" asChild>
                                            <a href={basics.linkedin} target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="h-4 w-4 mr-1.5" /> LinkedIn
                                            </a>
                                        </Button>
                                    )}
                                    {/* Check for Github in custom fields */}
                                    {Object.entries(data.custom).map(([key, field]) => (
                                        field.title.toLowerCase().includes('github') && (
                                            <Button key={key} size="sm" variant="outline" className="rounded-full" asChild>
                                                <a href={field.content} target="_blank" rel="noopener noreferrer">
                                                    <Github className="h-4 w-4 mr-1.5" /> GitHub
                                                </a>
                                            </Button>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* About Section */}
                    {basics.summary && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {basics.summary}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Experience Section */}
                    {experienceSection && !experienceSection.hidden && experienceSection.items.length > 0 && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {experienceSection.items.map((exp, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="mt-1">
                                            <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-slate-500" />
                                            </div>
                                        </div>
                                        <div className="flex-1 pb-6 border-b group-last:border-0 group-last:pb-0 border-slate-100">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-slate-900">{exp.role}</h3>
                                                    <div className="text-slate-700 font-medium">{exp.company}</div>
                                                </div>
                                                <div className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded inline-block">
                                                    {exp.startDate} - {exp.endDate}
                                                </div>
                                            </div>
                                            {exp.location && (
                                                <div className="text-sm text-slate-500 mt-1 mb-2">{exp.location}</div>
                                            )}
                                            {exp.achievements && exp.achievements.length > 0 && (
                                                <ul className="list-disc ml-4 mt-2 space-y-1 text-sm text-slate-600">
                                                    {exp.achievements.slice(0, 4).map((achievement, i) => (
                                                        <li key={i}>{achievement}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Education Section */}
                    {educationSection && !educationSection.hidden && educationSection.items.length > 0 && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Education</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {educationSection.items.map((edu, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="mt-1">
                                            <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                                                <GraduationCap className="h-5 w-5 text-slate-500" />
                                            </div>
                                        </div>
                                        <div className="flex-1 pb-6 border-b group-last:border-0 group-last:pb-0 border-slate-100">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                <div>
                                                    <h3 className="font-semibold text-base text-slate-900">{edu.institution}</h3>
                                                    <div className="text-slate-700">{edu.degree}</div>
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {edu.startDate} - {edu.endDate}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Projects Section */}
                    {projectsSection && !projectsSection.hidden && projectsSection.items.length > 0 && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {projectsSection.items.map((project, index) => (
                                        <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors flex flex-col h-full">
                                            <h3 className="font-semibold text-base">{project.name}</h3>
                                            <div className="text-xs text-muted-foreground mt-1 mb-2">
                                                {project.startDate} {project.endDate ? `- ${project.endDate}` : ''}
                                            </div>
                                            {project.description && (
                                                <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                                                    {project.description[0]}
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-auto">
                                                {project.link && (
                                                    <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-1 h-3 w-3" /> View
                                                        </a>
                                                    </Button>
                                                )}
                                                {project.repo && (
                                                    <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                                        <a href={project.repo} target="_blank" rel="noopener noreferrer">
                                                            <Github className="mr-1 h-3 w-3" /> Code
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Custom Sections */}
                    {customSections.map((section) => (
                        !section.hidden && section.content.length > 0 && (
                            <Card key={section.id} className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">{section.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {section.content.map((text, index) => (
                                        <p key={index} className="text-slate-600 leading-relaxed whitespace-pre-line">
                                            {text}
                                        </p>
                                    ))}
                                </CardContent>
                            </Card>
                        )
                    ))}
                </div>

                {/* Right Column (Sidebar) - Spans 4 cols on desktop */}
                <div className="md:col-span-4 space-y-4">

                    {/* Skills Card */}
                    {skillsSection && !skillsSection.hidden && skillsSection.items.length > 0 && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {skillsSection.items.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-normal px-3 py-1">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    )}

                    {/* Languages Section */}
                    {languagesSection && !languagesSection.hidden && languagesSection.items.length > 0 && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Languages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {languagesSection.items.map((language, index) => (
                                        <div key={index} className="text-slate-700 font-medium">
                                            {language}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Certifications Section */}
                    {certificationsSection && !certificationsSection.hidden && certificationsSection.items.length > 0 && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Certifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc ml-4 text-slate-700">
                                    {certificationsSection.items.map((cert, index) => (
                                        <li key={index}>{cert}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-none shadow-sm sticky top-20">
                        <CardHeader>
                            <CardTitle className="text-lg">Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {basics.email && (
                                <div className="flex items-start gap-3 text-sm text-slate-600">
                                    <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900">Email</span>
                                        <a href={`mailto:${basics.email}`} className="hover:text-primary transition-colors hover:underline text-blue-600">
                                            {basics.email}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {basics.phone && (
                                <div className="flex items-start gap-3 text-sm text-slate-600">
                                    <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900">Phone</span>
                                        <span>{basics.phone}</span>
                                    </div>
                                </div>
                            )}
                            {basics.linkedin && (
                                <div className="flex items-start gap-3 text-sm text-slate-600">
                                    <Linkedin className="h-5 w-5 text-slate-400 mt-0.5" />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900">LinkedIn</span>
                                        <a href={basics.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline text-blue-600">
                                            Profile
                                        </a>
                                    </div>
                                </div>
                            )}
                            {/* Add website if available in custom fields */}
                            {Object.entries(data.custom).map(([key, field]) => (
                                field.title.toLowerCase().includes('website') || field.title.toLowerCase().includes('portfolio') ? (
                                    <div key={key} className="flex items-start gap-3 text-sm text-slate-600">
                                        <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900">{field.title}</span>
                                            <a href={field.content} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline text-blue-600 truncate max-w-[200px]">
                                                {field.content}
                                            </a>
                                        </div>
                                    </div>
                                ) : null
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </main >
        </div >
    )
}
