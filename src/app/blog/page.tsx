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
    excerpt: 'Demystifying the difference between Basic, HRA, PF, and Professional Tax to find out what actually hits your bank account.',
    date: 'August 12, 2026',
    category: 'Finance'
  },
  {
    title: 'EMI Calculation Explained: How to Plan Your Next Home or Car Loan',
    slug: 'emi-calculation-explained',
    excerpt: 'Understand the mathematical formula behind EMIs and why tenure length drastically changes the total interest you pay to the bank.',
    date: 'August 10, 2026',
    category: 'Finance'
  },
  {
    title: 'GST Invoicing for Indian Freelancers: A Complete Guide',
    slug: 'gst-invoicing-for-freelancers-guide',
    excerpt: 'A breakdown of when a freelancer crosses the GST threshold, the difference between intra-state and inter-state billing, and what a compliant invoice looks like.',
    date: 'August 8, 2026',
    category: 'Business'
  },
  {
    title: 'Why Client-Side File Processing is the Future of Data Privacy',
    slug: 'why-client-side-file-processing-is-the-future',
    excerpt: 'An inside look at how WebAssembly works, why uploading sensitive PDFs to random servers is dangerous, and how local processing solves it.',
    date: 'August 5, 2026',
    category: 'Technology'
  }
];

export default function BlogIndex() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow">
      
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-peach/30 dark:bg-peach/10 blob-shape -z-10 blur-3xl"></div>
        <h1 className="text-5xl font-medium mb-4 text-ink dark:text-white">Dataforth Blog</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Insights on finance, freelancing, and the future of file privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group flex flex-col p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4 text-sm font-medium">
              <span className="text-peach">{post.category}</span>
              <span className="opacity-30">•</span>
              <span className="opacity-60">{post.date}</span>
            </div>
            
            <h2 className="text-2xl font-medium mb-3 group-hover:text-peach transition-colors font-heading leading-snug">
              {post.title}
            </h2>
            
            <p className="opacity-70 leading-relaxed mb-6 flex-grow">
              {post.excerpt}
            </p>
            
            <div className="font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all opacity-80 group-hover:opacity-100">
              Read article <span aria-hidden="true">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
