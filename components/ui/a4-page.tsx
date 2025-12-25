"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface A4PageProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, fills available height and centers the A4 page within a scrollable area.
   */
  withOuterWrapper?: boolean;
}

/**
 * A4Page renders its children inside an A4-sized canvas (approx 794x1123 px)
 * and scales responsively so it fits on smaller screens while preserving aspect ratio.
 */
export function A4Page({
  className,
  children,
  withOuterWrapper = false,
  ...props
}: A4PageProps) {
  const page = (
    <div
      className={cn(
        "bg-white shadow-lg font-helvetica",
        // Base A4 size (~96 DPI) with responsive scaling
        "w-[794px] h-[1123px] max-w-full origin-top",
        "scale-[0.4] md:scale-[0.85] lg:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (!withOuterWrapper) return page;

  return (
    <div className="w-full h-full flex justify-center items-start overflow-auto">
      {page}
    </div>
  );
}
