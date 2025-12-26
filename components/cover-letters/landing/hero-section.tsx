'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Heart, CheckCircle, Download, Award } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-linear-to-r from-green-100 to-emerald-100 blur-3xl animate-pulse" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-linear-to-r from-blue-100 to-indigo-100 blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-linear-to-r from-purple-100 to-pink-100 blur-3xl animate-pulse delay-500" />
      </div>
      
      <div className="container mx-auto px-4 pt-20 pb-16 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full mb-6 shadow-sm">
            <Heart className="w-3 h-3 text-green-600" />
            <span className="text-sm font-medium text-green-700">Free Cover Letter Builder</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-slate-900 via-green-800 to-slate-900 bg-clip-text text-transparent">
            Free Cover Letter Builder – ATS‑Friendly Templates, No Sign Up
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
            Create a professional cover letter online in minutes with our free AI‑assisted, ATS‑optimized cover letter builder. 
            Job‑specific templates with instant DOCX download and no login required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              onClick={() => router.push('/cover-letter/editor/new')}
              className="text-lg px-8 py-3"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Writing Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-3"
            >
              Browse Templates
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Badge variant="secondary" className="px-3 py-1">
              <CheckCircle className="w-3 h-3 mr-1" /> No Sign Up Required
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Download className="w-3 h-3 mr-1" /> Free Download
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Award className="w-3 h-3 mr-1" /> ATS Optimized
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
