'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, FileText } from 'lucide-react';

const benefits = [
  'Mobile‑friendly cover letter builder',
  'ATS optimized cover letter templates',
  'Job‑specific cover letter generator',
  'Free cover letter builder no sign up',
  'Instant cover letter download DOCX',
  'AI powered cover letter writer',
  'Cover letter with ATS keywords',
  'Professional cover letter examples',
  'Customizable cover letter layout',
  'Cover letter builder for freshers',
  'No email required cover letter maker',
  'Privacy‑first cover letter creator'
];

export function BenefitsSection() {
  const router = useRouter();

  return (
    <section className="py-20 bg-linear-to-r from-slate-50 to-emerald-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className=" gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Why Choose Our Free Cover Letter Builder?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Our AI‑assisted cover letter builder provides all the tools you need to create ATS‑optimized, professional cover letters that get results - no sign up required.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" onClick={() => router.push('/cover-letter/editor/new')}>
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* <div className="relative">
              <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <FileText className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Create Professional Cover Letters</h3>
                  <p className="text-slate-600">Build compelling cover letters with our easy-to-use tools</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">2+</div>
                    <div className="text-sm text-slate-600">Templates</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">DOCX</div>
                    <div className="text-sm text-slate-600">Export</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-slate-600">Free</div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
