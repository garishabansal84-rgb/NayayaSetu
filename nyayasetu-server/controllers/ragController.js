import { answerWithRAG } from '../services/ragService.js';
import { ingestGovernmentDocument } from '../services/ingestionService.js';
import { seedOfficialKnowledgeCorpus } from '../services/governmentCorpus.js';
import { SourceRepository } from '../models/Source.js';
import { DocumentChunkRepository } from '../models/DocumentChunk.js';

export const queryRAGHandler = async (req, res, next) => {
  try {
    const { question, citizenProfile = {}, topK = 4 } = req.body;
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Question parameter is required.' });
    }

    const ragResponse = await answerWithRAG({ question, citizenProfile, topK });
    res.status(200).json(ragResponse);
  } catch (error) {
    next(error);
  }
};

export const seedKnowledgeBaseHandler = async (req, res, next) => {
  try {
    const seedSummary = await seedOfficialKnowledgeCorpus();
    res.status(200).json({
      success: true,
      message: 'Official Government Knowledge Base Seeded Successfully.',
      summary: seedSummary
    });
  } catch (error) {
    next(error);
  }
};

export const ingestCustomDocumentHandler = async (req, res, next) => {
  try {
    const { sourceId, schemeCode, schemeName, hindiName, rawText, metadata = {} } = req.body;
    if (!rawText || !schemeName) {
      return res.status(400).json({ success: false, error: 'Scheme name and raw text are required.' });
    }

    const result = await ingestGovernmentDocument({
      sourceId: sourceId || 'MANUAL_UPLOAD',
      schemeCode: schemeCode || `SCHEME_${Date.now()}`,
      schemeName,
      hindiName: hindiName || '',
      rawText,
      metadata
    });

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};

export const listSourcesHandler = async (req, res, next) => {
  try {
    const sources = await SourceRepository.findAllActive();
    const totalChunks = await DocumentChunkRepository.count();
    res.status(200).json({
      success: true,
      totalSources: sources.length,
      totalIndexedChunks: totalChunks,
      sources
    });
  } catch (error) {
    next(error);
  }
};

export const listChunksHandler = async (req, res, next) => {
  try {
    const chunks = await DocumentChunkRepository.findAll(50);
    res.status(200).json({
      success: true,
      count: chunks.length,
      chunks
    });
  } catch (error) {
    next(error);
  }
};