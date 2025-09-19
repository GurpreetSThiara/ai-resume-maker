"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { availableTemplates } from "@/lib/templates"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, Download, Zap, Shield, Globe, ArrowRight, FileText, Sparkles, User, Settings, Award, Clock, Target, TrendingUp, Play } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"




export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-indigo-50 to-white">
     

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-green-100 blur-3xl" />
          <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-green-50 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 pt-20 pb-14 md:pt-28 md:pb-20 relative text-center">
          <Badge className="mb-5 bg-white/80 text-green-700 border border-green-200">
            <Sparkles className="w-4 h-4 mr-2" /> AI + ATS Optimized
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-green-700 to-indigo-700 bg-clip-text text-transparent">
            Your Resume, Perfected in Minutes
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Build a modern, recruiter-ready resume with live preview, AI guidance, and world-class templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/create">
              <Button size="lg" className="h-12 px-7 text-base bg-gradient-to-r from-green-600 to-slate-600 hover:from-purple-700 hover:to-blue-700">
                Create Free Resume
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/create">
              <Button size="lg" variant="outline" className="h-12 px-7 text-base bg-white/70 backdrop-blur border-green-200">
                <Play className="w-5 h-5 mr-2" /> Try Interactive Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-center">
            <div>
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-slate-500">Resumes Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">95%</div>
              <div className="text-slate-500">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">4.9★</div>
              <div className="text-slate-500">User Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-700">2 min</div>
              <div className="text-slate-500">To First Draft</div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      {/* <section className="py-16 px-4 bg-white/70">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Professionally Designed Templates</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">All templates are ATS-optimized and professionally designed.</p>
          </div>
          <div className="relative max-w-5xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {availableTemplates.map((t) => (
                    <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-4">
                        <Card className="hover:shadow-xl transition-shadow">
                          <CardHeader>
                            <CardTitle className="text-lg">{t.name}</CardTitle>
                            <CardDescription>{t.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 border rounded flex items-center justify-center text-gray-400">
                              Template Preview
                            </div>
                            <div className="mt-4 flex justify-between">
                              <Link href={{ pathname: "/create", query: { template: t.id } }}>
                                <Button size="sm">Use Template</Button>
                              </Link>
                              <Link href="/create">
                                <Button size="sm" variant="outline">Customize</Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
          </div>
        </div>
      </section> */}

      {/* Value Props */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <Zap className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">Gamified Experience</CardTitle>
                <CardDescription>
                  Unlock achievements and track progress as you build your perfect resume step by step. Make resume writing fun and engaging.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <Shield className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">ATS-Friendly</CardTitle>
                <CardDescription>
                  Our templates are optimized for Applicant Tracking Systems to ensure your resume gets noticed by recruiters and hiring managers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
              <CardHeader>
                <Globe className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle className="text-xl">Mobile-First Design</CardTitle>
                <CardDescription>
                  Build your resume on any device with our responsive, mobile-optimized interface. Create professional resumes on the go.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <Download className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">Instant PDF Export</CardTitle>
                <CardDescription>
                  Download your professional resume as a high-quality PDF with just one click. Perfect for job applications and interviews.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardHeader>
                <Users className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle className="text-xl">Expert Templates</CardTitle>
                <CardDescription>
                  Choose from professionally designed templates created by HR experts and career coaches. Stand out in any industry.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
              <CardHeader>
                <Sparkles className="w-12 h-12 text-pink-600 mb-4" />
                <CardTitle className="text-xl">Smart Suggestions</CardTitle>
                <CardDescription>
                  Get intelligent recommendations and tips to improve your resume content and formatting. AI-powered insights for better results.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-green-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create your professional resume in just 3 simple steps. Our step-by-step process makes resume writing easy and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Enter Your Information</h3>
              <p className="text-gray-600">
                Fill in your personal details, work experience, education, and skills through our intuitive step-by-step
                process. Our guided approach ensures you don&apos;t miss anything important.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Customize & Preview</h3>
              <p className="text-gray-600">
                See your resume come to life with our live preview feature. Edit and customize until it&apos;s perfect. Choose from multiple professional templates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Download & Apply</h3>
              <p className="text-gray-600">
                Download your professional PDF resume and start applying to your dream jobs with confidence. Get ready for more interviews and job offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Advanced Features for Professional Results</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our resume builder includes powerful features designed to help you create resumes that get results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">ATS Optimization</h3>
                <p className="text-gray-600">
                  Our templates are specifically designed to pass through Applicant Tracking Systems. Use industry-standard formatting and keywords to increase your chances of getting noticed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quick & Easy</h3>
                <p className="text-gray-600">
                  Create a professional resume in under 5 minutes. Our streamlined process guides you through each section with helpful tips and suggestions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Professional Templates</h3>
                <p className="text-gray-600">
                  Choose from a variety of professionally designed templates suitable for different industries and career levels. All templates are ATS-friendly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Career Growth</h3>
                <p className="text-gray-600">
                  Our resume builder helps you highlight your achievements and skills effectively, positioning you for career advancement and better job opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
  <section className="relative overflow-hidden py-24 px-6 bg-card">
  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/10 animate-gradient-x"></div>

  <div className="container relative z-10 mx-auto text-center max-w-3xl">
    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
      Build Your <span className="text-primary">Perfect Resume</span> in Minutes
    </h2>

    <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
      Join thousands of successful job seekers who created their professional resume — 
      <span className="font-semibold text-primary"> free, fast, and easy</span>.
    </p>

    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <Link href="/create">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
        >
          Create Free Resume
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </Link>

      <Link href="/templates">
        <Button
          size="lg"
          variant="outline"
          className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-4 font-semibold rounded-xl transition-all duration-300"
        >
          Browse Templates
        </Button>
      </Link>
    </div>

    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
      <div className="flex flex-col items-center">
        <CheckCircle className="w-7 h-7 text-primary mb-2" />
        <p className="text-sm font-medium text-foreground">100% Free</p>
      </div>
      <div className="flex flex-col items-center">
        <CheckCircle className="w-7 h-7 text-primary mb-2" />
        <p className="text-sm font-medium text-foreground">No Signup Required</p>
      </div>
      <div className="flex flex-col items-center">
        <CheckCircle className="w-7 h-7 text-primary mb-2" />
        <p className="text-sm font-medium text-foreground">Instant Download</p>
      </div>
    </div>
  </div>
</section>


 
    </div>
  )
}
