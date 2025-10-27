import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need to sign up to download my resume?",
    answer: "No, absolutely not. CreateFreeCV is a completely free resume builder with no sign-up required. You can create, customize, and download your professional resume instantly without creating an account, providing an email address, or any registration. Simply fill in your details, choose a template, and download your ATS-optimized resume in PDF format—all without barriers. DOCX format is coming soon. This makes us one of the few truly free resume builders online with no sign-up walls.",
  },
  {
    question: "Is there really no credit card required?",
    answer: "Yes, CreateFreeCV is genuinely 100% free with no credit card required at any stage. Unlike other resume builders that claim to be free but ask for payment information at download, we never request credit card details. There are no hidden fees, no surprise charges, and no paid tiers blocking essential features. Our core resume building and downloading features are completely free forever—no trials, no upsells, no payment information needed.",
  },
  {
    question: "What's the difference between a resume and a CV?",
    answer: "A resume is typically a 1-2 page document summarizing your work experience, skills, and education, commonly used for job applications in the United States, Canada, and most corporate positions. A CV (Curriculum Vitae) is a longer, more detailed document including all your academic and professional history, primarily used in academic, research, medical, or international job applications. Our templates work for both formats—US job seekers should use the one-page resume format, while international users can extend sections as needed for CV requirements.",
  },
  {
    question: "Will this work with Applicant Tracking Systems?",
    answer: "Yes, all our templates are specifically designed to be ATS-friendly. Applicant Tracking Systems (ATS) are used by over 90% of large companies to scan and filter resumes before human recruiters see them. Our ATS resume generator uses clean formatting, standard fonts, proper heading structure, and keyword optimization to ensure your resume passes ATS scans. We avoid graphics, tables, and complex formatting that confuses ATS software, giving you the best chance of getting your resume in front of hiring managers.",
  },
  {
    question: "Do you collect my personal information?",
    answer: "No. Since we don't require sign-up, we don't collect or store your personal information. Your resume data stays in your browser and is never uploaded to our servers unless you optionally create a free account for AI features. We are privacy-first and GDPR compliant. We don't sell your data, send spam emails, or track your information. You have complete control over your resume content, and you can delete it anytime.",
  },
  {
    question: "What file formats can I download?",
    answer: "You can download your resume in PDF format instantly and completely free. PDF format ensures your resume looks exactly the same on any device and is commonly requested by employers. We are working on adding DOCX (Microsoft Word) format, which will be available soon. Both formats are ATS-compatible and professional.",
  },
  {
    question: "Is this free for US job seekers?",
    answer: "Yes, CreateFreeCV is 100% free for job seekers everywhere, including the United States. Our templates follow the one-page resume format preferred by 95% of US hiring managers and are optimized for American Applicant Tracking Systems used by Fortune 500 companies. Whether you're in New York, California, Texas, or anywhere else, you get full access to all features with no geographical restrictions, no credit card required, and no hidden fees.",
  },
];

export const FaqSection = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </div>
    </section>
  );
};
