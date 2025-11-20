"use client"

import React from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  Info,
  Keyboard,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

type HotkeysInfoProps = {
  side?: "right" | "left" | "top" | "bottom"
  className?: string
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A component that displays a tooltip containing information about the available hotkeys.
 * @param {HotkeysInfoProps} props - The props object.
 * @param {string} [props.side="right"] - The side of the tooltip.
 * @param {string} [props.className=""] - The class name of the component.
 * @example
 * <HotkeysInfo />
 */
/*******  cc0dcb7b-b072-4ee6-97fd-4a28aa125a43  *******/export function HotkeysInfo({ side = "right", className = "" }: HotkeysInfoProps) {
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <button
          aria-label="Hotkeys"
          className={`
            h-8 w-8 rounded-full 
            bg-white/70 backdrop-blur-md
            border border-gray-200/60
            shadow-sm hover:shadow-md
            transition-all duration-200
            flex items-center justify-center
            text-gray-700 hover:text-black
            ${className}
          `}
        >
          <Info className="w-4 h-4" />
        </button>
      </TooltipTrigger>

      <TooltipContent
        side={side}
        className="
          max-w-xs rounded-xl p-4
          bg-white/90 backdrop-blur-xl 
          border border-gray-200/70
          shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        "
      >
        <div className="flex gap-4 items-start">
          
          {/* Icon Box */}
          <div className="
            p-2 rounded-lg 
            bg-gradient-to-br from-gray-50 to-gray-100 
            border border-gray-200 shadow-sm
          ">
            <Keyboard className="w-5 h-5 text-gray-700" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="font-semibold text-gray-900">
              Keyboard Shortcuts
            </div>

            {/* GROUPED SHORTCUTS */}
            <div className="space-y-1.5 text-sm">
              
              <Shortcut
                keys={[
                  <SquareKey key="ctrl" label="Ctrl" />,
                  <SquareKey key="s" label="S" />,
                ]}
                description="Save locally"
              />

              <Shortcut
                keys={[
                  <SquareKey key="ctrl" label="Ctrl" />,
                  <SquareIcon key="arrow" icon={<ArrowRight size={12} />} />,
                ]}
                description="Next step"
              />

              <Shortcut
                keys={[
                  <SquareKey key="ctrl" label="Ctrl" />,
                  <SquareIcon key="arrow" icon={<ArrowLeft size={12} />} />,
                ]}
                description="Previous step"
              />

            </div>

            <div className="text-xs text-gray-500">
              You can also click any step to jump directly.
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

/* —— KEY CHIP WITH TEXT —— */
function SquareKey({ label }: { label: string }) {
  return (
    <span
      className="
        inline-flex items-center justify-center
        px-2 h-6 min-w-7 rounded-md
        bg-gray-100 text-gray-700
        border border-gray-200
        text-[11px] font-medium
        shadow-sm
      "
    >
      {label}
    </span>
  )
}

/* —— KEY CHIP WITH ICON —— */
function SquareIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <span
      className="
        inline-flex items-center justify-center
        px-2 h-6 min-w-7 rounded-md
        bg-gray-100 text-gray-700
        border border-gray-200
        shadow-sm
      "
    >
      {icon}
    </span>
  )
}

/* —— SHORTCUT ROW —— */
function Shortcut({
  keys,
  description,
}: {
  keys: React.ReactNode[]
  description: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">{keys}</div>
      <span className="text-xs text-gray-600 ml-1">{description}</span>
    </div>
  )
}

export default HotkeysInfo
