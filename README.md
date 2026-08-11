# Dataforth

Dataforth is a fast, free, and privacy-first suite of file processing tools and calculators. Every tool processes completely client-side in the browser using WebAssembly and modern web APIs—meaning no files are ever uploaded, and privacy is mathematically guaranteed.

## Tech Stack
- **Framework:** Next.js 16.3 (App Router)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **File Processing:** `pdf-lib` (PDFs), `@imgly/background-removal` (Images), `browser-image-compression`, `heic2any`

## Local Development

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by copying the example file:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Building for Production
To test the production build locally:
```bash
npm run build
npm run start
```

## Environment Variables
Refer to `.env.example` for the required environment variables. Never commit real keys (like your Google Analytics Measurement ID or AdSense Client ID) to version control.

## Deployment
This project is optimized for deployment on Vercel. 
Simply import the repository into your Vercel dashboard and it will automatically detect the Next.js framework and configure the build settings.

## License
Proprietary. All Rights Reserved.
