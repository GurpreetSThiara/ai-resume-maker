import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from './data/blogPosts';

interface BlogPostDetailProps {
    post: BlogPost;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="mb-8">
                    <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                </div>

                <section className="text-center mb-12">
                    <Badge className="mb-4 bg-primary/10 text-primary border-0">{post.category}</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readingTime}</span>
                        </div>
                    </div>

                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed border-l-4 border-primary/20 pl-6 italic">
                            {post.excerpt}
                        </p>
                    )}
                </section>

                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-0 shadow-none sm:shadow-sm sm:border bg-transparent sm:bg-card">
                        <CardContent className="p-0 sm:p-8 md:p-12 text-foreground/80 leading-relaxed font-normal">
                            {post.content}
                        </CardContent>
                    </Card>
                </section>

                {/* Newsletter / CTA Section could go here */}
                <div className="mt-16 pt-8 border-t text-center">
                    <h3 className="text-2xl font-bold mb-4">Want to build your ATS-friendly resume?</h3>
                    <p className="text-muted-foreground mb-6">Create a professional resume in minutes with our free builder.</p>
                    <Link
                        href="/dashboard/resume/create"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        Build My Resume Now
                    </Link>
                </div>

            </div>
        </main>
    );
};

export default BlogPostDetail;
