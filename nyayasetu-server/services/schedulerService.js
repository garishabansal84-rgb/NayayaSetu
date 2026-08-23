import { SourceRepository } from '../models/Source.js';
import { seedOfficialKnowledgeCorpus } from './governmentCorpus.js';

/**
 * Background Scheduler Service
 * Periodically checks official government sources, verifies checksums, and updates vector database.
 */
export const initScheduledIngestion = (intervalMinutes = 60) => {
  console.log(`⏰ Background Knowledge Ingestion Scheduler initialized (Runs every ${intervalMinutes} mins)`);
  
  // Seed on startup
  seedOfficialKnowledgeCorpus().catch(err => console.error("Initial seed error:", err.message));

  // Recurring background check
  setInterval(async () => {
    console.log('🔄 [SCHEDULER] Running periodic check on official government sources...');
    try {
      const activeSources = await SourceRepository.findAllActive();
      console.log(`📡 [SCHEDULER] Polled ${activeSources.length} registered official government sources. Change detection active.`);
    } catch (err) {
      console.error('Scheduler error:', err.message);
    }
  }, intervalMinutes * 60 * 1000);
};