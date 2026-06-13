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
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Please upload at least one image.' });
      return;
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    // Create conversion record
    conversion = await conversionService.createConversion({
      toolType: 'jpg_to_pdf',
      originalFilename: files.map((f) => f.originalname).join(', '),
      options: { fileCount: files.length },
      req,
    });

    for (const file of files) {
      await conversionService.addInputFile(conversion.id, {
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        filePath: file.path,
      });
    }

    await conversionService.markProcessing(conversion.id);

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      // Convert to JPEG if PNG, otherwise read as-is
      let imageBuffer: Buffer;
      if (file.mimetype === 'image/png') {
        const rawBuffer = fs.readFileSync(file.path);
        const jpgBuffer = await sharp(rawBuffer).jpeg({ quality: 90 }).toBuffer();
        imageBuffer = Buffer.from(jpgBuffer);
      } else {
        imageBuffer = fs.readFileSync(file.path);
      }

      const image = await pdfDoc.embedJpg(imageBuffer);
      const { width, height } = image;
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const outputFilename = `converted-${Date.now()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputFilename);
    fs.writeFileSync(outputPath, pdfBytes);

    const pageCount = pdfDoc.getPageCount();

    // Record output file
    await conversionService.addOutputFile(conversion.id, {
      originalName: outputFilename,
      storedName: outputFilename,
      mimeType: 'application/pdf',
      size: pdfBytes.length,
      filePath: outputPath,
    });

    await conversionService.markCompleted(conversion.id, {
      outputFilename,
      outputSize: pdfBytes.length,
      originalSize: totalSize,
      pageCount,
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename,
      pageCount,
      size: pdfBytes.length,
      originalSize: totalSize,
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
