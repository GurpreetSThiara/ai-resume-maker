"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Home, Plus, User, LogOut, User2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" aria-hidden="true" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Resume Builder
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Home
            </Link>
            { (
              <Link
                href="/create"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === "/create" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Create Resume
              </Link>
            )}

            <Link
                href="/cover-letter"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith("/cover-letter") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Cover Letter
              </Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <User className="w-4 h-4" aria-hidden="true" />
                    {user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User2 className="w-4 h-4 mr-2" aria-hidden="true" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {pathname !== "/auth" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/auth">Sign In</Link>
                  </Button>
                )}
                {pathname !== "/create" && (
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Link href="/create">Create Free Resume</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
