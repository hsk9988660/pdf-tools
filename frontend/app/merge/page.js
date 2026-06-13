'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import FileDropzone from '../../components/FileDropzone';
import ProgressBar from '../../components/ProgressBar';
import DownloadButton from '../../components/DownloadButton';
import { uploadFile } from '../../lib/api';
import { Combine, ArrowRight, RotateCcw } from 'lucide-react';

export default function MergePage() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (files.length < 2) return;
    setLoading(true); setError(null); setProgress(0);
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    try {
      const res = await uploadFile('/merge', fd, setProgress);
      setResult(res);
      toast.success('PDFs merged successfully!');
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
    setLoading(false);
  };

  const reset = () => { setFiles([]); setResult(null); setError(null); setProgress(null); };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
          <Combine className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Merge PDF</h1>
        <p className="text-slate-500 dark:text-slate-400">Combine multiple PDF files into a single document</p>
      </div>

      {/* Dropzone */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <FileDropzone onFilesSelected={setFiles} accept=".pdf" multiple maxFiles={20} />
      </div>

      {/* Action */}
      {files.length >= 2 && !result && (
        <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            {loading ? (
              'Merging...'
            ) : (
              <span className="flex items-center gap-2">
                Merge {files.length} Files
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      )}
      {files.length > 0 && files.length < 2 && (
        <p className="text-amber-500 text-center mt-4 text-sm font-medium animate-fade-in">Select at least 2 files to merge</p>
      )}

      {/* Progress */}
      <div className="mt-6">
        <ProgressBar progress={progress} status="Merging PDFs..." show={loading} />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-center animate-fade-in">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 animate-fade-in-up">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
              <Combine className="w-6 h-6" />
            </div>
            <p className="text-green-700 dark:text-green-300 font-semibold text-lg">PDFs merged successfully!</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">{files.length} files combined into one document</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <DownloadButton onDownload={() => window.open(result.downloadUrl)} label="Download Merged PDF" />
            <Button onClick={reset} variant="outline" size="lg" className="rounded-xl">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>

  );
}
