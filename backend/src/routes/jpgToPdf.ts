import { Router } from 'express';
import upload from '../middleware/upload';
import { convert } from '../controllers/jpgToPdfController';

const router = Router();

router.post('/', upload.array('files', 20), convert);

export default router;
