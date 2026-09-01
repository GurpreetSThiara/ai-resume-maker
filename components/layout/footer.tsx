"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { CREATE_RESUME } from "@/config/urls"
import { Brand } from "@/components/ui/brand"
import { BuyMeCoffee } from "@/components/ui/buy-me-coffee"
import { openConsentSettings } from "@/lib/analytics-consent"
export function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname() || "/"
  // The focused editor is app-like — no marketing footer there.
  if (pathname.startsWith("/free-ats-resume-templates/create")) return null

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <Brand
              logoSize={28}
              textSize="text-2xl"
              asLink={false}
              textClassName="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
            />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Create professional resumes and cover letters that get you hired.
              Fast, easy, and completely free.
            </p>
            <BuyMeCoffee />
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground relative inline-block">
              Product
              <span className="absolute left-0 -bottom-1 w-10 h-0.5 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={CREATE_RESUME}
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/cover-letter"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Cover Letters
                </Link>
              </li>
              <li>
                <Link
                  href="/free-ats-resume-templates"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Resume Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/resume-examples"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Resume Examples
                </Link>
              </li>

            </ul>
          </div>

          {/* Resources — also the only server-rendered link to /blog and
              /image-converter, which the navbar hides behind a width-gated
              dropdown that renders nothing on the server. */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground relative inline-block">
              Resources
              <span className="absolute left-0 -bottom-1 w-10 h-0.5 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/how-to-write-a-resume"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  How to Write a Resume
                </Link>
              </li>
              <li>
                <Link
                  href="/resume-for-freshers"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Resume for Freshers
                </Link>
              </li>
              <li>
                <Link
                  href="/image-converter"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Image Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground relative inline-block">
              Company
              <span className="absolute left-0 -bottom-1 w-10 h-0.5 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                {/* Opens the consent panel on demand. Outside the EU this is the
                    opt-out route, since no banner is shown unprompted there. */}
                <button
                  type="button"
                  onClick={openConsentSettings}
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-12 pt-6 text-center text-muted-foreground text-sm">
          <p>&copy; {currentYear} CreateFreeCV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
