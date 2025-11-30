"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PdfUploadModalProps {
  onFileUpload: (file: File) => void
  isLoading: boolean
  status?: string
}

export function PdfUploadModal({ onFileUpload, isLoading, status }: PdfUploadModalProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const validateFileSize = (file: File): boolean => {
    const maxSizeMB = 1
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      alert(`File size exceeds ${maxSizeMB}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return false
    }
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type === "application/pdf") {
        if (validateFileSize(file)) {
          onFileUpload(file)
        }
      } else {
        alert("Please drop a PDF file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      if (validateFileSize(files[0])) {
        onFileUpload(files[0])
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleOpenChange = (open: boolean) => {
    if (isLoading) return
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="hover:bg-primary-400 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          disabled={isLoading}
        >
          <Upload className="w-5 h-5" />
          Choose PDF File
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Upload PDF</DialogTitle>
              <DialogDescription>Drag and drop or click to select a PDF file</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-slate-400"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-lg transition-colors ${isDragActive ? "bg-blue-200" : "bg-slate-200"}`}>
                <Upload className={`w-6 h-6 ${isDragActive ? "text-blue-600" : "text-slate-600"}`} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
                </p>
                <p className="text-sm text-slate-500 mt-1">or click to browse</p>
              </div>
            </div>

            {/* Click overlay */}
            <button onClick={handleClick} disabled={isLoading} className="absolute inset-0 rounded-xl" />
          </div>

          {/* Info Text */}
          <p className="text-xs text-slate-500 text-center">Supported format: PDF • Max size: 1MB</p>

          {/* Loading State */}
          {isLoading && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-blue-700">{status || "Processing PDF..."}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleClick}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (status || "Processing...") : "Select File"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

