import React from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

export default function DownloadButton({ onDownload, loading = false, disabled = false, label = 'Download', variant = 'default' }) {
  return (
    <Button
      onClick={onDownload}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden group
        ${variant === 'gradient'
          ? 'btn-gradient'
          : 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg hover:shadow-primary/20'
        }
        px-8 py-6 text-base font-semibold rounded-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        active:scale-[0.98]
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </span>
      ) : disabled ? (
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          Processed
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          {label}
        </span>
      )}
    </Button>

  );
}
