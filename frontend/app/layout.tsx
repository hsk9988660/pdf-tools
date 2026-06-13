import React from 'react';
import { FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from '../components/ui/sonner';
import './globals.css';

export const metadata = {
  title: 'PDF Tools - Free Online PDF Utilities | Merge, Split, Compress & More',
  description: 'Free online PDF tools to merge, split, compress, rotate, add watermarks, page numbers, and convert PDFs. No sign-up required, no file size limits.',
  keywords: 'PDF tools, merge PDF, split PDF, compress PDF, rotate PDF, PDF to JPG, JPG to PDF, free PDF utilities',
  openGraph: {
    title: 'PDF Tools - Free Online PDF Utilities',
    description: 'Merge, split, compress, rotate, and convert PDFs online. Free, no sign-up required.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
