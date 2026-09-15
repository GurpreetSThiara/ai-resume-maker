import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getTemplateById, googleTemplate } from '@/lib/templates'
import { RESUME_TEMPLATES } from '@/constants/resumeConstants'


/**
 * Resolves the ?template= parameter to a template.
 *
 * A pure derivation of the URL and the catalog, so it is computed during render
 * rather than copied into state by an effect — which rendered once with the
 * default before correcting itself, and made the URL and the rendered template
 * briefly disagree.
 */
export function useTemplateSelector(availableTemplates: any[]) {
  const searchParams = useSearchParams()
  const tplId = searchParams.get('template')

  return useMemo(() => {
    if (!tplId) return googleTemplate

    const normalize = tplId.replace(/_/g, '-').toLowerCase()

    let found = getTemplateById(normalize)
    if (found) {
      return found
    }

    found = availableTemplates.find((t) => t.id === normalize || t.id === tplId)
    if (found) {
      return found
    }

    const meta = RESUME_TEMPLATES.find((r) => r.id === tplId || r.id === normalize)
    if (meta) {
      const keyword = meta.name.toLowerCase().split(/\s|\-/)[0]
      const byName = availableTemplates.find(
        (t) => t.name.toLowerCase().includes(keyword) || t.id.includes(keyword)
      )
      if (byName) {
        return byName
      }
    }

    const partial = availableTemplates.find(
      (t) => t.id.includes(normalize) || normalize.includes(t.id)
    )
    if (partial) {
      return partial
    }

    return googleTemplate
  }, [tplId, availableTemplates])
}
