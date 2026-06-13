const path = require('path');
const fs = require('fs');
const { PDFDocument, degrees } = require('pdf-lib');
const conversionService = require('../services/conversionService');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

exports.rotate = async (req, res, next) => {
  const startTime = Date.now();
  let conversion;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file.' });
    }

    const angle = parseInt(req.body.angle) || 90;
    const validAngles = [90, 180, 270];
    if (!validAngles.includes(angle)) {
      return res.status(400).json({ error: 'Invalid angle. Use 90, 180, or 270.' });
    }

    const file = req.file;
    const fileBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const pageCount = pdf.getPageCount();

    // Create conversion record
    conversion = await conversionService.createConversion({
      toolType: 'rotate',
      originalFilename: file.originalname,
      options: { angle, pageCount },
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

    // Rotate all pages
    const pages = pdf.getPages();
    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    });

    const rotatedBytes = await pdf.save();
    const outputFilename = `rotated-${Date.now()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputFilename);
    fs.writeFileSync(outputPath, rotatedBytes);

    // Record output file
    await conversionService.addOutputFile(conversion.id, {
      originalName: outputFilename,
      storedName: outputFilename,
      mimeType: 'application/pdf',
      size: rotatedBytes.length,
      filePath: outputPath,
    });

    await conversionService.markCompleted(conversion.id, {
      outputFilename,
      outputSize: rotatedBytes.length,
      originalSize: file.size,
      pageCount,
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename,
      angle,
      pageCount,
      size: rotatedBytes.length,
      processingTime,
      conversionId: conversion.id,
    });
  } catch (err) {
    if (conversion) {
      await conversionService.markFailed(conversion.id, err.message);
    }
    next(err);
  }
};
