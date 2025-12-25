import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Shield, Target } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'ATS‑Friendly Templates',
    description: 'Job‑specific, ATS‑optimized cover letter templates with customizable layouts for 2025'
  },
  {
    icon: Download,
    title: 'Instant DOCX Download',
    description: 'Download your cover letter immediately in DOCX format, no credit card required'
  },
  {
    icon: Shield,
    title: 'Privacy‑First Builder',
    description: 'No email required, no login needed - your data stays completely private'
  },
  {
    icon: Target,
    title: 'AI‑Powered Writer',
    description: 'AI‑assisted cover letter generator with ATS keywords and job‑specific content'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Why Choose Our Cover Letter Builder?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional tools designed to help you stand out and land more interviews
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-60 -translate-y-16 translate-x-16 group-hover:opacity-80 transition-opacity" />
              <CardHeader className="relative text-center">
                <div className="w-16 h-16 bg-linear-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
