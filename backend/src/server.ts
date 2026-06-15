import express from 'express';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

import db from './models';
import errorHandler from './middleware/errorHandler';
import requestLogger from './middleware/requestLogger';
import { cleanupOldFiles } from './utils/cleanup';

// Route imports
import mergeRoutes from './routes/merge';
import splitRoutes from './routes/split';
import compressRoutes from './routes/compress';
import rotateRoutes from './routes/rotate';
import watermarkRoutes from './routes/watermark';
import pageNumbersRoutes from './routes/pageNumbers';
import jpgToPdfRoutes from './routes/jpgToPdf';
import pdfToJpgRoutes from './routes/pdfToJpg';
import statsRoutes from './routes/stats';

// Start BullMQ worker only when explicitly enabled.
// Routes process files directly, so Redis is optional for local development.
if (process.env.ENABLE_PDF_WORKER === 'true') {
  import('./workers/pdfWorker').then(() => {
    console.log('BullMQ worker started successfully');
  }).catch((err: Error) => {
    console.warn('BullMQ worker not started (Redis may be unavailable):', err.message);
    console.warn('All routes will still work without the background worker.');
  });
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
app.use('/download', express.static(path.join(__dirname, '..', 'uploads')));

// Health check endpoint
app.get('/api/health', (_req, res) => {
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
    console.error('Failed to start server:', (err as Error).message);
    // Start server even if DB is unavailable (for development)
    app.listen(PORT, () => {
      console.log(`PDF Tools backend running on http://localhost:${PORT} (without database)`);
    });
  }
}

startServer();
