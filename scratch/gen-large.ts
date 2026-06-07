import { writeFileSync } from "fs"
import { largeResume } from "@/scratch/large-fixture"
import { RESUME_DESIGNS } from "@/lib/resume-designs"
import { generateDesignPDF } from "@/lib/pdf-generators/design-pdf-engine"
import { generateDesignDOCX } from "@/lib/docx-generators/design-docx-engine"
import { getTemplateById } from "@/lib/templates"
const pad = (n: number) => String(n).padStart(2, "0")
async function main() {
  let i = 0; const fails: string[] = []; let maxPages = 0; let maxId = ""
  for (const d of RESUME_DESIGNS) {
    i++; const t = getTemplateById(d.id)!; const base = `${pad(i)}-${d.id}`
    try {
      const pdf = await generateDesignPDF({ resumeData: largeResume, template: t, filename: "x" } as any, d)
      writeFileSync(`preview/largepdfs/${base}.pdf`, Buffer.from(pdf))
      const docx = await generateDesignDOCX({ resumeData: largeResume, template: t, filename: "x" } as any, d)
      writeFileSync(`preview/largedocxs/${base}.docx`, docx)
      // rough page count from PDF /Type /Page occurrences
      const pages = (Buffer.from(pdf).toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length
      if (pages > maxPages) { maxPages = pages; maxId = base }
      console.log(`OK  ${base}  (~${pages}p)`)
    } catch (e: any) { fails.push(`${base}: ${e?.message || e}`); console.log(`FAIL ${base}: ${e?.message || e}`) }
  }
  console.log(`\nGenerated ${i - fails.length}/${i} -> preview/largepdfs + preview/largedocxs`)
  console.log(`Largest: ${maxId} (~${maxPages} pages)`)
  if (fails.length) process.exit(1)
}
main().catch((e) => { console.error(e); process.exit(1) })
