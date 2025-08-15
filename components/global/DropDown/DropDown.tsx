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


const DownloadDropDown = ({data}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
        Download
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="capitalize cursor-pointer" onClick={()=>{
            generateResumePDF({...data , filename:`${data.filename}.pdf`})
        }}>
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem className="capitalize cursor-pointer" onClick={()=>{
            generateResumeDOCX({...data , filename:`${data.filename}.docx`})
        }}>
          DOCX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(DownloadDropDown);
