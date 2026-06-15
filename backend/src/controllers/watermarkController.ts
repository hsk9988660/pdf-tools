import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import conversionService from '../services/conversionService';

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

export const watermark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const startTime = Date.now();
  let conversion: Awaited<ReturnType<typeof conversionService.createConversion>> | undefined;

  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Please upload a PDF file.' });
      return;
    }

    const watermarkText = req.body.text || 'CONFIDENTIAL';
    const opacity = parseFloat(req.body.opacity) || 0.3;

    const fileBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const pageCount = pdf.getPageCount();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    // Create conversion record
    conversion = await conversionService.createConversion({
      toolType: 'watermark',
      originalFilename: file.originalname,
      options: { watermarkText, opacity, pageCount },
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

    // Add watermark to each page
    const pages = pdf.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const fontSize = Math.min(width, height) / 8;

      page.drawText(watermarkText, {
        x: width / 2 - (watermarkText.length * fontSize * 0.3) / 2,
        y: height / 2 - fontSize / 2,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(-45),
      });
    });

    const watermarkedBytes = await pdf.save();
    const outputFilename = `watermarked-${Date.now()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputFilename);
    fs.writeFileSync(outputPath, watermarkedBytes);

    // Record output file
    await conversionService.addOutputFile(conversion.id, {
      originalName: outputFilename,
      storedName: outputFilename,
      mimeType: 'application/pdf',
      size: watermarkedBytes.length,
      filePath: outputPath,
    });

    await conversionService.markCompleted(conversion.id, {
      outputFilename,
      outputSize: watermarkedBytes.length,
      originalSize: file.size,
      pageCount,
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename,
      pageCount,
      size: watermarkedBytes.length,
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
