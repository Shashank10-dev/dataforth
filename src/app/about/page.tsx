export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl flex-grow">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-powder/30 dark:bg-powder/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4 text-ink dark:text-white">About Dataforth</h1>
      </div>
      
      <div className="space-y-8 font-sans text-ink/80 dark:text-white/80 leading-relaxed text-lg">
        <p className="text-2xl text-ink dark:text-white font-medium mb-12 text-center">
          Dataforth was built with one core philosophy: powerful file processing tools shouldn't compromise your privacy or cost you money.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">Why Client-Side?</h2>
        <p>
          Most free online tools force you to upload your sensitive documents (like bank statements, tax forms, or personal photos) to unknown servers where they are processed, stored, and potentially compromised. 
        </p>
        <p>
          We leverage modern WebAssembly (WASM) and browser technologies to do all the heavy lifting directly on your device. Whether you are merging a PDF or removing a background, your files never leave your computer. This means:
        </p>
        
        <ul className="list-disc pl-6 space-y-4 my-8">
          <li><strong className="text-ink dark:text-white font-medium">Zero Uploads:</strong> No waiting for large files to upload.</li>
          <li><strong className="text-ink dark:text-white font-medium">Total Privacy:</strong> Nobody but you ever sees your files.</li>
          <li><strong className="text-ink dark:text-white font-medium">No Limits:</strong> Process as many files as you want, subject only to your browser's capabilities.</li>
        </ul>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">Our Roadmap</h2>
        <p>
          We are currently in Phase 1, focusing on core PDF and Image tools. In the future, we plan to expand into Finance, Developer, and Business utilities. All our tools will remain free to use, supported by unobtrusive advertisements.
        </p>
      </div>
    </div>
  );
}
