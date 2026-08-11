import Link from 'next/link';

export default function ImageToolsCategory() {
  const tools = [
    { name: 'Compress Image', href: '/image-tools/compress-image', description: 'Reduce image file size with smart compression.' },
    { name: 'HEIC to JPG', href: '/image-tools/convert-heic-to-jpg', description: 'Convert Apple HEIC photos to standard JPG format.' },
    { name: 'Remove Background', href: '/image-tools/remove-background', description: 'Automatically erase the background from any photo.' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex-grow">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-powder/40 dark:bg-powder/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Image Tools</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Fast and secure image processing. Your photos never leave your device, ensuring complete privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.href} className="group p-8 bg-white/80 dark:bg-dark-card/80 border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-powder/60 transition-colors">
            <h3 className="text-xl font-medium text-ink dark:text-white mb-2 group-hover:text-powder transition-colors">{tool.name}</h3>
            <p className="opacity-70 font-sans leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
