'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, Check, Copy, Download, RefreshCw, AlertCircle, Info, ChevronRight, Eye, Code } from 'lucide-react';
import AdZone from '@/components/AdZone';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function MarkdownConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('raw');
  const [copied, setCopied] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedExtensions = ['docx', 'pptx', 'xlsx', 'csv', 'html', 'pdf'];

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
    setFile(selectedFile);
    setError(null);
    setMarkdown('');
    setIsConverting(true);

    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    
    if (!supportedExtensions.includes(ext)) {
      setError(`Unsupported file type: .${ext}. Please upload DOCX, PPTX, XLSX, CSV, HTML, or PDF.`);
      setIsConverting(false);
      return;
    }

    try {
      let result = '';
      
      if (ext === 'docx') {
        const mammoth = (await import('mammoth')).default;
        const arrayBuffer = await selectedFile.arrayBuffer();
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
        const TurndownService = (await import('turndown')).default;
        const turndown = new TurndownService({ headingStyle: 'atx' });
        result = turndown.turndown(htmlResult.value);
      } 
      else if (ext === 'html') {
        const TurndownService = (await import('turndown')).default;
        const turndown = new TurndownService({ headingStyle: 'atx' });
        const text = await selectedFile.text();
        result = turndown.turndown(text);
      }
      else if (ext === 'xlsx' || ext === 'csv') {
        const XLSX = await import('xlsx');
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        let allMd = '';
        workbook.SheetNames.forEach((sheetName, index) => {
          const sheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          const rows = csv.split('\n').filter(r => r.trim());
          if (rows.length > 0) {
            if (workbook.SheetNames.length > 1) {
              allMd += `## ${sheetName}\n\n`;
            }
            
            // Format as Markdown table
            const headers = rows[0].split(',');
            allMd += `| ${headers.join(' | ')} |\n`;
            allMd += `| ${headers.map(() => '---').join(' | ')} |\n`;
            
            for(let i = 1; i < rows.length; i++) {
              allMd += `| ${rows[i].split(',').join(' | ')} |\n`;
            }
            allMd += '\n\n';
          }
        });
        result = allMd;
      }
      else if (ext === 'pdf') {
        const pdfjsLib = await import('pdfjs-dist');
        // Configure worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          
          text += `## Page ${i}\n\n${strings.join(' ')}\n\n---\n\n`;
        }
        result = text;
      }
      else if (ext === 'pptx') {
        const JSZip = (await import('jszip')).default;
        const arrayBuffer = await selectedFile.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        let text = '';
        
        const slideFiles = Object.keys(zip.files).filter(name => name.match(/^ppt\/slides\/slide\d+\.xml$/));
        
        slideFiles.sort((a, b) => {
          const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0');
          const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0');
          return numA - numB;
        });

        const parser = new DOMParser();
        for (let idx = 0; idx < slideFiles.length; idx++) {
          const fileName = slideFiles[idx];
          const xmlContent = await zip.file(fileName)?.async('string');
          if (xmlContent) {
            const doc = parser.parseFromString(xmlContent, 'text/xml');
            const tTags = doc.getElementsByTagName('a:t');
            let slideText = '';
            for (let i = 0; i < tTags.length; i++) {
               slideText += tTags[i].textContent + '\n';
            }
            if (slideText.trim()) {
              text += `## Slide ${idx + 1}\n\n${slideText.trim()}\n\n---\n\n`;
            }
          }
        }
        result = text || 'No text found in presentation.';
      }

      setMarkdown(result || 'No content could be extracted.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during conversion. Please check if the file is corrupted or protected.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.split('.')[0] || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setMarkdown('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl flex-grow">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Markdown Converter",
            "operatingSystem": "Any",
            "applicationCategory": "ProductivityApplication",
            "description": "Convert Word, PowerPoint, Excel, PDF, and HTML files into clean Markdown entirely in your browser.",
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
                "name": "How does this tool process my files securely?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Every other converter online asks you to upload your file to their server. This tool uses specialized WebAssembly and JavaScript libraries to extract the text and convert it to Markdown entirely locally on your device. Your file never touches a server."
                }
              },
              {
                "@type": "Question",
                "name": "What file types are supported?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Currently, we support Word Documents (.docx), PowerPoint Presentations (.pptx), Excel Spreadsheets (.xlsx), CSVs, HTML files, and standard text-based PDFs. Note that for PPTX and PDFs, only the text is extracted; images and slide layouts are excluded."
                }
              }
            ]
          })
        }}
      />

      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#FCD34D]/40 dark:bg-[#FCD34D]/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Markdown Converter</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Convert Word, PowerPoint, Excel, PDF, and HTML files into clean Markdown. 100% free and strictly private — processed entirely in your browser.
        </p>
      </div>

      <div className="mb-12">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Upload Column */}
        <div className="flex flex-col gap-6">
          <div 
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-colors bg-white dark:bg-dark-card ${file ? 'border-[#FCD34D] bg-[#FCD34D]/5 dark:bg-[#FCD34D]/5' : 'border-ink/20 dark:border-white/20 hover:border-[#FCD34D]/50'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {isConverting ? (
              <div className="flex flex-col items-center">
                <RefreshCw className="w-12 h-12 text-[#F59E0B] animate-spin mb-4" />
                <h3 className="text-xl font-medium mb-2">Converting to Markdown...</h3>
                <p className="opacity-70 text-sm text-center">
                  Loading the correct parser and extracting text locally. This might take a few seconds for large PDFs.
                </p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center">
                <FileText className="w-12 h-12 text-[#F59E0B] mb-4" />
                <h3 className="text-xl font-medium mb-2 break-all text-center">{file.name}</h3>
                <p className="opacity-70 text-sm mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={reset}
                  className="px-4 py-2 text-sm border border-ink/20 dark:border-white/20 rounded-lg hover:bg-cream dark:hover:bg-dark-cream transition-colors"
                >
                  Convert Another File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <UploadCloud className="w-12 h-12 text-[#FCD34D] mb-4" />
                <h3 className="text-xl font-medium mb-2">Drop your file here</h3>
                <p className="opacity-70 text-sm mb-6 max-w-[250px]">
                  Supports .docx, .pptx, .xlsx, .csv, .html, and .pdf
                </p>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden" 
                  accept=".docx,.pptx,.xlsx,.csv,.html,.pdf"
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-ink dark:bg-white text-white dark:text-ink font-medium py-3 px-8 rounded-xl transition-transform duration-150 hover:-translate-y-0.5 shadow-md"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Usage Disclaimer */}
          <div className="bg-cream/40 dark:bg-dark-cream/40 border border-ink/5 dark:border-white/5 rounded-2xl p-5 flex gap-4 text-sm font-sans items-start mt-auto">
            <Info className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Architecture & Privacy Note</p>
              <p className="opacity-70 leading-relaxed mb-3">
                This tool operates entirely in your browser using dynamic JavaScript imports. When you upload a file, it only downloads the specific parsing library needed for that file type (e.g. SheetJS for Excel, mammoth for Word), keeping the page incredibly fast.
              </p>
              <p className="opacity-70 leading-relaxed">
                <strong>For PPTX and PDFs:</strong> Only raw text is extracted. Slide layouts, images, and speaker notes are not included in the Markdown output.
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
                <Code className="w-4 h-4" /> Raw
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
                onClick={handleDownload}
                disabled={!markdown}
                className="flex items-center gap-2 text-sm bg-transparent hover:bg-cream dark:hover:bg-dark-cream border border-ink/10 dark:border-white/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as .md"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button 
                onClick={handleCopy}
                disabled={!markdown}
                className="flex items-center gap-2 text-sm bg-ink dark:bg-white text-white dark:text-ink px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto bg-transparent relative custom-scrollbar">
            {!markdown && !isConverting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 text-center p-8">
                <FileText className="w-12 h-12 mb-4 opacity-50" />
                <p>Converted Markdown will appear here.</p>
              </div>
            )}
            
            {markdown && viewMode === 'raw' && (
              <textarea
                value={markdown}
                readOnly
                className="w-full h-full bg-transparent p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                spellCheck="false"
              />
            )}

            {markdown && viewMode === 'preview' && (
              <div className="p-8 prose dark:prose-invert max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <AdZone className="mx-auto rounded-xl overflow-hidden bg-transparent border-none max-w-4xl" type="banner" />
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto mt-16 font-sans">
        <h2 className="text-3xl font-medium mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">How does this tool process my files securely?</h3>
            <p className="opacity-70 leading-relaxed">Unlike other online converters that upload your files to an external server, this tool extracts the text and converts it to Markdown completely locally on your device. We use highly optimized client-side libraries designed specifically to parse each file type within your browser sandbox.</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">What file types are supported?</h3>
            <p className="opacity-70 leading-relaxed">Currently, we support Word Documents (.docx), PowerPoint Presentations (.pptx), Excel Spreadsheets (.xlsx), CSVs, HTML files, and text-based PDFs.</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 border border-ink/10 dark:border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-medium mb-2">Why isn't my PowerPoint layout preserved?</h3>
            <p className="opacity-70 leading-relaxed">Because Markdown is a structural text format, it is impossible to perfectly translate visual slide layouts (like columns, images, and precise positioning) into text. Our PPTX parser specifically extracts all the readable text nodes from your slides in order, which is ideal for porting presentation content into wikis or large language models.</p>
          </div>
        </div>
      </div>

      {/* Cross-linking to PDF Tools */}
      <div className="mt-20 border-t border-ink/10 dark:border-white/10 pt-16 font-sans">
        <h2 className="text-2xl font-medium mb-8 text-center">Related Document Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/pdf-tools/merge-pdf" className="group p-6 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-[#FCD34D]/60 transition-colors">
            <h3 className="text-xl font-medium text-ink dark:text-white mb-2 group-hover:text-[#F59E0B] transition-colors">Merge PDF</h3>
            <p className="opacity-70 text-sm">Combine multiple PDFs into a single file completely locally.</p>
          </Link>
          <Link href="/pdf-tools/compress-pdf" className="group p-6 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-[#FCD34D]/60 transition-colors">
            <h3 className="text-xl font-medium text-ink dark:text-white mb-2 group-hover:text-[#F59E0B] transition-colors">Compress PDF</h3>
            <p className="opacity-70 text-sm">Reduce PDF file size securely in your browser using WASM.</p>
          </Link>
        </div>
      </div>

    </div>
  );
}
