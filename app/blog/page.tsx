import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, Search, X } from "lucide-react";
import type { Metadata } from 'next';
import BlogClient from './BlogClient';
import { pageSocialMetadata } from '@/lib/seo';

const TITLE = 'Blog | CreateFreeCV.com - Resume Tips & Career Advice';
const DESCRIPTION = 'Expert tips, tricks, and insights on resume building, career advice, and job searching from the CreateFreeCV team.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['resume blog', 'career advice', 'job search tips', 'resume writing tips', 'career guidance', 'interview tips'],
  alternates: {
    canonical: 'https://createfreecv.com/blog',
  },
  ...pageSocialMetadata({ title: TITLE, description: DESCRIPTION, path: '/blog' }),
};

// Actual blog posts we have
import { blogPosts } from './data/blogPosts';

export { blogPosts };

export default function BlogPage() {
  return <BlogClient blogPosts={blogPosts} />;
}
