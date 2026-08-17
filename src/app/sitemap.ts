import { MetadataRoute } from 'next';
import { categories } from '@/config/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dataforth.vercel.app';
  
  const routes = [
    { url: '', priority: 1, freq: 'weekly' },
    { url: '/blog', priority: 0.9, freq: 'daily' },
    { url: '/blog/how-to-calculate-ctc-to-take-home-salary', priority: 0.8, freq: 'monthly' },
    { url: '/blog/emi-calculation-explained', priority: 0.8, freq: 'monthly' },
    { url: '/blog/gst-invoicing-for-freelancers-guide', priority: 0.8, freq: 'monthly' },
    { url: '/blog/why-client-side-file-processing-is-the-future', priority: 0.8, freq: 'monthly' },
    { url: '/about', priority: 0.3, freq: 'yearly' },
    { url: '/privacy', priority: 0.3, freq: 'yearly' },
    { url: '/terms', priority: 0.3, freq: 'yearly' },
    { url: '/cookies', priority: 0.3, freq: 'yearly' },
    { url: '/contact', priority: 0.3, freq: 'yearly' },
    
    ...categories.flatMap((category) => [
      { url: category.href, priority: 0.8, freq: 'weekly' },
      ...category.tools.map((tool) => ({
        url: tool.href,
        priority: 0.9,
        freq: 'monthly'
      }))
    ]),
  ];
  
  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.freq as any,
    priority: route.priority,
  }));
}
