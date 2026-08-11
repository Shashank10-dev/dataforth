import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import AdZone from '@/components/AdZone';

export const metadata: Metadata = {
  title: 'GST Invoicing for Indian Freelancers: A Complete Guide | Dataforth',
  description: 'A breakdown of when a freelancer crosses the GST threshold, the difference between intra-state and inter-state billing, and what a compliant invoice looks like.',
};

export default function BlogPost() {
  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl flex-grow font-sans">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "GST Invoicing for Indian Freelancers: A Complete Guide",
            "datePublished": "2026-08-08T08:00:00+08:00",
            "dateModified": "2026-08-08T08:00:00+08:00",
            "author": [{
              "@type": "Organization",
              "name": "Dataforth",
              "url": "https://dataforth.vercel.app"
            }],
            "description": "A breakdown of when a freelancer crosses the GST threshold, the difference between intra-state and inter-state billing, and what a compliant invoice looks like."
          })
        }}
      />

      <header className="mb-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-peach/30 dark:bg-peach/10 blob-shape -z-10 blur-3xl"></div>
        <div className="flex items-center justify-center gap-3 mb-6 text-sm font-medium">
          <span className="text-peach">Business</span>
          <span className="opacity-30">•</span>
          <span className="opacity-60">August 8, 2026</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-medium mb-6 leading-tight font-heading">
          GST Invoicing for Indian Freelancers: A Complete Guide
        </h1>
        <p className="text-xl opacity-70 leading-relaxed max-w-2xl mx-auto">
          A breakdown of when a freelancer crosses the GST threshold, the difference between intra-state and inter-state billing, and what a compliant invoice looks like.
        </p>
      </header>
      
      <AdZone className="mb-12 rounded-xl overflow-hidden" type="banner" />

      <div className="prose prose-lg dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-peach prose-a:no-underline hover:prose-a:underline max-w-none text-ink/80 dark:text-white/80 leading-relaxed">
        
        <p>Freelancing in India is booming, but the tax compliance rules that come with it can be intimidating. The Goods and Services Tax (GST) is one of the most common hurdles new freelancers face when they start landing big corporate clients.</p>

        <p>Do you need to charge GST? When do you need to register? And how do you format your invoices correctly so your clients don't reject them? Let's dive in.</p>

        <h2>When Do Freelancers Need a GST Registration?</h2>
        <p>Not every freelancer needs to register for GST on day one. You are legally required to obtain a GST registration if:</p>
        <ul>
          <li>Your aggregate turnover in a financial year exceeds <strong>₹20 Lakhs</strong> (or ₹10 Lakhs if you are located in certain special category states).</li>
          <li>You provide services to clients located <strong>outside India</strong> (export of services), although the ₹20 Lakh exemption limit was recently extended to interstate and export service providers.</li>
        </ul>
        <p>If you earn less than ₹20 Lakhs a year and only bill clients within India, you can generally operate without a GST number. You simply raise standard invoices without charging any tax.</p>

        <h2>CGST, SGST, and IGST Explained</h2>
        <p>If you are registered for GST, you must charge it on your invoices. But India has a dual-GST model, which means you have to split the tax based on where you and your client are located.</p>

        <h3>Intra-State Billing (Same State)</h3>
        <p>If you and your client are located in the <strong>same state</strong> (e.g., you live in Maharashtra and your client is a company headquartered in Mumbai, Maharashtra), you must charge CGST and SGST.</p>
        <p>For services, the standard GST rate is 18%. You split this equally: <strong>9% CGST</strong> (Central GST) and <strong>9% SGST</strong> (State GST).</p>

        <h3>Inter-State Billing (Different States)</h3>
        <p>If you and your client are located in <strong>different states</strong> (e.g., you live in Karnataka but your client is in Delhi), you must charge IGST.</p>
        <p>The entire 18% is billed as a single line item called <strong>18% IGST</strong> (Integrated GST).</p>

        <div className="bg-peach/10 dark:bg-peach/5 p-8 rounded-2xl border border-peach/20 my-10">
          <h3 className="mt-0 mb-4 text-peach">Generate Compliant Invoices Instantly</h3>
          <p className="mb-6">Don't mess around with Excel formulas. Our GST Invoice Generator automatically calculates the correct CGST/SGST or IGST splits and generates a perfect PDF.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/business-tools/gst-invoice-generator" 
              className="inline-block text-center bg-peach text-white px-6 py-3 rounded-xl font-medium hover:-translate-y-0.5 transition-transform"
            >
              GST Invoice Generator
            </Link>
            <Link 
              href="/business-tools/freelancer-invoice-generator" 
              className="inline-block text-center bg-transparent border border-peach text-peach px-6 py-3 rounded-xl font-medium hover:bg-peach/10 transition-colors"
            >
              Non-GST Invoice Generator
            </Link>
          </div>
        </div>

        <h2>What Must a GST Invoice Include?</h2>
        <p>To be legally valid and allow your corporate clients to claim Input Tax Credit (ITC), your GST invoice must include:</p>
        <ul>
          <li>The word "Tax Invoice" prominently displayed at the top.</li>
          <li>Your Name, Address, and GSTIN.</li>
          <li>The Client's Name, Address, and GSTIN (if they are registered).</li>
          <li>A unique sequential Invoice Number.</li>
          <li>The Date of Issue.</li>
          <li>SAC Code (Services Accounting Code) - typically 9983 for IT/Consulting services.</li>
          <li>Description of the services provided.</li>
          <li>Taxable value of the services.</li>
          <li>Applicable rate of GST (CGST/SGST or IGST).</li>
          <li>Total amount in words and figures.</li>
        </ul>

        <h2>Conclusion</h2>
        <p>GST compliance doesn't have to be a headache. Keep track of your annual turnover, register when you approach the ₹20 Lakh threshold, and use automated tools to generate perfect invoices. Your clients will appreciate the professionalism, and you'll stay on the right side of the tax department.</p>
      </div>

    </article>
  );
}
