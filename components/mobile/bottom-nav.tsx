"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, FileText, User, Plus } from "lucide-react"

/**
 * App-like bottom tab bar for mobile (hidden ≥ md). Primary destinations only;
 * the center "Create" is a raised FAB. Respects the iOS home-indicator safe area.
 */
const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/free-ats-resume-templates", label: "Templates", icon: LayoutGrid, match: (p: string) => p === "/free-ats-resume-templates" },
  { href: "/free-ats-resume-templates/create", label: "Create", icon: Plus, center: true, match: (p: string) => p.startsWith("/free-ats-resume-templates/create") },
  { href: "/cover-letter", label: "Cover", icon: FileText, match: (p: string) => p.startsWith("/cover-letter") },
  { href: "/profile", label: "Profile", icon: User, match: (p: string) => p.startsWith("/profile") },
] as const

export function BottomNav() {
  const pathname = usePathname() || "/"
  // Hide on the focused editor screen — it has its own sticky step bar.
  if (pathname.startsWith("/free-ats-resume-templates/create")) return null
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map((t) => {
          const active = t.match(pathname)
          const Icon = t.icon
          if ("center" in t && t.center) {
            return (
              <li key={t.href} className="flex flex-1 items-center justify-center">
                <Link
                  href={t.href}
                  aria-label={t.label}
                  className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-white active:scale-95 transition"
                >
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </Link>
              </li>
            )
          }
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition ${active ? "text-primary" : "text-gray-400 active:text-gray-600"}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {t.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNav
