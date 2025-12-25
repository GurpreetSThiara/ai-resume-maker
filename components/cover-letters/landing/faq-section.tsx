'use client';

import { CheckCircle, FileText, Download, Shield } from 'lucide-react';

const faqs = [
  {
    question: 'Is your cover letter builder really free?',
    answer: 'Yes! Our cover letter builder is completely free with no hidden fees, no credit card required, and no mandatory sign-up.'
  },
  {
    question: 'Do I need to sign up to create a cover letter?',
    answer: 'No sign-up required! You can create and download your cover letter immediately without creating an account or providing your email.'
  },
  {
    question: 'Are your cover letter templates ATS-friendly?',
    answer: 'Absolutely! All our templates are ATS-optimized with proper formatting and keywords to pass through applicant tracking systems successfully.'
  },
  {
    question: 'Can I download my cover letter in DOCX format?',
    answer: 'Yes! You can instantly download your cover letter in DOCX format, which is compatible with Microsoft Word and other word processors.'
  },
  {
    question: 'Is this an AI-powered cover letter generator?',
    answer: 'Yes! Our builder includes AI assistance to help you create job-specific content with relevant keywords and professional phrasing.'
  },
  {
    question: 'Do you offer resume and cover letter builder combo?',
    answer: 'Yes! We provide both free resume builder and cover letter builder with matching templates to create consistent professional documents.'
  }
];

export function FaqSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about our free cover letter builder
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed ml-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
