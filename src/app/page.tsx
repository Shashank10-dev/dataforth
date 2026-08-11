import Link from "next/link";
import { FileUp, Image as ImageIcon, Briefcase, Code, FileText, ChevronRight } from "lucide-react";
import AdZone from "@/components/AdZone";

const categories = [
  {
    title: "PDF Tools",
    description: "Merge, compress, and convert PDF documents securely.",
    icon: FileUp,
    href: "/pdf-tools",
    color: "bg-lavender text-ink"
  },
  {
    title: "Image Tools",
    description: "Remove backgrounds, convert formats, and compress photos.",
    icon: ImageIcon,
    href: "/image-tools",
    color: "bg-peach text-ink"
  },
  {
    title: "Finance Calculators",
    description: "Calculate loans, ROI, and plan your budget easily.",
    icon: FileText,
    href: "/finance-tools",
    color: "bg-sage text-ink"
  },
  {
    title: "Business Generators",
    description: "Generate invoices, signatures, and essential business docs.",
    icon: Briefcase,
    href: "/business-tools",
    color: "bg-powder text-ink"
  },
  {
    title: "Developer Utilities",
    description: "Format JSON, encode Base64, and quickly hash strings.",
    icon: Code,
    href: "/developer-tools",
    color: "bg-[#F3E8E0] text-ink"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] max-w-[80vw] max-h-[80vw] bg-lavender/40 dark:bg-lavender/10 blob-shape -z-10 blur-3xl opacity-60"></div>
      <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] max-w-[90vw] max-h-[90vw] bg-peach/40 dark:bg-peach/10 blob-shape -z-10 blur-3xl opacity-60"></div>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center relative">
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
        <p className="mt-8 text-xl max-w-2xl mx-auto mb-12 leading-relaxed opacity-80 font-sans">
          An artisanal collection of utilities. Compress PDFs, convert images, and remove backgrounds right in your browser. 
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/pdf-tools/compress-pdf" className="bg-ink dark:bg-white text-white dark:text-ink px-8 py-4 rounded-full font-medium transition-transform duration-150 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
            Compress PDF
          </Link>
          <Link href="/image-tools/remove-background" className="bg-white dark:bg-dark-card text-ink dark:text-dark-text border border-ink/10 dark:border-white/10 px-8 py-4 rounded-full font-medium transition-transform duration-150 hover:-translate-y-1 shadow-sm hover:shadow-md">
            Remove Background
          </Link>
        </div>
      </section>

      {/* Ad Zone - Top */}
      <div className="max-w-7xl mx-auto w-full px-4 mb-20 relative z-10">
        <div className="p-1 border border-ink/5 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-2xl max-w-4xl mx-auto">
          <AdZone type="banner" className="mx-auto rounded-xl overflow-hidden bg-transparent border-none" />
        </div>
      </div>

      {/* Categories Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-32">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-4xl font-medium">The Toolkit</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link 
                key={category.title} 
                href={category.href}
                className="group flex flex-col p-8 bg-white dark:bg-dark-card border border-ink/10 dark:border-white/10 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all duration-150 ease-out"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 ${category.color} transition-transform duration-150 group-hover:scale-105 group-hover:rotate-3`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-medium mb-3 group-hover:text-ink/70 dark:group-hover:text-white/70 transition-colors">
                  {category.title}
                </h3>
                <p className="opacity-70 flex-grow mb-8 leading-relaxed font-sans">
                  {category.description}
                </p>
                <div className="flex items-center text-sm font-medium mt-auto group-hover:opacity-70 transition-opacity">
                  Open tool
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
