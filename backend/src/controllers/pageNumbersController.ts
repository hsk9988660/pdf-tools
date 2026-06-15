import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import conversionService from '../services/conversionService';

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

export const addPageNumbers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const startTime = Date.now();
  let conversion: Awaited<ReturnType<typeof conversionService.createConversion>> | undefined;

  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Please upload a PDF file.' });
      return;
    }

    const position = req.body.position || 'bottom-center';
    const startNumber = parseInt(req.body.startNumber) || 1;

    const fileBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const pageCount = pdf.getPageCount();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    // Create conversion record
    conversion = await conversionService.createConversion({
      toolType: 'page_numbers',
      originalFilename: file.originalname,
      options: { position, startNumber, pageCount },
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

    // Add page numbers
    const pages = pdf.getPages();
    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const text = String(startNumber + index);
      const fontSize = 10;

      let x: number, y: number;
      switch (position) {
        case 'top-left':
          x = 50;
          y = height - 40;
          break;
        case 'top-center':
          x = width / 2 - 10;
          y = height - 40;
          break;
        case 'top-right':
          x = width - 50;
          y = height - 40;
          break;
        case 'bottom-left':
          x = 50;
          y = 40;
          break;
        case 'bottom-right':
          x = width - 50;
          y = 40;
          break;
        case 'bottom-center':
        default:
          x = width / 2 - 10;
          y = 40;
          break;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    });

    const numberedBytes = await pdf.save();
    const outputFilename = `numbered-${Date.now()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputFilename);
    fs.writeFileSync(outputPath, numberedBytes);

    // Record output file
    await conversionService.addOutputFile(conversion.id, {
      originalName: outputFilename,
      storedName: outputFilename,
      mimeType: 'application/pdf',
      size: numberedBytes.length,
      filePath: outputPath,
    });

    await conversionService.markCompleted(conversion.id, {
      outputFilename,
      outputSize: numberedBytes.length,
      originalSize: file.size,
      pageCount,
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename,
      pageCount,
      size: numberedBytes.length,
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
