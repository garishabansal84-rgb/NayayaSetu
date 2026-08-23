import express from 'express';
import { lookupJurisdictionHandler, getStatesListHandler } from '../controllers/jurisdictionController.js';

const router = express.Router();

router.get('/lookup', lookupJurisdictionHandler);
router.get('/states', getStatesListHandler);

export default router;