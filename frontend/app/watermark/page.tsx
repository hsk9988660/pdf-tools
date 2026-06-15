'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import FileDropzone from '../../components/FileDropzone';
import ProgressBar from '../../components/ProgressBar';
import DownloadButton from '../../components/DownloadButton';
import { uploadFile, type UploadResponse } from '../../lib/api';
import { Droplets, RotateCcw } from 'lucide-react';

export default function WatermarkPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (files.length === 0 || !text.trim()) return;
    setLoading(true); setError(null); setProgress(0);
    const fd = new FormData();
    fd.append('file', files[0]);
    fd.append('text', text.trim());
    try {
      const res = await uploadFile('/watermark', fd, setProgress);
      setResult(res);
      toast.success('Watermark added successfully!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      setError(message);
      toast.error(message);
    }
    setLoading(false);
  };

  const reset = () => { setFiles([]); setText(''); setResult(null); setError(null); setProgress(null); };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
          <Droplets className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Add Watermark</h1>
        <p className="text-slate-500 dark:text-slate-400">Add a text watermark to every page of your PDF</p>
      </div>

      {/* Dropzone */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <FileDropzone onFilesSelected={setFiles} accept=".pdf" multiple={false} maxFiles={1} />
      </div>

      {/* Options */}
      {files.length > 0 && !result && (
        <div className="max-w-md mx-auto mt-8 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Watermark text:</label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL, DRAFT, etc."
              className="text-base py-6 px-4 rounded-xl"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            size="lg"
            className="w-full py-6 text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            {loading ? 'Adding Watermark...' : 'Add Watermark'}
          </Button>
        </div>
      )}

      {/* Progress */}
      <div className="mt-6">
        <ProgressBar progress={progress} status="Adding watermark..." show={loading} />
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
              <Droplets className="w-6 h-6" />
            </div>
            <p className="text-green-700 dark:text-green-300 font-semibold text-lg">Watermark added!</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">Text: &ldquo;{text}&rdquo;</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <DownloadButton onDownload={() => window.open(result.downloadUrl)} label="Download Watermarked PDF" />
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
