'use client';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl flex-grow">
      <div className="mb-12 relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-peach/30 dark:bg-peach/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-6 text-ink dark:text-white">Contact Us</h1>
        <p className="text-lg text-ink/70 dark:text-white/70 font-sans max-w-lg mx-auto">
          Have a question, feature request, or found a bug? We'd love to hear from you. 
          Since we don't require accounts, this form is the best way to get in touch.
        </p>
      </div>

      <div className="bg-white/80 dark:bg-dark-card/80 border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 md:p-12">
        <form className="space-y-6 font-sans" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink/80 dark:text-white/80 mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-peach/50 transition-shadow" 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink/80 dark:text-white/80 mb-2">Email (optional)</label>
            <input 
              type="email" 
              id="email" 
              className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-peach/50 transition-shadow" 
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink/80 dark:text-white/80 mb-2">Message</label>
            <textarea 
              id="message" 
              rows={5} 
              className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-peach/50 transition-shadow resize-none"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 shadow-md mt-4"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
