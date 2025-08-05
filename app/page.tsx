"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, Download, Zap, Shield, Globe, ArrowRight, FileText, Sparkles, User, Settings, Award, Clock, Target, TrendingUp } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export interface ResumeData {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  custom: Record<
    string,
    {
      title: string
      content: string
      hidden: boolean
      id: string
      link: boolean
    }
  >
  sections: Array<{
    id: string
    title: string
    content: Record<string, string[]>
  }>
}

function NavigationHeader() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Resume Builder
            </Link>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Resume Builder
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/create">
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Resume
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/create">
                  <Button>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <NavigationHeader />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Free Professional Resume Builder
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Build Your Dream Resume in Minutes
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create a professional, ATS-friendly resume with our gamified builder. Stand out from the crowd and land your
            dream job with ease. Our free resume builder helps you create compelling resumes that get past Applicant Tracking Systems and into the hands of hiring managers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
              >
                Create Free Resume
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/50 backdrop-blur-sm">
              <Download className="w-5 h-5 mr-2" />
              Download Sample
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2min</div>
              <div className="text-gray-600">Average Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose Our Resume Builder?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the most intuitive and powerful resume building platform designed for modern job seekers. Our ATS-friendly templates ensure your resume gets noticed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <Zap className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">Gamified Experience</CardTitle>
                <CardDescription>
                  Unlock achievements and track progress as you build your perfect resume step by step. Make resume writing fun and engaging.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create your professional resume in just 3 simple steps. Our step-by-step process makes resume writing easy and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Enter Your Information</h3>
              <p className="text-gray-600">
                Fill in your personal details, work experience, education, and skills through our intuitive step-by-step
                process. Our guided approach ensures you don't miss anything important.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Customize & Preview</h3>
              <p className="text-gray-600">
                See your resume come to life with our live preview feature. Edit and customize until it's perfect. Choose from multiple professional templates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
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
                <Target className="w-6 h-6 text-purple-600" />
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

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful job seekers who landed their dream jobs with our resume builder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "This resume builder helped me land my dream job at Google! The interface is so intuitive and the
                  final result looks incredibly professional. The ATS-friendly format definitely made a difference."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    S
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Software Engineer at Google</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The gamified experience made building my resume actually fun! I got 3 interview calls within a week
                  of using this resume. The templates are perfect for my industry."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-gray-500">Marketing Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a recent graduate, I had no idea how to create a professional resume. This tool guided me through
                  every step perfectly! I landed my first job within 2 weeks."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    E
                  </div>
                  <div>
                    <div className="font-semibold">Emily Rodriguez</div>
                    <div className="text-sm text-gray-500">Recent Graduate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Build Your Perfect Resume?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers and create your professional resume today. It's completely free and takes just minutes to complete!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold">
                Create Free Resume Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-purple-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">Resume Builder</span>
              </div>
              <p className="text-gray-400">
                Create professional resumes that get you hired. Fast, easy, and completely free. Our ATS-friendly templates help you stand out in the job market.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/create" className="hover:text-white transition-colors">
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Professional Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Resume Examples
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    ATS-Friendly Formats
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Career Tips
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Interview Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Job Search Strategies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Resume Writing Tips
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Resume Builder. All rights reserved. | Free Professional Resume Builder for Job Seekers</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
