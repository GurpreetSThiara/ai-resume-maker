'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CoverLetterPreview } from './preview';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoverLetterPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoverLetterPreviewModal({ open, onOpenChange }: CoverLetterPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center justify-between">
            Cover Letter Preview
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto flex justify-center items-start">
          <CoverLetterPreview />
        </div>
      </DialogContent>
    </Dialog>
  );
}