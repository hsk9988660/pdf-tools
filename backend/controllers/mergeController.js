const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const conversionService = require('../services/conversionService');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

exports.merge = async (req, res, next) => {
  const startTime = Date.now();
  let conversion;

  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files.' });
    }

    const files = req.files;
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    // Create conversion record
    conversion = await conversionService.createConversion({
      toolType: 'merge',
      originalFilename: files.map((f) => f.originalname).join(', '),
      options: { fileCount: files.length },
      req,
    });

    // Record input files
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

    // Merge PDFs
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const fileBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const pageIndices = pdf.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const outputFilename = `merged-${Date.now()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputFilename);
    fs.writeFileSync(outputPath, mergedBytes);

    const pageCount = mergedPdf.getPageCount();

    // Record output file
    await conversionService.addOutputFile(conversion.id, {
      originalName: outputFilename,
      storedName: outputFilename,
      mimeType: 'application/pdf',
      size: mergedBytes.length,
      filePath: outputPath,
    });

    await conversionService.markCompleted(conversion.id, {
      outputFilename,
      outputSize: mergedBytes.length,
      originalSize: totalSize,
      pageCount,
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename,
      pageCount,
      size: mergedBytes.length,
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
