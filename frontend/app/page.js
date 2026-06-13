'use client';
import React from 'react';
import { FileText, Sparkles, Shield, Zap, Infinity, ArrowRight, CheckCircle2 } from 'lucide-react';
import ToolCard from '../components/ToolCard';

const tools = [
  { id: 'merge', title: 'Merge PDF', desc: 'Combine multiple PDFs into one seamless document', icon: 'merge' },
  { id: 'split', title: 'Split PDF', desc: 'Split a PDF into separate pages in seconds', icon: 'split' },
  { id: 'compress', title: 'Compress PDF', desc: 'Reduce PDF file size while keeping quality', icon: 'compress' },
  { id: 'rotate', title: 'Rotate PDF', desc: 'Rotate pages in your PDF to the right angle', icon: 'rotate' },
  { id: 'watermark', title: 'Add Watermark', desc: 'Add text watermarks to protect your PDF pages', icon: 'watermark' },
  { id: 'page-numbers', title: 'Page Numbers', desc: 'Add page numbers to your PDF document', icon: 'page-numbers' },
  { id: 'jpg-to-pdf', title: 'JPG to PDF', desc: 'Convert your images into a PDF document', icon: 'jpg-to-pdf' },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', desc: 'Convert PDF pages to high-quality images', icon: 'pdf-to-jpg' },
];

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Process your PDFs in seconds with our optimized engine' },
  { icon: Shield, title: '100% Private', desc: 'Files are processed securely and deleted automatically' },
  { icon: Infinity, title: 'No Limits', desc: 'No file size caps, no sign-up required, use as much as you want' },
];

const stats = [
  { value: '100%', label: 'Free' },
  { value: 'No', label: 'Sign-up Required' },
  { value: 'Unlimited', label: 'File Size' },
  { value: 'Auto', label: 'File Deletion' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section - Linear/Vercel inspired */}
      <section className="relative overflow-hidden pb-8 sm:pb-12">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.02] blur-3xl" />
        </div>

        <div className="relative text-center py-12 sm:py-16 lg:py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 animate-fade-in border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Free &bull; No sign-up &bull; Unlimited
          </div>

          {/* Logo icon with float animation */}
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-500 text-white shadow-xl shadow-primary/20 animate-fade-in animate-float">
            <FileText className="w-8 h-8" />
          </div>


          {/* Heading - Linear style */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 animate-fade-in-up leading-[1.1]">
            <span className="text-slate-900 dark:text-white">All-in-One</span>
            <br />
            <span className="text-gradient">PDF Toolkit</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Merge, split, compress, rotate, and convert PDFs — all for free, right in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="#tools"
              className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 text-base"
            >
              <Zap className="w-4 h-4" />
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
            >
              Learn More
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 dark:text-slate-500 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              No registration
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Secure processing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Auto file deletion
            </span>
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Choose a Tool
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Select from our range of powerful PDF utilities below
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {tools.map((tool, i) => (
            <div key={tool.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ToolCard {...tool} />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-24 mt-20 sm:mt-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Why PDF Tools?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Everything you need, nothing you don't
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats / Trust Bar - Vercel inspired */}
      <section className="mt-20 sm:mt-28 pb-8">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background with subtle grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-indigo-50/50 to-transparent dark:from-primary/10 dark:via-indigo-950/20 dark:to-transparent" />
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative border border-primary/10 dark:border-primary/20 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by thousands of users worldwide
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8">
              All processing happens securely in the cloud. Your files are automatically deleted after processing.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

