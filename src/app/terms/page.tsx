import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Dataforth',
  description: 'Terms of service and user agreement for Dataforth tools and calculators.',
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl flex-grow">
      <div className="mb-16 relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-32 bg-powder/30 dark:bg-powder/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4 text-ink dark:text-white">Terms of Service</h1>
        <p className="text-lg opacity-60 font-sans">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-8 font-sans text-ink/80 dark:text-white/80 leading-relaxed text-lg">
        
        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Dataforth ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. 
          If you do not agree to abide by the above, please do not use this service.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">2. Description of Service</h2>
        <p>
          Dataforth provides a collection of free, browser-based utilities including file converters, finance calculators, 
          and developer tools. These tools are provided "as is" and process data locally on your device without uploading 
          files to our servers.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">3. Disclaimer of Warranties</h2>
        <p>
          The tools, calculators, and information provided by Dataforth (such as the EMI and Salary calculators, or the GST Invoice Generator) 
          are intended for educational and informational purposes only. We do not guarantee the accuracy, completeness, or usefulness of 
          any calculations or generated documents. 
        </p>
        <p>
          You are strictly responsible for verifying the accuracy of any generated invoices, tax calculations, or financial estimates before 
          using them for official, legal, or accounting purposes. We are not liable for any financial losses or legal issues arising from the use of our tools.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">4. Intellectual Property</h2>
        <p>
          The design, code, and content of the Dataforth website are protected by copyright and intellectual property laws. 
          You may not copy, reproduce, or reverse-engineer our tools or design system without explicit permission.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">5. Modifications to Service</h2>
        <p>
          We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice at any time.
        </p>
      </div>
    </div>
  );
}
