import { Router } from 'express';
import upload from '../middleware/upload';
import { compress } from '../controllers/compressController';

const router = Router();

router.post('/', upload.single('file'), compress);

export default router;
