const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const conversionService = require('../services/conversionService');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

exports.split = async (req, res, next) => {
  const startTime = Date.now();
  let conversion;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file.' });
    }

    const file = req.file;
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
    const outputFiles = [];
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
      await conversionService.markFailed(conversion.id, err.message);
    }
    next(err);
  }
};
