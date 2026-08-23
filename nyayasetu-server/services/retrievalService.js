import { generateEmbedding } from './embeddingService.js';
import { DocumentChunkRepository } from '../models/DocumentChunk.js';

/**
 * Hybrid Keyword Score calculator
 * Computes BM25-like keyword presence score to complement semantic vector search.
 */
const calculateKeywordScore = (query, content) => {
  const queryTerms = (query || '').toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (queryTerms.length === 0) return 0;
  
  const contentLower = (content || '').toLowerCase();
  let matches = 0;
  for (const term of queryTerms) {
    if (contentLower.includes(term)) matches++;
  }
  return matches / queryTerms.length;
};

/**
 * Hybrid Semantic + Keyword Retrieval Engine
 */
export const retrieveRelevantGovernmentExcerpts = async ({
  query,
  topK = 4,
  filters = {}
}) => {
  if (!query || query.trim().length === 0) {
    throw new Error('Query string is required for retrieval.');
  }

  // 1. Generate Query Embedding (768 dimensions)
  const queryEmbedding = await generateEmbedding(query);

  // 2. Perform Vector Similarity Search + Metadata Pre-filtering
  const vectorResults = await DocumentChunkRepository.searchSimilar({
    queryEmbedding,
    topK: Math.max(topK * 2, 8),
    filter: filters
  });

  // 3. Hybrid Re-ranking: Combine Vector Cosine Score (70%) + Keyword Overlap (30%)
  const hybridRanked = vectorResults.map(({ chunk, score: vectorScore }) => {
    const keywordScore = calculateKeywordScore(query, chunk.content + " " + chunk.schemeName);
    const combinedScore = (vectorScore * 0.7) + (keywordScore * 0.3);

    return {
      chunkId: chunk.chunkId,
      schemeCode: chunk.schemeCode,
      schemeName: chunk.schemeName,
      hindiName: chunk.hindiName,
      sectionTitle: chunk.sectionTitle,
      content: chunk.content,
      vectorScore: parseFloat(vectorScore.toFixed(4)),
      hybridScore: parseFloat(combinedScore.toFixed(4)),
      metadata: chunk.metadata,
      sourceUrl: chunk.metadata?.sourceUrl,
      officialAuthority: chunk.metadata?.officialAuthority,
      requiredDocuments: chunk.metadata?.requiredDocuments || []
    };
  });

  // 4. Sort descending by combined hybrid score and return topK
  hybridRanked.sort((a, b) => b.hybridScore - a.hybridScore);
  return hybridRanked.slice(0, topK);
};