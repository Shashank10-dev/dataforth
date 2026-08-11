'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, PieChart, Info, Building } from 'lucide-react';
import AdZone from '@/components/AdZone';

export default function SalaryCalculatorPage() {
  const [ctc, setCtc] = useState<number>(1200000);
  
  // Breakdown
  const [basic, setBasic] = useState<number>(0);
  const [hra, setHra] = useState<number>(0);
  const [specialAllowance, setSpecialAllowance] = useState<number>(0);
  const [pfEmployer, setPfEmployer] = useState<number>(0);
  
  // Deductions
  const [pfEmployee, setPfEmployee] = useState<number>(0);
  const [professionalTax, setProfessionalTax] = useState<number>(200);
  
  // Results
  const [grossSalary, setGrossSalary] = useState<number>(0);
  const [netTakeHome, setNetTakeHome] = useState<number>(0);
  const [monthlyTakeHome, setMonthlyTakeHome] = useState<number>(0);

  useEffect(() => {
    calculateSalaryBreakdown();
  }, [ctc, professionalTax]);

  const calculateSalaryBreakdown = () => {
    if (ctc > 0) {
      // Standard assumptions for Indian CTC structure:
      // Basic = 50% of CTC
      // HRA = 40% or 50% of Basic (using 50% for standard)
      // PF Employer = 12% of Basic
      // Special Allowance = Remaining amount
      
      const calcBasic = ctc * 0.50;
      const calcHra = calcBasic * 0.50;
      const calcPfEmployer = calcBasic * 0.12;
      const calcSpecial = ctc - calcBasic - calcHra - calcPfEmployer;
      
      setBasic(calcBasic);
      setHra(calcHra);
      setPfEmployer(calcPfEmployer);
      setSpecialAllowance(calcSpecial > 0 ? calcSpecial : 0);
      
      // Gross Salary (CTC - Employer contributions)
      const calcGross = ctc - calcPfEmployer;
      setGrossSalary(calcGross);
      
      // Employee Deductions
      const calcPfEmployee = calcBasic * 0.12;
      setPfEmployee(calcPfEmployee);
      
      // Net Take Home (Pre-Income Tax)
      const annualPT = professionalTax * 12;
      const calcNet = calcGross - calcPfEmployee - annualPT;
      setNetTakeHome(calcNet);
      setMonthlyTakeHome(calcNet / 12);
      
    } else {
      setBasic(0);
      setHra(0);
      setPfEmployer(0);
      setSpecialAllowance(0);
      setGrossSalary(0);
      setPfEmployee(0);
      setNetTakeHome(0);
      setMonthlyTakeHome(0);
    }
  };

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl flex-grow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "India Salary & CTC Calculator",
            "operatingSystem": "Any",
            "applicationCategory": "FinanceApplication",
            "description": "Calculate your in-hand monthly salary from your annual CTC (India).",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            }
          })
        }}
      />
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-sage/40 dark:bg-sage/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Salary & CTC Calculator</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Break down your Indian Annual CTC to find your exact monthly take-home salary.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-12 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" type="banner" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
        
        {/* Input Section - 7 columns */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 lg:p-10 shadow-sm">
          <h2 className="text-2xl font-medium mb-8 flex items-center gap-3">
            <div className="bg-sage/30 dark:bg-sage/10 p-2 rounded-xl text-ink dark:text-sage">
              <Calculator className="w-5 h-5" />
            </div>
            CTC Details
          </h2>
          
          <div className="space-y-8">
            {/* CTC Input */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium opacity-80">Annual CTC (Cost to Company)</label>
                <span className="text-sm font-bold bg-sage/20 dark:bg-sage/10 text-ink dark:text-sage px-2 py-0.5 rounded-md border border-sage/30">
                  {formatINR(ctc)}
                </span>
              </div>
              <div className="relative flex items-center mb-4">
                <div className="absolute left-4 opacity-50"><IndianRupee className="w-5 h-5" /></div>
                <input 
                  type="number" 
                  value={ctc} 
                  onChange={(e) => setCtc(Number(e.target.value))}
                  className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sage/50 transition-shadow"
                />
              </div>
              <input 
                type="range" 
                min="300000" 
                max="10000000" 
                step="50000"
                value={ctc}
                onChange={(e) => setCtc(Number(e.target.value))}
                className="w-full h-2 bg-ink/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sage hover:accent-sage/80"
              />
              <div className="flex justify-between text-xs opacity-50 mt-2 font-medium">
                <span>₹3L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Professional Tax Input */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium opacity-80">Professional Tax (Monthly)</label>
                <span className="text-sm font-bold bg-sage/20 dark:bg-sage/10 text-ink dark:text-sage px-2 py-0.5 rounded-md border border-sage/30">
                  {formatINR(professionalTax)}
                </span>
              </div>
              <div className="relative flex items-center mb-4">
                <div className="absolute left-4 opacity-50"><Building className="w-5 h-5" /></div>
                <input 
                  type="number" 
                  value={professionalTax} 
                  onChange={(e) => setProfessionalTax(Number(e.target.value))}
                  className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sage/50 transition-shadow"
                />
              </div>
              <p className="text-xs opacity-70 mt-2">Standard PT is usually ₹200/month (e.g. Maharashtra), but varies by state. You can edit this field manually.</p>
            </div>
            
            <div className="bg-sage/10 dark:bg-sage/5 border border-sage/20 p-5 rounded-xl flex gap-4 mt-6">
              <Info className="w-5 h-5 text-sage shrink-0 mt-0.5" />
              <p className="text-sm opacity-80 leading-relaxed">
                This calculator uses a standard Indian payroll structure (Basic = 50% of CTC, HRA = 50% of Basic). It calculates Pre-Tax Take Home Salary (before Income Tax/TDS deductions).
              </p>
            </div>
          </div>
        </div>

        {/* Results Section - 5 columns */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-ink dark:bg-white text-white dark:text-ink rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage/20 rounded-bl-full -mr-10 -mt-10 blur-xl"></div>
            
            <h3 className="text-sm font-medium opacity-70 mb-2 uppercase tracking-wider relative z-10">Monthly Take-Home</h3>
            <div className="text-5xl font-bold mb-8 relative z-10 flex items-baseline gap-2">
              <span className="text-3xl opacity-70">₹</span>
              {monthlyTakeHome > 0 ? monthlyTakeHome.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end border-b border-white/10 dark:border-ink/10 pb-4">
                <span className="text-sm opacity-70">Annual CTC</span>
                <span className="font-medium">{formatINR(ctc)}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 dark:border-ink/10 pb-4">
                <span className="text-sm opacity-70">Annual Gross Salary</span>
                <span className="font-medium">{formatINR(grossSalary)}</span>
              </div>
              <div className="flex justify-between items-end pb-2">
                <span className="text-sm opacity-70">Annual Take-Home<br/><span className="text-xs opacity-70">(Pre-Income Tax)</span></span>
                <span className="font-medium text-xl text-sage/90 dark:text-sage">{formatINR(netTakeHome)}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-xl p-4 mt-6 text-sm flex gap-3 text-orange-800 dark:text-orange-200">
            <Info className="w-5 h-5 shrink-0" />
            <p className="opacity-90">
              <strong>Disclaimer:</strong> This tool provides estimates based on standard Indian payroll calculations and is not financial/tax advice. Your actual offer letter and take-home pay may vary based on company-specific allowances, flexi-benefits, and your chosen income tax regime. Consult a professional for exact figures.
            </p>
          </div>
        </div>
      </div>

      {/* CTC Breakdown Table */}
      {ctc > 0 && (
        <div className="max-w-6xl mx-auto mt-12 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden font-sans">
          <div className="p-8 border-b border-ink/10 dark:border-white/10 flex items-center gap-3">
            <PieChart className="w-6 h-6 text-sage" />
            <h2 className="text-2xl font-medium">Salary Breakdown Structure</h2>
          </div>
          
          <div className="px-8 pb-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px] mt-4">
              <thead>
                <tr className="border-b border-ink/10 dark:border-white/10 text-sm opacity-70 uppercase tracking-wider">
                  <th className="py-4 font-medium">Component</th>
                  <th className="py-4 font-medium text-right">Monthly (₹)</th>
                  <th className="py-4 font-medium text-right">Annually (₹)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-ink/5 dark:border-white/5">
                  <td className="py-4 font-medium">Basic Salary</td>
                  <td className="py-4 text-right">{formatINR(basic / 12)}</td>
                  <td className="py-4 text-right">{formatINR(basic)}</td>
                </tr>
                <tr className="border-b border-ink/5 dark:border-white/5">
                  <td className="py-4 font-medium">HRA (House Rent Allowance)</td>
                  <td className="py-4 text-right">{formatINR(hra / 12)}</td>
                  <td className="py-4 text-right">{formatINR(hra)}</td>
                </tr>
                <tr className="border-b border-ink/5 dark:border-white/5">
                  <td className="py-4 font-medium">Special Allowance</td>
                  <td className="py-4 text-right">{formatINR(specialAllowance / 12)}</td>
                  <td className="py-4 text-right">{formatINR(specialAllowance)}</td>
                </tr>
                <tr className="border-b border-ink/5 dark:border-white/5 bg-ink/5 dark:bg-white/5 font-medium">
                  <td className="py-4 pl-4">Gross Salary</td>
                  <td className="py-4 text-right pr-4">{formatINR(grossSalary / 12)}</td>
                  <td className="py-4 text-right pr-4">{formatINR(grossSalary)}</td>
                </tr>
                <tr><td colSpan={3} className="py-2"></td></tr>
                <tr className="text-sm opacity-70 uppercase tracking-wider">
                  <td colSpan={3} className="py-2 font-medium">Employer Contributions (Part of CTC)</td>
                </tr>
                <tr className="border-b border-ink/5 dark:border-white/5">
                  <td className="py-4 font-medium">PF (Employer's Share)</td>
                  <td className="py-4 text-right">{formatINR(pfEmployer / 12)}</td>
                  <td className="py-4 text-right">{formatINR(pfEmployer)}</td>
                </tr>
                <tr><td colSpan={3} className="py-2"></td></tr>
                <tr className="text-sm opacity-70 uppercase tracking-wider">
                  <td colSpan={3} className="py-2 font-medium">Employee Deductions</td>
                </tr>
                <tr className="border-b border-ink/5 dark:border-white/5 text-red-500">
                  <td className="py-4 font-medium">PF (Employee's Share)</td>
                  <td className="py-4 text-right">-{formatINR(pfEmployee / 12)}</td>
                  <td className="py-4 text-right">-{formatINR(pfEmployee)}</td>
                </tr>
                <tr className="border-b border-ink/5 dark:border-white/5 text-red-500">
                  <td className="py-4 font-medium">Professional Tax</td>
                  <td className="py-4 text-right">-{formatINR(professionalTax)}</td>
                  <td className="py-4 text-right">-{formatINR(professionalTax * 12)}</td>
                </tr>
                <tr className="bg-sage/10 font-medium text-lg text-ink dark:text-white">
                  <td className="py-4 pl-4">Net Take-Home Salary</td>
                  <td className="py-4 text-right pr-4 text-sage">{formatINR(monthlyTakeHome)}</td>
                  <td className="py-4 text-right pr-4 text-sage">{formatINR(netTakeHome)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-16 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" type="banner" />
        </div>
  
      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto mt-16 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 font-sans">
          
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">What is CTC?</h3>
            <p className="opacity-70 leading-relaxed">Cost to Company (CTC) is the total amount a company spends on an employee in a year. It includes basic salary, HRA, special allowances, and employer contributions like PF.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Why is my take-home pay less than my CTC?</h3>
            <p className="opacity-70 leading-relaxed">Your take-home pay is calculated after deducting the employer’s share of PF, your share of PF, Professional Tax, and Income Tax (TDS). This calculator estimates your pre-tax take-home pay.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          
          <a href="/finance-tools/emi-calculator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">EMI Calculator</h3>
            <p className="text-sm opacity-60">Calculate your loan EMI easily.</p>
          </a>
          <a href="/business-tools/freelancer-invoice-generator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Freelancer Invoice</h3>
            <p className="text-sm opacity-60">Create quick freelancer invoices.</p>
          </a>
        </div>
      </section>

    </div>
    </div>
  );
}
