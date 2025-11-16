"use client"

import React, { useState, useEffect } from 'react'
import { Section } from '@/types/resume'
import { Switch } from '@/components/ui/switch'
import { reorderSections, getSectionTypeDisplayName, getSectionTypeIcon } from '@/utils/sectionOrdering'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GripVertical, Settings, ChevronUp, ChevronDown, X } from 'lucide-react'

interface SectionReorderModalProps {
  sections: Section[]
  onReorder: (sections: Section[]) => void
}

export const SectionReorderModal: React.FC<SectionReorderModalProps> = ({
  sections,
  onReorder
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localSections, setLocalSections] = useState<Section[]>(sections)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Update local sections when props change
  useEffect(() => {
    setLocalSections(sections)
  }, [sections])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      const reorderedSections = reorderSections(localSections, draggedIndex, dropIndex)
      setLocalSections(reorderedSections)
      onReorder(reorderedSections)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const moveUp = (index: number) => {
    if (index > 0) {
      const reorderedSections = reorderSections(localSections, index, index - 1)
      setLocalSections(reorderedSections)
      onReorder(reorderedSections)
    }
  }

  const moveDown = (index: number) => {
    if (index < localSections.length - 1) {
      const reorderedSections = reorderSections(localSections, index, index + 1)
      setLocalSections(reorderedSections)
      onReorder(reorderedSections)
    }
  }

  const handleSave = () => {
    onReorder(localSections)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setLocalSections(sections) // Reset to original order
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="">
        <Button variant="outline" className="hover:bg-gray-50">
          <GripVertical className="w-4 h-4" />
          Reorder Sections
        </Button>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Reorder Resume Sections
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 pr-2 overflow-auto">
            {localSections.map((section, index) => (
              <div
                key={section.id}
                draggable={!isMobile}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 
                  ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                  ${dragOverIndex === index && draggedIndex !== index ? 'border-blue-500 bg-blue-50' : ''}
                  ${draggedIndex !== null && draggedIndex !== index ? 'hover:border-gray-300' : ''}
                  ${isMobile ? 'cursor-default' : 'cursor-move hover:bg-gray-50'}
                `}
              >
                {/* Mobile Controls */}
                {isMobile && (
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
                      disabled={index === localSections.length - 1}
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {/* Desktop Drag Handle */}
                {!isMobile && (
                  <div className="flex-shrink-0">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                
                {/* Section Icon */}
                <div className="flex-shrink-0 text-lg">
                  {getSectionTypeIcon(section.type)}
                </div>
                
                {/* Section Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {section.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getSectionTypeDisplayName(section.type)}
                  </div>
                </div>
                
                {/* Visibility Toggle */}
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-xs text-gray-500">Visible</span>
                  <Switch
                    checked={!section.hidden}
                    onCheckedChange={(checked: boolean) => {
                      setLocalSections(prev => {
                        const next = prev.map((s, i) => i === index ? { ...s, hidden: !checked } : s)
                        onReorder(next)
                        return next
                      })
                    }}
                  />
                </div>

                {/* Position Number */}
                <div className="flex-shrink-0 text-sm text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center py-2 border-t">
          {isMobile ? (
            "Use the arrows to reorder sections"
          ) : (
            "Drag and drop sections to reorder them"
          )}
        </div>

        {/* Action Buttons */}
        {/* <div className="flex justify-end gap-3 pt-4 border-t fixed-bottom bg-white mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Order
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  )
}
