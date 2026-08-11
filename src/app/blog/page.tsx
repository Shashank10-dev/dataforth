import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Dataforth',
  description: 'Guides and insights on finance, freelancing, and file privacy.',
};

const posts = [
  {
    title: 'How to Calculate Your True Monthly Take-Home Salary from CTC in India',
    slug: 'how-to-calculate-ctc-to-take-home-salary',
    excerpt: 'Demystifying the difference between Basic, HRA, PF, and Professional Tax to find out what actually hits your bank account every month.',
    date: 'August 12, 2026',
    category: 'Finance'
  },
  {
    title: 'EMI Calculation Explained: How to Plan Your Next Home or Car Loan',
    slug: 'emi-calculation-explained',
    excerpt: 'A look at the math behind Equated Monthly Installments and why extending your loan tenure drastically increases the total interest paid.',
    date: 'August 10, 2026',
    category: 'Finance'
  },
  {
    title: 'GST Invoicing for Indian Freelancers: A Complete Guide',
    slug: 'gst-invoicing-for-freelancers-guide',
    excerpt: 'Understanding the GST thresholds for freelancers, the difference between CGST, SGST, and IGST, and formatting compliant tax invoices.',
    date: 'August 8, 2026',
    category: 'Business'
  },
  {
    title: 'Why Client-Side File Processing is the Future of Data Privacy',
    slug: 'why-client-side-file-processing-is-the-future',
    excerpt: 'An overview of WebAssembly, the security risks of cloud-based PDF compression, and how local processing protects sensitive documents.',
    date: 'August 5, 2026',
    category: 'Technology'
  }
];

export default function BlogIndex() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl flex-grow">
      
      <div className="mb-16 relative border-b border-ink/10 dark:border-white/10 pb-12">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-32 bg-peach/30 dark:bg-peach/10 blob-shape -z-10 blur-3xl"></div>
        <h1 className="text-5xl font-medium mb-4 text-ink dark:text-white font-heading">Dataforth Blog</h1>
        <p className="text-xl opacity-70 max-w-2xl font-sans leading-relaxed">
          Insights on personal finance, freelancing, and the future of file privacy on the web.
        </p>
      </div>

      <div className="space-y-12 font-sans">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-peach rounded-xl">
              <div className="flex items-center gap-3 mb-3 text-sm font-medium">
                <span className="text-peach">{post.category}</span>
                <span className="opacity-30">•</span>
                <span className="opacity-60">{post.date}</span>
              </div>
              
              <h2 className="text-3xl font-medium mb-3 group-hover:text-peach transition-colors font-heading leading-snug">
                {post.title}
              </h2>
              
              <p className="text-lg opacity-70 leading-relaxed mb-4 text-ink/90 dark:text-white/90">
                {post.excerpt}
              </p>
              
              <div className="font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all opacity-70 group-hover:opacity-100 text-ink dark:text-white">
                Read full article <span aria-hidden="true">&rarr;</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
