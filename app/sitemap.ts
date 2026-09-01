import { MetadataRoute } from 'next';
import { blogPosts } from './blog/data/blogPosts';
import { SITE_URL } from '@/lib/seo';

/**
 * Blog slugs that are served by a static route which canonicals to a page
 * outside /blog/. A sitemap should only list canonical URLs, so these are
 * excluded here — their canonical targets are listed among the static routes.
 */
const NON_CANONICAL_BLOG_SLUGS = new Set(['resume-for-freshers', 'ats-resume-guide']);

/**
 * Fixed date for routes with no real content timestamp. Re-stamping these with
 * `new Date()` on every request makes every crawl see a fresh lastmod, which
 * trains search engines to ignore the signal site-wide.
 */
const STATIC_ROUTES_LAST_MODIFIED = new Date('2026-09-01');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

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
    { url: `${baseUrl}/image-converter`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ] as MetadataRoute.Sitemap).map((route) => ({ ...route, lastModified: STATIC_ROUTES_LAST_MODIFIED }));

  // Blog posts are generated from the single source of truth so new posts are
  // indexed automatically and slugs never drift out of sync.
  const blogRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => !NON_CANONICAL_BLOG_SLUGS.has(post.id))
    .map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : STATIC_ROUTES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...blogRoutes];
}
