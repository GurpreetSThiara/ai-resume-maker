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

import { generateResumePDF } from "@/lib/pdf-generators"
import { generateResumeDOCX } from "@/lib/docx-generators";
import { getResumeDesign } from "@/lib/resume-designs";
import { SHOW_ERROR, SHOW_SUCCESS } from "@/utils/toast";
import { usePostDownloadReview } from "@/hooks/use-post-download-review";
import { trackResumeDownloadToSheets } from "@/lib/google-sheets-tracker";


import { useAuth } from "@/contexts/auth-context";

const DownloadDropDown = ({ data }: any) => {
  const { triggerReviewModal, ReviewModalComponent } = usePostDownloadReview();
  const { user } = useAuth();

  // Visual designer templates render poorly as DOCX — offer PDF only for them.
  const pdfOnly = !!getResumeDesign(data?.template?.id)?.pdfOnly;

  const handleDownload = async (downloadFunction: () => Promise<void>) => {
    try {
      await downloadFunction();
      SHOW_SUCCESS({ title: "Resume downloaded successfully!" });

      // Track the download in Google Sheets
      trackResumeDownloadToSheets(data, !!user);

      // Trigger review modal after successful download
      setTimeout(() => {
        triggerReviewModal();
      }, 1000);
    } catch (error) {
      console.error('Error downloading resume:', error);
      SHOW_ERROR({ title: "Failed to download resume." });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
          Download
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel>Format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="capitalize cursor-pointer"
            onClick={() => handleDownload(async () => {
              await generateResumePDF({ ...data, filename: `${data.filename}.pdf` });
            })}
          >
            PDF
          </DropdownMenuItem>
          {!pdfOnly && (
            <DropdownMenuItem
              className="capitalize cursor-pointer"
              onClick={() => {
                handleDownload(async () => {
                  await generateResumeDOCX({ ...data, filename: `${data.filename}.docx` });
                });
              }}
            >
              DOCX
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ReviewModalComponent />
    </>
  );
};

export default memo(DownloadDropDown);
