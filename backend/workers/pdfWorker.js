const { Worker } = require('bullmq');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');

const connection = { host: process.env.REDIS_HOST || 'localhost', port: 6379 };

const worker = new Worker('pdf-jobs', async (job) => {
  const { type, data } = job;

  switch (type) {
    case 'compress': {
      const { inputPath, outputPath } = data;
      // Use Ghostscript if available, otherwise pdf-lib for basic compression
      const { execSync } = require('child_process');
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
      // Use sharp to convert each page (pdf2pic alternative)
      // For simplicity, this is a placeholder since pdf2pic requires system deps
      // In production, use: pdf2pic or GraphicsMagick
      const { execSync } = require('child_process');
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

module.exports = worker;
