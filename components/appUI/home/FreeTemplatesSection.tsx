import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const FreeTemplatesSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Free Resume Templates No Sign Up Required</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
          Choose from a variety of professionally designed, ATS-optimized resume templates. Our templates are crafted to impress hiring managers and pass through applicant tracking systems. With a single click, you can download your chosen template and start editing instantly. No registration, no barriers—just beautifully designed templates ready for your content.
        </p>
        <Link href="/free-ats-resume-templates">
          <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-300 hover:bg-slate-100">
            Explore All Templates
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
