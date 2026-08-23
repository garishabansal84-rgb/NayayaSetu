import express from 'express';
import {
  generateDraftHandler,
  downloadDraftPdfHandler
} from '../controllers/draftController.js';

const router = express.Router();

router.post('/generate', generateDraftHandler);
router.get('/download/:filename', downloadDraftPdfHandler);

export default router;