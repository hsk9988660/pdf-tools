const API_BASE = '/api';

export interface UploadResponse {
  success: boolean;
  downloadUrl: string;
  filename: string;
  pageCount?: number;
  totalPages?: number;
  size?: number;
  originalSize?: number;
  compressedSize?: number;
  savingsPercent?: number;
  processingTime?: number;
  conversionId?: string;
  downloadUrls?: string[];
  error?: string;
}

export async function uploadFile(
  url: string,
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}${url}`);

    xhr.upload.onprogress = (e: ProgressEvent) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          reject(new Error(JSON.parse(xhr.responseText).error || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}

export function downloadFile(url: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = url.split('/').pop() || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
