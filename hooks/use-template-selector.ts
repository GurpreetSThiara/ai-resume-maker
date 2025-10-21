import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getTemplateById, googleTemplate } from '@/lib/templates'
import { RESUME_TEMPLATES } from '@/constants/resumeConstants'


export function useTemplateSelector(availableTemplates: any[]) {
  const searchParams = useSearchParams()
  const [selectedTemplate, setSelectedTemplate] = useState<any>(googleTemplate)

  useEffect(() => {
    const tplId = searchParams.get('template')
    if (!tplId) return

    const normalize = tplId.replace(/_/g, '-').toLowerCase()

    let found = getTemplateById(normalize)
    if (found) {
      setSelectedTemplate(found)
      return
    }

    found = availableTemplates.find((t) => t.id === normalize || t.id === tplId)
    if (found) {
      setSelectedTemplate(found)
      return
    }

    const meta = RESUME_TEMPLATES.find((r) => r.id === tplId || r.id === normalize)
    if (meta) {
      const keyword = meta.name.toLowerCase().split(/\s|\-/)[0]
      const byName = availableTemplates.find(
        (t) => t.name.toLowerCase().includes(keyword) || t.id.includes(keyword)
      )
      if (byName) {
        setSelectedTemplate(byName)
        return
      }
    }

    const partial = availableTemplates.find(
      (t) => t.id.includes(normalize) || normalize.includes(t.id)
    )
    if (partial) {
      setSelectedTemplate(partial)
      return
    }

    setSelectedTemplate(googleTemplate)
  }, [searchParams, availableTemplates])

  return selectedTemplate
}
