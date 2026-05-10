"use client"

import React, { useState, useEffect } from 'react'
import { Section } from '@/types/resume'
import { Switch } from '@/components/ui/switch'
import { getSectionTypeDisplayName, getSectionTypeIcon } from '@/utils/sectionOrdering'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GripVertical, Columns, ChevronUp, ChevronDown } from 'lucide-react'

const getLeftSections = (sections: Section[]) => sections.filter(s => s.column === 1 || (!s.column && ['skills', 'languages'].includes(s.type)))
const getRightSections = (sections: Section[]) => sections.filter(s => s.column === 2 || (!s.column && !['skills', 'languages'].includes(s.type)))

interface ModernSidebarLayoutModalProps {
  sections: Section[]
  onUpdate: (sections: Section[]) => void
}

export const ModernSidebarLayoutModal: React.FC<ModernSidebarLayoutModalProps> = ({
  sections,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localSections, setLocalSections] = useState<Section[]>([])
  
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<1 | 2 | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setLocalSections(sections.map(s => ({
        ...s,
        column: s.column || (['skills', 'languages'].includes(s.type) ? 1 : 2)
    })))
  }, [sections])

  const leftSections = getLeftSections(localSections)
  const rightSections = getRightSections(localSections)

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOverItem = (e: React.DragEvent, id: string, column: 1 | 2) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverId(id)
    setDragOverColumn(column)
  }

  const handleDragOverColumn = (e: React.DragEvent, column: 1 | 2) => {
    e.preventDefault()
    setDragOverId(null)
    setDragOverColumn(column)
  }

  const handleDrop = (e: React.DragEvent, dropId: string | null, targetColumn: 1 | 2) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedId || draggedId === dropId) {
        setDraggedId(null)
        setDragOverId(null)
        setDragOverColumn(null)
        return
    }

    setLocalSections(prev => {
      const draggedSection = prev.find(s => s.id === draggedId)
      if (!draggedSection) return prev
      
      const oldIndex = prev.findIndex(s => s.id === draggedId)
      const newSections = prev.filter(s => s.id !== draggedId)
      const updatedDragged = { ...draggedSection, column: targetColumn as 1 | 2 }
      
      if (dropId) {
        const dropIndexInNew = newSections.findIndex(s => s.id === dropId)
        const dropIndexInOld = prev.findIndex(s => s.id === dropId)
        
        // If moving down within the same column, or moving to a position later in the global list
        const insertIndex = oldIndex < dropIndexInOld ? dropIndexInNew + 1 : dropIndexInNew;
        newSections.splice(insertIndex, 0, updatedDragged)
      } else {
        newSections.push(updatedDragged)
      }
      
      const orderedSections = newSections.map((s, i) => ({ ...s, order: i }))
      onUpdate(orderedSections)
      return orderedSections
    })

    setDraggedId(null)
    setDragOverId(null)
    setDragOverColumn(null)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
    setDragOverColumn(null)
  }

  const moveItemMobile = (sectionId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    setLocalSections(prev => {
        const currentSectionIndex = prev.findIndex(s => s.id === sectionId)
        if (currentSectionIndex === -1) return prev
        const section = prev[currentSectionIndex]
        
        const newSections = [...prev]

        if (direction === 'left' || direction === 'right') {
            newSections[currentSectionIndex] = { ...section, column: direction === 'left' ? 1 : 2 }
        } else {
            // up or down inside the same column
            const columnSections = prev.filter(s => s.column === section.column)
            const colIndex = columnSections.findIndex(s => s.id === sectionId)
            
            if (direction === 'up' && colIndex > 0) {
                const swapWithId = columnSections[colIndex - 1].id
                const swapIndex = prev.findIndex(s => s.id === swapWithId)
                const temp = newSections[currentSectionIndex]
                newSections[currentSectionIndex] = newSections[swapIndex]
                newSections[swapIndex] = temp
            } else if (direction === 'down' && colIndex < columnSections.length - 1) {
                const swapWithId = columnSections[colIndex + 1].id
                const swapIndex = prev.findIndex(s => s.id === swapWithId)
                const temp = newSections[currentSectionIndex]
                newSections[currentSectionIndex] = newSections[swapIndex]
                newSections[swapIndex] = temp
            }
        }
        
        const orderedSections = newSections.map((s, i) => ({ ...s, order: i }))
        onUpdate(orderedSections)
        return orderedSections
    })
  }

  const toggleVisibility = (id: string, checked: boolean) => {
    setLocalSections(prev => {
        const next = prev.map(s => s.id === id ? { ...s, hidden: !checked } : s)
        onUpdate(next)
        return next
    })
  }

  const renderSectionItem = (section: Section, index: number, total: number) => (
    <div
      key={section.id}
      draggable={!isMobile}
      onDragStart={() => handleDragStart(section.id)}
      onDragOver={(e) => handleDragOverItem(e, section.id, section.column as 1 | 2)}
      onDrop={(e) => handleDrop(e, section.id, section.column as 1 | 2)}
      onDragEnd={handleDragEnd}
      className={`
        flex items-center gap-2 p-3 border rounded-lg transition-all duration-200 mb-2 bg-white
        ${draggedId === section.id ? 'opacity-50 scale-95' : ''}
        ${dragOverId === section.id && draggedId !== section.id ? 'border-blue-500 bg-blue-50 -mt-2 pt-5' : ''}
        ${isMobile ? 'cursor-default' : 'cursor-move hover:bg-gray-50'}
      `}
    >
      {isMobile ? (
        <div className="flex flex-col gap-1 mr-1">
          <Button variant="ghost" size="sm" onClick={() => moveItemMobile(section.id, 'up')} disabled={index === 0} className="h-5 w-5 p-0">
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => moveItemMobile(section.id, 'down')} disabled={index === total - 1} className="h-5 w-5 p-0">
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="flex-shrink-0">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      
      <div className="flex-shrink-0 text-gray-500">
        {getSectionTypeIcon(section.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">
          {section.title}
        </div>
        {isMobile && (
            <div className="flex gap-2 mt-1">
                <Button variant="outline" size="sm" className="h-5 text-[10px] px-1" disabled={section.column === 1} onClick={() => moveItemMobile(section.id, 'left')}>To Left</Button>
                <Button variant="outline" size="sm" className="h-5 text-[10px] px-1" disabled={section.column === 2} onClick={() => moveItemMobile(section.id, 'right')}>To Right</Button>
            </div>
        )}
      </div>
      
      <div className="flex items-center gap-1 ml-1 shrink-0">
        <Switch
          checked={!section.hidden}
          onCheckedChange={(checked) => toggleVisibility(section.id, checked)}
          className="scale-75"
        />
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Columns className="w-4 h-4" />
          Manage Layout
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Columns className="w-5 h-5" />
            Modern Sidebar Layout
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          <div className="flex flex-col md:flex-row gap-6 h-full">
            
            {/* Left Column */}
            <div 
                className={`flex-1 min-w-0 flex flex-col border rounded-xl p-4 bg-gray-50 transition-colors ${dragOverColumn === 1 && !dragOverId ? 'border-blue-400 bg-blue-50/50' : ''}`}
                onDragOver={(e) => handleDragOverColumn(e, 1)}
                onDrop={(e) => handleDrop(e, null, 1)}
            >
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-between">
                    Left Sidebar
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{leftSections.length}</span>
                </h3>
                <div className="flex-1 overflow-y-auto min-h-[150px]">
                    {leftSections.map((s, i) => renderSectionItem(s, i, leftSections.length))}
                    {leftSections.length === 0 && (
                        <div className="h-full flex items-center justify-center text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg py-8">
                            Drag sections here
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column */}
            <div 
                className={`flex-1 min-w-0 flex flex-col border rounded-xl p-4 bg-gray-50 transition-colors ${dragOverColumn === 2 && !dragOverId ? 'border-blue-400 bg-blue-50/50' : ''}`}
                onDragOver={(e) => handleDragOverColumn(e, 2)}
                onDrop={(e) => handleDrop(e, null, 2)}
            >
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-between">
                    Main Body
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{rightSections.length}</span>
                </h3>
                <div className="flex-1 overflow-y-auto min-h-[150px]">
                    {rightSections.map((s, i) => renderSectionItem(s, i, rightSections.length))}
                    {rightSections.length === 0 && (
                        <div className="h-full flex items-center justify-center text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg py-8">
                            Drag sections here
                        </div>
                    )}
                </div>
            </div>

          </div>
        </div>

        <div className="text-xs text-gray-500 text-center py-3 border-t mt-4">
          Drag and drop to reorder within columns, or drag between columns to move sections.
        </div>
      </DialogContent>
    </Dialog>
  )
}
