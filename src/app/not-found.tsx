import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-peach/30 dark:bg-peach/10 blob-shape -z-10 blur-3xl opacity-60 pointer-events-none"></div>
      
      <div className="bg-ink/5 dark:bg-white/5 text-ink dark:text-white p-4 rounded-full mb-8 animate-bounce shadow-sm">
        <Search className="w-8 h-8" />
      </div>
      
      <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-4 text-ink dark:text-white">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-medium mb-6 text-ink/80 dark:text-white/80">
        Page Not Found
      </h2>
      
      <p className="text-lg opacity-70 max-w-md mx-auto font-sans mb-10 leading-relaxed">
        The tool or page you're looking for seems to have moved or doesn't exist. Let's get you back on track.
      </p>
      
      <Link 
        href="/" 
        className="bg-ink dark:bg-white text-white dark:text-ink px-8 py-4 rounded-full font-medium transition-transform duration-150 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
      >
        Back to Home
      </Link>
    </div>
  );
}
