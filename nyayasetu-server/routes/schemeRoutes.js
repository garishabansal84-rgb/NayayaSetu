import express from 'express';
import {
  evaluateSchemesHandler,
  listAllSchemesHandler
} from '../controllers/schemeController.js';

const router = express.Router();

router.post('/evaluate', evaluateSchemesHandler);
router.get('/list', listAllSchemesHandler);

export default router;