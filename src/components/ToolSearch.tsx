'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronRight, FileUp, ImageIcon, Briefcase, Code, FileText, LayoutTemplate, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categories, ToolItem, CategoryItem } from '@/config/categories';

export default function ToolSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle global "/" shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Flat list of all tools with their parent category info
  const allTools = useMemo(() => {
    return categories.flatMap(cat => 
      cat.tools.map(tool => ({ ...tool, categoryName: cat.name, categoryIcon: cat.icon, categoryColor: cat.color }))
    );
  }, []);

  // Fuzzy matching function
  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    
    return allTools.filter(tool => {
      // Direct matches
      if (tool.name.toLowerCase().includes(q)) return true;
      if (tool.description.toLowerCase().includes(q)) return true;
      if (tool.categoryName.toLowerCase().includes(q)) return true;
      
      // Keyword/synonym matches
      if (tool.keywords.some(kw => kw.toLowerCase().includes(q))) return true;
      
      // Fuzzy substring matching (e.g. "compres" matches "compress")
      // Simple normalized match - strip spaces and non-alphanumeric
      const normalizedQuery = q.replace(/[^a-z0-9]/g, '');
      const normalizedName = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedKeywords = tool.keywords.map(kw => kw.toLowerCase().replace(/[^a-z0-9]/g, '')).join(' ');
      
      if (normalizedName.includes(normalizedQuery)) return true;
      if (normalizedKeywords.includes(normalizedQuery)) return true;

      return false;
    });
  }, [query, allTools]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredTools.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools.length > 0 && filteredTools[selectedIndex]) {
        router.push(filteredTools[selectedIndex].href);
        setIsOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-ink/40 dark:text-white/40" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a tool... (Press '/' to focus)"
          className="w-full pl-12 pr-10 py-4 bg-white dark:bg-dark-card border-2 border-ink/10 dark:border-white/10 rounded-2xl focus:outline-none focus:border-[#FCD34D] dark:focus:border-[#FCD34D] focus:ring-4 focus:ring-[#FCD34D]/20 transition-all font-sans text-lg shadow-sm placeholder:text-ink/30 dark:placeholder:text-white/30"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-listbox"
          role="combobox"
        />
        {query && (
          <button 
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 p-1 rounded-md text-ink/40 hover:text-ink dark:text-white/40 dark:hover:text-white hover:bg-ink/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && query.trim() !== '' && (
        <div 
          ref={dropdownRef}
          id="search-listbox"
          role="listbox"
          className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden max-h-[70vh] flex flex-col font-sans"
        >
          {filteredTools.length > 0 ? (
            <div className="overflow-y-auto py-2 custom-scrollbar">
              {filteredTools.map((tool, index) => {
                const isSelected = index === selectedIndex;
                const Icon = tool.categoryIcon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex items-center px-4 py-3 mx-2 rounded-xl transition-colors ${
                      isSelected ? 'bg-cream dark:bg-dark-cream' : 'hover:bg-ink/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tool.categoryColor} opacity-90`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-grow min-w-0">
                      <h4 className="font-medium text-ink dark:text-white truncate">{tool.name}</h4>
                      <p className="text-sm opacity-60 truncate">{tool.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 ml-2 flex-shrink-0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-lg font-medium mb-1">No tools found for "{query}"</p>
                <p className="opacity-70 text-sm">Try a different keyword, or browse all categories below.</p>
              </div>
              <div className="border-t border-ink/5 dark:border-white/5 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-3 px-2">Browse Categories</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map(cat => {
                    const CatIcon = cat.icon;
                    return (
                      <Link 
                        key={cat.href} 
                        href={cat.href}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-cream dark:hover:bg-dark-cream transition-colors text-sm font-medium"
                      >
                        <CatIcon className="w-4 h-4 opacity-70" />
                        {cat.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
