import { Router } from 'express';
import upload from '../middleware/upload';
import { convert } from '../controllers/pdfToJpgController';

const router = Router();

router.post('/', upload.single('file'), convert);

export default router;
