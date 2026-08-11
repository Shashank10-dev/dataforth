export default function AdZone({ className = "", type = "banner" }: { className?: string, type?: "banner" | "sidebar" | "in-content" }) {
  // Placeholder for Google AdSense
  // In production, this would render an <ins class="adsbygoogle" ... /> tag
  
  const heightClass = type === 'banner' ? 'h-24' : type === 'sidebar' ? 'h-[600px]' : 'h-64';
  const widthClass = type === 'sidebar' ? 'w-[300px]' : 'w-full';

  return (
    <div className={`bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center ${heightClass} ${widthClass} ${className}`}>
      <span className="text-gray-500 text-sm">Ad Zone ({type})</span>
    </div>
  );
}
