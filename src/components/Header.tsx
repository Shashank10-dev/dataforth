'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

import Image from 'next/image';

const categories = [
  // ...

  {
    name: 'PDF',
    href: '/pdf-tools',
    tools: [
      { name: 'Merge PDF', href: '/pdf-tools/merge-pdf' },
      { name: 'Compress PDF', href: '/pdf-tools/compress-pdf' },
    ]
  },
  {
    name: 'Image',
    href: '/image-tools',
    tools: [
      { name: 'Compress Image', href: '/image-tools/compress-image' },
      { name: 'HEIC to JPG', href: '/image-tools/convert-heic-to-jpg' },
      { name: 'Remove Background', href: '/image-tools/remove-background' },
    ]
  },
  {
    name: 'Finance',
    href: '/finance-tools',
    tools: [
      { name: 'EMI Calculator', href: '/finance-tools/emi-calculator' },
      { name: 'Salary Calculator', href: '/finance-tools/salary-calculator' },
    ]
  },
  {
    name: 'Business',
    href: '/business-tools',
    tools: [
      { name: 'GST Invoice', href: '/business-tools/gst-invoice-generator' },
      { name: 'Freelancer Invoice', href: '/business-tools/freelancer-invoice-generator' },
    ]
  },
  {
    name: 'Developer',
    href: '/developer-tools',
    tools: [
      { name: 'JSON Formatter', href: '/developer-tools/json-formatter' },
      { name: 'Regex Tester', href: '/developer-tools/regex-tester' },
      { name: 'Bulk UUID Generator', href: '/developer-tools/uuid-generator' },
    ]
  },
  {
    name: 'Career',
    href: '/career-tools',
    tools: [
      { name: 'Resume Builder', href: '/career-tools/resume-builder' },
    ]
  }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileExpand = (name: string) => {
    if (mobileExpanded === name) {
      setMobileExpanded(null);
    } else {
      setMobileExpanded(name);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/90 dark:bg-dark-cream/90 backdrop-blur-md border-b border-ink/5 dark:border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2 group z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach rounded-md">
            <Image 
              src="/dataforth-logo.png" 
              alt="Dataforth Logo" 
              width={32} 
              height={32} 
              className="group-hover:scale-105 transition-transform object-contain"
            />
            <span className="font-heading text-2xl font-bold text-ink dark:text-white tracking-tight">Dataforth</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-1 h-full items-center">
            {categories.map((category) => (
              <div 
                key={category.name}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  href={category.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-ink/80 dark:text-white/80 hover:bg-white/50 dark:hover:bg-dark-card/50 hover:text-ink dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-peach"
                  onFocus={() => handleMouseEnter(category.name)}
                  onBlur={(e) => {
                    // Only close if moving outside this dropdown container
                    if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
                      setActiveDropdown(null);
                    }
                  }}
                >
                  {category.name}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === category.name ? 'rotate-180' : ''}`} />
                </Link>

                {/* Desktop Dropdown */}
                {activeDropdown === category.name && (
                  <div className="absolute top-[calc(100%-8px)] left-0 w-64 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl shadow-xl py-2 opacity-100 transition-opacity animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 mb-1 border-b border-ink/5 dark:border-white/5">
                      <Link href={category.href} className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-white/50 hover:text-ink dark:hover:text-white focus:outline-none focus-visible:underline">
                        View all {category.name} tools &rarr;
                      </Link>
                    </div>
                    {category.tools.map((tool) => (
                      <Link 
                        key={tool.name}
                        href={tool.href}
                        className="block px-4 py-2 text-sm text-ink/80 dark:text-white/80 hover:bg-peach/10 dark:hover:bg-peach/20 hover:text-ink dark:hover:text-white transition-colors focus:outline-none focus-visible:bg-peach/10 dark:focus-visible:bg-peach/20"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link 
              href="/blog"
              className="px-3 py-2 rounded-lg text-sm font-medium text-ink/80 dark:text-white/80 hover:bg-white/50 dark:hover:bg-dark-card/50 hover:text-ink dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-peach"
            >
              Blog
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center z-50">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-ink dark:text-white opacity-80 hover:opacity-100 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach rounded-md"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Accordion) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-cream dark:bg-dark-cream border-b border-ink/10 dark:border-white/10 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
          <nav className="px-4 pt-2 pb-6 flex flex-col space-y-1">
            {categories.map((category) => (
              <div key={category.name} className="border-b border-ink/5 dark:border-white/5 last:border-0 pb-1">
                <button
                  onClick={() => toggleMobileExpand(category.name)}
                  className="w-full flex items-center justify-between py-3 text-left font-medium text-ink dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-peach rounded-md px-2"
                  aria-expanded={mobileExpanded === category.name}
                >
                  {category.name}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === category.name ? 'rotate-180 text-peach' : 'opacity-50'}`} />
                </button>
                
                {mobileExpanded === category.name && (
                  <div className="pl-4 pr-2 pb-2 space-y-1 animate-in slide-in-from-top-1 fade-in duration-200">
                    <Link 
                      href={category.href}
                      className="block py-2 text-sm text-ink/60 dark:text-white/60 font-medium hover:text-ink dark:hover:text-white focus:outline-none focus-visible:underline"
                    >
                      All {category.name} Tools
                    </Link>
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        className="block py-2 text-sm text-ink/80 dark:text-white/80 hover:text-peach dark:hover:text-peach focus:outline-none focus-visible:text-peach"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-6 pt-4 border-t border-ink/10 dark:border-white/10 flex justify-center gap-6 text-sm font-medium flex-wrap">
              <Link href="/blog" className="opacity-70 hover:opacity-100 text-peach">Blog</Link>
              <Link href="/about" className="opacity-70 hover:opacity-100">About</Link>
              <Link href="/privacy" className="opacity-70 hover:opacity-100">Privacy</Link>
              <Link href="/contact" className="opacity-70 hover:opacity-100">Contact</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
