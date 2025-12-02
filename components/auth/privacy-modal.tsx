"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PrivacyContent } from "@/components/legal/privacy-content";

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto p-0">
        <div className="p-5 sm:p-6">
          <PrivacyContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
