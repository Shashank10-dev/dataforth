'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import AdZone from '@/components/AdZone';

const MAX_FILE_SIZE_MB = 50;

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [result, setResult] = useState<{ url: string, originalSize: number, newSize: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleCompress = () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setProgressMsg('Scanning PDF for images...');

    const worker = new Worker(new URL('../../../workers/pdfCompress.worker.ts', import.meta.url));

    worker.onmessage = (e) => {
      const { success, blob, error, type, data } = e.data;
      if (type === 'progress') {
        setProgressMsg(data);
        return;
      }
      
      setIsProcessing(false);
      if (success) {
        const url = URL.createObjectURL(blob);
        setResult({
          url,
          originalSize: file.size,
          newSize: e.data.blob.size
        });
      } else {
        setError(e.data.error || 'Failed to compress PDF.');
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      setIsProcessing(false);
      setError('A critical error occurred while compressing the file.');
      worker.terminate();
    };

    worker.postMessage({ file, quality });
  };

  const formatSize = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PDF Compress Tool",
            "operatingSystem": "Any",
            "applicationCategory": "UtilitiesApplication",
            "description": "Reduce PDF file size significantly directly in your browser. Extracts, compresses, and re-embeds images.",
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
        <h1 className="text-5xl font-medium mb-4">Compress PDF</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Reduce the file size of your PDF while maintaining quality. 
          Processed completely on your device.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-12 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" type="banner" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-[#FFE8E8] dark:bg-[#3A1E1E] border border-[#FFD0D0] dark:border-[#5A2E2E] text-[#B02A2A] dark:text-[#FFB0B0] rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 font-sans">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!file ? (
          <div 
            className="border border-dashed border-ink/15 dark:border-white/15 bg-white/80 dark:bg-dark-card/80 rounded-[2rem] p-20 text-center hover:border-ink/30 dark:hover:border-white/30 hover:bg-white dark:hover:bg-dark-card transition-all duration-200 cursor-pointer flex flex-col items-center justify-center font-sans"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length) {
                // mock event for handler
                handleFileChange({ target: { files: e.dataTransfer.files } } as any);
              }
            }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-ink/5 dark:bg-white/5 text-ink/40 dark:text-white/40">
              <FileText className="w-10 h-10" />
            </div>
            <p className="text-2xl font-medium mb-2">Click or drag a PDF file here</p>
            <p className="opacity-60 text-sm">Max size {MAX_FILE_SIZE_MB}MB</p>
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200 font-sans">
            <div className="flex justify-between items-center mb-8 p-4 border border-ink/5 dark:border-white/5 rounded-2xl bg-cream dark:bg-dark-cream">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="bg-lavender/30 dark:bg-lavender/10 p-3 rounded-xl shrink-0">
                  <FileText className="w-6 h-6 text-ink dark:text-lavender" />
                </div>
                <div className="truncate">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm opacity-60">{formatSize(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setResult(null); setError(null); }}
                className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity shrink-0 ml-4 px-4 py-2 rounded-xl hover:bg-ink/5 dark:hover:bg-white/5"
              >
                Change File
              </button>
            </div>

            {!result && (
              <div className="max-w-md mx-auto">
                <div className="mb-10">
                  <label className="block text-sm font-medium mb-4 opacity-80 text-center">Select Compression Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`py-4 px-2 border rounded-xl text-center capitalize transition-all duration-150 ${
                          quality === q 
                            ? 'bg-lavender/20 border-lavender text-ink dark:text-white shadow-sm ring-1 ring-lavender' 
                            : 'bg-transparent border-ink/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-ink/20 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="font-medium text-sm mb-1">{q}</div>
                        <div className="text-[10px] opacity-60 uppercase tracking-wider">Quality</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs opacity-50 mt-4 text-center">
                    Lower quality compresses embedded images more aggressively.
                  </p>
                </div>

                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center bg-ink dark:bg-white disabled:bg-ink/20 dark:disabled:bg-white/20 disabled:text-ink/50 dark:disabled:text-ink/50 text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      {progressMsg || 'Compressing...'}
                    </>
                  ) : (
                    'Compress PDF'
                  )}
                </button>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-sage/40 dark:bg-sage/20 text-ink dark:text-sage px-6 py-3 rounded-full font-medium flex items-center text-sm shadow-sm border border-sage/50">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Success! Reduced by {Math.round((1 - result.newSize / result.originalSize) * 100)}%
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8 mb-8 text-lg font-medium">
                  <div className="flex flex-col items-center">
                    <span className="text-sm opacity-50 mb-1">Original</span>
                    <span>{formatSize(result.originalSize)}</span>
                  </div>
                  <div className="w-px h-8 bg-ink/10 dark:bg-white/10"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm opacity-50 mb-1">Compressed</span>
                    <span className="font-bold">{formatSize(result.newSize)}</span>
                  </div>
                </div>
                
                <div className="max-w-md mx-auto">
                  <a 
                    href={result.url} 
                    download={`compressed-${file.name}`}
                    className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 shadow-md"
                  >
                    Download Compressed PDF
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-16 mb-16 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" type="banner" />
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-medium mb-8">Frequently Asked Questions</h2>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does the PDF compressor work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Unlike basic tools that only remove invisible metadata, our compressor scans your PDF for embedded images, extracts them, re-compresses them using advanced WebAssembly algorithms, and re-embeds them to drastically reduce file size."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will compressing my PDF ruin the quality?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can choose the tradeoff between quality and size. 'High' quality applies very mild compression to images, while 'Low' applies more aggressive compression to minimize the file size."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What if my PDF is mostly text?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Text-heavy PDFs are inherently small. If your PDF does not contain embedded images, the tool will simply remove unnecessary metadata. The size reduction won't be as dramatic as image-heavy scanned documents."
                  }
                }
              ]
            })
          }}
        />
        <div className="space-y-4 font-sans">
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">How does the PDF compressor work?</h3>
            <p className="opacity-70 leading-relaxed">Unlike basic tools that only remove invisible metadata, our compressor scans your PDF for embedded images, extracts them, re-compresses them using advanced WebAssembly algorithms, and re-embeds them to drastically reduce file size.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Will compressing my PDF ruin the quality?</h3>
            <p className="opacity-70 leading-relaxed">You can choose the tradeoff between quality and size. "High" quality applies very mild compression to images, while "Low" applies more aggressive compression to minimize the file size.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">What if my PDF is mostly text?</h3>
            <p className="opacity-70 leading-relaxed">Text-heavy PDFs are inherently small. If your PDF does not contain embedded images, the tool will simply remove unnecessary metadata. The size reduction won't be as dramatic as image-heavy scanned documents.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          <Link href="/pdf-tools/merge-pdf" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex items-center gap-5 group">
            <div className="bg-lavender text-ink p-4 rounded-full shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1 group-hover:opacity-70 transition-opacity">Merge PDF</h3>
              <p className="text-sm opacity-60">Combine multiple PDFs easily.</p>
            </div>
          </Link>
          <Link href="/document-tools/markdown-converter" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex items-center gap-5 group">
            <div className="bg-[#FCD34D] text-ink p-4 rounded-full shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1 group-hover:opacity-70 transition-opacity">Markdown Converter</h3>
              <p className="text-sm opacity-60">Convert PDF, Word, and Excel to Markdown.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
