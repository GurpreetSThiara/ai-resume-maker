import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from "@pdfme/pdf-lib"
import type { PDFFont } from "@pdfme/pdf-lib"
import type { PDFGenerationOptions, ExperienceSection, EducationSection, ProjectsSection, CustomSection } from "@/types/resume"
import { getSectionsForRendering } from "@/utils/sectionOrdering"
import { getEffectiveSkillGroupsFromSection } from "@/utils/skills"
import { wrapText } from "../pdf-utils"

function sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') return ''
    return text
        .replace(/‑/g, '-')
        .replace(/\u00A0/g, ' ')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '•')
        .replace(/[\u00B0]/g, '°')
        .replace(/[\u00AE]/g, '(R)')
        .replace(/[\u00A9]/g, '(C)')
        .replace(/[\u2122]/g, '(TM)')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/[\uFFFD]/g, '?')
        .trim()
}

function sanitizeWithFont(text: string, font: PDFFont): string {
    const base = sanitizeText(text)
    if (!base) return ''
    try {
        font.encodeText(base)
        return base
    } catch {
        let out = ''
        for (const ch of Array.from(base)) {
            try {
                font.encodeText(ch)
                out += ch
            } catch { }
        }
        return out
    }
}

export async function generateModernSplitResumePDF({
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
    const sidebarWidth = 200
    const sidebarBgColor = rgb(0.06, 0.09, 0.13) // slate-900
    const mainContentWidth = pageWidth - sidebarWidth - 2 * margin
    const mainContentX = sidebarWidth + margin

    // Text colors
    const textColor = rgb(0.15, 0.15, 0.15)
    const sidebarTextColor = rgb(0.85, 0.85, 0.9)
    const sidebarLabelColor = rgb(0.4, 0.7, 1.0) // blue-400
    const headingColor = rgb(0.1, 0.1, 0.2)
    const accentColor = rgb(0.1, 0.4, 0.8) // blue-600
    const dividerColor = rgb(0.9, 0.9, 0.9)
    const sidebarPillBg = rgb(0.2, 0.25, 0.35) // Lighter slate for better contrast

    // State for separate columns
    let sidebarPageIndex = 0
    let sidebarY = pageHeight - margin
    let mainPageIndex = 0
    let mainY = pageHeight - margin

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

    // Initialize first page
    const firstPage = pdfDoc.addPage([pageWidth, pageHeight])
    drawSidebarBackground(firstPage)
    pages.push(firstPage)

    const checkSidebarSpace = (space: number) => {
        if (sidebarY - space < margin) {
            sidebarPageIndex++
            while (sidebarPageIndex >= pages.length) {
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
            while (mainPageIndex >= pages.length) {
                const newPage = pdfDoc.addPage([pageWidth, pageHeight])
                drawSidebarBackground(newPage)
                pages.push(newPage)
            }
            mainY = pageHeight - margin
        }
    }

    const getSidebarPage = () => pages[sidebarPageIndex]
    const getMainPage = () => pages[mainPageIndex]

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
        const annots = page.node.lookup(PDFName.of('Annots'))
        if (annots) (annots as any).push(ref)
        else page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([ref]))
    }

    const drawSidebarItem = (label: string, value: string, isLink: boolean = false, linkPrefix: string = "") => {
        if (!value) return
        checkSidebarSpace(35)
        getSidebarPage().drawText(label.toUpperCase(), { x: margin, y: sidebarY, size: 8, font: boldFont, color: sidebarLabelColor })
        sidebarY -= 12
        const lines = wrapText(value, sidebarWidth - 2 * margin, regularFont, 9)
        for (const line of lines) {
            checkSidebarSpace(12)
            const safe = sanitizeWithFont(line, regularFont)
            getSidebarPage().drawText(safe, { x: margin, y: sidebarY, size: 9, font: regularFont, color: sidebarTextColor })
            if (isLink) addLink(getSidebarPage(), safe, margin, sidebarY, 9, regularFont, linkPrefix + value)
            sidebarY -= 11
        }
        sidebarY -= 8
    }

    // --- RENDER SIDEBAR CONTACT ---
    sidebarY -= 10
    drawSidebarItem("Email", resumeData.basics.email, true, "mailto:")
    drawSidebarItem("Phone", resumeData.basics.phone)
    drawSidebarItem("Location", resumeData.basics.location)
    drawSidebarItem("LinkedIn", resumeData.basics.linkedin, true, "")
    drawSidebarItem("Website", resumeData.basics.website, true, "")
    if (resumeData.custom) {
        Object.values(resumeData.custom).forEach(field => {
            if (!field.hidden && field.content && field.content.length < 50) drawSidebarItem(field.title, field.content)
        })
    }
    sidebarY -= 15

    const renderSectionPdf = (section: any, isSidebar: boolean) => {
        if (section.hidden) return
        let hasContent = false
        if (['experience', 'education', 'projects'].includes(section.type)) hasContent = section.items?.length > 0
        else if (section.type === 'custom') hasContent = section.content?.length > 0
        else if (section.type === 'languages') hasContent = section.items?.length > 0
        else if (section.type === 'skills') hasContent = getEffectiveSkillGroupsFromSection(section).some(g => g.skills.length > 0)
        if (!hasContent) return

        const currentX = isSidebar ? margin : mainContentX
        const currentWidth = isSidebar ? (sidebarWidth - 2 * margin) : mainContentWidth
        const getTargetPage = () => isSidebar ? getSidebarPage() : getMainPage()

        const checkSpace = (space: number) => {
            if (isSidebar) checkSidebarSpace(space)
            else checkMainSpace(space)
        }

        checkSpace(45)
        const y = isSidebar ? sidebarY : mainY
        
        getTargetPage().drawText(sanitizeWithFont(section.title.toUpperCase(), boldFont), { x: currentX, y: y, size: 10, font: boldFont, color: isSidebar ? sidebarLabelColor : headingColor })
        getTargetPage().drawLine({ start: { x: currentX, y: y - 5 }, end: { x: currentX + currentWidth, y: y - 5 }, thickness: 0.5, color: isSidebar ? rgb(0.2, 0.3, 0.4) : dividerColor })
        
        if (isSidebar) sidebarY -= 25
        else mainY -= 25

        if (section.type === 'skills') {
            const groups = getEffectiveSkillGroupsFromSection(section as any)
            for (const group of groups.filter(g => g.skills.length > 0)) {
                if (group.title !== "General") {
                    checkSpace(15)
                    getTargetPage().drawText(sanitizeWithFont(group.title.toUpperCase(), boldFont), { x: currentX, y: isSidebar ? sidebarY : mainY, size: 8, font: boldFont, color: isSidebar ? sidebarTextColor : textColor })
                    if (isSidebar) sidebarY -= 12
                    else mainY -= 12
                }

                let currentPillX = currentX
                for (const skill of group.skills) {
                    const safeSkillBase = sanitizeWithFont(skill, regularFont)
                    const maxPillTextWidth = currentWidth - 12
                    const skillLines = wrapText(safeSkillBase, maxPillTextWidth, regularFont, 9)
                    
                    const skillWidth = Math.max(...skillLines.map(l => regularFont.widthOfTextAtSize(l, 9)))
                    const pillPadding = 6
                    const pillWidth = skillWidth + pillPadding * 2
                    const pillHeight = (skillLines.length * 11) + 4
                    
                    if (currentPillX + pillWidth > currentX + currentWidth) {
                        currentPillX = currentX
                        if (isSidebar) sidebarY -= (pillHeight + 4)
                        else mainY -= (pillHeight + 4)
                    }
                    
                    checkSpace(pillHeight + 4)

                    // Draw pill background
                    getTargetPage().drawRectangle({
                        x: currentPillX,
                        y: (isSidebar ? sidebarY : mainY) - (pillHeight - 11) - 3,
                        width: pillWidth,
                        height: pillHeight,
                        color: isSidebar ? sidebarPillBg : rgb(0.95, 0.95, 0.97),
                    })

                    // Draw text inside pill
                    let lineY = isSidebar ? sidebarY : mainY
                    for (const line of skillLines) {
                        getTargetPage().drawText(line, {
                            x: currentPillX + pillPadding,
                            y: lineY,
                            size: 9,
                            font: regularFont,
                            color: isSidebar ? sidebarTextColor : textColor
                        })
                        lineY -= 11
                    }

                    currentPillX += pillWidth + 4
                    if (skillLines.length > 1) {
                        currentPillX = currentX
                        if (isSidebar) sidebarY -= (pillHeight + 4)
                        else mainY -= (pillHeight + 4)
                    }
                }
                if (isSidebar) sidebarY -= 20
                else mainY -= 20
            }
        } else if (section.type === 'languages') {
            for (const lang of (section as any).items) {
                checkSpace(12)
                getTargetPage().drawText(sanitizeWithFont(lang, regularFont), { x: currentX, y: isSidebar ? sidebarY : mainY, size: 9, font: regularFont, color: isSidebar ? sidebarTextColor : textColor })
                if (isSidebar) sidebarY -= 11
                else mainY -= 11
            }
        } else if (section.type === 'experience') {
            for (const exp of (section as ExperienceSection).items) {
                checkSpace(60)
                const roleLines = wrapText(exp.role, currentWidth - 100, boldFont, 11)
                for (let i=0; i<roleLines.length; i++) {
                    checkSpace(14)
                    getMainPage().drawText(sanitizeWithFont(roleLines[i], boldFont), { x: currentX, y: mainY, size: 11, font: boldFont, color: headingColor })
                    if (i === 0) {
                        const dateText = `${exp.startDate} - ${exp.endDate}`
                        const dateWidth = regularFont.widthOfTextAtSize(dateText, 9)
                        getMainPage().drawText(dateText, { x: currentX + currentWidth - dateWidth, y: mainY, size: 9, font: regularFont, color: rgb(0.5, 0.5, 0.5) })
                    }
                    mainY -= 14
                }
                
                checkSpace(12)
                getMainPage().drawText(sanitizeWithFont(exp.company, boldFont), { x: currentX, y: mainY, size: 10, font: boldFont, color: accentColor })
                if (exp.location) {
                    const locWidth = regularFont.widthOfTextAtSize(exp.location, 9)
                    getMainPage().drawText(sanitizeWithFont(exp.location, regularFont), { x: currentX + currentWidth - locWidth, y: mainY, size: 9, font: regularFont, color: rgb(0.5, 0.5, 0.5) })
                }
                mainY -= 16
                
                if (exp.achievements) {
                    for (const ach of exp.achievements) {
                        const lines = wrapText(`• ${ach}`, currentWidth - 10, regularFont, 9)
                        for (const line of lines) {
                            checkSpace(12)
                            getMainPage().drawText(sanitizeWithFont(line, regularFont), { x: currentX + 10, y: mainY, size: 9, font: regularFont, color: textColor })
                            mainY -= 12
                        }
                    }
                }
                mainY -= 12
            }
        } else if (section.type === 'education') {
            for (const edu of (section as EducationSection).items) {
                checkSpace(55)
                const instLines = wrapText(edu.institution, currentWidth - 100, boldFont, 11)
                for (let i=0; i<instLines.length; i++) {
                    checkSpace(14)
                    getMainPage().drawText(sanitizeWithFont(instLines[i], boldFont), { x: currentX, y: mainY, size: 11, font: boldFont, color: headingColor })
                    if (i === 0) {
                        const dateText = `${edu.startDate} - ${edu.endDate}`
                        const dateWidth = regularFont.widthOfTextAtSize(dateText, 9)
                        getMainPage().drawText(dateText, { x: currentX + currentWidth - dateWidth, y: mainY, size: 9, font: regularFont, color: rgb(0.5, 0.5, 0.5) })
                    }
                    mainY -= 14
                }
                
                checkSpace(12)
                getMainPage().drawText(sanitizeWithFont(edu.degree, regularFont), { x: currentX, y: mainY, size: 10, font: regularFont, color: accentColor })
                mainY -= 14
                if (edu.highlights) {
                    for (const high of edu.highlights) {
                        const lines = wrapText(`• ${high}`, currentWidth - 10, regularFont, 9)
                        for (const line of lines) {
                            checkSpace(12)
                            getMainPage().drawText(sanitizeWithFont(line, regularFont), { x: currentX + 10, y: mainY, size: 9, font: regularFont, color: textColor })
                            mainY -= 12
                        }
                    }
                }
                mainY -= 12
            }
        } else if (section.type === 'projects') {
            for (const proj of (section as ProjectsSection).items) {
                checkSpace(45)
                getMainPage().drawText(sanitizeWithFont(proj.name, boldFont), { x: currentX, y: mainY, size: 11, font: boldFont, color: headingColor })
                mainY -= 14
                if (proj.link) {
                    checkSpace(12)
                    getMainPage().drawText(sanitizeWithFont(proj.link, regularFont), { x: currentX, y: mainY, size: 9, font: regularFont, color: accentColor })
                    addLink(getMainPage(), proj.link, currentX, mainY, 9, regularFont, proj.link)
                    mainY -= 12
                }
                if (proj.description) {
                    for (const desc of proj.description) {
                        const lines = wrapText(`• ${desc}`, currentWidth - 10, regularFont, 9)
                        for (const line of lines) {
                            checkSpace(12)
                            getMainPage().drawText(sanitizeWithFont(line, regularFont), { x: currentX + 10, y: mainY, size: 9, font: regularFont, color: textColor })
                            mainY -= 12
                        }
                    }
                }
                mainY -= 12
            }
        } else if (section.type === 'custom') {
            for (const item of (section as CustomSection).content) {
                const lines = wrapText(`• ${item}`, currentWidth - 10, regularFont, 9)
                for (const line of lines) {
                    checkSpace(12)
                    getMainPage().drawText(sanitizeWithFont(line, regularFont), { x: currentX + 10, y: mainY, size: 9, font: regularFont, color: textColor })
                    mainY -= 12
                }
            }
            mainY -= 12
        }
    }

    const allSections = getSectionsForRendering(resumeData.sections, resumeData.custom)
    const leftSections = allSections.filter(s => s.column === 1 || (!s.column && ['skills', 'languages'].includes(s.type)))
    const rightSections = allSections.filter(s => s.column === 2 || (!s.column && !['skills', 'languages'].includes(s.type)))

    for (const section of leftSections) renderSectionPdf(section, true)

    mainY -= 10
    const nameLines = wrapText(resumeData.basics.name.toUpperCase(), mainContentWidth, boldFont, 32)
    for (const line of nameLines) {
        checkMainSpace(40)
        getMainPage().drawText(sanitizeWithFont(line, boldFont), { x: mainContentX, y: mainY, size: 32, font: boldFont, color: headingColor })
        mainY -= 40
    }
    mainY -= 10
    getMainPage().drawLine({ start: { x: mainContentX, y: mainY + 5 }, end: { x: mainContentX + mainContentWidth, y: mainY + 5 }, thickness: 4, color: headingColor })
    mainY -= 30

    if (resumeData.basics.summary) {
        checkMainSpace(45)
        getMainPage().drawText("PROFESSIONAL PROFILE", { x: mainContentX, y: mainY, size: 10, font: boldFont, color: headingColor })
        mainY -= 6
        getMainPage().drawLine({ start: { x: mainContentX, y: mainY }, end: { x: mainContentX + mainContentWidth, y: mainY }, thickness: 0.5, color: dividerColor })
        mainY -= 18
        const lines = wrapText(resumeData.basics.summary, mainContentWidth, regularFont, 10)
        for (const line of lines) {
            checkMainSpace(13)
            getMainPage().drawText(sanitizeWithFont(line, regularFont), { x: mainContentX, y: mainY, size: 10, font: regularFont, color: textColor })
            mainY -= 13
        }
        mainY -= 25
    }

    for (const section of rightSections) renderSectionPdf(section, false)

    return await pdfDoc.save()
}
