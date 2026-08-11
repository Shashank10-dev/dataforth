import React from 'react';
import Image from 'next/image';

export default function AuthorBio() {
  return (
    <div className="mt-16 pt-8 border-t border-ink/10 dark:border-white/10 flex items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-peach/20 flex items-center justify-center shrink-0 border border-peach/30 overflow-hidden relative">
        <Image 
          src="/dataforth-logo.png" 
          alt="Dataforth Logo" 
          width={32} 
          height={32} 
          className="object-contain opacity-80"
        />
      </div>
      <div>
        <h4 className="font-heading font-bold text-lg mb-1 text-ink dark:text-white">The Dataforth Team</h4>
        <p className="text-sm opacity-70 leading-relaxed font-sans max-w-md">
          We build free, fast, and privacy-first utilities for the web. Our tools process everything locally on your device, ensuring your sensitive data never touches a cloud server.
        </p>
      </div>
    </div>
  );
}
