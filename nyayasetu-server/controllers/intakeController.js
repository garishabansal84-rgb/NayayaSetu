import { diagnoseGrievance, cleanVoiceTranscript, transcribeAudio } from '../services/geminiService.js';
import { CaseRepository } from '../models/Case.js';
import fs from 'fs';

export const transcribeAudioHandler = async (req, res, next) => {
  try {
    let audioBuffer = null;
    let mimeType = 'audio/webm';
    const language = req.body?.language || 'hi';

    if (req.file) {
      audioBuffer = fs.readFileSync(req.file.path);
      mimeType = req.file.mimetype || 'audio/webm';
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    } else if (req.body?.audioBase64) {
      audioBuffer = Buffer.from(req.body.audioBase64, 'base64');
      mimeType = req.body.mimeType || 'audio/webm';
    }

    if (!audioBuffer) {
      return res.status(400).json({ success: false, error: 'No audio stream provided.' });
    }

    const transcript = await transcribeAudio({ audioBuffer, mimeType, language });
    res.status(200).json({
      success: true,
      transcript: transcript || '',
      cleanedTranscript: transcript || ''
    });
  } catch (error) {
    next(error);
  }
};

export const cleanVoiceTranscriptHandler = async (req, res, next) => {
  try {
    const { transcript, text, rawTranscript, language = 'en' } = req.body;
    const input = transcript || text || rawTranscript || '';
    if (!input || !input.trim()) {
      return res.status(200).json({ success: true, cleanedTranscript: '' });
    }
    const cleaned = await cleanVoiceTranscript(input, language);
    res.status(200).json({ success: true, cleanedTranscript: cleaned });
  } catch (error) {
    next(error);
  }
};

export const diagnoseGrievanceHandler = async (req, res, next) => {
  try {
    const {
      grievance,
      rawText,
      rawGrievance,
      language = 'en',
      district = 'lucknow',
      state = 'Uttar Pradesh',
      citizenName,
      phone,
      email,
      citizenInfo = {}
    } = req.body;

    const actualGrievance = grievance || rawText || rawGrievance;

    if (!actualGrievance || actualGrievance.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Grievance description is required.' });
    }

    const mergedCitizenInfo = {
      name: citizenInfo.name || citizenName || 'Anonymous Citizen',
      phone: citizenInfo.phone || phone || '',
      email: citizenInfo.email || email || '',
      address: citizenInfo.address || `${district}, ${state}`
    };

    const diagnosis = await diagnoseGrievance({
      rawGrievance: actualGrievance,
      language,
      district,
      state: state || citizenInfo.state || 'Uttar Pradesh',
      citizenInfo: mergedCitizenInfo
    });

    const now = new Date();
    const registeredAt = now.toISOString();
    const timelineDays = diagnosis.remedy?.timelineDays || diagnosis.statutoryDeadlineDays || 15;
    const deadlineAt = new Date(now.getTime() + (timelineDays * 24 * 60 * 60 * 1000)).toISOString();

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    diagnosis.registeredAt = registeredAt;
    diagnosis.deadlineAt = deadlineAt;
    diagnosis.timelineDays = timelineDays;
    diagnosis.timeline = {
      registeredAt,
      deadlineAt,
      timelineDays,
      timelineHours: timelineDays * 24,
      urgencyLevel: diagnosis.urgencyLevel || (timelineDays <= 2 ? 'CRITICAL' : 'HIGH'),
      dates: {
        registration: formatDate(now),
        noticeService: formatDate(new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)),
        statutoryDeadline: formatDate(new Date(deadlineAt)),
        escalation: formatDate(new Date(new Date(deadlineAt).getTime() + 1 * 24 * 60 * 60 * 1000))
      }
    };

    let newCase = null;
    try {
      newCase = await CaseRepository.create({
        rawGrievance: actualGrievance,
        language,
        citizen: mergedCitizenInfo,
        category: diagnosis.category || 'Consumer Dispute',
        disputeTitle: diagnosis.disputeTitle || 'Citizen Grievance Assessment',
        facts: diagnosis.facts || {},
        legalAnalysis: diagnosis.legalAnalysis || {},
        jurisdiction: diagnosis.jurisdiction || {},
        actionChecklist: diagnosis.actionPlan || diagnosis.actionChecklist || [],
        registeredAt,
        deadlineAt,
        timelineDays
      });
    } catch (err) {
      console.warn('Could not save case in database repository, continuing with memory case:', err.message);
      newCase = {
        caseId: `NYA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        rawGrievance: actualGrievance,
        citizen: mergedCitizenInfo,
        registeredAt,
        deadlineAt,
        timelineDays
      };
    }

    const refId = newCase.caseId || `NYA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    res.status(200).json({
      success: true,
      caseId: refId,
      referenceId: refId,
      registeredAt,
      deadlineAt,
      timelineDays,
      diagnosis,
      data: {
        referenceId: refId,
        registeredAt,
        deadlineAt,
        timelineDays,
        diagnosis
      },
      citizen: mergedCitizenInfo,
      case: newCase
    });
  } catch (error) {
    next(error);
  }
};

export const getCaseDetailsHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const caseRecord = await CaseRepository.findByCaseId(caseId);
    if (!caseRecord) {
      return res.status(404).json({ success: false, error: 'Case reference not found.' });
    }
    res.status(200).json({ success: true, case: caseRecord });
  } catch (error) {
    next(error);
  }
};

export const listCasesHandler = async (req, res, next) => {
  try {
    const cases = await CaseRepository.findAll();
    res.status(200).json({ success: true, count: cases.length, cases });
  } catch (error) {
    next(error);
  }
};

export const simulateOpponentHandler = async (req, res, next) => {
  try {
    const {
      grievance,
      rawText,
      applicableActs,
      evidenceData,
      district = 'Lucknow',
      state = 'Uttar Pradesh',
      language = 'en'
    } = req.body;

    const actualGrievance = grievance || rawText || '';
    const { simulateOpponentDefense } = await import('../services/opponentSimulatorService.js');

    const simulation = await simulateOpponentDefense({
      grievanceText: actualGrievance,
      applicableActs: applicableActs || [],
      evidenceData: evidenceData || null,
      district,
      state,
      language
    });

    res.status(200).json({
      success: true,
      simulation,
      data: simulation
    });
  } catch (error) {
    console.error('Error in simulateOpponentHandler:', error);
    next(error);
  }
};