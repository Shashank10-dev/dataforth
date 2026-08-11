'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import AdZone from '@/components/AdZone';

const MAX_FILE_SIZE_MB = 20;

export default function ConvertHeicPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResultUrl(null);
    
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.heic') && !selectedFile.name.toLowerCase().endsWith('.heif')) {
      setError('Please select a valid HEIC or HEIF file.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleConvert = () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResultUrl(null);

    const worker = new Worker(new URL('../../../workers/heicToJpg.worker.ts', import.meta.url));

    worker.onmessage = (e) => {
      setIsProcessing(false);
      if (e.data.success) {
        const url = URL.createObjectURL(e.data.blob);
        setResultUrl(url);
      } else {
        setError(e.data.error || 'Failed to convert HEIC image.');
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      setIsProcessing(false);
      setError('A critical error occurred while converting the file. Note: Safari requires specific WASM support for this tool.');
      worker.terminate();
    };

    worker.postMessage({ file, format });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "HEIC to JPG Converter",
            "operatingSystem": "Any",
            "applicationCategory": "UtilitiesApplication",
            "description": "Convert Apple HEIC photos to standard JPG format securely in your browser.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-powder/40 dark:bg-powder/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Convert HEIC to JPG</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Turn your iPhone HEIC photos into universally compatible JPGs.
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
                handleFileChange({ target: { files: e.dataTransfer.files } } as any);
              }
            }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-ink/5 dark:bg-white/5 text-ink/40 dark:text-white/40">
              <Upload className="w-10 h-10" />
            </div>
            <p className="text-2xl font-medium mb-2">Click or drag a HEIC file here</p>
            <p className="opacity-60 text-sm">Max size {MAX_FILE_SIZE_MB}MB</p>
            <input 
              type="file" 
              accept=".heic,.heif" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200 font-sans max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-8 p-4 border border-ink/5 dark:border-white/5 rounded-2xl bg-cream dark:bg-dark-cream">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="bg-powder/50 dark:bg-powder/20 p-3 rounded-xl shrink-0">
                  <ImageIcon className="w-6 h-6 text-ink dark:text-powder" />
                </div>
                <div className="truncate">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm opacity-60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setResultUrl(null); setError(null); }}
                className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity shrink-0 ml-4 px-4 py-2 rounded-xl hover:bg-ink/5 dark:hover:bg-white/5"
              >
                Change
              </button>
            </div>

            {!resultUrl ? (
              <>
                <div className="mb-10">
                  <label className="block text-sm font-medium mb-4 opacity-80 text-center">Convert To</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormat('image/jpeg')}
                      className={`py-4 px-2 border rounded-xl text-center transition-all duration-150 ${
                        format === 'image/jpeg' 
                          ? 'bg-powder/30 border-powder text-ink dark:text-white shadow-sm ring-1 ring-powder' 
                          : 'bg-transparent border-ink/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-ink/20 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium">JPG</div>
                      <div className="text-[10px] opacity-60 uppercase tracking-wider mt-1">Recommended</div>
                    </button>
                    <button
                      onClick={() => setFormat('image/png')}
                      className={`py-4 px-2 border rounded-xl text-center transition-all duration-150 ${
                        format === 'image/png' 
                          ? 'bg-powder/30 border-powder text-ink dark:text-white shadow-sm ring-1 ring-powder' 
                          : 'bg-transparent border-ink/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-ink/20 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium">PNG</div>
                      <div className="text-[10px] opacity-60 uppercase tracking-wider mt-1">Lossless</div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center bg-ink dark:bg-white disabled:bg-ink/20 dark:disabled:bg-white/20 disabled:text-ink/50 dark:disabled:text-ink/50 text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      Converting (takes a moment)...
                    </>
                  ) : (
                    'Convert Image'
                  )}
                </button>
              </>
            ) : (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-ink/5 dark:bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center h-64 border border-ink/10 dark:border-white/10 mb-8 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Converted" className="max-w-full max-h-full object-contain drop-shadow-sm rounded" />
                </div>
                
                <a 
                  href={resultUrl} 
                  download={`${file.name.replace(/\.heic$/i, '')}.${format === 'image/jpeg' ? 'jpg' : 'png'}`}
                  className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 shadow-md"
                >
                  Download Converted Image
                </a>
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
    </div>
  );
}
