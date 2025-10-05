export type LocalResumeItem = {
  id: string
  title: string
  data: any
  updatedAt: string
}

import { LS_KEYS, getLocalStorageJSON, setLocalStorageJSON } from "@/utils/localstorage"

export function getLocalResumes(): LocalResumeItem[] {
  const list = getLocalStorageJSON<LocalResumeItem[]>(LS_KEYS.localResumes, [])
  return Array.isArray(list) ? list : []
}

export function saveLocalResume(item: LocalResumeItem) {
  const list = getLocalResumes()
  const idx = list.findIndex((r) => r.id === item.id)
  if (idx >= 0) list[idx] = item
  else list.unshift(item)
  setLocalStorageJSON(LS_KEYS.localResumes, list)
}

export function removeLocalResume(id: string) {
  const list = getLocalResumes().filter((r) => r.id !== id)
  setLocalStorageJSON(LS_KEYS.localResumes, list)
}

export function getLocalResume(id: string): LocalResumeItem | null {
  const list = getLocalResumes()
  return list.find((r) => r.id === id) || null
}


