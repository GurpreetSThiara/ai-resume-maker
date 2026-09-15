"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModernPortfolio } from "@/components/public/modern-portfolio"
import { generateResumePDF } from "@/lib/pdf-generators"
import { getTemplateById } from "@/lib/templates" // Adjust import path if needed
import { ResumeData } from "@/types/resume"
import { toast } from "@/utils/toast"
import { trackResumeDownloadToSheets } from "@/lib/google-sheets-tracker"
import { MESSAGES } from "@/constants/messages"

interface PortfolioViewProps {
    portfolio: any // Typed properly in real app
}

export function PortfolioView({ portfolio }: PortfolioViewProps) {
    const [isDownloading, setIsDownloading] = useState(false)

    // Extract data and template
    const resumeData = portfolio.data as ResumeData
    const templateId = portfolio.theme?.templateId || "ats-classic"
    const template = getTemplateById(templateId) || getTemplateById("ats-classic")

    if (!template) {
        return <div>Error loading template</div>
    }

    const handleDownload = async (templateId: string = "ats-classic-compact") => {
        setIsDownloading(true)
        try {
            // Find the selected template or fallback to default
            const selectedTemplate = getTemplateById(templateId) || getTemplateById("ats-classic-compact") || template

            if (!selectedTemplate) {
                toast.error(MESSAGES.PORTFOLIO_TEMPLATE_INVALID)
                return
            }

            await generateResumePDF({
                resumeData,
                template: selectedTemplate,
                filename: `${portfolio.slug}-resume.pdf`,
            })

            toast.success(MESSAGES.RESUME_DOWNLOAD_SUCCESS)

            // Track the download in Google Sheets
            // Assuming we don't know the exact user state in public portfolio without useAuth,
            // we will pass false or add useAuth if needed. Currently passing false.
            trackResumeDownloadToSheets({ ...resumeData, template: selectedTemplate }, false);
        } catch (error) {
            console.error("Download error:", error)
            toast.error(MESSAGES.RESUME_DOWNLOAD_FAILED)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <ModernPortfolio
            data={resumeData}
            onDownload={handleDownload}
            isDownloading={isDownloading}
        />
    )
}
