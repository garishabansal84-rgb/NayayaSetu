import { generateEmbedding, computeContentHash } from './embeddingService.js';
import { DocumentChunkRepository } from '../models/DocumentChunk.js';
import { SourceRepository } from '../models/Source.js';

/**
 * Intelligent Section-Aware Text Chunker
 * Breaks long text into chunks of targetWordCount with an overlap.
 */
export const splitTextIntoChunks = (text, targetWordCount = 120, overlapWords = 20) => {
  if (!text) return [];
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const chunks = [];
  
  let index = 0;
  while (index < words.length) {
    const chunkWords = words.slice(index, index + targetWordCount);
    chunks.push(chunkWords.join(' '));
    index += (targetWordCount - overlapWords);
  }
  return chunks;
};

/**
 * Ingestion Core: Ingests an official government document with full metadata
 */
export const ingestGovernmentDocument = async ({
  sourceId,
  schemeCode,
  schemeName,
  hindiName = '',
  documentType = 'PORTAL_GUIDELINE',
  rawText,
  metadata = {}
}) => {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Document content cannot be empty.');
  }

  // 1. Split document into section chunks
  const textChunks = splitTextIntoChunks(rawText, 120, 20);
  const results = {
    totalChunks: textChunks.length,
    newChunksIndexed: 0,
    unchangedChunksSkipped: 0,
    chunkIds: []
  };

  for (let i = 0; i < textChunks.length; i++) {
    const chunkText = textChunks[i];
    const contentHash = computeContentHash(chunkText);

    // 2. Change Detection: Check if this chunk hash already exists in DB
    const existing = await DocumentChunkRepository.findByContentHash(contentHash);
    if (existing) {
      results.unchangedChunksSkipped++;
      results.chunkIds.push(existing.chunkId);
      continue; // Skip re-embedding!
    }

    // 3. Generate Embedding Vector (768 dimensions)
    const embedding = await generateEmbedding(chunkText);

    // 4. Save Chunk + Vector + Metadata into Database
    const savedChunk = await DocumentChunkRepository.upsertChunk({
      sourceId,
      schemeCode,
      schemeName,
      hindiName,
      sectionTitle: `Section ${i + 1} - ${schemeName}`,
      content: chunkText,
      contentHash,
      embedding,
      metadata: {
        ...metadata,
        documentType,
        lastVerifiedDate: new Date()
      }
    });

    results.newChunksIndexed++;
    results.chunkIds.push(savedChunk.chunkId);
  }

  // 5. Update Source sync status and total count
  const totalCount = await DocumentChunkRepository.count();
  await SourceRepository.updateSyncStatus(sourceId, 'SUCCESS', totalCount);

  return results;
};