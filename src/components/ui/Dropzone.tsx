'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, RefreshCw } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  acceptedFileTypes: string; // e.g. ".pdf,.docx"
  acceptedFileDesc?: string; // e.g. "Supports .pdf and .docx"
  maxSizeMB?: number;
  processingText?: string;
  currentFile?: File | null;
  onReset?: () => void;
}

export default function Dropzone({ 
  onFileSelect, 
  isProcessing, 
  acceptedFileTypes, 
  acceptedFileDesc,
  maxSizeMB = 5,
  processingText = "Processing locally...",
  currentFile,
  onReset
}: DropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-colors bg-white dark:bg-dark-card ${
        isDragOver ? 'border-[#FCD34D] bg-[#FCD34D]/5 dark:bg-[#FCD34D]/5' : 
        currentFile ? 'border-[#FCD34D] bg-[#FCD34D]/5 dark:bg-[#FCD34D]/5' : 
        'border-ink/20 dark:border-white/20 hover:border-[#FCD34D]/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label="File Upload Dropzone"
      aria-live="polite" // Important for Priority 6 A11y (screen reader announces state changes)
    >
      {isProcessing ? (
        <div className="flex flex-col items-center">
          <RefreshCw className="w-12 h-12 text-[#F59E0B] animate-spin mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium mb-2">{processingText}</h3>
          <p className="opacity-70 text-sm text-center">Please do not close this tab.</p>
        </div>
      ) : currentFile ? (
        <div className="flex flex-col items-center">
          <FileText className="w-12 h-12 text-[#F59E0B] mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium mb-2 break-all text-center">{currentFile.name}</h3>
          <p className="opacity-70 text-sm mb-6">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
          {onReset && (
            <button 
              onClick={onReset}
              className="px-4 py-2 text-sm border border-ink/20 dark:border-white/20 rounded-lg hover:bg-cream dark:hover:bg-dark-cream transition-colors"
            >
              Upload Different File
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <UploadCloud className="w-12 h-12 text-[#FCD34D] mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium mb-2">Drop your file here</h3>
          <p className="opacity-70 text-sm mb-6 max-w-[250px]">
            {acceptedFileDesc || `Supports ${acceptedFileTypes.replace(/,/g, ', ')} (Max ${maxSizeMB}MB)`}
          </p>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            accept={acceptedFileTypes}
            aria-label="Upload file"
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
  );
}
