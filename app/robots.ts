import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/profile/', '/settings/'],
    },
    sitemap: 'https://createfreecv.com/sitemap.xml',
  };
}
