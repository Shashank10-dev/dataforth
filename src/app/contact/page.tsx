'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent double submission
    if (status === 'submitting') return;
    
    setStatus('submitting');
    setErrorMessage('');
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const botcheck = formData.get('botcheck') as string;
    
    // Client-side validation
    if (!name.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('Name and Message are required.');
      return;
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    // Honeypot check for bots
    if (botcheck) {
      // Silently discard spam without throwing an error to the bot
      setStatus('success');
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      setStatus('error');
      setErrorMessage('Configuration error: Access Key is missing. If testing locally, please restart your Next.js dev server. On Vercel, ensure the variable is applied to this deployment environment.');
      return;
    }

    // Web3Forms payload
    formData.append("access_key", accessKey);
    formData.append("subject", `New message from ${name} on Dataforth`);
    formData.append("from_name", "Dataforth Contact Form");
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
      } else {
        console.error("Web3Forms error:", data);
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

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

      <div className="bg-white/80 dark:bg-dark-card/80 border border-ink/10 dark:border-white/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
        
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-ink dark:text-white mb-3">Message Sent!</h2>
            <p className="text-ink/70 dark:text-white/70">
              Thanks for reaching out. We've received your message and will get back to you as soon as possible.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-8 text-sm font-medium text-lavender hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="space-y-6 font-sans" onSubmit={handleSubmit}>
            
            {/* Honeypot Spam Protection */}
            <input 
              type="checkbox" 
              name="botcheck" 
              className="hidden" 
              style={{ display: 'none' }} 
              tabIndex={-1} 
              aria-hidden="true" 
            />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink/80 dark:text-white/80 mb-2">Name</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                required
                disabled={status === 'submitting'}
                className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-peach/50 transition-shadow disabled:opacity-50" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink/80 dark:text-white/80 mb-2">Email (optional)</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                disabled={status === 'submitting'}
                className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-peach/50 transition-shadow disabled:opacity-50" 
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-ink/80 dark:text-white/80 mb-2">Message</label>
              <textarea 
                id="message" 
                name="message"
                rows={5} 
                required
                disabled={status === 'submitting'}
                className="w-full bg-cream dark:bg-dark-cream border border-ink/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-peach/50 transition-shadow resize-none disabled:opacity-50"
              ></textarea>
            </div>
            
            {status === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center bg-ink dark:bg-white text-white dark:text-ink font-medium py-4 px-6 rounded-full transition-transform duration-150 text-lg hover:-translate-y-0.5 shadow-md mt-4 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
