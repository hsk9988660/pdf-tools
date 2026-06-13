import React, { useRef, useState } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export default function FileDropzone({ onFilesSelected, accept = '.pdf', multiple = true, maxFiles = 10 }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFiles = (files) => {
    const fileArr = Array.from(files).slice(0, maxFiles);
    setSelectedFiles(fileArr);
    if (onFilesSelected) onFilesSelected(fileArr);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const removeFile = (index) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    if (onFilesSelected) onFilesSelected(updated);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      {/* Dropzone Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer
          transition-all duration-300 overflow-hidden
          ${isDragging
            ? 'border-primary bg-primary/5 scale-[1.02] shadow-xl shadow-primary/10'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-md'
          }
        `}
      >
        {/* Background gradient on drag */}
        <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent" />
        </div>

        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Gradient border ring on drag */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), transparent 40%, transparent 60%, hsl(var(--primary) / 0.3))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '2px',
          }} />
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="relative flex flex-col items-center gap-4">
          {/* Upload icon */}
          <div className={`
            w-16 h-16 flex items-center justify-center rounded-2xl
            transition-all duration-300
            ${isDragging
              ? 'bg-primary/20 text-primary scale-110 shadow-lg shadow-primary/10'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
            }
          `}>
            <Upload className={`w-8 h-8 transition-transform duration-300 ${isDragging ? 'rotate-6' : ''}`} />
          </div>

          {/* Text */}
          <div>
            <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              or{' '}
              <span className="text-primary font-semibold hover:underline cursor-pointer">browse files</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              {accept.split(',').join(', ').toUpperCase()} &middot; Max {maxFiles} file{maxFiles > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-5 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </p>
            <button
              onClick={() => { setSelectedFiles([]); if (onFilesSelected) onFilesSelected([]); }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>
          {selectedFiles.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="group flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-indigo-500/10 text-primary rounded-xl">
                  <File className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="ml-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}
