import React from 'react';
import { notFound } from 'next/navigation';
import { blogPosts } from '../data/blogPosts';
import BlogPostDetail from '../BlogPostDetail';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { blogPostSchema, truncateForMeta, SITE_URL } from '@/lib/seo';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.id === slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const suffix = ' | CreateFreeCV Blog';
    const metaTitle = post.title.length + suffix.length <= 60
        ? `${post.title}${suffix}`
        : truncateForMeta(post.title, 60);

    return {
        title: metaTitle,
        description: truncateForMeta(post.excerpt, 160),
        alternates: {
            canonical: `${SITE_URL}/blog/${post.id}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author],
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.id === slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <JsonLd
                data={blogPostSchema({
                    title: post.title,
                    description: post.excerpt,
                    slug: post.id,
                    image: post.image,
                    author: post.author,
                    publishedAt: post.publishedAt,
                })}
            />
            <BlogPostDetail post={post} />
        </>
    );
}
