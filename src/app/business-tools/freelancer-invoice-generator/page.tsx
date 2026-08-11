'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Printer, Briefcase, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import AdZone from '@/components/AdZone';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function FreelancerInvoiceGenerator() {
  const [invoiceNo, setInvoiceNo] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  
  const [toName, setToName] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [toAddress, setToAddress] = useState('');
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Web Development Services', quantity: 1, price: 500 }
  ]);
  
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('Thank you for your business!');
  const [isExporting, setIsExporting] = useState(false);
  
  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, price: 0 }]);
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('document-preview');
    if (!element) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoiceNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow print:p-0 print:m-0 print:max-w-none">
      
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Freelancer Invoice Generator",
            "operatingSystem": "Any",
            "applicationCategory": "BusinessApplication",
            "description": "Create, preview, and save professional invoices instantly.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })
        }}
      />
      {/* UI Header (Hidden on Print) */}
      <div className="text-center mb-8 relative print:hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-peach/40 dark:bg-peach/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-4xl font-medium mb-4">Freelancer Invoice Generator</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Create, preview, and save professional invoices instantly.
        </p>
      </div>
      
      <div className="mb-8 print:hidden">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start font-sans print:block">
        
        {/* Editor Section (Hidden on Print) */}
        <div className="xl:col-span-5 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-6 shadow-sm print:hidden overflow-y-auto max-h-[80vh] custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-peach" /> Edit Invoice
            </h2>
            <button 
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="bg-ink dark:bg-white text-white dark:text-ink px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isExporting ? (
                <>Generating...</>
              ) : (
                <><Download className="w-4 h-4" /> Download PDF</>
              )}
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium opacity-70 mb-1">Invoice No.</label>
                <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              </div>
              <div>
                <label className="block text-xs font-medium opacity-70 mb-1">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium opacity-70 mb-1">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              </div>
              <div>
                <label className="block text-xs font-medium opacity-70 mb-1">Due Date (Optional)</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              </div>
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* From */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Your Details (From)</h3>
              <input type="text" placeholder="Your Name / Company" value={fromName} onChange={(e) => setFromName(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              <input type="text" placeholder="Email Address" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              <textarea placeholder="Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} rows={2} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 resize-none" />
            </div>
            
            {/* To */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Client Details (To)</h3>
              <input type="text" placeholder="Client Name / Company" value={toName} onChange={(e) => setToName(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              <input type="text" placeholder="Client Email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              <textarea placeholder="Client Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} rows={2} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 resize-none" />
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* Items */}
            <div>
              <h3 className="text-sm font-medium mb-3">Line Items</h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <div className="flex-grow space-y-2">
                      <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
                      <div className="flex gap-2">
                        <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} className="w-1/3 bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
                        <input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))} className="w-2/3 bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-1" disabled={items.length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addItem} className="mt-4 flex items-center gap-1 text-sm font-medium text-peach hover:opacity-80">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* Notes */}
            <div>
              <h3 className="text-sm font-medium mb-2">Notes</h3>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 resize-none" />
            </div>
            
          </div>
        </div>

        {/* Preview / Print Section - 7 columns */}
        <div id="document-preview" className="xl:col-span-7 bg-white print:bg-white border border-ink/10 print:border-none shadow-lg print:shadow-none rounded-none p-4 sm:p-12 print:p-0 min-h-[80vh] text-black overflow-x-auto">
          
          <div className="flex justify-between items-start mb-12 min-w-[500px]">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-black">INVOICE</h1>
              <p className="text-gray-500 font-medium">#{invoiceNo || 'INV-001'}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl mb-1 text-black">{fromName || 'Your Name / Company'}</p>
              {fromEmail && <p className="text-gray-600 text-sm">{fromEmail}</p>}
              {fromAddress && <p className="text-gray-600 text-sm whitespace-pre-line mt-1">{fromAddress}</p>}
            </div>
          </div>
          
          <div className="flex justify-between items-start mb-12 border-t border-gray-200 pt-8">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wider">Bill To</p>
              <p className="font-bold text-lg text-black">{toName || 'Client Name'}</p>
              {toEmail && <p className="text-gray-600 text-sm">{toEmail}</p>}
              {toAddress && <p className="text-gray-600 text-sm whitespace-pre-line mt-1">{toAddress}</p>}
            </div>
            <div className="text-right space-y-2">
              <div>
                <p className="text-sm text-gray-500 mb-0 font-medium uppercase tracking-wider">Date</p>
                <p className="font-medium text-black">{date || '-'}</p>
              </div>
              {dueDate && (
                <div>
                  <p className="text-sm text-gray-500 mb-0 font-medium uppercase tracking-wider">Due Date</p>
                  <p className="font-medium text-black">{dueDate}</p>
                </div>
              )}
            </div>
          </div>
          
          <table className="w-full mb-12">
            <thead>
              <tr className="border-b-2 border-gray-800 text-left">
                <th className="py-3 text-sm font-bold uppercase tracking-wider text-black">Description</th>
                <th className="py-3 text-sm font-bold uppercase tracking-wider text-black text-right w-24">Qty</th>
                <th className="py-3 text-sm font-bold uppercase tracking-wider text-black text-right w-32">Price</th>
                <th className="py-3 text-sm font-bold uppercase tracking-wider text-black text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 text-black">{item.description || 'Item Description'}</td>
                  <td className="py-4 text-right text-black">{item.quantity}</td>
                  <td className="py-4 text-right text-black">{getCurrencySymbol()}{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-4 text-right font-medium text-black">{getCurrencySymbol()}{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-end mb-16">
            <div className="w-64">
              <div className="flex justify-between py-3 border-t-2 border-gray-800 font-bold text-xl text-black">
                <span>Total</span>
                <span>{getCurrencySymbol()}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          {notes && (
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Notes</p>
              <p className="text-gray-700 whitespace-pre-line text-sm">{notes}</p>
            </div>
          )}
          
        </div>
      </div>
  
      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto mt-16 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 font-sans">
          
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Can I change the currency?</h3>
            <p className="opacity-70 leading-relaxed">Yes, you can select from multiple currencies (USD, EUR, GBP, INR, AUD, CAD) using the currency dropdown in the editor pane.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Is my data saved anywhere?</h3>
            <p className="opacity-70 leading-relaxed">No, this tool operates entirely in your browser. No data is sent to our servers, ensuring complete privacy.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          
          <a href="/business-tools/gst-invoice-generator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">GST Invoice</h3>
            <p className="text-sm opacity-60">Create full tax-compliant invoices.</p>
          </a>
          <a href="/career-tools/resume-builder" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Resume Builder</h3>
            <p className="text-sm opacity-60">Build a clean, professional resume.</p>
          </a>
        </div>
      </section>

    </div>
  );
}
