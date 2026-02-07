import { SECTION_TYPES, type SkillsSection, type SkillGroup } from "@/types/resume"

export interface EffectiveSkillGroup {
  title: string
  skills: string[]
}

/**
 * Returns grouped skills for a given skills section.
 * - If `groups` exist, uses them.
 * - Otherwise, wraps legacy flat `items` into a single "General" group.
 */
export function getEffectiveSkillGroupsFromSection(section: any): EffectiveSkillGroup[] {
  if (!section || section.type !== SECTION_TYPES.SKILLS) return []

  const skillsSection = section as SkillsSection

  if (skillsSection.groups && skillsSection.groups.length > 0) {
    return skillsSection.groups.map((group: SkillGroup) => ({
      title: group.title || "General",
      skills: (group.skills || []).filter((s) => s && s.trim()),
    }))
  }

  return [{
    title: "General",
    skills: (skillsSection.items || []).filter((s) => s && s.trim()),
  }]
}

/**
 * Formats grouped skills as a single line of text, e.g.:
 * "Frontend: React, Vue • Backend: Node, NestJS"
 */
export function formatGroupedSkillsLine(
  groups: EffectiveSkillGroup[],
  groupSeparator: string = " • "
): string {
  return groups
    .filter((g) => g.skills.length > 0)
    .map((g) => `${g.title}: ${g.skills.join(", ")}`)
    .join(groupSeparator)
}


