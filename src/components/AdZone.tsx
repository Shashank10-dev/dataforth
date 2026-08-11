'use client';

import { useEffect, useState } from 'react';

export default function AdZone({ className = "", type = "banner" }: { className?: string, type?: "banner" | "sidebar" | "in-content" }) {
  const [isMounted, setIsMounted] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  const heightClass = type === 'banner' ? 'h-24' : type === 'sidebar' ? 'h-[600px]' : 'h-64';
  const widthClass = type === 'sidebar' ? 'w-[300px]' : 'w-full';

  useEffect(() => {
    setIsMounted(true);
    if (!clientId) return;
    
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense push error:', err);
    }
  }, [clientId]);

  // Fallback placeholder during SSR or in dev/missing-ID environments
  if (!isMounted || !clientId || process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center ${heightClass} ${widthClass} ${className}`}>
        <span className="text-gray-500 text-sm">Ad Zone ({type})</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden flex justify-center ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', width: '100%', minHeight: type === 'banner' ? '90px' : type === 'sidebar' ? '600px' : '250px' }}
        data-ad-client={clientId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
