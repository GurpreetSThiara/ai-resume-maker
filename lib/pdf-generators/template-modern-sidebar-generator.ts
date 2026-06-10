import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from "@pdfme/pdf-lib"
import type { PDFGenerationOptions, ExperienceSection, EducationSection, ProjectsSection, CustomSection } from "@/types/resume"
import { sanitizeTextForPdf, sanitizeTextForPdfWithFont, wrapText as baseWrapText } from "../utils"


import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"

export async function generateModernSidebarResumePDF({
    resumeData,
    filename = "resume.pdf",
}: PDFGenerationOptions) {
    const pdfDoc = await PDFDocument.create()
    const pages: any[] = []

    // Fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Layout constants
    const margin = 30
    const pageWidth = 595.276
    const pageHeight = 841.89
    const sidebarWidth = 180
    const sidebarBgColor = rgb(0.96, 0.96, 0.96)
    const mainContentWidth = pageWidth - sidebarWidth - 2 * margin
    const mainContentX = sidebarWidth + margin

    // Text colors
    const textColor = rgb(0.2, 0.2, 0.2)
    const sidebarTextColor = rgb(0.3, 0.3, 0.3)
    const headingColor = rgb(0.1, 0.1, 0.3)
    const accentColor = rgb(0.2, 0.4, 0.8)
    const dividerColor = rgb(0.85, 0.85, 0.85)
    const dividerThickness = 0.5

    // Helper to draw background
    const drawSidebarBackground = (page: any) => {
        page.drawRectangle({
            x: 0,
            y: 0,
            width: sidebarWidth,
            height: pageHeight,
            color: sidebarBgColor,
        })
    }

    // State for separate columns
    let sidebarPageIndex = 0
    let sidebarY = pageHeight - margin

    let mainPageIndex = 0
    let mainY = pageHeight - margin

    // Initialize first page
    const firstPage = pdfDoc.addPage([pageWidth, pageHeight])
    drawSidebarBackground(firstPage)
    pages.push(firstPage)

    const sanitizeForFont = (text: string, font = regularFont): string => {
        return sanitizeTextForPdfWithFont(text || "", font)
    }

    // Utility: Text wrapping (enhanced with word breaking)
    const wrapText = (text: string, maxWidth: number, font = regularFont, size = 10): string[] => {
        return baseWrapText(text, maxWidth, font, size)
    }



    // Utility: Shrink to fit (for links/emails)
    // Returns { text, size }
    const getTextWithShrink = (text: string, maxWidth: number, font = regularFont, initialSize = 9, minSize = 6) => {
        let size = initialSize
        let safeText = sanitizeForFont(text, font)
        while (size > minSize && font.widthOfTextAtSize(safeText, size) > maxWidth) {
            size -= 0.5
        }
        // If still too big at minSize, fallback to wrap? 
        // For links, better to force split if impossible to fit, but try hard to fit.
        // If it fits, return it.
        if (font.widthOfTextAtSize(safeText, size) <= maxWidth) {
            return { text: safeText, size }
        }
        // If it doesn't fit even at minSize, let's just wrap it naturally using the wrapper but at minSize
        return { text: safeText, size: minSize, wrap: true }
    }

    // --- SIDEBAR RENDERER ---

    const checkSidebarSpace = (space: number) => {
        if (sidebarY - space < margin) {
            sidebarPageIndex++
            if (sidebarPageIndex >= pages.length) {
                const newPage = pdfDoc.addPage([pageWidth, pageHeight])
                drawSidebarBackground(newPage)
                pages.push(newPage)
            }
            sidebarY = pageHeight - margin
        }
    }

    const checkMainSpace = (space: number) => {
        if (mainY - space < margin) {
            mainPageIndex++
            if (mainPageIndex >= pages.length) {
                const newPage = pdfDoc.addPage([pageWidth, pageHeight])
                drawSidebarBackground(newPage)
                pages.push(newPage)
            }
            mainY = pageHeight - margin
        }
    }

    // Helper to add link annotation
    const addLink = (page: any, text: string, x: number, y: number, size: number, font: any, url: string) => {
        const width = font.widthOfTextAtSize(text, size)
        const height = size * 1.2
        const bottom = y - (size * 0.2)

        const link = pdfDoc.context.obj({
            Type: PDFName.of('Annot'),
            Subtype: PDFName.of('Link'),
            Rect: [x, bottom, x + width, bottom + height],
            Border: [0, 0, 0],
            A: {
                Type: PDFName.of('Action'),
                S: PDFName.of('URI'),
                URI: PDFString.of(url),
            },
        })
        const ref = pdfDoc.context.register(link)

        // Robust way to add annotation across pdf-lib versions
        const annots = page.node.lookup(PDFName.of('Annots'))
        if (annots) {
            (annots as any).push(ref)
        } else {
            page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([ref]))
        }
    }

    const drawSidebarItem = (label: string, value: string, isLink: boolean = false, linkPrefix: string = "") => {
        if (!value) return

        // Label
        checkSidebarSpace(25) // Estimate space for label + 1 line of value

        const page = pages[sidebarPageIndex]
        page.drawText(label.toUpperCase(), {
            x: margin,
            y: sidebarY,
            size: 8,
            font: boldFont,
            color: accentColor
        })
        sidebarY -= 12

        // Value - Try shrink first
        const shrinkResult = getTextWithShrink(value, sidebarWidth - 2 * margin, regularFont, 9)
        const fullUrl = linkPrefix + value

        if ((shrinkResult as any).wrap) {
            // It was too big even at min size, wrap it
            const lines = wrapText(value, sidebarWidth - 2 * margin, regularFont, 9)
            // Re-check space for wrapped lines
            checkSidebarSpace(lines.length * 11)
            // Page might have changed in checkSidebarSpace, get current
            const currPage = pages[sidebarPageIndex]
            for (const line of lines) {
                currPage.drawText(line, {
                    x: margin,
                    y: sidebarY,
                    size: 9,
                    font: regularFont,
                    color: sidebarTextColor
                })
                if (isLink) {
                    addLink(currPage, line, margin, sidebarY, 9, regularFont, fullUrl)
                }
                sidebarY -= 11
            }
        } else {
            // Fits on one line
            const currPage = pages[sidebarPageIndex]
            currPage.drawText(shrinkResult.text, {
                x: margin,
                y: sidebarY,
                size: shrinkResult.size,
                font: regularFont,
                color: sidebarTextColor
            })
            if (isLink) {
                addLink(currPage, shrinkResult.text, margin, sidebarY, shrinkResult.size, regularFont, fullUrl)
            }
            sidebarY -= 11
        }
        sidebarY -= 10
    }

    sidebarY -= 10

    // Contact Logic
    drawSidebarItem("Email", resumeData.basics.email, true, "mailto:")
    drawSidebarItem("Phone", resumeData.basics.phone)
    drawSidebarItem("Location", resumeData.basics.location)
    drawSidebarItem("LinkedIn", resumeData.basics.linkedin, true, "") // Already http likely, or we can check. Assuming raw string.

    if (resumeData.custom) {
        Object.values(resumeData.custom).forEach(field => {
            if (!field.hidden) drawSidebarItem(field.title, field.content)
        })
    }
    sidebarY -= 20

    const renderSectionPdf = (section: any, isSidebar: boolean) => {
        if (section.hidden) return

        let hasContent = false
        if (['experience', 'education', 'projects'].includes(section.type)) {
            hasContent = section.items && Array.isArray(section.items) && section.items.length > 0
        } else if (section.type === 'custom') {
            hasContent = section.content && Array.isArray(section.content) && section.content.length > 0
        } else if (section.type === 'languages') {
            hasContent = section.items && Array.isArray(section.items) && section.items.length > 0
        } else if (section.type === 'skills') {
            const groups = getEffectiveSkillGroupsFromSection(section)
            hasContent = groups.some(g => g.skills.length > 0)
        }
        if (!hasContent) return

        const currentX = isSidebar ? margin : mainContentX
        const currentWidth = isSidebar ? (sidebarWidth - 2 * margin) : mainContentWidth
        const getPage = () => pages[isSidebar ? sidebarPageIndex : mainPageIndex]
        
        let y = isSidebar ? sidebarY : mainY
        const updateY = (newY: number) => {
            if (isSidebar) sidebarY = newY
            else mainY = newY
            y = newY
        }

        const checkSpace = (space: number) => {
            if (isSidebar) checkSidebarSpace(space)
            else checkMainSpace(space)
            y = isSidebar ? sidebarY : mainY
        }

        const titleSize = 12
        const titleColor = headingColor
        
        // Header
        checkSpace(40)
        getPage().drawText(section.title.toUpperCase(), {
            x: currentX, y: y, size: titleSize, font: boldFont, color: titleColor
        })
        updateY(y - 15)
        getPage().drawLine({
            start: { x: currentX, y: y + 5 },
            end: { x: currentX + currentWidth, y: y + 5 },
            thickness: dividerThickness,
            color: dividerColor
        })
        updateY(y - (isSidebar ? 10 : 15))

        // Content
        if (section.type === 'skills') {
            const groups = getEffectiveSkillGroupsFromSection(section as any)
            for (const group of groups.filter(g => g.skills.length > 0)) {
                checkSpace(20)
                if (group.title !== "General") {
                    getPage().drawText(sanitizeForFont(group.title, boldFont), {
                        x: currentX, y: y, size: 10, font: boldFont, color: textColor
                    })
                    updateY(y - 12)
                }

                for (const skill of group.skills) {
                    const lines = wrapText(skill, currentWidth - 10, regularFont, 9)
                    checkSpace(lines.length * 11 + 5)

                    getPage().drawText("•", { x: currentX, y: y, size: 10, color: accentColor })
                    for (const line of lines) {
                        getPage().drawText(line, { x: currentX + 10, y: y, size: 9, font: regularFont, color: sidebarTextColor })
                        updateY(y - 11)
                    }
                }
                updateY(y - 8)
            }
        } else if (section.type === 'languages') {
            const langItems = (section as any).items
            for (const lang of langItems) {
                const lines = wrapText(lang, currentWidth, regularFont, 9)
                checkSpace(lines.length * 11)
                for (const line of lines) {
                    getPage().drawText(line, { x: currentX, y: y, size: 9, font: regularFont, color: sidebarTextColor })
                    updateY(y - 11)
                }
            }
        } else if (section.type === 'experience') {
            for (const exp of (section as ExperienceSection).items) {
                checkSpace(40)
                let p = getPage()

                const roleLines = wrapText(exp.role, currentWidth - (isSidebar ? 0 : 80), boldFont, 11)
                for (const line of roleLines) {
                    p.drawText(sanitizeForFont(line, boldFont), { x: currentX, y: y, size: 11, font: boldFont, color: textColor })
                    updateY(y - 14)
                }
                
                const dateText = `${exp.startDate} - ${exp.endDate}`
                if (!isSidebar) {
                    updateY(y + 14 * roleLines.length) // Reset for date positioning if not sidebar
                    const dateWidth = regularFont.widthOfTextAtSize(dateText, 9)
                    p.drawText(dateText, { x: currentX + currentWidth - dateWidth, y: y, size: 9, font: regularFont, color: sidebarTextColor })
                    updateY(y - 14 * roleLines.length)
                } else {
                    p.drawText(dateText, { x: currentX, y: y + 2, size: 9, font: regularFont, color: sidebarTextColor })
                    updateY(y - 12)
                }

                if (!isSidebar) updateY(y + 2) // alignment correction
                
                const companyLines = wrapText(exp.company, currentWidth - (isSidebar ? 0 : 80), regularFont, 10)
                for (let i = 0; i < companyLines.length; i++) {
                    p.drawText(sanitizeForFont(companyLines[i], regularFont), { x: currentX, y: y, size: 10, font: regularFont, color: accentColor })
                    if (i < companyLines.length - 1) updateY(y - 12)
                }

                if (exp.location) {
                    const locText = sanitizeForFont(exp.location, regularFont)
                    if (!isSidebar) {
                        const locWidth = regularFont.widthOfTextAtSize(locText, 9)
                        p.drawText(locText, {
                            x: currentX + currentWidth - locWidth,
                            y: y,
                            size: 9,
                            font: regularFont,
                            color: sidebarTextColor
                        })
                    } else {
                        updateY(y - 12)
                        p.drawText(locText, { x: currentX, y: y, size: 9, font: regularFont, color: sidebarTextColor })
                    }
                }
                updateY(y - 15)

                if (exp.achievements) {
                    for (const ach of exp.achievements) {
                        const lines = wrapText(`• ${ach}`, currentWidth - 10, regularFont, 10)
                        checkSpace(lines.length * 12)
                        for (const line of lines) {
                            getPage().drawText(line, { x: currentX + 10, y: y, size: 10, font: regularFont, color: textColor })
                            updateY(y - 12)
                        }
                    }
                }
                updateY(y - 10)
            }
        } else if (section.type === 'education') {
            for (const edu of (section as EducationSection).items) {
                checkSpace(40)
                let p = getPage()

                const instLines = wrapText(edu.institution, currentWidth - (isSidebar ? 0 : 80), boldFont, 11)
                for (const line of instLines) {
                    p.drawText(sanitizeForFont(line, boldFont), { x: currentX, y: y, size: 11, font: boldFont, color: textColor })
                    updateY(y - 14)
                }
                
                const dateText = `${edu.startDate} - ${edu.endDate}`
                if (!isSidebar) {
                    updateY(y + 14 * instLines.length) // Reset for date positioning
                    const dateWidth = regularFont.widthOfTextAtSize(dateText, 9)
                    p.drawText(dateText, { x: currentX + currentWidth - dateWidth, y: y, size: 9, font: regularFont, color: sidebarTextColor })
                    updateY(y - 14 * instLines.length)
                } else {
                    p.drawText(dateText, { x: currentX, y: y + 2, size: 9, font: regularFont, color: sidebarTextColor })
                    updateY(y - 12)
                }
                
                if (!isSidebar) updateY(y + 2)

                const degreeLines = wrapText(edu.degree, currentWidth, regularFont, 10)
                for (const line of degreeLines) {
                    p.drawText(sanitizeForFont(line, regularFont), { x: currentX, y: y, size: 10, font: regularFont, color: accentColor })
                    updateY(y - 12)
                }
                updateY(y - 3)

                if (edu.highlights) {
                    for (const high of edu.highlights) {
                        const lines = wrapText(`• ${high}`, currentWidth - 10, regularFont, 10)
                        checkSpace(lines.length * 12)
                        for (const line of lines) {
                            getPage().drawText(line, { x: currentX + 10, y: y, size: 10, font: regularFont, color: textColor })
                            updateY(y - 12)
                        }
                    }
                }
                updateY(y - 10)
            }
        } else if (section.type === 'projects') {
            for (const proj of (section as ProjectsSection).items) {
                checkSpace(40)
                let p = getPage()

                const projLines = wrapText(proj.name, currentWidth, boldFont, 11)
                for (const line of projLines) {
                    p.drawText(sanitizeForFont(line, boldFont), { x: currentX, y: y, size: 11, font: boldFont, color: textColor })
                    updateY(y - 13)
                }

                if (proj.link) {
                    const shrink = getTextWithShrink(proj.link, currentWidth, regularFont, 9)
                    if ((shrink as any).wrap) {
                        const lines = wrapText(proj.link, currentWidth, regularFont, 6)
                        for (const line of lines) {
                            p.drawText(line, { x: currentX, y: y, size: 6, font: regularFont, color: accentColor })
                            addLink(getPage(), line, currentX, y, 6, regularFont, proj.link)
                            updateY(y - 8)
                        }
                    } else {
                        p.drawText(shrink.text, { x: currentX, y: y, size: shrink.size, font: regularFont, color: accentColor })
                        addLink(getPage(), shrink.text, currentX, y, shrink.size, regularFont, proj.link)
                        updateY(y - (shrink.size + 2))
                    }
                }
                if (proj.repo) {
                    const shrink = getTextWithShrink(proj.repo, currentWidth, regularFont, 9)
                    if ((shrink as any).wrap) {
                        const lines = wrapText(proj.repo, currentWidth, regularFont, 6)
                        for (const line of lines) {
                            p.drawText(line, { x: currentX, y: y, size: 6, font: regularFont, color: accentColor })
                            addLink(getPage(), line, currentX, y, 6, regularFont, proj.repo)
                            updateY(y - 8)
                        }
                    } else {
                        p.drawText(shrink.text, { x: currentX, y: y, size: shrink.size, font: regularFont, color: accentColor })
                        addLink(getPage(), shrink.text, currentX, y, shrink.size, regularFont, proj.repo)
                        updateY(y - (shrink.size + 2))
                    }
                }
                updateY(y - 2)

                if (proj.description) {
                    for (const desc of proj.description) {
                        const lines = wrapText(`• ${desc}`, currentWidth - 10, regularFont, 10)
                        checkSpace(lines.length * 12)
                        for (const line of lines) {
                            getPage().drawText(line, { x: currentX + 10, y: y, size: 10, font: regularFont, color: textColor })
                            updateY(y - 12)
                        }
                    }
                }
                updateY(y - 10)
            }
        } else if (section.type === 'custom') {
            for (const item of (section as CustomSection).content) {
                const lines = wrapText(`• ${item}`, currentWidth - 10, regularFont, 10)
                checkSpace(lines.length * 12)
                for (const line of lines) {
                    getPage().drawText(line, { x: currentX + 10, y: y, size: 10, font: regularFont, color: textColor })
                    updateY(y - 12)
                }
            }
            updateY(y - 10)
        }
    }

    const allSections = getSectionsForRendering(resumeData.sections, resumeData.custom)

    const leftSections = allSections.filter(s => {
        return s.column === 1 || (!s.column && ['skills', 'languages'].includes(s.type))
    })

    const rightSections = allSections.filter(s => {
        return s.column === 2 || (!s.column && !['skills', 'languages'].includes(s.type))
    })

    // Render left sections
    for (const section of leftSections) {
        renderSectionPdf(section, true)
    }

    // Render Name at the top of the main content (vertically offset)
    mainY -= 20 // Top margin
    const nameLinesMain = wrapText(resumeData.basics.name, mainContentWidth, boldFont, 28)
    checkMainSpace(nameLinesMain.length * 32 + 20)
    for (const line of nameLinesMain) {
        pages[mainPageIndex].drawText(sanitizeForFont(line, boldFont), {
            x: mainContentX,
            y: mainY,
            size: 28,
            font: boldFont,
            color: headingColor
        })
        mainY -= 32
    }
    mainY -= 15

    // Summary (Main content)
    if (resumeData.basics.summary) {
        const lines = wrapText(resumeData.basics.summary, mainContentWidth, regularFont, 10)
        checkMainSpace(lines.length * 12 + 40)

        const page = pages[mainPageIndex]
        page.drawText("PROFESSIONAL SUMMARY", { x: mainContentX, y: mainY, size: 12, font: boldFont, color: headingColor })
        mainY -= 15
        page.drawLine({
            start: { x: mainContentX, y: mainY + 5 },
            end: { x: mainContentWidth + mainContentX, y: mainY + 5 },
            thickness: dividerThickness,
            color: dividerColor
        })
        mainY -= 10

        for (const line of lines) {
            pages[mainPageIndex].drawText(line, { x: mainContentX, y: mainY, size: 10, font: regularFont, color: textColor })
            mainY -= 12
        }
        mainY -= 20
    }

    // Render right sections
    for (const section of rightSections) {
        renderSectionPdf(section, false)
    }

    const pdfBytes = await pdfDoc.save()
    return pdfBytes
}
