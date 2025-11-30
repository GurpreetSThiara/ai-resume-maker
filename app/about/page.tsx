import type { Metadata } from 'next';
import { Users, Target, Sparkles, Heart, Shield, Zap, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'About Us | CreateFreeCV.com',
  description: 'Learn about the mission and team behind CreateFreeCV.com, dedicated to helping job seekers succeed.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 blur-3xl animate-pulse" />
          <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="container mx-auto px-4 pt-20 pb-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full mb-6 shadow-sm">
              <Heart className="w-3 h-3 text-green-600" />
              <span className="text-sm font-medium text-green-700">Built with Passion for Job Seekers</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-green-800 to-slate-900 bg-clip-text text-transparent">
              About CreateFreeCV
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Empowering job seekers worldwide with professional, ATS-friendly resumes—completely free.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Badge variant="secondary" className="px-3 py-1">
                <Shield className="w-3 h-3 mr-1" /> Privacy First
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Zap className="w-3 h-3 mr-1" /> Instant Download
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Award className="w-3 h-3 mr-1" /> Professional Quality
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Mission Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-60 -translate-y-16 translate-x-16" />
              <CardHeader className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-slate-600 leading-relaxed">
                  In today's competitive job market, professional resumes are essential. We believe everyone deserves access to powerful tools without financial barriers. Our mission is to provide a completely free, ATS-friendly resume builder that helps job seekers land their dream jobs.
                </p>
              </CardContent>
            </Card>

            {/* Philosophy Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-2xl opacity-60 -translate-y-16 translate-x-16" />
              <CardHeader className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">Our Philosophy</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-slate-600 leading-relaxed">
                  We're committed to transparency and user-centric design. Core features are free forever—no hidden fees or sign-up requirements. While we offer optional AI enhancements, you can always build and download professional resumes without paying a dime.
                </p>
              </CardContent>
            </Card>

            {/* Team Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-2xl opacity-60 -translate-y-16 translate-x-16" />
              <CardHeader className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">Our Team</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-slate-600 leading-relaxed">
                  We're a passionate team of developers, designers, and HR professionals dedicated to leveling the playing field for job seekers. We continuously improve our platform and add new features to help you succeed in your career journey.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-2xl p-8 md:p-12 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Privacy First</h3>
                <p className="text-sm text-slate-600">Your data never leaves your device unless you choose to save it</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Speed & Simplicity</h3>
                <p className="text-sm text-slate-600">Create professional resumes in minutes, not hours</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Quality Focus</h3>
                <p className="text-sm text-slate-600">ATS-optimized templates that get past automated filters</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Accessibility</h3>
                <p className="text-sm text-slate-600">Professional tools available to everyone, regardless of budget</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
