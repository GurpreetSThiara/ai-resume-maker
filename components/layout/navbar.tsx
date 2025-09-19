"use client"


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Home, Plus, User, LogOut, User2, Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer } from "@/components/ui/drawer"
import React from "react"


export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Navigation links for reuse
  const navLinks = (
    <>
      <Link
        href="/"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          pathname === "/" ? "bg-green-100 text-green-700" : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <Home className="w-4 h-4" aria-hidden="true" />
        Home
      </Link>
      <Link
        href="/create"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          pathname === "/create" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        Create Resume
      </Link>
      <Link
        href="/cover-letter"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          pathname?.startsWith("/cover-letter") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        Cover Letter
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* <FileText className="w-8 h-8 text-blue-600" aria-hidden="true" /> */}
            <h1 className="text-2xl font-bold bg-gradient-to-r text-primary ">
              Resume Builder
            </h1>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks}
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
                  <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                    <Link href="/auth">Sign In</Link>
                  </Button>
                )}
                {pathname !== "/create" && (
                  <Button asChild className="hidden md:inline-flex">
                    <Link href="/create">Create Free Resume</Link>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="left">
        <div className="flex flex-col h-full w-full bg-white p-6 gap-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold">Menu</span>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="p-2 rounded-lg hover:bg-gray-100">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2 mb-4">
            {navLinks}
          </nav>
          {/* Auth buttons for mobile only */}
          {!user && (
            <div className="flex flex-col gap-2 md:hidden">
              {pathname !== "/auth" && (
                <Button asChild variant="outline" size="sm" onClick={() => setDrawerOpen(false)}>
                  <Link href="/auth">Sign In</Link>
                </Button>
              )}
              {pathname !== "/create" && (
                <Button asChild onClick={() => setDrawerOpen(false)}>
                  <Link href="/create">Create Free Resume</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
}
