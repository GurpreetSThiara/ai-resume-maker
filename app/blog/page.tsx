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
import { blogPosts } from './data/blogPosts';

export { blogPosts };

export default function BlogPage() {
  return <BlogClient blogPosts={blogPosts} />;
}
