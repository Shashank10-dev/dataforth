import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import AdZone from '@/components/AdZone';
import AuthorBio from '@/components/AuthorBio';

export const metadata: Metadata = {
  title: 'GST Invoicing for Indian Freelancers: A Complete Guide | Dataforth',
  description: 'Understand GST thresholds, CGST, SGST, IGST, and the mandatory fields required to generate a compliant tax invoice as an Indian freelancer.',
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
            "description": "Understand GST thresholds, CGST, SGST, IGST, and the mandatory fields required to generate a compliant tax invoice as an Indian freelancer."
          })
        }}
      />

      <header className="mb-12 text-center relative border-b border-ink/10 dark:border-white/10 pb-12">
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
          Understanding the GST thresholds for freelancers, the difference between CGST, SGST, and IGST, and formatting compliant tax invoices.
        </p>
      </header>
      
      <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-ink/10 dark:border-white/10 aspect-[16/9] relative">
        <Image src="/blog/gst-invoice.jpg" alt="GST Invoice for Freelancers" fill className="object-cover" priority />
      </div>

      <AdZone className="mb-12 rounded-xl overflow-hidden" type="banner" />

      <div className="prose prose-lg dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-peach prose-a:no-underline hover:prose-a:underline mx-auto text-ink/90 dark:text-white/90 leading-relaxed">
        
        <p>Transitioning from a salaried role to freelancing brings a lot of freedom, but it also shifts the burden of tax compliance entirely onto your shoulders. In India, one of the most common points of confusion for independent professionals is the Goods and Services Tax (GST).</p>

        <p>Failing to format invoices correctly or charging the wrong type of GST can lead to payment delays from corporate clients and potential penalties from the tax department. Here is a practical breakdown of how GST applies to freelance services.</p>

        <h2>When Do You Need a GST Number?</h2>
        <p>As a freelancer providing services (like software development, writing, design, or consulting), you are legally required to register for GST if your total aggregate turnover in a financial year exceeds ₹20 Lakhs. If your business is based in a special category state (such as certain North-Eastern states), this threshold is lowered to ₹10 Lakhs.</p>

        <p>It is important to note that if you provide services to clients located outside of India (export of services), you are generally required to register for GST regardless of your turnover, though the services themselves may be classified as "zero-rated" (meaning 0% tax is actually applied) if you have filed a Letter of Undertaking (LUT).</p>

        <h2>CGST, SGST, or IGST?</h2>
        <p>If you have a GST number, you must add an 18% GST charge to your base invoice amount for most professional services. The complexity lies in how that 18% is categorized, which depends entirely on where you and your client are located.</p>

        <ul>
          <li><strong>Intra-State (Same State):</strong> If you and your client are registered in the same state (e.g., both in Maharashtra), the 18% tax is split equally between the central and state governments. You will charge 9% CGST (Central) and 9% SGST (State).</li>
          <li><strong>Inter-State (Different States):</strong> If you are located in one state and your client is in another (e.g., you are in Karnataka, client is in Delhi), you charge a single combined 18% IGST (Integrated GST).</li>
        </ul>

        <h2>Mandatory Fields on a Tax Invoice</h2>
        <p>Corporate clients are usually very strict about invoice formatting because they need to claim Input Tax Credit (ITC) on the GST they pay you. If your invoice is missing mandatory fields, their accounting department will likely reject it.</p>

        <p>A compliant GST Tax Invoice must include:</p>
        <ol>
          <li>The words "Tax Invoice" clearly visible at the top.</li>
          <li>A unique Invoice Number (e.g., INV-2026-01) and Date of Issue.</li>
          <li>Your Name, Address, and GSTIN.</li>
          <li>The Client's Name, Address, and GSTIN.</li>
          <li>An SAC (Services Accounting Code) for the services rendered (e.g., 998314 for Information Technology design and development services).</li>
          <li>A line item describing the service, the base taxable value, and the specific GST breakdown (CGST/SGST or IGST).</li>
          <li>Your signature (a digital signature or typed name is usually acceptable).</li>
        </ol>

        <div className="bg-peach/10 dark:bg-peach/5 p-8 rounded-2xl border border-peach/20 my-10 not-prose">
          <h3 className="text-xl font-heading font-medium mb-3 text-peach">Generate Compliant Invoices Instantly</h3>
          <p className="mb-5 text-ink/80 dark:text-white/80 text-sm leading-relaxed">Formatting tables and calculating tax percentages manually in Word or Excel is time-consuming. We built a free Invoice Generator that automatically structures your invoice, calculates the correct tax splits, and generates a clean PDF in seconds.</p>
          <Link 
            href="/business-tools/invoice-generator" 
            className="inline-block bg-peach text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Create a Tax Invoice
          </Link>
        </div>

        <p>Setting up your invoicing process correctly from the beginning saves countless hours of administrative work. A clean, professional invoice not only ensures compliance but also builds trust with your clients and helps you get paid faster.</p>

      </div>

      <AuthorBio />
    </article>
  );
}
