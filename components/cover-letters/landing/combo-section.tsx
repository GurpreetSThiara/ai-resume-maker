'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Briefcase, CheckCircle } from 'lucide-react';

const features = [
  'Resume and cover letter builder free',
  'Matching resume and cover letter templates',
  'Free ATS resume and cover letter templates',
  'Consistent professional formatting',
  'Instant download for both documents',
  'No sign-up required for either tool'
];

export function ComboSection() {
  const router = useRouter();

  return (
    <section className="py-20 bg-linear-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Complete Your Job Application Package
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Create matching resume and cover letter templates with our free ATS-optimized builders. 
                Professional consistency that helps you stand out.
              </p>
              
              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => router.push('/cover-letter/editor/new')}>
                  <FileText className="w-5 h-5 mr-2" />
                  Create Cover Letter
                </Button>
                <Button variant="outline" size="lg" onClick={() => router.push('/resume/editor/new')}>
                  <Briefcase className="w-5 h-5 mr-2" />
                  Create Resume
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-linear-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-4 mb-4">
                    <FileText className="w-12 h-12 text-blue-600" />
                    <Briefcase className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Resume + Cover Letter Builder
                  </h3>
                  <p className="text-slate-600">
                    Free ATS-optimized templates for complete job applications
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-slate-600">Free</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-indigo-600">ATS</div>
                    <div className="text-sm text-slate-600">Optimized</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">DOCX</div>
                    <div className="text-sm text-slate-600">Download</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-slate-600">Sign Up</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
