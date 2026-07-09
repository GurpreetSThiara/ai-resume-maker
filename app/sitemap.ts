import { MetadataRoute } from 'next';
import { blogPosts } from './blog/data/blogPosts';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/free-ats-resume-templates`, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/free-ats-resume-templates/create`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resume-examples`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/cover-letter`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faq`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/how-to-write-a-resume`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/resume-for-freshers`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/software-engineer-resume`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/ats-resume-explained`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/resume-rejected-without-interview`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/image-converter`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ] as MetadataRoute.Sitemap).map((route) => ({ ...route, lastModified: now }));

  // Blog posts are generated from the single source of truth so new posts are
  // indexed automatically and slugs never drift out of sync.
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
