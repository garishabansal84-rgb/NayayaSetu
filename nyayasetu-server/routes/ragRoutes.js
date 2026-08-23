import express from 'express';
import {
  queryRAGHandler,
  seedKnowledgeBaseHandler,
  ingestCustomDocumentHandler,
  listSourcesHandler,
  listChunksHandler
} from '../controllers/ragController.js';

const router = express.Router();

router.post('/query', queryRAGHandler);
router.post('/seed', seedKnowledgeBaseHandler);
router.post('/ingest', ingestCustomDocumentHandler);
router.get('/sources', listSourcesHandler);
router.get('/chunks', listChunksHandler);

export default router;