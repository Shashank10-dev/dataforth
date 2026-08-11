'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Printer, Building, Info, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AdZone from '@/components/AdZone';

interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  price: number;
  gstRate: number;
}

export default function GSTInvoiceGenerator() {
  const [invoiceNo, setInvoiceNo] = useState('INV-GST-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [fromName, setFromName] = useState('');
  const [fromGSTIN, setFromGSTIN] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [fromState, setFromState] = useState('');
  
  const [toName, setToName] = useState('');
  const [toGSTIN, setToGSTIN] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [toState, setToState] = useState('');
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Consulting Services', hsn: '9983', quantity: 1, price: 10000, gstRate: 18 }
  ]);
  
  const [notes, setNotes] = useState('Thank you for your business. Please make payment within 15 days.');
  const [bankDetails, setBankDetails] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', hsn: '', quantity: 1, price: 0, gstRate: 18 }]);
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const isIGST = fromState.toLowerCase().trim() !== toState.toLowerCase().trim() && toState.trim() !== '';

  const calculateTotals = () => {
    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    
    items.forEach(item => {
      const amount = item.quantity * item.price;
      subtotal += amount;
      
      const gstAmount = amount * (item.gstRate / 100);
      if (isIGST) {
        totalIgst += gstAmount;
      } else {
        totalCgst += gstAmount / 2;
        totalSgst += gstAmount / 2;
      }
    });
    
    return {
      subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      grandTotal: subtotal + totalCgst + totalSgst + totalIgst
    };
  };
  
  const totals = calculateTotals();
  
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
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
            "name": "GST Invoice Generator",
            "operatingSystem": "Any",
            "applicationCategory": "BusinessApplication",
            "description": "Create GST-compliant tax invoices for Indian businesses (CGST/SGST/IGST).",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })
        }}
      />
      {/* UI Header (Hidden on Print) */}
      <div className="text-center mb-8 relative print:hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-peach/40 dark:bg-peach/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-4xl font-medium mb-4">GST Invoice Generator</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Create GST-compliant tax invoices for Indian businesses (CGST/SGST/IGST).
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
              <Building className="w-5 h-5 text-peach" /> Edit Tax Invoice
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
                <label className="block text-xs font-medium opacity-70 mb-1">Invoice Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              </div>
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* From */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Billed By (Your Details)</h3>
              <input type="text" placeholder="Company Name" value={fromName} onChange={(e) => setFromName(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              <input type="text" placeholder="Your GSTIN" value={fromGSTIN} onChange={(e) => setFromGSTIN(e.target.value.toUpperCase())} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 uppercase" />
              <div className="grid grid-cols-2 gap-2">
                <textarea placeholder="Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} rows={2} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 resize-none" />
                <input type="text" placeholder="State (e.g. Maharashtra)" value={fromState} onChange={(e) => setFromState(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 self-start" />
              </div>
            </div>
            
            {/* To */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Billed To (Client Details)</h3>
              <input type="text" placeholder="Client Company Name" value={toName} onChange={(e) => setToName(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
              <input type="text" placeholder="Client GSTIN (Optional)" value={toGSTIN} onChange={(e) => setToGSTIN(e.target.value.toUpperCase())} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 uppercase" />
              <div className="grid grid-cols-2 gap-2">
                <textarea placeholder="Client Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} rows={2} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 resize-none" />
                <input type="text" placeholder="State (e.g. Karnataka)" value={toState} onChange={(e) => setToState(e.target.value)} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 self-start" />
              </div>
            </div>
            
            <div className="bg-peach/10 dark:bg-peach/5 border border-peach/20 p-4 rounded-xl flex gap-3 text-sm">
              <Info className="w-5 h-5 text-peach shrink-0" />
              <p>
                <strong>GST Type:</strong> Based on the states provided, this will generate an 
                {isIGST ? ' IGST' : ' CGST/SGST'} invoice.
              </p>
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* Items */}
            <div>
              <h3 className="text-sm font-medium mb-3">Line Items</h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="p-3 bg-cream dark:bg-dark-cream rounded-xl border border-ink/5 dark:border-white/5 space-y-2 relative">
                    <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-red-500 hover:opacity-70 p-1" disabled={items.length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <input type="text" placeholder="Item Description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-[calc(100%-2rem)] bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
                    
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        <label className="text-[10px] opacity-70 block mb-0.5">HSN/SAC</label>
                        <input type="text" value={item.hsn} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] opacity-70 block mb-0.5">Qty</label>
                        <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] opacity-70 block mb-0.5">Rate</label>
                        <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] opacity-70 block mb-0.5">GST %</label>
                        <select value={item.gstRate} onChange={(e) => updateItem(item.id, 'gstRate', Number(e.target.value))} className="w-full bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50">
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addItem} className="mt-4 flex items-center gap-1 text-sm font-medium text-peach hover:opacity-80">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            
            <hr className="border-ink/10 dark:border-white/10" />
            
            {/* Notes & Bank Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Bank Details</h3>
                <textarea placeholder="Bank Name, A/C No, IFSC Code" value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} rows={3} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 resize-none" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Terms & Notes</h3>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-peach/50 resize-none" />
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-xl p-4 mt-6 text-sm flex gap-3 text-orange-800 dark:text-orange-200">
              <Info className="w-5 h-5 shrink-0" />
              <p className="opacity-90">
                <strong>Disclaimer:</strong> This tool generates a standard GST invoice format for estimation/business convenience purposes. It is not tax/financial advice. Ensure you verify tax rates, HSN codes, and compliance rules with your Chartered Accountant.
              </p>
            </div>
            
          </div>
        </div>

        {/* Preview / Print Section - 7 columns */}
        <div id="document-preview" className="xl:col-span-7 bg-white print:bg-white border border-ink/10 print:border-none shadow-lg print:shadow-none rounded-none p-4 sm:p-10 print:p-0 min-h-[80vh] text-black overflow-x-auto">
          
          <div className="text-center mb-8 border-b-2 border-gray-800 pb-4 min-w-[500px]">
            <h1 className="text-2xl font-bold tracking-widest text-black uppercase">TAX INVOICE</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div className="space-y-1">
              <p className="font-bold text-lg text-black">{fromName || 'Your Company Name'}</p>
              {fromAddress && <p className="text-gray-700 whitespace-pre-line">{fromAddress}</p>}
              {fromState && <p className="text-gray-700">State: {fromState}</p>}
              {fromGSTIN && <p className="text-black font-medium mt-1">GSTIN: {fromGSTIN}</p>}
            </div>
            <div className="text-right space-y-1">
              <div className="mb-2">
                <span className="text-gray-500 mr-2">Invoice No:</span>
                <span className="font-bold text-black">{invoiceNo || 'INV-GST-001'}</span>
              </div>
              <div>
                <span className="text-gray-500 mr-2">Invoice Date:</span>
                <span className="font-medium text-black">{date || '-'}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-8 border border-gray-300 p-4 bg-gray-50">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Billed To</p>
            <p className="font-bold text-base text-black">{toName || 'Client Company Name'}</p>
            {toAddress && <p className="text-gray-700 whitespace-pre-line text-sm mt-1">{toAddress}</p>}
            {toState && <p className="text-gray-700 text-sm mt-1">State: {toState}</p>}
            {toGSTIN && <p className="text-black font-medium text-sm mt-2">GSTIN: {toGSTIN}</p>}
          </div>
          
          <table className="w-full mb-8 text-sm">
            <thead>
              <tr className="bg-gray-800 text-white text-left">
                <th className="py-2 px-3 font-bold w-12 text-center">#</th>
                <th className="py-2 px-3 font-bold">Item Description</th>
                <th className="py-2 px-3 font-bold w-20">HSN/SAC</th>
                <th className="py-2 px-3 font-bold text-right w-16">Qty</th>
                <th className="py-2 px-3 font-bold text-right w-24">Rate</th>
                <th className="py-2 px-3 font-bold text-right w-20">GST</th>
                <th className="py-2 px-3 font-bold text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="border-b-2 border-gray-800">
              {items.map((item, index) => {
                const amount = item.quantity * item.price;
                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-3 text-center text-gray-600">{index + 1}</td>
                    <td className="py-3 px-3 text-black font-medium">{item.description || '-'}</td>
                    <td className="py-3 px-3 text-gray-600">{item.hsn || '-'}</td>
                    <td className="py-3 px-3 text-right text-black">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-black">{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-gray-600">{item.gstRate}%</td>
                    <td className="py-3 px-3 text-right text-black font-medium">{amount.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="flex justify-between items-start mb-12">
            <div className="w-1/2 pr-8 text-sm">
              {bankDetails && (
                <div className="mb-6">
                  <p className="font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1">Bank Details</p>
                  <p className="text-gray-700 whitespace-pre-line">{bankDetails}</p>
                </div>
              )}
              {notes && (
                <div>
                  <p className="font-bold text-gray-800 border-b border-gray-300 mb-2 pb-1">Terms & Conditions</p>
                  <p className="text-gray-700 whitespace-pre-line text-xs">{notes}</p>
                </div>
              )}
            </div>
            
            <div className="w-1/2">
              <div className="space-y-2 text-sm border-b border-gray-300 pb-3 mb-3">
                <div className="flex justify-between text-gray-700">
                  <span>Taxable Amount</span>
                  <span>{formatINR(totals.subtotal)}</span>
                </div>
                
                {isIGST ? (
                  <div className="flex justify-between text-gray-700">
                    <span>IGST</span>
                    <span>{formatINR(totals.totalIgst)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-gray-700">
                      <span>CGST</span>
                      <span>{formatINR(totals.totalCgst)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>SGST</span>
                      <span>{formatINR(totals.totalSgst)}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-between font-bold text-lg text-black bg-gray-100 p-3 rounded">
                <span>Total Amount</span>
                <span>{formatINR(totals.grandTotal)}</span>
              </div>
              <div className="text-right mt-2 text-xs text-gray-500 font-medium">
                (E. & O.E.)
              </div>
            </div>
          </div>
          
          <div className="text-right mt-16 pt-16 border-t border-gray-200">
            <p className="font-bold text-black">{fromName || 'Authorized Signatory'}</p>
            <p className="text-sm text-gray-500 mt-1">Authorized Signature</p>
          </div>
          
        </div>
      </div>
  
      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto mt-16 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 font-sans">
          
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">When is IGST charged instead of CGST/SGST?</h3>
            <p className="opacity-70 leading-relaxed">IGST (Integrated GST) is charged when the buyer and seller are located in different states (inter-state). CGST and SGST are charged when both are in the same state (intra-state).</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Is this invoice legally valid?</h3>
            <p className="opacity-70 leading-relaxed">Yes, if you fill in all required fields accurately (including valid GSTINs and HSN codes), the generated format complies with standard Indian GST invoicing rules. Always consult your CA to ensure complete compliance.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          
          <a href="/business-tools/freelancer-invoice-generator" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Freelancer Invoice</h3>
            <p className="text-sm opacity-60">A simpler invoice format for non-GST billing.</p>
          </a>
          <a href="/developer-tools/json-formatter" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">JSON Formatter</h3>
            <p className="text-sm opacity-60">Format and validate JSON data.</p>
          </a>
        </div>
      </section>

    </div>
  );
}
