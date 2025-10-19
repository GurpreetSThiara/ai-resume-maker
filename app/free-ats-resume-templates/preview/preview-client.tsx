"use client"

import { useSearchParams, useRouter } from "next/navigation"
import ResumePreview from "@/components/resume-preview"
import { availableTemplates, getTemplateById } from "@/lib/templates"
import { RESUME_TEMPLATES } from "@/constants/resumeConstants"
import Image from "next/image"
import { useMemo } from "react"
import DownloadDropDown from "@/components/global/DropDown/DropDown"
import Link from "next/link"
import { devopsResumeData1 } from "@/lib/examples/resume/deveops"
import { CREATE_RESUME } from "@/config/urls"

export default function PreviewClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tplId = (searchParams.get("template") || "classic").toString()

  const template = useMemo(() => {
    // normalize common aliases
    const normalized = tplId.replace(/_/g, "-").toLowerCase()
    // try exact lookup first
    const byGet = getTemplateById(normalized)
    if (byGet) return byGet

    // fallback mapping: 'classic' maps to 'ats-classic' in our templates list
    if (normalized === "classic") return getTemplateById("ats-classic") || availableTemplates[0]

    // try find by includes
    return availableTemplates.find((t) => t.id === normalized || t.id.includes(normalized)) || availableTemplates[0]
  }, [tplId])

  // minimal resume data for preview; the preview component expects a full ResumeData shape
  const sampleData = devopsResumeData1

  const templateMeta = RESUME_TEMPLATES.find((r) => r.id === template.id) || (template as any)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="px-3 py-2 rounded-md bg-white border">Back</button>
            <h1 className="text-2xl font-semibold">Preview — {template.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <DownloadDropDown data={{ resumeData: sampleData, template, filename: `resume-preview-${template.id}` }} />
            <Link href={`${CREATE_RESUME}`} className="px-3 py-2 rounded-md bg-white border">Choose another template</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 p-4 bg-white border rounded">
            <div className="flex items-start gap-3">
              <div className="w-20 h-28 bg-gray-100 rounded overflow-hidden">
                <Image src={templateMeta?.url || '/placeholder.jpg'} alt={template.name} width={160} height={220} className="object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{template.name}</h2>
                <div className="text-sm text-muted-foreground">{template.description}</div>
                <div className="mt-2 text-xs inline-flex items-center px-2 py-0.5 rounded bg-accent text-accent-foreground">{template.id}</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <h3 className="font-medium">Suggested for</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {(templateMeta?.suggestedFor || []).map((s: string) => (
                  <span key={s} className="text-xs px-2 py-1 bg-gray-100 rounded">{s}</span>
                ))}
              </div>

              <h3 className="font-medium mt-4">Contact</h3>
              <ul className="ml-3 list-disc">
                <li><a className="text-blue-600 hover:underline" href={`mailto:${sampleData.basics.email}`}>{sampleData.basics.email}</a></li>
                <li><a className="text-blue-600 hover:underline" href={sampleData.basics.linkedin}>{sampleData.basics.linkedin}</a></li>
              </ul>

              <h3 className="font-medium mt-4">Top sections</h3>
              <ul className="ml-3 list-disc">
                {sampleData.sections.slice(0,3).map((s:any) => (
                  <li key={s.id} className="capitalize">{s.title}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-2 bg-white border rounded shadow">
            <ResumePreview resumeData={sampleData as any} template={template} onDataUpdate={()=>{}} activeSection="" setResumeData={()=>{}} className="min-h-[800px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
