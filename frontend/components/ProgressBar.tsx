import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress?: number | null;
  status?: string;
  show?: boolean;
}

export default function ProgressBar({ progress = 0, status = 'Processing...', show = false }: ProgressBarProps) {
  if (!show) return null;

  const clampedProgress = Math.min(Math.max(progress ?? 0, 0), 100);

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{status}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{clampedProgress}% complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-blue-500 to-indigo-500 transition-all duration-500 ease-out shadow-sm shadow-primary/20"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>
    </div>

  );
}
