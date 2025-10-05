"use client";

import React, { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { downloadCoverLetterPDF } from "@/lib/export/cover-letter";
import { downloadCoverLetterDOCX } from "@/lib/export/cover-letter";

const DownloadDropDown = ({ coverLetter, disabled }: { coverLetter: any; disabled: boolean }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Download
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="capitalize cursor-pointer" onClick={() => {
          downloadCoverLetterPDF({
            coverLetter: coverLetter,
            templateName: coverLetter?.formatting?.layout || 'traditional'
          });
        }}>
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem className="capitalize cursor-pointer" onClick={() => {
          downloadCoverLetterDOCX({
            coverLetter: coverLetter,
            templateName: coverLetter?.formatting?.layout || 'traditional'
          });
        }}>
          DOCX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(DownloadDropDown);