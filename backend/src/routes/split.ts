import { Router } from 'express';
import upload from '../middleware/upload';
import { split } from '../controllers/splitController';

const router = Router();

router.post('/', upload.single('file'), split);

export default router;
