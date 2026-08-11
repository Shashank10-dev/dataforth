import { MetadataRoute } from 'next';

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
    { url: '/contact', priority: 0.3, freq: 'yearly' },
    
    // PDF Tools
    { url: '/pdf-tools', priority: 0.8, freq: 'weekly' },
    { url: '/pdf-tools/merge-pdf', priority: 0.9, freq: 'monthly' },
    { url: '/pdf-tools/compress-pdf', priority: 0.9, freq: 'monthly' },
    
    // Image Tools
    { url: '/image-tools', priority: 0.8, freq: 'weekly' },
    { url: '/image-tools/compress-image', priority: 0.9, freq: 'monthly' },
    { url: '/image-tools/convert-heic-to-jpg', priority: 0.9, freq: 'monthly' },
    { url: '/image-tools/remove-background', priority: 0.9, freq: 'monthly' },
    
    // Finance Tools
    { url: '/finance-tools', priority: 0.8, freq: 'weekly' },
    { url: '/finance-tools/emi-calculator', priority: 0.9, freq: 'monthly' },
    { url: '/finance-tools/salary-calculator', priority: 0.9, freq: 'monthly' },
    
    // Business Tools
    { url: '/business-tools', priority: 0.8, freq: 'weekly' },
    { url: '/business-tools/gst-invoice-generator', priority: 0.9, freq: 'monthly' },
    { url: '/business-tools/freelancer-invoice-generator', priority: 0.9, freq: 'monthly' },
    
    // Developer Tools
    { url: '/developer-tools', priority: 0.8, freq: 'weekly' },
    { url: '/developer-tools/json-formatter', priority: 0.9, freq: 'monthly' },
    { url: '/developer-tools/regex-tester', priority: 0.9, freq: 'monthly' },
    
    // Career Tools
    { url: '/career-tools', priority: 0.8, freq: 'weekly' },
    { url: '/career-tools/resume-builder', priority: 0.9, freq: 'monthly' },
  ];
  
  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.freq as any,
    priority: route.priority,
  }));
}
