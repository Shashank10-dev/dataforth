'use client';

import React, { useState, useMemo } from 'react';
import { Search, Info, Copy, Check } from 'lucide-react';
import AdZone from '@/components/AdZone';

export default function RegexTesterPage() {
  const [regex, setRegex] = useState('([A-Z])\\w+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('This is a Test String with Some Capitalized Words.');
  const [copied, setCopied] = useState(false);

  const getMatchResult = () => {
    if (!regex) return null;
    try {
      const re = new RegExp(regex, flags);
      const matches = [];
      let match;
      
      // Prevent infinite loops for empty matches
      if (re.test('')) return { error: 'Regex matches empty string. Modifying to avoid infinite loop.' };
      
      const testRe = new RegExp(regex, flags);
      while ((match = testRe.exec(testString)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        if (!flags.includes('g')) break; // Only one match if not global
      }
      return { matches };
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const result = useMemo(() => getMatchResult(), [regex, flags, testString]);

  // Highlight matches in the text
  const HighlightedText = () => {
    if (!result || result.error || !result.matches || result.matches.length === 0) {
      return <div className="p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">{testString}</div>;
    }

    let lastIndex = 0;
    const elements = [];
    
    result.matches.forEach((m, i) => {
      // Add text before match
      if (m.index > lastIndex) {
        elements.push(<span key={`text-${i}`}>{testString.substring(lastIndex, m.index)}</span>);
      }
      
      // Add highlighted match
      elements.push(
        <span key={`match-${i}`} className="bg-[#93C5FD]/40 dark:bg-[#93C5FD]/30 rounded-[2px] border-b-2 border-[#93C5FD]">
          {m.match}
        </span>
      );
      
      lastIndex = m.index + m.match.length;
    });
    
    // Add remaining text
    if (lastIndex < testString.length) {
      elements.push(<span key="text-end">{testString.substring(lastIndex)}</span>);
    }
    
    return <div className="p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">{elements}</div>;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`/${regex}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow">
      
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Regex Tester",
            "operatingSystem": "Any",
            "applicationCategory": "DeveloperApplication",
            "description": "Test and debug regular expressions directly in your browser.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })
        }}
      />
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#93C5FD]/40 dark:bg-[#93C5FD]/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Regex Tester</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Test and debug regular expressions directly in your browser.
        </p>
      </div>

      <div className="mb-12">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      <div className="font-sans space-y-8">
        
        {/* Regex Input Card */}
        <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 shadow-sm">
          <label className="block text-sm font-medium opacity-70 mb-3">Regular Expression</label>
          <div className="flex items-stretch gap-2 bg-cream dark:bg-dark-cream p-2 rounded-2xl border border-ink/5 dark:border-white/5">
            <div className="flex items-center justify-center px-4 font-mono text-xl opacity-50 bg-white dark:bg-dark-card rounded-xl">
              /
            </div>
            <input 
              type="text" 
              value={regex} 
              onChange={(e) => setRegex(e.target.value)} 
              className="flex-grow bg-transparent px-4 py-3 font-mono text-lg focus:outline-none focus:ring-0"
              placeholder="Enter regex here..."
              spellCheck="false"
            />
            <div className="flex items-center justify-center px-4 font-mono text-xl opacity-50 bg-white dark:bg-dark-card rounded-xl">
              /
            </div>
            <input 
              type="text" 
              value={flags} 
              onChange={(e) => setFlags(e.target.value)} 
              className="w-20 bg-transparent px-4 py-3 font-mono text-lg text-center focus:outline-none focus:ring-0"
              placeholder="gmi"
              spellCheck="false"
            />
          </div>
          
          {result?.error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl text-sm font-mono flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0" />
              {result.error}
            </div>
          )}
        </div>

        {/* Test String & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Test String */}
          <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-ink/5 dark:border-white/5 bg-cream/50 dark:bg-dark-cream/50 font-medium text-sm flex items-center justify-between">
              Test String
            </div>
            <div className="flex-grow relative">
              <textarea 
                value={testString} 
                onChange={(e) => setTestString(e.target.value)} 
                className="absolute inset-0 w-full h-full resize-none p-4 font-mono text-sm leading-relaxed text-transparent caret-ink dark:caret-white focus:outline-none bg-transparent z-10"
                spellCheck="false"
              />
              <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <HighlightedText />
              </div>
            </div>
          </div>
          
          {/* Match Results */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 font-medium text-sm flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#93C5FD]" /> Match Results
              </div>
              <span className="text-xs bg-ink/10 dark:bg-white/10 px-2 py-1 rounded-md">
                {result?.matches ? `${result.matches.length} matches` : '0 matches'}
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {!result?.matches || result.matches.length === 0 ? (
                <div className="h-full flex items-center justify-center opacity-50 text-sm">
                  No matches found.
                </div>
              ) : (
                result.matches.map((m, i) => (
                  <div key={i} className="bg-white dark:bg-dark-card p-4 rounded-xl border border-ink/5 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs opacity-50 font-medium">Match {i + 1}</span>
                      <span className="text-xs opacity-50">Index: {m.index}-{m.index + m.match.length}</span>
                    </div>
                    <div className="font-mono text-sm bg-[#93C5FD]/10 p-2 rounded break-all">
                      {m.match}
                    </div>
                    
                    {m.groups && m.groups.length > 0 && m.groups.some(g => g !== undefined) && (
                      <div className="mt-3 pt-3 border-t border-ink/5 dark:border-white/5 space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider opacity-50 font-medium">Capture Groups</span>
                        {m.groups.map((g, gi) => g !== undefined ? (
                          <div key={gi} className="flex gap-3 text-xs font-mono">
                            <span className="opacity-50 w-4 text-right">{gi + 1}</span>
                            <span className="break-all">{g}</span>
                          </div>
                        ) : null)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
  
      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto mt-16 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 font-sans">
          
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Which regex flavor is supported?</h3>
            <p className="opacity-70 leading-relaxed">This tool uses standard JavaScript (ECMAScript) regular expressions executed directly in your browser environment.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Does it support capture groups?</h3>
            <p className="opacity-70 leading-relaxed">Yes! The Match Results pane will display not only the full match but also any individual capture groups you have defined.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12 print:hidden">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          
          <a href="/developer-tools/json-formatter" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">JSON Formatter</h3>
            <p className="text-sm opacity-60">Format and validate JSON data.</p>
          </a>
          <a href="/pdf-tools/merge-pdf" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col group">
            <h3 className="font-medium text-lg mb-2 group-hover:opacity-70 transition-opacity">Merge PDF</h3>
            <p className="text-sm opacity-60">Combine multiple PDF files locally.</p>
          </a>
        </div>
      </section>

    </div>
    </div>
  );
}
