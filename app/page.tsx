import type { Metadata } from "next"
import { HeroV2 } from "@/components/appUI/home/v2/HeroV2"
import { TemplatesShowcase } from "@/components/appUI/home/v2/TemplatesShowcase"
import { StepsV2 } from "@/components/appUI/home/v2/StepsV2"
import { FeatureBento } from "@/components/appUI/home/v2/FeatureBento"
import { StatsBand } from "@/components/appUI/home/v2/StatsBand"
import { PortfolioPromoV2 } from "@/components/appUI/home/v2/PortfolioPromoV2"
import { ResourcesSection } from "@/components/appUI/home/v2/ResourcesSection"
import { FaqV2 } from "@/components/appUI/home/v2/FaqV2"
import { FinalCtaV2 } from "@/components/appUI/home/v2/FinalCtaV2"

export const metadata: Metadata = {
  title: "Free Resume Builder — ATS-Optimized Templates, No Sign-Up | CreateFreeCV",
  description:
    "Build a professional, ATS-optimized resume in minutes — free, no sign-up, unlimited PDF/DOCX downloads. 80+ templates, live preview, theme customizer, and a shareable portfolio.",
  alternates: { canonical: "https://createfreecv.com/" },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroV2 />
      <StatsBand />
      <StepsV2 />
      <TemplatesShowcase />
      <FeatureBento />
      <PortfolioPromoV2 />
      <ResourcesSection />
      <FaqV2 />
      <FinalCtaV2 />
    </div>
  )
}
