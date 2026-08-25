'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { categories } from '@/config/categories';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  // Find current category and tool based on pathname
  let currentCategory = null;
  let currentTool = null;

  for (const cat of categories) {
    if (pathname.startsWith(cat.href)) {
      currentCategory = cat;
      const tool = cat.tools.find(t => t.href === pathname);
      if (tool) currentTool = tool;
      break;
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm font-sans text-ink/60 dark:text-white/60">
        <li>
          <Link href="/" className="hover:text-ink dark:hover:text-white transition-colors flex items-center">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {currentCategory && (
          <>
            <li>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </li>
            <li>
              <Link href={currentCategory.href} className="hover:text-ink dark:hover:text-white transition-colors">
                {currentCategory.title}
              </Link>
            </li>
          </>
        )}
        
        {currentTool && (
          <>
            <li>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </li>
            <li>
              <span className="font-medium text-ink dark:text-white" aria-current="page">
                {currentTool.name}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
