import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | Dataforth',
  description: 'Information about how we use cookies and tracking technologies.',
};

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl flex-grow">
      <div className="mb-16 relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-32 bg-peach/30 dark:bg-peach/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4 text-ink dark:text-white">Cookie Policy</h1>
        <p className="text-lg opacity-60 font-sans">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-8 font-sans text-ink/80 dark:text-white/80 leading-relaxed text-lg">
        
        <p>
          This Cookie Policy explains how Dataforth ("we", "us", and "our") uses cookies and similar technologies 
          to recognize you when you visit our website.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">1. What are cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
          Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
          as well as to provide reporting information and display personalized advertisements.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">2. Why do we use cookies?</h2>
        <p>
          Because our file processing tools work entirely client-side (in your browser), we do not need or use cookies 
          to process your files. However, we use third-party cookies for two main reasons:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Analytics:</strong> To understand how users interact with our site so we can improve the layout and tools (via Google Analytics).</li>
          <li><strong>Advertising:</strong> To display relevant ads that keep our tools free to use (via Google AdSense).</li>
        </ul>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">3. Google AdSense & DoubleClick Cookie</h2>
        <p>
          Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies 
          enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
        </p>
        <p>
          Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-peach hover:underline">Google Ads Settings</a>.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">4. How can I control cookies?</h2>
        <p>
          When you first visit our site, you are presented with a Consent Banner that allows you to accept or reject 
          non-essential cookies (Analytics and Advertising). You can also set or amend your web browser controls to accept 
          or refuse cookies entirely.
        </p>
        
        <p>
          For more details on our data practices, please see our <Link href="/privacy" className="text-peach hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
