import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, Download, FileText, MousePointer2, CreditCard, Clock, Lock, Sparkles } from "lucide-react"
import { CREATE_RESUME } from "@/config/urls"
import { HeroButtons, SecondaryCTAButton } from "@/components/appUI/home/HeroButtons"

export  function Hero() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-card">
   
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl mx-auto lg:mx-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 sm:mb-8 animate-fade-in shadow-sm border border-primary/20">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                100% Free Forever
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-4 sm:mb-6 text-balance">
                Free Resume Builder
                <br />
                <span className="text-primary relative inline-block mt-2">
                  No Sign Up Required
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10C60 2 140 2 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-foreground/90 mb-3 sm:mb-4 leading-relaxed font-medium text-pretty">
                Download a Professional, ATS-Optimized Resume in 2 Minutes—Completely Free.
              </p>

              <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed text-pretty">
                No Credit Card, No Hidden Fees, No Email Walls.
              </p>

              {/* CTA Section */}
              <HeroButtons />

              {/* Trust Features Grid */}
              {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-border/50 pt-8 sm:pt-10">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-bold text-sm sm:text-base">No Credit Card</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Zero hidden fees, ever.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <MousePointer2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-bold text-sm sm:text-base">No Sign-Up</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Start building instantly.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-bold text-sm sm:text-base">Privacy-First</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Your data stays with you.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <p className="font-bold text-sm sm:text-base">2-Minute Setup</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Start to download fast.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                    <Download className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <p className="font-bold text-sm sm:text-base">Unlimited Downloads</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Download as many times.</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <p className="font-bold text-sm sm:text-base">ATS-Friendly</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Optimized for systems.</p>
                </div>
              </div> */}
            </div>

            {/* Right Visual - Mock Resume Preview */}
            <div className="relative lg:ml-auto max-w-md mx-auto lg:max-w-lg w-full">
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-primary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl z-20 animate-bounce border border-primary/20">
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base whitespace-nowrap">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Unlimited Downloads
                </div>
              </div>

              {/* Mock Resume Card */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-border p-6 sm:p-8 lg:p-10 transform hover:scale-[1.02] transition-transform duration-300">
                {/* Resume Header */}
                <div className="space-y-3 mb-6">
                  <div className="h-5 w-2/5 bg-gradient-to-r from-primary/30 to-primary/10 rounded animate-pulse-slow" />
                  <div className="h-8 w-3/5 bg-gradient-to-r from-primary/40 to-primary/20 rounded" />
                  <div className="flex gap-2 mt-3">
                    <div className="h-3 w-20 bg-muted/60 rounded" />
                    <div className="h-3 w-24 bg-muted/60 rounded" />
                    <div className="h-3 w-20 bg-muted/60 rounded" />
                  </div>
                </div>

                {/* Resume Body */}
                <div className="space-y-6 pt-4 border-t border-border/30">
                  {/* Section 1 */}
                  <div className="space-y-3">
                    <div className="h-4 w-1/4 bg-primary/20 rounded" />
                    <div className="space-y-2">
                      <div className="h-2.5 w-full bg-muted rounded" />
                      <div className="h-2.5 w-full bg-muted rounded" />
                      <div className="h-2.5 w-4/5 bg-muted rounded" />
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="space-y-3">
                    <div className="h-4 w-1/3 bg-primary/20 rounded" />
                    <div className="flex gap-3">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-3/5 bg-muted rounded" />
                        <div className="h-2 w-2/5 bg-muted/60 rounded" />
                        <div className="h-2 w-full bg-muted/40 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="space-y-3">
                    <div className="h-4 w-1/4 bg-primary/20 rounded" />
                    <div className="flex flex-wrap gap-2">
                      <div className="h-6 w-16 bg-secondary/20 rounded-full" />
                      <div className="h-6 w-20 bg-secondary/20 rounded-full" />
                      <div className="h-6 w-14 bg-secondary/20 rounded-full" />
                      <div className="h-6 w-18 bg-secondary/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* ATS Badge */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-bold">
                    <Check className="w-3 h-3" />
                    ATS-OPTIMIZED
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent blur-3xl -z-10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gradient-to-r from-card via-secondary/5 to-card py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 sm:mb-8">
            Professional • ATS-Optimized • Privacy-First
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <span className="font-black text-xs sm:text-sm tracking-tight text-foreground/80">ATS FRIENDLY</span>
            </div>

            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="font-black text-xs sm:text-sm tracking-tight text-foreground/80">PDF EXPORT</span>
            </div>

            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <span className="font-black text-xs sm:text-sm tracking-tight text-foreground/80">SECURE</span>
            </div>

            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="font-black text-xs sm:text-sm tracking-tight text-foreground/80">FREE FOREVER</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        {/* Subtle Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-6 text-balance">
              The Purest Way to Build Your Career
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              We removed all the friction so you can focus on what matters—getting hired.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">No Credit Card</h3>
              <p className="text-muted-foreground leading-relaxed">
                Zero hidden fees, ever. Our promise is 100% free access to all professional features.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MousePointer2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">No Sign-Up</h3>
              <p className="text-muted-foreground leading-relaxed">
                Start building instantly. No email walls, no passwords to remember, just pure productivity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy-First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your data stays with you. We don&apos;t store your personal info on our servers—it lives in your
                browser.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2-Minute Setup</h3>
              <p className="text-muted-foreground leading-relaxed">
                Start to download fast. Our intuitive interface guides you through the process in record time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unlimited Downloads</h3>
              <p className="text-muted-foreground leading-relaxed">
                Download as many times as you need. Perfect for tailoring your resume to different job descriptions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">ATS-Friendly</h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimized for systems. Our templates are built to pass through automated screening with ease.
              </p>
            </div>
          </div>

          {/* Final CTA in section */}
          <div className="mt-20 text-center">
            <SecondaryCTAButton />
          </div>
        </div>
      </section>

    </main>
  )
}