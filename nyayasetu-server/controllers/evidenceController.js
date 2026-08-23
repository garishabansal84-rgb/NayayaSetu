import fs from 'fs';
import { analyzeEvidenceMultimodal } from '../services/geminiService.js';
import { CaseRepository } from '../models/Case.js';

export const analyzeEvidenceHandler = async (req, res, next) => {
  try {
    const { caseId, userDescription } = req.body;
    const file = req.file;

    let fileBuffer = null;
    let mimeType = 'image/jpeg';
    let filename = 'document.jpg';

    if (file && fs.existsSync(file.path)) {
      fileBuffer = fs.readFileSync(file.path);
      mimeType = file.mimetype;
      filename = file.originalname;
    }

    const analysis = await analyzeEvidenceMultimodal({
      fileBuffer,
      mimeType,
      filename,
      userDescription: userDescription || ''
    });

    const evidenceRecord = {
      originalFilename: filename,
      fileUrl: file ? `/uploads/${file.filename}` : null,
      fileType: mimeType,
      extractedData: analysis.extractedData || {}
    };

    let updatedCase = null;
    if (caseId) {
      try {
        const existingCase = await CaseRepository.findByCaseId(caseId);
        if (existingCase) {
          const evidenceList = existingCase.evidence || [];
          evidenceList.push(evidenceRecord);
          updatedCase = await CaseRepository.findByIdAndUpdate(existingCase._id, {
            evidence: evidenceList,
            status: 'EVIDENCE_COLLECTED'
          });
        }
      } catch (err) {
        console.warn('Could not update case repository with evidence:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ocrResult: analysis.ocrResult || analysis.extractedData,
        extractedData: analysis.extractedData,
        evidence: evidenceRecord
      },
      ocrResult: analysis.ocrResult || analysis.extractedData,
      extractedData: analysis.extractedData,
      evidence: evidenceRecord,
      analysis,
      case: updatedCase
    });
  } catch (error) {
    next(error);
  }
};