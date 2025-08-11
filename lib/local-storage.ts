export type LocalResumeItem = {
  id: string
  title: string
  data: any
  updatedAt: string
}

const STORAGE_KEY = "local_resumes_v1"

export function getLocalResumes(): LocalResumeItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LocalResumeItem[]) : []
  } catch {
    return []
  }
}

export function saveLocalResume(item: LocalResumeItem) {
  if (typeof window === "undefined") return
  const list = getLocalResumes()
  const idx = list.findIndex((r) => r.id === item.id)
  if (idx >= 0) list[idx] = item
  else list.unshift(item)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function removeLocalResume(id: string) {
  if (typeof window === "undefined") return
  const list = getLocalResumes().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getLocalResume(id: string): LocalResumeItem | null {
  const list = getLocalResumes()
  return list.find((r) => r.id === id) || null
}


