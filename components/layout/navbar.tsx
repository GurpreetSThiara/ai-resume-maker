"use client"


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Home, Plus, User, LogOut, User2, Menu, Star, BookOpen, Coffee, Image as ImageIcon, ChevronDown, HelpCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer } from "@/components/ui/drawer"
import React from "react"
import { CREATE_RESUME, BUY_ME_COFFEE } from "@/config/urls"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Brand } from "@/components/ui/brand"
import { useAuthModal } from "@/contexts/auth-modal-context"

import { useWindowSize } from "@/hooks/use-window-size"

// Define a common type for navigation items
type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  matchPath: (path: string) => boolean;
  colorClass: string;
  isExternal?: boolean;
}

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { open } = useAuthModal();
  const { width } = useWindowSize();

  // Define all navigation items in a single array
  const allNavItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      matchPath: (p) => p === "/",
      colorClass: "bg-green-100 text-green-700",
    },
    {
      label: "Create Resume",
      href: CREATE_RESUME,
      icon: Plus,
      matchPath: (p) => p === CREATE_RESUME,
      colorClass: "bg-blue-100 text-blue-700",
    },
    {
      label: "Cover Letter",
      href: "/cover-letter",
      icon: Plus, // You might want to use a different icon here if available, but keeping original for now
      matchPath: (p) => p.startsWith("/cover-letter"),
      colorClass: "bg-blue-100 text-blue-700",
    },
    {
      label: "Blog",
      href: "/blog",
      icon: BookOpen,
      matchPath: (p) => p.startsWith("/blog"),
      colorClass: "bg-purple-100 text-purple-700",
    },
    ...(user ? [{
      label: "Portfolios",
      href: "/dashboard/portfolios",
      icon: User,
      matchPath: (p: string) => p.startsWith("/dashboard/portfolios"),
      colorClass: "bg-teal-100 text-teal-700",
    }] : [{
      label: "Portfolios",
      href: "/dashboard/portfolios",
      icon: User,
      matchPath: (p: string) => p.startsWith("/dashboard/portfolios"),
      colorClass: "bg-teal-100 text-teal-700",
    }]),
    {
      label: "FAQ",
      href: "/faq",
      icon: HelpCircle,
      matchPath: (p) => p.startsWith("/faq"),
      colorClass: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Image Converter",
      href: "/image-converter",
      icon: ImageIcon,
      matchPath: (p) => p.startsWith("/image-converter"),
      colorClass: "bg-orange-100 text-orange-700",
    },
    {
      label: "Buy Me a Coffee",
      href: BUY_ME_COFFEE,
      icon: Coffee,
      matchPath: (p) => p.startsWith("/buy-me-coffee"),
      colorClass: "bg-yellow-100 text-yellow-700",
      isExternal: true,
    },
  ];

  // Determine how many items to show in the main navbar based on screen width
  let visibleCount = 3; // Default for md screens (>= 768px && < 1024px)
  if (width >= 1280) {
    visibleCount = 6; // xl screens
  } else if (width >= 1024) {
    visibleCount = 4; // lg screens
  }

  const visibleItems = allNavItems.slice(0, visibleCount);
  const dropdownItems = allNavItems.slice(visibleCount);

  // Render main navbar items (desktop)
  const desktopVisibleLinks = visibleItems.map((item) => (
    <Link
      key={item.label}
      href={item.href}
      target={item.isExternal ? "_blank" : undefined}
      rel={item.isExternal ? "noopener noreferrer" : undefined}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${item.matchPath(pathname || "") ? item.colorClass : "text-gray-600 hover:text-gray-900"
        }`}
      onClick={() => setDrawerOpen(false)}
    >
      <item.icon className="w-4 h-4" aria-hidden="true" />
      {item.label}
    </Link>
  ));

  // Render dropdown items (desktop)
  const desktopDropdownLinks = dropdownItems.map((item) => (
    <DropdownMenuItem key={item.label} asChild>
      <Link
        href={item.href}
        target={item.isExternal ? "_blank" : undefined}
        rel={item.isExternal ? "noopener noreferrer" : undefined}
        className="flex items-center w-full"
      >
        <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
        {item.label}
      </Link>
    </DropdownMenuItem>
  ));

  // Render all items for mobile drawer
  const mobileNavLinks = allNavItems.map((item) => (
    <Link
      key={item.label}
      href={item.href}
      target={item.isExternal ? "_blank" : undefined}
      rel={item.isExternal ? "noopener noreferrer" : undefined}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${item.matchPath(pathname || "") ? item.colorClass : "text-gray-600 hover:text-gray-900"
        }`}
      onClick={() => setDrawerOpen(false)}
    >
      <item.icon className="w-4 h-4" aria-hidden="true" />
      {item.label}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Brand logoSize={32} asLink={true} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2 lg:gap-6 flex-1 justify-center">
            {/* Visible links */}
            {desktopVisibleLinks}

            {/* Dropdown for additional links */}
            {dropdownItems.length > 0 && (
              <div className="hidden md:flex shrink-0">
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
                    {desktopDropdownLinks}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </nav>


          <div className="flex gap-2 items-center shrink-0">
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
                        <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                        Resumes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/portfolios" className="flex items-center">
                        <User className="w-4 h-4 mr-2" aria-hidden="true" />
                        Portfolios
                      </Link>
                    </DropdownMenuItem>
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
                    className="hidden lg:inline-flex"
                    onClick={() => open()}
                  >
                    Sign In
                  </Button>
                  {pathname !== `${CREATE_RESUME}` && (
                    <Button asChild className="hidden lg:inline-flex">
                      <Link href={CREATE_RESUME}>Create Free Resume</Link>
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Hamburger for mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
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
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2 mb-4">
            {mobileNavLinks}
          </nav>
          {/* Auth buttons for mobile only */}
          {!user && (
            <div className="flex flex-col gap-2 lg:hidden">
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
