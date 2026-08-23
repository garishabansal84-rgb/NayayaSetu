import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Calculates Cosine Similarity between two numerical vectors.
 * Returns a value between -1.0 (opposite) and 1.0 (identical meaning).
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * DocumentChunk Schema
 * Represents a discrete, searchable paragraph/section of an official government document with its vector embedding.
 */
const DocumentChunkSchema = new mongoose.Schema(
  {
    chunkId: {
      type: String,
      default: () => `CHK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      unique: true,
      index: true
    },
    sourceId: {
      type: String,
      required: true,
      index: true
    },
    schemeCode: {
      type: String,
      required: true,
      index: true // e.g. "PM_JAY", "UP_POST_MATRIC", "RTI_ACT_2005"
    },
    schemeName: {
      type: String,
      required: true
    },
    hindiName: String,
    sectionTitle: {
      type: String,
      default: 'General Provisions'
    },
    content: {
      type: String,
      required: true
    },
    contentHash: {
      type: String,
      required: true,
      index: true // SHA-256 hash to prevent redundant re-embeddings
    },
    embedding: {
      type: [Number],
      required: true // 768-dimensional vector from text-embedding-004
    },
    metadata: {
      sponsoringBody: { type: String, enum: ['CENTRAL', 'STATE', 'JOINT'], default: 'CENTRAL' },
      state: { type: String, default: 'ALL' },
      category: {
        type: String,
        enum: ['HEALTH', 'EDUCATION', 'AGRICULTURE', 'HOUSING', 'WOMEN_CHILD', 'PENSION', 'LABOR', 'CIVIC', 'RTI', 'CONSUMER', 'TENANCY'],
        default: 'CIVIC'
      },
      targetOccupations: [String],
      maxAnnualIncome: Number,
      minAge: Number,
      maxAge: Number,
      allowedCategories: [String], // GEN, OBC, SC, ST, EWS, ALL
      allowedGenders: [String],
      financialAmount: Number,
      requiredDocuments: [String],
      sourceUrl: { type: String, required: true },
      officialAuthority: String,
      documentType: {
        type: String,
        enum: ['PORTAL_GUIDELINE', 'OFFICIAL_GAZETTE', 'CIRCULAR', 'STATUTE_SECTION', 'PDF_BROCHURE'],
        default: 'PORTAL_GUIDELINE'
      },
      lastVerifiedDate: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

// Fallback in-memory vector store
const inMemoryChunks = new Map();

let DocumentChunkModel;
try {
  DocumentChunkModel = mongoose.model('DocumentChunk', DocumentChunkSchema);
} catch (e) {
  DocumentChunkModel = mongoose.models.DocumentChunk;
}

export const DocumentChunkRepository = {
  async upsertChunk(data) {
    if (mongoose.connection.readyState === 1) {
      return await DocumentChunkModel.findOneAndUpdate(
        { contentHash: data.contentHash },
        data,
        { upsert: true, new: true }
      );
    }
    const id = data.contentHash;
    const chunkId = data.chunkId || `CHK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const record = {
      _id: id,
      chunkId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
    inMemoryChunks.set(id, record);
    return record;
  },

  async findByContentHash(contentHash) {
    if (mongoose.connection.readyState === 1) {
      return await DocumentChunkModel.findOne({ contentHash });
    }
    return inMemoryChunks.get(contentHash) || null;
  },

  async searchSimilar({ queryEmbedding, topK = 4, filter = {} }) {
    let allChunks = [];
    if (mongoose.connection.readyState === 1) {
      allChunks = await DocumentChunkModel.find();
    } else {
      allChunks = Array.from(inMemoryChunks.values());
    }

    // Apply metadata pre-filters
    let filtered = allChunks;
    if (filter.state && filter.state !== 'ALL') {
      filtered = filtered.filter(c => !c.metadata?.state || c.metadata?.state === 'ALL' || c.metadata?.state?.toLowerCase() === filter.state.toLowerCase());
    }
    if (filter.domainCategory && filter.domainCategory !== 'ALL') {
      filtered = filtered.filter(c => !c.metadata?.category || c.metadata?.category === filter.domainCategory);
    }
    if (filter.socialCategory && filter.socialCategory !== 'ALL') {
      filtered = filtered.filter(c => !c.metadata?.allowedCategories || c.metadata.allowedCategories.includes('ALL') || c.metadata.allowedCategories.includes(filter.socialCategory));
    }
    if (filter.annualIncome) {
      filtered = filtered.filter(c => !c.metadata?.maxAnnualIncome || filter.annualIncome <= c.metadata.maxAnnualIncome);
    }

    // If filtering eliminated all candidates, gracefully fall back to all chunks
    if (filtered.length === 0) {
      filtered = allChunks;
    }

    // Compute Cosine Similarity between Query Vector and every Chunk Vector
    const scored = filtered.map(chunk => {
      const score = cosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        chunk,
        score
      };
    });

    // Sort by similarity descending (highest score first)
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  },

  async count() {
    if (mongoose.connection.readyState === 1) {
      return await DocumentChunkModel.countDocuments();
    }
    return inMemoryChunks.size;
  },

  async findAll(limit = 50) {
    if (mongoose.connection.readyState === 1) {
      return await DocumentChunkModel.find().limit(limit);
    }
    return Array.from(inMemoryChunks.values()).slice(0, limit);
  }
};

export default DocumentChunkModel;