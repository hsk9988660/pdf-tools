import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import conversionService from '../services/conversionService';

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

export const split = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const totalPages = pdf.getPageCount();

    // Create conversion record
    conversion = await conversionService.createConversion({
      toolType: 'split',
      originalFilename: file.originalname,
      options: { totalPages },
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

    // Split into individual pages
    const outputFiles: { filename: string; size: number; path: string }[] = [];
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);
      const pageBytes = await newPdf.save();

      const outputFilename = `split-${path.basename(file.originalname, '.pdf')}-page-${i + 1}.pdf`;
      const outputPath = path.join(UPLOAD_DIR, outputFilename);
      fs.writeFileSync(outputPath, pageBytes);
      outputFiles.push({ filename: outputFilename, size: pageBytes.length, path: outputPath });
    }

    // Record output files
    for (const outFile of outputFiles) {
      await conversionService.addOutputFile(conversion.id, {
        originalName: outFile.filename,
        storedName: outFile.filename,
        mimeType: 'application/pdf',
        size: outFile.size,
        filePath: outFile.path,
      });
    }

    const totalOutputSize = outputFiles.reduce((sum, f) => sum + f.size, 0);

    await conversionService.markCompleted(conversion.id, {
      outputFilename: outputFiles.map((f) => f.filename).join(', '),
      outputSize: totalOutputSize,
      originalSize: file.size,
      pageCount: totalPages,
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      files: outputFiles.map((f) => ({
        downloadUrl: `/download/${f.filename}`,
        filename: f.filename,
        size: f.size,
      })),
      pageCount: totalPages,
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
