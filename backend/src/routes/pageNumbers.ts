import { Router } from 'express';
import upload from '../middleware/upload';
import { addPageNumbers } from '../controllers/pageNumbersController';

const router = Router();

router.post('/', upload.single('file'), addPageNumbers);

export default router;
