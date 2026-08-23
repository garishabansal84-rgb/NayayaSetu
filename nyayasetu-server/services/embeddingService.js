import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    return new GoogleGenerativeAI(apiKey);
  }
  return null;
}

/**
 * Deterministic offline fallback embedding generator (768 dimensions)
 * Used when running offline tests or when API key is pending.
 */
const generateDeterministicFallbackEmbedding = (text) => {
  const dimensions = 768;
  const vector = new Array(dimensions).fill(0);
  const normalized = (text || '').toLowerCase().trim();
  
  // Seed pseudo-random generator with text hash
  let seed = 0;
  for (let i = 0; i < normalized.length; i++) {
    seed = ((seed << 5) - seed) + normalized.charCodeAt(i);
    seed |= 0;
  }

  for (let d = 0; d < dimensions; d++) {
    // Generate pseudo-random float between -1.0 and 1.0
    const x = Math.sin(seed + d) * 10000;
    vector[d] = (x - Math.floor(x)) * 2 - 1;
  }

  // Normalize vector to unit length (Euclidean Norm = 1)
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / norm);
};

/**
 * Generates a 768-dimensional embedding vector for a single text string
 */
export const generateEmbedding = async (text) => {
  if (!text || text.trim().length === 0) {
    throw new Error('Cannot generate embedding for empty text.');
  }

  const genAI = getGenAI();
  if (!genAI) {
    return generateDeterministicFallbackEmbedding(text);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values; // Array of 768 numbers
  } catch (error) {
    console.warn(`⚠️ Embedding API error (${error.message}). Using fallback embedding engine.`);
    return generateDeterministicFallbackEmbedding(text);
  }
};

/**
 * Generates embeddings in batch to optimize network latency
 */
export const generateBatchEmbeddings = async (textArray) => {
  if (!Array.isArray(textArray) || textArray.length === 0) return [];
  
  const embeddings = [];
  for (const text of textArray) {
    const vec = await generateEmbedding(text);
    embeddings.push(vec);
  }
  return embeddings;
};

/**
 * Computes SHA-256 hash of text content for Change Detection
 */
export const computeContentHash = (text) => {
  return crypto.createHash('sha256').update((text || '').trim()).digest('hex');
};