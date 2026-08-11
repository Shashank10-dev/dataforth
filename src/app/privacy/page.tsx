export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl flex-grow">
      <div className="mb-16 relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-32 bg-sage/30 dark:bg-sage/10 blob-shape -z-10 blur-2xl"></div>
        <h1 className="text-5xl font-medium mb-4 text-ink dark:text-white">Privacy Policy</h1>
        <p className="text-lg opacity-60 font-sans">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-8 font-sans text-ink/80 dark:text-white/80 leading-relaxed text-lg">
        
        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">1. Client-Side Processing Guarantee</h2>
        <p>
          At Dataforth, your privacy and data security are our highest priority. All file processing 
          (including PDF merging, compression, image conversion, and background removal) occurs 
          <strong className="text-ink dark:text-white font-medium"> entirely within your web browser</strong>. Your files are never uploaded to our servers, 
          stored in any database, or accessed by us in any way.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">2. Data Collection and Usage</h2>
        <p>
          While we do not collect or process your files, we use Google Analytics 4 (GA4) to understand how 
          our tools are used and to improve the user experience. This analytics data is anonymized and aggregated.
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">3. Advertising and Cookies</h2>
        <p>
          We use Google AdSense to display advertisements on our site, which helps keep our tools free. 
          Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our 
          website or other websites. Google's use of advertising cookies enables it and its partners to serve 
          ads based on your browsing history. 
        </p>
        <p>
          You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-lavender hover:underline">Ads Settings</a>.
          If you are in the EU/UK, we ask for your explicit consent for these cookies via our Consent Banner (Google Consent Mode v2).
        </p>

        <h2 className="text-3xl font-medium text-ink dark:text-white mt-12 mb-6 font-heading">4. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please visit our <a href="/contact" className="text-lavender hover:underline">Contact Page</a>.
        </p>
      </div>
    </div>
  );
}
