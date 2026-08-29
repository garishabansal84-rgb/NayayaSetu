import express from 'express';
import {
  diagnoseGrievanceHandler,
  getCaseDetailsHandler,
  listCasesHandler,
  cleanVoiceTranscriptHandler,
  transcribeAudioHandler,
  simulateOpponentHandler
} from '../controllers/intakeController.js';
import { uploadEvidenceFlexible } from '../middlewares/uploadMiddleware.js';
import { analyzeEvidenceHandler } from '../controllers/evidenceController.js';

const router = express.Router();

router.post('/diagnose', diagnoseGrievanceHandler);
router.post('/simulate-opponent', simulateOpponentHandler);
router.post('/clean-voice', cleanVoiceTranscriptHandler);
router.post('/transcribe-audio', uploadEvidenceFlexible, transcribeAudioHandler);
router.post('/analyze-evidence', uploadEvidenceFlexible, analyzeEvidenceHandler);
router.get('/cases', listCasesHandler);
router.get('/cases/:caseId', getCaseDetailsHandler);

export default router;