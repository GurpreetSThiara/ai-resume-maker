"use client"

import React, { useState } from 'react'
import { Section } from '@/types/resume'
import { reorderSections, getSectionTypeDisplayName, getSectionTypeIcon } from '@/utils/sectionOrdering'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GripVertical, X, ChevronUp, ChevronDown } from 'lucide-react'

interface SectionReorderProps {
  sections: Section[]
  onReorder: (sections: Section[]) => void
  isVisible: boolean
  onToggle: () => void
}

export const SectionReorder: React.FC<SectionReorderProps> = ({
  sections,
  onReorder,
  isVisible,
  onToggle
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }
  
  const handleDragLeave = () => {
    setDragOverIndex(null)
  }
  
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const reorderedSections = reorderSections(sections, draggedIndex, dropIndex)
      onReorder(reorderedSections)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }
  
  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }
  
  if (!isVisible) return null
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reorder Sections</h3>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center gap-3 p-3 border rounded-lg cursor-move
                hover:bg-gray-50 transition-all duration-200
                ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                ${dragOverIndex === index && draggedIndex !== index ? 'border-blue-500 bg-blue-50' : ''}
                ${draggedIndex !== null && draggedIndex !== index ? 'hover:border-gray-300' : ''}
              `}
            >
              <div className="flex-shrink-0">
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex-shrink-0 text-lg">
                {getSectionTypeIcon(section.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {section.title}
                </div>
                <div className="text-sm text-gray-500">
                  {getSectionTypeDisplayName(section.type)}
                </div>
              </div>
              
              <div className="flex-shrink-0 text-sm text-gray-400 font-mono">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Drag and drop sections to reorder them
        </div>
      </CardContent>
    </Card>
  )
}

interface SectionReorderMobileProps {
  sections: Section[]
  onReorder: (sections: Section[]) => void
  isVisible: boolean
  onToggle: () => void
}

export const SectionReorderMobile: React.FC<SectionReorderMobileProps> = ({
  sections,
  onReorder,
  isVisible,
  onToggle
}) => {
  const moveUp = (index: number) => {
    if (index > 0) {
      const reorderedSections = reorderSections(sections, index, index - 1)
      onReorder(reorderedSections)
    }
  }
  
  const moveDown = (index: number) => {
    if (index < sections.length - 1) {
      const reorderedSections = reorderSections(sections, index, index + 1)
      onReorder(reorderedSections)
    }
  }
  
  if (!isVisible) return null
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reorder Sections</h3>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center gap-3 p-3 border rounded-lg bg-white"
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveDown(index)}
                  disabled={index === sections.length - 1}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex-shrink-0 text-lg">
                {getSectionTypeIcon(section.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {section.title}
                </div>
                <div className="text-sm text-gray-500">
                  {getSectionTypeDisplayName(section.type)}
                </div>
              </div>
              
              <div className="flex-shrink-0 text-sm text-gray-400 font-mono">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Use arrows to reorder sections
        </div>
      </CardContent>
    </Card>
  )
}
