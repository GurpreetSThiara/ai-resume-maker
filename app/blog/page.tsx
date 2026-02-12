import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, Search, X } from "lucide-react";
import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog | CreateFreeCV.com - Resume Tips & Career Advice',
  description: 'Expert tips, tricks, and insights on resume building, career advice, and job searching from the CreateFreeCV team.',
  keywords: ['resume blog', 'career advice', 'job search tips', 'resume writing tips', 'career guidance', 'interview tips'],
};

// Actual blog posts we have
export const blogPosts = [
  {
    id: 'how-to-use-ai-resume-builder',
    title: 'How to Use AI to Build a Job-Winning Resume in 2026',
    excerpt: 'Stop using generic ChatGPT resumes. Learn the "Hybrid Method" to combine AI speed with human strategy, avoid ATS rejection, and impress recruiters.',
    author: 'CreateFreeCV Team',
    publishedAt: '2026-02-12',
    readingTime: '8 min read',
    category: 'AI Tips',
    featured: true,
    image: '/blog/ai-resume-guide.jpg'
  },
  {
    id: 'resume-for-freshers',
    title: 'Resume for Freshers: Complete Guide to Create Your First Job-Winning Resume (2026)',
    excerpt: 'Learn how to create a professional fresher resume with our step-by-step guide. Includes 25+ examples, ATS-friendly tips, and real resume samples for students and recent graduates.',
    content: 'Creating a resume as a fresher is often confusing. You may feel stuck because you don\'t have years of work experience...',
    author: 'CreateFreeCV Team',
    publishedAt: '2026-02-09',
    readingTime: '8 min read',
    category: 'Resume Writing',
    featured: false,
    image: '/blog/fresher-resume-guide.jpg'
  },
  {
    id: 'ats-resume-guide',
    title: 'ATS Resume Guide 2026 – How to Create a Resume That Gets Interviews',
    excerpt: 'Learn how to create an ATS-optimized resume in 2026 with real examples for developers, marketers, students, and freshers. Step-by-step guide to pass Applicant Tracking Systems.',
    author: 'CreateFreeCV Team',
    publishedAt: '2026-02-08',
    readingTime: '6 min read',
    category: 'ATS Tips',
    featured: false,
    image: '/blog/ats-resume-guide.jpg'
  },
  {
    id: 'software-engineer-resume',
    title: 'Resume for Software Engineers: How to Create a Technical Resume That Gets Interviews in 2026',
    excerpt: 'Learn how software engineers can create ATS-optimized technical resumes that get interviews. Complete guide with examples, formatting tips, and what recruiters look for in 2026.',
    author: 'CreateFreeCV Team',
    publishedAt: '2026-02-09',
    readingTime: '12 min read',
    category: 'Resume Writing',
    featured: false,
    image: '/blog/software-engineer-resume.jpg'
  },
  {
    id: 'ats-resume-explained',
    title: 'ATS Resume Explained: What It Is, How It Works, and How to Beat It in 2026',
    excerpt:
      'Understand what Applicant Tracking Systems (ATS) are, how they read your resume, and how to create an ATS-friendly resume that reaches human recruiters in 2026.',
    author: 'CreateFreeCV Team',
    publishedAt: '2026-02-10',
    readingTime: '10 min read',
    category: 'ATS Tips',
    featured: true,
    image: '/blog/ats-resume-explained.jpg',
  },
  {
    id: 'resume-rejected-without-interview',
    title: 'Resume Rejected Without Interview? 12 Real Reasons Recruiters Don\'t Call Back (And How to Fix It)',
    excerpt:
      'Learn the 12 real reasons why your resume gets rejected before interviews and discover actionable strategies to fix each issue and get more callbacks from recruiters.',
    author: 'CreateFreeCV Team',
    publishedAt: '2026-02-11',
    readingTime: '10 min read',
    category: 'Resume Writing',
    featured: false,
    image: '/blog/resume-rejection-reasons.jpg',
  }
];

export default function BlogPage() {
  return <BlogClient blogPosts={blogPosts} />;
}
