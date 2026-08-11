'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, DollarSign, Percent, Calendar, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import AdZone from '@/components/AdZone';

interface YearlyData {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  balance: number;
}

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState<number>(50000);
  const [rate, setRate] = useState<number>(5.5);
  const [years, setYears] = useState<number>(5);
  const [currency, setCurrency] = useState<string>('USD');
  
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [schedule, setSchedule] = useState<YearlyData[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, years]);

  const calculateEMI = () => {
    if (principal > 0 && rate > 0 && years > 0) {
      const p = principal;
      const r = rate / 12 / 100;
      const n = years * 12;
      
      const emiAmount = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmt = emiAmount * n;
      const totalInt = totalAmt - p;
      
      setEmi(emiAmount);
      setTotalPayment(totalAmt);
      setTotalInterest(totalInt);

      // Generate Yearly Amortization Schedule
      let currentBalance = p;
      const yearlySchedule: YearlyData[] = [];
      
      for (let y = 1; y <= years; y++) {
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;

        for (let m = 1; m <= 12; m++) {
          const interestForMonth = currentBalance * r;
          const principalForMonth = emiAmount - interestForMonth;
          
          yearlyInterest += interestForMonth;
          yearlyPrincipal += principalForMonth;
          currentBalance -= principalForMonth;
          
          if (currentBalance < 0) currentBalance = 0;
        }

        yearlySchedule.push({
          year: y,
          principalPaid: yearlyPrincipal,
          interestPaid: yearlyInterest,
          totalPayment: yearlyPrincipal + yearlyInterest,
          balance: currentBalance
        });
      }
      
      setSchedule(yearlySchedule);
    } else {
      setEmi(0);
      setTotalPayment(0);
      setTotalInterest(0);
      setSchedule([]);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      case 'AUD': return 'A$';
      case 'CAD': return 'C$';
      default: return '$';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl flex-grow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EMI Calculator",
            "operatingSystem": "Any",
            "applicationCategory": "FinanceApplication",
            "description": "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-sage/40 dark:bg-sage/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">EMI Calculator</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-12 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" type="banner" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
        
        {/* Input Form Section - 7 columns */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 lg:p-10 shadow-sm">
          <h2 className="text-2xl font-medium mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sage/30 dark:bg-sage/10 p-2 rounded-xl text-ink dark:text-sage">
                <Calculator className="w-5 h-5" />
              </div>
              Loan Details
            </div>
            
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage/50"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </h2>
          
          <div className="space-y-8">
            {/* Principal Input */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium opacity-80">Loan Amount</label>
                <span className="text-sm font-bold bg-sage/20 dark:bg-sage/10 text-ink dark:text-sage px-2 py-0.5 rounded-md border border-sage/30">
                  {formatCurrency(principal)}
                </span>
              </div>
              <div className="relative flex items-center mb-4">
                <div className="absolute left-4 opacity-50 font-medium text-lg">{getCurrencySymbol()}</div>
                <input 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sage/50 transition-shadow"
                />
              </div>
              <input 
                type="range" 
                min="1000" 
                max="1000000" 
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-ink/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sage hover:accent-sage/80"
              />
              <div className="flex justify-between text-xs opacity-50 mt-2 font-medium">
                <span>{getCurrencySymbol()}1K</span>
                <span>{getCurrencySymbol()}1M</span>
              </div>
            </div>

            {/* Interest Rate Input */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium opacity-80">Interest Rate (Yearly)</label>
                <span className="text-sm font-bold bg-sage/20 dark:bg-sage/10 text-ink dark:text-sage px-2 py-0.5 rounded-md border border-sage/30">
                  {rate}%
                </span>
              </div>
              <div className="relative flex items-center mb-4">
                <div className="absolute left-4 opacity-50"><Percent className="w-5 h-5" /></div>
                <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  step="0.1"
                  className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sage/50 transition-shadow"
                />
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="20" 
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-ink/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sage hover:accent-sage/80"
              />
              <div className="flex justify-between text-xs opacity-50 mt-2 font-medium">
                <span>0.1%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Loan Tenure Input */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium opacity-80">Loan Tenure (Years)</label>
                <span className="text-sm font-bold bg-sage/20 dark:bg-sage/10 text-ink dark:text-sage px-2 py-0.5 rounded-md border border-sage/30">
                  {years} Years
                </span>
              </div>
              <div className="relative flex items-center mb-4">
                <div className="absolute left-4 opacity-50"><Calendar className="w-5 h-5" /></div>
                <input 
                  type="number" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sage/50 transition-shadow"
                />
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-ink/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sage hover:accent-sage/80"
              />
              <div className="flex justify-between text-xs opacity-50 mt-2 font-medium">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section - 5 columns */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-ink dark:bg-white text-white dark:text-ink rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage/20 rounded-bl-full -mr-10 -mt-10 blur-xl"></div>
            
            <h3 className="text-sm font-medium opacity-70 mb-2 uppercase tracking-wider relative z-10">Monthly EMI</h3>
            <div className="text-5xl font-bold mb-8 relative z-10 flex items-baseline gap-2">
              <span className="text-3xl opacity-70">{getCurrencySymbol()}</span>
              {emi > 0 ? emi.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end border-b border-white/10 dark:border-ink/10 pb-4">
                <span className="text-sm opacity-70">Principal Amount</span>
                <span className="font-medium">{getCurrencySymbol()}{Number(principal).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 dark:border-ink/10 pb-4">
                <span className="text-sm opacity-70">Total Interest</span>
                <span className="font-medium">{getCurrencySymbol()}{totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-end pb-2">
                <span className="text-sm opacity-70">Total Payable</span>
                <span className="font-medium text-xl text-sage/90 dark:text-sage">{getCurrencySymbol()}{totalPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-xl p-4 mt-6 text-sm flex gap-3 text-orange-800 dark:text-orange-200">
            <Info className="w-5 h-5 shrink-0" />
            <p className="opacity-90">
              <strong>Disclaimer:</strong> This tool provides estimates based on standard calculations and is not financial/tax advice. Actual EMI may vary due to processing fees, differing compounding rules, or floating interest rates. Consult your financial institution for exact figures.
            </p>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      {schedule.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden font-sans">
          <button 
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full flex items-center justify-between p-8 hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="p-8 border-b border-ink/10 dark:border-white/10 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-sage" />
              <h2 className="text-2xl font-medium">Yearly Amortization Schedule</h2>
            </div>
            {showSchedule ? <ChevronUp className="w-6 h-6 opacity-50" /> : <ChevronDown className="w-6 h-6 opacity-50" />}
          </button>
          
          {showSchedule && (
            <div className="px-4 sm:px-8 pb-8 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px] mt-4">
                <thead>
                  <tr className="border-b border-ink/10 dark:border-white/10 text-sm opacity-70 uppercase tracking-wider">
                    <th className="py-4 font-medium">Year</th>
                    <th className="py-4 font-medium">Principal Paid</th>
                    <th className="py-4 font-medium">Interest Paid</th>
                    <th className="py-4 font-medium">Total Payment</th>
                    <th className="py-4 font-medium text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {schedule.map((row) => (
                    <tr key={row.year} className="border-b border-ink/5 dark:border-white/5 last:border-0 hover:bg-ink/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 font-medium">Year {row.year}</td>
                      <td className="py-4">{formatCurrency(row.principalPaid)}</td>
                      <td className="py-4 text-sage">{formatCurrency(row.interestPaid)}</td>
                      <td className="py-4 font-medium">{formatCurrency(row.totalPayment)}</td>
                      <td className="py-4 text-right font-medium">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
            <h3 className="font-medium mb-3 text-lg">How is EMI calculated?</h3>
            <p className="opacity-70 leading-relaxed">EMI is calculated using a standard mathematical formula that takes into account the principal loan amount, the interest rate per month, and the total number of monthly installments (tenure).</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Does this account for processing fees?</h3>
            <p className="opacity-70 leading-relaxed">No, this calculator provides the core EMI based on the principal and interest rate. Processing fees and other bank charges are not included in this calculation.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          
          <a href="/finance-tools/salary-calculator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Salary Calculator</h3>
            <p className="text-sm opacity-60">Calculate your exact in-hand salary.</p>
          </a>
          <a href="/business-tools/gst-invoice-generator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">GST Invoice</h3>
            <p className="text-sm opacity-60">Generate professional tax invoices.</p>
          </a>
        </div>
      </section>

    </div>
    </div>
  );
}
