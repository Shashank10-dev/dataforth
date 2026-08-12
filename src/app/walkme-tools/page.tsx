import Link from 'next/link';

export default function WalkMeToolsCategory() {
  const tools = [
    { name: 'Selector Robustness Analyzer', href: '/walkme-tools/selector-analyzer', description: 'Analyze HTML to find the most stable WalkMe CSS selector for a target element.' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex-grow">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#A7F3D0]/40 dark:bg-[#A7F3D0]/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">WalkMe Builder Tools</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Technical utilities designed specifically for WalkMe consultants and builders. Completely private, client-side processing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.href} className="group p-8 bg-white/80 dark:bg-dark-card/80 border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-[#A7F3D0]/60 transition-colors">
            <h3 className="text-2xl font-medium text-ink dark:text-white mb-2 group-hover:text-[#34D399] transition-colors">{tool.name}</h3>
            <p className="opacity-70 font-sans leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
