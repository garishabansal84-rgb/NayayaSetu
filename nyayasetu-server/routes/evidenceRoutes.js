import express from 'express';
import { uploadEvidenceFlexible } from '../middlewares/uploadMiddleware.js';
import { 
  analyzeEvidenceHandler, 
  generateBSACertificateHandler, 
  downloadEvidenceFileHandler 
} from '../controllers/evidenceController.js';

const router = express.Router();

router.post('/analyze', uploadEvidenceFlexible, analyzeEvidenceHandler);
router.post('/certificate', generateBSACertificateHandler);
router.get('/download/:filename', downloadEvidenceFileHandler);

export default router;