import type { Metadata } from 'next';
import { HelpCircle, FileText, Download, Shield, Zap, Globe, MessageCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'FAQ - Frequently Asked Questions | CreateFreeCV.com',
    description: 'Find answers to common questions about CreateFreeCV.com, our resume builder, ATS optimization, templates, and more.',
    keywords: ['FAQ', 'resume builder help', 'ATS questions', 'resume templates', 'free resume', 'help center'],
    openGraph: {
        title: 'FAQ - Frequently Asked Questions | CreateFreeCV',
        description: 'Get answers to all your questions about creating professional ATS-friendly resumes with CreateFreeCV.com',
        url: 'https://createfreecv.com/faq',
        siteName: 'CreateFreeCV',
        type: 'website'
    },
};

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 blur-3xl animate-pulse" />
                    <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="container mx-auto px-4 pt-20 pb-16 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full mb-6 shadow-sm">
                            <HelpCircle className="w-3 h-3 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">We're Here to Help</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
                            Everything you need to know about CreateFreeCV.com
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 pb-20">
                <div className="max-w-4xl mx-auto">
                    {/* Quick Links */}
                    <div className="grid md:grid-cols-4 gap-4 mb-12">
                        <a href="#general" className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-center group">
                            <Search className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">General</p>
                        </a>
                        <a href="#templates" className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-center group">
                            <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-700 group-hover:text-green-600 transition-colors">Templates</p>
                        </a>
                        <a href="#ats" className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-center group">
                            <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors">ATS & Formatting</p>
                        </a>
                        <a href="#privacy" className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-center group">
                            <Shield className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">Privacy</p>
                        </a>
                    </div>

                    {/* General Questions */}
                    <div id="general" className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">General Questions</h2>
                        </div>

                        <Card className="shadow-md">
                            <CardContent className="p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Is CreateFreeCV.com really free?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Yes! CreateFreeCV.com is completely free to use. You can create, edit, and download professional resumes without any cost. There are no hidden fees, no subscriptions, and no credit card required. While we may offer optional AI-powered enhancements in the future, the core resume building and downloading features will always remain free.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Do I need to create an account?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            No account is required to create and download your resume. Your data is stored locally in your browser. However, creating an account allows you to save your resumes in the cloud, access them from any device, and sync your work across multiple devices.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-left font-semibold">
                                            How long does it take to create a resume?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Most users complete their resume in 10-15 minutes. Our intuitive interface and pre-designed templates make the process quick and straightforward. You simply fill in your information, choose a template, and download your professional resume.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Can I create multiple resumes?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Absolutely! You can create as many resumes as you need. We recommend tailoring your resume for each job application to maximize your chances of getting interviews. Each resume can use a different template and highlight different skills and experiences.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-5">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Can I edit my resume after downloading?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Yes! Your resume data is automatically saved in your browser's local storage. You can return anytime to edit and re-download your resume. If you create an account, your resumes are saved to the cloud and accessible from any device.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Templates & Customization */}
                    <div id="templates" className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Templates & Customization</h2>
                        </div>

                        <Card className="shadow-md">
                            <CardContent className="p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-left font-semibold">
                                            How many templates do you offer?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            We offer multiple professionally designed, ATS-friendly templates. Each template is optimized for different industries and career levels. All templates are free to use and can be customized to match your personal style while maintaining ATS compatibility.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Can I change the template after I've started?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Yes! You can switch between templates at any time without losing your data. Your information is saved separately from the template design, so you can preview different looks and choose the one that best represents you.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Can I customize colors and fonts?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Our templates are designed with ATS compatibility in mind, which means we use standard fonts and minimal styling to ensure your resume passes automated screening systems. While customization options may be limited, this ensures your resume gets seen by recruiters.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="text-left font-semibold">
                                            What sections can I add to my resume?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            You can add standard sections like Work Experience, Education, Skills, Certifications, Projects, Volunteer Work, Languages, and Awards. You can also create custom sections to highlight unique qualifications relevant to your field.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-5">
                                        <AccordionTrigger className="text-left font-semibold">
                                            How do I choose the right template for my industry?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            For creative fields (design, marketing), you might prefer templates with subtle design elements. For corporate/technical roles (finance, engineering, IT), clean minimal templates work best. Our blog has detailed guides on choosing templates for specific industries.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ATS & Formatting */}
                    <div id="ats" className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">ATS & Formatting</h2>
                        </div>

                        <Card className="shadow-md">
                            <CardContent className="p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-left font-semibold">
                                            What is ATS and why does it matter?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            ATS (Applicant Tracking System) is software used by 75% of companies to filter resumes before they reach human recruiters. ATS scans resumes for keywords, proper formatting, and relevant experience. Our templates are designed to pass ATS scans so your resume actually gets seen by hiring managers.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Are your templates ATS-friendly?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Yes! All our templates are specifically designed to be ATS-compatible. We avoid elements that confuse ATS systems like tables, text boxes, headers/footers with critical information, complex graphics, and unusual fonts. Our templates use clean formatting that both ATS and humans can easily read.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-left font-semibold">
                                            What file format should I download?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            We offer PDF downloads, which is the most universally accepted format. PDFs preserve formatting across different devices and are accepted by most ATS systems. Always check the job posting for specific format requirements—some companies prefer .docx files.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="text-left font-semibold">
                                            How do I make my resume ATS-friendly?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>Use standard section headings (Work Experience, Education, Skills)</li>
                                                <li>Include keywords from the job description naturally</li>
                                                <li>Use simple, clean formatting without fancy graphics or tables</li>
                                                <li>Spell out acronyms at least once (e.g., "Search Engine Optimization (SEO)")</li>
                                                <li>Use standard fonts like Arial, Calibri, or Times New Roman</li>
                                                <li>Avoid headers/footers for contact information</li>
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-5">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Should I include keywords in my resume?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Yes, but naturally. Read the job description and identify key skills, qualifications, and industry terms. Incorporate these keywords throughout your resume where they genuinely apply. Never "keyword stuff"—ATS systems can detect this and it looks unprofessional if a human reads it.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-6">
                                        <AccordionTrigger className="text-left font-semibold">
                                            How long should my resume be?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li><strong>0-5 years experience:</strong> 1 page</li>
                                                <li><strong>5-15 years experience:</strong> 1-2 pages</li>
                                                <li><strong>15+ years experience:</strong> 2 pages (rarely 3 for academic/research roles)</li>
                                            </ul>
                                            <p className="mt-2">Recruiters spend 6-7 seconds on initial resume review, so prioritize quality over quantity.</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Privacy & Security */}
                    <div id="privacy" className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Privacy & Security</h2>
                        </div>

                        <Card className="shadow-md">
                            <CardContent className="p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Is my personal information safe?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Yes! Your data is stored locally in your browser by default and never sent to our servers unless you create an account. We use industry-standard security measures to protect any data you choose to save to the cloud. We never sell or share your personal information with third parties.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-left font-semibold">
                                            What data do you collect?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            We collect minimal data necessary for site functionality: basic analytics (page views, user flow), and if you create an account, your email and saved resume data. We use this information solely to improve our service and provide you with resume creation features. See our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> for complete details.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Can I delete my data?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Yes. If you're using local storage, you can clear your browser's local storage to delete resume data. If you have an account, you can delete your account and all associated data from your account settings. Once deleted, your data is permanently removed from our servers.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Do you use cookies?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            We use minimal cookies for essential site functionality and analytics to improve user experience. We do not use tracking cookies for advertising purposes. You can review our <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link> for detailed information.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Download & Export */}
                    <div id="download" className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <Download className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Download & Export</h2>
                        </div>

                        <Card className="shadow-md">
                            <CardContent className="p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-left font-semibold">
                                            What formats can I download my resume in?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Currently, we offer PDF downloads. PDF is the most professional and universally accepted format that preserves your resume's formatting across all devices and platforms.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Is there a download limit?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            No! You can download your resume as many times as you need, completely free. Make edits and re-download whenever you want to update your resume for different job applications.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Can I print my resume directly?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            Yes! After downloading your PDF, you can print it from your PDF viewer. Our templates are designed to print clearly on standard letter-size (8.5" x 11") paper with proper margins.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="text-left font-semibold">
                                            Why can't I edit the PDF after downloading?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600 leading-relaxed">
                                            PDFs are designed to preserve formatting and prevent accidental changes. To edit your resume, return to our website where your data is saved, make your changes, and download a new PDF. This ensures your resume maintains its professional appearance and ATS compatibility.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Still Have Questions? */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                        <CardContent className="p-8 text-center">
                            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Still Have Questions?</h3>
                            <p className="text-slate-600 mb-6">
                                We're here to help! Check out our helpful resources or get in touch.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    href="/blog"
                                    className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-200"
                                >
                                    Read Our Blog
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
