import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateOfficialDraftContent } from '../services/geminiService.js';
import { generateOfficialLegalPdf } from '../services/pdfService.js';
import { CaseRepository } from '../models/Case.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, '../generated_docs');

export const generateDraftHandler = async (req, res, next) => {
  try {
    const {
      caseId,
      referenceId,
      draftType = 'CONSUMER_NOTICE',
      applicantName,
      applicantAddress,
      applicantPhone,
      applicantEmail,
      authorityName,
      authorityAddress,
      subject,
      facts,
      prayer,
      legalSections,
      citizenDetails = {},
      grievance = ''
    } = req.body;

    const targetRef = referenceId || caseId;
    let caseData = null;
    if (targetRef) {
      try {
        caseData = await CaseRepository.findByCaseId(targetRef);
      } catch (e) {}
    }

    if (!caseData) {
      caseData = {
        referenceId: targetRef || `NYA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        caseId: targetRef || `NYA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        rawGrievance: facts || grievance || 'Deficiency of Service / Statutory Grievance',
        disputeTitle: subject || 'Citizen Legal Remedy Demand',
        citizen: {
          name: applicantName || citizenDetails.name || 'Citizen Applicant',
          address: applicantAddress || citizenDetails.address || 'Lucknow, Uttar Pradesh, India',
          phone: applicantPhone || citizenDetails.phone || '+91 98765 43210',
          email: applicantEmail || citizenDetails.email || 'citizen@nyayasetu.in'
        },
        facts: {
          counterParty: authorityName || 'Opposite Party',
          monetaryClaim: '₹19,999'
        },
        jurisdiction: {
          authorityName: authorityName || 'District Authority',
          officeAddress: authorityAddress || 'Registered Office'
        }
      };
    }

    const customFields = {
      applicantName,
      applicantAddress,
      applicantPhone,
      applicantEmail,
      authorityName,
      authorityAddress,
      subject,
      facts,
      prayer,
      legalSections
    };

    const draftContent = await generateOfficialDraftContent({
      caseData,
      draftType,
      citizenDetails: caseData.citizen,
      customFields
    });

    const pdfInfo = await generateOfficialLegalPdf({
      draftData: draftContent,
      caseData,
      citizenDetails: caseData.citizen,
      customFields
    });

    const fullDraft = {
      ...draftContent,
      pdfUrl: pdfInfo.downloadUrl,
      fileName: pdfInfo.filename,
      verificationUrl: draftContent.verificationUrl || `https://nyayasetu.gov.in/verify?ref=${draftContent.referenceId}`
    };

    if (caseData._id) {
      try {
        await CaseRepository.findByIdAndUpdate(caseData._id, {
          generatedDraft: fullDraft,
          pdfUrl: pdfInfo.downloadUrl,
          status: 'DRAFT_GENERATED'
        });
      } catch (err) {
        console.warn('Could not update case with draft in db:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      draft: fullDraft,
      data: {
        draft: fullDraft
      },
      pdfInfo
    });
  } catch (error) {
    next(error);
  }
};

export const downloadDraftPdfHandler = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(docsDir, sanitizedFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Document file not found or expired.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};