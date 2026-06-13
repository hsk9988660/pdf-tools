'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import FileDropzone from '../../components/FileDropzone';
import ProgressBar from '../../components/ProgressBar';
import { uploadFile } from '../../lib/api';
import { Scissors, Download, RotateCcw } from 'lucide-react';

export default function SplitPage() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setLoading(true); setError(null); setProgress(0);
    const fd = new FormData();
    fd.append('file', files[0]);
    try {
      const res = await uploadFile('/split', fd, setProgress);
      setResult(res);
      toast.success('PDF split successfully!');
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
    setLoading(false);
  };

  const reset = () => { setFiles([]); setResult(null); setError(null); setProgress(null); };

  const downloadAll = () => {
    result.downloadUrls.forEach((url) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop();
      a.click();
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
          <Scissors className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Split PDF</h1>
        <p className="text-slate-500 dark:text-slate-400">Split a PDF into separate individual pages</p>
      </div>

      {/* Dropzone */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <FileDropzone onFilesSelected={setFiles} accept=".pdf" multiple={false} maxFiles={1} />
      </div>

      {/* Action */}
      {files.length > 0 && !result && (
        <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            {loading ? 'Splitting...' : 'Split PDF'}
          </Button>
        </div>
      )}

      {/* Progress */}
      <div className="mt-6">
        <ProgressBar progress={progress} status="Splitting PDF..." show={loading} />
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
              <Scissors className="w-6 h-6" />
            </div>
            <p className="text-green-700 dark:text-green-300 font-semibold text-lg">PDF split successfully!</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">Split into {result.totalPages} individual pages</p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button onClick={downloadAll} size="lg" className="px-8 py-6 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
              <Download className="w-5 h-5 mr-2" />
              Download All Pages
            </Button>
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
