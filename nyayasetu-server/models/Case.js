import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const CaseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      default: () => `CASE-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      unique: true,
      index: true
    },
    citizen: {
      name: { type: String, default: 'Anonymous Citizen' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' }
    },
    category: {
      type: String,
      default: 'GENERAL'
    },
    disputeTitle: { type: String, default: '' },
    rawGrievance: { type: String, required: true },
    language: { type: String, default: 'en' },
    status: {
      type: String,
      default: 'DIAGNOSED'
    },
    facts: {
      summary: String,
      incidentDate: String,
      monetaryClaim: mongoose.Schema.Types.Mixed,
      counterParty: String,
      disputeLocation: String,
      chronology: [String]
    },
    legalAnalysis: {
      applicableActs: [mongoose.Schema.Types.Mixed],
      statutoryTimelineDays: { type: Number, default: 30 },
      penaltyProvisions: String,
      recommendedStrategy: String
    },
    jurisdiction: {
      authorityName: String,
      designatedOfficer: String,
      department: String,
      officeAddress: String,
      filingPortalUrl: String,
      statutoryRemedyDays: Number
    },
    evidence: [{
      originalFilename: String,
      fileUrl: String,
      fileType: String,
      extractedData: mongoose.Schema.Types.Mixed
    }],
    generatedDraft: {
      draftType: String,
      title: String,
      subject: String,
      paragraphs: [String],
      reliefSought: [String],
      fullMarkdownText: String
    },
    pdfUrl: String
  },
  { timestamps: true }
);

const inMemoryCases = new Map();

let CaseModel;
try {
  CaseModel = mongoose.model('Case', CaseSchema);
} catch (e) {
  CaseModel = mongoose.models.Case;
}

export const CaseRepository = {
  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await CaseModel.create(data);
    }
    const id = uuidv4();
    const caseId = `CASE-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase = {
      _id: id,
      caseId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'DIAGNOSED',
      evidence: [],
      ...data
    };
    inMemoryCases.set(caseId, newCase);
    inMemoryCases.set(id, newCase);
    return newCase;
  },

  async findByCaseId(caseId) {
    if (mongoose.connection.readyState === 1) {
      return await CaseModel.findOne({ caseId });
    }
    return inMemoryCases.get(caseId) || null;
  },

  async findAll() {
    if (mongoose.connection.readyState === 1) {
      return await CaseModel.find().sort({ createdAt: -1 });
    }
    return Array.from(new Set(inMemoryCases.values()));
  },

  async findByIdAndUpdate(id, updateData) {
    if (mongoose.connection.readyState === 1) {
      return await CaseModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    const existing = inMemoryCases.get(id);
    if (existing) {
      Object.assign(existing, updateData, { updatedAt: new Date() });
      return existing;
    }
    return null;
  }
};

export default CaseModel;