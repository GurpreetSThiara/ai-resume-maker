import Link from "next/link"
import { Logo } from "./logo"

interface BrandProps {
  className?: string
  logoSize?: number
  textSize?: string
  showText?: boolean
  asLink?: boolean
  textClassName?: string
}

export function Brand({ 
  className = "", 
  logoSize = 32, 
  textSize = "text-2xl",
  showText = true,
  asLink = true,
  textClassName = ""
}: BrandProps) {
  const brandContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo width={logoSize} height={logoSize} className="w-7 h-7" />
      {showText && (
        <div className={`${textSize} font-bold bg-linear-to-r text-primary ${textClassName}`}>
          CreateFreeCV
        </div>
      )}
    </div>
  )

  if (asLink) {
    return <Link href="/">{brandContent}</Link>
  }

  return brandContent
}
