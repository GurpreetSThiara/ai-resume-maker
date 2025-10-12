import type { Metadata } from 'next';
import { Users, Target, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | CreateFreeCV.com',
  description: 'Learn about the mission and team behind CreateFreeCV.com, dedicated to helping job seekers succeed.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border-gray-200">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">About CreateFreeCV</h1>
            <p className="mt-4 text-xl text-slate-600">Helping you land your dream job, for free.</p>
          </div>

          <div className="space-y-8 text-lg text-slate-700">
            <div className="flex items-start gap-4">
              <Target className="w-12 h-12 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
                <p>In today's competitive job market, a professional resume is more important than ever. We believe that everyone deserves access to the tools they need to succeed, without financial barriers. Our mission is to provide a powerful, easy-to-use, and completely free resume builder that helps job seekers create ATS-friendly resumes that get results.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Sparkles className="w-12 h-12 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Our Philosophy</h2>
                <p>We are committed to transparency and user-centric design. That's why our core features are free forever, with no hidden fees or sign-up requirements. We offer optional, advanced AI features for those who want to supercharge their resume, but our promise is that you can always build and download a professional resume without paying a dime.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Users className="w-12 h-12 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Our Team</h2>
                <p>We are a small, passionate team of developers, designers, and HR professionals dedicated to leveling the playing field for job seekers. We are constantly working to improve our platform and add new features to help you succeed in your career journey.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
