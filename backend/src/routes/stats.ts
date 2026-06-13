import { Router, Request, Response, NextFunction } from 'express';
import conversionService from '../services/conversionService';

const router = Router();

// GET /api/stats - Get usage statistics
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await conversionService.getStats();
    res.json({ success: true, ...stats });
  } catch (err) {
    next(err);
  }
});

export default router;
