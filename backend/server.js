const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config();

const db = require('./models');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const { cleanupOldFiles } = require('./utils/cleanup');

// Route imports
const mergeRoutes = require('./routes/merge');
const splitRoutes = require('./routes/split');
const compressRoutes = require('./routes/compress');
const rotateRoutes = require('./routes/rotate');
const watermarkRoutes = require('./routes/watermark');
const pageNumbersRoutes = require('./routes/pageNumbers');
const jpgToPdfRoutes = require('./routes/jpgToPdf');
const pdfToJpgRoutes = require('./routes/pdfToJpg');
const statsRoutes = require('./routes/stats');

// Start BullMQ worker only when explicitly enabled.
// Routes process files directly, so Redis is optional for local development.
let worker;
if (process.env.ENABLE_PDF_WORKER === 'true') {
  try {
    worker = require('./workers/pdfWorker');
    console.log('BullMQ worker started successfully');
  } catch (err) {
    console.warn('BullMQ worker not started (Redis may be unavailable):', err.message);
    console.warn('All routes will still work without the background worker.');
  }
} else {
  console.log('BullMQ worker disabled. Set ENABLE_PDF_WORKER=true to enable Redis-backed jobs.');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(requestLogger);

// API Routes
app.use('/api/merge', mergeRoutes);
app.use('/api/split', splitRoutes);
app.use('/api/compress', compressRoutes);
app.use('/api/rotate', rotateRoutes);
app.use('/api/watermark', watermarkRoutes);
app.use('/api/page-numbers', pageNumbersRoutes);
app.use('/api/jpg-to-pdf', jpgToPdfRoutes);
app.use('/api/pdf-to-jpg', pdfToJpgRoutes);
app.use('/api/stats', statsRoutes);

// Static file serving for downloads
app.use('/download', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Cleanup temp files every 30 minutes
cron.schedule('*/30 * * * *', () => {
  cleanupOldFiles();
});

// Database sync and server start
async function startServer() {
  try {
    // Sync database models (creates tables if they don't exist)
    await db.sequelize.sync({ alter: false });
    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(`PDF Tools backend running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    // Start server even if DB is unavailable (for development)
    app.listen(PORT, () => {
      console.log(`PDF Tools backend running on http://localhost:${PORT} (without database)`);
    });
  }
}

startServer();
