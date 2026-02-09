"use client"


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Home, Plus, User, LogOut, User2, Menu, Star, BookOpen, Coffee, Image as ImageIcon, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer } from "@/components/ui/drawer"
import React from "react"
import { CREATE_RESUME, BUY_ME_COFFEE } from "@/config/urls"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Brand } from "@/components/ui/brand"
import { useAuthModal } from "@/contexts/auth-modal-context"


export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { open } = useAuthModal();

  // Always visible navigation items
  const alwaysVisibleLinks = (
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
        href={CREATE_RESUME}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          pathname === `${CREATE_RESUME}` ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
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

  // Additional links for dropdown
  const dropdownLinks = (
    <>
      <DropdownMenuItem asChild>
        <Link href="/blog" className="flex items-center w-full">
          <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
          Blog
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/image-converter" className="flex items-center w-full">
          <ImageIcon className="w-4 h-4 mr-2" aria-hidden="true" />
          Image Converter
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link 
          href={BUY_ME_COFFEE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full"
        >
          <Coffee className="w-4 h-4 mr-2" aria-hidden="true" />
          Buy Me a Coffee
        </Link>
      </DropdownMenuItem>
    </>
  );

  // All navigation links for mobile drawer
  const navLinks = (
    <>
      {alwaysVisibleLinks}
      <Link
        href="/blog"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          pathname?.startsWith("/blog") ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <BookOpen className="w-4 h-4" aria-hidden="true" />
        Blog
      </Link>
      <Link
        href="/image-converter"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          pathname?.startsWith("/image-converter") ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <ImageIcon className="w-4 h-4" aria-hidden="true" />
        Image Converter
      </Link>
      <Link
        href={BUY_ME_COFFEE}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          pathname?.startsWith("/buy-me-coffee") ? "bg-yellow-100 text-yellow-700" : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <Coffee className="w-4 h-4" aria-hidden="true" />
        Buy Me a Coffee
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Brand logoSize={32} asLink={true} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Always visible links */}
            {alwaysVisibleLinks}
            
            {/* Dropdown for additional links on all desktop screens */}
            <div className="hidden md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900"
                  >
                    More
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {dropdownLinks}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          
        <div className="flex gap-2 items-center">
        <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent p-0 border-0 shadow-none">
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={user.email || 'User'} />
                      <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={open}
                >
                  Sign In
                </Button>
                {pathname !== `${CREATE_RESUME}` && (
                  <Button asChild className="hidden md:inline-flex">
                    <Link href={CREATE_RESUME}>Create Free Resume</Link>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDrawerOpen(false)
                  open()
                }}
              >
                Sign In
              </Button>
              {pathname !== `${CREATE_RESUME}` && (
                <Button asChild onClick={() => setDrawerOpen(false)}>
                  <Link href={CREATE_RESUME}>Create Free Resume</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
}
