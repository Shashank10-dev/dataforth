'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Key, Copy, Download, Settings, Check, AlertCircle, Info } from 'lucide-react';
import AdZone from '@/components/AdZone';
import Link from 'next/link';

export default function UuidGeneratorPage() {
  const [quantity, setQuantity] = useState<number>(1);
  const [version, setVersion] = useState<string>('v4');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedSingle, setCopiedSingle] = useState<number | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../../workers/uuidGenerator.worker.ts', import.meta.url));
    workerRef.current.onmessage = (e) => {
      setUuids(e.data.uuids);
      setIsGenerating(false);
    };

    // Generate initial UUID
    handleGenerate(1, false, false);

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleGenerate = (qty: number = quantity, up: boolean = uppercase, hyphens: boolean = removeHyphens) => {
    if (!workerRef.current) return;
    setIsGenerating(true);
    workerRef.current.postMessage({ quantity: qty, uppercase: up, removeHyphens: hyphens });
  };

  const handleCopyAll = () => {
    if (!uuids.length) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedSingle(index);
    setTimeout(() => setCopiedSingle(null), 2000);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    if (!uuids.length) return;
    downloadFile(uuids.join('\n'), 'uuids.txt', 'text/plain');
  };

  const handleDownloadCsv = () => {
    if (!uuids.length) return;
    downloadFile('UUID\n' + uuids.join('\n'), 'uuids.csv', 'text/csv');
  };

  const maxDisplay = 1000;
  const displayedUuids = uuids.slice(0, maxDisplay);

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl flex-grow">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Bulk UUID Generator",
            "operatingSystem": "Any",
            "applicationCategory": "DeveloperApplication",
            "description": "Generate up to 100,000 UUIDs (v4) instantly in your browser. No limits, totally free, and strictly private.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a UUID?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Universally Unique Identifier (UUID) is a 128-bit label used for information in computer systems. When generated according to standard methods, UUIDs are practically unique, meaning you can generate them without checking a central database."
                }
              },
              {
                "@type": "Question",
                "name": "Can I generate more than 1,000 UUIDs at once?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Unlike most other tools that cap your output, you can generate up to 100,000 UUIDs instantly using our bulk generator. It runs completely in your browser."
                }
              },
              {
                "@type": "Question",
                "name": "Are these UUIDs secure and private?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. This tool uses your browser's native, cryptographically secure crypto.randomUUID() API. Everything runs completely locally on your device, meaning no data is ever sent to or stored on our servers."
                }
              }
            ]
          })
        }}
      />

      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#93C5FD]/40 dark:bg-[#93C5FD]/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Bulk UUID Generator</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Generate up to 100,000 universally unique identifiers (v4) instantly. 100% free and strictly private.
        </p>
      </div>

      <div className="mb-12">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans max-w-5xl mx-auto">
        
        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 font-medium mb-6 text-lg border-b border-ink/5 dark:border-white/5 pb-4">
              <Settings className="w-5 h-5 text-[#93C5FD]" /> Settings
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Version</label>
                <select 
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#93C5FD]/50 transition-shadow appearance-none cursor-pointer"
                >
                  <option value="v4">Version 4 (Random)</option>
                  <option value="v1" disabled>Version 1 (Time-based) - Coming Soon</option>
                  <option value="v7" disabled>Version 7 (Sortable) - Coming Soon</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium opacity-80">Quantity</label>
                  <span className="text-xs font-mono bg-cream dark:bg-dark-cream px-2 py-1 rounded-md border border-ink/10 dark:border-white/10">
                    {quantity.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100000" 
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full accent-[#93C5FD]"
                />
                <div className="flex gap-2 mt-3">
                  {[1, 100, 1000, 100000].map(val => (
                    <button 
                      key={val}
                      onClick={() => setQuantity(val)}
                      className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${quantity === val ? 'bg-[#93C5FD] text-white border-[#93C5FD]' : 'bg-transparent border-ink/10 dark:border-white/10 hover:bg-cream dark:hover:bg-dark-cream'}`}
                    >
                      {val >= 1000 ? `${val/1000}k` : val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-ink/5 dark:border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                    className="w-5 h-5 rounded border-ink/20 text-[#93C5FD] focus:ring-[#93C5FD]"
                  />
                  <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">Uppercase</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={removeHyphens}
                    onChange={(e) => setRemoveHyphens(e.target.checked)}
                    className="w-5 h-5 rounded border-ink/20 text-[#93C5FD] focus:ring-[#93C5FD]"
                  />
                  <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">Remove hyphens</span>
                </label>
              </div>

              <button 
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-3 px-6 rounded-xl transition-transform duration-150 hover:-translate-y-0.5 shadow-md disabled:opacity-70 disabled:transform-none"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Generate UUIDs'}
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm h-[600px]">
          
          <div className="p-4 border-b border-ink/5 dark:border-white/5 flex items-center justify-between bg-cream/50 dark:bg-dark-cream/50 flex-wrap gap-4">
            <div className="flex items-center gap-2 font-medium">
              <Key className="w-5 h-5 text-[#93C5FD]" /> 
              <span>Output <span className="opacity-50 text-sm ml-1">({uuids.length.toLocaleString()})</span></span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownloadCsv}
                className="flex items-center gap-2 text-sm bg-transparent hover:bg-cream dark:hover:bg-dark-cream border border-ink/10 dark:border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                title="Download as CSV"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={handleDownloadTxt}
                className="flex items-center gap-2 text-sm bg-transparent hover:bg-cream dark:hover:bg-dark-cream border border-ink/10 dark:border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                title="Download as TXT"
              >
                <Download className="w-4 h-4" /> TXT
              </button>
              <button 
                onClick={handleCopyAll}
                className="flex items-center gap-2 text-sm bg-ink dark:bg-white text-white dark:text-ink px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedAll ? 'Copied All' : 'Copy All'}
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto bg-transparent p-2 custom-scrollbar">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full opacity-50">
                <span className="font-mono animate-pulse">Generating {quantity.toLocaleString()} UUIDs...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {displayedUuids.map((uuid, i) => (
                  <div key={i} className="group flex items-center justify-between py-2 px-4 hover:bg-cream dark:hover:bg-dark-cream rounded-xl transition-colors">
                    <span className="font-mono text-sm sm:text-base opacity-80 group-hover:opacity-100 transition-opacity truncate mr-4">
                      {uuid}
                    </span>
                    <button 
                      onClick={() => handleCopySingle(uuid, i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-ink/5 dark:hover:bg-white/10 rounded-lg flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      {copiedSingle === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 opacity-70" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {uuids.length > maxDisplay && (
            <div className="p-3 bg-cream/50 dark:bg-dark-cream/50 border-t border-ink/5 dark:border-white/5 text-center text-xs opacity-70 flex justify-center items-center gap-2">
              <Info className="w-4 h-4" />
              Showing first {maxDisplay.toLocaleString()} UUIDs. Use Copy All or Download to export the remaining {(uuids.length - maxDisplay).toLocaleString()}.
            </div>
          )}
        </div>
      </div>

      {/* Usage Disclaimer */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="bg-cream/40 dark:bg-dark-cream/40 border border-ink/5 dark:border-white/5 rounded-2xl p-5 flex gap-4 text-sm font-sans items-start">
          <Info className="w-5 h-5 text-ink/40 dark:text-white/40 flex-shrink-0 mt-0.5" />
          <p className="opacity-70 leading-relaxed">
            UUIDs generated here use your browser's built-in secure random number generator (<code>crypto.randomUUID()</code>) and are generated entirely on your device — none are stored, logged, or transmitted anywhere. UUIDs are designed for uniqueness (database keys, object IDs, tracking identifiers), not as a substitute for passwords, API secrets, or authentication tokens — please use a purpose-built secret/token generator for those cases. Use in production systems at your own discretion.
          </p>
        </div>
      </div>

      <div className="mt-20">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      <div className="max-w-4xl mx-auto mt-16 font-sans">
        <h2 className="text-3xl font-medium mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">What is a UUID?</h3>
            <p className="opacity-70 leading-relaxed">A Universally Unique Identifier (UUID) is a 128-bit label used for information in computer systems. When generated according to standard methods, UUIDs are practically unique, meaning you can generate them without checking a central database.</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">Can I generate more than 1,000 UUIDs at once?</h3>
            <p className="opacity-70 leading-relaxed">Yes! Unlike most other tools that cap your output, you can generate up to 100,000 UUIDs instantly using our bulk generator. It runs completely in your browser, utilizing a background Web Worker so your screen doesn't freeze.</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">Are these UUIDs secure and private?</h3>
            <p className="opacity-70 leading-relaxed">Yes. This tool uses your browser's native, cryptographically secure <code>crypto.randomUUID()</code> API. Everything runs completely locally on your device, meaning no data is ever sent to or stored on our servers.</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">What is the difference between UUID versions?</h3>
            <p className="opacity-70 leading-relaxed">Version 4 (the current standard used here) generates completely random numbers. Version 1 is based on the current timestamp and MAC address of the computer generating it. Version 7 is a newer standard that combines timestamps with randomness, making it highly effective for database primary keys where sortability is desired.</p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="mt-20 border-t border-ink/10 dark:border-white/10 pt-16 font-sans">
        <h2 className="text-2xl font-medium mb-8 text-center">More Developer Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/developer-tools/json-formatter" className="group p-6 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-[#93C5FD]/60 transition-colors">
            <h3 className="text-xl font-medium text-ink dark:text-white mb-2 group-hover:text-[#93C5FD] transition-colors">JSON Formatter</h3>
            <p className="opacity-70 text-sm">Format, validate, and minify your JSON data instantly in the browser.</p>
          </Link>
          <Link href="/developer-tools/regex-tester" className="group p-6 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-[#93C5FD]/60 transition-colors">
            <h3 className="text-xl font-medium text-ink dark:text-white mb-2 group-hover:text-[#93C5FD] transition-colors">Regex Tester</h3>
            <p className="opacity-70 text-sm">Test and debug Regular Expressions with real-time syntax highlighting.</p>
          </Link>
        </div>
      </div>

    </div>
  );
}
