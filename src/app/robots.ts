import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://studyfreepdf.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/explore',
          '/p/*',
          '/exams/*',
          '/internships',
          '/verify',
          '/verify/*',
          '/about',
          '/pricing-policy',
          '/refund-policy',
          '/terms',
          '/privacy',
          '/contact',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/library',
          '/library/*',
          '/order/*',
          '/checkout',
          '/checkout/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
