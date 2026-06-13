import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 */
function errorHandler(err: Error & { code?: string; status?: number; name?: string; errors?: { message: string }[] }, req: Request, res: Response, _next: NextFunction): void {
  console.error('Error:', err.message);
  console.error(err.stack);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({ error: 'File too large. Maximum size is 100MB.' });
    return;
  }

  // Multer unexpected file
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).json({ error: 'Unexpected file field.' });
    return;
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    res.status(400).json({
      error: 'Validation error',
      details: err.errors?.map((e) => e.message),
    });
    return;
  }

  // Default server error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}

export default errorHandler;
