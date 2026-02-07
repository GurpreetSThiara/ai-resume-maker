'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContentResourcesSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
          Resume & Career Resources
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-12">
          Expert guides and examples to help you create professional resumes and advance your career. 
          Everything you need to land your dream job.
        </p>

        {/* Resource Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <Link
            href="/how-to-write-a-resume"
            className="group block bg-white rounded-lg shadow-md border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-4">
              Featured Guide
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
              How to Write a Resume
            </h3>
            
            <p className="text-slate-600 leading-relaxed mb-6">
              Complete guide to creating ATS-friendly resumes that get noticed by recruiters and pass automated screening.
            </p>
            
            <div className="flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700">
              <span>Read Complete Guide</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Bottom CTA */}
        <div>
          <p className="text-slate-600 mb-6">
            More career resources coming soon! Check back often for new guides and tips.
          </p>
          <Link href="/how-to-write-a-resume">
            <Button size="lg" className="h-12 px-8 text-base">
              Read Complete Guide
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
