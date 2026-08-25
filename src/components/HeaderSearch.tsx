'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import ToolSearch from './ToolSearch';

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      // Let ToolSearch handle '/' since it focuses its own input, but if we want '/' to open the modal:
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-ink dark:text-white opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach rounded-md transition-opacity"
        aria-label="Search tools"
        title="Search tools (/)"
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-ink/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-ink/10 dark:border-white/10 animate-in slide-in-from-top-4 duration-300">
        <div className="p-4 border-b border-ink/5 dark:border-white/5 flex items-center justify-between bg-cream/30 dark:bg-dark-cream/30">
          <span className="font-medium text-sm text-ink/70 dark:text-white/70">Quick Search</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-ink/5 dark:hover:bg-white/5 text-ink/50 hover:text-ink dark:text-white/50 dark:hover:text-white transition-colors focus:outline-none"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          <ToolSearch />
        </div>
      </div>
    </div>
  );
}
