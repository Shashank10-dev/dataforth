'use client';

import React, { useState } from 'react';
import { Braces, Copy, RefreshCw, FileJson, Check, AlertCircle } from 'lucide-react';
import AdZone from '@/components/AdZone';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<number>(2);

  const formatJson = (minify = false) => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const formatted = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl flex-grow">
      
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "JSON Formatter & Validator",
            "operatingSystem": "Any",
            "applicationCategory": "DeveloperApplication",
            "description": "Format, validate, and minify your JSON data securely in the browser.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })
        }}
      />
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#93C5FD]/40 dark:bg-[#93C5FD]/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">JSON Formatter</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Format, validate, and minify your JSON data securely in the browser.
        </p>
      </div>

      <div className="mb-12">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans lg:h-[600px] min-h-[600px]">
        
        {/* Input */}
        <div className="flex flex-col bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-ink/5 dark:border-white/5 flex items-center justify-between bg-cream/50 dark:bg-dark-cream/50">
            <div className="flex items-center gap-2 font-medium">
              <Braces className="w-5 h-5 text-[#93C5FD]" /> Input JSON
            </div>
            <button 
              onClick={() => setInput('')}
              className="text-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            placeholder='{"paste": "your json here"}'
            className="flex-grow w-full bg-transparent p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm relative">
          
          <div className="p-4 border-b border-ink/5 dark:border-white/5 flex items-center justify-between bg-cream/50 dark:bg-dark-cream/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-medium">
                <FileJson className="w-5 h-5 text-[#93C5FD]" /> Output
              </div>
              <div className="h-4 w-px bg-ink/10 dark:bg-white/10 hidden sm:block"></div>
              <select 
                value={indent} 
                onChange={(e) => setIndent(Number(e.target.value))}
                className="hidden sm:block text-sm bg-transparent border-none focus:ring-0 opacity-80 cursor-pointer"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value={8}>8 Spaces</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => formatJson(true)}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-lg hover:border-[#93C5FD]/50 transition-colors"
              >
                Minify
              </button>
              <button 
                onClick={() => formatJson(false)}
                className="px-3 py-1.5 text-xs font-medium bg-ink dark:bg-white text-white dark:text-ink rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Format
              </button>
            </div>
          </div>
          
          <div className="flex-grow relative bg-slate-50 dark:bg-slate-900">
            {error ? (
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-red-500 bg-red-50/50 dark:bg-red-900/10">
                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-mono text-sm break-all text-center">{error}</p>
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                placeholder="Formatted JSON will appear here"
                className="w-full h-full bg-transparent p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                spellCheck="false"
              />
            )}
            
            {!error && output && (
              <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-xl shadow-sm hover:border-[#93C5FD]/50 transition-colors text-ink/70 dark:text-white/70"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
        
  
      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto mt-16 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 font-sans">
          
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Does this tool validate my JSON?</h3>
            <p className="opacity-70 leading-relaxed">Yes, the tool attempts to parse your JSON as you type or paste it. If there is a syntax error, it will immediately display a red warning with the error details.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Is my JSON data secure?</h3>
            <p className="opacity-70 leading-relaxed">Absolutely. The formatting happens entirely client-side using JavaScript in your browser. Your data never leaves your device.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          
          <a href="/developer-tools/regex-tester" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Regex Tester</h3>
            <p className="text-sm opacity-60">Test and debug Regular Expressions.</p>
          </a>
          <a href="/image-tools/compress-image" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Compress Image</h3>
            <p className="text-sm opacity-60">Compress images without quality loss.</p>
          </a>
        </div>
      </section>

    </div>
    </div>
  );
}
