'use client';

import { useState, useEffect } from 'react';

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Basic check if consent was already given
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
    // Here we would typically initialize Google Consent Mode updates
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. 
          We also share information about your use of our site with our social media, advertising and analytics partners.
        </p>
        <div className="flex gap-4 shrink-0">
          <button 
            onClick={() => setShow(false)} 
            className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium"
            aria-label="Close"
          >
            Decline Optional
          </button>
          <button 
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
