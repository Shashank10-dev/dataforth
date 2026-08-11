import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsentBanner from "@/components/ConsentBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Dataforth - Free File Processing Tools",
  description: "Dataforth provides free, fast, and privacy-friendly file processing tools. Convert, compress, and merge files directly in your browser without uploading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied'
              });
            `
          }}
        />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} font-sans min-h-screen flex flex-col bg-[#FFFDF9] text-[#2A2626] dark:bg-[#1A1515] dark:text-[#F5EBEB] selection:bg-[#E0D4FF] dark:selection:bg-[#E0D4FF] dark:selection:text-[#2A2626]`}>
        <Header />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
