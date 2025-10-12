'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter, Facebook, Loader2, CheckCircle, XCircle, Instagram } from 'lucide-react';
import Link from 'next/link';

// Metadata is defined statically, so it remains outside the client component.
// export const metadata = {
//   title: 'Contact Us | CreateFreeCV.com',
//   description: 'Get in touch with the CreateFreeCV team. We love to hear your feedback and answer your questions.',
// };

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APP_SCRIPT_URL;
    if (!scriptUrl) {
      console.error('Google App Script URL is not defined.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Important: Google Apps Script requires no-cors for cross-origin requests
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      // Since 'no-cors' mode means we can't read the response, we optimistically assume success.
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-xl text-slate-600">We're here to help and answer any question you might have.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-lg border-gray-200">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Information</h2>
              <p className="text-slate-600 mb-6">Fill up the form and our team will get back to you within 24 hours, or reach out to us directly.</p>

              <div className="space-y-4">
                <a href="mailto:createfreecv@gmail.com" className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>createfreecv@gmail.com</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {/* <Link href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link> */}
                <Link
                  href="https://www.instagram.com/createfreecv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </Link>

                {/* <Link href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link> */}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message..." rows={6} required />
              </div>
              <div className="text-left">
                <Button type="submit" size="lg" className="w-full md:w-auto bg-gradient-to-r from-green-600 to-slate-600 hover:from-purple-700 hover:to-blue-700" disabled={status === 'loading'}>
                  {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-600 mt-4">
                  <CheckCircle className="w-5 h-5" />
                  <p>Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 mt-4">
                  <XCircle className="w-5 h-5" />
                  <p>Something went wrong. Please try again or email us directly.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
