import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AdZone from "@/components/AdZone";
import ToolSearch from "@/components/ToolSearch";
import { categories } from '@/config/categories';

export default function Home() {
  // Sort categories deliberately for the "All Tools" section
  // High demand: PDF, Image, Career. Then Document, Business, Finance, Developer, WalkMe.
  const orderedCategoryNames = [
    'PDF', 'Image', 'Career', 'Document', 'Business', 'Finance', 'Developer', 'WalkMe'
  ];
  
  const sortedCategories = [...categories].sort((a, b) => {
    return orderedCategoryNames.indexOf(a.name) - orderedCategoryNames.indexOf(b.name);
  });

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] max-w-[80vw] max-h-[80vw] bg-lavender/40 dark:bg-lavender/10 blob-shape -z-10 blur-3xl opacity-60"></div>
      <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] max-w-[90vw] max-h-[90vw] bg-peach/40 dark:bg-peach/10 blob-shape -z-10 blur-3xl opacity-60"></div>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center relative z-20">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-ink/10 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm text-sm font-medium">
          ✨ 100% Client-Side Processing. No uploads.
        </div>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Fast, Free, & <span className="italic text-ink dark:text-white relative">
            Private
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-lavender -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
            </svg>
          </span> File Tools.
        </h1>
        <p className="mt-6 text-xl max-w-2xl mx-auto mb-10 leading-relaxed opacity-80 font-sans">
          An artisanal collection of utilities. Everything runs in your browser, nothing is uploaded.
        </p>
        
        {/* Search Component */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <ToolSearch />
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm font-sans">
          <span className="opacity-70">Popular:</span>
          <Link href="/pdf-tools/compress-pdf" className="hover:text-ink hover:underline dark:text-white/70 dark:hover:text-white transition-colors">Compress PDF</Link>
          <span className="opacity-30">•</span>
          <Link href="/image-tools/remove-background" className="hover:text-ink hover:underline dark:text-white/70 dark:hover:text-white transition-colors">Remove Background</Link>
          <span className="opacity-30">•</span>
          <Link href="/career-tools/resume-builder" className="hover:text-ink hover:underline dark:text-white/70 dark:hover:text-white transition-colors">Resume Builder</Link>
        </div>
      </section>

      {/* All Tools Direct Access */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16 relative z-10 pt-4">
        <div className="mb-12 border-b border-ink/10 dark:border-white/10 pb-4">
          <h2 className="text-3xl font-medium">All Tools</h2>
          <p className="opacity-70 font-sans mt-2">Jump straight to any tool in one click.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12">
          {sortedCategories.map(category => {
            const Icon = category.icon;
            return (
              <div key={category.name} className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color} opacity-90`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-lg">{category.title}</h3>
                </div>
                <ul className="space-y-3 font-sans">
                  {category.tools.map(tool => (
                    <li key={tool.name}>
                      <Link 
                        href={tool.href}
                        className="group flex flex-col p-3 -ml-3 rounded-xl hover:bg-cream dark:hover:bg-dark-cream transition-colors"
                      >
                        <span className="font-medium text-ink dark:text-white group-hover:text-ink/80 dark:group-hover:text-white/80 transition-colors">
                          {tool.name}
                        </span>
                        <span className="text-sm opacity-60 leading-snug mt-1">
                          {tool.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ad Zone - Mid */}
      <div className="max-w-7xl mx-auto w-full px-4 mb-20 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone type="banner" className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" />
        </div>
      </div>

      {/* Categories Grid (Discovery) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-32 relative z-10">
        <div className="mb-12 border-b border-ink/10 dark:border-white/10 pb-4">
          <h2 className="text-3xl font-medium">Browse by Category</h2>
          <p className="opacity-70 font-sans mt-2">Explore tool collections and directories.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link 
                key={category.title} 
                href={category.href}
                className="group flex items-center gap-4 p-4 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-2xl hover:border-ink/30 dark:hover:border-white/30 hover:shadow-sm transition-all duration-150"
              >
                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${category.color} transition-transform duration-150 group-hover:scale-105 group-hover:-rotate-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-ink/70 dark:group-hover:text-white/70 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs opacity-60 font-sans mt-0.5">{category.tools.length} tools</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ad Zone - Bottom */}
      <div className="max-w-7xl mx-auto w-full px-4 pb-24 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone type="banner" className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" />
        </div>
      </div>
    </div>
  );
}
