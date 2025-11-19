// Centralized localStorage utilities with SSR guards and JSON helpers
import type { ResumeData } from "@/types/resume"
import { validateResumeData } from "@/utils/validateResume"

export const LS_KEYS = {
  resumeData: "resumeData",
  currentStep: "currentStep",
  completedSteps: "completedSteps",
  localResumes: "local_resumes_v1",
  currentResumeId: "currentResumeId",
  coverLetter: (id: string) => `coverLetter_${id}`,
} as const

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage
}

export function getLocalStorageItem(key: string): string | null {
  if (!isBrowser()) return null
  try {
    return window.localStorage.getItem(key)
  } catch (e) {
    console.error("localStorage.getItem failed", e)
    return null
  }
}

export function setLocalStorageItem(key: string, value: string): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, value)
  } catch (e) {
    console.error("localStorage.setItem failed", e)
  }
}

export function removeLocalStorageItem(key: string): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(key)
  } catch (e) {
    console.error("localStorage.removeItem failed", e)
  }
}

export function getLocalStorageJSON<T = unknown>(key: string, fallback: T | null = null): T | null {
  const raw = getLocalStorageItem(key)
  if (raw == null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch (e) {
    console.error("localStorage JSON.parse failed", e)
    return fallback
  }
}

export function setLocalStorageJSON<T = unknown>(key: string, value: T): void {
  try {
    setLocalStorageItem(key, JSON.stringify(value))
  } catch (e) {
    console.error("localStorage setJSON failed", e)
  }
}

export function removeLocalStorageItems(...keys: string[]): void {
  for (const key of keys) {
    removeLocalStorageItem(key)
  }
}


// Safely load resume data from localStorage with schema validation
// If incompatible, clean up related keys to avoid crashes and return null
export function getValidResumeFromLocalStorage(): ResumeData | null {
  const data = getLocalStorageJSON<unknown>(LS_KEYS.resumeData, null)
  if (data == null) return null
  const result = validateResumeData(data)
  if (result.ok) return data as ResumeData
  // Incompatible data detected; remove keys to recover gracefully
  removeLocalStorageItems(
    LS_KEYS.resumeData,
    LS_KEYS.currentStep,
    LS_KEYS.completedSteps,
    LS_KEYS.currentResumeId,
  )
  return null
}

