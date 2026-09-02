"use client"
import { lineKey } from "@/utils/lineStyle"
import React from 'react'

type Project = {
  name?: string
  link?: string
  repo?: string
  description?: string[]
  startDate?: string
  endDate?: string
}

type Props = {
  projects: Project[]
  sectionId?: string
  // show timeline style (dot + date) — used by timeline template
  showTimelineDates?: boolean
  // styling
  titleClassName?: string
  titleStyle?: React.CSSProperties
  descriptionClassName?: string
  descriptionStyle?: React.CSSProperties
  textColor?: string
  linkColor?: string
  // editing
  contentEditable?: boolean
  onProjectFieldChange?: (sectionId: string | undefined, projectIndex: number, field: string, value: string) => void
  onProjectDescriptionChange?: (sectionId: string | undefined, projectIndex: number, descIndex: number, value: string) => void
  /**
   * Resolves a lineKey to its per-element CSS. Supplied by the editor canvas so
   * project fields honour per-element styling; omitted by the static renderers.
   */
  lineCss?: (key: string) => React.CSSProperties
}

export default function ProjectSection({
  projects,
  sectionId,
  showTimelineDates = false,
  titleClassName = 'font-bold text-[13px]',
  titleStyle,
  descriptionClassName = '',
  descriptionStyle,
  textColor = '#111827',
  linkColor = '#2563eb',
  contentEditable = false,
  onProjectFieldChange,
  onProjectDescriptionChange,
  lineCss,
}: Props) {
  const lc = (key: string): React.CSSProperties => lineCss?.(key) ?? {}
  // Derived via lineKey so the canvas, PDF and DOCX cannot drift apart.
  const pk = (pIdx: number, field: string) => lineKey(sectionId ?? "", { item: pIdx, field })
  const pbk = (pIdx: number, dIdx: number) => lineKey(sectionId ?? "", { item: pIdx, field: "bullet", bullet: dIdx })
  if (!Array.isArray(projects) || projects.length === 0) return null

  return (
    <div className="space-y-2">
      {projects.map((proj, pIdx) => (
        <section key={pIdx} className={showTimelineDates ? 'relative pl-8' : undefined}>
          {showTimelineDates && (
            <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#4299e1',
                  border: '2px solid white',
                  boxShadow: '0 0 0 2px #4299e1',
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              />
              {pIdx < projects.length - 1 && (
                <div
                  style={{
                    width: '2px',
                    flexGrow: 1,
                    backgroundColor: '#cbd5e0',
                    marginTop: '4px',
                  }}
                />
              )}
            </div>
          )}

          <header className={`mb-1 ${showTimelineDates ? '' : ''}`}>
            <span
              className={titleClassName}
              style={{ color: textColor, ...(titleStyle || {}), ...lc(pk(pIdx, 'name')) }}
              data-el="body"
              data-linekey={pk(pIdx, 'name')}
              contentEditable={contentEditable || !!onProjectFieldChange}
              suppressContentEditableWarning
              onBlur={(e) => onProjectFieldChange?.(sectionId, pIdx, 'name', e.currentTarget.textContent || '')}
            >
              {proj.name}
            </span>

            {/* Date range shown only when timeline enabled and dates exist */}
            {showTimelineDates && (proj.startDate || proj.endDate) && (
              <span className="text-xs text-gray-600 ml-4 shrink-0" style={{ color: '#718096', fontSize: '11px' }}>
                <span data-el="body" data-linekey={pk(pIdx, 'startDate')} style={lc(pk(pIdx, 'startDate'))} contentEditable={contentEditable || !!onProjectFieldChange} suppressContentEditableWarning onBlur={(e) => onProjectFieldChange?.(sectionId, pIdx, 'startDate', e.currentTarget.textContent || '')}>{proj.startDate || ''}</span>
                {' - '}
                <span data-el="body" data-linekey={pk(pIdx, 'endDate')} style={lc(pk(pIdx, 'endDate'))} contentEditable={contentEditable || !!onProjectFieldChange} suppressContentEditableWarning onBlur={(e) => onProjectFieldChange?.(sectionId, pIdx, 'endDate', e.currentTarget.textContent || '')}>{proj.endDate || ''}</span>
              </span>
            )}

            {(proj.link || proj.repo) && (
              <div className="ml-2 text-[10px] font-medium align-middle flex flex-wrap gap-x-4 gap-y-1">
                {proj.link && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">Live demo:</span>
                    <a href={proj.link} target="_blank" rel="noreferrer" className="hover:underline ml-2" style={{ color: linkColor }}>
                      {proj.link}
                    </a>
                  </div>
                )}
                {proj.repo && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">Github:</span>
                    <a href={proj.repo} target="_blank" rel="noreferrer" className="hover:underline ml-2" style={{ color: linkColor }}>
                      {proj.repo}
                    </a>
                  </div>
                )}
              </div>
            )}
          </header>

          {Array.isArray(proj.description) && proj.description.length > 0 && (
            <ul className="list-none space-y-1 text-sm text-gray-700 ml-4">
              {proj.description.map((d, dIdx) => (
                <li key={dIdx} className="flex items-start text-sm text-gray-700">
                  {/* Bullet */}
                  <span className={`mr-2 text-gray-500  h-auto p-0 ${descriptionClassName}`}>•</span>

                  {/* Text */}
                  <span
                    className={descriptionClassName}
                    style={{ color: textColor, ...(descriptionStyle || {}), ...lc(pbk(pIdx, dIdx)) }}
                    data-el="body"
                    data-linekey={pbk(pIdx, dIdx)}
                    contentEditable={contentEditable || !!onProjectDescriptionChange}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onProjectDescriptionChange?.(
                        sectionId,
                        pIdx,
                        dIdx,
                        e.currentTarget.textContent || ''
                      )
                    }
                  >
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
