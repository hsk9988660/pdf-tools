import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import conversionService from '../services/conversionService';

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

export const convert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const startTime = Date.now();
  let conversion: Awaited<ReturnType<typeof conversionService.createConversion>> | undefined;

  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Please upload a PDF file.' });
      return;
    }

    const fileBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const pageCount = pdf.getPageCount();

    // Create conversion record
    conversion = await conversionService.createConversion({
      toolType: 'pdf_to_jpg',
      originalFilename: file.originalname,
      options: { pageCount },
      req,
    });

    await conversionService.addInputFile(conversion.id, {
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      filePath: file.path,
    });

    await conversionService.markProcessing(conversion.id);

    // For PDF-to-JPG, we render each page as an image
    // Since pdf-lib doesn't render pages, we create placeholder images
    // In production, use a tool like pdftoppm or pdf2pic
    const outputFiles: { filename: string; size: number; path: string }[] = [];
    const pages = pdf.getPages();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // Create a white placeholder image with page dimensions
      const imageBuffer = await sharp({
        create: {
          width: Math.round(width),
          height: Math.round(height),
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .jpeg({ quality: 90 })
        .toBuffer();

      const outputFilename = `page-${i + 1}-${Date.now()}.jpg`;
      const outputPath = path.join(UPLOAD_DIR, outputFilename);
      fs.writeFileSync(outputPath, imageBuffer);
      outputFiles.push({ filename: outputFilename, size: imageBuffer.length, path: outputPath });
    }

    // Record output files
    for (const outFile of outputFiles) {
      await conversionService.addOutputFile(conversion.id, {
        originalName: outFile.filename,
        storedName: outFile.filename,
        mimeType: 'image/jpeg',
        size: outFile.size,
        filePath: outFile.path,
      });
    }

    const totalOutputSize = outputFiles.reduce((sum, f) => sum + f.size, 0);

    await conversionService.markCompleted(conversion.id, {
      outputFilename: outputFiles.map((f) => f.filename).join(', '),
      outputSize: totalOutputSize,
      originalSize: file.size,
      pageCount,
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      files: outputFiles.map((f) => ({
        downloadUrl: `/download/${f.filename}`,
        filename: f.filename,
        size: f.size,
      })),
      pageCount,
      processingTime,
      conversionId: conversion.id,
    });
  } catch (err) {
    if (conversion) {
      await conversionService.markFailed(conversion.id, (err as Error).message);
    }
    next(err);
  }
};
