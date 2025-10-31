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
import { SHOW_ERROR, SHOW_SUCCESS } from "@/utils/toast";
import { usePostDownloadReview } from "@/hooks/use-post-download-review";
import { loadInterstitialAd } from "@/components/ads/InterstitialAd";


const DownloadDropDown = ({data}) => {
  const { triggerReviewModal, ReviewModalComponent } = usePostDownloadReview();

  const handleDownload = async (downloadFunction: () => Promise<void>) => {
    try {
      await downloadFunction();
      SHOW_SUCCESS({title: "Resume downloaded successfully!"});
      
      // Trigger review modal after successful download
      setTimeout(() => {
        triggerReviewModal();
      }, 1000);
    } catch (error) {
      console.error('Error downloading resume:', error);
      SHOW_ERROR({title: "Failed to download resume."});
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
              await generateResumePDF({...data, filename:`${data.filename}.pdf`});
              try {
                setTimeout(() => {
                  loadInterstitialAd('10097033');
                }, 100);
              } catch(e) {
                console.error("[PropellerAd] Failed to load ad after PDF", e);
              }
            })}
          >
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="capitalize cursor-pointer"
            disabled={!['ats-classic', 'google-docs'].includes(data.template.name)}
            style={{
              cursor: !['ats-classic', 'google-docs'].includes(data.template.name) ? 'not-allowed' : 'pointer'
            }}
            onClick={() => {
              if (['ats-classic', 'google-docs'].includes(data.template.name)) {
                handleDownload(async () => {
                  await generateResumeDOCX({ ...data, filename: `${data.filename}.docx` });
                  try {
                    setTimeout(() => {
                      loadInterstitialAd('10097033');
                    }, 100);
                  } catch(e) {
                    console.error("[PropellerAd] Failed to load ad after DOCX", e);
                  }
                });
              }
            }}
          >
            DOCX
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ReviewModalComponent />
    </>
  );
};

export default memo(DownloadDropDown);
