import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile/', '/settings/', '/dashboard/', '/cover-letter/editor/', '/dev/'],
    },
    sitemap: 'https://createfreecv.com/sitemap.xml',
  };
}
