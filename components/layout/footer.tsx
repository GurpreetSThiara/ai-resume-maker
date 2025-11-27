import Link from "next/link"
import { FileText, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { CREATE_RESUME } from "@/config/urls"
export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-card border-t border-border">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              CreateFreeCV
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Create professional resumes and cover letters that get you hired.
            Fast, easy, and completely free.
          </p>
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
         
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground relative inline-block">
            Resources
            <span className="absolute left-0 -bottom-1 w-10 h-0.5 bg-primary rounded-full" />
          </h3>
          <ul className="space-y-3">
            {/* <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
              >
                Resume Examples
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
              >
                Career Tips
              </Link>
            </li> */}
            <li>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:pl-1"
              >
                Blog
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
