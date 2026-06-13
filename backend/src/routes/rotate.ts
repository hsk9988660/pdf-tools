import { Router } from 'express';
import upload from '../middleware/upload';
import { rotate } from '../controllers/rotateController';

const router = Router();

router.post('/', upload.single('file'), rotate);

export default router;
