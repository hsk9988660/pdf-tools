import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import conversionService from '../services/conversionService';

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

export const compress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      toolType: 'compress',
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

    // Compress by removing unused objects and re-saving
    const compressedBytes = await pdf.save({ useObjectStreams: true });
    const outputFilename = `compressed-${Date.now()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputFilename);
    fs.writeFileSync(outputPath, compressedBytes);

    const compressionRatio = file.size > 0
      ? ((1 - compressedBytes.length / file.size) * 100).toFixed(2)
      : '0.00';

    // Record output file
    await conversionService.addOutputFile(conversion.id, {
      originalName: outputFilename,
      storedName: outputFilename,
      mimeType: 'application/pdf',
      size: compressedBytes.length,
      filePath: outputPath,
    });

    await conversionService.markCompleted(conversion.id, {
      outputFilename,
      outputSize: compressedBytes.length,
      originalSize: file.size,
      pageCount,
      compressionRatio: parseFloat(compressionRatio),
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename,
      originalSize: file.size,
      compressedSize: compressedBytes.length,
      compressionRatio: `${compressionRatio}%`,
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
