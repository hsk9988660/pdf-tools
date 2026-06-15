import { Router } from 'express';
import upload from '../middleware/upload';
import { merge } from '../controllers/mergeController';

const router = Router();

router.post('/', upload.array('files', 20), merge);

export default router;
