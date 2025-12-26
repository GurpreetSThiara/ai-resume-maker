'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CoverletterImages } from '@/constants/coverLetterConstants';

const templates = [
  {
    id: 'classic',
    name: 'Professional Template',
    description: 'A clean, professional cover letter template perfect for traditional industries',
    image: CoverletterImages.CLASSIC,
    designType: 'Classic Design'
  },
  {
    id: 'split-header',
    name: 'Creative Template', 
    description: 'A modern, creative cover letter template perfect for creative professionals',
    image: CoverletterImages.SPLIT_HEADER,
    designType: 'Split Header Design'
  }
];

export function TemplatesSection() {
  const router = useRouter();

  const handleTemplateSelect = (templateId: string) => {
    window.open(`/cover-letter/editor/new?template=${templateId}`, '_blank');
  };

  return (
    <section id="templates" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Professional Cover Letter Templates
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose from our collection of ATS-optimized templates designed for every industry
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <Card key={template.id} className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className=" bg-linear-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                <img 
                  src={template.image} 
                  alt={`${template.name} Cover Letter Template`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">{template.designType}</span>
                  </div>
                  <Button size="sm" onClick={() => handleTemplateSelect(template.id)}>
                    Use This Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
{/* 
        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => router.push('/cover-letter/editor/new')}>
            Start from Scratch
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div> */}
      </div>
    </section>
  );
}
