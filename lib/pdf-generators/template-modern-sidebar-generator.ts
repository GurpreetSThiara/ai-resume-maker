import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from "pdf-lib"
import type { PDFGenerationOptions, ExperienceSection, EducationSection, ProjectsSection, CustomSection } from "@/types/resume"
import { sanitizeTextForPdf, sanitizeTextForPdfWithFont } from "@/lib/utils"
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
        const words = sanitizeTextForPdf(text).split(" ")
        const lines: string[] = []
        let currentLine = ""

        for (const word of words) {
            const testText = currentLine + (currentLine ? " " : "") + word
            const safeTestText = sanitizeForFont(testText, font)
            const width = font.widthOfTextAtSize(safeTestText, size)

            if (width <= maxWidth) {
                currentLine = testText
            } else {
                if (currentLine) {
                    lines.push(sanitizeForFont(currentLine, font))
                    currentLine = ""
                }
                const wordWidth = font.widthOfTextAtSize(sanitizeForFont(word, font), size)
                if (wordWidth <= maxWidth) {
                    currentLine = word
                } else {
                    // Word split logic
                    let currentWordPart = ""
                    for (const char of word) {
                        const testPart = currentWordPart + char
                        if (font.widthOfTextAtSize(sanitizeForFont(testPart, font), size) <= maxWidth) {
                            currentWordPart = testPart
                        } else {
                            if (currentWordPart) lines.push(sanitizeForFont(currentWordPart, font))
                            currentWordPart = char
                            // Safety for extremely narrow width (single char overflow)
                            if (font.widthOfTextAtSize(char, size) > maxWidth) {
                                lines.push(sanitizeForFont(currentWordPart, font))
                                currentWordPart = ""
                            }
                        }
                    }
                    currentLine = currentWordPart
                }
            }
        }
        if (currentLine) lines.push(sanitizeForFont(currentLine, font))
        return lines
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

    // Name & Title
    // Sidebar Header
    const nameLines = wrapText(resumeData.basics.name, sidebarWidth - 2 * margin, boldFont, 24)
    checkSidebarSpace(nameLines.length * 28 + 20)
    for (const line of nameLines) {
        pages[sidebarPageIndex].drawText(line, {
            x: margin, y: sidebarY, size: 24, font: boldFont, color: headingColor
        })
        sidebarY -= 28
    }
    sidebarY -= 20

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

    // Skills
    const skillsSection = resumeData.sections.find(s => s.type === 'skills' && !s.hidden)
    if (skillsSection) {
        checkSidebarSpace(40)
        pages[sidebarPageIndex].drawText("SKILLS", { x: margin, y: sidebarY, size: 12, font: boldFont, color: headingColor })
        sidebarY -= 15
        pages[sidebarPageIndex].drawLine({
            start: { x: margin, y: sidebarY + 5 },
            end: { x: sidebarWidth - margin, y: sidebarY + 5 },
            thickness: dividerThickness,
            color: dividerColor
        })
        sidebarY -= 10

        const groups = getEffectiveSkillGroupsFromSection(skillsSection as any)
        for (const group of groups.filter(g => g.skills.length > 0)) {
            checkSidebarSpace(20)
            if (group.title !== "General") {
                pages[sidebarPageIndex].drawText(sanitizeForFont(group.title, boldFont), {
                    x: margin, y: sidebarY, size: 10, font: boldFont, color: textColor
                })
                sidebarY -= 12
            }

            for (const skill of group.skills) {
                const lines = wrapText(skill, sidebarWidth - 2 * margin - 10, regularFont, 9)
                checkSidebarSpace(lines.length * 11 + 5)

                pages[sidebarPageIndex].drawText("•", { x: margin, y: sidebarY, size: 10, color: accentColor })
                for (const line of lines) {
                    pages[sidebarPageIndex].drawText(line, { x: margin + 10, y: sidebarY, size: 9, font: regularFont, color: sidebarTextColor })
                    sidebarY -= 11
                }
            }
            sidebarY -= 8
        }
    }

    // Languages
    const languagesSection = resumeData.sections.find(s => s.type === 'languages' && !s.hidden)
    if (languagesSection) {
        const langItems = (languagesSection as any).items
        if (langItems && Array.isArray(langItems) && langItems.length > 0) {
            sidebarY -= 15
            checkSidebarSpace(40)
            pages[sidebarPageIndex].drawText("LANGUAGES", { x: margin, y: sidebarY, size: 12, font: boldFont, color: headingColor })
            sidebarY -= 15
            pages[sidebarPageIndex].drawLine({
                start: { x: margin, y: sidebarY + 5 },
                end: { x: sidebarWidth - margin, y: sidebarY + 5 },
                thickness: dividerThickness,
                color: dividerColor
            })
            sidebarY -= 10

            for (const lang of langItems) {
                const lines = wrapText(lang, sidebarWidth - 2 * margin, regularFont, 9)
                checkSidebarSpace(lines.length * 11)
                for (const line of lines) {
                    pages[sidebarPageIndex].drawText(line, { x: margin, y: sidebarY, size: 9, font: regularFont, color: sidebarTextColor })
                    sidebarY -= 11
                }
            }
        }
    }

    // --- MAIN CONTENT RENDERER ---

    const checkMainSpace = (space: number) => {
        if (mainY - space < margin) {
            mainPageIndex++
            if (mainPageIndex >= pages.length) {
                // Determine if we need to add a page (sidebar didn't go this far)
                const newPage = pdfDoc.addPage([pageWidth, pageHeight])
                // We must draw sidebar bg even if empty, to keep consistency?
                // Or just white? Modern Sidebar usually full height bg.
                drawSidebarBackground(newPage)
                pages.push(newPage)
            }
            // Even if page existed (from sidebar), we reset mainY for the new Main column
            mainY = pageHeight - margin
        }
    }

    // Summary
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

    // Main Sections
    const mainSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
        .filter(s => ['experience', 'education', 'projects', 'custom'].includes(s.type))

    for (const section of mainSections) {
        if (section.hidden) continue

        // Content Check
        let hasContent = false
        if (section.type === 'experience' || section.type === 'education' || section.type === 'projects') {
            const s = section as any
            hasContent = s.items && Array.isArray(s.items) && s.items.length > 0
        } else if (section.type === 'custom') {
            const s = section as any
            hasContent = s.content && Array.isArray(s.content) && s.content.length > 0
        }
        if (!hasContent) continue

        // Header
        checkMainSpace(50)
        pages[mainPageIndex].drawText(section.title.toUpperCase(), {
            x: mainContentX, y: mainY, size: 12, font: boldFont, color: headingColor
        })
        mainY -= 15
        pages[mainPageIndex].drawLine({
            start: { x: mainContentX, y: mainY + 5 },
            end: { x: mainContentWidth + mainContentX, y: mainY + 5 },
            thickness: dividerThickness,
            color: dividerColor
        })
        mainY -= 15

        // Items
        if (section.type === 'experience') {
            const expSection = section as ExperienceSection
            if (expSection.items) {
                for (const exp of expSection.items) {
                    checkMainSpace(40)
                    const p = pages[mainPageIndex]

                    const roleLines = wrapText(exp.role, mainContentWidth - 80, boldFont, 11)
                    for (const line of roleLines) {
                        p.drawText(sanitizeForFont(line, boldFont), { x: mainContentX, y: mainY, size: 11, font: boldFont, color: textColor })
                        mainY -= 14
                    }
                    mainY += 14 // Reset for date positioning

                    const dateText = `${exp.startDate} - ${exp.endDate}`
                    const dateWidth = regularFont.widthOfTextAtSize(dateText, 9)
                    p.drawText(dateText, { x: mainContentX + mainContentWidth - dateWidth, y: mainY, size: 9, font: regularFont, color: sidebarTextColor })

                    mainY -= 12
                    const companyLines = wrapText(exp.company, mainContentWidth - 80, regularFont, 10)
                    for (let i = 0; i < companyLines.length; i++) {
                        p.drawText(sanitizeForFont(companyLines[i], regularFont), { x: mainContentX, y: mainY, size: 10, font: regularFont, color: accentColor })
                        if (i < companyLines.length - 1) mainY -= 12
                    }

                    if (exp.location) {
                        const locText = sanitizeForFont(exp.location, regularFont)
                        const locWidth = regularFont.widthOfTextAtSize(locText, 9) // Using slightly smaller font for location maybe? Or keeping 10. Preview uses 10px vs 12px for company (10px gray).
                        // In preview: text-xs (12px) blue for Company, text-[10px] gray for Location.
                        // Here: Company size 10, Location size 10. Let's make Location 9 to match "text-[10px]" relative difference.
                        p.drawText(locText, {
                            x: mainContentX + mainContentWidth - locWidth,
                            y: mainY,
                            size: 9,
                            font: regularFont,
                            color: sidebarTextColor
                        })
                    }
                    mainY -= 15

                    if (exp.achievements) {
                        for (const ach of exp.achievements) {
                            const lines = wrapText(`• ${ach}`, mainContentWidth - 10, regularFont, 10)
                            checkMainSpace(lines.length * 12)
                            for (const line of lines) {
                                pages[mainPageIndex].drawText(line, { x: mainContentX + 10, y: mainY, size: 10, font: regularFont, color: textColor })
                                mainY -= 12
                            }
                        }
                    }
                    mainY -= 10
                }
            }
        } else if (section.type === 'education') {
            const eduSection = section as EducationSection
            if (eduSection.items) {
                for (const edu of eduSection.items) {
                    checkMainSpace(40)
                    const p = pages[mainPageIndex]

                    const instLines = wrapText(edu.institution, mainContentWidth - 80, boldFont, 11)
                    for (const line of instLines) {
                        p.drawText(sanitizeForFont(line, boldFont), { x: mainContentX, y: mainY, size: 11, font: boldFont, color: textColor })
                        mainY -= 14
                    }
                    mainY += 14 // Reset for date positioning

                    const dateText = `${edu.startDate} - ${edu.endDate}`
                    const dateWidth = regularFont.widthOfTextAtSize(dateText, 9)
                    p.drawText(dateText, { x: mainContentX + mainContentWidth - dateWidth, y: mainY, size: 9, font: regularFont, color: sidebarTextColor })

                    mainY -= 12
                    const degreeLines = wrapText(edu.degree, mainContentWidth, regularFont, 10)
                    for (const line of degreeLines) {
                        p.drawText(sanitizeForFont(line, regularFont), { x: mainContentX, y: mainY, size: 10, font: regularFont, color: accentColor })
                        mainY -= 12
                    }
                    mainY -= 3

                    if (edu.highlights) {
                        for (const high of edu.highlights) {
                            const lines = wrapText(`• ${high}`, mainContentWidth - 10, regularFont, 10)
                            checkMainSpace(lines.length * 12)
                            for (const line of lines) {
                                pages[mainPageIndex].drawText(line, { x: mainContentX + 10, y: mainY, size: 10, font: regularFont, color: textColor })
                                mainY -= 12
                            }
                        }
                    }
                    mainY -= 10
                }
            }
        } else if (section.type === 'projects') {
            const projSection = section as ProjectsSection
            if (projSection.items) {
                for (const proj of projSection.items) {
                    checkMainSpace(40)
                    const p = pages[mainPageIndex]

                    const projLines = wrapText(proj.name, mainContentWidth, boldFont, 11)
                    for (const line of projLines) {
                        p.drawText(sanitizeForFont(line, boldFont), { x: mainContentX, y: mainY, size: 11, font: boldFont, color: textColor })
                        mainY -= 13
                    }

                    if (proj.link) {
                        const shrink = getTextWithShrink(proj.link, mainContentWidth, regularFont, 9)
                        if ((shrink as any).wrap) {
                            const lines = wrapText(proj.link, mainContentWidth, regularFont, 6)
                            for (const line of lines) {
                                p.drawText(line, { x: mainContentX, y: mainY, size: 6, font: regularFont, color: accentColor })
                                addLink(pages[mainPageIndex], line, mainContentX, mainY, 6, regularFont, proj.link)
                                mainY -= 8
                            }
                        } else {
                            p.drawText(shrink.text, { x: mainContentX, y: mainY, size: shrink.size, font: regularFont, color: accentColor })
                            addLink(pages[mainPageIndex], shrink.text, mainContentX, mainY, shrink.size, regularFont, proj.link)
                            mainY -= (shrink.size + 2)
                        }
                    }
                    if (proj.repo) {
                        const shrink = getTextWithShrink(proj.repo, mainContentWidth, regularFont, 9)
                        if ((shrink as any).wrap) {
                            const lines = wrapText(proj.repo, mainContentWidth, regularFont, 6)
                            for (const line of lines) {
                                p.drawText(line, { x: mainContentX, y: mainY, size: 6, font: regularFont, color: accentColor })
                                addLink(pages[mainPageIndex], line, mainContentX, mainY, 6, regularFont, proj.repo)
                                mainY -= 8
                            }
                        } else {
                            p.drawText(shrink.text, { x: mainContentX, y: mainY, size: shrink.size, font: regularFont, color: accentColor })
                            addLink(pages[mainPageIndex], shrink.text, mainContentX, mainY, shrink.size, regularFont, proj.repo)
                            mainY -= (shrink.size + 2)
                        }
                    }
                    mainY -= 2

                    if (proj.description) {
                        for (const desc of proj.description) {
                            const lines = wrapText(`• ${desc}`, mainContentWidth - 10, regularFont, 10)
                            checkMainSpace(lines.length * 12)
                            for (const line of lines) {
                                pages[mainPageIndex].drawText(line, { x: mainContentX + 10, y: mainY, size: 10, font: regularFont, color: textColor })
                                mainY -= 12
                            }
                        }
                    }
                    mainY -= 10
                }
            }
        } else if (section.type === 'custom') {
            const customSection = section as CustomSection
            if (customSection.content) {
                for (const item of customSection.content) {
                    const lines = wrapText(`• ${item}`, mainContentWidth - 10, regularFont, 10)
                    checkMainSpace(lines.length * 12)
                    for (const line of lines) {
                        pages[mainPageIndex].drawText(line, { x: mainContentX + 10, y: mainY, size: 10, font: regularFont, color: textColor })
                        mainY -= 12
                    }
                }
            }
            mainY -= 10
        }
    }

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
}
