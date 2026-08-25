'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Check, Copy, Download, AlertCircle, Info, Eye, Code, FileDown } from 'lucide-react';
import AdZone from '@/components/AdZone';
import Link from 'next/link';

export default function MarkdownViewerPage() {
  const [markdown, setMarkdown] = useState<string>('');
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Initialize parsers
  useEffect(() => {
    const parseMarkdown = async () => {
      if (!markdown) {
        setRenderedHtml('');
        return;
      }
      try {
        const { marked } = await import('marked');
        const DOMPurify = (await import('dompurify')).default;
        
        // Parse and sanitize
        const rawHtml = await marked.parse(markdown, { async: false }) as string;
        const cleanHtml = DOMPurify.sanitize(rawHtml, {
          ADD_TAGS: ['iframe'], // Allow standard tags if needed, but default is usually fine
          ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
        });
        
        setRenderedHtml(cleanHtml);
      } catch (err: any) {
        console.error('Parsing error:', err);
        setError('Failed to render Markdown.');
      }
    };
    
    // Debounce rendering slightly for paste
    const timeoutId = setTimeout(parseMarkdown, 300);
    return () => clearTimeout(timeoutId);
  }, [markdown]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    setError(null);
    setIsProcessing(true);

    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    
    if (ext !== 'md' && ext !== 'txt' && ext !== 'markdown') {
      setError(`Unsupported file type: .${ext}. Please upload a .md or .txt file.`);
      setIsProcessing(false);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 5MB.`);
      setIsProcessing(false);
      return;
    }

    try {
      const text = await selectedFile.text();
      setMarkdown(text);
      setViewMode('preview');
    } catch (err: any) {
      console.error(err);
      setError('An error occurred reading the file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    if (!renderedHtml) return;
    
    // Create a styled HTML document for downloading
    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.2;
    }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    pre {
      background-color: #f6f8fa;
      padding: 16px;
      overflow: auto;
      border-radius: 6px;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
      font-size: 85%;
      background-color: rgba(27,31,35,0.05);
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
      margin: 0;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      margin-top: 0;
      margin-bottom: 16px;
    }
    table th, table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    img {
      max-width: 100%;
      box-sizing: content-box;
    }
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0d1117;
        color: #c9d1d9;
      }
      a { color: #58a6ff; }
      pre { background-color: #161b22; }
      code { background-color: rgba(240,246,252,0.15); }
      blockquote { color: #8b949e; border-left-color: #30363d; }
      table th, table td { border-color: #30363d; }
      table tr:nth-child(2n) { background-color: #161b22; }
      hr { background-color: #21262d; }
    }
  </style>
</head>
<body>
  ${renderedHtml}
</body>
</html>`;

    const blob = new Blob([htmlDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearContent = () => {
    setMarkdown('');
    setRenderedHtml('');
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl flex-grow">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Markdown Viewer",
            "operatingSystem": "Any",
            "applicationCategory": "ProductivityApplication",
            "description": "View, format, and render Markdown files entirely in your browser. Download as styled HTML or raw .md.",
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
                "name": "What is a .md file?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A .md (Markdown) file is a plain text file that uses simple symbols (like asterisks and hashes) to format text (such as bolding or creating headers). It's widely used for documentation, README files, and by AI tools."
                }
              },
              {
                "@type": "Question",
                "name": "Is my file uploaded anywhere?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. This tool operates completely in your browser. Any text you paste or file you open is processed locally on your device, ensuring total privacy."
                }
              },
              {
                "@type": "Question",
                "name": "What Markdown features are supported?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We support standard Markdown as well as GitHub-Flavored Markdown (GFM). This includes headings, bold/italics, lists, links, images, blockquotes, tables, strikethroughs, and task lists."
                }
              }
            ]
          })
        }}
      />

      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#FCD34D]/40 dark:bg-[#FCD34D]/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Markdown Viewer</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Read, preview, and format Markdown files instantly. 100% free and strictly private — processed entirely in your browser.
        </p>
      </div>

      <div className="mb-12">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Input Column */}
        <div className="flex flex-col gap-6 h-[600px] lg:h-auto min-h-[600px]">
          
          <div 
            className="flex-grow flex flex-col bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm relative group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {/* File drop overlay */}
            <div className="absolute inset-0 z-10 hidden group-hover:flex items-center justify-center bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm pointer-events-none transition-all">
               <div className="text-center">
                 <UploadCloud className="w-12 h-12 text-[#FCD34D] mb-4 mx-auto" />
                 <p className="font-medium">Drop Markdown file here</p>
               </div>
            </div>

            <div className="p-4 border-b border-ink/5 dark:border-white/5 flex items-center justify-between bg-cream/50 dark:bg-dark-cream/50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 opacity-50" />
                <span className="font-medium text-sm">Markdown Input</span>
              </div>
              <div className="flex items-center gap-2">
                 <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden" 
                  accept=".md,.markdown,.txt"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-lg border border-ink/10 dark:border-white/10 hover:bg-cream dark:hover:bg-dark-cream transition-colors"
                >
                  Open File
                </button>
                {markdown && (
                  <button
                    onClick={clearContent}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste your Markdown here or drag and drop a .md file..."
              className="w-full flex-grow bg-transparent p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed custom-scrollbar"
              spellCheck="false"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-cream/40 dark:bg-dark-cream/40 border border-ink/5 dark:border-white/5 rounded-2xl p-5 flex gap-4 text-sm font-sans items-start mt-auto">
            <Info className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Strictly Local Parsing</p>
              <p className="opacity-70 leading-relaxed">
                Your Markdown is parsed and sanitized natively in your browser using DOMPurify. This ensures any embedded HTML is stripped of malicious scripts before rendering, protecting you from XSS attacks when viewing untrusted files.
              </p>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm h-[600px] lg:h-auto min-h-[600px]">
          
          <div className="p-4 border-b border-ink/5 dark:border-white/5 flex items-center justify-between bg-cream/50 dark:bg-dark-cream/50 flex-wrap gap-4">
            <div className="flex items-center bg-ink/5 dark:bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'raw' ? 'bg-white dark:bg-dark-card shadow-sm font-medium' : 'opacity-70 hover:opacity-100'}`}
              >
                <Code className="w-4 h-4" /> Raw HTML
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === 'preview' ? 'bg-white dark:bg-dark-card shadow-sm font-medium' : 'opacity-70 hover:opacity-100'}`}
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownloadMd}
                disabled={!markdown}
                className="flex items-center gap-2 text-sm bg-transparent hover:bg-cream dark:hover:bg-dark-cream border border-ink/10 dark:border-white/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as .md"
              >
                <FileDown className="w-4 h-4" /> .md
              </button>
              <button 
                onClick={handleDownloadHtml}
                disabled={!markdown}
                className="flex items-center gap-2 text-sm bg-transparent hover:bg-cream dark:hover:bg-dark-cream border border-ink/10 dark:border-white/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as HTML"
              >
                <Download className="w-4 h-4" /> HTML
              </button>
              <button 
                onClick={handleCopy}
                disabled={!markdown}
                className="flex items-center gap-2 text-sm bg-ink dark:bg-white text-white dark:text-ink px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy Source"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto bg-transparent relative custom-scrollbar">
            {!markdown && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 text-center p-8">
                <Eye className="w-12 h-12 mb-4 opacity-50" />
                <p>Rendered Markdown will appear here.</p>
              </div>
            )}
            
            {markdown && viewMode === 'raw' && (
              <textarea
                value={renderedHtml}
                readOnly
                className="w-full h-full bg-transparent p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                spellCheck="false"
              />
            )}

            {markdown && viewMode === 'preview' && (
              <div 
                className="p-8 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto mt-16 font-sans">
        <h2 className="text-3xl font-medium mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">What is a .md file?</h3>
            <p className="opacity-70 leading-relaxed">A .md (Markdown) file is a plain text file that uses simple symbols (like asterisks and hashes) to format text (such as bolding or creating headers). It's widely used for documentation, README files, and by AI tools.</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">Is my file uploaded anywhere?</h3>
            <p className="opacity-70 leading-relaxed">No. This tool operates completely in your browser. Any text you paste or file you open is processed locally on your device, ensuring total privacy.</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">What Markdown features are supported?</h3>
            <p className="opacity-70 leading-relaxed">We support standard Markdown as well as GitHub-Flavored Markdown (GFM). This includes headings, bold/italics, lists, links, images, blockquotes, tables, strikethroughs, and task lists.</p>
          </div>
        </div>
      </div>

      {/* Cross-linking to other Tools */}
      <div className="mt-20 border-t border-ink/10 dark:border-white/10 pt-16 font-sans">
        <h2 className="text-2xl font-medium mb-8 text-center">Related Document Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/document-tools/markdown-converter" className="group p-6 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-[#FCD34D]/60 transition-colors">
            <h3 className="text-xl font-medium text-ink dark:text-white mb-2 group-hover:text-[#F59E0B] transition-colors">Markdown Converter</h3>
            <p className="opacity-70 text-sm">Convert Word, PowerPoint, Excel, and PDF files directly into Markdown format entirely in your browser.</p>
          </Link>
          <Link href="/pdf-tools/merge-pdf" className="group p-6 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-[#FCD34D]/60 transition-colors">
            <h3 className="text-xl font-medium text-ink dark:text-white mb-2 group-hover:text-[#F59E0B] transition-colors">Merge PDF</h3>
            <p className="opacity-70 text-sm">Combine multiple PDFs into a single file completely locally without any servers.</p>
          </Link>
        </div>
      </div>

    </div>
  );
}
