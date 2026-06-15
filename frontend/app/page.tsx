'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Crown,
  FileArchive,
  FileCheck2,
  FileText,
  Gauge,
  Infinity,
  Mail,
  RotateCw,
  Shield,
  Sparkles,
  Stamp,
  UploadCloud,
  Wand2,
  Zap,
} from 'lucide-react';
import ToolCard from '../components/ToolCard';

interface Tool {
  id: string;
  title: string;
  desc: string;
  icon: string;
  status?: 'live' | 'soon';
}

const liveTools: Tool[] = [
  { id: 'merge', title: 'Merge PDF', desc: 'Combine multiple PDFs into one clean document.', icon: 'merge' },
  { id: 'split', title: 'Split PDF', desc: 'Extract each page into its own PDF file.', icon: 'split' },
  { id: 'compress', title: 'Compress PDF', desc: 'Reduce file size while preserving readability.', icon: 'compress' },
  { id: 'rotate', title: 'Rotate PDF', desc: 'Turn every page to the right orientation.', icon: 'rotate' },
  { id: 'watermark', title: 'Add Watermark', desc: 'Apply text watermarks across PDF pages.', icon: 'watermark' },
  { id: 'page-numbers', title: 'Page Numbers', desc: 'Add page numbers in common positions.', icon: 'page-numbers' },
  { id: 'jpg-to-pdf', title: 'JPG to PDF', desc: 'Turn images into a shareable PDF.', icon: 'jpg-to-pdf' },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', desc: 'Export PDF pages as image files.', icon: 'pdf-to-jpg' },
];

const upcomingTools: Tool[] = [
  { id: 'unlock-pdf', title: 'Unlock PDF', desc: 'Remove passwords from files you own.', icon: 'unlock', status: 'soon' },
  { id: 'protect-pdf', title: 'Protect PDF', desc: 'Add password protection before sharing.', icon: 'protect', status: 'soon' },
  { id: 'sign-pdf', title: 'Sign PDF', desc: 'Place signatures and initials quickly.', icon: 'sign', status: 'soon' },
  { id: 'ocr-pdf', title: 'OCR PDF', desc: 'Make scanned documents searchable.', icon: 'ocr', status: 'soon' },
  { id: 'organize-pdf', title: 'Organize PDF', desc: 'Reorder, remove, and duplicate pages.', icon: 'organize', status: 'soon' },
  { id: 'pdf-to-word', title: 'PDF to Word', desc: 'Convert PDFs into editable documents.', icon: 'word', status: 'soon' },
];

const stats = [
  { value: '8', label: 'Live tools' },
  { value: '6', label: 'More planned' },
  { value: '100MB', label: 'Per upload' },
  { value: 'Auto', label: 'Cleanup' },
];

const workflow = [
  { icon: UploadCloud, title: 'Upload', desc: 'Drop in a PDF or image and choose the tool.' },
  { icon: Wand2, title: 'Process', desc: 'The backend handles conversion and records progress.' },
  { icon: FileCheck2, title: 'Download', desc: 'Grab the finished file from a secure link.' },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    desc: 'For quick personal PDF jobs.',
    icon: Sparkles,
    tone: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
    cta: 'Start Free',
    href: '#tools',
    features: ['All live PDF tools', '100MB upload limit', 'Automatic file cleanup', 'No account required'],
  },
  {
    name: 'Pro',
    price: '$9',
    desc: 'For frequent users and heavier workflows.',
    icon: Crown,
    tone: 'border-blue-500/40 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-400/30',
    cta: 'Join Waitlist',
    href: 'mailto:hello@pdftools.local?subject=PDFTools%20Pro%20waitlist',
    features: ['Larger batch jobs', 'Priority processing', 'Saved conversion history', 'Early access to new tools'],
  },
  {
    name: 'Team',
    price: 'Custom',
    desc: 'For teams that process documents together.',
    icon: Building2,
    tone: 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-400/30',
    cta: 'Contact Sales',
    href: 'mailto:hello@pdftools.local?subject=PDFTools%20Team',
    features: ['Shared workspace', 'Admin controls', 'Usage reporting', 'Custom retention options'],
  },
];

const reliability = [
  { icon: Shield, title: 'Private by default', desc: 'Files are processed for the requested task and cleaned up automatically.' },
  { icon: Gauge, title: 'Fast feedback', desc: 'Progress states and direct downloads keep the workflow clear.' },
  { icon: Infinity, title: 'Room to grow', desc: 'The tool library is structured for more PDF workflows over time.' },
];

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-400" />
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <BadgeCheck className="h-3.5 w-3.5" />
              PDFTools workspace
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Work through PDFs faster, from one calm dashboard.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Convert, organize, watermark, and prepare documents without jumping between apps. Start with the free tools, then move into Pro workflows when your volume grows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#tools" className="btn-gradient inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm">
                <Zap className="h-4 w-4" />
                Open Tools
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#subscription"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                <Crown className="h-4 w-4 text-amber-500" />
                View Plans
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-xl font-bold text-slate-950 dark:text-white">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Today</p>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Document queue</h2>
              </div>
              <div className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Ready
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: FileArchive, title: 'Quarterly reports', meta: 'Merged 6 PDFs', color: 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-300' },
                { icon: RotateCw, title: 'Scanned invoice pack', meta: 'Rotated 18 pages', color: 'text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-300' },
                { icon: Stamp, title: 'Client proposal', meta: 'Watermarked and numbered', color: 'text-rose-600 bg-rose-100 dark:bg-rose-950 dark:text-rose-300' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.meta}</p>
                    </div>
                    <Check className="h-4 w-4 text-emerald-500" />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
              <FileText className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">Drop files into any tool to begin</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="scroll-mt-24">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Live tools</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Choose a PDF action</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            These tools are wired to the backend today and were smoke-tested with uploads and downloads.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {liveTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      <section id="more-tools" className="scroll-mt-24">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">More tools</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Next PDF workflows</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            The interface now has room for premium and upcoming PDF workflows without confusing them with live tools.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {workflow.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{step.desc}</p>
            </div>
          );
        })}
      </section>

      <section id="subscription" className="scroll-mt-24">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-300">Subscription</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">PDFTools plans</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Keep the core tools free, then add paid tiers for higher-volume document work.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} className={`rounded-lg border p-6 ${plan.tone}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-800 shadow-sm dark:bg-slate-900 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white">{plan.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{plan.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-slate-950 dark:text-white">{plan.price}</div>
                    {plan.price !== 'Custom' && <div className="text-xs text-slate-500 dark:text-slate-400">per month</div>}
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {plan.cta}
                  {plan.name === 'Free' ? <ArrowRight className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section id="features" className="scroll-mt-24 pb-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Reliable foundation</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Built for repeated document work</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {reliability.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                    <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    <h3 className="mt-3 text-sm font-bold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
