

import type { Metadata } from 'next'
import ResumeCarousel from "@/components/appUI/Carausol/ResumeCarausol"
import { CTA } from "@/components/appUI/home/CTA"
import AdvancedFeatures from "@/components/appUI/home/FeatureDeepDive"
import { Hero } from "@/components/appUI/home/Hero"
import { HowItWorks } from "@/components/appUI/home/HowItWorks"
import { Values } from "@/components/appUI/home/ValueProps"

export const metadata: Metadata = {
  title: 'Free ATS Resume Builder - No Sign Up | Optional AI with Free Account',
  description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download, no credit card. Create a free account for AI-powered content generation.',
  keywords: ['free resume builder no sign up', 'ats resume builder', 'free resume download', 'ai resume writer', 'live preview resume builder', 'completely free resume builder'],
  authors: [{ name: 'CreateFreeCV Team', url: 'https://createfreecv.com' }],
  creator: 'CreateFreeCV Team',
  publisher: 'CreateFreeCV',
  metadataBase: new URL('https://createfreecv.com'),
  openGraph: {
    title: 'Free ATS Resume Builder - No Sign Up | Optional AI with Free Account',
    description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download. Optional AI assistant with a free account.',
    url: 'https://createfreecv.com',
    siteName: 'CreateFreeCV',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Create a professional resume with CreateFreeCV.com',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Builder - No Sign Up | Optional AI with Free Account',
    description: 'Build professional ATS-friendly resumes instantly without login. Live preview, free DOCX download. Optional AI assistant with a free account.',
    images: ['/twitter-image.png'], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://createfreecv.com',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-indigo-50 to-white">
     

      {/* Hero Section */}
     <Hero/>
      {/* Value Props */}
     <Values/>

     <ResumeCarousel/>

      {/* How It Works */}
      <HowItWorks/>

      {/* Features Deep Dive */}
      <AdvancedFeatures/>
      {/* Testimonials + FAQ */}
      {/* <section className="py-20 px-4">
        <div className="container mx-auto grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">Loved by Job Seekers</h3>
            <Carousel>
              <CarouselContent>
                {[1,2,3].map((i) => (
                  <CarouselItem key={i}>
                    <Card className="border-0 shadow-md">
                      <CardContent className="pt-6">
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-slate-600 mb-4">{i === 1 ? 'Landed interviews at top tech firms within a week. Templates are gorgeous and ATS-safe.' : i === 2 ? 'Faster than any builder I tried. Live preview is a game changer.' : 'As a grad, this made everything easy. Got my first offer in 2 weeks.'}</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">{i === 1 ? 'S' : i === 2 ? 'M' : 'E'}</div>
                          <div>
                            <div className="font-semibold">{i === 1 ? 'Sarah Johnson' : i === 2 ? 'Michael Chen' : 'Emily Rodriguez'}</div>
                            <div className="text-sm text-slate-500">{i === 1 ? 'Software Engineer' : i === 2 ? 'Marketing Manager' : 'Recent Graduate'}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is the resume builder really free?</AccordionTrigger>
                <AccordionContent>Yes. You can build and download unlimited resumes for free.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Are the templates ATS-friendly?</AccordionTrigger>
                <AccordionContent>All templates are designed for clean parsing in popular ATS systems.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I customize the content inline?</AccordionTrigger>
                <AccordionContent>Absolutely. Edit text directly in the preview and see changes in real time.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Do I need an account?</AccordionTrigger>
                <AccordionContent>No account is required to start. Sign in to save to the cloud.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is there an AI assistant?</AccordionTrigger>
                <AccordionContent>Yes. Use AI to parse your background and generate a strong first draft.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}

    <CTA/>

 
    </div>
  )
}
