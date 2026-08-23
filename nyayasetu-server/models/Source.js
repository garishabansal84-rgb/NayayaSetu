import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Schema representing an Authoritative Government Source Registry.
 * Tracks official portals, ministries, departments, and sync schedules.
 */
const SourceSchema = new mongoose.Schema(
  {
    sourceId: {
      type: String,
      default: () => `SRC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true // e.g. "Ministry of Health & Family Welfare / National Health Authority"
    },
    authorityType: {
      type: String,
      enum: ['CENTRAL_MINISTRY', 'STATE_DEPARTMENT', 'STATUTORY_BODY', 'OFFICIAL_GAZETTE', 'DISTRICT_COLLECTORATE'],
      default: 'CENTRAL_MINISTRY'
    },
    state: {
      type: String,
      default: 'ALL' // 'ALL' or 'Uttar Pradesh', 'Delhi', etc.
    },
    rootUrl: {
      type: String,
      required: true,
      trim: true
    },
    allowedDomains: [{
      type: String // e.g. ["gov.in", "nic.in", "nha.gov.in"]
    }],
    updateFrequencyHours: {
      type: Number,
      default: 24 // Check for updates every 24 hours
    },
    lastSyncTimestamp: {
      type: Date,
      default: null
    },
    syncStatus: {
      type: String,
      enum: ['IDLE', 'SYNCING', 'SUCCESS', 'FAILED'],
      default: 'IDLE'
    },
    totalDocumentsIndexed: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Fallback in-memory store for offline/local resilience
const inMemorySources = new Map();

let SourceModel;
try {
  SourceModel = mongoose.model('Source', SourceSchema);
} catch (e) {
  SourceModel = mongoose.models.Source;
}

export const SourceRepository = {
  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await SourceModel.create(data);
    }
    const id = uuidv4();
    const sourceId = data.sourceId || `SRC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSource = {
      _id: id,
      sourceId,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalDocumentsIndexed: 0,
      syncStatus: 'IDLE',
      isActive: true,
      ...data
    };
    inMemorySources.set(sourceId, newSource);
    inMemorySources.set(id, newSource);
    return newSource;
  },

  async findBySourceId(sourceId) {
    if (mongoose.connection.readyState === 1) {
      return await SourceModel.findOne({ sourceId });
    }
    return inMemorySources.get(sourceId) || null;
  },

  async findAllActive() {
    if (mongoose.connection.readyState === 1) {
      return await SourceModel.find({ isActive: true });
    }
    return Array.from(new Set(inMemorySources.values())).filter(s => s.isActive);
  },

  async updateSyncStatus(sourceId, status, docCount = null) {
    const update = {
      syncStatus: status,
      lastSyncTimestamp: new Date()
    };
    if (docCount !== null) update.totalDocumentsIndexed = docCount;

    if (mongoose.connection.readyState === 1) {
      return await SourceModel.findOneAndUpdate({ sourceId }, update, { new: true });
    }
    const source = inMemorySources.get(sourceId);
    if (source) {
      Object.assign(source, update, { updatedAt: new Date() });
      return source;
    }
    return null;
  }
};

export default SourceModel;