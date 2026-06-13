'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import FileDropzone from '../../components/FileDropzone';
import ProgressBar from '../../components/ProgressBar';
import DownloadButton from '../../components/DownloadButton';
import { uploadFile } from '../../lib/api';
import { FileDown, RotateCcw } from 'lucide-react';

export default function CompressPage() {
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
      const res = await uploadFile('/compress', fd, setProgress);
      setResult(res);
      toast.success('PDF compressed successfully!');
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
    setLoading(false);
  };

  const reset = () => { setFiles([]); setResult(null); setError(null); setProgress(null); };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20">
          <FileDown className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Compress PDF</h1>
        <p className="text-slate-500 dark:text-slate-400">Reduce PDF file size while maintaining quality</p>
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
            {loading ? 'Compressing...' : 'Compress PDF'}
          </Button>
        </div>
      )}

      {/* Progress */}
      <div className="mt-6">
        <ProgressBar progress={progress} status="Compressing PDF..." show={loading} />
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
              <FileDown className="w-6 h-6" />
            </div>
            <p className="text-green-700 dark:text-green-300 font-semibold text-lg">PDF compressed successfully!</p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">Reduced by {result.savingsPercent}%</p>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <Card className="w-36 border-0 shadow-md rounded-2xl">
              <CardContent className="flex flex-col items-center py-5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Original</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white mt-1">{formatSize(result.originalSize)}</span>
              </CardContent>
            </Card>
            <Card className="w-36 border-0 shadow-md rounded-2xl">
              <CardContent className="flex flex-col items-center py-5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Compressed</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white mt-1">{formatSize(result.compressedSize)}</span>
              </CardContent>
            </Card>
            <Card className="w-36 border-0 shadow-md rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardContent className="flex flex-col items-center py-5">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">Saved</span>
                <span className="text-xl font-bold text-green-700 dark:text-green-300 mt-1">{result.savingsPercent}%</span>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center gap-3">
            <DownloadButton onDownload={() => window.open(result.downloadUrl)} label="Download Compressed PDF" />
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
