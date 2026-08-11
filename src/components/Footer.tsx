import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-ink/10 dark:border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <Image 
                src="/dataforth-logo.png" 
                alt="Dataforth Logo" 
                width={24} 
                height={24} 
                className="object-contain"
              />
              <span className="font-heading text-xl font-bold text-ink dark:text-white tracking-tight">Dataforth</span>
            </Link>
            <p className="text-ink/60 dark:text-white/60 text-sm mb-6 leading-relaxed font-sans">
              Free, fast, and completely private file utilities. Everything processes on your device.
            </p>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold text-ink dark:text-white mb-6">Tools</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/pdf-tools" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">PDF Tools</Link></li>
              <li><Link href="/image-tools" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">Image Tools</Link></li>
              <li><Link href="/finance-tools" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">Finance Calculators</Link></li>
              <li><Link href="/developer-tools" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">Developer Utilities</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold text-ink dark:text-white mb-6">Legal</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/privacy" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-ink dark:text-white mb-6">Company</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/about" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ink/10 dark:border-white/10 mt-16 pt-8 text-center text-ink/40 dark:text-white/40 text-sm font-sans">
          <p>&copy; {new Date().getFullYear()} Dataforth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
