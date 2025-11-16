import { ResumeData, SECTION_TYPES, Section } from "@/types/resume"

export type ValidationResult = {
  ok: true
} | {
  ok: false
  errors: string[]
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isString(v: unknown): v is string {
  return typeof v === "string"
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(isString)
}

function validateBasics(b: unknown, errors: string[], path = "basics"): b is ResumeData["basics"] {
  if (!isRecord(b)) { errors.push(`${path} must be an object`); return false }
  const required = ["name", "email", "phone", "location", "linkedin", "summary"]
  let ok = true
  for (const key of required) {
    if (!isString(b[key])) { errors.push(`${path}.${key} must be a string`); ok = false }
  }
  return ok
}

function validateSection(section: unknown, errors: string[], index: number): section is Section {
  if (!isRecord(section)) { errors.push(`sections[${index}] must be an object`); return false }
  const { id, title, type } = section
  let ok = true
  if (!isString(id)) { errors.push(`sections[${index}].id must be a string`); ok = false }
  if (!isString(title)) { errors.push(`sections[${index}].title must be a string`); ok = false }
  if (!isString(type)) { errors.push(`sections[${index}].type must be a string`); ok = false; return ok }

  switch (type) {
    case SECTION_TYPES.EDUCATION: {
      const items = section.items
      if (!Array.isArray(items)) { errors.push(`sections[${index}].items must be an array`); ok = false; break }
      for (let i = 0; i < items.length; i++) {
        const it = items[i]
        if (!isRecord(it)) { errors.push(`sections[${index}].items[${i}] must be an object`); ok = false; continue }
        if (!isString(it.institution)) { errors.push(`education[${i}].institution must be a string`); ok = false }
        if (!isString(it.degree)) { errors.push(`education[${i}].degree must be a string`); ok = false }
        if (it.startDate != null && !isString(it.startDate)) { errors.push(`education[${i}].startDate must be a string`); ok = false }
        if (it.endDate != null && !isString(it.endDate)) { errors.push(`education[${i}].endDate must be a string`); ok = false }
        if (it.location != null && !isString(it.location)) { errors.push(`education[${i}].location must be a string`); ok = false }
        if (it.highlights != null && !isStringArray(it.highlights)) { errors.push(`education[${i}].highlights must be string[]`); ok = false }
      }
      break
    }
    case SECTION_TYPES.EXPERIENCE: {
      const items = section.items
      if (!Array.isArray(items)) { errors.push(`sections[${index}].items must be an array`); ok = false; break }
      for (let i = 0; i < items.length; i++) {
        const it = items[i]
        if (!isRecord(it)) { errors.push(`sections[${index}].items[${i}] must be an object`); ok = false; continue }
        if (!isString(it.company)) { errors.push(`experience[${i}].company must be a string`); ok = false }
        if (!isString(it.role)) { errors.push(`experience[${i}].role must be a string`); ok = false }
        if (!isString(it.startDate)) { errors.push(`experience[${i}].startDate must be a string`); ok = false }
        if (!isString(it.endDate)) { errors.push(`experience[${i}].endDate must be a string`); ok = false }
        if (it.location != null && !isString(it.location)) { errors.push(`experience[${i}].location must be a string`); ok = false }
        if (it.achievements != null && !isStringArray(it.achievements)) { errors.push(`experience[${i}].achievements must be string[]`); ok = false }
      }
      break
    }
    case SECTION_TYPES.SKILLS:
    case SECTION_TYPES.LANGUAGES:
    case SECTION_TYPES.CERTIFICATIONS: {
      const items = section.items
      if (!isStringArray(items)) { errors.push(`sections[${index}].items must be string[]`); ok = false }
      break
    }
    case SECTION_TYPES.PROJECTS: {
      const items = (section as any).items
      if (!Array.isArray(items)) { errors.push(`sections[${index}].items must be an array`); ok = false; break }
      for (let i = 0; i < items.length; i++) {
        const it = items[i]
        if (!isRecord(it)) { errors.push(`projects[${i}] must be an object`); ok = false; continue }
        if (!isString(it.name)) { errors.push(`projects[${i}].name must be a string`); ok = false }
        if (it.link != null && !isString(it.link)) { errors.push(`projects[${i}].link must be a string`); ok = false }
        if (it.repo != null && !isString(it.repo)) { errors.push(`projects[${i}].repo must be a string`); ok = false }
        if (it.description != null && !isStringArray(it.description)) { errors.push(`projects[${i}].description must be string[]`); ok = false }
      }
      break
    }
    
    case SECTION_TYPES.CUSTOM: {
      const content = (section as any).content
      if (!isStringArray(content)) { errors.push(`sections[${index}].content must be string[]`); ok = false }
      break
    }
    default:
      errors.push(`sections[${index}].type is invalid: ${type}`)
      ok = false
  }
  return ok
}

export function validateResumeData(data: unknown): ValidationResult {
  const errors: string[] = []
  if (!isRecord(data)) return { ok: false, errors: ["root must be an object"] }

  const { basics, custom, sections } = data
  let ok = true
  ok = validateBasics(basics, errors) && ok

  if (!isRecord(custom)) { errors.push("custom must be an object"); ok = false }
  else {
    for (const [k, v] of Object.entries(custom)) {
      if (!isRecord(v)) { errors.push(`custom.${k} must be an object`); ok = false; continue }
      if (!isString(v.title)) { errors.push(`custom.${k}.title must be a string`); ok = false }
      if (!isString(v.content)) { errors.push(`custom.${k}.content must be a string`); ok = false }
      if (typeof v.hidden !== "boolean") { errors.push(`custom.${k}.hidden must be a boolean`); ok = false }
      if (!isString(v.id)) { errors.push(`custom.${k}.id must be a string`); ok = false }
      if (typeof v.link !== "boolean") { errors.push(`custom.${k}.link must be a boolean`); ok = false }
    }
  }

  if (!Array.isArray(sections)) { errors.push("sections must be an array"); ok = false }
  else {
    for (let i = 0; i < sections.length; i++) {
      if (!validateSection(sections[i], errors, i)) ok = false
    }
  }

  return ok ? { ok: true } : { ok: false, errors }
}
