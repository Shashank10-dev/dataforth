'use client';

import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Upload, FileText, AlertCircle, Loader2, Scissors, FileDown, CheckCircle2 } from 'lucide-react';
import Disclaimer from '@/components/ui/Disclaimer';

const MAX_TOTAL_SIZE_MB = 50;

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'extract' | 'split_all'>('split_all');
  const [rangeStr, setRangeStr] = useState<string>('');
  
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [result, setResult] = useState<{ url: string, filename: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setError(null);
    setResult(null);
    setProgressMsg('');
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    
    if (selectedFile.size > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_TOTAL_SIZE_MB}MB limit.`);
      return;
    }

    setFile(selectedFile);
  };

  const parsePageRange = (rangeStr: string): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',');
    for (let part of parts) {
      part = part.trim();
      if (!part) continue;
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr.trim());
        const end = parseInt(endStr.trim());
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            pages.add(i);
          }
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum)) {
          pages.add(pageNum);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = () => {
    if (!file) return;

    let selectedPages: number[] = [];
    if (mode === 'extract') {
      selectedPages = parsePageRange(rangeStr);
      if (selectedPages.length === 0) {
        setError('Please enter a valid page range (e.g. "1-3, 5").');
        return;
      }
    }

    setIsProcessing(true);
    setError(null);
    setProgressMsg('Starting...');

    const worker = new Worker(new URL('../../../workers/pdfSplit.worker.ts', import.meta.url));

    worker.onmessage = (e) => {
      const { success, blob, filename, error, type, data } = e.data;
      if (type === 'progress') {
        setProgressMsg(data);
        return;
      }
      
      setIsProcessing(false);
      if (success) {
        const url = URL.createObjectURL(blob);
        setResult({ url, filename });
      } else {
        setError(error || 'Failed to split PDF.');
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      setIsProcessing(false);
      setError('A critical error occurred while processing the file.');
      worker.terminate();
    };

    worker.postMessage({ file, mode, selectedPages });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PDF Split Tool",
            "operatingSystem": "Any",
            "applicationCategory": "UtilitiesApplication",
            "description": "Extract specific pages from a PDF or split it into individual files securely in your browser.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-lavender/30 dark:bg-lavender/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4 font-heading">Split PDF</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          Extract specific pages or split your document into multiple single-page files.
          Processed securely in your browser—no files uploaded.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-[#FFE8E8] dark:bg-[#3A1E1E] border border-[#FFD0D0] dark:border-[#5A2E2E] text-[#B02A2A] dark:text-[#FFB0B0] rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!file ? (
          <div 
            className={`border-2 border-dashed rounded-[2rem] p-20 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center
              ${isDragOver 
                ? 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10' 
                : 'border-ink/15 dark:border-white/15 bg-white/80 dark:bg-dark-card/80 hover:border-ink/30 dark:hover:border-white/30 hover:bg-white dark:hover:bg-dark-card'
              }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-ink/5 dark:bg-white/5 text-ink/40 dark:text-white/40">
              <Upload className="w-10 h-10" />
            </div>
            <p className="text-2xl font-medium mb-2">Click or drag a PDF file here</p>
            <p className="opacity-60 text-sm">Up to {MAX_TOTAL_SIZE_MB}MB</p>
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-ink/10 dark:border-white/10 pb-6 gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-lavender" />
                <div>
                  <h3 className="font-medium text-lg truncate max-w-[200px] sm:max-w-[300px]">{file.name}</h3>
                  <p className="text-xs opacity-60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setResult(null); }}
                className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity px-4 py-2 rounded-xl hover:bg-ink/5 dark:hover:bg-white/5"
              >
                Change File
              </button>
            </div>

            {result ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-sage/40 dark:bg-sage/20 text-ink dark:text-sage px-6 py-3 rounded-full font-medium flex items-center text-sm shadow-sm border border-sage/50">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Success! File is ready to download.
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <a 
                    href={result.url} 
                    download={result.filename}
                    className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 shadow-md"
                  >
                    <FileDown className="w-5 h-5 mr-2" />
                    Download {result.filename.endsWith('.zip') ? 'ZIP' : 'PDF'}
                  </a>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="flex gap-2 p-1 bg-ink/5 dark:bg-white/5 rounded-xl mb-8">
                  <button 
                    onClick={() => setMode('split_all')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'split_all' ? 'bg-white dark:bg-dark-card shadow text-ink dark:text-white' : 'text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white'}`}
                  >
                    Split All Pages
                  </button>
                  <button 
                    onClick={() => setMode('extract')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'extract' ? 'bg-white dark:bg-dark-card shadow text-ink dark:text-white' : 'text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white'}`}
                  >
                    Extract Pages
                  </button>
                </div>

                {mode === 'extract' && (
                  <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium mb-2 opacity-80">Pages to Extract</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1-3, 5, 8-10"
                      value={rangeStr}
                      onChange={(e) => setRangeStr(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 dark:border-white/20 bg-transparent focus:outline-none focus:ring-2 focus:ring-lavender"
                    />
                    <p className="text-xs opacity-60 mt-2">Enter page numbers and/or ranges separated by commas.</p>
                  </div>
                )}
                
                {mode === 'split_all' && (
                  <div className="mb-8 text-center animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-sm opacity-70">
                      Every page of this PDF will be extracted into its own separate PDF file.
                      You'll receive a ZIP archive containing all the single-page PDFs.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSplit}
                  disabled={isProcessing || (mode === 'extract' && !rangeStr.trim())}
                  className="w-full flex items-center justify-center bg-ink dark:bg-white disabled:bg-ink/20 dark:disabled:bg-white/20 disabled:text-ink/50 dark:disabled:text-ink/50 text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      {progressMsg || 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Scissors className="w-5 h-5 mr-2" />
                      {mode === 'extract' ? 'Extract Pages' : 'Split into ZIP'}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <section className="mt-16 max-w-3xl mx-auto">
        <Disclaimer title="100% Client-Side Privacy" tone="technical">
          This tool runs entirely in your browser using WebAssembly. Your PDFs are never uploaded to any server, 
          guaranteeing that sensitive documents remain completely private.
        </Disclaimer>
      </section>

      {/* FAQ Section */}
      <section className="mb-16 mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-medium mb-8 font-heading">Frequently Asked Questions</h2>
        <div className="space-y-4 font-sans">
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Are my files uploaded to a server?</h3>
            <p className="opacity-70 leading-relaxed">No. Dataforth uses advanced browser technologies to process your PDF files locally on your device. Nothing is ever uploaded to our servers.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">How do I extract just one page?</h3>
            <p className="opacity-70 leading-relaxed">Select the "Extract Pages" mode and simply type the page number (e.g., "5") into the text box. The downloaded PDF will contain only that single page.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">What is the maximum file size?</h3>
            <p className="opacity-70 leading-relaxed">The maximum file size is 50MB. This ensures the processing can run smoothly within your browser's memory limits without crashing.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12">
        <h2 className="text-3xl font-medium mb-8 font-heading">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          <Link href="/pdf-tools/merge-pdf" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex items-center gap-5 group">
            <div className="bg-lavender text-ink p-4 rounded-full shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1 group-hover:opacity-70 transition-opacity">Merge PDF</h3>
              <p className="text-sm opacity-60">Combine multiple PDFs into one document.</p>
            </div>
          </Link>
          <Link href="/pdf-tools/compress-pdf" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex items-center gap-5 group">
            <div className="bg-lavender text-ink p-4 rounded-full shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1 group-hover:opacity-70 transition-opacity">Compress PDF</h3>
              <p className="text-sm opacity-60">Reduce PDF file size significantly.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
