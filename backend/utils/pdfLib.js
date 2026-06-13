const { PDFDocument } = require('pdf-lib');

async function loadPdf(bytes) {
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

async function savePdf(doc) {
  return doc.save();
}

module.exports = { loadPdf, savePdf };
