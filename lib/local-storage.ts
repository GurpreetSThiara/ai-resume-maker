import type { LocalResumeItem } from "@/types/resume"
import type { ResumeData } from "@/types/resume"
import { LS_KEYS, getLocalStorageJSON, setLocalStorageJSON } from "@/utils/localstorage"

export type { LocalResumeItem }

/**
 * CRUD for browser-saved resumes.
 *
 * Built on the primitives in utils/localstorage.ts rather than touching
 * `localStorage` directly. Previously both modules existed side by side with
 * their own SSR guards, their own try/catch, and — because they declared
 * different keys — different keyspaces, while two pages imported from both.
 */

function readAll(): LocalResumeItem[] {
  const stored = getLocalStorageJSON<LocalResumeItem[]>(LS_KEYS.localResumes, [])
  return Array.isArray(stored) ? stored : []
}

function writeAll(resumes: LocalResumeItem[]): void {
  setLocalStorageJSON(LS_KEYS.localResumes, resumes)
}

function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

export function createLocalResume(data: ResumeData, title?: string): LocalResumeItem {
  const now = new Date().toISOString()
  const newResume: LocalResumeItem = {
    id: generateId(),
    title: title || data.basics?.name || "Untitled Resume",
    data,
    createdAt: now,
    updatedAt: now,
    version: 1,
  }

  writeAll([newResume, ...readAll()])
  return newResume
}

export function getLocalResumes(): LocalResumeItem[] {
  return readAll()
}

export function getLocalResumeById(id: string): LocalResumeItem | null {
  return readAll().find((resume) => resume.id === id) ?? null
}

export function updateLocalResume(
  id: string,
  data: ResumeData,
  title?: string,
): LocalResumeItem | null {
  const resumes = readAll()
  const index = resumes.findIndex((resume) => resume.id === id)
  if (index === -1) return null

  const updated: LocalResumeItem = {
    ...resumes[index],
    data,
    title: title || resumes[index].title,
    updatedAt: new Date().toISOString(),
    version: resumes[index].version + 1,
  }

  resumes[index] = updated
  writeAll(resumes)
  return updated
}

export function deleteLocalResume(id: string): boolean {
  const resumes = readAll()
  const remaining = resumes.filter((resume) => resume.id !== id)
  if (remaining.length === resumes.length) return false

  writeAll(remaining)
  return true
}

export function duplicateLocalResume(id: string): LocalResumeItem | null {
  const original = getLocalResumeById(id)
  if (!original) return null

  return createLocalResume(
    {
      ...original.data,
      basics: { ...original.data.basics, name: `${original.data.basics.name} (Copy)` },
    },
    `${original.title} (Copy)`,
  )
}
