"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TermsContent } from "@/components/legal/terms-content";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto p-0">
        <div className="p-5 sm:p-6">
          <TermsContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
