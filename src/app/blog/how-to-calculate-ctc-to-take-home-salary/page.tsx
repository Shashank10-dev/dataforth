import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import AdZone from '@/components/AdZone';
import AuthorBio from '@/components/AuthorBio';

export const metadata: Metadata = {
  title: 'How to Calculate Your True Monthly Take-Home Salary from CTC in India | Dataforth',
  description: 'Learn how to calculate your exact in-hand salary from your CTC by understanding Basic, HRA, PF, and Professional Tax deductions in India.',
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
            "headline": "How to Calculate Your True Monthly Take-Home Salary from CTC in India",
            "datePublished": "2026-08-12T08:00:00+08:00",
            "dateModified": "2026-08-12T08:00:00+08:00",
            "author": [{
              "@type": "Organization",
              "name": "Dataforth",
              "url": "https://dataforth.vercel.app"
            }],
            "description": "Learn how to calculate your exact in-hand salary from your CTC by understanding Basic, HRA, PF, and Professional Tax deductions in India."
          })
        }}
      />

      <header className="mb-12 text-center relative border-b border-ink/10 dark:border-white/10 pb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-sage/30 dark:bg-sage/10 blob-shape -z-10 blur-3xl"></div>
        <div className="flex items-center justify-center gap-3 mb-6 text-sm font-medium">
          <span className="text-sage">Finance</span>
          <span className="opacity-30">•</span>
          <span className="opacity-60">August 12, 2026</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-medium mb-6 leading-tight font-heading">
          How to Calculate Your True Monthly Take-Home Salary from CTC in India
        </h1>
        <p className="text-xl opacity-70 leading-relaxed max-w-2xl mx-auto">
          Demystifying the difference between Basic, HRA, PF, and Professional Tax to find out what actually hits your bank account.
        </p>
      </header>
      
      <AdZone className="mb-12 rounded-xl overflow-hidden" type="banner" />

      {/* Removed max-w-none and added mx-auto for better readability width */}
      <div className="prose prose-lg dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-sage prose-a:no-underline hover:prose-a:underline mx-auto text-ink/90 dark:text-white/90 leading-relaxed">
        
        <p>Receiving a job offer is exciting, and the Cost to Company (CTC) figure often looks highly impressive on paper. However, as most professionals in India quickly learn, the CTC does not represent the actual amount of money that gets deposited into your bank account at the end of the month.</p>

        <p>If you are trying to budget your expenses, pay rent, or determine affordability for an EMI, you need an accurate estimate of your take-home salary. Understanding how a CTC breaks down into cash-in-hand requires looking at the individual components of your salary structure.</p>

        <h2>Understanding the CTC Structure</h2>
        <p>The Cost to Company represents the total financial expenditure a company incurs to employ you for a year. This includes your direct cash salary, but it also bundles in indirect benefits, mandatory retirement contributions, performance bonuses, health insurance premiums, and other statutory requirements.</p>

        <p>To find your take-home salary, you have to systematically strip away the components of the CTC that are not disbursed as monthly cash.</p>

        <h3>1. Basic Salary</h3>
        <p>This is the foundational component of your compensation. It is fully taxable and generally constitutes 40% to 50% of your total CTC. Several other deductions and allowances, such as your Provident Fund contributions, are calculated as a direct percentage of this Basic Salary.</p>

        <h3>2. House Rent Allowance (HRA)</h3>
        <p>HRA is an allowance provided to assist with rental accommodation costs. It is typically set at 50% of your Basic Salary for employees residing in metro cities (Mumbai, Delhi, Chennai, Kolkata), and 40% for those in non-metro locations. Portions of your HRA can be claimed as tax-exempt if you provide valid rent receipts.</p>

        <h3>3. Special Allowances</h3>
        <p>This category acts as a balancing figure to ensure the components add up to your total agreed CTC. It is a fully taxable component, but you do receive the entirety of it in your monthly payout.</p>

        <h2>Standard Deductions</h2>
        <p>The gap between your gross salary and your take-home pay is primarily driven by three standard deductions.</p>

        <h3>Employee Provident Fund (EPF)</h3>
        <p>The EPF is a government-mandated retirement savings scheme. By default, 12% of your Basic Salary is deducted from your monthly pay and deposited into a PF account. Importantly, your employer is also required to match this 12% contribution. Many companies structure their offers to include this <em>employer</em> contribution within your advertised CTC. As a result, a combined 24% of your Basic Salary is routed into retirement savings rather than your bank account.</p>

        <h3>Professional Tax (PT)</h3>
        <p>Professional Tax is levied at the state level on salaried individuals. While not all states charge this tax, major tech hubs such as Maharashtra, Karnataka, Tamil Nadu, and Telangana do. The maximum deduction is capped at ₹2,500 annually, which typically translates to a straightforward deduction of ₹200 for eleven months, and ₹300 for one month of the year.</p>

        <h3>Tax Deducted at Source (TDS)</h3>
        <p>Your employer will estimate your annual income tax liability and deduct a proportional amount (TDS) from your salary each month. You can reduce this monthly deduction by declaring your planned tax-saving investments (such as ELSS mutual funds, PPF, or life insurance premiums) under Section 80C and other applicable sections at the start of the financial year.</p>

        <div className="bg-sage/10 dark:bg-sage/5 p-8 rounded-2xl border border-sage/20 my-10 not-prose">
          <h3 className="text-xl font-heading font-medium mb-3 text-sage">Automate the Calculation</h3>
          <p className="mb-5 text-ink/80 dark:text-white/80 text-sm leading-relaxed">Manually calculating PF, PT, and summing up your allowances is tedious. We built a free, privacy-first tool that handles these calculations instantly in your browser without requiring you to create an account.</p>
          <Link 
            href="/finance-tools/salary-calculator" 
            className="inline-block bg-sage text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Open Salary Calculator
          </Link>
        </div>

        <h2>A Practical Example</h2>
        <p>Consider a scenario where your agreed CTC is ₹12,00,000 per year (₹1,00,000 per month) for a role based in Bangalore.</p>
        
        <p><strong>The Earning Components:</strong></p>
        <ul>
          <li><strong>Basic Salary (assumed at 50%):</strong> ₹50,000</li>
          <li><strong>HRA (40% of Basic for non-metro/standard):</strong> ₹20,000</li>
          <li><strong>Special Allowance:</strong> ₹24,000</li>
          <li><strong>Employer PF Contribution (12% of Basic):</strong> ₹6,000 <em>(Included in the CTC figure)</em></li>
        </ul>
        <p>Your Gross Monthly Income (Basic + HRA + Special Allowance) equals <strong>₹94,000</strong>.</p>
        
        <p><strong>The Deductions:</strong></p>
        <ul>
          <li><strong>Employee PF Contribution (12% of Basic):</strong> -₹6,000</li>
          <li><strong>Professional Tax (Karnataka):</strong> -₹200</li>
        </ul>
        
        <p>Subtracting these deductions from your gross income results in an actual in-hand salary of <strong>₹87,800</strong> before income tax (TDS) is applied.</p>
        
        <p>Even though the offer letter states ₹1 Lakh per month, the actual liquidity available to you is significantly lower due to the structure of the CTC.</p>

        <p>When evaluating a new job offer, it is highly recommended to request a detailed, line-by-line breakdown of the salary structure from the HR department. Understanding the exact in-hand figure ensures you can plan your personal finances accurately from day one.</p>
      </div>

      <AuthorBio />
    </article>
  );
}
