'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface BeforeAfterSliderProps {
  originalImage: string;
  compressedImage: string;
  originalSize: string;
  compressedSize: string;
}

export default function BeforeAfterSlider({ originalImage, compressedImage, originalSize, compressedSize }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setPosition(percentage);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 1) { // Left mouse button down
      handleMove(e.clientX);
    }
  }, [handleMove]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Original</span>
          <span className="font-bold text-slate-900 dark:text-white text-lg">{originalSize}</span>
        </div>
        
        <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold animate-in fade-in zoom-in duration-300">
          - {Math.round((1 - parseFloat(compressedSize) / parseFloat(originalSize)) * 100)}%
        </div>

        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Compressed</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{compressedSize}</span>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-[400px] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 cursor-ew-resize select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          handleMove(e.clientX);
        }}
        onPointerUp={(e) => {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }}
      >
        {/* Under image (Compressed) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={compressedImage} 
          alt="Compressed" 
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Over image (Original) */}
        <div 
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ width: `${position}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={originalImage} 
            alt="Original" 
            className="absolute top-0 left-0 h-full w-[100vw] max-w-none object-contain"
            style={{ width: containerRef.current?.clientWidth || '100%' }}
          />
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
          style={{ left: `calc(${position}% - 2px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-ew-resize border border-slate-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
              <path d="M15 18l6-6-6-6" />
              <path d="M9 18l-6-6 6-6" />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-slate-500 mt-4">Drag slider to compare quality</p>
    </div>
  );
}
