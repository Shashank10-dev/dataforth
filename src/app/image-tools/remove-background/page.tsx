'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, ImageIcon, AlertCircle, Loader2, Download, Wifi } from 'lucide-react';
import AdZone from '@/components/AdZone';

const MAX_FILE_SIZE_MB = 10;

export default function RemoveBackgroundPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResultUrl(null);
    setShowWarning(false);
    
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setShowWarning(true); // Ask for confirmation before downloading model
  };

  const handleStartProcess = () => {
    if (!file) return;

    setShowWarning(false);
    setIsProcessing(true);
    setError(null);
    setResultUrl(null);
    setProgressMsg('Loading model (this takes a moment)...');

    const worker = new Worker(new URL('../../../workers/removeBackground.worker.ts', import.meta.url));

    worker.onmessage = (e) => {
      const { type, blob, error, data } = e.data;

      if (type === 'progress') {
        if (data.total) {
          const percent = Math.round((data.current / data.total) * 100);
          setProgressMsg(`Downloading AI model... ${percent}%`);
        }
      } else if (type === 'success') {
        setIsProcessing(false);
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        worker.terminate();
      } else if (type === 'error') {
        setIsProcessing(false);
        setError(error || 'Failed to remove background.');
        setShowWarning(true); // Allow retry
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      setIsProcessing(false);
      setError('A critical error occurred while processing the file. Make sure you have a stable connection.');
      setShowWarning(true); // Allow retry
      worker.terminate();
    };

    worker.postMessage({ file });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Background Remover Tool",
            "operatingSystem": "Any",
            "applicationCategory": "UtilitiesApplication",
            "description": "Automatically erase the background from any photo directly in your browser. 100% private.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-peach/40 dark:bg-peach/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Remove Background</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Automatically erase the background from any photo.
          Processed privately via on-device AI.
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
            <p className="text-2xl font-medium mb-2">Click or drag an image here</p>
            <p className="opacity-60 text-sm">Max size {MAX_FILE_SIZE_MB}MB</p>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200 font-sans max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-8 p-4 border border-ink/5 dark:border-white/5 rounded-2xl bg-cream dark:bg-dark-cream">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="bg-peach/30 dark:bg-peach/10 p-3 rounded-xl shrink-0">
                  <ImageIcon className="w-6 h-6 text-ink dark:text-peach" />
                </div>
                <div className="truncate">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm opacity-60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setPreviewUrl(null); setResultUrl(null); setError(null); setShowWarning(false); }}
                className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity shrink-0 ml-4 px-4 py-2 rounded-xl hover:bg-ink/5 dark:hover:bg-white/5"
              >
                Change
              </button>
            </div>

            {showWarning && (
              <div className="mb-6 p-8 bg-powder/20 dark:bg-powder/5 border border-powder/50 dark:border-powder/20 rounded-2xl text-center">
                <Wifi className="w-12 h-12 text-ink/40 dark:text-powder/60 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-3">First-Time Setup Required</h3>
                <p className="opacity-80 mb-6 leading-relaxed">
                  To keep your photos 100% private, this tool runs Artificial Intelligence directly on your device. 
                  It needs to download a <strong>one-time ~40-80MB AI model</strong> to your browser. 
                  We strongly recommend using a <strong>Wi-Fi connection</strong> for the first run.
                </p>
                <button
                  onClick={handleStartProcess}
                  className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 shadow-md"
                >
                  Download & Remove Background
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="mb-6 p-12 text-center border border-ink/5 dark:border-white/5 rounded-2xl">
                <Loader2 className="w-12 h-12 animate-spin mx-auto opacity-40 mb-6" />
                <h3 className="text-xl font-medium mb-2">Processing your image</h3>
                <p className="opacity-70 font-medium">{progressMsg}</p>
                <p className="text-sm opacity-50 mt-4 max-w-sm mx-auto leading-relaxed">Please don't close this tab. Processing happens locally and may take a few seconds.</p>
              </div>
            )}

            {resultUrl && (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="font-medium mb-6 text-xl">Background Removed!</h3>
                <div 
                  className="rounded-2xl overflow-hidden flex items-center justify-center h-80 border border-ink/10 dark:border-white/10 mb-8 relative bg-white"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Result" className="max-w-full max-h-full object-contain relative z-10 drop-shadow-lg" />
                </div>
                
                <a 
                  href={resultUrl} 
                  download={`nobg-${file.name.replace(/\.[^/.]+$/, "")}.png`}
                  className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 shadow-md"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Transparent PNG
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
