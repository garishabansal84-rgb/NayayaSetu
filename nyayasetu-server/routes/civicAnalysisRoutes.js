import express from 'express';
import { 
  analyzeCivicComplaintHandler, 
  getCivicAnalysisHistoryHandler 
} from '../controllers/civicAnalysisController.js';

const router = express.Router();

router.post('/analyze', analyzeCivicComplaintHandler);
router.get('/history', getCivicAnalysisHistoryHandler);

export default router;
