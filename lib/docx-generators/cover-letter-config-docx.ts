import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type IBorderOptions,
} from "docx"
import type { CoverLetter } from "@/types/cover-letter"
import type { TemplateStyle } from "@/lib/config/cover-letter-templates"
import { format } from "date-fns"

// Shared, config-driven cover letter DOCX generator — the Word counterpart
// of lib/pdf-generators/cover-letter-config-generator.ts.

const GRAY = "595959"

export async function generateConfigCoverLetterDOCX(
  coverLetter: CoverLetter,
  style: TemplateStyle
): Promise<Uint8Array> {
  const fontName = style.font === 'times' ? 'Times New Roman' : 'Helvetica'
  const accentHex = style.accentHex.toUpperCase()
  const compact = !!style.compact
  const bodySize = compact ? 21 : 22 // half-points
  const bodySpacing = compact ? 120 : 180

  const { applicant, recipient, content } = coverLetter
  const yourName = `${applicant.firstName} ${applicant.lastName}`.trim()
  const displayName = style.nameUppercase ? yourName.toUpperCase() : yourName
  const initials = `${applicant.firstName.charAt(0)}${applicant.lastName.charAt(0)}`.toUpperCase()
  const { email, phone, address, linkedin } = applicant.contactInfo
  const contactLine = [phone, email, linkedin].filter(Boolean).join('  |  ')

  const run = (text: string, opts: { bold?: boolean; size?: number; color?: string } = {}) =>
    new TextRun({
      text,
      font: fontName,
      size: opts.size ?? bodySize,
      bold: opts.bold,
      color: opts.color ?? '000000',
    })

  const para = (
    children: TextRun[],
    opts: {
      after?: number
      align?: (typeof AlignmentType)[keyof typeof AlignmentType]
      shadeFill?: string
      border?: { bottom: IBorderOptions }
    } = {}
  ) =>
    new Paragraph({
      children,
      alignment: opts.align,
      spacing: { after: opts.after ?? 60 },
      shading: opts.shadeFill ? { fill: opts.shadeFill } : undefined,
      border: opts.border,
    })

  const ruleBorder = (): { bottom: IBorderOptions } => ({
    bottom: {
      style: style.rule === 'double' ? BorderStyle.DOUBLE : BorderStyle.SINGLE,
      size: style.rule === 'double' ? 12 : 6,
      color: accentHex,
    },
  })

  // ---- Letter body (shared by every layout) -----------------------------

  const letterBody: Paragraph[] = []

  letterBody.push(
    para([run(format(new Date(content.date), 'MMMM d, yyyy'))], { after: 240 })
  )

  if (recipient.name) letterBody.push(para([run(recipient.name, { bold: true })]))
  if (recipient.title) letterBody.push(para([run(recipient.title)]))
  if (recipient.company) letterBody.push(para([run(recipient.company)]))
  if (recipient.address) {
    for (const line of recipient.address.split('\n')) letterBody.push(para([run(line)]))
  }
  if (recipient.name || recipient.title || recipient.company || recipient.address) {
    letterBody.push(para([], { after: 120 }))
  }

  if (content.salutation) {
    letterBody.push(para([run(content.salutation)], { after: bodySpacing }))
  }

  const paragraphs = [
    content.openingParagraph.text,
    ...content.bodyParagraphs.map((p) => p.text),
    content.closingParagraph.text,
  ].filter(Boolean)

  for (const text of paragraphs) {
    letterBody.push(para([run(text)], { after: bodySpacing }))
  }

  letterBody.push(
    para([run(content.complimentaryClose || 'Sincerely,')], { after: 240 }),
    para([run(yourName, { bold: true, color: accentHex })])
  )

  // ---- Header per layout -------------------------------------------------

  const header: Paragraph[] = []
  let children: (Paragraph | Table)[]

  const headerRulePara = () => {
    if (style.rule && style.rule !== 'none') {
      header.push(para([], { after: 240, border: ruleBorder() }))
    } else {
      header.push(para([], { after: 180 }))
    }
  }

  switch (style.headerLayout) {
    case 'centered': {
      if (style.monogram) {
        header.push(
          para([run(initials, { bold: true, size: 56, color: accentHex })], {
            align: AlignmentType.CENTER,
            after: 120,
          })
        )
      }
      header.push(
        para([run(displayName, { bold: true, size: 36, color: accentHex })], {
          align: AlignmentType.CENTER,
          after: 80,
        })
      )
      if (applicant.professionalTitle)
        header.push(
          para([run(applicant.professionalTitle, { size: 22, color: GRAY })], {
            align: AlignmentType.CENTER,
            after: 80,
          })
        )
      if (contactLine)
        header.push(
          para([run(contactLine, { size: 20, color: GRAY })], {
            align: AlignmentType.CENTER,
            after: 60,
          })
        )
      if (address)
        header.push(
          para([run(address.replace(/\n/g, ', '), { size: 20, color: GRAY })], {
            align: AlignmentType.CENTER,
            after: 60,
          })
        )
      headerRulePara()
      children = [...header, ...letterBody]
      break
    }

    case 'banner': {
      const light = 'DDE3EA'
      header.push(
        para([run(displayName, { bold: true, size: 36, color: 'FFFFFF' })], {
          shadeFill: accentHex,
          after: 0,
        })
      )
      if (applicant.professionalTitle)
        header.push(
          para([run(applicant.professionalTitle, { size: 22, color: light })], {
            shadeFill: accentHex,
            after: 0,
          })
        )
      if (contactLine)
        header.push(
          para([run(contactLine, { size: 20, color: light })], {
            shadeFill: accentHex,
            after: 0,
          })
        )
      header.push(para([], { after: 240 }))
      children = [...header, ...letterBody]
      break
    }

    case 'sidebar': {
      // Two-column table: colored contact sidebar + letter body.
      const noBorder: IBorderOptions = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
      const sidebarParas: Paragraph[] = [
        para([run(displayName, { bold: true, size: 30, color: 'FFFFFF' })], { after: 80 }),
      ]
      if (applicant.professionalTitle)
        sidebarParas.push(
          para([run(applicant.professionalTitle, { size: 20, color: 'D6E0F5' })], { after: 240 })
        )
      sidebarParas.push(para([run('CONTACT', { bold: true, size: 18, color: 'D6E0F5' })], { after: 120 }))
      for (const item of [phone, email, linkedin].filter(Boolean) as string[]) {
        sidebarParas.push(para([run(item, { size: 19, color: 'FFFFFF' })], { after: 80 }))
      }
      if (address) {
        for (const line of address.split('\n')) {
          sidebarParas.push(para([run(line, { size: 19, color: 'FFFFFF' })], { after: 40 }))
        }
      }

      const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: noBorder,
          bottom: noBorder,
          left: noBorder,
          right: noBorder,
          insideHorizontal: noBorder,
          insideVertical: noBorder,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                shading: { fill: accentHex },
                margins: { top: 240, bottom: 240, left: 240, right: 240 },
                children: sidebarParas,
              }),
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                margins: { top: 240, bottom: 240, left: 360, right: 120 },
                children: letterBody,
              }),
            ],
          }),
        ],
      })
      children = [table]
      break
    }

    case 'split':
    case 'left':
    case 'accent-bar':
    default: {
      header.push(
        para([run(displayName, { bold: true, size: compact ? 28 : 32, color: accentHex })], {
          after: 80,
        })
      )
      if (applicant.professionalTitle)
        header.push(para([run(applicant.professionalTitle, { size: 21, color: GRAY })], { after: 80 }))
      if (address)
        header.push(para([run(address.replace(/\n/g, ', '), { size: 20, color: GRAY })], { after: 60 }))
      if (contactLine)
        header.push(para([run(contactLine, { size: 20, color: GRAY })], { after: 60 }))
      headerRulePara()
      children = [...header, ...letterBody]
      break
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  })

  return await Packer.toBuffer(doc)
}
