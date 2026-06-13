const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function generateTempPath(extension) {
  const name = crypto.randomBytes(16).toString('hex');
  return path.join(uploadsDir, `${name}${extension}`);
}

function getUploadsDir() {
  return uploadsDir;
}

module.exports = { generateTempPath, getUploadsDir };
