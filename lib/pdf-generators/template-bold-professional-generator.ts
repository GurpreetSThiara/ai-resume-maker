import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib"
import { ResumeData, PDFGenerationOptions } from "@/types/resume" // Import PDFGenerationOptions

export async function generateBoldProfessionalResumePDF(options: PDFGenerationOptions): Promise<Uint8Array> {
    const { resumeData, filename } = options
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4
    const { width, height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const colors = {
        primary: rgb(0.117, 0.16, 0.23), // Slate 800
        secondary: rgb(0.27, 0.33, 0.41), // Slate 600
        text: rgb(0.06, 0.09, 0.16), // Slate 900
        white: rgb(1, 1, 1),
        border: rgb(0.8, 0.83, 0.88) // Slate 300
    }

    const margin = 50

    // ** Multi-page strategy **
    // Mutable context for current page and Y position
    let ctx = {
        page,
        y: height,
        font,
        boldFont,
        width,
        height
    }

    const ensureSpace = (heightNeeded: number) => {
        if (ctx.y - heightNeeded < 40) {
            ctx.page = pdfDoc.addPage([595.28, 841.89])
            ctx.y = 841.89 - 50
        }
    }

    // Measure text helper
    const measureText = (text: string, size: number, f: any = ctx.font) => f.widthOfTextAtSize(text, size)

    // Helper to add text and update Y (optional)
    const drawText = (text: string, x: number, y: number, size: number, color: any, f: any = ctx.font, align: 'left' | 'center' | 'right' = 'left') => {
        const width = measureText(text, size, f)
        let drawX = x
        if (align === 'center') drawX -= width / 2
        if (align === 'right') drawX -= width

        ctx.page.drawText(text, { x: drawX, y, size, font: f, color })
        return width
    }

    // Helper that uses current ctx.y
    const drawTextCtx = (text: string, x: number, size: number, color: any, f: any = ctx.font) => {
        ctx.page.drawText(text, { x, y: ctx.y, size, font: f, color })
    }

    // Helper for text wrapping
    const wrapText = (text: string, maxWidth: number, fontSize: number, fontFace: any = ctx.font) => {
        const words = text.split(' ')
        let lines: string[] = []
        let currentLine = words[0]

        for (let i = 1; i < words.length; i++) {
            const word = words[i]
            const width = measureText(currentLine + " " + word, fontSize, fontFace)
            if (width < maxWidth) {
                currentLine += " " + word
            } else {
                lines.push(currentLine)
                currentLine = word
            }
        }
        lines.push(currentLine)
        return lines
    }

    // --- HEADER ---
    // Full width colored background
    const headerHeight = 120 // Fixed height for simplicity, similar to component visually
    const headerY = ctx.height - headerHeight

    ctx.page.drawRectangle({
        x: 0,
        y: headerY,
        width: ctx.width,
        height: headerHeight,
        color: colors.primary,
    })

    let textY = ctx.height - 50 // Start spacing inside header

    // Name
    drawText(resumeData.basics.name, margin, textY, 24, colors.white, ctx.boldFont)
    textY -= 20

    // Contact Info (Wrapped)
    const contactParts = [
        resumeData.basics.email,
        resumeData.basics.phone,
        resumeData.basics.location,
        resumeData.basics.linkedin
    ].filter(Boolean)

    if (contactParts.length > 0) {
        const contactLine = contactParts.join(" | ")
        const contactLines = wrapText(contactLine, ctx.width - (margin * 2), 10, ctx.font)

        for (const line of contactLines) {
            drawText(line, margin, textY, 10, rgb(0.9, 0.9, 0.9), ctx.font)
            textY -= 12
        }
    }

    // --- CONTENT ---
    ctx.y = headerY - 30 // Start content below header

    // Helper for sections
    const drawSectionTitle = (title: string) => {
        // Draw title
        const titleHeight = 16
        drawText(title.toUpperCase(), margin, ctx.y, titleHeight, colors.primary, ctx.boldFont)

        // Draw border line
        ctx.y -= 5
        ctx.page.drawLine({
            start: { x: margin, y: ctx.y },
            end: { x: ctx.width - margin, y: ctx.y },
            thickness: 1.5,
            color: colors.primary,
        })
        ctx.y -= 20 // Spacing after section header
    }

    // 1. SUMMARY
    if (resumeData.basics.summary) {
        ensureSpace(60) // Title + minimum content

        // Title
        drawSectionTitle("Professional Summary")

        // Content
        const maxWidth = ctx.width - (margin * 2)
        const summaryLines = wrapText(resumeData.basics.summary, maxWidth, 11, ctx.font)
        const lineHeight = 15

        for (const line of summaryLines) {
            ensureSpace(lineHeight)
            drawTextCtx(line, margin, 11, colors.text, ctx.font)
            ctx.y -= lineHeight
        }
        ctx.y -= 20
    }


    // 2. EXPERIENCE
    const experienceSection = resumeData.sections.find(s => s.type === 'experience' && !s.hidden)
    if (experienceSection && (experienceSection as any).items.length) {
        ensureSpace(40)
        drawSectionTitle(experienceSection.title)

        // Items
        for (const exp of (experienceSection as any).items) {
            ensureSpace(40) // content check

            // Role & Date
            drawTextCtx(exp.role, margin, 12, colors.text, ctx.boldFont)
            const dateStr = `${exp.startDate} - ${exp.endDate}`
            const dateWidth = measureText(dateStr, 10, ctx.font)
            ctx.page.drawText(dateStr, { x: ctx.width - margin - dateWidth, y: ctx.y, size: 10, font: ctx.font, color: colors.secondary })
            ctx.y -= 14

            // Company & Location
            drawTextCtx(exp.company, margin, 11, colors.secondary, ctx.boldFont)
            if (exp.location) {
                const locWidth = measureText(exp.location, 10, ctx.font)
                ctx.page.drawText(exp.location, { x: ctx.width - margin - locWidth, y: ctx.y, size: 10, font: ctx.font, color: colors.secondary })
            }
            ctx.y -= 12

            // Achievements
            if (exp.achievements) {
                for (const ach of exp.achievements) {
                    const bullet = "•"
                    const maxWidth = ctx.width - (margin * 2) - 15
                    const fontSize = 11
                    const lineHeight = 14

                    const achLines = wrapText(ach, maxWidth, fontSize, ctx.font)

                    // Draw bullet + first line
                    ensureSpace(lineHeight)
                    ctx.page.drawText(bullet, { x: margin + 5, y: ctx.y, size: fontSize, font: ctx.font, color: colors.text })

                    for (let i = 0; i < achLines.length; i++) {
                        if (i > 0) ensureSpace(lineHeight)
                        drawTextCtx(achLines[i], margin + 18, fontSize, colors.text, ctx.font) // Indent text slightly more than bullet
                        ctx.y -= lineHeight
                    }
                }
            }
            ctx.y -= 10
        }
        ctx.y -= 10
    }

    // 3. EDUCATION
    const eduSection = resumeData.sections.find(s => s.type === 'education' && !s.hidden)
    if (eduSection && (eduSection as any).items.length) {
        ensureSpace(40)
        drawSectionTitle(eduSection.title)

        for (const edu of (eduSection as any).items) {
            ensureSpace(40)

            // Institution & Dates
            drawTextCtx(edu.institution, margin, 12, colors.text, ctx.boldFont)
            const dateStr = `${edu.startDate} - ${edu.endDate}`
            const dateWidth = measureText(dateStr, 10, ctx.font)
            ctx.page.drawText(dateStr, { x: ctx.width - margin - dateWidth, y: ctx.y, size: 10, font: ctx.font, color: colors.secondary })
            ctx.y -= 14

            // Degree
            drawTextCtx(edu.degree, margin, 11, colors.secondary, ctx.boldFont)
            ctx.y -= 14

            // Content/Highlights
            if (edu.highlights) {
                for (const h of edu.highlights) {
                    const maxWidth = ctx.width - (margin * 2) - 15
                    const highlightLines = wrapText(h, maxWidth, 11, ctx.font)

                    ensureSpace(14)
                    ctx.page.drawText("•", { x: margin + 5, y: ctx.y, size: 11, font: ctx.font, color: colors.text })

                    for (let i = 0; i < highlightLines.length; i++) {
                        if (i > 0) ensureSpace(14)
                        drawTextCtx(highlightLines[i], margin + 18, 11, colors.text, ctx.font)
                        ctx.y -= 14
                    }
                }
            }
            ctx.y -= 10
        }
        ctx.y -= 10
    }

    // 4. SKILLS
    const skillsSection = resumeData.sections.find(s => s.type === 'skills' && !s.hidden)
    if (skillsSection) {
        ensureSpace(40)
        drawSectionTitle(skillsSection.title)

        const groups = getEffectiveSkillGroupsFromSection(skillsSection as any)

        for (const group of groups) {
            if (group.skills.length === 0) continue
            ensureSpace(20)

            // "Category: Skill, Skill, Skill"
            const catText = group.title === 'General' ? '' : `${group.title}: `
            const skillsText = group.skills.join(", ")

            // Draw Category Bold
            let currentX = margin
            if (catText) {
                ctx.page.drawText(catText, { x: currentX, y: ctx.y, size: 11, font: ctx.boldFont, color: colors.secondary })
                currentX += measureText(catText, 11, ctx.boldFont)
            }

            // Draw Skills Normal (Wrapped)
            const availableWidth = ctx.width - margin - currentX // Space remaining on the line
            const fullWidth = ctx.width - (margin * 2) // Full width for subsequent lines

            // Let's try to fit what we can on the first line
            const words = skillsText.split(' ')
            let firstLine = ''
            let remainingWords: string[] = []

            for (let i = 0; i < words.length; i++) {
                const test = firstLine + words[i] + ' '
                if (measureText(test, 11, ctx.font) < availableWidth) {
                    firstLine = test
                } else {
                    remainingWords = words.slice(i)
                    break
                }
            }

            // Draw first line
            ctx.page.drawText(firstLine, { x: currentX, y: ctx.y, size: 11, font: ctx.font, color: colors.text })
            ctx.y -= 16 // Move down

            // Draw remaining lines (full width)
            if (remainingWords.length > 0) {
                const remainingText = remainingWords.join(' ')
                const remainingLines = wrapText(remainingText, fullWidth, 11, ctx.font)
                for (const line of remainingLines) {
                    ensureSpace(16)
                    drawTextCtx(line, margin, 11, colors.text, ctx.font)
                    ctx.y -= 16
                }
            }
        }
        ctx.y -= 20
    }

    // 5. PROJECTS
    const projectSection = resumeData.sections.find(s => s.type === 'projects' && !s.hidden)
    if (projectSection && (projectSection as any).items.length) {
        ensureSpace(40)
        drawSectionTitle(projectSection.title)

        for (const proj of (projectSection as any).items) {
            ensureSpace(30)
            drawTextCtx(proj.name, margin, 12, colors.text, ctx.boldFont)
            ctx.y -= 14

            if (proj.link) {
                drawTextCtx(`Live demo: ${proj.link}`, margin, 10, rgb(0, 0, 1), ctx.font)
                ctx.y -= 12
            }

            if (proj.repo) {
                drawTextCtx(`Github: ${proj.repo}`, margin, 10, rgb(0, 0, 1), ctx.font)
                ctx.y -= 12
            }

            if (proj.description) {
                for (const d of proj.description) {
                    ensureSpace(14)
                    ctx.page.drawText("• " + d, { x: margin + 15, y: ctx.y, size: 11, font: ctx.font, color: colors.text })
                    ctx.y -= 14
                }
            }
            ctx.y -= 10
        }
    }

    // 6. CERTIFICATIONS (Generic list for now, check items structure)
    // Some templates use 'items' string[] or object[]. Let's assume it might be 'custom' type structure or similar.
    // Usually certifications are 'custom' type in this app or specific.
    // Let's iterate all other sections that are NOT the standard ones we already handled.
    // Standard handled: summary (basics), experience, education, skills, projects.

    // Remaining sections to handle:
    const specificTypes = ['experience', 'education', 'skills', 'projects', 'custom-fields'] // Added custom-fields to exclude from generic loop
    const remainingSections = resumeData.sections.filter(s => !specificTypes.includes(s.type) && !s.hidden)

    for (const section of remainingSections) {
        const contentItems: string[] = (section as any).content || (section as any).items || []
        if (contentItems.length === 0) continue

        ensureSpace(40)
        drawSectionTitle(section.title)

        // LANGUAGES: Comma separated
        if (section.type === 'languages') {
            const languagesText = contentItems.join(", ")
            const maxWidth = ctx.width - (margin * 2)
            const lines = wrapText(languagesText, maxWidth, 11, ctx.font)

            for (const line of lines) {
                ensureSpace(14)
                drawTextCtx(line, margin, 11, colors.text, ctx.font)
                ctx.y -= 14
            }
            ctx.y -= 10
            continue
        }

        // CERTIFICATIONS / CUSTOM: List (Bullet points)
        for (const item of contentItems) {
            let textToDraw = ""
            if (typeof item === 'string') {
                textToDraw = item
            } else if (typeof item === 'object') {
                const vals = Object.values(item).filter(v => typeof v === 'string').join(" - ")
                textToDraw = vals
            }

            if (!textToDraw) continue

            // Wrap text for list items
            const maxWidth = ctx.width - (margin * 2) - 15
            const lines = wrapText(textToDraw, maxWidth, 11, ctx.font)

            ensureSpace(14)
            ctx.page.drawText("•", { x: margin + 5, y: ctx.y, size: 11, font: ctx.font, color: colors.text })

            for (let i = 0; i < lines.length; i++) {
                if (i > 0) ensureSpace(14)
                drawTextCtx(lines[i], margin + 18, 11, colors.text, ctx.font)
                ctx.y -= 14
            }
            ctx.y -= 4
        }
        ctx.y -= 10
    }


    // 7. ADDITIONAL LINKS OR DATA (Custom Fields)
    const customFields = resumeData.custom
    const visibleFields = Object.values(customFields).filter(f => !f.hidden)

    if (visibleFields.length > 0) {
        ensureSpace(40)
        drawSectionTitle("Additional Links or Data")

        let currentX = margin
        const lineHeight = 14
        const maxX = ctx.width - margin

        for (let i = 0; i < visibleFields.length; i++) {
            const field = visibleFields[i]
            const isLast = i === visibleFields.length - 1

            // 1. Draw Title (Bold)
            const titleFull = field.title + ": "
            const titleWidth = measureText(titleFull, 11, ctx.boldFont)

            // Wrap title if needed
            if (currentX + titleWidth > maxX) {
                currentX = margin
                ctx.y -= lineHeight
                ensureSpace(lineHeight)
            }

            ctx.page.drawText(titleFull, { x: currentX, y: ctx.y, size: 11, font: ctx.boldFont, color: colors.secondary })
            currentX += titleWidth

            // 2. Draw Content (Regular) + Comma
            const contentFull = field.content + (isLast ? "" : ", ")

            // Split by words to handle wrapping
            // Note: split(' ') consumes spaces, so we re-add them when drawing, 
            // BUT we must be careful not to double space or trim intentionally.
            // Simple approach: split by space, draw word + space.
            const words = contentFull.split(' ')

            for (let j = 0; j < words.length; j++) {
                const word = words[j]
                if (!word) continue // Skip empty splits

                const wordWithSpace = word + (j < words.length - 1 ? " " : "") // Add space unless last word of this fields content
                // Actually, if we have multiple fields on one line, we want a space AFTER the comma too.
                // The `contentFull` has ", " so the last "word" will be "," or "word,". 
                // Wait, if content is "A B", contentFull is "A B, ".
                // Words: ["A", "B,"] (empty string dropped by continue logic if split results in trailing empty)
                // "A" -> Draw "A "
                // "B," -> Draw "B, " 
                // Then next field starts.
                // If next field starts immediately, `currentX` is at end of "B, ".
                // If next field matches "Title:", it draws "Title:" right after. 
                // We actually need a space after the comma if it's not the end of line.
                // Let's simplified: `contentFull` = "Content" + (isLast ? "" : ","); 
                // Then we manually add a space advancement after drawing the last word?
                // Or just include space in `contentFull` = "Content" + (isLast ? "" : ", "); 

                // Let's stick to `contentFull = field.content + (isLast ? "" : ", ")`
                // Split "Word, " -> ["Word,", ""]
                // "Word," -> width. Draw. 
                // The trailing space in ", " is lost by split.
                // We need to ensure spacing between tokens.

                const width = measureText(wordWithSpace, 11, ctx.font)

                if (currentX + width > maxX) {
                    currentX = margin
                    ctx.y -= lineHeight
                    ensureSpace(lineHeight)
                }

                ctx.page.drawText(wordWithSpace, { x: currentX, y: ctx.y, size: 11, font: ctx.font, color: colors.text })
                currentX += width
            }
        }
        ctx.y -= 10
    }


    // Save PDF
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename || "resume.pdf"
    link.click()

    return pdfBytes
}

// Logic duplication for skill extraction if not imported - copying simplistic version or importing
// Currently importing `getEffectiveSkillGroupsFromSection` from utils but that's valid only if strict module resolution allows.
// Since this file is in `lib`, and `utils` is alias `@/utils`, it should work.

function getEffectiveSkillGroupsFromSection(section: any) {
    // Basic fallback if import fails or running in isolation
    if (section.groups) return section.groups;
    if (section.items) return [{ title: "General", skills: section.items }];
    return [];
}
