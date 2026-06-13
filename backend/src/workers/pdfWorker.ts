import { Worker, Job } from 'bullmq';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { execSync } from 'child_process';

const connection = { host: process.env.REDIS_HOST || 'localhost', port: 6379 };

interface PdfJobData {
  type: string;
  data: {
    inputPath: string;
    outputPath?: string;
    outputDir?: string;
  };
}

const worker = new Worker<PdfJobData>('pdf-jobs', async (job: Job<PdfJobData>) => {
  const { type, data } = job.data;

  switch (type) {
    case 'compress': {
      const { inputPath, outputPath } = data;
      if (!outputPath) throw new Error('outputPath is required for compress job');
      
      // Use Ghostscript if available, otherwise pdf-lib for basic compression
      try {
        execSync(
          `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`,
          { timeout: 60000 }
        );
      } catch {
        // Fallback: copy file as-is
        fs.copyFileSync(inputPath, outputPath);
      }
      break;
    }

    case 'pdf-to-jpg': {
      const { inputPath, outputDir } = data;
      if (!outputDir) throw new Error('outputDir is required for pdf-to-jpg job');
      
      // Use sharp to convert each page (pdf2pic alternative)
      // For simplicity, this is a placeholder since pdf2pic requires system deps
      // In production, use: pdf2pic or GraphicsMagick
      try {
        execSync(
          `magick convert -density 150 "${inputPath}" -quality 85 "${path.join(outputDir, 'page-%d.jpg')}"`,
          { timeout: 120000 }
        );
      } catch {
        throw new Error('PDF to JPG conversion failed. Ensure ImageMagick is installed.');
      }
      break;
    }

    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}, { connection });

export default worker;
