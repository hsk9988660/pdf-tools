import { Router } from 'express';
import upload from '../middleware/upload';
import { watermark } from '../controllers/watermarkController';

const router = Router();

router.post('/', upload.single('file'), watermark);

export default router;
