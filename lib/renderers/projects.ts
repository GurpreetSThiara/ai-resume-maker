import type { Project } from '@/types/resume'

// Returns a normalized display representation for a project
export function formatProject(project: Project) {
  const headerParts: string[] = []
  if (project.name) headerParts.push(project.name)
  if (project.link) headerParts.push(project.link)
  if (project.repo) headerParts.push(project.repo)

  const header = headerParts.join('  •  ')
  const descriptions = Array.isArray(project.description) ? project.description.filter(Boolean).map(d => d.trim()) : []

  return { header, descriptions }
}

export function formatProjects(projects: Project[] = []) {
  return projects.map(formatProject)
}
