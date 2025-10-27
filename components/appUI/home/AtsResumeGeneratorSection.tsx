import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const AtsResumeGeneratorSection = () => {
  return (
    <section className="py-20 px-4 md:px-16 bg-gray-50">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">ATS Resume Generator—Beat Applicant Tracking Systems</h2>
          <p className="text-lg text-slate-600 mb-6">
            Did you know that over 88% of qualified candidates are rejected by Applicant Tracking Systems (ATS) due to poor resume formatting? Our ATS resume generator is designed to prevent that. We ensure your resume has the correct formatting, structure, and keywords to get noticed by both bots and humans.
          </p>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-center"><Check className="w-5 h-5 mr-3 text-green-500" /><span>Properly structured sections for easy parsing.</span></li>
            <li className="flex items-center"><Check className="w-5 h-5 mr-3 text-green-500" /><span>Standard, readable fonts that are ATS-friendly.</span></li>
            <li className="flex items-center"><Check className="w-5 h-5 mr-3 text-green-500" /><span>Keyword optimization to match job descriptions.</span></li>
          </ul>
        </div>
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">What is an ATS?</h3>
          <p className="text-slate-600">An Applicant Tracking System (ATS) is software used by companies to manage job applications. It scans your resume for keywords and specific formatting. If your resume isn't optimized for ATS, it might never be seen by a human recruiter. Our templates solve this by using proven, ATS-compliant designs.</p>
        </div>
      </div>
    </section>
  );
};
