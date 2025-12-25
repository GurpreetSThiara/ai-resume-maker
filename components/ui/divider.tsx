"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Divider({ className, ...props }: DividerProps) {
  return (
    <div
      className={cn("block  border-t border-border my-4", className)}
      {...props}
    />
  );
}
