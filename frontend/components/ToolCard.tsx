import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Combine,
  FileImage,
  FileKey2,
  FileLock2,
  FilePenLine,
  FileScan,
  FileText,
  Hash,
  ImagePlus,
  Layers3,
  RotateCw,
  Scissors,
  Shrink,
  Sparkles,
  Stamp,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  merge: Combine,
  split: Scissors,
  compress: Shrink,
  rotate: RotateCw,
  watermark: Stamp,
  'page-numbers': Hash,
  'jpg-to-pdf': ImagePlus,
  'pdf-to-jpg': FileImage,
  unlock: FileKey2,
  protect: FileLock2,
  sign: FilePenLine,
  ocr: FileScan,
  organize: Layers3,
  word: FileText,
};

const toneMap: Record<string, string> = {
  merge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  split: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  compress: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  rotate: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  watermark: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  'page-numbers': 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  'jpg-to-pdf': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300',
  'pdf-to-jpg': 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  unlock: 'bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300',
  protect: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  sign: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  ocr: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  organize: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  word: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
};

interface ToolCardProps {
  id: string;
  title: string;
  desc: string;
  icon: string;
  status?: 'live' | 'soon';
}

export default function ToolCard({ id, title, desc, icon, status = 'live' }: ToolCardProps) {
  const IconComponent = iconMap[icon] || Combine;
  const tone = toneMap[icon] || toneMap.merge;
  const isLive = status === 'live';
  const content = (
    <div
      className={`group relative flex h-full min-h-[188px] flex-col rounded-lg border p-5 transition ${
        isLive
          ? 'border-slate-200 bg-white hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700'
          : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
            isLive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {isLive ? 'Live' : 'Soon'}
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{desc}</p>
      <div className={`mt-5 flex items-center gap-2 text-sm font-semibold ${isLive ? 'text-blue-600 dark:text-blue-300' : 'text-slate-400'}`}>
        {isLive ? 'Open tool' : 'Planned tool'}
        {isLive ? <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /> : <Sparkles className="h-4 w-4" />}
      </div>
    </div>
  );

  if (!isLive) {
    return <div aria-disabled="true">{content}</div>;
  }

  return (
    <Link href={`/${id}`} className="block h-full">
      {content}
    </Link>
  );
}
