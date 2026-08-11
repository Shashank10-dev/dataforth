import Link from 'next/link';

export default function DeveloperToolsCategory() {
  const tools = [
    { name: 'JSON Formatter', href: '/developer-tools/json-formatter', description: 'Format, validate, and minify JSON data instantly.' },
    { name: 'Regex Tester', href: '/developer-tools/regex-tester', description: 'Test and debug Regular Expressions with real-time highlighting.' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex-grow">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#93C5FD]/40 dark:bg-[#93C5FD]/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4">Developer Tools</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto font-sans">
          Fast, client-side utilities for developers. No data leaves your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.href} className="group p-8 bg-white/80 dark:bg-dark-card/80 border border-ink/10 dark:border-white/10 rounded-[2rem] hover:border-[#93C5FD]/60 transition-colors">
            <h3 className="text-2xl font-medium text-ink dark:text-white mb-2 group-hover:text-[#93C5FD] transition-colors">{tool.name}</h3>
            <p className="opacity-70 font-sans leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
