import express from 'express';
import { uploadEvidenceFlexible } from '../middlewares/uploadMiddleware.js';
import { analyzeEvidenceHandler } from '../controllers/evidenceController.js';

const router = express.Router();

router.post('/analyze', uploadEvidenceFlexible, analyzeEvidenceHandler);

export default router;