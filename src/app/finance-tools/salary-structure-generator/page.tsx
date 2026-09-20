'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calculator, IndianRupee, Download, Copy, FileText, Image as ImageIcon, File, Info, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Disclaimer from '@/components/ui/Disclaimer';
import { downloadPDF, downloadDOCX, downloadPNG, copyText, SalaryBreakdownData } from './exportUtils';

export default function SalaryStructureGeneratorPage() {
  const [totalCtc, setTotalCtc] = useState<number>(1200000);
  const [variablePay, setVariablePay] = useState<number>(100000);
  
  // Percentages (editable)
  const [basicPct, setBasicPct] = useState<number>(50); // % of Fixed CTC
  const [hraPct, setHraPct] = useState<number>(40); // % of Basic
  const [taPct, setTaPct] = useState<number>(5); // % of Fixed CTC

  // Computed Values
  const [data, setData] = useState<SalaryBreakdownData>({
    basic: 0,
    hra: 0,
    ta: 0,
    other: 0,
    variable: 0,
    totalCtc: 0,
  });

  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fixed CTC
    const fixedCtc = Math.max(0, totalCtc - variablePay);
    
    // 2. Compute components based on percentages
    const basic = Math.round(fixedCtc * (basicPct / 100));
    const hra = Math.round(basic * (hraPct / 100));
    const ta = Math.round(fixedCtc * (taPct / 100));
    
    // 3. Other allowance is the balancing figure
    // fixedCtc = basic + hra + ta + other
    const other = fixedCtc - (basic + hra + ta);
    
    setData({
      basic,
      hra,
      ta,
      other,
      variable: variablePay,
      totalCtc
    });
  }, [totalCtc, variablePay, basicPct, hraPct, taPct]);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCopy = async () => {
    setExporting('copy');
    await copyText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setExporting(null);
  };

  const handleExport = async (type: 'pdf' | 'docx' | 'png') => {
    setExporting(type);
    try {
      if (type === 'pdf') await downloadPDF(data);
      if (type === 'docx') await downloadDOCX(data);
      if (type === 'png') await downloadPNG('salary-table-export');
    } catch (e) {
      console.error(e);
      alert('Failed to export. Please try again.');
    }
    setExporting(null);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl flex-grow font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Salary Structure Generator",
            "operatingSystem": "Any",
            "applicationCategory": "FinanceApplication",
            "description": "Generate formatted salary structures and breakups for offer letters in PDF, DOCX, and PNG formats.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            }
          })
        }}
      />
      <Breadcrumbs />
      
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-sage/40 dark:bg-sage/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4 font-heading">Salary Structure Generator</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          Create and export professional salary breakups for offer letters or personal planning. 
          Generates formatted tables in PDF, DOCX, PNG, or Plain Text.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Section - 5 columns */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
            <div className="bg-sage/30 dark:bg-sage/10 p-2 rounded-xl text-ink dark:text-sage">
              <Calculator className="w-5 h-5" />
            </div>
            Input Details
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium opacity-80">Total Annual CTC</label>
                <span className="text-sm font-bold bg-sage/20 dark:bg-sage/10 text-ink dark:text-sage px-2 py-0.5 rounded-md border border-sage/30">
                  {formatINR(totalCtc)}
                </span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-4 opacity-50"><IndianRupee className="w-5 h-5" /></div>
                <input 
                  type="number" 
                  value={totalCtc || ''} 
                  onChange={(e) => setTotalCtc(Number(e.target.value))}
                  className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sage/50"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium opacity-80">Variable Pay (Annual)</label>
                <span className="text-sm font-bold bg-sage/20 dark:bg-sage/10 text-ink dark:text-sage px-2 py-0.5 rounded-md border border-sage/30">
                  {formatINR(variablePay)}
                </span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-4 opacity-50"><IndianRupee className="w-5 h-5" /></div>
                <input 
                  type="number" 
                  value={variablePay || ''} 
                  onChange={(e) => setVariablePay(Number(e.target.value))}
                  className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sage/50"
                />
              </div>
            </div>

            <hr className="border-ink/5 dark:border-white/5 my-4" />
            
            <div className="bg-ink/5 dark:bg-white/5 p-5 rounded-2xl space-y-5">
              <div className="flex items-start gap-3 mb-2">
                <Info className="w-5 h-5 opacity-60 mt-0.5 shrink-0" />
                <p className="text-xs opacity-70 leading-relaxed">
                  These percentages are editable starting points, not fixed rules. 
                  "Other Allowance" is automatically calculated as the balancing figure to ensure the total exactly matches the CTC.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium opacity-80 mb-1">Basic (% of Fixed CTC)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="10" max="80" step="1" 
                    value={basicPct} onChange={(e) => setBasicPct(Number(e.target.value))}
                    className="w-full h-2 bg-ink/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sage"
                  />
                  <span className="text-sm font-bold w-12 text-right">{basicPct}%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium opacity-80 mb-1">HRA (% of Basic)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="10" max="60" step="1" 
                    value={hraPct} onChange={(e) => setHraPct(Number(e.target.value))}
                    className="w-full h-2 bg-ink/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sage"
                  />
                  <span className="text-sm font-bold w-12 text-right">{hraPct}%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium opacity-80 mb-1">Travelling Allowance (% of Fixed CTC)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="0" max="20" step="1" 
                    value={taPct} onChange={(e) => setTaPct(Number(e.target.value))}
                    className="w-full h-2 bg-ink/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sage"
                  />
                  <span className="text-sm font-bold w-12 text-right">{taPct}%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Output Section - 7 columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-ink/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ink/5 dark:bg-white/5">
              <h3 className="font-medium text-lg">Generated Structure</h3>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleCopy}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-ink text-ink dark:text-white rounded-lg border border-ink/10 dark:border-white/10 hover:shadow-sm transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button 
                  onClick={() => handleExport('png')}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-ink text-ink dark:text-white rounded-lg border border-ink/10 dark:border-white/10 hover:shadow-sm transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {exporting === 'png' ? '...' : 'PNG'}
                </button>
                <button 
                  onClick={() => handleExport('docx')}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-ink text-ink dark:text-white rounded-lg border border-ink/10 dark:border-white/10 hover:shadow-sm transition-all"
                >
                  <File className="w-3.5 h-3.5" />
                  {exporting === 'docx' ? '...' : 'DOCX'}
                </button>
                <button 
                  onClick={() => handleExport('pdf')}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-ink dark:bg-white text-white dark:text-ink rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {exporting === 'pdf' ? '...' : 'PDF'}
                </button>
              </div>
            </div>

            <div className="p-6 overflow-x-auto bg-white dark:bg-[#121212]" id="salary-table-export">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b-2 border-ink/20 dark:border-white/20 text-sm font-bold bg-cream dark:bg-[#1A1A1A]">
                    <th className="p-4 rounded-tl-lg">Particulars</th>
                    <th className="p-4 text-right">Month (INR)</th>
                    <th className="p-4 text-right rounded-tr-lg">Year (INR)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-ink/10 dark:border-white/10">
                    <td className="p-4 font-medium text-ink/80 dark:text-white/80">Basic</td>
                    <td className="p-4 text-right tabular-nums">{formatINR(data.basic / 12)}</td>
                    <td className="p-4 text-right tabular-nums">{formatINR(data.basic)}</td>
                  </tr>
                  <tr className="border-b border-ink/10 dark:border-white/10">
                    <td className="p-4 font-medium text-ink/80 dark:text-white/80">HRA</td>
                    <td className="p-4 text-right tabular-nums">{formatINR(data.hra / 12)}</td>
                    <td className="p-4 text-right tabular-nums">{formatINR(data.hra)}</td>
                  </tr>
                  <tr className="border-b border-ink/10 dark:border-white/10">
                    <td className="p-4 font-medium text-ink/80 dark:text-white/80">Travelling Allowance</td>
                    <td className="p-4 text-right tabular-nums">{formatINR(data.ta / 12)}</td>
                    <td className="p-4 text-right tabular-nums">{formatINR(data.ta)}</td>
                  </tr>
                  <tr className="border-b border-ink/10 dark:border-white/10">
                    <td className="p-4 font-medium text-ink/80 dark:text-white/80">Other Allowance</td>
                    <td className="p-4 text-right tabular-nums">{formatINR(data.other / 12)}</td>
                    <td className="p-4 text-right tabular-nums">{formatINR(data.other)}</td>
                  </tr>
                  {data.variable > 0 && (
                    <tr className="border-b border-ink/10 dark:border-white/10">
                      <td className="p-4 font-medium text-ink/80 dark:text-white/80">Variable Pay</td>
                      <td className="p-4 text-right tabular-nums">{formatINR(data.variable / 12)}</td>
                      <td className="p-4 text-right tabular-nums">{formatINR(data.variable)}</td>
                    </tr>
                  )}
                  <tr className="bg-ink/5 dark:bg-[#222222] font-bold text-base">
                    <td className="p-4 rounded-bl-lg">Total CTC (INR)</td>
                    <td className="p-4 text-right tabular-nums text-sage dark:text-sage">{formatINR(data.totalCtc / 12)}</td>
                    <td className="p-4 text-right rounded-br-lg tabular-nums text-sage dark:text-sage">{formatINR(data.totalCtc)}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs opacity-50 mt-4 text-center">Generated via Dataforth Salary Structure Generator</p>
            </div>
          </div>

          <Disclaimer title="Important Disclaimer" tone="formal">
            This is a structuring template based on common practice, not a legal or statutory requirement — 
            actual salary structures vary by company policy and should be confirmed with your employer/HR.
          </Disclaimer>
        </div>
      </div>

      <section className="mb-16 max-w-4xl mx-auto mt-24">
        <h2 className="text-3xl font-medium mb-8 font-heading">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">What is a Salary Breakup / Structure?</h3>
            <p className="opacity-70 leading-relaxed">
              A salary structure divides your total Cost to Company (CTC) into different components like Basic Salary, 
              House Rent Allowance (HRA), Travelling Allowance, and Other Allowances. This breakup is typically presented 
              in an offer letter and determines your tax liabilities and take-home pay.
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">How is this different from the Take-Home Calculator?</h3>
            <p className="opacity-70 leading-relaxed">
              This tool generates a top-down document (a "Breakup") detailing how the company structures your pay. 
              Our <Link href="/finance-tools/salary-calculator" className="text-sage font-medium hover:underline">Salary/CTC Calculator</Link>, 
              on the other hand, calculates your bottom-line "Take-Home" pay after statutory deductions like PF and Professional Tax.
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Why are the percentages editable?</h3>
            <p className="opacity-70 leading-relaxed">
              While 50% Basic and 40% HRA are standard conventions in India, every company's HR policy is slightly different. 
              Some companies offer 40% Basic, or 50% HRA for metro cities. Making them editable allows you to perfectly match 
              your company's specific structuring policies.
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-4xl mx-auto pb-12">
        <h2 className="text-3xl font-medium mb-8 font-heading">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/finance-tools/salary-calculator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex items-center gap-5 group">
            <div className="bg-sage/20 text-sage dark:text-sage p-4 rounded-full shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1 group-hover:opacity-70 transition-opacity">Take-Home Calculator</h3>
              <p className="text-sm opacity-60">Find your exact in-hand salary after PF/Tax.</p>
            </div>
          </Link>
          <Link href="/finance-tools/emi-calculator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex items-center gap-5 group">
            <div className="bg-sage/20 text-sage dark:text-sage p-4 rounded-full shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1 group-hover:opacity-70 transition-opacity">EMI Calculator</h3>
              <p className="text-sm opacity-60">Calculate your loan EMI easily.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
