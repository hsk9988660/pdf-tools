const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const conversionService = require('../services/conversionService');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

exports.convert = async (req, res, next) => {
  const startTime = Date.now();
  let conversion;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image.' });
    }

    const files = req.files;
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
      let imageBuffer = fs.readFileSync(file.path);

      // Convert to JPEG if PNG
      if (file.mimetype === 'image/png') {
        imageBuffer = await sharp(imageBuffer).jpeg({ quality: 90 }).toBuffer();
      }

      const image = await pdfDoc.embedJpg(new Uint8Array(imageBuffer));
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
      await conversionService.markFailed(conversion.id, err.message);
    }
    next(err);
  }
};
