'use client';

import React, { useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import AdZone from '@/components/AdZone';

interface FileItem {
  id: string;
  file: File;
}

const MAX_FILES = 20;
const MAX_TOTAL_SIZE_MB = 50;

export default function MergePdfPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFilesAdded = (newFiles: FileList | File[]) => {
    setError(null);
    setDownloadUrl(null);

    const validFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf');
    if (validFiles.length !== newFiles.length) {
      setError('Some files were rejected. Only PDF files are allowed.');
    }

    setFiles(prev => {
      const combined = [...prev, ...validFiles.map(file => ({ id: Math.random().toString(36).substring(7), file }))];
      
      if (combined.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files allowed.`);
        return combined.slice(0, MAX_FILES);
      }
      
      const totalSize = combined.reduce((acc, curr) => acc + curr.file.size, 0);
      if (totalSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
        setError(`Total file size exceeds ${MAX_TOTAL_SIZE_MB}MB limit.`);
        return prev; // Revert if size exceeded
      }

      return combined;
    });
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    setDownloadUrl(null);
  };

  const handleMerge = () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setDownloadUrl(null);

    const worker = new Worker(new URL('../../../workers/pdfMerge.worker.ts', import.meta.url));

    worker.onmessage = (e) => {
      setIsProcessing(false);
      if (e.data.success) {
        const url = URL.createObjectURL(e.data.blob);
        setDownloadUrl(url);
      } else {
        setError(e.data.error || 'Failed to merge PDFs.');
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      setIsProcessing(false);
      setError('A critical error occurred while merging the files.');
      worker.terminate();
    };

    worker.postMessage({ files: files.map(f => f.file) });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PDF Merge Tool",
            "operatingSystem": "Any",
            "applicationCategory": "UtilitiesApplication",
            "description": "Combine multiple PDFs into one unified document securely in your browser.",
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
        <h1 className="text-5xl font-medium mb-4">Merge PDF Files</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Combine multiple PDFs into one unified document. Drag and drop to reorder. 
          Processed securely in your browser.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-12 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" type="banner" />
        </div>
      </div>

      {/* Main Tool Area */}
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-[#FFE8E8] dark:bg-[#3A1E1E] border border-[#FFD0D0] dark:border-[#5A2E2E] text-[#B02A2A] dark:text-[#FFB0B0] rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 font-sans">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {files.length === 0 ? (
          <div 
            className="border border-dashed border-ink/15 dark:border-white/15 bg-white/80 dark:bg-dark-card/80 rounded-[2rem] p-20 text-center hover:border-ink/30 dark:hover:border-white/30 hover:bg-white dark:hover:bg-dark-card transition-all duration-200 cursor-pointer flex flex-col items-center justify-center font-sans"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFilesAdded(e.dataTransfer.files);
            }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-ink/5 dark:bg-white/5 text-ink/40 dark:text-white/40">
              <Upload className="w-10 h-10" />
            </div>
            <p className="text-2xl font-medium mb-2">Click or drag PDF files here</p>
            <p className="opacity-60 text-sm">Max {MAX_FILES} files, up to {MAX_TOTAL_SIZE_MB}MB total</p>
            <input 
              type="file" 
              multiple 
              accept="application/pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200 font-sans">
            <div className="flex justify-between items-center mb-8 border-b border-ink/10 dark:border-white/10 pb-4">
              <h3 className="font-medium text-lg">Selected Files ({files.length})</h3>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity px-4 py-2 rounded-xl hover:bg-ink/5 dark:hover:bg-white/5"
              >
                + Add More
              </button>
              <input 
                type="file" 
                multiple 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files) handleFilesAdded(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>

            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={files.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="mb-10 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                  {files.map((fileItem) => (
                    <SortableItem 
                      key={fileItem.id} 
                      id={fileItem.id} 
                      file={fileItem.file} 
                      onRemove={removeFile}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {downloadUrl ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-md mx-auto">
                <a 
                  href={downloadUrl} 
                  download="merged.pdf"
                  className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 shadow-md"
                >
                  Download Merged PDF
                </a>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleMerge}
                  disabled={isProcessing || files.length < 2}
                  className="w-full flex items-center justify-center bg-ink dark:bg-white disabled:bg-ink/20 dark:disabled:bg-white/20 disabled:text-ink/50 dark:disabled:text-ink/50 text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      Processing...
                    </>
                  ) : (
                    'Merge PDFs'
                  )}
                </button>
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
                  "name": "Is it safe to merge my PDFs here?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, absolutely safe. Our tool uses WebAssembly to process your files directly inside your browser. Your files are never uploaded to our servers, ensuring 100% privacy."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How many PDFs can I merge at once?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can merge up to 20 PDF files at a time, provided the total size does not exceed 50MB. This limit helps prevent your browser from crashing due to high memory usage."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I reorder the pages before merging?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can easily drag and drop the files in the list to change their order before clicking the 'Merge PDFs' button."
                  }
                }
              ]
            })
          }}
        />
        <div className="space-y-4 font-sans">
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Is it safe to merge my PDFs here?</h3>
            <p className="opacity-70 leading-relaxed">Yes, absolutely safe. Our tool uses WebAssembly to process your files directly inside your browser. Your files are never uploaded to our servers, ensuring 100% privacy.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">How many PDFs can I merge at once?</h3>
            <p className="opacity-70 leading-relaxed">You can merge up to 20 PDF files at a time, provided the total size does not exceed 50MB. This limit helps prevent your browser from crashing due to high memory usage.</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-ink/10 dark:border-white/10 shadow-sm">
            <h3 className="font-medium mb-3 text-lg">Can I reorder the files before merging?</h3>
            <p className="opacity-70 leading-relaxed">Yes, you can easily drag and drop the files in the list to change their order before clicking the "Merge PDFs" button.</p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-3xl mx-auto pb-12">
        <h2 className="text-3xl font-medium mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
          <Link href="/pdf-tools/compress-pdf" className="p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex items-center gap-5 group">
            <div className="bg-lavender text-ink p-4 rounded-full shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1 group-hover:opacity-70 transition-opacity">Compress PDF</h3>
              <p className="text-sm opacity-60">Reduce PDF file size significantly.</p>
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
